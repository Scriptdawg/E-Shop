let counter = 0;
const carousel = () => {
  const slides = document.querySelectorAll(".slide");
    slides.forEach(slide => {
    slide.classList.add("hide-slide");
  });
  counter ++;
  if(counter > slides.length) counter = 1;
  slides[counter -1].classList.remove("hide-slide");
    setTimeout(() => { carousel(); }, 10000);
};
carousel();
