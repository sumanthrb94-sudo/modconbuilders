import { ChevronDown } from './Icons';

// Native <details> accordion: works without JavaScript and is keyboard accessible.
export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-black/30">
      {items.map((item, i) => (
        <details key={item.q} className="group border-b border-black/30" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-helvetica text-[16px] tracking-[-0.02em] text-[#5E5E5E] marker:hidden [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="h-4 w-4 shrink-0 text-black transition-transform group-open:rotate-180" />
          </summary>
          <p className="px-5 pb-6 text-[17px] leading-[1.5] text-black">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
