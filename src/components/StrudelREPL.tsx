import React, { useEffect, useRef, useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "strudel-editor": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { code?: string };
    }
  }
}

const loadStrudelOnce = (version = "1.2.3") =>
  new Promise<void>((resolve, reject) => {
    const src = `https://unpkg.com/@strudel/repl@${version}`;
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      if ((existing as any).dataset.loaded === "true")
        return resolve();
      existing.addEventListener("load", () => resolve(), {
        once: true,
      });
      existing.addEventListener("error", reject, {
        once: true,
      });
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.addEventListener("load", () => {
      (s as any).dataset.loaded = "true";
      resolve();
    });
    s.addEventListener("error", reject);
    document.head.appendChild(s);
  });

type Props = {
  /** One-time initial code. Ignored if `value` (controlled) is provided. */
  initialCode?: string;
  /** Controlled code value. If provided, editor mirrors this. */
  value?: string;
  /** Called whenever user edits in the REPL. */
  onChange?: (code: string) => void;
  /** Called when the REPL editor is ready (passes underlying StrudelMirror). */
  onReady?: (editor: any) => void;
  /** Called when play/pause state changes. */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Editor height. */
  height?: number | string;
  /** @strudel/repl version to load from unpkg. */
  version?: string;
  /** Optional: start playing immediately after Evaluate/Play (defaults true). */
  autoStartOnPlay?: boolean;
  /** Global play control ref */
  playControlRef?: React.MutableRefObject<(() => void) | null>;
  /** Global pause control ref */
  pauseControlRef?: React.MutableRefObject<(() => void) | null>;
  /** Hide internal play/pause buttons */
  hideControls?: boolean;
  /** Global playing state - only evaluate when true */
  isPlaying?: boolean;
  className?: string;
};

export default function StrudelREPL({
  initialCode = `setcps(1)
n("<0 1 2 3 4>*8").scale('G4 minor')
.s("gm_lead_6_voice")
.clip(sine.range(.2,.8).slow(8))
.jux(rev)
.room(1.2)
.lpf(perlin.range(400,12000).slow(4))`,
  value,
  onChange,
  onReady,
  onPlayStateChange,
  height = 320,
  version = "1.2.3",
  autoStartOnPlay = true,
  playControlRef,
  pauseControlRef,
  hideControls = false,
  isPlaying = false,
  className,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<any>(null); // <strudel-editor>
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  // mount <strudel-editor>
  useEffect(() => {
    let mounted = true;

    (async () => {
      await loadStrudelOnce(version);
      if (!mounted || !hostRef.current) return;

      const el = document.createElement("strudel-editor");
      const startCode = value ?? initialCode;
      el.setAttribute("code", startCode);
      el.style.display = "block";
      el.style.height =
        typeof height === "number"
          ? `${height}px`
          : String(height);
      hostRef.current.appendChild(el);
      elRef.current = el;

      // wait until REPL injects its editor
      let tries = 0;
      const poll = setInterval(() => {
        const ed = (el as any).editor;
        if (ed) {
          clearInterval(poll);

          // user edits → notify parent (and allow local consumers)
          ed.on?.("change", () => {
            const val =
              ed.getValue?.() ??
              ed.state?.doc?.toString?.() ??
              "";
            if (typeof val === "string") onChange?.(val);
          });

          onReady?.(ed);
          setReady(true);

          // Expose play/pause controls to external refs
          if (playControlRef) {
            playControlRef.current = async () => {
              await ed.evaluate?.();
              if (autoStartOnPlay) ed.start?.();
              setPlaying(true);
              onPlayStateChange?.(true);
            };
          }

          if (pauseControlRef) {
            pauseControlRef.current = () => {
              ed?.stop?.();
              setPlaying(false);
              onPlayStateChange?.(false);
            };
          }
        } else if (++tries > 80) {
          clearInterval(poll);
          setReady(true);
        }
      }, 100);
    })();

    return () => {
      mounted = false;
      if (elRef.current?.remove) elRef.current.remove();
      elRef.current = null;
    };
  }, [height, initialCode, version]); // value is handled separately below

  // Controlled mode: push external `value` into editor whenever it changes
  useEffect(() => {
    if (value == null) return; // uncontrolled
    const ed = elRef.current?.editor;
    if (!ed) return;
    try {
      const current = ed.getValue?.();
      if (current !== value) {
        ed.setCode?.(value);
        // Only auto-evaluate when playing (global state is active)
        if (isPlaying) {
          setTimeout(() => {
            ed.evaluate?.();
          }, 100); // Small delay to ensure code is set
        }
      }
    } catch {}
  }, [value, isPlaying]);

  // Controls
  const evaluate = async () => {
    const ed = elRef.current?.editor;
    if (!ed) return;
    await ed.evaluate?.();
  };

  const play = async () => {
    const ed = elRef.current?.editor;
    if (!ed) return;
    // ensure code is evaluated (fresh) then start transport
    await ed.evaluate?.();
    if (autoStartOnPlay) ed.start?.();
    setPlaying(true);
    onPlayStateChange?.(true);
  };

  const pause = () => {
    const ed = elRef.current?.editor;
    ed?.stop?.();
    setPlaying(false);
    onPlayStateChange?.(false);
  };

  return (
    <div className={`${className} w-full h-full flex flex-col`}>
      {!hideControls && (
        <div className="flex items-center gap-8 mb-2">
          <div className="flex items-center gap-6">
            {playing ? (
              <button
                onClick={pause}
                className="px-3 py-1 rounded border"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={play}
                className="px-3 py-1 rounded border"
              >
                Play
              </button>
            )}
          </div>
          {!ready && (
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              Loading REPL…
            </span>
          )}
        </div>
      )}

      {/* User edits directly in CodeMirror inside the web component */}
      <div
        className="flex flex-1 w-full [&>div]:w-full [&>div]:h-[100%] [&>div]:overflow-scroll"
        ref={hostRef}
      />
    </div>
  );
}