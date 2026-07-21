(function(global){
  'use strict';

  const ENGINE_VERSION = '3.1';

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function clean(value,max = 320){
    return String(value || '').replace(/\s+/g,' ').trim().slice(0,max);
  }

  function words(text){
    return clean(text,100000).split(/\s+/).filter(Boolean).length;
  }

  function slug(value){
    return clean(value,100).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'traccia';
  }

  function profileName(story,request){
    return clean(story.child || request.profile && request.profile.name || 'il protagonista',80);
  }

  function companionName(story,request){
    return clean(story.companion || request.world && request.world.companion || 'il compagno',120);
  }

  function ageBand(story,request){
    return clean(story.age || request.profile && request.profile.age,10);
  }

  function compact(age,younger,older){
    return age === '2-4' ? younger : older;
  }

  function firstMemory(request,type){
    return ((request.world && request.world.selectedMemory) || []).find(item => item && item.type === type) || null;
  }

  function memoryBridge(story,request){
    const age = ageBand(story,request);
    const companion = companionName(story,request);
    const storyMemory = firstMemory(request,'story');
    const threadMemory = firstMemory(request,'thread');
    const objectMemory = firstMemory(request,'object');
    const ritualMemory = firstMemory(request,'ritual');

    if(storyMemory && storyMemory.data){
      const title = clean(storyMemory.data.title,140);
      const treasure = clean(storyMemory.data.treasure,140);
      return compact(age,
        `${companion} ricordò la storia “${title}”. Quel ricordo indicava ancora la strada.`,
        `${companion} ricordò ciò che era accaduto in “${title}”. ${treasure ? `Il ricordo di ${treasure} tornò proprio nel momento giusto.` : 'Non era nostalgia: era una traccia utile per capire da dove ripartire.'}`
      );
    }
    if(threadMemory && threadMemory.data){
      const text = clean(threadMemory.data.text,180);
      return compact(age,
        `C’era ancora una domanda nel mondo: ${text}.`,
        `Nel mondo restava un filo aperto: ${text}. Nessuno lo aveva dimenticato; semplicemente, non era ancora arrivato il momento di seguirlo.`
      );
    }
    if(objectMemory && objectMemory.data){
      const object = clean(objectMemory.data.name,140);
      return compact(age,
        `${profileName(story,request)} portò con sé ${object}.`,
        `${profileName(story,request)} scelse di portare con sé ${object}. Non era un portafortuna: ricordava una capacità già conquistata.`
      );
    }
    if(ritualMemory && ritualMemory.data){
      const ritual = clean(ritualMemory.data.text,180);
      return compact(age,
        `${companion} ricordò il loro gesto speciale: ${ritual}.`,
        `Prima di partire, ${companion} ricordò il gesto che avevano condiviso: ${ritual}. Bastò ripeterne una piccola parte per ritrovare il proprio ritmo.`
      );
    }
    return '';
  }

  function modeBridge(story,request){
    const age = ageBand(story,request);
    const name = profileName(story,request);
    const companion = companionName(story,request);
    const today = request.today || {};
    const narrative = request.narrative || {};
    const participants = (today.presentWith || []).map(item => clean(item,70)).filter(Boolean);

    switch(request.mode){
      case 'moment':
        return today.mood ? compact(age,
          `Quel giorno ${name} si sentiva così: ${clean(today.mood,100)}. ${companion} rimase vicino.`,
          `Quel giorno ${name} portava con sé ${clean(today.mood,100).toLowerCase()}. ${companion} non cercò di cancellare quella sensazione: la accolse come una parte del viaggio.`
        ) : '';
      case 'idea':
        return narrative.idea ? compact(age,
          `Tutto cominciò da un’idea: ${clean(narrative.idea,180)}.`,
          `Questa volta il mondo non inviò una mappa. Tutto cominciò da un’idea di ${name}: ${clean(narrative.idea,240)}.`
        ) : '';
      case 'family':
        return participants.length ? compact(age,
          `Questa volta partirono anche ${participants.join(', ')}.`,
          `Questa volta il viaggio apparteneva a più persone: con ${name} e ${companion} c’erano anche ${participants.join(', ')}. Ognuno avrebbe notato qualcosa di diverso.`
        ) : '';
      case 'prepare':
        return narrative.preparationTarget ? compact(age,
          `Il viaggio aiutava ${name} a prepararsi a ${clean(narrative.preparationTarget,160)}.`,
          `${name} sapeva che presto avrebbe affrontato ${clean(narrative.preparationTarget,190)}. Il mondo trasformò quell’attesa in un’avventura abbastanza vicina da essere riconoscibile e abbastanza lontana da poter essere esplorata con calma.`
        ) : '';
      case 'bedtime':
        return compact(age,
          `La luce del mondo diventò morbida. Nessuno aveva fretta.`,
          `La luce del mondo si abbassò come una voce che non aveva bisogno di farsi sentire da lontano. Anche l’avventura avrebbe rispettato il ritmo della sera.`
        );
      case 'discovery':
        return compact(age,
          `${name} partì con una domanda e tanta curiosità.`,
          `${name} partì senza cercare subito una risposta. La prima regola della scoperta era osservare abbastanza a lungo da permettere alla domanda di diventare più precisa.`
        );
      case 'cocreate':
        return compact(age,
          `${name} e ${companion} decisero che avrebbero scelto la strada insieme.`,
          `${name} e ${companion} si accordarono: il mondo avrebbe proposto possibilità, ma la direzione sarebbe nata dalle loro scelte.`
        );
      case 'continue':
        return memoryBridge(story,request);
      default:
        return '';
    }
  }

  const SOLUTIONS = {
    cooperation:{
      scene:'La forza della squadra',
      short:(name,companion) => `${name} e ${companion} capirono che nessuno doveva risolvere tutto da solo. Ognuno fece una piccola parte, e la strada si aprì.`,
      long:(name,companion) => `${name} e ${companion} smisero di cercare un unico eroe. Divisero il problema in parti, ascoltarono ciò che ciascuno sapeva fare e costruirono una soluzione che nessuno avrebbe trovato da solo.`
    },
    observation:{
      scene:'Il dettaglio che mancava',
      short:name => `${name} si fermò e guardò meglio. Un piccolo dettaglio mostrò la soluzione.`,
      long:name => `${name} smise di aggiungere tentativi e tornò a osservare. Un dettaglio rimasto ai margini cambiò il significato di tutto ciò che avevano visto fino a quel momento.`
    },
    conversation:{
      scene:'Le parole giuste',
      short:(name,companion) => `${name} parlò con sincerità. ${companion} ascoltò fino alla fine, e il problema diventò più piccolo.`,
      long:(name,companion) => `${name} scelse parole sincere, senza usarle per vincere. ${companion} lasciò spazio anche alle risposte difficili. Quando tutti ebbero parlato e ascoltato, il problema non era sparito, ma finalmente poteva essere affrontato insieme.`
    },
    experimentation:{
      scene:'Un tentativo diverso',
      short:name => `${name} provò in piccolo, osservò il risultato e cambiò qualcosa. Al terzo tentativo, funzionò.`,
      long:name => `${name} trasformò il problema in un esperimento: una prova piccola, un’osservazione, una modifica. Ogni errore eliminava una strada sbagliata e rendeva più visibile quella utile.`
    },
    courage:{
      scene:'Un passo con la paura accanto',
      short:name => `${name} non aspettò che la paura sparisse. Fece un passo piccolo, portandola con sé.`,
      long:name => `${name} capì che il coraggio non avrebbe cancellato la paura. Le fece posto, scelse un passo abbastanza piccolo da essere possibile e lo compì senza fingere che fosse facile.`
    },
    creativity:{
      scene:'Una soluzione che non c’era',
      short:name => `${name} unì due idee che sembravano lontane. Nacque una soluzione nuova.`,
      long:name => `${name} prese due idee che fino a quel momento non erano mai state messe vicine. Nessuna delle due bastava da sola; insieme crearono una soluzione che prima non esisteva.`
    },
    mixed:{
      scene:'La svolta',
      short:(name,companion) => `${name} osservò, chiese aiuto e provò una strada nuova. ${companion} capì che quella era la svolta.`,
      long:(name,companion) => `${name} osservò ciò che era cambiato, ascoltò ${companion} e provò una strada nuova. La soluzione non arrivò da una sola qualità, ma dal momento esatto in cui curiosità, coraggio e collaborazione iniziarono a lavorare insieme.`
    }
  };

  function turningPoint(story,request){
    const age = ageBand(story,request);
    const name = profileName(story,request);
    const companion = companionName(story,request);
    const solution = request.narrative && request.narrative.solution || 'mixed';
    const template = SOLUTIONS[solution] || SOLUTIONS.mixed;
    const text = age === '2-4' ? template.short(name,companion) : template.long(name,companion);
    return {id:`v3-turn-${solution}`,scene:template.scene,text,art:story.art || story.icon || '✨',v3Role:'turning-point'};
  }

  function endingFor(story,request){
    const age = ageBand(story,request);
    const name = profileName(story,request);
    const companion = companionName(story,request);
    const world = clean(story.world || request.world && request.world.scenario,100);
    const ending = request.narrative && request.narrative.ending || 'closed';

    if(ending === 'closed-soft'){
      return compact(age,
        `Poi ${name} e ${companion} tornarono con calma. Il mondo poteva riposare.`,
        `Quando tutto fu al proprio posto, ${name} e ${companion} non cercarono un’altra impresa. Lasciarono che ${world} diventasse più quieto e portarono con sé soltanto ciò che meritava di restare.`
      );
    }
    if(ending === 'open-thread'){
      return compact(age,
        `Prima di andare via, comparve una nuova traccia. Non era per oggi, ma li stava aspettando.`,
        `Prima di tornare, ${companion} notò una traccia che non apparteneva a quella avventura. La segnarono sulla mappa senza seguirla: alcune domande diventano più belle quando sanno aspettare la storia giusta.`
      );
    }
    if(ending === 'question'){
      return compact(age,
        `${name} tornò con una nuova domanda: che cosa avrebbero scoperto la prossima volta?`,
        `${name} tornò con una risposta, ma anche con una domanda migliore: quale dettaglio di ${world} avevano guardato senza vederlo davvero?`
      );
    }
    if(ending === 'choice'){
      return compact(age,
        `Davanti a loro c’erano due strade. La prossima volta avrebbero scelto insieme.`,
        `La mappa mostrava due strade ancora intatte. ${name} e ${companion} non ne scelsero una per fretta: conservarono entrambe le possibilità per la prossima storia.`
      );
    }
    return compact(age,
      `${name} guardò il mondo: qualcosa era cambiato davvero.`,
      `${name} guardò ${world} e capì che la conclusione non cancellava ciò che era accaduto: lo trasformava in una parte stabile del loro mondo.`
    );
  }

  function choicePage(story,request){
    if(request.mode !== 'cocreate' && request.narrative && request.narrative.ending !== 'choice') return null;
    const age = ageBand(story,request);
    const name = profileName(story,request);
    const count = Math.max(2,Math.min(3,Number(request.narrative && request.narrative.coCreateChoices) || 2));
    const options = [
      'seguire il segnale più vicino',
      'chiedere aiuto a chi conosce il luogo',
      'osservare ancora prima di muoversi'
    ].slice(0,count);
    return {
      id:'v3-choice',
      scene:'La scelta di oggi',
      text:compact(age,
        `${name} poteva ${options.join(' oppure ')}. La strada scelta avrebbe cambiato il seguito.`,
        `Il mondo offrì a ${name} ${count} possibilità: ${options.join('; ')}. Nessuna era una risposta finta. Ognuna avrebbe dato alla storia un ritmo e una conseguenza differenti.`
      ),
      art:story.art || story.icon || '✨',
      v3Role:'choice',
      choices:options
    };
  }

  function consequences(story,request){
    const ending = request.narrative && request.narrative.ending || 'closed';
    const solution = request.narrative && request.narrative.solution || 'mixed';
    const companion = companionName(story,request);
    const name = profileName(story,request);
    const requestSuffix = clean(request.id,100).split('-').pop() || slug(story.id);
    const selectedThread = firstMemory(request,'thread');
    const openThreads = [];
    const resolvedThreadIds = [];

    if(['open-thread','question','choice'].includes(ending)){
      const text = ending === 'question'
        ? `Capire quale dettaglio di ${story.world} non è stato ancora osservato.`
        : ending === 'choice'
          ? `Scegliere quale delle strade conservate seguire nella prossima storia.`
          : `Scoprire a chi appartiene la nuova traccia comparsa alla fine di “${story.title}”.`;
      openThreads.push({id:`thread:v3:${requestSuffix}`,text,status:'open',sourceStoryId:story.id});
    }else if(selectedThread){
      resolvedThreadIds.push(selectedThread.id);
    }

    const decisionText = {
      cooperation:'Chiedere e offrire aiuto prima di cercare un unico eroe.',
      observation:'Fermarsi a osservare prima di aggiungere nuovi tentativi.',
      conversation:'Usare parole sincere e ascoltare la risposta fino alla fine.',
      experimentation:'Procedere con prove piccole, osservabili e modificabili.',
      courage:'Compiere un passo possibile anche con la paura accanto.',
      creativity:'Unire idee lontane per creare una possibilità nuova.',
      mixed:'Usare più capacità insieme invece di affidarsi a una sola.'
    }[solution] || 'Scegliere la capacità più adatta al momento.';

    const relationshipNote = `${name} e ${companion} hanno affrontato “${story.title}” scegliendo di ${decisionText.charAt(0).toLowerCase()}${decisionText.slice(1)}`;
    const consequenceSummary = openThreads.length
      ? 'La storia ha lasciato una nuova domanda nel mondo.'
      : resolvedThreadIds.length
        ? 'La storia ha chiuso un filo rimasto aperto.'
        : `Il mondo ricorderà questa scelta: ${decisionText}`;

    return {
      openThreads,
      resolvedThreadIds,
      relationships:[{id:`relationship:${slug(companion)}:${requestSuffix}`,character:companion,note:relationshipNote,storyId:story.id}],
      decisions:[{id:`decision:${requestSuffix}`,text:decisionText,storyId:story.id}],
      summary:consequenceSummary
    };
  }

  function apply(story,request){
    if(!story || !request || request.schemaVersion !== 3) return story;
    if(story.v3 && story.v3.requestId === request.id) return story;
    if(request.profile && story.childId && request.profile.id !== story.childId) return story;

    const next = clone(story);
    const pages = Array.isArray(next.pages) ? next.pages.map(page => ({...page})) : [];
    if(!pages.length) return story;

    const bridgeParts = [memoryBridge(next,request),modeBridge(next,request)].filter(Boolean);
    const uniqueBridge = [...new Set(bridgeParts)];
    if(uniqueBridge.length){
      pages[0].text = `${uniqueBridge.join('\n\n')}\n\n${pages[0].text}`;
      pages[0].v3Role = 'continuity';
    }

    const turn = turningPoint(next,request);
    const insertAt = Math.max(1,pages.length - 1);
    pages.splice(insertAt,0,turn);

    const choice = choicePage(next,request);
    if(choice) pages.splice(Math.max(1,pages.length - 1),0,choice);

    const last = pages[pages.length - 1];
    last.text = `${last.text}\n\n${endingFor(next,request)}`;
    last.v3Role = 'consequence';

    next.pages = pages;
    next.text = pages.map(page => page.text).join('\n\n');
    next.wordCount = words(next.text);
    next.resumePage = Math.min(Number(next.resumePage) || 0,pages.length - 1);
    next.v3 = {
      engineVersion:ENGINE_VERSION,
      requestId:request.id,
      mode:request.mode,
      tone:request.narrative && request.narrative.tone,
      pace:request.narrative && request.narrative.pace,
      solution:request.narrative && request.narrative.solution,
      ending:request.narrative && request.narrative.ending,
      memoryIds:(request.world && request.world.selectedMemory || []).map(item => item.id),
      effects:['continuity','turning-point','ending','world-consequences'].concat(choice ? ['choice'] : [])
    };
    next.v3Consequences = consequences(next,request);
    next.subtitle = next.subtitle || 'Una storia che continua a far crescere il suo mondo.';
    return next;
  }

  global.FableaStoryEngineV3 = {ENGINE_VERSION,apply,memoryBridge,modeBridge,turningPoint,endingFor,consequences};
})(window);