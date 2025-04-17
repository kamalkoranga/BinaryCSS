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

// // margin and padding arbitrary values
document.addEventListener("DOMContentLoaded", function () {
  const marginMap = {
    "m-": ["margin"],
    "mx-": ["margin-left", "margin-right"],
    "my-": ["margin-top", "margin-bottom"],
    "mt-": ["margin-top"],
    "mr-": ["margin-right"],
    "mb-": ["margin-bottom"],
    "ml-": ["margin-left"],
  };

  const paddingMap = {
    "p-": ["padding"],
    "px-": ["padding-left", "padding-right"],
    "py-": ["padding-top", "padding-bottom"],
    "pt-": ["padding-top"],
    "pr-": ["padding-right"],
    "pb-": ["padding-bottom"],
    "pl-": ["padding-left"],
  };

  Object.keys(marginMap).forEach((prefix) => {
    document.querySelectorAll(`[class*="${prefix}["]`).forEach((el) => {
      const classList = Array.from(el.classList);
      const targetClass = classList.find(
        (c) => c.startsWith(prefix) && c.includes("[")
      );

      if (targetClass) {
        const value = targetClass.match(/\[(.*?)\]/)[1];
        marginMap[prefix].forEach((property) => {
          el.style.setProperty(`--${property}-arbitrary`, value);
        });
      }
    });
  });

  Object.keys(paddingMap).forEach((prefix) => {
    document.querySelectorAll(`[class*="${prefix}["]`).forEach((el) => {
      const classList = Array.from(el.classList);
      const targetClass = classList.find(
        (c) => c.startsWith(prefix) && c.includes("[")
      );

      if (targetClass) {
        const value = targetClass.match(/\[(.*?)\]/)[1];
        paddingMap[prefix].forEach((property) => {
          el.style.setProperty(`--${property}-arbitrary`, value);
        });
      }
    });
  });
});



// Process arbitrary height values
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[class*="h-["]').forEach(el => {
    const classList = Array.from(el.classList);
    const heightClass = classList.find(c => c.includes('h-['));
    if (heightClass) {
      const heightValue = heightClass.match(/\[(.*?)\]/)[1];
      el.style.setProperty('--h-arbitrary', heightValue);
    }
  });

  document.querySelectorAll('[class*="w-["]').forEach((el) => {
    const classList = Array.from(el.classList);
    const widthClass = classList.find((c) => c.includes("w-["));
    if (widthClass) {
      const widhtValue = widthClass.match(/\[(.*?)\]/)[1];
      el.style.setProperty("--w-arbitrary", widhtValue);
    }
  });
});

// Arbitrary font size
document.querySelectorAll('[class*="text-["]').forEach(el => {
  const textClass = [...el.classList].find(c => c.startsWith('text-['));
  if (textClass) el.style.setProperty('--text-size', textClass.match(/\[(.*?)\]/)[1]);
});

// Arbitrary text-color
document.querySelectorAll('[class*="tc-["]').forEach(el => {
  const colorClass = [...el.classList].find(c => c.startsWith('tc-['));
  if (colorClass) el.style.setProperty('--text-color', colorClass.match(/\[(.*?)\]/)[1]);
});

// Arbitrary background-color
document.querySelectorAll('[class*="bg-["]').forEach(el => {
  const colorClass = [...el.classList].find(c => c.startsWith('bg-['));
  if (colorClass) el.style.setProperty("--background-color", colorClass.match(/\[(.*?)\]/)[1]);
});