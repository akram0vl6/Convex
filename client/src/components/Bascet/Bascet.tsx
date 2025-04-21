import { useSelector, useDispatch } from "react-redux";
import { deleteOrder, clearOrder } from "../../store/Slice/orderSlice";
import {
  calculateTotalWeight,
  calculateTotalItems,
  handlePlus,
  handleMinus,
} from "../../helpers/cartCalculations";
import "./Bascet.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Product } from "../../helpers/taype";

const Bascet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state: any) => state.order.order as Product[]);
  const [isModal, setIsModal] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [discountTotal, setDiscountTotal] = useState(0);
  const [discountedItemsMap, setDiscountedItemsMap] = useState<
    Record<string, number>
  >({});

  const totalItems = calculateTotalItems(cart);
  const totalWeight = calculateTotalWeight(cart);
  const deliveryCost = 2000;
  const promoUsed = discountTotal > 0;

  // Группировка товаров по поставщику
  const itemsBySupplier = cart.reduce<Record<string, Product[]>>((acc, item: any) => {
    const supplier = item.createdBy;

    // Пропускаем, если поставщика нет или у него нет email
    if (!supplier || !supplier.email) return acc;

    const supplierId = supplier.email;

    if (!acc[supplierId]) acc[supplierId] = [];
    acc[supplierId].push(item);

    return acc;
  }, {});

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const finalPrice = totalPrice - discountTotal + deliveryCost;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      enqueueSnackbar("Введите промокод", { variant: "warning" });
      return;
    }

    let allDiscountTotal = 0;
    const allDiscountedMap: Record<string, number> = {};

    for (const supplierId of Object.keys(itemsBySupplier)) {
      const items = itemsBySupplier[supplierId].map((it: Product) => ({
        productId: it._id,
        price: it.price,
        quantity: it.quantity || 1,
      }));

      try {
        const res = await fetch("http://localhost:4444/api/applyPromoCode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: promoInput,
            supplierId,
            items,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          enqueueSnackbar(err.message, { variant: "error" });
          continue;
        }

        const data = await res.json();
        enqueueSnackbar(data.message, { variant: "success" });

        allDiscountTotal += data.discountTotal;

        data.discountedItems.forEach((di: any) => {
          allDiscountedMap[di.productId] = di.price;
        });
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Ошибка при применении промокода", {
          variant: "error",
        });
      }
    }

    setDiscountTotal(allDiscountTotal);
    setDiscountedItemsMap(allDiscountedMap);
    setIsModal(false);
  };

  const handleDeleteOrder = (id: string) => {
    dispatch(deleteOrder(id));
  };

  const handleClearCart = () => {
    dispatch(clearOrder());
  };

  return (
    <div className="bascet">
      <div className="bascet1">
        <div className="bascet1-title">
          <h1>Корзина</h1>
          <p
            onClick={handleClearCart}
            style={{ cursor: "pointer", color: "red" }}
          >
            Очистить корзину
          </p>
        </div>

        <div className="bascet-row">
          {cart.map((el: Product) => {
            const discountedPrice = discountedItemsMap[el._id] || el.price;
            const totalProductPrice = discountedPrice * (el.quantity || 1);

            return (
              <div className="bascet-item" key={el._id}>
                <img
                  className="img"
                  src={`http://localhost:4444/${el.img}`}
                  alt=""
                />
                <div className="bascet-item_title">
                  <p>
                    {el.name.length > 25
                      ? el.name.slice(0, 25) + "..."
                      : el.name}
                  </p>
                  <p>{el.weight}</p>
                  <span>{el.title}</span>
                </div>
                <div className="bascet-count">
                  <button onClick={() => handlePlus(dispatch, el._id)}>
                    +
                  </button>
                  <h4>{el.quantity || 1}</h4>
                  <button onClick={() => handleMinus(dispatch, el._id)}>
                    -
                  </button>
                </div>
                <div className="bascet-price">
                  <h3>{totalProductPrice} тг.</h3>
                  <p>{discountedPrice} тг./шт.</p>
                </div>
                <img
                  onClick={() => handleDeleteOrder(el._id)}
                  className="bascet-img-close"
                  src="/assets/icons/Plus.png"
                  alt="Удалить"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="bascet2">
        <button onClick={() => navigate("/placing/order")}>
          Оформить заказ
        </button>
        <button onClick={() => setIsModal(true)}>Использовать промокод</button>
        <div className="place">
          <div className="place-item">
            <p>Количество единиц:</p>
            <p>{totalItems}</p>
          </div>
          <div className="place-item">
            <p>Итоговый вес:</p>
            <p>{totalWeight} г.</p>
          </div>
          <div className="place-item">
            <p>Тип заказа:</p>
            <p>бандероль</p>
          </div>
          <div className="place-item">
            <p>Сумма заказа:</p>
            <p>{totalPrice} тг.</p>
          </div>
          {promoUsed && (
            <div className="place-item">
              <p>Промокод:</p>
              <p style={{ color: "#EE4029" }}>- {discountTotal} тг.</p>
            </div>
          )}
          <div className="place-item">
            <p>Cтоимость доставки</p>
            <p>{deliveryCost} тг.</p>
          </div>
        </div>
        <div className="total">
          <h3>Итого:</h3>
          <p>{finalPrice} тг.</p>
        </div>
      </div>

      {isModal && (
        <>
          <div className="overlay" onClick={() => setIsModal(false)}></div>
          <div className="modal-promo">
            <div className="modal-promo_title">
              <img
                onClick={() => setIsModal(false)}
                className="modal-promo-close"
                src="/assets/icons/Plus.png"
                alt=""
              />
              <h4>Промокод</h4>
            </div>
            <div className="modal-promo-input">
              <label>Введите промокод</label>
              <input
                type="text"
                placeholder="ХХХХ"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button className="modal-promo-btn" onClick={handleApplyPromo}>
                Отправить
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Bascet;
