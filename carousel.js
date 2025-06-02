/* No c porque no se actualiza en el git :( */
const text1_options = [
  "¿ Quien soy ? ",
  "Pochita con CSS y HTML Basico ",
  "API conectada a PostgreSQL con Python y Flask ",
  "Recomendaciones de Musica con arboles binarios ",
  "Sección de habilidades",
  " Estas interesado en mi experiencia ? "
];
const text2_options = [
  { text: "Contactame" , url:"https://www.instagram.com/pala_sales/"},
  { text: "Repo de Pochita ", url: "https://github.com/Palasuwu/LA4Css" },
  { text: "Repo del API Incidentes ", url: "https://github.com/Palasuwu/ejercicio-API?tab=readme-ov-file" },
  { text: "Repo del Proyecto ", url: "https://github.com/Charly2440/Recomendation-Engine-Proyecto-2?tab=readme-ov-file" },
  {text: "Stats de Github ",url: " https://github.com/Palasuwu/Palasuwu/tree/main"},
  {text:"CV",url:"/cv.pdf"}

];
const text3_options = [
  "Me llamo Jorge Palacios , soy un estudiante de tercer año de Computer Science en la Universidad del Valle de Guatemala . Como devoloper Junior me apasiona la programación y el desarrollo web . En mi tiempo libre disfruto aprender nuevas tecnologías y trabajar en proyectos personales.",
  "Un proyecto creativo que recrea visualmente al personaje Pochita utilizando unicamente HTML y CSS avanzado. Demuestra cómo es posible lograr ilustraciones, animaciones y disenos detallados solo con CSS, sirviendo tanto como recurso de aprendizaje como una muestra de las capacidades modernas de CSS ",
  "API para gestionar tickets de incidentes de dispositivos en un entorno laboral, conectada a PostgreSQL. Incluye métodos GET, POST, PUT y DELETE para consultar, crear, actualizar y eliminar incidentes",
  "Para este proyecto se utilizó el API de Spotify para obtener recomendaciones de música basadas en un árbol binario. El Arbol Y base de Datos fue implementado usando Neo4j , una plataforma de base de datos graficos ",
  "Entre en lo que mas domino son HTML , CSS Y JavaScript para creacion de frontends , tambien tengo experiencia en base de datos relacionales como SQL y la integracion de las mismas para crear API's .",
  " "
];
const image_options = [
  "assets/me.jpeg",
  null, // Card 2 will use the Pochita animation instead of an image
  "assets/API.png",
  "assets/spot.png",
  "assets/stats.png",
  "assets/cv1.png" 

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

// Function to create and display the full-view window
function showFullView(imageUrl) {
  // Create the overlay container
  const overlay = document.createElement('div');
  overlay.id = 'image-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(255, 255, 255, 0.2)';
  overlay.style.backdropFilter = 'blur(10px)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  // Create the image element
  const fullImage = document.createElement('img');
  fullImage.src = imageUrl;
  fullImage.style.maxWidth = '90%';
  fullImage.style.maxHeight = '90%';
  fullImage.style.borderRadius = '10px';
  fullImage.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';

  // Create the close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '20px';
  closeButton.style.right = '20px';
  closeButton.style.background = 'rgba(255, 255, 255, 0.03)';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '50%';
  closeButton.style.padding = '10px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '16px';
  closeButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';

  // Add event listener to close the overlay
  closeButton.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  // Append elements to the overlay
  overlay.appendChild(fullImage);
  overlay.appendChild(closeButton);

  // Append the overlay to the body
  document.body.appendChild(overlay);
}

// Add click event listener to the image container
currentOptionImage.addEventListener('click', () => {
  const imageUrl = image_options[i];
  if (imageUrl) {
    showFullView(imageUrl);
  }
});