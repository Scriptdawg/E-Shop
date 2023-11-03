class Layout {
  constructor() {
    this.scrollTop = document.querySelector("#btn-scroll-top");
    this.windowSize = document.querySelector("#window-size");
    this.#main(), this.#scroller(), this.#webSideNav();
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
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
      this.scrollTop.style.display = "block";
    }
    else {
      this.scrollTop.style.display = "none";
      document.querySelector("#website-top-nav").style.top = 0;
    }
  };
  // goes to top of page
  #scroller = () => {
    this.scrollTop.addEventListener("click", () => {
      document.body.scrollTop = 0; // for Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
    return;
  };
  // opens and closes website side navigation with overlay
  #webSideNav = () => {
    const overLay = document.querySelector(".overlay");
    const webSideNav = document.querySelector(".website-side-nav");
    document.querySelector("#btn-open-website-side-nav").addEventListener("click", () => {
      webSideNav.style.display = "flex";
      overLay.style.display = "block";
      requestAnimationFrame(() => {
        overLay.classList.add("show-overlay");
        webSideNav.classList.add("open-website-side-nav");
      });
    });
    overLay.addEventListener("click", (event) => {
      webSideNav.classList.remove("open-website-side-nav");
      event.target.classList.remove("show-overlay");
    });
    // make un-discoverable by accessibility software
    webSideNav.addEventListener("transitionend", (event) => {
      if(!event.target.classList.contains("open-website-side-nav")) {
        event.target.style.display = "none";
        overLay.style.display = "none";
      };
    });
  };
};

new Layout();
