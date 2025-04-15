// Modal
document.querySelectorAll("[data-modal-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-modal-open");
    document.getElementById(modalId)?.classList.add("active");
  });
});

document.querySelectorAll("[data-modal-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".modal")?.classList.remove("active");
  });
});


// Dropdown
document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const menu = toggle.nextElementSibling;
    menu?.classList.toggle("active");
  });
});


// Accordion
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const body = header.nextElementSibling;
    body?.classList.toggle('active');
  });
});


// Carousel
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const items = carousel.querySelectorAll(".carousel-item");
  let index = 0;

  const updateSlide = () => {
    const width = carousel.offsetWidth;
    track.style.transform = `translateX(-${index * width}px)`;
  };

  const slideTo = (newIndex) => {
    index = (newIndex + items.length) % items.length;
    updateSlide();
  };

  carousel
    .querySelector('[data-carousel="prev"]')
    ?.addEventListener("click", () => {
      slideTo(index - 1);
    });

  carousel
    .querySelector('[data-carousel="next"]')
    ?.addEventListener("click", () => {
      slideTo(index + 1);
    });

  window.addEventListener("resize", updateSlide);

  // On load
  updateSlide();
});
