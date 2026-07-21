(function(global){
  'use strict';
  const path = new URLSearchParams(global.location.search).get('path');
  if(!path) return;
  function openRoute(){
    const button = document.querySelector(`[data-route="${String(path).replace(/[^a-z-]/g,'')}"]`);
    if(button){button.click();return true;}
    return false;
  }
  if(!openRoute()) global.setTimeout(openRoute,0);
})(window);