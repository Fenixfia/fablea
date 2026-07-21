(function(global){
  'use strict';

  const PREFIX = 'fablea';
  const EXPORT_VERSION = 1;

  function isFableaKey(key){
    return typeof key === 'string' && key.toLowerCase().startsWith(PREFIX);
  }

  function storageKeys(storage){
    const keys = [];
    for(let index = 0; index < storage.length; index += 1){
      const key = storage.key(index);
      if(isFableaKey(key)) keys.push(key);
    }
    return keys.sort();
  }

  function parseStoredValue(raw){
    if(raw == null) return null;
    try{return JSON.parse(raw);}catch(_error){return raw;}
  }

  function byteSize(value){
    return new Blob([String(value || '')]).size;
  }

  function collect(storage){
    const data = {};
    for(const key of storageKeys(storage)){
      data[key] = parseStoredValue(storage.getItem(key));
    }
    return data;
  }

  function countArray(value){
    return Array.isArray(value) ? value.length : 0;
  }

  function summary(){
    const localKeys = storageKeys(localStorage);
    const sessionKeys = storageKeys(sessionStorage);
    const profiles = parseStoredValue(localStorage.getItem('fableaChildProfiles'));
    const stories = parseStoredValue(localStorage.getItem('fableaSavedStories'));
    const bytes = [...localKeys.map(key => localStorage.getItem(key)),...sessionKeys.map(key => sessionStorage.getItem(key))]
      .reduce((total,value) => total + byteSize(value),0);

    return {
      profileCount:countArray(profiles),
      storyCount:countArray(stories),
      localKeyCount:localKeys.length,
      sessionKeyCount:sessionKeys.length,
      approximateBytes:bytes,
      hasData:localKeys.length > 0 || sessionKeys.length > 0
    };
  }

  function snapshot(){
    return {
      format:'FABLEA family data export',
      version:EXPORT_VERSION,
      createdAt:new Date().toISOString(),
      sourceOrigin:location.origin,
      local:collect(localStorage),
      session:collect(sessionStorage)
    };
  }

  function exportData(){
    const payload = JSON.stringify(snapshot(),null,2);
    const blob = new Blob([payload],{type:'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0,10);
    link.href = url;
    link.download = `fablea-dati-famiglia-${date}.json`;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url),0);
    return true;
  }

  function clearStorage(storage){
    for(const key of storageKeys(storage)) storage.removeItem(key);
  }

  function purgeAll(){
    clearStorage(localStorage);
    clearStorage(sessionStorage);
    return summary();
  }

  function formatBytes(bytes){
    if(bytes < 1024) return `${bytes} B`;
    if(bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  global.FableaDataControl = {
    PREFIX,
    EXPORT_VERSION,
    storageKeys,
    summary,
    snapshot,
    exportData,
    purgeAll,
    formatBytes
  };
})(window);
