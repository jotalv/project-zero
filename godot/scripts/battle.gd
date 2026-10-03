extends Control

@onready var retrato_jogador: TextureRect = $RetratoJogador
@onready var nome_jogador: Label = $NomeJogador
@onready var vida_jogador: ProgressBar = $VidaJogador
@onready var energia_jogador: ProgressBar = $EnergiaJogador

@onready var retrato_inimigo: TextureRect = $RetratoInimigo
@onready var nome_inimigo: Label = $NomeInimigo
@onready var vida_inimigo: ProgressBar = $VidaInimigo

@onready var log_label: Label = $LogLabel
@onready var botao_atacar: Button = $BotaoAtacar
@onready var botao_habilidade: Button = $BotaoHabilidade
@onready var botao_fugir: Button = $BotaoFugir
@onready var resultado_label: Label = $ResultadoLabel
@onready var botao_continuar: Button = $BotaoContinuar

@onready var painel_debug: Control = $PainelDebug
@onready var personagem_opcao: OptionButton = $PainelDebug/PersonagemOpcao
@onready var inimigo_opcao: OptionButton = $PainelDebug/InimigoOpcao
@onready var botao_comecar: Button = $PainelDebug/BotaoComecar

func _ready() -> void:
	vida_jogador.max_value = 1
	energia_jogador.max_value = 1

	botao_habilidade.text = "%s\n(%d EN)" % [Jogo.HABILIDADE.nome.to_upper(), Jogo.HABILIDADE.custo_energia]

	botao_atacar.pressed.connect(Jogo.atacar)
	botao_habilidade.pressed.connect(Jogo.usar_habilidade)
	botao_fugir.pressed.connect(Jogo.fugir)
	botao_continuar.pressed.connect(_ao_continuar)
	botao_comecar.pressed.connect(_ao_comecar_debug)

	Jogo.estado_mudou.connect(_atualizar_ui)

	_preencher_opcoes_debug()
	_mostrar_painel_debug()

func _preencher_opcoes_debug() -> void:
	for id in Jogo.PERSONAGENS.keys():
		personagem_opcao.add_item(Jogo.PERSONAGENS[id].nome)
		personagem_opcao.set_item_metadata(personagem_opcao.item_count - 1, id)
	for id in Jogo.INIMIGOS.keys():
		inimigo_opcao.add_item(Jogo.INIMIGOS[id].nome)
		inimigo_opcao.set_item_metadata(inimigo_opcao.item_count - 1, id)

func _mostrar_painel_debug() -> void:
	painel_debug.visible = true
	botao_atacar.visible = false
	botao_habilidade.visible = false
	botao_fugir.visible = false
	botao_continuar.visible = false
	resultado_label.visible = false

func _ao_comecar_debug() -> void:
	var personagem_id: String = personagem_opcao.get_item_metadata(personagem_opcao.selected)
	var inimigo_id: String = inimigo_opcao.get_item_metadata(inimigo_opcao.selected)
	painel_debug.visible = false
	Jogo.iniciar_batalha(inimigo_id, personagem_id)

func _atualizar_ui() -> void:
	nome_jogador.text = Jogo.personagem_atual.nome
	retrato_jogador.texture = load(Jogo.personagem_atual.sprite)
	vida_jogador.max_value = Jogo.personagem_atual.hp_max
	energia_jogador.max_value = Jogo.personagem_atual.energia_max

	nome_inimigo.text = Jogo.inimigo_atual.nome
	vida_inimigo.max_value = Jogo.inimigo_atual.hp_max
	retrato_inimigo.texture = load(Jogo.inimigo_atual.sprite)

	vida_jogador.value = Jogo.hp_jogador
	vida_inimigo.value = Jogo.hp_inimigo
	energia_jogador.value = Jogo.energia_jogador

	log_label.text = "\n".join(Jogo.log_mensagens)

	var em_batalha := Jogo.resultado == ""
	var pode_agir := em_batalha and Jogo.turno == "jogador"
	botao_atacar.disabled = not pode_agir
	botao_habilidade.disabled = not pode_agir
	botao_fugir.disabled = not pode_agir
	botao_atacar.visible = em_batalha
	botao_habilidade.visible = em_batalha
	botao_fugir.visible = em_batalha

	resultado_label.visible = not em_batalha
	botao_continuar.visible = not em_batalha
	if Jogo.resultado == "vitoria":
		resultado_label.text = "VITÓRIA! +%d XP" % Jogo.xp_ganha
		resultado_label.modulate = Color("9dff3d")
	elif Jogo.resultado == "derrota":
		resultado_label.text = "VOCÊ FOI DERROTADO"
		resultado_label.modulate = Color("ff3d6e")
	elif Jogo.resultado == "fuga":
		resultado_label.text = "VOCÊ FUGIU"
		resultado_label.modulate = Color("e7edf4")

func _ao_continuar() -> void:
	_mostrar_painel_debug()
