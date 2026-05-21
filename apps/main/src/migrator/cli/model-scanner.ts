import * as fs from 'fs';
import * as path from 'path';
import { ModelMeta, ColumnMeta, IndexMeta, ForeignKeyMeta } from './types';
import { mapDataType } from './data-type-mapper';

interface ColumnDef {
  name: string;
  type: string;
  primaryKey: boolean;
  autoIncrement: boolean;
  allowNull: boolean;
  defaultValue: string | null;
  unique: boolean;
  comment: string | null;
}

interface FKDef {
  column: string;
  refModel: string;
  refKey: string;
}

interface DecoratorBlock {
  type: string;
  content: string;
}

function stripLineComments(code: string): string {
  return code.replace(/\/\/.*$/gm, '');
}

function findMatchingBracket(
  text: string,
  start: number,
  open: string,
  close: string,
): number {
  let depth = 1; // start after the opening bracket
  for (let i = start; i < text.length; i++) {
    if (text[i] === open) depth++;
    else if (text[i] === close) depth--;
    if (depth === 0) return i;
  }
  return -1;
}

function extractDecoratorBlocks(code: string): DecoratorBlock[] {
  const blocks: DecoratorBlock[] = [];
  const decoratorRegex = /@(\w+)\s*\(/g;
  let m: RegExpExecArray | null;

  while ((m = decoratorRegex.exec(code)) !== null) {
    const type = m[1];
    const startParen = m.index + m[0].length - 1; // position of '('
    const endParen = findMatchingBracket(code, startParen + 1, '(', ')');
    if (endParen === -1) continue;

    const content = code.substring(startParen + 1, endParen);
    blocks.push({ type, content });
  }

  return blocks;
}

function parseColumnContent(content: string): {
  type: string;
  primaryKey: boolean;
  autoIncrement: boolean;
  allowNull: boolean;
  defaultValue: string | null;
  unique: boolean;
  comment: string | null;
} {
  const res = {
    type: 'STRING',
    primaryKey: false,
    autoIncrement: false,
    allowNull: false,
    defaultValue: null as string | null,
    unique: false,
    comment: null as string | null,
  };

  const dtMatch = content.match(/DataType\.(\w+)(?:\((\d+)\))?/);
  if (dtMatch) {
    const rawType = dtMatch[1];
    const len = dtMatch[2];
    res.type = len ? `${rawType}(${len})` : rawType;
  }

  if (/primaryKey\s*:\s*true/i.test(content)) res.primaryKey = true;
  if (/autoIncrement\s*:\s*true/i.test(content)) res.autoIncrement = true;
  if (
    /allowNull\s*:\s*true/i.test(content) ||
    /allowNull\s*:\s*null/i.test(content)
  )
    res.allowNull = true;
  if (/unique\s*:\s*true/i.test(content)) res.unique = true;

  const dvMatch = content.match(/defaultValue\s*:\s*([^,\n}]+)/);
  if (dvMatch) {
    const dv = dvMatch[1].trim();
    if (dv !== 'null') res.defaultValue = dv;
  }

  const cmMatch = content.match(/comment\s*:\s*'([^']+)'/);
  if (cmMatch) res.comment = cmMatch[1];

  return res;
}

function findProperties(
  code: string,
): { name: string; type: string; line: number }[] {
  const props: { name: string; type: string; line: number }[] = [];
  const regex = /^\s*(\w+)\s*(?:\?\s*)?:\s*(\w+(?:\[\])?)\s*;?\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(code)) !== null) {
    const lineNum = code.substring(0, m.index).split('\n').length;
    props.push({ name: m[1], type: m[2], line: lineNum });
  }
  return props;
}

