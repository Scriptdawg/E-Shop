import { FetchWrap } from "./fetchWrap.js";
class Cart {
  //#viewApi = new FetchWrap("https://animal-y4xn.onrender.com/Public/");
  #viewApi = new FetchWrap("http://localhost:3000/Public/");
  constructor() {
    this.products = [];
    this.#main();
    this.basket = JSON.parse(localStorage.getItem("data")) || [];
  };

  #main = () => {
    this.#getProductsList()
      .then((response) => {
        this.products = response;
        this.#printProducts(response)
      })
      .catch((reject) => {
        console.log(reject);
      })
      .finally();
  };

  #getProductsList = () => {
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

  #printProducts = (items) => {
    const products = items.filter(item => {
      const search = this.basket.find(product => {
        return product.id === item.id;
      });
      return search != undefined;
    });
    if(products.length === 0) {
      this.#emptyCart();
    } else {
      this.#printLegend();
    };
    const print = document.querySelector("#product-list");
    products.forEach(product => {
      const search = this.basket.find((y) => y.id === product.id) || [];
      print.innerHTML += `
        <div id="product-${product.id}" class="product-card">
          <div class="product-card-image">
            <img 
              width="500px"
              height="300px"  
              src="${product.img}" alt="Database image."
            />
          </div>
          <div class="product-card-body">
            <div id="product-card-container" class="product-card-container">
              <h2>${product.name}</h2>
              <button id="product-card-delete" class="product-card-delete" data-id="${product.id}">X</button>
            </div>
            <p id="product-card-subtotal-${product.id}" class="product-card-subtotal">
              Subtotal: $ ${product.price * search.qty}
            </p>
          </div>
          <div class="product-card-footer">
            <p>$ ${product.price}${product.priceType}</p>
            <div class="product-card-footer-buttons">
              <button id="btn-minus-${product.id}" class="btn-minus" data-id="${product.id}">-</button>
              <p id="product-quantity-${product.id}" class="product-quantity">
                ${search.qty === undefined ? 0 : search.qty}
              </p>
              <button id="btn-plus-${product.id}" class="btn-plus" data-id="${product.id}">+</button>
            </div>
          </div>
        </div>
      `;
      this.#calculation();
    })
    print.innerHTML += `</div>`;
    this.#attachButtons();
  };

  #attachButtons = () => {
    //? Minus Button
    document.querySelectorAll(".product-card-footer-buttons .btn-minus").forEach(button => {
      button.addEventListener("click", event => {
        this.#decrement(`${button.dataset.id}`);
      });
    });
    //? Plus Button
    document.querySelectorAll(".product-card-footer-buttons .btn-plus").forEach(button => {
      button.addEventListener("click", event => {
        this.#increment(`${button.dataset.id}`);
      });
    });
    //? Delete Button
    document.querySelectorAll("#product-card-delete").forEach(button => {
      button.addEventListener("click", event =>  {
        this.#deleteItem(`${button.dataset.id}`);
      });
    });
  };

  #decrement = (buttonId) => {
    const search = this.basket.find((x) => x.id === buttonId);
    search.qty -= 1;
    if(search.qty === 0) {
      document.querySelector(`#product-${buttonId}`).classList.add("hide");
    }
    this.#update(buttonId);
    this.basket = this.basket.filter((x) => Number.parseInt(x.qty, 10) !==0);
    if(this.basket.length === 0) {
      this.#emptyCart();
    }
    localStorage.setItem("data", JSON.stringify(this.basket));      
  };
  
  #increment = (buttonId) => {   
    const search = this.basket.find((x) => x.id === buttonId);
    if (search === undefined) {
      this.basket.push({
        id: buttonId,
        qty: 1,
      });
    } else {
      search.qty += 1;
    }
    this.#update(buttonId);
    localStorage.setItem("data", JSON.stringify(this.basket));    
  };
  
  #update = (id) => {
    const search = this.basket.find((x) => x.id === id);
    document.querySelector(`#product-quantity-${id}`).textContent = search.qty;
    const query = this.products.find(product => {
      return product.id === search.id;
    });
    const subtotal = search.qty * query.price;
    document.querySelector(`#product-card-subtotal-${id}`).textContent = `Subtotal: $ ${subtotal}`;
    this.#calculation();
    document.querySelector("#total-bill").textContent = this.#totalAmount();
  };
  
  #calculation = () => {
    document.querySelector(`#cart-quantity`).textContent = this.basket.map((x) => x.qty).reduce((x, y) => x + y, 0);
  };

  #emptyCart = () => {
    document.querySelector("#product-legend").innerHTML=`
      <h2>Cart is Empty</h2>
      <a href="/public">
        <button class="btn-continue">Continue Shopping</button>
      </a>
    `
    document.querySelector("#product-list").innerHTML = "";
  };

  #printLegend = () => {
    const total = this.#totalAmount();
    document.querySelector("#product-legend").innerHTML=`
      <h2>Total Bill: $ <span id="total-bill">${total}</span></h2>
      <button id="btn-checkout" class="btn-checkout">CheckOut</button>
      <button id="btn-clear-cart" class="btn-clear-cart">Clear Cart</button>
    `
    document.querySelector("#btn-clear-cart").addEventListener("click", event => {
      this.#clearCart();
    });
  };

  #clearCart = () => {
    this.basket = [];
    this.#calculation();
    this.#emptyCart();
    localStorage.setItem("data", JSON.stringify(this.basket));
  }

  #deleteItem = (buttonId) => {
    document.querySelector(`#product-${buttonId}`).classList.add("hide");
    const search = this.basket.find(item => item.id === buttonId);
    search.qty = 0;
    this.#calculation()
    this.#printLegend();
    this.basket = this.basket.filter((x) => Number.parseInt(x.qty, 10) !==0);
    if(this.basket.length === 0) this.#clearCart();
    localStorage.setItem("data", JSON.stringify(this.basket));
  };

  #totalAmount = () => {
    if (this.basket.length !== 0) {
      let amount = this.basket
        .map((x) => {
          let { id, qty } = x;
          let filterData = this.products.find((x) => x.id === id);
          return filterData.price * qty;
        })
        .reduce((x, y) => x + y, 0);
      return amount;
    } else return;
  };

};

new Cart();
