(function(global){
  'use strict';

  const SCHEMA_VERSION = 3;
  const STORAGE_KEY = 'fableaWorldStateV3';
  const MAX_RECENT = 12;
  const MAX_SELECTED_MEMORY = 3;

  function asArray(value){
    return Array.isArray(value) ? value : [];
  }

  function unique(values){
    return [...new Set(asArray(values).filter(Boolean).map(value => String(value).trim()).filter(Boolean))];
  }

  function readJSON(key, fallback){
    try{
      const raw = global.localStorage && global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(_error){
      return fallback;
    }
  }

  function writeJSON(key, value){
    if(global.localStorage) global.localStorage.setItem(key,JSON.stringify(value));
    return value;
  }

  function profileStories(profile, stories){
    if(!profile) return [];
    return asArray(stories).filter(story => story && (
      story.childId === profile.id || (!story.childId && story.child === profile.name)
    ));
  }

  function storyTime(story){
    const parsed = Date.parse(story && (story.createdAt || story.date) || '');
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function storySummary(story){
    return {
      id:String(story.id || ''),
      storyId:String(story.storyId || ''),
      title:String(story.title || 'Storia senza titolo'),
      family:String(story.family || ''),
      world:String(story.world || story.theme || ''),
      companion:String(story.companion || ''),
      treasure:String(story.treasure || ''),
      ritual:String(story.ritual || ''),
      createdAt:String(story.createdAt || ''),
      resumePage:Math.max(0,Number(story.resumePage) || 0)
    };
  }

  function loreFor(world){
    const engine = global.FableaStoryEngine;
    return engine && engine.WORLD_LORE ? engine.WORLD_LORE[world] : null;
  }

  function derive(profile, legacyMemory = {}, savedStories = []){
    if(!profile) throw new Error('Profilo richiesto per costruire il mondo V3.');
    const stories = profileStories(profile,savedStories).sort((a,b) => storyTime(b) - storyTime(a));
    const storyWorlds = stories.map(story => story.world || story.theme).filter(Boolean);
    const visitedWorlds = unique([profile.primaryWorld,legacyMemory.lastScenario,...storyWorlds]);
    const places = visitedWorlds.map(world => {
      const lore = loreFor(world);
      return {
        id:`world:${world}`,
        world,
        name:lore && lore.place || world,
        discovered:true
      };
    });
    const companions = unique([
      profile.favoriteCompanion,
      legacyMemory.lastCompanion,
      ...stories.map(story => story.companion)
    ]).map(name => ({id:`companion:${name}`,name,role:'compagno'}));
    const treasures = unique([
      ...asArray(legacyMemory.treasures),
      ...stories.map(story => story.treasure)
    ]);
    const rituals = unique([
      ...asArray(legacyMemory.rituals).map(item => typeof item === 'string' ? item : item && (item.text || item.ritual)),
      ...stories.map(story => story.ritual)
    ]);
    const openThreads = unique([
      ...asArray(legacyMemory.promises),
      ...asArray(legacyMemory.mysteries),
      ...asArray(legacyMemory.openThreads)
    ]).map((text,index) => ({id:`thread:${index + 1}`,text,status:'open'}));

    return {
      schemaVersion:SCHEMA_VERSION,
      childId:String(profile.id),
      homeWorld:String(profile.primaryWorld || 'Magia'),
      companion:profile.favoriteCompanion || legacyMemory.lastCompanion || '',
      visitedWorlds,
      places,
      characters:companions,
      objects:treasures,
      rituals,
      openThreads,
      recentStories:stories.slice(0,MAX_RECENT).map(storySummary),
      lastStoryId:String(legacyMemory.lastStoryId || (stories[0] && stories[0].id) || ''),
      updatedAt:String(legacyMemory.updatedAt || '')
    };
  }

  function mergeState(derived, stored){
    if(!stored || stored.schemaVersion !== SCHEMA_VERSION) return derived;
    return {
      ...derived,
      ...stored,
      childId:derived.childId,
      homeWorld:stored.homeWorld || derived.homeWorld,
      visitedWorlds:unique([...derived.visitedWorlds,...asArray(stored.visitedWorlds)]),
      places:[...derived.places,...asArray(stored.places)].filter((item,index,list) => item && list.findIndex(other => other && other.id === item.id) === index),
      characters:[...derived.characters,...asArray(stored.characters)].filter((item,index,list) => item && list.findIndex(other => other && other.id === item.id) === index),
      objects:unique([...derived.objects,...asArray(stored.objects)]),
      rituals:unique([...derived.rituals,...asArray(stored.rituals)]),
      openThreads:[...derived.openThreads,...asArray(stored.openThreads)].filter((item,index,list) => item && list.findIndex(other => other && other.id === item.id) === index),
      recentStories:[...derived.recentStories,...asArray(stored.recentStories)].filter((item,index,list) => item && list.findIndex(other => other && other.id === item.id) === index).slice(0,MAX_RECENT)
    };
  }

  function get(profile, options = {}){
    const profileApi = global.FableaProfile;
    const engine = global.FableaStoryEngine;
    const legacyMemory = options.legacyMemory || (profileApi && profileApi.getMemory(profile)) || {};
    const savedStories = options.savedStories || (engine && engine.savedStories()) || [];
    const derived = derive(profile,legacyMemory,savedStories);
    const allStored = options.storedState || readJSON(STORAGE_KEY,{});
    const merged = mergeState(derived,allStored && allStored[profile.id]);
    if(options.persist !== false){
      const next = {...allStored,[profile.id]:merged};
      writeJSON(STORAGE_KEY,next);
    }
    return merged;
  }

  function memoryCandidates(state, intent = {}){
    const candidates = [];
    const requestedStoryId = String(intent.continueStoryId || '');
    const requestedWorld = String(intent.world || state.homeWorld || '');
    const requestedFamily = String(intent.family || '');

    asArray(state.recentStories).forEach((story,index) => {
      let score = 80 - index * 5;
      if(requestedStoryId && (story.id === requestedStoryId || story.storyId === requestedStoryId)) score += 200;
      if(requestedWorld && story.world === requestedWorld) score += 35;
      if(requestedFamily && story.family === requestedFamily) score += 25;
      if(story.id === state.lastStoryId) score += 45;
      candidates.push({
        type:'story',
        id:story.id,
        score,
        data:story
      });
    });

    asArray(state.openThreads).filter(thread => thread && thread.status !== 'closed').forEach((thread,index) => {
      candidates.push({type:'thread',id:thread.id,score:70 - index,data:thread});
    });

    asArray(state.objects).slice(0,4).forEach((object,index) => {
      candidates.push({type:'object',id:`object:${index}`,score:34 - index,data:{name:object}});
    });

    asArray(state.rituals).slice(0,3).forEach((ritual,index) => {
      candidates.push({type:'ritual',id:`ritual:${index}`,score:26 - index,data:{text:ritual}});
    });

    return candidates.sort((a,b) => b.score - a.score);
  }

  function selectRelevant(state, intent = {}, limit = MAX_SELECTED_MEMORY){
    const capped = Math.max(0,Math.min(MAX_SELECTED_MEMORY,Number(limit) || MAX_SELECTED_MEMORY));
    const selected = [];
    const types = new Set();
    for(const candidate of memoryCandidates(state,intent)){
      if(selected.length >= capped) break;
      if(types.has(candidate.type) && candidate.type !== 'story') continue;
      if(selected.some(item => item.id === candidate.id)) continue;
      selected.push(candidate);
      types.add(candidate.type);
    }
    return selected;
  }

  function rememberStory(profile, story){
    if(!profile || !story) return null;
    const current = get(profile,{persist:false});
    const summary = storySummary(story);
    const next = {
      ...current,
      companion:story.companion || current.companion,
      visitedWorlds:unique([story.world,...current.visitedWorlds]),
      objects:unique([story.treasure,...current.objects]),
      rituals:unique([story.ritual,...current.rituals]),
      recentStories:[summary,...current.recentStories.filter(item => item.id !== summary.id)].slice(0,MAX_RECENT),
      lastStoryId:summary.id,
      updatedAt:story.createdAt || current.updatedAt
    };
    const allStored = readJSON(STORAGE_KEY,{});
    writeJSON(STORAGE_KEY,{...allStored,[profile.id]:next});
    return next;
  }

  global.FableaWorldStateV3 = {
    SCHEMA_VERSION,
    STORAGE_KEY,
    MAX_SELECTED_MEMORY,
    derive,
    get,
    selectRelevant,
    rememberStory,
    profileStories
  };
})(window);