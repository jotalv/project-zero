import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { PERSONAGEM_BASE } from '../../data/characters';
import { HABILIDADES } from '../../data/skills';

const HABILIDADE_PRINCIPAL = HABILIDADES['ataque-furioso'];

function Battle() {
  const navigate = useNavigate();
  const { estado, atacar, usarHabilidade, fugir, resetarBatalha } = useGame();

  useEffect(() => {
    if (!estado.inimigo) {
      navigate('/mundo', { replace: true });
      return;
    }
    if (estado.resultado === 'derrota') {
      navigate('/game-over', { replace: true });
    } else if (estado.resultado === 'fuga') {
      resetarBatalha();
      navigate('/mundo', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.resultado, estado.inimigo]);

  if (!estado.inimigo) return null;

  const handleContinuar = () => {
    resetarBatalha();
    navigate('/mundo', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.window}>
        <div style={styles.topBar}>
          <h1 style={styles.titulo}>BATALHA</h1>
        </div>

        <div style={styles.content}>
          <div style={styles.barraStatus}>
            <span style={styles.nomeCombatente}>VOCÊ</span>
            <div style={styles.hpFundo}>
              <div
                style={{
                  ...styles.hpPreenchido,
                  width: `${(estado.hpJogador / PERSONAGEM_BASE.hpMax) * 100}%`,
                  background: 'var(--neon-cyan)',
                }}
              />
            </div>
            <span style={styles.hpTexto}>
              {estado.hpJogador}/{PERSONAGEM_BASE.hpMax}
            </span>
          </div>

          <div style={styles.barraStatus}>
            <span style={styles.nomeCombatente}>{estado.inimigo.nome.toUpperCase()}</span>
            <div style={styles.hpFundo}>
              <div
                style={{
                  ...styles.hpPreenchido,
                  width: `${(estado.hpInimigo / estado.inimigo.hpMax) * 100}%`,
                  background: 'var(--neon-pink)',
                }}
              />
            </div>
            <span style={styles.hpTexto}>
              {estado.hpInimigo}/{estado.inimigo.hpMax}
            </span>
          </div>

          <div style={styles.log}>
            {estado.log.map((mensagem, i) => (
              <p key={i} style={styles.logLinha}>
                {mensagem}
              </p>
            ))}
          </div>

          {estado.resultado === 'vitoria' ? (
            <div style={styles.resultado}>
              <p style={styles.resultadoTexto}>VITÓRIA! +{estado.xpGanha} XP</p>
              <button type="button" className="neon-button" onClick={handleContinuar}>
                VOLTAR AO MUNDO
              </button>
            </div>
          ) : (
            <div style={styles.acoes}>
              <button
                type="button"
                className="menu-card"
                style={styles.acaoBotao}
                onClick={atacar}
                disabled={estado.turno !== 'jogador' || Boolean(estado.resultado)}
              >
                ATACAR
              </button>
              <button
                type="button"
                className="menu-card"
                style={styles.acaoBotao}
                onClick={() => usarHabilidade('ataque-furioso')}
                disabled={estado.turno !== 'jogador' || Boolean(estado.resultado)}
              >
                {HABILIDADE_PRINCIPAL.nome.toUpperCase()}
                <span style={styles.custoEnergia}>{HABILIDADE_PRINCIPAL.custoEnergia} EN</span>
              </button>
              <button
                type="button"
                className="menu-card"
                style={styles.acaoBotao}
                onClick={fugir}
                disabled={estado.turno !== 'jogador' || Boolean(estado.resultado)}
              >
                FUGIR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'radial-gradient(circle at 50% 20%, #2a1552 0%, var(--neon-bg) 65%)',
    fontFamily: 'var(--font-mono)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  window: {
    backgroundColor: 'var(--neon-panel)',
    border: '2px solid var(--neon-frame)',
    boxShadow: '0 0 10px rgba(74, 31, 143, 0.8), 0 0 40px rgba(53, 228, 255, 0.12)',
    width: '100%',
    maxWidth: '520px',
    minHeight: '480px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    borderRadius: '6px',
  },
  topBar: {
    backgroundColor: 'rgba(53, 228, 255, 0.06)',
    padding: '12px 20px',
    borderBottom: '2px solid var(--neon-frame)',
    borderRadius: '4px 4px 0 0',
  },
  titulo: {
    color: 'var(--neon-cyan)',
    margin: 0,
    fontSize: '18px',
    letterSpacing: '3px',
    fontFamily: 'var(--font-display)',
    textShadow: '0 0 8px var(--neon-cyan-glow)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: '24px 24px 30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  barraStatus: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  nomeCombatente: {
    color: 'var(--text-muted)',
    fontSize: '11px',
    fontFamily: 'var(--font-display)',
    letterSpacing: '1px',
  },
  hpFundo: {
    width: '100%',
    height: '14px',
    backgroundColor: 'var(--neon-bg)',
    border: '1px solid var(--neon-frame)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  hpPreenchido: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  hpTexto: {
    color: 'var(--text-primary)',
    fontSize: '11px',
    alignSelf: 'flex-end',
  },
  log: {
    flex: 1,
    backgroundColor: 'var(--neon-bg)',
    border: '1px solid rgba(53, 228, 255, 0.2)',
    borderRadius: '4px',
    padding: '10px 14px',
    minHeight: '90px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  logLinha: {
    color: 'var(--text-primary)',
    fontSize: '12px',
    margin: '2px 0',
  },
  acoes: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  acaoBotao: {
    position: 'relative',
    backgroundColor: 'var(--neon-bg)',
    border: '1px solid var(--neon-cyan)',
    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
    color: 'var(--neon-cyan)',
    padding: '14px 6px',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
  },
  custoEnergia: {
    display: 'block',
    marginTop: '4px',
    fontSize: '9px',
    color: 'var(--text-muted)',
  },
  resultado: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  resultadoTexto: {
    color: 'var(--neon-lime)',
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    letterSpacing: '1px',
    margin: 0,
  },
};

export default Battle;
