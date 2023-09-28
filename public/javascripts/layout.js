const mainDiv = document.querySelector("#layout-insert-js");
// mainDiv.innerHTML = "Client side javascript (layout.js).";
// mainDiv.style = "font-style: italic; color: brown;";

const basket = JSON.parse(localStorage.getItem("data"));

if (basket) {
  document.querySelector(`#cartAmount`).textContent = basket.map((x) => Number.parseInt(x.qty, 10)).reduce((x, y) => x + y, 0);
};
