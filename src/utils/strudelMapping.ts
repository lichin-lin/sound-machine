import {
  TrackData,
  DrumTheme,
  DrumSound,
  PianoNote,
} from "../components/TrackContext";

// Drum sound mapping for Strudel
const drumSoundMapping: Record<DrumSound, string> = {
  bd: "bd", // bass drum
  sd: "sd", // snare drum
  rim: "rim", // rimshot
  hh: "hh", // hi-hat
  oh: "oh", // open hi-hat
  cp: "cp", // clap
  lt: "lt", // low tom
  mt: "mt", // mid tom
  ht: "ht", // high tom
  rd: "rd", // ride
  cr: "cr", // crash
};

// Convert drum theme to bank name for Strudel
const getDrumBankName = (theme: DrumTheme): string | null => {
  switch (theme) {
    case "RolandTR909":
      return "RolandTR909";
    case "RolandTR808":
      return "RolandTR808";
    case "RolandTR707":
      return "RolandTR707";
    case "AkaiLinn":
      return "AkaiLinn";
    case "RhythmAce":
      return "RhythmAce";
    case "ViscoSpaceDrum":
      return "ViscoSpaceDrum";
    case null:
    default:
      return null; // No bank specified, uses default
  }
};

// Convert drum pattern to Strudel pattern string
const convertDrumPatternToStrudel = (
  pattern: DrumSound[][],
): string => {
  // Create a pattern string with 16 beats
  const patternArray: string[] = [];

  for (let beat = 0; beat < 16; beat++) {
    const sounds = pattern[beat] || [];
    if (sounds.length === 0) {
      patternArray.push("~"); // Rest
    } else if (sounds.length === 1) {
      patternArray.push(drumSoundMapping[sounds[0]]);
    } else {
      // Multiple sounds on same beat - create a chord-like notation with commas
      const soundStr = sounds
        .map((s) => drumSoundMapping[s])
        .join(",");
      patternArray.push(`[${soundStr}]`);
    }
  }

  return `"${patternArray.join(" ")}"`;
};

// Generate Strudel code for a single drum track
const generateDrumTrackCode = (
  trackData: TrackData,
  trackIndex: number,
): string => {
  if (trackData.type !== "drum") return "";

  const patternStr = convertDrumPatternToStrudel(
    trackData.pattern,
  );
  const bankName = getDrumBankName(trackData.theme);
  const volume = trackData.volume ?? 1; // Default to 1 if undefined
  const room = trackData.room ?? 0.5; // Default to 0.5 if undefined
  const pitch = trackData.pitch ?? 0; // Default to 0 if undefined

  let code = `$: s(${patternStr})`;

  // Only add .bank() if a specific theme is selected (not Standard/null)
  if (bankName !== null) {
    code += `.bank("${bankName}")`;
  }

  // Add .room() for room effect (0-1 range)
  if (room > 0) {
    code += `.room(${room.toFixed(2)})`;
  }

  // Add .transpose() for pitch adjustment (-12 to +12 range)
  if (pitch !== 0) {
    code += `.transpose(${pitch})`;
  }

  // Add .gain() for volume control (0-1 range)
  code += `.gain(${volume.toFixed(2)})`;

  return code;
};

// Convert PianoNote[] to 16-beat chord pattern array
const convertPianoNotesToPattern = (
  notes: PianoNote[],
): string[][] => {
  // Initialize 16 empty beats
  const pattern: string[][] = Array.from(
    { length: 16 },
    () => [],
  );

  // Group notes by position
  notes.forEach((pianoNote) => {
    if (pianoNote.position >= 0 && pianoNote.position < 16) {
      // Handle both single notes and chord arrays
      if (Array.isArray(pianoNote.note)) {
        // Chord array - add all notes to this position
        pattern[pianoNote.position].push(...pianoNote.note);
      } else {
        // Single note - add to this position
        pattern[pianoNote.position].push(pianoNote.note);
      }
    }
  });

  return pattern;
};

// Generate Strudel code for a single piano track
const generatePianoTrackCode = (
  trackData: TrackData,
  trackIndex: number,
): string => {
  if (trackData.type !== "piano") return "";
  const volume = trackData.volume ?? 1; // Default to 1 if undefined
  const octave = trackData.baseOctave ?? 4; // Default to octave 4 if undefined
  const sound = trackData.theme;

  // Convert notes to 16-beat pattern
  const chordPattern = convertPianoNotesToPattern(
    trackData.notes,
  );
  // Build Strudel pattern string
  console.log("chordPattern - ", chordPattern);
  const patternStr = chordPattern
    .map((beat) => {
      if (beat.length === 0) return "~"; // Rest
      if (beat.length === 1) return `${beat[0].toLowerCase()}`; // Single note
      return `[${beat.map((note) => note.toLowerCase()).join(", ")}]`; // Chord
    })
    .join(" ");

  let code = `$: note("${patternStr}")`;

  // Add .sound() with the selected theme
  code += `.sound("${sound}")`;
  
  // Add transpose for specific themes/sounds for VIOLET TIDES preset
  if (sound === "psaltery_pluck") {
    code += `.transpose(12)`;
  } else if (sound === "piano") {
    code += `.transpose(24)`;
  }
  
  // Always add gain for consistency
  code += `.gain(${volume.toFixed(2)})`;

  return code;
};

// Main function to convert global context to Strudel code
export const generateStrudelCode = (
  tempo: number,
  tracks: {
    id: string;
    active: boolean;
    volume: number;
    data: TrackData;
  }[],
  hydraCode?: string,
): string => {
  const lines: string[] = [];

  // Add Hydra code at the beginning if provided
  if (hydraCode && hydraCode.trim()) {
    lines.push("// Hydra Visual");
    lines.push(hydraCode.trim());
    lines.push(""); // Empty line separator
  }

  // Set tempo (cycles per minute) - divide by 4
  lines.push(`setcpm(${tempo}/4)`);
  lines.push(""); // Empty line separator

  // Generate code for all 4 tracks (not just active ones)
  let hasAnyContent = false;

  tracks.forEach((track, index) => {
    let trackCode = "";
    // Merge volume from track level into track.data for processing
    const trackDataWithVolume = {
      ...track.data,
      volume: track.volume ?? track.data.volume ?? 1,
    };

    if (trackDataWithVolume.type === "drum") {
      trackCode = generateDrumTrackCode(
        trackDataWithVolume,
        index,
      );
      // Check if drum track has any active patterns
      if (
        trackDataWithVolume.pattern &&
        hasActiveDrumPattern(trackDataWithVolume.pattern)
      ) {
        hasAnyContent = true;
      }
    } else if (trackDataWithVolume.type === "piano") {
      trackCode = generatePianoTrackCode(
        trackDataWithVolume,
        index,
      );
      // Check if piano track has recorded notes
      if (
        trackDataWithVolume.notes &&
        trackDataWithVolume.notes.length > 0
      ) {
        hasAnyContent = true;
      }
    }

    if (trackCode) {
      const trackNumber = index + 1;
      const activeIndicator = track.active ? " [SELECTED]" : "";
      lines.push(
        `// Track ${trackNumber} (${trackDataWithVolume.type})${activeIndicator}`,
      );
      lines.push(trackCode);
      lines.push(""); // Empty line separator
    }
  });

  if (!hasAnyContent) {
    lines.push("// No tracks with content");
  }

  return lines.join("\n").trim();
};

// Helper function to check if pattern has any active beats
export const hasActiveDrumPattern = (
  pattern: DrumSound[][],
): boolean => {
  return pattern.some((beat) => beat && beat.length > 0);
};