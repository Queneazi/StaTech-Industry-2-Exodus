// -----------------------------------------
// CREATED FOR USE IN
// STATECH INDUSTRY 2
// -----------------------------------------

const COLLAPSE = {
    enabled: true,
    worldDamage: true,
    blight: true,
    frequency: 1.0,
};

const COLLAPSE_EVENTS = {
    sand: { seconds: [150, 300], weight: 5 },
    storm: { seconds: [180, 300], weight: 5 },
    shower: { seconds: [60, 90], weight: 1 },
};

let $CollapseChunks = Java.loadClass('dev.ftb.mods.ftbchunks.api.FTBChunksAPI');
let $CollapseChunkDimPos = Java.loadClass('dev.ftb.mods.ftblibrary.math.ChunkDimPos');
let $CollapseBlockPos = Java.loadClass('net.minecraft.core.BlockPos');
let $CollapseExplosion = Java.loadClass('net.minecraft.world.level.Level$ExplosionInteraction');
let $CollapseGameRules = Java.loadClass('net.minecraft.world.level.GameRules');
let $CollapseRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries');
let $CollapseRL = Java.loadClass('net.minecraft.resources.ResourceLocation');
let $CollapseSounds = Java.loadClass('net.minecraft.sounds.SoundEvents');
let $CollapseString = Java.loadClass('com.mojang.brigadier.arguments.StringArgumentType');
const COLLAPSE_HEIGHTMAP = Java.loadClass('net.minecraft.world.level.levelgen.Heightmap$Types');
const COLLAPSE_SURFACE = COLLAPSE_HEIGHTMAP.MOTION_BLOCKING_NO_LEAVES;
const COLLAPSE_ROOF = COLLAPSE_HEIGHTMAP.MOTION_BLOCKING;
const COLLAPSE_CROPS = Java.loadClass('net.minecraft.tags.BlockTags').CROPS;
const COLLAPSE_ROOM_LIMIT = 6000;

let collapseTicks = 0;
let collapseMeteors = [];
let collapseRooms = [];
let collapseFxState = {};

let collapseCommand = (server, command) => server.runCommandSilent(command);
let collapseChance = (perSecond) => Math.random() < perSecond * COLLAPSE.frequency;
let collapseParticle = (name) => $CollapseRegistries.PARTICLE_TYPE.get($CollapseRL.parse('kubejs:' + name));
let collapseFx = (player, fx, data) => {
    let tag = { fx: fx };
    if (data) Object.keys(data).forEach((k) => { tag[k] = data[k]; });
    player.sendData('statech:fx', tag);
};
let collapseFxNear = (server, x, z, range, fx, data) => server.players.forEach((player) => {
    if (String(player.level.dimension) != 'minecraft:overworld') return;
    if (Math.abs(player.x - x) <= range && Math.abs(player.z - z) <= range) collapseFx(player, fx, data);
});

// -- WORLD HELPERS -- //

let collapseColumn = (level, x, z) => {
    let chunk = level.getChunkSource().getChunkNow(x >> 4, z >> 4);
    if (!chunk) return null;
    let y = chunk.getHeight(COLLAPSE_SURFACE, x & 15, z & 15) + 1;
    if (y <= level.getMinBuildHeight() + 1) return null;
    return { x: x, y: y, z: z, chunk: chunk };
};

let collapseClaimed = (level, x, z) => {
    try {
        let api = $CollapseChunks.api();
        if (!api.isManagerLoaded()) return false;
        return api.getManager().getChunk(new $CollapseChunkDimPos(level.dimension(), x >> 4, z >> 4)) != null;
    } catch (e) {
        return false;
    }
};

let collapseRandomColumn = (level, player, min, max) => {
    let angle = Math.random() * Math.PI * 2;
    let dist = min + Math.random() * (max - min);
    return collapseColumn(level, Math.floor(player.x + Math.cos(angle) * dist), Math.floor(player.z + Math.sin(angle) * dist));
};

let collapseExposed = (level, player) => level.canSeeSky($CollapseBlockPos.containing(player.x, player.y + 1.6, player.z));

let collapseGriefing = (level) => level.getGameRules().getBoolean($CollapseGameRules.RULE_MOBGRIEFING);

// -- TREMORS AND CAVE-INS -- //

const COLLAPSE_LOOSE_ROCK = ['minecraft:base_stone_overworld', 'minecraft:dirt', 'c:gravels'];
let collapseLooseRock = (level, x, y, z) => {
    let block = level.getBlock(x, y, z);
    return COLLAPSE_LOOSE_ROCK.some((tag) => block.hasTag(tag));
};

