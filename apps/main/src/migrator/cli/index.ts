import * as path from 'path';
import {
  scanModelsDirectory,
  scanModelFile,
  convertToModelMeta,
} from './model-scanner';
import { loadSnapshot, saveSnapshot, getSnapshotPath } from './snapshot';
import { diffModels, diffHasChanges } from './differ';
import { writeMigrations, getExistingMigrationCount } from './migration-writer';
import { ModelMeta } from './types';

function usage(): void {
  console.log(`
Usage:
  npx ts-node apps/main/src/migrator/cli/index.ts <command> [options]

Commands:
  snapshot              Create/update snapshot from current models
  diff                  Compare current models with snapshot (show changes)
  generate              Generate migration files from diff
  scan <model-file>     Scan a single model file and print metadata

Options:
  --models-dir <path>   Path to models directory (default: auto-detect)
  --snapshot-dir <path> Path to store snapshot (default: ./migrator)
  --output-dir <path>   Path to output migrations (default: ./migrator/migrations)
  --dry-run             Show what would be generated without writing

Examples:
  npx ts-node apps/main/src/migrator/cli/index.ts snapshot
  npx ts-node apps/main/src/migrator/cli/index.ts generate
  npx ts-node apps/main/src/migrator/cli/index.ts diff
`);
}

function findArg(args: string[], key: string): string | undefined {
  const idx = args.indexOf(key);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return undefined;
}

function autoDetectModelsDir(): string {
  const candidates = [
    'libs/localdatabase/src/models',
    'libs/localdatabase/src/models/eav',
    'libs/localdatabase/src/models/bpmn',
    'node_modules/@rahino/database/src/models',
  ];

  for (const c of candidates) {
    const fullPath = path.resolve(c);
    const fs = require('fs');
    if (fs.existsSync(fullPath)) return fullPath;
  }

  // Fallback: return the most likely path
  return path.resolve('libs/localdatabase/src/models');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    usage();
    return;
  }

  const rootDir = path.resolve(__dirname, '..', '..', '..', '..', '..');
  const modelsDirStr = findArg(args, '--models-dir');
  const modelsDir = modelsDirStr
    ? path.resolve(modelsDirStr)
    : autoDetectModelsDir();
  const snapshotDirStr = findArg(args, '--snapshot-dir');
  const snapshotDir = snapshotDirStr
    ? path.resolve(snapshotDirStr)
    : path.resolve(rootDir, 'apps/main/src/migrator');
  const outputDirStr = findArg(args, '--output-dir');
  const outputDir = outputDirStr
    ? path.resolve(outputDirStr)
    : path.resolve(rootDir, 'apps/main/src/migrator/migrations');
  const dryRun = args.includes('--dry-run');

  switch (command) {
    case 'snapshot': {
      console.log(`Scanning models in: ${modelsDir}`);
      const models = scanModelsDirectory(modelsDir);
      console.log(`Found ${Object.keys(models).length} models:`);
      for (const [name, meta] of Object.entries(models)) {
        console.log(
          `  ${meta.tableName} (${Object.keys(meta.columns).length} columns)`,
        );
      }
      const snapshotPath = getSnapshotPath(snapshotDir);
      saveSnapshot(snapshotPath, models);
      console.log(`\nSnapshot saved to: ${snapshotPath}`);
      break;
    }

    case 'diff': {
      const snapshotPath = getSnapshotPath(snapshotDir);
      const oldSnapshot = loadSnapshot(snapshotPath);
      if (!oldSnapshot) {
        console.error('No snapshot found. Run "snapshot" command first.');
        process.exit(1);
      }
      console.log(`Scanning models in: ${modelsDir}`);
      const newModels = scanModelsDirectory(modelsDir);
      const diff = diffModels(
        oldSnapshot.models as Record<string, ModelMeta>,
        newModels,
      );
      console.log(`\nChanges detected:`);
      console.log(`  New tables: ${diff.newTables.length}`);
      for (const t of diff.newTables) {
        console.log(`    + ${t.tableName}`);
      }
      console.log(`  Removed tables: ${diff.removedTables.length}`);
      for (const t of diff.removedTables) {
        console.log(`    - ${t.tableName}`);
      }
      console.log(`  Column changes: ${diff.diffColumns.length}`);
      for (const c of diff.diffColumns) {
        console.log(
          `    ${c.action === 'add' ? '+' : c.action === 'remove' ? '-' : '~'} ${c.tableName}.${c.column.name} (${c.action})`,
        );
      }
      break;
    }

    case 'generate': {
      const snapshotPath = getSnapshotPath(snapshotDir);
      const oldSnapshot = loadSnapshot(snapshotPath);
      if (!oldSnapshot) {
        console.error('No snapshot found. Run "snapshot" command first.');
        process.exit(1);
      }
      console.log(`Scanning models in: ${modelsDir}`);
      const newModels = scanModelsDirectory(modelsDir);
      const diff = diffModels(
        oldSnapshot.models as Record<string, ModelMeta>,
        newModels,
      );

      if (!diffHasChanges(diff)) {
        console.log('No changes detected. Models match snapshot.');
        return;
      }

      console.log(`\nChanges:`);
      console.log(`  New tables: ${diff.newTables.length}`);
      console.log(`  Removed tables: ${diff.removedTables.length}`);
      console.log(`  Column changes: ${diff.diffColumns.length}`);

      if (dryRun) {
        console.log('\n[Dry Run] Would generate:');
        for (const t of diff.newTables) {
          console.log(`  + CREATE TABLE ${t.tableName}`);
        }
        for (const c of diff.diffColumns) {
          console.log(
            `  ${c.action === 'add' ? '+' : c.action === 'remove' ? '-' : '~'} ALTER TABLE ${c.tableName} ${c.action} ${c.column.name}`,
          );
        }
      } else {
        const existingCount = getExistingMigrationCount(outputDir);
        const indexFile = path.join(outputDir, 'index.ts');
        const files = writeMigrations(
          outputDir,
          diff,
          existingCount,
          indexFile,
        );
        console.log(
          `\nGenerated ${files.length} migration file(s) in: ${outputDir}`,
        );
        for (const f of files) {
          console.log(`  - ${f}`);
        }
        console.log(`\nIndex updated: ${indexFile}`);
        // Update snapshot after generation
        saveSnapshot(snapshotPath, newModels);
        console.log(`\nSnapshot updated: ${snapshotPath}`);
      }
      break;
    }

    case 'scan': {
      const filePath = args[1];
      if (!filePath) {
        console.error('Usage: scan <model-file.ts>');
        process.exit(1);
      }
      const fullPath = path.resolve(filePath);
      const parsed = scanModelFile(fullPath);
      if (!parsed) {
        console.error('No model found in file (no @Table decorator detected)');
        process.exit(1);
      }
      const meta = convertToModelMeta(parsed);
      console.log(JSON.stringify(meta, null, 2));
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      usage();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
