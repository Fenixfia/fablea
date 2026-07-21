(function(global){
  'use strict';

  function selectedProfile(){
    try{
      return global.FableaProfile && global.FableaProfile.getSelectedProfile
        ? global.FableaProfile.getSelectedProfile()
        : null;
    }catch(_error){
      return null;
    }
  }

  function applyWorld(world){
    const next = world || 'Magia';
    document.body.dataset.world = next;
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

  function init(){
    if(document.body.classList.contains('fablea-public')){
      normalizeTop();
      return;
    }
    applyProfile();
    bindWorldSelector();
    normalizeTop();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  global.FableaUnifiedUI = {applyWorld,applyProfile,selectedProfile};
})(window);