import {
  Preset,
  Track,
  DrumSound,
} from "../components/TrackContext";

// Helper function to create drum patterns
const createDrumPattern = (
  pattern: string[],
): DrumSound[][] => {
  return pattern.map((beat) => {
    const sounds: DrumSound[] = [];
    if (beat.includes("k")) sounds.push("bd"); // kick
    if (beat.includes("s")) sounds.push("sd"); // snare
    if (beat.includes("h")) sounds.push("hh"); // hihat
    if (beat.includes("o")) sounds.push("oh"); // open hihat
    if (beat.includes("c")) sounds.push("cp"); // clap
    if (beat.includes("r")) sounds.push("rim"); // rim
    if (beat.includes("l")) sounds.push("lt"); // low tom
    if (beat.includes("m")) sounds.push("mt"); // mid tom
    if (beat.includes("t")) sounds.push("ht"); // high tom
    return sounds;
  });
};

// Three preset compositions
export const presets: Preset[] = [
  {
    id: "pixel-meadow",
    name: "PIXEL MEADOW",
    tempo: 88,
    hydraCode: `await initHydra()
osc(5,-0.2,0.4).color(0.4,0.75,0.5).rotate().pixelate().out()`,
    tracks: [
      {
        id: 0,
        active: true,
        volume: 0.6,
        data: {
          type: "drum",
          pattern: createDrumPattern([
            "k",
            "",
            "",
            "",
            "",
            "",
            "",
            "", // Beat 1-2
            "",
            "",
            "",
            "",
            "s",
            "",
            "",
            "", // Beat 3-4
          ]),
          theme: "ViscoSpaceDrum",
          room: 0.7,
          pitch: -2,
        },
      },
      {
        id: 1,
        active: false,
        volume: 0.4,
        data: {
          type: "drum",
          pattern: createDrumPattern([
            "",
            "",
            "",
            "",
            "",
            "",
            "h",
            "", // Beat 1-2
            "",
            "",
            "o",
            "",
            "",
            "l",
            "h",
            "c", // Beat 3-4 with open hat, clap, and low tom
          ]),
          theme: "ViscoSpaceDrum",
          room: 0.8,
          pitch: 1,
        },
      },
      {
        id: 2,
        active: false,
        volume: 0.8,
        data: {
          type: "piano",
          notes: [
            { note: "C3", position: 0 }, // Main melody start
            { note: "E3", position: 2 }, // Ascending melody
            { note: "G3", position: 4 }, // Continue upward
            { note: "F3", position: 6 }, // Resolution down
            { note: "A3", position: 8 }, // Bridge note
            { note: "G3", position: 10 }, // Back to G
            { note: "E3", position: 12 }, // Descending
            { note: "C3", position: 14 }, // Return home
          ],
          baseOctave: 3,
          theme: "gm_cello",
        },
      },
      {
        id: 3,
        active: false,
        volume: 0.4, // Lowered volume as requested
        data: {
          type: "piano",
          notes: [
            { note: ["E4", "G4", "C5"], position: 1 }, // C major chord upper
            { note: ["A4", "C5", "F5"], position: 5 }, // F major chord upper
            { note: ["A4", "C5", "F5"], position: 6 },
            { note: ["B4", "D5", "G5"], position: 9 }, // G major chord upper
            { note: ["E4", "G4", "C5"], position: 13 }, // C major chord upper
            { note: ["E4", "G4", "C5"], position: 14 }, // C major chord upper
          ],
          baseOctave: 4,
          theme: "piano",
        },
      },
    ],
  },

  {
    id: "ember-bloom",
    name: "EMBER BLOOM",
    tempo: 125,
    hydraCode: `await initHydra()
osc(10, 0, 0.01)
	.rotate(0, 0.01)
	.mult(osc(4, 0.01).modulate(osc(4).rotate(0, -0.1), 1))
	.color(2,0.91,0.39)
  .out(o0)`,
    tracks: [
      {
        id: 0,
        active: true,
        volume: 0.8,
        data: {
          type: "drum",
          pattern: createDrumPattern([
            "k",
            "",
            "",
            "",
            "s",
            "",
            "h",
            "", // Beat 1-2
            "k",
            "",
            "h",
            "",
            "s",
            "h",
            "h",
            "h", // Beat 3-4 with trap-style hi-hats
          ]),
          theme: "RhythmAce",
          room: 0.4,
          pitch: 0,
        },
      },
      {
        id: 1,
        active: false,
        volume: 0.5,
        data: {
          type: "drum",
          pattern: createDrumPattern([
            "",
            "",
            "",
            "h",
            "",
            "h",
            "",
            "h", // Beat 1-2
            "",
            "o",
            "",
            "h",
            "",
            "",
            "o",
            "", // Beat 3-4 with open hats
          ]),
          theme: "RhythmAce",
          room: 0.6,
          pitch: 2,
        },
      },
      {
        id: 2,
        active: false,
        volume: 0.7,
        data: {
          type: "piano",
          notes: [
            { note: ["D4", "F#4", "A4"], position: 0 }, // D major chord
            { note: "A4", position: 2 }, // Single melody note
            { note: ["G4", "B4", "D5"], position: 4 }, // G major chord
            { note: "F#4", position: 6 }, // Single melody note
            { note: ["E4", "G#4", "B4"], position: 8 }, // E major chord
            { note: "D5", position: 10 }, // High melody note
            { note: ["A3", "C#4", "E4"], position: 12 }, // A major chord
            { note: "A4", position: 14 }, // Resolution
          ],
          baseOctave: 4,
          theme: "gm_xylophone",
        },
      },
      {
        id: 3,
        active: false,
        volume: 0.6,
        data: {
          type: "piano",
          notes: [
            { note: "D3", position: 1 }, // Bass foundation
            { note: "A3", position: 3 }, // Tycho-style arp
            { note: "G3", position: 5 }, // Flowing bassline
            { note: "E3", position: 7 }, // Ambient movement
            { note: "F#3", position: 9 }, // Melodic bass
            { note: "A3", position: 11 }, // Return to A
            { note: "D4", position: 13 }, // Octave up
            { note: "A3", position: 15 }, // Resolution
          ],
          baseOctave: 3,
          theme: "kawai",
        },
      },
    ],
  },

  {
    id: "violet-tides",
    name: "VIOLET TIDES",
    tempo: 80,
    hydraCode: `await initHydra()
osc(2, 0.5, 0.3).color(0.5,0.25, 1).rotate(0.20, 0.1).pixelate(4, 10).modulate(noise(2), () => 1.5 * Math.sin(0.08 * time)).out(o0)`,
    tracks: [
      {
        id: 0,
        active: true,
        volume: 0.6,
        data: {
          type: "drum",
          pattern: createDrumPattern([
            "k",
            "",
            "",
            "t",
            "s",
            "",
            "",
            "", // Beat 1-2 (added high tom)
            "",
            "",
            "r",
            "",
            "s",
            "",
            "",
            "t", // Beat 3-4 (added crash and high tom)
          ]),
          theme: "ViscoSpaceDrum",
          room: 0.7,
          pitch: 0,
        },
      },
      {
        id: 1,
        active: false,
        volume: 0.4,
        data: {
          type: "drum",
          pattern: createDrumPattern([
            "",
            "",
            "",
            "",
            "",
            "",
            "h",
            "", // Beat 1-2 (sparse)
            "",
            "",
            "",
            "",
            "",
            "c",
            "",
            "", // Beat 3-4 (minimal clap)
          ]),
          theme: "RolandTR909",
          room: 0.8,
          pitch: 1,
        },
      },
      {
        id: 2,
        active: false,
        volume: 0.8,
        data: {
          type: "piano",
          notes: [
            { note: "E4", position: 0 }, // Start of flowing melody
            { note: "G4", position: 2 }, // Added in-between note
            { note: "B4", position: 4 }, // Peak of phrase
            { note: "D5", position: 6 }, // Added ascending note
            { note: "C5", position: 8 }, // Mid-wave
            { note: "A4", position: 10 }, // Added descending note
            { note: "F#4", position: 12 }, // Added flow note
            { note: "E4", position: 14 }, // Return to shore
          ],
          baseOctave: 4,
          theme: "psaltery_pluck",
        },
      },
      {
        id: 3,
        active: false,
        volume: 0.5,
        data: {
          type: "piano",
          notes: [
            { note: ["E3", "G3", "B3"], position: 0 }, // Em chord foundation
            { note: "D3", position: 2 }, // Added bass movement
            { note: "C3", position: 4 }, // Added bass note
            { note: "B2", position: 6 }, // Added low bass
            { note: ["A3", "C4", "E4"], position: 8 }, // Am chord
            { note: "G3", position: 10 }, // Added connecting note
            { note: "F#3", position: 12 }, // Added chromatic movement
            { note: "E3", position: 14 }, // Resolution back to Em root
          ],
          baseOctave: 3,
          theme: "piano",
        },
      },
    ],
  },
];