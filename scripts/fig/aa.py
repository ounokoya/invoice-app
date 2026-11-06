"""Teintes AA validées (G2 : Q-A1 à Q-A6 ; G3 : Q-A7 à Q-A10) appliquées au rendu des écrans de référence.
Chaque règle : thème (clair, sombre, les deux), rôle (texte, point de statut, fond de bouton, tout), couleur de la maquette → couleur AA."""

LIGHT_TEXT = {'#888eb0': '#68709b', '#858bb2': '#6870a0', '#7e88c3': '#616db5', '#777f98': '#6d7690',
              '#33d69f': '#1a8360', '#ff8f00': '#ab6000', '#7c5dfa': '#7757fa', '#ec5757': '#e62525'}  # Q-A1, Q-A2, Q-A3, Q-A4, Q-A6
DARK_TEXT = {'#7c5dfa': '#9277ff', '#7e88c3': '#8690c7', '#888eb0': '#8c92b3'}  # Q-A10 : violet et gris sur les fonds sombres (#252945 compris)
DOTS = {'#33d69f': '#1a8360', '#ff8f00': '#ab6000'}  # points des badges, en clair (Q-A2)
FILLS = {'#7c5dfa': '#7757fa', '#ec5757': '#e62525'}  # fonds sous texte blanc, deux thèmes (Q-A3, Q-A4)
BUTTON_HOVER = {'#9277ff': '#6742ff', '#ff9797': '#c41e1e'}  # survols des boutons 1, 2 et 5 (Q-A7, Q-A8)


def remap(hexc, node, dark, frame):
    """Couleur AA d'un remplissage, ou la couleur d'origine."""
    typ = node.get('type'); size = node.get('size', {})
    if typ == 'TEXT':
        text = node.get('textData', {}).get('characters', '')
        if text == 'Save as Draft' and hexc == '#888eb0': return '#a0a5c0'  # Q-A5
        if text in ('+ Add New Item', 'Edit') and 'Hover' in frame and hexc == '#7e88c3' and not dark: return '#515eae'  # Q-A9 : boutons 3 et 6 survolés (fond #dfe3fa)
        if dark and text in ('Edit', 'Discard') and hexc == '#7e88c3': return '#616db5'  # bouton 3 clair dans le thème sombre
        table = DARK_TEXT if dark else LIGHT_TEXT
        return table.get(hexc, hexc)
    if not dark and typ == 'ELLIPSE' and size.get('x', 99) <= 10 and hexc in DOTS: return DOTS[hexc]
    radius = node.get('cornerRadius') or node.get('rectangleTopLeftCornerRadius') or 0
    if radius == 24 and hexc in BUTTON_HOVER: return BUTTON_HOVER[hexc]
    return FILLS.get(hexc, hexc)
