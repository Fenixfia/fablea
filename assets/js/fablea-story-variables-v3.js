(function(global){
  'use strict';

  const SCHEMA_VERSION = 3;
  const STORAGE_KEY = 'fableaStoryRequestV3';
  const QA_STORAGE_KEY = 'fableaStoryRequestV3QA';

  const MODES = {
    moment:{label:'Partiamo dal momento',family:'emozioni',tone:'warm',pace:'balanced',suspense:'low',solution:'conversation',ending:'closed-soft'},
    world:{label:'Partiamo dal tuo mondo',family:'avventura',tone:'wonder',pace:'balanced',suspense:'medium',solution:'mixed',ending:'open-thread'},
    idea:{label:'Partiamo da un’idea',family:'avventura',tone:'wonder',pace:'dynamic',suspense:'medium',solution:'creativity',ending:'closed'},
    continue:{label:'Continua una storia',family:'avventura',tone:'continuous',pace:'balanced',suspense:'medium',solution:'mixed',ending:'open-thread'},
    bedtime:{label:'Buonanotte',family:'calma-sera',tone:'gentle',pace:'slow',suspense:'none',solution:'observation',ending:'closed-soft'},
    family:{label:'Storia in famiglia',family:'emozioni',tone:'warm',pace:'balanced',suspense:'low',solution:'cooperation',ending:'closed'},
    prepare:{label:'Prepariamoci a qualcosa',family:'emozioni',tone:'reassuring',pace:'slow',suspense:'low',solution:'courage',ending:'closed-soft'},
    discovery:{label:'Scoperta',family:'scoperta',tone:'curious',pace:'balanced',suspense:'low',solution:'observation',ending:'question'},
    cocreate:{label:'Crea insieme',family:'avventura',tone:'playful',pace:'dynamic',suspense:'medium',solution:'creativity',ending:'choice'}
  };

  const ALLOWED = {
    duration:['Breve','Media','Lunga'],
    readingMode:['shared','independent','audio','unspecified'],
    energy:['low','balanced','high','unspecified'],
    location:['home','car','travel','waiting','outside','unspecified'],
    timeOfDay:['morning','afternoon','evening','night','unspecified'],
    tone:['warm','wonder','continuous','gentle','reassuring','curious','playful','mysterious','funny','emotional'],
    pace:['slow','balanced','dynamic'],
    suspense:['none','low','medium'],
    solution:['cooperation','observation','conversation','experimentation','courage','creativity','mixed'],
    ending:['closed','closed-soft','open-thread','question','choice'],
    intensity:['gentle','balanced','strong']
  };

  function clean(value,max = 240){
    return String(value || '').replace(/\s+/g,' ').trim().slice(0,max);
  }

  function list(value,max = 12){
    return [...new Set((Array.isArray(value) ? value : []).map(item => clean(item,120)).filter(Boolean))].slice(0,max);
  }

  function oneOf(value,allowed,fallback){
    return allowed.includes(value) ? value : fallback;
  }

  function stableHash(value){
    const source = JSON.stringify(value);
    let hash = 2166136261;
    for(let index = 0; index < source.length; index += 1){
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash,16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function modeFor(input = {}){
    if(MODES[input.mode]) return input.mode;
    if(input.continueStoryId) return 'continue';
    if(input.family === 'calma-sera') return 'bedtime';
    if(input.family === 'scoperta') return 'discovery';
    if(input.family === 'emozioni') return 'moment';
    return 'world';
  }

  function profileSnapshot(profile){
    return {
      id:clean(profile.id,100),
      name:clean(profile.name,80),
      age:clean(profile.age,10),
      gender:clean(profile.gender,20),
      primaryWorld:clean(profile.primaryWorld,80),
      interests:list(profile.interests,8),
      favoriteCompanion:clean(profile.favoriteCompanion,140),
      support:clean(profile.support,160),
      duration:clean(profile.duration,20),
      storyStyle:clean(profile.storyStyle,30)
    };
  }

  function narrativeDefaults(mode,profile,input){
    const preset = MODES[mode];
    const preferredStyle = profile.storyStyle === 'mysterious' ? 'mysterious'
      : profile.storyStyle === 'funny' ? 'funny'
      : profile.storyStyle === 'emotional' ? 'emotional'
      : preset.tone;
    return {
      family:clean(input.family || preset.family,40),
      tone:oneOf(input.tone,ALLOWED.tone,preferredStyle),
      pace:oneOf(input.pace,ALLOWED.pace,preset.pace),
      dialogue:oneOf(input.dialogue,['light','balanced','rich'],'balanced'),
      description:oneOf(input.description,['light','balanced','rich'],'balanced'),
      suspense:oneOf(input.suspense,ALLOWED.suspense,preset.suspense),
      solution:oneOf(input.solution,ALLOWED.solution,preset.solution),
      ending:oneOf(input.ending,ALLOWED.ending,preset.ending),
      ritualRequested:Boolean(input.ritualRequested || mode === 'bedtime' || mode === 'moment'),
      activityRequested:Boolean(input.activityRequested || mode === 'discovery' || mode === 'family'),
      coCreateChoices:mode === 'cocreate' ? Math.max(1,Math.min(3,Number(input.coCreateChoices) || 2)) : 0,
      idea:clean(input.idea,320),
      realLifeEvent:clean(input.realLifeEvent,320),
      preparationTarget:clean(input.preparationTarget,200)
    };
  }

  function safety(input = {}){
    const sensitive = Boolean(input.adultConfirmedSensitiveThemes);
    return {
      avoidThemes:list(input.avoidThemes,20),
      maxIntensity:oneOf(input.maxIntensity,ALLOWED.intensity,'balanced'),
      adultConfirmedSensitiveThemes:sensitive,
      allowHealthThemes:sensitive && Boolean(input.allowHealthThemes),
      allowLossThemes:sensitive && Boolean(input.allowLossThemes),
      allowSeparationThemes:sensitive && Boolean(input.allowSeparationThemes),
      diagnosticLanguage:false,
      commercialProfiling:false
    };
  }

  function build(profile,input = {},options = {}){
    if(!profile || !profile.id) throw new Error('Profilo bambino mancante per la richiesta V3.');
    const mode = modeFor(input);
    const worldApi = global.FableaWorldStateV3;
    const worldState = options.worldState || (worldApi && worldApi.get(profile,{persist:options.persistWorldState !== false})) || null;
    const family = input.family || MODES[mode].family;
    const relevantMemory = worldApi && worldState
      ? worldApi.selectRelevant(worldState,{world:input.scenario || profile.primaryWorld,family,continueStoryId:input.continueStoryId})
      : [];

    const requestCore = {
      schemaVersion:SCHEMA_VERSION,
      profile:profileSnapshot(profile),
      mode,
      today:{
        mood:clean(input.mood,140),
        energy:oneOf(input.energy,ALLOWED.energy,'unspecified'),
        duration:oneOf(input.duration,ALLOWED.duration,profile.duration || 'Breve'),
        readingMode:oneOf(input.readingMode,ALLOWED.readingMode,'unspecified'),
        timeOfDay:oneOf(input.timeOfDay,ALLOWED.timeOfDay,'unspecified'),
        location:oneOf(input.location,ALLOWED.location,'unspecified'),
        presentWith:list(input.presentWith,8),
        wantsContinuation:mode === 'continue' || Boolean(input.continueStoryId)
      },
      world:{
        scenario:clean(input.scenario || profile.primaryWorld,80),
        homeWorld:clean(profile.primaryWorld,80),
        companion:clean(profile.favoriteCompanion || worldState && worldState.companion,140),
        continueStoryId:clean(input.continueStoryId,120),
        selectedMemory:relevantMemory
      },
      narrative:narrativeDefaults(mode,profile,input),
      safety:safety(input.safety || input),
      provenance:{
        source:clean(input.source || 'guided-creator',40),
        legacyCompatible:true,
        editorialStoryId:clean(input.editorialStoryId,120)
      }
    };

    return {
      ...requestCore,
      id:`request-v3-${clean(profile.id,60)}-${stableHash(requestCore)}`,
      createdAt:clean(input.createdAt,40) || null
    };
  }

  function validate(request){
    const errors = [];
    const warnings = [];
    if(!request || request.schemaVersion !== SCHEMA_VERSION) errors.push('schemaVersion V3 mancante o non valido');
    if(!request || !request.profile || !request.profile.id) errors.push('profilo snapshot mancante');
    if(!request || !MODES[request.mode]) errors.push('modalità narrativa non supportata');
    if(request && request.today && !ALLOWED.duration.includes(request.today.duration)) errors.push('durata non valida');
    if(request && request.world && request.world.selectedMemory && request.world.selectedMemory.length > 3) errors.push('troppe tracce di memoria selezionate');
    if(request && request.narrative && request.narrative.idea && request.mode !== 'idea' && request.mode !== 'cocreate') warnings.push('idea libera presente in una modalità non dedicata');
    if(request && request.safety && request.safety.diagnosticLanguage !== false) errors.push('linguaggio diagnostico non consentito');
    if(request && request.safety && request.safety.commercialProfiling !== false) errors.push('profilazione commerciale non consentita');
    return {valid:errors.length === 0,errors,warnings};
  }

  function toLegacy(request){
    return {
      profileId:request.profile.id,
      family:request.narrative.family,
      mood:request.today.mood,
      duration:request.today.duration,
      scenario:request.world.scenario,
      firstStory:false
    };
  }

  function qaSnapshot(request){
    return {
      id:request.id,
      schemaVersion:request.schemaVersion,
      childId:request.profile.id,
      age:request.profile.age,
      mode:request.mode,
      duration:request.today.duration,
      world:request.world.scenario,
      family:request.narrative.family,
      solution:request.narrative.solution,
      ending:request.narrative.ending,
      memoryTypes:(request.world.selectedMemory || []).map(item => item.type),
      avoidThemeCount:(request.safety.avoidThemes || []).length,
      valid:validate(request).valid
    };
  }

  function save(request){
    const result = validate(request);
    if(!result.valid) throw new Error(`Richiesta V3 non valida: ${result.errors.join('; ')}`);
    if(global.localStorage){
      global.localStorage.setItem(STORAGE_KEY,JSON.stringify(request));
      global.localStorage.setItem(QA_STORAGE_KEY,JSON.stringify(qaSnapshot(request)));
    }
    return request;
  }

  function buildAndSave(profile,input = {},options = {}){
    return save(build(profile,input,options));
  }

  global.FableaStoryVariablesV3 = {
    SCHEMA_VERSION,
    STORAGE_KEY,
    QA_STORAGE_KEY,
    MODES,
    ALLOWED,
    build,
    buildAndSave,
    validate,
    toLegacy,
    qaSnapshot,
    stableHash
  };
})(window);