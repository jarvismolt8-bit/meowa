import { Link, Outlet } from 'react-router-dom'
import ThemeToggle from '@/components/ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/reminders', label: 'Reminders' },
]

export default function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 surface-card shadow-sm">
        <div className="h-0.5 bg-gradient-meowa" />
        <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-brand-yellow text-xl text-brand-ink">
              😺
            </span>
            <span className="bg-gradient-meowa bg-clip-text text-transparent">Meowa</span>
          </Link>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Link
              to="/cats/new"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              + Add
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card py-4 text-center text-sm text-muted-foreground">
        Meowa &mdash; made with love for your feline friends
      </footer>
    </div>
  )
}
