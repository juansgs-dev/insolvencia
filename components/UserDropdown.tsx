"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaUser } from "react-icons/fa"

type Props = {
  fullName: string
  role: string
  onLogout: () => void
}

export default function UserDropdown({
  fullName,
  role,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition whitespace-nowrap"
      >
        <FaUser className="text-[#1e3a8a]" />
        <div className="text-left leading-tight">
          <p className="text-sm font-semibold text-gray-800">
            {fullName}
          </p>
          <p className="text-xs text-gray-500">
            {role}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
          >
            <button
              onClick={() => {
                onLogout()
                setOpen(false)
              }}
              className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition text-left rounded-xl"
            >
              Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
