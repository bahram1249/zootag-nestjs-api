# Creating / Editing a Zootag Admin Module

This document describes the complete step-by-step flow for creating a new
feature module (or editing an existing one) inside `apps/zootag/src/admin/`.

---

## 1. Entity Model (`libs/localdatabase/src/models/zootag/`)

Create `zt-{feature-name}.entity.ts`:

| Convention | Rule |
|------------|------|
| Table name | `ZT_{PascalCase}` (e.g. `ZT_Devices`) |
| Prefix     | `ZT_` |
| Primary key | `id: bigint` with `autoIncrement: true` |
| `isDeleted` | `@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })` |
| `isActive` | `@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })` |
| `createdUserId` / `updatedUserId` | One `@ForeignKey(() => User)` + `@BelongsTo` each for audit |
| `@ForeignKey` | Always paired with `@BelongsTo` |
| `@BelongsTo` | Always use `{ foreignKey: '...', as: '...' }` object syntax |
| `@AutoMap()` | Add to every DTO-exposed field |

**Example BelongsTo pattern for two User FKs:**
```typescript
@ForeignKey(() => User)
@Column({ type: DataType.BIGINT, allowNull: false })
createdUserId: bigint;

@BelongsTo(() => User, { foreignKey: 'createdUserId', as: 'createdUser' })
createdUser: User;

@ForeignKey(() => User)
@Column({ type: DataType.BIGINT, allowNull: false })
updatedUserId: bigint;

@BelongsTo(() => User, { foreignKey: 'updatedUserId', as: 'updatedUser' })
updatedUser: User;
```

## 2. Register the Model

Update these files:

| # | File | Action |
|---|------|--------|
| 1 | `libs/localdatabase/src/models/zootag/index.ts` | Add `export * from './zt-{name}.entity';` |
| 2 | `libs/localdatabase/src/models/index.ts` | Ensure zootag barrel is exported |
| 3 | `libs/localdatabase/src/subsystem-models/zootag.ts` | Add model class to the array |
| 4 | `libs/localdatabase/src/subsystem-models/index.ts` | Ensure zootag subsystem barrel is exported |
| 5 | `apps/main/src/routes/app.module.ts` | Spread `zootagModels` in `models: [...]` |

## 3. Generate Migration

```bash
npm run gen:migration
```

