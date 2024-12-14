let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const dishId = event.target.closest('.dish').dataset.id;
      addToCart(dishId);
    });
  });

  document.getElementById('order-form').addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Ваш заказ оформлен!');
  });
});

function addToCart(dishId) {
  cart.push(dishId);
  alert('Блюдо добавлено в корзину!');
}