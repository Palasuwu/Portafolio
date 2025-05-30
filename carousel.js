const text1_options = [
  "Quien soy ? ",
  "2",
  "3",
  "4",
  "5",
  "6"
];
const text2_options = [
  "1-1",
  "1-2",
  "1-3",
  "1-4",
  "1-5"
];
const text3_options = [
  "This is a detailed description for card 1. It provides more information about the topic.",
  "This is a detailed description for card 2. It provides more information about the topic.",
  "This is a detailed description for card 3. It provides more information about the topic.",
  "This is a detailed description for card 4. It provides more information about the topic.",
  "This is a detailed description for card 5. It provides more information about the topic."
];
const image_options = [
  "https://images.unsplash.com/photo-1524721696987-b9527df9e512?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1190&q=80",
  "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1506073828772-2f85239b6d2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1189&q=80",
  "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
];
var i = 0;
const currentOptionText1 = document.getElementById("current-option-text1");
const currentOptionText2 = document.getElementById("current-option-text2");
const currentOptionText3 = document.getElementById("current-option-text3");
const currentOptionImage = document.getElementById("image");
const carousel = document.getElementById("carousel-wrapper");
const mainMenu = document.getElementById("menu");
const optionPrevious = document.getElementById("previous-option");
const optionNext = document.getElementById("next-option");

currentOptionText1.innerText = text1_options[i];
currentOptionText2.innerText = text2_options[i];
currentOptionImage.style.backgroundImage = "url(" + image_options[i] + ")";

optionNext.onclick = function () {
  i = (i + 1) % text1_options.length;
  currentOptionText1.dataset.nextText = text1_options[i];
  currentOptionText2.dataset.nextText = text2_options[i];
  carousel.classList.add("anim-next");

  setTimeout(() => {
    currentOptionImage.style.backgroundImage = "url(" + image_options[i] + ")";
  }, 455);

  setTimeout(() => {
    currentOptionText1.innerText = text1_options[i];
    currentOptionText2.innerText = text2_options[i];
    currentOptionText3.classList.add("hidden"); // Hide expanded text when switching cards
    currentOptionText3.classList.remove("expanded");
    carousel.classList.remove("anim-next");
  }, 650);
};

optionPrevious.onclick = function () {
  if (i === 0) {
    i = text1_options.length;
  }
  i = i - 1;
  currentOptionText1.dataset.previousText = text1_options[i];
  currentOptionText2.dataset.previousText = text2_options[i];
  carousel.classList.add("anim-previous");

  setTimeout(() => {
    currentOptionImage.style.backgroundImage = "url(" + image_options[i] + ")";
  }, 455);

  setTimeout(() => {
    currentOptionText1.innerText = text1_options[i];
    currentOptionText2.innerText = text2_options[i];
    currentOptionText3.classList.add("hidden"); // Hide expanded text when switching cards
    currentOptionText3.classList.remove("expanded");
    carousel.classList.remove("anim-previous");
  }, 650);
};

// Handle card click to toggle detailed description
currentOptionText1.onclick = function () {
  if (currentOptionText3.classList.contains("hidden")) {
    currentOptionText3.innerText = text3_options[i];
    currentOptionText3.classList.remove("hidden");
    currentOptionText3.classList.add("expanded");
  } else {
    currentOptionText3.classList.add("hidden");
    currentOptionText3.classList.remove("expanded");
  }
};