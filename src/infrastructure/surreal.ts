import Surreal from "surrealdb";

export async function createClient() {
  const client = new Surreal();
  await client.connect("http://localhost:8000/rpc");

  await client.use({
    namespace: process.env.SURREAL_NAMESPACE,
    database: process.env.SURREAL_DATABASE,
  });

  await client.signin({
    username: process.env.SURREAL_USER!,
    password: process.env.SURREAL_PASS!,
  });

  return client;
}
