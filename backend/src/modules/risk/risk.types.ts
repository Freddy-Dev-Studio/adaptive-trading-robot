export interface ConfiguracionRiesgo {
  capitalReferencia: number;
  porcentajeRiesgo: number;
  porcentajePerdidaDiaria: number;
  relacionRiesgoBeneficio: number;
}

export interface DatosOperacion {
  instrumento: string;
  precioEntrada: number;
  precioStopLoss: number;
  precioTakeProfit: number;
  direccion: "COMPRA" | "VENTA";
}

export interface ResultadoEvaluacionRiesgo {
  aprobada: boolean;
  motivosRechazo: string[];
  riesgoMonetario: number;
  beneficioPotencial: number;
  relacionRiesgoBeneficio: number;
}