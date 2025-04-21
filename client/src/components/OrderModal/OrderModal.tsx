import "./OrderModal.css";
import { useSnackbar } from "notistack";

const OrderModal = ({ onClose, order, onDeliver }: any) => {
  const { enqueueSnackbar } = useSnackbar();

  if (!order || !Array.isArray(order.items)) return null;

  const handlStatus = () => {
    onClose();
    onDeliver(true);

    // Уведомление при успешном изменении статуса заказа
    enqueueSnackbar("Продукт успешно оформлен", {
      variant: "success",
    });
  };

  return (
    <div
      className="modal-backdrop overlay"
      onClick={onClose}
    >
      <div className="oders-modal">
        <div className="modal-window" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>

          <div className="orders-info">
            <h2>Информация о заказе</h2>

            <div className="order-info">
              <div className="order-info1">
                <p>
                  <strong>Город:</strong> {order.city}
                </p>
                <p>
                  <strong>Адрес:</strong> {order.address}
                </p>
              </div>
              <div className="order-info2">
                <p>
                  <strong>Получатель:</strong> {order.receiver}
                </p>
              </div>
            </div>

            <div className="order-time">
              <p>
                <strong>Дата создания:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            {typeof order.totalWeight === "number" && (
              <p>
                <strong>Итоговый вес:</strong> {order.totalWeight} г
              </p>
            )}

            {typeof order.totalPrice === "number" && (
              <p>
                <strong>Сумма заказа:</strong> {order.totalPrice} тг
              </p>
            )}

            <h3 className="h3">Товары в заказе:</h3>
            <div className="modalOrders-products">
              {order.items.map((item: any) => (
                <div className="modalOrders-item" key={item._id}>
                  <img
                    className="modalOrders-img"
                    src={`http://localhost:4444/${item.img}`}
                    alt={item.title}
                  />
                  <div className="modalOrders-item-info">
                    <h5>{item.title}</h5>
                    <p>Цена: {item.price} тг</p>
                    {item.quantity != null && (
                      <p>Количество: {item.quantity}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="total-order-btn" onClick={handlStatus}>
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
