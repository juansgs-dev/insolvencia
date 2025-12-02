"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold tracking-wide"
        >
          Insolvencia Legal
        </motion.div>

        <ul className="hidden md:flex gap-8 text-sm font-medium items-center">
          {["Inicio", "Servicios", "Casos", "Contacto"].map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/${item.toLowerCase() === "inicio" ? "" : item.toLowerCase()}`}
                className="hover:text-blue-600 transition-colors"
              >
                {item}
              </Link>
            </motion.li>
          ))}

          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            Iniciar sesión
          </Link>
        </ul>

        <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t shadow-sm"
          >
            <ul className="flex flex-col p-4 gap-4 text-sm font-medium">
              {["Inicio", "Servicios", "Casos", "Contacto"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === "inicio" ? "" : item.toLowerCase()}`}
                    className="block hover:text-blue-600 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}

              <Link
                href="/login"
                className="block text-center py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => setOpen(false)}
              >
                Iniciar sesión
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
