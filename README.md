# VizualGo

Interactive algorithm visualizer for sorting, pathfinding, and data structures. Learn how algorithms work through step-by-step animations.

**Created by [Adriana Eka Prayudha](https://radenadri.xyz)**

## Features

- **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- **Pathfinding Algorithms**: BFS, DFS, Dijkstra
- **Data Structures**: Linked List, Binary Search Tree
- **Interactive Controls**: Step-by-step playback, speed control, randomize
- **Code Viewer**: See the algorithm implementation alongside the visualization

## Tech Stack

- **[Next.js 16](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - Latest React
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS
- **[Zustand](https://zustand.docs.pmnd.rs)** - State management
- **[Framer Motion](https://www.framer.com/motion)** - Animations

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build

# Start production server
bun start
```

## Project Structure

```
vizualgo/
├── app/                    # Next.js App Router
│   ├── (pages)/home/      # Home page with visualizer
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Entry point
├── components/
│   └── viz/               # Visualization components
│       ├── visualizer-canvas.tsx   # Sorting visualization
│       ├── grid-canvas.tsx         # Pathfinding grid
│       ├── linked-list-canvas.tsx  # Linked list visualization
│       ├── bst-canvas.tsx          # Binary search tree visualization
│       ├── control-panel.tsx       # Playback controls
│       └── code-viewer.tsx         # Algorithm code display
└── libs/
    └── visualizer/        # Algorithm implementations
        ├── algorithms/    # Sorting, pathfinding, data structures
        ├── content/       # Algorithm descriptions
        ├── store/         # Zustand store
        └── types/         # TypeScript types
```

## Available Scripts

```bash
bun dev         # Start development server
bun build       # Production build
bun start       # Start production server
bun lint        # Run linter
bun lint:fix    # Fix linting issues
bun typecheck   # TypeScript validation
```

## License

MIT License - see [LICENSE](LICENSE) for details.
