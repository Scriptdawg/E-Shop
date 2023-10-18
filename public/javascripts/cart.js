import { FetchWrap } from "./fetchWrap.js";
class Cart {
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
  // ! Filters the api data and generates the cart html
  #printProducts = () => {
    // ? Filter products that are in the basket with a quantity > 0
    this.products = this.products.filter(product => this.basket.find(item => item.id === product.id && item.qty));
    // ? Generate the cards html
    document.querySelector("#container-card").innerHTML = this.products.map(product => {
      const { id, img, name, price, priceType } = product;
      const search = this.basket.find(item => item.id === id) || [];
      return `
      <div id="card-${id}" class="package">
        <div id="image" class="image">
          <img src="${img}" width="600px" height="400px" alt="${name}" title="${name}" />
        </div>
        <div id="amount" class="amount">
          <p id="product-price" class="product-price">$${price}</p>
        </div>
        <div id="subtotal" class="subtotal">
          <button id="btn-card-heart-${id}" class="btn btn-card-heart" data-id="${id}">
            ${search.heart === true ? `<i class="bi bi-heart-fill"></i>` : `<i class="bi bi-heart"></i>`}
          </button>
          <p>$<span id="card-subtotal-${id}" class="card-subtotal">${price * search.qty}</span></p>
        </div>
        <div id="name" class="name">
          <h2 id="product-name" class="product-name">${name}</h2>
        </div>

        <button id="remove-card-${id}" class="btn btn-remove-card" data-id="${id}">Remove</button>
        
        <div id="card-controls" class="control">
          <span>Qty:</span>
          <span id="quantity-buttons" class="quantity-buttons">
            <button id="btn-minus-${id}" class="btn btn-minus" data-id="${id}">
              <i class="bi bi-chevron-double-down"></i>
            </button>
            <span id="quantity-${id}" class="quantity" data-id=${id}>
              ${search.qty === undefined ? 0 : search.qty}
            </span>
            <button id="btn-plus-${id}" class="btn btn-plus" data-id="${id}">
              <i class="bi bi-chevron-double-up"></i>
            </button>
          </span>
        </div>
        
      </div>   
      `
      
    }).join("");
    this.basket.filter(item => item.qty === 1).forEach(item => document
      .querySelector(`#btn-minus-${item.id}`).classList.add("hidden"));
    if (!this.products.length) this.#printEmptyCart();
    this.#updateCartQuantity();
    this.#updateHeartQuantity();
    this.#updateTotalAmount();
    this.#attachButtons();
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
    // ? Remove Card Button
    document.querySelectorAll(".btn-remove-card").forEach(button => {
      button.addEventListener("click", event => {
        this.#removeCard(`${button.dataset.id}`);
      });
    });
    // ? Clear Cart Button - remove all items from the cart
    document.querySelector("#clear-cart").addEventListener("click", event => {
      this.#clearCart();
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
    search.qty += 1;
    if (search.qty === 2) document.querySelector(`#btn-minus-${id}`).classList.remove("hidden");
    this.#updateCard(id);
    this.#updateLocalStorage();
    this.#updateTotalAmount();
  };
  // ! Decreases the selected card quantity by 1
  #minus = id => {
    const search = this.basket.find(item => item.id === id);
    if (search.qty === 2) document.querySelector(`#btn-minus-${id}`).classList.add("hidden");
    search.qty -= 1;
    this.#updateCard(id);
    this.#updateLocalStorage();
    this.#updateTotalAmount();
  };
  // ! Updates the CARD quantity and subtotal
  #updateCard = id => {
    const search = this.basket.find(item => item.id === id);
    document.querySelector(`#quantity-${id}`).textContent = search.qty;
    const query = this.products.find(product => product.id === search.id);
    document.querySelector(`#card-subtotal-${id}`).textContent = search.qty * query.price;
    this.#updateCartQuantity();
  };
  // ! Removes card from view, sets quantity to zero, prints empty state if no more cards
  #removeCard = id => {
    document.querySelector(`#card-${id}`).classList.add("hide");
    this.basket.find(item => item.id === id).qty = 0;
    this.#updateCartQuantity();
    this.#updateLocalStorage();
    this.#updateTotalAmount();
    if (!this.basket.filter(item => item.qty).length) this.#printEmptyCart();
  };
  // ! Sets the qty of all items in the cart to zero and removes items not in favorites
  #clearCart = () => {
    this.basket.forEach(item => item.qty = 0);
    this.#printEmptyCart();
    this.#updateCartQuantity();
    this.#updateLocalStorage();
    this.#updateTotalAmount();
  };
  // ! Cleans basket and stores it in local storage
  #updateLocalStorage = () => {
    this.basket = this.basket.filter(item => item.qty || item.heart);
    localStorage.setItem("data", JSON.stringify(this.basket));
  };
  // ! Prints empty cart
  #printEmptyCart = () => {
    document.querySelector("#container-card").innerHTML = `
      <div id="empty-cart" class="empty-cart">
        <i class="bi bi-cart-x-fill"></i>
        <p>Shopping Cart is Empty</p>
        <p>Get started by <a href="/public">browsing our products</a> or pick items from <a href="">your favorites list</a>.</p>
      </div>
    `;
    document.querySelector("#clear-cart").classList.add("remove");
    document.querySelector("#checkout").classList.add("remove");
  };
  // ! Adds up the total number of products and items in the CART and updates the ledger
  #updateCartQuantity = () => {
    document.querySelector(`#cart-quantity`).textContent = this.basket
      .map(item => item.qty)
      .reduce((accumulator, current) => accumulator + current, 0);
    document.querySelector(`#cart-products`).textContent = this.basket
      .filter(item => item.qty).length;
  };
  // ! Calculates total cost of all items in cart and updates the ledger
  #updateTotalAmount = () => {
    if (this.basket.length === 0) return;
    document.querySelector("#total-amount").textContent = this.basket.filter(item => item.qty !== 0)
      .map(item => this.products.find(product => product.id === item.id).price * item.qty)
      .reduce((accumulator, current) => accumulator + current, 0);
  };
  // ! Calculates the total quantity of products selected for favorites list and updates the HEART icon
  #updateHeartQuantity = () => {
    document.querySelector(`#heart-quantity`).textContent = this.basket.filter(item => item.heart === true).length;
  };
  // ! Toggles the product CARD heart (true/false)
  #updateCardHeart = id => {
    const search = this.basket.find(item => item.id === id);
    if (search.heart) {
      search.heart = false;
      document.querySelector(`#btn-card-heart-${id}`).innerHTML = `<i class="bi bi-heart"></i>`;
    } else {
      search.heart = true;
      document.querySelector(`#btn-card-heart-${id}`).innerHTML = `<i class="bi bi-heart-fill"></i>`;
    };
    this.#updateHeartQuantity();
    this.#updateLocalStorage();
  };
};
new Cart();
