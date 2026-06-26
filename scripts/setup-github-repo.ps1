param(
  [string]$Repository = "jiangrui-ai-flight-lab"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI is not installed. Install it first, then run: gh auth login"
}

gh auth status | Out-Null

if (-not (Test-Path -LiteralPath ".git")) {
  throw "This folder is not a git repository."
}

$branch = git branch --show-current
if ($branch -ne "main") {
  git branch -M main
}

$remotes = @(git remote)
$origin = $null
if ($remotes -contains "origin") {
  $origin = git remote get-url origin
}
if ($origin) {
  git push -u origin main
  Write-Host "Existing origin pushed: $origin"
  exit 0
}

gh repo create $Repository --public --source . --remote origin --push
Write-Host "Created and pushed GitHub repository: $Repository"
