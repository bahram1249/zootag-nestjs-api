# AGENTS.md

This file provides guidance for AI agents working on this NestJS monorepo.

## Build, Lint, and Test Commands

```bash
# Build the project
npm run build

# Format code with Prettier
npm run format

# Run ESLint with auto-fix
npm run lint

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run tests for specific app
npm run test -- apps/<app_name>

# Run E2E tests
npm run test:e2e


# Run a specific test file
npm run test -- path/to/test.spec.ts

# Run specific app in development mode
npm run start:dev
```

## Monorepo Structure

- `apps/` - Applications: core, BPMN, zootag
- `libs/` - Shared libraries: file, thumbnail, logger, query-filter, redis-client, sms, minio-client, pay, permission-checker, response, commontools, localdatabase

## Path Aliases

Always use path aliases instead of relative imports:

- `@rahino/bpmn` or `@rahino/bpmn/*` for bpmn app
- `@rahino/zootag` or `@rahino/zootag/*` for zootag app
- `@rahino/localdatabase` or `@rahino/localdatabase/*` for models
- `@rahino/<lib-name>` for library imports

## Code Style Guidelines

### Imports

- External packages first, then internal packages using path aliases
- Group imports with blank lines between groups
- Example:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { SomeModel } from '@rahino/localdatabase/models';
import { SomeService } from './some.service';
```

### Formatting

- Use single quotes
- Trailing commas everywhere
- Prettier handles formatting (run `npm run format`)

### Types

- Use `bigint` for IDs in TypeScript
- Use `class-validator` decorators for DTO validation
- Use `@ApiProperty()` from `@nestjs/swagger` for API documentation
- Use `IsInt()` instead of `IsBigInt()` (which doesn't exist)
- For service/controller method params use `number`, convert with `Number()` when passing `bigint` (e.g., `Number(user.id)`)

### DTOs & Swagger

- In `@ApiProperty()` do NOT use class-validator decorators as `type` values (e.g., `type: IsString` is wrong — Swagger renders it as `{}`)
- Omit `type` entirely when it's a primitive — Swagger infers from the TypeScript declaration
- Use `type: () => ChildDto` only for lazy-resolved nested types
- Every field exposed in the API must have an `@ApiProperty()` decorator (including `password` etc.)

### Naming Conventions

- Modules: lowercase with hyphens (e.g., `product.module.ts`, `product-service.module.ts`)
- Controllers: `<Feature>Controller` (e.g., `ProductController`)
- Services: `<Feature>Service` or `<Action>Service` (e.g., `ProductService`, `RemoveEmptyPriceService`)
- DTOs: `<Purpose>Dto` (e.g., `GetProductDto`, `CreateProductDto`, `PriceFilterDto`)
- Models: `<TwoLetterPrefix><Name>Entity` in `libs/localdatabase/src/models/`
- Queue processors: `<QueueName>Processor`

### Module Structure

Each feature should be a self-contained NestJS module with:

- `*.controller.ts` - Controller with endpoints
- `*.service.ts` - Main service
- `*.module.ts` - Module file
- `dto/` subdirectory - Data Transfer Objects
- `mapper/` subdirectory - AutoMapper profiles
- `file-options/` subdirectory - Multer file upload config
- `processor/` subdirectory - BullMQ processors (if needed)

#### Module File (`*.module.ts`)

Import models via `SequelizeModule.forFeature()`, register controllers and providers:

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SomeModel } from '@rahino/localdatabase/models';
import { SomeController } from './some.controller';
import { SomeService } from './some.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, SomeModel])],
  controllers: [SomeController],
  providers: [SomeService],
})
export class SomeModule {}
```

#### Controller (`*.controller.ts`)

Use class-level guards and interceptor, method-level permissions:

```typescript
import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Post, Put, Query, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { SomeService } from './some.service';
import { SomeDto, SomeFilterDto } from './dto';

@ApiTags('Some-Feature')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/some/feature', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class SomeController {
  constructor(private readonly service: SomeService) {}

  @ApiOperation({ description: 'show all items' })
  @CheckPermission({ permissionSymbol: 'some.feature.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: SomeFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: SomeFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show item by given id' })
  @CheckPermission({ permissionSymbol: 'some.feature.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create item' })
  @CheckPermission({ permissionSymbol: 'some.feature.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: SomeDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update item' })
  @CheckPermission({ permissionSymbol: 'some.feature.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: SomeDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete item' })
  @CheckPermission({ permissionSymbol: 'some.feature.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
```

#### Service (`*.service.ts`)

Inject models via `@InjectModel()`, connection via `@InjectConnection()`, use `QueryOptionsBuilder`, return `{ result, total }`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { SomeModel } from '@rahino/localdatabase/models';
import { SomeFilterDto, SomeDto } from './dto';

