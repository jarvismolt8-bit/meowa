import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import HomePage from '@/pages/HomePage'
import CatDetailPage from '@/pages/CatDetailPage'
import NewCatPage from '@/pages/NewCatPage'
import EditCatPage from '@/pages/EditCatPage'
import RemindersPage from '@/pages/RemindersPage'
import ErrorBoundary from '@/components/ErrorBoundary'
import Toast from '@/components/Toast'
import { useToast } from '@/hooks/useToast'

function Preview() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Theme Preview</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Default</button>
          <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted">Outline</button>
          <button className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">Secondary</button>
          <button className="rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">Destructive</button>
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">Accent</button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Cards</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-card p-4 text-card-foreground shadow-sm ring-1 ring-foreground/10">
            <h3 className="font-medium">Card Title</h3>
            <p className="mt-1 text-sm text-muted-foreground">This is a sample card with the pastel theme applied.</p>
          </div>
          <div className="rounded-xl bg-card p-4 text-card-foreground shadow-sm ring-1 ring-foreground/10">
            <h3 className="font-medium">Another Card</h3>
            <p className="mt-1 text-sm text-muted-foreground">Cards use --card and --card-foreground tokens.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex h-5 items-center rounded-full bg-primary px-2 text-xs font-medium text-primary-foreground">Primary</span>
          <span className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-xs font-medium text-secondary-foreground">Secondary</span>
          <span className="inline-flex h-5 items-center rounded-full bg-destructive/10 px-2 text-xs font-medium text-destructive">Destructive</span>
          <span className="inline-flex h-5 items-center rounded-full border border-border px-2 text-xs font-medium text-foreground">Outline</span>
          <span className="inline-flex h-5 items-center rounded-full bg-accent px-2 text-xs font-medium text-accent-foreground">Accent</span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Inputs</h2>
        <div className="space-y-2">
          <input
            placeholder="Default input"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <select className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Dialog / Overlay</h2>
        <p className="text-sm text-muted-foreground">
          The dialog overlay uses <code>bg-black/10</code> with a backdrop blur. The content card uses <code>bg-popover</code> with rounded corners and shadow.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Form Layout</h2>
        <div className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-foreground/10">
          <div className="space-y-1">
            <label className="text-sm font-medium">Label</label>
            <input
              placeholder="Form input"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <p className="text-xs text-muted-foreground">Helper text for the field above.</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default function App() {
  const { toast, show } = useToast();

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ message: string; type: 'success' | 'error' | 'info' }>).detail;
      show(detail.message, detail.type);
    };
    window.addEventListener('meowa:toast', handler);
    return () => window.removeEventListener('meowa:toast', handler);
  }, [show]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cats/new" element={<NewCatPage />} />
          <Route path="/cats/:id" element={<CatDetailPage />} />
          <Route path="/cats/:id/edit" element={<EditCatPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/preview" element={<Preview />} />
        </Route>
      </Routes>
      <Toast toast={toast} />
    </ErrorBoundary>
  )
}
