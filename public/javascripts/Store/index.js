import { FetchWrap } from "./fetchWrap.js";
import { Shop } from "./shop.js";
import { Favorites } from "./favorites.js";
import { Cart } from "./cart.js";
class Index {
  #viewApi = new FetchWrap("https://animal-y4xn.onrender.com/public/");
  //#viewApi = new FetchWrap("http://localhost:3000/public/");
  constructor() {
    this.#getProducts()
  };
  // Gets all products from database via api
  #getProducts = () => {
    this.#getProductList()
      .then((response) => {
        this.#printSubNav(response);
        new Shop(response);
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
  // Attach event listeners to sub nav buttons
  #printSubNav = (data) => {
    // ? Store Button
    document.querySelector("#btn-store").addEventListener("click", () => {
      new Shop(data);
    });
    // ? Favorites Button
    document.querySelector("#btn-favorites").addEventListener("click", () => {
      new Favorites(data);
    });
    // ? Cart Button
    document.querySelector("#btn-cart").addEventListener("click", () => {
      new Cart(data);
    });
  };
};
new Index();
