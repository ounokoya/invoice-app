// Région de statut de l'app (A9, A11) : les vues y écrivent ce que les lecteurs d'écran doivent annoncer

export const notice = $state({ text: '' })

export const announce = (text) => { notice.text = text }
