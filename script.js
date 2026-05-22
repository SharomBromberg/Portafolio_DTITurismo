document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("tourOverlay");
  const closeBtn = overlay ? overlay.querySelector(".tour-close") : null;
  const overlayTitle = overlay
    ? overlay.querySelector("#tourOverlayTitle")
    : null;
  const carouselInner = document.getElementById("carouselInner");
  const carouselIndicators = document.getElementById("carouselIndicators");
  const carouselElement = document.getElementById("tourCarousel");

  const equalizeCardSections = () => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const titleEls = document.querySelectorAll(".tour-content h3");
    const bodyEls = document.querySelectorAll(".tour-content p");
    const highlightEls = document.querySelectorAll(".highlights");
    const footerEls = document.querySelectorAll(".footer-card");

    const resetHeights = (els) => {
      els.forEach((el) => {
        el.style.minHeight = "";
        el.style.height = "";
      });
    };

    resetHeights(titleEls);
    resetHeights(bodyEls);
    resetHeights(highlightEls);
    resetHeights(footerEls);

    if (!desktop) return;

    const setMaxMinHeight = (els) => {
      if (!els.length) return;
      let max = 0;
      els.forEach((el) => {
        max = Math.max(max, el.offsetHeight);
      });
      els.forEach((el) => {
        el.style.minHeight = `${max}px`;
      });
    };

    setMaxMinHeight(titleEls);
    setMaxMinHeight(bodyEls);
    setMaxMinHeight(highlightEls);
    setMaxMinHeight(footerEls);
  };

  const scheduleEqualize = () => {
    window.requestAnimationFrame(equalizeCardSections);
  };

  scheduleEqualize();
  window.addEventListener("load", scheduleEqualize);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleEqualize);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(scheduleEqualize, 150);
  });
  if (!overlay) return;

  // Slides por sección. Para video usa: { title, video: "assets/videos/archivo.mp4", poster: "assets/img/portada.png", desc }
  const overlaySlides = {
    transformacion: [
      {
        title: "Immersión Norcasia",
        type: "image",
        src: "assets/img/materialVisual/caldas/Norcasia.jpg",
        poster: "assets/img/materialVisual/caldas/Norcasia.jpg",
        desc: "¿Listo para desconectarte y dejar una huella positiva? Te invitamos a vivir 3 días de Turismo Aventura, Naturaleza y Regeneraciónen Norcasia, Caldas, el paraíso hídrico de nuestra región.  A través de un viaje pausado y consciente, navegaremos el Embalse Amaní , flotaremos haciendo bodyrafting por el Río La Miel y nos recargaremos en las cascadas El Cielo y La Clara. Disfrutaremos de la gastronomía local y viviremos una experiencia única de conexión con la comunidad junto a la Asociación Avocado Queens."
      },
      {
        title: "Nevado del Ruiz",
        type: "image",
        src: "assets/img/materialVisual/caldas/NevadodelRuiz.jpg",
        poster: "assets/img/materialVisual/caldas/NevadodelRuiz.jpg",
        desc: "¿Listo para tocar el cielo a 4.450 metros y terminar el día en aguas termales? DTI Travel te invita a vivir la travesía de alta montaña más completa de la región en un solo día.  Déjate sorprender por el espejo glaciar de Laguna Negra, conquista las 5 estaciones del PNN Los Nevados hasta el místico Valle de las Tumbas, y deléitate con la gastronomía de fuego y dulces tradicionales en Murillo (Tolima). El broche de oro de la aventura será un descenso exclusivo hacia el confort y la relajación total en las piscinas mineromedicinales de Termales del Otoño. El premio perfecto que tu cuerpo merece.",
      },
      {
        title: "Immersión Cafetera",
        type: "image",
        src: "assets/img/materialVisual/Cafetero/CafeHoney.png",
        poster: "assets/img/materialVisual/Cafetero/CafeHoney.png",
        desc: "Una travesía hacia la cima de la introspección, donde el silencio de las alturas y la majestuosidad del paisaje se convierten en un espejo para la transformación personal.",
      },
      {
        title: "Parque de la Fruta",
        type: "image",
        src: "assets/img/materialVisual/caldas/pdelafruta.jpeg",
        poster: "assets/img/materialVisual/caldas/pdelafruta.jpeg",
        desc: "Un camino tradicional de los cerros orientales que invita a la reflexión consciente en medio de la biodiversidad andina.",
      },
    ],
    caldas: [
      {
        title: "Salamina (Pueblo Patrimonio)",
        type: "image",
        src: "assets/img/materialVisual/caldas/salamina.png",
        desc: "El punto de partida donde la madera tallada y los balcones floridos narran historias de la colonización. Una inmersión en la estética y el ritmo de un pueblo que se detuvo en el tiempo para conservar su elegancia.",
      },
      {
        title: "Marulanda",
        type: "image",
        src: "assets/img/materialVisual/caldas/marulanda.png",
        desc: "Sumérgete en el silencio de los campos de altura para conectar con el ritmo pausado de la tejeduría. Es un encuentro con la esencia del campo caldense, donde cada ruana narra una historia de resistencia, montaña y el calor de un territorio que abraza al viajero",
      },
      {
        title: "San Félix",
        type: "image",
        src: "assets/img/materialVisual/caldas/sanFelix.png",
        desc: "El encuentro con el Valle de la Samaria, un refugio de paz donde las palmas de cera rozan las nubes. Es el lugar perfecto para el silencio y la contemplación de la biodiversidad en su estado más puro.",
      },
    ],
    cafe: [
      {
        title: "En construcción...",
        type: "image",
        src: "assets/img/materialVisual/Cafetero/mapacafeteroCol.png",
        desc: "Estamos preparando este proyecto con mucho cariño por nuestras regiones cafeteras. Muy pronto compartiremos todos los detalles. <br> <b> Si quieres hacer parte de este proyecto no dudes en contactarnos.</b> ",
      },
    ],
  };

  const videoExtensions = /\.(mp4|m4v|mov|ogg|ogv|webm)$/i;

  const escapeHtml = (value = "") =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[char])
    );

  const getSlideMediaType = (slide) => {
    if (slide.type) return String(slide.type).toLowerCase();
    if (slide.video) return "video";

    const source = slide.src || slide.img || "";
    return videoExtensions.test(source) ? "video" : "image";
  };

  const getSlideSource = (slide) => slide.src || slide.video || slide.img || "";

  const renderSlideMedia = (slide) => {
    const source = getSlideSource(slide);
    const safeSource = escapeHtml(source);
    const safeTitle = escapeHtml(slide.title || "Contenido del itinerario");

    if (getSlideMediaType(slide) === "video") {
      const posterSource = slide.poster || slide.img;
      const poster = posterSource
        ? ` poster="${escapeHtml(posterSource)}"`
        : "";
      const mimeType = slide.mimeType
        ? ` type="${escapeHtml(slide.mimeType)}"`
        : "";

      return `
        <video class="d-block w-100 carousel-media" autoplay muted playsinline preload="metadata" aria-label="${safeTitle}"${poster}>
          <source src="${safeSource}"${mimeType}>
          Tu navegador no puede reproducir este video.
        </video>
      `;
    }

    return `<img src="${safeSource}" class="d-block w-100 carousel-media" alt="${safeTitle}">`;
  };

  const pauseCarouselVideos = () => {
    carouselInner?.querySelectorAll("video").forEach((video) => {
      video.pause();
    });
  };

  const prepareCarouselVideos = () => {
    carouselInner?.querySelectorAll("video").forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.addEventListener("volumechange", () => {
        if (video.muted && video.volume === 0) return;

        video.muted = true;
        video.volume = 0;
      });
    });
  };

  const playActiveCarouselVideo = () => {
    const activeVideo = carouselInner?.querySelector(
      ".carousel-item.active video"
    );

    if (!activeVideo) return;

    activeVideo.muted = true;
    activeVideo.volume = 0;
    activeVideo.play().catch(() => {
      // Algunos navegadores bloquean el autoplay hasta la primera interacción.
    });
  };

  const toggleVideoPlayback = (video) => {
    if (video.paused) {
      video.play().catch(() => { });
      return;
    }

    video.pause();
  };

  function renderBootstrapCarousel(slides) {
    if (!carouselInner || !carouselIndicators) return;

    // Limpiar contenido previo
    carouselInner.innerHTML = "";
    carouselIndicators.innerHTML = "";

    slides.forEach((slide, index) => {
      // Crear indicador
      const indicator = document.createElement("button");
      indicator.type = "button";
      indicator.setAttribute("data-bs-target", "#tourCarousel");
      indicator.setAttribute("data-bs-slide-to", index);
      indicator.setAttribute("aria-label", `Slide ${index + 1}`);
      if (index === 0) {
        indicator.className = "active";
        indicator.setAttribute("aria-current", "true");
      }
      carouselIndicators.appendChild(indicator);

      // Crear slide
      const carouselItem = document.createElement("div");
      carouselItem.className =
        index === 0 ? "carousel-item active" : "carousel-item";
      if (getSlideMediaType(slide) === "video") {
        carouselItem.classList.add("has-video");
      }

      carouselItem.innerHTML = `
        ${renderSlideMedia(slide)}
        <div class="carousel-caption d-block">
          <h5>${slide.title}</h5>
          <p>${slide.desc}</p>
          <a href="https://wa.me/573126914482?text=Hola,%20estoy%20interesado%20en%20${encodeURIComponent(slide.title)}" 
             target="_blank" 
             class="btn btn-success whatsapp-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 8px;">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
            Más información
          </a>
        </div>
      `;

      carouselInner.appendChild(carouselItem);
    });

    prepareCarouselVideos();
  }

  carouselElement?.addEventListener("slide.bs.carousel", pauseCarouselVideos);
  carouselElement?.addEventListener("slid.bs.carousel", playActiveCarouselVideo);

  carouselInner?.addEventListener("click", (e) => {
    const video = e.target.closest("video");
    if (!video) return;

    e.preventDefault();
    toggleVideoPlayback(video);
  });

  // Abrir overlay al pulsar "VER PLANES"
  document.querySelectorAll(".tour-card .btn-tour").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.currentTarget.closest(".tour-card");
      const key = card?.getAttribute("data-key") || "cafe";
      const slides = overlaySlides[key] || [];

      if (overlayTitle) {
        const titleEl = card?.querySelector(".tour-content h3");
        overlayTitle.textContent = titleEl
          ? `Itinerario · ${titleEl.textContent}`
          : "Itinerario";
      }

      overlay.classList.add("open");
      document.body.style.overflow = "hidden";

      // Destruir instancia previa del carrusel si existe
      if (carouselElement) {
        const existingCarousel =
          bootstrap.Carousel.getInstance(carouselElement);
        if (existingCarousel) {
          existingCarousel.dispose();
        }
      }

      // Renderizar slides
      renderBootstrapCarousel(slides);

      // Inicializar el carrusel DESPUÉS de que el DOM esté actualizado
      setTimeout(() => {
        if (carouselElement) {
          new bootstrap.Carousel(carouselElement, {
            interval: false,
            wrap: true,
            ride: false,
          });
          playActiveCarouselVideo();
        }
      }, 100);
    });
  });

  // Cerrar overlay
  closeBtn?.addEventListener("click", () => {
    // Destruir instancia del carrusel antes de cerrar
    pauseCarouselVideos();
    if (carouselElement) {
      const existingCarousel = bootstrap.Carousel.getInstance(carouselElement);
      if (existingCarousel) {
        existingCarousel.dispose();
      }
    }

    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (carouselInner) carouselInner.innerHTML = "";
    if (carouselIndicators) carouselIndicators.innerHTML = "";
  });
});
