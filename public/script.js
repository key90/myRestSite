document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Обработчик добавления в корзину на странице меню
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', event => {
      const dishElement = event.target.closest('.dish');
      const dishId = dishElement.dataset.id;
      const dishName = dishElement.dataset.name;
      const dishPrice = parseFloat(dishElement.dataset.price);

      addToCart(dishId, dishName, dishPrice);
    });
  });

  function addToCart(dishId, dishName, dishPrice) {
    const existingDish = cart.find(item => item.dishId === dishId);

    if (existingDish) {
      existingDish.quantity += 1;
    } else {
      cart.push({ dishId, dishName, dishPrice, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${dishName} добавлено в корзину!`);
  }

  if (document.getElementById('cart-container')) {
    updateCartDisplay();
  }

  function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    const totalContainer = document.getElementById('cart-total');

    cartContainer.innerHTML = '';
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Корзина пуста.</p>';
      totalContainer.textContent = 'Итого: 0 руб.';
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
    totalContainer.textContent = `Итого: ${total} руб.`;

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', event => {
        const index = event.target.dataset.index;
        removeItemFromCart(index);
      });
    });
  }

  function removeItemFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
  }

  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', async event => {
      event.preventDefault();

      const customerName = document.getElementById('name').value;
      const customerPhone = document.getElementById('phone').value;
      const customerAddress = document.getElementById('address').value;

      if (!customerName || !customerPhone || !customerAddress || cart.length === 0) {
        alert('Пожалуйста, заполните все поля и добавьте товары в корзину.');
        return;
      }

      const orderDetails = { customerName, customerPhone, customerAddress, items: cart };

      console.log('Отправляем данные на сервер:', orderDetails);  // Логируем отправляемые данные

      try {
        const response = await fetch('http://localhost:3000/send-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderDetails)
        });

        const data = await response.json();

        if (data.success) {
          alert('Ваш заказ успешно оформлен!');
          localStorage.removeItem('cart');
          updateCartDisplay();
          orderForm.reset();
        } else {
          alert('Ошибка оформления заказа: ' + data.message);
        }
      } catch (error) {
        console.error('Ошибка при отправке:', error);
        alert(`Ошибка при отправке заказа: ${error.message}`);
      }
    });
  }
});
