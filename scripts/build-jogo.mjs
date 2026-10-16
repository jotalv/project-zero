// Exporta o projeto Godot (pasta godot/) para public/jogo/, onde a rota /jogo do app carrega.
// Usa o executável do Godot da variável GODOT ou, se não houver, o comando "godot" do PATH.
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';

const godot = process.env.GODOT || 'godot';
const destino = 'public/jogo';

rmSync(destino, { recursive: true, force: true });
mkdirSync(destino, { recursive: true });

const resultado = spawnSync(
  godot,
  ['--headless', '--path', 'godot', '--export-release', 'Web', `../${destino}/index.html`],
  { stdio: 'inherit' }
);

if (resultado.error) {
  console.error(`Não foi possível rodar "${godot}". Instale o Godot 4.7 ou defina a variável GODOT com o caminho do executável.`);
  process.exit(1);
}
process.exit(resultado.status ?? 1);
