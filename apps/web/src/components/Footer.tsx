export default function Footer() {
    return (
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Credit Monorepo. All rights reserved.
        </div>
      </footer>
    );
  }
  