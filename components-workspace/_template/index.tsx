'use client'

import { motion } from 'framer-motion'
// Add Phosphor icons as needed:
// import { IconName } from '@phosphor-icons/react'

// ─── ComponentName ────────────────────────────────────────────────────────────
// Rename this function to match your component (PascalCase).
// Rename the file's parent folder to kebab-case of the same name.

export function ComponentName() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-sand-950">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-sand-50"
      >
        {/* Replace with your component */}
      </motion.div>
    </div>
  )
}
