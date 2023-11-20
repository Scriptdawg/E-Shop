import { Store } from "./store.js";
export class Cart extends Store {
  constructor(products) {
    super();
    this.products = products;
    this.#main();
  };
  // Main
  #main = () => {
    document.querySelector("#subpage-name").textContent = "Cart Contents";
    this.view = this.products.filter(product => this.picks.find(pick => pick.id === product.id && pick.qty));
    this.printProducts();
    this.picks.filter(pick => pick.qty === 1).forEach(pick => document
      .querySelector(`#btn-minus-${pick.id}`).classList.add("hidden"));
    this.#attachButtons();
    this.updateCartQuantity().updateHeartQuantity().updateTotalAmount();
    document.body.scrollTop = 0; // for Safari
    // hide elements
    document.querySelectorAll(".short-description")
      .forEach(description => description.classList.add("hide"));
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    document.querySelector("#btn-clear-cart").classList.remove("hide");
    document.querySelector("#checkout").classList.remove("hide");
    document.querySelector(".categories").classList.remove("show");
    document.querySelector(".instructions").classList.remove("show");
    document.querySelector(".ledger").classList.add("show");

  }
  // Activates buttons event listeners
  #attachButtons = () => {
    //? Plus Buttons
    document.querySelectorAll(".btn-plus").forEach(button => {
      button.addEventListener("click", () => {
        if (this.plus(button.dataset.id) === 2)
          document.querySelector(`#btn-minus-${button.dataset.id}`).classList.remove("hidden");
        this.updatePackage(button.dataset.id).updateLocalStorage().updateTotalAmount();
      });
    });
    //? Minus Buttons
    document.querySelectorAll(".btn-minus").forEach(button => {
      button.addEventListener("click", () => {
        if (this.minus(button.dataset.id) === 1)
          document.querySelector(`#btn-minus-${button.dataset.id}`).classList.add("hidden");
        this.updatePackage(button.dataset.id).updateLocalStorage().updateTotalAmount();
      });
    });
    // ? Clear Buttons
    document.querySelectorAll(".btn-clear").forEach(button => {
      button.textContent = "Remove";
      button.addEventListener("click", () => {
        this.clearPackage(button.dataset.id);
        this.updatePackage(button.dataset.id).updateLocalStorage().updateTotalAmount();
        document.querySelector(`#package-${button.dataset.id}`).classList.add("hide");
        if (!this.picks.filter(pick => pick.qty).length) this.printEmptyState();
      });
    });
    // ? Clear Cart Button - remove all packages from the cart
    document.querySelector("#btn-clear-cart").addEventListener("click", () => {
      this.clearCart().updateCartQuantity().updateLocalStorage().updateTotalAmount();
    });
    //? Heart Buttons
    document.querySelectorAll(".btn-heart").forEach(button => {
      button.addEventListener("click", () => {
        this.updatePackageHeart(button.dataset.id).updateHeartQuantity().updateLocalStorage();
      });
    });
  };
  // Prints empty state
  printEmptyState = () => {
    document.querySelector("#packages").innerHTML = `
      <div id="empty-state" class="empty-state">
        <i class="bi bi-cart-x-fill"></i>
        <p>Shopping Cart is Empty</p>
        <a class="btn btn--pill btn-continue" href="/butcher/store">Continue Shopping</a>
      </div>
    `;
    document.querySelector("#btn-clear-cart").classList.add("hide");
    document.querySelector("#checkout").classList.add("hide");
  };
};