@Injectable()
export class SomeService {
  constructor(
    @InjectModel(SomeModel)
    private readonly repository: typeof SomeModel,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: SomeFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search },
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes(['id', 'name'])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(this.localizationService.translate('core.not_found'));
    return { result: item };
  }

  async create(dto: SomeDto) {
    const item = await this.repository.create({ ...dto });
    return { result: item };
  }

  async update(id: number, dto: SomeDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(this.localizationService.translate('core.not_found'));
    await item.update({ ...dto });
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(this.localizationService.translate('core.not_found'));
    await item.destroy();
    return { result: item };
  }
}
```

#### DTOs (`dto/`)

Use `class-validator` decorators for validation, `@ApiProperty()` for Swagger docs, `@AutoMap()` for mapping:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AutoMap } from 'automapper-classes';

export class SomeDto {
  @AutoMap()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String, description: 'name' })
  name: string;

  @AutoMap()
  @IsOptional()
  @ApiProperty({ required: false, type: String, description: 'description' })
  description?: string;
}
```

**Filter DTO** — combine `ListFilter` with domain-specific filters via `IntersectionType`:

```typescript
import { IntersectionType } from '@nestjs/swagger';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';

export class SomeFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
```

#### Response Interceptor (`JsonResponseTransformInterceptor`)

Located at `@rahino/response/interceptor`. Wraps all controller responses into a standard envelope:

```typescript
{
  statusCode: number,
  reqId: string,
  message: string,       // from data.message or 'Success'
  result: any,           // from data.result or falls back to data
  timestamp: string,
  path: string,
  total: number,         // from data.total or 0
}
```

Apply at **class level** (applies to all methods) or **method level** (single endpoint):

```typescript
// Class level (applies to all methods in controller):
@UseInterceptors(JsonResponseTransformInterceptor)
export class SomeController {}

// Method level (single endpoint):
@UseInterceptors(JsonResponseTransformInterceptor)
@Post('/')
async create() {}
```

Services must return objects with `{ result, total? }` structure for paginated responses.

#### Permission Guard

Apply `JwtGuard` and `PermissionGuard` at the class level, then `@CheckPermission` on each method:

```typescript
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/some/feature', version: ['1'] })
export class SomeController {
  @CheckPermission({ permissionSymbol: 'some.feature.getall' })
  @Get('/')
  async findAll() { }
}
```

Permission symbols follow the pattern: `{domain}.{group}.{action}` (e.g., `eav.admin.attributetypes.getall`, `core.admin.users.create`).

#### Permission Migration Files

For each new module, create a permission seeding file in `apps/main/src/migrator/permissions/`:

```typescript
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export const name = 'YYYYMMDD-NNNN-SomeFeature';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'SomeFeature',       // CamelCase entity name
    groupName: 'some.feature',        // Dot-notation group (used in permissionSymbol)
    parentMenuName: 'Parent Menu',    // Parent menu in sidebar
    menuName: 'Feature Name',         // Menu item name
    menuUrl: '/some/feature',         // Frontend route
  });
}

export async function down(_sequelize: Sequelize): Promise<void> {}
```

Then register it in `apps/main/src/migrator/permissions/index.ts`.

The `createCrudPermissions` helper (from `../permission-helper`) automatically creates:
- A `PermissionGroup` with the group name
- CRUD permissions: `showmenu`, `getall`, `getone`, `create`, `update`, `delete`
- A parent menu item (or links to existing via `findParentMenu: true`)
- A sub-menu item
- `PermissionMenu` links
- `RolePermission` assignments for the super admin role

Override the default permission set with `includePermissions`:

```typescript
await createCrudPermissions(sequelize, {
  entityName: 'SomeFeature',
  groupName: 'some.feature',
  findParentMenu: true,
  parentMenuName: 'Parent',
  menuName: 'Feature',
  menuUrl: '/some/feature',
  includePermissions: ['showmenu', 'getall', 'getone', 'create', 'update'],
  // excludes 'delete'
});
```

#### Mapper (`automapper-classes`)

Use `@AutoMap()` on entity model fields and DTO fields for automatic mapping:

```typescript
// Entity model
@Table({ tableName: 'SomeModels' })
export class SomeModel extends Model {
  @AutoMap()
  @Column({ type: DataType.STRING })
  name: string;
}

// DTO
export class SomeDto {
  @AutoMap()
  @IsString()
  name: string;
}

// In service — inject Mapper and use it:
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class SomeService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectModel(SomeModel) private readonly repository: typeof SomeModel,
  ) {}

  async create(dto: SomeDto) {
    const mapped = this.mapper.map(dto, SomeDto, SomeModel);
    const item = await this.repository.create({ ...mapped });
    return { result: item };
  }
}
```

Create mapper profiles in a `mapper/` subdirectory when complex mapping logic is needed (though `@AutoMap()` decorators handle most cases automatically).

#### File Upload with Multer

Create a `file-options/` directory with an options file:

```typescript
// file-options/image.options.ts
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { v4 as uuidv4 } from 'uuid';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

export function imageOptions(): MulterOptions {
  return {
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        fs.mkdirSync(path.join(process.cwd(), '/tmp/attachmentFile'), {
          recursive: true,
        });
        cb(null, path.join(process.cwd(), '/tmp/attachmentFile'));
      },
      filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
      },
    }),
  };
}
```