function associateDecoratorsToProperties(
  code: string,
): { property: string; decorators: DecoratorBlock[] }[] {
  const props = findProperties(code);
  // Find all decorator blocks with their positions
  const decoratorRegex = /@(\w+)\s*\(/g;
  const decoratorPositions: { type: string; content: string; pos: number }[] =
    [];
  let m: RegExpExecArray | null;

  while ((m = decoratorRegex.exec(code)) !== null) {
    const type = m[1];
    const startParen = m.index + m[0].length - 1;
    const endParen = findMatchingBracket(code, startParen + 1, '(', ')');
    if (endParen === -1) continue;
    const content = code.substring(startParen + 1, endParen);
    decoratorPositions.push({ type, content, pos: m.index });
  }

  // Find stand-alone decorators (no arguments)
  const simpleDecoratorRegex = /@(\w+)(?![(\w])/g;
  while ((m = simpleDecoratorRegex.exec(code)) !== null) {
    decoratorPositions.push({ type: m[1], content: '', pos: m.index });
  }

  decoratorPositions.sort((a, b) => a.pos - b.pos);

  // For each property, find decorators that appear before it (on lines before or same line)
  const result: { property: string; decorators: DecoratorBlock[] }[] = [];

  for (const prop of props) {
    const propOffset = findPropertyOffset(code, prop.name);
    if (propOffset === -1) continue;

    const associatedDecorators: DecoratorBlock[] = [];
    // Collect decorators from the property's line and lines above until we hit another property
    for (const dec of decoratorPositions) {
      if (dec.pos >= propOffset) break; // Past the property
      // Check if this decorator belongs to this property or a previous one
      const prevDec =
        result.length > 0 ? result[result.length - 1].decorators : [];
      if (result.length > 0) {
        const lastPropInfo = result[result.length - 1];
        const lastPropOffset = findPropertyOffset(code, lastPropInfo.property);
        if (lastPropOffset === -1) continue;
        if (dec.pos > lastPropOffset) {
          associatedDecorators.push({ type: dec.type, content: dec.content });
        }
      } else {
        associatedDecorators.push({ type: dec.type, content: dec.content });
      }
    }

    // Filter out decorators already assigned to previous property
    if (result.length > 0) {
      const lastProp = result[result.length - 1];
      const lastPropDecEnd =
        lastProp.decorators.length > 0
          ? Math.max(
              ...lastProp.decorators.map(
                (d) =>
                  decoratorPositions.find((dp) => dp.type === d.type)?.pos ?? 0,
              ),
            )
          : 0;
      result[result.length - 1].decorators = lastProp.decorators.filter(
        (d) =>
          decoratorPositions.find(
            (dp) => dp.type === d.type && dp.content === d.content,
          )?.pos ?? 0 <= lastPropDecEnd,
      );
    }

    result.push({ property: prop.name, decorators: associatedDecorators });
  }

  return result;
}

function findPropertyOffset(code: string, propName: string): number {
  const regex = new RegExp(
    `(?:^|\\n)\\s*${propName}\\s*(?:\\?\\s*)?:\\s*\\w+`,
    'm',
  );
  const m = regex.exec(code);
  return m ? m.index : -1;
}

function getLineNumber(code: string, offset: number): number {
  return code.substring(0, offset).split('\n').length;
}

export function scanModelFile(filePath: string): {
  tableName: string;
  className: string;
  columns: ColumnDef[];
  foreignKeys: FKDef[];
} | null {
  let code = fs.readFileSync(filePath, 'utf-8');
  code = stripLineComments(code);
  // Remove block comments
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');

  const tableMatch = code.match(
    /@Table\s*\(\s*\{[^}]*?tableName\s*:\s*'([^']+)'\s*\}/,
  );
  if (!tableMatch) return null;
  const tableName = tableMatch[1];

  const classMatch = code.match(/export\s+class\s+(\w+)\s+extends\s+Model/);
  if (!classMatch) return null;
  const className = classMatch[1];

  const columns: ColumnDef[] = [];
  const foreignKeys: FKDef[] = [];

  // Parse properties with Column decorators
  const colRegex = /@Column\s*\(\s*\{/g;
  const columnData: { start: number; content: string }[] = [];

  let colExec: RegExpExecArray | null;
  while ((colExec = colRegex.exec(code)) !== null) {
    const openBrace = colExec.index + colExec[0].length - 1;
    const closeBrace = findMatchingBracket(code, openBrace + 1, '{', '}');
    if (closeBrace === -1) continue;
    const content = code.substring(openBrace + 1, closeBrace);
    columnData.push({ start: colExec.index, content });
  }

  // For each @Column, find the next property name
  for (const cd of columnData) {
    const afterColumn = code.substring(cd.start);
    const propRegex =
      /^\s*(?:@\w+\s*(?:\([^)]*\))?\s*\n?)*\s*(\w+)\s*(?:\?\s*)?:\s*(\w+(?:\[\])?)\s*;/m;
    const pm = afterColumn.match(propRegex);
    if (!pm) continue;
    const propName = pm[1];
    const parsed = parseColumnContent(cd.content);
    columns.push({
      name: propName,
      type: mapDataType(parsed.type),
      primaryKey: parsed.primaryKey,
      autoIncrement: parsed.autoIncrement,
      allowNull: parsed.allowNull,
      defaultValue: parsed.defaultValue,
      unique: parsed.unique,
      comment: parsed.comment,
    });
  }

  // Find @ForeignKey decorators
  const fkRegex = /@ForeignKey\s*\(\s*\(\)\s*=>\s*(\w+)/g;
  let fkMatch: RegExpExecArray | null;
  while ((fkMatch = fkRegex.exec(code)) !== null) {
    const afterFk = code.substring(fkMatch.index);
    const propRegex =
      /^\s*(?:@\w+(?:\s*\([^)]*\))?\s*\n?)*\s*(\w+)\s*(?:\?\s*)?:\s*\w+/m;
    const pm = afterFk.match(propRegex);
    if (pm) {
      foreignKeys.push({
        column: pm[1],
        refModel: fkMatch[1],
        refKey: 'id',
      });
    }
  }

  return { tableName, className, columns, foreignKeys };
}

export function convertToModelMeta(parsed: {
  tableName: string;
  className: string;
  columns: ColumnDef[];
  foreignKeys: FKDef[];
}): ModelMeta {
  // Build FK lookup by column name
  const fkByColumn = new Map<string, FKDef>();
  for (const fk of parsed.foreignKeys) {
    fkByColumn.set(fk.column, fk);
  }

  const columns: Record<string, ColumnMeta> = {};
  for (const col of parsed.columns) {
    const refFk = fkByColumn.get(col.name);
    const meta: ColumnMeta = {
      name: col.name,
      type: col.type,
      primaryKey: col.primaryKey,
      autoIncrement: col.autoIncrement,
      allowNull: col.allowNull,
      defaultValue: col.defaultValue,
      unique: col.unique,
      comment: col.comment,
    };
    if (refFk) {
      meta.references = {
        model: refFk.refModel,
        key: refFk.refKey,
      };
    }
    columns[col.name] = meta;
  }

  const fks: ForeignKeyMeta[] = [];
  for (const fk of parsed.foreignKeys) {
    fks.push({
      columns: [fk.column],
      refTable: fk.refModel,
      refColumns: [fk.refKey],
    });
  }

  return {
    className: parsed.className,
    tableName: parsed.tableName,
    columns,
    indexes: [],
    foreignKeys: fks,
  };
}

function tableNameForClass(
  className: string,
  classToTable: Record<string, string>,
): string {
  return classToTable[className] || className;
}

/**
 * Extract className and tableName from a compiled .entity.js file.
 * Handles patterns like:
 *   sequelize_typescript_1.Table              (no explicit tableName)
 *   (0, sequelize_typescript_1.Table)({})     (no explicit tableName)
 *   (0, sequelize_typescript_1.Table)({ tableName: 'X' })  (explicit)
 */
function extractClassTableFromCompiledJS(
  code: string,
): { className: string; tableName: string } | null {
  const classMatch = code.match(/exports\.(\w+)\s*=\s*\1\s*=\s*__decorate\(/);
  if (!classMatch) return null;
  const className = classMatch[1];

  const tableNameMatch = code.match(
    /Table(?:\))?\s*\(\s*\{[^}]*?\btableName\s*:\s*'([^']+)'/,
  );
  if (tableNameMatch) {
    return { className, tableName: tableNameMatch[1] };
  }

  return { className, tableName: `${className}s` };
}

export function scanCompiledModelsForClassTable(
  modelsDir: string,
): Record<string, string> {
  const classToTable: Record<string, string> = {};

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.name.endsWith('.entity.js') &&
        !entry.name.endsWith('.d.ts')
      ) {
        const code = fs.readFileSync(fullPath, 'utf-8');
        const mapping = extractClassTableFromCompiledJS(code);
        if (mapping) {
          classToTable[mapping.className] = mapping.tableName;
        }
      }
    }
  }

  walk(modelsDir);
  return classToTable;
}

