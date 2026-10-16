extends Control

# Tela de criação de personagem, pensada para toque (viewport retrato 540x1040).
# A interface é montada por código para manter os estilos num lugar só.

const Boneco := preload("res://scripts/boneco.gd")

const COR_FUNDO := Color(0.102, 0.043, 0.2)
const COR_PAINEL := Color(0.122, 0.059, 0.239)
const COR_MOLDURA := Color(0.29, 0.122, 0.561)
const COR_CIANO := Color(0.208, 0.894, 1)
const COR_LIMA := Color(0.784, 1, 0.239)
const COR_ROSA := Color(1, 0.239, 0.62)
const COR_TEXTO := Color(0.906, 0.906, 0.953)

const NOMES_CAMADAS := {
	"corpo": "CORPO",
	"roupa": "ROUPA",
	"cabelo": "CABELO",
	"acessorio": "ACESSÓRIO",
}
const ORDEM_DIRECOES := ["baixo", "esquerda", "cima", "direita"]
const ESCALA_PREVIA := 7.0
const NOME_MIN := 3
const NOME_MAX := 16

var _boneco: Node2D
var _campo_nome: LineEdit
var _erro: Label
var _valores := {}
var _botoes_cor := {}
var _indice_direcao := 0

func _ready() -> void:
	set_anchors_preset(Control.PRESET_FULL_RECT)
	_montar_interface()
	_campo_nome.text = Personagem.nome
	Personagem.aparencia_mudou.connect(_atualizar_valores)
	_atualizar_valores()

func _montar_interface() -> void:
	var fundo := ColorRect.new()
	fundo.color = COR_FUNDO
	fundo.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(fundo)

	var margem := MarginContainer.new()
	margem.set_anchors_preset(Control.PRESET_FULL_RECT)
	for lado in ["left", "right"]:
		margem.add_theme_constant_override("margin_" + lado, 24)
	margem.add_theme_constant_override("margin_top", 28)
	margem.add_theme_constant_override("margin_bottom", 28)
	add_child(margem)

	var coluna := VBoxContainer.new()
	coluna.add_theme_constant_override("separation", 14)
	margem.add_child(coluna)

	# Topo: título e, se o personagem já existe, botão de voltar
	var topo := HBoxContainer.new()
	coluna.add_child(topo)
	var titulo := _label("EDITAR PERSONAGEM" if Personagem.criado else "CRIAR PERSONAGEM", 26, COR_CIANO)
	titulo.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	topo.add_child(titulo)
	if Personagem.criado:
		var voltar := _botao("VOLTAR", COR_ROSA, Vector2(110, 48))
		voltar.pressed.connect(_ir_para_mundo)
		topo.add_child(voltar)

	coluna.add_child(_montar_previa())

	coluna.add_child(_label("NOME//", 16, COR_CIANO))
	_campo_nome = LineEdit.new()
	_campo_nome.placeholder_text = "Como você quer ser chamado?"
	_campo_nome.max_length = NOME_MAX
	_campo_nome.custom_minimum_size = Vector2(0, 56)
	_campo_nome.add_theme_font_size_override("font_size", 20)
	_campo_nome.add_theme_color_override("font_color", COR_TEXTO)
	_campo_nome.add_theme_stylebox_override("normal", _caixa(Color(0.024, 0.016, 0.047, 0.6), COR_CIANO))
	_campo_nome.add_theme_stylebox_override("focus", _caixa(Color(0.024, 0.016, 0.047, 0.6), COR_LIMA))
	_campo_nome.text_submitted.connect(func(_t): _campo_nome.release_focus())
	coluna.add_child(_campo_nome)

	for camada in Personagem.CAMADAS:
		coluna.add_child(_montar_linha_camada(camada))

	_erro = _label("", 16, COR_ROSA)
	_erro.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	coluna.add_child(_erro)

	var espaco := Control.new()
	espaco.size_flags_vertical = Control.SIZE_EXPAND_FILL
	coluna.add_child(espaco)

	var confirmar := _botao("SALVAR" if Personagem.criado else "COMEÇAR", COR_FUNDO, Vector2(0, 64), COR_LIMA)
	confirmar.pressed.connect(_confirmar)
	coluna.add_child(confirmar)

func _montar_previa() -> Control:
	var linha := HBoxContainer.new()
	linha.alignment = BoxContainer.ALIGNMENT_CENTER
	linha.add_theme_constant_override("separation", 12)

	var girar_esq := _botao("<", COR_CIANO, Vector2(56, 56))
	girar_esq.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	girar_esq.pressed.connect(_girar.bind(-1))
	linha.add_child(girar_esq)

	var painel := Panel.new()
	painel.custom_minimum_size = Vector2(300, 290)
	painel.add_theme_stylebox_override("panel", _caixa(COR_PAINEL, COR_MOLDURA))
	linha.add_child(painel)

	_boneco = Boneco.new()
	_boneco.scale = Vector2(ESCALA_PREVIA, ESCALA_PREVIA)
	# os pés do boneco ficam na origem; ~32 px de altura * escala cabem no painel
	_boneco.position = Vector2(150, 260)
	painel.add_child(_boneco)

	var girar_dir := _botao(">", COR_CIANO, Vector2(56, 56))
	girar_dir.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	girar_dir.pressed.connect(_girar.bind(1))
	linha.add_child(girar_dir)
	return linha

