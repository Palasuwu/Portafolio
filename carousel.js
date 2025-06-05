// Updated carousel.js for scrollable sections
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  const dots = document.querySelectorAll('.dot');
  const progressBar = document.getElementById('progress-bar');
  const shaderParams = [
    // About section
    { 
      colour1: [0.0, 0.6, 0.8, 1.0],
      colour2: [0.2, 0.8, 0.4, 1.0],
      colour3: [0.8, 0.4, 0.2, 1.0],
      spinSpeed: 1.0,
      lighting: 9.0
    },
    // Pochita section
    { 
      colour1: [0.4, 0.6, 0.8, 1.0],
      colour2: [0.8, 0.8, 0.2, 1.0],
      colour3: [0.2, 0.4, 0.6, 1.0],
      spinSpeed: 1.0,
      lighting: 0.8
    },
    // API section
    { 
      colour1: [0.8, 0.2, 0.4, 1.0],
      colour2: [0.4, 0.8, 0.6, 1.0],
      colour3: [0.6, 0.2, 0.8, 1.0],
      spinSpeed: 3.0,
      lighting: 1.0
    },
    // Music section
    { 
      colour1: [0.0, 0.4, 0.6, 1.0],
      colour2: [0.6, 0.8, 0.2, 1.0],
      colour3: [0.8, 0.6, 0.4, 1.0],
      spinSpeed: 4.0,
      lighting: 0.5
    },
    // Skills section
    { 
      colour1: [0.6, 0.8, 0.2, 1.0],
      colour2: [0.2, 0.6, 0.8, 1.0],
      colour3: [0.4, 0.2, 0.6, 1.0],
      spinSpeed: 5.0,
      lighting: 1.0
    },
    // Contact section
    { 
      colour1: [0.9, 0.4, 0.6, 1.0],
      colour2: [0.2, 0.7, 0.9, 1.0],
      colour3: [0.1, 0.0, 0.2, 1.0],
      spinSpeed: 20.0,
      lighting: 0.9
    }
  ];

  // Set up dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const sectionId = dot.dataset.section;
      const section = document.getElementById(sectionId);
      section.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Scroll detection
  let lastScrollTime = 0;
  const scrollThrottle = 500; // ms
  
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < scrollThrottle) return;
    lastScrollTime = now;
    
    updateActiveSection();
  });

  // Update active section based on scroll position
  function updateActiveSection() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // Update progress bar
    const totalHeight = document.documentElement.scrollHeight - windowHeight;
    const progress = (scrollPosition / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;

    // Find active section
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop - windowHeight * 0.3 && 
          scrollPosition < sectionTop + sectionHeight - windowHeight * 0.3) {
        console.log(`Active section index: ${index}`); // Debugging
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');

        // Update shader
        updateShader(shaderParams[index]);
      }
    });
  }

  // Initialize
  updateActiveSection();
  
  // Shader update function
  function updateShader(params) {
    console.log('Dispatching shader-update event:', params); // Debugging
    window.dispatchEvent(new CustomEvent('shader-update', {
      detail: params
    }));
  }
  
  // Full-screen image viewer
  document.querySelectorAll('.image-content img').forEach(img => {
    img.addEventListener('click', () => {
      showFullView(img.src);
    });
  });
  
  function showFullView(imageUrl) {
    // Existing implementation
  }
});