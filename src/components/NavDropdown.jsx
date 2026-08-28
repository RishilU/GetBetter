import { useEffect, useRef, useState } from "react";
import { COLORS } from "../lib/theme";

export default function NavDropdown({ items, view, onChangeView }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = items.find((i) => i.id === view) || items[0];

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative", marginBottom: 24 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "left",
          background: COLORS.bgElevated,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          color: COLORS.textPrimary,
          fontWeight: 600,
          fontSize: 13.5,
          padding: "9px 10px",
          cursor: "pointer",
        }}
      >
        <span>{current.label}</span>
        <span style={{ color: COLORS.textMuted, fontSize: 11, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: COLORS.bgElevated,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            boxShadow: "0 12px 28px rgba(20,17,14,0.16)",
            zIndex: 30,
            padding: 4,
          }}
        >
          {items.map((item) => {
            const active = item.id === view;
            return (
              <div
                key={item.id}
                onClick={() => { onChangeView(item.id); setOpen(false); }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? COLORS.textPrimary : COLORS.textSecondary,
                  background: active ? COLORS.bgElevatedHover : "transparent",
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
