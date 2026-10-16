extends Node

# Cena inicial: quem ainda não criou o personagem vai para a criação; os demais, para o mapa.

func _ready() -> void:
	var cena := "res://world.tscn" if Personagem.criado else "res://criar_personagem.tscn"
	get_tree().change_scene_to_file.call_deferred(cena)