In the controller, apply `FileInterceptor` with `ParseFilePipe` or `ParseFilePipeBuilder`:

```typescript
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './file-options/image.options';

@UseInterceptors(FileInterceptor('file', imageOptions()))
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: { file: { type: 'string', format: 'binary' } },
  },
})
@Post('/image')
@HttpCode(HttpStatus.OK)
async uploadImage(
  @GetUser() user: User,
  @UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType: /(jpg|jpeg|png)/ })
      .addMaxSizeValidator({ maxSize: 2097152 })
      .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
  )
  file: Express.Multer.File,
) {
  return await this.service.uploadImage(user, file);
}
```

Or use `ParseFilePipe` directly for more control:

```typescript
@UploadedFile(
  new ParseFilePipe({
    validators: [new MaxFileSizeValidator({ maxSize: 2097152 })],
    fileIsRequired: false,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
)
file?: Express.Multer.File,
```

### Authentication & Authorization

- Admin controllers: `@UseGuards(JwtGuard, PermissionGuard)` at class level
- Method permissions: `@CheckPermission({ permissionSymbol: 'path.to.permission' })`
- Get authenticated user: `@GetUser() user: User` parameter
- Public controllers: Use `OptionalJwtGuard`, `OptionalSessionGuard`

### Response DTO & Swagger Documentation

The project uses a standardized pattern for API responses with Swagger documentation via the `@rahino/response` library.

#### Response Envelope (`JsonResponseDto`)

Located at `libs/response/src/dto/json-response.dto.ts`, exported from `@rahino/response`:

```typescript
{
  statusCode: number,  // HTTP status code
  reqId: string,       // Request UUID
  message: string,     // 'Success' or custom message
  result: T,           // Response payload (single object or array)
  timestamp: string,   // ISO timestamp
  path: string,        // Request path
  total: number,       // Total count for paginated responses
}
```

#### `@ApiJsonResponse()` Decorator

Located at `libs/response/src/decorator/api-json-response.decorator.ts`, exported from `@rahino/response`. Automatically wraps Swagger response schemas in the `JsonResponseDto` envelope:

```typescript
@ApiJsonResponse({
  type: SomeResponseDto,           // Required: The result DTO class
  isArray?: boolean,               // true for array responses (paginated lists)
  status?: number,                 // 200 (default) or 201 for created
  description?: string,            // Override default 'OK' / 'Created'
  extraModels?: any[],             // Sub-DTOs referenced via `@ApiProperty({ type: () => ChildDto })`
})
```

- Internally uses `allOf` with `$ref` to merge `JsonResponseDto` + result type
- Registers all models via `@ApiExtraModels()` so nested types resolve in Swagger
- Selects `@ApiOkResponse` for 200 or `@ApiCreatedResponse` for 201

#### Interceptor (`JsonResponseTransformInterceptor`)

Located at `@rahino/response/interceptor`. Apply at **class level**:

```typescript
@UseInterceptors(JsonResponseTransformInterceptor)
export class SomeController {}
```

The interceptor expects services to return `{ result, total?, message? }` and transforms them into the envelope at runtime.

#### Response DTO Classes

Define a plain class with `@ApiProperty()` for each result type. Name pattern: `<Entity>ResponseDto`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { ChildResponseDto } from './child-response.dto';

export class SomeResponseDto {
  @ApiProperty({ example: 1, description: 'Item ID' })
  id: number;

  @ApiProperty({ example: 'Sample', description: 'Item name' })
  name: string;

