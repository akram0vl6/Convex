const express = require("express");
const AuthController = require("../Controller/AuthController");
const ProductController = require("../Controller/ProductController");
const authMiddleware = require("../Middleware/authMiddleware");
const ProductModel = require("../Model/ProductModel");
const OrderController = require("../Controller/OrderController");
const { default: mongoose } = require("mongoose");
const UserModel = require("../Model/UserModel");
const PromoCodeController = require("../Controller/PromoCodeController");

const router = express.Router();

router.get("/products", ProductController.getProducts);
router.get("/userinfo/:id", AuthController.getUserInfo);
router.get("/userProducts", authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email; // Получаем email пользователя из токена
    console.log("User email from token:", userEmail);

    const products = await ProductModel.find({
      "createdBy.email": userEmail, // Поиск по email пользователя
    });

    res.json({ products });
  } catch (e) {
    console.error("Ошибка при получении товаров:", e);
    res.status(500).json({ message: "Ошибка при получении товаров." });
  }
});

router.get("/order/:email", OrderController.getOrdersBySupplier);
router.get('/getPromoCode/:id', PromoCodeController.getPromor)

router.post("/registration", AuthController.registration);
router.post("/login", AuthController.login);
router.post("/newProduct", authMiddleware, ProductController.AddProduct);
router.post("/order/:email", OrderController.createOrder);
router.post("/createPromoCode", PromoCodeController.addPromo);
router.post("/applyPromoCode", PromoCodeController.applyPromo);

router.put("/ubdate/", AuthController.update);
router.put("/addBalans/:id/balanc", AuthController.addBalans);
router.put("/products/:id/like", ProductController.likeProduct);
router.put("/minusBlance/:id", AuthController.minusBalance);
router.put("/increaseSold/:id", ProductController.soldProduct);
// PUT /api/addBalance/:email
// body: { amount: number }
router.put("/addBalance/:email", async (req, res) => {
  const { email } = req.params;
  const { amount } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "Поставщик не найден" });
  user.balance = (user.balance || 0) + amount;
  await user.save();
  return res.json({ balance: user.balance });
});

router.delete("/products/:id", ProductController.deleteProduct);
router.delete("/order/:id", OrderController.deleteOrder);
router.delete('/deletePromoCode/:_id', PromoCodeController.deletePromo)

module.exports = router;
