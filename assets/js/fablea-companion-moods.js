(function(global){
  'use strict';

  const MOODS = ['calm','curious','happy','encouraging'];
  const COPY = {
    home:{calm:'Scegliamo con calma da dove iniziare.',curious:'C’è qualcosa di nuovo da esplorare.',happy:'La Casa sta crescendo insieme a voi.',encouraging:'Possiamo provare una strada diversa.'},
    play:{calm:'Osserviamo prima di scegliere.',curious:'Quale dettaglio può aiutarci?',happy:'L’abbiamo scoperto insieme.',encouraging:'Sbagliare ci mostra la strada successiva.'},
    learn:{calm:'Non serve sapere già tutto.',curious:'Ogni domanda nasconde un piccolo indizio.',happy:'Ora sappiamo qualcosa in più.',encouraging:'Questa risposta ci aiuta a capire meglio.'},
    story:{calm:'Sono qui accanto alla storia.',curious:'Vediamo cosa accade nella prossima pagina.',happy:'Questo momento resterà nel nostro mondo.',encouraging:'Possiamo rileggere e trovare un altro significato.'}
  };

  function normalizeMood(value){
    return MOODS.includes(value) ? value : 'calm';
  }

  function elementFor(target){
    return typeof target === 'string' ? document.querySelector(target) : target;
  }

  function ornament(mood){
    if(mood === 'happy') return '<span class="companion-mood-ornament" aria-hidden="true">✦</span>';
    if(mood === 'curious') return '<span class="companion-mood-ornament" aria-hidden="true">?</span>';
    if(mood === 'encouraging') return '<span class="companion-mood-ornament" aria-hidden="true">♡</span>';
    return '<span class="companion-mood-ornament" aria-hidden="true">·</span>';
  }

  function decorate(target,mood = 'calm'){
    const element = elementFor(target);
    if(!element) return null;
    const next = normalizeMood(mood);
    element.classList.add('companion-with-mood');
    for(const name of MOODS) element.classList.toggle(`companion-mood-${name}`,name === next);
    element.dataset.companionMood = next;
    let mark = element.querySelector(':scope > .companion-mood-ornament');
    if(mark) mark.remove();
    element.insertAdjacentHTML('beforeend',ornament(next));
    return next;
  }

  function mount(target,profile,mood = 'calm',options = {}){
    const element = elementFor(target);
    if(!element || !global.FableaCompanion) return null;
    const visual = global.FableaCompanion.mount(element,profile,options);
    decorate(element,mood);
    return visual;
  }

  function line(context,mood = 'calm'){
    const group = COPY[context] || COPY.home;
    return group[normalizeMood(mood)] || group.calm;
  }

  function enhanceDocument(profile){
    document.querySelectorAll('[data-companion-expression]').forEach(element => {
      const mood = element.dataset.companionExpression || 'calm';
      if(!element.querySelector('.fablea-companion-svg') && global.FableaCompanion && profile){
        global.FableaCompanion.mount(element,profile);
      }
      decorate(element,mood);
    });
  }

  global.FableaCompanionMood = {MOODS,COPY,normalizeMood,decorate,mount,line,enhanceDocument};
})(window);
