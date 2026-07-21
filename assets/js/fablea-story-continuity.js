(function(global){
  'use strict';
  const button = document.getElementById('saveRitualBtn');
  const F = global.FableaProfile;
  const B = global.FableaBetaState;
  if(!button || !F || !B) return;

  button.addEventListener('click',() => {
    global.setTimeout(() => {
      const profile = F.getSelectedProfile();
      if(!profile) return;
      const continuity = B.reconcile(profile);
      const recommendation = continuity && continuity.recommendation;
      if(!recommendation || recommendation.kind !== 'activity') return;
      let bridge = document.getElementById('storyContinuityBridge');
      if(!bridge){
        bridge = document.createElement('section');
        bridge.id = 'storyContinuityBridge';
        bridge.className = 'ritual';
        button.closest('.ritual').insertAdjacentElement('afterend',bridge);
      }
      bridge.innerHTML = `<div class="kicker">La storia ha aperto una nuova porta</div><h2>${F.escapeHTML(recommendation.title)}</h2><p>${F.escapeHTML(recommendation.description)}</p><a class="button primary" href="${F.escapeHTML(recommendation.href)}">${F.escapeHTML(recommendation.action)}</a>`;
      bridge.scrollIntoView({behavior:'smooth',block:'center'});
    },0);
  });
})(window);