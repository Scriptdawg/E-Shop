import { FetchWrap } from "./fetchWrap.js";
import { Shop } from "./shop.js";
import { Favorites } from "./favorites.js";
import { Cart } from "./cart.js";
class Index {
  #viewApi = new FetchWrap("https://animal-y4xn.onrender.com/butcher/");
  //#viewApi = new FetchWrap("http://localhost:3000/butcher/");
  constructor() {
    this.#getProducts()
  };
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
  #main = (data) => {
    this.#subNavButtons(data);
    this.#categoryButtons(data);
    new Shop(data);
  }
  // Attach event listeners to sub nav buttons
  #subNavButtons = (data) => {
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
  // Attach event listeners to category buttons
  #categoryButtons = (data) => {
    // ? All Products
    document.querySelector("#btn-all-products").addEventListener("click", () => {
      new Shop(data);
      document.querySelector("#subpage-name").textContent = "All Products";
      closeSidebar();
    }); 
    // ? Beef
    document.querySelector("#btn-beef").addEventListener("click", () => {
      new Shop(data, "beef");
      document.querySelector("#subpage-name").textContent = "Beef";
      closeSidebar();
    });
    // ? Chicken
    document.querySelector("#btn-chicken").addEventListener("click", () => {
      new Shop(data, "chicken");
      document.querySelector("#subpage-name").textContent = "Chicken";
      closeSidebar();
    });
    // ? closeSidebar when category button clicked
    const closeSidebar = () => {
      const overLay = document.querySelector(".overlay");
      const appSideNav = document.querySelector(".app-side-nav");
      requestAnimationFrame(() => {
        appSideNav.classList.remove("open-app-side-nav");
        overLay.classList.remove("show-overlay");
      });
    };
  };
};
new Index();
