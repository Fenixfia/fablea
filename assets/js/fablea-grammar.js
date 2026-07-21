(function(global){
  'use strict';

  const GENDERS = ['male','female','neutral','unspecified'];

  function normalizeGender(value){
    return GENDERS.includes(value) ? value : 'unspecified';
  }

  function words(profile = {}){
    const gender = normalizeGender(profile.gender);
    if(gender === 'male'){
      return {
        pronoun: 'lui',
        subject: 'il protagonista',
        child: 'bambino',
        explorer: 'esploratore',
        curious: 'curioso',
        ready: 'pronto',
        brave: 'coraggioso',
        article: 'il',
        possessive: 'suo'
      };
    }
    if(gender === 'female'){
      return {
        pronoun: 'lei',
        subject: 'la protagonista',
        child: 'bambina',
        explorer: 'esploratrice',
        curious: 'curiosa',
        ready: 'pronta',
        brave: 'coraggiosa',
        article: 'la',
        possessive: 'sua'
      };
    }
    return {
      pronoun: profile.name || 'chi vive la storia',
      subject: 'chi vive la storia',
      child: 'bambino',
      explorer: 'protagonista',
      curious: 'pieno di curiosità',
      ready: 'con il cuore pronto',
      brave: 'capace di trovare coraggio',
      article: '',
      possessive: 'suo'
    };
  }

  function choose(profile, variants){
    const gender = normalizeGender(profile && profile.gender);
    if(gender === 'male' && variants.male) return variants.male;
    if(gender === 'female' && variants.female) return variants.female;
    return variants.neutral || variants.unspecified || variants.male || variants.female || '';
  }

  function apply(text, profile = {}, context = {}){
    const vocabulary = words(profile);
    const replacements = {
      name: profile.name || 'il piccolo protagonista',
      pronoun: vocabulary.pronoun,
      subject: vocabulary.subject,
      child: vocabulary.child,
      explorer: vocabulary.explorer,
      curious: vocabulary.curious,
      ready: vocabulary.ready,
      brave: vocabulary.brave,
      possessive: vocabulary.possessive,
      world: context.world || profile.primaryWorld || 'mondo di FABLEA',
      place: context.place || 'un luogo inatteso',
      threshold: context.threshold || 'una soglia luminosa',
      landmark: context.landmark || 'un punto lontano',
      sound: context.sound || 'un suono lieve',
      sky: context.sky || 'un cielo pieno di possibilità',
      material: context.material || 'una materia luminosa',
      companion: context.companion || profile.favoriteCompanion || 'una guida gentile',
      scent: context.scent || 'aria pulita e terra bagnata'
    };

    return String(text || '').replace(/\{\{([a-zA-Z]+)\}\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(replacements, key) ? replacements[key] : match
    ));
  }

  global.FableaGrammar = {normalizeGender, words, choose, apply};
})(window);
