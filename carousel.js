// Updated carousel.js for scrollable sections
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  const dots = document.querySelectorAll('.dot');
  const sectionsContainer = document.getElementById('sections-container');

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
  
  sectionsContainer.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < scrollThrottle) return;
    lastScrollTime = now;
    
    updateActiveSection();
  });

  // Update active section based on scroll position
  function updateActiveSection() {
    const scrollPosition = sectionsContainer.scrollTop;
    const windowHeight = sectionsContainer.clientHeight;

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
      }
    });
  }

  // Initialize
  updateActiveSection();
  
});