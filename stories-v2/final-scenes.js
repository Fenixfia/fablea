(function(global){
  'use strict';

  const finalScenes = {
    'v2-5-7-emozioni-nodo-parole': [
      {id:'e8-close',after:'e8-final',scene:'Una frase da ricordare',text:'Prima di lasciare il laboratorio, {{name}} scrisse su un cartoncino: «Posso dire la verità senza ferire e ascoltare senza cancellarmi». Non era una formula magica, ma un promemoria per le conversazioni in cui il nodo sarebbe tornato.'}
    ],
    'v2-5-7-scoperta-mappa-domande': [
      {id:'s8-close',after:'s8-final',scene:'La domanda del giorno dopo',text:'La mappa lasciò un angolo vuoto per una domanda futura. {{name}} capì che una buona esplorazione non termina quando si arriva, ma quando ciò che si è scoperto permette di osservare meglio la tappa successiva.'}
    ],
    'v2-8-10-avventura-archivio-strade': [
      {id:'a9-close',after:'a9-final',scene:'Il patto dei viaggiatori',text:'Chi riceveva una mappa firmava un patto semplice: prepararsi, rispettare i luoghi attraversati, condividere informazioni utili e chiedere aiuto prima che un problema diventasse emergenza. La libertà di scegliere una strada cresceva insieme alla responsabilità verso chi l’avrebbe percorsa dopo.'}
    ],
    'v2-8-10-calma-luci': [
      {id:'c9-close',after:'c9-final',scene:'Il cielo come bene comune',text:'Gli abitanti inserirono il cielo notturno tra i beni da proteggere, come l’acqua e i giardini. Non apparteneva soltanto agli astronomi: influenzava riposo, animali, paesaggio e memoria collettiva. Ogni nuovo progetto luminoso avrebbe dovuto spiegare non soltanto quanto illuminava, ma anche dove terminava la propria luce. Le scuole iniziarono a osservare il cielo prima e dopo gli interventi, raccogliendo dati e racconti. In questo modo le decisioni future avrebbero potuto basarsi su effetti misurati, non soltanto su promesse o abitudini.'}
    ],
    'v2-8-10-emozioni-teatro-voci': [
      {id:'e9-close',after:'e9-final',scene:'Il pubblico interiore',text:'{{name}} notò infine che alcune voci recitavano per un pubblico immaginario, composto da persone che forse non stavano nemmeno giudicando. Spegnere quelle poltrone vuote liberò energia. Le decisioni potevano considerare gli altri senza trasformare ogni gesto in uno spettacolo da approvare.'}
    ],
    'v2-8-10-scoperta-laboratorio': [
      {id:'s9-close',after:'s9-final',scene:'La domanda dopo la pubblicazione',text:'Dopo aver corretto la notizia, il laboratorio aprì una pagina pubblica per domande e repliche. Alcune critiche rivelarono dettagli trascurati, altre derivavano da incomprensioni che richiedevano spiegazioni migliori. Rendere il metodo visibile permise alle persone di valutare il lavoro senza dover scegliere tra fiducia cieca e sospetto totale. I ricercatori pubblicarono anche i dati essenziali e le istruzioni del test, così altri gruppi potevano controllare il risultato. La trasparenza non garantiva l’assenza di errori, ma rendeva possibile individuarli e correggerli.'}
    ],
    'v2-11-12-avventura-citta-nomi': [
      {id:'a10-close',after:'a10-final',scene:'Un nome usato con cura',text:'{{name}} continuò a usare parole per descriversi, ma iniziò a trattarle come strumenti temporanei: abbastanza precise per comunicare, mai abbastanza complete da sostituire una persona. Questa differenza cambiava il modo di presentarsi e anche quello di ascoltare gli altri. Prima di assegnare un’etichetta, imparò a chiedere quale significato avesse per chi la portava e se fosse ancora adatta al momento presente.'}
    ],
    'v2-11-12-calma-ora-silenzio': [
      {id:'c7-every',after:'c7-short',includeInShort:true,includeInMedium:true,scene:'Il corpo manda segnali',text:'{{name}} imparò a riconoscere i segnali che precedevano il sovraccarico: irritazione davanti a richieste minime, difficoltà a completare una frase, impulso a controllare senza motivo e sensazione di non riuscire mai a iniziare davvero. Intervenire in quel momento con una pausa, acqua, movimento o silenzio era più efficace che aspettare di essere completamente esausto.'},
      {id:'c10-close',after:'c10z',scene:'Una cultura che permette di fermarsi',text:'Con il tempo, scuole e luoghi di lavoro smisero di premiare automaticamente chi rispondeva a ogni ora. Valutavano chiarezza, affidabilità e qualità, non la presenza continua. Questo rese più semplice proteggere le pause anche per chi aveva meno possibilità di imporre confini individuali. Il riposo cessò di essere un privilegio negoziato in segreto e divenne una parte visibile dell’organizzazione comune. Vennero creati tempi realistici di risposta, sostituzioni per le assenze e momenti in cui nessuno era tenuto a controllare messaggi. I responsabili impararono a non costruire sistemi che funzionassero soltanto grazie alla disponibilità costante delle persone. Quando una vera emergenza richiedeva attenzione, esistevano turni chiari e compensazioni, così l’eccezione non diventava la regola quotidiana.'}
    ],
    'v2-11-12-emozioni-versioni': [
      {id:'e7-every',after:'e7-short',includeInShort:true,includeInMedium:true,scene:'Il desiderio sotto l’obiettivo',text:'{{name}} provò a separare l’obiettivo dalla ragione per cui lo desiderava. Dietro una professione potevano esserci curiosità, riconoscimento, stabilità o desiderio di aiutare; dietro un viaggio libertà, scoperta o fuga. Conoscere il bisogno sottostante apriva più strade per soddisfarlo e rendeva meno terribile l’idea che una forma precisa potesse cambiare.'},
      {id:'e10-close',after:'e10z',scene:'La libertà di aggiornare la promessa',text:'Alla scadenza stabilita, {{name}} avrebbe potuto continuare, modificare o interrompere l’esperimento spiegandone le ragioni. Cambiare decisione davanti a nuove informazioni non equivaleva a non avere carattere. La coerenza più importante non era restare identici, ma mantenere un rapporto onesto con valori, conseguenze e realtà disponibile. Per valutare l’esperienza, {{name}} avrebbe considerato non soltanto risultati e approvazione, ma anche energia, curiosità, relazioni e costi sostenuti. Una scelta poteva essere valida per un periodo e smettere di esserlo senza diventare retroattivamente falsa. Conservare traccia delle ragioni del cambiamento avrebbe impedito alla memoria di trasformare ogni revisione in una sconfitta.'}
    ],
    'v2-11-12-scoperta-atlante': [
      {id:'s7-every',after:'s7-short',includeInShort:true,includeInMedium:true,scene:'La responsabilità di condividere',text:'Prima di diffondere una conclusione, {{name}} iniziò a chiedersi quanto fosse solida e quale danno avrebbe potuto produrre se falsa. Non ogni incertezza richiedeva silenzio, ma il linguaggio doveva rispecchiare il livello delle prove. “È dimostrato”, “sembra probabile” e “sto esplorando questa ipotesi” non erano formule equivalenti. Anche il contesto contava: un’idea innocua raccontata tra amici richiedeva cautele diverse da un consiglio capace di influenzare salute, sicurezza o reputazione. La responsabilità aumentava insieme alle possibili conseguenze.'},
      {id:'s10-close',after:'s10-final',scene:'La comunità delle domande difficili',text:'L’atlante creò gruppi in cui persone con competenze e prospettive differenti esaminavano le pagine più controverse. Nessuno possedeva da solo tutti gli strumenti. Il confronto funzionava quando le regole premiavano fonti verificabili, correzioni esplicite e capacità di rappresentare correttamente la posizione altrui prima di criticarla. Le riunioni terminavano con un registro delle questioni risolte, di quelle ancora aperte e delle prove che avrebbero potuto cambiare il quadro. In questo modo il disaccordo non si trasformava automaticamente in scontro personale e il lavoro poteva continuare anche senza una conclusione immediata.'}
    ]
  };

  const catalog = global.FABLEA_STORIES_V2 || [];
  catalog.forEach(story => {
    const additions = finalScenes[story.id] || [];
    const existing = new Set((story.extensions || []).map(page => page.id));
    story.extensions = [...(story.extensions || []), ...additions.filter(page => !existing.has(page.id))];
  });

  global.FABLEA_STORY_FINAL_SCENES = finalScenes;
})(window);
