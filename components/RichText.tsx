import { Fragment } from 'react';

// Renders `**bold**` and `*accent*` markers from content/site.ts.
export default function RichText({ text, accentClass = 'accent', boldClass = 'font-medium text-ink' }: { text: string; accentClass?: string; boldClass?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**')) return <strong key={i} className={boldClass}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('*')) return <em key={i} className={accentClass}>{part.slice(1, -1)}</em>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
