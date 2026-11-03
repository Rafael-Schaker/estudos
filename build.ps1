# Gera o site estático (pasta docs/) a partir dos dois vaults do Obsidian.
#   .\build.ps1                      -> build para GitHub Pages em https://<usuario>.github.io/<Repo>/
#   .\build.ps1 -Local               -> build para testar em http://localhost:8080/ (sem prefixo)
# Requer: Node 22+, npm install já feito (npm ci), Python 3.
param(
    [string]$User = 'Rafael-Schaker',
    [string]$Repo = 'estudos',
    [switch]$Local
)
$ErrorActionPreference = 'Stop'
$env:PYTHONUTF8 = '1'
$here = $PSScriptRoot
$libs = @(
    @{ Id = 'japones'; Title = 'Japonês'; Vault = 'C:\Users\rk_ce\Obsidian\Japones'; Home = 'Comece Aqui' },
    @{ Id = 'ai'; Title = 'AI Engineering'; Vault = 'C:\Users\rk_ce\Obsidian\IA Engineering'; Home = 'Comece Aqui' }
)
$root = if ($Local) { '' } else { "/$Repo" }
$host_ = if ($Local) { 'localhost:8080' } else { "$($User.ToLower()).github.io/$Repo" }

$docs = Join-Path $here 'docs'
New-Item -ItemType Directory -Force $docs | Out-Null
Get-ChildItem $docs -Force | Remove-Item -Recurse -Force   # limpa o conteúdo (a pasta pode estar em uso)

foreach ($l in $libs) {
    $work = Join-Path $env:TEMP "estudos-content\$($l.Id)"  # fora do repo: o Quartz respeita o .gitignore
    python (Join-Path $here 'tools\prepare.py') $l.Vault $work $l.Home
    if ($LASTEXITCODE) { throw "prepare falhou: $($l.Id)" }
    $env:SITE_ROOT = $root
    $env:LIBRARY = $l.Id
    $env:SITE_TITLE = $l.Title
    $env:SITE_BASEURL = "$host_/$($l.Id)"
    npx quartz build -d $work -o (Join-Path $docs $l.Id)
    if ($LASTEXITCODE) { throw "quartz falhou: $($l.Id)" }
}
Copy-Item (Join-Path $here 'site\index.html') $docs
New-Item -ItemType File -Force (Join-Path $docs '.nojekyll') | Out-Null
"Pronto: $docs"


