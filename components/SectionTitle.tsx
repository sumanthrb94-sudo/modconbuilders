import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  children: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
};

// Small grey label above a large heading. Wrap accent words in <em className="accent">.
export default function SectionTitle({ eyebrow, children, align = 'left', as: Tag = 'h2', className = '' }: Props) {
  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`} data-reveal>
      {eyebrow && <p className="eyebrow mb-3 lg:mb-4">{eyebrow}</p>}
      <Tag className="h-section">{children}</Tag>
    </div>
  );
}
