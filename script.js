document.addEventListener('DOMContentLoaded', () => {
  // Загружаем корзину из localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Обработчик кнопок добавления блюд в корзину на странице меню (menu.html)
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const dishElement = event.target.closest('.dish');
      const dishId = dishElement.dataset.id;
      const dishName = dishElement.dataset.name;
      const dishPrice = parseFloat(dishElement.dataset.price);

      addToCart(dishId, dishName, dishPrice);  // Добавляем товар в корзину
    });
  });

  // Функция добавления товара в корзину
  function addToCart(dishId, dishName, dishPrice) {
    const existingDish = cart.find(item => item.dishId === dishId);

    if (existingDish) {
      existingDish.quantity += 1;  // Если товар уже есть, увеличиваем его количество
    } else {
      const newDish = {
        dishId,
        dishName,
        dishPrice,
        quantity: 1
      };
      cart.push(newDish);  // Добавляем новый товар в корзину
    }

    localStorage.setItem('cart', JSON.stringify(cart));  // Сохраняем корзину в localStorage
    alert(`${dishName} добавлено в корзину!`);  // Уведомление при добавлении товара в корзину
  }

  // Обновляем корзину на странице оформления заказа (order.html)
  if (document.getElementById('cart-container')) {
    updateCartDisplay(cart);  // Если на странице есть контейнер корзины
  }

  // Функция обновления корзины на странице оформления заказа (order.html)
  function updateCartDisplay(cart) {
    const cartContainer = document.getElementById('cart-container');
    const totalContainer = document.getElementById('cart-total');

    cartContainer.innerHTML = ''; // Очищаем корзину

    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Корзина пуста.</p>';
      totalContainer.innerHTML = 'Итого: 0 руб.';
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      const price = item.dishPrice * item.quantity;
      total += price;

      cartItem.innerHTML = `
        <span>${item.dishName} - ${item.dishPrice} руб. x${item.quantity}</span>
        <button class="remove-item" data-index="${index}">Удалить</button>
      `;

      cartContainer.appendChild(cartItem);
    });

    totalContainer.innerHTML = `Итого: ${total} руб.`;

    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach((button) => {
      button.addEventListener('click', (event) => {
        const index = event.target.dataset.index;
        removeItemFromCart(index);
      });
    });
  }

  // Функция удаления товара из корзины
  function removeItemFromCart(index) {
    cart.splice(index, 1);  // Удаляем товар по индексу
    localStorage.setItem('cart', JSON.stringify(cart));  // Обновляем localStorage
    updateCartDisplay(cart);  // Обновляем отображение корзины
  }

  // Обработчик отправки формы
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();  // Предотвращаем стандартное поведение формы

      const customerName = document.getElementById('name').value;
      const customerPhone = document.getElementById('phone').value;
      const customerAddress = document.getElementById('address').value;

      const orderDetails = {
        customerName,
        customerPhone,
        customerAddress,
        items: cart
      };

      // Отправляем данные на сервер
      sendOrderToServer(orderDetails);
    });
  }

  // Функция отправки данных на сервер
  function sendOrderToServer(orderDetails) {
    fetch('/send-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderDetails)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Ваш заказ оформлен!');  // Уведомление
          localStorage.removeItem('cart');  // Очищаем корзину
          updateCartDisplay([]);  // Очищаем отображение корзины
          orderForm.reset();  // Очищаем форму
        } else {
          alert('Ошибка оформления заказа. Попробуйте позже.');
        }
      })
      .catch(error => {
        console.error('Ошибка при отправке:', error);
        alert('Ошибка оформления заказа. Попробуйте позже.');
      });
  }
});
