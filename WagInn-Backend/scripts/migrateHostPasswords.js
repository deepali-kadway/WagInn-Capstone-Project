/**
 * Migration Script: Convert Legacy Host Passwords to Bcrypt Hashes
 * Run this script once to migrate existing numeric passcodes to secure bcrypt hashes
 *
 * Usage: node scripts/migrateHostPasswords.js
 */

import bcrypt from "bcrypt";
import sequelize from "../config.js";
import Host from "../models/hostRegistration_Model.js";
import { Op } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = 12;
const BATCH_SIZE = 50; // Process hosts in batches to avoid memory issues

async function migrateHostPasswords() {
  console.log("🔐 Starting host password migration...");

  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Create backup table for safety
    await createBackupTable();

    // Find hosts with numeric passcodes (legacy format)
    const hosts = await Host.findAll({
      where: {
        passCode: {
          [Op.regexp]: "^[0-9]+$", // MySQL regex for numeric-only strings
        },
      },
      attributes: ["id", "email", "passCode", "firstName", "lastName"],
    });

    console.log(`📊 Found ${hosts.length} hosts with legacy numeric passcodes`);

    if (hosts.length === 0) {
      console.log("✅ No hosts require password migration");
      return;
    }

    // Process in batches
    let processed = 0;
    let errors = 0;

    for (let i = 0; i < hosts.length; i += BATCH_SIZE) {
      const batch = hosts.slice(i, i + BATCH_SIZE);
      console.log(
        `📝 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(hosts.length / BATCH_SIZE)}`,
      );

      for (const host of batch) {
        try {
          // Backup original data
          await backupHostData(host);

          // Hash the numeric passcode
          const hashedPassword = await bcrypt.hash(host.passCode, SALT_ROUNDS);

          // Update host with hashed password
          await host.update({
            passCode: hashedPassword,
          });

          processed++;
          console.log(
            `✅ Migrated: ${host.email} (${host.firstName} ${host.lastName})`,
          );
        } catch (error) {
          errors++;
          console.error(`❌ Error migrating ${host.email}:`, error.message);
        }
      }

      // Small delay between batches to reduce database load
      if (i + BATCH_SIZE < hosts.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log("\n🎉 Migration Summary:");
    console.log(`✅ Successfully migrated: ${processed} hosts`);
    console.log(`❌ Errors encountered: ${errors} hosts`);

    if (errors === 0) {
      console.log("🔐 All host passwords have been securely hashed!");
      console.log("📋 Backup data saved to host_password_backup table");
    } else {
      console.log("⚠️  Some hosts failed migration. Check logs above.");
    }
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function createBackupTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS host_password_backup (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255),
        original_passcode VARCHAR(255),
        migrated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(email)
      )
    `);
    console.log("✅ Backup table created/verified");
  } catch (error) {
    console.error("❌ Failed to create backup table:", error);
    throw error;
  }
}

async function backupHostData(host) {
  try {
    await sequelize.query(
      `
      INSERT INTO host_password_backup (id, email, original_passcode)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE migrated_at = CURRENT_TIMESTAMP
    `,
      {
        replacements: [host.id, host.email, host.passCode],
      },
    );
  } catch (error) {
    console.error(`Failed to backup data for ${host.email}:`, error);
    throw error;
  }
}

// Rollback function (use in emergency)
async function rollbackMigration() {
  console.log("🔄 Rolling back password migration...");

  try {
    await sequelize.authenticate();

    const [results] = await sequelize.query(`
      UPDATE host_profiles h 
      JOIN host_password_backup b ON h.id = b.id 
      SET h.passCode = b.original_passcode
    `);

    console.log(`✅ Rolled back ${results.affectedRows} host passwords`);
  } catch (error) {
    console.error("❌ Rollback failed:", error);
  }
}

// CLI handling
const command = process.argv[2];

if (command === "rollback") {
  rollbackMigration();
} else {
  migrateHostPasswords();
}

export { migrateHostPasswords, rollbackMigration };