//#region Compiled JS model scanning (for @rahino/database models)

interface CompiledColumnBlock {
  colName: string;
  columnOptsStr: string;
  fkRef: string | null;
  designType: string;
}

function findMatchingBracketReverse(
  text: string,
  start: number,
  open: string,
  close: string,
): number {
  let depth = 1;
  for (let i = start; i >= 0; i--) {
    if (text[i] === close) depth++;
    else if (text[i] === open) depth--;
    if (depth === 0) return i;
  }
  return -1;
}

/**
 * Parse Column() options from __decorate block content.
 * Handles nested braces (e.g., `set(value) { ... }` inside Column options).
 */
function extractColumnOptionsFromBlock(blockContent: string): string {
  // Find Column or sequelize_typescript_1.Column followed by )( { ... } or ( { ... }
  const colIdx = blockContent.search(/Column\s*\)?\s*\(\s*\{/);
  if (colIdx === -1) return '';

  const openBraceIdx = blockContent.indexOf('{', colIdx);
  if (openBraceIdx === -1) return '';

  const closeBraceIdx = findMatchingBracket(
    blockContent,
    openBraceIdx + 1,
    '{',
    '}',
  );
  if (closeBraceIdx === -1) return '';

  return blockContent.substring(openBraceIdx + 1, closeBraceIdx);
}

/**
 * Extract all __decorate blocks for instance properties from compiled .entity.js code.
 */
function extractInstanceDecoratorBlocks(
  jsCode: string,
  className: string,
): CompiledColumnBlock[] {
  const blocks: CompiledColumnBlock[] = [];
  let searchPos = 0;

  while (true) {
    // Look for __decorate([
    const decStart = jsCode.indexOf('__decorate([', searchPos);
    if (decStart === -1) break;

    const startBracket = decStart + '__decorate(['.length - 1; // position of '['
    const endBracket = findMatchingBracket(jsCode, startBracket + 1, '[', ']');
    if (endBracket === -1) {
      searchPos = decStart + 1;
      continue;
    }

    const blockContent = jsCode.substring(startBracket + 1, endBracket);

    // Check tail: ], ClassName.prototype, "colName", void 0)
    const afterBracket = jsCode.substring(endBracket + 1).trim();
    const tailMatch = afterBracket.match(
      /^\]?\s*,\s*(\w+)\.prototype,\s*"(\w+)",\s*void\s*0\)/,
    );
    searchPos = endBracket + 1;

    if (!tailMatch) continue;
    const targetClass = tailMatch[1];
    if (targetClass !== className) continue; // skip blocks for other classes
    const colName = tailMatch[2];

    // Skip hook/method decorators (BeforeCreate, AfterCreate, etc.)
    if (
      /(BeforeCreate|AfterCreate|BeforeUpdate|AfterUpdate|BeforeSave|AfterSave|BeforeDestroy|AfterDestroy|BeforeBulkCreate|AfterBulkCreate)/.test(
        blockContent,
      )
    ) {
      continue;
    }

    // Skip pure association blocks (no Column, no ForeignKey)
    if (!/Column/.test(blockContent) && !/ForeignKey/.test(blockContent)) {
      continue;
    }

    // Skip BelongsTo/HasMany/BelongsToMany-only blocks
    if (
      /(BelongsTo|HasMany|BelongsToMany)/.test(blockContent) &&
      !/Column/.test(blockContent)
    ) {
      continue;
    }

    // Extract Column options
    const columnOptsStr = extractColumnOptionsFromBlock(blockContent);

    // Extract ForeignKey reference
    // Handles both: ForeignKey(() => X) and ForeignKey)(() => X (compiled call expression)
    const fkMatch = blockContent.match(
      /ForeignKey\)?\s*\(\s*\(\)\s*=>\s*(?:\w+\.)*(\w+)\)/,
    );
    const fkRef = fkMatch ? fkMatch[1] : null;

    // Extract design type from __metadata using bracket matching (handles nested parens)
    let designType = 'Object';
    const metaIdx = blockContent.indexOf('__metadata("design:type",');
    if (metaIdx !== -1) {
      const openParen = blockContent.indexOf('(', metaIdx);
      if (openParen !== -1) {
        const closeParen = findMatchingBracket(
          blockContent,
          openParen + 1,
          '(',
          ')',
        );
        if (closeParen !== -1) {
          const fullCall = blockContent.substring(openParen + 1, closeParen);
          const commaIdx = fullCall.indexOf(',');
          if (commaIdx !== -1) {
            designType = fullCall.substring(commaIdx + 1).trim();
          }
        }
      }
    }

    blocks.push({ colName, columnOptsStr, fkRef, designType });
  }

  return blocks;
}

