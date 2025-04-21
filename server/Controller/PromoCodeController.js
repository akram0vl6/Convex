const PromoCodeModel = require("../Model/PromoCodeModel");

class PromoCodeController {
  async addPromo(req, res) {
    const { code, title, discount, supplierId, productIds, expiryDate } =
      req.body;

    try {
      // Проверка, не существует ли уже промокод с таким кодом
      const existingPromo = await PromoCodeModel.findOne({ code });
      if (existingPromo) {
        return res
          .status(400)
          .json({ message: "Этот промокод уже существует" });
      }

      // Создание нового промокода
      const newPromoCode = new PromoCodeModel({
        code,
        title,
        discount,
        supplierId,
        productIds,
        expiryDate,
        count: 0,
      });

      // Сохранение промокода в базу данных
      await newPromoCode.save();

      res
        .status(201)
        .json({ message: "Промокод успешно создан", promoCode: newPromoCode });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Произошла ошибка при создании промокода" });
    }
  }

  async applyPromo(req, res) {
    const { code, supplierId, items } = req.body;
    console.log(code, supplierId, items);
    
    try {
      // 1) Найти код
      const promo = await PromoCodeModel.findOne({ code });
      if (!promo) return res.status(404).json({ message: "Код не найден" });

      // 2) Проверки
      if (promo.isUsed)
        return res.status(400).json({ message: "Код уже использован" });
      //   if (promo.expiryDate < new Date())
      //     return res.status(400).json({ message: "Код истёк" });

      // 3) Пересчитать цены
      // Пример вычисления общей скидки
      let discountTotal = 0;
      const discountedItems = items.map((item) => {
        if (promo.productIds.some((id) => id.toString() === item.productId)) {
          const perItemDisc = Math.round(item.price * (promo.discount / 100)); // Рассчитываем скидку на один товар
          discountTotal += perItemDisc * item.quantity; // Суммируем скидки по всем товарам
          return {
            ...item,
            originalPrice: item.price,
            price: item.price - perItemDisc, // Применяем скидку к цене товара
          };
        }
        return item;
      });

      promo.count += 1;
      await promo.save(); // Не забудьте сохранить изменения в базе данных

      res.json({
        message: `Скидка ${promo.discount}% применена`,
        discountedItems,
        discountTotal, // Теперь discountTotal должно содержать правильную сумму
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getPromor(req, res) {
    try {
      const supplierId = req.params.id; // получаем ID из параметров маршрута

      if (!supplierId) {
        return res.status(400).json({ message: "Не указан ID поставщика" });
      }

      // Предположим, что у тебя есть модель PromoCode
      const promoCodes = await PromoCodeModel.find({ supplierId });

      res.status(200).json(promoCodes);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка при получении промокодов" });
    }
  }

  async deletePromo(req, res) {
    try {
      const { _id } = req.params;

      if (!_id) {
        return res.status(400).json({ message: "Не указан ID промокода" });
      }

      const deletedPromo = await PromoCodeModel.findByIdAndDelete(_id);

      if (!deletedPromo) {
        return res.status(404).json({ message: "Промокод не найден" });
      }

      res.status(200).json({ message: "Промокод удалён", promo: deletedPromo });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка при удалении промокода" });
    }
  }
}

module.exports = new PromoCodeController();
