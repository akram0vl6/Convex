import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./Profil.css";
import Profile from "../../components/ProfilCatigory/Profile";
import HistoryOrder from "../../components/ProfilCatigory/HistoryOrder";
import Promocod from "../../components/ProfilCatigory/Promocod";
import { AiFillProduct } from "react-icons/ai";
import YourProduct from "../../components/ProfilCatigory/YourProduct";
import { VscAccount } from "react-icons/vsc";
import { MdHistory } from "react-icons/md";
import { BiSolidCoupon } from "react-icons/bi";
import { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import SupplierNotifications from "../../components/SupplierNotifications/SupplierNotifications";
import { parseJwt } from "../../helpers/infoUser";

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>();
  const handleLogout = () => {
    // Очищаем localStorage и выполняем любые дополнительные действия, если нужно
    localStorage.clear(); // или localStorage.removeItem("token") для удаления конкретного токена
    navigate("/auth");
    window.location.reload();
  };
  const location = useLocation();

  const token = localStorage.getItem("token");
  const dataFromToken = token ? parseJwt(token) : {};
  console.log(dataFromToken._id);

  useEffect(() => {
    const handlGetUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:4444/api/userinfo/${dataFromToken._id}`
        );

        if (res.ok) {
          console.log("succers");
        } else {
          console.log("error");
        }

        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.log("error", e);
      }
    };

    handlGetUser();
  }, []);

  console.log(user);
  return (
    <div className="profil">
      <div className="profile-nav" data-aos="fade-right">
        <div className="profile-balance">
          <p>Ваш баланс:</p>
          {user ? <h3>{user.balance} тг</h3> : <p>Загрузка...</p>}
          <Link to={"/pay"}>
            <button>Пополнит баланс</button>
          </Link>
        </div>
        <div className="profile-catigory">
          <Link className="link" to="/profil">
            <div
              className={`profile-catigory_item ${
                location.pathname === "/profil" ? "action" : ""
              }`}
            >
              <VscAccount />
              <span>Профиль</span>
            </div>
          </Link>

          <Link className="link" to="/profil/history">
            <div
              className={`profile-catigory_item ${
                location.pathname === "/profil/history" ? "action" : ""
              }`}
            >
              <MdHistory />
              <span>История заказов</span>
            </div>
          </Link>

          <Link className="link" to="/profil/coupon">
            <div
              className={`profile-catigory_item ${
                location.pathname === "/profil/coupon" ? "action" : ""
              }`}
            >
              <BiSolidCoupon />
              <span>Мои промокоды</span>
            </div>
          </Link>
          <Link className="link" to="/profil/yourproduct">
            <div
              className={`profile-catigory_item ${
                location.pathname === "/profil/yourproduct" ? "action" : ""
              }`}
            >
              <AiFillProduct />
              <span>Ваши товары</span>
            </div>
          </Link>
          <Link className="link" to="/profil/notifications">
            <div
              className={`profile-catigory_item ${
                location.pathname === "/profil/notifications" ? "action" : ""
              }`}
            >
              <IoMdNotificationsOutline />
              <span>Уведомления</span>
            </div>
          </Link>
        </div>
        <div className="logaut">
          <button onClick={handleLogout}>Выйты</button>
        </div>
      </div>
      <div data-aos="fade-left">
        <Routes>
          <Route index element={<Profile />} />
          <Route path="history" element={<HistoryOrder />} />
          <Route path="coupon" element={<Promocod />} />
          <Route path="yourproduct" element={<YourProduct />} />
          <Route path="notifications" element={<SupplierNotifications />} />
        </Routes>
      </div>
    </div>
  );
};

export default Profil;
