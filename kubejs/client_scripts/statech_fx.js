// -----------------------------------------
// CLIENT EFFECTS FOR USE IN
// STATECH INDUSTRY 2
// -----------------------------------------

const $FxGui = Java.loadClass('net.neoforged.neoforge.client.event.RenderGuiEvent$Post');
const $FxGuiPre = Java.loadClass('net.neoforged.neoforge.client.event.RenderGuiEvent$Pre');
const $FxAngles = Java.loadClass('net.neoforged.neoforge.client.event.ViewportEvent$ComputeCameraAngles');
const $FxFov = Java.loadClass('net.neoforged.neoforge.client.event.ViewportEvent$ComputeFov');
const $FxFog = Java.loadClass('net.neoforged.neoforge.client.event.ViewportEvent$RenderFog');
const $FxFogColor = Java.loadClass('net.neoforged.neoforge.client.event.ViewportEvent$ComputeFogColor');
const $FxTick = Java.loadClass('net.neoforged.neoforge.client.event.ClientTickEvent$Post');
const $FxFogType = Java.loadClass('net.minecraft.world.level.material.FogType');
const $FxHeight = Java.loadClass('net.minecraft.world.level.levelgen.Heightmap$Types');
const $FxRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries');
const $FxRL = Java.loadClass('net.minecraft.resources.ResourceLocation');
const $FxAxis = Java.loadClass('com.mojang.math.Axis');
const $FxRender = Java.loadClass('com.mojang.blaze3d.systems.RenderSystem');

const FX_TAU = Math.PI * 2;
const FX_BRIGHT = 15728880;
const FX_KINDS = {
    launch: { icon: 'warp', color: 0x7ab8ff, title: 'EXODUS ARK' },
    entry: { icon: 'warp', color: 0xffa040, title: 'ATMOSPHERIC ENTRY' },
    eden: { icon: 'eden', color: 0x6af08a, title: 'NEW EDEN' },
    earth: { icon: 'earth', color: 0xff6a4a, title: 'EARTH' },
    alert: { icon: 'alert', color: 0xffc23a, title: 'WARNING' },
};
const FX_FOG = {
    sand: { far: 14, near: 0.5, r: 0.72, g: 0.56, b: 0.33 },
    storm: { far: 64, near: 4, r: 0.11, g: 0.12, b: 0.16 },
    entry: { far: 48, near: 2, r: 0.9, g: 0.45, b: 0.18 },
};

const FX_ATMO = {
    sand: { tint: 0xa8823e, a: 0.6, haze: 0xdcb66e, ha: 0.7, vig: 0x3a2608, va: 0.7, speed: 3 },
    storm: { tint: 0x10141e, a: 0.36, haze: 0x48526a, ha: 0.3, vig: 0x05070c, va: 0.6, speed: 1.4 },
    entry: { tint: 0xe06a20, a: 0.3, haze: 0xffb060, ha: 0.3, vig: 0x601800, va: 0.5, speed: 3 },
    warp: { tint: 0x6a5cff, a: 0.22, haze: 0xbcd0ff, ha: 0.22, vig: 0x140a40, va: 0.7, speed: 4 },
};

let FX = {
    pack: false, expo: 1,
    tick: 0, event: '', shake: 0, quakeUntil: 0, flash: 0, flashColor: 0xffffff, white: 0,
    banners: [], cine: null, meteors: [], craters: [], launch: null, jump: null, entry: 0,
    fogKind: '', fogAmt: 0, shader: null, errors: {}, parts: {},
};

let fxErr = (tag, e) => { if (!FX.errors[tag]) { FX.errors[tag] = true; console.error('[FX] ' + tag + ': ' + e); } };
let fxArgb = (a, rgb) => ((Math.max(0, Math.min(255, Math.round(a))) << 24) | (rgb & 0xffffff)) | 0;
let fxRand = (a, b) => a + Math.random() * (b - a);
let fxPart = (name) => {
    if (!FX.parts[name]) FX.parts[name] = $FxRegistries.PARTICLE_TYPE.get($FxRL.parse('kubejs:' + name));
    return FX.parts[name];
};
let fxSpawn = (name, x, y, z, vx, vy, vz) => Client.level.addParticle(fxPart(name), true, x, y, z, vx || 0, vy || 0, vz || 0);
let fxOverworld = () => String(Client.level.dimension) == 'minecraft:overworld';
let fxExposed = (x, y, z) => y >= Client.level.getHeight($FxHeight.MOTION_BLOCKING, Math.floor(x), Math.floor(z));
let fxDist = (x, y, z) => { let p = Client.player; return Math.sqrt((p.x - x) * (p.x - x) + (p.y - y) * (p.y - y) + (p.z - z) * (p.z - z)); };
let fxBanner = (kind, text, title, life) => {
    let k = FX_KINDS[kind] || FX_KINDS.alert;
    FX.banners = FX.banners.filter((b) => b.kind != kind);
    FX.banners.push({ kind: kind, icon: k.icon, color: k.color, title: title || k.title, sub: text || '', born: FX.tick, life: life || 90 });
    if (FX.banners.length > 3) FX.banners.shift();
};

