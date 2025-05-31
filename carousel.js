const text1_options = [
  "Quien soy ? ",
  "Pochita con CSS y HTML Basico ",
  "Card 3 Title",
  "Card 4 Title",
  "Card 5 Title",
];
const text2_options = [
  "Subtitle 1",
  "Subtitle 2",
  "Subtitle 3",
  "Subtitle 4",
  "Subtitle 5",
];
const text3_options = [
  "Me llamo Jorge Palacios , soy un estudiante de tercer año de Computer Science en la Universidad del Valle de Guatemala . Como devoloper Junior me apasiona la programación y el desarrollo web . En mi tiempo libre disfruto aprender nuevas tecnologías y trabajar en proyectos personales.",
  "un proyecto creativo que recrea visualmente al personaje Pochita utilizando unicamente HTML y CSS avanzado. Demuestra cómo es posible lograr ilustraciones, animaciones y disenos detallados solo con CSS, sirviendo tanto como recurso de aprendizaje como una muestra de las capacidades modernas de CSS ",
  "This is a detailed description for card 3. It provides more information about the topic.",
  "This is a detailed description for card 4. It provides more information about the topic.",
  "This is a detailed description for card 5. It provides more information about the topic.",
];
const image_options = [
  "assets/me.jpeg",
  null, // Card 2 will use the Pochita animation instead of an image
  "https://images.unsplash.com/photo-1506073828772-2f85239b6d2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1189&q=80",
  "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
];
let i = 0;

const currentOptionText1 = document.getElementById("current-option-text1");
const currentOptionText2 = document.getElementById("current-option-text2");
const currentOptionText3 = document.getElementById("current-option-text3");
const currentOptionImage = document.getElementById("image");
const optionPrevious = document.getElementById("previous-option");
const optionNext = document.getElementById("next-option");

// Function to update the carousel content
function updateCarousel() {
  console.log("Updating carousel, current index:", i);

  currentOptionText1.innerText = text1_options[i];
  currentOptionText2.innerText = text2_options[i];
  currentOptionText3.classList.add("hidden"); // Hide expanded text when switching cards
  currentOptionText3.classList.remove("expanded");

  if (i === 1) {
    console.log("Injecting Pochita animation for Card 2");
    currentOptionImage.innerHTML = `
      <div class="pochita">
        <div class="eye left"></div>
        <div class="eye right"></div>
        <div class="mouth"></div>
        <div class="mouth2"></div>
        <div class="foot left"></div>
        <div class="foot right"></div>
      </div>
    `;
    currentOptionImage.style.backgroundImage = ""; // Clear background image
  } else {
    console.log("Using background image for other cards");
    currentOptionImage.innerHTML = ""; // Clear Pochita animation
    currentOptionImage.style.backgroundImage = image_options[i]
      ? `url(${image_options[i]})`
      : ""; // Set background image if available
  }
}

// Initialize carousel content
updateCarousel();

// Handle "Next" button click
optionNext.onclick = function () {
  i = (i + 1) % text1_options.length;
  updateCarousel();
};

// Handle "Previous" button click
optionPrevious.onclick = function () {
  i = (i - 1 + text1_options.length) % text1_options.length;
  updateCarousel();
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