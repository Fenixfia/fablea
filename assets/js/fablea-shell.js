(function(global){
  'use strict';

  const WORLD_PRESENTATION = {
    'Dinosauri':{icon:'🦕',companionIcon:'🦖',place:'Valle delle Felci Giganti',promise:'Ogni impronta può aprire un sentiero nuovo.'},
    'Mare':{icon:'🌊',companionIcon:'🐋',place:'Baia delle Maree Luminose',promise:'Le maree conservano storie che tornano a galla.'},
    'Animali':{icon:'🐾',companionIcon:'🦊',place:'Bosco degli Animali Parlanti',promise:'Ogni voce del bosco ha qualcosa da raccontare.'},
    'Spazio':{icon:'🪐',companionIcon:'🤖',place:'Stazione delle Orbite Quiete',promise:'Tra le stelle, ogni domanda diventa una rotta.'},
    'Magia':{icon:'✨',companionIcon:'🧚',place:'Quartiere delle Botteghe Incantate',promise:'Gli incantesimi migliori cominciano da una scelta.'},
    'Foresta':{icon:'🌲',companionIcon:'🦌',place:'Foresta delle Luci Basse',promise:'Il bosco cambia quando qualcuno impara ad ascoltarlo.'},
    'Regni e castelli':{icon:'🏰',companionIcon:'👸',place:'Regno delle Sette Terrazze',promise:'Un regno cresce insieme a chi se ne prende cura.'},
    'Misteri e scoperte':{icon:'🔎',companionIcon:'🕵️',place:'Città degli Indizi Gentili',promise:'Le domande giuste rendono visibile ciò che era nascosto.'}
  };

  const FAMILY_LABELS = {
    avventura:'Avventura',
    'calma-sera':'Calma e buonanotte',
    emozioni:'Emozioni',
    scoperta:'Scoperta'
  };

  const COLLECTION_LABELS = {
    original:'Originale FABLEA',
    classic:'Classico rinarrato'
  };

  function escapeHTML(value){
    return global.FableaProfile
      ? global.FableaProfile.escapeHTML(value)
      : String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  function presentation(profile){
    const world = profile && profile.primaryWorld || 'Magia';
    return WORLD_PRESENTATION[world] || WORLD_PRESENTATION.Magia;
  }

  function applyProfile(profile){
    const world = profile && profile.primaryWorld || 'Magia';
    document.body.dataset.world = world;
    if(global.FableaUI && profile) global.FableaUI.applyAge(document.body, profile.age);
    return presentation(profile);
  }

  function companionName(profile){
    if(!profile) return 'il tuo compagno';
    const lore = global.FableaStoryEngine && global.FableaStoryEngine.WORLD_LORE[profile.primaryWorld];
    return profile.favoriteCompanion || (lore && lore.companion) || 'il tuo compagno';
  }

  function previewTemplate(value, profile){
    const world = profile && profile.primaryWorld || 'Magia';
    const replacements = {
      name:profile && profile.name || 'tu',
      world,
      companion:companionName(profile)
    };
    return String(value || '')
      .replace(/{{\s*(name|world|companion)\s*}}/g, (_match,key) => replacements[key])
      .replace(/{{[^}]+}}/g, 'qualcosa di inatteso');
  }

  function originalsFor(profile){
    const catalog = global.FableaStoryEngine ? global.FableaStoryEngine.catalog() : [];
    return catalog.filter(story => !profile || story.age === profile.age).map(story => ({...story,collection:story.collection || 'original'}));
  }

  function classicsFor(profile){
    const catalog = Array.isArray(global.FABLEA_CLASSICS_V1) ? global.FABLEA_CLASSICS_V1 : [];
    return catalog.filter(story => !profile || story.age === profile.age);
  }

  function storiesFor(profile, options = {}){
    const collection = options.collection || 'original';
    if(collection === 'classic') return classicsFor(profile);
    if(collection === 'all') return [...originalsFor(profile),...classicsFor(profile)];
    return originalsFor(profile);
  }

  function catalogStoryById(profile,id){
    return storiesFor(profile,{collection:'all'}).find(story => story.id === id) || null;
  }

  function savedFor(profile){
    if(!global.FableaStoryEngine || !profile) return [];
    return global.FableaStoryEngine.savedStories().filter(story => story.childId === profile.id || (!story.childId && story.child === profile.name));
  }

  function lastStory(profile){
    if(!profile) return null;
    const memory = global.FableaProfile.getMemory(profile);
    const stories = savedFor(profile);
    return stories.find(story => story.id === memory.lastStoryId) || stories[stories.length - 1] || null;
  }

  function openSavedStory(story){
    if(!story) return false;
    localStorage.setItem('fableaCurrentStory',JSON.stringify(story));
    localStorage.setItem('fableaReopenStory','true');
    location.href = '/story-result.html';
    return true;
  }

  function openCatalogStory(profile, story, duration){
    if(!profile || !story || !global.FableaStoryEngine) return false;
    const scenario = story.defaultWorld || profile.primaryWorld;
    let built = global.FableaStoryEngine.buildStory(profile,{
      story,
      duration:duration || profile.duration,
      scenario,
      family:story.family,
      mood:(story.moods && story.moods[0]) || ''
    });

    try{
      if(global.FableaStoryVariablesV3 && global.FableaStoryEngineV3){
        const mode = story.family === 'calma-sera' ? 'bedtime' : story.family === 'scoperta' ? 'discovery' : 'world';
        const requestV3 = global.FableaStoryVariablesV3.buildAndSave(profile,{
          mode,
          family:story.family,
          mood:(story.moods && story.moods[0]) || '',
          duration:duration || profile.duration,
          scenario,
          editorialStoryId:story.id,
          source:story.collection === 'classic' ? 'classic-catalog' : 'editorial-catalog'
        });
        built = global.FableaStoryEngineV3.apply(built,requestV3);
      }
    }catch(error){
      console.warn('Personalizzazione V3 editoriale non disponibile, uso la versione v2.',error);
    }

    built = {...built,collection:story.collection || 'original',source:story.source || null};
    global.FableaStoryEngine.saveStory(built);
    localStorage.setItem('fableaReopenStory','true');
    location.href = '/story-result.html';
    return true;
  }

  function renderDock(active){
    const items = [
      ['continue','📖','Continua','/child-hub.html'],
      ['discover','✦','Scopri','/discover.html'],
      ['create','＋','Crea','/story.html'],
      ['world','⌁','Mondo','/world.html'],
      ['library','▤','Libreria','/library.html']
    ];
    return `<nav class="explore-dock" aria-label="Esplora FABLEA">${items.map(([id,icon,label,href]) => `<a class="dock-link ${id === active ? 'active' : ''} ${id === 'create' ? 'primary' : ''}" href="${href}" data-shell-destination="${id}"><span class="dock-icon">${icon}</span><span>${label}</span></a>`).join('')}</nav>`;
  }

  function familyLabel(family){
    return FAMILY_LABELS[family] || 'Storia FABLEA';
  }

  function collectionLabel(collection){
    return COLLECTION_LABELS[collection] || COLLECTION_LABELS.original;
  }

  global.FableaShell = {
    WORLD_PRESENTATION,
    FAMILY_LABELS,
    COLLECTION_LABELS,
    escapeHTML,
    presentation,
    applyProfile,
    companionName,
    previewTemplate,
    originalsFor,
    classicsFor,
    storiesFor,
    catalogStoryById,
    savedFor,
    lastStory,
    openSavedStory,
    openCatalogStory,
    renderDock,
    familyLabel,
    collectionLabel
  };
})(window);
