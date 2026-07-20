(function(){
  function getJSON(key, fallback){
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (_) { return fallback; }
  }

  function normalizeAge(age){
    return String(age || '').replace(/[^0-9-]/g, '');
  }

  window.FableaUI = {
    escapeHTML(value){
      return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    },
    sceneFor(theme = ''){
      const t = String(theme).toLowerCase();
      if(t.includes('mare')) return 'scene-ocean';
      if(t.includes('spazio') || t.includes('pian')) return 'scene-space';
      if(t.includes('cast') || t.includes('princip')) return 'scene-castle';
      if(t.includes('ponte')) return 'scene-bridge';
      if(t.includes('notte') || t.includes('calma') || t.includes('luna')) return 'scene-night';
      if(t.includes('cielo')) return 'scene-sky';
      return 'scene-forest';
    },
    ageClass(age = ''){
      const normalized = normalizeAge(age);
      return normalized ? `age-${normalized}` : '';
    },
    selectedProfile(){
      const profiles = getJSON('fableaChildProfiles', []);
      const selectedId = localStorage.getItem('fableaSelectedChildId');
      return profiles.find(profile => profile.id === selectedId) || profiles[0] || null;
    },
    applyAge(target = document.body, age = ''){
      const ageClass = this.ageClass(age);
      target.classList.remove('age-2-4','age-5-7','age-8-10','age-11-12');
      if(!ageClass) return '';
      target.classList.add(ageClass);
      return ageClass;
    },
    applyAgeFromStorage(target = document.body){
      const profile = this.selectedProfile();
      const storyData = getJSON('fableaStoryData', {});
      const age = (profile && profile.age) || storyData.age || '';
      return this.applyAge(target, age);
    }
  };
})();
