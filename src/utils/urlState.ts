import { TrackState } from "../components/TrackContext";

export interface SerializableState {
  tracks: TrackState[];
  tempo: number;
  activeTrack: number;
  hydraTheme: string;
  hydraCode: string;
}

// PAUSED: URL state functionality disabled to keep URLs clean

/**
 * Serialize the global state into a base64 encoded hash string
 * PAUSED: Currently disabled to keep URLs clean
 */
export function serializeState(state: SerializableState): string {
  // try {
  //   const jsonString = JSON.stringify(state);
  //   // Convert to base64 for URL-safe compact representation
  //   const encoded = btoa(jsonString);
  //   return encoded;
  // } catch (error) {
  //   console.error("Failed to serialize state:", error);
  //   return "";
  // }
  return ""; // Return empty string when paused
}

/**
 * Deserialize a base64 encoded hash string back to global state
 * PAUSED: Currently disabled to keep URLs clean
 */
export function deserializeState(hashString: string): SerializableState | null {
  // try {
  //   // Decode from base64
  //   const jsonString = atob(hashString);
  //   const state = JSON.parse(jsonString) as SerializableState;
  //   
  //   // Validate the structure
  //   if (
  //     state &&
  //     Array.isArray(state.tracks) &&
  //     state.tracks.length === 4 &&
  //     typeof state.tempo === "number" &&
  //     typeof state.activeTrack === "number" &&
  //     typeof state.hydraTheme === "string" &&
  //     typeof state.hydraCode === "string"
  //   ) {
  //     return state;
  //   }
  //   
  //   return null;
  // } catch (error) {
  //   console.error("Failed to deserialize state:", error);
  //   return null;
  // }
  return null; // Return null when paused
}

/**
 * Update the URL with the current state hash
 * PAUSED: Currently disabled to keep URLs clean
 */
export function updateURL(hashString: string): void {
  // if (typeof window !== "undefined") {
  //   const url = new URL(window.location.href);
  //   if (hashString) {
  //     url.searchParams.set("d", hashString);
  //   } else {
  //     url.searchParams.delete("d");
  //   }
  //   
  //   // Update URL without triggering a page reload
  //   window.history.replaceState({}, "", url.toString());
  // }
  // No-op when paused
}

/**
 * Get the state hash from the current URL
 * PAUSED: Currently disabled to keep URLs clean
 */
export function getStateFromURL(): SerializableState | null {
  // if (typeof window !== "undefined") {
  //   const url = new URL(window.location.href);
  //   const hashString = url.searchParams.get("d");
  //   
  //   if (hashString) {
  //     return deserializeState(hashString);
  //   }
  // }
  
  return null; // Return null when paused
}

/**
 * Generate a shareable URL for the current state
 * PAUSED: Currently disabled to keep URLs clean
 */
export function generateShareableURL(state: SerializableState): string {
  // const hashString = serializeState(state);
  // const url = new URL(window.location.origin + window.location.pathname);
  // url.searchParams.set("d", hashString);
  // return url.toString();
  
  // Return clean URL when paused
  if (typeof window !== "undefined") {
    return window.location.origin + window.location.pathname;
  }
  return "";
}