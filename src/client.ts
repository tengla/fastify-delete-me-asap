import { createClient, createConfig } from "./client-sdk/client";
import { createItem, getItems } from "./client-sdk/sdk.gen";

const client = createClient(
  createConfig({
    baseUrl: "http://localhost:3000",
  })
);

async function main() {
  await Promise.all([
    createItem({
      client: client,
      path: { id: 121 },
      body: {
        name: "Test Item",
        age: 25,
      },
    }),
    createItem({
      client: client,
      path: { id: 122 },
      body: {
        name: "Test Item",
        age: 25,
      },
    }),
    createItem({
      client: client,
      path: { id: 123 },
      body: {
        name: "Test Item",
        age: 25,
      },
    }),
    createItem({
      client: client,
      path: { id: 124 },
      body: {
        name: "Test Item",
        age: 25,
      },
    }),
  ]);
  const { data: getItemsData, error: getItemsError } = await getItems({
    client,
  });
  if (getItemsError) {
    console.error("error: %s", getItemsError.message);
    return;
  }
  console.log("items: %o", getItemsData);
}

main().catch((err) => {
  console.error(err);
});
