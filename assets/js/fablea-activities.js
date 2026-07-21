(function(global){
  'use strict';

  const F = global.FableaProfile;
  const S = global.FableaShell;
  const C = global.FableaCompanion;
  const M = global.FableaCompanionMood;
  const A = global.FableaActivityCatalog;
  const root = document.getElementById('activityRoot');
  const companionTarget = document.getElementById('activityCompanion');
  const bubble = document.getElementById('activityBubble');
  if(!root || !F || !A) return;

  let profile = F.getSelectedProfile();
  if(!profile){
    root.innerHTML = '<div class="activity-finish"><div class="finish-icon">✨</div><h2>Prima creiamo il suo mondo.</h2><p>Le attività cambiano in base all’età e restano separate per ogni profilo.</p><div class="activity-finish-actions"><a class="activity-next" href="/onboarding.html">Crea profilo</a></div></div>';
    return;
  }

  if(C) profile = C.ensureProfile(profile) || profile;
  if(S) S.applyProfile(profile);

  const mode = document.body.dataset.activity === 'learn' ? 'learn' : 'play';
  const STORAGE_KEY = 'fableaActivityProgress';
  const progressState = F.readJSON(STORAGE_KEY,{});
  const profileProgress = normalizeProgress(progressState[profile.id]);
  const escape = value => F.escapeHTML(value == null ? '' : value);
  const SESSION_SIZE = 4;

  let items = [];
  let index = 0;
  let answered = false;
  let attemptsOnItem = 0;
  let currentSelection = [];
  let sessionSkills = new Set();
  let sessionAttempts = [];
  let selectedPath = 'mixed';

  const modeCopy = mode === 'play'
    ? {
        kicker:'Sentiero dei giochi',
        title:'Giochiamo con le idee',
        intro:'Scegli un piccolo sentiero. FABLEA adatta quattro tappe all’età e alle esperienze già fatte.',
        routes:[
          ['mixed','✦','Sorpresa del giorno','Parole, forme, numeri e indizi mescolati.'],
          ['language','Aa','Parole e suoni','Lettere, sillabe, rime e linguaggio.'],
          ['logic','⌁','Logica e numeri','Sequenze, quantità, deduzioni e strategie.'],
          ['attention','◉','Occhi e memoria','Forme, orientamento, emozioni e attenzione.']
        ]
      }
    : {
        kicker:'Laboratorio delle scoperte',
        title:'Scopriamo qualcosa',
        intro:'Scegli un laboratorio. Ogni percorso collega domande, osservazioni e una piccola missione fuori dallo schermo.',
        routes:[
          ['mixed','✦','Esplorazione mista','Un viaggio tra parole, natura, numeri e mondo.'],
          ['language','Aa','Lettere e linguaggio','Prime lettere, comprensione e costruzione delle frasi.'],
          ['science','⚗','Natura e scienza','Corpo, piante, spazio, materia ed esperimenti.'],
          ['critical','◇','Pensiero e fonti','Numeri, mappe, prove, media e ragionamento.']
        ]
      };

  document.getElementById('activityKicker').textContent = modeCopy.kicker;
  document.getElementById('activityTitle').textContent = modeCopy.title;
  document.getElementById('activityIntro').textContent = modeCopy.intro;

  function normalizeProgress(value){
    const current = value && typeof value === 'object' ? value : {};
    return {
      play:Number(current.play || 0),
      learn:Number(current.learn || 0),
      visits:Number(current.visits || 0),
      journeys:Array.isArray(current.journeys) ? current.journeys.slice(-30) : [],
      recentIds:Array.isArray(current.recentIds) ? current.recentIds.slice(-18) : [],
      itemStats:current.itemStats && typeof current.itemStats === 'object' ? current.itemStats : {},
      skillStats:current.skillStats && typeof current.skillStats === 'object' ? current.skillStats : {},
      lastMode:current.lastMode || '',
      lastSkills:Array.isArray(current.lastSkills) ? current.lastSkills : [],
      lastCompletedAt:current.lastCompletedAt || ''
    };
  }

  function setCompanion(mood){
    if(M) M.mount(companionTarget,profile,mood);
    else if(C) C.mount(companionTarget,profile);
    if(bubble) bubble.textContent = M ? M.line(mode,mood) : 'Proviamo insieme.';
  }

  function domainOf(item){
    const skill = String(item.skill || '').toLowerCase();
    if(/letter|parol|rime|sillab|linguaggio|comprensione|argoment/.test(skill)) return 'language';
    if(/scienz|natura|biologia|fisica|spazio|astronomia|materia|ecosistem|ecologia|corpo|tempo|ricerca|metodo/.test(skill)) return 'science';
    if(/numero|quantità|somma|frazion|percent|probabil|deduz|logic|vincol|sequenz|schema|confronto|codic|pianific|dati|causalità/.test(skill)) return 'logic';
    if(/fonte|media|geografia|prospettiv|pensiero|bias/.test(skill)) return 'critical';
    return 'attention';
  }

  function routeAccepts(item,path){
    if(path === 'mixed') return true;
    const domain = domainOf(item);
    if(path === 'critical') return domain === 'critical' || domain === 'logic';
    return domain === path;
  }

  function seededValue(text){
    let hash = 2166136261;
    for(const char of String(text || '')){
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash,16777619);
    }
    return (hash >>> 0) / 4294967295;
  }

  function shuffled(values,seed){
    return values.map((value,position) => ({value,sort:seededValue(`${seed}-${position}-${String(value)}`)}))
      .sort((a,b) => a.sort - b.sort)
      .map(entry => entry.value);
  }

  function priority(item){
    const stat = profileProgress.itemStats[item.id] || {};
    const seen = Number(stat.seen || 0);
    const correct = Number(stat.correct || 0);
    const success = seen ? correct / seen : 0;
    const recentPenalty = profileProgress.recentIds.includes(item.id) ? 3 : 0;
    const unseenBonus = seen === 0 ? -4 : 0;
    return unseenBonus + recentPenalty + success + seededValue(`${profile.id}-${item.id}-${profileProgress[mode]}`) * .2;
  }

  function buildSession(path){
    const allItems = A.forProfile(mode,profile.age);
    const preferred = allItems.filter(item => routeAccepts(item,path));
    const source = preferred.length >= SESSION_SIZE ? preferred : [...preferred,...allItems.filter(item => !preferred.includes(item))];
    const unique = [...new Map(source.map(item => [item.id,item])).values()];
    return unique.sort((a,b) => priority(a) - priority(b)).slice(0,Math.min(SESSION_SIZE,unique.length));
  }

  function persistProgress(){
    progressState[profile.id] = profileProgress;
    F.writeJSON(STORAGE_KEY,progressState);
  }

  function recordResult(item,solved,attempts){
    const now = new Date().toISOString();
    const itemStat = profileProgress.itemStats[item.id] || {seen:0,correct:0};
    itemStat.seen = Number(itemStat.seen || 0) + 1;
    itemStat.correct = Number(itemStat.correct || 0) + (solved ? 1 : 0);
    itemStat.lastAttempts = attempts;
    itemStat.lastAt = now;
    profileProgress.itemStats[item.id] = itemStat;

    const skillStat = profileProgress.skillStats[item.skill] || {seen:0,correct:0};
    skillStat.seen = Number(skillStat.seen || 0) + 1;
    skillStat.correct = Number(skillStat.correct || 0) + (solved ? 1 : 0);
    skillStat.lastAt = now;
    profileProgress.skillStats[item.skill] = skillStat;

    profileProgress.recentIds = [...profileProgress.recentIds.filter(id => id !== item.id),item.id].slice(-18);
    persistProgress();
  }

  function persistCompletion(){
    profileProgress[mode] = Number(profileProgress[mode] || 0) + 1;
    profileProgress.visits = Number(profileProgress.visits || 0) + 1;
    profileProgress.lastMode = mode;
    profileProgress.lastSkills = [...sessionSkills];
    profileProgress.lastCompletedAt = new Date().toISOString();
    const mission = items.find(item => item.mission)?.mission || '';
    profileProgress.journeys.push({
      mode,
      path:selectedPath,
      skills:[...sessionSkills],
      attempts:sessionAttempts.reduce((sum,item) => sum + item.attempts,0),
      mission,
      completedAt:profileProgress.lastCompletedAt
    });
    profileProgress.journeys = profileProgress.journeys.slice(-30);
    persistProgress();
  }

  function speak(text){
    if(!('speechSynthesis' in global) || !global.SpeechSynthesisUtterance) return;
    global.speechSynthesis.cancel();
    const utterance = new global.SpeechSynthesisUtterance(String(text || '').slice(0,500));
    utterance.lang = 'it-IT';
    utterance.rate = profile.age === '2-4' ? .82 : profile.age === '5-7' ? .9 : .98;
    global.speechSynthesis.speak(utterance);
  }

  function showRoutePicker(){
    setCompanion('curious');
    document.getElementById('activityProgressFill').style.width = '0%';
    document.getElementById('activityProgressLabel').textContent = 'Scegli il percorso';
    const explored = profileProgress.journeys.filter(journey => journey.mode === mode).length;
    root.innerHTML = `
      <section class="activity-route-intro">
        <div class="eyebrow">${escape(F.ageLabel(profile.age))}</div>
        <h2>Dove andiamo oggi?</h2>
        <p>Ogni percorso dura pochi minuti. Le attività cambiano nel tempo e non assegnano voti.</p>
        ${explored ? `<div class="activity-history-note">${explored} percors${explored === 1 ? 'o esplorato' : 'i esplorati'} in questo ambiente.</div>` : ''}
      </section>
      <div class="activity-route-grid">
        ${modeCopy.routes.map(([id,icon,title,description]) => `
          <button class="activity-route-card" type="button" data-route="${id}">
            <span class="activity-route-icon">${icon}</span>
            <strong>${escape(title)}</strong>
            <span>${escape(description)}</span>
          </button>`).join('')}
      </div>`;
    root.querySelectorAll('[data-route]').forEach(button => button.addEventListener('click',() => beginSession(button.dataset.route)));
  }

  function beginSession(path = 'mixed'){
    selectedPath = path;
    items = buildSession(path);
    index = 0;
    answered = false;
    attemptsOnItem = 0;
    currentSelection = [];
    sessionSkills = new Set();
    sessionAttempts = [];
    setCompanion('curious');
    render();
  }

  function sameSet(first,second){
    const a = [...first].map(String).sort();
    const b = [...second].map(String).sort();
    return a.length === b.length && a.every((value,i) => value === b[i]);
  }

  function isCorrect(item,selection){
    if(item.type === 'choice') return String(selection[0]) === String(item.correct);
    if(item.type === 'multi') return sameSet(selection,item.correct);
    if(item.type === 'order') return Array.isArray(item.correct) && item.correct.every((value,i) => String(selection[i]) === String(value));
    return false;
  }

  function correctLabel(item){
    return Array.isArray(item.correct) ? item.correct.join(' → ') : String(item.correct);
  }

  function resetInteraction(item){
    currentSelection = [];
    root.querySelectorAll('[data-answer]').forEach(button => {
      button.disabled = false;
      button.classList.remove('selected','wrong','correct');
    });
    const order = document.getElementById('activityOrder');
    if(order) order.innerHTML = '<span>Tocca gli elementi nell’ordine giusto.</span>';
    const confirm = document.getElementById('activityConfirm');
    if(confirm) confirm.disabled = true;
    if(item.type === 'choice') return;
  }

  function resolve(item){
    if(answered) return;
    attemptsOnItem += 1;
    const correct = isCorrect(item,currentSelection);
    const feedback = document.getElementById('activityFeedback');
    const next = document.getElementById('activityNext');

    if(!correct && attemptsOnItem < 2){
      feedback.dataset.result = 'retry';
      feedback.innerHTML = '<strong>Ci siamo quasi.</strong><br>Rileggi l’indizio e prova una seconda strada.';
      setCompanion('encouraging');
      resetInteraction(item);
      return;
    }

    answered = true;
    sessionSkills.add(item.skill);
    sessionAttempts.push({id:item.id,solved:correct,attempts:attemptsOnItem});
    recordResult(item,correct,attemptsOnItem);

    root.querySelectorAll('[data-answer]').forEach(button => {
      const value = button.dataset.answer;
      const correctValues = Array.isArray(item.correct) ? item.correct.map(String) : [String(item.correct)];
      if(correctValues.includes(String(value))) button.classList.add('correct');
      button.disabled = true;
    });

    feedback.dataset.result = correct ? 'correct' : 'revealed';
    feedback.innerHTML = `<strong>${escape(correct ? item.success : `La soluzione è ${correctLabel(item)}.`)}</strong><br>${escape(item.learn)}`;
    next.hidden = false;
    setCompanion(correct ? 'happy' : 'encouraging');
  }

  function finish(){
    persistCompletion();
    setCompanion('happy');
    const skills = [...sessionSkills];
    const mission = items.find(item => item.mission)?.mission || 'Osserva qualcosa di nuovo nel mondo reale e raccontalo al compagno.';
    root.innerHTML = `
      <div class="activity-finish">
        <div class="finish-icon">${mode === 'play' ? '🧩' : '🔭'}</div>
        <h2>Il percorso di oggi è completo.</h2>
        <p>Nessun voto e nessuna classifica. Il mondo conserva soltanto le capacità esplorate e le domande che possono tornare utili.</p>
        <div class="activity-skill-row">${skills.map(skill => `<span class="activity-skill">${escape(skill)}</span>`).join('')}</div>
        <section class="activity-real-mission">
          <div class="eyebrow">FABLEA fuori dallo schermo</div>
          <strong>${escape(mission)}</strong>
          <span>Non serve fotografare né registrare nulla: basta farlo e, magari, raccontarlo.</span>
        </section>
        <div class="activity-finish-actions">
          <button class="activity-next" id="restartActivity" type="button">Scegli un altro percorso</button>
          <a class="activity-home-link" href="/world.html">Guarda le tracce nel Mondo</a>
          <a class="activity-home-link" href="/child-hub.html">Torna alla Casa</a>
        </div>
      </div>`;
    document.getElementById('activityProgressFill').style.width = '100%';
    document.getElementById('activityProgressLabel').textContent = 'Completo';
    document.getElementById('restartActivity').addEventListener('click',showRoutePicker);
  }

  function render(){
    if(index >= items.length){finish();return;}
    const item = items[index];
    answered = false;
    attemptsOnItem = 0;
    currentSelection = [];
    setCompanion('curious');

    document.getElementById('activityProgressFill').style.width = `${((index + 1) / items.length) * 100}%`;
    document.getElementById('activityProgressLabel').textContent = `${index + 1} di ${items.length}`;

    const answerValues = item.type === 'order'
      ? shuffled(item.answers,`${profile.id}-${item.id}-${profileProgress[mode]}`)
      : item.answers;
    const instruction = item.type === 'multi'
      ? 'Scegli tutte le risposte giuste'
      : item.type === 'order'
        ? 'Costruisci l’ordine'
        : mode === 'play' ? 'Scegli la risposta' : 'Osserva e scopri';

    root.innerHTML = `
      <div class="activity-session-note"><strong>Tappa ${index + 1}</strong><span>${escape(item.skill)} · ${escape(selectedPath === 'mixed' ? 'percorso misto' : 'sentiero scelto')}</span></div>
      <section class="activity-card-head">
        <div class="activity-head-row">
          <div class="eyebrow">${escape(F.ageLabel(profile.age))}</div>
          <button class="activity-listen" id="activityListen" type="button" aria-label="Leggi domanda e indizio">◖)) Ascolta</button>
        </div>
        <h2>${escape(item.prompt)}</h2>
        <p>${escape(item.hint)}</p>
      </section>
      <div class="activity-prompt"><strong>${instruction}</strong><span>${item.type === 'choice' ? 'Puoi provare senza paura di sbagliare.' : 'Tocca gli elementi e poi conferma.'}</span></div>
      ${item.type === 'order' ? '<div class="activity-order" id="activityOrder"><span>Tocca gli elementi nell’ordine giusto.</span></div>' : ''}
      <div class="answer-grid" data-type="${escape(item.type)}">
        ${answerValues.map(answer => `<button class="answer-button" type="button" data-answer="${escape(answer)}">${escape(answer)}</button>`).join('')}
      </div>
      ${item.type !== 'choice' ? '<button class="activity-confirm" id="activityConfirm" type="button" disabled>Conferma</button>' : ''}
      <div class="activity-feedback" id="activityFeedback" aria-live="polite"></div>
      <button class="activity-next" id="activityNext" type="button" hidden>Continua</button>`;

    const next = document.getElementById('activityNext');
    const confirm = document.getElementById('activityConfirm');
    const order = document.getElementById('activityOrder');
    const listen = document.getElementById('activityListen');
    if(listen) listen.addEventListener('click',() => speak(`${item.prompt}. ${item.hint}`));

    root.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click',() => {
      if(answered) return;
      const value = button.dataset.answer;
      if(item.type === 'choice'){
        currentSelection = [value];
        button.classList.add('selected');
        resolve(item);
        return;
      }
      if(item.type === 'multi'){
        const selected = currentSelection.includes(value);
        currentSelection = selected ? currentSelection.filter(itemValue => itemValue !== value) : [...currentSelection,value];
        button.classList.toggle('selected',!selected);
        if(confirm) confirm.disabled = currentSelection.length === 0;
        return;
      }
      if(item.type === 'order'){
        if(currentSelection.includes(value)) return;
        currentSelection.push(value);
        button.classList.add('selected');
        button.disabled = true;
        if(order) order.innerHTML = currentSelection.map((selectedValue,position) => `<span class="activity-order-chip"><b>${position + 1}</b>${escape(selectedValue)}</span>`).join('');
        if(confirm) confirm.disabled = currentSelection.length !== item.answers.length;
      }
    }));

    if(confirm) confirm.addEventListener('click',() => resolve(item));
    next.addEventListener('click',() => {index += 1;render();});
  }

  showRoutePicker();
  if(S) document.getElementById('dock').innerHTML = S.renderDock(mode === 'play' ? 'world' : 'discover');
})(window);
