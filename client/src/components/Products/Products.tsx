import { useState, useEffect } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { addOrder } from "../../store/Slice/orderSlice";
import { handleMinus, handlePlus } from "../../helpers/cartCalculations";
import { FaHeart } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import { Product } from "../../helpers/taype";

import AOS from "aos";
import "aos/dist/aos.css";


const Products = ({ count }: any) => {
  const [likes, setLikes] = useState({});
  const [products, setProducts] = useState([]);
  const [countB, setCountB] = useState({}); // локальное состояние для переключателя "В корзину"
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 800, // длительность анимации
       // анимация только при первом скролле
    });
  }, []);


  const toggleLike = (productId: string) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [productId]: !prevLikes[productId], // переключаем true/false
    }));
  };

  // Достаем корзину из Redux
  const orderItems = useSelector((state: any) => state.order.order);

  const handlAddOrder = (el: Product) => {
    dispatch(addOrder(el));
    setCountB((prev) => ({
      ...prev,
      [el._id]: true,
    }));
    enqueueSnackbar(`Товар добавлен в корзину.`, { variant: "success" });
  };

  // Получаем количество из заказа, если товар добавлен
  const getQuantity = (product: Product) => {
    const cartItem = orderItems.find((item: Product) => item._id === product._id);
    return cartItem ? cartItem.quantity : 1;
  };

  const handleLikeClick = async (productId: string) => {
    try {
      const res = await fetch(
        `http://localhost:4444/api/products/${productId}/like`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();

      console.log(data);
    } catch (error) {
      console.error("Ошибка при лайке:", error);
    }
  };

  useEffect(() => {
    const handlProducts = async () => {
      try {
        const res = await fetch("http://localhost:4444/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.log("error", e);
      }
    };

    handlProducts();
  }, []);

  return (
    <div className="products">
      {products.length > 0
        ? products.slice(0, count).map((product: Product) => (
            <div
              data-aos="zoom-out"
              className="products-item"
              key={product._id}
            >
              <div
                className="product-like"
                onClick={() => toggleLike(product._id)}
              >
                <FaHeart
                  onClick={() => handleLikeClick(product._id)}
                  className={
                    likes[product._id] ? "action-like" : "no-action-like"
                  }
                />
              </div>

              <img src={`http://localhost:4444/${product.img}`} alt="" />
              <h3>{product.name}</h3>
              <span>{product.title}</span>
              <p>Вес: {product.weight}гр</p>
              <div>
                <div className="product-user">
                  <p>
                    Имя поставшика: {product.createdBy?.name || "Неизвестный"}
                  </p>
                </div>
              </div>
              <div className="priceAndBtn">
                <p>{product.price} тг.</p>
                {!countB[product._id] ? (
                  <button
                    className="btn-card"
                    onClick={() => handlAddOrder(product)}
                  >
                    В корзину
                  </button>
                ) : (
                  <div className="bascet-count bascet-count-product">
                    <button onClick={() => handlePlus(dispatch, product._id)}>
                      +
                    </button>
                    <h4>{getQuantity(product) || 1}</h4>
                    <button onClick={() => handleMinus(dispatch, product._id)}>
                      -
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        : "Загрузка..."}
    </div>
  );
};

export default Products;
