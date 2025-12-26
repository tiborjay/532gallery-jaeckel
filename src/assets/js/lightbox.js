(() => {
  // Run after DOM is ready (Eleventy pages can load scripts early depending on placement)
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    const thumbs = Array.from(document.querySelectorAll(".js-lightbox"));
    if (!thumbs.length) return;

    const urls = thumbs
      .map((img) => img.getAttribute("src"))
      .filter(Boolean);

    if (!urls.length) return;

    let idx = 0;
    let zoomed = false;

    // Build overlay
    const overlay = document.createElement("div");
    overlay.className = "lb";
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
      <div class="lb__stage" role="dialog" aria-modal="true">
        <button class="lb__close" type="button" aria-label="Close">×</button>

        <button class="lb__nav lb__prev" type="button" aria-label="Previous">‹</button>

        <figure class="lb__figure">
          <img class="lb__img" alt="">
        </figure>

        <button class="lb__nav lb__next" type="button" aria-label="Next">›</button>

        <div class="lb__count"><span class="lb__cur">1</span>/<span class="lb__tot">1</span></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const stage = overlay.querySelector(".lb__stage");
    const imgEl = overlay.querySelector(".lb__img");
    const btnClose = overlay.querySelector(".lb__close");
    const btnPrev = overlay.querySelector(".lb__prev");
    const btnNext = overlay.querySelector(".lb__next");
    const curEl = overlay.querySelector(".lb__cur");
    const totEl = overlay.querySelector(".lb__tot");

    totEl.textContent = String(urls.length);

    function setImage(i) {
      idx = ((i % urls.length) + urls.length) % urls.length;
      zoomed = false;

      imgEl.src = urls[idx];
      imgEl.classList.remove("is-zoom");
      imgEl.style.transform = ""; // reset any pan/zoom transforms if you add later

      curEl.textContent = String(idx + 1);

      // Disable arrows when only 1 image
      const showNav = urls.length > 1;
      btnPrev.style.display = showNav ? "" : "none";
      btnNext.style.display = showNav ? "" : "none";
    }

    function open(i) {
      setImage(i);
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("lb-open");
    }

    function close() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lb-open");
      zoomed = false;
      imgEl.classList.remove("is-zoom");
    }

    function prev() {
      setImage(idx - 1);
    }

    function next() {
      setImage(idx + 1);
    }

    // ---- EVENTS ----

    // Open from thumbnails (use data-index if present, fallback to loop index)
    thumbs.forEach((img, i) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const di = img.getAttribute("data-index");
        open(di !== null ? parseInt(di, 10) : i);
      });
    });

    // Clicking backdrop closes
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    // Stop clicks inside stage from closing
    stage.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close button
    btnClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      close();
    });

    // IMPORTANT: stopPropagation so arrows don't bubble up and close overlay
    btnPrev.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      prev();
    });

    btnNext.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      next();
    });

    // Toggle zoom on image click
    imgEl.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      zoomed = !zoomed;
      imgEl.classList.toggle("is-zoom", zoomed);
    });

    // Keyboard nav
    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("is-open")) return;

      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });
  });
})();


