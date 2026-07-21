(function(global){
  'use strict';

  const STORAGE_KEY = 'fableaIntegratedBeta';
  const SCHEMA_VERSION = 1;
  const TRIAL_DAYS = 15;
  const F = global.FableaProfile;

  const read = (key,fallback) => {
    try{
      const raw = global.localStorage && global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(_error){return fallback;}
  };
  const write = (key,value) => {
    try{global.localStorage && global.localStorage.setItem(key,JSON.stringify(value));return value;}catch(_error){return value;}
  };
  const iso = value => {
    const date = value ? new Date(value) : new Date();
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  };
  const time = value => {
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
  };

  function initialState(){
    return {
      schemaVersion:SCHEMA_VERSION,
      trial:{startedAt:new Date().toISOString(),days:TRIAL_DAYS},
      parent:{pinDigest:'',createdAt:''},
      profiles:{},
      platform:{mode:'local-beta',account:false,sync:false,billing:false}
    };
  }

  function migrate(){
    const current = read(STORAGE_KEY,null);
    if(!current || typeof current !== 'object') return write(STORAGE_KEY,initialState());
    const next = {...initialState(),...current};
    next.schemaVersion = SCHEMA_VERSION;
    next.trial = {...initialState().trial,...(current.trial || {})};
    next.parent = {...initialState().parent,...(current.parent || {})};
    next.profiles = current.profiles && typeof current.profiles === 'object' ? current.profiles : {};
    next.platform = {...initialState().platform,...(current.platform || {})};
    return write(STORAGE_KEY,next);
  }

  function state(){return migrate();}

  function trialStatus(){
    const current = state();
    const startedAt = new Date(current.trial.startedAt);
    const endAt = new Date(startedAt.getTime() + Number(current.trial.days || TRIAL_DAYS) * 86400000);
    const remainingMs = endAt.getTime() - Date.now();
    const remainingDays = Math.max(0,Math.ceil(remainingMs / 86400000));
    return {
      startedAt:startedAt.toISOString(),
      endAt:endAt.toISOString(),
      remainingDays,
      active:remainingMs > 0,
      monthlyPrice:'5,99 €',
      annualPrice:'59,90 €',
      checkoutEnabled:false
    };
  }

  function profiles(){
    if(F && typeof F.getProfiles === 'function') return F.getProfiles();
    return read('fableaChildProfiles',[]);
  }

  function selectedProfile(){
    if(F && typeof F.getSelectedProfile === 'function') return F.getSelectedProfile();
    const list = profiles();
    const selectedId = global.localStorage && global.localStorage.getItem('fableaSelectedChildId');
    return list.find(item => item.id === selectedId) || list[0] || null;
  }

  function savedStories(profile){
    if(!profile) return [];
    const key = F && F.KEYS ? F.KEYS.saved : 'fableaSavedStories';
    const stories = read(key,[]);
    return Array.isArray(stories) ? stories.filter(story => story.childId === profile.id || story.profileId === profile.id) : [];
  }

  function memory(profile){
    if(!profile) return {};
    if(F && typeof F.getMemory === 'function') return F.getMemory(profile) || {};
    const all = read('fableaMemory',{});
    return all[profile.id] || {};
  }

  function activity(profile){
    if(!profile) return {journeys:[],skills:[],play:0,learn:0,last:null};
    const all = read('fableaActivityProgress',{});
    const current = all[profile.id] || {};
    const journeys = Array.isArray(current.journeys) ? current.journeys : [];
    const skills = [...new Set(journeys.flatMap(item => Array.isArray(item.skills) ? item.skills : []))];
    return {
      journeys,
      skills,
      play:Number(current.play || journeys.filter(item => item.mode === 'play').length || 0),
      learn:Number(current.learn || journeys.filter(item => item.mode === 'learn').length || 0),
      last:journeys[journeys.length - 1] || null
    };
  }

  function storyTimestamp(story){
    return Math.max(time(story && story.updatedAt),time(story && story.savedAt),time(story && story.createdAt),time(story && story.completedAt));
  }

  function latestStory(profile){
    return savedStories(profile).slice().sort((a,b) => storyTimestamp(b) - storyTimestamp(a)).find(Boolean) || null;
  }

  const WORLD_ARTIFACTS = {
    Dinosauri:['🦴','Fossile della prima scoperta'],
    Mare:['🐚','Conchiglia che conserva una voce'],
    Animali:['🍂','Foglia del sentiero condiviso'],
    Spazio:['✦','Stella trovata fuori rotta'],
    Magia:['🔑','Chiave di una porta invisibile'],
    Foresta:['🌰','Seme del bosco che ricorda'],
    'Regni e castelli':['🛡️','Emblema di una scelta coraggiosa'],
    'Misteri e scoperte':['🧭','Bussola degli indizi']
  };

  function artifact(profile){
    const currentMemory = memory(profile);
    const story = latestStory(profile);
    const world = (story && story.world) || currentMemory.lastScenario || (profile && profile.primaryWorld) || 'Magia';
    const fallback = WORLD_ARTIFACTS[world] || ['✨','Traccia di un’avventura'];
    const treasures = Array.isArray(currentMemory.treasures) ? currentMemory.treasures : [];
    const rituals = Array.isArray(currentMemory.rituals) ? currentMemory.rituals : [];
    const ritual = rituals[0] || null;
    if(!story && !ritual && !treasures.length) return null;
    return {
      icon:fallback[0],
      title:treasures[treasures.length - 1] || (ritual && ritual.treasure) || fallback[1],
      world,
      storyTitle:(story && story.title) || (ritual && ritual.story) || currentMemory.lastStory || '',
      consequence:(story && story.v3Consequences && story.v3Consequences.summary) || currentMemory.lastConsequence || `Ora ${fallback[1].toLowerCase()} vive nella Casa.`
    };
  }

  function relatedActivity(story){
    const haystack = `${story && story.world || ''} ${story && story.family || ''} ${story && story.title || ''}`.toLowerCase();
    if(/mare|foresta|animali|dinosaur|spazio|scoperta/.test(haystack)) return {href:'/learn.html?path=science',label:'Esplora ciò che hai incontrato',mode:'learn',path:'science'};
    if(/mister|enigm|avventura|castell/.test(haystack)) return {href:'/play.html?path=logic',label:'Segui gli indizi lasciati dalla storia',mode:'play',path:'logic'};
    if(/emozion|calma|sera/.test(haystack)) return {href:'/play.html?path=attention',label:'Riconosci le tracce e le emozioni',mode:'play',path:'attention'};
    return {href:'/learn.html?path=language',label:'Gioca con le parole della storia',mode:'learn',path:'language'};
  }

  function recommendation(profile){
    const story = latestStory(profile);
    const progress = activity(profile);
    const current = read('fableaCurrentStory',null);
    const prepared = F && F.KEYS ? read(F.KEYS.prepared,null) : read('fableaPreparedStory',null);
    const currentBelongs = current && profile && (current.childId === profile.id || current.profileId === profile.id);
    const pages = currentBelongs && Array.isArray(current.pages) ? current.pages.length : 0;
    const resumePage = currentBelongs ? Number(current.resumePage || 0) : 0;

    if(currentBelongs && pages && resumePage < pages - 1){
      return {kind:'resume',eyebrow:'Riprendiamo da qui',title:current.title,description:`Pagina ${resumePage + 1} di ${pages}. Il mondo ha tenuto il segno.`,href:'/story-result.html',action:'Continua la storia',icon:current.icon || '📖'};
    }
    if(prepared && profile && prepared.childId === profile.id){
      return {kind:'prepared',eyebrow:'Una storia è pronta',title:prepared.title,description:prepared.subtitle || 'La prima porta è già aperta.',href:'/story-result.html?prepared=1',action:'Apri il Libro vivo',icon:prepared.icon || '📖'};
    }
    if(!story){
      return {kind:'first',eyebrow:'La prima porta',title:'Apriamo il suo viaggio',description:'Una storia scelta per la sua età darà al mondo il primo ricordo.',href:'/discover.html',action:'Scegli una storia',icon:'🚪'};
    }

    const storyAt = storyTimestamp(story);
    const activityAt = time(progress.last && progress.last.completedAt);
    if(!progress.last || activityAt < storyAt){
      const related = relatedActivity(story);
      return {kind:'activity',eyebrow:'La storia continua fuori dal libro',title:related.label,description:`Da “${story.title}” è nato un nuovo percorso.`,href:related.href,action:'Inizia il percorso',icon:'🧭'};
    }
    return {kind:'create',eyebrow:'Il mondo ha qualcosa da raccontare',title:'Inventiamo il prossimo capitolo',description:'L’ultima scoperta può diventare un personaggio, un luogo o un problema da risolvere.',href:'/story.html',action:'Crea una storia',icon:'✨'};
  }

  function reconcile(profile){
    if(!profile) return null;
    const current = state();
    const progress = activity(profile);
    const story = latestStory(profile);
    const item = {
      updatedAt:new Date().toISOString(),
      storyId:story && story.id || '',
      storyTitle:story && story.title || '',
      artifact:artifact(profile),
      activityCount:progress.journeys.length,
      lastMission:progress.last && progress.last.mission || '',
      recommendation:recommendation(profile)
    };
    current.profiles[profile.id] = item;
    write(STORAGE_KEY,current);
    return item;
  }

  function summary(profile){
    const stories = savedStories(profile);
    const progress = activity(profile);
    const currentMemory = memory(profile);
    return {
      storyCount:stories.length,
      activityCount:progress.journeys.length,
      playCount:progress.play,
      learnCount:progress.learn,
      skills:progress.skills.slice(-12).reverse(),
      treasures:Array.isArray(currentMemory.treasures) ? currentMemory.treasures : [],
      lastMission:progress.last && progress.last.mission || '',
      lastStory:latestStory(profile),
      artifact:artifact(profile)
    };
  }

  async function digest(value){
    const text = String(value || '');
    if(global.crypto && global.crypto.subtle && global.TextEncoder){
      const bytes = await global.crypto.subtle.digest('SHA-256',new global.TextEncoder().encode(text));
      return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2,'0')).join('');
    }
    let hash = 2166136261;
    for(const char of text){hash ^= char.charCodeAt(0);hash = Math.imul(hash,16777619);}
    return `local-${(hash >>> 0).toString(16)}`;
  }

  async function setParentPin(pin){
    if(!/^\d{4,6}$/.test(String(pin || ''))) throw new Error('Il PIN deve avere da 4 a 6 cifre.');
    const current = state();
    current.parent.pinDigest = await digest(pin);
    current.parent.createdAt = new Date().toISOString();
    write(STORAGE_KEY,current);
    return true;
  }

  async function verifyParentPin(pin){
    const current = state();
    if(!current.parent.pinDigest) return false;
    return current.parent.pinDigest === await digest(pin);
  }

  function hasParentPin(){return Boolean(state().parent.pinDigest);}

  function capabilities(){
    return {
      mode:'local-beta',
      account:{enabled:false,label:'Account genitore non ancora collegato'},
      sync:{enabled:false,label:'Sincronizzazione non ancora attiva'},
      billing:{enabled:false,label:'Checkout non ancora attivo'},
      storage:{enabled:true,label:'Dati conservati in questo browser'}
    };
  }

  global.FableaBetaState = {
    STORAGE_KEY,SCHEMA_VERSION,TRIAL_DAYS,migrate,state,trialStatus,profiles,selectedProfile,
    savedStories,memory,activity,latestStory,artifact,recommendation,reconcile,summary,
    setParentPin,verifyParentPin,hasParentPin,capabilities
  };
})(window);
