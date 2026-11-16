#version 150

uniform sampler2D DiffuseSampler;
uniform vec2 OutSize;
uniform float Time;
uniform vec3 Tint;
uniform float Desat;
uniform float Vignette;
uniform vec3 VigColor;
uniform float Haze;
uniform float Aberration;
uniform float Grain;

in vec2 texCoord;
out vec4 fragColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float t = Time * 6.2831853;
    vec2 uv = texCoord;
    float rise = 0.35 + 0.65 * (1.0 - uv.y);
    uv.x += sin(uv.y * 52.0 + t * 3.0) * Haze * rise + sin(uv.y * 131.0 - t * 5.0) * Haze * 0.35;
    uv.y += cos(uv.x * 41.0 + t * 2.0) * Haze * 0.45;
    vec2 dir = uv - 0.5;
    vec3 col;
    col.r = texture(DiffuseSampler, uv + dir * Aberration).r;
    col.g = texture(DiffuseSampler, uv).g;
    col.b = texture(DiffuseSampler, uv - dir * Aberration).b;
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(luma), Desat) * Tint;
    float v = smoothstep(0.32, 0.92, length(dir * vec2(1.15, 1.0)) * 1.3);
    col = mix(col, VigColor, v * Vignette);
    col += (hash(floor(uv * OutSize) + floor(Time * 24.0) * 17.0) - 0.5) * Grain;
    fragColor = vec4(col, 1.0);
}