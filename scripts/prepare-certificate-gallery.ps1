param(
  [string]$SourceRoot = "",
  [string]$OutputRoot = "public/certificates",
  [string]$ManifestFile = "src/data/certificatesManifest.ts",
  [int]$Dpi = 180,
  [int]$ThumbDpi = 60,
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
if (-not $SourceRoot) {
  $resourcePackageName = -join (@(0x4E2A, 0x4EBA, 0x4FE1, 0x606F, 0x8D44, 0x6E90, 0x5305) | ForEach-Object { [char]$_ })
  $certificateFolderName = -join (@(0x8BC1, 0x4E66, 0x4E0E, 0x8363, 0x8A89) | ForEach-Object { [char]$_ })
  $SourceRoot = Join-Path (Join-Path $projectRoot $resourcePackageName) $certificateFolderName
}

$sourceRootPath = (Resolve-Path -LiteralPath $SourceRoot).Path
$outputRootPath = Join-Path $projectRoot $OutputRoot
$manifestPath = Join-Path $projectRoot $ManifestFile
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) "ai-flight-lab-certificate-pdf-work"
$publicRoot = Join-Path $projectRoot "public"

$popplerRoot = Join-Path $env:USERPROFILE ".cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin"
$pdfinfo = Join-Path $popplerRoot "pdfinfo.exe"
$pdftoppm = Join-Path $popplerRoot "pdftoppm.exe"

if (-not (Test-Path -LiteralPath $pdfinfo)) {
  throw "pdfinfo.exe was not found: $pdfinfo"
}

if (-not (Test-Path -LiteralPath $pdftoppm)) {
  throw "pdftoppm.exe was not found: $pdftoppm"
}

function Assert-InProject {
  param([string]$Path)

  $full = [System.IO.Path]::GetFullPath($Path)
  $root = [System.IO.Path]::GetFullPath($projectRoot)
  if (-not $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to write outside project root: $full"
  }
}

