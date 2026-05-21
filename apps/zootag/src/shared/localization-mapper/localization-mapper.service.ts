import { Injectable } from '@nestjs/common';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class LocalizationMapperService {
  constructor(private readonly localizationService: LocalizationService) {}

  localizeLookupValue(entityType: string, name: string): string {
    const key = `zootag.${entityType}.${this.toCamelCase(name)}`;
    const translated = this.localizationService.translate(key as any) as string;
    return translated !== key ? translated : name;
  }

  localizeItem<T extends Record<string, any>>(
    item: T,
    relationMaps: Record<string, string>,
  ): T {
    const result: Record<string, any> = { ...item };
    for (const [relationKey, entityType] of Object.entries(relationMaps)) {
      if (result[relationKey]) {
        result[relationKey] = {
          ...result[relationKey],
          name: this.localizeLookupValue(entityType, result[relationKey].name),
        };
      }
    }
    return result as T;
  }

  localizeItems<T extends Record<string, any>>(
    items: T[],
    relationMaps: Record<string, string>,
  ): T[] {
    return items.map((item) => this.localizeItem(item, relationMaps));
  }

  localizeLookupItems<T extends Record<string, any>>(
    items: T[],
    entityType: string,
  ): T[] {
    return items.map((item) => ({
      ...item,
      name: this.localizeLookupValue(entityType, item.name),
    }));
  }

  localizeLookupItem<T extends Record<string, any>>(
    item: T,
    entityType: string,
  ): T {
    return {
      ...item,
      name: this.localizeLookupValue(entityType, item.name),
    };
  }

  private toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase(),
      )
      .replace(/\s+/g, '');
  }
}
