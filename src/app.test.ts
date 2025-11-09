import { afterAll, describe, expect, it } from "bun:test";
import app from "./app";
import { buildContainer } from "./container";

describe("GET /items/:id", () => {
  afterAll(async () => {
    const container = await buildContainer();
    const surrealClient = container.cradle.surrealClient;
    await surrealClient.delete("item");
  });

  it("should create an item", async () => {
    await app.ready(); // Ensure app is fully initialized
    const response = await app.inject({
      method: "POST",
      url: "/123",
      payload: {
        name: "Test Item",
        age: 30,
      },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({
      id: 123,
      name: "Test Item",
      age: 30,
      message: "Item created successfully",
    });
  });
  it("should retrieve the created item", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/123",
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({
      id: 123,
      name: "Test Item",
      age: 30,
      message: "Item created successfully",
    });
  });
});
