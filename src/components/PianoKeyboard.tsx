import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTrackContext } from "./TrackContext";
import * as Tone from "tone";

interface PianoKeyboardProps {
  onKeyPress: (note: string) => void;
  pressedKeys: Set<string>;
}

export function PianoKeyboard({
  onKeyPress,
  pressedKeys,
}: PianoKeyboardProps) {
  const { tracks, activeTrack, tempo, updatePianoPattern } =
    useTrackContext();

  // Visual pressed state
  const [pressedNotes, setPressedNotes] = useState<Set<string>>(
    new Set(),
  );

  // Component focus state
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Recording state
  const [recordingState, setRecordingState] = useState<
    "idle" | "countdown" | "recording"
  >("idle");
  const [countdownValue, setCountdownValue] = useState(4);
  const [currentRecordBeat, setCurrentRecordBeat] =
    useState(-1);
  const [localRecordingPattern, setLocalRecordingPattern] =
    useState<string[][]>(Array.from({ length: 16 }, () => []));

  // ===== Audio refs (new) =====
  const polyRef = useRef<Tone.PolySynth | null>(null); // single polysynth
  const activeNotes = useRef<Set<string>>(new Set()); // currently sounding notes

  // Other refs
  const pressedKeyboardKeys = useRef<Set<string>>(new Set());
  const keyboardToNoteMap = useRef<Map<string, string>>(
    new Map(),
  );
  const recordingTimerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const countdownTimerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const phaseRef = useRef<"idle" | "countdown" | "recording">(
    "idle",
  );
  const localRecordingPatternRef = useRef<string[][]>(
    Array.from({ length: 16 }, () => []),
  );

  // Keep ref in sync with state
  useEffect(() => {
    localRecordingPatternRef.current = localRecordingPattern;
  }, [localRecordingPattern]);

  // ===== Initialize PolySynth once =====
  useEffect(() => {
    polyRef.current = new Tone.PolySynth(
      Tone.Synth,
    ).toDestination();
    // Make releases snappy so stuck notes (if any) die fast
    (polyRef.current as any)?.set?.({
      envelope: { release: 0.08 },
    });

    const handleVisibility = () => stopAllNotes();
    document.addEventListener(
      "visibilitychange",
      handleVisibility,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility,
      );
      stopAllNotes();
      polyRef.current?.dispose();
      polyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer cleanup utility
  const clearTimers = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  // ===== Audio functions (updated) =====
  const playNote = useCallback(
    async (noteWithOctave: string) => {
      try {
        if (activeNotes.current.has(noteWithOctave)) return;

        if (Tone.context.state !== "running") {
          await Tone.start();
        }

        polyRef.current?.triggerAttack(noteWithOctave);
        activeNotes.current.add(noteWithOctave);
      } catch (error) {
        console.error("Error playing note:", error);
      }
    },
    [],
  );

  const stopNote = useCallback((noteWithOctave: string) => {
    if (!activeNotes.current.has(noteWithOctave)) return;
    try {
      polyRef.current?.triggerRelease(noteWithOctave);
    } finally {
      activeNotes.current.delete(noteWithOctave);
    }
  }, []);

  // Clean up all notes and state
  const stopAllNotes = useCallback(() => {
    polyRef.current?.releaseAll();
    activeNotes.current.clear();

    // Clear all visual state
    setPressedNotes(new Set());
    pressedKeyboardKeys.current.clear();
  }, []);

  // ===== Key interaction handlers =====
  const handleKeyDown = useCallback(
    (fullNote: string) => {
      // Prevent multiple triggers for same note
      if (pressedNotes.has(fullNote)) return;

      // Update visual state
      setPressedNotes((prev) => new Set([...prev, fullNote]));

      // Play audio
      playNote(fullNote);

      // Call parent callback
      onKeyPress(fullNote);

      // Record if in recording mode
      if (
        recordingState === "recording" &&
        currentRecordBeat >= 0 &&
        currentRecordBeat < 16
      ) {
        setLocalRecordingPattern((prevPattern) => {
          const newPattern = [...prevPattern];
          if (
            !newPattern[currentRecordBeat].includes(fullNote)
          ) {
            newPattern[currentRecordBeat] = [
              ...newPattern[currentRecordBeat],
              fullNote,
            ];
          }
          return newPattern;
        });
      }
    },
    [
      pressedNotes,
      playNote,
      onKeyPress,
      recordingState,
      currentRecordBeat,
    ],
  );

  const handleKeyUp = useCallback(
    (fullNote: string) => {
      // Update visual state
      setPressedNotes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fullNote);
        return newSet;
      });

      // Stop audio
      stopNote(fullNote);
    },
    [stopNote],
  );

  // ===== Pointer Events (replace mouse/touch) =====
  const onKeyPointerDown = useCallback(
    (note: string, e: React.PointerEvent) => {
      // If we’re not focused yet on mobile, use this tap to focus/arm and exit
      if (
        !isFocused &&
        (isMobileRef.current || e.pointerType === "touch")
      ) {
        containerRef.current?.focus();
        e.preventDefault();
        return; // <- do NOT start sound on the “focus tap”
      }

      try {
        (e.currentTarget as HTMLElement).setPointerCapture(
          e.pointerId,
        );
      } catch {}
      e.preventDefault();
      handleKeyDown(note);
    },
    [isFocused, handleKeyDown],
  );

  const onKeyPointerUp = useCallback(
    (note: string, e: React.PointerEvent) => {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(
          e.pointerId,
        );
      } catch {}
      e.preventDefault();
      handleKeyUp(note);
    },
    [handleKeyUp],
  );

  const onKeyPointerCancelOrLeave = useCallback(
    (note: string) => {
      // If finger slides off the key or gets canceled, ensure we stop
      handleKeyUp(note);
    },
    [handleKeyUp],
  );

  // ===== Keyboard event handlers =====
  const handleKeyboardDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const note = keyboardToNoteMap.current.get(key);

      if (note && !pressedKeyboardKeys.current.has(key)) {
        event.preventDefault();
        pressedKeyboardKeys.current.add(key);
        handleKeyDown(note);
      }
    },
    [handleKeyDown],
  );

  const handleKeyboardUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const note = keyboardToNoteMap.current.get(key);

      if (note && pressedKeyboardKeys.current.has(key)) {
        event.preventDefault();
        pressedKeyboardKeys.current.delete(key);
        handleKeyUp(note);
      }
    },
    [handleKeyUp],
  );

  // Window blur handler
  const handleWindowBlur = useCallback(() => {
    stopAllNotes();
  }, [stopAllNotes]);

  // Focus handlers
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    stopAllNotes(); // Clean up when losing focus
  }, [stopAllNotes]);

  // Piano key generation
  const getCurrentBaseOctave = (): number => {
    const currentTrack = tracks[activeTrack];
    if (currentTrack?.data?.type === "piano") {
      return currentTrack.data.baseOctave;
    }
    return 4;
  };

  const generatePianoKeys = () => {
    const baseOctave = getCurrentBaseOctave();

    const whiteKeys = [
      {
        note: "C",
        octave: baseOctave,
        fullNote: `C${baseOctave}`,
      },
      {
        note: "D",
        octave: baseOctave,
        fullNote: `D${baseOctave}`,
      },
      {
        note: "E",
        octave: baseOctave,
        fullNote: `E${baseOctave}`,
      },
      {
        note: "F",
        octave: baseOctave,
        fullNote: `F${baseOctave}`,
      },
      {
        note: "G",
        octave: baseOctave,
        fullNote: `G${baseOctave}`,
      },
      {
        note: "A",
        octave: baseOctave,
        fullNote: `A${baseOctave}`,
      },
      {
        note: "B",
        octave: baseOctave,
        fullNote: `B${baseOctave}`,
      },
      {
        note: "C",
        octave: baseOctave + 1,
        fullNote: `C${baseOctave + 1}`,
      },
      {
        note: "D",
        octave: baseOctave + 1,
        fullNote: `D${baseOctave + 1}`,
      },
      {
        note: "E",
        octave: baseOctave + 1,
        fullNote: `E${baseOctave + 1}`,
      },
    ];

    const blackKeys = [
      {
        note: "C#",
        octave: baseOctave,
        fullNote: `C#${baseOctave}`,
        position: 0,
      },
      {
        note: "D#",
        octave: baseOctave,
        fullNote: `D#${baseOctave}`,
        position: 1,
      },
      {
        note: "F#",
        octave: baseOctave,
        fullNote: `F#${baseOctave}`,
        position: 3,
      },
      {
        note: "G#",
        octave: baseOctave,
        fullNote: `G#${baseOctave}`,
        position: 4,
      },
      {
        note: "A#",
        octave: baseOctave,
        fullNote: `A#${baseOctave}`,
        position: 5,
      },
      {
        note: "C#",
        octave: baseOctave + 1,
        fullNote: `C#${baseOctave + 1}`,
        position: 7,
      },
      {
        note: "D#",
        octave: baseOctave + 1,
        fullNote: `D#${baseOctave + 1}`,
        position: 8,
      },
    ];

    return { whiteKeys, blackKeys };
  };

  const { whiteKeys, blackKeys } = generatePianoKeys();

  // Initialize keyboard mappings
  useEffect(() => {
    const updateKeyboardMapping = () => {
      const map = new Map<string, string>();

      const whiteKeyboardKeys = [
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
      ];
      whiteKeys.forEach((key, index) => {
        if (whiteKeyboardKeys[index]) {
          map.set(whiteKeyboardKeys[index], key.fullNote);
        }
      });

      const blackKeyboardKeys = [
        "2",
        "3",
        "5",
        "6",
        "7",
        "9",
        "0",
      ];
      blackKeys.forEach((key, index) => {
        if (blackKeyboardKeys[index]) {
          map.set(blackKeyboardKeys[index], key.fullNote);
        }
      });

      keyboardToNoteMap.current = map;
    };

    updateKeyboardMapping();
  }, [whiteKeys, blackKeys]);

  // Focus-based event listeners - only active when component is focused
  useEffect(() => {
    if (isFocused) {
      window.addEventListener("keydown", handleKeyboardDown);
      window.addEventListener("keyup", handleKeyboardUp);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyboardDown);
      window.removeEventListener("keyup", handleKeyboardUp);
    };
  }, [isFocused, handleKeyboardDown, handleKeyboardUp]);

  // Window blur handler - always active for cleanup
  useEffect(() => {
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      stopAllNotes();
      clearTimers();
    };
  }, [handleWindowBlur, stopAllNotes, clearTimers]);

  // Countdown sound
  const playCountdownSound = useCallback(
    async (count: number) => {
      try {
        if (Tone.context.state !== "running") {
          await Tone.start();
        }
        const pitches = { 4: "C5", 3: "C5", 2: "C5", 1: "G5" };
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(
          pitches[count as keyof typeof pitches] || "C5",
          "8n",
        );
        setTimeout(() => synth.dispose(), 500);
      } catch (error) {
        console.error("Error playing countdown sound:", error);
      }
    },
    [],
  );

  // Recording logic
  const handleRecordClick = useCallback(() => {
    const msPerBeat = 60000 / tempo[0];
    const msPerThirtySecondNote = msPerBeat / 4;

    if (phaseRef.current === "idle") {
      phaseRef.current = "countdown";
      setRecordingState("countdown");
      setCountdownValue(4);
      playCountdownSound(4);

      const trackAtStart = activeTrack;
      let currentCount = 4;

      countdownTimerRef.current = setInterval(() => {
        if (phaseRef.current !== "countdown") return;

        currentCount -= 1;
        setCountdownValue(currentCount);

        if (currentCount > 0) {
          playCountdownSound(currentCount);
          return;
        }

        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }

        phaseRef.current = "recording";
        setRecordingState("recording");
        setCurrentRecordBeat(0);

        const emptyPattern = Array.from(
          { length: 16 },
          () => [],
        );
        setLocalRecordingPattern(emptyPattern);
        localRecordingPatternRef.current = emptyPattern;

        let beatIndex = 1;
        recordingTimerRef.current = setInterval(() => {
          if (beatIndex < 16) {
            setCurrentRecordBeat(beatIndex);
            beatIndex += 1;
          } else {
            if (recordingTimerRef.current) {
              clearInterval(recordingTimerRef.current);
              recordingTimerRef.current = null;
            }
            phaseRef.current = "idle";
            setRecordingState("idle");
            setCurrentRecordBeat(-1);

            updatePianoPattern(
              trackAtStart,
              localRecordingPatternRef.current,
            );
          }
        }, msPerThirtySecondNote);
      }, msPerBeat);
    } else {
      clearTimers();
      phaseRef.current = "idle";
      setRecordingState("idle");
      setCurrentRecordBeat(-1);

      const emptyPattern = Array.from({ length: 16 }, () => []);
      setLocalRecordingPattern(emptyPattern);
      localRecordingPatternRef.current = emptyPattern;
    }
  }, [
    tempo,
    activeTrack,
    playCountdownSound,
    updatePianoPattern,
    clearTimers,
  ]);

  const getRecordButtonText = () => {
    switch (recordingState) {
      case "countdown":
        return `● ${countdownValue}`;
      case "recording":
        return "● RECORDING";
      default:
        return "○ Record";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col outline-none ${isFocused ? "ring-2 ring-brand/50" : ""}`}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Recording controls */}
      <div className="flex flex-col gap-1 mb-2">
        <button
          onClick={handleRecordClick}
          className={`w-24 px-2 py-1 text-xs text-center border border-[#BEBEBE] transition-colors cursor-pointer hover:opacity-80 ${
            recordingState !== "idle"
              ? "bg-brand text-brand-foreground"
              : "bg-brand text-brand-foreground"
          }`}
        >
          {getRecordButtonText()}
        </button>

        <div className="flex gap-0">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-5 md:h-6 flex items-center justify-center text-xs border border-[#BEBEBE] transition-colors duration-100 ${
                recordingState === "recording" &&
                currentRecordBeat === i
                  ? "bg-brand text-brand-foreground"
                  : "bg-[#D0D0D0] text-[#131313]"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Piano keyboard */}
      <div className="flex-1 relative">
        {/* White keys */}
        <div className="flex h-full gap-0">
          {whiteKeys.map((key, index) => {
            const isPressed =
              pressedNotes.has(key.fullNote) ||
              pressedKeys.has(key.fullNote);

            return (
              <button
                key={`white-${key.fullNote}-${index}`}
                onClick={(e) => e.preventDefault()}
                onPointerDown={(e) =>
                  onKeyPointerDown(key.fullNote, e)
                }
                onPointerUp={(e) =>
                  onKeyPointerUp(key.fullNote, e)
                }
                onPointerCancel={() =>
                  onKeyPointerCancelOrLeave(key.fullNote)
                }
                onPointerLeave={() =>
                  onKeyPointerCancelOrLeave(key.fullNote)
                }
                className={`flex-1 border border-[#BEBEBE] transition-all duration-150 ease-out
                  select-none touch-manipulation relative z-10
                  ${
                    isPressed
                      ? "bg-brand text-brand-foreground scale-97 shadow-inner"
                      : "bg-[#D0D0D0] text-[#131313] hover:bg-[#B8B8B8] active:scale-97"
                  } 
                  flex flex-col items-center justify-end pb-2 gap-1`}
                style={{ touchAction: "none" }}
              >
                {key.note === "C" && (
                  <div className="text-xs font-medium">
                    {key.note}
                    {key.octave}
                  </div>
                )}
                <div className="text-xs opacity-60">
                  {
                    [
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
                    ][index]
                  }
                </div>
              </button>
            );
          })}
        </div>

        {/* Black keys */}
        <div className="absolute top-0 left-0 right-0 h-3/5 flex z-20">
          {blackKeys.map((blackKey, blackIndex) => {
            const isPressed =
              pressedNotes.has(blackKey.fullNote) ||
              pressedKeys.has(blackKey.fullNote);
            const leftPosition = `calc(${(blackKey.position + 0.7) * 10}% - 0px)`;

            return (
              <button
                key={`black-${blackKey.fullNote}`}
                onClick={(e) => e.preventDefault()}
                onPointerDown={(e) =>
                  onKeyPointerDown(blackKey.fullNote, e)
                }
                onPointerUp={(e) =>
                  onKeyPointerUp(blackKey.fullNote, e)
                }
                onPointerCancel={() =>
                  onKeyPointerCancelOrLeave(blackKey.fullNote)
                }
                onPointerLeave={() =>
                  onKeyPointerCancelOrLeave(blackKey.fullNote)
                }
                className={`w-6 h-full border border-[#BEBEBE] transition-all duration-150 ease-out
                  select-none touch-manipulation absolute z-30
                  ${
                    isPressed
                      ? "bg-brand text-brand-foreground scale-97 shadow-inner"
                      : "bg-[#131313] text-[#D0D0D0] hover:bg-[#333333] active:scale-97"
                  } 
                  flex flex-col items-center justify-end pb-1 gap-0.5`}
                style={{
                  touchAction: "none",
                  left: leftPosition,
                }}
              >
                <div className="text-xs opacity-60">
                  {
                    ["2", "3", "5", "6", "7", "9", "0"][
                      blackIndex
                    ]
                  }
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}