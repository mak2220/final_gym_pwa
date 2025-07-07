import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "devrel.template.nextjs" };

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
  clientPromise = Promise.resolve(client);
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Create a function that can be imported elsewhere
export async function connectToDatabase() {
  try {
    await clientPromise;
    return client.db("app_gym");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error al conectar con MongoDB:", error.message);  // Error correctamente tipificado
      throw new Error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error("Error desconocido:", error);
      throw new Error("Error desconocido al conectar con MongoDB");
    }
  }
}
export default client;
