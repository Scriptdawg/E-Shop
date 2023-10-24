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
    this.scrollTop.addEventListener("click", event => {
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
    const leftButton = document.querySelector("#left-button");
    leftButton.addEventListener("click", event => {
      document.body.scrollTop = 0; // for Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      document.querySelector("#left").classList.toggle("open-left");
    });

    window.onclick = event => {
      if (!event.target.matches(".bi-list")
        && !event.target.matches(".website-top-nav")) {
        document.querySelector("#left").classList.remove("open-left");
      };
    }
  
    return;
  };
};

new Layout();
