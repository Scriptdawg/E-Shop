import { FetchWrap } from "./fetchWrap.js";
class Shop {
  #viewApi = new FetchWrap("https://animal-y4xn.onrender.com/public/");
  //#viewApi = new FetchWrap("http://localhost:3000/public/");
  constructor() {
    this.basket = JSON.parse(localStorage.getItem("data")) || [];
    this.products = [];
    this.#main();
  }
  // Get all products & save to this.products
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
  // Generate the html view
  #printProducts = () => {
    document.querySelector("#container-card").innerHTML = this.products.map(product => {
      const search = this.basket.find((item) => item.id === product.id) || [];
      return `
        <div id="card-${product.id}" class="card">
          <div id="card-image" class="card-image">
            <a href="/public/product/${product.id}">
              <img
                src="${product.img}"
                width="600px"
                height="400px"
                alt="${product.name}"
                title="${product.name}"
              />
            </a>
          </div>
          <div id="card-details" class="card-details">
            <h2 id="product-name" class="product-name">${product.name}</h2>
            <p id="product-shortDescription" class="product-shortDescription">${product.shortDescription}</p>
            <p id="product-price" class="product-price">$${product.price}${product.priceType}</p>
            <div id="card-controls" class="card-controls">
              <button id="btn-product-heart-${product.id}" class="btn btn-product-heart" data-id="${product.id}">
                ${search.heart === true ? `<i class="bi bi-heart-fill"></i>` : `<i class="bi bi-heart"></i>`}
              </button>
              <div>
                <button id="btn-minus-${product.id}" class="btn btn-minus" data-id="${product.id}">
                  <i class="bi bi-chevron-double-down"></i>
                </button>
                <span id="quantity-${product.id}" class="quantity" data-id=${product.id}>
                  ${search.qty === undefined ? 0 : search.qty}
                </span>
                <button id="btn-plus-${product.id}" class="btn btn-plus" data-id="${product.id}">
                  <i class="bi bi-chevron-double-up"></i>
                </button>
              </div>
            </div>
          </div>
        </div>      
      `
    }).join("");  
    this.#updateHeartQty();
    this.#updateCartQty();
    this.#attachButtons();
  };
  // Update heart-quantity
  #updateHeartQty = () => {
    document.querySelector(`#heart-quantity`).textContent = this.basket.filter((item) => item.heart === true).length;
  };
  // Update cart-quantity
  #updateCartQty = () => {
    document.querySelector(`#cart-quantity`).textContent = this.basket
      .map((item) => item.qty)
      .reduce((accumulator, current) => accumulator + current, 0);
  };
  // Attach Button Event Listeners
  #attachButtons = () => {
    //? Minus Button
    document.querySelectorAll(".btn-minus").forEach((button) => {
      button.addEventListener("click", (event) => {
        this.#decrement(`${button.dataset.id}`);
      });
    });
    //? Plus Button
    document.querySelectorAll(".btn-plus").forEach((button) => {
      button.addEventListener("click", (event) => {
        this.#increment(`${button.dataset.id}`);
      });
    });
    //? Heart Button
    document.querySelectorAll(".btn-product-heart").forEach((button) => {
      button.addEventListener("click", (event) => {
        this.#updateProductHeart(`${button.dataset.id}`);
      });
    });
  };
  // Decrement product quantity
  #decrement = (id) => {
    const search = this.basket.find((item) => item.id === id);
    if (search === undefined) return;
    else if (search.qty === 0) return;
    else {
      search.qty -= 1;
    }
    this.#updateProductQty(id);
    this.basket = this.basket.filter((item) => Number.parseInt(item.qty, 10) !== 0 || item.heart !== false);
    this.#updateLocalStorage();
  };
  // Increment product quantity
  #increment = (id) => {
    const search = this.basket.find((item) => item.id === id);
    if (search === undefined) {
      this.basket.push({
        id,
        heart: false,
        qty: 1,
      });
    } else {
      search.qty += 1;
    }
    this.#updateProductQty(id);
    this.#updateLocalStorage();
  };
  // Update product quantity
  #updateProductQty = (id) => {
    const search = this.basket.find((item) => item.id === id);
    document.querySelector(`#quantity-${id}`).textContent = search.qty;
    this.#updateCartQty();
  };
  // Update product heart (true/false)
  #updateProductHeart = (id) => {
    const search = this.basket.find((item) => item.id === id);
    if (search === undefined) {
      this.basket.push({
        id,
        heart: true,
        qty: 0,
      });
    } else {
      if (search.heart === false) {
        search.heart = true;
      } else {
        search.heart = false;
      }
    }
    this.basket = this.basket.filter(
      (item) => Number.parseInt(item.qty, 10) !== 0 || item.heart !== false
    );
    document.querySelectorAll(".btn-product-heart").forEach((button) => {
      button.innerHTML = `<i class="bi bi-heart"></i>`;
    });
    const hearts = this.basket.filter((item) => item.heart === true);
    const heartArray = hearts.map((item) => item.id);
    heartArray.forEach((heart) => {
      document.querySelector(
        `#btn-product-heart-${heart}`
      ).innerHTML = `<i class="bi bi-heart-fill"></i>`;
    });
    this.#updateHeartQty();
    this.#updateLocalStorage();
  };
  // Update localStorage
  #updateLocalStorage = () => {
    localStorage.setItem("data", JSON.stringify(this.basket));
  };
}
new Shop();
