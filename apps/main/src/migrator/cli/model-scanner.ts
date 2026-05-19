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

function tableNameForClass(className: string, classToTable: Record<string, string>): string {
  return classToTable[className] || className;
}

export function scanModelsDirectory(
  modelsDir: string,
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
