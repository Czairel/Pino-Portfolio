import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/Logo.webp";
import { profile } from "../data.js";
import Icon from "./Icon.jsx";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Me" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact", cta: true },
];

// Phones: a "Menu" button opens a list of large links.
// Tablets and up: the links sit inline in the header.
export default function Header() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const { pathname } = useLocation();

  // Close after navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the menu and returns focus to the button
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Reset when the screen grows to the inline layout
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = (event) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-8 md:pt-4">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 rounded-full border border-line bg-[rgb(12_14_20/0.92)] py-2 pr-2 pl-3 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] md:bg-[rgb(12_14_20/0.62)] md:backdrop-blur-xl md:backdrop-saturate-150">
        <Link
          to="/"
          aria-label={`${profile.shortName}, home`}
          className="inline-flex min-h-12 shrink-0 items-center rounded-xl p-1"
        >
          <img src={logo} width="197" height="96" alt="" className="h-9 w-auto rounded-lg" />
        </Link>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong bg-surface px-5 text-base font-semibold text-ink md:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={22} />
          Menu
        </button>

        <nav
          id="site-menu"
          aria-label="Main navigation"
          className={`${open ? "flex" : "hidden"} absolute inset-x-4 top-full mt-2 flex-col gap-1 rounded-3xl border border-line-strong bg-[#0c0e14] p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)] sm:inset-x-8 md:static md:mt-0 md:flex md:flex-row md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "flex min-h-14 items-center rounded-2xl px-4 text-lg font-medium transition-colors md:min-h-11 md:rounded-full md:px-[18px] md:text-[0.95rem]",
                  isActive
                    ? "bg-white/9 text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-ink-muted hover:bg-white/6 hover:text-ink",
                  item.cta
                    ? "md:bg-linear-to-br md:from-accent-deep md:to-accent-mid md:font-semibold md:text-white"
                    : "",
                  item.cta && isActive ? "md:ring-2 md:ring-white/40" : "",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
