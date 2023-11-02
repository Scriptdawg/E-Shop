class Layout {
  constructor() {
    this.scrollTop = document.querySelector("#btn-scroll-top");
    this.windowSize = document.querySelector("#window-size");
    this.#main(), this.#scroller(), this.#leftBtn();
  };
  #main = () => {
    // displays initial screen size
    this.windowSize.innerHTML = `
      <span title="Window Width: ${window.innerWidth}px | Window Height: ${window.innerHeight}px">
      Window Width: ${window.innerWidth}px | Window Height: ${window.innerHeight}px</span>
    `
    window.onresize = () => this.#resize();
    window.onscroll = () => this.#scroll();
    return;
  };
  // refreshes screen size onresize
  #resize = () => {
    this.windowSize.innerHTML = `
      <span title="Window Width: ${window.innerWidth}px | Window Height: ${window.innerHeight}px">
      Window Width: ${window.innerWidth}px | Window Height: ${window.innerHeight}px</span>    
    `
  };
  // shows to top of page button if user scrolls more then 1000px
  #scroll = () => {
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000)
      this.scrollTop.style.display = "block";
    else this.scrollTop.style.display = "none";
  };
  // goes to top of page
  #scroller = () => {
    this.scrollTop.addEventListener("click", () => {
      document.body.scrollTop = 0; // for Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
    return;
  };
  // opens and closes website side navigation and overlay
  #leftBtn = () => {
    const leftButton = document.querySelector("#btn-open-website-side-nav");
    leftButton.addEventListener("click", () => {
      document.querySelector(".overlay").classList.add("show-overlay");
      document.querySelector(".website-side-nav").classList.add("open-website-side-nav");
    });
    document.querySelector("#overlay").addEventListener("click", (event) => {
      document.querySelector(".website-side-nav").classList.remove("open-website-side-nav");
      event.target.classList.remove("show-overlay");
    });
  };
};

new Layout();
