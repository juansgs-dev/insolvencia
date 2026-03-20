ALTER TABLE "insolvencia"."documents"
ADD COLUMN "document_type" VARCHAR(50) NOT NULL DEFAULT 'last_pay_stub',
ADD COLUMN "description" TEXT,
ADD COLUMN "occupation" VARCHAR(150) NOT NULL DEFAULT '',
ADD COLUMN "has_assets" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "has_payroll_loans" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "creditor_count" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "delinquency_time" VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN "has_embargoes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "total_debt_capital" DECIMAL(15,2) NOT NULL DEFAULT 1.00;
