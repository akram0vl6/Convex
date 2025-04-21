import { useEffect, useState } from "react";
import "./ProfileCatigory.css";
import { parseJwt } from "../../helpers/infoUser";
import { useUserProducts } from "../../hooks/useUserProducts";
import { enqueueSnackbar } from "notistack";
import { Product, PromoCode } from "../../helpers/taype";


const Promocod = () => {
  const [activeTab, setActiveTab] = useState("used");
  const [title, setTitle] = useState("");
  const [promoCode, setPromoCode] = useState<PromoCode[]>([]);
  const [discount, setDiscount] = useState<string>('');
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const token = localStorage.getItem("token");
  const tokeninfo = parseJwt(token);
  const { data } = useUserProducts();

  const handleSubmit = async (e : any) => {
    e.preventDefault();

    const numericDiscount = Number(discount);

    if (!title || !discount || !code) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    if (
      isNaN(numericDiscount) ||
      numericDiscount <= 0 ||
      numericDiscount > 100
    ) {
      setError("Процент скидки должен быть числом от 1 до 100");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:4444/api/createPromoCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          title,
          discount,
          supplierId: tokeninfo._id,
          productIds: selectedProducts, // безопасная проверка
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.log("Ошибка сервера:", res.status, errText);
        return;
      }

      const promoData = await res.json();
      setPromoCode((prev) => [...prev, promoData]); // добавим в список
      console.log("Промокод добавлен:", promoData);
      enqueueSnackbar("Промокод добавлен:", { variant: "success" });

      // Очистка полей
      setTitle("");
      setCode("");
      setDiscount("");
    } catch (e) {
      console.log("Ошибка при отправке:", e);
    }
  };

  useEffect(() => {
    const handlGetPromoCode = async () => {
      try {
        const res = await fetch(
          `http://localhost:4444/api/getPromoCode/${tokeninfo._id}`
        );

        const dataProm = await res.json();

        setPromoCode(dataProm);
      } catch (e) {
        console.log("Error", e);
      }
    };
    handlGetPromoCode();
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === data.products.length) {
      setSelectedProducts([]); // Снять выделение со всех
    } else {
      const allIds = data.products.map((product: Product) => product._id);
      setSelectedProducts(allIds); // Выделить все
    }
  };

  const deletePromorCode = async (el: PromoCode) => {
    try {
      const res = await fetch(
        `http://localhost:4444/api/deletePromoCode/${el._id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.log("Ошибка сервера:", res.status, errText);
        return;
      }

      const result = await res.json();
      console.log("Промокод удалён:", result);
      enqueueSnackbar("Промокод удалён:", { variant: "success" });

      // Здесь можно обновить локальный список промокодов (если нужно)
      setPromoCode((prev: any) =>
        prev.filter((promo: any) => promo._id !== el._id)
      );
    } catch (e) {
      console.log("Error", e);
    }
  };

  console.log(promoCode);

  return (
    <div className="promocode">
      <div className="promocode-nav">
        {/* <li
          className={activeTab === "active" ? "active" : ""}
          onClick={() => handleTabClick("active")}
        >
          Активные промокоды
        </li> */}
        <li
          className={activeTab === "used" ? "active" : ""}
          onClick={() => handleTabClick("used")}
        >
          Использованные промокоды
        </li>
        <li
          className={activeTab === "add" ? "active" : ""}
          onClick={() => handleTabClick("add")}
        >
          Добавить промокод
        </li>
      </div>

      <div className="promocode-content">
        {activeTab === "used" && (
          <div className="active-promo">
            {promoCode.map((el: PromoCode, index) => (
              <div key={index} className="active-promo_item">
                <div className="ball"></div>
                <div className="active-promo_item1">
                  <h2>{el.title}</h2>
                </div>
                <div className="active-promo_item2">
                  <h3>Промокод: {el.code}</h3>
                  <p>Использована:{el.count}</p>
                </div>
                <div className="promo-btn">
                  <button onClick={() => deletePromorCode(el)}>Удалить</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "add" && (
          <div className="promoCode-add">
            <div className="add-pormo">
              <h2>Добавить промокод</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="title">Заголовок промокода:</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите заголовок промокода"
                  />
                </div>
                <div>
                  <label htmlFor="code">Код промокода:</label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Введите код промокода"
                  />
                </div>
                <div>
                  <label htmlFor="discount">Процент скидки:</label>
                  <input
                    type="number"
                    id="discount"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Введите процент скидки"
                    min="1"
                    max="100"
                  />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Добавить</button>
              </form>
            </div>
            <div className="add-promo-items">
              <h2>Выберите товары, на которые хотите применить промокод</h2>
              <p onClick={handleSelectAll} className="select-all-btn">
                Выбрать все
              </p>
              {data.products.map((el: Product) => (
                <div className="promo-item" key={el._id}>
                  <div className="promo-item1">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(el._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, el._id]);
                        } else {
                          setSelectedProducts(
                            selectedProducts.filter((id) => id !== el._id)
                          );
                        }
                      }}
                    />
                    <img src={`http://localhost:4444/${el.img}`} alt="" />
                    <h4>{el.title}</h4>
                  </div>
                  <p>{el.price} тг.</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promocod;
