import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useMemo,
} from "react";
import {
  serializeState,
  deserializeState,
  updateURL,
  getStateFromURL,
  generateShareableURL,
  SerializableState,
} from "../utils/urlState";

// Track data types
export type DrumSound =
  | "bd"
  | "sd"
  | "rim"
  | "hh"
  | "oh"
  | "cp"
  | "lt"
  | "mt"
  | "ht"
  | "rd"
  | "cr"
  | null;
export type TrackType = "drum" | "piano";
export type DrumTheme =
  | "RolandTR909"
  | "AkaiLinn"
  | "RhythmAce"
  | "RolandTR808"
  | "RolandTR707"
  | "ViscoSpaceDrum"
  | null;

export interface DrumTrackData {
  type: "drum";
  pattern: DrumSound[][]; // Array of 16 beats, each beat is an array of drum sounds
  theme?: DrumTheme; // Optional drum theme
  room: number; // Room value 0-1 for .room() modifier
  pitch: number; // Pitch value -12 to +12 for .transpose() modifier
}

export interface PianoNote {
  note: string | string[]; // Single note e.g., "C4" or chord array e.g., ["C4", "E4", "G4"]
  position: number; // 0-15, indicating which beat it was recorded on
}

export type PianoBaseOctave = 2 | 3 | 4 | 5;
export type PianoTheme =
  | "piano"
  | "gm_cello"
  | "psaltery_pluck"
  | "kawai"
  | "botella"
  | "gm_xylophone";

export interface PianoTrackData {
  type: "piano";
  notes: PianoNote[]; // Array of recorded piano notes with positions
  baseOctave: PianoBaseOctave; // Base octave for the piano (C2, C3, C4, C5)
  theme: PianoTheme; // Piano theme/sound
}

export type TrackData = DrumTrackData | PianoTrackData;

export interface Track {
  id: number;
  active: boolean;
  data: TrackData;
  volume: number; // 0-1 range for track-specific volume
}

export type TrackState = Track;

export type HydraBackground = "spring" | "earth" | null;

// Preset types
export interface Preset {
  id: string;
  name: string;
  tempo: number;
  tracks: Track[];
  hydraCode: string;
}

interface TrackContextType {
  tracks: Track[];
  activeTrack: number;
  setActiveTrack: (index: number) => void;
  handleTrackSelect: (index: number) => void;
  updateTrackType: (
    trackIndex: number,
    type: TrackType,
  ) => void;
  updateDrumPattern: (
    trackIndex: number,
    beatIndex: number,
    sound: DrumSound,
  ) => void;
  updateDrumTheme: (
    trackIndex: number,
    theme: DrumTheme,
  ) => void;
  updateDrumRoom: (trackIndex: number, room: number) => void;
  updateDrumPitch: (trackIndex: number, pitch: number) => void;
  toggleDrumBeat: (
    trackIndex: number,
    beatIndex: number,
    drumSoundIndex: number,
  ) => void;
  applyDrumPreset: (
    trackIndex: number,
    pattern: DrumSound[][],
  ) => void;
  // Piano functionality (recording now handled locally)
  clearPianoTrack: (trackIndex: number) => void;
  updatePianoBaseOctave: (
    trackIndex: number,
    baseOctave: PianoBaseOctave,
  ) => void;
  updatePianoTheme: (
    trackIndex: number,
    theme: PianoTheme,
  ) => void;
  updatePianoPattern: (
    trackIndex: number,
    pattern: string[][],
  ) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  tempo: number[];
  setTempo: (tempo: number[]) => void;
  updateTrackVolume: (
    trackIndex: number,
    volume: number,
  ) => void;
  // Hydra background functionality
  hydraBackground: HydraBackground;
  setHydraBackground: (background: HydraBackground) => void;
  hydraCode: string;
  setHydraCode: (code: string) => void;
  // Global playback control
  strudelPlayRef: React.MutableRefObject<(() => void) | null>;
  strudelPauseRef: React.MutableRefObject<(() => void) | null>;
  playStrudel: () => void;
  pauseStrudel: () => void;
  // URL state management
  generateShareURL: () => string;
  loadStateFromURL: () => boolean;
  // Preset management
  loadPreset: (preset: Preset) => void;
}

