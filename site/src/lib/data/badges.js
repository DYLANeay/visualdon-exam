// Catalogue des badges. `id` = clé stockée dans progress.badges.
export const badges = [
  { id: 'premier-examen', emoji: '🎯', titre: 'Premier examen', desc: 'Tu as terminé un examen blanc.' },
  { id: 'examen-parfait', emoji: '💯', titre: 'Sans faute', desc: 'Un examen blanc à 100 %.' },
  { id: 'cartographe', emoji: '🗺️', titre: 'Cartographe', desc: 'Module de cartographie maîtrisé.' },
  { id: 'maitre-echelles', emoji: '📐', titre: 'Maître des échelles', desc: 'Module Échelles et axes maîtrisé.' },
  { id: 'chasseur-biais', emoji: '🕵️', titre: 'Chasseur de biais', desc: 'Module Éthique et biais maîtrisé.' },
  { id: 'tous-modules', emoji: '🏆', titre: 'Tout vu', desc: 'Les 11 modules maîtrisés.' },
  { id: 'streak-7', emoji: '🔥', titre: 'Une semaine', desc: '7 jours de révision d’affilée.' },
]

export function badgeParId(id) {
  return badges.find((b) => b.id === id)
}
