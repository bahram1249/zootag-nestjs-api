import { migrations } from '../migrations';
import { seeds } from '../seeds';

interface Condition {
  key: string;
  values: string[];
}

export interface Definition {
  name: string;
  up: (sequelize: any) => Promise<void>;
  down?: (sequelize: any) => Promise<void>;
  condition?: Condition;
}

export const definitions: Definition[] = [...migrations, ...seeds];
