const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
const port = 3000;

// Получаем значения из .env
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!TELEGRAM_TOKEN || !CHAT_ID) {
  console.error('Ошибка: необходимо задать TELEGRAM_TOKEN и CHAT_ID в файле .env');
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для получения данных заказа
app.post('/send-order', async (req, res) => {
  try {
    console.log('Получен запрос с данными:', req.body);  // Логируем полученные данные

    const { customerName, customerPhone, customerAddress, items } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Ошибка: недостающие данные.' });
    }

    let orderMessage = `<b>Новый заказ:</b>\n`;
    orderMessage += `<b>Имя:</b> ${customerName}\n`;
    orderMessage += `<b>Телефон:</b> ${customerPhone}\n`;
    orderMessage += `<b>Адрес:</b> ${customerAddress}\n\n`;
    orderMessage += `<b>Товары:</b>\n`;

    let totalAmount = 0;
    items.forEach(item => {
      orderMessage += `${item.dishName} - ${item.dishPrice} руб. x${item.quantity}\n`;
      totalAmount += item.dishPrice * item.quantity;
    });

    orderMessage += `\n<b>Итого:</b> ${totalAmount} руб.`;

    console.log('Сообщение для отправки в Telegram:', orderMessage);  // Логируем сообщение для Telegram

    await sendTelegramMessage(orderMessage);
    res.json({ success: true, message: 'Заказ отправлен в Telegram.' });
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error);
    res.status(500).json({ success: false, message: 'Ошибка при отправке заказа в Telegram.' });
  }
});

// Функция отправки сообщения в Telegram
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const body = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'HTML',
  };

  console.log('Отправка сообщения в Telegram:', body);  // Логируем запрос

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Ошибка при отправке в Telegram:', errorDetails);
      throw new Error(`Ошибка отправки сообщения в Telegram: ${errorDetails}`);
    }

    const data = await response.json();
    console.log('Ответ от Telegram:', data);  // Логируем ответ от Telegram

  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
