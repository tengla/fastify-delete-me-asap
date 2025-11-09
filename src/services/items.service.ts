import type { Item, ItemRepository } from "../repositories/item";

export interface CreateItemInput {
  id: number;
  name: string;
  age: number;
}

export interface ItemService {
  createItem(input: CreateItemInput): Promise<Item>;
  getItemById(id: number): Promise<Item | undefined>;
  getAllItems(): Promise<Item[]>;
}

export class ItemServiceImpl implements ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async createItem(input: CreateItemInput): Promise<Item> {
    // Business rule: ID must be 100 or greater
    if (input.id < 100) {
      throw new Error("ID must be 100 or greater");
    }

    // Business logic: enrich the item with a success message
    const item: Item = {
      ...input,
      message: "Item created successfully",
    };

    return await this.itemRepository.createItem(item);
  }

  async getItemById(id: number): Promise<Item | undefined> {
    return await this.itemRepository.findById(id);
  }

  async getAllItems(): Promise<Item[]> {
    return await this.itemRepository.getItems();
  }
}