let collapseTremor = (server, level, player) => {
    let name = player.username;
    let power = 0.5 + Math.random() * 1.3;
    collapseCommand(server, `execute as ${name} at @s run playsound minecraft:entity.warden.dig master @s ~ ~-2 ~ 1 0.5`);
    collapseCommand(server, `execute as ${name} at @s run playsound minecraft:block.deepslate.break master @s ~ ~-2 ~ 1 0.5`);
    collapseFx(player, 'tremor', { power: power });
    if (power < 1.2 || collapseExposed(level, player) || !COLLAPSE.worldDamage) return;
    let px = Math.floor(player.x), py = Math.floor(player.y), pz = Math.floor(player.z);
    if (collapseClaimed(level, px, pz)) return;
    for (let i = 0; i < 2; i++) {
        let x = px + Math.floor(Math.random() * 3) - 1, z = pz + Math.floor(Math.random() * 3) - 1;
        if (!level.getBlockState(new $CollapseBlockPos(x, py + 1, z)).isAir()) continue;
        for (let y = py + 2; y <= py + 6; y++) {
            if (level.getBlockState(new $CollapseBlockPos(x, y, z)).isAir()) continue;
            if (collapseLooseRock(level, x, y, z)) {
                collapseCommand(server, `execute in minecraft:overworld run summon minecraft:falling_block ${x + 0.5} ${y - 1} ${z + 0.5} {BlockState:{Name:"minecraft:gravel"},Time:1,HurtEntities:1b,FallHurtAmount:2.0f,FallHurtMax:8}`);
            }
            break;
        }
    }
};

// -- METEORS -- //

let collapseLaunchMeteor = (server, level, player, small) => {
    let target = small ? collapseRandomColumn(level, player, 20, 96) : collapseRandomColumn(level, player, 36, 80);
    if (!target) return false;
    let meteor = {
        x: target.x, y: target.y, z: target.z,
        sx: target.x + (Math.random() - 0.5) * 200, sy: target.y + 110, sz: target.z + (Math.random() - 0.5) * 200,
        t: 0, duration: 45, small: !!small,
        shielded: collapseClaimed(level, target.x, target.z) || !COLLAPSE.worldDamage,
    };
    collapseMeteors.push(meteor);
    collapseFxNear(server, target.x, target.z, 200, 'meteor', { sx: meteor.sx, sy: meteor.sy, sz: meteor.sz, tx: target.x + 0.5, ty: target.y, tz: target.z + 0.5, ticks: meteor.duration });
    server.players.forEach((other) => {
        if (String(other.level.dimension) != 'minecraft:overworld') return;
        if (Math.abs(other.x - target.x) > 160 || Math.abs(other.z - target.z) > 160) return;
        collapseCommand(server, `execute as ${other.username} at @s run playsound minecraft:entity.firework_rocket.large_blast_far master @s ~ ~ ~ 1 0.5`);
    });
    return true;
};

let collapseMeteorTick = (server) => {
    if (collapseMeteors.length == 0) return;
    let level = server.overworld();
    collapseMeteors = collapseMeteors.filter((meteor) => {
        meteor.t++;
        if (meteor.t < meteor.duration) return true;
        if (!level.getChunkSource().getChunkNow(meteor.x >> 4, meteor.z >> 4)) return false;
        let power = meteor.small ? 2.2 + Math.random() : 3.5 + Math.random() * 2;
        let grief = !meteor.shielded && collapseGriefing(level);
        level.explode(null, null, null, meteor.x + 0.5, meteor.y + 0.5, meteor.z + 0.5, power, grief, grief ? $CollapseExplosion.MOB : $CollapseExplosion.NONE,
            collapseParticle('entry_smoke'), collapseParticle('collapse_shock'), $CollapseSounds.GENERIC_EXPLODE);
        collapseFxNear(server, meteor.x, meteor.z, 200, 'impact', { x: meteor.x + 0.5, y: meteor.y, z: meteor.z + 0.5, power: power });
        if (grief) {
            let crater = collapseColumn(level, meteor.x, meteor.z);
            if (crater) level.getBlock(meteor.x, crater.y - 1, meteor.z).set('minecraft:magma_block');
        }
        let landed = collapseColumn(level, meteor.x, meteor.z);
        let dropY = landed ? landed.y : meteor.y + 1;
        level.getBlock(meteor.x, dropY, meteor.z).popItem(Item.of('kubejs:meteorite_fragment', meteor.small ? Math.floor(Math.random() * 2) + 1 : 2 + Math.floor(Math.random() * 3)));
        collapseCommand(server, `execute in minecraft:overworld run playsound minecraft:entity.lightning_bolt.thunder master @a ${meteor.x} ${meteor.y} ${meteor.z} 8 0.5`);
        return false;
    });
};