// ---------------- particles ----------------
ClientEvents.particleProviderRegistry((event) => {
    let reg = event['register(net.minecraft.core.particles.ParticleType,java.util.function.Consumer)'];
    let def = (name, fn) => reg.call(event, fxPart(name), (p) => { try { fn(p); } catch (e) { fxErr('particle ' + name, e); } });
    let bright = (p) => p.setLightColor((f) => FX_BRIGHT);
    let drift = (p, s) => { if (p.xd == 0 && p.yd == 0 && p.zd == 0) { p.xd = fxRand(-s, s); p.yd = fxRand(-s, s); p.zd = fxRand(-s, s); } };
    def('entry_ember', (p) => { p.lifetime = Math.floor(fxRand(24, 46)); p.setGravity(-0.006); p.setFriction(0.95); p.quadSize = fxRand(0.04, 0.08); drift(p, 0.03); bright(p); });
    def('entry_smoke', (p) => { p.lifetime = Math.floor(fxRand(50, 80)); p.setGravity(-0.004); p.setFriction(0.96); p.quadSize = fxRand(0.7, 1.25); drift(p, 0.01); });
    def('collapse_dust', (p) => { p.lifetime = Math.floor(fxRand(30, 50)); p.setGravity(0.045); p.quadSize = fxRand(0.04, 0.07); p.setPhysicality(true); });
    def('collapse_sand', (p) => { p.lifetime = Math.floor(fxRand(36, 60)); p.setGravity(0); p.setFriction(1); p.quadSize = fxRand(1.4, 2.6) * (FX.pack ? 1.6 : 1); });
    def('collapse_shock', (p) => { p.lifetime = 8; p.setGravity(0); p.quadSize = fxRand(2.6, 4.2); bright(p); p.xd = 0; p.yd = 0; p.zd = 0; });
    let sized = (p, size) => { p.quadSize = p.yd > 0.5 ? p.yd : size; p.xd = 0; p.yd = 0; p.zd = 0; };
    def('collapse_fireball', (p) => { p.lifetime = 3; p.setGravity(0); sized(p, 3.4); bright(p); });
    def('collapse_trail', (p) => { p.lifetime = Math.floor(fxRand(14, 20)); p.setGravity(0); sized(p, 1.8); bright(p); p.onTick((q) => { q.quadSize *= 0.9; }); });
    def('collapse_head', (p) => { p.lifetime = 2; p.setGravity(0); p.setFriction(1); p.quadSize = 2.6; bright(p); });
    def('collapse_halo', (p) => { p.lifetime = 2; p.setGravity(0); p.setFriction(1); p.quadSize = 7; bright(p); });
    def('warp_mote', (p) => { p.lifetime = Math.floor(fxRand(16, 26)); p.setGravity(0); p.quadSize = fxRand(0.1, 0.18); bright(p); });
    def('warp_ion', (p) => { p.lifetime = 16; p.setGravity(0); p.setFriction(0.9); p.quadSize = fxRand(0.35, 0.5); bright(p); });
    def('warp_ring', (p) => { p.lifetime = 8; p.setGravity(0); p.quadSize = fxRand(5, 8); bright(p); p.xd = 0; p.yd = 0; p.zd = 0; });
});

// ---------------- packets from the server ----------------
NetworkEvents.dataReceived('statech:fx', (event) => {
    try {
        let d = event.data;
        let fx = String(d.getString('fx'));
        let n = (k) => d.getDouble(k);
        if (fx == 'state') FX.event = String(d.getString('event'));
        else if (fx == 'tremor') { FX.shake = Math.max(FX.shake, n('power')); if (n('power') >= 1.2) FX.quakeUntil = FX.tick + 40; fxTremorDust(n('power')); }
        else if (fx == 'meteor') FX.meteors.push({ sx: n('sx'), sy: n('sy'), sz: n('sz'), tx: n('tx'), ty: n('ty'), tz: n('tz'), born: FX.tick, dur: d.getInt('ticks') });
        else if (fx == 'impact') fxImpact(n('x'), n('y'), n('z'), n('power'));
        else if (fx == 'launch') { FX.launch = { x: n('x'), y: n('y'), z: n('z'), born: FX.tick, ticks: d.getInt('ticks') }; FX.jump = null; fxBanner('launch', 'Warp drive spinning up. Stay within 32 blocks of the bridge.', 'EXODUS ARK \u00b7 IGNITION', 120); }
        else if (fx == 'jump') { FX.jump = { born: FX.tick }; FX.launch = null; }
        else if (fx == 'entry') { FX.jump = null; FX.white = 1; FX.entry = FX.tick + 1200; fxBanner('entry', 'Hold on. The landing site is coming into view.', null, 120); }
        else if (fx == 'arrive') {
            FX.entry = 0; FX.white = Math.max(FX.white, 0.7);
            FX.cine = { caption: "SHIP'S LOG \u00b7 DAY ONE", title: 'NEW EDEN', sub: 'ANDROMEDA, 2.5 MILLION LIGHT-YEARS FROM A DYING EARTH', color: 0x5af08a, accent: 0x9ad8ff, born: FX.tick, life: 200 };
        }
        else if (fx == 'shuttle') { FX.white = 1; fxBanner('earth', 'The shuttle set down beside the empty launch site.', 'RETURN TO EARTH', 110); }
    } catch (e) { fxErr('packet', e); }
});

