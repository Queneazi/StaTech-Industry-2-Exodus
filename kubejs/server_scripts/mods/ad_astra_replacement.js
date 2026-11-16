// -----------------------------------------
// CREATED BY DINO FOR USE IN
// STATECH INDUSTRY 2
// -----------------------------------------

ServerEvents.recipes((event) => {
    // -- MOD NAMESPACE UTILITY FUNCTIONS -- //
    let st = (id) => `statech:space_age/${id}`;

    // -- PROBE COMPUTERS -- //
    event
        .shaped(kj('mki_probe_computer'), ['SCS', 'THD', 'SES'], {
            S: '#c:large_plates/steel',
            C: kj('rocket_cone'),
            E: kj('steel_engine'),
            H: mi('advanced_machine_hull'),
            T: mi('transistor'),
            D: mi('diode'),
        })
        .id(st('mki_probe_computer'));

    event
        .shaped(kj('mkii_probe_computer'), ['SCS', 'THD', 'SES'], {
            S: '#c:large_plates/stainless_steel',
            C: kj('rocket_cone'),
            E: kj('desh_engine'),
            H: mi('turbo_machine_hull'),
            T: mi('and_gate'),
            D: mi('or_gate'),
        })
        .id(st('mkii_probe_computer'));

    event
        .shaped(kj('mkiii_probe_computer'), ['SCS', 'THD', 'SES'], {
            S: '#c:large_plates/stainless_steel',
            C: kj('rocket_cone'),
            E: kj('ostrum_engine'),
            H: mi('highly_advanced_machine_hull'),
            T: mi('arithmetic_logic_unit'),
            D: mi('memory_management_unit'),
        })
        .id(st('mkiii_probe_computer'));

    // -- TIERED SPACE PROBES -- //
    event
        .shaped('4x ' + kj('basic_space_probe'), ['GCD', 'FTC', 'IFG'], {
            G: '#c:gears/steel',
            C: mi('electrum_cable'),
            T: kj('steel_fuel_tank'),
            F: kj('rocket_fin'),
            D: mi('aluminum_drill'),
            I: '#modern_industrialization:item_pipes',
        })
        .id(st('basic_space_probe'));

    event
        .shaped('4x ' + kj('advanced_space_probe'), ['GCD', 'FTC', 'IFG'], {
            G: '#c:gears/desh',
            C: mi('aluminum_cable'),
            T: kj('desh_fuel_tank'),
            F: kj('rocket_fin'),
            D: mi('stainless_steel_drill'),
            I: '#modern_industrialization:item_pipes',
        })
        .id(st('advanced_space_probe'));

    event
        .shaped(
            '4x ' + kj('highly_advanced_space_probe'),
            ['GCD', 'FTC', 'IFG'],
            {
                G: '#c:gears/ostrum',
                C: mi('annealed_copper_cable'),
                T: kj('ostrum_fuel_tank'),
                F: kj('rocket_fin'),
                D: mi('titanium_drill'),
                I: '#modern_industrialization:item_pipes',
            }
        )
        .id(st('highly_advanced_space_probe'));

    // -- AD ASTRA MACHINE AND SUIT RECIPES -- //
    const overrides = [
        'ad_astra:nasa_workbench',
        'ad_astra:launch_pad',
        'ad_astra:fuel_refinery',
        'ad_astra:oxygen_loader',
        'ad_astra:oxygen_distributor',
        'ad_astra:gas_tank',
        'ad_astra:large_gas_tank',
        'ad_astra:fan',
        'ad_astra:oxygen_gear',
        'ad_astra:space_suit',
        'ad_astra:space_helmet',
        'ad_astra:space_pants',
        'ad_astra:space_boots',
        'ad_astra:netherite_space_suit',
        'ad_astra:netherite_space_helmet',
        'ad_astra:netherite_space_pants',
        'ad_astra:netherite_space_boots',
        'ad_astra:jet_suit',
        'ad_astra:jet_suit_helmet',
        'ad_astra:jet_suit_pants',
        'ad_astra:jet_suit_boots',
        'ad_astra:tier_1_rover',
        'ad_astra:wheel',
        'ad_astra:radio',
        'ad_astra:zip_gun',
        'ad_astra:coal_generator',
        'ad_astra:compressor',
        'ad_astra:etrionic_blast_furnace',
        'ad_astra:etrionic_capacitor',
        'ad_astra:gravity_normalizer',
        'ad_astra_giselle_addon:crafting/automation_nasa_workbench',
        'ad_astra_giselle_addon:crafting/fuel_loader',
        'ad_astra_giselle_addon:crafting/gravity_normalizer',
        'ad_astra_giselle_addon:crafting/rocket_sensor',
    ];
    overrides.forEach((id) => event.remove({ id: id }));

    const OBSOLETE_ROCKET_PARTS = [
        'ad_astra:steel_engine',
        'ad_astra:desh_engine',
        'ad_astra:ostrum_engine',
        'ad_astra:calorite_engine',
        'ad_astra:steel_tank',
        'ad_astra:desh_tank',
        'ad_astra:ostrum_tank',
        'ad_astra:calorite_tank',
        'ad_astra:engine_frame',
        'ad_astra:rocket_fin',
        'ad_astra:rocket_nose_cone',
    ];
    OBSOLETE_ROCKET_PARTS.forEach((id) => event.remove({ id: id }));

    // NASA Workbench - LV
    event
        .shaped('ad_astra:nasa_workbench', ['|#|', 'TCT', '#B#'], {
            '|': mi('steel_rod'),
            '#': '#c:large_plates/steel',
            T: mi('electronic_circuit'),
            C: mc('crafting_table'),
            B: mi('advanced_machine_hull'),
        })
        .id('ad_astra:nasa_workbench');

    // Launch Pad - LV
    event
        .shaped('ad_astra:launch_pad', ['#|#', '|H|', '#|#'], {
            '#': '#c:plates/steel',
            '|': mi('steel_rod'),
            H: mi('basic_machine_hull'),
        })
        .id('ad_astra:launch_pad');

    // Fuel Refinery - HV
    event
        .shaped('ad_astra:fuel_refinery', ['#P#', 'BHB', '#C#'], {
            '#': '#c:plates/stainless_steel',
            P: mi('large_pump'),
            B: mc('bucket'),
            H: mi('turbo_machine_hull'),
            C: mi('digital_circuit'),
        })
        .id('ad_astra:fuel_refinery');

    // Oxygen Loader - LV
    event
        .shaped('ad_astra:oxygen_loader', ['#P#', 'GHG', '#C#'], {
            '#': '#c:plates/aluminum',
            P: mi('pump'),
            G: 'ad_astra:gas_tank',
            H: mi('advanced_machine_hull'),
            C: mi('electronic_circuit'),
        })
        .id('ad_astra:oxygen_loader');

    // Giselle Fuel Loader - HV
    event
        .shaped('ad_astra_giselle_addon:fuel_loader', ['SSS', 'PHP', 'SSS'], {
            S: '#c:plates/stainless_steel',
            P: mi('large_pump'),
            H: mi('turbo_machine_hull'),
        })
        .id('ad_astra_giselle_addon:crafting/fuel_loader');

    // Giselle Rocket Sensor - HV
    event
        .shaped('ad_astra_giselle_addon:rocket_sensor', ['SSS', 'POP', 'SSS'], {
            S: '#c:plates/stainless_steel',
            P: mi('digital_circuit'),
            O: mc('observer'),
        })
        .id('ad_astra_giselle_addon:crafting/rocket_sensor');

    // Giselle Automation NASA Workbench - Moon
    event
        .shaped(
            'ad_astra_giselle_addon:automation_nasa_workbench',
            ['SHS', 'RNR', 'SHS'],
            {
                S: '#c:plates/desh',
                H: mi('robot_arm'),
                R: mi('digital_circuit'),
                N: 'ad_astra:nasa_workbench',
            }
        )
        .id('ad_astra_giselle_addon:crafting/automation_nasa_workbench');

    // Giselle Gravity Normalizer - Moon
    event
        .shaped('ad_astra_giselle_addon:gravity_normalizer', ['SSS', 'PBP', 'SSS'], {
            S: '#c:plates/desh',
            P: mi('digital_circuit'),
            B: 'ad_astra:space_boots',
        })
        .id('ad_astra_giselle_addon:crafting/gravity_normalizer');

    // Coal Generator - LV
    event
        .shaped('ad_astra:coal_generator', ['#C#', 'CHC', '#F#'], {
            '#': '#c:plates/steel',
            C: mc('coal_block'),
            H: mi('basic_machine_hull'),
            F: mc('furnace'),
        })
        .id('ad_astra:coal_generator');

    // Compressor & Etrionic Blast Furnace - HV
    event
        .shaped('ad_astra:compressor', ['#P#', 'CHC', '#P#'], {
            '#': '#c:plates/stainless_steel',
            P: mi('piston'),
            C: mi('digital_circuit'),
            H: mi('turbo_machine_hull'),
        })
        .id('ad_astra:compressor');

    event
        .shaped('ad_astra:etrionic_blast_furnace', ['#F#', 'CHC', '###'], {
            '#': '#c:plates/stainless_steel',
            F: mc('blast_furnace'),
            C: mi('digital_circuit'),
            H: mi('turbo_machine_hull'),
        })
        .id('ad_astra:etrionic_blast_furnace');

    // Etrionic Capacitor - Moon
    event
        .shaped('ad_astra:etrionic_capacitor', ['R#R', '#C#', 'D#D'], {
            R: mc('redstone'),
            '#': '#c:plates/desh',
            C: mi('capacitor'),
            D: mi('digital_circuit'),
        })
        .id('ad_astra:etrionic_capacitor');

    // Gravity Normalizer - Moon
    event
        .shaped('ad_astra:gravity_normalizer', ['EHE', '###'], {
            E: 'ad_astra:etrionic_capacitor',
            H: mi('turbo_machine_hull'),
            '#': '#c:plates/desh',
        })
        .id('ad_astra:gravity_normalizer');

    // Radio - MV
    event
        .shaped('ad_astra:radio', ['|  ', '#C#', '###'], {
            '|': mi('steel_rod'),
            '#': '#c:plates/steel',
            C: mi('electronic_circuit'),
        })
        .id('ad_astra:radio');

    // Wheel - MV
    event
        .shaped('ad_astra:wheel', [' R ', 'R#R', ' R '], {
            R: mi('rubber_sheet'),
            '#': '#c:plates/steel',
        })
        .id('ad_astra:wheel');

    // Zip Gun - Moon
    event
        .shaped('ad_astra:zip_gun', ['##|', 'G  '], {
            '#': '#c:plates/desh',
            '|': mi('stainless_steel_rod'),
            G: 'ad_astra:large_gas_tank',
        })
        .id('ad_astra:zip_gun');

    // Oxygen Distributor - HV
    event
        .shaped('ad_astra:oxygen_distributor', ['FGF', 'HLF', '#C#'], {
            F: 'ad_astra:fan',
            G: 'ad_astra:large_gas_tank',
            H: mi('turbo_machine_hull'),
            L: 'ad_astra:oxygen_loader',
            '#': '#c:plates/desh',
            C: mi('digital_circuit'),
        })
        .id('ad_astra:oxygen_distributor');

    // Gas Tank - LV
    event
        .shaped('ad_astra:gas_tank', ['| ', '##', '##'], {
            '|': mi('steel_rod'),
            '#': '#c:plates/steel',
        })
        .id('ad_astra:gas_tank');

    // Large Gas Tank - MV
    event
        .shaped('ad_astra:large_gas_tank', [' P ', '#G#', '#G#'], {
            P: mi('advanced_pump'),
            '#': '#c:plates/steel',
            G: 'ad_astra:gas_tank',
        })
        .id('ad_astra:large_gas_tank');

    // Fan - LV
    event
        .shaped('ad_astra:fan', ['# #', ' R ', '# #'], {
            '#': '#c:plates/steel',
            R: mi('aluminum_rotor'),
        })
        .id('ad_astra:fan');

    // Oxygen Gear - LV
    event
        .shaped('ad_astra:oxygen_gear', [' | ', '#P#', '#|#'], {
            '|': mi('steel_rod'),
            '#': '#c:plates/steel',
            P: mi('pump'),
        })
        .id('ad_astra:oxygen_gear');

    // Space Suit - LV
    event
        .shaped('ad_astra:space_suit', ['#C#', 'TOT', '#W#'], {
            '#': '#c:plates/aluminum',
            C: mi('electronic_circuit'),
            T: 'ad_astra:gas_tank',
            O: 'ad_astra:oxygen_gear',
            W: '#minecraft:wool',
        })
        .id('ad_astra:space_suit');

    // Space Helmet - LV
    event
        .shaped('ad_astra:space_helmet', ['#C#', '#P#'], {
            '#': '#c:plates/aluminum',
            C: mi('electronic_circuit'),
            P: mc('glass_pane'),
        })
        .id('ad_astra:space_helmet');

    // Space Pants - LV
    event
        .shaped('ad_astra:space_pants', ['###', 'W W', '# #'], {
            '#': '#c:plates/aluminum',
            W: '#minecraft:wool',
        })
        .id('ad_astra:space_pants');

    // Space Boots - LV
    event
        .shaped('ad_astra:space_boots', ['W W', '# #'], {
            '#': '#c:plates/aluminum',
            W: '#minecraft:wool',
        })
        .id('ad_astra:space_boots');

    // Netherite Space Suit - HV
    event
        .shaped('ad_astra:netherite_space_suit', ['#C#', 'TOT', '#N#'], {
            '#': '#c:plates/ostrum',
            C: mi('digital_circuit'),
            T: 'ad_astra:large_gas_tank',
            O: 'ad_astra:oxygen_gear',
            N: mc('netherite_chestplate'),
        })
        .id('ad_astra:netherite_space_suit');

    // Netherite Space Helmet - HV
    event
        .shaped('ad_astra:netherite_space_helmet', ['#N#', '#G#'], {
            '#': '#c:plates/ostrum',
            N: mc('netherite_helmet'),
            G: mc('glass'),
        })
        .id('ad_astra:netherite_space_helmet');

    // Netherite Space Pants - HV
    event
        .shaped('ad_astra:netherite_space_pants', ['#N#', 'D D', '# #'], {
            '#': '#c:plates/ostrum',
            D: '#c:plates/desh',
            N: mc('netherite_leggings'),
        })
        .id('ad_astra:netherite_space_pants');

    // Netherite Space Boots - HV
    event
        .shaped('ad_astra:netherite_space_boots', [' N ', 'D D', '# #'], {
            '#': '#c:plates/ostrum',
            D: '#c:plates/desh',
            N: mc('netherite_boots'),
        })
        .id('ad_astra:netherite_space_boots');

    // Jet Suit - Quantum Era
    event
        .shaped('ad_astra:jet_suit', ['#Q#', 'TNT', 'CEC'], {
            '#': '#c:plates/calorite',
            Q: mi('quantum_machine_hull'),
            T: kj('calorite_fuel_tank'),
            N: 'ad_astra:netherite_space_suit',
            C: mi('quantum_circuit'),
            E: kj('calorite_engine'),
        })
        .id('ad_astra:jet_suit');

    // Jet Suit Helmet - Quantum Era
    event
        .shaped('ad_astra:jet_suit_helmet', ['#N#', '#G#'], {
            '#': '#c:plates/calorite',
            N: 'ad_astra:netherite_space_helmet',
            G: mc('tinted_glass'),
        })
        .id('ad_astra:jet_suit_helmet');

    // Jet Suit Pants - Quantum Era
    event
        .shaped('ad_astra:jet_suit_pants', ['BNB', '# #', '# #'], {
            B: '#c:storage_blocks/calorite',
            N: 'ad_astra:netherite_space_pants',
            '#': '#c:plates/calorite',
        })
        .id('ad_astra:jet_suit_pants');

    // Jet Suit Boots - Quantum Era
    event
        .shaped('ad_astra:jet_suit_boots', [' N ', '# #', 'B B'], {
            N: 'ad_astra:netherite_space_boots',
            '#': '#c:plates/calorite',
            B: '#c:storage_blocks/calorite',
        })
        .id('ad_astra:jet_suit_boots');

    // Tier 1 Rover - MV
    event
        .shaped('ad_astra:tier_1_rover', ['D |', 'GR#', 'WPW'], {
            D: '#c:storage_blocks/desh',
            '|': mi('steel_rod'),
            G: 'ad_astra:large_gas_tank',
            R: 'ad_astra:radio',
            '#': kj('desh_engine'),
            W: 'ad_astra:wheel',
            P: '#c:plates/desh',
        })
        .id('ad_astra:tier_1_rover');
});

