function fableaExpandStory(story){
  const openings = {
    forest:[
      "Il mondo di FABLEA si aprì piano, tra foglie scure, luci piccole e un sentiero che sembrava aspettare proprio quel momento.",
      "L’aria profumava di bosco, terra morbida e cose appena immaginate."
    ],
    ocean:[
      "Il mondo di FABLEA si aprì con il suono lento dell’acqua.",
      "Il mare non correva. Respirava piano, come se custodisse una storia sotto ogni onda."
    ],
    sky:[
      "Il cielo di FABLEA si abbassò dolcemente, pieno di nuvole, luce e strade sospese.",
      "Sembrava un posto dove anche i pensieri potevano camminare piano."
    ],
    space:[
      "La notte di FABLEA si accese lentamente.",
      "Le stelle non brillavano tutte insieme: una dopo l’altra, come se stessero preparando un piccolo teatro nel cielo."
    ],
    bridge:[
      "Davanti a {{name}} comparve un luogo sospeso tra due mondi.",
      "Non era ancora chiaro se fosse una strada, una domanda o una scelta. Forse era tutte e tre le cose."
    ],
    castle:[
      "FABLEA aprì una porta antica, nascosta tra luce, silenzio e polvere dorata.",
      "Dietro quella porta c’era un luogo che sembrava ricordare ogni bambino passato di lì."
    ]
  };

  const middles = {
    forest:[
      "Ogni passo faceva nascere un piccolo suono: una foglia, una radice, una luce nascosta.",
      "E più {{name}} avanzava, più il mondo sembrava diventare familiare."
    ],
    ocean:[
      "Le onde raccontavano senza parole. Andavano e tornavano, come pensieri che imparano a calmarsi.",
      "{{name}} ascoltò quel ritmo e sentì che anche l’avventura poteva essere gentile."
    ],
    sky:[
      "Le nuvole cambiavano forma lentamente, mostrando strade, finestre e piccole aperture luminose.",
      "Ogni cosa lassù sembrava dire: guarda meglio, ma senza fretta."
    ],
    space:[
      "Il cielo era pieno di piccole distanze luminose.",
      "{{name}} capì che non tutte le cose lontane fanno paura. Alcune chiamano soltanto piano."
    ],
    bridge:[
      "Il passaggio non chiedeva velocità. Chiedeva presenza.",
      "{{name}} fece un respiro e lasciò che il luogo mostrasse il passo successivo."
    ],
    castle:[
      "Le pareti sembravano custodire voci antiche e promesse leggere.",
      "Ogni stanza aveva una luce diversa, come se ogni porta proteggesse una piccola possibilità."
    ]
  };

  const endings = {
    forest:[
      "Quando la storia cominciò a chiudersi, il bosco non sparì.",
      "Rimase una piccola luce tra le radici, pronta per il prossimo ritorno."
    ],
    ocean:[
      "Quando il mare tornò calmo, una piccola traccia luminosa rimase sulla riva.",
      "FABLEA non aveva finito davvero: aveva solo abbassato la voce."
    ],
    sky:[
      "Le nuvole si richiusero piano, ma una piccola apertura rimase nel cielo.",
      "Da lì, un giorno, sarebbe potuta iniziare un’altra storia."
    ],
    space:[
      "Le stelle tornarono al loro posto, ma una luce restò un po’ più vicina.",
      "Era il segno che il viaggio non era stato solo immaginato: era stato vissuto."
    ],
    bridge:[
      "Il ponte rimase alle spalle, acceso da piccole luci.",
      "{{name}} non aveva risolto tutto, ma aveva attraversato qualcosa di importante."
    ],
    castle:[
      "La porta del castello si chiuse senza rumore.",
      "Ma una chiave, una parola o una luce restò con {{name}}, pronta a riaprire il mondo."
    ]
  };

  const art = story.art || "space";
  const intro = openings[art] || openings.space;
  const middle = middles[art] || middles.space;
  const ending = endings[art] || endings.space;

  const original = story.paragraphs || [];
  const expanded = [
    intro[0],
    intro[1],
    ...original.slice(0, Math.ceil(original.length / 2)),
    middle[0],
    middle[1],
    ...original.slice(Math.ceil(original.length / 2)),
    ending[0],
    ending[1],
    "Prima di uscire dal mondo, {{name}} si fermò un istante.",
    "C’era qualcosa da lasciare acceso: una piccola traccia, un oggetto, una luce gentile.",
    "Non serviva spiegare tutto. Bastava ricordare che quel luogo poteva essere ritrovato.",
    "E così FABLEA rimase lì, silenziosa e viva, in attesa della prossima pagina."
  ];

  return {
    ...story,
    paragraphs: expanded
  };
}

function S(story){
  return fableaExpandStory(story);
}

