param(
  [string]$VariantRoot = "public/media-variants",
  [string]$ManifestFile = "src/data/mediaVariantsManifest.ts",
  [string]$FfmpegPath = "",
  [string]$FfprobePath = "",
  [ValidateSet("copy", "standardize")]
  [string]$FullMode = "copy",
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$variantRootPath = Join-Path $projectRoot $VariantRoot
$manifestPath = Join-Path $projectRoot $ManifestFile
$cdnPrefix = "ai-flight-lab"

function Find-RequiredTool {
  param(
    [string]$Name,
    [string]$ExplicitPath,
    [string]$InstallHint
  )

  if ($ExplicitPath) {
    if (Test-Path -LiteralPath $ExplicitPath) {
      return (Resolve-Path -LiteralPath $ExplicitPath).Path
    }

    throw "$Name path does not exist: $ExplicitPath"
  }

  $command = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $command) {
    throw "$Name was not found. Install FFmpeg first. Windows options: winget install Gyan.FFmpeg or choco install ffmpeg. $InstallHint"
  }

  return $command.Source
}

function Get-ShortHash {
  param([string]$Path)

  return (Get-FileHash -Algorithm SHA256 -LiteralPath $Path).Hash.Substring(0, 12).ToLowerInvariant()
}

function Invoke-FFmpeg {
  param([string[]]$Arguments)

  & $script:ffmpeg @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed with exit code $LASTEXITCODE"
  }
}

function Test-NeedsOutput {
  param([string]$Path)

  if ($Force) {
    return $true
  }

  if (-not (Test-Path -LiteralPath $Path)) {
    return $true
  }

  return (Get-Item -LiteralPath $Path).Length -le 0
}

function Read-VideoMetadata {
  param([string]$Path)

  $raw = & $script:ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration -of json $Path | Out-String
  if ($LASTEXITCODE -ne 0) {
    throw "ffprobe failed for $Path"
  }

  $json = $raw | ConvertFrom-Json
  $stream = @($json.streams)[0]
  $duration = 0
  if ($json.format.duration) {
    [double]::TryParse([string]$json.format.duration, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$duration) | Out-Null
  }

  return [pscustomobject]@{
    Width = [int]$stream.width
    Height = [int]$stream.height
    Duration = [math]::Round($duration, 2)
  }
}

function Add-MediaInput {
  param(
    [System.Collections.Generic.List[object]]$List,
    [string]$Group,
    [string]$Id,
    [string]$Path
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return
  }

  $List.Add([pscustomobject]@{
    Key = "$Group/$Id"
    Group = $Group
    Id = $Id
    SourcePath = (Resolve-Path -LiteralPath $Path).Path
  })
}

