(function(global){
  'use strict';

  function init(){
    if(!document.body.classList.contains('live-book')) return;
    const F = global.FableaProfile;
    const C = global.FableaCompanion;
    const M = global.FableaCompanionMood;
    const story = F && F.readJSON ? F.readJSON('fableaCurrentStory',null) : null;
    const profile = F && F.getSelectedProfile ? F.getSelectedProfile() : null;
    const book = document.querySelector('.book');
    const sheet = document.getElementById('pageSheet');
    const illustration = document.getElementById('illustration');
    if(!book || !story || !profile) return;

    const cover = document.createElement('section');
    cover.className = 'live-book-cover';
    cover.setAttribute('aria-label','Copertina della storia');
    cover.innerHTML = `
      <div class="live-book-cover-copy">
        <div class="eyebrow">${F.escapeHTML(story.world || profile.primaryWorld || 'FABLEA')} · Libro vivo</div>
        <h2>${F.escapeHTML(story.title || 'La storia è pronta')}</h2>
        <p>${F.escapeHTML(story.subtitle || 'Una nuova pagina del suo mondo sta per cominciare.')}</p>
        <button class="live-book-cover-action" id="openLiveBook" type="button">Apri il libro</button>
      </div>
      <div class="live-book-cover-companion" id="coverCompanion" data-companion-expression="curious"></div>`;
    book.before(cover);

    const holder = cover.querySelector('#coverCompanion');
    if(M) M.mount(holder,profile,'curious');
    else if(C) C.mount(holder,profile);

    cover.querySelector('#openLiveBook').addEventListener('click',() => {
      cover.hidden = true;
      book.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'start'});
      const sceneCompanion = illustration && illustration.querySelector('.story-companion-visual');
      if(sceneCompanion && M) M.decorate(sceneCompanion,'calm');
    });

    function syncRole(){
      if(!sheet) return;
      const kicker = document.getElementById('kicker');
      const label = String(kicker && kicker.textContent || '').toLowerCase();
      const role = label.includes('svolta') ? 'turning-point'
        : label.includes('resta') || label.includes('mondo') ? 'consequence'
          : label.includes('scelta') ? 'choice'
            : 'narrative';
      sheet.dataset.sceneRole = role;
      const sceneCompanion = illustration && illustration.querySelector('.story-companion-visual');
      if(sceneCompanion && M){
        M.decorate(sceneCompanion,role === 'turning-point' ? 'curious' : role === 'consequence' ? 'happy' : 'calm');
      }
    }

    syncRole();
    const text = document.getElementById('text');
    if(text) new MutationObserver(syncRole).observe(text,{childList:true,characterData:true,subtree:true});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})(window);
