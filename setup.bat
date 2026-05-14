@echo off
chcp 65001 >nul
echo.
echo === AutoPrevent — Setup inicial ===
echo.

:: Verificar que MySQL de XAMPP esta disponible
C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL no esta corriendo. Abre XAMPP y arranca MySQL primero.
    pause
    exit /b 1
)

echo [1/3] Importando esquema de base de datos...
C:\xampp\mysql\bin\mysql.exe -u root < database\schema.sql
if %errorlevel% neq 0 (
    echo ERROR: Fallo al importar schema.sql
    pause
    exit /b 1
)
echo       OK

echo [2/3] Importando datos iniciales...
C:\xampp\mysql\bin\mysql.exe -u root < database\seeds.sql
if %errorlevel% neq 0 (
    echo ERROR: Fallo al importar seeds.sql
    pause
    exit /b 1
)
echo       OK

echo [3/3] Instalando dependencias del frontend...
cd frontend
call npm install --silent
cd ..
echo       OK

echo.
echo Setup completado correctamente.
echo Ejecuta start.bat para arrancar la aplicacion.
echo.
pause
