export type Item = {
  id: number;
  name: string;
  age: number;
  message: string;
};

export interface ItemRepository {
  createItem(item: Item): Item;
  getItems(): Item[];
  findById(id: number): Item | undefined;
}

export class InMemoryItemRepository implements ItemRepository {
  private items = new Map<number, Item>();

  createItem(item: Item): Item {
    this.items.set(item.id, item);
    return item;
  }

  getItems(): Item[] {
    return [...this.items.values()].sort((a, b) => a.id - b.id);
  }

  findById(id: number): Item | undefined {
    return this.items.get(id);
  }
}
