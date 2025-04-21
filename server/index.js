const express = require("express");
const mongoose = require("mongoose");
const router = require("./router/router");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const PORT = 4444;
const URL =
  "mongodb+srv://diyor:akramov.06@cluster0.lpwfrbu.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0";

const app = express();

// Создаём HTTP сервер для WebSocket
const server = http.createServer(app);

// Настроим WebSocket сервер с использованием socket.io
const io = socketIo(server, {
  cors: {
    origin: "*", // Разрешаем все источники для CORS
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
app.use("/api", router);
app.use(express.static(path.join(__dirname, "public")));

// Обработчик WebSocket-соединений
const socketClients = {}; // Объект для хранения сокетов по email

io.on("connection", (socket) => {
  console.log("Новый клиент подключился");
  // Регистрация клиента с email
  socket.on("register", (email) => {
    socketClients[email] = socket;
    console.log(`Клиент с email ${email} подключен`);
  });

  // Отправка уведомлений о заказах
  socket.on("newOrderNotification", (message) => {
    console.log("Сообщение от клиента:", message);

    const { supplierEmail } = message; // Получаем email поставщика из сообщения
    if (socketClients[supplierEmail]) {
      // Отправка уведомления конкретному поставщику
      socketClients[supplierEmail].emit("newOrderNotification", message);
      console.log(`Уведомление отправлено на email ${supplierEmail}`);
    } else {
      console.warn(`Нет клиента с email ${supplierEmail}`);
    }
  });

  // Отключение клиента
  socket.on("disconnect", () => {
    for (const email in socketClients) {
      if (socketClients[email] === socket) {
        delete socketClients[email]; // Удаляем сокет при отключении клиента
        console.log(`Клиент с email ${email} отключился`);
      }
    }
  });
});



const start = async () => {
  try {
    await mongoose.connect(URL);
    console.log("DB connected");

    // Запускаем HTTP сервер
    server.listen(PORT, () => {
      console.log(`Сервер работает на порту ${PORT}`);
    });
  } catch (err) {
    console.error("DB error", err);
  }
};

start();

// Экспортируем сервер
module.exports = app;
