param(
  [string]$Message = "update ai flight lab"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath ".git")) {
  throw "This folder is not a git repository. Run git init first."
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
  throw "No GitHub remote configured. Add one first, for example: git remote add origin https://github.com/<owner>/<repo>.git"
}

npm run build

git add -A

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No staged changes to commit."
} else {
  git commit -m $Message
}

git push
