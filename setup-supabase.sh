#!/bin/bash

# Tzu Chi Malawi - Supabase Setup Script
# This script helps you connect your database to Supabase

echo "================================"
echo "Supabase Connection Setup"
echo "================================"
echo ""
echo "IMPORTANT: You need to create a Supabase project first!"
echo "Go to https://supabase.com and create a new project"
echo ""
echo "After creating your project, follow these steps:"
echo ""
echo "1. Get your connection string from Supabase:"
echo "   Dashboard → Settings → Database → Connection String (URI tab)"
echo ""
echo "2. Update your .env file with:"
echo "   DATABASE_URL=\"postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public\""
echo ""
echo "3. Then run these commands:"
echo ""
echo "   npm install"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo ""
echo "4. Start your development server:"
echo "   npm run dev"
echo ""
echo "================================"
echo ""
read -p "Press Enter when you have updated your .env file..."
echo ""
echo "Running dependency installation..."
npm install

echo ""
echo "Generating Prisma client..."
npx prisma generate

echo ""
echo "Checking database connection..."
npx prisma db execute --stdin < /dev/null && echo "✅ Database connection successful!" || echo "❌ Database connection failed. Check your .env file!"

echo ""
echo "Would you like to push the schema to Supabase now? (yes/no)"
read -p "Enter your choice: " choice

if [ "$choice" = "yes" ] || [ "$choice" = "y" ]; then
  echo "Pushing schema to Supabase..."
  npx prisma db push
  echo ""
  echo "✅ Setup complete! Your tables are now in Supabase."
  echo "Run 'npm run dev' to start your application."
else
  echo "Skipped schema push. You can run 'npx prisma db push' manually later."
fi
