import { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  calculateTotalWeight,
  calculateTotalItems,
} from "../../helpers/cartCalculations";

import { parseJwt } from "../../helpers/infoUser";
import { Product } from "../../helpers/taype";

export const useTotalWeight = () => {
  const order = useSelector((state: any) => state.order.order as Product[]);
  return order.reduce((sum, item) => sum + (item.weight || 0), 0);
};



const Header = () => {
  // const [authModal, setAuthModal] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const [formData, setFormData] = useState({ name: "" });

  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // можно

  useEffect(() => {
    if (token) {
      const parsed = parseJwt(token);
      if (parsed?.name) {
        setFormData((prev) => ({
          ...prev,
          name: parsed.name,
          email: parsed.email || "",
        }));
      }
    }
  }, [token]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selector = useSelector((state: any) => state.order.order);

  return (
    <>
      <div className="header">
        <section className="section1" data-aos="fade-down">
          <div className="section1-row">
            <Link to={"/"}>
              <img src="/assets/Logo.png" alt="" />
            </Link>
            <div className="section1-title">
              <p>Бесплатный звонок</p>
              <a>8 800 080 5011</a>
            </div>
          </div>
          <div className="section1-input">
            <span className="input-icon">
              <img src="/assets/icons/Search.png" alt="поиск" />
            </span>
            <input
              className="section1_input"
              type="text"
              placeholder="Поиск товаров"
            />
          </div>

          <div className="section-adres">
            <div className="location-row">
              <div className="location">
                <img src="/assets/icons/Location.png" alt="" />
                <p>ЕЦ-166/4</p>
              </div>
              <span>Нур-Султан</span>
            </div>
            <div className="section1-btn">
              <div className="section1-btn-name">
                {formData.name ? (
                  <Link className="link" to={"/profil"}>
                    <p>{formData.name}</p>
                  </Link>
                ) : (
                  <button onClick={() => navigate("/auth")}>Войти</button>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="section2">
          <nav className={`navbar ${isFixed ? "fixed-navbar" : ""}`}>
            <ul className="menu">
              <li className="li dropdown">
                <a href="#">Продукты</a>
                <img className="li-img" src="/assets/icons/Color.png" alt="" />
                <ul className="submenu">
                  <li>
                    <a href="#">Фрукты</a>
                  </li>
                  <li>
                    <a href="#">Овощи</a>
                  </li>
                  <li>
                    <a href="#">Молочные продукты</a>
                  </li>
                </ul>
              </li>
              <li className="li dropdown">
                <a href="#">Еда быстрого приготовления</a>
                <img className="li-img" src="/assets/icons/Color.png" alt="" />
                <ul className="submenu">
                  <li>
                    <a href="#">Супы</a>
                  </li>
                  <li>
                    <a href="#">Лапша</a>
                  </li>
                  <li>
                    <a href="#">Пюре</a>
                  </li>
                </ul>
              </li>

              <li className="li dropdown">
                <a href="#">Консервы</a>
                <img className="li-img" src="/assets/icons/Color.png" alt="" />
                <ul className="submenu">
                  <li>
                    <a href="#">Овощные</a>
                  </li>
                  <li>
                    <a href="#">Мясные</a>
                  </li>
                  <li>
                    <a href="#">Рыбные</a>
                  </li>
                </ul>
              </li>

              <li className="li dropdown">
                <a href="#">Напитки</a>
                <img className="li-img" src="/assets/icons/Color.png" alt="" />
                <ul className="submenu">
                  <li>
                    <a href="#">Соки</a>
                  </li>
                  <li>
                    <a href="#">Вода</a>
                  </li>
                  <li>
                    <a href="#">Газировка</a>
                  </li>
                </ul>
              </li>

              <li className="li dropdown">
                <a href="#">Бытовая химия</a>
                <img className="li-img" src="/assets/icons/Color.png" alt="" />
                <ul className="submenu">
                  <li>
                    <a href="#">Для кухни</a>
                  </li>
                  <li>
                    <a href="#">Для ванной</a>
                  </li>
                  <li>
                    <a href="#">Порошки</a>
                  </li>
                </ul>
              </li>

              <li className="li dropdown">
                <a href="#">Уход за собой</a>
                <img className="li-img" src="/assets/icons/Color.png" alt="" />
                <ul className="submenu">
                  <li>
                    <a href="#">Шампуни</a>
                  </li>
                  <li>
                    <a href="#">Мыло</a>
                  </li>
                  <li>
                    <a href="#">Зубные пасты</a>
                  </li>
                </ul>
              </li>

              <li className="li dropdown">
                <a href="#">Еще</a>
                <img className="li-img" src="/assets/icons/Color.png" alt="" />
                <ul className="submenu">
                  <li>
                    <a href="#">Акции</a>
                  </li>
                  <li>
                    <a href="#">Новинки</a>
                  </li>
                  <li>
                    <a href="#">Скоро в продаже</a>
                  </li>
                </ul>
              </li>

              <Link className="link" to={"/bascet"}>
                <div className="cart">
                  <img src="/assets/icons/cart.png" alt="" />
                  <div className="cart-title">
                    <p>Корзина</p>
                    <span>{calculateTotalWeight(selector)} г</span>
                  </div>
                  <h3>{calculateTotalItems(selector)}</h3>
                </div>
              </Link>
            </ul>
          </nav>
        </section>
      </div>
    </>
  );
};

export default Header;
