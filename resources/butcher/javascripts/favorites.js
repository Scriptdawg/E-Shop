import { Store } from "./store.js";
export class Favorites extends Store {
  constructor(products) {
    super();
    this.products = products;
    this.#main();
  };
  #main = () => {
    document.querySelector("#subpage-name").textContent = "Favorites List";
    this.view = this.products.filter(product => this.picks.find(pick => pick.id === product.id && pick.heart));
    this.printProducts();
    this.picks.filter(pick => pick.heart && !pick.qty).forEach(pick => {
      document.querySelector(`#btn-minus-${pick.id}`).classList.add("hidden");
      document.querySelector(`#btn-clear-${pick.id}`).classList.add("hidden");
    });
    this.#attachButtons();
    this.updateCartQuantity().updateHeartQuantity().updateTotalAmount();
    document.body.scrollTop = 0; // for Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    document.querySelector(".categories").classList.remove("show");
    document.querySelector(".instructions").classList.add("show");
    document.querySelector(".ledger").classList.remove("show");
    document.querySelector("#btn-store").classList.remove("hidden");
    document.querySelector("#btn-favorites").classList.add("hidden");
    document.querySelector("#btn-cart").classList.remove("hidden");
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
        document.querySelector(`#package-${button.dataset.id}`).classList.add("hide");
        if (!this.picks.filter(pick => pick.heart).length) this.printEmptyState();
      });
    });
  };
  // Prints empty state
  printEmptyState = () => {
    document.querySelector("#packages").innerHTML = `
      <div id="empty-state" class="empty-state">
        <i class="bi bi-heart"></i>
        <p>Favorites list is Empty</p>
        <a class="btn btn--pill btn-continue" href="/butcher/store">Continue Shopping</a>
      </div>
    `;
  };
};
