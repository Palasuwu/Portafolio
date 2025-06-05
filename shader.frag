precision highp float;

varying vec2 v_texCoord;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float hoverRadius;

// === 🎯 Constantes shader PRINCIPAL (now uniforms) ===
uniform vec4 COLOUR_1;
uniform vec4 COLOUR_2;
uniform vec4 COLOUR_3;
uniform float SPIN_SPEED;
uniform float LIGHTING;

// === 🌀 Constantes shader HOVER ===
#define HOVER_COLOUR_1 vec4(0.9, 0.4, 0.6, 1.0)
#define HOVER_COLOUR_2 vec4(0.2, 0.7, 0.9, 1.0)
#define HOVER_COLOUR_3 vec4(0.1, 0.0, 0.2, 1.0)
#define HOVER_SPIN_SPEED 1.0
#define HOVER_LIGHTING 0.9

// === ⚙️ Constantes generales ===
#define SPIN_ROTATION 0.60
#define OFFSET vec2(0.0)
#define CONTRAST 3.5
#define SPIN_AMOUNT 0.2
#define PIXEL_FILTER 3500.0
#define SPIN_EASE 0.35
#define IS_ROTATE true
#define PARTICLE_COUNT 120
#define PARTICLE_SIZE 0.0001
#define PARTICLE_COLOR vec4(1.0, 1.0, 1.0, 1.0)

// === Función para números aleatorios ===
float rand(vec2 co) {
    return fract(sin(dot(co, vec2(13.989, 78.233))) * 43758.5453);
}

// === Función que genera el fondo dinámico ===
vec4 generateBackground(vec2 screenSize, vec2 screen_coords, vec4 c1, vec4 c2, vec4 c3, float light, float spinSpeed) {
    float pixel_size = length(screenSize.xy) / PIXEL_FILTER;
    vec2 uv = (floor(screen_coords.xy*(1.0/pixel_size))*pixel_size - 0.5*screenSize.xy)/length(screenSize.xy) - OFFSET;
    float uv_len = length(uv);

    float speed = (SPIN_ROTATION * SPIN_EASE * 0.2);
    if (IS_ROTATE) {
       speed = iTime * speed;
    }
    speed += 302.2;
    float new_pixel_angle = atan(uv.y, uv.x) + speed - SPIN_EASE * 20.0 * (1.0 * SPIN_AMOUNT * uv_len + (1.0 - 1.0 * SPIN_AMOUNT));
    vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

    uv *= 30.0;
    speed = iTime * spinSpeed;

    vec2 uv2 = vec2(uv.x + uv.y);
    for (int i = 0; i < 5; i++) {
        uv2 += sin(max(uv.x, uv.y)) + uv;
        uv  += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
        uv  -= 1.0 * cos(uv.x + uv.y) - 1.0 * sin(uv.x * 0.711 - uv.y);
    }

    float contrast_mod = (0.25 * CONTRAST + 0.5 * SPIN_AMOUNT + 1.2);
    float paint_res = min(2.0, max(0.0, length(uv) * (0.035) * contrast_mod));
    float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
    float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
    float c3p = 1.0 - min(1.0, c1p + c2p);
    float lighting = (light - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + light * max(c2p * 5.0 - 4.0, 0.0);

    return (0.3 / CONTRAST) * c1 +
           (1.0 - 0.3 / CONTRAST) * (c1 * c1p + c2 * c2p + vec4(c3.rgb, c3p * c1.a)) +
           lighting;
}

void main() {
    vec2 fragCoord = v_texCoord * iResolution.xy;

    // Fondo normal
    vec4 background1 = generateBackground(iResolution.xy, fragCoord,
        COLOUR_1, COLOUR_2, COLOUR_3, LIGHTING, SPIN_SPEED);

    // Fondo hover
    vec4 background2 = generateBackground(iResolution.xy, fragCoord,
        HOVER_COLOUR_1, HOVER_COLOUR_2, HOVER_COLOUR_3, HOVER_LIGHTING, HOVER_SPIN_SPEED);

    // Hover circular ajustado por aspecto
    vec2 aspect = vec2(iResolution.x / iResolution.y, 1.0);
    float dist = length((v_texCoord - iMouse) * aspect);
    float hoverStrength = 1.0 - smoothstep(hoverRadius, hoverRadius + 0.05, dist);

    vec4 background = mix(background1, background2, hoverStrength);

    // Partículas
    for (int i = 0; i < PARTICLE_COUNT; i++) {
        vec2 pos = vec2(rand(vec2(float(i), 0.0)), rand(vec2(0.0, float(i))));
        pos = mod(pos + vec2(iTime * 0.05 * rand(vec2(float(i) * 2.0, 0.0))), 1.0);
        float lifeFactor = mod(iTime, 5.0) / 5.0;
        if (length(v_texCoord - pos) < PARTICLE_SIZE * lifeFactor) {
            background += PARTICLE_COLOR * (0.5 + 0.5 * sin(iTime * 2.0));
        }
    }

    gl_FragColor = background;
}
