(function(global){
  'use strict';

  const unavailable = feature => async function(){
    throw new Error(`${feature} non è ancora attivo nella beta locale.`);
  };

  const localStorageAdapter = {
    mode:'local',
    async get(key){
      try{return JSON.parse(global.localStorage.getItem(key));}catch(_error){return null;}
    },
    async set(key,value){global.localStorage.setItem(key,JSON.stringify(value));return value;},
    async remove(key){global.localStorage.removeItem(key);return true;}
  };

  const accountAdapter = {
    mode:'disabled',
    isAuthenticated(){return false;},
    current(){return null;},
    signIn:unavailable('L’account genitore'),
    signOut:unavailable('L’account genitore')
  };

  const billingAdapter = {
    mode:'disabled',
    plans:[
      {id:'family-monthly',price:5.99,currency:'EUR',interval:'month'},
      {id:'family-annual',price:59.90,currency:'EUR',interval:'year'}
    ],
    checkout:unavailable('Il pagamento'),
    portal:unavailable('La gestione dell’abbonamento')
  };

  const syncAdapter = {
    mode:'disabled',
    push:unavailable('La sincronizzazione'),
    pull:unavailable('La sincronizzazione'),
    status(){return {enabled:false,lastSync:null};}
  };

  function describe(){
    return {
      environment:'local-beta',
      storage:'browser',
      account:'not-configured',
      sync:'not-configured',
      billing:'not-configured',
      productionReady:false
    };
  }

  global.FableaPlatform = {storage:localStorageAdapter,account:accountAdapter,billing:billingAdapter,sync:syncAdapter,describe};
})(window);