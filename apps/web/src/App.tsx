import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{body}</p>
      <button className="mt-4 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
        Action
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-dvh bg-gray-100 text-gray-900">
      <Header />

      {/* Content area: Sidebar (md+) + Main */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="md:flex md:gap-6">
          <Sidebar />

          <main className="flex-1 py-6">
            {/* Page title + actions */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Mobile-first layout that scales to desktop.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                  Secondary
                </button>
                <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                  Primary
                </button>
              </div>
            </div>

            {/* Responsive grid: 1 col on mobile, 2 on md, 3 on xl */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Card title="Revenue" body="Monthly revenue performance and trends." />
              <Card title="Customers" body="New signups and active users." />
              <Card title="Conversions" body="Funnel KPIs and goal completions." />
              <Card title="Latency" body="API p95 & uptime metrics." />
              <Card title="Tasks" body="Your current tasks and backlog." />
              <Card title="Notes" body="Pinned notes and quick links." />
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