// ---------------- world effects ----------------
function fxTremorDust(power) {
    let p = Client.player, lv = Client.level;
    let under = !fxExposed(p.x, p.y + 1.8, p.z);
    for (let i = 0; i < 10 + power * 14; i++) {
        let x = p.x + fxRand(-5, 5), z = p.z + fxRand(-5, 5);
        if (under) fxSpawn('collapse_dust', x, p.y + fxRand(2.2, 3.6), z, 0, 0, 0);
        else fxSpawn('collapse_dust', x, lv.getHeight($FxHeight.MOTION_BLOCKING, Math.floor(x), Math.floor(z)) + 0.1, z, 0, 0.05, 0);
    }
}

function fxImpact(x, y, z, power) {
    for (let i = 0; i < 5; i++) fxSpawn('collapse_shock', x + fxRand(-1.5, 1.5), y + 0.6 + i * 0.7, z + fxRand(-1.5, 1.5));
    for (let i = 0; i < 8; i++) fxSpawn('collapse_fireball', x + fxRand(-2, 2), y + fxRand(0.5, 3), z + fxRand(-2, 2));
    for (let i = 0; i < 14; i++) fxSpawn('collapse_trail', x + fxRand(-3, 3), y + fxRand(0.5, 4), z + fxRand(-3, 3), 0, fxRand(2.5, 4.5), 0);
    for (let i = 0; i < 90; i++) {
        let a = Math.random() * FX_TAU, v = fxRand(0.1, 0.55);
        fxSpawn('entry_ember', x + fxRand(-1.5, 1.5), y + fxRand(0, 2), z + fxRand(-1.5, 1.5), Math.cos(a) * v, fxRand(0.1, 0.75), Math.sin(a) * v);
    }
    for (let i = 0; i < 30; i++) fxSpawn('entry_smoke', x + fxRand(-4, 4), y + fxRand(0, 4), z + fxRand(-4, 4), 0, fxRand(0.02, 0.1), 0);
    for (let i = 0; i < 40; i++) fxSpawn('collapse_dust', x + fxRand(-5, 5), y + fxRand(0, 2), z + fxRand(-5, 5), fxRand(-0.15, 0.15), fxRand(0.15, 0.45), fxRand(-0.15, 0.15));
    FX.craters.push({ x: x, y: y, z: z, until: FX.tick + 260 });
    let d = fxDist(x, y, z);
    FX.flash = Math.max(FX.flash, Math.max(0, 1 - d / 110) * 0.5); FX.flashColor = 0xffc070;
    FX.shake = Math.max(FX.shake, Math.max(0, 1 - d / 110) * (2.2 + power * 0.3));
    if (d < 60) FX.quakeUntil = FX.tick + 30;
}

function fxMeteorTick() {
    FX.meteors = FX.meteors.filter((m) => {
        let f = (FX.tick - m.born) / m.dur;
        if (f >= 1) return false;
        let dx = (m.tx - m.sx) / m.dur, dy = (m.ty - m.sy) / m.dur, dz = (m.tz - m.sz) / m.dur;
        let x = m.sx + (m.tx - m.sx) * f, y = m.sy + (m.ty - m.sy) * f, z = m.sz + (m.tz - m.sz) * f;
        let steps = Math.max(1, Math.ceil(Math.hypot(dx, dy, dz) / 0.35));
        for (let i = 0; i < steps; i++) {
            let t = i / steps;
            fxSpawn('collapse_trail', x - dx * t + fxRand(-0.08, 0.08), y - dy * t + fxRand(-0.08, 0.08), z - dz * t + fxRand(-0.08, 0.08), 0, 1.8 - 0.5 * t, 0);
        }
        fxSpawn('collapse_halo', x, y, z, dx, dy, dz);
        fxSpawn('collapse_head', x, y, z, dx, dy, dz);
        for (let i = 0; i < 6; i++) { let t = 1.5 + i / 6; fxSpawn('entry_smoke', x - dx * t + fxRand(-0.5, 0.5), y - dy * t + fxRand(-0.5, 0.5), z - dz * t + fxRand(-0.5, 0.5)); }
        if (Math.random() < 0.7) fxSpawn('entry_ember', x - dx * 0.5, y - dy * 0.5, z - dz * 0.5, dx * 0.3 + fxRand(-0.1, 0.1), dy * 0.3 + fxRand(-0.1, 0.1), dz * 0.3 + fxRand(-0.1, 0.1));
        return true;
    });
    FX.craters = FX.craters.filter((c) => {
        if (FX.tick % 2 == 0) fxSpawn('entry_smoke', c.x + fxRand(-1.5, 1.5), c.y + fxRand(0, 1), c.z + fxRand(-1.5, 1.5), 0, fxRand(0.05, 0.12), 0);
        if (FX.tick % 5 == 0) fxSpawn('entry_ember', c.x + fxRand(-1.5, 1.5), c.y + 0.3, c.z + fxRand(-1.5, 1.5), 0, fxRand(0.05, 0.2), 0);
        return c.until > FX.tick;
    });
}

