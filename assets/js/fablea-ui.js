(function(){
  window.FableaUI = {
    escapeHTML(value){return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));},
    sceneFor(theme=''){const t=theme.toLowerCase(); if(t.includes('mare')) return 'scene-ocean'; if(t.includes('spazio')||t.includes('pian')) return 'scene-space'; if(t.includes('cast')||t.includes('princip')) return 'scene-castle'; if(t.includes('ponte')) return 'scene-bridge'; if(t.includes('notte')||t.includes('calma')||t.includes('luna')) return 'scene-night'; if(t.includes('cielo')) return 'scene-sky'; return 'scene-forest';},
    ageClass(age=''){return `age-${String(age).replace(/[^0-9-]/g,'')}`;}
  };
})();