ServerEvents.tags('fluid', (event) => {
    event.removeAll('ad_astra:tier_1_rocket_fuel');
    event.add('ad_astra:tier_1_rocket_fuel', [
        'modern_industrialization:creosote',
        'ad_astra:fuel',
        'modern_industrialization:diesel',
        'modern_industrialization:boosted_diesel',
        'ad_astra:cryo_fuel',
    ]);

    event.removeAll('ad_astra:tier_2_rocket_fuel');
    event.add('ad_astra:tier_2_rocket_fuel', [
        'modern_industrialization:boosted_diesel',
        'ad_astra:cryo_fuel',
    ]);

    event.removeAll('ad_astra:tier_3_rocket_fuel');
    event.add('ad_astra:tier_3_rocket_fuel', [
        'modern_industrialization:boosted_diesel',
        'ad_astra:cryo_fuel',
    ]);

    event.removeAll('ad_astra:tier_4_rocket_fuel');
    event.add('ad_astra:tier_4_rocket_fuel', 'ad_astra:cryo_fuel');
});

RecipeViewerEvents.removeEntriesCompletely('item', (event) => {
    const OBSOLETE_ROCKET_PARTS = [
        'ad_astra:steel_engine',
        'ad_astra:desh_engine',
        'ad_astra:ostrum_engine',
        'ad_astra:calorite_engine',
        'ad_astra:steel_tank',
        'ad_astra:desh_tank',
        'ad_astra:ostrum_tank',
        'ad_astra:calorite_tank',
        'ad_astra:engine_frame',
        'ad_astra:rocket_fin',
        'ad_astra:rocket_nose_cone',
    ];
    OBSOLETE_ROCKET_PARTS.forEach((id) => event.remove(id));
});