function fxAmbient() {
    let p = Client.player, lv = Client.level;
    if (FX.event == 'sand') {
        for (let i = 0; i < (FX.pack ? 6 : 3); i++) {
            let x = p.x + fxRand(-26, 10), y = p.y + fxRand(-2, 9), z = p.z + fxRand(-18, 18);
            if (fxExposed(x, y, z)) fxSpawn('collapse_sand', x, y, z, fxRand(0.3, 0.5), fxRand(-0.01, 0.02), fxRand(-0.05, 0.05));
        }
        for (let i = 0; i < 12; i++) {
            let x = p.x + fxRand(-16, 6), y = p.y + fxRand(0, 7), z = p.z + fxRand(-12, 12);
            if (fxExposed(x, y, z)) fxSpawn('collapse_dust', x, y, z, fxRand(0.5, 0.8), fxRand(-0.02, 0.06), fxRand(-0.06, 0.06));
        }
    }
}

function fxLaunchTick() {
    let L = FX.launch, age = FX.tick - L.born, prog = Math.min(1, age / L.ticks);
    for (let k = 0; k < 3 + prog * 10; k++) {
        let a = Math.random() * FX_TAU, r = (6 + Math.random() * 22) * (1 - prog * 0.45);
        fxSpawn('warp_mote', L.x + Math.cos(a) * r, L.y + fxRand(-6, 10), L.z + Math.sin(a) * r);
    }
    if (age % 20 == 0) fxSpawn('warp_ring', L.x, L.y + 2, L.z);
    if (age % 7 == 0 && prog > 0.4) fxSpawn('warp_ring', L.x + fxRand(-12, 12), L.y + fxRand(-3, 8), L.z + fxRand(-12, 12));
    FX.shake = Math.max(FX.shake, 0.12 + prog * prog * 1.4);
    if (age >= L.ticks + 40) FX.launch = null;
}

function fxEntryTick() {
    let p = Client.player;
    for (let i = 0; i < 6; i++) fxSpawn('entry_ember', p.x + fxRand(-3, 3), p.y - fxRand(1, 7), p.z + fxRand(-3, 3), 0, 0.2, 0);
    if (Math.random() < 0.5) fxSpawn('entry_smoke', p.x + fxRand(-4, 4), p.y - fxRand(2, 8), p.z + fxRand(-4, 4));
    FX.shake = Math.max(FX.shake, 0.35);
}

let $FxIris = null;
function fxPackOn() {
    try {
        if ($FxIris === null) $FxIris = Java.loadClass('net.irisshaders.iris.api.v0.IrisApi');
        return $FxIris.getInstance().isShaderPackInUse();
    } catch (e) { $FxIris = false; return false; }
}

function fxShaderNow() {
    if (FX.jump) { let a = FX.tick - FX.jump.born; return a < 12 ? 'warp_4' : (a < 26 ? 'warp_5' : 'warp_6'); }
    if (FX.launch) { let left = FX.launch.ticks - (FX.tick - FX.launch.born); return left < 40 ? 'warp_3' : (left < 80 ? 'warp_2' : (left < 130 ? 'warp_1' : null)); }
    if (FX.entry > FX.tick) return 'entry';
    if (!fxOverworld()) return null;
    if (FX.quakeUntil > FX.tick) return 'quake';
    if (FX.event == 'sand') return 'sand';
    if (FX.event == 'storm') return 'storm';
    return null;
}

function fxFogNow() {
    if (FX.entry > FX.tick) return 'entry';
    if (!fxOverworld() || FX.jump || FX.launch) return '';
    if (FX.event == 'sand') return 'sand';
    if (FX.event == 'storm') return 'storm';
    return '';
}

NativeEvents.onEvent($FxTick, (e) => {
    try {
        if (!Client.player || !Client.level || Client.isPaused()) return;
        FX.tick++;
        FX.shake *= 0.94; if (FX.shake < 0.01) FX.shake = 0;
        FX.flash *= 0.86;
        if (FX.tick % 20 == 1) FX.pack = fxPackOn();
        FX.expo += ((fxExposed(Client.player.x, Client.player.y + 1.8, Client.player.z) ? 1 : 0) - FX.expo) * 0.05;
        try { if (fxOverworld()) fxAmbient(); } catch (err) { fxErr('ambient', err); }
        if (!FX.jump) FX.white = Math.max(0, FX.white - 1 / 60);
        try { if (FX.launch) fxLaunchTick(); } catch (err) { fxErr('launch', err); FX.launch = null; }
        if (FX.jump) { let a = FX.tick - FX.jump.born; FX.shake = Math.max(FX.shake, 2.2); if (a > 34) FX.white = Math.min(1, (a - 34) / 14); if (a > 400) FX.jump = null; }
        if (FX.entry > FX.tick && !fxOverworld()) fxEntryTick();
        try { fxMeteorTick(); } catch (err) { fxErr('meteors', err); FX.meteors = []; FX.craters = []; }
        let want = fxShaderNow();
        if (want !== FX.shader) {
            FX.shader = want;
            Client.player.setActivePostShader(want ? $FxRL.parse('statech:shaders/post/' + want + '.json') : null);
        }
        let fog = fxFogNow();
        if (fog) { if (FX.fogKind != fog && FX.fogAmt > 0.05) FX.fogAmt -= 0.04; else { FX.fogKind = fog; FX.fogAmt = Math.min(1, FX.fogAmt + 0.015); } }
        else FX.fogAmt = Math.max(0, FX.fogAmt - 0.02);
    } catch (err) { fxErr('tick', err); }
});

