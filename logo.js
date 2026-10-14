/* Logo Wikiguessr : <wg-logo></wg-logo>, à poser sur un fond sombre.
   Étiquette blanche « WIKI » inclinée, « GUESSR » jaune en relief (Titan One), petit globe aux quatre couleurs.
   La taille suit font-size (le globe mesure 38px quand GUESSR fait 40px). Le contour du globe suit la variable --f
   (couleur du sujet choisi dans le menu), jaune par défaut. Le même globe sert de favicon (favicon.svg). */
(function () {
  const css = `
wg-logo { display: inline-flex; align-items: center; gap: .3em; font: 400 40px/1 "Titan One", system-ui, sans-serif; white-space: nowrap; }
wg-logo .wg-tag { display: inline-block; font-size: .5em; letter-spacing: .02em; background: #fff; color: #0B1530; padding: .3em .55em .22em;
  border-radius: 8px; transform: rotate(-6deg); box-shadow: 0 4px 0 #FF5A6E; }
wg-logo .wg-word { color: #FFC857; letter-spacing: .01em;
  text-shadow: .025em .025em 0 #FFA23C, .05em .05em 0 #FF9540, .075em .075em 0 #FF8848, .1em .1em 0 #FF7A52, .125em .125em 0 #F96A5E, .15em .15em 0 #F25C6C, .175em .175em 0 #E94F78, .2em .2em 0 #E04282; }
wg-logo svg { width: .95em; height: .95em; flex: none; }
wg-logo .wg-ring { stroke: var(--f, #FFC857); transition: stroke 220ms cubic-bezier(.23,1,.32,1); }`;
  const svg = '<svg viewBox="0 0 100 100" aria-hidden="true"><clipPath id="wg-clip-ID"><circle cx="50" cy="50" r="40"/></clipPath><g clip-path="url(#wg-clip-ID)">'
    + '<rect x="10" y="10" width="40" height="40" fill="#2F6BFF"/><rect x="50" y="10" width="40" height="40" fill="#19D48B"/>'
    + '<rect x="10" y="50" width="40" height="40" fill="#FF4D94"/><rect x="50" y="50" width="40" height="40" fill="#FFC857"/>'
    + '<ellipse cx="50" cy="50" rx="17" ry="40" fill="none" stroke="#fff" stroke-width="4"/><path d="M10 50H90" stroke="#fff" stroke-width="4"/></g>'
    + '<circle class="wg-ring" cx="50" cy="50" r="40" fill="none" stroke-width="6"/></svg>';
  let n = 0;
  class WgLogo extends HTMLElement {
    connectedCallback() {
      if (this.firstChild) return;
      if (!document.getElementById('wg-logo-css')) { const s = document.createElement('style'); s.id = 'wg-logo-css'; s.textContent = css; document.head.appendChild(s); }
      this.setAttribute('role', 'img'); if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Wiki Guessr');
      this.innerHTML = '<span class="wg-tag" aria-hidden="true">WIKI</span><span class="wg-word" aria-hidden="true">GUESSR</span>' + svg.replace(/ID/g, ++n);
    }
  }
  customElements.define('wg-logo', WgLogo);
})();
