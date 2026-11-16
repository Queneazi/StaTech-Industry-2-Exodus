// -----------------------------------------
// EXODUS: LAUNCH AND LANDING FOR
// STATECH INDUSTRY 2
// -----------------------------------------

const EXODUS_DIMENSION = 'statech:new_eden';
const EXODUS_LANDING = [4096, 4096];
const EXODUS_CREW_RADIUS = 32;
const EXODUS_ENTRY_Y = 300;
const EXODUS_SURFACE = Java.loadClass('net.minecraft.world.level.levelgen.Heightmap$Types').MOTION_BLOCKING_NO_LEAVES;
let $ExodusBlockPos = Java.loadClass('net.minecraft.core.BlockPos');
let exodusCountdowns = [];

let exodusCommand = (server, command) => server.runCommandSilent(command);

let exodusFx = (player, fx, data) => {
    let tag = { fx: fx };
    if (data) Object.keys(data).forEach((k) => { tag[k] = data[k]; });
    player.sendData('statech:fx', tag);
};
const EXODUS_JUMP_TICKS = 48;

let exodusSound = (server, name, sound, pitch) =>
    exodusCommand(server, `execute as ${name} at @s run playsound ${sound} master @s ~ ~ ~ 1 ${pitch}`);

let exodusCrew = (server, launch) => {
    let crew = [];
    server.players.forEach((player) => {
        if (String(player.level.dimension) != 'minecraft:overworld') return;
        let dx = player.x - launch.x, dy = player.y - launch.y, dz = player.z - launch.z;
        if (dx * dx + dy * dy + dz * dz <= EXODUS_CREW_RADIUS * EXODUS_CREW_RADIUS) crew.push(player);
    });
    return crew;
};

let exodusLevel = (server) => {
    let found = null;
    server.getAllLevels().forEach((level) => { if (String(level.dimension) == EXODUS_DIMENSION) found = level; });
    return found;
};

const EXODUS_WELCOMING = ['plains', 'forest', 'meadow', 'grove', 'savanna', 'taiga', 'jungle', 'cherry', 'field', 'valley', 'orchard', 'woodland', 'prairie'];
const EXODUS_WET = ['ocean', 'river', 'beach', 'shore', 'swamp', 'marsh', 'lake', 'reef'];
const EXODUS_HARSH = ['snowy', 'frozen', 'ice', 'cold', 'desert', 'badlands', 'peaks', 'dead'];
let exodusBiome = (level, x, z) => String(level.getBiome(new $ExodusBlockPos(x, 64, z)).getRegisteredName());
let exodusPickLanding = (server) => {
    let level = exodusLevel(server);
    if (!level) return EXODUS_LANDING;
    let dry = (x, z) => !EXODUS_WET.some((word) => exodusBiome(level, x, z).indexOf(word) >= 0);
    let fallback = null;
    for (let r = 0; r <= 24; r++) {
        for (let i = 0; i < Math.max(1, r * 8); i++) {
            let angle = (i / Math.max(1, r * 8)) * Math.PI * 2;
            let x = EXODUS_LANDING[0] + Math.round(Math.cos(angle) * r * 256);
            let z = EXODUS_LANDING[1] + Math.round(Math.sin(angle) * r * 256);
            if (!dry(x, z) || !dry(x + 96, z) || !dry(x - 96, z) || !dry(x, z + 96) || !dry(x, z - 96)) continue;
            let biome = exodusBiome(level, x, z);
            let harsh = EXODUS_HARSH.some((word) => biome.indexOf(word) >= 0);
            if (!harsh && EXODUS_WELCOMING.some((word) => biome.indexOf(word) >= 0)) return [x, z];
            if (!fallback) fallback = [x, z];
        }
    }
    return fallback || EXODUS_LANDING;
};

let exodusLaunch = (server, launch) => {
    let landing = exodusPickLanding(server);
    exodusCrew(server, launch).forEach((player, index) => {
        let name = player.username;
        let data = player.persistentData;
        data.putDouble('exodus_return_x', player.x);
        data.putDouble('exodus_return_y', player.y);
        data.putDouble('exodus_return_z', player.z);
        data.putBoolean('exodus_departed', true);
        data.putInt('exodus_landing', 1);
        exodusSound(server, name, 'minecraft:entity.generic.explode', 0.5);
        exodusCommand(server, `execute in ${EXODUS_DIMENSION} run tp ${name} ${landing[0] + index * 3 + 0.5} ${EXODUS_ENTRY_Y} ${landing[1] + 0.5}`);
        exodusCommand(server, `effect give ${name} minecraft:slow_falling 600 0 true`);
        exodusCommand(server, `effect give ${name} minecraft:resistance 600 4 true`);
        exodusFx(player, 'entry');
    });
};

let exodusColumn = (level, x, z) => {
    let chunk = level.getChunkSource().getChunkNow(x >> 4, z >> 4);
    if (!chunk) return null;
    let y = chunk.getHeight(EXODUS_SURFACE, x & 15, z & 15) + 1;
    if (y <= level.getMinBuildHeight() + 1) return null;
    return { x: x, y: y, z: z, wet: !chunk.getBlockState(new $ExodusBlockPos(x, y - 1, z)).getFluidState().isEmpty() };
};

