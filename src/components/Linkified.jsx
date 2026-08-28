const URL_RE = /((https?:\/\/|www\.)[^\s]+)/gi;

// Renders text with any URLs turned into clickable links — type or paste a
// link into a resource or journal entry and it just becomes clickable.
export default function Linkified({ text }) {
  const parts = [];
  let lastIndex = 0;
  let match;
  const re = new RegExp(URL_RE);
  while ((match = re.exec(text))) {
    if (match.index > lastIndex) parts.push({ text: text.slice(lastIndex, match.index) });
    const raw = match[0];
    const href = raw.startsWith("http") ? raw : `https://${raw}`;
    parts.push({ text: raw, href });
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex) });

  return (
    <>
      {parts.map((p, i) =>
        p.href ? (
          <a
            key={i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 2, textDecorationColor: "currentColor" }}
          >
            {p.text}
          </a>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}
