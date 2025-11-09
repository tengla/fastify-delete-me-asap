import type Surreal from "surrealdb";
import { RecordId } from "surrealdb";

export type Item = {
  id: number;
  name: string;
  age: number;
  message: string;
};

export interface ItemRepository {
  createItem(item: Item): Promise<Item>;
  getItems(): Promise<Item[]>;
  findById(id: number): Promise<Item | undefined>;
}

export class SurrealItemRepository implements ItemRepository {
  constructor(private readonly surrealClient: Surreal) {}

  async createItem(item: Item): Promise<Item> {
    const newItems = await this.surrealClient.insert<Item>("item", item);
    const newItem = newItems[0];
    return {
      id: Number(newItem?.id.id),
      name: newItem!.name,
      age: newItem!.age,
      message: newItem!.message,
    };
  }

  async getItems(): Promise<Item[]> {
    const result = await this.surrealClient.select<Item>("item");
    return result.map((item) => ({
      id: Number(item.id.id),
      name: item.name,
      age: item.age,
      message: item.message,
    }));
  }

  async findById(id: number): Promise<Item | undefined> {
    const recordId = new RecordId("item", id);
    const result = await this.surrealClient.select<Item>(recordId);
    return {
      id: Number(result.id.id),
      name: result.name,
      age: result.age,
      message: result.message,
    };
  }
}
