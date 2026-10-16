extends Node

# Autoload singleton: estado da partida e regras de combate.
# Espelha a logica que prototipamos em React (GameContext.jsx / combat.js / leveling.js).

const PERSONAGEM_BASE := {
	"nome": "Jogador",
	"hp_max": 40,
	"energia_max": 20,
	"ataque": 8,
	"defesa": 3,
	"sprite": "res://assets/sprites/jogador.png",
}

# Dicionario de personagens jogaveis (hoje so tem um, mas ja deixa pronto
# pra quando tiver mais - usado no painel de debug pra escolher quem jogar).
const PERSONAGENS := {
	"jogador": PERSONAGEM_BASE,
}

const INIMIGOS := {
	"livriox": {
		"nome": "Livriox",
		"hp_max": 25,
		"ataque": 6,
		"defesa": 1,
		"xp_recompensa": 15,
		"sprite": "res://assets/sprites/livriox.png",
	},
	"observadores": {
		"nome": "Observadores",
		"hp_max": 35,
		"ataque": 8,
		"defesa": 2,
		"xp_recompensa": 25,
		"sprite": "res://assets/sprites/observadores.png",
	},
	"julgadores": {
		"nome": "Julgadores",
		"hp_max": 30,
		"ataque": 7,
		"defesa": 2,
		"xp_recompensa": 20,
		"sprite": "res://assets/sprites/julgadores.png",
	},
	"roomba": {
		"nome": "Roomba",
		"hp_max": 20,
		"ataque": 5,
		"defesa": 0,
		"xp_recompensa": 12,
		"anim_frames": "res://assets/sprites/roomba/roomba_frames.tres",
	},
}

const HABILIDADE := {
	"nome": "Ataque Furioso",
	"custo_energia": 8,
	"multiplicador_dano": 1.8,
}

const ITEM := {
	"nome": "Poção de Cura",
	"cura": 15,
	"quantidade_inicial": 2,
}

const DELAY_TURNO_INIMIGO := 1.8

var personagem_atual: Dictionary = PERSONAGEM_BASE
var inimigo_atual: Dictionary
var hp_jogador: int
var hp_inimigo: int
var energia_jogador: int
var quantidade_itens: int
var turno := "jogador"
var resultado := ""
var xp_ganha := 0
var log_mensagens: Array[String] = []

# Usado pra entrar numa batalha vinda do mapa do mundo (world.tscn), pulando
# o painel de debug e voltando pro mundo quando a batalha terminar.
var proximo_inimigo_id := ""
var veio_do_mundo := false

signal estado_mudou
signal inimigo_atacou
signal inimigo_tomou_dano

var _timer_turno_inimigo: Timer

func _ready() -> void:
	_timer_turno_inimigo = Timer.new()
	_timer_turno_inimigo.one_shot = true
	_timer_turno_inimigo.wait_time = DELAY_TURNO_INIMIGO
	_timer_turno_inimigo.timeout.connect(_ao_terminar_delay_turno_inimigo)
	add_child(_timer_turno_inimigo)

func _ao_terminar_delay_turno_inimigo() -> void:
	_turno_do_inimigo()
	estado_mudou.emit()

func iniciar_batalha(inimigo_id: String, personagem_id: String = "jogador") -> void:
	personagem_atual = PERSONAGENS[personagem_id].duplicate()
	if personagem_id == "jogador" and Personagem.nome != "":
		personagem_atual.nome = Personagem.nome
	inimigo_atual = INIMIGOS[inimigo_id]
	hp_jogador = personagem_atual.hp_max
	hp_inimigo = inimigo_atual.hp_max
	energia_jogador = personagem_atual.energia_max
	quantidade_itens = ITEM.quantidade_inicial
	turno = "jogador"
	resultado = ""
	xp_ganha = 0
	log_mensagens = ["Um %s apareceu!" % inimigo_atual.nome]
	estado_mudou.emit()

func _calcular_dano(ataque: int, defesa: int, multiplicador: float = 1.0) -> int:
	return max(1, roundi(ataque * multiplicador - defesa))

func _adicionar_log(mensagem: String) -> void:
	log_mensagens.append(mensagem)
	if log_mensagens.size() > 5:
		log_mensagens.pop_front()

func _turno_do_inimigo() -> void:
	if resultado != "":
		return
	var dano := _calcular_dano(inimigo_atual.ataque, personagem_atual.defesa)
	hp_jogador -= dano
	_adicionar_log("%s atacou e causou %d de dano." % [inimigo_atual.nome, dano])
	inimigo_atacou.emit()
	if hp_jogador <= 0:
		hp_jogador = 0
		resultado = "derrota"
	else:
		turno = "jogador"

func atacar() -> void:
	if turno != "jogador" or resultado != "":
		return
	var dano := _calcular_dano(personagem_atual.ataque, inimigo_atual.defesa)
	hp_inimigo -= dano
	_adicionar_log("Você atacou e causou %d de dano." % dano)
	inimigo_tomou_dano.emit()
	turno = "inimigo"
	if hp_inimigo <= 0:
		hp_inimigo = 0
		resultado = "vitoria"
		xp_ganha = inimigo_atual.xp_recompensa
		estado_mudou.emit()
	else:
		estado_mudou.emit()
		_timer_turno_inimigo.start()

func usar_habilidade() -> void:
	if turno != "jogador" or resultado != "":
		return
	if energia_jogador < HABILIDADE.custo_energia:
		_adicionar_log("Energia insuficiente!")
		estado_mudou.emit()
		return
	var dano := _calcular_dano(personagem_atual.ataque, inimigo_atual.defesa, HABILIDADE.multiplicador_dano)
	hp_inimigo -= dano
	energia_jogador -= HABILIDADE.custo_energia
	_adicionar_log("Você usou %s e causou %d de dano." % [HABILIDADE.nome, dano])
	inimigo_tomou_dano.emit()
	turno = "inimigo"
	if hp_inimigo <= 0:
		hp_inimigo = 0
		resultado = "vitoria"
		xp_ganha = inimigo_atual.xp_recompensa
		estado_mudou.emit()
	else:
		estado_mudou.emit()
		_timer_turno_inimigo.start()

func usar_item() -> void:
	if turno != "jogador" or resultado != "":
		return
	if quantidade_itens <= 0:
		_adicionar_log("Você não tem mais poções!")
		estado_mudou.emit()
		return
	quantidade_itens -= 1
	var cura: int = min(ITEM.cura, personagem_atual.hp_max - hp_jogador)
	hp_jogador += cura
	_adicionar_log("Você usou %s e recuperou %d de HP." % [ITEM.nome, cura])
	turno = "inimigo"
	estado_mudou.emit()
	_timer_turno_inimigo.start()

func fugir() -> void:
	resultado = "fuga"
	estado_mudou.emit()
