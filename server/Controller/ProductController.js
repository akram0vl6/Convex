const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const ProductModel = require("../model/ProductModel.js");

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "images"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

class ProductsController {
  // ⬇ метод для загрузки + сохранения продукта
  async AddProduct(req, res) {
    // Обработка загрузки изображения с помощью multer
    upload.single("img")(req, res, async (err) => {
      if (err) {
        console.error("Ошибка multer:", err);
        return res
          .status(500)
          .json({ message: "Ошибка при загрузке изображения." });
      }

      try {
        const user = req.user; // Получаем пользователя из req.user, если он был добавлен в процессе аутентификации
        const { name, title, price, weight, sold, like } = req.body; // Убираем лишнюю запятую в деструктуризации

        console.log(sold, like); // Проверка значений

        // Проверка, что все поля заполнены
        if (!name || !title || !price || !weight) {
          return res.status(400).json({ message: "Заполните все поля." });
        }

        // Проверка на наличие изображения
        if (!req.file) {
          return res.status(400).json({ message: "Изображение обязательно." });
        }

        // Путь к изображению
        const imgPath = `/images/${req.file.filename}`;
        const likeValue = Number(req.body.like) || 0;
        const soldValue = Number(req.body.sold) || 0;

        // Создаём новый продукт
        const newProduct = new ProductModel({
          name,
          title,
          price,
          weight,
          like: likeValue,
          sold: soldValue,
          img: imgPath,
          createdBy: user,
        });

        // Сохраняем продукт в базе данных
        await newProduct.save();
        console.log(newProduct.createdBy); // Логируем информацию о создателе

        // Отправляем ответ с успешным добавлением
        res.status(201).json({
          message: "Продукт успешно добавлен",
          product: newProduct,
        });
      } catch (e) {
        console.error("Ошибка при сохранении продукта:", e);
        res.status(500).json({ message: "Ошибка при добавлении продукта." });
      }
    });
  }

  async getProducts(req, res) {
    try {
      const product = await ProductModel.find();

      res.status(200).json(product);
    } catch (e) {
      console.log("error", e);
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      // Проверка валидности ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Неверный ID продукта." });
      }

      // Поиск и удаление продукта
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ message: "Продукт не найден." });
      }

      res.status(200).json({ message: "Продукт удалён успешно." });
    } catch (e) {
      console.error("Ошибка при удалении продукта:", e);
      res.status(500).json({ message: "Ошибка при удалении продукта." });
    }
  }

  async likeProduct(req, res) {
    try {
      // Найдем продукт по ID
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Продукт не найден" });
      }

      // Увеличиваем количество лайков
      product.like = (product.like || 0) + 1;
      await product.save();

      // Отправляем обновленный продукт
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при лайке продукта" });
    }
  }

  async soldProduct(req, res) {
    try {
      const { count } = req.body;
      const product = await ProductModel.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Продукт не найден" });
      }

      product.sold = (product.sold || 0) + Number(count);
      await product.save();

      res.json(product);
    } catch (e) {
      console.log("error", e);
      res.status(500).json({ message: "Ошибка при увеличении sold" });
    }
  }
}

module.exports = new ProductsController();
