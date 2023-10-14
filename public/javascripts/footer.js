class Footer {
  constructor() {
    this.scrollTop = document.querySelector("#btn-scroll-top");
    this.#main();
  };
  #main = () => {
    document.querySelector("#window-size").innerHTML = window.innerWidth + "px x " + window.innerHeight + "px";
    this.scrollTop.addEventListener("click", event => {
      document.body.scrollTop = 0; // for Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
    window.onscroll = () => this.#scroll();
    window.onresize = () => this.#resize();
  };
  #scroll = () => {
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
      this.scrollTop.style.display = "block";
    } else {
      this.scrollTop.style.display = "none";
    }
  };
  #resize = () => {
    document.querySelector("#window-size").innerHTML = window.innerWidth + "px x " + window.innerHeight + "px";
  };
};
new Footer();