window.FABLEA_STORIES = {

"2-4":[

S({
title:"{{name}} e il lupo dal vocione",
subtitle:"Una storia morbida dove la paura diventa gentilezza.",
icon:"🌙 🐺 ✨",
art:"forest",
scene:"🌲 🐺 ✨",
keywords:["lupo","bosco","paura","gentilezza"],
ritual:"⭐ Stella luminosa",
activity:"Costruisci una piccola tana morbida per il lupo gentile.",
paragraphs:[
"Nel bosco morbido, quando la luna saliva piano piano, {{name}} sentì un rumore grande tra le foglie.",
"Era un rumore rotondo, profondo, un po’ tremolante.",
"Poi arrivò una voce enorme: “GROOOOAR”.",
"Dietro un albero comparve un lupo con zampe grandi, coda folta e occhi dolci.",
"Il lupo abbassò la testa perché aveva capito di aver fatto paura.",
"{{name}} trovò una piccola luce sotto una foglia e la mise vicino al lupo.",
"Il lupo respirò una volta. Poi un’altra. Poi un’altra ancora.",
"Alla fine disse piano: “Buonasera”.",
"Il bosco capì che anche una voce grande può diventare morbida."
]
}),

S({
title:"{{name}} e la piccola luce",
subtitle:"Una storia visiva, morbida e rassicurante.",
icon:"🌙 ✨ 🧸",
art:"space",
scene:"🌙 ✨ 🧸",
keywords:["luce","luna","calma","orsetto"],
ritual:"🌙 Luna silenziosa",
activity:"Accendi una piccola luce morbida e raccontale dove deve brillare.",
paragraphs:[
"Vicino a {{name}} comparve una piccola luce.",
"Non arrivò all’improvviso. Prima sembrò un puntino, poi una goccia dorata.",
"La luce non correva. Non saltava. Non faceva rumore.",
"Poco dopo arrivò un orsetto morbido con una sciarpa piccola.",
"Poi arrivò una nuvola bianca e una stellina fece cucù.",
"Tutti si sedettero vicino a {{name}}.",
"Nessuno aveva fretta.",
"La piccola luce sembrava dire: “Sono qui”.",
"{{name}} sentì che il mondo era abbastanza illuminato per essere sicuro."
]
}),

S({
title:"{{name}} e la balena luminosa",
subtitle:"Una balena gentile illumina il mare calmo.",
icon:"🐋 🌊 ✨",
art:"ocean",
scene:"🐋 🌊 ✨",
keywords:["balena","mare","oceano","calma"],
ritual:"🌊 Conchiglia calma",
activity:"Disegna una grande balena e tre stelline che dormono nel mare.",
paragraphs:[
"Nel mare calmo di FABLEA viveva una balena che brillava piano.",
"Ogni sera la balena saliva vicino alla riva e il mare diventava più tranquillo.",
"{{name}} la vide comparire quando il cielo stava diventando color notte.",
"La balena fece un suono basso, come una ninna nanna dentro l’acqua.",
"“Vuoi vedere dove dormono le stelle cadute?” chiese.",
"{{name}} la seguì fino a una grotta d’acqua chiara.",
"Dentro la grotta, tante stelline riposavano come piccole lanterne.",
"La balena regalò a {{name}} una conchiglia blu."
]
}),

S({
title:"{{name}} e la nuvola lenta",
subtitle:"Una nuvola insegna la bellezza del non correre.",
icon:"☁️ 🌤️ ✨",
art:"sky",
scene:"☁️ ✨ 🌤️",
keywords:["nuvola","riposo","cielo","calma"],
ritual:"☁️ Nuvola morbida",
activity:"Disegna una nuvola grande e soffice, poi inventa dove sta andando.",
paragraphs:[
"Nel cielo di FABLEA c’era una nuvola che andava più piano di tutte.",
"Le altre nuvole cambiavano forma in fretta. Lei no.",
"Lei restava tonda, morbida, tranquilla.",
"{{name}} la guardò a lungo.",
"La nuvola scese un pochino più in basso.",
"“Perché vai così piano?” chiese {{name}}.",
"“Perché alcune cose belle si vedono solo quando non si corre,” rispose la nuvola.",
"La nuvola mostrò un uccellino nascosto, una luce dietro una foglia e un fiore che si apriva lentamente."
]
}),

S({
title:"{{name}} e l’orsetto del sonno",
subtitle:"Un orsetto guida verso un ritmo lento e sicuro.",
icon:"🧸 🌙 💤",
art:"space",
scene:"🧸 🌙 💤",
keywords:["orsetto","sonno","riposo","calma"],
ritual:"🧸 Amico morbido",
activity:"Scegli un peluche e inventa il suo posto sicuro.",
paragraphs:[
"{{name}} incontrò un orsetto con una coperta piccola sulle spalle.",
"L’orsetto camminava piano, così piano che anche il vento abbassò la voce.",
"“Vado sul sentiero del riposo,” disse l’orsetto.",
"Il sentiero era fatto di piccole luci, cuscini di nuvola e foglie morbide.",
"La prima luce disse: “Lascia qui la fretta”.",
"La seconda disse: “Lascia qui il rumore”.",
"La terza disse: “Porta solo un pensiero gentile”.",
"Alla fine del sentiero c’era una casetta fatta di luna e silenzio."
]
}),

S({
title:"{{name}} e il giardino addormentato",
subtitle:"Un giardino si sveglia con piccoli gesti gentili.",
icon:"🌷 💤 ✨",
art:"forest",
scene:"🌷 🐞 ✨",
keywords:["giardino","fiori","natura","gentilezza"],
ritual:"🌷 Semino dorato",
activity:"Disegna un fiore addormentato e poi sveglialo con un colore.",
paragraphs:[
"{{name}} trovò un giardino dove tutti i fiori dormivano.",
"Dormivano i tulipani, le margherite e le violette piccole vicino al sentiero.",
"Una coccinella con un cappellino rosso uscì da sotto una foglia.",
"“Qui si sveglia tutto con gentilezza,” disse.",
"{{name}} soffiò piano su un fiore chiuso.",
"Il fiore aprì un petalo.",
"Poi una foglia fece una goccia luminosa.",
"Poco alla volta, il giardino cominciò a svegliarsi."
]
}),

S({
title:"{{name}} e la stellina silenziosa",
subtitle:"Una stellina insegna che anche il silenzio può brillare.",
icon:"⭐ 🤫 🌙",
art:"space",
scene:"⭐ 🌙 🤫",
keywords:["stella","silenzio","luna","calma"],
ritual:"⭐ Stella silenziosa",
activity:"Cerca nella stanza un oggetto silenzioso e dagli un nome magico.",
paragraphs:[
"Nel cielo di FABLEA c’era una stellina che non parlava mai.",
"Le altre stelline facevano scintille, risatine e piccoli suoni luminosi.",
"Lei invece brillava in silenzio.",
"{{name}} la vide subito.",
"La stellina scese piano fino a posarsi su una coperta di luna.",
"“Non parli?” chiese {{name}}.",
"La stellina non rispose con parole.",
"Fece una luce morbida, più calda, più vicina."
]
}),

S({
title:"{{name}} e il coniglio della sera",
subtitle:"Un coniglio prepara il mondo con piccoli gesti lenti.",
icon:"🐰 🌙 🕯️",
art:"forest",
scene:"🐰 🌙 🕯️",
keywords:["coniglio","sera","rituale","luna"],
ritual:"🕯️ Lucina della sera",
activity:"Prepara tre oggetti piccoli per chiudere la giornata: luce, peluche, coperta.",
paragraphs:[
"Quando il cielo diventò color miele, un coniglio bianco comparve davanti a {{name}}.",
"Aveva una piccola borsa piena di cose lente.",
"Dentro c’erano una piuma, una stella, una foglia, una lucina e un campanellino.",
"“Ogni sera preparo il mondo a riposare,” disse il coniglio.",
"Prima mise la piuma sotto una nuvola.",
"Poi mise la stella vicino alla luna.",
"Poi sistemò la foglia sopra un sasso.",
"{{name}} lo aiutò ad accendere la lucina più piccola."
]
}),

S({
title:"{{name}} e il pesciolino dorato",
subtitle:"Una piccola creatura insegna a seguire una luce calma.",
icon:"🐠 ✨ 🌊",
art:"ocean",
scene:"🐠 ✨ 🌊",
keywords:["pesce","mare","luce","acqua"],
ritual:"🐚 Perla calma",
activity:"Disegna un pesciolino e tre bolle luminose.",
paragraphs:[
"In una pozzanghera grande come un piccolo mare, {{name}} vide un pesciolino dorato.",
"Il pesciolino nuotava piano e lasciava dietro di sé tre bolle luminose.",
"La prima bolla era piccola.",
"La seconda era tonda.",
"La terza brillava come una perla.",
"“Dove vai?” chiese {{name}}.",
"“Cerco una luce che non abbia fretta,” rispose il pesciolino.",
"Sul fondo comparve una perla calma."
]
}),

S({
title:"{{name}} e la porta piccolissima",
subtitle:"Una porta minuscola apre un mondo grande ma gentile.",
icon:"🚪 ✨ 🐭",
art:"forest",
scene:"🚪 ✨ 🐭",
keywords:["porta","topolino","scoperta","bosco"],
ritual:"🚪 Chiave gentile",
activity:"Disegna una porta minuscola e cosa c’è dietro.",
paragraphs:[
"{{name}} trovò una porta piccolissima vicino a una radice.",
"Era così piccola che sembrava fatta per una formica elegante.",
"La porta aveva una maniglia dorata grande come una briciola.",
"Da dietro arrivò un toc toc leggero.",
"Poi uscì un topolino con una chiave grande quasi quanto lui.",
"“Questa porta si apre solo se si bussa piano,” disse il topolino.",
"{{name}} bussò con un dito leggero.",
"Dietro la porta c’era una stanza piena di lucine che aspettavano in silenzio."
]
})

],

"5-7":[

S({
title:"{{name}} e la mappa luminosa",
subtitle:"Una storia di esplorazione, piccoli passi e meraviglia.",
icon:"📖 🗺️ ✨",
art:"forest",
scene:"🦊 🗺️ ✨",
keywords:["mappa","bosco","volpe","avventura"],
ritual:"🗺️ Mappa dorata",
activity:"Disegna una nuova parte della mappa.",
paragraphs:[
"{{name}} trovò un libro dimenticato sopra un tavolo.",
"Quando lo aprì, dentro c’era una mappa che brillava piano.",
"Sulla mappa comparivano sentieri, alberi e piccole stelle.",
"Tra le radici del bosco comparve una volpe gentile.",
"“Non bisogna correre per vivere un’avventura,” disse la volpe.",
"{{name}} seguì la volpe fino a una radura dove le foglie facevano luce sotto le scarpe.",
"In mezzo alla radura c’era una lanterna sospesa nel vuoto.",
"Quando {{name}} la toccò, sulla mappa apparve un nuovo sentiero.",
"Il nuovo sentiero attraversava un ponte sopra un lago nero e lucido.",
"Alla fine del ponte comparve una casa con il tetto blu.",
"Dentro c’era un vecchio cartografo.",
"“Le mappe più importanti non mostrano dove andare,” disse. “Mostrano chi stai diventando.”"
]
}),

S({
title:"{{name}} e il treno delle stelle",
subtitle:"Un viaggio notturno attraverso il cielo.",
icon:"🚂 ⭐ 🌌",
art:"space",
scene:"🚂 ⭐ 🌌",
keywords:["treno","stelle","spazio","viaggio"],
ritual:"⭐ Biglietto stellare",
activity:"Disegna la tua carrozza ideale del treno delle stelle.",
paragraphs:[
"La notte in cui il cielo sembrava più vicino, {{name}} sentì un fischio dietro la finestra.",
"Fuori c’era un piccolo treno blu fermo sopra un binario fatto di luce.",
"Il capotreno era un gufo con occhiali tondi e un orologio d’oro.",
"“Biglietto?” chiese.",
"“Non ce l’ho,” rispose {{name}}.",
"Il gufo sorrise. “Per salire basta una domanda vera.”",
"{{name}} fece la sua domanda al cielo.",
"Il gufo timbrò un biglietto stellare comparso dal nulla.",
"Appena il treno partì, le case diventarono piccole e il cielo si aprì come un oceano.",
"La prima stazione era fatta di lune addormentate.",
"La seconda custodiva nuvole che ricordavano sogni dimenticati.",
"Nella terza viveva un uomo che riparava stelle rotte con filo d’argento."
]
}),

S({
title:"{{name}} e il castello sospeso",
subtitle:"Un castello nel cielo custodisce una chiave speciale.",
icon:"🏰 ☁️ ✨",
art:"castle",
scene:"🏰 ☁️ ✨",
keywords:["castello","nuvole","chiave","cielo"],
ritual:"🗝️ Chiave del cielo",
activity:"Disegna il castello sospeso e la sua porta segreta.",
paragraphs:[
"Tra due nuvole altissime, {{name}} vide un castello sospeso nel cielo.",
"Non era appoggiato a nulla. Restava in aria grazie a fili sottili di luce dorata.",
"Le torri sembravano fatte di vento e pietra insieme.",
"Alla porta c’era una piccola chiave appesa a un filo.",
"Un cavaliere con un mantello blu stava seduto sui gradini.",
"“Questa porta non si apre con la forza,” spiegò.",
"{{name}} provò parole enormi, complicate e rumorose.",
"Ma la porta restò chiusa.",
"Poi disse una parola semplice.",
"La porta si illuminò immediatamente.",
"Dentro c’erano mappe, telescopi e stelle sospese dentro barattoli di vetro.",
"Nel salone centrale dormiva un drago bianco gigantesco."
]
}),

S({
title:"{{name}} e il guardiano del faro",
subtitle:"Una luce nel mare guida chi si è perso.",
icon:"🌊 🕯️ 🌙",
art:"ocean",
scene:"🌊 🕯️ 🌙",
keywords:["mare","faro","oceano","luce"],
ritual:"🕯️ Luce del faro",
activity:"Disegna il faro e la sua luce sul mare.",
paragraphs:[
"In mezzo al mare di FABLEA esisteva un faro che non compariva sulle mappe normali.",
"Compariva solo quando qualcuno aveva bisogno di una luce.",
"Una sera {{name}} vide il mare illuminarsi in lontananza.",
"Vicino alle onde c’era una piccola barca che sembrava aspettare.",
"{{name}} salì e il mare cominciò a muoversi lentamente.",
"Il faro era altissimo.",
"In cima viveva il guardiano del faro, con capelli bianchi e occhi gentili.",
"“La mia luce non serve alle navi,” spiegò. “Serve ai pensieri che si sentono persi.”",
"{{name}} aiutò il guardiano a girare la gigantesca ruota della luce.",
"Quando la lanterna si accese, il cielo e il mare sembrarono respirare insieme."
]
}),

S({
title:"{{name}} e la biblioteca segreta",
subtitle:"Una biblioteca che custodisce storie vive.",
icon:"📚 ✨ 🌙",
art:"castle",
scene:"📚 ✨ 🌙",
keywords:["biblioteca","libri","storie","magia"],
ritual:"📖 Pagina dorata",
activity:"Inventa il titolo di un nuovo libro magico.",
paragraphs:[
"Nascosta dietro una parete piena di edera viveva una biblioteca segreta.",
"Le sue finestre brillavano solo di notte.",
"Quando {{name}} entrò, i libri si mossero leggermente sugli scaffali.",
"Non erano libri normali.",
"Respiravano piano.",
"Una bibliotecaria con lunghi capelli argentati si avvicinò sorridendo.",
"“Qui custodiamo storie vive,” spiegò.",
"{{name}} aprì un volume enorme con la copertina blu.",
"All’interno non c’erano solo parole: c’erano cieli, oceani, castelli e città intere.",
"La bibliotecaria mostrò una stanza piena di libri ancora vuoti.",
"“Questi aspettano bambini pronti a immaginare qualcosa che ancora non esiste.”"
]
}),

S({
title:"{{name}} e il drago delle lanterne",
subtitle:"Un drago custodisce luci perdute.",
icon:"🐉 🏮 ✨",
art:"castle",
scene:"🐉 🏮 ✨",
keywords:["drago","lanterne","luce","castello"],
ritual:"🏮 Lanterna dorata",
activity:"Disegna una lanterna magica.",
paragraphs:[
"Sopra una montagna altissima viveva un drago che collezionava lanterne.",
"Ogni lanterna custodiva una luce diversa.",
"Una notte {{name}} vide il cielo riempirsi di piccoli punti dorati.",
"Seguendo quelle luci arrivò fino alla montagna del drago.",
"Il drago era enorme, ma aveva occhi tranquilli.",
"“Le persone pensano che io custodisca tesori,” disse. “In realtà custodisco luci.”",
"Mostrò una lanterna azzurra che conteneva il coraggio.",
"Una lanterna verde custodiva la calma.",
"Una piccola lanterna rossa custodiva la speranza.",
"Il drago spiegò che alcune luci si spengono se nessuno le guarda più.",
"Per questo ogni notte volava sopra FABLEA per raccogliere le luci dimenticate."
]
}),

S({
title:"{{name}} e il ponte di carta",
subtitle:"Un ponte fragile porta verso un posto speciale.",
icon:"🌉 📜 ✨",
art:"bridge",
scene:"🌉 📜 ✨",
keywords:["ponte","carta","città","viaggio"],
ritual:"📜 Foglio del coraggio",
activity:"Costruisci un piccolo ponte con carta o cartoncino.",
paragraphs:[
"Tra due colline lontane esisteva un ponte fatto interamente di carta.",
"Sembrava fragile. Troppo fragile per attraversarlo.",
"Ma ogni volta che qualcuno faceva un passo sincero, il ponte diventava più forte.",
"{{name}} guardò in basso.",
"Sotto il ponte scorreva un fiume pieno di stelle riflesse.",
"All’inizio il vento muoveva i fogli del ponte facendoli tremare.",
"Poi comparve una ragazza con un mantello argentato.",
"“Questo ponte non regge chi ha fretta,” spiegò. “Regge chi ascolta.”",
"{{name}} fece il primo passo lentamente.",
"Il foglio sotto i piedi brillò di luce bianca.",
"Più il viaggio continuava, più il ponte diventava stabile."
]
}),

S({
title:"{{name}} e il mercato della luna",
subtitle:"Un luogo notturno dove si vendono cose impossibili.",
icon:"🌙 🏮 ✨",
art:"sky",
scene:"🌙 🏮 ✨",
keywords:["mercato","luna","magia","notte"],
ritual:"🌙 Moneta lunare",
activity:"Inventa una bancarella magica.",
paragraphs:[
"Una notte {{name}} trovò una scala nascosta dietro una nuvola.",
"La scala saliva fino a una piazza illuminata da centinaia di lanterne.",
"Era il mercato della luna.",
"Non vendeva pane o vestiti.",
"Vendeva cose impossibili.",
"C’era una bancarella di sogni lucidi.",
"Una vendeva bottiglie piene di pioggia estiva.",
"Un vecchio signore vendeva ricordi felici dimenticati sotto i letti.",
"Una bambina con capelli argentati vendeva piccoli pezzi di aurora boreale.",
"Al centro del mercato c’era una fontana che invece dell’acqua aveva stelle liquide.",
"Il mercante della luna regalò a {{name}} una moneta dorata."
]
}),

S({
title:"{{name}} e la nave tra le nuvole",
subtitle:"Una nave volante attraversa il cielo.",
icon:"☁️ ⛵ ✨",
art:"sky",
scene:"☁️ ⛵ ✨",
keywords:["nave","nuvole","cielo","viaggio"],
ritual:"⛵ Bussola del cielo",
activity:"Disegna una nave volante.",
paragraphs:[
"Sopra FABLEA esisteva una nave che navigava tra le nuvole.",
"Le sue vele erano fatte di vento e il suo legno profumava di pioggia.",
"{{name}} la vide passare lentamente sopra le montagne.",
"Dal ponte salutava un capitano con un grande cappello blu.",
"“Vuoi salire?” chiese.",
"La nave attraversava tempeste morbide e oceani di cielo.",
"Ogni nuvola aveva una forma diversa: draghi, castelli, balene e città sospese.",
"Il capitano mostrò a {{name}} una stanza piena di mappe del cielo.",
"“Le persone credono che le nuvole cambino sempre,” disse. “Ma alcune strade restano.”",
"Più la nave saliva, più il cielo diventava silenzioso."
]
}),

S({
title:"{{name}} e il giardino delle lucciole",
subtitle:"Un luogo dove le luci raccontano storie.",
icon:"✨ 🌿 🐞",
art:"forest",
scene:"✨ 🌿 🐞",
keywords:["lucciole","giardino","bosco","notte"],
ritual:"✨ Lucciola gentile",
activity:"Disegna un giardino pieno di lucciole.",
paragraphs:[
"Nel cuore del bosco esisteva un giardino che si illuminava solo di notte.",
"Non aveva lampade. Non aveva candele.",
"A illuminarlo erano migliaia di lucciole.",
"Ogni lucciola custodiva una storia.",
"Quando {{name}} entrò nel giardino, le luci si alzarono lentamente in aria.",
"Una lucciola blu raccontava storie di oceani lontani.",
"Una verde raccontava foreste dimenticate.",
"Una dorata raccontava di bambini che avevano trovato coraggio nei momenti difficili.",
"Il custode del giardino era un vecchio con una lanterna spenta.",
"“La mia lanterna si accende solo quando qualcuno ascolta davvero,” spiegò.",
"{{name}} rimase fermo ad ascoltare il rumore delle lucciole."
]
})

],

"8-10":[

S({
title:"{{name}} e il ponte delle scelte",
subtitle:"Una storia su emozioni, fiducia e piccoli cambiamenti interiori.",
icon:"🌉 💛 🌙",
art:"bridge",
scene:"🌉 💛 🌙",
keywords:["ponte","scelte","fiducia","emozioni"],
ritual:"💛 Luce della fiducia",
activity:"Disegna tre luci: coraggio, gentilezza e fiducia.",
paragraphs:[
"Nel cuore di una città segreta, {{name}} trovò un ponte sospeso tra due colline.",
"Non era fatto di legno né di pietra. Era fatto di scelte.",
"Ogni tavola brillava quando qualcuno diceva qualcosa di vero a se stesso.",
"Sotto il ponte scorreva un fiume calmo. Nell’acqua non si vedevano pesci, ma pensieri.",
"Si vedeva una paura piccola, poi una domanda, poi un desiderio che non aveva ancora trovato parole.",
"Dopo una giornata {{mood}}, quel fiume sembrava più vicino.",
"Una voce leggera arrivò dal vento: “Il ponte non ama la fretta. Ama la verità.”",
"Sul ponte comparvero tre luci: coraggio, gentilezza e fiducia.",
"{{name}} capì che non doveva scegliere la luce più grande. Doveva scegliere quella più vera.",
"Quando fece il primo passo, il ponte vibrò piano."
]
}),

S({
title:"{{name}} e il teatro delle emozioni",
subtitle:"Le emozioni salgono sul palco una alla volta.",
icon:"🎭 ✨ 💛",
art:"bridge",
scene:"🎭 🌙 ✨",
keywords:["teatro","emozioni","rabbia","paura"],
ritual:"🎭 Maschera gentile",
activity:"Disegna il volto di un’emozione e dagli un nome.",
paragraphs:[
"Il teatro delle emozioni apriva solo quando qualcuno aveva troppe cose dentro.",
"{{name}} trovò il biglietto in tasca senza sapere come fosse arrivato lì.",
"Era un biglietto color crema con una scritta sottile: “Questa sera parlano loro.”",
"Il teatro era nascosto dietro una porta rossa.",
"Dentro, le poltrone erano vuote e il palco era illuminato da una sola luce.",
"Per prima salì la Rabbia, con scarpe rumorose e un mantello rosso.",
"Non urlò. Disse soltanto: “Sono stanca di essere fraintesa.”",
"Poi salì la Paura, con una coperta tra le mani.",
"Poi arrivò la Gioia, piccola, luminosa e un po’ timida."
]
}),

S({
title:"{{name}} e la città degli specchi",
subtitle:"Una città riflette non l’aspetto, ma ciò che si porta dentro.",
icon:"🪞 🏙️ ✨",
art:"bridge",
scene:"🪞 🏙️ ✨",
keywords:["specchio","identità","città","crescita"],
ritual:"🪞 Specchio sincero",
activity:"Scrivi o disegna una qualità che vuoi ricordare.",
paragraphs:[
"La città degli specchi apparve a {{name}} dopo una curva che non c’era il giorno prima.",
"Le strade erano pulite, silenziose, illuminate da lampioni argentati.",
"Ogni palazzo aveva finestre lucide come acqua ferma.",
"Ma quegli specchi non riflettevano il viso.",
"Riflettevano ciò che una persona portava dentro.",
"In uno specchio {{name}} vide una paura nascosta dietro un sorriso.",
"In un altro vide una speranza piccola, ma ostinata.",
"In un altro ancora vide una versione di sé più coraggiosa.",
"Una ragazza con un cappello rosso disse: “Qui gli specchi non giudicano. Mostrano.”"
]
}),

S({
title:"{{name}} e il drago che non ruggiva",
subtitle:"Un drago trova una forza diversa dalla voce forte.",
icon:"🐉 💛 🌿",
art:"forest",
scene:"🐉 💛 🌿",
keywords:["drago","voce","forza","autostima"],
ritual:"🐉 Fiamma gentile",
activity:"Disegna un drago che usa un potere diverso dal ruggito.",
paragraphs:[
"Nel villaggio delle montagne tutti conoscevano i draghi per i loro ruggiti.",
"Si diceva che un vero drago dovesse far tremare le rocce.",
"Ma il drago che {{name}} incontrò non ruggiva mai.",
"Si chiamava Niro e disegnava nell’aria con il fumo leggero.",
"Con quel fumo creava ponti, alberi, piccoli animali e stelle sospese.",
"“Pensano che io sia debole,” disse Niro. “Solo perché la mia forza non fa rumore.”",
"Quel giorno una frana bloccò il sentiero del villaggio.",
"Tutti aspettarono un ruggito potente.",
"{{name}} disse piano: “Forse puoi fare a modo tuo.”",
"Niro soffiò una lunga linea di fumo dorato."
]
}),

S({
title:"{{name}} e la stanza della pioggia",
subtitle:"Una stanza ascolta le emozioni che non trovano parole.",
icon:"🌧️ 🪟 💙",
art:"ocean",
scene:"🌧️ 🪟 💙",
keywords:["pioggia","calma","emozioni","silenzio"],
ritual:"🌧️ Goccia calma",
activity:"Disegna una goccia e scrivi dentro cosa vorresti lasciar andare.",
paragraphs:[
"In fondo a un corridoio silenzioso, {{name}} trovò una porta azzurra.",
"Sopra la porta c’era scritto: “Stanza della pioggia”.",
"Dentro non pioveva forte.",
"Cadevano gocce lente, sospese nell’aria, una alla volta.",
"Ogni goccia conteneva un’emozione che qualcuno non era riuscito a dire.",
"Una voce gentile arrivò dalla finestra: “Non devi sistemare tutto. Puoi solo ascoltare.”",
"{{name}} toccò una goccia e sentì una tristezza piccola.",
"Ne toccò un’altra e sentì una rabbia stanca.",
"Le gocce non facevano male. Chiedevano solo un nome."
]
}),

S({
title:"{{name}} e il custode delle domande",
subtitle:"Un custode protegge le domande che fanno crescere.",
icon:"❓ 📚 🕯️",
art:"castle",
scene:"❓ 📚 🕯️",
keywords:["domande","libro","crescita","curiosità"],
ritual:"❓ Domanda luminosa",
activity:"Scrivi una domanda che vuoi tenere aperta.",
paragraphs:[
"In una biblioteca senza pareti, {{name}} incontrò il custode delle domande.",
"Non custodiva risposte. Quelle cambiavano troppo spesso.",
"Custodiva domande importanti, scritte su fogli sospesi nell’aria.",
"Alcune domande brillavano molto. Altre erano quasi invisibili.",
"“Una buona domanda non ti chiude,” disse il custode. “Ti apre.”",
"{{name}} lesse una domanda: “Che cosa mi aiuta quando non so cosa fare?”",
"Poi un’altra: “Quando sono davvero me stesso?”",
"Al centro della biblioteca c’era un foglio vuoto.",
"Il custode porse una penna a {{name}}."
]
}),

S({
title:"{{name}} e il ragazzo della luce blu",
subtitle:"Una luce diversa aiuta a vedere porte invisibili.",
icon:"💙 🛤️ 🌌",
art:"space",
scene:"💙 🛤️ 🌌",
keywords:["luce","blu","diversità","strada"],
ritual:"💙 Lanterna blu",
activity:"Disegna una porta che solo una luce speciale può mostrare.",
paragraphs:[
"In una città dove tutte le luci erano gialle, viveva un ragazzo con una lanterna blu.",
"Tutti gli dicevano che quella luce era strana.",
"Lui la teneva comunque accesa.",
"{{name}} lo incontrò vicino a un vicolo chiuso, davanti a un muro senza porte.",
"“Perché usi una luce diversa?” chiese {{name}}.",
"Il ragazzo sorrise. “Perché con questa vedo cose che gli altri non notano.”",
"Illuminò il muro con la lanterna blu.",
"All’improvviso comparve una porta sottile.",
"Dietro la porta c’era un sentiero pieno di disegni, parole cancellate e idee lasciate a metà."
]
}),

S({
title:"{{name}} e il sentiero invisibile",
subtitle:"Un sentiero appare solo quando si procede con fiducia.",
icon:"🛤️ 🌫️ ✨",
art:"forest",
scene:"🛤️ 🌫️ ✨",
keywords:["sentiero","fiducia","nebbia","cammino"],
ritual:"🛤️ Pietra del passo",
activity:"Disegna il primo passo di un sentiero invisibile.",
paragraphs:[
"La nebbia copriva tutto, ma {{name}} sentiva che davanti c’era una strada.",
"Non si vedeva. Non ancora.",
"Solo un suono leggero arrivava da lontano.",
"Una tartaruga grigia camminava lentamente nella stessa direzione.",
"“Come fai a sapere dove andare?” chiese {{name}}.",
"“Non lo so tutto insieme,” rispose la tartaruga. “So solo il prossimo passo.”",
"Appena la tartaruga mise una zampa avanti, una pietra comparve sotto di lei.",
"{{name}} provò a fare lo stesso.",
"Una nuova pietra apparve."
]
}),

S({
title:"{{name}} e il lago dei ricordi",
subtitle:"Un lago custodisce ricordi che possono diventare forza.",
icon:"🪷 🌊 🧠",
art:"ocean",
scene:"🪷 🌊 🧠",
keywords:["lago","ricordi","calma","memoria"],
ritual:"🪷 Foglia del ricordo",
activity:"Disegna un ricordo come se fosse una pianta.",
paragraphs:[
"Il lago dei ricordi era nascosto tra montagne basse e alberi immobili.",
"Non aveva onde. Non aveva barche.",
"Sembrava aspettare in silenzio.",
"{{name}} si avvicinò e vide immagini muoversi sotto l’acqua.",
"C’erano giorni belli, giorni strani, giorni in cui non tutto era andato come avrebbe voluto.",
"Una donna anziana sedeva sulla riva con un bastone di legno chiaro.",
"“I ricordi non sono pietre,” disse. “Sono semi.”",
"{{name}} guardò un ricordo difficile.",
"La donna lo toccò con il bastone e dall’acqua nacque una piccola pianta."
]
}),

S({
title:"{{name}} e il libro che ascoltava",
subtitle:"Un libro risponde solo quando qualcuno è sincero.",
icon:"📖 👂 ✨",
art:"castle",
scene:"📖 👂 ✨",
keywords:["libro","ascolto","parole","sincerità"],
ritual:"📖 Pagina sincera",
activity:"Scrivi una frase vera che vuoi custodire.",
paragraphs:[
"Il libro che ascoltava era appoggiato su una sedia vuota.",
"Non aveva titolo.",
"Non aveva disegni in copertina.",
"Quando {{name}} lo aprì, le pagine erano bianche.",
"“Non scrivo per primo,” disse una voce sottile. “Prima ascolto.”",
"{{name}} rimase in silenzio.",
"Poi raccontò qualcosa di piccolo, qualcosa che non aveva detto ad alta voce.",
"Sulla pagina apparve una frase: “Grazie per avermi affidato questo.”",
"Il libro non dava consigli veloci. Faceva spazio."
]
})

],

"11-12":[

S({
title:"{{name}} e l’atlante delle possibilità",
subtitle:"Un racconto su identità, scelte e futuro.",
icon:"🌌 🧭 📖",
art:"space",
scene:"🌌 🧭 ✨",
keywords:["atlante","futuro","direzione","identità"],
ritual:"🧭 Bussola interiore",
activity:"Scrivi una domanda che vuoi portare con te.",
paragraphs:[
"La sera in cui {{name}} trovò l’atlante, il cielo sembrava più grande del solito.",
"Sulla scrivania c’era un libro senza titolo, con una bussola disegnata in copertina.",
"La frase incisa diceva: “Non tutte le direzioni si vedono da fuori.”",
"Quando {{name}} aprì il libro, le pagine non mostrarono città o confini.",
"Mostrarono possibilità.",
"Una pagina era fatta di coraggio. Una di dubbi. Una di errori utili.",
"Un’altra sembrava piena di sogni ancora confusi.",
"Al centro dell’atlante apparve una domanda: “Che cosa ti fa sentire vivo quando nessuno ti guarda?”",
"{{name}} rimase in silenzio.",
"La bussola sulla copertina iniziò a muoversi lentamente.",
"Non indicò nord. Indicò avanti."
]
}),

S({
title:"{{name}} e la città dopo il tramonto",
subtitle:"Una città notturna mostra ciò che resta acceso dentro.",
icon:"🌆 🌙 ✨",
art:"space",
scene:"🌆 🌙 ✨",
keywords:["città","notte","identità","tramonto"],
ritual:"🌙 Lampione interiore",
activity:"Disegna una città notturna con una finestra ancora accesa.",
paragraphs:[
"Dopo il tramonto, la città cambiava pelle.",
"Le vetrine si spegnevano, i rumori scendevano, le strade diventavano più grandi.",
"{{name}} camminava senza una meta precisa quando vide una strada che di giorno non esisteva.",
"In fondo alla strada c’era una piazza silenziosa.",
"Al centro della piazza, un lampione era acceso anche senza elettricità.",
"Una voce disse: “Questa luce mostra ciò che resta quando il rumore finisce.”",
"{{name}} guardò intorno e vide ombre di possibilità.",
"Cose iniziate. Cose desiderate. Cose mai dette.",
"Il lampione non giudicava. Illuminava."
]
}),

S({
title:"{{name}} e il ragazzo senza bussola",
subtitle:"Perdersi diventa un modo diverso di iniziare.",
icon:"🧭 ❔ 🌫️",
art:"bridge",
scene:"🧭 ❔ 🌫️",
keywords:["bussola","strada","futuro","scelte"],
ritual:"❔ Domanda guida",
activity:"Scrivi una domanda che può diventare bussola.",
paragraphs:[
"Il ragazzo senza bussola viveva in una valle dove tutti portavano una direzione appesa al collo.",
"Nord, sud, est, ovest.",
"Tutti sembravano sapere dove andare.",
"{{name}} lo incontrò seduto su un muretto, con una bussola vuota in mano.",
"“Non indica niente,” disse il ragazzo. “Forse sono rotto io.”",
"{{name}} guardò la bussola.",
"Non sembrava rotta. Sembrava in attesa.",
"Camminarono insieme tra strade che cambiavano nome e cartelli girati dal vento.",
"Alla fine arrivarono davanti a un campo aperto.",
"La bussola si accese, ma non indicò una direzione."
]
}),

S({
title:"{{name}} e la biblioteca del cielo",
subtitle:"Ogni libro contiene una versione possibile di sé.",
icon:"📚 ☁️ 🌌",
art:"sky",
scene:"📚 ☁️ 🌌",
keywords:["biblioteca","cielo","sogni","possibilità"],
ritual:"📖 Pagina futura",
activity:"Scrivi il titolo di un libro che parla di chi potresti diventare.",
paragraphs:[
"La biblioteca del cielo fluttuava sopra le nuvole.",
"Nessuno la vedeva finché non aveva una domanda vera.",
"{{name}} arrivò su una scala fatta di vento.",
"All’ingresso c’era una ragazza con mani piene di polvere di stelle.",
"“Qui non conserviamo libri su ciò che è stato,” disse.",
"“Conserviamo libri su ciò che potresti diventare.”",
"{{name}} aprì un volume e vide una versione di sé coraggiosa.",
"Poi una più calma.",
"Poi una ancora confusa, ma viva.",
"“Quale devo scegliere?” chiese.",
"La ragazza sorrise: “Nessuna adesso. Devi solo capire quali pagine ti chiamano.”"
]
}),

S({
title:"{{name}} e il ponte delle costellazioni",
subtitle:"Ogni scelta collega punti lontani.",
icon:"🌉 ✨ 🌌",
art:"space",
scene:"🌉 ✨ 🌌",
keywords:["stelle","ponte","costellazioni","scelte"],
ritual:"✨ Stella da collegare",
activity:"Disegna tre stelle e uniscile con una linea.",
paragraphs:[
"Nel cielo sopra la città, le stelle sembravano disordinate.",
"Poi {{name}} vide una linea sottile unirne due.",
"Poi tre.",
"Poi molte.",
"Si formò un ponte di costellazioni.",
"Una figura luminosa camminava dall’altra parte.",
"“Le scelte sono come stelle,” disse.",
"“Da sole sembrano sparse. Col tempo diventano disegno.”",
"{{name}} salì sul ponte e vide momenti della propria vita brillare sotto i piedi.",
"Alcuni erano belli. Altri complicati.",
"Da lassù, tutti contribuivano a una forma."
]
}),

S({
title:"{{name}} e la stanza delle versioni future",
subtitle:"Una stanza mostra futuri possibili senza obbligare a sceglierne uno.",
icon:"🚪 🪞 🔮",
art:"castle",
scene:"🚪 🪞 🔮",
keywords:["futuro","specchio","identità","scelta"],
ritual:"🪞 Riflesso futuro",
activity:"Disegna una versione futura di te senza renderla perfetta.",
paragraphs:[
"La stanza delle versioni future aveva molte porte e nessuna maniglia.",
"{{name}} entrò perché una porta si aprì da sola.",
"Dentro c’erano specchi, ma non riflettevano il presente.",
"In uno specchio, {{name}} parlava davanti a molte persone.",
"In un altro viaggiava.",
"In un altro costruiva qualcosa con pazienza.",
"In un altro ancora restava semplicemente in silenzio, ma sembrava sereno.",
"Una voce calma disse: “Non guardare per scegliere subito.”",
"“Guarda per riconoscere cosa si accende.”",
"{{name}} si avvicinò allo specchio più semplice."
]
}),

S({
title:"{{name}} e il mare delle domande",
subtitle:"Un mare calmo porta domande invece di risposte immediate.",
icon:"🌊 ❔ 🐚",
art:"ocean",
scene:"🌊 ❔ 🐚",
keywords:["mare","domande","futuro","calma"],
ritual:"🐚 Conchiglia domanda",
activity:"Scrivi una domanda e piegala come una barchetta.",
paragraphs:[
"Il mare delle domande era più silenzioso degli altri mari.",
"Le onde non portavano conchiglie normali.",
"Portavano frasi incomplete.",
"{{name}} ne raccolse una: “E se...”",
"Poi un’altra: “Perché mi importa...”",
"Poi una terza: “Dove mi sento...”",
"Sulla riva, un vecchio pescatore sistemava reti vuote.",
"“Pesco domande,” disse.",
"“Le risposte arrivano quando smetti di tirarle troppo forte.”",
"{{name}} lasciò una domanda nell’acqua."
]
}),

S({
title:"{{name}} e il guardiano delle strade",
subtitle:"Non tutte le strade vanno percorse subito.",
icon:"🛤️ 🧥 🕯️",
art:"bridge",
scene:"🛤️ 🧥 🕯️",
keywords:["strade","scelte","guardiano","direzione"],
ritual:"🕯️ Candela del passo",
activity:"Disegna quattro strade e scegli solo la prima curva.",
paragraphs:[
"Il guardiano delle strade indossava un cappotto pieno di mappe piegate.",
"{{name}} lo trovò davanti a un incrocio con troppi cartelli.",
"Alcuni indicavano posti luminosi.",
"Altri sembravano difficili.",
"Altri ancora non avevano nome.",
"“Qual è quella giusta?” chiese {{name}}.",
"Il guardiano rise piano.",
"“Una domanda più utile è: quale strada vuoi conoscere adesso?”",
"Indicò una strada luminosa, una ombrosa, una rumorosa e una quasi invisibile.",
"{{name}} si accorse che stava guardando sempre quella quasi invisibile."
]
}),

S({
title:"{{name}} e le finestre del tempo",
subtitle:"Passato, presente e futuro si aprono come finestre.",
icon:"🪟 ⏳ 🌙",
art:"castle",
scene:"🪟 ⏳ 🌙",
keywords:["tempo","finestre","crescita","futuro"],
ritual:"🪟 Finestra accesa",
activity:"Disegna tre finestre: ieri, oggi, domani.",
paragraphs:[
"In una casa apparsa solo per una notte, {{name}} trovò tre finestre.",
"La prima guardava indietro.",
"Mostrava cose già vissute, alcune belle, altre difficili.",
"La seconda guardava il presente.",
"Mostrava {{name}} proprio lì, con domande ancora aperte.",
"La terza guardava avanti, ma il vetro era appannato.",
"Una voce disse: “Il futuro non si vede bene perché si costruisce mentre cammini.”",
"{{name}} pulì un piccolo angolo del vetro.",
"Non vide tutto.",
"Vide solo una luce, lontana ma reale."
]
}),

S({
title:"{{name}} e il quaderno delle direzioni",
subtitle:"Un quaderno raccoglie parole guida per orientarsi.",
icon:"📓 🧭 ✨",
art:"space",
scene:"📓 🧭 ✨",
keywords:["quaderno","direzione","parole","identità"],
ritual:"📓 Parola guida",
activity:"Scrivi una parola che vuoi portare con te questa settimana.",
paragraphs:[
"Il quaderno delle direzioni non aveva righe dritte.",
"Ogni pagina cambiava forma in base a chi la apriva.",
"{{name}} trovò la prima pagina vuota, tranne una frase.",
"“Scrivi una parola che vuoi portare con te.”",
"Pensò a molte parole.",
"Alcune sembravano troppo grandi.",
"Altre troppo facili.",
"Alla fine ne scelse una semplice, ma vera.",
"Quando la scrisse, la parola diventò una piccola bussola disegnata sul bordo della pagina.",
"Il quaderno non disse dove andare."
]
})

]

};
