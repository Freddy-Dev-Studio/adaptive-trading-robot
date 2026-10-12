import "dotenv/config";
import {
  conectarBaseDatos,
  cerrarConexionBaseDatos,
} from "./config/database.js";

async function iniciarAplicacion(): Promise<void> {
  console.log("====================================");
  console.log("     ADAPTIVE TRADING ROBOT");
  console.log("====================================");

  try {
    await conectarBaseDatos();

    console.log("Estado: backend iniciado correctamente");
    console.log("Entorno: desarrollo");
  } catch (error: unknown) {
    console.error("No se pudo iniciar el backend:", error);
    process.exitCode = 1;
  } finally {
    await cerrarConexionBaseDatos();
  }
}

iniciarAplicacion().catch((error: unknown) => {
  console.error("Error inesperado al iniciar la aplicación:", error);
  process.exitCode = 1;
});