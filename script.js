document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("tourOverlay");
  const closeBtn = overlay ? overlay.querySelector(".tour-close") : null;
  const overlayTitle = overlay
    ? overlay.querySelector("#tourOverlayTitle")
    : null;
  const carouselInner = document.getElementById("carouselInner");
  const carouselIndicators = document.getElementById("carouselIndicators");

  if (!overlay) return;

  // Slides por sección
  const overlaySlides = {
    cafe: [
      {
        title: "Finca de Autor",
        img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80",
        desc: "Tour guiado por cultivo y beneficio del café",
        meta: ["Duración: 6h", "Café", "Cupo: 12"],
      },
      {
        title: "Taller Barismo",
        img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80",
        desc: "Filtrados y latte art básico con expertos",
        meta: ["Duración: 4h", "Intro", "Cupo: 10"],
      },
      {
        title: "Sendero Sombreado",
        img: "/assets//img/imagenprueba2.jpeg",
        desc: "Caminata suave y avistamiento de aves",
        meta: ["Duración: 5h", "Naturaleza", "Cupo: 15"],
      },
      {
        title: "Catación y Rueda",
        img: "/assets/img/descafeinado_web.jpg",
        desc: "Sesión SCA y rueda de sabores",
        meta: ["Duración: 3h", "Cata", "Cupo: 8"],
      },
    ],
    palmas: [
      {
        title: "Cocora Científico",
        img: "https://images.unsplash.com/photo-1543241017-4d8c3fd92c40?auto=format&fit=crop&w=800&q=80",
        desc: "Interpretación ecológica con guía especializado",
        meta: ["Duración: 6h", "Medio", "Cupo: 14"],
      },
      {
        title: "Fotografía Andina",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
        desc: "Salida de foto con tips técnicos profesionales",
        meta: ["Duración: 5h", "Foto", "Cupo: 10"],
      },
      {
        title: "Biodiversidad",
        img: "https://images.unsplash.com/photo-1482192505345-5655af888f90?auto=format&fit=crop&w=800&q=80",
        desc: "Caminata interpretativa y avistamiento de fauna",
        meta: ["Duración: 4h", "Ecosistemas", "Cupo: 16"],
      },
      {
        title: "Valle de Palmas",
        img: "https://images.unsplash.com/photo-1477764868470-7f4f0e7c7010?auto=format&fit=crop&w=800&q=80",
        desc: "Ruta icónica y miradores panorámicos",
        meta: ["Duración: 7h", "Paisaje", "Cupo: 12"],
      },
    ],
    mice: [
      {
        title: "Liderazgo en Naturaleza",
        img: "https://images.unsplash.com/photo-1520962918403-54e1100b2bd2?auto=format&fit=crop&w=800&q=80",
        desc: "Workshop outdoor con dinámicas de equipo",
        meta: ["Duración: 4h", "Team", "Cupo: 20"],
      },
      {
        title: "Logística Técnica",
        img: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=800&q=80",
        desc: "Montaje y operación profesional de eventos",
        meta: ["Duración: 6h", "Evento", "Cupo: 30"],
      },
      {
        title: "Impacto Social Neutro",
        img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
        desc: "Buenas prácticas y medición de impacto",
        meta: ["Duración: 3h", "Sostenible", "Cupo: 25"],
      },
      {
        title: "Cierre Ejecutivo",
        img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
        desc: "Presentación de resultados y networking",
        meta: ["Duración: 2h", "Corporativo", "Cupo: 40"],
      },
    ],
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

      carouselItem.innerHTML = `
        <img src="${slide.img}" class="d-block w-100" alt="${slide.title}">
        <div class="carousel-caption d-md-block">
          <h5>${slide.title}</h5>
          <p>${slide.desc}</p>
          <div class="badges-container">
            ${slide.meta.map((m) => `<span class="badge bg-success">${m}</span>`).join("")}
          </div>
        </div>
      `;

      carouselInner.appendChild(carouselItem);
    });
  }

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
      const carouselElement = document.getElementById("tourCarousel");
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
        }
      }, 100);
    });
  });

  // Cerrar overlay
  closeBtn?.addEventListener("click", () => {
    // Destruir instancia del carrusel antes de cerrar
    const carouselElement = document.getElementById("tourCarousel");
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
