import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

// Seletor entre as bibliotecas (cada uma é um site Quartz separado, publicado em uma subpasta).
// SITE_ROOT = prefixo do site (ex.: "/estudos"); LIBRARY = biblioteca atual deste build.
const ROOT = process.env.SITE_ROOT ?? ""
const CURRENT = process.env.LIBRARY ?? ""
const LIBS = [
  { id: "japones", label: "日本語 Japonês" },
  { id: "ai", label: "AI Engineering" },
]

const LibrarySwitcher: QuartzComponent = ({ displayClass }: QuartzComponentProps) => (
  <nav class={classNames(displayClass, "library-switcher")} aria-label="Biblioteca">
    <a href={`${ROOT}/`} data-router-ignore class="lib">
      ⌂ Início
    </a>
    {LIBS.map((l) => (
      <a
        href={`${ROOT}/${l.id}/`}
        data-router-ignore
        class={l.id === CURRENT ? "lib active" : "lib"}
        aria-current={l.id === CURRENT ? "page" : undefined}
      >
        {l.label}
      </a>
    ))}
  </nav>
)

LibrarySwitcher.css = `
.library-switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.25rem 0;
}
.library-switcher .lib {
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--lightgray);
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--darkgray);
  background: var(--light);
}
.library-switcher .lib:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}
.library-switcher .lib.active {
  background: var(--secondary);
  border-color: var(--secondary);
  color: var(--light);
}
`

export default (() => LibrarySwitcher) satisfies QuartzComponentConstructor
