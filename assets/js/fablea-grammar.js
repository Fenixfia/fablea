(function(global){
  const GENDERS = ['male','female','neutral','unspecified'];
  function normalizeGender(value){ return GENDERS.includes(value) ? value : 'unspecified'; }
  function words(profile){
    const g = normalizeGender(profile && profile.gender);
    if(g === 'male') return {pronoun:'lui', possessive:'suo', child:'bambino', explorer:'esploratore', curious:'curioso', ready:'pronto', article:'il'};
    if(g === 'female') return {pronoun:'lei', possessive:'sua', child:'bambina', explorer:'esploratrice', curious:'curiosa', ready:'pronta', article:'la'};
    return {pronoun:'questa persona speciale', possessive:'il suo', child:'creatura', explorer:'protagonista', curious:'con tanta curiosità', ready:'con il cuore pronto', article:'la'};
  }
  function apply(text, profile){
    const w = words(profile || {});
    return String(text || '').replaceAll('{{name}}', profile && profile.name ? profile.name : 'la piccola persona').replaceAll('{{pronoun}}', w.pronoun).replaceAll('{{possessive}}', w.possessive).replaceAll('{{child}}', w.child).replaceAll('{{explorer}}', w.explorer).replaceAll('{{curious}}', w.curious).replaceAll('{{ready}}', w.ready);
  }
  global.FableaGrammar = {normalizeGender, words, apply};
})(window);