/**
 * Map a JavaScript design type (from __metadata) to a Sequelize type string.
 */
function compiledDesignTypeToSequelize(designType: string): string {
  if (designType.includes('BigInt')) return 'BIGINT';
  if (designType === 'String') return 'STRING';
  if (designType === 'Number') return 'INTEGER';
  if (designType === 'Boolean') return 'BOOLEAN';
  if (designType === 'Date') return 'DATE';
  if (designType === 'Array') return 'JSON';
  if (designType === 'Object') return 'STRING';
  return 'STRING';
}

/**
 * Extract column names with optional flag from a .d.ts file.
 */
function parseDTColumns(dtCode: string): Map<string, boolean> {
  const result = new Map<string, boolean>();
  // Match property declarations: name?: type or name: type
  const propRegex = /^\s+(\w+)(\??)\s*:\s*(\w+(?:\[\])?)\s*;?\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = propRegex.exec(dtCode)) !== null) {
    result.set(m[1], m[2] === '?');
  }
  return result;
}

/**
 * Scan a compiled .entity.js file and its corresponding .d.ts to extract full ModelMeta.
 */
export function scanCompiledModelFile(
  jsFilePath: string,
  classToTable?: Record<string, string>,
): ModelMeta | null {
  const jsCode = fs.readFileSync(jsFilePath, 'utf-8');

  // Extract class name via the __decorate export pattern
  const classMatch = jsCode.match(/exports\.(\w+)\s*=\s*\1\s*=\s*__decorate\(/);
  if (!classMatch) return null;
  const className = classMatch[1];

  // Extract table name
  let tableName: string;
  // Look for explicit tableName in Table({ tableName: 'X' })
  const explicitTableName = jsCode.match(/tableName\s*:\s*'([^']+)'/);
  if (explicitTableName) {
    tableName = explicitTableName[1];
  } else {
    // Default: pluralize class name
    tableName = `${className}s`;
  }

  // Extract decorator blocks
  const blocks = extractInstanceDecoratorBlocks(jsCode, className);

  // Read .d.ts for optional markers
  const dtFilePath = jsFilePath.replace(/\.js$/, '.d.ts');
  let dOptional = new Map<string, boolean>();
  try {
    if (fs.existsSync(dtFilePath)) {
      const dtCode = fs.readFileSync(dtFilePath, 'utf-8');
      dOptional = parseDTColumns(dtCode);
    }
  } catch {
    // ignore
  }

  // Build columns
  const columns: Record<string, ColumnMeta> = {};
  const foreignKeys: ForeignKeyMeta[] = [];

  for (const block of blocks) {
    const { colName, columnOptsStr, fkRef, designType } = block;

    // Parse Column options for Sequelize-specific type
    let colType = '';
    const dtTypeMatch = columnOptsStr.match(
      /(?:sequelize_typescript_1\.)?DataType\.(\w+)(?:\(([^)]+)\))?/,
    );
    if (dtTypeMatch) {
      colType = dtTypeMatch[1] + (dtTypeMatch[2] ? `(${dtTypeMatch[2]})` : '');
    }

    // Primary key & auto-increment
    const primaryKey = /primaryKey\s*:\s*true/i.test(columnOptsStr);
    const autoIncrement = /autoIncrement\s*:\s*true/i.test(columnOptsStr);

    // allowNull logic
    let allowNull = false;
    if (/allowNull\s*:\s*true/i.test(columnOptsStr)) {
      allowNull = true;
    } else if (/allowNull\s*:\s*false/i.test(columnOptsStr)) {
      allowNull = false;
    } else if (primaryKey) {
      allowNull = false;
    } else if (dOptional.get(colName) === true) {
      allowNull = true;
    }
    // default: false (matches entity scanner behavior)

    // Determine final SQL type
    let sqlType = colType;
    if (!sqlType) {
      sqlType = compiledDesignTypeToSequelize(designType);
    }

    // Default value extraction
    let defaultValue: string | null = null;
    const dvMatch = columnOptsStr.match(/defaultValue\s*:\s*([^,\n}]+)/);
    if (dvMatch) {
      const dv = dvMatch[1].trim();
      if (dv !== 'null') defaultValue = dv;
    }

    const colMeta: ColumnMeta = {
      name: colName,
      type: mapDataType(sqlType),
      primaryKey,
      autoIncrement,
      allowNull,
      defaultValue,
      unique: /unique\s*:\s*true/i.test(columnOptsStr),
      comment: null,
    };

    // Resolve FK reference
    if (fkRef) {
      const resolvedRef = classToTable ? classToTable[fkRef] || fkRef : fkRef;
      colMeta.references = { model: resolvedRef, key: 'id' };
      foreignKeys.push({
        columns: [colName],
        refTable: resolvedRef,
        refColumns: ['id'],
      });
    }

    columns[colName] = colMeta;
  }

  return {
    className,
    tableName,
    columns,
    indexes: [],
    foreignKeys,
  };
}

