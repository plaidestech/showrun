# Dashboard Performance Engineering

**Quick measurement:** Vite build stats show bundle size. Baseline: Check `packages/dashboard/dist/` after build.

**Key bottlenecks:**
- React SPA with Socket.IO real-time updates
- Large component files (agentTools.ts ~1200 lines, browserInspector.ts ~1600 lines)
- No code splitting or lazy loading
- Bundle includes all Monaco editor features

**Optimization approaches:**
- Code splitting: Lazy-load agent panel, teach mode UI, Monaco editor
- Bundle analysis: `vite build --mode analyze` to identify large dependencies
- Component optimization: Split large files into smaller modules
- Memoization: React.memo for expensive list renders (run history, conversation logs)

**Measurement strategy:**
- Chrome DevTools Performance tab: Measure initial load, interaction latency
- Lighthouse CI for automated scoring
- Bundle size comparison: `ls -lh packages/dashboard/dist/assets/` before/after
- Network tab: Check main.js size and load time

**Success criteria:** Initial load <2s, bundle main.js <500KB gzipped, Lighthouse performance score >90.
