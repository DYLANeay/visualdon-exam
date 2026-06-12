import { toutesLesQuestions } from '../quiz/index.js'
import { tousLesContenus } from '../content/index.js'

// Les flashcards sont dérivées de deux sources, déjà fidèles au cours :
//  1. La banque de quiz (format question/réponse).
//  2. Les points « essentiel » de chaque module (recto = indice, verso = la notion).
// Chaque carte : { id, module, recto, verso } - recto/verso en markdown inline.

function depuisQuiz() {
  return toutesLesQuestions().map((q) => {
    let verso
    if (q.type === 'qcm') {
      verso = `**${q.options[q.correct]}**${q.explication ? '\n\n' + q.explication : ''}`
    } else if (q.type === 'vrai-faux') {
      verso = `**${q.reponse ? 'Vrai' : 'Faux'}**${q.explication ? '\n\n' + q.explication : ''}`
    } else {
      verso = (q.corrige ?? []).map((p) => '• ' + p).join('\n')
    }
    return { id: 'fc-' + q.id, module: q.module, recto: q.question, verso }
  })
}

function depuisEssentiel() {
  const cartes = []
  for (const c of tousLesContenus()) {
    ;(c.essentiel ?? []).forEach((point, i) => {
      cartes.push({
        id: `fc-${c.id}-ess-${i}`,
        module: c.id,
        recto: `**${c.titre}** - quelle notion clé ?`,
        verso: point,
      })
    })
  }
  return cartes
}

const TOUTES = [...depuisQuiz(), ...depuisEssentiel()]

export function toutesLesCartes() {
  return TOUTES
}

export function cartesModule(id) {
  return TOUTES.filter((c) => c.module === id)
}
