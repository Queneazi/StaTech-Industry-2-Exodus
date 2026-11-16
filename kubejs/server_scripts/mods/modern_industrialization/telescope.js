// -----------------------------------------
// CREATED BY STATIC FOR USE IN
// STATECH INDUSTRY 2
// -----------------------------------------

ServerEvents.recipes((event) => {
    let st = (id) => `statech:modern_industrialization/telescope/${id}`;

    // -- SIMPLE STELLAR DATA -- //
    telescope(
        event,
        st('unrefined_simple_stellar_data'),
        512,
        600,
        [{ amount: 1, item: kj('short_range_lens'), probability: 0.05 }],
        [{ amount: 1, item: kj('unrefined_simple_stellar_data') }],
        [{ amount: 1000, fluid: mc('water') }]
    );

    // -- DEEP SPACE STELLAR DATA -- //
    telescope(
        event,
        st('unrefined_deep_space_stellar_data'),
        2048,
        1200,
        [{ amount: 1, item: kj('deep_space_lens'), probability: 0.1 }],
        [{ amount: 1, item: kj('unrefined_deep_space_stellar_data') }],
        [{ amount: 1000, fluid: mi('cryofluid') }]
    );
});
