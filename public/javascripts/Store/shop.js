import { Store } from "./store.js";
export class Shop extends Store {
  constructor(products) {
    document.querySelector("#center-list").innerHTML = `<span>Shopping</span>`;
    document.querySelector("#ledger").classList.add("hidden");
    super();
    this.products = products;
    this.#main();
  };
  #main = () => {
    this.view = this.products;
    this.printProducts().products.forEach(product => {
      const search = this.picks.find(pick => pick.id === product.id);
      if (search === undefined || !search.qty) {
        document.querySelector(`#btn-minus-${product.id}`).classList.add("hidden");
        document.querySelector(`#btn-clear-${product.id}`).classList.add("hidden");
      }
    });
    this.#attachButtons();
    this.updateCartQuantity().updateHeartQuantity().updateTotalAmount();
  };
  // Activates buttons event listeners
  #attachButtons = () => {
    //? Plus Buttons
    document.querySelectorAll(".btn-plus").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelector(`#btn-minus-${button.dataset.id}`).classList.remove("hidden");
        document.querySelector(`#btn-clear-${button.dataset.id}`).classList.remove("hidden");
        this.plus(button.dataset.id);
        this.updatePackage(button.dataset.id).updateLocalStorage().updateTotalAmount();
      });
    });
    //? Minus Buttons
    document.querySelectorAll(".btn-minus").forEach(button => {
      button.addEventListener("click", () => {
        if (this.minus(button.dataset.id) === 0) {
          document.querySelector(`#btn-minus-${button.dataset.id}`).classList.add("hidden");
          document.querySelector(`#btn-clear-${button.dataset.id}`).classList.add("hidden");
        }
        this.updatePackage(button.dataset.id).updateLocalStorage().updateTotalAmount();
      });
    });
    // ? Clear Buttons
    document.querySelectorAll(".btn-clear").forEach(button => {
      // button.textContent = "Remove";
      button.addEventListener("click", () => {
        this.clearPackage(button.dataset.id);
        this.updatePackage(button.dataset.id).updateLocalStorage().updateTotalAmount();
        document.querySelector(`#btn-minus-${button.dataset.id}`).classList.add("hidden");
        document.querySelector(`#btn-clear-${button.dataset.id}`).classList.add("hidden");
      });
    });
    //? Heart Buttons
    document.querySelectorAll(".btn-heart").forEach(button => {
      button.addEventListener("click", () => {
        this.updatePackageHeart(button.dataset.id).updateHeartQuantity().updateLocalStorage();
      });
    });
  };
};
