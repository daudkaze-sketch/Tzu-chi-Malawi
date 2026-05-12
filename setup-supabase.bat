@echo off
REM Tzu Chi Malawi - Supabase Setup Script for Windows

echo.
echo ================================
echo Supabase Connection Setup
echo ================================
echo.
echo IMPORTANT: You need to create a Supabase project first!
echo Go to https://supabase.com and create a new project
echo.
echo After creating your project, follow these steps:
echo.
echo 1. Get your connection string from Supabase:
echo    Dashboard ^-^> Settings ^-^> Database ^-^> Connection String (URI tab)
echo.
echo 2. Update your .env file with:
echo    DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"
echo.
echo 3. Then run these commands:
echo.
echo    npm install
echo    npx prisma generate
echo    npx prisma db push
echo.
echo 4. Start your development server:
echo    npm run dev
echo.
echo ================================
echo.
pause
echo.
echo Running dependency installation...
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Setup nearly complete!
echo.
echo Next steps:
echo 1. Update your .env file with the Supabase connection string
echo 2. Run: npx prisma db push
echo 3. Run: npm run dev
echo.
pause