// ---------------- camera, fov, fog ----------------
NativeEvents.onEvent($FxAngles, (e) => {
    try {
        let s = FX.shake;
        if (s <= 0) return;
        let t = FX.tick + e.getPartialTick();
        e.setPitch(e.getPitch() + (Math.sin(t * 2.7) * 0.6 + Math.sin(t * 7.3) * 0.25) * s);
        e.setYaw(e.getYaw() + (Math.sin(t * 2.1 + 1.3) * 0.5 + Math.sin(t * 6.1) * 0.2) * s);
        e.setRoll(e.getRoll() + Math.sin(t * 3.3 + 0.4) * 0.9 * s);
    } catch (err) { fxErr('camera', err); }
});

NativeEvents.onEvent($FxFov, (e) => {
    try {
        let k = 1;
        if (FX.launch) k = 1 - Math.min(1, (FX.tick - FX.launch.born) / FX.launch.ticks) * 0.1;
        if (FX.jump) { let a = Math.min(1, (FX.tick - FX.jump.born) / 40); k = 0.9 + a * a * 0.95; }
        if (k != 1) e.setFOV(e.getFOV() * k);
    } catch (err) { fxErr('fov', err); }
});

NativeEvents.onEvent($FxFog, (e) => {
    try {
        if (FX.fogAmt <= 0.01 || !FX.fogKind || e.getType() != $FxFogType.NONE) return;
        let f = FX_FOG[FX.fogKind], a = FX.fogAmt;
        let far = e.getFarPlaneDistance(), near = e.getNearPlaneDistance();
        e.setFarPlaneDistance(far + (Math.min(far, f.far) - far) * a);
        e.setNearPlaneDistance(near + (Math.min(near, f.near) - near) * a);
        e.setCanceled(true);
    } catch (err) { fxErr('fog', err); }
});

NativeEvents.onEvent($FxFogColor, (e) => {
    try {
        if (FX.fogAmt <= 0.01 || !FX.fogKind) return;
        let f = FX_FOG[FX.fogKind], a = FX.fogAmt;
        e.setRed(e.getRed() + (f.r - e.getRed()) * a);
        e.setGreen(e.getGreen() + (f.g - e.getGreen()) * a);
        e.setBlue(e.getBlue() + (f.b - e.getBlue()) * a);
    } catch (err) { fxErr('fog colour', err); }
});

// ---------------- HUD ----------------
const FX_BLIT = 'blit(net.minecraft.resources.ResourceLocation,int,int,float,float,int,int,int,int)';
let fxTex = {};
let fxTexture = (name) => { if (!fxTex[name]) fxTex[name] = $FxRL.parse('statech:textures/gui/type/' + name + '.png'); return fxTex[name]; };
let fxEase = (t) => { t = Math.max(0, Math.min(1, t)); return 1 - (1 - t) * (1 - t) * (1 - t); };
let fxTint = (rgb, a) => $FxRender.setShaderColor(((rgb >> 16) & 255) / 255, ((rgb >> 8) & 255) / 255, (rgb & 255) / 255, Math.max(0, Math.min(1, a)));
let fxRect = (g, x0, y0, x1, y1, a, rgb) => { if (a > 0.01) g.fill(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), fxArgb(a * 255, rgb)); };

