import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSnackbar } from "notistack";
import "./SupplierNotifications.css";
import { parseJwt } from "../../helpers/infoUser";

const token = localStorage.getItem("token");
const dataFromToken = token ? parseJwt(token) : {};

const SupplierNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeInfoIndex, setActiveInfoIndex] = useState<number | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const socket = io("http://localhost:4444");

    const SUPPLIER_EMAIL = dataFromToken?.email;
    socket.emit("register", SUPPLIER_EMAIL);
    console.log("Отправка события register с email:", SUPPLIER_EMAIL);

    socket.on("newOrderNotification", (message) => {
      setNotifications((prev) => [...prev, message]);
      enqueueSnackbar(message.message, { variant: "success" });

      new Audio("/mp3/iphone.mp3").play().catch(console.warn);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  console.log(notifications);

  return (
    <div className="notifications">
      <h1>Уведомления для поставщика</h1>
      <ul>
        {notifications.map((el, index) => {
          const isActive = activeInfoIndex === index;
          return (
            <li key={index} className="notifications-item-row">
              <div className="notifications-item">
                <div className="notifications-item-title">
                  <div className="ball" />
                  <h3>{el.message}</h3>
                </div>
                <div className="notifications-item-info">
                  <p>{el.createdAt}</p>
                  <img
                    className={isActive ? "toggle-icon rotated" : "toggle-icon"}
                    src="/assets/icons/Color.png"
                    alt="Подробнее"
                    onClick={() => setActiveInfoIndex(isActive ? null : index)}
                  />
                </div>
              </div>
              {/* Плавное раскрытие */}
              <div className={isActive ? "info expanded" : "info"}>
                <div className="info-product">
                  <img
                    src={`http://localhost:4444${el.product.img}`}
                    alt={el.product.title}
                  />
                  <div>
                    <h4>{el.product.title}</h4>
                    <span>
                      <strong>Покупател:</strong>
                      {el.receiver}
                    </span>
                  </div>
                  <p> {el.product.price} тг.</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => {
          const audio = new Audio("/mp3/iphone.mp3");
          audio.play().catch(console.warn);
        }}
      >
        Проверить звук
      </button>
    </div>
  );
};

export default SupplierNotifications;
