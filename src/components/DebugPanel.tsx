import { useTrackContext } from "./TrackContext";

export function DebugPanel() {
  const { tracks, activeTrack, isPlaying, tempo } = useTrackContext();

  const debugData = {
    activeTrack,
    isPlaying,
    tempo: tempo[0],
    tracks: tracks.map(track => ({
      id: track.id,
      active: track.active,
      volume: track.volume,
      type: track.data.type,
      data: track.data.type === "drum" ? 
        { pattern: track.data.pattern } : 
        { notes: track.data.notes }
    }))
  };

  return (
    <div className="w-full max-w-md h-[400px] bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto">
      <h3 className="text-white mb-2">Debug - Track Data</h3>
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(debugData, null, 2)}
      </pre>
    </div>
  );
}