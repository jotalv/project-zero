export function calcularDano(ataque, defesa, multiplicador = 1) {
  const danoBase = ataque * multiplicador - defesa;
  return Math.max(1, Math.round(danoBase));
}

export function verificarVitoria(hpInimigo) {
  return hpInimigo <= 0;
}

export function verificarDerrota(hpJogador) {
  return hpJogador <= 0;
}
