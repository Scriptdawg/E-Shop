// import { Helpers } from "./helpers.js";
// import { FetchWrap } from "./fetchWrap.js";
class Portfolio {
  constructor() {
    this.#main();
    // this.#hireForm();
  }
  #main = () => {
    document.querySelector("#scroll-down").addEventListener("click", () => {
      window.scrollTo({
        top: document.querySelector("#about-me").offsetTop - 20,
      });
    });
    document.querySelector("#toggle-theme").addEventListener("click", () => {
      document.documentElement.classList.toggle("light-theme");
    });
    const prefersLight = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersLight) {
      document.documentElement.classList.add("light-theme");
    }
  }
  #hireForm = () => {
    const hireForm = document.querySelector("#hire-form");
    hireForm.addEventListener('submit', event => {
      event.preventDefault();
      const hireName = document.querySelector("#hire-name");
      const hireEmail = document.querySelector("#hire-email");
      const hireMessage = document.querySelector("#hire-message");
      const hireObject = {
        "name": hireName.value.trim(),
        "email": hireEmail.value.trim(),
        "message": hireMessage.value.trim(),
      };
      const fetch = new FetchWrap("api/CoreModule-System-Contact/");
      fetch.put("sendMessage", hireObject)
        .then((data) => {
          if (!data) {
           throw new Error("Error");
          }
          hireName.value = '';
          hireEmail.value = '';
          hireMessage.value = '';
          new Helpers().infoMessage("I have received your email. Thank you for expressing an interest! I will send you an email shortly.");
        })
        .catch(error => console.log(error))
        .finally();
    });
  }
}
new Portfolio();