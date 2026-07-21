(function(global){
  'use strict';

  const KEYS = {
    profiles: 'fableaChildProfiles',
    selected: 'fableaSelectedChildId',
    memory: 'fableaWorldState',
    saved: 'fableaSavedStories',
    prepared: 'fableaPreparedStory'
  };

  const WORLDS = ['Dinosauri','Mare','Animali','Spazio','Magia','Foresta','Regni e castelli','Misteri e scoperte'];
  const SUPPORTS = ['Calmare la sera','Accendere l’immaginazione','Aiutare con le emozioni','Stimolare curiosità','Favorire piccoli rituali'];
  const DURATIONS = ['Breve','Media','Lunga'];
  const STYLES = ['calm','adventurous','funny','mysterious','emotional'];
  const GENDERS = ['male','female','neutral','unspecified'];

  function escapeHTML(value){
    return String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function readJSON(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(_error){
      return fallback;
    }
  }

  function writeJSON(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function cleanLabel(value){
    return String(value || '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
  }

  function slug(value){
    return String(value || 'profilo')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'profilo';
  }

  function normalizeWorld(value){
    const clean = cleanLabel(value);
    const exact = WORLDS.find(world => world.toLowerCase() === clean.toLowerCase());
    if(exact) return exact;
    const partial = WORLDS.find(world => clean.toLowerCase().includes(world.toLowerCase().split(' ')[0]));
    return partial || clean || 'Magia';
  }

  function normalizeDuration(value){
    const normalized = String(value || '').toLowerCase();
    if(normalized.includes('lunga')) return 'Lunga';
    if(normalized.includes('media')) return 'Media';
    return 'Breve';
  }

  function inferStyle(profile){
    if(STYLES.includes(profile && profile.storyStyle)) return profile.storyStyle;
    const source = String((profile && (profile.support || profile.style)) || '').toLowerCase();
    if(source.includes('emoz')) return 'emotional';
    if(source.includes('curios') || source.includes('immagin')) return 'adventurous';
    if(source.includes('ritual') || source.includes('sera')) return 'calm';
    return 'calm';
  }

  function stableLegacyId(profile, index){
    if(profile && profile.id) return String(profile.id);
    const created = profile && profile.createdAt ? String(profile.createdAt).replace(/\D/g, '').slice(0, 14) : '';
    return `legacy-${slug(profile && profile.name)}-${created || index + 1}`;
  }

  function migrateProfile(profile = {}, index = 0){
    const interests = Array.isArray(profile.interests)
      ? profile.interests.map(cleanLabel).filter(Boolean)
      : [];
    const primaryWorld = normalizeWorld(profile.primaryWorld || interests[0] || profile.theme || 'Magia');

    return {
      ...profile,
      id: stableLegacyId(profile, index),
      name: String(profile.name || 'Bambino').trim() || 'Bambino',
      age: ['2-4','5-7','8-10','11-12'].includes(profile.age) ? profile.age : '5-7',
      gender: GENDERS.includes(profile.gender) ? profile.gender : 'unspecified',
      primaryWorld,
      interests: interests.filter(item => normalizeWorld(item) !== primaryWorld),
      favoriteCompanion: String(profile.favoriteCompanion || '').trim(),
      support: SUPPORTS.includes(profile.support) ? profile.support : (profile.support || SUPPORTS[0]),
      duration: normalizeDuration(profile.duration),
      storyStyle: inferStyle(profile),
      createdAt: profile.createdAt || new Date().toISOString(),
      schemaVersion: 2
    };
  }

  function getProfiles(){
    const original = readJSON(KEYS.profiles, []);
    const migrated = Array.isArray(original) ? original.map(migrateProfile) : [];
    if(JSON.stringify(original) !== JSON.stringify(migrated)) writeJSON(KEYS.profiles, migrated);
    return migrated;
  }

  function saveProfiles(profiles){
    const migrated = (Array.isArray(profiles) ? profiles : []).map(migrateProfile);
    writeJSON(KEYS.profiles, migrated);
    return migrated;
  }

  function getSelectedProfile(){
    const profiles = getProfiles();
    const selectedId = localStorage.getItem(KEYS.selected);
    return profiles.find(profile => profile.id === selectedId) || profiles[0] || null;
  }

  function setSelectedProfile(id){
    if(id) localStorage.setItem(KEYS.selected, String(id));
  }

  function saveProfile(profile){
    const profiles = getProfiles();
    const migrated = migrateProfile(profile, profiles.length);
    const index = profiles.findIndex(item => item.id === migrated.id);
    if(index >= 0) profiles[index] = migrated;
    else profiles.push(migrated);
    saveProfiles(profiles);
    setSelectedProfile(migrated.id);
    migrateMemoryForProfile(migrated);
    return migrated;
  }

  function emptyMemory(){
    return {
      treasures: [],
      rituals: [],
      history: [],
      lastStory: null,
      lastStoryId: null,
      lastScenario: null,
      lastCompanion: null,
      resume: null
    };
  }

  function mergeUnique(first, second, key){
    const list = [...(Array.isArray(first) ? first : []), ...(Array.isArray(second) ? second : [])];
    const seen = new Set();
    return list.filter(item => {
      const identity = key ? String(item && item[key]) : JSON.stringify(item);
      if(seen.has(identity)) return false;
      seen.add(identity);
      return true;
    });
  }

  function migrateMemoryForProfile(profile){
    if(!profile) return emptyMemory();
    const state = readJSON(KEYS.memory, {});
    const byId = state[profile.id] || {};
    const legacyCandidates = [profile.name, slug(profile.name), `child:${profile.name}`]
      .map(key => state[key])
      .filter(Boolean);

    if(!legacyCandidates.length && state[profile.id]) return {...emptyMemory(), ...state[profile.id]};

    const merged = legacyCandidates.reduce((memory, legacy) => ({
      ...memory,
      ...legacy,
      treasures: mergeUnique(memory.treasures, legacy.treasures),
      rituals: mergeUnique(memory.rituals, legacy.rituals, 'storyId'),
      history: mergeUnique(memory.history, legacy.history)
    }), {...emptyMemory(), ...byId});

    state[profile.id] = merged;
    [profile.name, slug(profile.name), `child:${profile.name}`].forEach(key => {
      if(key !== profile.id) delete state[key];
    });
    writeJSON(KEYS.memory, state);
    return merged;
  }

  function getMemory(profile){
    if(!profile) return emptyMemory();
    const migrated = migrateMemoryForProfile(profile);
    return {...emptyMemory(), ...migrated};
  }

  function updateMemory(profile, patch){
    if(!profile) return emptyMemory();
    const state = readJSON(KEYS.memory, {});
    const current = getMemory(profile);
    state[profile.id] = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString()
    };
    writeJSON(KEYS.memory, state);
    return state[profile.id];
  }

  function ageLabel(age){
    return ({
      '2-4':'2–4 anni',
      '5-7':'5–7 anni',
      '8-10':'8–10 anni',
      '11-12':'11–12 anni'
    }[age] || 'FABLEA');
  }

  function genderLabel(gender){
    return ({
      male: 'Maschile',
      female: 'Femminile',
      neutral: 'Forma neutra',
      unspecified: 'Non specificato'
    }[gender] || 'Non specificato');
  }

  global.FableaProfile = {
    KEYS,
    WORLDS,
    SUPPORTS,
    DURATIONS,
    STYLES,
    GENDERS,
    escapeHTML,
    readJSON,
    writeJSON,
    cleanLabel,
    normalizeWorld,
    normalizeDuration,
    getProfiles,
    saveProfiles,
    getSelectedProfile,
    setSelectedProfile,
    saveProfile,
    getMemory,
    updateMemory,
    migrateMemoryForProfile,
    ageLabel,
    genderLabel,
    migrateProfile
  };
})(window);
