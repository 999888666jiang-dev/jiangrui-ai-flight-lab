param(
  [string]$SourceRoot = "",
  [string]$OutputRoot = "public/ai-design-gallery",
  [string]$ManifestFile = "src/data/aiDesignGalleryManifest.ts",
  [string]$FfmpegPath = "",
  [string]$FfprobePath = "",
  [int]$ThumbWidth = 520,
  [int]$DisplayWidth = 1280,
  [int]$FullWidth = 1920,
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
if (-not $SourceRoot) {
  $resourcePackageName = -join (@(0x4E2A, 0x4EBA, 0x4FE1, 0x606F, 0x8D44, 0x6E90, 0x5305) | ForEach-Object { [char]$_ })
  $aiFolderName = -join (@(0x0041, 0x0049, 0x8BBE, 0x8BA1, 0x4F5C, 0x54C1) | ForEach-Object { [char]$_ })
  $SourceRoot = Join-Path (Join-Path $projectRoot $resourcePackageName) $aiFolderName
}

$sourceRootPath = (Resolve-Path -LiteralPath $SourceRoot).Path
$outputRootPath = Join-Path $projectRoot $OutputRoot
$manifestPath = Join-Path $projectRoot $ManifestFile
$publicRoot = Join-Path $projectRoot "public"

function Assert-InProject {
  param([string]$Path)

  $full = [System.IO.Path]::GetFullPath($Path)
  $root = [System.IO.Path]::GetFullPath($projectRoot)
  if (-not $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to write outside project root: $full"
  }
}

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
    throw "$Name was not found. $InstallHint"
  }

  return $command.Source
}

function Get-SafeTitle {
  param([string]$FileName)

  $title = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
  $title = $title -replace "[_]+", " "
  $title = $title -replace "\s+", " "
  return $title.Trim()
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

function Invoke-FFmpeg {
  param([string[]]$Arguments)

  & $script:ffmpeg @("-v", "error") @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed with exit code $LASTEXITCODE"
  }
}

function Read-ImageMetadata {
  param([string]$Path)

  $raw = & $script:ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of json $Path | Out-String
  if ($LASTEXITCODE -ne 0) {
    throw "ffprobe failed for $Path"
  }

  $json = $raw | ConvertFrom-Json
  $stream = @($json.streams)[0]

  return [pscustomobject]@{
    Width = [int]$stream.width
    Height = [int]$stream.height
  }
}

