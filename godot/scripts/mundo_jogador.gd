extends Node2D

const LARGURA_TILE := 64.0
const ALTURA_TILE := 32.0
const DURACAO_PASSO := 0.15

var grid_pos := Vector2i(6, 6)
var em_movimento := false

func _ready() -> void:
	position = grid_para_tela(grid_pos)

func grid_para_tela(g: Vector2i) -> Vector2:
	return Vector2((g.x - g.y) * LARGURA_TILE / 2.0, (g.x + g.y) * ALTURA_TILE / 2.0)

func _process(_delta: float) -> void:
	if em_movimento:
		return
	var direcao := Vector2i.ZERO
	if Input.is_action_pressed("ui_up"):
		direcao = Vector2i(0, -1)
	elif Input.is_action_pressed("ui_down"):
		direcao = Vector2i(0, 1)
	elif Input.is_action_pressed("ui_left"):
		direcao = Vector2i(-1, 0)
	elif Input.is_action_pressed("ui_right"):
		direcao = Vector2i(1, 0)
	if direcao != Vector2i.ZERO:
		_tentar_mover(direcao)

func _tentar_mover(direcao: Vector2i) -> void:
	var destino := grid_pos + direcao
	if not get_parent().get_parent().esta_livre(destino):
		return
	em_movimento = true
	grid_pos = destino
	var tween := create_tween()
	tween.tween_property(self, "position", grid_para_tela(grid_pos), DURACAO_PASSO)
	tween.finished.connect(func():
		em_movimento = false
		get_parent().get_parent().ao_entrar_em_celula(grid_pos)
	)
