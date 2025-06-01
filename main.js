const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL not available');
  throw new Error('WebGL not available');
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) / rect.width;
  mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
});

async function loadShaderSource(url) {
  const res = await fetch(url);
  return res.text();
}

async function init() {
  const vsSrc = await loadShaderSource('shader.vert');
  const fsSrc = await loadShaderSource('shader.frag');

  const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc);

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const posLoc = gl.getAttribLocation(program, 'a_position');
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posLoc);

  const timeLoc = gl.getUniformLocation(program, 'iTime');
  const resLoc = gl.getUniformLocation(program, 'iResolution');
  const mouseLoc = gl.getUniformLocation(program, 'iMouse');
  const radiusLoc = gl.getUniformLocation(program, 'hoverRadius');
  const colour1Loc = gl.getUniformLocation(program, 'COLOUR_1');
  const colour2Loc = gl.getUniformLocation(program, 'COLOUR_2');
  const colour3Loc = gl.getUniformLocation(program, 'COLOUR_3');
  const spinSpeedLoc = gl.getUniformLocation(program, 'SPIN_SPEED');
  const lightingLoc = gl.getUniformLocation(program, 'LIGHTING');

  // Initial values for shader constants
  let hoverRadius = 0.0;
  let colour1 = [0.0, 0.0, 1.0, 0.9];
  let colour2 = [0.1, 0.2, 0.0, 6.0];
  let colour3 = [0.0, 0.1, 0.0, 0.0];
  let spinSpeed = 1.0;
  let lighting = 1.0;

  // Update shader constants from sliders
  document.getElementById('hoverRadius').addEventListener('input', (e) => {
    hoverRadius = parseFloat(e.target.value);
  });

  document.getElementById('colour1R').addEventListener('input', (e) => {
    colour1[0] = parseFloat(e.target.value);
  });

  document.getElementById('colour1G').addEventListener('input', (e) => {
    colour1[1] = parseFloat(e.target.value);
  });

  document.getElementById('colour1B').addEventListener('input', (e) => {
    colour1[2] = parseFloat(e.target.value);
  });

  document.getElementById('spinSpeed').addEventListener('input', (e) => {
    spinSpeed = parseFloat(e.target.value);
  });

  document.getElementById('lighting').addEventListener('input', (e) => {
    lighting = parseFloat(e.target.value);
  });

  // Event listeners for "Next" and "Previous" buttons
  const optionNext = document.getElementById('next-option');
  const optionPrevious = document.getElementById('previous-option');
  let currentIndex = 0;

  optionNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % 5; // Assuming 5 cards
    startTransition(currentIndex);
  });

  optionPrevious.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + 5) % 5; // Assuming 5 cards
    startTransition(currentIndex);
  });

  // Function to update shader uniforms based on the current card index
  function updateShaderUniforms(index) {
    // --------------- Initial Shader Values ---------------
    // These values correspond to the initial state of the shader (before any button interaction).
    switch (index) {
      case 0: // Card 1: "Quien soy ?"
      let colour1 = [0.0, 0.6, 0.8, 1.0];
      let colour2 = [0.2, 0.8, 0.4, 1.0];
      let colour3 = [0.8, 0.4, 0.2, 1.0];
      let spinSpeed = 1.0;
      let lighting = 1.0;
        break;
       

      // --------------- Card 2: "Card 2 Title" ---------------
      case 1:
        colour1 = [0.4, 0.6, 0.8, 1.0]; // Blue tone
        colour2 = [0.8, 0.8, 0.2, 1.0]; // Yellow tone
        colour3 = [0.2, 0.4, 0.6, 1.0]; // Dark blue tone
        spinSpeed = 2.0; // Faster spin speed
        lighting = 0.8; // Slightly dimmer lighting
        break;

      // --------------- Card 3: "Card 3 Title" ---------------
      case 2:
        colour1 = [0.8, 0.2, 0.4, 1.0]; // Red tone
        colour2 = [0.4, 0.8, 0.6, 1.0]; // Teal tone
        colour3 = [0.6, 0.2, 0.8, 1.0]; // Purple tone
        spinSpeed = 3.0; // Moderate spin speed
        lighting = 1.2; // Slightly brighter lighting
        break;

      // --------------- Card 4: "Card 4 Title" ---------------
      case 3:
        colour1 = [0.2, 0.4, 0.6, 1.0]; // Cyan tone
        colour2 = [0.6, 0.8, 0.2, 1.0]; // Lime tone
        colour3 = [0.8, 0.6, 0.4, 1.0]; // Brown tone
        spinSpeed = 4.0; // Moderate spin speed
        lighting = 1.5; // Bright lighting
        break;

      // --------------- Card 5: "Card 5 Title" ---------------
      case 4:
        colour1 = [0.6, 0.8, 0.2, 1.0]; // Lime tone
        colour2 = [0.2, 0.6, 0.8, 1.0]; // Cyan tone
        colour3 = [0.4, 0.2, 0.6, 1.0]; // Purple tone
        spinSpeed = 5.0; // Moderate spin speed
        lighting = 1.8; // Bright lighting
        break;
    }
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function interpolateArray(startArray, endArray, t) {
    return startArray.map((start, index) => lerp(start, endArray[index], t));
  }

  let transitionStartTime = null;
  let transitionDuration = 3500; // Increased duration for smoother transitions
  let transitioning = false;
  let startValues = {};
  let endValues = {};

  function startTransition(index) {
    transitioning = true;
    transitionStartTime = performance.now();

    // Save the current values as the starting point
    // --------------- Starting Values ---------------
    startValues = {
      colour1: [...colour1],
      colour2: [...colour2],
      colour3: [...colour3],
      spinSpeed: spinSpeed,
      lighting: lighting,
    };

    // Set the target values based on the new card index
    switch (index) {
      // --------------- Card 1: "Quien soy ?" ---------------
      case 0:
        endValues = { 
          colour1 : [0.0, 0.6, 0.8, 1.0],
          colour2 : [0.2, 0.8, 0.4, 1.0],
          colour3 : [0.8, 0.4, 0.2, 1.0],
          spinSpeed :1.0,
          lighting : 1.0
        };
        break;

      // --------------- Card 2: "Card 2 Title" ---------------
      case 1:
        endValues = {
          colour1: [0.4, 0.6, 0.8, 1.0], // Blue tone
          colour2: [0.8, 0.8, 0.2, 1.0], // Yellow tone
          colour3: [0.2, 0.4, 0.6, 1.0], // Dark blue tone
          spinSpeed: 1.0, // Faster spin speed
          lighting: 0.8, // Slightly dimmer lighting
        };
        break;

      // --------------- Card 3: "Card 3 Title" ---------------
      case 2:
        endValues = {
          colour1: [0.8, 0.2, 0.4, 1.0], // Red tone
          colour2: [0.4, 0.8, 0.6, 1.0], // Teal tone
          colour3: [0.6, 0.2, 0.8, 1.0], // Purple tone
          spinSpeed: 3.0, // Slow spin speed
          lighting: 1.0, // Slightly brighter lighting
        };
        break;

      // --------------- Card 4: "Card 4 Title" ---------------
      case 3:
        endValues = {
          colour1: [0.0, 0.4, 0.6, 1.0], // Cyan tone
          colour2: [0.6, 0.8, 0.2, 1.0], // Lime tone
          colour3: [0.8, 0.6, 0.4, 1.0], // Brown tone
          spinSpeed: 4.0, // Moderate spin speed
          lighting: 0.5, // Dim lighting
        };
        break;

      // --------------- Card 5: "Card 5 Title" ---------------
      case 4:
        endValues = {
          colour1: [0.6, 0.8, 0.2, 1.0], // Lime tone
          colour2: [0.2, 0.6, 0.8, 1.0], // Cyan tone
          colour3: [0.4, 0.2, 0.6, 1.0], // Purple tone
          spinSpeed: 5.0, // Moderate spin speed
          lighting: 1.0, // Normal lighting
        };
        break;
    }
  }

  function updateTransition(time) {
    if (transitioning) {
      const elapsedTime = time - transitionStartTime;
      const t = Math.min(elapsedTime / transitionDuration, 1); // Normalize time to [0, 1]
      const easedT = easeInOut(t); // Apply easing function

      // Interpolate values
      colour1 = interpolateArray(startValues.colour1, endValues.colour1, easedT);
      colour2 = interpolateArray(startValues.colour2, endValues.colour2, easedT);
      colour3 = interpolateArray(startValues.colour3, endValues.colour3, easedT);
      spinSpeed = lerp(startValues.spinSpeed, endValues.spinSpeed, easedT);
      lighting = lerp(startValues.lighting, endValues.lighting, easedT);

      // End transition when complete
      if (t === 1) {
        transitioning = false;
      }
    }
  }

  function render(time) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update transition if active
    updateTransition(time);

    gl.uniform1f(timeLoc, time * 0.001);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform2f(mouseLoc, mouseX, mouseY);
    gl.uniform1f(radiusLoc, hoverRadius); // Update hover radius
    gl.uniform4fv(colour1Loc, colour1); // Update base color 1
    gl.uniform4fv(colour2Loc, colour2); // Update base color 2
    gl.uniform4fv(colour3Loc, colour3); // Update base color 3
    gl.uniform1f(spinSpeedLoc, spinSpeed); // Update spin speed
    gl.uniform1f(lightingLoc, lighting); // Update lighting
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  render();
}

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

init();

document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-controls');
  const controls = document.querySelector('.controls');

  let controlsVisible = false;

  toggleButton.addEventListener('click', () => {
    controlsVisible = !controlsVisible;
    toggleControlsVisibility();
  });

  // Add event listener for spacebar to toggle controls
  document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
      event.preventDefault(); // Prevent default spacebar scrolling behavior
      controlsVisible = !controlsVisible;
      toggleControlsVisibility();
    }
  });

  function toggleControlsVisibility() {
    if (controlsVisible) {
      controls.style.display = 'block';
      toggleButton.textContent = 'Hide Controls';
    } else {
      controls.style.display = 'none';
      toggleButton.textContent = 'Show Controls';
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const controls = document.querySelector('.controls'); // Select the controls element

  let controlsVisible = false; // Track visibility state

  // Add event listener for spacebar to toggle controls
  document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
      event.preventDefault(); // Prevent default spacebar scrolling behavior
      controlsVisible = !controlsVisible; // Toggle visibility state
      toggleControlsVisibility();
    }
  });

  function toggleControlsVisibility() {
    if (controlsVisible) {
      controls.style.display = 'block'; // Show controls
    } else {
      controls.style.display = 'none'; // Hide controls
    }
  }
});
