import { useState } from "react";

type NavItem = { label: string; href: string };

const nav: NavItem[] = [
  { label: "Dashboard", href: "#" },
  { label: "Customers", href: "#" },
  { label: "Reports", href: "#" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <a href="#" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600" />
            <span className="text-base font-bold tracking-tight">Credit</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            {nav.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              Sign in
            </button>
            <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
              Create
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Open menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="i">☰</span>
          </button>
        </div>

        {/* Mobile sheet */}
        {open && (
          <div className="md:hidden border-t py-2">
            <nav className="flex flex-col">
              {nav.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-2 flex gap-2">
              <button className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                Sign in
              </button>
              <button className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
