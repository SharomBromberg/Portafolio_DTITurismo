document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('tourOverlay');
  const modalEl = overlay ? overlay.querySelector('.tour-modal') : null;
  const closeBtn = overlay ? overlay.querySelector('.tour-close') : null;
  const overlayTitle = overlay ? overlay.querySelector('#tourOverlayTitle') : null;
  const slidesTrack = overlay ? overlay.querySelector('#overlaySlidesTrack') : null;
  const prevBtn = overlay ? overlay.querySelector('.nav-btn[data-dir="prev"]') : null;
  const nextBtn = overlay ? overlay.querySelector('.nav-btn[data-dir="next"]') : null;
  // drag state
  let isDown = false, startX = 0, startScrollLeft = 0;
  // índice actual para navegación con wrap
  let currentIndex = 0;

  // Si no existe el overlay aún, salir para evitar errores
  if (!overlay) return;

  // Slides por sección
  const overlaySlides = {
    cafe: [
      { title: 'Finca de Autor', img: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=60', desc: 'Tour guiado por cultivo y beneficio.', meta: ['Duración: 6h','Café','Cupo: 12'] },
      { title: 'Taller Barismo', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=60', desc: 'Filtrados y latte art básico.', meta: ['Duración: 4h','Intro','Cupo: 10'] },
      { title: 'Sendero Sombreado', img: 'https://images.unsplash.com/photo-1470342495898-6f9e745e8a78?auto=format&fit=crop&w=600&q=60', desc: 'Caminata suave y avistamiento de aves.', meta: ['Duración: 5h','Naturaleza','Cupo: 15'] },
      { title: 'Catación y Rueda', img: 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474ec?auto=format&fit=crop&w=600&q=60', desc: 'Sesión SCA y rueda de sabores.', meta: ['Duración: 3h','Cata','Cupo: 8'] }
    ],
    palmas: [
      { title: 'Cocora Científico', img: 'https://images.unsplash.com/photo-1543241017-4d8c3fd92c40?auto=format&fit=crop&w=600&q=60', desc: 'Interpretación ecológica con guía.', meta: ['Duración: 6h','Medio','Cupo: 14'] },
      { title: 'Fotografía Andina', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=60', desc: 'Salida de foto con tips técnicos.', meta: ['Duración: 5h','Foto','Cupo: 10'] },
      { title: 'Biodiversidad', img: 'https://images.unsplash.com/photo-1482192505345-5655af888f90?auto=format&fit=crop&w=600&q=60', desc: 'Caminata interpretativa y avistamiento.', meta: ['Duración: 4h','Ecosistemas','Cupo: 16'] },
      { title: 'Valle de Palmas', img: 'https://images.unsplash.com/photo-1477764868470-7f4f0e7c7010?auto=format&fit=crop&w=600&q=60', desc: 'Ruta icónica y miradores.', meta: ['Duración: 7h','Paisaje','Cupo: 12'] }
    ],
    mice: [
      { title: 'Liderazgo en Naturaleza', img: 'https://images.unsplash.com/photo-1520962918403-54e1100b2bd2?auto=format&fit=crop&w=600&q=60', desc: 'Workshop outdoor con dinámicas.', meta: ['Duración: 4h','Team','Cupo: 20'] },
      { title: 'Logística Técnica', img: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=600&q=60', desc: 'Montaje y operación de eventos.', meta: ['Duración: 6h','Evento','Cupo: 30'] },
      { title: 'Impacto Social Neutro', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=60', desc: 'Buenas prácticas y medición.', meta: ['Duración: 3h','Sostenible','Cupo: 25'] },
      { title: 'Cierre Ejecutivo', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=60', desc: 'Presentación y networking.', meta: ['Duración: 2h','Corporativo','Cupo: 40'] }
    ]
  };

  function renderSlides(items) {
    if (!slidesTrack) return;
    slidesTrack.innerHTML = items.map(item => `
      <div class="slide" data-full="${item.fullImg || item.img}">
        <div class="slide-image" style="background-image:url('${item.img}')"></div>
        <div class="slide-body">
          <h5 class="slide-title">${item.title}</h5>
          <p class="slide-desc">${item.desc}</p>
          <div class="slide-meta">${item.meta.map(m => `<span class="chip">${m}</span>`).join('')}</div>
          <button class="slide-btn" type="button">Ver itinerario</button>
        </div>
      </div>
    `).join('');

    // attach drag behavior
    attachDrag();
    // reset estado y posición
    currentIndex = 0;
    slidesTrack.scrollTo({ left: 0, behavior: 'auto' });
  }

  function extractBgUrl(el) {
    if (!el) return '';
    const bg = el.style.backgroundImage || '';
    const match = bg.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : '';
  }

  function openImageViewer(src) {
    if (!modalEl) return;
    let viewer = overlay.querySelector('.image-viewer');
    if (!viewer) {
      viewer = document.createElement('div');
      viewer.className = 'image-viewer';
      viewer.innerHTML = `
        <button class="image-close" aria-label="Cerrar">✕</button>
        <img alt="Itinerario" />
      `;
      modalEl.appendChild(viewer);
    }
    const imgEl = viewer.querySelector('img');
    if (imgEl) imgEl.src = src;
    viewer.classList.add('open');
  }

  function closeImageViewer() {
    const viewer = overlay.querySelector('.image-viewer');
    if (viewer) viewer.classList.remove('open');
  }

  function attachNav() {
    if (!slidesTrack) return;
    const getStep = () => {
      const sampleSlide = slidesTrack.querySelector('.slide');
      return sampleSlide ? (sampleSlide.getBoundingClientRect().width + 16) : 260;
    };
    const getLen = () => slidesTrack.querySelectorAll('.slide').length;
    const getCurrentIndex = () => {
      const step = getStep();
      return Math.round(slidesTrack.scrollLeft / step);
    };
    const goToIndex = (idx) => {
      const len = getLen();
      if (len <= 0) return;
      const step = getStep();
      const normalized = ((idx % len) + len) % len;
      slidesTrack.scrollTo({ left: normalized * step, behavior: 'smooth' });
    };

    if (prevBtn) prevBtn.onclick = (e) => {
      e.preventDefault();
      const len = getLen();
      if (len <= 0) return;
      currentIndex = (currentIndex - 1 + len) % len;
      goToIndex(currentIndex);
    };
    if (nextBtn) nextBtn.onclick = (e) => {
      e.preventDefault();
      const len = getLen();
      if (len <= 0) return;
      currentIndex = (currentIndex + 1) % len;
      goToIndex(currentIndex);
    };
  }

  function attachDrag() {
    if (!slidesTrack) return;
    // al hacer clic en un slide, avanzar a la siguiente card con wrap
    const getStep = () => {
      const sampleSlide = slidesTrack.querySelector('.slide');
      return sampleSlide ? (sampleSlide.getBoundingClientRect().width + 16) : 260;
    };
    const getLen = () => slidesTrack.querySelectorAll('.slide').length;
    const getCurrentIndex = () => {
      const step = getStep();
      return Math.round(slidesTrack.scrollLeft / step);
    };
    const goToIndex = (idx) => {
      const len = getLen();
      if (len <= 0) return;
      const step = getStep();
      const normalized = ((idx % len) + len) % len;
      slidesTrack.scrollTo({ left: normalized * step, behavior: 'smooth' });
    };
    slidesTrack.querySelectorAll('.slide').forEach(slide => {
      slide.addEventListener('click', (e) => {
        e.preventDefault();
        const len = getLen();
        if (len <= 0) return;
        currentIndex = (currentIndex + 1) % len;
        goToIndex(currentIndex);
      });
    });

    // Delegación: botón "Ver itinerario" dentro de cada slide
    slidesTrack.addEventListener('click', (e) => {
      const btn = e.target.closest('.slide-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const slide = btn.closest('.slide');
      const src = slide?.dataset.full || extractBgUrl(slide?.querySelector('.slide-image'));
      if (src) openImageViewer(src);
    });

    slidesTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      slidesTrack.classList.add('dragging');
      startX = e.pageX - slidesTrack.offsetLeft;
      startScrollLeft = slidesTrack.scrollLeft;
    });
    slidesTrack.addEventListener('mouseleave', () => {
      isDown = false;
      slidesTrack.classList.remove('dragging');
    });
    slidesTrack.addEventListener('mouseup', () => {
      isDown = false;
      slidesTrack.classList.remove('dragging');
    });
    slidesTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slidesTrack.offsetLeft;
      const walk = (x - startX);
      slidesTrack.scrollLeft = startScrollLeft - walk;
    });

    // touch support
    slidesTrack.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].pageX - slidesTrack.offsetLeft;
      startScrollLeft = slidesTrack.scrollLeft;
    }, { passive: true });
    slidesTrack.addEventListener('touchend', () => { isDown = false; }, { passive: true });
    slidesTrack.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - slidesTrack.offsetLeft;
      const walk = (x - startX);
      slidesTrack.scrollLeft = startScrollLeft - walk;
    }, { passive: true });
  }

  // Abrir overlay al pulsar cualquier "VER ITINERARIO" dentro de .tour-card
  document.querySelectorAll('.tour-card .btn-tour').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = e.currentTarget.closest('.tour-card');
      const key = card?.getAttribute('data-key') || 'cafe';
      const slides = overlaySlides[key] || [];
      renderSlides(slides);
      if (overlayTitle) {
        const titleEl = card?.querySelector('.tour-content h3');
        overlayTitle.textContent = titleEl ? `Itinerario · ${titleEl.textContent}` : 'Itinerario';
      }
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      attachNav();
    });
  });

  // Cerrar solo con la X
  closeBtn && closeBtn.addEventListener('click', () => {
    closeImageViewer();
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (slidesTrack) slidesTrack.innerHTML = '';
  });

  // Cerrar visor de imagen con su propia X
  overlay.addEventListener('click', (e) => {
    const closeImg = e.target.closest('.image-close');
    if (closeImg) {
      e.preventDefault();
      closeImageViewer();
    }
  });
});