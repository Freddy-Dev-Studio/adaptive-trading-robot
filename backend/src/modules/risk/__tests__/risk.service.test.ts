import { describe, expect, it } from "vitest";
import { evaluarOperacion } from "../risk.service.js";
import type {
  ConfiguracionRiesgo,
  DatosOperacion,
} from "../risk.types.js";

const configuracion: ConfiguracionRiesgo = {
  capitalReferencia: 100,
  porcentajeRiesgo: 0.5,
  porcentajePerdidaDiaria: 2,
  relacionRiesgoBeneficio: 3,
};

describe("Evaluador de riesgo", () => {
  it("aprueba una compra con relación riesgo/beneficio de 1:3", () => {
    const operacion: DatosOperacion = {
      instrumento: "XAU/USD",
      precioEntrada: 4000,
      precioStopLoss: 3990,
      precioTakeProfit: 4030,
      direccion: "COMPRA",
    };

    const resultado = evaluarOperacion(configuracion, operacion);

    expect(resultado.aprobada).toBe(true);
    expect(resultado.relacionRiesgoBeneficio).toBe(3);
    expect(resultado.motivosRechazo).toHaveLength(0);
  });

  it("rechaza una compra cuyo Stop Loss está por encima de la entrada", () => {
    const operacion: DatosOperacion = {
      instrumento: "XAU/USD",
      precioEntrada: 4000,
      precioStopLoss: 4010,
      precioTakeProfit: 4030,
      direccion: "COMPRA",
    };

    const resultado = evaluarOperacion(configuracion, operacion);

    expect(resultado.aprobada).toBe(false);
    expect(resultado.motivosRechazo).toContain(
      "En una compra, el Stop Loss debe estar por debajo de la entrada.",
    );
  });

  it("rechaza una operación con relación riesgo/beneficio inferior a 1:3", () => {
    const operacion: DatosOperacion = {
      instrumento: "XAU/USD",
      precioEntrada: 4000,
      precioStopLoss: 3990,
      precioTakeProfit: 4020,
      direccion: "COMPRA",
    };

    const resultado = evaluarOperacion(configuracion, operacion);

    expect(resultado.aprobada).toBe(false);
    expect(resultado.motivosRechazo).toContain(
      "La relación riesgo/beneficio debe ser al menos 1:3.",
    );
  });

  it("aprueba una venta con relación riesgo/beneficio de 1:3", () => {
    const operacion: DatosOperacion = {
      instrumento: "XAU/USD",
      precioEntrada: 4000,
      precioStopLoss: 4010,
      precioTakeProfit: 3970,
      direccion: "VENTA",
    };

    const resultado = evaluarOperacion(configuracion, operacion);

    expect(resultado.aprobada).toBe(true);
    expect(resultado.relacionRiesgoBeneficio).toBe(3);
  });
});