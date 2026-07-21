(function(global){
  'use strict';

  const VERSION = 1;
  const TYPES = [
    {id:'bear',words:['orso','orsetto','bear'],label:'Orso'},
    {id:'fox',words:['volpe','volpina','fox'],label:'Volpe'},
    {id:'robot',words:['robot','androide'],label:'Robot'},
    {id:'dragon',words:['drago','draghetto','dragon'],label:'Drago'},
    {id:'dinosaur',words:['dinosauro','t-rex','trex','triceratopo'],label:'Dinosauro'},
    {id:'princess',words:['principessa','regina','principe','cavaliere'],label:'Esploratrice del regno'},
    {id:'fairy',words:['fata','fatina','folletto','elfo'],label:'Fata'},
    {id:'owl',words:['gufo','civetta'],label:'Gufo'},
    {id:'whale',words:['balena','delfino','orca'],label:'Creatura marina'},
    {id:'cat',words:['gatto','gattino','cat'],label:'Gatto'},
    {id:'dog',words:['cane','cagnolino','dog'],label:'Cane'},
    {id:'rabbit',words:['coniglio','lepre'],label:'Coniglio'},
    {id:'lion',words:['leone','leonessa'],label:'Leone'},
    {id:'astronaut',words:['astronauta','esploratore spaziale'],label:'Astronauta'}
  ];

  const WORLD_DEFAULTS = {
    'Dinosauri':'dinosaur','Mare':'whale','Animali':'fox','Spazio':'robot','Magia':'fairy','Foresta':'owl',
    'Regni e castelli':'princess','Misteri e scoperte':'bear','FABLEA':'bear'
  };

  const PALETTES = [
    ['#8b6047','#d6b18c','#f5e6d5','#3f2e28'],
    ['#6f7c68','#b9c3aa','#f5ead8','#303b35'],
    ['#807098','#c8b9d8','#f5eadf','#332d3d'],
    ['#a66b58','#e0a489','#fff0da','#4b302b'],
    ['#4f7280','#9fc3ca','#edf2e7','#263a42']
  ];

  function clean(value,max = 180){
    return String(value || '').replace(/\s+/g,' ').trim().slice(0,max);
  }

  function normalize(value){
    return clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  }

  function hash(value){
    let result = 2166136261;
    const source = String(value || 'fablea');
    for(let index = 0; index < source.length; index += 1){
      result ^= source.charCodeAt(index);
      result = Math.imul(result,16777619);
    }
    return result >>> 0;
  }

  function typeFrom(description,world){
    const source = normalize(description);
    const match = TYPES.find(item => item.words.some(word => source.includes(word)));
    return match ? match.id : (WORLD_DEFAULTS[world] || 'bear');
  }

  function labelFor(type,description){
    const custom = clean(description,80);
    if(custom) return custom;
    const match = TYPES.find(item => item.id === type);
    return match ? match.label : 'Compagno FABLEA';
  }

  function accessoryFrom(description){
    const source = normalize(description);
    if(source.includes('zaino')) return 'backpack';
    if(source.includes('corona')) return 'crown';
    if(source.includes('cappello')) return 'hat';
    if(source.includes('occhiali')) return 'glasses';
    if(source.includes('mantello')) return 'cape';
    return 'none';
  }

  function resolve(description,world,seed){
    const source = clean(description) || `Compagno di ${world || 'FABLEA'}`;
    const type = typeFrom(source,world);
    const paletteIndex = hash(`${seed || ''}:${source}:${world || ''}`) % PALETTES.length;
    return {
      version:VERSION,
      type,
      label:labelFor(type,description),
      description:source,
      paletteIndex,
      accessory:accessoryFrom(source)
    };
  }

  function visualFor(profile){
    if(profile && profile.companionVisual && profile.companionVisual.version === VERSION) return profile.companionVisual;
    return resolve(profile && profile.favoriteCompanion,profile && profile.primaryWorld,profile && profile.id);
  }

  function accessoryMarkup(accessory,p){
    if(accessory === 'crown') return `<path d="M38 29 46 17l9 10 10-11 9 13v8H38z" fill="#e8bd55" stroke="${p[3]}" stroke-width="2"/>`;
    if(accessory === 'hat') return `<path d="M34 33c7-18 31-18 38 0z" fill="${p[1]}" stroke="${p[3]}" stroke-width="2"/><path d="M29 34h49" stroke="${p[3]}" stroke-width="4" stroke-linecap="round"/>`;
    if(accessory === 'glasses') return `<g fill="none" stroke="${p[3]}" stroke-width="3"><circle cx="47" cy="51" r="8"/><circle cx="67" cy="51" r="8"/><path d="M55 51h4"/></g>`;
    if(accessory === 'cape') return `<path d="M35 72c-5 28-1 45 15 56l8-45z" fill="${p[1]}" opacity=".88"/>`;
    if(accessory === 'backpack') return `<rect x="25" y="78" width="22" height="35" rx="9" fill="${p[1]}" stroke="${p[3]}" stroke-width="2"/>`;
    return '';
  }

  function face(p,eyeY = 53){
    return `<circle cx="48" cy="${eyeY}" r="3.2" fill="${p[3]}"/><circle cx="68" cy="${eyeY}" r="3.2" fill="${p[3]}"/><path d="M54 ${eyeY + 11}q5 5 10 0" fill="none" stroke="${p[3]}" stroke-width="2.5" stroke-linecap="round"/>`;
  }

  function character(type,p,accessory){
    const extra = accessoryMarkup(accessory,p);
    if(type === 'robot') return `<g>${extra}<rect x="34" y="30" width="48" height="43" rx="12" fill="${p[2]}" stroke="${p[3]}" stroke-width="3"/><path d="M58 30V18m0 0 8-6" stroke="${p[3]}" stroke-width="3" stroke-linecap="round"/><circle cx="67" cy="11" r="5" fill="#e8bd55"/><circle cx="48" cy="50" r="5" fill="${p[0]}"/><circle cx="68" cy="50" r="5" fill="${p[0]}"/><path d="M49 63h18" stroke="${p[3]}" stroke-width="3" stroke-linecap="round"/><rect x="28" y="74" width="60" height="55" rx="16" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><rect x="45" y="88" width="27" height="20" rx="5" fill="${p[2]}"/><path d="M28 87 15 102m73-15 13 15M44 129l-6 16m34-16 6 16" stroke="${p[3]}" stroke-width="7" stroke-linecap="round"/></g>`;
    if(type === 'whale') return `<g>${extra}<path d="M17 86c5-34 35-54 69-42 20 7 28 24 22 43-7 22-32 33-57 25-14-4-24-13-34-26z" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><path d="M105 70c15-11 25-8 30 1-12 2-15 10-13 20-11-3-18-10-17-21z" fill="${p[1]}" stroke="${p[3]}" stroke-width="3"/><circle cx="48" cy="70" r="3.5" fill="${p[3]}"/><path d="M37 84q16 11 31 2" fill="none" stroke="${p[3]}" stroke-width="3" stroke-linecap="round"/><path d="M73 45q5-18 12-25m-12 25q-8-15-17-21" fill="none" stroke="${p[1]}" stroke-width="4" stroke-linecap="round"/></g>`;
    if(type === 'princess') return `<g>${extra}<path d="M36 53c0-25 43-31 48-3 2 11-2 24-7 31H42c-5-8-8-18-6-28z" fill="${p[0]}"/><circle cx="60" cy="55" r="22" fill="${p[2]}" stroke="${p[3]}" stroke-width="3"/>${face(p,53)}<path d="M35 137 48 78h24l15 59z" fill="${p[1]}" stroke="${p[3]}" stroke-width="3"/><path d="M48 83q12 14 24 0" fill="none" stroke="${p[2]}" stroke-width="5"/><path d="M39 105 20 121m61-16 19 16" stroke="${p[3]}" stroke-width="6" stroke-linecap="round"/></g>`;
    if(type === 'fairy') return `<g>${extra}<path d="M42 80C8 54 13 27 38 39c10 5 13 20 12 34M74 80c34-26 29-53 4-41-10 5-13 20-12 34" fill="${p[2]}" opacity=".75" stroke="${p[1]}" stroke-width="3"/><circle cx="58" cy="51" r="21" fill="${p[2]}" stroke="${p[3]}" stroke-width="3"/>${face(p,50)}<path d="m42 132 9-57h16l10 57z" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><circle cx="91" cy="34" r="6" fill="#e8bd55"/><path d="M76 79 91 34" stroke="${p[3]}" stroke-width="3"/></g>`;
    if(type === 'owl') return `<g>${extra}<path d="M30 48 44 25l14 18 15-18 14 23v58c0 22-13 35-29 35s-28-13-28-35z" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><circle cx="47" cy="61" r="13" fill="${p[2]}"/><circle cx="70" cy="61" r="13" fill="${p[2]}"/><circle cx="47" cy="61" r="4" fill="${p[3]}"/><circle cx="70" cy="61" r="4" fill="${p[3]}"/><path d="m58 69-7 7h14z" fill="#e8bd55"/><path d="M42 96q16 12 32 0" fill="none" stroke="${p[1]}" stroke-width="5"/></g>`;
    if(type === 'dragon' || type === 'dinosaur') return `<g>${extra}<path d="M29 95c0-38 27-65 62-58 24 5 30 26 18 43-8 11-18 13-30 10 5 25-7 47-28 49-17 2-31-16-22-44z" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><path d="M83 39 93 22l8 20m-31-5 4-20 11 18" fill="${p[1]}" stroke="${p[3]}" stroke-width="3"/><circle cx="88" cy="58" r="4" fill="${p[3]}"/><path d="M91 72q8 5 14-1" fill="none" stroke="${p[3]}" stroke-width="3"/><path d="M33 105C12 112 9 127 17 139c9-12 21-14 35-11" fill="${p[1]}" stroke="${p[3]}" stroke-width="3"/><path d="M46 136v14m31-20 7 15" stroke="${p[3]}" stroke-width="7" stroke-linecap="round"/>${type === 'dragon' ? `<path d="M45 72C15 54 12 78 34 91m49-8c29-18 31 7 10 17" fill="${p[2]}" opacity=".7" stroke="${p[1]}" stroke-width="3"/>` : ''}</g>`;
    if(type === 'fox') return `<g>${extra}<path d="M33 49 37 19l19 20 20-20 5 31" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><circle cx="58" cy="58" r="30" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><path d="M40 65q18 22 36 0-18 3-36 0z" fill="${p[2]}"/>${face(p,54)}<ellipse cx="58" cy="101" rx="28" ry="34" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><path d="M80 100c35 3 39 31 15 39-10 3-18-2-24-9" fill="${p[0]}" stroke="${p[3]}" stroke-width="4"/><path d="M94 134q8 0 13-8" stroke="${p[2]}" stroke-width="7" stroke-linecap="round"/></g>`;
    if(type === 'cat' || type === 'dog' || type === 'rabbit' || type === 'lion'){
      const ears = type === 'rabbit' ? `<ellipse cx="43" cy="25" rx="10" ry="25" fill="${p[1]}"/><ellipse cx="73" cy="25" rx="10" ry="25" fill="${p[1]}"/>` : type === 'cat' ? `<path d="m32 47 7-29 20 22m25 7-7-29-20 22" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/>` : `<circle cx="36" cy="43" r="15" fill="${p[1]}"/><circle cx="80" cy="43" r="15" fill="${p[1]}"/>`;
      const mane = type === 'lion' ? `<circle cx="58" cy="60" r="39" fill="${p[1]}"/>` : '';
      return `<g>${extra}${mane}${ears}<circle cx="58" cy="59" r="30" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><ellipse cx="58" cy="70" rx="16" ry="12" fill="${p[2]}"/>${face(p,55)}<ellipse cx="58" cy="110" rx="27" ry="34" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><path d="M39 139v10m38-10v10" stroke="${p[3]}" stroke-width="7" stroke-linecap="round"/></g>`;
    }
    if(type === 'astronaut') return `<g>${extra}<circle cx="58" cy="51" r="29" fill="${p[2]}" stroke="${p[3]}" stroke-width="4"/><circle cx="58" cy="52" r="20" fill="#cde4e6" opacity=".85"/>${face(p,51)}<rect x="31" y="78" width="54" height="57" rx="17" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><rect x="45" y="89" width="26" height="17" rx="5" fill="${p[2]}"/><path d="M31 91 16 111m69-20 15 20M45 135l-4 14m30-14 4 14" stroke="${p[3]}" stroke-width="7" stroke-linecap="round"/></g>`;
    return `<g>${extra}<circle cx="36" cy="43" r="14" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><circle cx="80" cy="43" r="14" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><circle cx="58" cy="60" r="31" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><ellipse cx="58" cy="72" rx="17" ry="13" fill="${p[2]}"/><circle cx="58" cy="67" r="4" fill="${p[3]}"/>${face(p,55)}<ellipse cx="58" cy="111" rx="29" ry="35" fill="${p[0]}" stroke="${p[3]}" stroke-width="3"/><path d="M39 140v9m38-9v9" stroke="${p[3]}" stroke-width="7" stroke-linecap="round"/></g>`;
  }

  function render(profile,options = {}){
    const visual = options.visual || visualFor(profile);
    const p = PALETTES[visual.paletteIndex % PALETTES.length];
    const label = clean(options.label || visual.label || 'Compagno FABLEA',100);
    const className = clean(options.className || '',80);
    return `<svg class="fablea-companion-svg ${className}" viewBox="0 0 120 160" role="img" aria-label="${global.FableaProfile ? global.FableaProfile.escapeHTML(label) : label}"><ellipse cx="59" cy="150" rx="39" ry="7" fill="rgba(29,35,32,.16)"/>${character(visual.type,p,visual.accessory)}</svg>`;
  }

  function mount(target,profile,options = {}){
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if(!element) return null;
    const visual = options.visual || visualFor(profile);
    element.innerHTML = render(profile,{...options,visual});
    element.dataset.companionType = visual.type;
    return visual;
  }

  function ensureProfile(profile){
    if(!profile) return null;
    const visual = visualFor(profile);
    if(profile.companionVisual && profile.companionVisual.version === VERSION) return profile;
    const next = {...profile,companionVisual:visual,schemaVersion:Math.max(3,Number(profile.schemaVersion) || 0)};
    if(global.FableaProfile && typeof global.FableaProfile.saveProfile === 'function') return global.FableaProfile.saveProfile(next);
    return next;
  }

  global.FableaCompanion = {VERSION,TYPES,WORLD_DEFAULTS,resolve,visualFor,render,mount,ensureProfile};
})(window);
