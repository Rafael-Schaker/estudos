#!/usr/bin/env python3
"""Copia um vault do Obsidian para uma pasta de build limpa para o Quartz.

- ignora .obsidian, .git, .smart-env, arquivos Anki e rascunhos "Sem título"
- usa o H1 de cada nota como `title` e remove o H1 do corpo (evita título duplicado)
- cria index.md a partir da nota inicial

Uso: python prepare.py <vault> <destino> <nota-inicial (sem .md)>
"""
import json, os, re, shutil, sys

src, dst, home = sys.argv[1], sys.argv[2], sys.argv[3]
SKIP_DIRS = {".obsidian", ".git", ".smart-env", ".trash", "node_modules"}

if os.path.exists(dst):
    shutil.rmtree(dst)
count = 0
home_text = None
for root, dirs, files in os.walk(src):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    rel = os.path.relpath(root, src)
    for f in files:
        if f.startswith(("Anki", "Sem título")) or f.startswith("smart-env-export"):
            continue
        out = os.path.join(dst, rel, f) if rel != "." else os.path.join(dst, f)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        if not f.endswith(".md"):
            shutil.copy2(os.path.join(root, f), out)
            continue
        t = open(os.path.join(root, f), encoding="utf-8").read()
        m = re.match(r"---\n(.*?)\n---\n(.*)", t, flags=re.S)
        fm, body = (m.group(1), m.group(2)) if m else ("", t)
        h = re.search(r"^# (.+)\n", body, flags=re.M)
        if h and "title:" not in fm:
            fm = (fm + "\n" if fm else "") + "title: " + json.dumps(h.group(1).strip(), ensure_ascii=False)
            body = body[:h.start()] + body[h.end():]
        text = "---\n" + fm + "\n---\n" + body.lstrip("\n")
        open(out, "w", encoding="utf-8", newline="\n").write(text)
        count += 1
        if os.path.splitext(f)[0] == home:
            home_text = text
assert home_text, "nota inicial nao encontrada: " + home
open(os.path.join(dst, "index.md"), "w", encoding="utf-8", newline="\n").write(home_text)
print(f"{count} notas preparadas em {dst}")
