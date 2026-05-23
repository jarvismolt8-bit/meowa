import { Routes, Route } from 'react-router-dom'

function Home() {
  return <div><h1 className="text-2xl font-bold">Home</h1><p>Welcome to Meowa</p></div>
}

function NewCat() {
  return <div><h1 className="text-2xl font-bold">New Cat</h1></div>
}

function CatDetail() {
  return <div><h1 className="text-2xl font-bold">Cat Detail</h1></div>
}

function EditCat() {
  return <div><h1 className="text-2xl font-bold">Edit Cat</h1></div>
}

function Reminders() {
  return <div><h1 className="text-2xl font-bold">Reminders</h1></div>
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3 shadow-sm">
        <h1 className="text-lg font-semibold">Meowa</h1>
      </header>
      <main className="mx-auto max-w-4xl p-4">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cats/new" element={<NewCat />} />
        <Route path="/cats/:id" element={<CatDetail />} />
        <Route path="/cats/:id/edit" element={<EditCat />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
    </AppShell>
  )
}
