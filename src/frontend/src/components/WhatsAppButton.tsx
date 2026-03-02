import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-gold/30 rounded-xl shadow-gold p-4 min-w-[220px]"
          >
            <p className="text-xs text-muted-foreground mb-3 font-heading uppercase tracking-wider">
              Chat with us on WhatsApp
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/919327999188"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2 transition-colors"
              >
                <SiWhatsapp className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    +91 93279 99188
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Primary contact
                  </div>
                </div>
              </a>
              <a
                href="https://wa.me/919099008288"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2 transition-colors"
              >
                <SiWhatsapp className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    +91 90990 08288
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Secondary contact
                  </div>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="WhatsApp Contact"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="whatsapp"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SiWhatsapp className="h-6 w-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
