import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import Type from "typebox";

import { baseResponseSchema } from "../common/base-response-schema";
import type { ItemService } from "../services/items.service";

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
  constructor(private readonly itemService: ItemService) {}

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
        try {
          const { id } = request.params;
          const { name, age } = request.body;

          const item = await this.itemService.createItem({ id, name, age });

          request.log.info(
            { id, name, age },
            `ID: ${id}, Name: ${name}, Age: ${age}`
          );
          return reply.send(item);
        } catch (error) {
          // Handle business logic errors from service
          if (error instanceof Error && error.message.includes("ID must be")) {
            return reply.status(400).send({ message: error.message });
          }
          throw error;
        }
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
        const item = await this.itemService.getItemById(id);
        if (!item) {
          request.log.warn({ id }, `Item with ID ${id} not found`);
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
      async () => {
        return await this.itemService.getAllItems();
      }
    );
  }
}
