const { default: mongoose } = require("mongoose");
const OrderModel = require("../Model/OrderModel");
const UserModel = require("../Model/UserModel");

class OrderController {
  // controllers/orderController.js
  async createOrder(req, res) {
    try {
      const {
        createdBy,
        items,
        city,
        address,
        receiver,
        totalPrice,
        totalWeight,
        totalItems,
      } = req.body;

      if (
        !createdBy ||
        !items ||
        !city ||
        !address ||
        !receiver ||
        !totalPrice ||
        !totalItems ||
        !totalWeight
      ) {
        return res.status(400).json({ message: "Неверные данные заказа" });
      }

      const order = await OrderModel.create({
        createdBy, // email поставщика
        items,
        city,
        address,
        receiver,
        totalPrice,
        totalWeight,
        totalItems,
      });

      res.status(201).json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getOrdersBySupplier(req, res) {
    try {
      const { email } = req.params; // Получаем email из параметров

      // Ищем заказы для этого поставщика по email
      const orders = await OrderModel.find({ "createdBy.email": email });

      if (!orders || orders.length === 0) {
        return res
          .status(404)
          .json({ message: "Заказы не найдены для этого поставщика" });
      }

      // Возвращаем найденные заказы
      return res
        .status(200)
        .json({ message: "Заказы успешно получены", orders });
    } catch (err) {
      console.error("OrderController.getOrdersBySupplier:", err);
      return res
        .status(500)
        .json({ message: "Ошибка сервера", error: err.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;

      // Проверка валидности ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Неверный ID заказа." });
      }

      // Поиск и удаление заказа
      const deletedProduct = await OrderModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ message: "заказа не найден." });
      }

      res.status(200).json({ message: "заказа удалён успешно." });
    } catch (e) {
      console.error("Ошибка при удалении заказа:", e);
      res.status(500).json({ message: "Ошибка при удалении заказа." });
    }
  }
}

module.exports = new OrderController();