// -- SUPERSTORM LIGHTNING -- //

let collapseStrike = (server, level, x, y, z) => {
    collapseCommand(server, `execute in minecraft:overworld run summon minecraft:lightning_bolt ${x + 0.5} ${y} ${z + 0.5}`);
};

// -- CROP BLIGHT AND SEALED GREENHOUSES -- //

let collapseKey = (x, y, z) => x + ',' + y + ',' + z;

// true: sealed room, false: open to the sky or too large, null: reaches unloaded chunks
let collapseSealedRoom = (level, sx, sy, sz) => {
    let now = collapseTicks;
    collapseRooms = collapseRooms.filter((room) => room.until > now);
    let start = collapseKey(sx, sy, sz);
    for (let i = 0; i < collapseRooms.length; i++) if (collapseRooms[i].cells[start]) return true;
    let cells = {}, queue = [[sx, sy, sz]], count = 0, head = 0;
    let top = level.getMaxBuildHeight(), bottom = level.getMinBuildHeight();
    cells[start] = true;
    while (head < queue.length) {
        let c = queue[head++], x = c[0], y = c[1], z = c[2];
        let chunk = level.getChunkSource().getChunkNow(x >> 4, z >> 4);
        if (!chunk) return null;
        if (y >= chunk.getHeight(COLLAPSE_ROOF, x & 15, z & 15) + 1) return false;
        if (++count > COLLAPSE_ROOM_LIMIT) return false;
        for (let d = 0; d < 6; d++) {
            let nx = x + (d == 0 ? 1 : d == 1 ? -1 : 0), ny = y + (d == 2 ? 1 : d == 3 ? -1 : 0), nz = z + (d == 4 ? 1 : d == 5 ? -1 : 0);
            if (ny >= top || ny < bottom) continue;
            let key = collapseKey(nx, ny, nz);
            if (cells[key]) continue;
            let pos = new $CollapseBlockPos(nx, ny, nz);
            if (!level.getChunkSource().getChunkNow(nx >> 4, nz >> 4)) return null;
            let state = level.getBlockState(pos);
            if (!state.isAir() && !state.getCollisionShape(level, pos).isEmpty()) continue;
            cells[key] = true;
            queue.push([nx, ny, nz]);
        }
    }
    collapseRooms.push({ cells: cells, until: now + 1200 });
    return true;
};

let collapseIsCrop = (state) => {
    let block = state.getBlock();
    if (block.getStateForAge && block.getAge) return true;
    try {
        return state['is(net.minecraft.tags.TagKey)'](COLLAPSE_CROPS);
    } catch (e) {
        return false;
    }
};

let collapseBlight = (level, player, samples) => {
    let px = Math.floor(player.x), py = Math.floor(player.y), pz = Math.floor(player.z);
    let dead = 0;
    for (let i = 0; i < samples; i++) {
        let x = px + Math.floor(Math.random() * 49) - 24;
        let z = pz + Math.floor(Math.random() * 49) - 24;
        if (!level.getChunkSource().getChunkNow(x >> 4, z >> 4)) continue;
        for (let y = py + 6; y >= py - 6; y--) {
            let pos = new $CollapseBlockPos(x, y, z);
            let state = level.getBlockState(pos);
            if (state.isAir() || !collapseIsCrop(state)) continue;
            if (collapseSealedRoom(level, x, y, z) === false) {
                level.destroyBlock(pos, false);
                dead++;
            }
            break;
        }
    }
    return dead;
};

// -- WORLD EVENTS: SANDSTORMS, SUPERSTORMS, METEOR SHOWERS -- //

let collapseStartEvent = (server, kind) => {
    let event = COLLAPSE_EVENTS[kind];
    let data = server.persistentData;
    let seconds = event.seconds[0] + Math.floor(Math.random() * (event.seconds[1] - event.seconds[0]));
    data.putString('collapse_event', kind);
    data.putInt('collapse_event_left', seconds);
    if (kind == 'storm') collapseCommand(server, `weather thunder ${seconds}s`);
    if (kind == 'sand' || kind == 'shower') collapseCommand(server, `weather clear ${seconds}s`);
    collapseFxState = {};
};

let collapseStopEvent = (server) => {
    let data = server.persistentData;
    data.putString('collapse_event', '');
    data.putInt('collapse_event_cooldown', Math.floor((600 + Math.random() * 900) / Math.max(COLLAPSE.frequency, 0.05)));
    collapseFxState = {};
};

