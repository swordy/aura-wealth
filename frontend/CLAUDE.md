# Frontend — Conventions & Design System

## Design System (STRICT — from aura-maquette.html)

### Color Tokens (CSS Custom Properties)
```css
:root {
  --gold: #D4AF37;
  --gold-light: #F3E5AB;
  --gold-dark: #AA8020;
  --panel-bg: rgba(0, 0, 0, 0.45);
  --panel-border: rgba(212, 175, 55, 0.25);
  --tab-home: #D4AF37;
  --tab-finance: #10B981;
  --tab-bourse: #3B82F6;
  --tab-immo: #D97706;
  --tab-pe: #8B5CF6;
}
```
- **Body background**: `#030303` (Three.js scene)
- **Gains**: `text-green-400` (#4ADE80)
- **Losses**: `text-red-400` (#F87171)
- **Info**: `text-blue-400` (#60A5FA)
- **Alert**: `text-amber-400` (#FBBF24)
- **Premium**: `text-purple-300` (#D8B4FE)

### Typography
- **Display font**: `'Cormorant Garamond', serif` — KPI values (text-4xl), H1/H2, branding
- **Body font**: `'DM Sans', sans-serif` — everything else
- **Weights**: 300 (light/KPI numbers), 400, 500 (medium), 600 (semibold), 700 (bold/labels)
- **Logo**: `text-lg md:text-2xl font-light tracking-[0.2em] text-gold uppercase display-font`
- **KPI labels**: `text-sm font-bold tracking-widest uppercase`
- **KPI values**: `text-4xl font-light display-font` (or `font-semibold` for Net)

### Core Component CSS
```css
.glass-panel {
  background: var(--panel-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--panel-border);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}
.glass-panel-inner {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(212, 175, 55, 0.4);
}
.glow-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent);
}
.progress-bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.08); }
.progress-bar-fill { height: 100%; border-radius: 3px; transition: width 1s cubic-bezier(0.22,1,0.36,1); }
.tag {
  display: inline-flex; align-items: center;
  padding: 2px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase;
}
```

### Animations (CSS)
- **fadeIn**: `0.5s cubic-bezier(0.22, 1, 0.36, 1)` — translateY 12px→0, opacity 0→1
- **slideUp**: `0.35s cubic-bezier(0.22, 1, 0.36, 1)` — translateY 24px→0
- **stagger**: delays `0.05s × child-index` (max 6 children)
- **pulseGold**: `2.5s infinite` — box-shadow pulse on sparkle buttons
- **card-hover**: `transition all 0.3s ease`
- **spark-ai hover**: `scale(1.25) rotate(15deg) drop-shadow(gold)` with elastic bezier
- **No jank**: GPU-accelerated (transform + opacity only)

### Scrollbar
```css
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.5); }
```

### Responsive Breakpoints
- **Mobile** (<768px): 1-col grids, hamburger nav, `px-4 py-6`
- **Tablet** (≥768px): 3-col KPI grids, desktop nav visible, `px-10 py-8`
- **Desktop** (≥1024px): 2-col blocks (lg:grid-cols-2), footer visible, `gap-6`
- **Tables**: `overflow-x-auto` on mobile

## WebGL Particles (Three.js)
- 800 particles, size 2.5, spread 350, opacity 0.4
- Scene background: `0x030303`
- Blending: `THREE.AdditiveBlending`
- Texture: radial gradient (white→gold→transparent)
- Auto-rotation: `y += 0.0004, x += 0.0002`
- Mouse follow: `lerp × 0.04`
- Pixel ratio: `min(devicePixelRatio, 2)`
- Target: >30fps on iPhone 12+

## Interaction Patterns (S5–S8)

### InlineEdit Component
Hover over a value → pencil icon appears → click → input replaces value → Enter/blur saves → ConfirmDialog → PATCH API → Toast → value updates.

```tsx
<InlineEdit
  value={fiscal.ir}
  format={formatEur}
  field="fiscal.ir"
  domain="dashboard"
  onSave={(newVal) => mutate({ field: "fiscal.ir", value: newVal })}
/>
```

### Modal Forms
Used for adding/editing complex objects (new LMNP property, new PEA position, etc.).
- Glass-panel overlay with backdrop blur
- Form fields use `<FormField>` component (label, input, validation, error)
- Submit → ConfirmDialog → API call → Toast → close modal

### ConfirmDialog Component
Required before ANY write/delete/reset action. Three variants:
- **danger** (red): Delete, reset to defaults
- **warning** (amber): Overwrite existing values, integrate document
- **info** (blue): Save changes, confirm upload

```tsx
<ConfirmDialog
  variant="danger"
  title="Réinitialiser les valeurs ?"
  message="Toutes vos modifications seront perdues."
  confirmLabel="Réinitialiser"
  onConfirm={handleReset}
  onCancel={close}
/>
```

### Toast Notifications
Auto-dismiss after 4s. Variants: success (green), error (red), info (blue), warning (amber).
```tsx
toast.success("Valeur mise à jour");
toast.error("Erreur lors de la sauvegarde");
```

### Sections Hide/Show (S7+)
Each glass-panel section has a collapse/expand toggle (chevron icon).
- State persisted in localStorage per user
- Smooth height animation (max-height transition)
- Collapsed state shows only section title + chevron

### Document Upload Zone (S7+)
- Drag & drop zone with dashed border
- File type validation (PDF, CSV, XLS/XLSX)
- Upload progress bar
- After upload: ParsePreview shows extracted values
- DiffTable: side-by-side current vs. parsed values (green=new, amber=changed, gray=unchanged)
- "Intégrer" button → ConfirmDialog (warning) → API integrate → Toast

## API Client

### `apiFetch<T>(path, options?)`
```typescript
const API_BASE = "/api/v1";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
```

### Hooks Pattern
```typescript
// Generic hook
export function useApiData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ...fetch on mount...
  return { data, loading, error, refetch };
}

// Domain hook (one-liner)
export const useDashboard = () => useApiData<DashboardData>("/dashboard");
```

### Mutation Hook (S6+)
```typescript
export function useMutation<T>(path: string, method: "PUT" | "PATCH" | "POST") {
  // Returns { mutate, loading, error }
  // After success: triggers refetch of parent useApiData
}
```

## Formatting Utilities (`@/utils/format`)
```typescript
formatEur(n: number): string   // "1 465 800 €"
formatPct(n: number, sign?: boolean): string  // "+4.2%" or "4.2%"
```
- NEVER use inline `toLocaleString()` — always import from `@/utils/format`
- Handles undefined/null gracefully (returns "—")

## AI Context Responses (Mock)
- Pre-written French responses triggered by sparkle buttons
- Show "Analyse en cours..." for 600ms before displaying
- Title changes to "IA — Focus : [Subject]"
- Minimum 15 unique context responses across all 5 tabs
- Written in clear, pedagogical French — no raw jargon without explanation

## Component Rules
- One component per file, PascalCase matching filename
- Props interface at top of file, named `Props`
- No `any` types — strict TypeScript
- No inline styles unless replicating exact maquette inline values (border-color per tab)
- All user-facing text in French
- Loading state: `<LoadingSkeleton />` component
- Error state: `<ErrorState message={...} />` component
