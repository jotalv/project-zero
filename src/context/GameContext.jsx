import { createContext, useContext, useState } from 'react';
import { PERSONAGEM_BASE } from '../data/characters';
import { INIMIGOS } from '../data/enemies';
import { HABILIDADES } from '../data/skills';
import { calcularDano, verificarVitoria, verificarDerrota } from '../systems/combat';

const GameContext = createContext();

const ESTADO_INICIAL = {
  inimigo: null,
  hpJogador: PERSONAGEM_BASE.hpMax,
  hpInimigo: 0,
  energiaJogador: PERSONAGEM_BASE.energiaMax,
  turno: 'jogador',
  log: [],
  resultado: null, // null | 'vitoria' | 'derrota' | 'fuga'
  xpGanha: 0,
};

export function GameProvider({ children }) {
  const [estado, setEstado] = useState(ESTADO_INICIAL);

  const adicionarLog = (lista, mensagem) => [...lista.slice(-4), mensagem];

  const iniciarBatalha = (inimigoId) => {
    const inimigo = INIMIGOS[inimigoId];
    setEstado({
      ...ESTADO_INICIAL,
      inimigo,
      hpInimigo: inimigo.hpMax,
      log: [`Um ${inimigo.nome} apareceu!`],
    });
  };

  const turnoDoInimigo = (estadoAtual) => {
    if (verificarVitoria(estadoAtual.hpInimigo) || verificarDerrota(estadoAtual.hpJogador)) {
      return estadoAtual;
    }

    const dano = calcularDano(estadoAtual.inimigo.ataque, PERSONAGEM_BASE.defesa);
    const hpJogador = estadoAtual.hpJogador - dano;
    const log = adicionarLog(
      estadoAtual.log,
      `${estadoAtual.inimigo.nome} atacou e causou ${dano} de dano.`
    );

    if (verificarDerrota(hpJogador)) {
      return { ...estadoAtual, hpJogador: 0, log, turno: 'inimigo', resultado: 'derrota' };
    }

    return { ...estadoAtual, hpJogador, log, turno: 'jogador' };
  };

  const atacar = () => {
    setEstado((atual) => {
      if (atual.turno !== 'jogador' || atual.resultado) return atual;

      const dano = calcularDano(PERSONAGEM_BASE.ataque, atual.inimigo.defesa);
      const hpInimigo = atual.hpInimigo - dano;
      let novo = {
        ...atual,
        hpInimigo,
        log: adicionarLog(atual.log, `Você atacou e causou ${dano} de dano.`),
        turno: 'inimigo',
      };

      if (verificarVitoria(hpInimigo)) {
        return {
          ...novo,
          hpInimigo: 0,
          resultado: 'vitoria',
          xpGanha: atual.inimigo.xpRecompensa,
        };
      }

      return turnoDoInimigo(novo);
    });
  };

  const usarHabilidade = (habilidadeId) => {
    setEstado((atual) => {
      if (atual.turno !== 'jogador' || atual.resultado) return atual;

      const habilidade = HABILIDADES[habilidadeId];
      if (atual.energiaJogador < habilidade.custoEnergia) {
        return { ...atual, log: adicionarLog(atual.log, 'Energia insuficiente!') };
      }

      const dano = calcularDano(PERSONAGEM_BASE.ataque, atual.inimigo.defesa, habilidade.multiplicadorDano);
      const hpInimigo = atual.hpInimigo - dano;
      let novo = {
        ...atual,
        hpInimigo,
        energiaJogador: atual.energiaJogador - habilidade.custoEnergia,
        log: adicionarLog(atual.log, `Você usou ${habilidade.nome} e causou ${dano} de dano.`),
        turno: 'inimigo',
      };

      if (verificarVitoria(hpInimigo)) {
        return {
          ...novo,
          hpInimigo: 0,
          resultado: 'vitoria',
          xpGanha: atual.inimigo.xpRecompensa,
        };
      }

      return turnoDoInimigo(novo);
    });
  };

  const fugir = () => {
    setEstado((atual) => ({ ...atual, resultado: 'fuga' }));
  };

  const resetarBatalha = () => {
    setEstado(ESTADO_INICIAL);
  };

  return (
    <GameContext.Provider
      value={{ estado, iniciarBatalha, atacar, usarHabilidade, fugir, resetarBatalha }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
