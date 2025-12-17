// src/components/drawers/RightDrawer.tsx
import React, { useEffect, useRef } from "react";

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  width?: number; // px
}

export default function RightDrawer({
  open,
  onClose,
  children,
  title = "AI Analysis",
  subtitle,
  width = 420,
}: RightDrawerProps) {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  /* =========================
     🔒 Body scroll lock
     ========================= */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* =========================
     ⌨️ ESC key close
     ========================= */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  /* =========================
     🎯 Focus management
     ========================= */
  useEffect(() => {
    if (open) {
      // 현재 포커스 저장
      lastFocusedRef.current = document.activeElement as HTMLElement;

      // Drawer 안으로 포커스 이동
      setTimeout(() => {
        drawerRef.current?.focus();
      }, 0);
    } else {
      // 닫힐 때 원래 포커스로 복귀
      lastFocusedRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className={`
          fixed top-0 right-0 z-50 h-full bg-white shadow-2xl
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
          rounded-l-2xl
          outline-none
        `}
        style={{ width: `min(90vw, ${width}px)` }}
        aria-modal="true"
        role="dialog"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="text-gray-400 hover:text-black transition"
              >
                ✕
              </button>
            </div>

            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {children}
          </div>
        </div>
      </aside>
    </>
  );
}
