// -----------------------------------------
// AD ASTRA: PLANETS INTEGRATION FOR
// STATECH INDUSTRY 2
// -----------------------------------------

ServerEvents.recipes((event) => {
    // -- MOD NAMESPACE UTILITY FUNCTIONS -- //
    let st = (id) => `statech:ad_astra_planets/${id}`;
    let ap = (id) => `adastraplanets:${id}`;

    // -- PLANET METALS -- //
    // [metal, Electric Blast Furnace EU/t, duration]
    const PLANET_METALS = [
        ['umbrite', 64, 600],
        ['pallorite', 64, 600],
        ['helionite', 128, 800],
        ['stormium', 384, 800],
        ['igneum', 384, 800],
        ['abyssium', 384, 800],
        ['aurorium', 384, 800],
        ['eonyx', 384, 800],
        ['cassinium', 512, 1000],
        ['tholinar', 512, 1000],
        ['nivalum', 512, 1000],
        ['ferrolith', 512, 1000],
        ['vesperine', 512, 1000],
        ['azurane', 640, 1200],
        ['mosaicon', 640, 1200],
        ['obscurex', 640, 1200],
        ['chasmal', 640, 1200],
        ['tempestine', 768, 1400],
        ['nitralis', 768, 1400],
        ['cordium', 896, 1600],
        ['mordrine', 896, 1600],
        ['albedon', 1024, 1800],
        ['shardex', 1024, 1800],
    ];

    event.remove({ id: /^adastraplanets:(smelting|blasting)\/.*_ingot_from_.*/ });
    PLANET_METALS.forEach((metal) => {
        blastFurnace(
            event,
            st(`blast_furnace/${metal[0]}_ingot`),
            metal[1],
            metal[2],
            [{ amount: 1, item: ap(`raw_${metal[0]}`) }],
            [{ amount: 1, item: ap(`${metal[0]}_ingot`) }]
        );
    });

    // -- ROCKET PARTS -- //
    // [part, previous tier part, metal, plates, tier index]
    const ROCKET_PART_TIERS = [
        { duration: 3200, enderium: 250 },
        { duration: 4000, enderium: 500 },
        { duration: 4800, enderium: 750 },
        { duration: 6000, enderium: 1000 },
        { duration: 7200, enderium: 1500 },
        { duration: 9600, enderium: 2000 },
    ];
    const ROCKET_PARTS = [
        ['helionite_engine', kj('calorite_engine'), 'helionite', 5, 0],
        ['stormium_engine', ap('helionite_engine'), 'stormium', 5, 1],
        ['tholinar_engine', ap('stormium_engine'), 'tholinar', 5, 2],
        ['azurane_engine', ap('tholinar_engine'), 'azurane', 5, 3],
        ['tempestine_engine', ap('azurane_engine'), 'tempestine', 5, 4],
        ['cordium_engine', ap('tempestine_engine'), 'cordium', 5, 5],

        ['umbrite_tank', kj('calorite_fuel_tank'), 'umbrite', 5, 0],
        ['abyssium_tank', ap('umbrite_tank'), 'abyssium', 5, 1],
        ['nivalum_tank', ap('abyssium_tank'), 'nivalum', 5, 2],
        ['chasmal_tank', ap('nivalum_tank'), 'chasmal', 5, 3],
        ['tempestine_tank', ap('chasmal_tank'), 'tempestine', 5, 4],
        ['cordium_tank', ap('tempestine_tank'), 'cordium', 5, 5],

        ['umbrite_fin', kj('rocket_fin'), 'umbrite', 4, 0],
        ['igneum_fin', ap('umbrite_fin'), 'igneum', 4, 1],
        ['vesperine_fin', ap('igneum_fin'), 'vesperine', 4, 2],
        ['obscurex_fin', ap('vesperine_fin'), 'obscurex', 4, 3],
        ['nitralis_fin', ap('obscurex_fin'), 'nitralis', 4, 4],
        ['mordrine_fin', ap('nitralis_fin'), 'mordrine', 4, 5],

        ['pallorite_nose_cone', kj('rocket_cone'), 'pallorite', 4, 0],
        ['eonyx_nose_cone', ap('pallorite_nose_cone'), 'eonyx', 4, 1],
        ['ferrolith_nose_cone', ap('eonyx_nose_cone'), 'ferrolith', 4, 2],
        ['mosaicon_nose_cone', ap('ferrolith_nose_cone'), 'mosaicon', 4, 3],
        ['nitralis_nose_cone', ap('mosaicon_nose_cone'), 'nitralis', 4, 4],
        ['mordrine_nose_cone', ap('nitralis_nose_cone'), 'mordrine', 4, 5],
    ];

    ROCKET_PARTS.forEach((part) => {
        event.remove({ id: ap(part[0]) });

        let inputs = [
            { amount: part[3], tag: `c:plates/${part[2]}` },
            { amount: 1, item: part[1] },
        ];
        if (part[0] == 'azurane_engine') {
            inputs.push({ amount: 1, item: ap('pressure_diamond') });
        }

        let tier = ROCKET_PART_TIERS[part[4]];
        rocketAssembler(
            event,
            st(`rocket_part_assembler/${part[0]}`),
            32,
            tier.duration,
            inputs,
            [{ amount: 1, item: ap(part[0]) }],
            [{ amount: tier.enderium, fluid: mi('molten_enderium') }]
        );
    });

    // -- ADVANCED NASA WORKBENCH -- //
    event.remove({ id: ap('advanced_nasa_workbench') });
    event
        .shaped(ap('advanced_nasa_workbench'), ['CQC', 'HWH', 'CEC'], {
            C: '#c:plates/calorite',
            Q: mi('highly_advanced_machine_hull'),
            H: '#c:plates/helionite',
            W: 'ad_astra:nasa_workbench',
            E: ap('ember_light_core'),
        })
        .id(ap('advanced_nasa_workbench'));

    // -- ENVIRONMENTAL LINER I -- //
    const LINER_I = [
        ['liner_hood_1', ['WSW', 'W W']],
        ['liner_vest_1', ['W W', 'WSW', 'WWW']],
        ['liner_leggings_1', ['WSW', 'W W', 'W W']],
        ['liner_boots_1', ['W W', 'S S']],
    ];
    LINER_I.forEach((liner) => {
        event.remove({ id: ap(liner[0]) });
        event
            .shaped(ap(liner[0]), liner[1], {
                S: '#c:plates/aluminum',
                W: '#minecraft:wool',
            })
            .id(ap(liner[0]));
    });

    // -- MODERN INDUSTRIALIZATION MACHINES -- //
    const REWORKED_RECIPES = [
        mi('assembler_generated/electric_age/machine/nuclear_reactor'),
        mi('electric_age/machine/nuclear_reactor_asbl'),
        mi('electric_age/component/assembler/qubit'),
        mi('assembler_generated/electric_age/blocks/fusion_chamber'),
        mi('electric_age/blocks/fusion_chamber_asbl'),
        mi('assembler_generated/electric_age/machine/plasma_turbine'),
        mi('electric_age/machine/plasma_turbine_asbl'),
        mi('assembler_generated/electric_age/storage_unit/superconductor_storage_unit'),
        mi('electric_age/storage_unit/superconductor_storage_unit_asbl'),
        mi('electric_age/blocks/assembler/quantum_tank'),
        mi('electric_age/blocks/assembler/quantum_barrel'),
        mi('electric_age/upgrades/quantum'),
        mi('electric_age/machine/assembler/replicator'),
    ];
    REWORKED_RECIPES.forEach((id) => event.remove({ id: id }));

    assembler(
        event,
        st('assembler/nuclear_reactor'),
        8,
        200,
        [
            { amount: 4, item: mi('nuclear_alloy_large_plate') },
            { amount: 4, tag: 'c:plates/umbrite' },
            { amount: 1, item: mi('highly_advanced_machine_hull') },
            { amount: 2, item: mi('processing_unit') },
            { amount: 2, item: mi('cadmium_control_rod') },
        ],
        [{ amount: 1, item: mi('nuclear_reactor') }]
    );

    assembler(
        event,
        st('assembler/qubit'),
        20,
        400,
        [
            { amount: 2, item: mi('arithmetic_logic_unit') },
            { amount: 2, tag: 'c:plates/carbon' },
            { amount: 2, tag: 'c:plates/pallorite' },
            { amount: 6, item: mi('superconductor_wire') },
        ],
        [{ amount: 1, item: mi('qubit') }],
        [
            { amount: 250, fluid: mi('cryofluid') },
            { amount: 50, fluid: mi('tritium') },
        ]
    );

    assembler(
        event,
        st('assembler/fusion_chamber'),
        8,
        200,
        [
            { amount: 4, item: mi('superconductor_coil') },
            { amount: 2, item: mi('large_heat_exchanger') },
            { amount: 2, item: mi('nuclear_alloy_large_plate') },
            { amount: 4, tag: 'c:plates/helionite' },
            { amount: 1, item: mi('plasma_handling_iridium_machine_casing') },
        ],
        [{ amount: 1, item: mi('fusion_chamber') }]
    );

    assembler(
        event,
        st('assembler/plasma_turbine'),
        8,
        200,
        [
            { amount: 4, item: mi('superconductor_coil') },
            { amount: 2, item: mi('quantum_circuit') },
            { amount: 1, item: mi('quantum_machine_hull') },
            { amount: 2, item: mi('titanium_rotor') },
            { amount: 4, tag: 'c:plates/stormium' },
        ],
        [{ amount: 1, item: mi('plasma_turbine') }]
    );

    assembler(
        event,
        st('assembler/superconductor_storage_unit'),
        8,
        200,
        [
            { amount: 6, item: mi('plutonium_battery') },
            { amount: 1, item: mi('quantum_machine_hull') },
            { amount: 2, tag: 'c:plates/battery_alloy' },
            { amount: 4, tag: 'c:plates/aurorium' },
        ],
        [{ amount: 1, item: mi('superconductor_storage_unit') }]
    );

    assembler(
        event,
        st('assembler/quantum_tank'),
        32,
        1000,
        [
            { amount: 1, item: mi('quantum_machine_hull') },
            { amount: 1, item: mi('singularity') },
            { amount: 2, item: mi('quantum_circuit') },
            { amount: 8, tag: 'c:plates/iridium' },
            { amount: 8, tag: 'c:plates/abyssium' },
            { amount: 8, item: mi('large_advanced_pump') },
            { amount: 1, item: mi('titanium_tank') },
        ],
        [{ amount: 1, item: mi('quantum_tank') }]
    );

    assembler(
        event,
        st('assembler/quantum_barrel'),
        32,
        1000,
        [
            { amount: 1, item: mi('quantum_machine_hull') },
            { amount: 1, item: mi('singularity') },
            { amount: 2, item: mi('quantum_circuit') },
            { amount: 8, tag: 'c:plates/iridium' },
            { amount: 8, tag: 'c:plates/eonyx' },
            { amount: 8, item: mi('large_advanced_motor') },
            { amount: 1, item: mi('titanium_barrel') },
        ],
        [{ amount: 1, item: mi('quantum_barrel') }]
    );

    assembler(
        event,
        st('assembler/quantum_upgrade'),
        32,
        1000,
        [
            { amount: 32, item: mi('highly_advanced_upgrade') },
            { amount: 8, item: mi('quantum_circuit') },
            { amount: 1, item: mi('singularity') },
            { amount: 1, item: mi('quantum_circuit_board') },
            { amount: 8, tag: 'c:plates/cassinium' },
        ],
        [{ amount: 1, item: mi('quantum_upgrade') }],
        [{ amount: 50, fluid: mi('uu_matter') }]
    );

    assembler(
        event,
        st('assembler/replicator'),
        32,
        8000,
        [
            { amount: 1, item: mi('quantum_machine_hull') },
            { amount: 2, item: mi('quantum_upgrade') },
            { amount: 4, item: mi('quantum_circuit') },
            { amount: 16, tag: 'c:plates/mosaicon' },
        ],
        [{ amount: 1, item: mi('replicator') }],
        [{ amount: 500, fluid: mi('uu_matter') }]
    );
});

ServerEvents.tags('fluid', (event) => {
    [5, 6, 7, 8, 9, 10].forEach((tier) => {
        event.removeAll(`adastraplanets:tier_${tier}_rocket_fuel`);
        event.add(`adastraplanets:tier_${tier}_rocket_fuel`, 'ad_astra:cryo_fuel');
    });
});
