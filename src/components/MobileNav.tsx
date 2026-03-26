"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navItems = ["About", "Skills", "Projects", "Experience", "Contact"];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="relative z-50 flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md"
          >
            <nav className="flex h-full flex-col items-center justify-center gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Link
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="text-2xl font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
