import { useEffect, useState } from "react";
import "./ProfileCatigory.css";
import { useSnackbar } from "notistack";
import { parseJwt } from "../../helpers/infoUser";



const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    surname: "",
    birthdate: "",
    email: "",
    name: "",
    phone: "",
    gender: "",
  });

  // Получаем токен и расшифровываем его каждый раз при монтировании или изменении
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = parseJwt(token);
      if (data) {
        setFormData((prev) => ({
          ...prev,
          email: data.email || prev.email,
          name: data.name || prev.name,
        }));
      }
    }
    // Если у вас есть сохранённые в localStorage пользовательские поля (по кнопке "Сохранить"),
    // то можно их тоже подгрузить:
    const saved = localStorage.getItem("user");
    if (saved) {
      setFormData((prev) => ({
        ...prev,
        ...JSON.parse(saved),
      }));
    }
  }, []); // пустой массив — только при первом рендере

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(formData));
    enqueueSnackbar("Данные сохранены!", { variant: "success" });
  };

  return (
    <div className="profile">
      <h1>Ваш профиль</h1>
      <div className="profil-input">
        <div className="profil-input1">
          <label>Фамилия</label>
          <input
            type="text"
            name="surname"
            placeholder="Введите фамилию"
            value={formData.surname}
            onChange={handleChange}
          />

          <label>Дата рождения</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Введите вашу почту"
            value={formData.email}
            onChange={handleChange}
            disabled // обычно email не редактируется вручную
          />
        </div>
        <div className="profil-input2">
          <label>Имя</label>
          <input
            type="text"
            name="name"
            placeholder="Введите имя"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Мобильный телефон</label>
          <input
            type="text"
            name="phone"
            placeholder="Введите ваш номер телефона"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Пол</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Выберите</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>
      </div>
      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};

export default Profile;
