# 🎨 Color Sequence Game

A browser-based memory and guessing game built with **React + Vite**. Flip tiles to reveal hidden colors and match them to the sequence shown at the top — in order. One wrong guess resets everything!

---

## 🎮 How to Play

1. Study the **color sequence** displayed at the top of the screen.
2. The grid shows **9 face-down tiles**, each secretly hiding one color from the sequence.
3. Click a tile to **flip it** and reveal its hidden color.
   - ✅ **Correct** — the tile stays flipped and that color dims in the sequence bar.
   - ❌ **Wrong** — the tile flashes red and **all tiles reset** back to face-down. Start over!
4. Match all 9 colors in the correct order to **win**.
5. Hit **Play Again** to reshuffle and try again.

> **Tip:** The cursor ring changes color to show you which color you need to find next!

---

## ✨ Features

- 🃏 **3D card-flip animation** on every tile click
- 🖱️ **Custom animated cursor** — a color-tracking ring that updates to show the next target color
- ❌ **Wrong-guess red flash** with full board reset
- ✅ **Sequence progress indicator** — matched colors fade and shrink in the top bar
- 🎉 **Win screen** with bounce animation and a Play Again button
- 🔀 **Shuffled tiles** every new game — colors are randomly reassigned each round

---

## 🗂️ Project Structure

```
color-sequence-app/
├── public/
├── src/
│   ├── components/
│   │   └── Box.jsx        # Reusable flip-card tile component
│   ├── App.jsx            # Main game logic, state, and layout
│   ├── App.css            # All styles + animations
│   └── main.jsx           # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🧠 Concepts Demonstrated

| Concept | Where |
|---|---|
| Reusable components with props | `Box.jsx` receives `assignedColor`, `isFlipped`, `isWrong`, `onBoxClick` |
| Parent → child data passing | `App.jsx` passes tile state down to each `Box` |
| `useState` for game state | `correctSet`, `colorIndex`, `wrongIndex`, `isWon`, `tileColors` |
| `useEffect` + `useRef` for the DOM | Custom cursor tracks mouse via refs (no re-renders) |
| CSS 3D transforms | `rotateY(180deg)` + `preserve-3d` + `backface-visibility` for card flip |
| CSS keyframe animations | `wrongFlash`, `fadeIn`, `popIn`, `bounce` |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🛠️ Built With

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- Plain CSS (no external UI library)
