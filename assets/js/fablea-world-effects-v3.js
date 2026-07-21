(function(global){
  'use strict';

  function asArray(value){
    return Array.isArray(value) ? value : [];
  }

  function readAll(key){
    try{
      return JSON.parse(global.localStorage.getItem(key) || '{}');
    }catch(_error){
      return {};
    }
  }

  function uniqueById(values){
    return asArray(values).filter(Boolean).filter((item,index,list) => {
      const id = item && item.id;
      return id ? list.findIndex(other => other && other.id === id) === index : index === list.indexOf(item);
    });
  }

  function commit(profile,story){
    const worldApi = global.FableaWorldStateV3;
    if(!worldApi || !profile || !story) return null;
    const base = worldApi.rememberStory(profile,story);
    const effects = story.v3Consequences || {};
    const resolved = new Set(asArray(effects.resolvedThreadIds));
    const existingThreads = asArray(base.openThreads).map(thread => resolved.has(thread.id) ? {...thread,status:'closed',resolvedByStoryId:story.id} : thread);
    const next = {
      ...base,
      openThreads:uniqueById([...asArray(effects.openThreads),...existingThreads]),
      relationships:uniqueById([...asArray(effects.relationships),...asArray(base.relationships)]).slice(0,30),
      decisions:uniqueById([...asArray(effects.decisions),...asArray(base.decisions)]).slice(0,30),
      lastConsequence:effects.summary || '',
      updatedAt:story.createdAt || base.updatedAt
    };
    const all = readAll(worldApi.STORAGE_KEY);
    global.localStorage.setItem(worldApi.STORAGE_KEY,JSON.stringify({...all,[profile.id]:next}));
    return next;
  }

  global.FableaWorldEffectsV3 = {commit};
})(window);