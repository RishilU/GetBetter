import { useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { exportData, readImportFile } from "../lib/backup";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

function Card({ children }) {
  return <div style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 14, padding: 18, marginBottom: 16, maxWidth: 520 }}>{children}</div>;
}

export default function SettingsView({ data, onImport }) {
  const fileInputRef = useRef(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [error, setError] = useState("");

  const handleFileChosen = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    try {
      const parsed = await readImportFile(file);
      setPendingImport(parsed);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Card>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 6 }}>Backup</div>
        <div style={{ fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 1.5, marginBottom: 14 }}>
          Your data syncs automatically across devices you're logged into. This is a manual snapshot on top of that — good before a big cleanup, or just for peace of mind.
        </div>
        <button
          onClick={() => exportData(data)}
          style={{ background: COLORS.accent, border: "none", borderRadius: 8, color: COLORS.onAccent, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
        >
          Download backup (.json)
        </button>
      </Card>

      <Card>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 6 }}>Restore</div>
        <div style={{ fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 1.5, marginBottom: 14 }}>
          Restoring a backup replaces everything currently in the app — goals, journal, all of it.
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChosen} style={{ display: "none" }} />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.textSecondary, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}
        >
          Choose backup file...
        </button>
        {error && <div style={{ color: COLORS.danger, fontSize: 12, marginTop: 10 }}>{error}</div>}
      </Card>

      <ConfirmDialog
        open={!!pendingImport}
        title="Replace everything?"
        message="This overwrites all current goals and journal entries with the contents of this backup file. This can't be undone."
        confirmLabel="Restore"
        onCancel={() => setPendingImport(null)}
        onConfirm={() => {
          onImport(pendingImport);
          setPendingImport(null);
        }}
      />
    </div>
  );
}
