extends Node2D

const COLUNAS := 12
const LINHAS := 12
const CELULAS_BLOQUEADAS: Array[Vector2i] = [
	Vector2i(3, 3),
	Vector2i(8, 2),
	Vector2i(5, 9),
	Vector2i(9, 8),
	Vector2i(2, 8),
]
const CELULA_ITEM := Vector2i(6, 3)
const INIMIGO_DO_ITEM := "livriox"

var item_coletado := false

@onready var item_visual: Node2D = $Entidades/Item
@onready var dialogo: CanvasLayer = $DialogoBatalha
@onready var botao_personagem: Button = $Hud/BotaoPersonagem

func _ready() -> void:
	botao_personagem.pressed.connect(func():
		get_tree().change_scene_to_file("res://criar_personagem.tscn")
	)

func esta_livre(celula: Vector2i) -> bool:
	if celula.x < 0 or celula.x >= COLUNAS or celula.y < 0 or celula.y >= LINHAS:
		return false
	return not CELULAS_BLOQUEADAS.has(celula)

func ao_entrar_em_celula(celula: Vector2i) -> void:
	if item_coletado or celula != CELULA_ITEM:
		return
	item_coletado = true
	item_visual.visible = false
	dialogo.mostrar(INIMIGO_DO_ITEM)
