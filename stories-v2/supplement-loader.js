(function(global){
  'use strict';

  let catalogValue = global.FABLEA_STORIES_V2;

  function additionsFor(storyId){
    return [
      ...((global.FABLEA_STORY_SUPPLEMENTS || {})[storyId] || []),
      ...((global.FABLEA_STORY_FINAL_SCENES || {})[storyId] || [])
    ];
  }

  function attach(catalog){
    if(!Array.isArray(catalog)) return catalog;
    catalog.forEach(story => {
      const existing = new Set((story.extensions || []).map(page => page.id));
      story.extensions = [
        ...(story.extensions || []),
        ...additionsFor(story.id).filter(page => !existing.has(page.id))
      ];
    });
    return catalog;
  }

  const descriptor = Object.getOwnPropertyDescriptor(global,'FABLEA_STORIES_V2');
  if(!descriptor || descriptor.configurable){
    Object.defineProperty(global,'FABLEA_STORIES_V2',{
      configurable:true,
      enumerable:true,
      get(){ return catalogValue; },
      set(value){ catalogValue = attach(value); }
    });
  }

  global.FableaAttachStorySupplements = attach;
  if(catalogValue) catalogValue = attach(catalogValue);
})(window);
