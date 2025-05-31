const text1_options = [
  "Quien soy ? ",
  "Pochita con CSS y HTML Basico ",
  "API conectada a PostgreSQL con Python y Flask ",
  "Recomendaciones de Musica con arboles binarios ",
  "Card 5 Title",
];
const text2_options = [
  { text: "Learn more about Pochita", url: "https://example.com/pochita" },
  { text: "Learn more about Pochita", url: "https://example.com/pochita" },
  { text: "API Documentation", url: "https://example.com/api-docs" },
  { text: "Spotify Recommendations", url: "https://example.com/spotify" },
  "Subtitle 5",
];
const text3_options = [
  "Me llamo Jorge Palacios , soy un estudiante de tercer año de Computer Science en la Universidad del Valle de Guatemala . Como devoloper Junior me apasiona la programación y el desarrollo web . En mi tiempo libre disfruto aprender nuevas tecnologías y trabajar en proyectos personales.",
  "Un proyecto creativo que recrea visualmente al personaje Pochita utilizando unicamente HTML y CSS avanzado. Demuestra cómo es posible lograr ilustraciones, animaciones y disenos detallados solo con CSS, sirviendo tanto como recurso de aprendizaje como una muestra de las capacidades modernas de CSS ",
  "API para gestionar tickets de incidentes de dispositivos en un entorno laboral, conectada a PostgreSQL. Incluye métodos GET, POST, PUT y DELETE para consultar, crear, actualizar y eliminar incidentes",
  "Para este proyecto se utilizó el API de Spotify para obtener recomendaciones de música basadas en un árbol binario. El Arbol Y base de Datos fue implementado usando Neo4j , una plataforma de base de datos graficos ",
  "This is a detailed description for card 5. It provides more information about the topic.",
];
const image_options = [
  "assets/me.jpeg",
  null, // Card 2 will use the Pochita animation instead of an image
  "assets/API.png",
  "assets/spot.png",
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

  // Render text2_options as plain text or a link
  if (typeof text2_options[i] === "object" && text2_options[i].url) {
    currentOptionText2.innerHTML = `<a href="${text2_options[i].url}" target="_blank">${text2_options[i].text}</a>`;
  } else {
    currentOptionText2.innerText = text2_options[i];
  }

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
    currentOptionImage.style.display = "flex"; // Center the Pochita animation
  } else {
    console.log("Using background image for other cards");
    currentOptionImage.innerHTML = ""; // Clear Pochita animation
    currentOptionImage.style.backgroundImage = image_options[i]
      ? `url(${image_options[i]})`
      : ""; // Set background image if available
    currentOptionImage.style.display = "block"; // Restore default display for other cards
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

// Add keyboard navigation for carousel
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    // Navigate to the next card
    i = (i + 1) % text1_options.length;
    updateCarousel();
  } else if (event.key === "ArrowLeft") {
    // Navigate to the previous card
    i = (i - 1 + text1_options.length) % text1_options.length;
    updateCarousel();
  }
});