function fxTypeW(style, s, K, track) {
    let st = FX_TYPE.styles[style], at = st.at[K], gap = at.gap + (track || 0), n = 0;
    s = String(s).toUpperCase();
    for (let i = 0; i < s.length; i++) { let k = st.chars.indexOf(s.charAt(i)); n += (k < 0 ? at.sp : at.w[k]) + gap; }
    return Math.max(0, n - gap);
}
function fxType(g, style, s, x, y, rgb, alpha, align, K, track) {
    if (alpha < 0.02) return;
    let st = FX_TYPE.styles[style], at = st.at[K], gap = at.gap + (track || 0), tex = fxTexture(style + '_' + K);
    s = String(s).toUpperCase();
    let w = fxTypeW(style, s, K, track);
    let x0 = Math.round(align == 'c' ? x - w / 2 : (align == 'r' ? x - w : x)), y0 = Math.round(y);
    let blit = g[FX_BLIT], shadow = Math.max(1, Math.round(at.cap / 14));
    $FxRender.enableBlend();
    for (let pass = 0; pass < 2; pass++) {
        if (pass == 0) fxTint(0x04060b, alpha * 0.55); else fxTint(rgb, alpha);
        let px = x0 + (pass == 0 ? shadow : 0), py = y0 + (pass == 0 ? shadow : 0);
        for (let i = 0; i < s.length; i++) {
            let k = st.chars.indexOf(s.charAt(i));
            if (k < 0) { px += at.sp + gap; continue; }
            blit.call(g, tex, px - 1, py - 1, (k % at.cols) * at.cw, Math.floor(k / at.cols) * at.ch, at.w[k] + 2, at.ch, at.tw, at.th);
            px += at.w[k] + gap;
        }
    }
    $FxRender.setShaderColor(1, 1, 1, 1);
}
function fxWrap(style, s, maxW, K) {
    s = String(s || '').trim();
    if (!s) return [];
    if (fxTypeW(style, s, K) <= maxW) return [s];
    let lines = [], cur = '';
    s.split(' ').forEach((word) => {
        let next = cur ? cur + ' ' + word : word;
        if (cur && fxTypeW(style, next, K) > maxW) { lines.push(cur); cur = word; } else cur = next;
    });
    if (cur) lines.push(cur);
    return lines.slice(0, 3);
}
function fxIcon(g, name, x, y, rgb, alpha, K) {
    let i = FX_TYPE.icons.indexOf(name), c = 16 * K;
    if (i < 0 || alpha < 0.02) return;
    $FxRender.enableBlend();
    fxTint(rgb, alpha);
    g[FX_BLIT].call(g, fxTexture('icons_' + K), Math.round(x), Math.round(y), i * c, 0, c, c, c * FX_TYPE.icons.length, c);
    $FxRender.setShaderColor(1, 1, 1, 1);
}
function fxFadeBar(g, cx, y0, y1, half, fade, a, rgb) {
    if (a < 0.01 || half < 1) return;
    fade = Math.min(fade, half);
    let steps = 16, sw = fade / steps, edge = half - fade;
    fxRect(g, cx - edge, y0, cx + edge, y1, a, rgb);
    for (let i = 0; i < steps; i++) {
        let k = 1 - (i + 0.5) / steps, aa = a * k * k;
        fxRect(g, cx + edge + i * sw, y0, cx + edge + (i + 1) * sw, y1, aa, rgb);
        fxRect(g, cx - edge - (i + 1) * sw, y0, cx - edge - i * sw, y1, aa, rgb);
    }
}
function fxBand(g, W, y0, y1, a) {
    if (a < 0.01) return;
    let mid = Math.round((y0 + y1) / 2), dark = fxArgb(a * 255, 0x04060b), clear = fxArgb(0, 0x04060b);
    g.fillGradient(0, Math.round(y0), Math.round(W), mid, clear, dark);
    g.fillGradient(0, mid, Math.round(W), Math.round(y1), dark, clear);
}
function fxRay(g, cx, cy, ang, r0, r1, th, a, rgb) {
    if (a < 0.01) return;
    let pose = g.pose();
    pose.pushPose(); pose.translate(cx, cy, 0); pose.mulPose($FxAxis.ZP.rotation(ang));
    g.fill(Math.round(r0), -th, Math.round(r1), th, fxArgb(a * 255, rgb));
    pose.popPose();
}

// ---------------- atmosphere ----------------
const $FxRenderType = Java.loadClass('net.minecraft.client.renderer.RenderType');
const FX_GRID_X = 16, FX_GRID_Y = 9;
let fxAtmoCache = { key: '', cols: null };
let fxNoise = null;
function fxNoiseAt(u, v) {
    if (!fxNoise) { fxNoise = []; for (let i = 0; i < 256; i++) fxNoise.push(Math.random()); }
    let x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    let at = (x, y) => fxNoise[((y & 15) << 4) | (x & 15)];
    let a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}
