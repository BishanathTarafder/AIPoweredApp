# ai-powered-app

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

TO FIX vite :

# Clear Bun cache

bun pm cache rm

# Remove node_modules and lock files (PowerShell syntax)

Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force bun.lockb -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue

# Reinstall dependencies

bun install

TO FIX bun :

# Stop any processes that might be related

taskkill /F /IM bun.exe 2>$null

# Remove the existing Bun installation

Remove-Item -Recurse -Force "C:\Users\PRONAB\.bun" -ErrorAction SilentlyContinue

# Kill any remaining Bun processes

Get-Process | Where-Object { $\_.ProcessName -like "_bun_" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Fresh installation

powershell -c "irm bun.sh/install.ps1 | iex"
