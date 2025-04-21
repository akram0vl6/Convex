import { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  console.log(formData);
  const handelLogin = async () => {
    try {
      const res = await fetch("http://localhost:4444/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        console.log("Успешный логин", data);
        localStorage.setItem("token", data.token); // JWT токен
        // можно, например, сохранить токен и перенаправить
        navigate("/profil");
      } else {
        // Ошибка со стороны сервера (например, 400, 401, 500 и т.д.)
        setError(data.message || "Неизвестная ошибка");
      }
    } catch (e) {
      // Ошибка на клиенте (например, сервер не отвечает, проблемы с сетью)
      console.log("Ошибка соединения:", e);
    }
  };
  return (
    <div className="login">
      <div className="login-modal">
        <div className="logo-row">
          <div className="logo-title">
            <img src="/assets/Logo.png" alt="" />
            <div className="logo-btn">
              <span>Назад на главную</span>
              <img
                src="/assets/icons/Plus-fff.png"
                alt=""
                onClick={() => navigate("/")}
              />
            </div>
          </div>
          <div className="logo-auth">
            <h1>Вход</h1>
            <div className="logo-input">
              <label>Email</label>
              <input
                type="email"
                placeholder="Введите вашу почту"
                name="email"
                // value={email}
                onChange={handleChange}
              />
              <label>Пароль</label>
              <input
                type="password"
                placeholder="Введите пароль"
                // value={password}
                name="password"
                onChange={handleChange}
              />
            </div>
            <p style={{ color: "red" }}>{error}</p>
            <div className="auth-btn">
              <button onClick={handelLogin}>Войти</button>
              <p>или</p>

              <button onClick={() => navigate("/auth/register")}>
                Зарегистрироваться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
