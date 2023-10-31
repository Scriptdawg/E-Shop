let counter = 0;
const carousel = () => {
  const slides = document.querySelectorAll(".slide");
    slides.forEach(slide => {
    slide.classList.add("hide-slide");
  });
  counter ++;
  if(counter > slides.length) counter = 1;
  slides[counter -1].classList.remove("hide-slide");
  setTimeout(() => { carousel(); }, 6000);
};
carousel();

let count = 0;
const swipe = () => {
  const slides = document.querySelectorAll(".child");
    slides.forEach(slide => {
    slide.classList.remove("orderFirst");
  });
  count ++;
  if(count > slides.length) count = 1;
  slides[count -1].classList.add("orderFirst");
  setTimeout(() => { swipe(); }, 10000);
};
swipe();