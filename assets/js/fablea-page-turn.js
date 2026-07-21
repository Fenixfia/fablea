(function(){
  'use strict';

  function ready(callback){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',callback,{once:true});
    else callback();
  }

  ready(() => {
    const book = document.querySelector('.live-book .book');
    const page = document.querySelector('.live-book .page-card');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    if(!book || !page || !prev || !next) return;

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
    hint.innerHTML = '<span>☝︎</span> Trascina per sfogliare';

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
      page.classList.remove('page-dragging','page-settle');
      page.style.setProperty('--page-turn-angle','0deg');
      page.style.setProperty('--page-turn-x','0');
      page.style.setProperty('--page-turn-shadow','0');
    }

    function settle(){
      page.classList.remove('page-dragging');
      page.classList.add('page-settle');
      setTimeout(() => {
        clearDrag();
      },reducedMotion ? 0 : 390);
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
      clearDrag();
      const animationClass = direction === 'prev' ? 'page-turn-prev' : 'page-turn-next';
      page.classList.add(animationClass);

      window.setTimeout(() => performNative(button),300);
      window.setTimeout(() => {
        page.classList.remove(animationClass);
        busy = false;
        page.focus({preventScroll:true});
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

    page.tabIndex = 0;
    page.setAttribute('aria-label','Pagina del Libro vivo. Sul telefono trascina orizzontalmente per sfogliare.');

    page.addEventListener('pointerdown',event => {
      if(busy || reducedMotion || !['touch','pen'].includes(event.pointerType)) return;
      gesture = {
        id:event.pointerId,
        startX:event.clientX,
        startY:event.clientY,
        lastX:event.clientX,
        lastTime:performance.now(),
        velocity:0,
        locked:false,
        cancelled:false,
        width:Math.max(page.getBoundingClientRect().width,1)
      };
    });

    page.addEventListener('pointermove',event => {
      if(!gesture || gesture.id !== event.pointerId || gesture.cancelled) return;
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if(!gesture.locked){
        if(Math.max(absX,absY) < 9) return;
        if(absY > absX * 1.08){
          gesture.cancelled = true;
          return;
        }
        if(absX > absY * 1.18){
          gesture.locked = true;
          page.setPointerCapture(event.pointerId);
          page.classList.add('page-dragging');
        }else return;
      }

      event.preventDefault();
      const now = performance.now();
      const elapsed = Math.max(now - gesture.lastTime,1);
      gesture.velocity = (event.clientX - gesture.lastX) / elapsed;
      gesture.lastX = event.clientX;
      gesture.lastTime = now;

      const direction = dx < 0 ? 'next' : 'prev';
      const blocked = direction === 'prev' ? prev.disabled : atRitual();
      const effectiveDx = blocked ? dx * .22 : dx;
      const progress = Math.min(Math.abs(effectiveDx) / gesture.width,1);
      const angle = (effectiveDx < 0 ? -1 : 1) * progress * 72;

      page.style.setProperty('--page-turn-angle',`${angle}deg`);
      page.style.setProperty('--page-turn-x',String(effectiveDx * .055));
      page.style.setProperty('--page-turn-shadow',String(Math.min(progress * 1.35,1)));
    },{passive:false});

    function finishGesture(event){
      if(!gesture || gesture.id !== event.pointerId) return;
      const current = gesture;
      gesture = null;
      if(!current.locked){
        clearDrag();
        return;
      }

      const dx = event.clientX - current.startX;
      const direction = dx < 0 ? 'next' : 'prev';
      const distanceEnough = Math.abs(dx) > current.width * .22;
      const velocityEnough = Math.abs(current.velocity) > .42;
      const blocked = direction === 'prev' ? prev.disabled : atRitual();

      if((distanceEnough || velocityEnough) && !blocked) turn(direction);
      else if(direction === 'next' && atRitual() && (distanceEnough || velocityEnough)) performNative(next);
      else settle();
    }

    page.addEventListener('pointerup',finishGesture);
    page.addEventListener('pointercancel',event => {
      if(gesture && gesture.id === event.pointerId){
        gesture = null;
        settle();
      }
    });

    document.addEventListener('keydown',event => {
      if(event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if(target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      if(event.key === 'PageUp'){
        event.preventDefault();
        turn('prev');
      }
      if(event.key === 'PageDown'){
        event.preventDefault();
        turn('next');
      }
    });
  });
})();
