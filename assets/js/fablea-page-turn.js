(function(){
  'use strict';

  function ready(callback){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',callback,{once:true});
    else callback();
  }

  ready(() => {
    const book = document.querySelector('.live-book .book');
    const sheet = document.querySelector('.live-book .page-sheet');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    if(!book || !sheet || !prev || !next) return;

    const reducedMotion = globalThis.matchMedia && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let busy = false;
    let bypass = false;
    let gesture = null;

    const prevEdge = document.createElement('button');
    prevEdge.type = 'button';
    prevEdge.className = 'page-edge-button prev-edge';
    prevEdge.setAttribute('aria-label','Pagina precedente');
    prevEdge.textContent = '←';

    const nextEdge = document.createElement('button');
    nextEdge.type = 'button';
    nextEdge.className = 'page-edge-button next-edge';
    nextEdge.setAttribute('aria-label','Pagina successiva');
    nextEdge.textContent = '→';

    const hint = document.createElement('div');
    hint.className = 'page-turn-hint';
    hint.setAttribute('aria-hidden','true');
    hint.innerHTML = '<span>☝︎</span> Scorri per sfogliare';

    book.append(prevEdge,nextEdge,hint);

    try{
      if(localStorage.getItem('fableaPageTurnHintSeen') === 'true') hint.remove();
      else localStorage.setItem('fableaPageTurnHintSeen','true');
    }catch(_error){/* private mode: the hint may reappear */}

    function atRitual(){
      return /rituale/i.test(next.textContent || '');
    }

    function syncEdges(){
      prevEdge.disabled = prev.disabled;
      nextEdge.disabled = next.disabled;
      nextEdge.setAttribute('aria-label',atRitual() ? 'Vai al rituale finale' : 'Pagina successiva');
      nextEdge.textContent = atRitual() ? '✨' : '→';
    }

    function clearDrag(){
      sheet.classList.remove('page-dragging','page-settle');
      sheet.style.setProperty('--page-turn-angle','0deg');
      sheet.style.setProperty('--page-turn-x','0');
      sheet.style.setProperty('--page-turn-shadow','0');
    }

    function settle(){
      sheet.classList.remove('page-dragging');
      sheet.classList.add('page-settle');
      window.setTimeout(clearDrag,reducedMotion ? 0 : 390);
    }

    function performNative(button){
      bypass = true;
      button.click();
      bypass = false;
      syncEdges();
    }

    function turn(direction){
      const button = direction === 'prev' ? prev : next;
      if(busy || button.disabled) return;
      if(direction === 'next' && atRitual()){
        performNative(button);
        return;
      }
      if(reducedMotion){
        performNative(button);
        return;
      }

      busy = true;
      sheet.classList.remove('page-settle');
      const animationClass = direction === 'prev' ? 'page-turn-prev' : 'page-turn-next';
      sheet.classList.add(animationClass);

      window.setTimeout(() => performNative(button),285);
      window.setTimeout(() => {
        sheet.classList.remove(animationClass,'page-dragging');
        clearDrag();
        busy = false;
        sheet.focus({preventScroll:true});
      },650);
    }

    function intercept(button,direction){
      button.addEventListener('click',event => {
        if(bypass) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        turn(direction);
      },true);
    }

    intercept(prev,'prev');
    intercept(next,'next');
    prevEdge.addEventListener('click',() => turn('prev'));
    nextEdge.addEventListener('click',() => turn('next'));

    const observer = new MutationObserver(syncEdges);
    observer.observe(prev,{attributes:true,attributeFilter:['disabled']});
    observer.observe(next,{attributes:true,attributeFilter:['disabled'],childList:true,subtree:true,characterData:true});
    syncEdges();

    sheet.tabIndex = 0;
    sheet.setAttribute('aria-label','Pagina del Libro vivo. Sul telefono scorri orizzontalmente per sfogliare.');

    function startGesture(clientX,clientY){
      if(busy || reducedMotion) return;
      gesture = {
        startX:clientX,
        startY:clientY,
        lastX:clientX,
        lastTime:performance.now(),
        velocity:0,
        locked:false,
        cancelled:false,
        width:Math.max(sheet.getBoundingClientRect().width,1)
      };
    }

    function moveGesture(clientX,clientY,event){
      if(!gesture || gesture.cancelled) return;
      const dx = clientX - gesture.startX;
      const dy = clientY - gesture.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if(!gesture.locked){
        if(Math.max(absX,absY) < 7) return;
        if(absY > absX * 1.05){
          gesture.cancelled = true;
          return;
        }
        if(absX > absY * 1.12){
          gesture.locked = true;
          sheet.classList.add('page-dragging');
        }else return;
      }

      if(event && event.cancelable) event.preventDefault();
      const now = performance.now();
      const elapsed = Math.max(now - gesture.lastTime,1);
      gesture.velocity = (clientX - gesture.lastX) / elapsed;
      gesture.lastX = clientX;
      gesture.lastTime = now;

      const direction = dx < 0 ? 'next' : 'prev';
      const blocked = direction === 'prev' ? prev.disabled : false;
      const effectiveDx = blocked ? dx * .2 : dx;
      const progress = Math.min(Math.abs(effectiveDx) / gesture.width,1);
      const angle = (effectiveDx < 0 ? -1 : 1) * progress * 76;

      sheet.style.setProperty('--page-turn-angle',`${angle}deg`);
      sheet.style.setProperty('--page-turn-x',String(effectiveDx * .05));
      sheet.style.setProperty('--page-turn-shadow',String(Math.min(progress * 1.4,1)));
    }

    function finishGesture(clientX){
      if(!gesture) return;
      const current = gesture;
      gesture = null;
      if(!current.locked){
        clearDrag();
        return;
      }

      const dx = clientX - current.startX;
      const direction = dx < 0 ? 'next' : 'prev';
      const distanceEnough = Math.abs(dx) > current.width * .16;
      const velocityEnough = Math.abs(current.velocity) > .3;
      const blocked = direction === 'prev' ? prev.disabled : false;

      if((distanceEnough || velocityEnough) && !blocked) turn(direction);
      else settle();
    }

    sheet.addEventListener('touchstart',event => {
      if(event.touches.length !== 1) return;
      const touch = event.touches[0];
      startGesture(touch.clientX,touch.clientY);
    },{passive:true});

    sheet.addEventListener('touchmove',event => {
      if(event.touches.length !== 1) return;
      const touch = event.touches[0];
      moveGesture(touch.clientX,touch.clientY,event);
    },{passive:false});

    sheet.addEventListener('touchend',event => {
      const touch = event.changedTouches && event.changedTouches[0];
      if(touch) finishGesture(touch.clientX);
    },{passive:true});

    sheet.addEventListener('touchcancel',() => {
      gesture = null;
      settle();
    },{passive:true});

    sheet.addEventListener('pointerdown',event => {
      if(event.pointerType !== 'pen') return;
      startGesture(event.clientX,event.clientY);
    });
    sheet.addEventListener('pointermove',event => {
      if(event.pointerType !== 'pen') return;
      moveGesture(event.clientX,event.clientY,event);
    },{passive:false});
    sheet.addEventListener('pointerup',event => {
      if(event.pointerType === 'pen') finishGesture(event.clientX);
    });
    sheet.addEventListener('pointercancel',event => {
      if(event.pointerType === 'pen'){
        gesture = null;
        settle();
      }
    });

    document.addEventListener('keydown',event => {
      if(event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if(target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      const previous = event.key === 'ArrowLeft' || event.key === 'PageUp';
      const following = event.key === 'ArrowRight' || event.key === 'PageDown';
      if(!previous && !following) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      turn(previous ? 'prev' : 'next');
    },true);
  });
})();