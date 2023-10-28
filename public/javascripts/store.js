export class Store {
  constructor() {
    this.picks = JSON.parse(localStorage.getItem("data")) || [];
    this.view = [];
    console.log(window.innerWidth);
    console.log(window.outerWidth);
  };
  //  Generates the packages html
  printProducts = () => {
    if (!this.view.length) {
      this.printEmptyState();
      return;
    }
    document.querySelector("#packages").innerHTML = this.view.map(product => {
      const { id, img, name, price, shortDescription, priceType } = product;
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
            <button id="btn-heart-${id}" class="btn-plain btn-heart" data-id="${id}" title="Toggle Favorite">
              ${search.heart === true ? `<i class="bi bi-heart-fill"></i>` : `<i class="bi bi-heart"></i>`}
            </button>
            <span id="subtotal-${id}" class="subtotal" title="Subtotal">$${(price * (search.qty === undefined ? 0 : search.qty)).toFixed(2)}</span>
          </div>
          <div class="term">
            <h2 class="title large" title="Product Name">${name}</h2>
            <p class="short-description">${shortDescription}</p>
          </div>
          <div class="left-ctrl">
            <button id="btn-clear-${id}" class="btn btn-clear" data-id="${id}" title="Set quantity to zero!">Clear</button>
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
    return this;
  };
  // Increases the selected package qty by 1
  plus = id => {
    const search = this.picks.find(pick => pick.id === id);
    if (search === undefined) this.picks.push({ id, heart: false, qty: 1 });
    else search.qty += 1;
    return search ? search.qty : false;
  };
  // Decreases the selected package qty by 1
  minus = id => {
    const search = this.picks.find(pick => pick.id === id);
    if (search === undefined || !search.qty) return;
    search.qty -= 1;
    return search ? search.qty : false;
  };
  // Updates the package qty and subtotal
  updatePackage = id => {
    const search = this.picks.find(pick => pick.id === id);
    document.querySelector(`#qty-${id}`).textContent = search.qty;
    const query = this.products.find(product => product.id === id);
    document.querySelector(`#subtotal-${id}`).textContent = `$${(search.qty * query.price).toFixed(2)}`;
    this.updateCartQuantity();
    return this;
  };
  // Sets qty to zero
  clearPackage = id => {
    const search = this.picks.find(pick => pick.id === id);
    if (search === undefined) return;
    this.picks.find(pick => pick.id === id).qty = 0;
  };
  // Sets the qty of all picks to zero
  clearCart = () => {
    this.picks.forEach(pick => pick.qty = 0);
    this.printEmptyState();
    return this;
  };
  // Cleans picks and stores it in local storage
  updateLocalStorage = () => {
    this.picks = this.picks.filter(pick => pick.qty || pick.heart);
    localStorage.setItem("data", JSON.stringify(this.picks));
    return this;
  };
  // Totals number of products and items in the cart
  updateCartQuantity = () => {
    document.querySelectorAll(".cart-quantity").forEach(selector => {
      selector.textContent = this.picks
        .map(pick => pick.qty)
        .reduce((accumulator, current) => accumulator + current, 0);
    });
    document.querySelector("#cart-products").textContent = this.picks
      .filter(pick => pick.qty).length;
    return this;
  };
  // Calculates total cost of all picks in cart
  updateTotalAmount = () => {
    if (!this.picks.length) {
      document.querySelector("#total-amount").textContent = "0.00";
      return this;
    }
    document.querySelector("#total-amount").textContent = this.picks.filter(pick => pick.qty)
      .map(pick => this.products.find(product => product.id === pick.id).price * pick.qty)
      .reduce((accumulator, current) => accumulator + current, 0).toFixed(2);
    return this;
  };
  // Totals quantity of products in favorites list
  updateHeartQuantity = () => {
    document.querySelector("#heart-quantity").textContent = this.picks.filter(pick => pick.heart).length;
    return this;
  };
  // Toggles the package heart (true/false)
  updatePackageHeart = id => {
    const search = this.picks.find(pick => pick.id === id);
    if (search === undefined) {
      this.picks.push({ id, heart: true, qty: 0 });
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<i class="bi bi-heart-fill"></i>`;
    } else if (search.heart) {
      search.heart = false;
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<i class="bi bi-heart"></i>`;
    } else {
      search.heart = true;
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<i class="bi bi-heart-fill"></i>`;
    };
    return this;
  };
};
