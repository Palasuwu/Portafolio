const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL no disponible');
  throw new Error('WebGL no disponible');
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouseX = 0, mouseY = 0;
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) / rect.width;
  mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
});

// Cargar shaders externos
async function loadShaderSource(url) {
  const res = await fetch(url);
  return res.text();
}

async function init() {
  const vertexSrc = await loadShaderSource('shader.vert');
  const fragmentSrc = await loadShaderSource('shader.frag');

  const vs = compileShader(gl.VERTEX_SHADER, vertexSrc);
  const fs = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);

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

  function render(t) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeLoc, t * 0.001);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform2f(mouseLoc, mouseX, mouseY);
    gl.uniform1f(radiusLoc, 0.15);
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
