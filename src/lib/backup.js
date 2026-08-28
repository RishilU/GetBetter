export function exportData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `getbetter-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function readImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || !Array.isArray(parsed.areas)) {
          reject(new Error("That file doesn't look like a GetBetter backup."));
          return;
        }
        resolve(parsed);
      } catch {
        reject(new Error("Couldn't read that file as JSON."));
      }
    };
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsText(file);
  });
}
