import * as Tone from "tone";
import { PianoTheme } from "../components/TrackContext";

class AudioSystem {
  private synths: Map<PianoTheme, Tone.PolySynth> = new Map();
  private currentTheme: PianoTheme = "piano";
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Tone.js audio context
      await Tone.start();

      // Create different synthesizers for each piano theme
      this.createSynth("piano", {
        // This will be handled specially in createSynth method for realistic piano sound
      });

      this.createSynth("gm_epiano1", {
        oscillator: { type: "square" },
        envelope: {
          attack: 0.005,
          decay: 0.2,
          sustain: 0.2,
          release: 0.8,
        },
      });

      this.createSynth("gm_epiano2", {
        oscillator: { type: "sawtooth" },
        envelope: {
          attack: 0.01,
          decay: 0.3,
          sustain: 0.1,
          release: 0.5,
        },
      });

      this.createSynth("gm_xylophone", {
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.001,
          decay: 0.1,
          sustain: 0.05,
          release: 0.3,
        },
      });

      // Set master volume
      Tone.getDestination().volume.rampTo(-10, 0.1);

      this.isInitialized = true;
    } catch (error) {
      console.error(
        "Failed to initialize audio system:",
        error,
      );
    }
  }

  private createSynth(theme: PianoTheme, options: any) {
    let synth;
    
    if (theme === "piano") {
      // Create a more realistic piano using FMSynth with multiple harmonics
      synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 1.2,
        modulationIndex: 2.5,
        detune: 0,
        oscillator: {
          type: "sine"
        },
        envelope: {
          attack: 0.005,
          decay: 0.3,
          sustain: 0.1,
          release: 1.2,
          attackCurve: "exponential"
        },
        modulation: {
          type: "square"
        },
        modulationEnvelope: {
          attack: 0.002,
          decay: 0.2,
          sustain: 0,
          release: 0.2
        }
      });
      
      // Add reverb for more realistic space
      const reverb = new Tone.Reverb({
        decay: 2.5,
        wet: 0.3,
        preDelay: 0.01
      });
      
      // Add slight filtering to soften harsh frequencies  
      const filter = new Tone.Filter({
        frequency: 8000,
        type: "lowpass",
        rolloff: -12
      });
      
      // Chain the effects
      synth.chain(filter, reverb, Tone.getDestination());
      
    } else {
      // Use regular synth for other themes
      synth = new Tone.PolySynth(Tone.Synth, options).toDestination();
    }
    
    this.synths.set(theme, synth);
  }

  async playNote(
    note: string,
    duration = "8n",
    theme?: PianoTheme,
  ) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const selectedTheme = theme || this.currentTheme;
    const synth = this.synths.get(selectedTheme);

    if (synth) {
      try {
        // Ensure audio context is started (requires user interaction)
        if (Tone.getContext().state !== "running") {
          await Tone.start();
        }
        synth.triggerAttackRelease(note, duration);
      } catch (error) {
        console.error("Failed to play note:", note, error);
      }
    }
  }

  setTheme(theme: PianoTheme) {
    this.currentTheme = theme;
  }

  async playMetronome(bpm: number) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Create a simple click sound for metronome
      const clickSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: {
          type: "sine",
        },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 1.4,
          attackCurve: "exponential",
        },
      }).toDestination();

      clickSynth.triggerAttackRelease("C2", "32n");

      // Clean up after use
      setTimeout(() => {
        clickSynth.dispose();
      }, 1000);
    } catch (error) {
      console.error("Failed to play metronome click:", error);
    }
  }

  async playCountdownClick(countdownValue: number) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Ensure audio context is running
      if (Tone.getContext().state !== "running") {
        await Tone.start();
      }

      // Create a distinctive countdown click sound
      const clickSynth = new Tone.Synth({
        oscillator: {
          type: "square",
        },
        envelope: {
          attack: 0.001,
          decay: 0.1,
          sustain: 0.2,
          release: 0.2,
        },
      }).toDestination();

      // Different pitch for each countdown number (higher pitch = closer to recording)
      const pitches = {
        4: "G4",  // Lowest pitch for "4"
        3: "A4",  // Medium-low pitch for "3" 
        2: "B4",  // Medium-high pitch for "2"
        1: "C5",  // Highest pitch for "1" (ready to record!)
      };

      const pitch = pitches[countdownValue as keyof typeof pitches] || "G4";
      
      // Play the countdown click
      clickSynth.triggerAttackRelease(pitch, "16n");

      // Clean up after use
      setTimeout(() => {
        clickSynth.dispose();
      }, 500);
    } catch (error) {
      console.error("Failed to play countdown click:", error);
    }
  }

  setVolume(volume: number) {
    if (this.isInitialized) {
      // Convert 0-100 range to decibels (-60 to 0)
      const dbValue =
        volume === 0 ? -60 : (volume / 100) * 60 - 60;
      Tone.getDestination().volume.rampTo(dbValue, 0.1);
    }
  }

  dispose() {
    this.synths.forEach((synth) => {
      // Dispose of the synth and any connected effects
      synth.dispose();
    });
    this.synths.clear();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const audioSystem = new AudioSystem();