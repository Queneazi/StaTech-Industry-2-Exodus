// -----------------------------------------
// EXODUS: THE ARK AND ITS MODULES FOR
// STATECH INDUSTRY 2
// -----------------------------------------

StartupEvents.registry('block', (event) => {
    event
        .create('kubejs:ark_hull_plating')
        .soundType('metal')
        .requiresTool(true)
        .hardness(8)
        .resistance(1200)
        .tagBlock('minecraft:mineable/pickaxe')
        .tagBlock('minecraft:needs_iron_tool');

    event
        .create('kubejs:ark_viewport')
        .glassSoundType()
        .requiresTool(true)
        .hardness(4)
        .resistance(1200)
        .defaultTranslucent()
        .transparent(true)
        .tagBlock('minecraft:mineable/pickaxe')
        .tagBlock('minecraft:needs_iron_tool');

    event
        .create('kubejs:ark_thruster')
        .soundType('metal')
        .requiresTool(true)
        .hardness(8)
        .resistance(1200)
        .lightLevel(0.7)
        .tagBlock('minecraft:mineable/pickaxe')
        .tagBlock('minecraft:needs_iron_tool');

    event
        .create('kubejs:ark_warp_coil')
        .soundType('metal')
        .requiresTool(true)
        .hardness(8)
        .resistance(1200)
        .lightLevel(1.0)
        .tagBlock('minecraft:mineable/pickaxe')
        .tagBlock('minecraft:needs_iron_tool');
});

StartupEvents.registry('item', (event) => {
    event
        .create('cryostasis_module')
        .maxStackSize(16)
        .rarity('Rare')
        .tooltip('§bSleeps a thousand colonists through the crossing');

    event
        .create('biosphere_vault')
        .maxStackSize(16)
        .rarity('Rare')
        .tooltip('§aEvery seed the dying Earth could spare');

    event
        .create('stellar_navigation_core')
        .maxStackSize(1)
        .rarity('Epic')
        .tooltip('§dHolds the route to New Eden, through the Void');

    event
        .create('antimatter_warp_drive')
        .maxStackSize(1)
        .rarity('Epic')
        .tooltip('§5Folds 2.5 million light-years into one jump');

    event
        .create('exodus_key')
        .maxStackSize(1)
        .rarity('Epic')
        .glow(true)
        .tooltip(
            '§6Use on the Exodus Ark to launch\n§7In New Eden, use it to ride a shuttle back to Earth'
        );
});
