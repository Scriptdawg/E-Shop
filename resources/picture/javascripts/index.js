document.querySelector("#javascript").innerHTML = `
  Hello from index.js!
`
// carousel
var myIndex = 0;
carousel();
function carousel() {
  var i;
  var x = document.getElementsByClassName("slide");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  myIndex++;
  if (myIndex > x.length) { myIndex = 1 }
  x[myIndex - 1].style.display = "block";
  document.getElementById("picNumber").innerHTML = myIndex + ' of ' + x.length;
  myVar = setTimeout(carousel, 5000); // Change image every 5 seconds
}
function prevSlide() {
  clearTimeout(myVar);
  var i;
  var x = document.getElementsByClassName("slide");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  myIndex--;
  if (myIndex < 1) { myIndex = x.length }
  x[myIndex - 1].style.display = "block";
  document.getElementById("picNumber").innerHTML = myIndex + ' of ' + x.length;
  myVar = setTimeout(carousel, 6000); // Start carousel image change in 6 seconds
}
function nextSlide() {
  clearTimeout(myVar);
  var i;
  var x = document.getElementsByClassName("slide");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  myIndex++;
  if (myIndex > x.length) { myIndex = 1 }
  x[myIndex - 1].style.display = "block";
  document.getElementById("picNumber").innerHTML = myIndex + ' of ' + x.length;
  myVar = setTimeout(carousel, 6000); // Start carousel image change in 6 seconds
}
function pauseSlide(obj) {
  clearTimeout(myVar);
  myVar = setTimeout(carousel, 12000); // Pause carousel for 12 seconds
}