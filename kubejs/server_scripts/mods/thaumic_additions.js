// -----------------------------------------
// THAUMIC ADDITIONS FOR
// STATECH INDUSTRY 2
// -----------------------------------------

let $TagKey = Java.loadClass('net.minecraft.tags.TagKey');
let $Registries = Java.loadClass('net.minecraft.core.registries.Registries');
let $BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries');
let $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation');

const CELL_DENIED_TAGS = ['c:bosses', 'c:capturing_not_supported'].map((tag) =>
    $TagKey.create($Registries.ENTITY_TYPE, $ResourceLocation.parse(tag))
);

let cellDenied = (id) => {
    let denied = false;
    CELL_DENIED_TAGS.forEach((tag) => {
        $BuiltInRegistries.ENTITY_TYPE.getTagOrEmpty(tag).forEach((holder) => {
            if (String(holder.getRegisteredName()) == id) denied = true;
        });
    });
    return denied;
};

ItemEvents.entityInteracted('thaumadditions:dna_sample', (event) => {
    let id = event.target.getEncodeId();
    if (!id || !cellDenied(String(id))) return;
    event.player.displayClientMessage(Text.red('This creature is too powerful to hold in an Entity Cell.'), true);
    event.cancel();
});
