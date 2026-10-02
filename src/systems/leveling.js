export function xpNecessariaParaNivel(nivel) {
  return nivel * 50;
}

export function calcularSubidaDeNivel(nivelAtual, xpAtual, xpGanha) {
  let nivel = nivelAtual;
  let xp = xpAtual + xpGanha;

  while (xp >= xpNecessariaParaNivel(nivel)) {
    xp -= xpNecessariaParaNivel(nivel);
    nivel += 1;
  }

  return { nivel, xp };
}
