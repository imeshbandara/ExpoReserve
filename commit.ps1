$files = @(
  "backend/.env.example",
  "backend/package-lock.json",
  "backend/package.json",
  "backend/src/app.js",
  "backend/src/config/db.js",
  "backend/src/controllers/authController.js",
  "backend/src/controllers/userController.js",
  "backend/src/middlewares/authMiddleware.js",
  "backend/src/routes/authRoutes.js",
  "backend/src/routes/userRoutes.js",
  "backend/src/utils/validation.js",
  "frontend/src/pages/LoginPage.jsx",
  "backend/prisma/seed.js",
  "backend/prisma/setup.sql",
  "backend/src/config/oidc.js",
  "backend/src/controllers/adminController.js",
  "backend/src/controllers/exhibitionController.js",
  "backend/src/controllers/reservationController.js",
  "backend/src/middlewares/auditMiddleware.js"
)

for ($i=0; $i -lt 19; $i++) {
    $file = $files[$i]
    Write-Host "Committing file $file ($($i+1)/20)"
    git add $file
    git commit -m "Update $file"
    git push
}

Write-Host "Committing remaining files (20/20)"
git add -A
git commit -m "Refactor backend APIs and clean up legacy routes"
git push
