import React from "react";
import { DrumSound, useTrackContext } from "./TrackContext";

interface DrumSoundDisplay {
  key: DrumSound;
  display: string;
}

interface DrumBeatGridProps {
  currentBeat?: number;
}

export function DrumBeatGrid({
  currentBeat = -1,
}: DrumBeatGridProps) {
  const { tracks, activeTrack, toggleDrumBeat } =
    useTrackContext();

  const drumSounds: DrumSoundDisplay[] = [
    { key: "bd", display: "BASS" },
    { key: "sd", display: "SNARE" },
    { key: "rim", display: "RIMSHOT" },
    { key: "hh", display: "HIHAT" },
    { key: "oh", display: "OPENHAT" },
    { key: "cp", display: "CLAP" },
    { key: "lt", display: "LOW TOM" },
    { key: "mt", display: "MID TOM" },
    { key: "ht", display: "HIGH TOM" },
    { key: "rd", display: "RIDE" },
    { key: "cr", display: "CRASH" },
  ];

  const currentTrack = tracks[activeTrack];

  const isActiveBeat = (rowIndex: number, colIndex: number) => {
    if (currentTrack?.data.type !== "drum") return false;
    const pattern = currentTrack.data.pattern[colIndex] || [];
    return pattern.includes(drumSounds[rowIndex].key);
  };

  const getDrumSoundColor = (drumSound: DrumSound): string => {
    switch (drumSound) {
      case "bd": // bass
      case "sd": // snare
      case "rim": // rimshot
        return "#035D88";
      case "hh": // hihat
      case "oh": // openhat
      case "cp": // clap
        return "#186036";
      case "lt": // low tom
      case "mt": // mid tom
      case "ht": // high tom
        return "#E7B00B";
      case "rd": // ride
      case "cr": // crash
        return "#E0012A";
      default:
        return "#131313";
    }
  };

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const isCurrentBeat = currentBeat === colIndex;
    const isBeatActive = isActiveBeat(rowIndex, colIndex);

    if (isCurrentBeat && isBeatActive) {
      // We are not sure, so comment out first - Current beat + active drum sound: use brand color for highlight
      // return { backgroundColor: "#FD4D2A" };
      // Active drum sound but not current beat: use drum color
      const color = getDrumSoundColor(drumSounds[rowIndex].key);
      return { backgroundColor: color };
    } else if (isCurrentBeat) {
      // Current beat but no drum sound: subtle brand color highlight
      return { backgroundColor: "rgba(253, 77, 42, 0.2)" };
    } else if (isBeatActive) {
      // Active drum sound but not current beat: use drum color
      const color = getDrumSoundColor(drumSounds[rowIndex].key);
      return { backgroundColor: color };
    }
    return {};
  };

  const handleBeatClick = (
    rowIndex: number,
    colIndex: number,
  ) => {
    toggleDrumBeat(activeTrack, colIndex, rowIndex);
  };

  return (
    <div className="w-full h-full flex flex-col gap-0">
      {/* Header with beat numbers */}
      <div className="flex gap-0 mb-2">
        <div className="w-14 md:w-16 flex items-center justify-center text-xs">
          SOUND
        </div>
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-5 md:h-6 flex items-center justify-center text-xs border border-[#BEBEBE] transition-colors duration-100 ${
              currentBeat === i
                ? "bg-[#D0D0D0]"
                : "bg-[#D0D0D0]"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Beat grid */}
      {drumSounds.map((sound, rowIndex) => (
        <div key={sound.key} className="flex gap-0">
          <div className="w-14 md:w-16 h-5 md:h-6 flex items-center justify-center text-[10px] md:text-xs bg-[#B8B8B8] border border-[#BEBEBE]">
            {sound.display}
          </div>
          {Array.from({ length: 16 }, (_, colIndex) => (
            <button
              key={colIndex}
              onClick={() =>
                handleBeatClick(rowIndex, colIndex)
              }
              style={getCellStyle(rowIndex, colIndex)}
              className={`flex-1 h-5 md:h-6 border border-[#BEBEBE] transition-colors duration-100 ${
                isActiveBeat(rowIndex, colIndex) ||
                currentBeat === colIndex
                  ? ""
                  : "bg-[#D0D0D0] hover:bg-[#B8B8B8]"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}