extends CanvasLayer

@onready var botao_sim: Button = $Painel/BotaoSim
@onready var botao_nao: Button = $Painel/BotaoNao

var _inimigo_id := ""

func _ready() -> void:
	visible = false
	botao_sim.pressed.connect(_ao_confirmar)
	botao_nao.pressed.connect(_ao_recusar)

func mostrar(inimigo_id: String) -> void:
	_inimigo_id = inimigo_id
	visible = true

func _ao_confirmar() -> void:
	visible = false
	Jogo.proximo_inimigo_id = _inimigo_id
	Jogo.veio_do_mundo = true
	get_tree().change_scene_to_file("res://main.tscn")

func _ao_recusar() -> void:
	visible = false
