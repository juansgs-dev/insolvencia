"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaUser } from "react-icons/fa"

type Props = {
  fullName: string
  role: string
  onLogout: () => void
  onClose: () => void
}

export default function UserDropdownMobile({
  fullName,
  role,
  onLogout,
  onClose,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50"
      >
        <FaUser className="text-[#1e3a8a]" />
        <div className="text-left">
          <p className="font-semibold text-gray-800">
            {fullName}
          </p>
          <p className="text-sm text-gray-500">
            {role}
          </p>
        </div>
      </button>

      {open && (
        <motion.button
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            onLogout()
            onClose()
          }}
          className="w-full px-4 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition"
        >
          Cerrar sesión
        </motion.button>
      )}
    </div>
  )
}