function Assert-SafeTemp {
  param([string]$Path)

  $full = [System.IO.Path]::GetFullPath($Path)
  $temp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
  if (-not $full.StartsWith($temp, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to use temp path outside system temp: $full"
  }
  if (-not $full.EndsWith("ai-flight-lab-certificate-pdf-work", [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Unexpected temp directory name: $full"
  }
}

function Get-SafeTitle {
  param([string]$FileName)

  $title = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
  $title = $title -replace "[_]+", " "
  $title = $title -replace "\s+", " "
  return $title.Trim()
}

function Read-PdfInfo {
  param([string]$PdfPath)

  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  $raw = & $pdfinfo $PdfPath 2>$null
  $exitCode = $LASTEXITCODE
  $ErrorActionPreference = $previousErrorActionPreference

  if ($exitCode -ne 0) {
    throw "pdfinfo failed for $PdfPath"
  }

  $pages = 1
  $rotation = 0
  $pageSize = ""

  foreach ($line in $raw) {
    if ($line -match "^Pages:\s+(\d+)") {
      $pages = [int]$Matches[1]
    }
    if ($line -match "^Page rot:\s+(-?\d+)") {
      $rotation = [int]$Matches[1]
    }
    if ($line -match "^Page size:\s+(.+)$") {
      $pageSize = $Matches[1].Trim()
    }
  }

  return [PSCustomObject]@{
    Pages = $pages
    Rotation = $rotation
    PageSize = $pageSize
  }
}

function ConvertTo-TsString {
  param([string]$Value)

  return ($Value | ConvertTo-Json -Compress)
}

Assert-InProject $outputRootPath
Assert-InProject $manifestPath
Assert-SafeTemp $tempRoot

if ($Force -and (Test-Path -LiteralPath $outputRootPath)) {
  $resolvedOutput = (Resolve-Path -LiteralPath $outputRootPath).Path
  if (-not $resolvedOutput.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove outside project root: $resolvedOutput"
  }
  Remove-Item -LiteralPath $resolvedOutput -Recurse -Force
}

if (Test-Path -LiteralPath $tempRoot) {
  $resolvedTemp = (Resolve-Path -LiteralPath $tempRoot).Path
  Assert-SafeTemp $resolvedTemp
  Remove-Item -LiteralPath $resolvedTemp -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $outputRootPath | Out-Null
New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $manifestPath) | Out-Null

$pdfs = Get-ChildItem -LiteralPath $sourceRootPath -Filter "*.pdf" -File | Sort-Object Name
if ($pdfs.Count -eq 0) {
  Write-Warning "No PDF files found in $sourceRootPath"
}

$items = New-Object System.Collections.Generic.List[object]
$index = 0

foreach ($pdf in $pdfs) {
  $index += 1
  $id = "cert-{0:D3}" -f $index
  $targetDir = Join-Path $outputRootPath $id
  New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

  $tempPdf = Join-Path $tempRoot "$id.pdf"
  Copy-Item -LiteralPath $pdf.FullName -Destination $tempPdf -Force
  $info = Read-PdfInfo -PdfPath $tempPdf
  $coverFile = Join-Path $targetDir "cover.png"

  if ($Force -or -not (Test-Path -LiteralPath $coverFile) -or (Get-Item -LiteralPath $coverFile).Length -le 0) {
    $coverPrefix = Join-Path $targetDir "cover"
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & $pdftoppm -r $ThumbDpi -png -f 1 -l 1 $tempPdf $coverPrefix 2>$null
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousErrorActionPreference

    if ($exitCode -ne 0) {
      throw "pdftoppm failed for $($pdf.Name) cover"
    }

    $generatedCover = Get-ChildItem -LiteralPath $targetDir -Filter "cover-*.png" | Select-Object -First 1
    if (-not $generatedCover) {
      throw "pdftoppm did not create a cover image for $($pdf.Name)"
    }

    Move-Item -LiteralPath $generatedCover.FullName -Destination $coverFile -Force
  }

  $coverRelative = ($coverFile.Substring($publicRoot.Length).TrimStart("\") -replace "\\", "/")

  $pages = New-Object System.Collections.Generic.List[string]
  for ($page = 1; $page -le $info.Pages; $page += 1) {
    $pageName = "page-{0:D3}" -f $page
    $outputFile = Join-Path $targetDir "$pageName.png"

    if ($Force -or -not (Test-Path -LiteralPath $outputFile) -or (Get-Item -LiteralPath $outputFile).Length -le 0) {
      $prefix = Join-Path $targetDir $pageName
      $previousErrorActionPreference = $ErrorActionPreference
      $ErrorActionPreference = "Continue"
      & $pdftoppm -r $Dpi -png -f $page -l $page $tempPdf $prefix 2>$null
      $exitCode = $LASTEXITCODE
      $ErrorActionPreference = $previousErrorActionPreference

      if ($exitCode -ne 0) {
        throw "pdftoppm failed for $($pdf.Name) page $page"
      }

      $generated = Get-ChildItem -LiteralPath $targetDir -Filter "$pageName-*.png" | Select-Object -First 1
      if (-not $generated) {
        throw "pdftoppm did not create an image for $($pdf.Name) page $page"
      }

      Move-Item -LiteralPath $generated.FullName -Destination $outputFile -Force
    }

    $relative = ($outputFile.Substring($publicRoot.Length).TrimStart("\") -replace "\\", "/")
    $pages.Add($relative)
  }

  $items.Add([PSCustomObject]@{
    id = $id
    title = Get-SafeTitle -FileName $pdf.Name
    sourceName = $pdf.Name
    cover = $coverRelative
    pageCount = $info.Pages
    rotation = $info.Rotation
    pageSize = $info.PageSize
    sizeKB = [math]::Round($pdf.Length / 1KB, 1)
    pages = @($pages)
  }) | Out-Null
}

$json = $items | ConvertTo-Json -Depth 6
if (-not $json) {
  $json = "[]"
}

$manifest = @"
import { publicAsset } from '../utils/publicAsset';

export type CertificateGalleryItem = {
  id: string;
  title: string;
  sourceName: string;
  cover: string;
  pageCount: number;
  rotation: number;
  pageSize: string;
  sizeKB: number;
  pages: string[];
};

const rawCertificates = $json as const;

export const certificateGalleryItems: CertificateGalleryItem[] = rawCertificates.map((item) => ({
  ...item,
  cover: publicAsset(item.cover),
  pages: item.pages.map((page) => publicAsset(page)),
}));

export function getCertificateById(id: string) {
  return certificateGalleryItems.find((item) => item.id === id);
}
"@

[System.IO.File]::WriteAllText($manifestPath, $manifest, [System.Text.UTF8Encoding]::new($false))

if (Test-Path -LiteralPath $tempRoot) {
  Remove-Item -LiteralPath $tempRoot -Recurse -Force
}

Write-Host "Generated $($items.Count) certificate entries in $ManifestFile"
