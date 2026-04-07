import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

function AppLayout({ schoolName, gradeName, onLogout, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium border text-center ${
      isActive
        ? "border-blue-200 bg-blue-500 text-white"
        : "border-blue-300 text-blue-50 hover:border-blue-200 hover:bg-blue-700"
    }`;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-blue-950 bg-[#003049]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h1 className="text-xl font-semibold text-white">Student Mark Recorder</h1>
            <p className="text-sm text-blue-100">{schoolName} - Grade {gradeName}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex items-center justify-center border border-blue-300 p-2 text-blue-50 sm:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={18} />
          </button>

          <nav
            className={`${
              isMobileMenuOpen ? "grid" : "hidden"
            } w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center`}
          >
            <NavLink to="/students" className={navClass} onClick={closeMobileMenu}>
              Students
            </NavLink>
            <NavLink to="/marks" className={navClass} onClick={closeMobileMenu}>
              Marks
            </NavLink>
            <NavLink to="/general" className={navClass} onClick={closeMobileMenu}>
              General
            </NavLink>
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                onLogout();
              }}
              className="border border-blue-300 px-3 py-2 text-sm font-medium text-blue-50 hover:border-blue-200 hover:bg-blue-700"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <section className="mx-auto mt-6 max-w-6xl px-4 pb-8 md:px-8">{children}</section>
    </main>
  );
}

export default AppLayout;
