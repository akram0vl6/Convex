
import "./Pay.css";
import { enqueueSnackbar } from "notistack";
// socket.js
import { io } from "socket.io-client";
import { parseJwt } from "../../helpers/infoUser";
export const socket = io("http://localhost:4444");




const Pay = () => {


  const token = localStorage.getItem("token");
  const dataFromToken = token ? parseJwt(token) : {};
  const supplierEmail = dataFromToken.email
  console.log(dataFromToken._id);

  const handleInputAlert = async () => {
    const amount = window.prompt("Введите сумму пополнения:");

    if (!amount || isNaN(Number(amount))) {
      enqueueSnackbar(`Пожалуйста, введите корректную сумму`, {
        variant: "error",
      });
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4444/api/addBalans/${dataFromToken._id}/balanc`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        }
      );

      // Проверка, если сервер не вернул успешный ответ
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Ошибка на сервере:", errorData);
        return;
      }

      // Если ответ сервера успешный
      const data = await res.json();

      socket.emit("sendNotification", {
        supplierEmail,
        message: `Баланс пополнен! Новый баланс: ${data.balance}`,
      });

      enqueueSnackbar(`Баланс пополнен на ${amount} тг.`, {
        variant: "success",
      });
    } catch (e) {
      // Обработка сетевых ошибок и ошибок соединения
      console.error("Ошибка при соединении с сервером:", e);
      enqueueSnackbar(`Произошла ошибка при соединении с сервером`, {
        variant: "error",
      });
    }
  };

  return (
    <div className="pay">
      <h1>Выберите способ оплаты</h1>
      <div className="pay-row">
        <div className="pay-item">
          <div className="img-gap">
            <img src="/assets/Pay/pay1.svg" alt="" />
            <img src="/assets/Pay/pay2.png" alt="" />
          </div>
          <p>Банковские карты Visa, MasterCard, American Express</p>
        </div>
        <div className="pay-item">
          <img src="/assets/Pay/pay3.png" alt="" />
          <p>Терминалы Касса24</p>
        </div>
        <div className="pay-item">
          <img src="/assets/Pay/pay4.png" alt="" />
          <p>Интернет банкинг АТФ24</p>
        </div>
        <div className="pay-item">
          <img src="/assets/Pay/pay5.png" alt="" />
          <p>Интернет Банкинг AlfaBank</p>
        </div>
        <div className="pay-item">
          <img src="/assets/Pay/pay6.png" alt="" />
          <p>Интернет Банкинг RBK банк</p>
        </div>
        <div className="pay-item">
          <img src="/assets/Pay/pay7.png" alt="" />
          <p>Интернет Банкинг Евразийский</p>
        </div>
        <div className="pay-item">
          <img src="/assets/Pay/Sberbank (Сбербанк).svg" alt="" />
          <p>Интернет Банкинг Сбербанк Казахстан</p>
        </div>
        <div className="pay-item">
          <img src="/assets/Pay/Qiwi.svg" alt="" />
          <p>Кошелек Qiwi</p>
        </div>
        <div className="pay-item">
          <img src="/assets/Pay/American.png" alt="" />
          <p>Банковские карты Visa, MasterCard, American Express</p>
        </div>
      </div>

      <button onClick={handleInputAlert}>Пополнит баланс</button>
    </div>
  );
};

export default Pay;
