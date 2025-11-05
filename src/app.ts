import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  Type,
  type Static,
  type TypeBoxTypeProvider,
} from "@fastify/type-provider-typebox";
import fastify, { type FastifyInstance } from "fastify";

const app = fastify();

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

type Item = Static<typeof ItemSchema>;

function createItem(item: Item): Item {
  // Simulate item creation logic
  return item;
}

app.register(swagger, {
  openapi: {
    info: {
      title: "My API",
      description: "API documentation",
      version: "1.0.0",
    },
  },
  refResolver: {
    buildLocalReference: (json, baseUri, fragment, i) => {
      // Use the $id or title property if available
      if (typeof json.$id === "string") return json.$id;
      if (typeof json.title === "string") return json.title;
      return `def-${i}`;
    },
  },
});

// Register schema with Fastify's validator after swagger plugin
app.addSchema(ItemSchema);

app.register(swaggerUi, {
  routePrefix: "/docs",
});

const baseResponseSchema = {
  400: Type.Object(
    {
      message: Type.String(),
    },
    { description: "Bad Request" }
  ),
  401: Type.Object(
    {
      message: Type.String(),
    },
    { description: "Unauthorized" }
  ),
  500: Type.Object(
    {
      message: Type.String(),
    },
    { description: "Internal Server Error" }
  ),
};

const routes = (instance: FastifyInstance) => {
  const route = instance.withTypeProvider<TypeBoxTypeProvider>();
  route.post(
    "/:id",
    {
      schema: {
        operationId: "createItem",
        params: Type.Object(
          {
            id: Type.Number(),
          },
          {
            description: "The ID of the item",
          }
        ),
        body: Type.Object(
          {
            name: Type.String(),
            age: Type.Number(),
          },
          {
            description: "Payload containing name and age",
          }
        ),
        response: {
          200: Type.Ref("Item"),
          ...baseResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      if (id < 100) {
        return reply.status(400).send({ message: "ID must be 100 or greater" });
      }
      const { name, age } = request.body;
      const item = createItem({
        id,
        name,
        age,
        message: "Item created successfully",
      });
      // You can use the extracted parameters and body here
      console.log(`ID: ${id}, Name: ${name}, Age: ${age}`);
      return reply.send(item);
    }
  );
};

app.register(routes);

export default app;
