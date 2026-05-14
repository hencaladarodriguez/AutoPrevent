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

echo [1/4] Detectando puerto de Apache...
set APACHE_PORT=0
netstat -an | findstr "0.0.0.0:80 " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 set APACHE_PORT=80
if %APACHE_PORT%==0 (
    netstat -an | findstr "0.0.0.0:81 " | findstr "LISTENING" >nul 2>&1
    if %errorlevel% equ 0 set APACHE_PORT=81
)
if %APACHE_PORT%==0 (
    echo No se detecto Apache en los puertos habituales ^(80, 81^).
    set /p APACHE_PORT="Introduce el puerto de Apache de tu XAMPP: "
)
echo       Puerto: %APACHE_PORT%
echo VITE_API_URL=http://localhost:%APACHE_PORT%/AutoPrevent/backend > frontend\.env.local
echo       .env.local generado correctamente

echo [2/4] Importando esquema de base de datos...
C:\xampp\mysql\bin\mysql.exe -u root < database\schema.sql
if %errorlevel% neq 0 (
    echo ERROR: Fallo al importar schema.sql
    pause
    exit /b 1
)
echo       OK

echo [3/4] Importando datos iniciales...
C:\xampp\mysql\bin\mysql.exe -u root < database\seeds.sql
if %errorlevel% neq 0 (
    echo ERROR: Fallo al importar seeds.sql
    pause
    exit /b 1
)
echo       OK

echo [4/4] Instalando dependencias del frontend...
cd frontend
call npm install --silent
cd ..
echo       OK

echo.
echo Setup completado correctamente.
echo Ejecuta start.bat para arrancar la aplicacion.
echo.
pause
