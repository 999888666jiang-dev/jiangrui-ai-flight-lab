param(
  [Parameter(Mandatory = $true)]
  [string]$Bucket,
  [Parameter(Mandatory = $true)]
  [string]$Region,
  [string]$Prefix = "ai-flight-lab",
  [string]$SourceRoot = "public/media-variants/ai-flight-lab",
  [string]$CdnBaseUrl = $env:VITE_MEDIA_CDN_BASE_URL,
  [string]$ReportFile = "",
  [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$sourcePath = Join-Path $projectRoot $SourceRoot

if (-not (Get-Command coscli -ErrorAction SilentlyContinue)) {
  throw "coscli was not found. Install Tencent COSCLI and login/configure it before uploading CDN media."
}

if (-not (Test-Path -LiteralPath $sourcePath)) {
  throw "Variant source folder not found: $SourceRoot. Run scripts/prepare-media-variants.ps1 first."
}

if (-not $env:TENCENT_SECRET_ID -or -not $env:TENCENT_SECRET_KEY) {
  throw "Missing TENCENT_SECRET_ID or TENCENT_SECRET_KEY environment variables."
}

function Normalize-UrlBase {
  param([string]$Value)

  if (-not $Value) {
    return ""
  }

  return $Value.Trim().TrimEnd("/")
}

function Test-CdnAssetExists {
  param(
    [string]$BaseUrl,
    [string]$ObjectKey
  )

  $base = Normalize-UrlBase $BaseUrl
  if (-not $base) {
    return $false
  }

  $url = "$base/$ObjectKey"
  try {
    $response = Invoke-WebRequest -Method Head -Uri $url -TimeoutSec 15 -MaximumRedirection 5 -ErrorAction Stop
    return [int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 300
  } catch {
    return $false
  }
}

function Get-ContentType {
  param([string]$Path)

  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".webp" { return "image/webp" }
    ".mp4" { return "video/mp4" }
    ".m4v" { return "video/mp4" }
    ".mov" { return "video/quicktime" }
    default { return "application/octet-stream" }
  }
}

if (-not $ReportFile) {
  $ReportFile = Join-Path $projectRoot ("测试截图/cdn-media-upload-" + (Get-Date -Format "yyyy-MM-dd") + "/upload-result.json")
} elseif (-not [System.IO.Path]::IsPathRooted($ReportFile)) {
  $ReportFile = Join-Path $projectRoot $ReportFile
}

$files = @(Get-ChildItem -LiteralPath $sourcePath -Recurse -File |
  Where-Object { $_.Extension -match '^\.(webp|mp4|m4v|mov)$' } |
  Sort-Object FullName)

if ($files.Count -eq 0) {
  throw "No poster/preview/full files found in $SourceRoot."
}

$sourceRootResolved = (Resolve-Path -LiteralPath $sourcePath).Path
$results = New-Object System.Collections.Generic.List[object]

foreach ($file in $files) {
  $relative = $file.FullName.Substring($sourceRootResolved.Length).TrimStart([char[]]@('\', '/')) -replace "\\", "/"
  $objectKey = "$Prefix/$relative"
  $cdnUrl = if ($CdnBaseUrl) { "$(Normalize-UrlBase $CdnBaseUrl)/$objectKey" } else { $null }
  $exists = Test-CdnAssetExists -BaseUrl $CdnBaseUrl -ObjectKey $objectKey

  if ($exists) {
    Write-Host "Skip existing CDN asset: $objectKey"
    $status = "skipped-existing"
  } elseif ($WhatIf) {
    Write-Host "WhatIf upload: $objectKey"
    $status = "what-if"
  } else {
    Write-Host "Uploading $objectKey ..."
    $destination = "cos://$Bucket/$objectKey"
    & coscli cp $file.FullName $destination -r $Region -e "cos.$Region.myqcloud.com" -i $env:TENCENT_SECRET_ID -k $env:TENCENT_SECRET_KEY --init-skip=true
    if ($LASTEXITCODE -ne 0) {
      throw "coscli upload failed for $objectKey"
    }
    $status = "uploaded"
  }

  $results.Add([pscustomobject]@{
    objectKey = $objectKey
    cdnUrl = $cdnUrl
    sizeBytes = $file.Length
    contentType = Get-ContentType -Path $file.FullName
    status = $status
  })
}

$report = [pscustomobject]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  bucket = $Bucket
  region = $Region
  prefix = $Prefix
  cdnBaseUrlConfigured = [bool](Normalize-UrlBase $CdnBaseUrl)
  notes = @(
    "CDN must allow GET and HEAD.",
    "CORS should allow Range and expose Accept-Ranges, Content-Length, Content-Range.",
    "Hash-named media files should use long cache validity at CDN level."
  )
  files = $results
}

$reportDir = Split-Path -Parent $ReportFile
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $ReportFile -Encoding UTF8

Write-Host "CDN upload report: $ReportFile"
