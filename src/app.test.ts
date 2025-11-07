import { describe, expect, it } from "bun:test";
import app from "./app";

describe("GET /items/:id", () => {
  it("should return 200 and the item data", async () => {
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
});
