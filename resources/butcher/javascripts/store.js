export class Store {
  constructor() {
    this.picks = JSON.parse(localStorage.getItem("data")) || [];
    this.view = [];
  };
  //  Generates the packages html
  printProducts = () => {
    if (!this.view.length) {
      this.printEmptyState();
      return;
    }
    document.querySelector("#packages").innerHTML = this.view.map(product => {
      const { id, img, name, price, shortDescription, weight } = product;
      const search = this.picks.find(pick => pick.id === id) || [];
      return `
        <div id="package-${id}" class="package">

          <div class="term">
            <h2 class="title" title="Product Name">${name}</h2>
            <p class="short-description" title="Short Description">${shortDescription}</p>
          </div>

          <div class="picture">
            <img src="${img}" width="70" height="70" alt="${name}" title="${name}">
          </div>

          <ul class="info">
            <li title="Price">
              Price: $${price} / lb
            </li>
            <li title="Estimated Package Weight">
              Weight: ${weight} lbs
            </li>

            <li id="qty-${id}" class="qty" data-id=${id} title="Quantity">
              <span>Quantity: ${search.qty === undefined ? 0 : search.qty}</span>
            </li>
            <li id="subtotal-${id}" class="subtotal" title="Subtotal">
              <span>Cost: $${(price * weight * (search.qty === undefined ? 0 : search.qty)).toFixed(2)}</span>
            </li>
          </ul>

          <button id="btn-heart-${id}" class="btn btn-heart" data-id="${id}" title="Toggle Favorite">
            ${search.heart === true ? `<img src="/butcher/assets/svg/heart-fill-red.svg" width="18" height="18" alt="Red Heart">`
            : `<img src="/butcher/assets/svg/heart.svg" width="18" height="18" alt="Black Border Heart">`}
          </button>

          <ul class="ctrl-btns">
            <li>
              <button id="btn-clear-${id}" class="btn btn--nav btn-clear" data-id="${id}" title="Set quantity to zero!">
                clear
              </button>
            </li>
            <li>
              <button id="btn-minus-${id}" class="btn btn--nav btn-minus" data-id="${id}" title="Decrease Quantity">
                less
              </button>
            </li>
            <li>
              <button id="btn-plus-${id}" class="btn btn--nav btn-plus" data-id="${id}" title="Increase Quantity">
                more
              </button>
            </li>
          </ul>
            
        </div>
      `
    }).join("");
    return this;
  };
            // <img src="/butcher/assets/svg/plus-lg.svg" width="18" height="18" alt="plus-lg.svg">
            //<img src="/butcher/assets/svg/dash-lg.svg" width="16" height="16" alt="dash-lg.svg">

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
    document.querySelector(`#qty-${id}`).innerHTML = `<span>Quantity: ${search.qty}</span>`;
    const query = this.products.find(product => product.id === id);
    document.querySelector(`#subtotal-${id}`).innerHTML = `<span>Cost: $${(query.weight * search.qty * query.price).toFixed(2)}</span>`;
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
      .map(pick => this.products.find(product => product.id === pick.id).price *
      this.products.find(product => product.id === pick.id).weight * pick.qty)
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
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<img src="/butcher/assets/svg/heart-fill-red.svg" width="18" height="18" alt="Red Heart">`;
    } else if (search.heart) {
      search.heart = false;
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<img src="/butcher/assets/svg/heart.svg" width="18" height="18" alt="Black Border Heart">`;
    } else {
      search.heart = true;
      document.querySelector(`#btn-heart-${id}`).innerHTML = `<img src="/butcher/assets/svg/heart-fill-red.svg" width="18" height="18" alt="Red Heart">`;
    };
    return this;
  };
};