Then **manually verify and fix**:
- [ ] Remove `allowNull: true` from `isDeleted` and add `allowNull: false, defaultValue: 0` **in the entity first** before generating (the generator reads entity metadata)
- [ ] Fix `cond(... 'zootag')` → `cond(... 'Zootag')` (capital Z) in `apps/main/src/migrator/migrations/index.ts`
- [ ] Verify the migration adds a `DEFAULT 0` constraint (add raw SQL if the generator doesn't)
- [ ] Verify the migration updates existing NULL rows to 0

## 4. Create Module

`apps/zootag/src/admin/{feature-name}/{feature-name}.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTYourModel } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { YourController } from './your.controller';
import { YourService } from './your.service';
import { YourProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTYourModel, User, Permission])],
  controllers: [YourController],
  providers: [YourService, YourProfile],
})
export class YourModule {}
```

## 5. Create DTOs (`dto/`)

### 5a. Create/Update DTO
`dto/{feature-name}.dto.ts`

- Use `class-validator` for validation, `class-transformer` for `@Type(() => Number)`
- Every exposed field needs `@ApiProperty()`
- `@AutoMap()` on every property
- `@Type(() => Number)` on every numeric field (class-transformer)
- For optional prices with IRR calculation: mark `purchasePriceIRR` as `@IsOptional()`

### 5b. Filter DTO
`dto/{feature-name}-filter.dto.ts`

```typescript
import { IntersectionType } from '@nestjs/swagger';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';

export class YourFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
```

### 5c. Response DTO
`dto/{feature-name}-response.dto.ts`

- Define inline `BriefDto` classes for nested related data (e.g. `UserBriefDto`, `CompanyBriefDto`)
- Use `@ApiProperty({ type: () => BriefDto })` for lazy-resolved nested types
- Mark nested relation fields with `required: false`

### 5d. Barrel
`dto/index.ts`

```typescript
export * from './{feature-name}.dto';
export * from './{feature-name}-response.dto';
export * from './{feature-name}-filter.dto';
```

## 6. Create Mapper Profile

`mapper/{feature-name}.mapper.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { YourDto } from '../dto';
import { ZTYourModel } from '@rahino/localdatabase/models';
import { Mapper, createMap } from 'automapper-core';

@Injectable()
export class YourProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, YourDto, ZTYourModel);
    };
  }
}
```

`mapper/index.ts`

```typescript
export * from './{feature-name}.mapper';
```

- The profile is registered in the module's `providers` (step 4 template already includes it)
- `createMap` maps all fields with matching `@AutoMap()` decorators automatically
- No `forMember(ignore())` needed — if `id` is in the DTO (lookup tables) it should be mapped; if `id` is auto-generated it should not be in the DTO

## 7. Create Service

`{feature-name}.service.ts`

Key patterns:

| Method | Pattern |
|--------|---------|
| `findAll` | Use `let qb = new QueryOptionsBuilder()`; call `count()` first, then `findAll()` with `.include()`, `.limit()`, `.offset()`, `.order()` |
| `findById` | `findOne` with `.filter({ id }).filter({ isDeleted: 0 })`; throw `NotFoundException` if not found |
| `create` | `const mapped = this.mapper.map(dto, YourDto, ZTYourModel).toJSON(); this.repository.create({ ...mapped, createdUserId: BigInt(user.id), updatedUserId: BigInt(user.id) })` |
| `update` | `findOne` first (404 if not found), then `const mapped = this.mapper.map(dto, YourDto, ZTYourModel).toJSON(); item.update({ ...mapped, updatedUserId: BigInt(user.id) })` |
| `deleteById` | `findOne` first (404 if not found), then `item.update({ isDeleted: true })` |

- Inject: `@InjectModel()`, `@InjectConnection()`, `LocalizationService`, `@InjectMapper() private readonly mapper: Mapper`
- All `findAll`/`findById` queries must include related models via `.include()`
- Filter with `.filter({ isDeleted: 0 })` on every read query
- Use `this.localizationService.translate('zootag.{entity}_not_found')` for localization
- For IRR auto-calculation: inject `CurrencyCalculationService`, call `this.currencyCalculationService.convertToIRR(dto.currencyId, dto.purchasePrice)` and store in `purchasePriceIRR`

## 7. Create Controller

`{feature-name}.controller.ts`

```typescript
@ApiTags('Zootag-Admin-{Feature}')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/{featurePath}', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class YourController {
  constructor(private readonly service: YourService) {}

  @ApiOperation({ description: '...' })
  @ApiJsonResponse({ type: YourResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.{feature}.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: YourFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: YourFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: '...' })
  @ApiJsonResponse({ type: YourResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.{feature}.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: '...' })
  @ApiJsonResponse({ type: YourResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.{feature}.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: YourDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @ApiOperation({ description: '...' })
  @ApiJsonResponse({ type: YourResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.{feature}.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: YourDto, @GetUser() user: User) {
    return await this.service.update(id, dto, user);
  }

  @ApiOperation({ description: '...' })
  @ApiJsonResponse({ type: YourResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.{feature}.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
```

- `@ApiQuery` is **required** on findAll (match the EAV pattern)
- Add `ApiQuery` to the Swagger import: `import { ..., ApiQuery, ... } from '@nestjs/swagger'`
- Controller paths use **camelCase** (e.g. `contractPeriodDevicePrices`)

## 8. Generate Permission File

```bash
npm run create:permission -- YourEntityName --site Zootag
```

Then **manually fix**:
- [ ] `'zootag'` → `'Zootag'` (capital Z) in both the generated file's `cond()` and in `apps/main/src/migrator/permissions/index.ts`
- [ ] Replace placeholders (`<domain>.<group>`, `<Parent Menu>`, etc.) in the generated file
- [ ] Set correct `groupName`: `zootag.admin.{feature}`
- [ ] Set correct `parentMenuName` and `menuName`

## 9. Add i18n Keys

Edit both files:

| File | Key |
|------|-----|
| `apps/main/src/i18n/en/zootag.json` | `"{feature}_not_found": "{Feature} not found"` |
| `apps/main/src/i18n/fa/zootag.json` | `"{feature}_not_found": "...,u0641,\u062a \u0646\u0634\u062f"` (Persian translation) |

## 10. Register the Module

Add to `apps/zootag/src/zootag.module.ts`:

1. Import the module
2. Add it to the `imports: [...]` array

## 11. Build & Verify

```bash
npm run build
npm run start:dev
```

- [ ] Verify server starts without errors
- [ ] Verify routes are mapped (check logs for `{YourController}`)
- [ ] Test API: sign in, then test CRUD endpoints

## 12. Special Cases

| Case | Action |
|------|--------|
| **Lookup table** (e.g. Status, Type) | No `createdUserId`/`updatedUserId`; no `isDeleted`; no `updatedAt`; no `slug`; DTO includes `id` (static PK); still uses `@AutoMap()` and mapper profile |
| **Localized lookup name** | Inject `LocalizationMapperService`; use `localizeLookupItems()` / `localizeLookupItem()` for direct lookup entities; use `localizeItems()` / `localizeItem()` with `{ relationKey: 'entityType' }` for nested relations |
| **IRR auto-calculation** | Mark `CurrencyCalculationModule` as `@Global()`, inject `CurrencyCalculationService`, call on **create only** |
| **No `@GetUser()` user param** | Lookup table controllers omit user param in create/update |
| **Migration fixes needed** | After generation: fix `cond()` casing, add `DEFAULT` constraints, add UPDATE for existing NULLs |
