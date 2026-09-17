import { useState, useEffect, useRef } from "react";
import Box from "./components/Box";
import "./App.css";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const COLOR_SEQUENCE = [
  "#d9008f",
  "#00c9e8",
  "#d9008f",
  "#a9ff32",
  "#3375c8",
  "#3fd156",
  "#3375c8",
  "#f47c32",
  "#ffe928",
];

function App() {
  // ── Game state ──
  const [tileColors, setTileColors] = useState(() => shuffle(COLOR_SEQUENCE));
  const [correctSet, setCorrectSet] = useState(new Set());
  const [wrongIndex, setWrongIndex] = useState(-1);
  const [colorIndex, setColorIndex] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // 0 = idle | 1 = cascade flip face-down | 2 = flip face-up (reshuffled)
  const [shufflePhase, setShufflePhase] = useState(0);

  function triggerShuffleThenWin() {
    // Phase 1 — cascade flip all tiles face-down (staggered 80ms each)
    setShufflePhase(1);

    // Phase 2 — once all face-down (~1050ms), reshuffle colors & flip back up
    setTimeout(() => {
      setTileColors(shuffle(COLOR_SEQUENCE));
      setShufflePhase(2);
    }, 1050);

    // Phase 3 — after flip-up animation finishes, show win overlay
    setTimeout(() => {
      setShufflePhase(0);
      setIsWon(true);
    }, 1700);
  }

  // ── Custom cursor ──
  const dotRef      = useRef(null);
  const ringRef     = useRef(null);
  const enteredRef  = useRef(false); // has the cursor entered the page yet?

  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Half-sizes for centering (dot=8px, ring=34px)
      const dotT  = `translate(${x - 4}px, ${y - 4}px)`;
      const ringT = `translate(${x - 17}px, ${y - 17}px)`;

      if (!enteredRef.current) {
        // First entry — snap to position with no transition so the cursor
        // doesn't slide in from (0, 0) across the screen
        if (dotRef.current) {
          dotRef.current.style.transition  = "none";
          dotRef.current.style.transform   = dotT;
        }
        if (ringRef.current) {
          ringRef.current.style.transition = "none";
          ringRef.current.style.transform  = ringT;
        }
        // Next frame: fade in + re-enable the lag transition on the ring
        requestAnimationFrame(() => {
          if (dotRef.current) {
            dotRef.current.style.transition  = "opacity 0.2s";
            dotRef.current.style.opacity     = "1";
          }
          if (ringRef.current) {
            ringRef.current.style.transition =
              "transform 0.1s ease-out, border-color 0.35s ease, box-shadow 0.35s ease, scale 0.15s ease, opacity 0.2s";
            ringRef.current.style.opacity    = "1";
          }
          enteredRef.current = true;
        });
        return;
      }

      // Normal movement — dot is instant, ring lags via its CSS transition
      if (dotRef.current)  dotRef.current.style.transform  = dotT;
      if (ringRef.current) ringRef.current.style.transform = ringT;
    };

    // ── Click ripple / wave ──
    const spawnRipple = (e) => {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = e.clientX + "px";
      ripple.style.top  = e.clientY + "px";

      // Inherit the ring's current color so the wave matches the target color
      const color = ringRef.current?.style.borderColor || "#479985";
      ripple.style.borderColor = color;
      ripple.style.boxShadow   = `0 0 8px ${color}`;

      document.body.appendChild(ripple);
      // Self-clean once the CSS animation finishes
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", spawnRipple);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", spawnRipple);
    };
  }, []);

  // ── Game logic ──
  const isLocked = wrongIndex !== -1 || shufflePhase !== 0;

  // Ring color = next color to find, white during shuffle/win
  const ringColor =
    colorIndex < COLOR_SEQUENCE.length && shufflePhase === 0
      ? COLOR_SEQUENCE[colorIndex]
      : "#ffffff";

  function handleBoxClick(index) {
    if (isLocked) return;
    if (correctSet.has(index)) return;
    if (colorIndex >= COLOR_SEQUENCE.length) return;

    const clicked  = tileColors[index];
    const expected = COLOR_SEQUENCE[colorIndex];

    if (clicked === expected) {
      const newCorrect = new Set(correctSet);
      newCorrect.add(index);
      setCorrectSet(newCorrect);

      const next = colorIndex + 1;
      setColorIndex(next);

      if (next === COLOR_SEQUENCE.length) {
        // Kick off the cascade shuffle animation, then show win
        setTimeout(() => triggerShuffleThenWin(), 300);
      }
    } else {
      setWrongIndex(index);
      setTimeout(() => {
        setCorrectSet(new Set());
        setColorIndex(0);
        setWrongIndex(-1);
      }, 900);
    }
  }

  // Derive per-tile flip state from shufflePhase
  function getTileFlipped(index) {
    if (shufflePhase === 1) return false; // cascade back to face-down
    if (shufflePhase === 2) return true;  // all flip up at once (new colors)
    return correctSet.has(index) || wrongIndex === index;
  }

  // Cascade delay: only during phase 1 (stagger each tile by 80ms)
  function getTileDelay(index) {
    return shufflePhase === 1 ? index * 80 : 0;
  }

  function handleRestart() {
    setTileColors(shuffle(COLOR_SEQUENCE));
    setCorrectSet(new Set());
    setWrongIndex(-1);
    setColorIndex(0);
    setIsWon(false);
  }

  return (
    <>
      {/* ── Custom cursor ── */}
      <div className="cursor-dot" ref={dotRef} />
      <div
        className="cursor-ring"
        ref={ringRef}
        style={{ borderColor: ringColor, boxShadow: `0 0 8px ${ringColor}` }}
      />

      <main className="app">
        <div className="color-sequence">
          {COLOR_SEQUENCE.map((color, i) => (
            <div
              key={i}
              className={`sequence-color${i < colorIndex ? " done" : ""}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="grid">
          {tileColors.map((color, index) => (
            <Box
              key={index}
              assignedColor={color}
              isFlipped={getTileFlipped(index)}
              isWrong={wrongIndex === index}
              transitionDelay={getTileDelay(index)}
              onBoxClick={() => handleBoxClick(index)}
            />
          ))}
        </div>
      </main>

      {/* ── Win overlay ── */}
      {isWon && (
        <div className="win-overlay">
          <div className="win-card">
            <div className="win-emoji">🎉</div>
            <h2 className="win-title">You did it!</h2>
            <p className="win-sub">Color sequence completed!</p>
            <button className="restart-btn" onClick={handleRestart}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;