let exodusLandingSpot = (level, cx, cz) => {
    for (let r = 0; r <= 6; r++) {
        for (let dx = -r; dx <= r; dx++) {
            for (let dz = -r; dz <= r; dz++) {
                if (Math.max(Math.abs(dx), Math.abs(dz)) != r) continue;
                let column = exodusColumn(level, cx + dx * 16, cz + dz * 16);
                if (column && !column.wet) return column;
            }
        }
    }
    return null;
};

let exodusLand = (server, player) => {
    let data = player.persistentData;
    let level = player.level;
    let px = Math.floor(player.x), pz = Math.floor(player.z);
    let spot = exodusLandingSpot(level, px, pz);
    let waited = data.getInt('exodus_landing');
    data.putInt('exodus_landing', waited + 1);
    if (!spot && waited > 120) spot = exodusColumn(level, px, pz);
    if (!spot) return;
    let name = player.username;
    data.putInt('exodus_landing', 0);
    exodusCommand(server, `execute in ${EXODUS_DIMENSION} run tp ${name} ${spot.x + 0.5} ${spot.y} ${spot.z + 0.5}`);
    exodusCommand(server, `execute in ${EXODUS_DIMENSION} run spawnpoint ${name} ${spot.x} ${spot.y} ${spot.z}`);
    exodusCommand(server, `effect clear ${name} minecraft:slow_falling`);
    exodusCommand(server, `effect clear ${name} minecraft:resistance`);
    exodusFx(player, 'arrive');
    exodusSound(server, name, 'minecraft:ui.toast.challenge_complete', 1);
    player.tell(Text.gold("SHIP'S LOG - DAY ONE"));
    player.tell(Text.gray('The Ark broke orbit over a burning Earth and folded the dark between galaxies into a single jump. The colonists are waking, and the seeds of the old world wait for new soil.'));
    player.tell(Text.green('Your respawn point is now here. The ignition key can still shuttle you back to the launch site.'));
};

BlockEvents.rightClicked('modern_industrialization:exodus_ark', (event) => {
    if (event.item.id != 'kubejs:exodus_key') return;
    let player = event.player;
    let entity = event.block.entity;
    let x = event.block.x + 0.5, y = event.block.y + 0.5, z = event.block.z + 0.5;
    if (String(event.level.dimension) != 'minecraft:overworld') {
        player.displayClientMessage(Text.red('The Ark can only leave from Earth.'), true);
    } else if (!entity || !entity.isShapeValid()) {
        player.displayClientMessage(Text.red('The Ark is not finished. Check the hull against its blueprint in EMI.'), true);
    } else if (!exodusCountdowns.some((launch) => launch.x == x && launch.y == y && launch.z == z)) {
        exodusCountdowns.push({ x: x, y: y, z: z, ticks: 200 });
        exodusCrew(event.server, { x: x, y: y, z: z }).forEach((member) => {
            member.tell(Text.gold('The Exodus Ark is launching. Stay within 32 blocks of the bridge to come aboard.'));
            exodusFx(member, 'launch', { x: x, y: y, z: z, ticks: 200 });
        });
        exodusSound(event.server, player.username, 'minecraft:block.beacon.activate', 0.6);
    }
    event.cancel();
});

ServerEvents.tick((event) => {
    let server = event.server;
    if (server.tickCount % 10 == 0) {
        server.players.forEach((player) => {
            if (player.persistentData.getInt('exodus_landing') > 0 && String(player.level.dimension) == EXODUS_DIMENSION) exodusLand(server, player);
        });
    }
    if (exodusCountdowns.length == 0) return;
    exodusCountdowns = exodusCountdowns.filter((launch) => {
        launch.ticks--;
        if (launch.ticks > 0) {
            if (launch.ticks % 20 == 0) {
                let seconds = launch.ticks / 20;
                exodusCrew(server, launch).forEach((player) => exodusSound(server, player.username, 'minecraft:block.note_block.bass', seconds > 3 ? 0.7 : 1.4));
            }
            return true;
        }
        if (launch.ticks == 0) exodusCrew(server, launch).forEach((player) => {
            exodusFx(player, 'jump');
            exodusSound(server, player.username, 'minecraft:block.beacon.power_select', 0.5);
            exodusSound(server, player.username, 'minecraft:block.respawn_anchor.deplete', 0.6);
        });
        if (launch.ticks > -EXODUS_JUMP_TICKS) return true;
        exodusLaunch(server, launch);
        return false;
    });
});

ItemEvents.rightClicked('kubejs:exodus_key', (event) => {
    let player = event.player;
    if (String(event.level.dimension) != EXODUS_DIMENSION) return;
    let data = player.persistentData;
    if (!data.getBoolean('exodus_departed')) return;
    let name = player.username;
    exodusCommand(
        event.server,
        `execute in minecraft:overworld run tp ${name} ${data.getDouble('exodus_return_x')} ${data.getDouble('exodus_return_y')} ${data.getDouble('exodus_return_z')}`
    );
    exodusFx(player, 'shuttle');
    player.addItemCooldown('kubejs:exodus_key', 200);
});
