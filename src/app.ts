import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { buildContainer } from "./container";

const app = fastify();

// Initialize DI container
const container = buildContainer();

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

app.register(swaggerUi, {
  routePrefix: "/docs",
});

// Register routes using DI-injected controller
app.register((instance) => {
  const itemsController = container.resolve("itemsController");
  itemsController.register(instance);
});

export default app;
