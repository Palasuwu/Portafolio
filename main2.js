const canvas = document.getElementById('webgl-canvas2');
const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL no disponible');
  throw new Error('WebGL no disponible');
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.documentElement.scrollHeight; // canvas infinito
  gl.viewport(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 🖱 Mouse tracking corregido (sin interferencia del borde)
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) / rect.width;
  mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
});


// 📦 Shader setup
async function loadShaderSource(url) {
  const res = await fetch(url);
  return res.text();
}

async function init() {
  const vsSrc = await loadShaderSource('shader1.vert');
  const fsSrc = await loadShaderSource('shader1.frag');

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

  function render(time) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeLoc, time * 0.001);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform2f(mouseLoc, mouseX, mouseY);
    gl.uniform1f(radiusLoc, 0.15); // hover radius
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

/* CSS styles */
const style = document.createElement('style');
style.textContent = `
html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: black;
    height: 100%; /* Ensure the body spans the full height */
}

.shader-container {
    position: relative;
    width: 100%;
    height: 100vh; /* Set height to the viewport height */
    z-index: 0;
    pointer-events: none; /* Allow interactions to pass through */
}

canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Ensure the canvas does not block interactions */
}

.content {
    position: relative;
    z-index: 2; /* Ensure it is above the shader */
    color: white;
    padding: 3rem;
    height: 100vh; /* Set height to the viewport height */
}
`;
document.head.appendChild(style);
