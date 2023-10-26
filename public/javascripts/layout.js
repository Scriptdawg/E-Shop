class Layout {
  constructor() {
    this.scrollTop = document.querySelector("#btn-scroll-top");
    this.windowSize = document.querySelector("#window-size");
    this.#main(), this.#scroller(), this.#leftBtn();
  };
  
  #main = () => {
    this.windowSize.innerHTML = window.innerWidth + "px x " + window.innerHeight + "px";
    window.onscroll = () => this.#scroll();
    window.onresize = () => this.#resize();
    return;
  };

  #scroller = () => {
    this.scrollTop.addEventListener("click", () => {
      document.body.scrollTop = 0; // for Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
    return;
  };

  #scroll = () => {
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000)
      this.scrollTop.style.display = "block";
    else this.scrollTop.style.display = "none";
    return;
  };

  #resize = () => {
    this.windowSize.innerHTML = window.innerWidth + "px x " + window.innerHeight + "px";
    return;
  };

  #leftBtn = () => {
    const leftButton = document.querySelector("#btn-open-website-side-nav");
    leftButton.addEventListener("click", () => {
      document.querySelector("#overlay").classList.add("show-overlay");
      document.querySelector(".website-side-nav").classList.add("open-website-side-nav");
    });
    
    document.querySelector("#overlay").addEventListener("click", (event) => {
      document.querySelector(".website-side-nav").classList.remove("open-website-side-nav");
      event.target.classList.remove("show-overlay");
    });

    return;
  };
};

new Layout();
