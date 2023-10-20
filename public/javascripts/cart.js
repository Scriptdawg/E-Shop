import { FetchWrap } from "./fetchWrap.js";
class Cart {
  #viewApi = new FetchWrap("https://animal-y4xn.onrender.com/public/");
  //#viewApi = new FetchWrap("http://localhost:3000/public/");
  constructor() {
    this.picks = JSON.parse(localStorage.getItem("data")) || [];
    this.products = [];
    this.#main();
  }
  // ! Gets all products from database via api
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
  // ! Filters the api data and generates the packages html
  #printProducts = () => {
    // ? Filter products that are in picks with a qty > 0
    this.products = this.products.filter(product => this.picks.find(pick => pick.id === product.id && pick.qty));
    // ? Generate the packages html
    document.querySelector("#packages").innerHTML = this.products.map(product => {
      const { id, img, name, price, priceType } = product;
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
            <button id="btn-heart-${id}" class="btn btn-heart" data-id="${id}" title="Toggle Favorite">
              ${search.heart === true ? `<i class="bi bi-heart-fill"></i>` : `<i class="bi bi-heart"></i>`}
            </button>
            <span id="subtotal-${id}" class="subtotal" title="Subtotal">$${(price * search.qty).toFixed(2)}</span>
          </div>
          <div class="term">
            <h2 title="Product Name">${name}</h2>
          </div>
          <div class="left-ctrl">
            <button id="btn-remove-${id}" class="btn btn-remove" data-id="${id}" title="Remove package from cart!">Remove</button>
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
    this.picks.filter(pick => pick.qty === 1).forEach(pick => document
      .querySelector(`#btn-minus-${pick.id}`).classList.add("hidden"));
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
    // ? Remove package Button
    document.querySelectorAll(".btn-remove").forEach(button => {
      button.addEventListener("click", event => {
        this.#removePackage(`${button.dataset.id}`);
      });
    });
    // ? Clear Cart Button - remove all packages from the cart
    document.querySelector("#clear-cart").addEventListener("click", event => {
      this.#clearCart();
    });
    //? Heart Button
    document.querySelectorAll(".btn-heart").forEach(button => {
      button.addEventListener("click", event => {
        this.#updatePackageHeart(`${button.dataset.id}`);
      });
    });
  };
  // ! Increases the selected package qty by 1
  #plus = id => {
    const search = this.picks.find(pick => pick.id === id);
    search.qty += 1;
    if (search.qty === 2) document.querySelector(`#btn-minus-${id}`).classList.remove("hidden");
    this.#updatePackage(id);
    this.#updateLocalStorage();
    this.#updateTotalAmount();
  };
  // ! Decreases the selected package qty by 1
  #minus = id => {
    const search = this.picks.find(pick => pick.id === id);
    if (search.qty === 2) document.querySelector(`#btn-minus-${id}`).classList.add("hidden");
    search.qty -= 1;
    this.#updatePackage(id);
    this.#updateLocalStorage();
    this.#updateTotalAmount();
  };
  // ! Updates the package qty and subtotal
  #updatePackage = id => {
    const search = this.picks.find(pick => pick.id === id);
    document.querySelector(`#qty-${id}`).textContent = search.qty;
    const query = this.products.find(product => product.id === search.id);
    document.querySelector(`#subtotal-${id}`).textContent = `$${(search.qty * query.price).toFixed(2)}`;
    this.#updateCartQuantity();
  };
  // ! Sets qty to zero, prints empty state if no more packages
  #removePackage = id => {
    document.querySelector(`#package-${id}`).classList.add("hide");
    this.picks.find(pick => pick.id === id).qty = 0;
    this.#updateCartQuantity();
    this.#updateLocalStorage();
    this.#updateTotalAmount();
    if (!this.picks.filter(pick => pick.qty).length) this.#printEmptyCart();
  };
  // ! Sets the qty of all picks to zero and removes picks not in favorites
  #clearCart = () => {
    this.picks.forEach(pick => pick.qty = 0);
    this.#printEmptyCart();
    this.#updateCartQuantity();
    this.#updateLocalStorage();
    this.#updateTotalAmount();
  };
  // ! Cleans picks and stores it in local storage
  #updateLocalStorage = () => {
    this.picks = this.picks.filter(pick => pick.qty || pick.heart);
    localStorage.setItem("data", JSON.stringify(this.picks));
  };
  // ! Prints empty cart
  #printEmptyCart = () => {
    document.querySelector("#packages").innerHTML = `
      <div id="empty-cart" class="empty-cart">
        <i class="bi bi-cart-x-fill"></i>
        <p>Shopping Cart is Empty</p>
        <p>
          Get started by <a class="link" href="/public">browsing our products</a>
          or pick products from <a class="link" href="/public/favorites">your favorites list</a>.
        </p>
      </div>
    `;
    document.querySelector("#clear-cart").classList.add("remove");
    document.querySelector("#checkout").classList.add("remove");
  };
  // ! Totals number of products and items in the cart and updates the ledger
  #updateCartQuantity = () => {
    document.querySelector(`#cart-quantity`).textContent = this.picks
      .map(pick => pick.qty)
      .reduce((accumulator, current) => accumulator + current, 0);
    document.querySelector(`#cart-products`).textContent = this.picks
      .filter(pick => pick.qty).length;
  };
  // ! Calculates total cost of all picks in cart and updates the ledger
  #updateTotalAmount = () => {
    if (!this.picks.length) {
      document.querySelector("#total-amount").textContent = "0.00";
      return;
    } 
    document.querySelector("#total-amount").textContent = this.picks.filter(pick => pick.qty !== 0)
      .map(pick => this.products.find(product => product.id === pick.id).price * pick.qty)
      .reduce((accumulator, current) => accumulator + current, 0).toFixed(2);
  };
  // ! Totals quantity of products in favorites list and updates the HEART icon
  #updateHeartQuantity = () => {
    document.querySelector(`#heart-quantity`).textContent = this.picks.filter(pick => pick.heart === true).length;
  };
  // ! Toggles the package heart (true/false)
  #updatePackageHeart = id => {
    const search = this.picks.find(pick => pick.id === id);
    if (search.heart) {
      search.heart = false;
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<i class="bi bi-heart"></i>`;
    } else {
      search.heart = true;
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<i class="bi bi-heart-fill"></i>`;
    };
    this.#updateHeartQuantity();
    this.#updateLocalStorage();
  };
};
new Cart();
