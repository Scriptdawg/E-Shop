import { FetchWrap } from "./fetchWrap.js";
class View {
  // #viewApi = new FetchWrap("https://animal-y4xn.onrender.com/Public/");
  #viewApi = new FetchWrap("http://localhost:3000/Public/");
  constructor() {
    this.#main();
    this.basket = JSON.parse(localStorage.getItem("data")) || [];
  }

  #main = () => {
    this.#getProductsList()
      .then((response) => {
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
        .get("products/api")
        .then((data) => {
          resolve(data);
        })
        .catch((error) => reject(error))
        .finally();
    });
  };

  #printProducts = (products) => {
    print = document.querySelector("#product-list");
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
            <h2>${product.name}</h2>
            <p>${product.desc}</p>
          </div>
          <div class="product-card-footer">
            <p>$ ${product.price}</p>
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
    this.#attachButtons(products);
  };

  #attachButtons = (products) => {
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
    
  };

  #decrement = (buttonId) => {
    const search = this.basket.find((x) => x.id === buttonId);
    if (search === undefined) return;
    else if (search.qty === 0) return;
    else {
      search.qty -= 1;
     }
    this.#update(buttonId);
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
    this.basket = this.basket.filter((x) => x.item !== 0);
    localStorage.setItem("data", JSON.stringify(this.basket));    
  };
  
  #update = (id) => {
    const search = this.basket.find((x) => x.id === id);
    document.querySelector(`#product-quantity-${id}`).textContent = search.qty;
    this.#calculation();
  };

  #calculation = () => {
    document.querySelector(`#cartAmount`).textContent = this.basket.map((x) => x.qty).reduce((x, y) => x + y, 0);
  };

}

new View();
