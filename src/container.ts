import {
  asClass,
  asFunction,
  createContainer,
  InjectionMode,
  type AwilixContainer,
} from "awilix";
import { ItemsController } from "./controllers/items.controller";
import {
  InMemoryItemRepository,
  type ItemRepository,
} from "./repositories/item";

export interface Dependencies {
  itemRepository: ItemRepository;
  itemsController: ItemsController;
}

export function buildContainer(): AwilixContainer<Dependencies> {
  const container = createContainer<Dependencies>({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({
    // Register repository as singleton with interface type
    itemRepository: asClass(InMemoryItemRepository).singleton(),

    // Register controller with injected dependencies using factory
    itemsController: asFunction(
      ({ itemRepository }: Dependencies) => new ItemsController(itemRepository)
    ).singleton(),
  });

  return container;
}
