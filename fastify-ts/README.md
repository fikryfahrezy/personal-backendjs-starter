## [Folder Structure](#folder-tructure)

```
src                                 ->  Application main folder.
|_  api                             ->  Server API folder.
|   |_  middlewares                 ->  API route middleware folder.
|   |   |_  [files].ts              ->  Middleware files.
|   |_  models                      ->  Table or document models folder.
|   |   |_  [databases]             ->  Specified database.
|   |   |   |_ [files].ts           ->  Mapped related database table or document.
|   |_  repositories                ->  Bridge for service to interact with a database or other resources.
|   |   |_  [RouteRepository].ts    ->  Repository for each route.
|   |_  routes                      ->  API routes folder.
|   |   |_  [routes-name]           ->  Route name folder.
|   |   |   |_  controller.ts       ->  Route controller. Handle client request and send feedback to client.
|   |   |   |_  index.ts            ->  Router for controllers.
|   |   |   |_  schemas.ts          ->  Route request and response schema.
|   |   |   |_  service.ts          ->  Route handle logic and process.
|   |   |_  index.ts                ->  Every API version entry point. Register API router for each version.
|   |_  types                       ->  All defined TypeScript types used in API process.
|   |   |_  fastify.ts              ->  Custom fastify type.
|   |   |_  model.ts                ->  Database select query type.
|   |   |_  schema.ts               ->  Schema type.
|   |   |_  utils.ts                ->  Some type used for utility functions.
|   |_  utils                       ->  API utilities folder.
|   |   |_  [files].ts              ->  Utility files.
|   |_  index.ts                    ->  API starting point. Register API version entry point.
|_  config                          ->  Global or server configuration variables.
|   |_  app.ts                      ->  Server entry point. Fastify server, plugin registering process, global server hook and decorator, and schema definitions.
|   |_  env-setup.ts                ->  Load .env file.
|   |_  validateEnv.ts              ->  Validation for needed global variable in application.
|   |_  [files].ts                  ->  Any config files.
|_  databases                       ->  Databases loader folder.
|   |_  [files].ts                  ->  Databases connection configuration.
|_  definitions                     ->  Global JSON-Schema Definition for reusable.
|   |_  index.ts                    ->  Defined structured JSON-Schemas definition to use as a responses route.
|_  utils                           ->  Global (server) utility folder.
|   |_  [files].ts                  ->  Utility config or utility process files.
|_  index.ts                        ->  Application starting point. Contain Fastify server startup and server options, global process exception, environment variable loader, and another loader such as database connection.
```
