import "./Error.css";
import { Link } from "react-router-dom";
const Error = () => {
  return (
    <div className="error-page">
      <div className="error-page-title">
        <h2>Упс, что-то пошло не так</h2>
        <p>Мы не можем найти страницу, которую вы ищете</p>
        <Link className="link" to={"/"}>
          <button>Вернуться на главную</button>
        </Link>
      </div>
      <img src="/assets/Error.png" alt="" />
    </div>
  );
};

export default Error;