let collapseWorldEvents = (server, level) => {
    let data = server.persistentData;
    let active = String(data.getString('collapse_event'));
    if (active) {
        if (!COLLAPSE_EVENTS[active]) return collapseStopEvent(server);
        let left = data.getInt('collapse_event_left') - 1;
        data.putInt('collapse_event_left', left);
        if (left > 0) return;
        collapseStopEvent(server);
        return;
    }
    let cooldown = data.getInt('collapse_event_cooldown');
    if (cooldown > 0) {
        data.putInt('collapse_event_cooldown', cooldown - 1);
        return;
    }
    if (!collapseChance(1 / 300)) return;
    let total = 0, kinds = Object.keys(COLLAPSE_EVENTS);
    kinds.forEach((kind) => { total += COLLAPSE_EVENTS[kind].weight; });
    let roll = Math.random() * total;
    for (let i = 0; i < kinds.length; i++) {
        roll -= COLLAPSE_EVENTS[kinds[i]].weight;
        if (roll < 0) return collapseStartEvent(server, kinds[i]);
    }
};

let collapseEventEffects = (server, level, player, kind) => {
    let name = player.username;
    let exposed = collapseExposed(level, player);
    if (kind == 'sand') {
        if (exposed && collapseTicks % 60 == 0) collapseCommand(server, `effect give ${name} minecraft:slowness 5 0 true`);
        if (exposed && collapseTicks % 160 == 0) collapseCommand(server, `execute as ${name} at @s run playsound minecraft:item.elytra.flying ambient @s ~ ~ ~ 0.3 0.6`);
    }
    if (kind == 'storm') {
        if (!COLLAPSE.worldDamage || !collapseChance(0.08)) return;
        let spot = collapseRandomColumn(level, player, 16, 48);
        if (spot && !collapseClaimed(level, spot.x, spot.z)) collapseStrike(server, level, spot.x, spot.y, spot.z);
    }
    if (kind == 'shower') {
        if (Math.random() < 0.7) collapseLaunchMeteor(server, level, player, true);
        if (Math.random() < 0.25) collapseLaunchMeteor(server, level, player, true);
    }
};

// -- MAIN LOOP -- //

let collapsePlayer = (server, level, player, event) => {
    if (collapseFxState[player.username] !== event || collapseTicks % 200 == 0) {
        collapseFxState[player.username] = event;
        collapseFx(player, 'state', { event: event });
    }
    if (player.isSpectator()) return;
    if (collapseChance(0.002)) collapseTremor(server, level, player);
    if (collapseChance(0.0012)) collapseLaunchMeteor(server, level, player);
    if (COLLAPSE.blight) collapseBlight(level, player, event == 'sand' ? 96 : 48);
    if (event) collapseEventEffects(server, level, player, event);
};

ServerEvents.tick((event) => {
    if (!COLLAPSE.enabled) return;
    let server = event.server;
    collapseTicks++;
    collapseMeteorTick(server);
    if (collapseTicks % 20 != 0) return;
    let level = server.overworld();
    let players = [];
    server.players.forEach((player) => {
        if (String(player.level.dimension) == 'minecraft:overworld') players.push(player);
        else if (collapseFxState[player.username]) {
            collapseFxState[player.username] = '';
            collapseFx(player, 'state', { event: '' });
        }
    });
    if (players.length == 0) return;
    collapseWorldEvents(server, level);
    let active = String(server.persistentData.getString('collapse_event'));
    players.forEach((player) => collapsePlayer(server, level, player, active));
});

// -- COMMAND -- //

ServerEvents.commandRegistry((event) => {
    let Commands = event.commands;
    event.register(
        Commands.literal('collapse')
            .requires((source) => source.hasPermission(2))
            .then(Commands.argument('event', $CollapseString.word()).executes((ctx) => {
                let kind = String($CollapseString.getString(ctx, 'event'));
                let server = ctx.source.server;
                let player = ctx.source.getPlayer();
                if (kind == 'stop') collapseStopEvent(server);
                else if (COLLAPSE_EVENTS[kind]) collapseStartEvent(server, kind);
                else if (kind == 'tremor' && player) collapseTremor(server, server.overworld(), player);
                else if (kind == 'meteor' && player) collapseLaunchMeteor(server, server.overworld(), player);
                else return 0;
                return 1;
            }))
    );
});

// -- METEORITE FRAGMENTS -- //

ServerEvents.recipes((event) => {
    macerator(
        event,
        'statech:collapse/meteorite_fragment',
        16,
        200,
        [{ amount: 1, item: kj('meteorite_fragment') }],
        [
            { amount: 2, item: mi('iron_dust') },
            { amount: 1, item: mi('nickel_dust') },
            { amount: 1, item: mi('platinum_dust'), probability: 0.25 },
        ]
    );
});
