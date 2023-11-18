// Password show/hide google font eyeball - 'visibility'
const elements = document.querySelectorAll('[type="password"]');
elements.forEach(function (elem) {
  elem.parentNode.querySelector('i').addEventListener('click', function () {
    if (elem.type === "password") {
      elem.type = "text";
      this.innerText = "visibility_off";
    } else {
      elem.type = "password";
      this.innerText = "visibility";
    }
    setTimeout(x = () => {
      elem.type = "password";
      this.innerText = "visibility";
    }, 12000);
  });
});
