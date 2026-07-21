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

  function ensureStyle(href,attribute){
    const existing = document.querySelector(`link[${attribute}],link[href="${href}"]`);
    if(existing){existing.setAttribute(attribute,'true');return existing;}
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    stylesheet.setAttribute(attribute,'true');
    document.head.appendChild(stylesheet);
    return stylesheet;
  }

  function ensureScript(src,attribute,onload){
    const existing = document.querySelector(`script[${attribute}],script[src="${src}"]`);
    if(existing){
      existing.setAttribute(attribute,'true');
      if(onload && existing.dataset.loaded === 'true') onload();
      else if(onload) existing.addEventListener('load',onload,{once:true});
      return existing;
    }
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.setAttribute(attribute,'true');
    script.addEventListener('load',() => {
      script.dataset.loaded = 'true';
      if(onload) onload();
    },{once:true});
    document.head.appendChild(script);
    return script;
  }

  function loadIntegratedNavigation(){
    if(document.body.classList.contains('fablea-public')) return;
    ensureStyle('/assets/css/fablea-integrated-navigation.css','data-fablea-integrated-navigation');
  }

  function loadLivingWorldEnhancements(){
    if(document.body.classList.contains('fablea-public')) return;
    ensureStyle('/assets/css/fablea-living-world.css','data-fablea-living-world');
  }

  function loadLiveBookEnhancements(){
    if(!document.body.classList.contains('live-book')) return;
    ensureStyle('/assets/css/fablea-page-turn.css','data-fablea-page-turn');
    ensureScript('/assets/js/fablea-page-turn.js','data-fablea-page-turn');
  }

  function mountCompanions(){
    if(!global.FableaCompanion) return;
    const profile = global.FableaCompanion.ensureProfile(selectedProfile()) || selectedProfile();
    if(!profile) return;
    document.querySelectorAll('[data-fablea-companion]').forEach(element => {
      if(global.FableaCompanionMood) global.FableaCompanionMood.mount(element,profile,element.dataset.companionExpression || 'calm');
      else global.FableaCompanion.mount(element,profile);
    });
    if(document.body.classList.contains('live-book')){
      const illustration = document.getElementById('illustration');
      if(illustration && !illustration.querySelector('.story-companion-visual')){
        const holder = document.createElement('div');
        holder.className = 'story-companion-visual';
        holder.setAttribute('aria-hidden','true');
        holder.dataset.companionExpression = 'calm';
        illustration.appendChild(holder);
        if(global.FableaCompanionMood) global.FableaCompanionMood.mount(holder,profile,'calm');
        else global.FableaCompanion.mount(holder,profile);
      }
    }
  }

  function loadLiveBookPolish(){
    if(!document.body.classList.contains('live-book')) return;
    ensureScript('/assets/js/fablea-live-book-polish.js','data-fablea-live-book-polish');
  }

  function loadStoryContinuity(){
    if(!document.body.classList.contains('live-book')) return;
    const loadBridge = () => ensureScript('/assets/js/fablea-story-continuity.js','data-fablea-story-continuity');
    if(global.FableaBetaState){loadBridge();return;}
    ensureScript('/assets/js/fablea-beta-state.js','data-fablea-beta-state',loadBridge);
  }

  function afterCompanionReady(){
    if(global.FableaCompanionMood){mountCompanions();loadLiveBookPolish();return;}
    ensureScript('/assets/js/fablea-companion-moods.js','data-fablea-companion-moods',() => {
      mountCompanions();
      loadLiveBookPolish();
    });
  }

  function loadCompanionEnhancements(){
    if(document.body.classList.contains('fablea-public')) return;
    ensureStyle('/assets/css/fablea-companion.css','data-fablea-companion');
    if(global.FableaCompanion){afterCompanionReady();return;}
    ensureScript('/assets/js/fablea-companion.js','data-fablea-companion',afterCompanionReady);
  }

  function init(){
    if(document.body.classList.contains('fablea-public')){normalizeTop();return;}
    loadIntegratedNavigation();
    loadLivingWorldEnhancements();
    applyProfile();
    bindWorldSelector();
    normalizeTop();
    loadLiveBookEnhancements();
    loadCompanionEnhancements();
    loadStoryContinuity();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  global.FableaUnifiedUI = {NEUTRAL_WORLD,applyWorld,applyProfile,selectedProfile,loadIntegratedNavigation,loadLivingWorldEnhancements,loadLiveBookEnhancements,loadCompanionEnhancements,loadStoryContinuity,mountCompanions};
})(window);