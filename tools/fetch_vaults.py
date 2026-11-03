#!/usr/bin/env python3
"""Baixa os repositórios dos cofres (privados) para vaults/<id>, usando o token em VAULTS_TOKEN.

Usado pela GitHub Action. Para adicionar uma biblioteca, basta uma entrada nova em libraries.json.
"""
import json, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
token = os.environ.get("VAULTS_TOKEN", "")
if not token:
    sys.exit("VAULTS_TOKEN não definido")

cfg = json.load(open(os.path.join(HERE, "libraries.json"), encoding="utf-8"))
for lib in cfg["libraries"]:
    dest = os.path.join(HERE, "vaults", lib["id"])
    if os.path.exists(dest):
        shutil.rmtree(dest)
    url = f"https://x-access-token:{token}@github.com/{lib['repo']}.git"
    print(f"baixando {lib['repo']} ({lib.get('branch', 'main')}) -> vaults/{lib['id']}", flush=True)
    r = subprocess.run(["git", "clone", "--depth", "1", "--branch", lib.get("branch", "main"), url, dest],
                       capture_output=True, text=True)
    if r.returncode:
        # nunca imprimir a saída crua: pode conter a URL com o token
        sys.exit(f"falha ao baixar {lib['repo']}: confira o token e o nome do repositório")
    shutil.rmtree(os.path.join(dest, ".git"), ignore_errors=True)
print("cofres baixados")
