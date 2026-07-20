(function(global){
  'use strict';

  const supplements = {
    'v2-5-7-avventura-tre-impronte': [
      {id:'a8-final',after:'a8x',scene:'La mappa del mattino',text:'All’alba, la squadra disegnò una nuova mappa del percorso. Accanto a ogni ostacolo indicò quale tipo di passo era stato utile e dove fermarsi in caso di pioggia. La giovane creatura firmò la legenda con tutte e tre le impronte. Il sentiero non raccontava più una fuga solitaria, ma una strada resa più sicura dall’esperienza condivisa.'}
    ],
    'v2-5-7-calma-faro-respiri': [
      {id:'c8-final',after:'c8x',scene:'Il quaderno dei turni tranquilli',text:'Prima di dormire, il guardiano annotò ciò che aveva funzionato: segnali semplici, turni brevi, una luce calda e il diritto di chiedere il cambio quando la stanchezza cresceva. {{name}} aggiunse una pagina per le notti difficili, con istruzioni gentili e persone da chiamare. Prepararsi alla fatica rendeva meno necessario fingere di non provarla.'}
    ],
    'v2-5-7-emozioni-nodo-parole': [
      {id:'e8-final',after:'e8x',scene:'Il tempo della fiducia',text:'Il filo riparato non tornò subito forte come prima. I due amici provarono piccoli gesti coerenti per alcuni giorni: chiedere permesso, mantenere una promessa, accettare un no senza protestare. {{name}} vide che la fiducia non si ordina e non si ottiene con una frase perfetta. Cresce quando le parole vengono seguite da comportamenti ripetuti e comprensibili.'}
    ],
    'v2-5-7-scoperta-mappa-domande': [
      {id:'s8-final',after:'s8x',scene:'La legenda dell’incertezza',text:'{{name}} aggiunse alla mappa tre simboli: una lente per ciò che era stato verificato, una nuvola per le ipotesi e una porta aperta per le domande ancora senza risposta. In questo modo nessuno avrebbe confuso un’idea interessante con una certezza. La mappa diventò più affidabile proprio perché mostrava anche i punti in cui non sapeva ancora orientare.'}
    ],

    'v2-8-10-avventura-archivio-strade': [
      {id:'a9-final',after:'a9y',scene:'La manutenzione delle possibilità',text:'Riaprire una strada era soltanto l’inizio. Servivano controlli, risorse e persone disposte a segnalare problemi. {{name}} aiutò a creare un gruppo composto da viaggiatori, abitanti locali e tecnici. Ogni mese avrebbero valutato sicurezza, impatto e utilità, potendo modificare o sospendere i percorsi. Le alternative restavano vive perché qualcuno se ne prendeva cura, non perché fossero state disegnate una volta per sempre.'}
    ],
    'v2-8-10-calma-luci': [
      {id:'c5-short',after:'c5y',includeInShort:true,includeInMedium:true,scene:'La luce della fermata',text:'Alla fermata più isolata, {{name}} sperimentò una lampada che aumentava gradualmente quando arrivava una persona. Restava bassa nelle ore vuote e illuminava chiaramente volti, orari e percorso quando serviva. L’infermiera la provò per una settimana e suggerì piccole modifiche. La sicurezza migliorò senza restituire al cielo tutta la luce eliminata.'},
      {id:'c9-final',after:'c9y',scene:'La notte dopo il temporale',text:'Un temporale danneggiò alcuni sensori e una zona rimase troppo buia. Il sistema di emergenza riaccese automaticamente le lampade essenziali, mentre squadre tecniche intervennero. L’episodio mostrò che efficienza e resilienza dovevano procedere insieme. {{name}} contribuì a scrivere un piano che prevedeva guasti, controlli manuali e comunicazioni chiare, affinché il progetto non dipendesse da una tecnologia perfetta.'}
    ],
    'v2-8-10-emozioni-teatro-voci': [
      {id:'e5-medium',after:'e5y',includeInMedium:true,scene:'La prova davanti a una persona fidata',text:'Prima dello spettacolo pubblico, {{name}} scelse una persona con cui provare senza sentirsi giudicato. Dopo l’esecuzione ricevette due osservazioni concrete e una domanda, non un voto globale. Questo formato aiutò la Critica a concentrarsi su elementi modificabili. Il sostegno non consisteva nel dire che tutto fosse perfetto, ma nel creare condizioni in cui migliorare senza umiliazione.'},
      {id:'e9-final',after:'e9y',scene:'Quando il teatro chiude',text:'Il Regista stabilì anche un orario di chiusura. Di notte le voci potevano lasciare appunti, ma non convocare prove infinite. La Stanchezza ricevette finalmente il compito di abbassare le luci e ricordare che molti giudizi diventano più duri quando il corpo ha bisogno di riposo. Alcuni problemi sarebbero stati affrontati meglio il giorno successivo, con un palco più stabile.'}
    ],
    'v2-8-10-scoperta-laboratorio': [
      {id:'s5-short',after:'s5y',includeInShort:true,includeInMedium:true,scene:'Il quaderno degli errori utili',text:'Ogni gruppo annotò anche misurazioni sbagliate, strumenti difettosi e procedure poco chiare. Invece di cancellarle, spiegò come erano state riconosciute. {{name}} scoprì che un buon quaderno scientifico non mostra soltanto il risultato finale: permette a un’altra persona di ricostruire il percorso, individuare debolezze e ripetere la prova senza dover indovinare i passaggi mancanti.'},
      {id:'s9-final',after:'s9y',scene:'La notizia troppo veloce',text:'Prima che i controlli fossero conclusi, un giornale annunciò che la stanza dei desideri era stata definitivamente spiegata. Il titolo attirò attenzione, ma semplificava risultati ancora parziali. {{name}} collaborò a una correzione che distingueva ciò che era stato osservato da ciò che restava ipotesi. Comunicare con prudenza richiedeva più parole, ma evitava che una conclusione provvisoria diventasse una certezza difficile da ritrattare.'}
    ],

    'v2-11-12-avventura-citta-nomi': [
      {id:'a7-short',after:'a7z',includeInShort:true,includeInMedium:true,scene:'Il diritto di non spiegarsi sempre',text:'Durante la prova, alcune persone pretendevano che {{name}} giustificasse ogni cambiamento e ogni contraddizione. {{name}} comprese che trasparenza non significa accesso illimitato alla propria interiorità. Poteva offrire spiegazioni quando erano necessarie a un rapporto o a un impegno, ma non doveva trasformare la propria identità in una presentazione continua. Anche il diritto alla privacy faceva parte della libertà di evolvere.'},
      {id:'a10-final',after:'a10z',scene:'Le generazioni successive',text:'Anni dopo, i bambini della città ricevevano quaderni invece di targhe definitive. Potevano annotare interessi, ruoli e cambiamenti, confrontando le versioni senza doverne rinnegare nessuna. Gli adulti continuavano a usare categorie per organizzare servizi, ma ogni modulo dichiarava il proprio scopo e permetteva correzioni. La riforma non eliminò i conflitti sull’identità; rese più difficile trasformare una descrizione amministrativa in destino personale.'}
    ],
    'v2-11-12-calma-ora-silenzio': [
      {id:'c7-short',after:'c7z',includeInShort:true,includeInMedium:true,scene:'La disponibilità concordata',text:'{{name}} aiutò una famiglia a distinguere presenza e reperibilità. Stabilì momenti in cui ciascuno avrebbe ascoltato davvero gli altri e momenti in cui era legittimo ritirarsi senza essere accusati di freddezza. Le conversazioni importanti non venivano più inserite tra notifiche e compiti. Avere confini prevedibili aumentò la fiducia, perché nessuno doveva conquistare attenzione attraverso urgenze artificiali.'},
      {id:'c8-final',after:'c8z',scene:'Il silenzio nello spazio pubblico',text:'La città progettò una biblioteca, un giardino e alcune carrozze dei trasporti con livelli di stimolo ridotti. Non erano luoghi obbligatori né spazi di lusso: offrivano un’alternativa accessibile a chi aveva bisogno di concentrazione o recupero. Le indicazioni spiegavano chiaramente le regole, evitando che il silenzio diventasse uno strumento per giudicare chi comunicava o si muoveva in modo diverso.'}
    ],
    'v2-11-12-emozioni-versioni': [
      {id:'e7-short',after:'e7z',includeInShort:true,includeInMedium:true,scene:'La versione che chiede aiuto',text:'Uno specchio mostrava una versione di {{name}} competente ma incapace di ammettere un limite. Aveva confuso autonomia con isolamento e trasformato ogni richiesta di aiuto in prova di insufficienza. Quando finalmente coinvolgeva altre persone, le soluzioni miglioravano e il peso diminuiva. {{name}} annotò che crescere non significa aver bisogno di sempre meno relazioni, ma imparare a scegliere sostegni adatti senza rinunciare alla responsabilità personale.'},
      {id:'e9-final',after:'e9z',scene:'Il futuro di chi ci sta accanto',text:'Le decisioni future non riguardavano soltanto {{name}}. Alcune avrebbero modificato relazioni, tempi e responsabilità condivise. La stanza mostrò conversazioni possibili con famiglia e amici: non per chiedere autorizzazione su ogni scelta, ma per comprendere conseguenze reciproche. Considerare gli altri non significava vivere secondo le loro aspettative; significava riconoscere che l’autonomia matura include anche la capacità di negoziare legami reali.'}
    ],
    'v2-11-12-scoperta-atlante': [
      {id:'s7-short',after:'s7z',includeInShort:true,includeInMedium:true,scene:'I limiti dell’autosservazione',text:'Il cartografo avvertì che anche le annotazioni personali potevano essere influenzate da memoria selettiva, desiderio di apparire coerenti e giornate eccezionali. {{name}} confrontò le proprie impressioni nel tempo e, quando opportuno, chiese osservazioni a persone fidate. Nessuna fonte possedeva la verità completa sull’identità, ma prospettive diverse potevano correggere punti ciechi senza sostituire la voce di chi viveva l’esperienza.'},
      {id:'s10-final',after:'s10z',scene:'L’atlante pubblico e le sue revisioni',text:'La biblioteca pubblicò versioni numerate dell’atlante, conservando le pagine precedenti e spiegando perché erano state corrette. I lettori potevano seguire l’evoluzione di una risposta e distinguere cambiamenti dovuti a nuove prove da quelli legati a nuovi valori. {{name}} apprezzò quella trasparenza: ammettere una revisione non indeboliva l’opera, mostrava il processo con cui una comunità prova a conoscere il mondo senza fingere di essere infallibile.'}
    ]
  };

  const catalog = global.FABLEA_STORIES_V2 || [];
  catalog.forEach(story => {
    const additions = supplements[story.id] || [];
    story.extensions = [...(story.extensions || []), ...additions];
  });

  global.FABLEA_STORY_SUPPLEMENTS = supplements;
})(window);
