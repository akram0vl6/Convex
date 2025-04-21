import { useEffect, useState } from "react";
import "./ProfileCatigory.css";
import OrderModal from "../OrderModal/OrderModal";
import { enqueueSnackbar } from "notistack";

interface Order {
  _id: string;
  city: string;
  address: string;
  receiver: string;
  status: string;
  createdAt: string;
  totalWeight: number;
  totalPrice: number;
  totalItems: number;
  items: any[];
}

const HistoryOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModal, setIsModal] = useState(false);

  const token = localStorage.getItem("token");
  const dataFromToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userEmail = dataFromToken?.email;
    console.log(token);
    
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userEmail) return;
      try {
        const res = await fetch(`http://localhost:4444/api/order/${userEmail}`);
        if (!res.ok) throw new Error("Ошибка при получении заказов");
        const { orders } = await res.json();
        setOrders(orders);
        // инициализируем статусы
        setStatuses(
          orders.reduce((acc: any, o: any) => {
            acc[o._id] = o.status === "delivered";
            return acc;
          }, {} as Record<string, boolean>)
        );
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrders();
  }, [userEmail]);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
    setSelectedOrder(null);
  };

  const handleDeliver = (orderId: string) => {
    setStatuses((prev) => ({ ...prev, [orderId]: true }));
    closeModal();
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const aDone = statuses[a._id];
    const bDone = statuses[b._id];
    return aDone === bDone ? 0 : aDone ? 1 : -1;
  });

  if (!sortedOrders.length) {
    return <p className="empty-order">Загрузка...</p>;
  }

  const handlDelete = async (_id: string) => {
    try {
      const res = await fetch(`http://localhost:4444/api/order/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Ошибка при удалении");
      }

      // Удаляем заказ из состояния
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== _id)
      );

      // Также можно удалить из statuses, если нужно
      setStatuses((prevStatuses) => {
        const newStatuses = { ...prevStatuses };
        delete newStatuses[_id];
        return newStatuses;
      });

      // Уведомление через Snackbar
      enqueueSnackbar("Заказ успешно удалён", { variant: "success" });

      console.log("Заказ успешно удален");
    } catch (e) {
      console.log("Ошибка при удалении:", e);
    }
  };  

  return (
    <div className="historyOrder">
      {sortedOrders.map((el) => (
        <div className="historyOrder-item" key={el._id}>
          <div className="historyOrder-item_title">
            <h1>№{el._id.slice(-6)}</h1>
            <div className="historyOrder-btn">
              <p
                className={`status ${
                  statuses[el._id] ? "delivered" : "pending"
                }`}
              >
                {statuses[el._id] ? "Доставлено" : "Не доставлено"}
              </p>
              <button onClick={() => handlDelete(el._id)}>Удалить</button>
            </div>
          </div>
          <div className="oreder-info">
            <div>
              <p>
                <strong>Дата заявки:</strong>{" "}
                {new Date(el.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Итоговый вес:</strong> {el.totalWeight} г
              </p>
            </div>
            <div>
              <p>
                <strong>Сумма заказа:</strong> {el.totalPrice} тг
              </p>
              <p>
                <strong>Количество единиц:</strong> {el.totalItems} шт
              </p>
            </div>
          </div>
          <h5 onClick={() => openModal(el)}>Посмотреть детализацию доставки</h5>
        </div>
      ))}

      {isModal && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={closeModal}
          onDeliver={() => handleDeliver(selectedOrder._id)}
        />
      )}
    </div>
  );
};

export default HistoryOrder;
