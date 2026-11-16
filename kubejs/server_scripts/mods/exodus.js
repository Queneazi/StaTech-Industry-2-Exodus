// -----------------------------------------
// EXODUS: THE LAST CHAPTER OF
// STATECH INDUSTRY 2
// -----------------------------------------

ServerEvents.recipes((event) => {
    // -- MOD NAMESPACE UTILITY FUNCTIONS -- //
    let st = (id) => `statech:exodus/${id}`;
    let aa = (id) => `ad_astra:${id}`;
    let ap = (id) => `adastraplanets:${id}`;
    let th = (id) => `thaumaturge:${id}`;
    let ta = (id) => `thaumadditions:${id}`;

    // -- CUSTOM RECIPE UTILITY FUNCTIONS -- //
    let qspl = (id, eu, duration, item_inputs, item_outputs) => {
        event
            .custom(
                newMachineRecipe(
                    mi('quantum_space_probe_launcher'),
                    eu,
                    duration,
                    item_inputs,
                    item_outputs
                )
            )
            .id(id);
    };
    let exodusArk = (id, eu, duration, item_inputs, item_outputs, fluid_inputs) => {
        event
            .custom(
                newMachineRecipe(
                    mi('exodus_ark'),
                    eu,
                    duration,
                    item_inputs,
                    item_outputs,
                    fluid_inputs
                )
            )
            .id(id);
    };

    // ---------------- SURVEY ---------------- //

    // -- SPACE TELESCOPE -- //
    assembler(
        event,
        st('telescope'),
        1024,
        1200,
        [
            { amount: 1, item: mi('highly_advanced_machine_hull') },
            { amount: 2, item: kj('short_range_lens') },
            { amount: 4, item: mi('tungstensteel_machine_casing_pipe') },
            { amount: 4, item: mi('tungstensteel_gear') },
            { amount: 2, item: mi('large_advanced_motor') },
            { amount: 4, item: mi('processing_unit') },
            { amount: 1, item: mi('quantum_circuit') },
        ],
        [{ amount: 1, item: mi('telescope') }],
        [{ amount: 2000, fluid: mi('cryofluid') }]
    );

    // -- DEEP SPACE LENS -- //
    blastFurnace(
        event,
        st('deep_space_lens'),
        1024,
        600,
        [
            { amount: 2, item: kj('short_range_lens') },
            { amount: 2, item: ap('nivalum_plate') },
        ],
        [{ amount: 1, item: kj('deep_space_lens') }],
        [{ amount: 2000, fluid: mi('oxygen') }]
    );

    // -- COMPUTER CASING -- //
    assembler(
        event,
        st('computer_casing'),
        128,
        200,
        [
            { amount: 4, item: mi('stainless_steel_plate') },
            { amount: 1, item: mi('digital_circuit') },
            { amount: 1, item: ae('calculation_processor') },
        ],
        [{ amount: 2, item: kj('computer_casing') }]
    );

    // -- SUPERCOMPUTER -- //
    assembler(
        event,
        st('supercomputer'),
        2048,
        1200,
        [
            { amount: 1, item: mi('highly_advanced_machine_hull') },
            { amount: 4, item: kj('computer_casing') },
            { amount: 2, item: ae('drive') },
            { amount: 4, item: mi('processing_unit') },
            { amount: 4, item: mg('accumulation_processor') },
            { amount: 1, item: mg('cell_component_256m') },
            { amount: 2, item: mi('quantum_circuit') },
        ],
        [{ amount: 1, item: mi('supercomputer') }],
        [{ amount: 4000, fluid: mi('cryofluid') }]
    );

    // -- SPACE CIRCUITS -- //
    assembler(
        event,
        st('basic_space_circuit'),
        1024,
        600,
        [
            { amount: 1, item: mi('quantum_circuit') },
            { amount: 1, item: kj('star_location_telemetry') },
            { amount: 4, item: mi('superconductor_wire') },
            { amount: 1, item: ae('calculation_processor') },
        ],
        [{ amount: 1, item: kj('basic_space_circuit') }]
    );
    assembler(
        event,
        st('advanced_space_circuit'),
        2048,
        800,
        [
            { amount: 2, item: kj('basic_space_circuit') },
            { amount: 1, item: kj('planetary_location_telemetry') },
            { amount: 2, item: mi('processing_unit') },
            { amount: 2, item: mg('accumulation_processor') },
            { amount: 2, item: th('plate_void') },
        ],
        [{ amount: 1, item: kj('advanced_space_circuit') }]
    );
    assembler(
        event,
        st('anomalous_space_circuit'),
        4096,
        1200,
        [
            { amount: 2, item: kj('advanced_space_circuit') },
            { amount: 1, item: kj('anomaly_location_telemetry') },
            { amount: 1, item: th('causality_collapser') },
            { amount: 1, item: th('morphic_resonator') },
            { amount: 1, item: ae('quantum_entangled_singularity') },
        ],
        [{ amount: 1, item: kj('anomalous_space_circuit') }],
        [{ amount: 1000, fluid: mi('cryofluid') }]
    );

    // ---------------- ANTIMATTER ---------------- //

    // -- RESEARCH PROBE -- //
    assembler(
        event,
        st('research_probe'),
        2048,
        1200,
        [
            { amount: 1, item: kj('space_probe') },
            { amount: 1, item: kj('deep_space_lens') },
            { amount: 1, item: kj('basic_space_circuit') },
            { amount: 8, item: mi('tungstensteel_plate') },
            { amount: 4, item: ap('nitralis_plate') },
            { amount: 4, item: mi('processing_unit') },
        ],
        [{ amount: 1, item: kj('research_probe') }]
    );

    // -- ANTIMATTER HOUSING -- //
    assembler(
        event,
        st('antimatter_housing'),
        2048,
        400,
        [
            { amount: 4, item: mi('superconductor_plate') },
            { amount: 2, item: mi('superconductor_coil') },
            { amount: 1, item: mi('quantum_machine_casing') },
            { amount: 2, item: th('plate_void') },
        ],
        [{ amount: 2, item: kj('antimatter_housing') }]
    );

    // -- ANTIMATTER -- //
    singularityForge(
        event,
        st('antimatter'),
        8192,
        600,
        [{ amount: 2, item: kj('uu_matter') }],
        [{ amount: 1, item: kj('antimatter') }],
        [{ amount: 1000, fluid: mi('stellar_plasma') }]
    );

    // -- CONTAINED ANTIMATTER -- //
    assembler(
        event,
        st('contained_antimatter'),
        1024,
        200,
        [
            { amount: 1, item: kj('antimatter') },
            { amount: 1, item: kj('antimatter_housing') },
        ],
        [{ amount: 1, item: kj('contained_antimatter') }],
        [{ amount: 500, fluid: mi('cryofluid') }]
    );

    // -- STAR IMPLODER -- //
    assembler(
        event,
        st('star_imploder'),
        4096,
        1200,
        [
            { amount: 4, item: kj('contained_antimatter') },
            { amount: 1, item: mi('singularity') },
            { amount: 2, item: mi('quantum_circuit') },
            { amount: 1, item: yai('demon_core') },
            { amount: 2, item: ei('superconductor_tesla_winding') },
        ],
        [{ amount: 1, item: kj('star_imploder') }]
    );

    // -- DARK MATTER -- //
    qspl(
        st('dark_matter'),
        4096,
        6000,
        [
            { amount: 1, item: kj('research_probe') },
            { amount: 1, item: kj('star_imploder') },
            { amount: 1, item: kj('black_hole_location_telemetry') },
        ],
        [{ amount: 4, item: kj('dark_matter') }]
    );

    // ---------------- THE ARK ---------------- //

    // -- HULL PLATING -- //
    assembler(
        event,
        st('ark_hull_plating'),
        1024,
        200,
        [
            { amount: 4, item: mi('titanium_plate') },
            { amount: 2, item: ap('helionite_plate') },
            { amount: 1, item: mi('blastproof_alloy_plate') },
            { amount: 1, item: ap('nitralis_plate') },
        ],
        [{ amount: 8, item: kj('ark_hull_plating') }]
    );

    // -- VIEWPORT -- //
    assembler(
        event,
        st('ark_viewport'),
        512,
        200,
        [
            { amount: 4, item: kj('borosilicate_glass') },
            { amount: 1, item: mi('titanium_plate') },
            { amount: 1, item: ap('nitralis_plate') },
        ],
        [{ amount: 4, item: kj('ark_viewport') }]
    );

    // -- THRUSTER -- //
    assembler(
        event,
        st('ark_thruster'),
        2048,
        400,
        [
            { amount: 2, item: kj('ark_hull_plating') },
            { amount: 1, item: mi('plasma_handling_iridium_machine_casing') },
            { amount: 1, item: mi('large_advanced_pump') },
            { amount: 1, item: ap('cordium_plate') },
            { amount: 1, item: ap('abyssium_plate') },
            { amount: 2, item: mi('iridium_plate') },
        ],
        [{ amount: 1, item: kj('ark_thruster') }]
    );

    // -- WARP COIL -- //
    assembler(
        event,
        st('ark_warp_coil'),
        8192,
        600,
        [
            { amount: 4, item: mi('superconductor_coil') },
            { amount: 2, item: mi('iridium_plate') },
            { amount: 1, item: kj('dark_matter') },
            { amount: 2, item: ei('superconductor_tesla_winding') },
        ],
        [{ amount: 4, item: kj('ark_warp_coil') }]
    );

    // -- EXODUS ARK CONTROLLER -- //
    assembler(
        event,
        st('exodus_ark'),
        4096,
        2400,
        [
            { amount: 1, item: mi('quantum_machine_hull') },
            { amount: 4, item: kj('ark_hull_plating') },
            { amount: 2, item: kj('ark_viewport') },
            { amount: 2, item: mi('quantum_machine_casing') },
            { amount: 1, item: kj('anomalous_space_circuit') },
            { amount: 4, item: mi('quantum_circuit') },
            { amount: 1, item: mg('cell_component_256m') },
            { amount: 2, item: ae('quantum_entangled_singularity') },
        ],
        [{ amount: 1, item: mi('exodus_ark') }],
        [{ amount: 8000, fluid: mi('cryofluid') }]
    );

    // -- CRYOSTASIS MODULE -- //
    assembler(
        event,
        st('cryostasis_module'),
        4096,
        1200,
        [
            { amount: 2, item: aa('cryo_freezer') },
            { amount: 4, item: ap('nivalum_plate') },
            { amount: 4, item: mi('superconductor_coil') },
            { amount: 2, item: mi('quantum_circuit') },
            { amount: 1, item: kj('basic_space_circuit') },
            { amount: 1, item: mi('quantum_machine_hull') },
        ],
        [{ amount: 1, item: kj('cryostasis_module') }],
        [{ amount: 16000, fluid: mi('cryofluid') }]
    );

    // -- BIOSPHERE VAULT -- //
    assembler(
        event,
        st('biosphere_vault'),
        2048,
        1200,
        [
            { amount: 32, tag: 'minecraft:saplings' },
            { amount: 32, tag: 'c:seeds' },
            { amount: 16, tag: 'minecraft:flowers' },
            { amount: 8, item: th('sapling_greatwood') },
            { amount: 8, item: th('sapling_silverwood') },
            { amount: 1, item: ta('dna_sample') },
            { amount: 8, tag: 'c:glass_blocks' },
            { amount: 1, item: mi('quantum_machine_hull') },
        ],
        [{ amount: 1, item: kj('biosphere_vault') }],
        [{ amount: 16000, fluid: mc('water') }]
    );

    // -- STELLAR NAVIGATION CORE -- //
    assembler(
        event,
        st('stellar_navigation_core'),
        8192,
        2400,
        [
            { amount: 1, item: kj('anomalous_space_circuit') },
            { amount: 1, item: kj('anomaly_location_telemetry') },
            { amount: 4, item: kj('advanced_space_circuit') },
            { amount: 1, item: th('eldritch_eye') },
            { amount: 1, item: th('primordial_pearl') },
            { amount: 8, item: sp('star_fragment') },
            { amount: 2, item: ae('quantum_entangled_singularity') },
            { amount: 1, item: mi('quantum_machine_hull') },
        ],
        [{ amount: 1, item: kj('stellar_navigation_core') }],
        [{ amount: 4000, fluid: mi('cryofluid') }]
    );

    // -- ANTIMATTER WARP DRIVE -- //
    singularityForge(
        event,
        st('antimatter_warp_drive'),
        8192,
        6000,
        [
            { amount: 16, item: kj('contained_antimatter') },
            { amount: 16, item: kj('dark_matter') },
            { amount: 1, item: ap('ancient_ship'), probability: 0.0 },
            { amount: 4, item: mi('singularity') },
        ],
        [{ amount: 1, item: kj('antimatter_warp_drive') }],
        [{ amount: 16000, fluid: mi('cryofluid') }]
    );

    // -- EXODUS IGNITION KEY -- //
    exodusArk(
        st('exodus_key'),
        8192,
        12000,
        [
            { amount: 4, item: kj('cryostasis_module') },
            { amount: 2, item: kj('biosphere_vault') },
            { amount: 1, item: kj('stellar_navigation_core') },
            { amount: 1, item: kj('antimatter_warp_drive') },
            { amount: 8, item: kj('contained_antimatter') },
        ],
        [{ amount: 1, item: kj('exodus_key') }],
        [{ amount: 64000, fluid: aa('cryo_fuel') }]
    );
});
