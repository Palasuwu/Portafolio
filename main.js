// Updated main.js
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

  // Initial values
  let hoverRadius = 0.0001;
  let colour1 = [0.0, 0.6, 0.8, 1.0];
  let colour2 = [0.2, 0.8, 0.4, 1.0];
  let colour3 = [0.8, 0.4, 0.2, 1.0];
  let spinSpeed = 1.0;
  let lighting = 9.0;

  // Shader parameters for each card
  const shaderParams = [
    { colour1: [0.0, 0.6, 0.8, 1.0], colour2: [0.2, 0.8, 0.4, 1.0], colour3: [0.8, 0.4, 0.2, 1.0], spinSpeed: 1.0, lighting: 9.0 },
    { colour1: [0.4, 0.6, 0.8, 1.0], colour2: [0.8, 0.8, 0.2, 1.0], colour3: [0.2, 0.4, 0.6, 1.0], spinSpeed: 1.0, lighting: 0.8 },
    { colour1: [0.8, 0.2, 0.4, 1.0], colour2: [0.4, 0.8, 0.6, 1.0], colour3: [0.6, 0.2, 0.8, 1.0], spinSpeed: 2.0, lighting: 1.0 },
    { colour1: [0.0, 0.4, 0.6, 1.0], colour2: [0.6, 0.8, 0.2, 1.0], colour3: [0.8, 0.6, 0.4, 1.0], spinSpeed: 3.0, lighting: 0.5 },
    { colour1: [0.6, 0.8, 0.2, 1.0], colour2: [0.2, 0.6, 0.8, 1.0], colour3: [0.4, 0.2, 0.6, 1.0], spinSpeed: 4.0, lighting: 1.0 },
    { colour1: [0.6, 0.8, 0.2, 1.0], colour2: [0.2, 0.6, 0.8, 1.0], colour3: [0.4, 0.2, 0.6, 1.0], spinSpeed: 5.0, lighting: 1.0 },
  ];

  // IntersectionObserver to detect visible cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.index, 10);
        startTransition(shaderParams[index]);
      }
    });
  }, { threshold: 0.5 });

  // Observe all cards
  const cards = document.querySelectorAll('.section');
  cards.forEach((card, index) => {
    card.dataset.index = index; // Assign index to each card
    observer.observe(card);
  });

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
  let transitionDuration = 2000;
  let transitioning = false;
  let startValues = {};
  let endValues = {};

  function startTransition(params) {
    console.log('Starting shader transition with params:', params); // Debugging
    transitioning = true;
    transitionStartTime = performance.now();

    startValues = {
      colour1: [...colour1],
      colour2: [...colour2],
      colour3: [...colour3],
      spinSpeed: spinSpeed,
      lighting: lighting,
    };

    endValues = params;
  }

  function updateTransition(time) {
    if (transitioning) {
      const elapsedTime = time - transitionStartTime;
      const t = Math.min(elapsedTime / transitionDuration, 1);
      const easedT = easeInOut(t);

      colour1 = interpolateArray(startValues.colour1, endValues.colour1, easedT);
      colour2 = interpolateArray(startValues.colour2, endValues.colour2, easedT);
      colour3 = interpolateArray(startValues.colour3, endValues.colour3, easedT);
      spinSpeed = lerp(startValues.spinSpeed, endValues.spinSpeed, easedT);
      lighting = lerp(startValues.lighting, endValues.lighting, easedT);

      if (t === 1) {
        transitioning = false;
      }
    }
  }

  function render(time) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    updateTransition(time);

    gl.uniform1f(timeLoc, time * 0.001);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform2f(mouseLoc, mouseX, mouseY);
    gl.uniform1f(radiusLoc, hoverRadius);
    gl.uniform4fv(colour1Loc, colour1);
    gl.uniform4fv(colour2Loc, colour2);
    gl.uniform4fv(colour3Loc, colour3);
    gl.uniform1f(spinSpeedLoc, spinSpeed);
    gl.uniform1f(lightingLoc, lighting);
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