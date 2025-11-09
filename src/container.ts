import {
  asClass,
  asValue,
  createContainer,
  InjectionMode,
  type AwilixContainer,
} from "awilix";
import type Surreal from "surrealdb";
import { ItemsController } from "./controllers/items.controller";
import { createClient } from "./infrastructure/surreal";
import {
  SurrealItemRepository,
  type ItemRepository,
} from "./repositories/item";
import { ItemServiceImpl, type ItemService } from "./services/items.service";

export interface Dependencies {
  surrealClient: Surreal;
  itemRepository: ItemRepository;
  itemService: ItemService;
  itemsController: ItemsController;
}

export async function buildContainer(): Promise<AwilixContainer<Dependencies>> {
  const container = createContainer<Dependencies>({
    injectionMode: InjectionMode.PROXY,
  });

  // Eagerly initialize all dependencies to avoid proxy issues
  const surrealClientInstance = await createClient();
  const itemRepositoryInstance = new SurrealItemRepository(surrealClientInstance);
  const itemServiceInstance = new ItemServiceImpl(itemRepositoryInstance);
  const itemsControllerInstance = new ItemsController(itemServiceInstance);

  container.register({
    // Register all as values (already instantiated)
    surrealClient: asValue(surrealClientInstance),
    itemRepository: asValue(itemRepositoryInstance),
    itemService: asValue(itemServiceInstance),
    itemsController: asValue(itemsControllerInstance),
  });

  return container;
}
