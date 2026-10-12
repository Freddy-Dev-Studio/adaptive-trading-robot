import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const usuario = process.env.MONGODB_USER;
const contraseña = process.env.MONGODB_PASSWORD;
const baseAutenticacion = process.env.MONGODB_AUTH_SOURCE;

if (!uri || !usuario || !contraseña || !baseAutenticacion) {
  throw new Error(
    "Falta configurar una o más variables de entorno de MongoDB."
  );
}

const clienteMongoDB = new MongoClient(uri, {
  auth: {
    username: usuario,
    password: contraseña,
  },
  authSource: baseAutenticacion,
  serverSelectionTimeoutMS: 5000,
});

export async function conectarBaseDatos(): Promise<void> {
  await clienteMongoDB.connect();

  await clienteMongoDB
    .db("admin")
    .command({ ping: 1 });

  console.log("MongoDB conectado correctamente.");
}

export async function cerrarConexionBaseDatos(): Promise<void> {
  await clienteMongoDB.close();
}