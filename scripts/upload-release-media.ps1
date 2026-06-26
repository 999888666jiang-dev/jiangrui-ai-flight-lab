param(
  [string]$Tag = "media-current",
  [string]$Repository = "jiangrui-ai-flight-lab",
  [string]$Owner = "",
  [string]$StagingDir = ".release-media"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI is not installed. Install it first, then run: gh auth login"
}

gh auth status | Out-Null

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path

if (-not $Owner) {
  try {
    $Owner = (gh repo view --json owner --jq ".owner.login" 2>$null)
  } catch {
    $Owner = ""
  }
}

if (-not $Owner) {
  $Owner = (gh api user --jq ".login")
}

if (-not $Owner) {
  throw "Cannot resolve GitHub owner. Pass -Owner explicitly."
}

$fullRepo = "$Owner/$Repository"

& (Join-Path $PSScriptRoot "generate-release-media-manifest.ps1")

$stagingPath = Join-Path $projectRoot $StagingDir
$resolvedRoot = (Resolve-Path -LiteralPath $projectRoot).Path
$resolvedStagingParent = (Resolve-Path -LiteralPath (Split-Path -Parent $stagingPath)).Path
if (-not $resolvedStagingParent.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to use staging path outside project root: $stagingPath"
}

if (Test-Path -LiteralPath $stagingPath) {
  $resolvedStaging = (Resolve-Path -LiteralPath $stagingPath).Path
  if (-not $resolvedStaging.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to delete staging path outside project root: $resolvedStaging"
  }
  Remove-Item -LiteralPath $resolvedStaging -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $stagingPath | Out-Null
$assets = New-Object System.Collections.Generic.List[string]

function Add-ReleaseAsset {
  param(
    [string]$SourcePath,
    [string]$AssetName
  )

  if (-not (Test-Path -LiteralPath $SourcePath)) {
    Write-Warning "Missing media source: $SourcePath"
    return
  }

  $target = Join-Path $stagingPath $AssetName
  Copy-Item -LiteralPath $SourcePath -Destination $target -Force
  $assets.Add($target)
}

Add-ReleaseAsset `
  -SourcePath (Join-Path $projectRoot "public/videos/fpv-lab-background.mp4") `
  -AssetName "video-bay__fpv-lab-background.mp4"

$groups = @(
  @{ Group = "fpv-flight-video"; Path = "public/media/fpv-flight-video" },
  @{ Group = "deal-results-showcase"; Path = "public/media/deal-results-showcase" }
)

foreach ($group in $groups) {
  $dir = Join-Path $projectRoot $group.Path
  if (-not (Test-Path -LiteralPath $dir)) {
    Write-Warning "Missing media folder: $dir"
    continue
  }

  Get-ChildItem -LiteralPath $dir -File |
    Where-Object { $_.Extension -match '^\.(mp4|m4v|mov|webm)$' } |
    Sort-Object Name |
    ForEach-Object {
      $assetName = "$($group.Group)__$($_.BaseName)$($_.Extension.ToLowerInvariant())"
      Add-ReleaseAsset -SourcePath $_.FullName -AssetName $assetName
    }
}

if ($assets.Count -eq 0) {
  throw "No media files found to upload."
}

$releaseExists = $true
try {
  gh release view $Tag --repo $fullRepo *> $null
  if ($LASTEXITCODE -ne 0) {
    $releaseExists = $false
  }
} catch {
  $releaseExists = $false
}

if (-not $releaseExists) {
  gh release create $Tag --repo $fullRepo --title "Media current" --notes "Rolling media assets for AI Flight Lab."
}

foreach ($asset in $assets) {
  $assetName = Split-Path -Leaf $asset
  Write-Host "Uploading $assetName ..."
  gh release upload $Tag $asset --repo $fullRepo --clobber
}

Write-Host "Uploaded $($assets.Count) media assets to $fullRepo release $Tag."
Write-Host "GitHub Pages builds will use VITE_GITHUB_OWNER=$Owner."
