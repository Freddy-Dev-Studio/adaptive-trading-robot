import type {
  ConfiguracionRiesgo,
  DatosOperacion,
  ResultadoEvaluacionRiesgo,
} from "./risk.types.js";

export function evaluarOperacion(
  configuracion: ConfiguracionRiesgo,
  operacion: DatosOperacion,
): ResultadoEvaluacionRiesgo {
  const motivosRechazo: string[] = [];

  const precios = [
    operacion.precioEntrada,
    operacion.precioStopLoss,
    operacion.precioTakeProfit,
  ];

  const preciosValidos = precios.every(
    (precio) => Number.isFinite(precio) && precio > 0,
  );

  if (!preciosValidos) {
    motivosRechazo.push("Los precios deben ser números positivos y finitos.");
  }

  const direccionValida =
    operacion.direccion === "COMPRA" ||
    operacion.direccion === "VENTA";

  if (!direccionValida) {
    motivosRechazo.push("La dirección de la operación no es válida.");
  }

  const entrada = operacion.precioEntrada;
  const stopLoss = operacion.precioStopLoss;
  const takeProfit = operacion.precioTakeProfit;

  if (preciosValidos && direccionValida) {
    if (operacion.direccion === "COMPRA") {
      if (stopLoss >= entrada) {
        motivosRechazo.push(
          "En una compra, el Stop Loss debe estar por debajo de la entrada.",
        );
      }

      if (takeProfit <= entrada) {
        motivosRechazo.push(
          "En una compra, el Take Profit debe estar por encima de la entrada.",
        );
      }
    } else {
      if (stopLoss <= entrada) {
        motivosRechazo.push(
          "En una venta, el Stop Loss debe estar por encima de la entrada.",
        );
      }

      if (takeProfit >= entrada) {
        motivosRechazo.push(
          "En una venta, el Take Profit debe estar por debajo de la entrada.",
        );
      }
    }
  }

  const distanciaStop = Math.abs(entrada - stopLoss);
  const distanciaObjetivo = Math.abs(takeProfit - entrada);

  const relacionRiesgoBeneficio =
    preciosValidos && distanciaStop > 0
      ? distanciaObjetivo / distanciaStop
      : 0;

  if (
    preciosValidos &&
    relacionRiesgoBeneficio < configuracion.relacionRiesgoBeneficio
  ) {
    motivosRechazo.push(
      `La relación riesgo/beneficio debe ser al menos 1:${configuracion.relacionRiesgoBeneficio}.`,
    );
  }

  const riesgoMonetario =
    Number.isFinite(configuracion.capitalReferencia) &&
    Number.isFinite(configuracion.porcentajeRiesgo) &&
    configuracion.capitalReferencia > 0 &&
    configuracion.porcentajeRiesgo > 0
      ? configuracion.capitalReferencia *
        (configuracion.porcentajeRiesgo / 100)
      : 0;

  const beneficioPotencial =
    riesgoMonetario * relacionRiesgoBeneficio;

  return {
    aprobada: motivosRechazo.length === 0,
    motivosRechazo,
    riesgoMonetario,
    beneficioPotencial,
    relacionRiesgoBeneficio,
  };
}