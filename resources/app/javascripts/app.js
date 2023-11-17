class App {
  constructor() {
    this.scrollTop = document.querySelector("#btn--top");
    this.windowSize = document.querySelector("#window-size");
    this.lastPosition = scrollY; 
    this.#main(), this.#scroller(), this.#appSideNav();
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
  // moves app-top-nav up or down on scroll
  #scroll = () => {
    const currentPosition = scrollY;
    if(currentPosition > this.lastPosition && currentPosition > 150) {
      this.lastPosition = scrollY;
      requestAnimationFrame(() => {
        document.querySelector("#app-top-nav").classList.add("app-top-nav-move");
      });
    } else {
      this.lastPosition = scrollY;
      requestAnimationFrame(() => {
        document.querySelector("#app-top-nav").classList.remove("app-top-nav-move");
      });
    };
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
      this.scrollTop.style.display = "block";
    }
    else {
      this.scrollTop.style.display = "none";
    };
  };
  // goes to top of page
  #scroller = () => {
    this.scrollTop.addEventListener("click", () => {
      document.body.scrollTop = 0; // for Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
    return;
  };

  // opens and closes app side nav with overlay
  #appSideNav = () => {
    const overLay = document.querySelector(".overlay");
    const appSideNav = document.querySelector(".app-side-nav");
    document.querySelector("#btn-open-app-side-nav").addEventListener("click", () => {
      appSideNav.style.display = "flex";
      overLay.style.display = "block";
      requestAnimationFrame(() => {
        overLay.classList.add("show-overlay");
        appSideNav.classList.add("open-app-side-nav");
      });
    });
    overLay.addEventListener("click", (event) => {
      requestAnimationFrame(() => {
        appSideNav.classList.remove("open-app-side-nav");
        event.target.classList.remove("show-overlay");
      });
    });
    // make un-discoverable by accessibility software
    overLay.addEventListener("transitionend", (event) => {
      if(!event.target.classList.contains("show-overlay")) {
        event.target.style.display = "none";
        appSideNav.style.display = "none";
      };
    });
  };
};

new App();
