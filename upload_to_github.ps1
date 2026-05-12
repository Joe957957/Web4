# upload_to_github.ps1
# 互動式 PowerShell 腳本：協助把專案推到 GitHub
# 使用方式：在專案根目錄執行 .\upload_to_github.ps1

Write-Host "== GitHub 上傳助手 =="

$useGh = Read-Host "是否使用 GitHub CLI 建立 repo 並推送？(y/n)"
if ($useGh -match '^[Yy]') {
  $repoName = Read-Host "請輸入要建立的 GitHub repo 名稱 (例如: my-rail-fare-tracker)"
  Write-Host "建立並推送 repo：gh repo create $repoName --public --source=. --remote=origin --push"
  gh repo create $repoName --public --source=. --remote=origin --push
  if ($LASTEXITCODE -eq 0) {
    Write-Host "已成功建立並推送到 GitHub：$repoName" -ForegroundColor Green
  } else {
    Write-Host "gh 指令失敗，請確認 gh CLI 是否已安裝並登入，或改用手動 remote URL。" -ForegroundColor Yellow
  }
  exit
}

$remote = Read-Host "若你已有 remote URL，請貼上（例如：https://github.com/yourname/repo.git），否則留空並在稍後手動建立"

if (-not (Test-Path .git)) {
  git init
  Write-Host "已建立本地 git 倉庫。"
}

git add .
git commit -m "初始提交：台鐵票價觀察站" 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "注意：若先前已有 commit，跳過建立新 commit。" -ForegroundColor Yellow
}

git branch -M main 2>$null

if ($remote) {
  git remote add origin $remote 2>$null
  git push -u origin main
  if ($LASTEXITCODE -eq 0) {
    Write-Host "已成功推送到 $remote" -ForegroundColor Green
  } else {
    Write-Host "推送失敗，請檢查權限或使用 PAT/gh CLI。" -ForegroundColor Red
  }
} else {
  Write-Host "已建立本地倉庫，但未設定 remote。請至 GitHub 建立 repository，然後執行：" -ForegroundColor Cyan
  Write-Host "git remote add origin <YOUR_REMOTE_URL>" -ForegroundColor Cyan
  Write-Host "git push -u origin main" -ForegroundColor Cyan
}

Write-Host "完成。若需要我生成 GitHub repo（gh CLI），請先確保已登入 gh。"
