@echo off
chcp 65001 >nul
echo.
echo === AutoPrevent — Iniciando aplicacion ===
echo.

:: Verificar que MySQL esta corriendo (el backend lo necesita)
C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo AVISO: MySQL no esta corriendo. Abre XAMPP y arranca Apache y MySQL.
    pause
    exit /b 1
)

echo XAMPP OK — MySQL detectado.
echo.
echo Abre http://localhost:5173 en el navegador cuando aparezca el mensaje "ready".
echo Pulsa Ctrl+C para detener el servidor.
echo.

cd frontend
npm run dev
