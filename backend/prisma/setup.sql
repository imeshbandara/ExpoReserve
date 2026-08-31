-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STALL_VENDOR', 'EXHIBITION_ORGANIZER');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StallType" AS ENUM ('STANDARD', 'PREMIUM', 'CORNER');

-- CreateEnum
CREATE TYPE "StallSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "oidc_sub" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "organization_name" TEXT,
    "avatar_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STALL_VENDOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibitions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "venue" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "max_stalls" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exhibitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "exhibition_id" TEXT NOT NULL,
    "reservation_date" TIMESTAMP(3) NOT NULL,
    "stall_type" "StallType" NOT NULL,
    "stall_size" "StallSize" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "business_category" TEXT NOT NULL,
    "special_requirements" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stall_inventory" (
    "id" TEXT NOT NULL,
    "exhibition_id" TEXT NOT NULL,
    "stall_type" "StallType" NOT NULL,
    "stall_size" "StallSize" NOT NULL,
    "total_count" INTEGER NOT NULL,
    "reserved_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stall_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "status" TEXT NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_oidc_sub_key" ON "users"("oidc_sub");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "exhibitions_organizer_id_idx" ON "exhibitions"("organizer_id");

-- CreateIndex
CREATE INDEX "exhibitions_start_date_end_date_idx" ON "exhibitions"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "reservations_exhibition_id_idx" ON "reservations"("exhibition_id");

-- CreateIndex
CREATE INDEX "reservations_vendor_id_idx" ON "reservations"("vendor_id");

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "reservations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_vendor_id_exhibition_id_key" ON "reservations"("vendor_id", "exhibition_id");

-- CreateIndex
CREATE UNIQUE INDEX "stall_inventory_exhibition_id_stall_type_stall_size_key" ON "stall_inventory"("exhibition_id", "stall_type", "stall_size");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- AddForeignKey
ALTER TABLE "exhibitions" ADD CONSTRAINT "exhibitions_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_exhibition_id_fkey" FOREIGN KEY ("exhibition_id") REFERENCES "exhibitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stall_inventory" ADD CONSTRAINT "stall_inventory_exhibition_id_fkey" FOREIGN KEY ("exhibition_id") REFERENCES "exhibitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
