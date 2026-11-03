#!/usr/bin/env python3
"""Gera o site (landing + uma biblioteca Quartz por cofre) a partir de libraries.json.

  python build.py --out _site          # CI (cofres em vaults/<id>, baixados por tools/fetch_vaults.py)
  python build.py --local --out docs   # local: usa os caminhos de libraries.local.json e prefixo vazio
"""
import argparse, datetime, html, json, os, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "tools"))
from prepare import prepare  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--local", action="store_true", help="teste em localhost: prefixo vazio e caminhos locais")
    ap.add_argument("--local-vaults", action="store_true", help="usa os caminhos de libraries.local.json (mantém o prefixo do GitHub Pages)")
    ap.add_argument("--out", default="_site")
    args = ap.parse_args()
    use_local_paths = args.local or args.local_vaults

    cfg = json.load(open(os.path.join(HERE, "libraries.json"), encoding="utf-8"))
    site, libs = cfg["site"], cfg["libraries"]
    local = {}
    lp = os.path.join(HERE, "libraries.local.json")
    if use_local_paths and os.path.exists(lp):
        local = json.load(open(lp, encoding="utf-8-sig"))  # tolera BOM do PowerShell

    root = "" if args.local else "/" + site["repo"]
    host = "localhost:8080" if args.local else f"{site['user'].lower()}.github.io/{site['repo']}"
    out = os.path.abspath(args.out)
    os.makedirs(out, exist_ok=True)
    for name in os.listdir(out):
        p = os.path.join(out, name)
        shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)

    tmp = tempfile.mkdtemp(prefix="estudos-")  # fora do repo: o Quartz respeita o .gitignore
    switcher = json.dumps([{"id": l["id"], "badge": l["badge"], "label": l["label"]} for l in libs], ensure_ascii=False)
    npx = shutil.which("npx")
    cards = []
    for lib in libs:
        src = local.get(lib["id"]) or os.path.join(HERE, "vaults", lib["id"])
        if not os.path.isdir(src):
            sys.exit(f"cofre não encontrado: {src}")
        work = os.path.join(tmp, lib["id"])
        st = prepare(src, work, lib["home"])
        print(f"[{lib['id']}] {st}", flush=True)
        env = {**os.environ, "SITE_ROOT": root, "LIBRARY": lib["id"], "SITE_TITLE": lib["title"],
               "SITE_BASEURL": f"{host}/{lib['id']}", "ACCENT_LIGHT": lib["accent"]["light"],
               "ACCENT_DARK": lib["accent"]["dark"], "LIBRARIES_JSON": switcher}
        subprocess.run([npx, "quartz", "build", "-d", work, "-o", os.path.join(out, lib["id"])], cwd=HERE, env=env, check=True)
        cards.append(f"""
    <a class="card" href="./{html.escape(lib['id'])}/" style="--a-l:{lib['accent']['light']};--a-d:{lib['accent']['dark']}">
      <span class="badge" lang="ja">{html.escape(lib['badge'])}</span>
      <h2>{html.escape(lib['title'])}</h2>
      <p>{html.escape(lib['description'])}</p>
      <ul class="stats">
        <li><b>{st['notes']}</b> notas</li><li><b>{st['diagrams']}</b> diagramas</li><li><b>{st['images']}</b> imagens</li>
      </ul>
      <span class="cta">Abrir biblioteca <span aria-hidden="true">→</span></span>
    </a>""")

    page = open(os.path.join(HERE, "site", "index.template.html"), encoding="utf-8").read()
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%d/%m/%Y %H:%M UTC")
    page = page.replace("{{SITE_TITLE}}", html.escape(site["title"])).replace("{{CARDS}}", "".join(cards)).replace("{{UPDATED}}", now)
    open(os.path.join(out, "index.html"), "w", encoding="utf-8", newline="\n").write(page)
    open(os.path.join(out, ".nojekyll"), "w").close()
    shutil.rmtree(tmp, ignore_errors=True)
    print("pronto:", out)


if __name__ == "__main__":
    main()
