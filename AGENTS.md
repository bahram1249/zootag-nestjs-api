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

- `apps/` - Applications: core, BPMN
- `libs/` - Shared libraries: file, thumbnail, logger, query-filter, redis-client, sms, minio-client, pay, permission-checker, response, commontools, localdatabase

## Path Aliases

Always use path aliases instead of relative imports:

- `@rahino/bpmn` or `@rahino/bpmn/*` for bpmn app
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
- `processor/` subdirectory - BullMQ processors (if needed)

### Authentication & Authorization

- Admin controllers: `@UseGuards(JwtGuard, PermissionGuard)` at class level
- Method permissions: `@CheckPermission({ permissionSymbol: 'path.to.permission' })`
- Get authenticated user: `@GetUser() user: User` parameter
- Public controllers: Use `OptionalJwtGuard`, `OptionalSessionGuard`

### Response Format

- Apply `@UseInterceptors(JsonResponseTransformInterceptor)` at method level
- Return objects with `{ result: data, total?: number }` structure for paginated responses

### ORM (Sequelize)

- Models in `libs/localdatabase/src/models/<domain>/`
- Each model directory must have an `index.ts` exporting all models
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
```

#### Workflow (when adding/changing entities)

1. **Edit or create** `*.entity.ts` files in `libs/localdatabase/src/models/<domain>/`
2. **Generate migrations**: Run `npm run gen:migration` (combines snapshot + generate)
   - Or step-by-step: `gen:migration:snapshot` → `gen:migration:diff` (verify) → `npm run gen:migration` (which does snapshot + generate when no snapshot changes)

#### Migration File Conventions

- **Naming**: `{YYYYMMDD}-{NNNN}-{action}-{tablename}[-{detail}].ts`
  - e.g., `20260519-0001-core-create-settings-table.ts`
  - e.g., `20260519-0008-core-alter-users-add-birthdate.ts`
- **Actions**: `create` (CREATE TABLE), `alter` with `add-{col}`, `modify-{col}`, `drop-{col}`
- **Sequence**: 4-digit zero-padded number incrementing from the highest existing number

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

#### Migration Index Registration

- All migrations must be registered in `apps/main/src/migrator/migrations/index.ts`
- The generator auto-updates this file with import statements and array entries
- **Core tables**: Use `m(module)` wrapper
- **EAV-prefixed tables**: Use `cond(module, 'SITE_NAME', 'ecommerce')` wrapper
- **BPMN-prefixed tables**: Use `cond(module, 'SITE_NAME', 'bpmn')` wrapper

#### Runtime Migration Execution

- Migrations run on app startup via `UmzugMigrationService` (only on the primary cluster instance)
- Tracked in database table `UmzugMeta` (schema) and `UmzugSeedMeta` (seeds)
- Seeds live in `apps/main/src/migrator/seeds/` and `apps/main/src/migrator/permissions/`

#### Migration File Locations

| Directory                                     | Contents                                  |
| --------------------------------------------- | ----------------------------------------- |
| `apps/main/src/migrator/migrations/`          | Schema migration `.ts` files + `index.ts` |
| `apps/main/src/migrator/seeds/`               | Seed data `.ts` files + `index.ts`        |
| `apps/main/src/migrator/permissions/`         | Permission seeding files                  |
| `apps/main/src/migrator/models-snapshot.json` | Current model metadata snapshot           |

#### Key Libraries

- **`umzug`** - Runtime migration runner (applies pending migrations on startup)
- **`sequelize-typescript`** - ORM with decorators (`@Table`, `@Column`, `@ForeignKey`)
- Dialect adapters in `dialect-adapters.ts` support mssql, postgres, sqlite

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
