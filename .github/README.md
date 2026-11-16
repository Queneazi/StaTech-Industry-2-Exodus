PLEASE ASK ALL QUESTIONS IN OFFICIAL DISCORD CHANNEL STATECH INDUSTRY 2 -> PROJECTS -> STATECH INDUSTRY 2 EXODUS
IT'S A FORK, NOT MADE BY ORIGINAL AUTHORS


# StaTech Industry 2: Exodus (1.21.1)

StaTech-Industry 2.0 is a minecraft 1.21.1 modpack that is a neoforge port of the original [Statech Industry fabric modpack for 1.19.2](https://github.com/TheStaticVoid/StaTech-Industry/tree/1.19.2-1.1.15).
StaTech Industry 2: Exodus is an unofficial fork of [StaTech Industry 2.0](https://github.com/TheStaticVoid/StaTech-Industry), distributed under the same [GNU GPLv3](../LICENSE) license.
Join us on [Discord](https://discord.gg/RDaJEnN3uS). Click [here](../MODLIST.md) for a full list of mods.

## Installation

We recommend the use of [Prism Launcher](https://prismlauncher.org/) for handling modded installs. The following instructions assume you have Prism installed with your Minecraft account signed in already. To install the latest version of StaTech Industry, follow these steps:

1. Navigate to the [Releases](https://github.com/Queneazi/StaTech-Industry-2-Exodus/releases) and download the `-curseforge.zip` of the latest version. (In the CurseForge app use "Create Custom Profile" → "Import" with the same zip.)
2. In the Prism Launcher, click "Add Instance" then select the "Import from zip" tab on the left. Navigate to where you downloaded the .zip and click Ok.
3. You will be prompted with a menu describing that some mods are blocked from download on third-party launchers. Add the folder you use as your downloads folder using `Add Download Folder` button, then click `Open Missing` to open the mod downloads. Save them to your downloads and they will be detected by the launcher.
4. Click "Ok" and allow for the process to finish.
5. Click "Edit" under the StaTech Industry instance and ensure you have at least 4-6 GB or RAM dedicated to the pack, as well as your version of Java is Java 21.

## Advanced Setup (OPTIONAL)

For more detail and for custom launch options/Java 25 notes, please consult this [wiki page](<https://github.com/TheStaticVoid/StaTech-Industry/wiki/%5BNEW%5D-Installation-(1.21.1-NeoForge)>).

For server setup information, please consult this [wiki page](<https://github.com/TheStaticVoid/StaTech-Industry/wiki/%5BNEW%5D-Server-Setup-(1.21.1-NeoForge)>).

### Building from source

This repository is the complete source of the pack in CurseForge modpack format:

- `manifest.json` / `modlist.html` – the CurseForge manifest (Minecraft, NeoForge version and every mod, resource pack and shader by project/file ID).
- `config/`, `defaultconfigs/`, `kubejs/` – pack configuration, scripts and assets.
- `mods/` – the few jars that are not downloadable from CurseForge and are bundled with the pack.

To build the importable zip, put `manifest.json` and `modlist.html` at the root of a zip archive and the folders `config`, `defaultconfigs`, `kubejs` and `mods` inside an `overrides/` folder of that archive.

[Compatible (but not included) Mods](https://github.com/TheStaticVoid/StaTech-Industry/wiki/Additional-and-compatible-mods-not-included-in-the-modpack).

## 2.0 Contributors

- @truepurpledino - Lead 2.0 developer
- @GW-Dev - 2.0 developer
- @DmitryProskurin - Quest fixes and recipe modifications
- @fmbellomy - Pakku + PanPack migration / Regular contributor
- @Spagles - Fixed trial chamber load lag
- @onion-evan - Sprite work for custom items / MI Animated Components resource pack

## 1.0 Contributors

- DeadeyeDutch - Sprite work for custom items
- inferno - Pack logo
- @Flyte-less - ZedTech textures & other various fixes
- @GW-Dev - Peaceful mode compat / Nether Star progression changes / Boss Crusher
- @kevintok - Overhauled the Scanner module config to be more colorful and useful.
- @redcatone - Questbook spellcheck
- @TacoMonkey11 - Marking client-side mods for packwiz
- @DmitryProskurin - Quest fixes and recipe modifications
- @JustinMullin - Quest fixes
- @Quezlar - Quest typo fixes

### Additional Credits

- Uses [Mono7 by xlifi](https://modrinth.com/resourcepack/mono7) (in the [StaTech Companion Mod](https://github.com/TheStaticVoid/StaTech-Companion-Mod)) for the prospector pick chat messages.
- Uses the Angel Ring texture from [SimpleAngelRing by LordDeatHunter](https://github.com/ModsByLeo/SimpleAngelRing) (in the [StaTech Companion Mod](https://github.com/TheStaticVoid/StaTech-Companion-Mod)) as a basis for the Angel Ring and the Fireproof Ring textures.
- Uses the Electronic Circuit texture from [Modern Industrialization](https://github.com/AztechMC/Modern-Industrialization) as a basis for the Withered SoC texture.
- Uses the Basic/Advanced Card texture from [Applied Energistics 2](https://github.com/AppliedEnergistics/Applied-Energistics-2) as a basis for the Mob/Boss Model textures.
- Uses the material_dust_quicksilver_amethyst_mixture.png texture from [Unused Textures](https://github.com/malcolmriley/unused-textures/) as a basis for the artifact_dust.png texture.
- Uses the material_dust_green_mix_4.png texture from [Unused Textures](https://github.com/malcolmriley/unused-textures/) as a basis for the scrap.png texture.
- Uses [jonnyloaf's Spectrum Alcohol Models](https://jonnyloaf.art/#) for the Spectrum alcohol 3D models.
