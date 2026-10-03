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
}

const HABILIDADE := {
	"nome": "Ataque Furioso",
	"custo_energia": 8,
	"multiplicador_dano": 1.8,
}

var personagem_atual: Dictionary = PERSONAGEM_BASE
var inimigo_atual: Dictionary
var hp_jogador: int
var hp_inimigo: int
var energia_jogador: int
var turno := "jogador"
var resultado := ""
var xp_ganha := 0
var log_mensagens: Array[String] = []

signal estado_mudou

func iniciar_batalha(inimigo_id: String, personagem_id: String = "jogador") -> void:
	personagem_atual = PERSONAGENS[personagem_id]
	inimigo_atual = INIMIGOS[inimigo_id]
	hp_jogador = personagem_atual.hp_max
	hp_inimigo = inimigo_atual.hp_max
	energia_jogador = personagem_atual.energia_max
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
	turno = "inimigo"
	if hp_inimigo <= 0:
		hp_inimigo = 0
		resultado = "vitoria"
		xp_ganha = inimigo_atual.xp_recompensa
	else:
		_turno_do_inimigo()
	estado_mudou.emit()

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
	turno = "inimigo"
	if hp_inimigo <= 0:
		hp_inimigo = 0
		resultado = "vitoria"
		xp_ganha = inimigo_atual.xp_recompensa
	else:
		_turno_do_inimigo()
	estado_mudou.emit()

func fugir() -> void:
	resultado = "fuga"
	estado_mudou.emit()
