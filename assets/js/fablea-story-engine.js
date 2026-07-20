(function(global){
  'use strict';

  const TARGETS = {
    '2-4': {Breve:[220,380], Media:[320,560], Lunga:[450,760]},
    '5-7': {Breve:[420,680], Media:[600,950], Lunga:[820,1250]},
    '8-10': {Breve:[620,980], Media:[850,1350], Lunga:[1150,1750]},
    '11-12': {Breve:[820,1300], Media:[1150,1800], Lunga:[1500,2300]}
  };

  const WORLD_LORE = {
    'Dinosauri': {
      place:'la Valle delle Felci Giganti',
      threshold:'un arco di pietra segnato da impronte antiche',
      landmark:'il Vulcano Azzurro',
      sound:'passi profondi, ali lontane e foglie che si sfiorano',
      sky:'un cielo color albicocca attraversato dagli pterodattili',
      material:'ambra calda',
      scent:'felci bagnate, pietra tiepida e resina',
      companion:'Timo, un giovane triceratopo con una macchia a forma di stella'
    },
    'Mare': {
      place:'la Baia delle Maree Luminose',
      threshold:'una grotta di conchiglie che si apre con la bassa marea',
      landmark:'il Faro Sommerso',
      sound:'onde lente, richiami di balene e sassolini trascinati dall’acqua',
      sky:'un cielo largo che si specchia fino all’orizzonte',
      material:'madreperla azzurra',
      scent:'sale, alghe pulite e vento fresco',
      companion:'Marea, una piccola balena-lanterna'
    },
    'Animali': {
      place:'il Bosco degli Animali Parlanti',
      threshold:'una tana-porta nascosta sotto una quercia',
      landmark:'la Quercia delle Cento Voci',
      sound:'zampette, foglie, richiami e risate trattenute',
      sky:'un cielo a pezzetti tra i rami',
      material:'legno dorato',
      scent:'muschio, nocciole e pioggia recente',
      companion:'Pip, una volpe con gli occhiali tondi'
    },
    'Spazio': {
      place:'la Stazione delle Orbite Quiete',
      threshold:'un portello a forma di luna crescente',
      landmark:'il Pianeta dalle Due Albe',
      sound:'ronzii morbidi, segnali lontani e silenzio stellare',
      sky:'un cielo nero punteggiato di costellazioni vicinissime',
      material:'polvere stellare',
      scent:'metallo pulito, ozono e biscotti della cambusa',
      companion:'Astra, una lucciola capace di leggere le orbite'
    },
    'Magia': {
      place:'il Quartiere delle Botteghe Incantate',
      threshold:'una porta che appare soltanto guardandola di lato',
      landmark:'la Torre degli Incantesimi Incompiuti',
      sound:'campanelli, pagine che si voltano e sussurri gentili',
      sky:'un cielo viola con nuvole che cambiano forma',
      material:'vetro lunare',
      scent:'cannella, carta antica e pioggia d’estate',
      companion:'Luma, una gatta color notte con la coda luminosa'
    },
    'Foresta': {
      place:'la Foresta delle Luci Basse',
      threshold:'un ponte di radici intrecciate',
      landmark:'il Lago che Ricorda',
      sound:'foglie, acqua, civette e rami mossi dal vento',
      sky:'un cielo verde e dorato filtrato dalle chiome',
      material:'seme di quarzo',
      scent:'terra umida, corteccia e menta selvatica',
      companion:'Nocciola, un piccolo cervo dal passo silenzioso'
    },
    'Regni e castelli': {
      place:'il Regno delle Sette Terrazze',
      threshold:'il Portone degli Stemmi Mobili',
      landmark:'il Castello delle Finestre Accese',
      sound:'fontane, bandiere, campane e passi sui cortili',
      sky:'un cielo chiaro sopra torri, ponti e giardini pensili',
      material:'argento antico',
      scent:'rose, pietra fresca e pane appena sfornato',
      companion:'Rillo, un giovane drago bibliotecario'
    },
    'Misteri e scoperte': {
      place:'la Città degli Indizi Gentili',
      threshold:'un vicolo senza numero che compare al tramonto',
      landmark:'l’Osservatorio delle Domande',
      sound:'orologi, passi, matite e finestre che si aprono',
      sky:'un cielo color inchiostro pieno di segni da collegare',
      material:'inchiostro blu',
      scent:'carta, pioggia sui tetti e tè al limone',
      companion:'Otto, un corvo investigatore con una matita dietro l’ala'
    }
  };

  function words(text){
    return String(text || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function catalog(){
    return Array.isArray(global.FABLEA_STORIES_V2) ? global.FABLEA_STORIES_V2 : [];
  }

  function includesAny(values, requested){
    const needle = String(requested || '').toLowerCase();
    return (values || []).some(value => {
      const haystack = String(value || '').toLowerCase();
      return haystack === '*' || haystack.includes(needle) || needle.includes(haystack);
    });
  }

  function readRotation(){
    try{return JSON.parse(localStorage.getItem('fableaStoryRotation') || '{}');}
    catch(_error){return {};}
  }

  function saveRotation(value){
    localStorage.setItem('fableaStoryRotation', JSON.stringify(value));
  }

  function rotationKey(profile){
    return `v2:${profile.id}:${profile.age}`;
  }

  function score(story, request, recent){
    let result = story.age === request.profile.age ? 200 : -1000;
    if(story.family === request.family) result += 90;
    if(story.adaptableToWorld || includesAny(story.worlds, request.scenario)) result += 70;
    if(includesAny(story.moods, request.mood)) result += 35;
    if(includesAny(story.support, request.profile.support)) result += 25;
    if((story.styles || []).includes(request.profile.storyStyle)) result += 18;
    (request.profile.interests || []).forEach(interest => {
      if(includesAny(story.worlds, interest)) result += 6;
    });
    if(recent.includes(story.id)) result -= 150;
    return result;
  }

  function selectStory(profile, options = {}){
    const request = {
      profile,
      scenario: options.scenario || profile.primaryWorld,
      family: options.family || 'avventura',
      mood: options.mood || 'Curiosità e voglia di scoprire'
    };
    const rotation = readRotation();
    const key = rotationKey(profile);
    const recent = rotation[key] || [];
    const ranked = catalog()
      .filter(story => story.age === profile.age)
      .map(story => ({story, score:score(story, request, recent)}))
      .sort((a,b) => b.score - a.score);
    const chosen = (ranked[0] && ranked[0].story) || catalog().find(story => story.age === profile.age) || catalog()[0];
    if(!chosen) throw new Error('Nessuna storia disponibile per questa fascia d’età.');
    rotation[key] = [chosen.id, ...recent.filter(id => id !== chosen.id)].slice(0, 4);
    saveRotation(rotation);
    return chosen;
  }

  function contextFor(profile, scenario, selected){
    const world = global.FableaProfile ? global.FableaProfile.normalizeWorld(scenario || profile.primaryWorld) : (scenario || profile.primaryWorld);
    const lore = WORLD_LORE[world] || WORLD_LORE.Magia;
    return {
      ...lore,
      world,
      companion: profile.favoriteCompanion || selected.companion || lore.companion
    };
  }

  function pageText(page, duration){
    if(duration === 'Lunga') return [page.text, page.detail].filter(Boolean).join(' ');
    return page.text || '';
  }

  function pagesForDuration(story, duration){
    const normalized = global.FableaProfile
      ? global.FableaProfile.normalizeDuration(duration)
      : (duration || 'Breve');
    return (story.pages || [])
      .filter(page => {
        if(normalized === 'Breve') return !page.optionalForShort;
        if(normalized === 'Media') return !page.optionalForMedium;
        return true;
      })
      .map(page => ({...page, text:pageText(page, normalized)}));
  }

  function personalize(value, profile, context){
    return global.FableaGrammar
      ? global.FableaGrammar.apply(value, profile, context)
      : String(value || '').replaceAll('{{name}}', profile.name);
  }

  function buildStory(profile, options = {}){
    if(!profile) throw new Error('Profilo bambino mancante.');
    const selected = options.story || selectStory(profile, options);
    const duration = global.FableaProfile
      ? global.FableaProfile.normalizeDuration(options.duration || profile.duration)
      : (options.duration || profile.duration || 'Breve');
    const scenario = global.FableaProfile
      ? global.FableaProfile.normalizeWorld(options.scenario || profile.primaryWorld)
      : (options.scenario || profile.primaryWorld);
    const context = contextFor(profile, scenario, selected);
    const pages = pagesForDuration(selected, duration).map((page, index) => ({
      id: page.id || `page-${index + 1}`,
      scene: personalize(page.scene || `Scena ${index + 1}`, profile, context),
      text: personalize(page.text, profile, context),
      art: page.art || selected.cover && selected.cover.art || 'forest'
    }));
    const text = pages.map(page => page.text).join('\n\n');
    const snapshot = {
      id: profile.id,
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      primaryWorld: profile.primaryWorld,
      interests: profile.interests || [],
      support: profile.support,
      duration,
      storyStyle: profile.storyStyle,
      favoriteCompanion: profile.favoriteCompanion || ''
    };
    const uniqueId = `story-${profile.id}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

    return {
      id: uniqueId,
      storyId: selected.id,
      schemaVersion: 2,
      child: profile.name,
      childId: profile.id,
      profileSnapshot: snapshot,
      age: profile.age,
      gender: profile.gender,
      theme: scenario,
      world: scenario,
      duration,
      family: selected.family,
      mood: options.mood || '',
      experience: options.experience || options.family || selected.family,
      title: personalize(selected.title, profile, context),
      subtitle: personalize(selected.subtitle, profile, context),
      companion: context.companion,
      icon: selected.cover && selected.cover.icon,
      art: selected.cover && selected.cover.art,
      scene: selected.cover && selected.cover.icon,
      pages,
      text,
      wordCount: words(text),
      treasure: personalize(selected.treasure, profile, context),
      ritual: personalize(selected.ritual, profile, context),
      activity: personalize(selected.activity, profile, context),
      date: new Date().toLocaleDateString('it-IT'),
      createdAt: new Date().toISOString(),
      resumePage: 0
    };
  }

  function savedStories(){
    try{
      const parsed = JSON.parse(localStorage.getItem('fableaSavedStories') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    }catch(_error){
      return [];
    }
  }

  function saveStory(story){
    const list = savedStories();
    const index = list.findIndex(item => item.id === story.id);
    if(index >= 0) list[index] = story;
    else list.push(story);
    localStorage.setItem('fableaSavedStories', JSON.stringify(list.slice(-100)));
    localStorage.setItem('fableaCurrentStory', JSON.stringify(story));
    const profile = story.profileSnapshot || {id:story.childId, name:story.child};
    if(global.FableaProfile){
      const memory = global.FableaProfile.getMemory(profile);
      global.FableaProfile.updateMemory(profile, {
        lastStory: story.title,
        lastStoryId: story.id,
        lastScenario: story.world,
        lastCompanion: story.companion,
        resume: {storyId:story.id, page:story.resumePage || 0},
        history: [story.id, ...(memory.history || []).filter(id => id !== story.id)].slice(0, 30)
      });
    }
    return story;
  }

  function updateProgress(story, pageIndex){
    const next = {...story, resumePage:Math.max(0, Number(pageIndex) || 0)};
    saveStory(next);
    return next;
  }

  global.FableaStoryEngine = {
    TARGETS,
    WORLD_LORE,
    words,
    catalog,
    selectStory,
    buildStory,
    saveStory,
    savedStories,
    updateProgress,
    pagesForDuration,
    contextFor
  };
})(window);
