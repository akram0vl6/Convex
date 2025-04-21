const UserModel = require("../Model/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  async registration(req, res) {
    try {
      const { email, name, password } = req.body;
      const candidate = await UserModel.findOne({ email });
      if (candidate) {
        return res.status(400).json({
          message: "Пользователь с таким именем уже существует",
        });
      }

      const hashPassword = bcrypt.hashSync(password, 7);

      const user = new UserModel({
        email,
        name,
        password: hashPassword,
      });

      await user.save();
      const token = jwt.sign({ email, name, _id: user._id }, "SECRET_KEY", {
        expiresIn: "30d",
      });
      return res.json({ token });
    } catch (e) {
      console.log("Error", e);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Ищем пользователя по имени
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь ${email} не найден` });
      }
      console.log(user);
      // Проверяем пароль
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      // Генерируем токен
      const token = jwt.sign(
        { email, name: user.name, _id: user._id },
        "SECRET_KEY",
        {
          expiresIn: "30d",
        }
      );
      return res.json({ token: token, user: user });
    } catch (e) {
      console.log("Error", e);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async update(req, res) {
    try {
      const { id, data } = req.body;

      if (!id || !data) {
        return res.status(400).json({ message: "Не передан id или data" });
      }

      const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      return res.json(updatedUser);
    } catch (e) {
      console.log("error", e);
      return res.status(500).json({ message: "Ошибка при обновлении" });
    }
  }

  async getUserInfo(req, res) {
    try {
      const { id } = req.params; // получаем ID пользователя из параметров запроса

      // Ищем пользователя по ID
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Отправляем информацию о пользователе
      return res.json(user);
    } catch (e) {
      console.log("Ошибка", e);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async addBalans(req, res) {
    try {
      const { id } = req.params; // Извлекаем _id из параметров
      const { amount } = req.body;

      if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: "Сумма должна быть числом" });
      }

      // Ищем пользователя по _id
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Обновляем баланс
      user.balance = (user.balance || 0) + Number(amount);
      await user.save();

      res
        .status(200)
        .json({ message: "Баланс успешно обновлён", balance: user.balance });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
  }

  async minusBalance(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      // Проверка, что amount существует и это число
      if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: "Сумма должна быть числом" });
      }

      // Поиск пользователя по id
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Проверка, что у пользователя достаточно баланса
      if ((user.balance || 0) < Number(amount)) {
        return res.status(400).json({ message: "У вас недостаточно баланса" });
      }

      // Вычитание суммы
      user.balance = (user.balance || 0) - Number(amount);

      // Сохранение изменений
      await user.save();

      res
        .status(200)
        .json({ message: "Баланс уменьшен", balance: user.balance });
    } catch (e) {
      console.error("Ошибка:", e);
      res.status(500).json({ message: "Ошибка сервера", error: e.message });
    }
  }
}

module.exports = new AuthController();
