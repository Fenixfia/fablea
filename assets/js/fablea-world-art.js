(function(global){
  'use strict';

  const PALETTES = {
    Dinosauri:['#d9c58f','#6e9678','#354f45','#f7ead0'],
    Mare:['#b7dce0','#5f9ba8','#31596d','#f9f0d4'],
    Animali:['#e7c89b','#b27d60','#596d55','#fff4df'],
    Spazio:['#c9bddb','#6c638f','#292b4c','#f2d889'],
    Magia:['#d7bfdc','#9f79aa','#4d3d63','#f5d98e'],
    Foresta:['#c5d0a8','#668461','#344c42','#f2dfac'],
    'Regni e castelli':['#ddc8b0','#9b6b72','#4b415d','#f1cd73'],
    'Misteri e scoperte':['#c7c0ac','#727b75','#373d45','#e7b76f']
  };

  const safe = value => String(value || '').replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const slug = value => String(value || 'mondo').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function motif(world){
    switch(world){
      case 'Dinosauri': return '<path d="M55 147c29-55 70-79 121-52 15 8 25 24 20 39-7 21-42 25-73 13-15 19-36 27-61 25"/><path d="M170 102c21-30 50-29 56-11 5 18-14 31-45 33"/><path class="detail" d="M94 105l10-18 12 17 14-19 12 21"/><circle class="spot" cx="112" cy="130" r="7"/><circle class="spot" cx="145" cy="142" r="5"/>';
      case 'Mare': return '<path d="M34 146c24-18 49-18 74 0 25 18 50 18 75 0 25-18 50-18 75 0"/><path d="M54 121c25-24 48-32 70-24 23 8 38 32 64 26 15-4 25-14 31-29-4 27-20 50-51 58-39 9-66-17-114-31Z"/><path class="detail" d="M162 109c10-12 24-13 33-3M84 119c8 10 19 14 33 12"/>';
      case 'Animali': return '<path d="M71 145c-8-35 8-65 38-74 31-9 62 9 67 40 5 30-18 54-55 54-20 0-37-7-50-20Z"/><path d="M91 83 76 52l34 21m44 5 23-27 1 39"/><circle class="eye" cx="112" cy="111" r="4"/><circle class="eye" cx="148" cy="108" r="4"/><path class="detail" d="M123 128c8 7 16 7 24 0"/>';
      case 'Spazio': return '<circle cx="140" cy="112" r="53"/><path class="detail" d="M73 134c32 20 97 23 139-8 13-10 17-20 12-28-8-13-37-8-59 3"/><circle class="spot" cx="119" cy="96" r="9"/><circle class="spot" cx="159" cy="128" r="12"/><path class="star" d="m76 62 5 12 13 2-10 8 3 13-11-7-12 7 4-13-10-8 13-2Z"/>';
      case 'Foresta': return '<path d="M71 163 96 91l24 72m18 0 29-91 30 91"/><path d="M73 106c-21-16-8-42 14-37 0-25 38-27 42-2 27-9 38 28 15 42m4-18c-16-24 18-46 34-26 18-21 47 5 31 26 25 12 9 43-15 35"/><path class="detail" d="M38 164h200"/>';
      case 'Regni e castelli': return '<path d="M66 165V91l24 13V79l28 14 27-18 28 18 28-14v86Z"/><path class="detail" d="M89 164v-27h22v27m43 0v-40h27v40M66 91h135"/><path class="star" d="m145 51 7 14 15 2-11 11 3 15-14-7-14 7 3-15-11-11 15-2Z"/>';
      case 'Misteri e scoperte': return '<circle cx="126" cy="111" r="52"/><path class="detail" d="m162 148 45 44M126 78v33l25 18M96 111h60"/><path d="M68 164c13-25 33-39 58-42 29-4 51 7 68 34"/><circle class="spot" cx="126" cy="111" r="8"/>';
      default: return '<path d="M68 164V96l72-45 72 45v68Z"/><path class="detail" d="M113 164v-45h54v45M88 104h104"/><path class="star" d="m140 72 7 14 16 2-12 11 3 15-14-7-14 7 3-15-12-11 16-2Z"/>';
    }
  }

  function render(world,options = {}){
    const resolved = PALETTES[world] ? world : 'Magia';
    const palette = PALETTES[resolved];
    const label = options.label || resolved;
    return `<svg class="fablea-world-art world-${slug(resolved)}" viewBox="0 0 280 210" role="img" aria-label="${safe(label)}">
      <defs><linearGradient id="sky-${slug(resolved)}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette[0]}"/><stop offset="1" stop-color="${palette[1]}"/></linearGradient></defs>
      <rect width="280" height="210" rx="34" fill="url(#sky-${slug(resolved)})"/>
      <circle cx="226" cy="45" r="24" fill="${palette[3]}" opacity=".78"/>
      <path d="M0 166c49-29 89-31 124-6 42-27 94-24 156 9v41H0Z" fill="${palette[2]}" opacity=".36"/>
      <g fill="${palette[3]}" stroke="${palette[2]}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${motif(resolved)}</g>
      <style>.detail{fill:none;stroke:${palette[2]};stroke-width:5}.spot{fill:${palette[1]};stroke:none}.eye{fill:${palette[2]};stroke:none}.star{fill:${palette[3]};stroke:${palette[2]};stroke-width:3}</style>
    </svg>`;
  }

  global.FableaWorldArt = {render,palettes:{...PALETTES}};
})(window);