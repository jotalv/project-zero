extends Node

# Autoload: aparência e nome do personagem do jogador.
# Baseado no criador de personagem da série "Oops I Dev'd" (assets: Seliel the Shaper,
# "Character Base" no itch.io). Cada camada é uma folha 8x8 de quadros 64x64.
# As escolhas ficam salvas no aparelho (user://, no navegador vai para o IndexedDB).

const CAMINHO_SAVE := "user://personagem.cfg"

const CAMADAS := ["corpo", "roupa", "cabelo", "acessorio"]

# Opções de cada camada. null = "nenhum".
const OPCOES := {
	"corpo": [
		preload("res://assets/personagem/corpo/char_a_p1_0bas_humn_v01.png"),
	],
	"roupa": [
		preload("res://assets/personagem/roupa/char_a_p1_1out_boxr_v01.png"),
		preload("res://assets/personagem/roupa/char_a_p1_1out_fstr_v04.png"),
		preload("res://assets/personagem/roupa/char_a_p1_1out_pfpn_v04.png"),
		preload("res://assets/personagem/roupa/char_a_p1_1out_undi_v01.png"),
	],
	"cabelo": [
		null,
		preload("res://assets/personagem/cabelo/char_a_p1_4har_bob1_v01.png"),
		preload("res://assets/personagem/cabelo/char_a_p1_4har_dap1_v01.png"),
	],
	"acessorio": [
		null,
		preload("res://assets/personagem/acessorio/char_a_p1_5hat_pfht_v04.png"),
		preload("res://assets/personagem/acessorio/char_a_p1_5hat_pnty_v04.png"),
	],
}

const CORES_PELE := [
	Color(1, 1, 1),
	Color(0.96, 0.80, 0.69),
	Color(0.72, 0.54, 0.39),
	Color(0.45, 0.34, 0.27),
]

const CORES_CABELO := [
	Color(1, 1, 1),
	Color(0.1, 0.1, 0.1),
	Color(0.4, 0.2, 0.1),
	Color(0.9, 0.6, 0.2),
	Color(0.5, 0.25, 0),
]

const CORES_ROUPA := [
	Color(1, 1, 1),
	Color(1, 0.24, 0.43),
	Color(0.78, 1, 0.24),
	Color(0.21, 0.89, 1),
	Color(0.55, 0.35, 1),
	Color(0.15, 0.15, 0.2),
]

const CORES := {
	"corpo": CORES_PELE,
	"roupa": CORES_ROUPA,
	"cabelo": CORES_CABELO,
	"acessorio": CORES_ROUPA,
}

signal aparencia_mudou

var nome := ""
var indice_opcao := {"corpo": 0, "roupa": 0, "cabelo": 1, "acessorio": 0}
var indice_cor := {"corpo": 0, "roupa": 0, "cabelo": 0, "acessorio": 0}
var criado := false

func _ready() -> void:
	carregar()

func textura(camada: String) -> Texture2D:
	return OPCOES[camada][indice_opcao[camada]]

func cor(camada: String) -> Color:
	return CORES[camada][indice_cor[camada]]

func trocar_opcao(camada: String, passo: int) -> void:
	var total: int = OPCOES[camada].size()
	indice_opcao[camada] = posmod(indice_opcao[camada] + passo, total)
	aparencia_mudou.emit()

func trocar_cor(camada: String, passo: int) -> void:
	var total: int = CORES[camada].size()
	indice_cor[camada] = posmod(indice_cor[camada] + passo, total)
	aparencia_mudou.emit()

func salvar() -> void:
	var cfg := ConfigFile.new()
	cfg.set_value("personagem", "nome", nome)
	cfg.set_value("personagem", "opcoes", indice_opcao)
	cfg.set_value("personagem", "cores", indice_cor)
	cfg.save(CAMINHO_SAVE)
	criado = true

func carregar() -> void:
	var cfg := ConfigFile.new()
	if cfg.load(CAMINHO_SAVE) != OK:
		return
	nome = cfg.get_value("personagem", "nome", "")
	_mesclar_indices(indice_opcao, cfg.get_value("personagem", "opcoes", {}), OPCOES)
	_mesclar_indices(indice_cor, cfg.get_value("personagem", "cores", {}), CORES)
	criado = nome != ""

# Ignora índices que não existem mais (ex.: uma opção foi removida dos assets)
func _mesclar_indices(destino: Dictionary, salvo: Dictionary, listas: Dictionary) -> void:
	for camada in CAMADAS:
		var valor = salvo.get(camada)
		if valor is int and valor >= 0 and valor < listas[camada].size():
			destino[camada] = valor