function ConvertTo-PublicPath {
  param([string]$Path)

  return ($Path.Substring($publicRoot.Length).TrimStart("\") -replace "\\", "/")
}

function Write-WebpVariant {
  param(
    [string]$SourcePath,
    [string]$OutputPath,
    [int]$MaxWidth,
    [int]$Quality
  )

  if (-not (Test-NeedsOutput -Path $OutputPath)) {
    return
  }

  Invoke-FFmpeg -Arguments @(
    "-y",
    "-i", $SourcePath,
    "-frames:v", "1",
    "-vf", "scale=w='trunc(min($MaxWidth,iw)/2)*2':h=-2",
    "-c:v", "libwebp",
    "-quality", "$Quality",
    "-compression_level", "5",
    "-map_metadata", "-1",
    $OutputPath
  )
}

Assert-InProject $outputRootPath
Assert-InProject $manifestPath

$script:ffmpeg = Find-RequiredTool -Name "ffmpeg" -ExplicitPath $FfmpegPath -InstallHint "Install FFmpeg first. Windows options: winget install Gyan.FFmpeg or choco install ffmpeg."
$script:ffprobe = Find-RequiredTool -Name "ffprobe" -ExplicitPath $FfprobePath -InstallHint "ffprobe is bundled with FFmpeg."
$aiDesignZh = -join (@(0x0041, 0x0049, 0x0020, 0x8BBE, 0x8BA1, 0x4F5C, 0x54C1) | ForEach-Object { [char]$_ })

if ($Force -and (Test-Path -LiteralPath $outputRootPath)) {
  $resolvedOutput = (Resolve-Path -LiteralPath $outputRootPath).Path
  if (-not $resolvedOutput.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove outside project root: $resolvedOutput"
  }
  Remove-Item -LiteralPath $resolvedOutput -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $outputRootPath | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $manifestPath) | Out-Null

$imageExtensions = @(".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif")
$images = Get-ChildItem -LiteralPath $sourceRootPath -File |
  Where-Object { $imageExtensions -contains $_.Extension.ToLowerInvariant() } |
  Sort-Object Name

$ignoredVideos = Get-ChildItem -LiteralPath $sourceRootPath -File |
  Where-Object { $_.Extension -match '^\.(mp4|m4v|mov|webm)$' }

if ($ignoredVideos.Count -gt 0) {
  Write-Host "Ignoring $($ignoredVideos.Count) video file(s) in AI design source folder."
}

if ($images.Count -eq 0) {
  Write-Warning "No image files found in $sourceRootPath"
}

$items = New-Object System.Collections.Generic.List[object]
$index = 0

foreach ($image in $images) {
  $index += 1
  $id = "ai-work-{0:D3}" -f $index
  $targetDir = Join-Path $outputRootPath $id
  New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

  $metadata = Read-ImageMetadata -Path $image.FullName
  $thumbFile = Join-Path $targetDir "thumb.webp"
  $displayFile = Join-Path $targetDir "display.webp"
  $fullFile = Join-Path $targetDir "full.webp"

  Write-WebpVariant -SourcePath $image.FullName -OutputPath $thumbFile -MaxWidth $ThumbWidth -Quality 64
  Write-WebpVariant -SourcePath $image.FullName -OutputPath $displayFile -MaxWidth $DisplayWidth -Quality 72
  Write-WebpVariant -SourcePath $image.FullName -OutputPath $fullFile -MaxWidth $FullWidth -Quality 80

  $safeTitle = Get-SafeTitle -FileName $image.Name
  $items.Add([pscustomobject]@{
    id = $id
    title = @{
      zh = "$aiDesignZh {0:D2}" -f $index
      en = "AI design work {0:D2}" -f $index
    }
    sourceName = $image.Name
    sizeMB = [math]::Round($image.Length / 1MB, 2)
    category = "archive"
    thumbSrc = ConvertTo-PublicPath -Path $thumbFile
    displaySrc = ConvertTo-PublicPath -Path $displayFile
    fullSrc = ConvertTo-PublicPath -Path $fullFile
    width = $metadata.Width
    height = $metadata.Height
    featured = ($index -le 8)
    sourceTitle = $safeTitle
  }) | Out-Null
}

$json = $items | ConvertTo-Json -Depth 8
if (-not $json) {
  $json = "[]"
}

$manifest = @"
import { publicAsset } from '../utils/publicAsset';
import { aiDesignGalleryOverrides } from './aiDesignGalleryOverrides';

export type AiDesignCategory = 'prototype' | 'visual' | 'workflow' | 'archive';

export type AiDesignWork = {
  id: string;
  title: {
    zh: string;
    en: string;
  };
  sourceName: string;
  sizeMB: number;
  category: AiDesignCategory;
  thumbSrc: string;
  displaySrc: string;
  fullSrc: string;
  width?: number;
  height?: number;
  featured?: boolean;
  sourceTitle?: string;
};

const rawAiDesignWorks = $json as const;

export const aiDesignWorks: AiDesignWork[] = rawAiDesignWorks.map((item) => {
  const override = aiDesignGalleryOverrides[item.id];

  return {
    ...item,
    ...override,
    title: override?.title ?? item.title,
    category: override?.category ?? item.category,
    featured: override?.featured ?? item.featured,
    thumbSrc: publicAsset(item.thumbSrc),
    displaySrc: publicAsset(item.displaySrc),
    fullSrc: publicAsset(item.fullSrc),
  };
});

export function getAiDesignWorkById(id: string) {
  return aiDesignWorks.find((item) => item.id === id);
}
"@

[System.IO.File]::WriteAllText($manifestPath, $manifest, [System.Text.UTF8Encoding]::new($false))

Write-Host "Generated $($items.Count) AI design gallery entries in $ManifestFile"
