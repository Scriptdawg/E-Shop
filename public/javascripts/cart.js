import { FetchWrap } from "./fetchWrap.js";
class Cart {
  //#viewApi = new FetchWrap("https://animal-y4xn.onrender.com/public/");
  #viewApi = new FetchWrap("http://localhost:3000/public/");
  constructor() {
    document.querySelector("#center-link").classList.add("hidden");
    this.picks = JSON.parse(localStorage.getItem("data")) || [];
    this.products = [];
    this.view = [];
    this.#getProducts();
  }
  // Gets all products from database via api
  #getProducts = () => {
    this.#getProductList()
      .then((response) => {
        this.#main(response);
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
  // Main
  #main = (data) => {
    this.products = data;
    this.view = this.products.filter(product => this.picks.find(pick => pick.id === product.id && pick.qty));
    this.#updateCartQuantity().#updateHeartQuantity().#updateTotalAmount().#printProducts();
    this.picks.filter(pick => pick.qty === 1).forEach(pick => document
      .querySelector(`#btn-minus-${pick.id}`).classList.add("hidden"));
  }
  //  Filters the api data and generates the packages html
  #printProducts = () => {
    if (!this.view.length) {
      this.#printEmptyState();
      return;
    }
    document.querySelector("#packages").innerHTML = this.view.map(product => {
      const { id, img, name, price } = product;
      const search = this.picks.find(pick => pick.id === id) || [];
      return `
        <div id="package-${id}" class="package" title="Package">
          <div class="picture">
            <img src="${img}" width="70px" height="70px" alt="${name}" title="${name}" />
          </div>
          <div class="cost">
            <span title="Price">$${Number.parseInt(price, 10).toFixed(2)}</span>
          </div>
          <div class="info">
            <button id="btn-heart-${id}" class="btn-plain btn-heart" data-id="${id}" title="Toggle Favorite">
              ${search.heart === true ? `<i class="bi bi-heart-fill"></i>` : `<i class="bi bi-heart"></i>`}
            </button>
            <span id="subtotal-${id}" class="subtotal" title="Subtotal">$${(price * (search.qty === undefined ? 0 : search.qty)).toFixed(2)}</span>
          </div>
          <div class="term">
            <h2 class="title large" title="Product Name">${name}</h2>
          </div>
          <div class="left-ctrl">
            <button id="btn-clear-${id}" class="btn btn-clear" data-id="${id}" title="Set quantity to zero!">Clear</button>
          </div>  
          <div class="right-ctrl">
            <button id="btn-minus-${id}" class="btn btn-minus" data-id="${id}" title="Decrease Quantity">
              <i class="bi bi-chevron-double-down"></i>
            </button>
            <span id="qty-${id}" class="qty" data-id=${id} title="Quantity">
              ${search.qty === undefined ? 0 : search.qty}
            </span>
            <button id="btn-plus-${id}" class="btn btn-plus" data-id="${id}" title="Increase Quantity">
              <i class="bi bi-chevron-double-up"></i>
            </button>
          </div>
        </div>
      `
    }).join("");
    this.#attachButtons();
    return this;
  };
  // Activates buttons event listeners
  #attachButtons = () => {
    //? Plus Buttons
    document.querySelectorAll(".btn-plus").forEach(button => {
      button.addEventListener("click", () => {
        if (this.#plus(button.dataset.id) === 2)
          document.querySelector(`#btn-minus-${button.dataset.id}`).classList.remove("hidden");
        this.#updatePackage(button.dataset.id).#updateLocalStorage().#updateTotalAmount();
      });
    });
    //? Minus Buttons
    document.querySelectorAll(".btn-minus").forEach(button => {
      button.addEventListener("click", () => {
        if (this.#minus(button.dataset.id) === 1)
          document.querySelector(`#btn-minus-${button.dataset.id}`).classList.add("hidden");
        this.#updatePackage(button.dataset.id).#updateLocalStorage().#updateTotalAmount();
      });
    });
    // ? Clear Buttons
    document.querySelectorAll(".btn-clear").forEach(button => {
      button.textContent = "Remove";
      button.addEventListener("click", () => {
        this.#clearPackage(button.dataset.id);
        this.#updatePackage(button.dataset.id).#updateLocalStorage().#updateTotalAmount();
        document.querySelector(`#package-${button.dataset.id}`).classList.add("hide");
        if (!this.picks.filter(pick => pick.qty).length) this.#printEmptyState();
      });
    });
    // ? Clear Cart Button - remove all packages from the cart
    document.querySelector("#btn-clear-cart").addEventListener("click", () => {
      this.#clearCart().#updateCartQuantity().#updateLocalStorage().#updateTotalAmount();
    });
    //? Heart Buttons
    document.querySelectorAll(".btn-heart").forEach(button => {
      button.addEventListener("click", () => {
        this.#updatePackageHeart(button.dataset.id).#updateHeartQuantity().#updateLocalStorage();
      });
    });
  };
  // Increases the selected package qty by 1
  #plus = id => {
    const search = this.picks.find(pick => pick.id === id);
    if (search === undefined) this.picks.push({ id, heart: false, qty: 1 });
    else search.qty += 1;
    return search ? search.qty : false;
  };
  // Decreases the selected package qty by 1
  #minus = id => {
    const search = this.picks.find(pick => pick.id === id);
    if (search === undefined || !search.qty) return;
    search.qty -= 1;
    return search.qty;
  };
  // Updates the package qty and subtotal
  #updatePackage = id => {
    const search = this.picks.find(pick => pick.id === id);
    document.querySelector(`#qty-${id}`).textContent = search.qty;
    const query = this.products.find(product => product.id === search.id);
    document.querySelector(`#subtotal-${id}`).textContent = `$${(search.qty * query.price).toFixed(2)}`;
    this.#updateCartQuantity();
    return this;
  };
  // Sets qty to zero
  #clearPackage = id => {
    this.picks.find(pick => pick.id === id).qty = 0;
  };
  // Sets the qty of all picks to zero
  #clearCart = () => {
    this.picks.forEach(pick => pick.qty = 0);
    this.#printEmptyState();
    return this;
  };
  // Cleans picks and stores it in local storage
  #updateLocalStorage = () => {
    this.picks = this.picks.filter(pick => pick.qty || pick.heart);
    localStorage.setItem("data", JSON.stringify(this.picks));
    return this;
  };
  // Prints empty state
  #printEmptyState = () => {
    document.querySelector("#packages").innerHTML = `
      <div id="empty-cart" class="empty-cart">
        <i class="bi bi-cart-x-fill"></i>
        <p>Shopping Cart is Empty</p>
        <p>
          Get started by <a class="link" href="/public">browsing our products</a>
          or pick products from <a class="link" href="/public/favorites">your favorites list.</a>
        </p>
      </div>
    `;
    document.querySelector("#btn-clear-cart").classList.add("remove");
    document.querySelector("#checkout").classList.add("remove");
  };
  // Totals number of products and items in the cart and updates the ledger
  #updateCartQuantity = () => {
    document.querySelector(`#cart-quantity`).textContent = this.picks
      .map(pick => pick.qty)
      .reduce((accumulator, current) => accumulator + current, 0);
    document.querySelector(`#cart-products`).textContent = this.picks
      .filter(pick => pick.qty).length;
    return this;
  };
  // Calculates total cost of all picks in cart and updates the ledger
  #updateTotalAmount = () => {
    if (!this.picks.length) {
      document.querySelector("#total-amount").textContent = "0.00";
      return this;
    }
    document.querySelector("#total-amount").textContent = this.picks.filter(pick => pick.qty)
      .map(pick => this.products.find(product => product.id === pick.id).price * pick.qty)
      .reduce((accumulator, current) => accumulator + current, 0).toFixed(2);
    return this;
  };
  // Totals quantity of products in favorites list
  #updateHeartQuantity = () => {
    document.querySelector(`#heart-quantity`).textContent = this.picks.filter(pick => pick.heart).length;
    return this;
  };
  // Toggles the package heart (true/false)
  #updatePackageHeart = id => {
    const search = this.picks.find(pick => pick.id === id);
    if (search === undefined) {
      this.picks.push({ id, heart: true, qty: 0 });
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<i class="bi bi-heart-fill"></i>`;
    } else if (search.heart) {
      search.heart = false;
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<i class="bi bi-heart"></i>`;
    } else {
      search.heart = true;
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<i class="bi bi-heart-fill"></i>`;
    };
    return this;
  };
};
new Cart();
