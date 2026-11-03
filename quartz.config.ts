import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
// Cor de destaque de cada biblioteca (vem do build.py / libraries.json)
const ACCENT_LIGHT = process.env.ACCENT_LIGHT ?? "#4f46e5"
const ACCENT_DARK = process.env.ACCENT_DARK ?? "#8f97ff"

const config: QuartzConfig = {
  configuration: {
    // Título e endereço vêm do build.py (um build por biblioteca)
    pageTitle: process.env.SITE_TITLE ?? "Estudos",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "pt-BR",
    baseUrl: process.env.SITE_BASEURL ?? "localhost:8080",
    ignorePatterns: ["private", "templates", ".obsidian", ".smart-env", ".git", "**/Anki*.txt", "**/Sem título*"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#fbfbfd",
          lightgray: "#e6e8ef",
          gray: "#8e96a8",
          darkgray: "#464e60",
          dark: "#151822",
          secondary: ACCENT_LIGHT,
          tertiary: ACCENT_LIGHT,
          highlight: "rgba(100, 110, 140, 0.09)",
          textHighlight: "#fde68a99",
        },
        darkMode: {
          light: "#0e1016",
          lightgray: "#262a38",
          gray: "#6b7387",
          darkgray: "#c6cbd9",
          dark: "#f1f3f9",
          secondary: ACCENT_DARK,
          tertiary: ACCENT_DARK,
          highlight: "rgba(160, 170, 200, 0.12)",
          textHighlight: "#b3aa0299",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      // sem CreatedModifiedDate: na CI as datas de arquivo seriam todas a data do build
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // CustomOgImages desligado: acelera o build e evita baixar fontes na hora de gerar
    ],
  },
}

export default config

