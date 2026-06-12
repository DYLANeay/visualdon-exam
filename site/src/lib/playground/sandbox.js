// Sandbox iframe qui exécute du code D3. Le code de D3 est récupéré une seule
// fois (depuis public/vendor) puis INLINÉ dans le srcdoc : pas de chargement de
// sous-ressource externe (qui échoue dans une iframe à origine opaque), et ça
// fonctionne hors-ligne. Tous les exports D3 sont exposés en globales pour que
// les snippets du cours (`scaleLinear(...)`, `select(...)`, `d3.select(...)`)
// fonctionnent tels quels.

const D3_URL = `${import.meta.env.BASE_URL}vendor/d3.min.js`

let d3SourcePromesse = null
export function chargerD3() {
  if (!d3SourcePromesse) {
    d3SourcePromesse = fetch(D3_URL).then((r) => r.text())
  }
  return d3SourcePromesse
}

// Retire les lignes d'import ESM : en sandbox, tout est déjà global.
function nettoyer(source) {
  return source
    .replace(/^\s*import\b.*$/gm, '')
    .replace(/^\s*const\s*\{[^}]*\}\s*=\s*(?:await\s*)?import\([^)]*\).*$/gm, '')
}

export function construireSandbox(source, sombre, d3Source) {
  const code = nettoyer(source)
  const bgPreview = sombre ? '#1c1c1c' : '#ffffff'
  const fg = sombre ? '#d4d4d4' : '#404040'
  const muted = sombre ? '#8a8a8a' : '#737373'

  return `<!doctype html><html><head><meta charset="utf-8">
<style>
  html,body{margin:0}
  body{font:13px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;color:${fg};padding:12px}
  #chart{display:block;background:${bgPreview};border-radius:8px;max-width:100%;height:auto;margin-bottom:10px}
  #log{white-space:pre-wrap;color:${muted}}
  #log .err{color:#ef4444}
  svg{max-width:100%;height:auto}
  text{fill:${sombre ? '#e5e5e5' : '#171717'}}
</style></head>
<body>
  <svg id="chart" width="360" height="220"></svg>
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

    // Expose les exports D3 en globales (scaleLinear, select…). Copie clé par
    // clé en ignorant les globales en lecture seule (ex. d3.window vs window.window).
    if (typeof d3 !== 'undefined') {
      for (var k in d3) { try { window[k] = d3[k] } catch (e) {} }
    }
    // Sélection D3 du conteneur, prête à l'emploi dans les snippets.
    var svg = (typeof d3 !== 'undefined') ? d3.select('#chart') : null

    try {
      ${code}
    } catch (e) {
      ecrire('err', ['Erreur : ' + e.message])
    }
  <\/script>
</body></html>`
}