function Escape-TsString {
  param([string]$Value)

  return $Value.Replace("\", "\\").Replace("'", "\'")
}

$script:ffmpeg = Find-RequiredTool -Name "ffmpeg" -ExplicitPath $FfmpegPath -InstallHint "Reopen PowerShell after installation so PATH is refreshed."
$script:ffprobe = Find-RequiredTool -Name "ffprobe" -ExplicitPath $FfprobePath -InstallHint "ffprobe is bundled with FFmpeg."

$inputs = New-Object System.Collections.Generic.List[object]
Add-MediaInput -List $inputs -Group "video-bay" -Id "fpv-lab-background" -Path (Join-Path $projectRoot "public/videos/fpv-lab-background.mp4")

$showcaseGroups = @(
  @{ Group = "fpv-flight-video"; Path = "public/media/fpv-flight-video" },
  @{ Group = "deal-results-showcase"; Path = "public/media/deal-results-showcase" }
)

foreach ($group in $showcaseGroups) {
  $dir = Join-Path $projectRoot $group.Path
  if (-not (Test-Path -LiteralPath $dir)) {
    Write-Warning "Missing media folder: $dir"
    continue
  }

  Get-ChildItem -LiteralPath $dir -File |
    Where-Object { $_.Extension -match '^\.(mp4|m4v|mov|webm)$' } |
    Sort-Object Name |
    ForEach-Object {
      Add-MediaInput -List $inputs -Group $group.Group -Id $_.BaseName -Path $_.FullName
    }
}

if ($inputs.Count -eq 0) {
  throw "No source videos found under public/videos or public/media."
}

New-Item -ItemType Directory -Force -Path $variantRootPath | Out-Null

$entries = New-Object System.Collections.Generic.List[object]
$versions = [ordered]@{}

foreach ($input in $inputs) {
  $hash = Get-ShortHash -Path $input.SourcePath
  $metadata = Read-VideoMetadata -Path $input.SourcePath
  $outDir = Join-Path $variantRootPath (Join-Path $cdnPrefix (Join-Path $input.Group $input.Id))
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null

  $posterName = "$($input.Id).poster.$hash.webp"
  $previewName = "$($input.Id).preview.$hash.mp4"
  $fullName = "$($input.Id).full.$hash.mp4"

  $posterPath = Join-Path $outDir $posterName
  $previewPath = Join-Path $outDir $previewName
  $fullPath = Join-Path $outDir $fullName

  if (Test-NeedsOutput -Path $posterPath) {
    Invoke-FFmpeg -Arguments @(
      "-y", "-ss", "00:00:01", "-i", $input.SourcePath,
      "-frames:v", "1",
      "-vf", "scale=w='trunc(min(1280,iw)/2)*2':h=-2",
      "-q:v", "70",
      $posterPath
    )
  }

  if (Test-NeedsOutput -Path $previewPath) {
    Invoke-FFmpeg -Arguments @(
      "-y", "-i", $input.SourcePath,
      "-map", "0:v:0", "-map", "0:a?",
      "-vf", "scale=w='trunc(min(1280,iw)/2)*2':h=-2",
      "-c:v", "libx264",
      "-profile:v", "main",
      "-preset", "medium",
      "-crf", "28",
      "-maxrate", "900k",
      "-bufsize", "1800k",
      "-r", "25",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-c:a", "aac",
      "-b:a", "48k",
      "-ac", "2",
      $previewPath
    )
  }

  if (Test-NeedsOutput -Path $fullPath) {
    if ($FullMode -eq "standardize") {
      Invoke-FFmpeg -Arguments @(
        "-y", "-i", $input.SourcePath,
        "-map", "0:v:0", "-map", "0:a?",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-b:a", "128k",
        "-ac", "2",
        $fullPath
      )
    } else {
      try {
        Invoke-FFmpeg -Arguments @(
          "-y", "-i", $input.SourcePath,
          "-map", "0",
          "-c", "copy",
          "-movflags", "+faststart",
          $fullPath
        )
      } catch {
        if ([System.IO.Path]::GetExtension($input.SourcePath).ToLowerInvariant() -ne ".mp4") {
          throw
        }
        Write-Warning "Remux failed for $($input.SourcePath). Copying the MP4 as full fallback."
        Copy-Item -LiteralPath $input.SourcePath -Destination $fullPath -Force
      }
    }
  }

  $posterAsset = "$cdnPrefix/$($input.Group)/$($input.Id)/$posterName"
  $previewAsset = "$cdnPrefix/$($input.Group)/$($input.Id)/$previewName"
  $fullAsset = "$cdnPrefix/$($input.Group)/$($input.Id)/$fullName"
  $releasePosterAsset = "$($input.Group)__$($input.Id)__poster.webp"
  $releasePreviewAsset = "$($input.Group)__$($input.Id)__preview.mp4"
  $releaseFullAsset = "$($input.Group)__$($input.Id)__full.mp4"

  foreach ($asset in @($posterAsset, $previewAsset, $fullAsset, $releasePosterAsset, $releasePreviewAsset, $releaseFullAsset)) {
    $versions[$asset] = $hash
  }

  $entries.Add([pscustomobject]@{
    Key = $input.Key
    Group = $input.Group
    Id = $input.Id
    PosterAsset = $posterAsset
    PreviewAsset = $previewAsset
    FullAsset = $fullAsset
    ReleasePosterAsset = $releasePosterAsset
    ReleasePreviewAsset = $releasePreviewAsset
    ReleaseFullAsset = $releaseFullAsset
    Width = $metadata.Width
    Height = $metadata.Height
    Duration = $metadata.Duration
    VariantHash = $hash
  })
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("// Generated by scripts/prepare-media-variants.ps1. Do not edit by hand.")
$lines.Add("export const mediaVariantVersionByAsset: Record<string, string> = {")
foreach ($key in ($versions.Keys | Sort-Object)) {
  $lines.Add("  '$(Escape-TsString $key)': '$(Escape-TsString $versions[$key])',")
}
$lines.Add("};")
$lines.Add("")
$lines.Add("export type MediaVariantManifestEntry = {")
$lines.Add("  key: string;")
$lines.Add("  group: string;")
$lines.Add("  id: string;")
$lines.Add("  posterAsset?: string;")
$lines.Add("  previewAsset?: string;")
$lines.Add("  fullAsset?: string;")
$lines.Add("  releasePosterAsset?: string;")
$lines.Add("  releasePreviewAsset?: string;")
$lines.Add("  releaseFullAsset?: string;")
$lines.Add("  width?: number;")
$lines.Add("  height?: number;")
$lines.Add("  duration?: number;")
$lines.Add("  variantHash?: string;")
$lines.Add("};")
$lines.Add("")
$lines.Add("export const mediaVariantManifest: Record<string, MediaVariantManifestEntry> = {")
foreach ($entry in ($entries | Sort-Object Key)) {
  $lines.Add("  '$(Escape-TsString $entry.Key)': {")
  $lines.Add("    key: '$(Escape-TsString $entry.Key)',")
  $lines.Add("    group: '$(Escape-TsString $entry.Group)',")
  $lines.Add("    id: '$(Escape-TsString $entry.Id)',")
  $lines.Add("    posterAsset: '$(Escape-TsString $entry.PosterAsset)',")
  $lines.Add("    previewAsset: '$(Escape-TsString $entry.PreviewAsset)',")
  $lines.Add("    fullAsset: '$(Escape-TsString $entry.FullAsset)',")
  $lines.Add("    releasePosterAsset: '$(Escape-TsString $entry.ReleasePosterAsset)',")
  $lines.Add("    releasePreviewAsset: '$(Escape-TsString $entry.ReleasePreviewAsset)',")
  $lines.Add("    releaseFullAsset: '$(Escape-TsString $entry.ReleaseFullAsset)',")
  $lines.Add("    width: $($entry.Width),")
  $lines.Add("    height: $($entry.Height),")
  $lines.Add("    duration: $($entry.Duration.ToString([Globalization.CultureInfo]::InvariantCulture)),")
  $lines.Add("    variantHash: '$(Escape-TsString $entry.VariantHash)',")
  $lines.Add("  },")
}
$lines.Add("};")

$manifestDir = Split-Path -Parent $manifestPath
New-Item -ItemType Directory -Force -Path $manifestDir | Out-Null
Set-Content -LiteralPath $manifestPath -Value $lines -Encoding UTF8

Write-Host "Generated $($entries.Count) media variant entries."
Write-Host "Manifest: $ManifestFile"
Write-Host "Variants: $VariantRoot/$cdnPrefix"
