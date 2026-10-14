extends Control

const TAMANHO_ALVO_INIMIGO := 200.0

@onready var retrato_jogador: TextureRect = $RetratoJogador
@onready var nome_jogador: Label = $NomeJogador
@onready var vida_jogador: TextureProgressBar = $VidaJogador
@onready var energia_jogador: ProgressBar = $EnergiaJogador
@onready var texto_vida_jogador: Label = $TextoVidaJogador
@onready var texto_energia_jogador: Label = $TextoEnergiaJogador

@onready var retrato_inimigo: TextureRect = $RetratoInimigo
@onready var retrato_inimigo_animado: AnimatedSprite2D = $RetratoInimigoAnimado
@onready var nome_inimigo: Label = $NomeInimigo
@onready var vida_inimigo: ProgressBar = $VidaInimigo
@onready var texto_vida_inimigo: Label = $TextoVidaInimigo

@onready var log_label: Label = $LogLabel
@onready var painel_turno: Panel = $PainelTurno
@onready var turno_label: Label = $TurnoLabel
@onready var botao_atacar: TextureButton = $BotaoAtacar
@onready var botao_habilidade: TextureButton = $BotaoHabilidade
@onready var custo_habilidade_label: Label = $CustoHabilidadeLabel
@onready var botao_itens: TextureButton = $BotaoItens
@onready var botao_fugir: TextureButton = $BotaoFugir
@onready var resultado_label: Label = $ResultadoLabel
@onready var botao_continuar: Button = $BotaoContinuar

@onready var painel_itens: Control = $PainelItens
@onready var botao_pocao_cura: Button = $PainelItens/BotaoPocaoCura
@onready var botao_voltar_itens: Button = $PainelItens/BotaoVoltarItens

@onready var painel_debug: Control = $PainelDebug
@onready var personagem_opcao: OptionButton = $PainelDebug/PersonagemOpcao
@onready var inimigo_opcao: OptionButton = $PainelDebug/InimigoOpcao
@onready var botao_comecar: Button = $PainelDebug/BotaoComecar

func _ready() -> void:
	vida_jogador.max_value = 1
	energia_jogador.max_value = 1

	custo_habilidade_label.text = "%d EN" % Jogo.HABILIDADE.custo_energia

	botao_atacar.pressed.connect(Jogo.atacar)
	botao_habilidade.pressed.connect(Jogo.usar_habilidade)
	botao_itens.pressed.connect(_abrir_menu_itens)
	botao_fugir.pressed.connect(Jogo.fugir)
	botao_continuar.pressed.connect(_ao_continuar)
	botao_comecar.pressed.connect(_ao_comecar_debug)

	botao_pocao_cura.pressed.connect(_ao_usar_pocao)
	botao_voltar_itens.pressed.connect(_fechar_menu_itens)

	Jogo.estado_mudou.connect(_atualizar_ui)
	Jogo.inimigo_atacou.connect(_ao_inimigo_atacar)
	Jogo.inimigo_tomou_dano.connect(_ao_inimigo_tomar_dano)
	retrato_inimigo_animado.animation_finished.connect(_ao_terminar_animacao_inimigo)

	_preencher_opcoes_debug()

	if Jogo.proximo_inimigo_id != "":
		var inimigo_id := Jogo.proximo_inimigo_id
		Jogo.proximo_inimigo_id = ""
		painel_debug.visible = false
		Jogo.iniciar_batalha(inimigo_id, "jogador")
		_configurar_retrato_inimigo()
	else:
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
	painel_itens.visible = false
	botao_atacar.visible = false
	botao_habilidade.visible = false
	custo_habilidade_label.visible = false
	botao_itens.visible = false
	botao_fugir.visible = false
	botao_continuar.visible = false
	resultado_label.visible = false

func _ao_comecar_debug() -> void:
	var personagem_id: String = personagem_opcao.get_item_metadata(personagem_opcao.selected)
	var inimigo_id: String = inimigo_opcao.get_item_metadata(inimigo_opcao.selected)
	painel_debug.visible = false
	Jogo.iniciar_batalha(inimigo_id, personagem_id)
	_configurar_retrato_inimigo()

func _abrir_menu_itens() -> void:
	painel_itens.visible = true
	botao_atacar.visible = false
	botao_habilidade.visible = false
	custo_habilidade_label.visible = false
	botao_itens.visible = false
	botao_fugir.visible = false

