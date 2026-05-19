import * as fs from 'fs';
import * as path from 'path';
import { Snapshot } from './types';

const SNAPSHOT_VERSION = '1';

export function loadSnapshot(snapshotPath: string): Snapshot | null {
  if (!fs.existsSync(snapshotPath)) return null;
  try {
    const raw = fs.readFileSync(snapshotPath, 'utf-8');
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

export function saveSnapshot(
  snapshotPath: string,
  models: Record<string, any>,
): void {
  const snapshot: Snapshot = {
    version: SNAPSHOT_VERSION,
    generatedAt: new Date().toISOString(),
    models,
  };
  const dir = path.dirname(snapshotPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf-8');
}

export function getSnapshotPath(snapshotDir: string): string {
  return path.join(snapshotDir, 'models-snapshot.json');
}
