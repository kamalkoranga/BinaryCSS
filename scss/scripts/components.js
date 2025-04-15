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