import { FetchWrap } from "./fetchWrap.js";
class Favorites {
  #viewApi = new FetchWrap("https://animal-y4xn.onrender.com/public/");
  //#viewApi = new FetchWrap("http://localhost:3000/public/");
  constructor() {
    this.basket = JSON.parse(localStorage.getItem("data")) || [];
    this.products = [];
    this.#main();
  }
  // ! Gets all products from database via api & stores them in this.products array of objects
  #main = () => {
    this.#getProductList()
      .then((response) => {
        this.products = response;
        this.#printProducts();
      })
      .catch((reject) => {
        console.log(reject);
      })
      .finally();
  };
  #getProductList = () => {
    return new Promise((resolve, reject) => {
      this.#viewApi
        .get("api/product/list")
        .then((data) => {
          resolve(data);
        })
        .catch((error) => reject(error))
        .finally();
    });
  };
  // ! Generates the shop html
  #printProducts = () => {
    // ? Filter products that are in the basket with a heart = true > 0
    this.products = this.products.filter(product => this.basket.find(item => item.id === product.id && item.heart));
    // ? Generate the cards html    
    document.querySelector("#container-card").innerHTML = this.products.map(product => {
      const { id, img, name, price, priceType, shortDescription } = product;
      const search = this.basket.find(item => item.id === id) || [];
      return `
        <div id="card-${id}" class="card">
          <div id="card-image" class="card-image">
            <a href="/public/product/${id}">
              <img src="${img}" width="600px" height="400px" alt="${name}" title="${name}" />
            </a>
          </div>
          <div id="card-details" class="card-details">
            <h2 id="product-name" class="product-name">${name}</h2>
            <p id="product-shortDescription" class="product-shortDescription">${shortDescription}</p>
            <p id="product-price" class="product-price">$${price}${priceType}</p>
            <div id="card-controls" class="card-controls">
              <button id="btn-card-heart-${id}" class="btn btn-card-heart" data-id="${id}">
                ${search.heart === true ? `<i class="bi bi-heart-fill"></i>` : `<i class="bi bi-heart"></i>`}
              </button>
              <div>
                <button id="btn-minus-${id}" class="btn btn-minus hidden" data-id="${id}">
                  <i class="bi bi-chevron-double-down"></i>
                </button>
                <span id="quantity-${id}" class="quantity" data-id=${id}>
                  ${search.qty === undefined ? 0 : search.qty}
                </span>
                <button id="btn-plus-${id}" class="btn btn-plus" data-id="${id}">
                  <i class="bi bi-chevron-double-up"></i>
                </button>
              </div>
            </div>
          </div>
        </div>      
      `
    }).join("");
    this.basket.filter(item => item.qty).forEach(item => document
      .querySelector(`#btn-minus-${item.id}`).classList.remove("hidden"));
    this.#updateCartQuantity();
    this.#updateHeartQuantity();
    this.#attachButtons();
    if (!this.basket.filter(item => item.heart).length) this.#emptyFavorites();
  };
  // ! Activates buttons event listeners
  #attachButtons = () => {
    //? Plus Button
    document.querySelectorAll(".btn-plus").forEach(button => {
      button.addEventListener("click", event => {
        this.#plus(`${button.dataset.id}`);
      });
    });
    //? Minus Button
    document.querySelectorAll(".btn-minus").forEach(button => {
      button.addEventListener("click", event => {
        this.#minus(`${button.dataset.id}`);
      });
    });
    //? Heart Button
    document.querySelectorAll(".btn-card-heart").forEach(button => {
      button.addEventListener("click", event => {
        this.#updateCardHeart(`${button.dataset.id}`);
      });
    });
  };
  // ! Increases the selected card quantity by 1
  #plus = id => {
    const search = this.basket.find(item => item.id === id);
    if (search === undefined) {
      this.basket.push({ id, heart: false, qty: 1 });
      document.querySelector(`#btn-minus-${id}`).classList.remove("hidden");
    }
    else { 
      search.qty += 1;
      if (search.qty === 1) document.querySelector(`#btn-minus-${id}`).classList.remove("hidden");
    };
    this.#updateCard(id);
    this.#updateLocalStorage();
  };
  // ! Decreases the selected card quantity by 1
  #minus = id => {
    const search = this.basket.find(item => item.id === id);
    if (search.qty === 1) document.querySelector(`#btn-minus-${id}`).classList.add("hidden");
    search.qty -= 1;
    this.#updateCard(id);
    this.#updateLocalStorage();
  };
  // ! Updates the CARD quantity
  #updateCard = id => {
    const search = this.basket.find(item => item.id === id);
    document.querySelector(`#quantity-${id}`).textContent = search.qty;
    this.#updateCartQuantity();
  };
  // ! Cleans basket and stores it in local storage
  #updateLocalStorage = () => {
    this.basket = this.basket.filter(item => item.qty || item.heart);
    localStorage.setItem("data", JSON.stringify(this.basket));
  };
  // ! Adds up the total number of items in the CART and updates the CART icon
  #updateCartQuantity = () => {
    document.querySelector(`#cart-quantity`).textContent = this.basket
      .map(item => item.qty)
      .reduce((accumulator, current) => accumulator + current, 0);
  };
  // ! Calculates the total quantity of products selected for favorites list and updates the HEART icon
  #updateHeartQuantity = () => {
    document.querySelector(`#heart-quantity`).textContent = this.basket.filter(item => item.heart === true).length;
  };
  // ! Toggles the product CARD heart (true/false)
  #updateCardHeart = id => {
    const search = this.basket.find(item => item.id === id);
    if (search === undefined) {
      this.basket.push({ id, heart: true, qty: 0 });
      document.querySelector(`#btn-card-heart-${id}`).innerHTML = `<i class="bi bi-heart-fill"></i>`;
    } else if (search.heart) {
      search.heart = false;
      document.querySelector(`#btn-card-heart-${id}`).innerHTML = `<i class="bi bi-heart"></i>`;

      document.querySelector(`#card-${id}`).classList.add("remove");
      if (!this.basket.filter(item => item.heart).length) this.#emptyFavorites();

    } else {
      search.heart = true;
      document.querySelector(`#btn-card-heart-${id}`).innerHTML = `<i class="bi bi-heart-fill"></i>`;
    };
    this.#updateHeartQuantity();
    this.#updateLocalStorage();
  };
  #emptyFavorites = () => {
    document.querySelector("#container-card").innerHTML = `
      <p>You don't have any favorites!</p>
    `
  };
}
new Favorites();
