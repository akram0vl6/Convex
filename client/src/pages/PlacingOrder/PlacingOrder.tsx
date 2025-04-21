import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./PlacingOrder.css";
import { io } from "socket.io-client";
import { enqueueSnackbar } from "notistack";
import { parseJwt } from "../../helpers/infoUser";

interface OrderItem {
  createdBy: { email: string };
  _id: string;
  price: number;
  quantity: number;
  title: string;
  img: string;
}

const PlacingOrder = () => {
  const [errors, setErrors] = useState({
    city: "",
    address: "",
    receiver: "",
  });

  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [receiver, setReceiver] = useState("");

  const token = localStorage.getItem("token");
  const cart = useSelector((state: any) => state.order.order);

  const totalPrice = cart.reduce(
    (acc: number, item: OrderItem) => acc + item.price * (item.quantity || 1),
    0
  );

  const socket = io("http://localhost:4444");

  const validateForm = () => {
    const newErrors = {
      city: city.trim() ? "" : "Введите город",
      address: address.trim() ? "" : "Введите адрес",
      receiver: receiver.trim() ? "" : "Введите имя получателя",
    };
    setErrors(newErrors);

    return !Object.values(newErrors).some((err) => err);
  };

  const handlePay = async () => {
    if (!token) return alert("Сначала войдите в систему");
    if (!cart.length) return alert("Корзина пуста");

    if (!validateForm()) return; // Если есть ошибки в форме, не продолжаем выполнение

    // Группировка по email поставщика
    const groupedBySupplier: Record<string, OrderItem[]> = {};

    cart.forEach((item: OrderItem) => {
      const supplier = item.createdBy;

      if (!supplier || !supplier.email) {
        // Пропускаем товары без email
        return;
      }

      const email = supplier.email;

      if (!groupedBySupplier[email]) {
        groupedBySupplier[email] = [];
      }

      groupedBySupplier[email].push(item);
    });

    try {
      // Создание заказов для каждого поставщика
      for (const supplierEmail in groupedBySupplier) {
        const items = groupedBySupplier[supplierEmail];

        const supplierTotalPrice = items.reduce(
          (acc, item) => acc + item.price * (item.quantity || 1),
          0
        );
        const supplierTotalWeight = items.reduce(
          (acc, item) => acc + (item.quantity || 1) * 1,
          0
        );
        const supplierTotalItems = items.reduce(
          (acc, item) => acc + (item.quantity || 1),
          0
        );
        console.log(supplierEmail, groupedBySupplier);

        // Отправка заказа для поставщика
        const res = await fetch(
          `http://localhost:4444/api/order/${supplierEmail}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              createdBy: { email: supplierEmail },
              items,
              city,
              address,
              receiver,
              totalPrice: supplierTotalPrice,
              totalWeight: supplierTotalWeight,
              totalItems: supplierTotalItems,
            }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(`Ошибка у ${supplierEmail}: ${err.message}`);
        }

        const now = new Date();
        const formattedDate = `${now.getDate().toString().padStart(2, "0")}.${(
          now.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}.${now.getFullYear().toString().slice(2)} ${now
          .getHours()
          .toString()
          .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

        // Отправка уведомлений для каждого товара отдельно
        items.forEach((item) => {
          console.log("Отправка уведомления на email:", supplierEmail); 
          socket.emit("newOrderNotification", {
            supplierEmail,
            message: `Товар "${item.title.slice(0, 10)}${
              item.title.length > 10 ? "..." : ""
            }" был куплен в количестве: ${item.quantity || 1}`,
            createdAt: formattedDate,
            receiver: receiver,
            product: {
              title: item.title,
              quantity: item.quantity,
              price: item.price,
              img: item.img,
              id: item._id,
            },
          });
        });
        console.log("Отправка уведомлений для поставщика:", supplierEmail); 

        console.log({
          product: {
            title: items[0].title,
            quantity: items[0].quantity,
            price: items[0].price,
            img: items[0].img,
            id: items[0]._id,
          },
        });

        // Начисление средств на баланс поставщика
        const bonusRes = await fetch(
          `http://localhost:4444/api/addBalance/${encodeURIComponent(
            supplierEmail
          )}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: supplierTotalPrice }),
          }
        );
        if (!bonusRes.ok) {
          const err = await bonusRes.json();
          console.warn(
            `Не удалось добавить баланс ${supplierEmail}: ${err.message}`
          );
        }
        console.log("Денги отправлены");
      }
    } catch (e: any) {
      console.error(e);
      return alert("Не удалось оформить заказ: " + e.message);
    }

    try {
      const parsedToken = parseJwt(token);
      const userId = parsedToken?._id;

      if (!userId) return alert("ID пользователя не найден в токене");

      const balanceRes = await fetch(
        `http://localhost:4444/api/minusBlance/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: totalPrice }),
        }
      );

      if (!balanceRes.ok) {
        const err = await balanceRes.json();
        throw new Error("Не удалось уменьшить баланс: " + err.message);
      }
    } catch (e) {
      console.log("Ошибка при уменьшении баланса:", e);
    }

    try {
      // Увеличиваем sold для каждого товара
      for (const item of cart) {
        const res = await fetch(
          `http://localhost:4444/api/increaseSold/${item._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ count: item.quantity || 1 }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          console.warn(
            `Не удалось обновить sold для ${item.title}: ${err.message}`
          );
        }
      }
    } catch (e) {
      console.error("Ошибка при увеличении sold:", e);
    }

    enqueueSnackbar("Заказы успешно оформлены!", { variant: "success" });

    setAddress("");
    setCity("");
    setReceiver("");
    // TODO: Очистить корзину
    // navigate("/orders");
  };

  return (
    <div className="main-placing-orde">
      <div className="placing-order">
        <h1>Оформление заказа</h1>
        <div className="placing-order-input-row">
          <div className="placing-order-input">
            <label>Адрес</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              placeholder="Алматы"
            />
            {errors.city && (
              <div style={{ color: "red", fontSize: "14px" }}>
                {errors.city}
              </div>
            )}
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="ЕЦ-166/4"
            />
            {errors.address && (
              <div style={{ color: "red", fontSize: "14px" }}>
                {errors.address}
              </div>
            )}
            <label>Данные получателя</label>
            <input
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              type="text"
              placeholder="Логин"
            />
            {errors.receiver && (
              <div style={{ color: "red", fontSize: "14px" }}>
                {errors.receiver}
              </div>
            )}
          </div>
        </div>

        <div className="placing-order-total">
          <h3>Итого:</h3>
          <p>{totalPrice} тг.</p>
        </div>
        <div className="placing-order-button">
          <div>
            <button onClick={() => navigate("/pay")}>
              Выбрать вариант оплаты
            </button>
            <p className="or">или</p>
            <button onClick={handlePay}>Купить</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacingOrder;
