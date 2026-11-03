import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

// Seletor entre as bibliotecas (cada uma é um site Quartz separado, publicado em uma subpasta).
// Vem do build.py: SITE_ROOT = prefixo do site (ex.: "/estudos"), LIBRARY = biblioteca atual,
// LIBRARIES_JSON = lista [{id, badge, label}] de libraries.json.
const ROOT = process.env.SITE_ROOT ?? ""
const CURRENT = process.env.LIBRARY ?? ""
type Lib = { id: string; badge: string; label: string }
const LIBS: Lib[] = JSON.parse(process.env.LIBRARIES_JSON ?? "[]")

const LibrarySwitcher: QuartzComponent = ({ displayClass }: QuartzComponentProps) => (
  <nav class={classNames(displayClass, "library-switcher")} aria-label="Bibliotecas">
    <div class="seg" role="group">
      {LIBS.map((l) => (
        <a
          href={`${ROOT}/${l.id}/`}
          data-router-ignore
          class={l.id === CURRENT ? "seg-item active" : "seg-item"}
          aria-current={l.id === CURRENT ? "page" : undefined}
        >
          <span class="badge" lang={l.badge === "AI" ? "en" : "ja"}>
            {l.badge}
          </span>
          <span class="label">{l.label}</span>
        </a>
      ))}
    </div>
    <a class="all" href={`${ROOT}/`} data-router-ignore>
      ← Todas as bibliotecas
    </a>
  </nav>
)

LibrarySwitcher.css = `
.library-switcher {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 0.4rem 0 0.2rem;
}
.library-switcher .seg {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--lightgray) 60%, transparent);
}
.library-switcher .seg-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 0.45rem 0.4rem 0.4rem;
  border-radius: 11px;
  background: transparent;
  color: var(--darkgray);
  line-height: 1.15;
  text-align: center;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.library-switcher .seg-item .badge {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.library-switcher .seg-item .label {
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.8;
}
.library-switcher .seg-item:hover {
  background: color-mix(in srgb, var(--light) 70%, transparent);
  color: var(--dark);
}
.library-switcher .seg-item.active {
  background: var(--light);
  color: var(--secondary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px -6px rgba(0, 0, 0, 0.25);
}
.library-switcher .all {
  align-self: flex-start;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray);
  padding: 0.1rem 0.25rem;
  border-radius: 6px;
}
.library-switcher .all:hover {
  color: var(--secondary);
}
`

export default (() => LibrarySwitcher) satisfies QuartzComponentConstructor
