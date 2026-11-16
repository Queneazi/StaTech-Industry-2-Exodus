// -----------------------------------------
// CREATED FOR USE IN
// STATECH INDUSTRY 2
// -----------------------------------------

StartupEvents.registry('item', (event) => {
    event
        .create('meteorite_fragment')
        .rarity('Uncommon')
        .fireResistant(true)
        .tooltip('§7A shard of a shattered comet, still warm\n§8Macerate for iron, nickel and platinum');
});
