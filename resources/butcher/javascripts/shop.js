import { Store } from "./store.js";
export class Shop extends Store {
  constructor(products, category = false) {
    super();
    this.products = products;
    this.category = category;
    this.#main();
  };
  #main = () => {
    document.querySelector("#subpage-name").textContent = "All Products";
    if (this.category) this.view = this.products.filter(product => product.category === this.category);
    else this.view = this.products;
    this.printProducts().view.forEach(product => {
      const search = this.picks.find(pick => pick.id === product.id);
      if (search === undefined || !search.qty) {
        document.querySelector(`#btn-minus-${product.id}`).classList.add("hidden");
        document.querySelector(`#btn-clear-${product.id}`).classList.add("hidden");
      }
    });
    this.#attachButtons();
    this.updateCartQuantity().updateHeartQuantity().updateTotalAmount();
    document.body.scrollTop = 0; // for Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    document.querySelector(".ledger").classList.add("hide");
    document.querySelector(".categories").classList.add("show");
    document.querySelector("#shop").classList.add("hide");
    document.querySelector("#btn-store").classList.add("hidden");
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
      });
    });
  };
  // Prints empty state
  printEmptyState = () => {
    document.querySelector("#packages").innerHTML = `
      <div id="empty-cart" class="empty-cart">
        <p>There aren't any products that match search phrase.</p>
        <a class="btn btn--pill btn-continue" href="/butcher/store">Continue Shopping</a>
      </div>
    `;
  };
};
