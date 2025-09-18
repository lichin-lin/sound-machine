import {
  DrumSound,
  PianoTheme,
} from "../components/TrackContext";

export interface DrumPreset {
  name: string;
  pattern: DrumSound[];
}

export const drumPresets: DrumPreset[] = [
  {
    name: "Asia",
    pattern: [
      "bd",
      "hh",
      "bd",
      "hh",
      "bd",
      "hh",
      "bd",
      "hh",
      "bd",
      "hh",
      "bd",
      "hh",
      "bd",
      "hh",
      "bd",
      "hh",
    ],
  },
  {
    name: "Rock Basic",
    pattern: [
      "bd",
      null,
      "sd",
      null,
      "bd",
      null,
      "sd",
      null,
      "bd",
      null,
      "sd",
      null,
      "bd",
      null,
      "sd",
      null,
    ],
  },
  {
    name: "Hip Hop",
    pattern: [
      "bd",
      null,
      null,
      "bd",
      "sd",
      null,
      null,
      "bd",
      "bd",
      null,
      null,
      "bd",
      "sd",
      null,
      null,
      null,
    ],
  },
  {
    name: "House",
    pattern: [
      "bd",
      null,
      null,
      null,
      "bd",
      null,
      null,
      null,
      "bd",
      null,
      null,
      null,
      "bd",
      null,
      null,
      null,
    ],
  },
  {
    name: "Techno",
    pattern: [
      "bd",
      "hh",
      "hh",
      "hh",
      "sd",
      "hh",
      "hh",
      "hh",
      "bd",
      "hh",
      "hh",
      "hh",
      "sd",
      "hh",
      "hh",
      "hh",
    ],
  },
  {
    name: "Breakbeat",
    pattern: [
      "bd",
      null,
      "sd",
      "bd",
      null,
      "bd",
      "sd",
      null,
      "bd",
      null,
      "sd",
      "bd",
      null,
      "bd",
      "sd",
      null,
    ],
  },
];

export interface PianoThemeOption {
  name: string;
  value: PianoTheme;
}

export const pianoThemes: PianoThemeOption[] = [
  { name: "Piano", value: "piano" },
  { name: "Electric Piano 1", value: "gm_epiano1" },
  { name: "Electric Piano 2", value: "gm_epiano2" },
  { name: "Xylophone", value: "gm_xylophone" },
];