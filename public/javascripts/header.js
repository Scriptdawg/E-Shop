const basket = JSON.parse(localStorage.getItem("data"));

if (basket[0]) {
  document.querySelector(`#cartAmount`).textContent = basket.map((x) => Number.parseInt(x.qty, 10)).reduce((x, y) => x + y, 0);
};
