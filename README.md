# Estudos: Japonês e AI Engineering (site de leitura)

Site estático feito com [Quartz](https://quartz.jzhao.xyz/) a partir de dois cofres do Obsidian. Hospedado no GitHub Pages (grátis para repositórios públicos).

- Página inicial: escolhe a biblioteca. Dentro de cada uma: leitura, grafo, busca, backlinks e botão para trocar de biblioteca.
- `tools/prepare.py`: copia cada cofre para uma pasta temporária limpa (sem `.obsidian`, Anki e rascunhos).
- `build.ps1`: gera `docs/` (os dois sites + a página inicial).

## Atualizar o site depois de mudar os cofres

```powershell
.\build.ps1 -Repo NOME-DO-REPOSITORIO
git add -A
git commit -m "atualiza o site"
git push
```

Teste local: `.\build.ps1 -Local` e depois `python -m http.server 8080 --directory docs` (abra http://localhost:8080/).

## Publicar (uma vez)

1. Repositório público no GitHub.
2. Settings → Pages → Source: `Deploy from a branch` → `main` / pasta `/docs`.

Requisitos: Node 22+, Python 3 e `npm ci` já executado. O conteúdo dos cofres fica **público** no site.