func _fechar_menu_itens() -> void:
	painel_itens.visible = false
	_atualizar_ui()

func _configurar_retrato_inimigo() -> void:
	var inimigo := Jogo.inimigo_atual
	if inimigo.has("anim_frames"):
		var frames: SpriteFrames = load(inimigo.anim_frames)
		retrato_inimigo_animado.sprite_frames = frames
		var textura := frames.get_frame_texture("idle", 0)
		var maior_lado: float = max(textura.get_size().x, textura.get_size().y)
		var escala := TAMANHO_ALVO_INIMIGO / maior_lado
		retrato_inimigo_animado.scale = Vector2(escala, escala)
		retrato_inimigo_animado.play("idle")
		retrato_inimigo_animado.visible = true
		retrato_inimigo.visible = false
	else:
		retrato_inimigo.texture = load(inimigo.sprite)
		retrato_inimigo.visible = true
		retrato_inimigo_animado.visible = false

func _ao_inimigo_atacar() -> void:
	if retrato_inimigo_animado.visible and retrato_inimigo_animado.sprite_frames.has_animation("attack"):
		retrato_inimigo_animado.play("attack")

func _ao_inimigo_tomar_dano() -> void:
	if retrato_inimigo_animado.visible and retrato_inimigo_animado.sprite_frames.has_animation("hurt"):
		retrato_inimigo_animado.play("hurt")

func _ao_terminar_animacao_inimigo() -> void:
	if retrato_inimigo_animado.animation != "idle" and retrato_inimigo_animado.sprite_frames.has_animation("idle"):
		retrato_inimigo_animado.play("idle")

func _ao_usar_pocao() -> void:
	Jogo.usar_item()
	painel_itens.visible = false

func _atualizar_ui() -> void:
	nome_jogador.text = Jogo.personagem_atual.nome
	retrato_jogador.texture = load(Jogo.personagem_atual.sprite)
	vida_jogador.max_value = Jogo.personagem_atual.hp_max
	energia_jogador.max_value = Jogo.personagem_atual.energia_max

	nome_inimigo.text = Jogo.inimigo_atual.nome
	vida_inimigo.max_value = Jogo.inimigo_atual.hp_max

	vida_jogador.value = Jogo.hp_jogador
	vida_inimigo.value = Jogo.hp_inimigo
	energia_jogador.value = Jogo.energia_jogador

	texto_vida_jogador.text = "%d / %d" % [Jogo.hp_jogador, Jogo.personagem_atual.hp_max]
	texto_vida_inimigo.text = "%d / %d" % [Jogo.hp_inimigo, Jogo.inimigo_atual.hp_max]
	texto_energia_jogador.text = "%d / %d" % [Jogo.energia_jogador, Jogo.personagem_atual.energia_max]

	log_label.text = "\n".join(Jogo.log_mensagens)

	botao_pocao_cura.text = "%s (x%d)" % [Jogo.ITEM.nome.to_upper(), Jogo.quantidade_itens]
	botao_pocao_cura.disabled = Jogo.quantidade_itens <= 0

	var em_batalha := Jogo.resultado == ""
	var pode_agir := em_batalha and Jogo.turno == "jogador"
	var cor_botao := Color(1, 1, 1) if pode_agir else Color(0.4, 0.4, 0.4)
	botao_atacar.disabled = not pode_agir
	botao_habilidade.disabled = not pode_agir
	botao_itens.disabled = not pode_agir
	botao_fugir.disabled = not pode_agir
	botao_atacar.modulate = cor_botao
	botao_habilidade.modulate = cor_botao
	botao_itens.modulate = cor_botao
	botao_fugir.modulate = cor_botao
	botao_atacar.visible = em_batalha
	botao_habilidade.visible = em_batalha
	custo_habilidade_label.visible = em_batalha
	botao_itens.visible = em_batalha
	botao_fugir.visible = em_batalha

	turno_label.visible = em_batalha
	painel_turno.visible = em_batalha
	if pode_agir:
		turno_label.text = "SEU TURNO"
		turno_label.modulate = Color("34e3ff")
	else:
		turno_label.text = "TURNO DE %s..." % Jogo.inimigo_atual.nome.to_upper()
		turno_label.modulate = Color("ff3d6e")

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
	if Jogo.veio_do_mundo:
		Jogo.veio_do_mundo = false
		get_tree().change_scene_to_file("res://world.tscn")
	else:
		_mostrar_painel_debug()
