export interface SkipLinkProps {
  label: string
  targetId?: string
}

export function SkipLink({ label, targetId = 'main' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="fixed top-3 left-3 z-[200] -translate-y-[200%] rounded-pill bg-orange px-5 py-3 text-small font-semibold text-ink transition-transform focus-visible:translate-y-0"
    >
      {label}
    </a>
  )
}
