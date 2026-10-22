import { Fragment, type CSSProperties, type ReactNode } from 'react';

type Props = {
  text: string;
  accentClass?: string;
  boldClass?: string;
  /** Wrap each word in a span so it can fade in word by word (TextEffect, see globals.css `.tw`). */
  words?: boolean;
};

// Renders `**bold**` and `*accent*` markers from content/site.ts.
export default function RichText({ text, accentClass = 'accent', boldClass = 'font-medium text-ink', words = false }: Props) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  let n = 0;
  const split = (s: string): ReactNode =>
    words
      ? s.split(/(\s+)/).map((w, i) =>
          /^\s+$/.test(w) || !w ? (
            w
          ) : (
            <span key={i} className="tw" style={{ '--w': n++ } as CSSProperties}>
              {w}
            </span>
          ),
        )
      : s;

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**')) return <strong key={i} className={boldClass}>{split(part.slice(2, -2))}</strong>;
        if (part.startsWith('*')) return <em key={i} className={accentClass}>{split(part.slice(1, -1))}</em>;
        return <Fragment key={i}>{split(part)}</Fragment>;
      })}
    </>
  );
}
