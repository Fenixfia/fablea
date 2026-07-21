(function(global){
  'use strict';

  const NEUTRAL_WORLD = 'FABLEA';
  const NEUTRAL_TOKENS = {
    '--accent':'#ead7a3','--accent-2':'#b9a7b8','--sky-1':'#68746f','--sky-2':'#35413f',
    '--land-1':'#756b73','--land-2':'#34343a','--portal-1':'#fff3d5','--portal-2':'#c7b5c8'
  };

  function selectedProfile(){
    try{return global.FableaProfile && global.FableaProfile.getSelectedProfile ? global.FableaProfile.getSelectedProfile() : null;}
    catch(_error){return null;}
  }

  function applyWorld(world){
    const next = world || NEUTRAL_WORLD;
    document.body.dataset.world = next;
    for(const [property,value] of Object.entries(NEUTRAL_TOKENS)){
      if(next === NEUTRAL_WORLD) document.body.style.setProperty(property,value);
      else document.body.style.removeProperty(property);
    }
    return next;
  }

  function applyProfile(profile){
    if(!document.body.classList.contains('fablea-public')) document.body.classList.add('fablea-product');
    const active = profile || selectedProfile();
    applyWorld(active && active.primaryWorld);
    if(active && global.FableaUI && global.FableaUI.applyAge) global.FableaUI.applyAge(document.body,active.age);
    return active;
  }

  function bindWorldSelector(){
    const select = document.getElementById('primaryWorld');
    if(!select) return;
    const sync = () => applyWorld(select.value);
    select.addEventListener('change',sync);
    sync();
  }

  function normalizeTop(){
    document.querySelectorAll('.top').forEach(top => {
      if(top.querySelector('.brand')) return;
      const brand = document.createElement('a');
      brand.className = 'brand';
      brand.href = document.body.classList.contains('fablea-public') ? '/index.html' : '/child-hub.html';
      brand.textContent = 'FABLEA';
      const first = top.firstElementChild;
      if(first && first.classList.contains('back')) first.replaceWith(brand);
      else top.prepend(brand);
    });
  }

  function loadLiveBookEnhancements(){
    if(!document.body.classList.contains('live-book')) return;
    if(!document.querySelector('link[data-fablea-page-turn]')){
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';stylesheet.href = '/assets/css/fablea-page-turn.css';stylesheet.dataset.fableaPageTurn = 'true';
      document.head.appendChild(stylesheet);
    }
    if(!document.querySelector('script[data-fablea-page-turn]')){
      const script = document.createElement('script');
      script.src = '/assets/js/fablea-page-turn.js';script.defer = true;script.dataset.fableaPageTurn = 'true';
      document.head.appendChild(script);
    }
  }

  function mountCompanions(){
    if(!global.FableaCompanion) return;
    const profile = global.FableaCompanion.ensureProfile(selectedProfile()) || selectedProfile();
    if(!profile) return;
    document.querySelectorAll('[data-fablea-companion]').forEach(element => global.FableaCompanion.mount(element,profile));
    if(document.body.classList.contains('live-book')){
      const illustration = document.getElementById('illustration');
      if(illustration && !illustration.querySelector('.story-companion-visual')){
        const holder = document.createElement('div');
        holder.className = 'story-companion-visual';
        holder.setAttribute('aria-hidden','true');
        illustration.appendChild(holder);
        global.FableaCompanion.mount(holder,profile);
      }
    }
  }

  function loadCompanionEnhancements(){
    if(document.body.classList.contains('fablea-public')) return;
    if(!document.querySelector('link[data-fablea-companion]')){
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';stylesheet.href = '/assets/css/fablea-companion.css';stylesheet.dataset.fableaCompanion = 'true';
      document.head.appendChild(stylesheet);
    }
    if(global.FableaCompanion){mountCompanions();return;}
    if(document.querySelector('script[data-fablea-companion]')) return;
    const script = document.createElement('script');
    script.src = '/assets/js/fablea-companion.js';script.defer = true;script.dataset.fableaCompanion = 'true';script.addEventListener('load',mountCompanions,{once:true});
    document.head.appendChild(script);
  }

  function init(){
    if(document.body.classList.contains('fablea-public')){normalizeTop();return;}
    applyProfile();
    bindWorldSelector();
    normalizeTop();
    loadLiveBookEnhancements();
    loadCompanionEnhancements();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  global.FableaUnifiedUI = {NEUTRAL_WORLD,applyWorld,applyProfile,selectedProfile,loadLiveBookEnhancements,loadCompanionEnhancements,mountCompanions};
})(window);
