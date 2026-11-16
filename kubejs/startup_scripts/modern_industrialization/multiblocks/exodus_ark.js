// -----------------------------------------
// EXODUS ARK FOR
// STATECH INDUSTRY 2
// -----------------------------------------

// H hull plating, h hull plating (hatches), W viewport, T thruster, C warp coil, L running light
let EXODUS_ARK;

MIMachineEvents.registerRecipeTypes((event) => {
    EXODUS_ARK = event
        .register('exodus_ark')
        .withItemInputs()
        .withItemOutputs()
        .withFluidInputs();
});

MIMachineEvents.registerCasings((event) => {
    event.registerBlockImitation('ark_hull_casing', kj('ark_hull_plating'));
});

MIMachineEvents.registerMachines((event) => {
    const hull = event.memberOfBlock(kj('ark_hull_plating'));
    const viewport = event.memberOfBlock(kj('ark_viewport'));
    const thruster = event.memberOfBlock(kj('ark_thruster'));
    const warpCoil = event.memberOfBlock(kj('ark_warp_coil'));
    const runningLight = event.memberOfBlock(kj('glowing_steel_pillar'));
    const arkHatch = event.hatchOf(
        'item_input',
        'item_output',
        'fluid_input',
        'energy_input'
    );

    const exodusArkShape = event
        .layeredShape('ark_hull_casing', [
        ['                         ', '                         ', '                         ', '          hhhhh          ', '   HTH   TThhhTT   HTH   ', '   TTT  hTThhhTTh  TTT   ', '   HTH  hhhhhhhhh  HTH   ', '       hhhhhhhhhhh       ', '        hhhhhhhhh        ', '        hTThhhTTh        ', '         TThhhTT         ', '          hhhhh          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '          HHHHH          ', '   HHH   H     H   HHH   ', '   H H  H       H  H H   ', '   HHH  H       H  HHH   ', '       H         H       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HHHHH          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '          hhhhh          ', '   HHH   H     H   HHH   ', '   H H  H       H  H H   ', '   HHH  H       H  HHH   ', '       H         H       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HHLHH          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '          hhhhh          ', '   HHH   H     H   HHH   ', '   H HHHH       HHHH H   ', '   HHH  H       H  HHH   ', '       H         H       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HHHHH          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '          hhhhh          ', '   HHH   H     H   HHH   ', '   H HHHH       HHHH H   ', '   HHH  H       H  HHH   ', '       H         H       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HHHHH          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '          hhhhh          ', '   HHH   H     H   HHH   ', '   H HHHH       HHHH H   ', '   HHH  H       H  HHH   ', '       H         H       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HHHHH          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '          hhhhh          ', '   HHH   H     H   HHH   ', '   H HHHH       HHHH H   ', '   HHH  H       H  HHH   ', '       H         H       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HHLHH          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '          hhhhh          ', '   HHH   H     H   HHH   ', '   H H  H       H  H H   ', '   HHH  H       H  HHH   ', '       H         H       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HHHHH          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '          hhhhh          ', '   HHH   H     H   HHH   ', '   H H  H       H  H H   ', '   HHH  H       H  HHH   ', '       H         H       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HHHHH          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '          hhhhh          ', '   HHH   H     H   HHH   ', '   HHH  H       H  HHH   ', '   HHH  H       H  HHH   ', '       H         H       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HHHHH          ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '           hhh           ', '         Hh   hH         ', '        H       H        ', '        H       H        ', '        H       H        ', '        H       H        ', '        H       H        ', '         HH   HH         ', '           HLH           ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '        H       H        ', '        H       H        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '                         ', '                         ', '                         '],
        ['           HHH           ', '         H     H         ', '       HH       HH       ', '       H    h    H       ', '      H   hh hh   H      ', '         H     H         ', '     H  H       H  H     ', '     H  H       H  H     ', '     H  H       H  H     ', '         H     H         ', '      H   HH HH   H      ', '       H    H    H       ', '       HH       HH       ', '         H     H         ', '           HHH           '],
        ['          CCCCC          ', '        CCC   CCC        ', '       HC       CH       ', '      CCH   h   HCC      ', '      C   hh hh   C      ', '     CC  H     H  CC     ', '     C  H       H  C     ', '     C  H       H  C     ', '     C  H       H  C     ', '     CC  H     H  CC     ', '      C   HH HH   C      ', '      CCH   H   HCC      ', '       HC       CH       ', '        CCC   CCC        ', '          CCCCC          '],
        ['           HHH           ', '         H     H         ', '       HH       HH       ', '       H    h    H       ', '      H   hh hh   H      ', '         H     H         ', '     H  H       H  H     ', '     H  H       H  H     ', '     H  H       H  H     ', '         H     H         ', '      H   HH HH   H      ', '       H    H    H       ', '       HH       HH       ', '         H     H         ', '           HLH           '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '        H       H        ', '        H       H        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '  LHHHHHH       HHHHHHL  ', '        W       W        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '   LHHHHH       HHHHHL   ', '        H       H        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '   LHHHHH       HHHHHL   ', '        W       W        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            L            ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '    HHHHH       HHHHH    ', '        H       H        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '    HHHHH       HHHHH    ', '        W       W        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '     HHHH       HHHH     ', '        H       H        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '           HHH           ', '           HHH           ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '      HHH       HHH      ', '        W       W        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '           H H           ', '           HHH           ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '      HHH       HHH      ', '        H       H        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '           W W           ', '           HHH           ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '       HH       HH       ', '        W       W        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '           W W           ', '           HHH           ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '       HH       HH       ', '        H       H        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '           W W           ', '           HHH           ', '                         '],
        ['                         ', '                         ', '                         ', '            h            ', '          hh hh          ', '         H     H         ', '        H       H        ', '        W       W        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '           WWW           ', '           HHH           ', '                         '],
        ['                         ', '                         ', '                         ', '            H            ', '          HH HH          ', '         H     H         ', '        H       H        ', '        H       H        ', '        H       H        ', '         H     H         ', '          HH HH          ', '            H            ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '                         ', '          HHHHH          ', '         H     H         ', '         H     H         ', '        H       H        ', '         H     H         ', '         H     H         ', '          HHHHH          ', '                         ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '                         ', '           HHH           ', '          H   H          ', '         H     H         ', '         H     H         ', '         H     H         ', '          H   H          ', '           WWW           ', '                         ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '                         ', '            H            ', '          HH HH          ', '         H     H         ', '         H     H         ', '         H     H         ', '          HH HH          ', '            W            ', '                         ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '                         ', '                         ', '           HHH           ', '          H   H          ', '          H   H          ', '          H   H          ', '           WWW           ', '                         ', '                         ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '                         ', '                         ', '           HHH           ', '          H   H          ', '          H   H          ', '          H   H          ', '           WWW           ', '                         ', '                         ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '                         ', '                         ', '            H            ', '           H H           ', '          H   H          ', '           H H           ', '            W            ', '                         ', '                         ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '                         ', '                         ', '                         ', '           HHH           ', '           H H           ', '           HHH           ', '                         ', '                         ', '                         ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '                         ', '                         ', '                         ', '            H            ', '           H H           ', '            H            ', '                         ', '                         ', '                         ', '                         ', '                         ', '                         '],
        ['                         ', '                         ', '                         ', '                         ', '                         ', '                         ', '            H            ', '           H#H           ', '            H            ', '                         ', '                         ', '                         ', '                         ', '                         ', '                         '],
    ])
        .key('H', hull, event.noHatch())
        .key('h', hull, arkHatch)
        .key('W', viewport, event.noHatch())
        .key('T', thruster, event.noHatch())
        .key('C', warpCoil, event.noHatch())
        .key('L', runningLight, event.noHatch())
        .build();

    event.simpleElectricCraftingMultiBlock(
        // General parameters
        'Exodus Ark', // English name
        'exodus_ark', // internal name
        EXODUS_ARK, // recipe type
        exodusArkShape, // multiblock shape

        // REI Display configuration
        event.progressBar(88, 35, 'rocket'),
        // REI Item inputs, item outputs, fluid inputs, fluid outputs
        (itemInputs) => itemInputs.addSlots(20, 26, 3, 2),
        (itemOutputs) => itemOutputs.addSlot(122, 35),
        (fluidInputs) => fluidInputs.addSlot(38, 64),
        (fluidOutputs) => {},

        /* Model Configuration */
        'ark_hull_casing', // casing of the controller
        'exodus_ark', // overlay folder
        true, // front overlay
        false, // top overlay
        false // side overlay
    );
});