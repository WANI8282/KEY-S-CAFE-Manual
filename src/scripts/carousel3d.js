(() => {
  window.Carousel3D = {
    init({ categories, ring, stage, onSelect, onFocus, onSnap = () => {} }) {
      const step = Math.PI * 2 / categories.length;
      let angle = 0, velocity = 0, dragging = false, lastX = 0, lastT = 0, downX = 0, moved = false, snapTarget = null, lastWheel = 0, lastFocus = -1;
      const radius = () => Math.min(490, Math.max(280, innerWidth * .38));
      const centerIndex = () => ((Math.round(-angle / step) % categories.length) + categories.length) % categories.length;
      function updateTilt(card, event) {
        const rect = card.getBoundingClientRect(), x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        card.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`); card.style.setProperty('--tilt-y', `${(x - 0.5) * 9}deg`);
        card.style.setProperty('--glow-x', `${x * 100}%`); card.style.setProperty('--glow-y', `${y * 100}%`);
      }
      function resetTilt(card) { card.style.setProperty('--tilt-x','0deg'); card.style.setProperty('--tilt-y','0deg'); card.style.setProperty('--glow-x','82%'); card.style.setProperty('--glow-y','13%'); }
      let touchedCard = null;
      const cards = categories.map((item, i) => {
        const el = document.createElement('button');
        el.type = 'button'; el.className = 'menu-card'; el.style.setProperty('--tone', item.tone);
        el.addEventListener('pointermove', event => { if (event.pointerType === 'mouse') updateTilt(el, event); });
        el.addEventListener('pointerleave', () => resetTilt(el));
        el.setAttribute('aria-label', `${item.title}メニューを開く`);
        el.innerHTML = `<span class="card-top"><span class="card-index">MODULE / 0${i + 1}</span><span class="card-symbol" aria-hidden="true">${item.icon}</span></span><span class="card-bottom"><span class="card-tag">${item.en}</span><h2 class="card-title">${item.title}</h2><p class="card-caption">${item.sub}</p><span class="card-rule"></span></span>`;
        el.addEventListener('click', () => { if (!moved && Math.abs(velocity) < .035) onSelect(i); });
        ring.append(el); return el;
      });
      function render() {
        ring.style.transform = `translateY(46px) translateZ(calc(var(--ring-radius) * -0.12)) rotateY(${angle}rad)`;
        cards.forEach((card, i) => {
          const d = Math.atan2(Math.sin(i * step + angle), Math.cos(i * step + angle));
          card.style.transform = `rotateY(${i * 360 / categories.length}deg) translateZ(${radius()}px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))`;
          card.classList.toggle('is-focused', Math.abs(d) < step * .48);
          card.style.zIndex = String(Math.round((Math.cos(d) + 1) * 50));
          card.style.opacity = String(.48 + .52 * Math.max(0, Math.cos(d)));
          card.tabIndex = Math.abs(d) < step * .48 ? 0 : -1;
        });
        const focused = centerIndex();
        if (focused !== lastFocus) { lastFocus = focused; onFocus(focused); }
      }
      function tick() {
        if (!dragging) {
          if (snapTarget !== null) {
            const difference = snapTarget - angle;
            angle += difference * .24;
            if (Math.abs(difference) < .0015) { angle = snapTarget; snapTarget = null; velocity = 0; onSnap(); }
          } else { angle += velocity; velocity *= .93; if (Math.abs(velocity) < .00008) velocity = 0; }
        }
        render(); requestAnimationFrame(tick);
      }
      stage.addEventListener('pointerdown', e => {
        if (e.target.closest('.carousel-arrow')) return;
        touchedCard = e.target.closest('.menu-card'); if (touchedCard) updateTilt(touchedCard, e);
        downX = e.clientX; moved = false; dragging = true; stage.classList.add('dragging');
        lastX = e.clientX; lastT = performance.now(); velocity = 0; snapTarget = null;
        // Capture on the pressed card so pointer capture does not retarget its click to the stage.
        (touchedCard || stage).setPointerCapture(e.pointerId);
      });
      stage.addEventListener('pointermove', e => {
        const stageRect = stage.getBoundingClientRect(); stage.style.setProperty('--pointer-x', `${e.clientX - stageRect.left}px`); stage.style.setProperty('--pointer-y', `${e.clientY - stageRect.top}px`);
        if (!dragging) return;
        const dx = e.clientX - lastX, now = performance.now();
        if (e.pointerType === 'touch' && touchedCard) updateTilt(touchedCard, e);
        if (Math.abs(e.clientX - downX) > 5) moved = true;
        angle += dx / Math.max(radius(), 240);
        velocity = dx / Math.max(radius(), 240) * Math.min(1, (now - lastT) / 16);
        lastX = e.clientX; lastT = now;
      });
      const endDrag = () => { if(!dragging)return; dragging = false; stage.classList.remove('dragging'); snapTarget = -Math.round(-(angle + velocity * 4) / step) * step; velocity = 0; if(touchedCard)resetTilt(touchedCard); touchedCard=null; setTimeout(() => { moved = false; }, 100); };
      stage.addEventListener('pointerup', endDrag); stage.addEventListener('pointercancel', endDrag);
      function goBy(direction) { const destination = centerIndex() + direction; snapTarget = -destination * step; velocity = 0; }
      function goTo(index) { const base = -index * step; snapTarget = base + Math.round((angle - base) / (Math.PI * 2)) * Math.PI * 2; velocity = 0; }
      stage.addEventListener('wheel', e => {
        e.preventDefault(); const now = performance.now();
        if (now - lastWheel < 260 || Math.abs(e.deltaY || e.deltaX) < 10) return;
        lastWheel = now; goBy((e.deltaY || e.deltaX) > 0 ? 1 : -1);
      }, { passive: false });
      window.addEventListener('resize', render); render(); tick();
      return { getCenterIndex: centerIndex, next: () => goBy(1), previous: () => goBy(-1), goTo };
    }
  };
})();
