import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import Type from "typebox";

import { baseResponseSchema } from "../common/base-response-schema";
import type { ItemRepository } from "../repositories/item";

const ItemSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    age: Type.Number(),
    message: Type.String(),
  },
  {
    description: "An item object",
    $id: "Item",
    title: "Item",
  }
);

const CreateItemSchema = Type.Object(
  {
    name: Type.String(),
    age: Type.Number(),
  },
  {
    description: "Payload containing name and age",
    $id: "CreateItem",
    title: "CreateItem",
  }
);

const ItemParamsSchema = Type.Object(
  {
    id: Type.Number(),
  },
  {
    description: "Parameters containing the item ID",
    $id: "CreateItemParams",
    title: "CreateItemParams",
  }
);

export class ItemsController {
  constructor(private readonly itemRepository: ItemRepository) {}

  register(instance: FastifyInstance) {
    // Register schema with Fastify's validator after swagger plugin
    //instance.addSchema(ItemSchema);
    //instance.addSchema(CreateItemSchema);
    //instance.addSchema(ItemParamsSchema);

    const route = instance.withTypeProvider<TypeBoxTypeProvider>();

    route.post(
      "/:id",
      {
        schema: {
          operationId: "createItem",
          params: ItemParamsSchema,
          body: CreateItemSchema,
          response: {
            200: ItemSchema,
            ...baseResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params;
        if (id < 100) {
          return reply
            .status(400)
            .send({ message: "ID must be 100 or greater" });
        }
        const { name, age } = request.body;
        const item = this.itemRepository.createItem({
          id,
          name,
          age,
          message: "Item created successfully",
        });
        console.log(`ID: ${id}, Name: ${name}, Age: ${age}`);
        return reply.send(item);
      }
    );

    route.get(
      "/:id",
      {
        schema: {
          operationId: "getItemById",
          params: ItemParamsSchema,
          response: {
            200: ItemSchema,
            ...baseResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params;
        const item = this.itemRepository.findById(id);
        if (!item) {
          return reply.status(404).send({ message: "Item not found" });
        }
        return item;
      }
    );

    route.get(
      "/",
      {
        schema: {
          operationId: "getItems",
          response: {
            200: Type.Array(ItemSchema),
            ...baseResponseSchema,
          },
        },
      },
      () => {
        return this.itemRepository.getItems();
      }
    );
  }
}
