import { useState, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  Music,
  Music2,
  Piano,
  Drum,
  Square,
  Circle,
  RotateCcw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { imgCancel } from "../imports/svg-peyyk";
import {
  useTrackContext,
  DrumSound,
  TrackType,
  DrumTheme,
  PianoNote,
  PianoBaseOctave,
  HydraBackground,
} from "./TrackContext";
import { drumPresets, pianoThemes } from "../utils/constUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { audioSystem } from "../utils/audioSystem";

export function Composer() {
  const {
    tracks,
    activeTrack,
    setActiveTrack,
    updateTrackType,
    updateDrumPattern,
    updateDrumTheme,
    applyDrumPreset,
    // Piano recording
    isRecording,
    isCountingDown,
    countdownValue,
    recordedNotes,
    currentRecordPosition,
    startRecording,
    stopRecording,
    recordNote,
    clearPianoTrack,
    updatePianoBaseOctave,
    updatePianoTheme,
    advanceRecordPosition,
    isPlaying,
    setIsPlaying,
    tempo,
    setTempo,
    updateTrackVolume,
    hydraBackground,
    setHydraBackground,
  } = useTrackContext();

  const [selectingCell, setSelectingCell] = useState<
    number | null
  >(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(
    new Set(),
  );
  const [keyboardPressedKeys, setKeyboardPressedKeys] =
    useState<Set<string>>(new Set());
  const [currentBeat, setCurrentBeat] = useState(0);
  const [audioInitialized, setAudioInitialized] =
    useState(false);

  const drumSounds: DrumSound[] = [
    "bd",
    "sd",
    "hh",
    "oh",
    "lt",
    "mt",
    "ht",
    "cp",
  ];

  const drumThemes: { value: string; label: string }[] = [
    { value: "none", label: "No Theme" },
    { value: "RolandTR909", label: "Roland TR-909" },
    { value: "AkaiLinn", label: "Akai Linn" },
    { value: "RhythmAce", label: "Rhythm Ace" },
    { value: "RolandTR808", label: "Roland TR-808" },
    { value: "RolandTR707", label: "Roland TR-707" },
    { value: "ViscoSpaceDrum", label: "Visco Space Drum" },
  ];

  const handleCellClick = (beatIndex: number) => {
    if (selectingCell === beatIndex) {
      setSelectingCell(null);
    } else {
      setSelectingCell(beatIndex);
    }
  };

  const handleSoundSelect = (
    beatIndex: number,
    sound: DrumSound,
  ) => {
    updateDrumPattern(activeTrack, beatIndex, sound);
    setSelectingCell(null);
  };

  const handleTrackSelect = (trackIndex: number) => {
    setActiveTrack(trackIndex);
  };

  const handleTrackTypeChange = (type: TrackType) => {
    updateTrackType(activeTrack, type);
  };

  const currentTrack = tracks[activeTrack];
  const currentPattern =
    currentTrack.data.type === "drum"
      ? currentTrack.data.pattern
      : [];

  // BPM animation effect
  useEffect(() => {
    if (isPlaying) {
      // Calculate interval from BPM (beats per minute)
      const interval = ((60 / tempo[0]) * 1000) / 4; // milliseconds per beat

      const timer = setInterval(() => {
        setCurrentBeat((prev) => (prev + 1) % 16);
      }, interval);

      return () => clearInterval(timer);
    } else {
      // Reset to start when stopped
      setCurrentBeat(0);
    }
  }, [isPlaying, tempo]);

  // Piano key handling with multiple key support
  const handleKeyPress = useCallback(
    async (keyId: string) => {
      setPressedKeys((prev) => new Set(prev).add(keyId));

      // Play audio feedback with current theme
      try {
        const theme =
          currentTrack.data.type === "piano"
            ? currentTrack.data.theme
            : "piano";
        await audioSystem.playNote(keyId, "4n", theme);
        if (!audioInitialized) {
          setAudioInitialized(true);
        }
      } catch (error) {
        console.error("Failed to play note:", keyId, error);
      }

      // Record note if recording is active (not during countdown)
      if (
        isRecording &&
        !isCountingDown &&
        currentTrack.data.type === "piano"
      ) {
        recordNote(activeTrack, keyId);
      }

      // Auto-release after 300ms for mouse/touch
      setTimeout(() => {
        setPressedKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(keyId);
          return newSet;
        });
      }, 300);
    },
    [
      isRecording,
      isCountingDown,
      currentTrack.data.type,
      currentTrack.data,
      activeTrack,
      recordNote,
      audioInitialized,
    ],
  );

  // Keyboard event mapping
  const keyboardMapping = {
    // White keys: q,w,e,r,t,y,u,i,o,p
    q: 0,
    w: 1,
    e: 2,
    r: 3,
    t: 4,
    y: 5,
    u: 6,
    i: 7,
    o: 8,
    p: 9,
    // Black keys: 2,3,5,6,7,9,0
    "2": 0,
    "3": 1,
    "5": 2,
    "6": 3,
    "7": 4,
    "9": 5,
    "0": 6,
  };

  // Handle keyboard events
  useEffect(() => {
    if (currentTrack.data.type !== "piano") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        key in keyboardMapping &&
        !keyboardPressedKeys.has(key)
      ) {
        e.preventDefault();
        setKeyboardPressedKeys((prev) =>
          new Set(prev).add(key),
        );

        // Determine note based on key and base octave
        const baseOctave = currentTrack.data.baseOctave;
        let noteId: string;

        if (
          [
            "q",
            "w",
            "e",
            "r",
            "t",
            "y",
            "u",
            "i",
            "o",
            "p",
          ].includes(key)
        ) {
          // White keys
          const whiteKeyNotes = [
            "C",
            "D",
            "E",
            "F",
            "G",
            "A",
            "B",
            "C",
            "D",
            "E",
          ];
          const keyIndex =
            keyboardMapping[
              key as keyof typeof keyboardMapping
            ];
          const note = whiteKeyNotes[keyIndex];
          const octave =
            keyIndex >= 7 ? baseOctave + 1 : baseOctave;
          noteId = `${note}${octave}`;
        } else {
          // Black keys
          const blackKeyNotes = [
            "C#",
            "D#",
            "F#",
            "G#",
            "A#",
            "C#",
            "D#",
          ];
          const keyIndex =
            keyboardMapping[
              key as keyof typeof keyboardMapping
            ];
          const note = blackKeyNotes[keyIndex];
          const octave =
            keyIndex >= 5 ? baseOctave + 1 : baseOctave;
          noteId = `${note}${octave}`;
        }

        handleKeyPress(noteId);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keyboardMapping) {
        setKeyboardPressedKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    currentTrack.data.type,
    currentTrack.data.baseOctave,
    keyboardPressedKeys,
    handleKeyPress,
  ]);

  // Animation system for recording position advancement
  useEffect(() => {
    if (!isRecording) return;

    const bpm = tempo[0];
    const beatDuration = ((60 / bpm) * 1000) / 4; // milliseconds per beat

    const intervalId = setInterval(() => {
      setCurrentBeat((prevBeat) => {
        const nextBeat = (prevBeat + 1) % 16;
        return nextBeat;
      });

      // Advance recording position automatically
      advanceRecordPosition();
    }, beatDuration);

    return () => clearInterval(intervalId);
  }, [isRecording, tempo, advanceRecordPosition]);

  // Initialize audio system when piano track is first selected
  useEffect(() => {
    if (currentTrack.data.type === "piano") {
      // Initialize audio system on first piano interaction
      audioSystem.initialize().catch(console.error);
    }
  }, [currentTrack.data.type]);



  // Update audio system theme when piano theme changes
  useEffect(() => {
    if (currentTrack.data.type === "piano") {
      audioSystem.setTheme(currentTrack.data.theme);
    }
  }, [currentTrack.data]);

  // Enhanced Piano keyboard component with 10 white keys and 7 black keys
  const PianoKeyboard = () => {
    if (currentTrack.data.type !== "piano") return null;

    const baseOctave = currentTrack.data.baseOctave;

    // 10 white keys: C, D, E, F, G, A, B, C, D, E (spanning across octaves)
    const whiteKeys = [
      { note: "C", octave: baseOctave },
      { note: "D", octave: baseOctave },
      { note: "E", octave: baseOctave },
      { note: "F", octave: baseOctave },
      { note: "G", octave: baseOctave },
      { note: "A", octave: baseOctave },
      { note: "B", octave: baseOctave },
      { note: "C", octave: baseOctave + 1 },
      { note: "D", octave: baseOctave + 1 },
      { note: "E", octave: baseOctave + 1 },
    ];

    // 7 black keys positioned between appropriate white keys
    const blackKeys = [
      { note: "C#", octave: baseOctave, position: 0 }, // Between C and D
      { note: "D#", octave: baseOctave, position: 1 }, // Between D and E
      { note: "F#", octave: baseOctave, position: 3 }, // Between F and G
      { note: "G#", octave: baseOctave, position: 4 }, // Between G and A
      { note: "A#", octave: baseOctave, position: 5 }, // Between A and B
      { note: "C#", octave: baseOctave + 1, position: 7 }, // Between C and D (next octave)
      { note: "D#", octave: baseOctave + 1, position: 8 }, // Between D and E (next octave)
    ];

    const keyboardLabels = [
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
    ];
    const blackKeyLabels = ["2", "3", "5", "6", "7", "9", "0"];

    return (
      <div className="relative w-full h-32">
        {/* White Keys */}
        <div className="flex w-full h-full gap-[1px]">
          {whiteKeys.map((keyData, index) => {
            const keyId = `${keyData.note}${keyData.octave}`;
            const isPressed = pressedKeys.has(keyId);
            const keyboardKey = keyboardLabels[index];
            const isKeyboardPressed = keyboardPressedKeys.has(
              keyboardKey.toLowerCase(),
            );

            return (
              <div
                key={`${keyId}-${index}`}
                className={`flex-1 border border-gray-300 rounded-sm cursor-pointer transition-all duration-100 flex flex-col items-center justify-between py-2 ${
                  isPressed || isKeyboardPressed
                    ? "bg-purple-400 scale-95"
                    : "bg-white hover:bg-gray-50"
                }`}
                onMouseDown={() => handleKeyPress(keyId)}
                onTouchStart={() => handleKeyPress(keyId)}
              >
                <span className="text-xs text-gray-500 select-none">
                  {keyboardKey}
                </span>
                <span className="text-xs text-gray-600 select-none">
                  {keyData.note === "C"
                    ? `${keyData.note}${keyData.octave}`
                    : ""}
                </span>
              </div>
            );
          })}
        </div>

        {/* Black Keys */}
        <div className="absolute top-0 left-0 w-full h-3/5 pointer-events-none">
          {blackKeys.map((keyData, index) => {
            const keyId = `${keyData.note}${keyData.octave}`;
            const isPressed = pressedKeys.has(keyId);
            const keyboardKey = blackKeyLabels[index];
            const isKeyboardPressed =
              keyboardPressedKeys.has(keyboardKey);

            // Calculate position: each white key is 10% of total width
            const leftPosition =
              (keyData.position + 1) * 10 - 3; // 6% black key width, center it

            return (
              <div
                key={`${keyId}-${index}`}
                className={`absolute w-[6%] h-full rounded-sm cursor-pointer transition-all duration-100 pointer-events-auto flex flex-col items-center justify-start pt-1 ${
                  isPressed || isKeyboardPressed
                    ? "bg-purple-600 scale-95"
                    : "bg-black hover:bg-gray-800"
                }`}
                style={{ left: `${leftPosition}%` }}
                onMouseDown={() => handleKeyPress(keyId)}
                onTouchStart={() => handleKeyPress(keyId)}
              >
                <span className="text-xs text-white select-none">
                  {keyboardKey}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="z-[100] w-full max-w-[400px] bg-[#212121] rounded-lg overflow-hidden"
      style={{ aspectRatio: "3/5" }}
    >
      <div className="h-full flex flex-col p-[8px] gap-[8px]">
        {/* Title Bar */}
        <div className="bg-[#4d4d4d] relative rounded-[2px] shrink-0 w-full flex-none">
          <div className="flex flex-row items-center overflow-clip relative size-full">
            <div className="box-border content-stretch flex gap-[11px] items-center justify-start p-[12px] relative w-full">
              <div className="bg-white shrink-0 size-9 rounded flex items-center justify-center">
                <Music className="w-5 h-5 text-gray-600" />
              </div>
              <div className="basis-0 bg-white grow h-[38px] min-h-px min-w-px shrink-0 rounded flex items-center px-4">
                <span className="text-gray-800 font-medium">
                  Music Composer
                </span>
              </div>
              <div className="bg-white shrink-0 size-9 rounded flex items-center justify-center cursor-pointer hover:bg-gray-100">
                <span className="text-gray-600 text-sm">?</span>
              </div>
              {/* Play/Pause */}
              <div className="bg-white w-9 h-9 shrink-0 rounded flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 p-0"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-[#4d4d4d] relative rounded-[2px] shrink-0 w-full flex-none">
          <div className="flex flex-row items-center overflow-clip relative size-full">
            <div className="box-border content-stretch flex gap-[11px] items-center justify-start p-[12px] relative w-full">
              {/* Tempo */}
              <div className="bg-white grow h-9 min-h-px min-w-px shrink-0 rounded flex items-center px-3 gap-2">
                <span className="text-sm text-gray-600">
                  BPM
                </span>
                <Slider
                  value={tempo}
                  onValueChange={setTempo}
                  min={60}
                  max={144}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 min-w-[3ch]">
                  {tempo[0]}
                </span>
              </div>
              
              {/* Hydra Background Dropdown */}
              <div className="bg-white shrink-0 h-9 rounded flex items-center min-w-[120px]">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white text-xs"
                    >
                      {hydraBackground === "spring" ? "Spring" :
                       hydraBackground === "earth" ? "Earth" : "No BG"}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-[1000] w-32 bg-gray-700 border-gray-600">
                    <DropdownMenuItem
                      onClick={() => setHydraBackground(null)}
                      className="text-white hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
                    >
                      No Background
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setHydraBackground("spring")}
                      className="text-white hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
                    >
                      Spring
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setHydraBackground("earth")}
                      className="text-white hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
                    >
                      Earth
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Tracks */}
        <div className="bg-[#4d4d4d] relative rounded-[2px] shrink-0 w-full flex-none">
          <div className="flex flex-row items-center overflow-clip relative size-full">
            {/* Track Selection Row with Volume Sliders */}
            <div className="box-border content-stretch flex gap-[8px] items-center justify-start p-[12px] relative w-full">
              {/* Track Buttons with Volume */}
              {tracks.map((track, index) => (
                <div key={track.id} className="flex flex-col items-center gap-2">
                  {/* Track Button */}
                  <div
                    className={`shrink-0 size-9 rounded cursor-pointer flex items-center justify-center text-sm font-medium transition-colors ${
                      track.active
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleTrackSelect(index)}
                  >
                    T{index + 1}
                  </div>
                  
                  {/* Volume Slider */}
                  <div className="w-16 flex flex-col items-center">
                    <Slider
                      value={[track.volume * 100]} // Convert 0-1 to 0-100 for display
                      onValueChange={(value) => 
                        updateTrackVolume(index, value[0] / 100) // Convert back to 0-1
                      }
                      max={100}
                      min={0}
                      step={1}
                      className="w-full h-2"
                    />
                    <span className="text-xs text-white mt-1">
                      {Math.round(track.volume * 100)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Track Type Selector Row */}
            <div className="box-border content-stretch flex items-center justify-start px-[12px] pb-[12px] relative w-full">
              <div className="bg-white grow min-h-px min-w-px relative shrink-0 rounded">
                <div className="flex flex-row items-center overflow-clip relative size-full h-[36px]">
                  <div className="box-border content-stretch flex gap-1 items-center justify-start px-1 py-1 relative w-full">
                    <button
                      className={`basis-0 grow h-7 min-h-px min-w-px shrink-0 rounded transition-colors flex items-center justify-center ${
                        currentTrack.data.type === "drum"
                          ? "bg-gray-700 text-white"
                          : "bg-[#dbdbdb] text-gray-600 hover:bg-gray-300"
                      }`}
                      onClick={() =>
                        handleTrackTypeChange("drum")
                      }
                    >
                      <Drum className="w-4 h-4" />
                    </button>
                    <button
                      className={`basis-0 grow h-7 min-h-px min-w-px shrink-0 rounded transition-colors flex items-center justify-center ${
                        currentTrack.data.type === "piano"
                          ? "bg-gray-700 text-white"
                          : "bg-[#dbdbdb] text-gray-600 hover:bg-gray-300"
                      }`}
                      onClick={() =>
                        handleTrackTypeChange("piano")
                      }
                    >
                      <Piano className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Settings */}
        {currentTrack.data.type === "drum" && (
          <div className="bg-[#4d4d4d] relative rounded-[2px] shrink-0 w-full flex-none">
            <div className="flex flex-row items-center overflow-clip relative size-full">
              <div className="box-border content-stretch flex gap-[11px] items-center justify-start p-[12px] relative w-full">
                <div className="basis-0 bg-white grow h-9 min-h-px min-w-px shrink-0 rounded flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <Button
                        variant="outline"
                        className="w-full flex-1 justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white"
                      >
                        {drumThemes.find(
                          (t) =>
                            t.value ===
                            (currentTrack.data.theme || "none"),
                        )?.label || "Select theme"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-[1000] w-48 bg-gray-700 border-gray-600">
                      {drumThemes.map((theme) => (
                        <DropdownMenuItem
                          key={theme.value}
                          onClick={() => {
                            const selectedTheme =
                              theme.value === "none"
                                ? null
                                : (theme.value as DrumTheme);
                            updateDrumTheme(
                              activeTrack,
                              selectedTheme,
                            );
                          }}
                          className="text-white hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
                        >
                          {theme.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="basis-0 bg-white grow h-9 min-h-px min-w-px shrink-0 rounded flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <Button
                        variant="outline"
                        className="w-full flex-1 justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white"
                      >
                        Select Preset
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-[1000] w-48 bg-gray-700 border-gray-600">
                      {drumPresets.map((preset) => (
                        <DropdownMenuItem
                          key={preset.name}
                          onClick={() => {
                            applyDrumPreset(
                              activeTrack,
                              preset.pattern,
                            );
                          }}
                          className="text-white hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
                        >
                          {preset.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Piano Track Settings */}
        {currentTrack.data.type === "piano" && (
          <div className="bg-[#4d4d4d] relative rounded-[2px] shrink-0 w-full flex-none">
            <div className="flex flex-row items-center overflow-clip relative size-full">
              <div className="box-border content-stretch flex gap-[11px] items-center justify-start p-[12px] relative w-full">
                {/* Piano Theme Dropdown */}
                <div className="basis-0 bg-white grow h-9 min-h-px min-w-px shrink-0 rounded flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <Button
                        variant="outline"
                        className="w-full flex-1 justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white"
                      >
                        {pianoThemes.find(
                          (t) =>
                            t.value === currentTrack.data.theme,
                        )?.name || "Piano"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-[1000] w-48 bg-gray-700 border-gray-600">
                      {pianoThemes.map((theme) => (
                        <DropdownMenuItem
                          key={theme.value}
                          onClick={() => {
                            updatePianoTheme(
                              activeTrack,
                              theme.value,
                            );
                          }}
                          className="text-white hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
                        >
                          {theme.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* Base Octave Dropdown */}
                <div className="basis-0 bg-white grow h-9 min-h-px min-w-px shrink-0 rounded flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <Button
                        variant="outline"
                        className="w-full flex-1 justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white"
                      >
                        Base: C{currentTrack.data.baseOctave}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-[1000] w-32 bg-gray-700 border-gray-600">
                      {([2, 3, 4, 5] as PianoBaseOctave[]).map(
                        (octave) => (
                          <DropdownMenuItem
                            key={octave}
                            onClick={() => {
                              updatePianoBaseOctave(
                                activeTrack,
                                octave,
                              );
                            }}
                            className="text-white hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
                          >
                            C{octave}
                          </DropdownMenuItem>
                        ),
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drum Pattern Grid */}
        {currentTrack.data.type === "drum" && (
          <div className="bg-[#4d4d4d] relative rounded-[4px] flex-1 w-full min-h-0">
            <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
              <div className="box-border content-stretch flex gap-2.5 items-center justify-center p-[12px] relative w-full h-full">
                <div className="bg-white box-border gap-1 grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(4,_minmax(0px,_1fr))] overflow-clip p-[4px] relative rounded-[2px] shrink-0 aspect-square w-full max-w-[280px] max-h-[280px]">
                  {currentPattern.map((sound, index) => {
                    const isCurrentBeat =
                      isPlaying && currentBeat === index;
                    return (
                      <div
                        key={index}
                        className={`relative shrink-0 aspect-square cursor-pointer transition-all duration-75 ${
                          isCurrentBeat
                            ? "ring-2 ring-blue-400 ring-opacity-80"
                            : ""
                        }`}
                        onClick={() => handleCellClick(index)}
                      >
                        {/* Cell Content */}
                        {selectingCell === index ? (
                          // Sound Selector
                          <div className="bg-white relative shrink-0 size-full">
                            <div className="overflow-clip relative size-full">
                              <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-[4px] relative size-full">
                                <div className="basis-0 bg-[dimgrey] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full">
                                  <div className="overflow-clip relative size-full">
                                    <div className="box-border gap-0.5 grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(3,_minmax(0px,_1fr))] p-[2px] relative size-full">
                                      {/* Drum sound options */}
                                      {drumSounds.map(
                                        (
                                          drumSound,
                                          soundIndex,
                                        ) => (
                                          <div
                                            key={drumSound}
                                            className="bg-[#e1e1e1] overflow-clip relative rounded-[2px] shrink-0 cursor-pointer hover:bg-gray-300 transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSoundSelect(
                                                index,
                                                drumSound,
                                              );
                                            }}
                                          >
                                            <div
                                              className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[10px] text-[dimgrey] text-nowrap"
                                              style={{
                                                top: "calc(50% - 6.75px)",
                                                left: "calc(50% - 7.25px)",
                                              }}
                                            >
                                              <p className="leading-[normal] whitespace-pre">
                                                {drumSound}
                                              </p>
                                            </div>
                                          </div>
                                        ),
                                      )}

                                      {/* Clear/Cancel option */}
                                      <div
                                        className="relative shrink-0 cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSoundSelect(
                                            index,
                                            null,
                                          );
                                        }}
                                      >
                                        <img
                                          className="block max-w-none size-full hover:opacity-80 transition-opacity"
                                          src={imgCancel}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Regular cell
                          <div className="bg-white box-border content-stretch flex flex-col gap-1 items-start justify-start overflow-clip p-[4px] relative shrink-0 size-full">
                            {sound ? (
                              // Cell with sound
                              <div className="basis-0 bg-[#373737] grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full">
                                <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
                                  <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-[13px] py-3.5 relative size-full">
                                    <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e1e1e1] text-[24px] text-nowrap">
                                      <p className="leading-[normal] whitespace-pre">
                                        {sound}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Empty cell
                              <div className="basis-0 grow min-h-px min-w-px relative rounded-[2px] shrink-0 w-full">
                                <div className="flex flex-col items-center justify-center relative size-full">
                                  <div className="size-full" />
                                </div>
                                <div
                                  aria-hidden="true"
                                  className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[2px]"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Piano Interface */}
        {currentTrack.data.type === "piano" && (
          <div className="bg-[#4d4d4d] relative rounded-[4px] flex-1 w-full min-h-0">
            <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
              <div className="box-border content-stretch flex flex-col gap-3 items-center justify-center p-[12px] relative w-full h-full">
                {/* Recording Controls */}
                <div className="w-full max-w-[320px] flex gap-2 items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        isRecording || isCountingDown
                          ? stopRecording(activeTrack)
                          : startRecording(activeTrack)
                      }
                      className={`${
                        isRecording
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : isCountingDown
                            ? "bg-yellow-600 text-white hover:bg-yellow-700"
                            : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-4 h-4" />
                      ) : isCountingDown ? (
                        <Circle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      {isRecording
                        ? "Stop"
                        : isCountingDown
                          ? ".".repeat(countdownValue)
                          : "Record"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        clearPianoTrack(activeTrack)
                      }
                      className="bg-gray-700 text-white hover:bg-gray-600"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear
                    </Button>
                  </div>

                  {/* Recording Position Indicator */}
                  {(isRecording || isCountingDown) && (
                    <div className="text-white text-sm">
                      {isCountingDown
                        ? ".".repeat(countdownValue)
                        : `${currentRecordPosition}/16`}
                    </div>
                  )}
                </div>

                {/* Note Visualization */}
                <div className="w-full max-w-[320px] bg-gray-800 rounded-md p-2">
                  <div
                    className="grid gap-1 h-8"
                    style={{
                      gridTemplateColumns: "repeat(16, 1fr)",
                    }}
                  >
                    {Array.from({ length: 16 }, (_, index) => {
                      // Get notes at this position
                      const notesAtPosition = (
                        currentTrack.data.type === "piano"
                          ? currentTrack.data.notes
                          : recordedNotes
                      ).filter(
                        (note) => note.position === index,
                      );
                      const isCurrentRecordPosition =
                        isRecording &&
                        !isCountingDown &&
                        currentRecordPosition === index;
                      const isCountdownIndicator =
                        isCountingDown && index === 0; // Show countdown on first position

                      return (
                        <div
                          key={index}
                          className={`relative h-full rounded-sm border ${
                            isCurrentRecordPosition
                              ? "bg-red-500 border-red-400"
                              : isCountdownIndicator
                                ? "bg-yellow-500 border-yellow-400"
                                : notesAtPosition.length > 0
                                  ? "bg-blue-500 border-blue-400"
                                  : "bg-gray-600 border-gray-500"
                          }`}
                          title={notesAtPosition
                            .map((n) => n.note)
                            .join(", ")}
                        >
                          {notesAtPosition.length > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-white font-mono">
                                {notesAtPosition.length > 1
                                  ? notesAtPosition.length
                                  : notesAtPosition[0]?.note.replace(
                                      /[0-9]/g,
                                      "",
                                    )}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Piano Keyboard - 10 keys spanning octaves */}
                <div className="w-full max-w-[400px]">
                  <PianoKeyboard />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}