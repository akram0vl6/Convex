const jwt = require("jsonwebtoken");
const UserModel = require("../Model/UserModel");

  const authMiddleware = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
      console.log("headers:", req.headers);

      if (!token) {
        return res.status(401).json({ message: "Токен не предоставлен" });
      }

      // Расшифровка токена
      const decoded = jwt.verify(token, "SECRET_KEY");

      // Поиск пользователя по id, который хранится в токене
      const user = await UserModel.findById(decoded._id);
      console.log(user)
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Добавляем пользователя в req
      req.user = user;
      next(); // Передаем управление следующему middleware или обработчику
    } catch (e) {
      console.error("Ошибка при проверке токена:", e);
      return res.status(401).json({ message: "Ошибка авторизации" });
    }
  };

module.exports = authMiddleware;
