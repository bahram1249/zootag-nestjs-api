import * as fs from 'fs';
import * as path from 'path';
import { getMaxSequenceNumber } from './migration-writer';

function pad(n: number): string {
  return n.toString().padStart(4, '0');
}

function datePrefix(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}${m}${day}`;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase());
}

interface CreatedFile {
  fileName: string;
  seqNum: number;
  type: 'seed' | 'permission';
  site?: string;
}

export function generateSeedFile(
  name: string,
  seqNum: number,
): string {
  const prefix = datePrefix();
  const kebabName = toKebabCase(name);
  const fileName = `${prefix}-${pad(seqNum)}-seed-${kebabName}`;

  return `import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '${fileName}';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);
  // TODO: implement seed data
  // Example:
  // for (const row of [
  //   { id: 1, name: 'Sample' },
  // ]) {
  //   const [existing]: any = await sequelize.query(
  //     top(1, \`SELECT 1 FROM SomeTable WHERE id = \${row.id}\`),
  //     { raw: true, type: QueryTypes.SELECT },
  //   );
  //   if (!existing) {
  //     await sequelize.query(
  //       \`INSERT INTO SomeTable (id, name, "createdAt", "updatedAt") VALUES (\${row.id}, \${ns(row.name)}, \${nowVal}, \${nowVal})\`,
  //       { raw: true, type: QueryTypes.RAW },
  //     );
  //   }
  // }
}

export async function down(sequelize: Sequelize): Promise<void> {
  // TODO: revert seed
  // await sequelize.query(\`DELETE FROM SomeTable WHERE id IN (...)\`, {
  //   raw: true,
  //   type: QueryTypes.RAW,
  // });
}
`;
}

export function generatePermissionFile(
  name: string,
  seqNum: number,
): string {
  const prefix = datePrefix();
  const pascalName = toPascalCase(name);
  const fileName = `${prefix}-${pad(seqNum)}-${pascalName}`;

  return `export const name = '${fileName}';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: '${pascalName}',
    groupName: '<domain>.<group>',
    parentMenuName: '<Parent Menu>',
    menuName: '<Menu Name>',
    menuUrl: '/<path>',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
`;
}

function updateSeedsIndex(
  indexFilePath: string,
  file: CreatedFile,
): void {
  if (!fs.existsSync(indexFilePath)) return;

  const content = fs.readFileSync(indexFilePath, 'utf-8');
  const lines = content.split('\n');

  const varName = `s${pad(file.seqNum)}`;
  const fileNameBase = file.fileName.replace(/\.ts$/, '');
  const importPath =
    file.type === 'permission'
      ? `'../permissions/${fileNameBase}'`
      : `'./${fileNameBase}'`;
  const importLine = `import * as ${varName} from ${importPath};`;

  const entryLine = file.site
    ? `  cond(${varName}, 'SITE_NAME', '${file.site}'),`
    : `  m(${varName}),`;

  // Find the last import line to insert after
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImportIdx = i;
  }

  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, importLine);
  } else {
    // Fallback: insert before interface Condition
    const ifaceIdx = lines.findIndex((l) =>
      l.trim().startsWith('interface Condition'),
    );
    if (ifaceIdx >= 0) {
      lines.splice(ifaceIdx, 0, '', importLine);
    } else {
      console.error('Could not find insertion point in seeds/index.ts');
      return;
    }
  }

  // Find the closing bracket of seeds array and insert entry
  const arrayMatch = content.match(
    /export const seeds: SeedDefinition\[\] = \[/,
  );
  if (arrayMatch) {
    const startIdx = arrayMatch.index! + arrayMatch[0].length;
    let depth = 1;
    let idx = startIdx;
    while (depth > 0 && idx < content.length) {
      if (content[idx] === '[') depth++;
      else if (content[idx] === ']') depth--;
      idx++;
    }
    const insertPos = idx - 1;

    // Rebuild content with the import already inserted
    const updatedContent = lines.join('\n');

    // Now find the closing bracket position in the updated content
    const closingBracketMatch = updatedContent.match(
      /export const seeds: SeedDefinition\[\] = \[/,
    );
    if (closingBracketMatch) {
      const bracketStart = closingBracketMatch.index! + closingBracketMatch[0].length;
      let bracketDepth = 1;
      let bracketIdx = bracketStart;
      while (bracketDepth > 0 && bracketIdx < updatedContent.length) {
        if (updatedContent[bracketIdx] === '[') bracketDepth++;
        else if (updatedContent[bracketIdx] === ']') bracketDepth--;
        bracketIdx++;
      }
      const finalInsertPos = bracketIdx - 1;

      const result =
        updatedContent.slice(0, finalInsertPos) +
        '\n' +
        entryLine +
        '\n' +
        updatedContent.slice(finalInsertPos);

      fs.writeFileSync(indexFilePath, result, 'utf-8');
      return;
    }
  }

  // Fallback: just write the content with import added
  fs.writeFileSync(indexFilePath, lines.join('\n'), 'utf-8');
  console.warn(
    'Warning: could not find seeds array. Import added but entry must be added manually.',
  );
}

export function createSeed(
  migratorRoot: string,
  name: string,
  site?: string,
): string | null {
  const seedsDir = path.resolve(migratorRoot, 'seeds');
  if (!fs.existsSync(seedsDir)) {
    fs.mkdirSync(seedsDir, { recursive: true });
  }

  const maxSeq = getMaxSequenceNumber(migratorRoot);
  const seqNum = maxSeq + 1;
  const prefix = datePrefix();
  const kebabName = toKebabCase(name);
  const fileName = `${prefix}-${pad(seqNum)}-seed-${kebabName}.ts`;
  const filePath = path.join(seedsDir, fileName);

  const content = generateSeedFile(name, seqNum);
  fs.writeFileSync(filePath, content, 'utf-8');

  const indexFilePath = path.resolve(migratorRoot, 'seeds', 'index.ts');
  updateSeedsIndex(indexFilePath, {
    fileName,
    seqNum,
    type: 'seed',
    site,
  });

  return fileName;
}

export function createPermission(
  migratorRoot: string,
  name: string,
  site?: string,
): string | null {
  const permsDir = path.resolve(migratorRoot, 'permissions');
  if (!fs.existsSync(permsDir)) {
    fs.mkdirSync(permsDir, { recursive: true });
  }

  const maxSeq = getMaxSequenceNumber(migratorRoot);
  const seqNum = maxSeq + 1;
  const prefix = datePrefix();
  const pascalName = toPascalCase(name);
  const fileName = `${prefix}-${pad(seqNum)}-${pascalName}.ts`;
  const filePath = path.join(permsDir, fileName);

  const content = generatePermissionFile(name, seqNum);
  fs.writeFileSync(filePath, content, 'utf-8');

  const indexFilePath = path.resolve(migratorRoot, 'seeds', 'index.ts');
  updateSeedsIndex(indexFilePath, {
    fileName,
    seqNum,
    type: 'permission',
    site,
  });

  return fileName;
}
