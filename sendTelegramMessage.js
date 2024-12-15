// Функция для отправки сообщения в Telegram
async function sendTelegramMessage(message) {
   const telegramBotToken = '7873872614:AAEAB8fL-mE2H35xAFhQ-GPJjmmT7NHd8ec';  // Замените на ваш токен
   const chatId = '241858835';  // Замените на ваш chat_id

   const url = `https://api.telegram.org/bot7873872614:AAEAB8fL-mE2H35xAFhQ-GPJjmmT7NHd8ec/sendMessage?chat_id=241858835&text=${encodeURIComponent(message)}`;

   try {
       const response = await fetch(url);
       const json = await response.json();

       if (response.ok) {
           console.log('Message sent:', json);
       } else {
           console.error('Error in response:', json);
       }
   } catch (error) {
       console.error('Error sending message:', error);
   }
}

// Пример использования
sendTelegramMessage('Новый заказ с сайта ресторана: Пицца, 2 шт.');
