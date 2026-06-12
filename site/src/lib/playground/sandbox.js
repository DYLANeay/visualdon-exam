// Sandbox iframe qui exécute du code du cours. Le code de D3 est récupéré une
// seule fois (depuis public/vendor) puis INLINÉ dans le srcdoc : pas de
// chargement de sous-ressource externe (qui échoue dans une iframe à origine
// opaque), et ça fonctionne hors-ligne. Tous les exports D3 sont exposés en
// globales pour que les snippets du cours (`scaleLinear(...)`, `select(...)`,
// `d3.select(...)`) fonctionnent tels quels.
//
// Deux modes selon le langage du snippet :
// - 'svg' / 'html' : le markup est injecté tel quel dans le <body> (pas de JS).
// - 'js' (défaut) : le code est exécuté avec D3 en global, un <svg id="chart">
//   et un <canvas> prêts à l'emploi (masqués s'ils ne sont pas utilisés).

const D3_URL = `${import.meta.env.BASE_URL}vendor/d3.min.js`

let d3SourcePromesse = null
export function chargerD3() {
  if (!d3SourcePromesse) {
    d3SourcePromesse = fetch(D3_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .catch((e) => {
        d3SourcePromesse = null // permettre une nouvelle tentative au prochain clic
        throw e
      })
  }
  return d3SourcePromesse
}

// Retire les lignes d'import ESM : en sandbox, tout est déjà global.
function nettoyer(source) {
  return source
    .replace(/^\s*import\b.*$/gm, '')
    .replace(/^\s*const\s*\{[^}]*\}\s*=\s*(?:await\s*)?import\([^)]*\).*$/gm, '')
}

function couleurs(sombre) {
  return {
    fg: sombre ? '#d4d4d4' : '#404040',
    muted: sombre ? '#8a8a8a' : '#737373',
    texte: sombre ? '#e5e5e5' : '#171717',
  }
}

function enveloppe(sombre, corps) {
  const { fg, muted, texte } = couleurs(sombre)
  return `<!doctype html><html><head><meta charset="utf-8">
<style>
  html,body{margin:0}
  body{font:13px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;color:${fg};padding:12px}
  #log{white-space:pre-wrap;color:${muted};margin-top:8px}
  #log:empty{display:none}
  #log .err{color:#ef4444}
  svg,canvas{max-width:100%;height:auto;display:block}
  svg text{fill:${texte}}
</style></head>
<body>
${corps}
</body></html>`
}

export function construireSandbox(source, sombre, d3Source, langage = 'js') {
  // Markup pur (SVG/HTML) : on l'injecte directement, rien à exécuter.
  if (langage === 'svg' || langage === 'html') {
    return enveloppe(sombre, source)
  }

  const code = nettoyer(source)

  return enveloppe(
    sombre,
    `  <svg id="chart" width="360" height="220" style="display:none"></svg>
  <canvas id="canvas" width="360" height="220" style="display:none"></canvas>
  <div id="log"></div>
  <script>${d3Source}<\/script>
  <script>
    const logEl = document.getElementById('log')
    function ecrire(cls, args){
      const d = document.createElement('div')
      if (cls) d.className = cls
      d.textContent = Array.from(args).map(function(x){
        try { return typeof x === 'object' ? JSON.stringify(x) : String(x) }
        catch(e){ return String(x) }
      }).join(' ')
      logEl.appendChild(d)
    }
    console.log = function(){ ecrire('', arguments) }
    console.warn = function(){ ecrire('', arguments) }
    console.error = function(){ ecrire('err', arguments) }
    window.onerror = function(m){ ecrire('err', ['Erreur : ' + m]); return true }

    // Le canvas ne s'affiche que si le code l'utilise (getContext).
    var canvasEl = document.getElementById('canvas')
    var getContextOriginal = canvasEl.getContext.bind(canvasEl)
    canvasEl.getContext = function(){
      canvasEl.style.display = 'block'
      return getContextOriginal.apply(null, arguments)
    }

    // Expose les exports D3 en globales (scaleLinear, select…). Copie clé par
    // clé en ignorant les globales en lecture seule (ex. d3.window vs window.window).
    if (typeof d3 !== 'undefined') {
      for (var k in d3) { try { window[k] = d3[k] } catch (e) {} }
    }
    // Sélection D3 du conteneur, prête à l'emploi dans les snippets.
    var svg = (typeof d3 !== 'undefined') ? d3.select('#chart') : null
  <\/script>
  <script>
    // Le code utilisateur est dans son propre <script> : une erreur de syntaxe
    // n'emporte pas la console ni le gestionnaire d'erreurs définis au-dessus.
    try {
      ${code}
    } catch (e) {
      console.error('Erreur : ' + e.message)
    }
  <\/script>
  <script>
    // Le #chart ne s'affiche que si le code y a dessiné quelque chose.
    var chart = document.getElementById('chart')
    if (chart.childNodes.length > 0) chart.style.display = 'block'
    // Si rien de visuel ni de console, on le dit (au lieu d'un cadre vide).
    if (chart.style.display === 'none' && canvasEl.style.display === 'none' && !logEl.hasChildNodes()) {
      logEl.textContent = '(exécuté - rien à afficher : ajoute un console.log ou dessine dans le svg)'
    }
  <\/script>`,
  )
}
