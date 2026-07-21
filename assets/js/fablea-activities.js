(function(global){
  'use strict';

  const F = global.FableaProfile;
  const S = global.FableaShell;
  const C = global.FableaCompanion;
  const M = global.FableaCompanionMood;
  const root = document.getElementById('activityRoot');
  const companionTarget = document.getElementById('activityCompanion');
  const bubble = document.getElementById('activityBubble');
  if(!root || !F) return;

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
  const profileProgress = progressState[profile.id] || {play:0,learn:0,visits:0,journeys:[]};
  const escape = value => F.escapeHTML(value == null ? '' : value);

  const PLAY = {
    '2-4':[
      {prompt:'Trova la luna',hint:'Guarda bene le forme.',answers:['🌙','☀️','⭐','☁️'],correct:'🌙',success:'È lei: la luna!',learn:'Riconoscere simboli e forme aiuta la memoria visiva.',skill:'Memoria visiva'},
      {prompt:'Dov’è l’animale?',hint:'Scegli la figura che può camminare.',answers:['🦊','🌳','🏠','🌈'],correct:'🦊',success:'Hai trovato la volpe!',learn:'Classificare oggetti e animali costruisce le prime categorie.',skill:'Categorie'},
      {prompt:'Trova qualcosa di rotondo',hint:'Quale forma non ha angoli?',answers:['⚽','📕','🔺','🪜'],correct:'⚽',success:'La palla è rotonda.',learn:'Le forme si possono riconoscere negli oggetti quotidiani.',skill:'Forme'},
      {prompt:'Quale fa “miao”?',hint:'Ascolta la parola nella testa.',answers:['🐱','🐶','🐸','🐔'],correct:'🐱',success:'Il gatto fa miao!',learn:'Collegare suoni e immagini sostiene il linguaggio.',skill:'Suoni e parole'}
    ],
    '5-7':[
      {prompt:'Con quale lettera comincia ORSO?',hint:'Pronuncia lentamente: O-rso.',answers:['O','A','R','S'],correct:'O',success:'ORSO comincia con O.',learn:'La prima lettera si chiama iniziale.',skill:'Lettere'},
      {prompt:'Quale parola fa rima con MARE?',hint:'Ascolta il suono finale.',answers:['PARE','LUNA','SOLE','NAVE'],correct:'PARE',success:'MARE e PARE finiscono nello stesso modo.',learn:'Le rime aiutano a sentire i suoni dentro le parole.',skill:'Rime'},
      {prompt:'Completa la sequenza: A · B · A · B · ?',hint:'Il ritmo si ripete.',answers:['A','C','D','B'],correct:'A',success:'Il modello ricomincia da A.',learn:'Riconoscere schemi aiuta la logica e la lettura.',skill:'Sequenze'},
      {prompt:'Quale parola è più lunga?',hint:'Conta le lettere, non la grandezza dell’oggetto.',answers:['SOLE','DINOSAURO','MARE','RE'],correct:'DINOSAURO',success:'DINOSAURO ha più lettere.',learn:'Le parole hanno una lunghezza che possiamo contare.',skill:'Parole'}
    ],
    '8-10':[
      {prompt:'Continua: 2 · 4 · 6 · 8 · ?',hint:'Ogni numero aumenta di due.',answers:['9','10','11','12'],correct:'10',success:'La sequenza continua con 10.',learn:'Hai riconosciuto una regola numerica.',skill:'Numeri'},
      {prompt:'Quale parola non appartiene al gruppo?',hint:'Tre indicano animali.',answers:['VOLPE','ORSO','QUERCIA','DELFINO'],correct:'QUERCIA',success:'La quercia è una pianta.',learn:'Trovare l’intruso richiede classificazione e attenzione.',skill:'Classificazione'},
      {prompt:'Se tutte le lune brillano e questa è una luna, allora…',hint:'Usa soltanto le informazioni date.',answers:['brilla','è calda','è vicina','è blu'],correct:'brilla',success:'La conclusione certa è che brilla.',learn:'Questa è una piccola deduzione logica.',skill:'Deduzione'},
      {prompt:'Quale frazione rappresenta una metà?',hint:'Due parti uguali, una scelta.',answers:['1/2','1/3','2/3','3/4'],correct:'1/2',success:'1/2 significa una parte su due.',learn:'Le frazioni descrivono parti di un intero.',skill:'Frazioni'}
    ],
    '11-12':[
      {prompt:'Una porta si apre solo con un numero pari maggiore di 6 e minore di 10.',hint:'C’è una sola possibilità.',answers:['6','7','8','10'],correct:'8',success:'8 rispetta tutte le condizioni.',learn:'Hai incrociato più vincoli contemporaneamente.',skill:'Vincoli logici'},
      {prompt:'Tutti gli esploratori hanno una mappa. Lea ha una mappa. Possiamo dire con certezza che Lea è esploratrice?',hint:'Attenzione: avere una mappa non basta.',answers:['No','Sì','Solo di notte','Solo se è nuova'],correct:'No',success:'Esatto: la conclusione non è garantita.',learn:'Hai evitato un errore logico chiamato inversione della relazione.',skill:'Pensiero logico'},
      {prompt:'Qual è il prossimo elemento? 1 · 1 · 2 · 3 · 5 · ?',hint:'Ogni numero nasce dai due precedenti.',answers:['6','7','8','10'],correct:'8',success:'3 + 5 = 8.',learn:'È l’inizio della successione di Fibonacci.',skill:'Schemi numerici'},
      {prompt:'Un indizio è vero, due sono falsi. Quale coppia non può essere entrambe falsa?',hint:'“La chiave è rossa” e “La chiave non è rossa” sono opposte.',answers:['Le prime due','Prima e terza','Seconda e terza','Tutte'],correct:'Le prime due',success:'Una delle prime due deve essere vera.',learn:'Le affermazioni opposte non possono essere entrambe false.',skill:'Deduzione'}
    ]
  };

  const LEARN = {
    '2-4':[
      {prompt:'La lettera di oggi è A',hint:'A come ALBERO.',answers:['🌳','🐻','🌙','🚗'],correct:'🌳',success:'A come ALBERO!',learn:'Le lettere diventano più facili quando incontrano immagini familiari.',skill:'Prime lettere'},
      {prompt:'Quale cosa vive nel mare?',hint:'Pensa all’acqua salata.',answers:['🐋','🦉','🦁','🐰'],correct:'🐋',success:'La balena vive nel mare.',learn:'Gli animali abitano ambienti diversi.',skill:'Natura'},
      {prompt:'Conta fino a tre',hint:'Scegli il gruppo con tre stelle.',answers:['⭐','⭐⭐','⭐⭐⭐','⭐⭐⭐⭐'],correct:'⭐⭐⭐',success:'Tre stelle!',learn:'Le quantità si possono riconoscere anche senza numeri scritti.',skill:'Quantità'}
    ],
    '5-7':[
      {prompt:'Unisci le sillabe: BA + LE + NA',hint:'Leggile una dopo l’altra.',answers:['BALENA','BANANA','BALLO','LENA'],correct:'BALENA',success:'BA-LE-NA forma BALENA.',learn:'Le sillabe sono piccoli blocchi sonori delle parole.',skill:'Sillabe'},
      {prompt:'Quale parola contiene due volte la lettera L?',hint:'Osserva ogni lettera.',answers:['LUNA','STELLA','MARE','ORSO'],correct:'STELLA',success:'STELLA contiene due L.',learn:'Cercare lettere dentro le parole allena l’attenzione.',skill:'Attenzione'},
      {prompt:'Quanto fa 5 + 3?',hint:'Puoi immaginare cinque stelle e aggiungerne tre.',answers:['6','7','8','9'],correct:'8',success:'5 + 3 = 8.',learn:'Sommare significa unire due quantità.',skill:'Prime somme'}
    ],
    '8-10':[
      {prompt:'Perché vediamo il lampo prima di sentire il tuono?',hint:'Confronta luce e suono.',answers:['La luce viaggia più veloce','Il tuono nasce dopo','Le nuvole fermano il suono','È un’illusione'],correct:'La luce viaggia più veloce',success:'La luce arriva ai nostri occhi prima del suono.',learn:'Luce e suono viaggiano a velocità molto diverse.',skill:'Fisica'},
      {prompt:'Quale organo permette alle piante di assorbire acqua dal terreno?',hint:'Si trova sotto il suolo.',answers:['Radici','Foglie','Fiori','Frutti'],correct:'Radici',success:'Le radici assorbono acqua e sali minerali.',learn:'Ogni parte della pianta svolge un compito.',skill:'Biologia'},
      {prompt:'Qual è il pianeta più vicino al Sole?',hint:'È il primo del Sistema solare.',answers:['Mercurio','Venere','Terra','Marte'],correct:'Mercurio',success:'Mercurio è il pianeta più vicino al Sole.',learn:'L’ordine dei pianeti parte da Mercurio.',skill:'Spazio'}
    ],
    '11-12':[
      {prompt:'Una fonte online non indica autore né data. Qual è la scelta migliore?',hint:'Prima di crederle, valuta l’affidabilità.',answers:['Cercare conferme in fonti autorevoli','Condividerla subito','Crederla se ha molte immagini','Usarla senza citarla'],correct:'Cercare conferme in fonti autorevoli',success:'Verificare con fonti affidabili riduce gli errori.',learn:'La qualità di un’informazione dipende anche da provenienza e verificabilità.',skill:'Fonti'},
      {prompt:'Perché la Luna mostra quasi sempre la stessa faccia alla Terra?',hint:'Rotazione e rivoluzione hanno una relazione.',answers:['Ruota su se stessa nello stesso tempo in cui orbita','Non ruota','La Terra la blocca','Il Sole illumina solo un lato'],correct:'Ruota su se stessa nello stesso tempo in cui orbita',success:'È una rotazione sincrona.',learn:'La Luna ruota, ma il suo periodo di rotazione coincide con quello orbitale.',skill:'Astronomia'},
      {prompt:'Quale scelta descrive meglio un esperimento controllato?',hint:'Si cambia una sola variabile alla volta.',answers:['Modificare un fattore e tenere gli altri costanti','Cambiare tutto insieme','Scegliere il risultato atteso','Ripeterlo una sola volta'],correct:'Modificare un fattore e tenere gli altri costanti',success:'Così possiamo capire quale fattore produce l’effetto.',learn:'Il controllo delle variabili rende gli esperimenti interpretabili.',skill:'Metodo scientifico'}
    ]
  };

  const allItems = (mode === 'play' ? PLAY : LEARN)[profile.age] || (mode === 'play' ? PLAY['5-7'] : LEARN['5-7']);
  const sessionSize = Math.min(3,allItems.length);
  let items = [];
  let index = 0;
  let answered = false;
  let sessionSkills = new Set();
  let sessionAttempts = [];

  function buildSession(){
    const completed = Number(profileProgress[mode] || 0);
    const offset = allItems.length ? completed % allItems.length : 0;
    return Array.from({length:sessionSize},(_item,itemIndex) => allItems[(offset + itemIndex) % allItems.length]);
  }

  function setCompanion(mood){
    if(M) M.mount(companionTarget,profile,mood);
    else if(C) C.mount(companionTarget,profile);
    if(bubble) bubble.textContent = M ? M.line(mode,mood) : 'Proviamo insieme.';
  }

  const modeCopy = mode === 'play'
    ? {kicker:'Sentiero dei giochi',title:'Giochiamo con le idee',intro:'Tre piccole tappe di attenzione, parole e logica. Nessuna classifica: conta il percorso.'}
    : {kicker:'Laboratorio delle scoperte',title:'Scopriamo qualcosa',intro:'Tre tappe tra lettere, natura, numeri e pensiero critico, scelte in base all’età.'};

  document.getElementById('activityKicker').textContent = modeCopy.kicker;
  document.getElementById('activityTitle').textContent = modeCopy.title;
  document.getElementById('activityIntro').textContent = modeCopy.intro;

  function persistCompletion(){
    profileProgress[mode] = Number(profileProgress[mode] || 0) + 1;
    profileProgress.visits = Number(profileProgress.visits || 0) + 1;
    profileProgress.lastMode = mode;
    profileProgress.lastSkills = [...sessionSkills];
    profileProgress.lastCompletedAt = new Date().toISOString();
    profileProgress.journeys = Array.isArray(profileProgress.journeys) ? profileProgress.journeys.slice(-7) : [];
    profileProgress.journeys.push({mode,skills:[...sessionSkills],attempts:sessionAttempts.length,completedAt:profileProgress.lastCompletedAt});
    progressState[profile.id] = profileProgress;
    F.writeJSON(STORAGE_KEY,progressState);
  }

  function beginSession(){
    items = buildSession();
    index = 0;
    answered = false;
    sessionSkills = new Set();
    sessionAttempts = [];
    setCompanion('curious');
    render();
  }

  function finish(){
    persistCompletion();
    setCompanion('happy');
    const skills = [...sessionSkills];
    root.innerHTML = `<div class="activity-finish"><div class="finish-icon">${mode === 'play' ? '🧩' : '🔭'}</div><h2>Il percorso di oggi è completo.</h2><p>Non hai raccolto punti: hai costruito nuove connessioni. Queste sono le tracce lasciate oggi nel tuo mondo.</p><div class="activity-skill-row">${skills.map(skill => `<span class="activity-skill">${escape(skill)}</span>`).join('')}</div><div class="activity-finish-actions"><button class="activity-next" id="restartActivity" type="button">Un altro percorso</button><a class="activity-home-link" href="/child-hub.html">Torna alla Casa</a></div></div>`;
    document.getElementById('activityProgressFill').style.width = '100%';
    document.getElementById('activityProgressLabel').textContent = 'Completo';
    document.getElementById('restartActivity').addEventListener('click',beginSession);
  }

  function render(){
    if(index >= items.length){finish();return;}
    const item = items[index];
    answered = false;
    setCompanion('curious');
    document.getElementById('activityProgressFill').style.width = `${((index + 1) / items.length) * 100}%`;
    document.getElementById('activityProgressLabel').textContent = `${index + 1} di ${items.length}`;
    root.innerHTML = `<div class="activity-session-note"><strong>Tappa ${index + 1}</strong><span>${escape(item.skill)} · osserva, prova, scopri</span></div><section class="activity-card-head"><div class="eyebrow">${escape(F.ageLabel(profile.age))}</div><h2>${escape(item.prompt)}</h2><p>${escape(item.hint)}</p></section><div class="activity-prompt"><strong>${mode === 'play' ? 'Scegli la risposta' : 'Osserva e scopri'}</strong><span>Puoi provare senza paura di sbagliare.</span></div><div class="answer-grid">${item.answers.map(answer => `<button class="answer-button" type="button" data-answer="${escape(answer)}">${escape(answer)}</button>`).join('')}</div><div class="activity-feedback" id="activityFeedback" aria-live="polite"></div><button class="activity-next" id="activityNext" type="button" hidden>Continua</button>`;

    const feedback = document.getElementById('activityFeedback');
    const next = document.getElementById('activityNext');
    root.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click',() => {
      if(answered) return;
      answered = true;
      const value = button.dataset.answer;
      const correct = value === item.correct;
      sessionSkills.add(item.skill);
      sessionAttempts.push({index,correct});
      button.classList.add(correct ? 'correct' : 'wrong');
      root.querySelectorAll('[data-answer]').forEach(candidate => {
        if(candidate.dataset.answer === item.correct) candidate.classList.add('correct');
        candidate.disabled = true;
      });
      feedback.dataset.result = correct ? 'correct' : 'retry';
      feedback.innerHTML = `<strong>${escape(correct ? item.success : `Quasi. La risposta è ${item.correct}.`)}</strong><br>${escape(item.learn)}`;
      next.hidden = false;
      setCompanion(correct ? 'happy' : 'encouraging');
    }));
    next.addEventListener('click',() => {index += 1;render();});
  }

  beginSession();
  if(S) document.getElementById('dock').innerHTML = S.renderDock(mode === 'play' ? 'world' : 'discover');
})(window);
