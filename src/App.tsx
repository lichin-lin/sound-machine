import React, { useState, useEffect } from "react";
import {
  TrackProvider,
  useTrackContext,
  DrumTheme,
} from "./components/TrackContext";
import { generateStrudelCode } from "./utils/strudelMapping";
import { presets } from "./utils/presets";
import { BentoBox } from "./components/BentoBox";
import { BentoButton } from "./components/BentoButton";
import { BentoSlider } from "./components/BentoSlider";
import { BentoDropdown } from "./components/BentoDropdown";
import { DrumBeatGrid } from "./components/DrumBeatGrid";
import { PianoKeyboard } from "./components/PianoKeyboard";
import { GlobalContextVisualization } from "./components/GlobalContextVisualization";
import StrudelREPL from "./components/StrudelREPL";

function AppContent() {
  const trackContext = useTrackContext();
  const {
    tracks,
    tempo,
    setTempo,
    isPlaying,
    setIsPlaying,
    handleTrackSelect,
    updateTrackType,
    updateTrackVolume,
    activeTrack,
    updateDrumTheme,
    updateDrumRoom,
    updateDrumPitch,
    updatePianoTheme,
    updatePianoBaseOctave,
    strudelPlayRef,
    strudelPauseRef,
    playStrudel,
    pauseStrudel,
    generateShareURL,
    loadPreset,
    hydraCode,
    setHydraCode,
  } = trackContext;

  // Removed debug logs - context simplified

  // Local state for demo purposes
  const [theme, setTheme] = useState("PIXEL MEADOW");
  const [strudelCode, setStrudelCode] = useState("");
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(
    new Set(),
  );
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [showShareURL, setShowShareURL] = useState(false);
  const [strudelMode, setStrudelMode] = useState(false);
  const [aboutMode, setAboutMode] = useState(false);

  // Load first preset on initial load
  useEffect(() => {
    if (
      presets.length > 0 &&
      tracks.length === 4 &&
      tracks.every(
        (t) =>
          t.data.type === "drum" ||
          (t.data.type === "piano" &&
            t.data.notes.length === 0),
      )
    ) {
      // Only load default preset if we have the default empty state
      loadPreset(presets[0]);
      setTheme(presets[0].name);
    }
  }, []); // Only run once on mount

  // Generate Strudel code from global context
  useEffect(() => {
    const generatedCode = generateStrudelCode(
      tempo[0],
      tracks,
      hydraCode,
    );
    setStrudelCode(generatedCode);
  }, [tempo, tracks, hydraCode]);

  // Beat timing and visual feedback
  useEffect(() => {
    let beatInterval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      // Calculate milliseconds per beat: 60,000ms / BPM
      const msPerBeat = 60000 / tempo[0];

      // Since 16 cells = 4 beats (thirty-second notes), we need 4x faster intervals
      const msPerThirtySecondNote = msPerBeat / 4;

      // Start from beat 0
      setCurrentBeat(0);

      beatInterval = setInterval(() => {
        setCurrentBeat((prevBeat) => {
          // Loop from 0-15 (16 thirty-second notes = 4 beats total)
          return (prevBeat + 1) % 16;
        });
      }, msPerThirtySecondNote);
    } else {
      // When paused, reset to -1 (no active beat)
      setCurrentBeat(-1);
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (beatInterval) {
        clearInterval(beatInterval);
      }
    };
  }, [isPlaying, tempo]);

  const currentTrack = tracks[activeTrack];
  const isActiveTrackDrum = currentTrack?.data.type === "drum";

  // Helper functions for current track values
  const getCurrentDrumTheme = (): string => {
    if (currentTrack?.data.type === "drum") {
      const theme = currentTrack.data.theme;
      const themeOption = drumThemeOptions.find(
        (opt) => opt.value === theme,
      );
      return themeOption?.display || "STANDARD";
    }
    return "STANDARD";
  };

  const getCurrentPianoTheme = (): string => {
    if (currentTrack?.data.type === "piano") {
      const theme = currentTrack.data.theme;
      const themeOption = pianoSoundOptions.find(
        (opt) => opt.value === theme,
      );
      return themeOption?.display || "PIANO";
    }
    return pianoSoundOptions[0].display;
  };

  const getCurrentPianoOctave = (): string => {
    if (currentTrack?.data.type === "piano") {
      return `C${currentTrack.data.baseOctave}`;
    }
    return "C4";
  };

  const getCurrentDrumRoom = (): number => {
    if (currentTrack?.data.type === "drum") {
      return currentTrack.data.room;
    }
    return 0.5;
  };

  const getCurrentDrumPitch = (): number => {
    if (currentTrack?.data.type === "drum") {
      return currentTrack.data.pitch;
    }
    return 0;
  };

  const handleDrumThemeChange = (displayName: string) => {
    const themeOption = drumThemeOptions.find(
      (opt) => opt.display === displayName,
    );
    if (themeOption) {
      updateDrumTheme(activeTrack, themeOption.value);
    }
  };

  const handlePianoThemeChange = (displayName: string) => {
    const themeOption = pianoSoundOptions.find(
      (opt) => opt.display === displayName,
    );
    if (themeOption) {
      updatePianoTheme(activeTrack, themeOption.value);
    }
  };

  const handlePianoOctaveChange = (octaveStr: string) => {
    const octave = parseInt(octaveStr.replace("C", "")) as
      | 2
      | 3
      | 4
      | 5;
    updatePianoBaseOctave(activeTrack, octave);
  };

  const handlePresetChange = (presetName: string) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      loadPreset(preset);
      setTheme(presetName);
    }
  };

  // Drum theme options with display names
  const drumThemeOptions: {
    value: DrumTheme;
    display: string;
  }[] = [
    { value: null, display: "STANDARD" },
    { value: "RolandTR909", display: "ROLAND TR-909" },
    { value: "RolandTR808", display: "ROLAND TR-808" },
    { value: "RolandTR707", display: "ROLAND TR-707" },
    { value: "AkaiLinn", display: "AKAI LINN" },
    { value: "RhythmAce", display: "RHYTHM ACE" },
    { value: "ViscoSpaceDrum", display: "VISCO SPACE" },
  ];

  const pianoSoundOptions = [
    { value: "piano", display: "PIANO" },
    { value: "gm_cello", display: "CELLO" },
    { value: "psaltery_pluck", display: "PSALTERY" },
    { value: "kawai", display: "KAWAI" },
    { value: "botella", display: "BOTELLA LINN" },
    { value: "gm_xylophone", display: "XYLOPHONE" },
  ];
  const pianoOctaveOptions = ["C2", "C3", "C4", "C5"];

  const handleKeyPress = (note: string) => {
    // This is just for visual feedback - the PianoKeyboard handles its own state
    setPressedKeys((prev) => new Set([...prev, note]));
    // Remove after short visual feedback
    setTimeout(() => {
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 150);
  };

  return (
    <div className="bento-container p-4">
      <div className="bento-grid">
        {/* Row 1: Transport Controls */}
        {/* Play/Pause Control */}
        <BentoBox label="FG-8" gridArea="1 / 1 / 2 / 4">
          <BentoButton
            active={isPlaying}
            variant="brand"
            onClick={() =>
              isPlaying ? pauseStrudel() : playStrudel()
            }
            className="w-full"
          >
            {isPlaying ? "STOP" : "PLAY"}
          </BentoButton>
        </BentoBox>
        {/* Tempo Control */}
        <BentoBox
          label={`${tempo[0]} BPM`}
          gridArea="1 / 4 / 2 / 7"
        >
          <div className="flex items-center gap-2 w-full">
            <BentoSlider
              value={tempo}
              onValueChange={setTempo}
              min={60}
              max={144}
              step={1}
              className="flex-1"
            />
          </div>
        </BentoBox>
        {/* Preset Picker */}
        <BentoBox label="PRESET" gridArea="1 / 7 / 2 / 11">
          <BentoDropdown
            options={presets.map((preset) => preset.name)}
            value={theme}
            onValueChange={handlePresetChange}
            className="w-full"
          />
        </BentoBox>
        {/* Strudel button */}
        <BentoBox label="Strudel" gridArea="1 / 11 / 2 / 13">
          <BentoButton
            onClick={() => {
              setStrudelMode((prev) => !prev);
            }}
            variant={strudelMode ? "active" : "default"}
            className="w-full"
          >
            {`</>`}
          </BentoButton>
        </BentoBox>
        <>
          <BentoBox label="TRACKS" gridArea="2 / 1 / 3 / 7">
            <div className="flex gap-1 w-full">
              {tracks.map((track, index) => (
                <BentoButton
                  key={track.id}
                  active={track.active}
                  onClick={() => handleTrackSelect(index)}
                  className="flex-1"
                >
                  T{index + 1}
                </BentoButton>
              ))}
            </div>
          </BentoBox>

          <BentoBox label="TYPE" gridArea="2 / 7 / 3 / 13">
            <div className="flex gap-1 w-full">
              <BentoButton
                active={isActiveTrackDrum}
                variant={
                  isActiveTrackDrum ? "active" : "default"
                }
                className="flex-1"
                onClick={() =>
                  updateTrackType(activeTrack, "drum")
                }
              >
                DRUM
              </BentoButton>
              <BentoButton
                active={!isActiveTrackDrum}
                variant={
                  !isActiveTrackDrum ? "active" : "default"
                }
                className="flex-1"
                onClick={() =>
                  updateTrackType(activeTrack, "piano")
                }
              >
                SOUND
              </BentoButton>
            </div>
          </BentoBox>

          <BentoBox label={"TYPE"} gridArea="3 / 1 / 4 / 5">
            <BentoDropdown
              options={
                isActiveTrackDrum
                  ? drumThemeOptions.map((opt) => opt.display)
                  : pianoSoundOptions.map((opt) => opt.display)
              }
              value={
                isActiveTrackDrum
                  ? getCurrentDrumTheme()
                  : getCurrentPianoTheme()
              }
              onValueChange={
                isActiveTrackDrum
                  ? handleDrumThemeChange
                  : handlePianoThemeChange
              }
            />
          </BentoBox>
          <BentoBox
            label={
              isActiveTrackDrum
                ? `ROOM: ${getCurrentDrumRoom().toFixed(2)}`
                : "OCTAVE"
            }
            gridArea="3 / 5 / 4 / 9"
          >
            {isActiveTrackDrum ? (
              <div className="flex items-center gap-2 w-full">
                <BentoSlider
                  value={[getCurrentDrumRoom() * 100]}
                  onValueChange={(value) =>
                    updateDrumRoom(activeTrack, value[0] / 100)
                  }
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            ) : (
              <BentoDropdown
                options={pianoOctaveOptions}
                value={getCurrentPianoOctave()}
                onValueChange={handlePianoOctaveChange}
              />
            )}
          </BentoBox>
          <BentoBox
            label={`VOLUME: ${Math.floor(currentTrack?.volume * 100)}`}
            gridArea="3 / 9 / 4 / 13"
          >
            <div className="flex items-center gap-2 w-full">
              <BentoSlider
                value={[currentTrack?.volume * 100 || 0]}
                onValueChange={(value) =>
                  updateTrackVolume(activeTrack, value[0] / 100)
                }
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </BentoBox>
          <BentoBox
            label={isActiveTrackDrum ? "BEAT PATTERN" : ""}
            gridArea="4 / 1 / 9 / 13"
          >
            {isActiveTrackDrum ? (
              <DrumBeatGrid currentBeat={currentBeat} />
            ) : (
              <PianoKeyboard
                onKeyPress={handleKeyPress}
                pressedKeys={pressedKeys}
              />
            )}
          </BentoBox>
        </>
        {/* Strudel */}
        <BentoBox
          className={`${strudelMode ? "block overflow-scroll z-200" : "absolute w-[1px] top-0 left-[100%] opacity-0"}`}
          gridArea="2 / 1 / 9 / 13"
        >
          <StrudelREPL
            value={strudelCode}
            onChange={() => {}} // Read-only for now, generated from context
            height="100%"
            className="w-full h-full"
            playControlRef={strudelPlayRef}
            pauseControlRef={strudelPauseRef}
            hideControls={true} // Use global transport controls instead
            isPlaying={isPlaying} // Only evaluate when global state is playing
          />
        </BentoBox>
        {/* about */}
        <BentoBox
          className={`${aboutMode ? "block z-200" : "absolute w-[1px] top-0 left-[100%] opacity-0"}`}
          gridArea="1 / 1 / 9 / 13"
        >
          <div className="tracking-normal w-[80%] flex flex-col gap-4 text-balance">
            <span>
              I like music, and I’m fascinated by beats. That’s
              why I built FG-8.
            </span>
            <span>
              I first discovered{" "}
              <a
                href="https://strudel.cc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Strudel.cc
              </a>{" "}
              through{" "}
              <a
                href="https://www.instagram.com/dj_dave____"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                DJ Dave’s videos
              </a>
              , the way she plays music is pure fun. I don’t
              know much about composition, but Strudel makes it
              easy to explore and enjoy.
            </span>
            <span>
              With FG-8, I added a simple UI inspired by{" "}
              <a
                href="https://teenage.engineering/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Teenage engineering
              </a>
              . You can build drum patterns, switch to piano
              view, and record a small melody. It’s minimal, but
              leaves space for imagination.
            </span>
            <span>
              I hope you enjoy this small toy and maybe get
              curious about Strudel, just like I did. Have a
              good day—and enjoy the jam :)
            </span>
            <span>
              Made with love by{" "}
              <a
                href="https://x.com/lichinlin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Lichin
              </a>{" "}
              and{" "}
              <a
                href="https://www.figma.com/make/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Figma Make
              </a>
            </span>
          </div>
        </BentoBox>
      </div>

      <div
        onClick={() => setAboutMode((prev) => !prev)}
        className="absolute text-sm bottom-2 left-[50%] translate-x-[-50%] cursor-pointer flex gap-1"
      >
        <span>{aboutMode ? "[Close]" : "[About FG-8]"}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TrackProvider>
      <AppContent />
    </TrackProvider>
  );
}