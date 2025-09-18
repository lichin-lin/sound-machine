import React from "react";
import { useTrackContext, DrumSound } from "./TrackContext";

export function GlobalContextVisualization() {
  const { tracks, tempo, isPlaying, activeTrack } = useTrackContext();

  const formatDrumPattern = (pattern: DrumSound[][]) => {
    const activeBeatCount = pattern.filter(beat => beat.length > 0).length;
    const totalSounds = pattern.reduce((total, beat) => total + beat.length, 0);
    return `${activeBeatCount}/16 beats, ${totalSounds} sounds`;
  };

  const formatPianoNotes = (notes: Array<{note: string, position: number}>) => {
    return `${notes.length} notes recorded`;
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 text-xs overflow-auto">
      {/* Playback Status */}
      <div className="flex items-center gap-2">
        <span className="text-[#B8B8B8]">STATUS:</span>
        <span className={isPlaying ? "text-[#131313]" : "text-[#B8B8B8]"}>
          {isPlaying ? "PLAYING" : "STOPPED"}
        </span>
      </div>

      {/* Tempo */}
      <div className="flex items-center gap-2">
        <span className="text-[#B8B8B8]">TEMPO:</span>
        <span>{tempo[0]} BPM</span>
      </div>

      {/* Active Track */}
      <div className="flex items-center gap-2">
        <span className="text-[#B8B8B8]">ACTIVE:</span>
        <span>T{activeTrack + 1} ({tracks[activeTrack]?.data.type.toUpperCase()})</span>
      </div>

      {/* Track Details */}
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-[#B8B8B8]">TRACK DATA:</span>
        <div className="flex flex-col gap-2">
          {tracks.map((track, index) => (
            <div key={track.id} className="flex flex-col gap-1 border-b border-[#BEBEBE] pb-1">
              <div className="flex items-center gap-2">
                <span className={`w-6 text-center ${track.active ? 'text-[#131313]' : 'text-[#B8B8B8]'}`}>
                  T{index + 1}
                </span>
                <span className="text-[#B8B8B8]">
                  {track.data.type.toUpperCase()}
                </span>
                <span className="text-[#B8B8B8]">
                  Vol: {Math.round(track.volume * 100)}%
                </span>
              </div>
              <div className="text-[#B8B8B8] ml-8 text-[10px]">
                {track.data.type === "drum" 
                  ? formatDrumPattern(track.data.pattern)
                  : formatPianoNotes(track.data.notes)
                }
              </div>
              {track.data.type === "drum" && track.active && (
                <div className="ml-8 text-[10px] max-h-16 overflow-auto">
                  <div className="text-[#B8B8B8]">Pattern:</div>
                  {track.data.pattern.map((beat, beatIndex) => (
                    beat.length > 0 && (
                      <div key={beatIndex} className="text-[#B8B8B8]">
                        Beat {beatIndex + 1}: {beat.join(", ")}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}