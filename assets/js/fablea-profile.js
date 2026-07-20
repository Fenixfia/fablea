(function(global){
  const KEYS = {profiles:'fableaChildProfiles', selected:'fableaSelectedChildId', memory:'fableaWorldState', saved:'fableaSavedStories'};
  const WORLDS = ['Dinosauri','Mare','Animali','Spazio','Magia','Foresta','Regni e castelli','Misteri e scoperte'];
  const SUPPORTS = ['Calmare la sera','Accendere l’immaginazione','Aiutare con le emozioni','Stimolare curiosità','Favorire piccoli rituali'];
  const DURATIONS = ['Breve','Media','Lunga'];
  const STYLES = ['calm','adventurous','funny','mysterious','emotional'];
  const GENDERS = ['male','female','neutral','unspecified'];
  function escapeHTML(value){ return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function readJSON(key, fallback){ try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch(_){ return fallback; } }
  function writeJSON(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  function cleanLabel(value){ return String(value || '').replace(/^[^\p{L}\p{N}]+/u,'').trim(); }
  function normalizeWorld(value){ const clean = cleanLabel(value); return WORLDS.find(w => w.toLowerCase() === clean.toLowerCase()) || WORLDS.find(w => clean.toLowerCase().includes(w.toLowerCase().split(' ')[0])) || clean || 'Magia'; }
  function normalizeDuration(value){ const s = String(value || '').toLowerCase(); if(s.includes('lunga')) return 'Lunga'; if(s.includes('media')) return 'Media'; return 'Breve'; }
  function inferStyle(profile){ const s = String(profile.storyStyle || profile.support || '').toLowerCase(); if(STYLES.includes(profile.storyStyle)) return profile.storyStyle; if(s.includes('emoz')) return 'emotional'; if(s.includes('curios') || s.includes('immagin')) return 'adventurous'; return 'calm'; }
  function migrateProfile(p){ const interests = Array.isArray(p.interests) ? p.interests.map(cleanLabel).filter(Boolean) : []; const primaryWorld = p.primaryWorld ? normalizeWorld(p.primaryWorld) : normalizeWorld(interests[0] || p.theme || 'Magia'); return {...p, id:String(p.id || Date.now()), name:String(p.name || 'Bambino').trim(), age:p.age || '5-7', gender:GENDERS.includes(p.gender) ? p.gender : 'unspecified', primaryWorld, interests, favoriteCompanion:p.favoriteCompanion || '', support:p.support || SUPPORTS[0], duration:normalizeDuration(p.duration), storyStyle:inferStyle(p), createdAt:p.createdAt || new Date().toISOString(), schemaVersion:2}; }
  function getProfiles(){ const migrated = readJSON(KEYS.profiles, []).map(migrateProfile); writeJSON(KEYS.profiles, migrated); return migrated; }
  function saveProfiles(profiles){ writeJSON(KEYS.profiles, profiles.map(migrateProfile)); }
  function getSelectedProfile(){ const profiles = getProfiles(); const id = localStorage.getItem(KEYS.selected); return profiles.find(p => p.id === id) || profiles[0] || null; }
  function setSelectedProfile(id){ localStorage.setItem(KEYS.selected, String(id)); }
  function saveProfile(profile){ const profiles = getProfiles(); const v2 = migrateProfile(profile); const index = profiles.findIndex(p => p.id === v2.id); if(index >= 0) profiles[index] = v2; else profiles.push(v2); saveProfiles(profiles); setSelectedProfile(v2.id); return v2; }
  function childMemoryKey(profile){ return profile && profile.id ? profile.id : (profile && profile.name) || 'unknown'; }
  function getMemory(profile){ const state = readJSON(KEYS.memory, {}); return state[childMemoryKey(profile)] || {treasures:[], rituals:[], history:[], lastStory:null, lastScenario:null}; }
  function updateMemory(profile, patch){ const state = readJSON(KEYS.memory, {}); const key = childMemoryKey(profile); state[key] = {...getMemory(profile), ...patch, updatedAt:new Date().toISOString()}; writeJSON(KEYS.memory, state); return state[key]; }
  function ageLabel(a){ return ({'2-4':'2–4 anni','5-7':'5–7 anni','8-10':'8–10 anni','11-12':'11–12 anni'}[a] || 'FABLEA'); }
  global.FableaProfile = {KEYS,WORLDS,SUPPORTS,DURATIONS,STYLES,GENDERS,escapeHTML,cleanLabel,normalizeWorld,normalizeDuration,getProfiles,saveProfiles,getSelectedProfile,setSelectedProfile,saveProfile,getMemory,updateMemory,ageLabel,migrateProfile};
})(window);
