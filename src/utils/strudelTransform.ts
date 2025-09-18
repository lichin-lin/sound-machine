import {
  Track,
  DrumSound,
  PianoNote,
  HydraBackground,
} from "../components/TrackContext";

function convertPianoNotesToPattern(
  notes: PianoNote[],
): string[] {
  // Create array to group notes by position
  const notesByPosition: { [key: number]: string[] } = {};

  // Group notes by their positions
  notes.forEach((note) => {
    if (note.position >= 0 && note.position < 16) {
      if (!notesByPosition[note.position]) {
        notesByPosition[note.position] = [];
      }
      notesByPosition[note.position].push(note.note);
    }
  });

  // Create 16-position pattern
  const pattern: string[] = Array(16).fill("-");

  // Fill positions with notes or chords
  Object.entries(notesByPosition).forEach(
    ([position, notesList]) => {
      const pos = parseInt(position);
      if (notesList.length === 1) {
        // Single note
        pattern[pos] = notesList[0];
      } else if (notesList.length > 1) {
        // Multiple notes - create chord notation [note1,note2,note3]
        pattern[pos] = `[${notesList.join(",")}]`;
      }
    },
  );

  return pattern;
}

export function transformToStrudel(
  tracks: Track[],
  tempo: number,
  hydraBackground?: HydraBackground,
): string {
  const lines: string[] = [];

  // Add hydra background code at the beginning if selected
  if (hydraBackground === "spring") {
    lines.push(`await initHydra()`);
    lines.push(``);
    lines.push(`osc(10, 0, 0.02)`);
    lines.push(`\t.rotate(0, 0.1)`);
    lines.push(
      `\t.mult(osc(10, 0.01).modulate(osc(10).rotate(0, -0.1), 1))`,
    );
    lines.push(`\t.color(2,0.91,0.39)`);
    lines.push(`  .out(o0)`);
    lines.push(``);
  } else if (hydraBackground === "earth") {
    lines.push(`await initHydra()`);
    lines.push(`osc(5, -0.126, 0.514).out()`);
    lines.push(``);
  }

  // Add tempo setting
  lines.push(`setcpm(${tempo}/4)`);

  // Convert each track to Strudel format
  tracks.forEach((track, index) => {
    if (track.data.type === "drum") {
      // Convert 16-beat pattern to string with spaces between beats
      const patternString = track.data.pattern
        .map((sound: DrumSound) => sound || "-")
        .join(" ");

      // Build track line with dollar sign prefix
      // `"` double quote is important and must used to wrap up the bits
      let trackLine = `$: s("${patternString}")`;

      // Append bank modifier if theme is selected
      if (track.data.theme) {
        trackLine += `.bank("${track.data.theme}")`;
      }

      // Append attack parameter for volume control
      trackLine += `.attack("${track.volume}")`;

      lines.push(trackLine);
    } else if (track.data.type === "piano") {
      // Convert piano notes to 16-position pattern
      const pianoPattern = convertPianoNotesToPattern(
        track.data.notes,
      );
      console.log(pianoPattern);
      const patternString = pianoPattern.join(" ");

      // Build piano track line with note() and .sound() using the selected theme
      let trackLine = `$: note("${patternString}").sound("${track.data.theme}")`;

      // Append attack parameter for volume control
      trackLine += `.attack("${track.volume}")`;

      lines.push(trackLine);
    }
  });

  return lines.join("\n");
}