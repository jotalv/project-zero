extends Node2D

# Personagem montado em camadas (corpo, roupa, cabelo, acessório) a partir do autoload
# Personagem. Usado na tela de criação e no mapa.
# Folha 8x8 de quadros 64x64, quadro = linha * 8 + coluna:
#   parado: coluna 0, linhas 0-3 | andando: colunas 0-5, linhas 4-7
#   ordem das linhas: baixo, cima, direita, esquerda

const DIRECOES := {"baixo": 0, "cima": 1, "direita": 2, "esquerda": 3}
const QUADROS_ANDANDO := 6
const FPS_ANDANDO := 10.0
# Os pés ficam ~12 px abaixo do centro do quadro; o deslocamento deixa a
# origem do nó nos pés, que é o ponto que encosta no chão do mapa.
const DESLOCAMENTO_PES := Vector2(0, -12)

var direcao := "baixo"
var andando := false
var _tempo := 0.0
var _camadas := {}

func _ready() -> void:
	for camada in Personagem.CAMADAS:
		var sprite := Sprite2D.new()
		sprite.hframes = 8
		sprite.vframes = 8
		sprite.offset = DESLOCAMENTO_PES
		sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		add_child(sprite)
		_camadas[camada] = sprite
	Personagem.aparencia_mudou.connect(atualizar_aparencia)
	atualizar_aparencia()
	_atualizar_quadro()

func atualizar_aparencia() -> void:
	for camada in Personagem.CAMADAS:
		var sprite: Sprite2D = _camadas[camada]
		sprite.texture = Personagem.textura(camada)
		sprite.modulate = Personagem.cor(camada)

func olhar(nova_direcao: String) -> void:
	direcao = nova_direcao
	_atualizar_quadro()

func definir_andando(valor: bool) -> void:
	if andando == valor:
		return
	andando = valor
	_tempo = 0.0
	_atualizar_quadro()

func _process(delta: float) -> void:
	if not andando:
		return
	_tempo += delta
	_atualizar_quadro()

func _atualizar_quadro() -> void:
	var linha: int = DIRECOES[direcao]
	var coluna := 0
	if andando:
		linha += 4
		coluna = int(_tempo * FPS_ANDANDO) % QUADROS_ANDANDO
	for sprite in _camadas.values():
		sprite.frame = linha * 8 + coluna
