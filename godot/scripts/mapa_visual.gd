extends Node2D

const LARGURA_TILE := 64.0
const ALTURA_TILE := 32.0
const COR_CHAO := Color(0.21, 0.45, 0.25, 1)
const COR_LINHA := Color(0.14, 0.32, 0.17, 1)

func _ready() -> void:
	queue_redraw()

func _grid_para_tela(g: Vector2i) -> Vector2:
	return Vector2((g.x - g.y) * LARGURA_TILE / 2.0, (g.x + g.y) * ALTURA_TILE / 2.0)

func _draw() -> void:
	var mundo: Node = get_parent()
	for coluna in range(mundo.COLUNAS):
		for linha in range(mundo.LINHAS):
			var celula := Vector2i(coluna, linha)
			if not mundo.esta_livre(celula):
				continue
			var centro := _grid_para_tela(celula)
			var pontos := PackedVector2Array([
				centro + Vector2(0, -ALTURA_TILE / 2.0),
				centro + Vector2(LARGURA_TILE / 2.0, 0),
				centro + Vector2(0, ALTURA_TILE / 2.0),
				centro + Vector2(-LARGURA_TILE / 2.0, 0),
			])
			draw_colored_polygon(pontos, COR_CHAO)
			draw_polyline(PackedVector2Array([pontos[0], pontos[1], pontos[2], pontos[3], pontos[0]]), COR_LINHA, 1.0)
