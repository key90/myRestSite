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






<script>
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Предотвращаем стандартное отправление формы

    const formData = new FormData(this);

    fetch('/submit_form', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert("Спасибо за ваше сообщение!");
    })
    .catch(error => {
        alert("Произошла ошибка. Пожалуйста, попробуйте позже.");
    });
});
</script>