func _montar_linha_camada(camada: String) -> Control:
	var linha := HBoxContainer.new()
	linha.add_theme_constant_override("separation", 8)

	var nome := _label(NOMES_CAMADAS[camada], 16, COR_CIANO)
	nome.custom_minimum_size = Vector2(118, 0)
	linha.add_child(nome)

	var anterior := _botao("<", COR_CIANO, Vector2(52, 52))
	anterior.pressed.connect(Personagem.trocar_opcao.bind(camada, -1))
	linha.add_child(anterior)

	var valor := _label("", 18, COR_TEXTO)
	valor.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	valor.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	linha.add_child(valor)
	_valores[camada] = valor

	var proximo := _botao(">", COR_CIANO, Vector2(52, 52))
	proximo.pressed.connect(Personagem.trocar_opcao.bind(camada, 1))
	linha.add_child(proximo)

	var botao_cor := _botao("COR", COR_TEXTO, Vector2(80, 52))
	botao_cor.pressed.connect(Personagem.trocar_cor.bind(camada, 1))
	linha.add_child(botao_cor)
	_botoes_cor[camada] = botao_cor
	return linha

func _atualizar_valores() -> void:
	for camada in Personagem.CAMADAS:
		# camadas opcionais têm "nenhum" (null) na posição 0, que não entra na contagem
		var tem_nenhum: bool = Personagem.OPCOES[camada][0] == null
		var total: int = Personagem.OPCOES[camada].size() - (1 if tem_nenhum else 0)
		var numero: int = Personagem.indice_opcao[camada] + (0 if tem_nenhum else 1)
		var vazio := Personagem.textura(camada) == null
		_valores[camada].text = "NENHUM" if vazio else "%d/%d" % [numero, total]
		var botao_cor: Button = _botoes_cor[camada]
		botao_cor.disabled = vazio
		# a borda do botão mostra a cor escolhida
		var estilo := _caixa(COR_FUNDO, Personagem.cor(camada) if not vazio else COR_MOLDURA)
		botao_cor.add_theme_stylebox_override("normal", estilo)
		botao_cor.add_theme_stylebox_override("hover", estilo)
		botao_cor.add_theme_stylebox_override("pressed", estilo)
		botao_cor.add_theme_stylebox_override("disabled", estilo)
		botao_cor.modulate.a = 0.4 if vazio else 1.0

func _girar(passo: int) -> void:
	_indice_direcao = posmod(_indice_direcao + passo, ORDEM_DIRECOES.size())
	_boneco.olhar(ORDEM_DIRECOES[_indice_direcao])

func _confirmar() -> void:
	var nome := _campo_nome.text.strip_edges()
	if nome.length() < NOME_MIN or nome.length() > NOME_MAX:
		_erro.text = "O nome precisa ter entre %d e %d caracteres." % [NOME_MIN, NOME_MAX]
		return
	Personagem.nome = nome
	Personagem.salvar()
	_ir_para_mundo()

func _ir_para_mundo() -> void:
	get_tree().change_scene_to_file("res://world.tscn")

func _label(texto: String, tamanho: int, cor_fonte: Color) -> Label:
	var label := Label.new()
	label.text = texto
	label.add_theme_font_size_override("font_size", tamanho)
	label.add_theme_color_override("font_color", cor_fonte)
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	return label

func _botao(texto: String, cor_fonte: Color, tamanho_min: Vector2, cor_fundo: Color = COR_FUNDO) -> Button:
	var botao := Button.new()
	botao.text = texto
	botao.custom_minimum_size = tamanho_min
	botao.focus_mode = Control.FOCUS_NONE
	botao.add_theme_font_size_override("font_size", 22 if texto.length() == 1 else 18)
	for estado in ["font_color", "font_hover_color", "font_pressed_color"]:
		botao.add_theme_color_override(estado, cor_fonte)
	var borda := cor_fundo if cor_fundo != COR_FUNDO else cor_fonte
	var normal := _caixa(cor_fundo, borda)
	var apertado := _caixa(cor_fundo.lightened(0.15), borda)
	botao.add_theme_stylebox_override("normal", normal)
	botao.add_theme_stylebox_override("hover", normal)
	botao.add_theme_stylebox_override("pressed", apertado)
	return botao

func _caixa(fundo: Color, borda: Color) -> StyleBoxFlat:
	var estilo := StyleBoxFlat.new()
	estilo.bg_color = fundo
	estilo.border_color = borda
	estilo.set_border_width_all(2)
	estilo.set_corner_radius_all(8)
	estilo.content_margin_left = 10
	estilo.content_margin_right = 10
	return estilo
