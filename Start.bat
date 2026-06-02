@echo off
chcp 65001 >nul
title 玄灵界·元极天 — 众生皆在劫中

echo.
echo   ╔══════════════════════════════════╗
echo   ║   玄 灵 界 · 元 极 天           ║
echo   ║   众生皆在劫中                  ║
echo   ║   SillyTavern-style Xianxia RPG ║
echo   ╚══════════════════════════════════╝
echo.

:: Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到 Node.js，请先安装: https://nodejs.org
    pause
    exit /b 1
)

echo [1/3] 检查依赖...
if not exist "node_modules" (
    echo [安装] 正在安装依赖包...
    call npm install
)

echo [2/3] 构建项目...
call npm run build:all
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 构建失败，请检查错误信息
    pause
    exit /b 1
)

echo [3/3] 启动服务器...
echo.
echo   打开浏览器访问: http://localhost:8000
echo   按 Ctrl+C 停止服务器
echo.
node server/index.js

pause