const TrackContext = createContext<
  TrackContextType | undefined
>(undefined);

export function TrackProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeTrack, setActiveTrackState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState([96]);
  const [hydraBackground, setHydraBackgroundState] =
    useState<HydraBackground>(null);
  const [hydraTheme, setHydraTheme] = useState("STANDARD");
  const [hydraCode, setHydraCode] = useState("");

  // Global playback control refs
  const strudelPlayRef = useRef<(() => void) | null>(null);
  const strudelPauseRef = useRef<(() => void) | null>(null);

  // Piano recording state removed - now handled locally in PianoKeyboard

  // Initialize 4 tracks with 16 beats each
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 0,
      active: true,
      volume: 0.75, // Default volume at 75%
      data: {
        // type: "drum",
        // pattern: Array(16)
        //   .fill(null)
        //   .map(() => []),
        // theme: null,
        // room: 0.5, // Default room at 50%
        // pitch: 0, // Default pitch at 0 (no transpose)
        type: "piano",
        notes: [] as PianoNote[],
        baseOctave: 4, // Default to C4
        theme: "piano", // Default to piano
      },
    },
    {
      id: 1,
      active: false,
      volume: 0.75, // Default volume at 75%
      data: {
        type: "drum",
        pattern: Array(16)
          .fill(null)
          .map(() => []),
        theme: null,
        room: 0.5, // Default room at 50%
        pitch: 0, // Default pitch at 0 (no transpose)
      },
    },
    {
      id: 2,
      active: false,
      volume: 0.75, // Default volume at 75%
      data: {
        type: "drum",
        pattern: Array(16)
          .fill(null)
          .map(() => []),
        theme: null,
        room: 0.5, // Default room at 50%
        pitch: 0, // Default pitch at 0 (no transpose)
      },
    },
    {
      id: 3,
      active: false,
      volume: 0.75, // Default volume at 75%
      data: {
        type: "drum",
        pattern: Array(16)
          .fill(null)
          .map(() => []),
        theme: null,
        room: 0.5, // Default room at 50%
        pitch: 0, // Default pitch at 0 (no transpose)
      },
    },
  ]);

  const setActiveTrack = (index: number) => {
    setActiveTrackState(index);
    const newTracks = [...tracks];
    newTracks.forEach((track, i) => {
      track.active = i === index;
    });
    setTracks(newTracks);
  };

  const updateTrackType = (
    trackIndex: number,
    type: TrackType,
  ) => {
    const newTracks = [...tracks];
    if (type === "drum") {
      newTracks[trackIndex].data = {
        type: "drum",
        pattern: Array(16)
          .fill(null)
          .map(() => []),
        theme: null,
        room: 0.5, // Default room at 50%
        pitch: 0, // Default pitch at 0 (no transpose)
      };
    } else {
      newTracks[trackIndex].data = {
        type: "piano",
        notes: [] as PianoNote[],
        baseOctave: 4, // Default to C4
        theme: "piano", // Default to piano
      };
    }
    setTracks(newTracks);
  };

  const updateDrumPattern = (
    trackIndex: number,
    beatIndex: number,
    sound: DrumSound,
  ) => {
    const newTracks = [...tracks];
    const trackData = newTracks[trackIndex].data;
    if (trackData.type === "drum" && sound) {
      const beatPattern = [...trackData.pattern[beatIndex]];
      const soundIndex = beatPattern.indexOf(sound);

      if (soundIndex > -1) {
        // Sound exists, remove it
        beatPattern.splice(soundIndex, 1);
      } else {
        // Sound doesn't exist, add it
        beatPattern.push(sound);
      }

      trackData.pattern[beatIndex] = beatPattern;
      setTracks(newTracks);
    }
  };

  const updateDrumTheme = (
    trackIndex: number,
    theme: DrumTheme,
  ) => {
    const newTracks = [...tracks];
    const trackData = newTracks[trackIndex].data;
    if (trackData.type === "drum") {
      trackData.theme = theme;
      setTracks(newTracks);
    }
  };

  const updateDrumRoom = (trackIndex: number, room: number) => {
    const newTracks = [...tracks];
    const trackData = newTracks[trackIndex].data;
    if (trackData.type === "drum") {
      trackData.room = Math.max(0, Math.min(1, room)); // Clamp between 0-1
      setTracks(newTracks);
    }
  };

  const updateDrumPitch = (
    trackIndex: number,
    pitch: number,
  ) => {
    const newTracks = [...tracks];
    const trackData = newTracks[trackIndex].data;
    if (trackData.type === "drum") {
      trackData.pitch = Math.max(-12, Math.min(12, pitch)); // Clamp between -12 and +12
      setTracks(newTracks);
    }
  };

  // Define drum sound order matching the UI
  const drumSounds: DrumSound[] = [
    "bd",
    "sd",
    "rim",
    "hh",
    "oh",
    "cp",
    "lt",
    "mt",
    "ht",
    "rd",
    "cr",
  ];

  const toggleDrumBeat = (
    trackIndex: number,
    beatIndex: number,
    drumSoundIndex: number,
  ) => {
    const newTracks = [...tracks];
    const trackData = newTracks[trackIndex].data;
    if (trackData.type === "drum") {
      const sound = drumSounds[drumSoundIndex];
      if (sound) {
        const beatPattern = [...trackData.pattern[beatIndex]];
        const soundIndex = beatPattern.indexOf(sound);

        if (soundIndex > -1) {
          // Sound exists, remove it
          beatPattern.splice(soundIndex, 1);
        } else {
          // Sound doesn't exist, add it
          beatPattern.push(sound);
        }

        trackData.pattern[beatIndex] = beatPattern;
        setTracks(newTracks);
      }
    }
  };

  const applyDrumPreset = (
    trackIndex: number,
    pattern: DrumSound[][],
  ) => {
    const newTracks = [...tracks];
    const trackData = newTracks[trackIndex].data;
    if (trackData.type === "drum") {
      trackData.pattern = pattern.map((beat) => [...beat]);
      setTracks(newTracks);
    }
  };

  // Piano recording functions removed - now handled locally in PianoKeyboard

  const clearPianoTrack = (trackIndex: number) => {
    const newTracks = [...tracks];
    const trackData = newTracks[trackIndex].data;
    if (trackData.type === "piano") {
      trackData.notes = [];
      setTracks(newTracks);
    }
  };

  const updatePianoBaseOctave = (
    trackIndex: number,
    baseOctave: PianoBaseOctave,
  ) => {
    const newTracks = [...tracks];
    const trackData = newTracks[trackIndex].data;
    if (trackData.type === "piano") {
      trackData.baseOctave = baseOctave;
      setTracks(newTracks);
    }
  };

  const updatePianoTheme = (
    trackIndex: number,
    theme: PianoTheme,
  ) => {
    const newTracks = [...tracks];
    const trackData = newTracks[trackIndex].data;
    if (trackData.type === "piano") {
      trackData.theme = theme;
      setTracks(newTracks);
    }
  };

  const updatePianoPattern = (
    trackIndex: number,
    pattern: string[][],
  ) => {
    const newTracks = [...tracks];
    const currentTrack = newTracks[trackIndex];
    const currentTrackData = currentTrack.data;

    if (currentTrackData.type === "piano") {
      // Convert pattern array to PianoNote[] format
      const notes: PianoNote[] = [];
      pattern.forEach((beatNotes, beatIndex) => {
        beatNotes.forEach((note) => {
          notes.push({
            note,
            position: beatIndex,
          });
        });
      });

      // Create new track data object with updated notes
      const newTrackData = {
        ...currentTrackData,
        notes: notes,
      };

      // Create new track object with updated data
      const newTrack = {
        ...currentTrack,
        data: newTrackData,
      };

      // Update the tracks array with the new track
      newTracks[trackIndex] = newTrack;

      setTracks(newTracks);
    }
  };

  const updateTrackVolume = (
    trackIndex: number,
    volume: number,
  ) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].volume = Math.max(
      0,
      Math.min(1, volume),
    ); // Clamp between 0-1
    setTracks(newTracks);
  };

  const setHydraBackground = (background: HydraBackground) => {
    setHydraBackgroundState(background);
  };

  // Global playback control functions
  const playStrudel = () => {
    if (strudelPlayRef.current) {
      strudelPlayRef.current();
      setIsPlaying(true);
    }
  };

  const pauseStrudel = () => {
    if (strudelPauseRef.current) {
      strudelPauseRef.current();
      setIsPlaying(false);
    }

    // Clean up canvas elements when stopping
    const hydraCanvas = document.getElementById("hydra-canvas");
    const testCanvas = document.getElementById("test-canvas");

    if (hydraCanvas) {
      hydraCanvas.remove();
    }

    if (testCanvas) {
      testCanvas.remove();
    }
  };

  // URL state management functions
  const generateShareURL = (): string => {
    const state: SerializableState = {
      tracks,
      tempo: tempo[0],
      activeTrack,
      hydraTheme,
      hydraCode,
    };
    return generateShareableURL(state);
  };

  const loadStateFromURL = (): boolean => {
    const urlState = getStateFromURL();
    if (urlState) {
      // Update all state from URL
      setTracks(urlState.tracks);
      setTempo([urlState.tempo]);
      setActiveTrackState(urlState.activeTrack);
      setHydraTheme(urlState.hydraTheme);
      setHydraCode(urlState.hydraCode);
      return true;
    }
    return false;
  };

  // Preset management functions
  const loadPreset = (preset: Preset): void => {
    // Stop playback if currently playing
    if (isPlaying) {
      pauseStrudel();
    }

    // Load all preset data
    setTracks(preset.tracks);
    setTempo([preset.tempo]);
    setActiveTrackState(0); // Reset to first track
    setHydraCode(preset.hydraCode);

    // Set track active states
    const newTracks = [...preset.tracks];
    newTracks.forEach((track, i) => {
      track.active = i === 0;
    });
    setTracks(newTracks);
  };

  // PAUSED: URL state functionality disabled to keep URLs clean
  // Update URL whenever state changes
  // useEffect(() => {
  //   console.log("l608", tracks);
  //   const state: SerializableState = {
  //     tracks,
  //     tempo: tempo[0],
  //     activeTrack,
  //     hydraTheme,
  //     hydraCode,
  //   };
  //   const hashString = serializeState(state);
  //   updateURL(hashString);
  // }, [tracks, tempo, activeTrack, hydraTheme, hydraCode]);

  // Load state from URL on initial load
  // useEffect(() => {
  //   loadStateFromURL();
  // }, []);

  const value: TrackContextType = useMemo(
    () => ({
      tracks,
      activeTrack,
      setActiveTrack,
      handleTrackSelect: setActiveTrack, // Alias for convenience
      updateTrackType,
      updateDrumPattern,
      updateDrumTheme,
      updateDrumRoom,
      updateDrumPitch,
      applyDrumPreset,
      toggleDrumBeat,
      // Piano functionality (recording now local)
      clearPianoTrack,
      updatePianoBaseOctave,
      updatePianoTheme,
      updatePianoPattern,
      isPlaying,
      setIsPlaying,
      tempo,
      setTempo,
      updateTrackVolume,
      // Hydra background
      hydraBackground,
      setHydraBackground,
      hydraCode,
      setHydraCode,
      // Global playback control
      strudelPlayRef,
      strudelPauseRef,
      playStrudel,
      pauseStrudel,
      // URL state management
      generateShareURL,
      loadStateFromURL,
      // Preset management
      loadPreset,
    }),
    [
      tracks,
      activeTrack,
      isPlaying,
      tempo,
      hydraBackground,
      hydraCode,
    ] as const,
  );

  return (
    <TrackContext.Provider value={value}>
      {children}
    </TrackContext.Provider>
  );
}

export function useTrackContext() {
  const context = useContext(TrackContext);
  if (context === undefined) {
    throw new Error(
      "useTrackContext must be used within a TrackProvider",
    );
  }
  return context;
}