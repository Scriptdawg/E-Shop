const basket = JSON.parse(localStorage.getItem("data"));
if(basket)
document.querySelector(`#cartAmount`).textContent = basket.map((x) => x.qty).reduce((x, y) => x + y, 0);
