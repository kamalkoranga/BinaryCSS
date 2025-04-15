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
