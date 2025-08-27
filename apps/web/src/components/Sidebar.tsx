export default function Sidebar() {
    return (
      <aside className="hidden md:block md:w-64 md:flex-shrink-0">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r bg-white">
          <nav className="p-4 space-y-1">
            {["Overview", "Billing", "Team", "Settings"].map((item) => (
              <a
                key={item}
                href="#"
                className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    );
  }
  