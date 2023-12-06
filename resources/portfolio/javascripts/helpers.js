export class Helpers {
  constructor() {
    this.loader = document.querySelector(".loader");
    this.infoMsgContainer = document.querySelector(".info-message-container");
    this.infoMsg = document.querySelector(".info-message");
    this.errorMsgContainer = document.querySelector(".error-message-container");
    this.errorMsg = document.querySelector(".error-message");
  }
  static getDate() {
    const date = new Date();
    return `The date is: ${date.toDateString()}`;
  }
  infoMessage = text => {
    this.infoMsg.textContent = text;
    this.infoMsgContainer.classList.add("visible-message");
    setTimeout(() => {
      this.infoMsgContainer.classList.remove("visible-message");
    }, 8000);
    return this;
  }
  errorMessage = text => {
    this.errorMsg.textContent = text;
    this.infoMsgContainer.classList.remove("visible-message");
    this.errorMsgContainer.classList.add("visible-message");
  }
  startLoader = () => this.loader.classList.add("show-loader");
  stopLoader = () => this.loader.classList.remove("show-loader");
  getRndInteger = (min, max) => Math.ceil(Math.random() * (max - min));
}