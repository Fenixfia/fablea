(function(global){
  'use strict';

  const F = global.FableaProfile;
  const S = global.FableaShell;
  const V3 = global.FableaStoryVariablesV3;
  const root = document.getElementById('guidedCreator');
  const dock = document.getElementById('dock');
  const progressBar = document.getElementById('creatorProgressBar');
  const progressLabel = document.getElementById('creatorProgressLabel');
  const companionIcon = document.getElementById('creatorCompanionIcon');
  const companionLine = document.getElementById('creatorCompanionLine');
  const companionHint = document.getElementById('creatorCompanionHint');

  if(!root || !F) return;

  const profile = F.getSelectedProfile();
  const preset = F.readJSON('fableaStoryData',{});
  const WORLD_META = {
    'Dinosauri':{icon:'🦕',companion:'il piccolo esploratore',short:'Felci giganti e impronte antiche'},
    'Mare':{icon:'🐚',companion:'la custode delle conchiglie',short:'Isole, fondali e correnti luminose'},
    'Animali':{icon:'🦊',companion:'la volpe curiosa',short:'Tane, sentieri e amicizie selvatiche'},
    'Spazio':{icon:'🤖',companion:'il robot delle stelle',short:'Pianeti, astronavi e costellazioni'},
    'Magia':{icon:'🧚',companion:'la fata delle piccole luci',short:'Incantesimi, portali e meraviglie'},
    'Foresta':{icon:'🦉',companion:'il guardiano del bosco',short:'Alberi antichi e sentieri nascosti'},
    'Regni e castelli':{icon:'👑',companion:'la principessa esploratrice',short:'Torri, ponti e regni da scoprire'},
    'Misteri e scoperte':{icon:'🔎',companion:'l’investigatore gentile',short:'Indizi, mappe e domande sorprendenti'}
  };
  const MODE_META = {
    moment:{label:'Da questo momento',icon:'☀️',detail:'Partiamo da come si sente e da ciò che è successo oggi.'},
    world:{label:'Dal mio mondo',icon:'🗺️',detail:'Apriamo una nuova avventura nel suo universo personale.'},
    idea:{label:'Da una mia idea',icon:'💡',detail:'Una frase del bambino diventa l’inizio della storia.'},
    continue:{label:'Continua l’ultima avventura',icon:'↗',detail:'Riprendiamo un luogo, un personaggio o un mistero già incontrato.'},
    bedtime:{label:'Buonanotte',icon:'🌙',detail:'Una storia più morbida per accompagnare la sera.'},
    family:{label:'In famiglia',icon:'🏡',detail:'Una storia da vivere insieme alle persone presenti.'},
    prepare:{label:'Prepariamoci',icon:'🧭',detail:'Rendiamo più familiare qualcosa che sta per accadere.'},
    discovery:{label:'Scoperta',icon:'🔭',detail:'Partiamo da una domanda e lasciamo spazio alla curiosità.'},
    cocreate:{label:'Crea insieme',icon:'✨',detail:'FABLEA offrirà poche scelte significative durante l’avventura.'}
  };
  const state = {
    mode:null,
    index:0,
    route:[],
    moreModesOpen:false,
    answers:{
      scenario:preset.scenario || (profile && profile.primaryWorld) || 'FABLEA',
      duration:preset.duration || (profile && profile.duration) || 'Media',
      mood:preset.mood || ''
    }
  };

  const escape = value => F.escapeHTML(value == null ? '' : value);
  const option = (value,label,detail = '',icon = '') => ({value,label,detail,icon});
  const selectedWorld = () => state.answers.scenario || (profile && profile.primaryWorld) || 'FABLEA';

  function recentStories(){
    if(!profile) return [];
    const stories = S && typeof S.savedFor === 'function'
      ? S.savedFor(profile)
      : F.readJSON(F.KEYS.saved,[]).filter(story => story.childId === profile.id || story.profileId === profile.id);
    return [...stories]
      .filter(story => story && story.id)
      .sort((a,b) => String(b.savedAt || b.updatedAt || '').localeCompare(String(a.savedAt || a.updatedAt || '')))
      .slice(0,4);
  }

  function applyWorld(world){
    const next = WORLD_META[world] ? world : (profile && profile.primaryWorld) || 'FABLEA';
    document.body.dataset.world = next;
    if(companionIcon) companionIcon.textContent = (WORLD_META[next] || {icon:'✨'}).icon;
  }

  function setStage(title,hint){
    const meta = WORLD_META[selectedWorld()] || {companion:'il compagno FABLEA'};
    applyWorld(selectedWorld());
    if(companionLine) companionLine.textContent = title || 'Da dove cominciamo?';
    if(companionHint) companionHint.textContent = hint || `${profile && profile.favoriteCompanion ? profile.favoriteCompanion : meta.companion} è pronto ad accompagnare la storia.`;
  }

  function updateProgress(){
    if(!progressBar || !progressLabel) return;
    if(!state.mode){
      progressBar.style.width = '0%';
      progressLabel.textContent = 'Inizio';
      return;
    }
    if(state.index >= state.route.length){
      progressBar.style.width = '100%';
      progressLabel.textContent = 'Pronta';
      return;
    }
    progressBar.style.width = `${Math.round(((state.index + 1) / state.route.length) * 100)}%`;
    progressLabel.textContent = `${state.index + 1} di ${state.route.length}`;
  }

  const durationStep = {
    id:'duration',title:'Quanto tempo abbiamo?',help:'La durata cambia davvero il numero di scene e il ritmo della storia.',type:'duration',required:true,
    options:() => [
      option('Breve','Breve','Un piccolo viaggio essenziale','•'),
      option('Media','Media','Più scene e un arco completo','••'),
      option('Lunga','Lunga','Un’avventura più ricca da esplorare','•••')
    ]
  };

  const worldStep = () => ({
    id:'scenario',title:'Dove entriamo?',help:'Il mondo di casa resta sempre disponibile, ma oggi possiamo aprire anche un’altra porta.',type:'world',required:true,
    options:() => F.WORLDS.map(world => option(world,world,WORLD_META[world].short,WORLD_META[world].icon))
  });

  function routeFor(mode){
    const routes = {
      moment:[
        {id:'mood',title:'Com’è questo momento?',help:'Basta la parola che gli somiglia di più.',type:'choice',required:true,options:() => [
          option('Curiosità e voglia di scoprire','Curioso','Ha voglia di capire e provare','🔎'),
          option('Momento tranquillo','Tranquillo','Un ritmo morbido e sereno','🍃'),
          option('Tanta energia','Pieno di energia','Movimento, gioco e sorpresa','⚡'),
          option('Una giornata difficile','Giornata difficile','Accogliamo ciò che è successo con delicatezza','☁️'),
          option('Un po’ di rabbia','Un po’ arrabbiato','Una storia che dia spazio e respiro','🔥'),
          option('Una piccola paura','Una piccola paura','Coraggio senza forzature','🕯️')
        ]},
        {id:'realLifeEvent',title:'C’è qualcosa di oggi che vuoi portare nella storia?',help:'È facoltativo. Può bastare una frase semplice, senza dettagli privati non necessari.',type:'textarea',required:false,placeholder:'Per esempio: oggi ha iniziato una cosa nuova…'},
        {id:'energy',title:'Che ritmo gli somiglia adesso?',help:'FABLEA doserà movimento, dialoghi e pause.',type:'choice',required:true,options:() => [
          option('low','Calmo','Più ascolto e immagini morbide','🌙'),
          option('balanced','Equilibrato','Avventura e pause nella giusta misura','⚖️'),
          option('high','Dinamico','Più azione e cambi di scena','🚀')
        ]},
        durationStep
      ],
      world:[
        worldStep(),
        {id:'storyFlavor',title:'Che tipo di avventura nasce qui?',help:'Questa scelta cambia la svolta centrale e il finale.',type:'choice',required:true,options:() => [
          option('adventure','Una missione','Qualcosa da raggiungere o proteggere','🧭'),
          option('mystery','Un mistero','Indizi e domande aprono un filo nuovo','🔐'),
          option('funny','Qualcosa di buffo','Imprevisti leggeri e ritmo giocoso','😄'),
          option('discovery','Una scoperta','Osservare, sperimentare e capire','🔭')
        ]},
        {id:'worldWish',title:'C’è un elemento che non deve mancare?',help:'Facoltativo: un luogo, un oggetto, un animale o una piccola sfida.',type:'textarea',required:false,placeholder:'Per esempio: una porta minuscola nascosta in un albero…'},
        durationStep
      ],
      idea:[
        {id:'idea',title:'Qual è la sua idea?',help:'Può essere imperfetta, strana o brevissima. È proprio da lì che parte FABLEA.',type:'textarea',required:true,minLength:3,placeholder:'Per esempio: un dinosauro trova una stella caduta…'},
        worldStep(),
        {id:'tone',title:'Come deve farlo sentire?',help:'Il tono non cambia l’idea: cambia il modo in cui la vivremo.',type:'choice',required:true,options:() => [
          option('wonder','Meravigliato','Immagini ampie e senso di scoperta','✨'),
          option('funny','Divertito','Dialoghi e imprevisti più giocosi','😄'),
          option('mysterious','Incuriosito','Un piccolo enigma da seguire','🔎'),
          option('warm','Rassicurato','Relazioni e atmosfera più calde','🤍')
        ]},
        durationStep
      ],
      continue:[
        {id:'continueStoryId',title:'Quale avventura riprendiamo?',help:'Useremo personaggi, luoghi e fili ancora aperti.',type:'stories',required:true,options:() => recentStories().map(story => option(story.id,story.title || 'Storia salvata',story.subtitle || story.world || 'Avventura FABLEA','📖'))},
        {id:'continuationDirection',title:'Da dove ripartiamo?',help:'Non riscriviamo il finale: scegliamo il nuovo passo.',type:'choice',required:true,options:() => [
          option('new-thread','Apre un nuovo mistero','Lascia una traccia per il futuro','🗝️'),
          option('return-friend','Ritrova un personaggio','Un incontro importante torna a cambiare le cose','👋'),
          option('solve-thread','Risolve un filo aperto','Un indizio trova finalmente il suo posto','🧩')
        ]},
        durationStep
      ],
      bedtime:[
        {id:'bedtimeMood',title:'Come arriva alla sera?',help:'La storia resterà morbida e senza tensione forte.',type:'choice',required:true,options:() => [
          option('Sereno ma ancora sveglio','Sereno','Rallentiamo poco alla volta','🌜'),
          option('Stanco e pieno di pensieri','Pieno di pensieri','Lasciamo che la storia faccia spazio','☁️'),
          option('Ha bisogno di vicinanza','Cerca vicinanza','Una storia calda e rassicurante','🤍')
        ]},
        {id:'readingMode',title:'Come la viviamo stasera?',help:'La modalità guida dialoghi, pause e ascolto.',type:'choice',required:true,options:() => [
          option('shared','La leggiamo insieme','Pensata per la voce di un adulto','👨‍👩‍👧'),
          option('audio','La ascoltiamo','Ritmo fluido per la voce narrante','🎧'),
          option('independent','La legge lui o lei','Frasi autonome e scansione chiara','📚')
        ]},
        durationStep
      ],
      family:[
        {id:'presentWith',title:'Chi è qui con noi?',help:'Puoi scegliere più persone.',type:'multi',required:true,options:() => [
          option('Mamma','Mamma'),option('Papà','Papà'),option('Fratelli o sorelle','Fratelli o sorelle'),option('Nonni','Nonni'),option('Tutta la famiglia','Tutta la famiglia')
        ]},
        {id:'familyMoment',title:'C’è un momento di famiglia da trasformare?',help:'Facoltativo: una cena, un viaggio o una piccola tradizione.',type:'textarea',required:false,placeholder:'Per esempio: stiamo preparando un viaggio insieme…'},
        durationStep
      ],
      prepare:[
        {id:'preparationTarget',title:'A che cosa ci prepariamo?',help:'Usiamo parole concrete e rassicuranti, senza diagnosi o promesse.',type:'textarea',required:true,minLength:3,placeholder:'Per esempio: il primo giorno in una nuova scuola…'},
        {id:'mood',title:'Che emozione c’è intorno a questo momento?',help:'La storia non cancellerà l’emozione: aiuterà a conoscerla.',type:'choice',required:true,options:() => [
          option('Curiosità con un po’ di incertezza','Curiosità e incertezza','','🧭'),
          option('Una piccola paura','Una piccola paura','','🕯️'),
          option('Tanta eccitazione','Tanta eccitazione','','🎈'),
          option('Non sappiamo ancora','Non lo sappiamo ancora','','…')
        ]},
        durationStep
      ],
      discovery:[
        {id:'discoveryTopic',title:'Da quale domanda partiamo?',help:'Può essere una curiosità vera o una domanda fantastica.',type:'textarea',required:false,placeholder:'Per esempio: come fanno gli uccelli a sapere dove andare?'},
        worldStep(),
        {id:'location',title:'Dove ascoltiamo questa storia?',help:'Il contesto cambia il ritmo e può suggerire una piccola attività finale.',type:'choice',required:true,options:() => [
          option('home','A casa','','🏠'),option('outside','Fuori','','🌳'),option('car','In viaggio','','🚗'),option('waiting','Mentre aspettiamo','','⏳')
        ]},
        durationStep
      ],
      cocreate:[
        {id:'idea',title:'Quale scintilla usiamo?',help:'Puoi lasciare il campo vuoto e far proporre l’inizio a FABLEA.',type:'textarea',required:false,placeholder:'Per esempio: una mappa che cambia ogni volta che la guardi…'},
        worldStep(),
        {id:'coCreateChoices',title:'Quante volte scegliamo insieme?',help:'Le scelte saranno poche e significative.',type:'choice',required:true,options:() => [
          option('2','Due scelte','Un bivio e una decisione finale','2'),
          option('3','Tre scelte','Più partecipazione durante l’avventura','3')
        ]},
        durationStep
      ]
    };
    return routes[mode] || routes.world;
  }

  function entryMarkup(){
    const hasContinuation = recentStories().length > 0;
    return `<div class="creator-panel-inner">
      <div class="creator-eyebrow">${escape(profile.name)} · ${escape(F.ageLabel(profile.age))}</div>
      <h1 class="creator-title">Da dove nasce la storia di oggi?</h1>
      <p class="creator-intro">FABLEA conosce già il suo mondo. Scegliamo soltanto la porta giusta e poi faremo una domanda alla volta.</p>
      ${hasContinuation ? `<button class="creator-secondary-mode" type="button" data-mode="continue" style="width:100%;margin-bottom:14px"><strong>${MODE_META.continue.icon} ${MODE_META.continue.label}</strong><span>${MODE_META.continue.detail}</span></button>` : ''}
      <div class="creator-door-grid">${['moment','world','idea'].map(mode => `<button class="creator-door" type="button" data-mode="${mode}"><span class="creator-door-icon" aria-hidden="true">${MODE_META[mode].icon}</span><strong>${MODE_META[mode].label}</strong><span>${MODE_META[mode].detail}</span></button>`).join('')}</div>
      <div class="creator-secondary-block">
        <button class="creator-back" id="toggleMoreModes" type="button" aria-expanded="${state.moreModesOpen}">${state.moreModesOpen ? 'Nascondi gli altri modi' : 'Altri modi di iniziare'}</button>
        <div id="moreModes" ${state.moreModesOpen ? '' : 'hidden'}>
          <div class="creator-secondary-heading">Per momenti particolari</div>
          <div class="creator-secondary-grid">${['bedtime','family','prepare','discovery','cocreate'].map(mode => `<button class="creator-secondary-mode" type="button" data-mode="${mode}"><strong>${MODE_META[mode].icon} ${MODE_META[mode].label}</strong><span>${MODE_META[mode].detail}</span></button>`).join('')}</div>
        </div>
      </div>
    </div>`;
  }

  function optionMarkup(step,item,current){
    const selected = step.type === 'multi' ? Array.isArray(current) && current.includes(item.value) : String(current || '') === String(item.value);
    const className = step.type === 'world' ? 'creator-world-choice' : step.type === 'duration' ? 'creator-duration-choice' : 'creator-choice';
    return `<button class="${className}" type="button" data-answer="${escape(item.value)}" aria-pressed="${selected}">
      ${step.type === 'world' ? `<span class="creator-world-icon" aria-hidden="true">${item.icon}</span>` : item.icon ? `<span aria-hidden="true">${item.icon} </span>` : ''}${escape(item.label)}${item.detail ? `<small>${escape(item.detail)}</small>` : ''}
    </button>`;
  }

  function stepMarkup(step){
    const current = state.answers[step.id];
    let control;
    if(['choice','world','duration','multi','stories'].includes(step.type)){
      const options = step.options();
      const grid = step.type === 'world' ? 'creator-world-grid' : step.type === 'duration' ? 'creator-duration-grid' : 'creator-choice-grid';
      control = `<div class="${grid}" role="${step.type === 'multi' ? 'group' : 'radiogroup'}">${options.map(item => optionMarkup(step,item,current)).join('')}</div>`;
    }else{
      control = `<div class="creator-field"><label for="creatorTextAnswer">La tua frase</label><textarea id="creatorTextAnswer" maxlength="320" placeholder="${escape(step.placeholder || '')}">${escape(current || '')}</textarea><p class="creator-hint">Massimo 320 caratteri. Inserisci soltanto ciò che serve alla storia.</p></div>`;
    }
    return `<div class="creator-panel-inner">
      <div class="creator-question-head"><div class="creator-question-count">${escape(MODE_META[state.mode].label)} · passaggio ${state.index + 1}</div><h1>${escape(step.title)}</h1><p>${escape(step.help)}</p></div>
      ${control}<p class="creator-error" id="creatorError" hidden></p>
      <div class="creator-nav"><button class="creator-back" id="creatorBack" type="button">← Indietro</button><button class="creator-next" id="creatorNext" type="button">Continua →</button></div>
    </div>`;
  }

  function labelFor(id,value){
    const step = state.route.find(item => item.id === id);
    const options = step && step.options ? step.options() : [];
    if(Array.isArray(value)) return value.map(item => (options.find(candidate => String(candidate.value) === String(item)) || {label:item}).label).join(', ');
    return (options.find(item => String(item.value) === String(value)) || {label:value}).label || '';
  }

  function summaryRows(){
    const rows = [
      {icon:MODE_META[state.mode].icon,label:'Punto di partenza',value:MODE_META[state.mode].label},
      {icon:(WORLD_META[selectedWorld()] || {icon:'✨'}).icon,label:'Mondo',value:selectedWorld()},
      {icon:'⏱',label:'Durata',value:state.answers.duration || profile.duration}
    ];
    [
      ['mood','Momento','☀️'],['realLifeEvent','Da oggi','•'],['idea','Idea','💡'],['storyFlavor','Tipo di avventura','🧭'],['worldWish','Elemento speciale','✨'],
      ['continueStoryId','Storia da continuare','📖'],['continuationDirection','Nuovo passo','↗'],['bedtimeMood','La sera','🌙'],['readingMode','Modalità','🎧'],
      ['presentWith','Presenti','🏡'],['familyMoment','Momento di famiglia','🤍'],['preparationTarget','Ci prepariamo a','🧭'],['discoveryTopic','Domanda','🔭'],
      ['location','Luogo','📍'],['coCreateChoices','Scelte','✨'],['tone','Tono','🎨'],['energy','Ritmo','⚡']
    ].forEach(([id,label,icon]) => {
      const value = state.answers[id];
      if(value == null || value === '' || (Array.isArray(value) && !value.length)) return;
      rows.push({icon,label,value:labelFor(id,value)});
    });
    return rows.slice(0,7);
  }

  function summaryMarkup(){
    return `<div class="creator-panel-inner">
      <div class="creator-question-head"><div class="creator-question-count">La storia che sta per nascere</div><h1>Ci siamo.</h1><p>FABLEA userà queste scelte insieme al mondo, alla memoria e al ritmo abituale del profilo.</p></div>
      <div class="creator-summary">${summaryRows().map(row => `<div class="creator-summary-card"><div class="creator-summary-icon" aria-hidden="true">${row.icon}</div><div><span>${escape(row.label)}</span><strong>${escape(row.value)}</strong></div></div>`).join('')}</div>
      <p class="creator-save-note">La richiesta viene salvata sul dispositivo e usata per costruire la storia. Non viene inserita nei log applicativi.</p>
      <p class="creator-error" id="creatorError" hidden></p>
      <div class="creator-nav"><button class="creator-back" id="creatorBack" type="button">← Modifica</button><button class="creator-open" id="creatorOpen" type="button">Apri la storia</button></div>
    </div>`;
  }

  function showError(message){
    const error = document.getElementById('creatorError');
    if(error){error.textContent = message;error.hidden = false;}
  }

  function collectText(){
    const step = state.route[state.index];
    const field = document.getElementById('creatorTextAnswer');
    if(step && field) state.answers[step.id] = field.value.replace(/\s+/g,' ').trim().slice(0,320);
  }

  function validStep(step){
    if(!step.required) return true;
    const value = state.answers[step.id];
    if(Array.isArray(value)) return value.length > 0;
    return String(value || '').trim().length >= (step.minLength || 1);
  }

  function goNext(){
    const step = state.route[state.index];
    collectText();
    if(!validStep(step)){
      showError(step.type === 'textarea' ? 'Scrivi almeno una breve idea per continuare.' : 'Scegli una risposta per continuare.');
      return;
    }
    state.index += 1;
    render();
  }

  function goBack(){
    if(state.index > 0) state.index -= 1;
    else {state.mode = null;state.route = [];state.index = 0;}
    render();
  }

  function requestInput(){
    const flavor = {
      adventure:{family:'avventura',tone:'wonder',pace:'dynamic',solution:'courage',ending:'open-thread'},
      mystery:{family:'avventura',tone:'mysterious',pace:'balanced',suspense:'medium',solution:'observation',ending:'open-thread'},
      funny:{family:'avventura',tone:'funny',pace:'dynamic',suspense:'low',solution:'creativity',ending:'closed'},
      discovery:{family:'scoperta',tone:'curious',pace:'balanced',suspense:'low',solution:'experimentation',ending:'question'}
    }[state.answers.storyFlavor] || {};
    const continuation = {
      'new-thread':{idea:'Si apre un nuovo mistero collegato alla storia precedente.',ending:'open-thread',solution:'observation'},
      'return-friend':{idea:'Ritorna un personaggio importante della storia precedente.',ending:'closed',solution:'cooperation'},
      'solve-thread':{idea:'Un indizio della storia precedente trova finalmente una soluzione.',ending:'closed',solution:'experimentation'}
    }[state.answers.continuationDirection] || {};
    const idea = [state.answers.idea,state.answers.worldWish,state.answers.discoveryTopic,continuation.idea].filter(Boolean).join(' ');
    return {
      mode:state.mode,
      family:flavor.family,
      mood:state.answers.mood || state.answers.bedtimeMood || preset.mood || '',
      energy:state.answers.energy,
      duration:state.answers.duration || profile.duration,
      readingMode:state.answers.readingMode,
      location:state.answers.location,
      presentWith:state.answers.presentWith,
      scenario:selectedWorld(),
      idea,
      realLifeEvent:state.answers.realLifeEvent || state.answers.familyMoment || '',
      preparationTarget:state.answers.preparationTarget || '',
      continueStoryId:state.answers.continueStoryId || '',
      tone:state.answers.tone || flavor.tone,
      pace:flavor.pace,
      suspense:flavor.suspense,
      solution:continuation.solution || flavor.solution,
      ending:continuation.ending || flavor.ending,
      coCreateChoices:Number(state.answers.coCreateChoices) || undefined,
      ritualRequested:state.mode === 'bedtime' || state.mode === 'moment',
      activityRequested:state.mode === 'family' || state.mode === 'discovery',
      source:'guided-creator-v1'
    };
  }

  function openStory(){
    const button = document.getElementById('creatorOpen');
    if(button){button.disabled = true;button.textContent = 'Sto aprendo il mondo…';}
    try{
      const input = requestInput();
      let request;
      if(V3){
        const requestV3 = V3.buildAndSave(profile,input);
        request = V3.toLegacy(requestV3);
      }else{
        const fallbackFamily = state.mode === 'bedtime' ? 'calma-sera' : state.mode === 'discovery' ? 'scoperta' : state.mode === 'moment' || state.mode === 'family' || state.mode === 'prepare' ? 'emozioni' : 'avventura';
        request = {profileId:profile.id,family:input.family || fallbackFamily,mood:input.mood || 'Curiosità e voglia di scoprire',duration:input.duration,scenario:input.scenario,firstStory:false};
      }
      localStorage.removeItem(F.KEYS.prepared);
      localStorage.setItem('fableaStoryData',JSON.stringify(request));
      localStorage.removeItem('fableaReopenStory');
      location.href = '/story-result.html';
    }catch(_error){
      if(button){button.disabled = false;button.textContent = 'Apri la storia';}
      showError('La storia non è stata preparata. Riprova tra poco.');
    }
  }

  function bindEntry(){
    root.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click',() => {
      const nextMode = button.dataset.mode;
      if(!MODE_META[nextMode]) return;
      if(nextMode === 'continue' && !recentStories().length) return;
      state.mode = nextMode;
      state.route = routeFor(nextMode);
      state.index = 0;
      render();
    }));
    const toggle = document.getElementById('toggleMoreModes');
    if(toggle) toggle.addEventListener('click',() => {state.moreModesOpen = !state.moreModesOpen;render();});
  }

  function bindStep(){
    const step = state.route[state.index];
    root.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click',() => {
      const value = button.dataset.answer;
      if(step.type === 'multi'){
        const values = new Set(Array.isArray(state.answers[step.id]) ? state.answers[step.id] : []);
        if(values.has(value)) values.delete(value); else values.add(value);
        state.answers[step.id] = [...values];
      }else{
        state.answers[step.id] = value;
        if(step.id === 'scenario') applyWorld(value);
      }
      render();
    }));
    const next = document.getElementById('creatorNext');
    const back = document.getElementById('creatorBack');
    if(next) next.addEventListener('click',goNext);
    if(back) back.addEventListener('click',goBack);
    const field = document.getElementById('creatorTextAnswer');
    if(field) field.addEventListener('input',() => {const error = document.getElementById('creatorError');if(error) error.hidden = true;});
  }

  function render(){
    if(!profile){
      root.innerHTML = '<div class="creator-panel-inner"><div class="creator-question-head"><h1>Nessun profilo selezionato</h1><p>Crea o seleziona prima il mondo di un bambino.</p></div><a class="creator-open" href="/onboarding.html">Crea profilo</a></div>';
      setStage('Prima costruiamo il suo mondo.','Il profilo tiene separate storie, preferenze e memoria.');
      updateProgress();
      return;
    }
    if(!state.mode){
      root.innerHTML = entryMarkup();
      setStage('Che storia facciamo oggi?',`${profile.favoriteCompanion || (WORLD_META[selectedWorld()] || {}).companion || 'Il compagno FABLEA'} conosce già il suo mondo.`);
      updateProgress();
      bindEntry();
      return;
    }
    if(state.index >= state.route.length){
      root.innerHTML = summaryMarkup();
      setStage('La porta è pronta ad aprirsi.','Controlla le scelte e poi entra nella storia.');
      updateProgress();
      document.getElementById('creatorBack').addEventListener('click',goBack);
      document.getElementById('creatorOpen').addEventListener('click',openStory);
      return;
    }
    const step = state.route[state.index];
    root.innerHTML = stepMarkup(step);
    setStage(step.title,step.help);
    updateProgress();
    bindStep();
  }

  function presetMode(){
    const queryMode = new URLSearchParams(location.search).get('mode');
    if(queryMode && MODE_META[queryMode]) return queryMode;
    if(preset.mode && MODE_META[preset.mode]) return preset.mode;
    return null;
  }

  if(profile && S){S.applyProfile(profile);if(dock) dock.innerHTML = S.renderDock('create');}
  applyWorld(selectedWorld());
  const initialMode = presetMode();
  if(initialMode && (initialMode !== 'continue' || recentStories().length)){
    state.mode = initialMode;
    state.route = routeFor(initialMode);
  }
  render();

  global.FableaGuidedCreator = {MODE_META,WORLD_META,routeFor,requestInput,state};
})(window);