function fxOver(a, rgb, alpha) {
    let out = alpha + a[3] * (1 - alpha);
    if (out <= 0.0001) return a;
    let k = a[3] * (1 - alpha);
    return [(((rgb >> 16) & 255) * alpha + a[0] * k) / out, (((rgb >> 8) & 255) * alpha + a[1] * k) / out, ((rgb & 255) * alpha + a[2] * k) / out, out];
}
function fxAtmo(g, w, h, now, kind, amt) {
    let s = FX_ATMO[kind];
    if (!s || amt <= 0.01) return;
    let slow = kind != 'warp' && kind != 'entry';
    if (slow) now = FX.tick;
    let key = kind + '|' + (slow ? now : -1) + '|' + Math.round(amt * 200) + '|' + w + '|' + h;
    let cols = fxAtmoCache.key == key ? fxAtmoCache.cols : null;
    if (!cols) {
        cols = [];
        let drift = now * s.speed * 0.006, aspect = w / h;
        for (let iy = 0; iy <= FX_GRID_Y; iy++) for (let ix = 0; ix <= FX_GRID_X; ix++) {
            let gx = ix / FX_GRID_X, gy = iy / FX_GRID_Y;
            let u = gx * 2.6 * aspect, v = gy * 2.6;
            let n1 = fxNoiseAt(u + drift, v + drift * 0.25) + 0.5 * fxNoiseAt(u * 2.1 - drift * 0.6, v * 2.1 + 7.3);
            let n2 = fxNoiseAt(u * 0.55 - drift * 0.7 + 4.1, v * 0.55 + drift * 0.3 + 9.7);
            let haze = Math.max(0, Math.min(1, (n1 / 1.5 - 0.28) / 0.45)) * 0.65 + n2 * 0.35;
            let dx = gx * 2 - 1, dy = gy * 2 - 1, r = Math.sqrt(dx * dx * 0.85 + dy * dy);
            let vig = Math.max(0, Math.min(1, (r - 0.45) / 0.75)); vig *= vig;
            let c = [(s.tint >> 16) & 255, (s.tint >> 8) & 255, s.tint & 255, s.a * amt];
            c = fxOver(c, s.haze, Math.min(1, s.ha * amt * haze));
            c = fxOver(c, s.vig, Math.min(1, s.va * amt * vig));
            cols.push((Math.round(c[3] * 255) << 24) | (Math.round(c[0]) << 16) | (Math.round(c[1]) << 8) | Math.round(c[2]));
        }
        if (slow) { fxAtmoCache.key = key; fxAtmoCache.cols = cols; }
    }
    let mat = g.pose().last().pose(), vc = g.bufferSource().getBuffer($FxRenderType.gui()), row = FX_GRID_X + 1;
    for (let iy = 0; iy < FX_GRID_Y; iy++) for (let ix = 0; ix < FX_GRID_X; ix++) {
        let x0 = w * ix / FX_GRID_X, x1 = w * (ix + 1) / FX_GRID_X, y0 = h * iy / FX_GRID_Y, y1 = h * (iy + 1) / FX_GRID_Y, k = iy * row + ix;
        vc.addVertex(mat, x0, y0, 0).setColor(cols[k] | 0);
        vc.addVertex(mat, x0, y1, 0).setColor(cols[k + row] | 0);
        vc.addVertex(mat, x1, y1, 0).setColor(cols[k + row + 1] | 0);
        vc.addVertex(mat, x1, y0, 0).setColor(cols[k + 1] | 0);
    }
    g.flush();
}

NativeEvents.onEvent($FxGuiPre, (e) => {
    try {
        if (!Client.player || !FX.pack) return;
        let g = e.getGuiGraphics(), w = g.guiWidth(), h = g.guiHeight(), now = FX.tick;
        try { now += e.getPartialTick().getGameTimeDeltaPartialTick(false); } catch (ignored) { }
        if (FX.jump) fxAtmo(g, w, h, now, 'warp', Math.min(1, (now - FX.jump.born) / 30));
        else if (FX.launch) fxAtmo(g, w, h, now, 'warp', Math.min(1, (now - FX.launch.born) / FX.launch.ticks) * 0.7);
        else if (FX.fogKind) fxAtmo(g, w, h, now, FX.fogKind, FX.fogAmt * (FX.fogKind == 'entry' ? 1 : 0.4 + 0.6 * FX.expo));
    } catch (err) { fxErr('atmosphere', err); }
});
function fxDrawBanner(g, b, top, W, now, K) {
    let u = K, age = now - b.born, a = Math.min(fxEase(age / 7), Math.max(0, Math.min(1, (b.life - age) / 14)));
    let lines = fxWrap('label', b.sub, W * 0.72, K);
    let textW = fxTypeW('title', b.title, K);
    lines.forEach((line) => { textW = Math.max(textW, fxTypeW('label', line, K)); });
    let cw = 24 * u + textW, h = (lines.length ? 22 + lines.length * 10 : 21) * u, cx = Math.round(W / 2);
    if (a <= 0.01) return h;
    let open = fxEase(age / 11), rule = Math.max(1, Math.round(K / 2)), slide = Math.round((1 - fxEase(age / 9)) * 3 * u);
    fxFadeBar(g, cx, top, top + h, (cw / 2 + 56 * u) * (0.7 + 0.3 * open), 70 * u, a * 0.64, 0x070a12);
    fxFadeBar(g, cx, top, top + rule, (cw / 2 + 34 * u) * open, 44 * u, a * 0.95, b.color);
    fxFadeBar(g, cx, top + h - rule, top + h, (cw / 2 + 34 * u) * open, 44 * u, a * 0.55, b.color);
    let x0 = cx - Math.round(cw / 2);
    fxIcon(g, b.icon, x0, top + Math.round((h - 16 * u) / 2) + slide, b.color, a, K);
    fxType(g, 'title', b.title, x0 + 24 * u, top + (lines.length ? 6 * u : 6 * u) + slide, b.color, a, 'l', K, 0);
    lines.forEach((line, i) => fxType(g, 'label', line, x0 + 24 * u, top + (21 + i * 10) * u + slide, 0xc6ccda, a * 0.92, 'l', K, 0));
    return h;
}