/**
 * Scan a directory of compiled .entity.js files and extract full ModelMeta for each.
 */
export function scanCompiledModelsDirectory(
  modelsDir: string,
  classToTable?: Record<string, string>,
): Record<string, ModelMeta> {
  const models: Record<string, ModelMeta> = {};
  const resolvedClassToTable: Record<string, string> = {
    ...(classToTable || {}),
  };

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.name.endsWith('.entity.js') &&
        !entry.name.endsWith('.d.ts') &&
        !entry.name.endsWith('.js.map')
      ) {
        const meta = scanCompiledModelFile(fullPath, resolvedClassToTable);
        if (meta) {
          models[meta.tableName] = meta;
          resolvedClassToTable[meta.className] = meta.tableName;
        }
      }
    }
  }

  walk(modelsDir);
  return models;
}

//#endregion

export function scanModelsDirectory(
  modelsDir: string,
  extraClassToTable?: Record<string, string>,
): Record<string, ModelMeta> {
  const models: Record<string, ModelMeta> = {};
  const classToTable: Record<string, string> = {};

  const allParsed: Array<{
    parsed: ReturnType<typeof scanModelFile>;
    fullPath: string;
  }> = [];

  // First pass: collect class-to-table mapping
  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.entity.ts')) {
        const parsed = scanModelFile(fullPath);
        if (parsed) {
          classToTable[parsed.className] = parsed.tableName;
          allParsed.push({ parsed, fullPath });
        }
      }
    }
  }

  walk(modelsDir);

  // Merge external class-to-table mappings (e.g., from compiled @rahino/database models)
  if (extraClassToTable) {
    Object.assign(classToTable, extraClassToTable);
  }

  // Second pass: resolve FK class names to table names
  for (const { parsed } of allParsed) {
    for (const fk of parsed.foreignKeys) {
      fk.refModel = tableNameForClass(fk.refModel, classToTable);
    }
    const meta = convertToModelMeta(parsed);
    models[meta.tableName] = meta;
  }

  return models;
}
