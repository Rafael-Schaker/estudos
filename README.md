# Estudos: Japonês e AI Engineering (site de leitura)

Site estático feito com [Quartz](https://quartz.jzhao.xyz/) a partir de cofres do Obsidian e hospedado no GitHub Pages (grátis para repositórios públicos).

## Como funciona

```
JPNClass (privado)  ┐
AIEngClass (privado)┴─►  GitHub Action (todo dia às 6h de Brasília)  ─►  build.py  ─►  GitHub Pages
```

1. A Action baixa os repositórios listados em `libraries.json` (usa o segredo `VAULTS_TOKEN`).
2. `tools/prepare.py` limpa cada cofre (sem `.obsidian`, Anki e rascunhos) e usa o H1 de cada nota como título.
3. O Quartz gera um site por biblioteca (`/japones/`, `/ai/`) e o `build.py` monta a página inicial.
4. O Pages publica o resultado.

Quando você atualiza um cofre (push no repositório dele), o site pega a mudança na próxima rodada das 6h, ou na hora se você disparar a Action manualmente (aba **Actions → Publicar site → Run workflow**).

## Configuração (uma vez)

1. **Token de leitura dos cofres.** GitHub → Settings → Developer settings → Fine-grained tokens → *Generate new token*:
   - Repository access: *Only select repositories* → `JPNClass` e `AIEngClass`
   - Permissions → Repository permissions → **Contents: Read-only** (o resto fica sem acesso)
   - Expiration: escolha uma data (renove quando vencer)
2. **Segredo no repositório do site.** `estudos` → Settings → Secrets and variables → Actions → *New repository secret*: nome **`VAULTS_TOKEN`**, valor = o token.
3. **Pages via Actions.** `estudos` → Settings → Pages → Source: **GitHub Actions**.
4. **Primeira execução.** Aba Actions → *Publicar site* → *Run workflow*.

Sem o segredo, a Action só avisa e não publica nada (o site atual continua no ar).

## Adicionar mais uma biblioteca

Acrescente um bloco em `libraries.json` (id, título, repositório, nota inicial, cor). A página inicial e o seletor se atualizam sozinhos. Se o repositório for privado, o token precisa incluí-lo.

## Horário da atualização

O GitHub usa UTC. `0 9 * * *` em `.github/workflows/publish.yml` equivale a 6h em Brasília (UTC-3). Para outro fuso, ajuste esse horário.

## Desenvolvimento local

Requisitos: Node 22+, Python 3 e `npm ci`.

```powershell
# copie libraries.local.json com os caminhos dos cofres no seu computador (arquivo ignorado pelo git)
python build.py --local --out docs
python -m http.server 8080 --directory docs   # http://localhost:8080/
```

O visual está em `quartz/styles/custom.scss`, `quartz.config.ts`, `site/index.template.html` e `quartz/components/LibrarySwitcher.tsx`.

> O conteúdo dos cofres fica **público** no site, embora os repositórios deles continuem privados.