function fxDrawCine(g, c, W, H, now, K) {
    let u = K, age = now - c.born;
    if (age > c.life) { FX.cine = null; return; }
    let a = Math.min(fxEase(age / 12), Math.max(0, Math.min(1, (c.life - age) / 26)));
    if (a <= 0.01) return;
    let cx = Math.round(W / 2), cy = Math.round(H * 0.3), rule = Math.max(1, Math.round(K / 2)), open = fxEase(age / 28);
    fxBand(g, W, cy - 54 * u, cy + 56 * u, a * 0.5);
    fxType(g, 'label', c.caption, cx, cy - 32 * u, 0xb4bccd, a * 0.95, 'c', K, 2 * u);
    fxFadeBar(g, cx, cy - 20 * u, cy - 20 * u + rule, 150 * u * open, 110 * u, a * 0.9, c.accent);
    let big = fxTypeW('display', c.title, K, 0) <= W * 0.92;
    let settle = Math.round((1 - fxEase(age / 32)) * 4 * u);
    fxType(g, big ? 'display' : 'title', c.title, cx, cy - (big ? 10 : 6) * u, c.color, a, 'c', K, settle);
    let small = fxTypeW('title', c.sub, K, 0) <= W * 0.92;
    fxType(g, small ? 'title' : 'label', c.sub, cx, cy + (big ? 18 : 12) * u, c.accent, a * fxEase((age - 14) / 18), 'c', K, 0);
    fxFadeBar(g, cx, cy + 36 * u, cy + 36 * u + rule, 90 * u * open, 70 * u, a * 0.55, c.accent);
}

function fxDrawLaunch(g, W, H, now, K) {
    let L = FX.launch, u = K, age = now - L.born, left = Math.max(0, L.ticks - age), secs = Math.ceil(left / 20);
    let cx = Math.round(W / 2), cy = Math.round(H * 0.4), a = fxEase(age / 10);
    let col = secs > 5 ? 0x8cc4ff : (secs > 3 ? 0xb69cff : 0xff6a5e);
    fxBand(g, W, cy - 56 * u, cy + 60 * u, 0.42 * a);
    if (left > 0) {
        let pop = fxEase((secs * 20 - left) / 5);
        fxType(g, 'count', String(secs), cx, cy - 23 * u - Math.round((1 - pop) * 4 * u), col, a * (0.2 + 0.8 * pop), 'c', K, 0);
    } else fxType(g, 'display', 'JUMP', cx, cy - 9 * u, 0xffffff, 1, 'c', K, 3 * u);
    fxType(g, 'label', secs > 3 ? 'WARP DRIVE CHARGING' : 'BRACE FOR THE JUMP', cx, cy + 34 * u, secs > 3 ? 0xb4bccd : col, a * 0.95, 'c', K, 2 * u);
}

function fxDrawJump(g, w, h, now) {
    let a = Math.min(1, (now - FX.jump.born) / 34), cx = w / 2, cy = h / 2, maxR = Math.hypot(w, h) / 2;
    for (let i = 0; i < 90; i++) {
        let ang = (i * 2.399963) % FX_TAU, speed = 0.6 + ((i * 37) % 17) / 17;
        let r0 = ((now * 9 * speed + i * 53) % maxR) * (0.25 + a * 0.75);
        let len = 6 + a * a * maxR * 0.45 * speed;
        fxRay(g, cx, cy, ang, r0, r0 + len, 1, a * (0.35 + 0.5 * speed / 1.6), i % 3 ? 0xcfe6ff : 0xb49cff);
    }
}

NativeEvents.onEvent($FxGui, (e) => {
    try {
        if (!Client.player) return;
        let g = e.getGuiGraphics(), w = g.guiWidth(), h = g.guiHeight(), now = FX.tick;
        try { now += e.getPartialTick().getGameTimeDeltaPartialTick(false); } catch (ignored) { }
        if (FX.jump) fxDrawJump(g, w, h, now);
        if (FX.flash > 0.02) fxRect(g, 0, 0, w, h, FX.flash * 0.7, FX.flashColor);
        if (FX.white > 0.01) fxRect(g, 0, 0, w, h, FX.white, 0xf4f8ff);
        FX.banners = FX.banners.filter((b) => now - b.born < b.life);
        if (!FX.launch && !FX.cine && !FX.jump && FX.banners.length == 0) return;
        let K = Math.max(1, Math.min(4, Math.round(Client.window.getGuiScale()))), W = w * K, H = h * K, pose = g.pose();
        pose.pushPose(); pose.scale(1 / K, 1 / K, 1);
        try {
            if (FX.jump) fxType(g, 'title', 'FOLDING SPACE', W / 2, H * 0.8, 0xdcebff, Math.max(0, 1 - FX.white) * Math.min(1, (now - FX.jump.born) / 34), 'c', K, 4 * K);
            if (FX.launch) fxDrawLaunch(g, W, H, now, K);
            if (FX.cine) fxDrawCine(g, FX.cine, W, H, now, K);
            let top = 12 * K;
            FX.banners.forEach((b) => { top += fxDrawBanner(g, b, top, W, now, K) + 6 * K; });
        } finally { pose.popPose(); }
    } catch (err) { fxErr('hud', err); }
});
