import { useTrackContext } from "./TrackContext";
import { transformToStrudel } from "../utils/strudelTransform";
import StrudelREPL from "./StrudelREPL";

export function StrudelDebugPanel() {
  const { tracks, tempo, hydraBackground } = useTrackContext();
  
  // Transform context data to Strudel format
  const strudelCode = transformToStrudel(tracks, tempo[0], hydraBackground);

  return (
    <div className="w-full max-w-md h-[400px] bg-gray-800 rounded-lg overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-white text-sm font-medium">Strudel REPL - Live Transform</h3>
        </div>
        <div className="flex-1 p-2">
          <StrudelREPL
            value={strudelCode}
            height="100%"
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}