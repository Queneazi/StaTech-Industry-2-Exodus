#version 150

uniform sampler2D DiffuseSampler;
uniform vec2 OutSize;
uniform float Time;
uniform float Intensity;

in vec2 texCoord;
out vec4 fragColor;

void main() {
    float t = Time * 6.2831853;
    vec2 c = vec2(0.5);
    vec2 d = texCoord - c;
    float aspect = OutSize.x / OutSize.y;
    float r = length(vec2(d.x * aspect, d.y));
    float ripple = sin(r * 40.0 - t * 4.0) * 0.014 * Intensity;
    float swirl = Intensity * 0.6 * exp(-r * 4.0);
    float s = sin(swirl), co = cos(swirl);
    vec2 dd = vec2(d.x * co - d.y * s, d.x * s + d.y * co);
    float pinch = 1.0 - Intensity * 0.38 * exp(-r * 3.0);
    vec2 uv = c + dd * (pinch + ripple);
    vec3 col = vec3(0.0);
    float blur = 0.09 * Intensity * Intensity;
    for (int i = 0; i < 12; i++) {
        float k = float(i) / 11.0;
        vec2 o = (uv - c) * (1.0 - blur * k);
        col.r += texture(DiffuseSampler, c + o * (1.0 + 0.016 * Intensity)).r;
        col.g += texture(DiffuseSampler, c + o).g;
        col.b += texture(DiffuseSampler, c + o * (1.0 - 0.016 * Intensity)).b;
    }
    col /= 12.0;
    vec3 energy = mix(vec3(0.32, 0.55, 1.0), vec3(0.72, 0.44, 1.0), 0.5 + 0.5 * sin(t + r * 7.0));
    col = mix(col, col * energy * 1.7, Intensity * 0.55);
    col += energy * exp(-r * 6.0) * Intensity * Intensity * 1.2;
    float rings = pow(0.5 + 0.5 * sin(r * 64.0 - t * 6.0), 10.0) * smoothstep(0.08, 0.6, r);
    col += energy * rings * Intensity * 0.3;
    col *= 1.0 - smoothstep(0.42, 0.95, r) * Intensity * 0.8;
    fragColor = vec4(col, 1.0);
}