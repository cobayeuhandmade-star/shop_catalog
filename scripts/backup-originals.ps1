# Sao lưu ảnh gốc: copy an toàn + tạo manifest SHA256 để kiểm tra toàn vẹn.
#
# Ví dụ:
#   powershell -ExecutionPolicy Bypass -File scripts\backup-originals.ps1 `
#     -Source "D:\BACKUP\anh-goc" -Destination "E:\BACKUP\anh-goc"
#
# Chạy lại lần 2 sẽ chỉ copy file mới/thay đổi và xác nhận "0 file cần copy".

param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$Destination,
  [switch]$SkipManifest
)

$ErrorActionPreference = "Stop"

function Get-Sha256Hex([string]$path) {
  $sha = [System.Security.Cryptography.SHA256]::Create()
  $stream = [System.IO.File]::OpenRead($path)
  try {
    $bytes = $sha.ComputeHash($stream)
  } finally {
    $stream.Dispose()
    $sha.Dispose()
  }
  return ([System.BitConverter]::ToString($bytes)).Replace("-", "")
}

function Format-Size($bytes) {
  if ($bytes -ge 1GB) { return "{0:N2} GB" -f ($bytes / 1GB) }
  if ($bytes -ge 1MB) { return "{0:N2} MB" -f ($bytes / 1MB) }
  if ($bytes -ge 1KB) { return "{0:N2} KB" -f ($bytes / 1KB) }
  return "$bytes B"
}

if (-not (Test-Path -LiteralPath $Source)) {
  Write-Error "Khong tim thay folder nguon: $Source"
}

$src = (Resolve-Path -LiteralPath $Source).Path
$dst = $Destination

if (-not (Test-Path -LiteralPath $dst)) {
  New-Item -ItemType Directory -Path $dst -Force | Out-Null
}

$imageExt = @(".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".bmp", ".heic", ".heif", ".tif", ".tiff")

Write-Host "=== BUOC 1: Copy file ===" -ForegroundColor Cyan
Write-Host "Nguon : $src"
Write-Host "Dich  : $dst"

# /MIR: dong bo (xoa file thua o dich) - chi dung khi dich la ban sao cua nguon
# /R:1 /W:1: khong retry vo han khi gap file loi
robocopy $src $dst /MIR /R:1 /W:1 /NP /NJH /NDL /NFL /TEE | Out-Null

$robocopyExit = $LASTEXITCODE
if ($robocopyExit -ge 8) {
  Write-Error "robocopy loi (ma $robocopyExit). Kiem tra o dia/dung luong."
}

Write-Host "Copy xong (ma robocopy: $robocopyExit)" -ForegroundColor Green

Write-Host ""
Write-Host "=== BUOC 2: Kiem tra ===" -ForegroundColor Cyan

$srcFiles = Get-ChildItem -LiteralPath $src -Recurse -File
$dstFiles = Get-ChildItem -LiteralPath $dst -Recurse -File

$srcCount = $srcFiles.Count
$dstCount = $dstFiles.Count
$srcSize = ($srcFiles | Measure-Object -Property Length -Sum).Sum
$dstSize = ($dstFiles | Measure-Object -Property Length -Sum).Sum
$srcImages = ($srcFiles | Where-Object { $imageExt -contains $_.Extension.ToLower() }).Count

Write-Host ("File nguon      : {0}" -f $srcCount)
Write-Host ("File dich       : {0}" -f $dstCount)
Write-Host ("Anh (nguon)     : {0}" -f $srcImages)
Write-Host ("Dung luong nguon: {0}" -f (Format-Size $srcSize))
Write-Host ("Dung luong dich : {0}" -f (Format-Size $dstSize))

if ($srcCount -ne $dstCount -or $srcSize -ne $dstSize) {
  Write-Warning "So file hoac dung luong KHONG khop. Chay lai script hoac kiem tra file dang mo."
} else {
  Write-Host "So file va dung luong khop." -ForegroundColor Green
}

if (-not $SkipManifest) {
  Write-Host ""
  Write-Host "=== BUOC 3: Tao manifest SHA256 (co the mat vai phut) ===" -ForegroundColor Cyan

  $manifestDir = Join-Path (Split-Path -Parent $dst) "_manifest"
  if (-not (Test-Path -LiteralPath $manifestDir)) {
    New-Item -ItemType Directory -Path $manifestDir -Force | Out-Null
  }
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $manifestPath = Join-Path $manifestDir "manifest-$stamp.csv"

  $rows = foreach ($f in $srcFiles) {
    $rel = $f.FullName.Substring($src.Length).TrimStart('\')
    $hash = Get-Sha256Hex $f.FullName
    [pscustomobject]@{
      relative_path = $rel
      size_bytes    = $f.Length
      sha256        = $hash
    }
  }

  $rows | Export-Csv -LiteralPath $manifestPath -NoTypeInformation -Encoding UTF8
  Write-Host "Manifest: $manifestPath" -ForegroundColor Green
  Write-Host ("Da ghi {0} dong" -f $rows.Count)
}

Write-Host ""
Write-Host "HOAN TAT. KHONG XOA BAN GOC." -ForegroundColor Yellow