  @ApiProperty({
    type: () => [ChildResponseDto],
    description: 'Related items',
    required: false,
  })
  children?: ChildResponseDto[];
}
```

Key rules:
- Use `@ApiProperty({ type: () => ChildDto })` for lazy-resolved nested types
- Use `@ApiProperty({ type: () => [ChildDto] })` for arrays of nested types
- Mark nullable fields with `required: false`
- Export all response DTOs from `dto/index.ts`

#### Complete Controller Example

```typescript
import { Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { ApiJsonResponse } from '@rahino/response';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { JwtGuard } from '@rahino/auth';
import { SomeService } from './some.service';
import { SomeResponseDto, ChildResponseDto } from './dto';

@ApiTags('Some-Feature')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/some/feature', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class SomeController {
  constructor(private readonly service: SomeService) {}

  @ApiOperation({ description: 'show all items' })
  @ApiJsonResponse({ type: SomeResponseDto, isArray: true, extraModels: [ChildResponseDto] })
  @CheckPermission({ permissionSymbol: 'some.feature.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: SomeFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: SomeFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show item by given id' })
  @ApiJsonResponse({ type: SomeResponseDto, extraModels: [ChildResponseDto] })
  @CheckPermission({ permissionSymbol: 'some.feature.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create item' })
  @ApiJsonResponse({ type: SomeResponseDto, status: 201, extraModels: [ChildResponseDto] })
  @CheckPermission({ permissionSymbol: 'some.feature.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: SomeDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update item' })
  @ApiJsonResponse({ type: SomeResponseDto, extraModels: [ChildResponseDto] })
  @CheckPermission({ permissionSymbol: 'some.feature.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: SomeDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete item' })
  @ApiJsonResponse({ type: SomeResponseDto, extraModels: [ChildResponseDto] })
  @CheckPermission({ permissionSymbol: 'some.feature.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
```

**Important:** Controllers must NEVER wrap service returns. Always use `return await this.service.method()` directly — the service already returns `{ result: ... }`.

#### Service Return Values

Services must return objects compatible with the interceptor:

```typescript
// Paginated — returns { result, total }
async findAll(filter: SomeFilterDto) {
  // ... query logic ...
  return { result, total };
}

// Single item — returns { result }
async findById(id: number) {
  const item = await this.repository.findOne(...);
  if (!item) throw new NotFoundException(...);
  return { result: item };
}
```

**Controller pattern:** Controllers must only call `return this.service.method()`. Never wrap or modify the return value — the service handles the `{ result }` wrapper.

#### Import Paths Summary

| Import                        | Path                                    |
| ----------------------------- | --------------------------------------- |
| `@ApiJsonResponse`            | `@rahino/response`                      |
| `JsonResponseTransformInterceptor` | `@rahino/response/interceptor`     |
| `JsonResponseDto`             | `@rahino/response` (rarely needed directly) |

### Localization / i18n

The project uses `nestjs-i18n` for internationalization with Persian (`fa`) and English (`en`) support.

#### Translation JSON Files

Keys are organized by domain in `apps/main/src/i18n/{lang}/`:

| Domain     | File                 | Usage                          |
| ---------- | -------------------- | ------------------------------ |
| `core`     | `core.json`          | Core/shared messages           |
| `bpmn`     | `bpmn.json`          | BPMN workflow messages         |
| `eav`     | `eav.json`          | EAV (entity-attribute-value) domain messages |
| `ecommerce`| `ecommerce.json`     | E-commerce domain messages     |
| `guarantee`| `guarantee.json`     | Guarantee domain messages      |
| `zootag`   | `zootag.json`        | Zootag domain messages         |
| `validation`| `validation.json`   | class-validator error messages |

Both `en/` and `fa/` directories must have matching keys with translated values.

#### I18nTranslations Type (`i18n.generated.ts`)

- Located at `apps/main/src/generated/i18n.generated.ts`
- **Auto-generated at app startup** by `nestjs-i18n` — do NOT create this file from scratch
- Provides type-safe translation key paths via `PathImpl2<I18nTranslations>`
- **AI workflow when adding translations:**
  1. Add translation key+value to JSON files (e.g., both `en/core.json` and `fa/core.json`)
  2. Add the corresponding type definition to `i18n.generated.ts` (it already exists and the startup regenerates it, so adding the type entry is safe and enables the build to pass with type-checking during development)
  3. Example: add `"my_new_key": string;` under the appropriate domain in `I18nTranslations`

#### LocalizationService

A global service (no need to import the module in feature modules):

```typescript
import { LocalizationService } from 'apps/main/src/common/localization';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';

// In constructor:
constructor(private readonly localizationService: LocalizationService) {}

// Usage:
this.localizationService.translate('core.not_found');
this.localizationService.translate('core.user');
this.localizationService.translate('bpmn.action');
```

The `translate()` method takes a `PathImpl2<I18nTranslations>` key path and optional args (e.g., `{ name: 'foo' }`). It resolves to the current request language or falls back to `fa`.

### ORM (Sequelize)

- Models in `libs/localdatabase/src/models/<domain>/` (domains: `core/`, `eav/`, `bpmn/`, `zootag/`)
- **All zootag tables must include soft delete** via an `isDeleted` column (`@Column({ type: DataType.BOOLEAN, allowNull: true })` on the entity), and all queries must filter with `.filter({ isDeleted: 0 })` or use the `seqHelp.whereIsNullColumnEqualToZero()` helper
- Each model directory must have an `index.ts` exporting all models
- When adding a new model, update these files:
  1. `libs/localdatabase/src/models/<domain>/index.ts` — barrel export
  2. `libs/localdatabase/src/models/index.ts` — add domain barrel
  3. `libs/localdatabase/src/subsystem-models/<domain>.ts` — add model array
  4. `libs/localdatabase/src/subsystem-models/index.ts` — add domain barrel
  5. `apps/main/src/routes/app.module.ts` — spread model array in `models: [...]`
  6. The feature module's `SequelizeModule.forFeature([...])` — register model
- Use `QueryOptionsBuilder` from `@rahino/query-filter/sequelize-query-builder` for all queries
- Use `QueryOptionsBuilder` via `import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder'`
- Complex query logic should be encapsulated in query builder services (e.g., `LogisticSaleQueryBuilderService`)
- For paginated data, use `count()` then `findAll()` (not `findAndCountAll`)
- For paginated data, total count with `group` is the length of the resulting array

#### QueryOptionsBuilder Methods

| Method                           | Description                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `.filter(where)`                 | Adds condition to `where[Op.and]`                                                     |
| `.filterIf(cond, where)`         | Conditionally adds filter (only when `cond` is truthy)                                |
| `.include(include)`              | Sets or replaces `include` array                                                      |
| `.thenInclude(include)`          | Appends a single include to existing array                                            |
| `.thenIncludeIf(cond, include)`  | Conditionally appends include                                                         |
| `.attributes(attrs)`             | Select specific columns                                                               |
| `.order({ orderBy, sortOrder })` | Add ordering (uses `OrderCol` object with `orderBy` string and `sortOrder` direction) |
| `.limit(count, ignorePaging?)`   | Set LIMIT (skipped if `ignorePaging` is true)                                         |
| `.offset(count, ignorePaging?)`  | Set OFFSET (skipped if `ignorePaging` is true)                                        |
| `.transaction(tx)`               | Associate a Sequelize Transaction                                                     |
| `.lock(lock)`                    | Set row lock (e.g., `LOCK.UPDATE`)                                                    |
| `.group(group)`                  | Add GROUP BY clause                                                                   |
| `.subQuery(flag)`                | Toggle subQuery flag                                                                  |
| `.raw(flag)`                     | Toggle raw query mode                                                                 |
| `.nest(flag)`                    | Toggle nest flag                                                                      |
| `.replacements(replacements)`    | Set bind replacements for raw queries                                                 |
| `.build()`                       | Returns `FindAndCountOptions` to pass to sequelize                                    |

#### Basic Query Patterns

**Simple filter — `findOne` by ID:**

```typescript
const item = await this.repository.findOne(
  new QueryOptionsBuilder().filter({ id: someId }).build(),
);
```

**Multiple filters chained:**

```typescript
const userRole = await this.userRoleRepository.findOne(
  new QueryOptionsBuilder()
    .filter({ userId: user.id })
    .filter({ roleId: role.id })
    .build(),
);
```

**Existence / uniqueness check with `[Op.ne]`:**

```typescript
const existing = await this.repository.findOne(
  new QueryOptionsBuilder()
    .filter({ slug: dto.slug })
    .filter({ id: { [Op.ne]: id } }) // exclude current record
    .build(),
);
```

**`[Op.or]` across columns:**

```typescript
new QueryOptionsBuilder().filter({
  [Op.or]: [
    { title: { [Op.like]: filter.search } },
    { slug: { [Op.like]: filter.search } },
  ],
});
```

#### Paginated Listing Pattern

Always use `count()` then `findAll()` (not `findAndCountAll`). Reuse the builder variable:

```typescript
let qb = new QueryOptionsBuilder()
  .filterIf(!!filter.userId, { userId: filter.userId })
  .filterIf(!!filter.processId, { processId: filter.processId });

const total = await this.repository.count(qb.build());

qb = qb
  .attributes(['id', 'name', 'title'])
  .include([
    { model: RelatedModel, as: 'relation', attributes: ['id', 'name'] },
  ])
  .limit(filter.limit, filter.ignorePaging)
  .offset(filter.offset, filter.ignorePaging)
  .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

const result = await this.repository.findAll(qb.build());
return { result, total };
```

Key points:

- Call `.build()` separately for `count` (filters only) and `findAll` (filters + pagination + includes)
- The builder supports method chaining; reassign the variable to extend it
- `filterIf` is the idiomatic way for optional parameters (use `!!` coercion)

#### Eager Loading (Includes)

**Single level includes:**

```typescript
new QueryOptionsBuilder().include([
  { model: User, as: 'user', attributes: ['id', 'username', 'firstname'] },
  { model: BPMNPROCESS, as: 'process', attributes: ['id', 'name'] },
]);
```

**Nested includes (through related models):**

```typescript
new QueryOptionsBuilder().include([
  {
    model: BPMNNodeCommand,
    as: 'nodeCommands',
    required: true,
    where: { nodeCommandTypeId: someTypeId },
    include: [
      {
        model: BPMNNodeCommandType,
        as: 'nodeCommandType',
      },
    ],
  },
]);
```

**Many-to-many with junction table:**

```typescript
new QueryOptionsBuilder().include([
  {
    model: Attachment,
    as: 'attachments',
    required: false,
    through: { attributes: [] }, // exclude junction table columns
  },
]);
```

- Use `required: false` for LEFT JOIN (optional relations)
- Use `required: true` (default) for INNER JOIN

#### Transaction Usage

Pass a transaction to queries when inside a managed transaction:

```typescript
await this.repository.findOne(
  new QueryOptionsBuilder()
    .filter({ id: someId })
    .transaction(transaction)
    .build(),
);
```

#### Soft Delete Helper

Many EAV/BPMN entities use a soft-delete pattern with an `isDeleted` column. Use the `seqHelp.whereIsNullColumnEqualToZero()` helper:

```typescript
.filter(this.seqHelp.whereIsNullColumnEqualToZero('EAVPost.isDeleted', 0))
```

This works for both the main model and included models (use prefixed name like `'attributeValues.isDeleted'`).

#### Re-initialize Builder for Separate Queries

The builder mutates its internal state. Do not reuse the same builder instance for two independent queries — create a new `QueryOptionsBuilder()` instead.

### Background Jobs (BullMQ)

- Import from `@nestjs/bullmq` (NOT `@nestjs/bull`)
- Processors extend `WorkerHost` and use `@Processor(QUEUE_NAME)` decorator
- Implement `async process(job: Job)` method
- Delete temporary files after processing
- Job dispatch: When entity status is updated (e.g., vendor's `isActive` flag), dispatch background job via BullMQ to update related entities (e.g., product inventories)
- Temporary file paths should be passed directly to job payload; file must be deleted after processing
- Job structure (project app): New jobs have own directory under `apps/project_name/src/job/` with `constants` and `processor` subdirectories

### DTOs

- Use `IntersectionType` from `@nestjs/swagger` to combine DTOs
- Base filter DTO + specific properties = complete filter DTO
- Use `@Type(() => Number)` for numeric conversions
- Use `IsOptional()` for optional fields
- Export all DTOs from `dto/index.ts`
- Do not use generic types (like `DateFilter`). A base DTO with specific properties (e.g., `beginDate`) is combined with `ListFilter` from `@rahino/query-filter` using `IntersectionType`

### Database Migrations

The project uses a custom code-generation migrator at `apps/main/src/migrator/`. Migrations are model-first: the CLI tool scans `*.entity.ts` files, diffs against a snapshot, and generates TypeScript migration files.

#### CLI Commands

```bash
# Generate migration files (runs snapshot + generate in one step)
npm run gen:migration

# Save current model state to models-snapshot.json
npm run gen:migration:snapshot

# Preview differences between snapshot and current models
npm run gen:migration:diff

# Backfill per-migration snapshots for all existing definitions
npx ts-node apps/main/src/migrator/cli/index.ts backfill-snapshots
```

#### Database Management CLI

After generating migration files, apply them to the database using these commands:

```bash
# Check current database version and pending items
npm run status

# Apply all pending migrations and seeds (updates database to latest)
npm run update-database

# Revert migrations down to a specific migration name
npm run update-database -- "20260519-0037-eav-alter-attributetypes-add-valuebased"

# Revert only the last applied migration
npm run rollback
```

**Commands:**

| Command | Description |
|---------|-------------|
| `npm run status` | Show database version status — latest executed vs latest available across all definitions |
| `npm run update-database` | Apply all pending definitions |
| `npm run update-database -- <name>` | Revert executed definitions down to the specified definition name (the named definition is kept) |
| `npm run rollback` | Revert only the last applied definition |

**How ordering works:**
- All definitions are registered in `apps/main/src/migrator/definitions/index.ts` (merged from migrations + seeds + permissions in a single array)
- Execution order is determined by **array position** in `definitions/index.ts`, not by filename or sequence number
- `npm run status` queries the single `UmzugMeta` table and compares against the definitions array to show pending vs executed
- The combined array preserves order: all schema migrations first, then all seeds, then permissions

**Per-migration snapshots:**
- When `npm run gen:migration` generates migration files, it saves a **per-migration snapshot** to `apps/main/src/migrator/snapshots/<migration-name>.snapshot.json` for each generated file
- Snapshots are **incrementally built**: each migration's snapshot captures the schema state *after* applying that migration, building up from the old snapshot. If 3 migration files are generated, the 1st snapshot shows state after 1st change, 2nd after both 1st+2nd, etc.
- Snapshots include core tables from `@rahino/database` (e.g., `Users`, `Roles`, `Settings`, `Permissions`, `Menus`) with full column metadata and foreign key references. These are extracted by scanning compiled `.entity.js` files in `node_modules/@rahino/database/dist/models/core/`. The `scanCompiledModelFile()` function in `model-scanner.ts` parses decorator metadata from compiled JavaScript using bracket-matching and regex, then pairs it with `.d.ts` type declarations for optional/nullable inference.
- To backfill snapshots for all existing migration/seed/permission files:
  ```
  npx ts-node apps/main/src/migrator/cli/index.ts backfill-snapshots
  ```
  This builds incremental state by parsing migration file names and matching against both local entities (`libs/localdatabase/`) and compiled core models (`@rahino/database`).
- When reverting with `update-database <migration-name>`, the CLI checks for a snapshot at the target version and displays it if found
- The `snapshot`, `diff`, and `generate` CLI commands also merge compiled core models alongside local entity models for a complete schema picture.

**Sequence numbers are globally unique across all files:**
- The `getMaxSequenceNumber()` function scans `migrations/`, `seeds/`, and `permissions/` directories for the highest `NNNN` sequence number
- When generating a new migration, the next sequence number is `max(NNNN) + 1` across ALL three directories
- The existing 196 files have been renamed so that **no two files share the same sequence number**:
  - Migrations: `0001`–`0071` (unchanged, first in execution order)
  - Seeds: `0072`–`0084` (renamed from `0001`–`0013`)
  - Permissions: `0085`–`0196` (renamed from `0001`–`0112`)
- This makes execution order immediately clear from filenames alone

**Under the hood:** These commands use [Umzug](https://github.com/sequelize/umzug) v3 directly via a standalone CLI script at `apps/main/src/migrator/cli/database-cli.ts`. All migration state is tracked in a single `UmzugMeta` table. Legacy `UmzugSeedMeta` entries are automatically migrated to `UmzugMeta` on first run.

#### Workflow (when adding/changing entities)

1. **Edit or create** `*.entity.ts` files in `libs/localdatabase/src/models/<domain>/`
2. **Generate migrations**: Run `npm run gen:migration` (combines snapshot + generate)
   - Or step-by-step: `gen:migration:snapshot` → `gen:migration:diff` (verify) → `npm run gen:migration` (which does snapshot + generate when no snapshot changes)

#### Migration File Conventions

- **Naming**: `{YYYYMMDD}-{NNNN}-{action}-{tablename}[-{detail}].ts`
  - e.g., `20260519-0001-core-create-settings-table.ts`
  - e.g., `20260519-0008-core-alter-users-add-birthdate.ts`
- **Actions**: `create` (CREATE TABLE), `alter` with `add-{col}`, `modify-{col}`, `drop-{col}`
- **Sequence**: 4-digit zero-padded number incrementing from the max sequence number parsed from existing filenames

#### Migration File Format

Each migration exports `name`, `up()`, and `down()`:

```typescript
import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const up = async (sequelize: Sequelize): Promise<void> => {
  const { helperFunctions } = createDialectHelpers(sequelize);
  // ...
};

export const down = async (sequelize: Sequelize): Promise<void> => {
  const { helperFunctions } = createDialectHelpers(sequelize);
  // ...
};
```

#### Seed & Permission File Generators

In addition to schema migrations, you can generate seed and permission files with filled templates that auto-register in `seeds/index.ts`:

```bash
# Create a seed file (kebab-case name -> file + registered in seeds/index.ts)
npm run create:seed -- <name>
npm run create:seed -- user-roles --site zootag   # conditional on SITE_NAME = zootag

# Create a permission file (PascalCase name -> file + registered in seeds/index.ts)
npm run create:permission -- <Name>
npm run create:permission -- ZootagFeature --site zootag
```

Both commands:
1. Calculate the next globally-unique 4-digit sequence number across `migrations/`, `seeds/`, `permissions/`
2. Generate a `.ts` file with a `TODO`-filled template in the appropriate directory
3. Add an `import` and array entry to `seeds/index.ts`

The `--site` flag wraps the entry with `cond()` instead of `m()`, so the seed/permission only runs when `SITE_NAME` matches the given value.

#### Seed File Template

Generated at `apps/main/src/migrator/seeds/<YYYYMMDD>-<NNNN>-seed-<name>.ts`:

```typescript
import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '<YYYYMMDD>-<NNNN>-seed-<name>';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);
  // TODO: implement seed data
}
export async function down(sequelize: Sequelize): Promise<void> {
  // TODO: revert seed
}
```

#### Permission File Template

Generated at `apps/main/src/migrator/permissions/<YYYYMMDD>-<NNNN>-<PascalName>.ts`:

```typescript
export const name = '<YYYYMMDD>-<NNNN>-<PascalName>';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: '<PascalName>',
    groupName: '<domain>.<group>',  // replace with actual group
    parentMenuName: '<Parent Menu>',
    menuName: '<Menu Name>',
    menuUrl: '/<path>',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
```

The placeholder values (`<domain>.<group>`, `<Parent Menu>`, `<Menu Name>`, `/<path>`) are written as-is and must be edited after generation.

### Migration Index Registration

- All migrations must be registered in `apps/main/src/migrator/migrations/index.ts`
- The generator auto-updates this file with import statements and array entries
- **Core tables**: Use `m(module)` wrapper
- **EAV-prefixed tables**: Use `cond(module, 'SITE_NAME', 'ecommerce')` wrapper
- **BPMN-prefixed tables**: Use `cond(module, 'SITE_NAME', 'bpmn')` wrapper
- The combined execution order lives in `apps/main/src/migrator/definitions/index.ts` which merges migrations + seeds

#### Runtime Migration Execution

- Migrations run on app startup via `UmzugMigrationService` (only on the primary cluster instance)
- All definitions (migrations + seeds + permissions) are tracked in a single `UmzugMeta` table
- Seeds live in `apps/main/src/migrator/seeds/` and `apps/main/src/migrator/permissions/`

#### Migration File Locations

| Directory                                     | Contents                                  |
| --------------------------------------------- | ----------------------------------------- |
| `apps/main/src/migrator/definitions/`         | Combined definitions index (execution order source of truth) |
| `apps/main/src/migrator/migrations/`          | Schema migration `.ts` files + `index.ts` |
| `apps/main/src/migrator/seeds/`               | Seed data `.ts` files + `index.ts`        |
| `apps/main/src/migrator/permissions/`         | Permission seeding files                  |
| `apps/main/src/migrator/models-snapshot.json` | Current model metadata snapshot           |

#### Key Libraries

- **`umzug`** - Runtime migration runner (applies pending migrations on startup)
- **`sequelize-typescript`** - ORM with decorators (`@Table`, `@Column`, `@ForeignKey`)
- Dialect adapters in `dialect-adapters.ts` support mssql, postgres, sqlite

### Zootag Project Structure

The zootag app at `apps/zootag/src/` is organized into the following sections:

| Directory      | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `admin/`       | Admin panel modules — protected by `JwtGuard` + `PermissionGuard`           |
| `client/`      | Authenticated user modules — the user is logged in and uses the app         |
| `anonymous/`   | Public modules/APIs that require no authentication                          |
| `jobs/`        | BullMQ job processors and related constants                                 |
| `shared/`      | Shared modules and business logic reused across other sections              |

#### `admin/`
Each feature is a self-contained NestJS module with controller, service, module, `dto/`, and optionally `mapper/` subdirectories. All endpoints require authentication and permission checks:

```typescript
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/<feature>', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
```

Permission symbols follow the pattern: `zootag.admin.<feature>.<action>`.

#### `client/`
For authenticated users. Uses `JwtGuard` but typically without `PermissionGuard` — access is controlled by ownership or data-level checks:

```typescript
@UseGuards(JwtGuard)
@Controller({ path: '/api/zootag/client/<feature>', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
```

#### `anonymous/`
Public endpoints — no guards, no authentication. Used for lookups, public pages, or webhook callbacks:

```typescript
@Controller({ path: '/api/zootag/anonymous/<feature>', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
```

#### `jobs/`
BullMQ job processors organized in subdirectories per job type:

```
jobs/
  <job-name>/
    constants.ts
    <job-name>.processor.ts
```

Processors extend `WorkerHost` and use `@Processor(QUEUE_NAME)`.

#### `shared/`
Reusable modules and business logic imported by admin, client, or anonymous features (e.g., pricing engines, validation helpers, query builders).

### Testing

- Guard mocking: `.overrideGuard()` in test setup
- Decorator mocking: custom `NestInterceptor` for `@GetUser()`
- E2E configs in `apps/<app>/test/jest-e2e.json` with relative paths
- E2E config requires local `moduleNameMapper` with paths relative to config file's location (e.g., using `../`)

### BPMN Dynamic Actions & Conditions

- **Actions in `apps/bpmn/src/dynamic-action/guarantee/`**
- **Conditions in `apps/bpmn/src/dynamic-condition/guarantee/`**
- Action services implement `ActionServiceImp` interface with `executeAction(dto: ExecuteActionDto)` method
- Condition services implement `check()` method returning boolean
- Action naming: `NotificationSenderFor...ActionService` or similar
- Service name must match `actionSource` column in `BPMNActions` table
- Condition service name must match `conditionSource` column in `BPMNNodeConditions` table
- `TraverseService` in `apps/bpmn/src/modules/traverse/traverse.service.ts` drives the BPMN flow
- Workflow steps: Get current request state → Find node → Check conditions → Execute actions → Update state → Log history
- Outbound actions execute before leaving current activity; inbound actions execute after transitioning
- `BPMNRequestHistory.fromUserId` tracks user who executed action
- `BPMNRequest` holds `organizationId`

### Response DTO Rule

Every API endpoint MUST have a corresponding response DTO class. When creating or editing a controller or service:

1. **Create a response DTO** for each endpoint in `dto/` — name pattern `<Action>ResponseDto`
2. **Register** it in `dto/index.ts`
3. **Add** `@ApiJsonResponse({ type: SomeResponseDto })` decorator to the controller method
4. **Service returns** `{ result: SomeResponseDto }` — the controller only calls `return this.service.method()` with NO additional wrapping

Example:

```typescript
// Service — returns { result: ... }
async logout(req: Request) {
  // ...
  return { result: { success: true } };
}

// Controller — just returns the service call
@ApiJsonResponse({ type: LogoutResponseDto })
@Post('logout')
async logout(@Req() req: Request) {
  return await this.authService.logout(req);
}
```

### Error Handling

- Use HTTP status codes with `@HttpCode(HttpStatus.*)`
- Use `ValidationPipe({ transform: true })` for DTO validation
- Use `@UsePipes(new ValidationPipe({ transform: true }))` at method level

### Best Practices

- Reuse query logic in private helper methods in services (e.g., by `findAll` and `exportExcel`)
- Cache small lookup tables for performance in import operations
- Use `RegExp` for `FileTypeValidator` (escape special characters with double backslashes)
- Use `@AutoMap()` from `automapper-classes` on model properties for mapping
- For refactoring, create new modules alongside old ones with distinct API paths
- Modify existing controller and service files instead of creating new ones for feature updates
