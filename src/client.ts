import { createClient, createConfig } from "./client-sdk/client";
import { createItem } from "./client-sdk/sdk.gen";

const client = createClient(
  createConfig({
    baseUrl: "http://localhost:3000",
  })
);

async function main() {
  const { data, error } = await createItem({
    client: client,
    path: { id: 122 },
    body: {
      name: "Test Item",
      age: 25,
    },
  });
  if (error) {
    console.error("error: %s", error.message);
    return;
  }
  console.log("data: %o", data);
}

main().catch((err) => {
  console.error(err);
});
