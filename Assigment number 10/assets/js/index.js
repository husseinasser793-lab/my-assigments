document.addEventListener("DOMContentLoaded", function () {
  // Save the settings so they are still there after refreshing the page
  let savedSettings = {};

  try {
    savedSettings = JSON.parse(localStorage.getItem("portfolioSettings")) || {};
  } catch (error) {
    savedSettings = {};
  }

  let themeButton = document.getElementById("theme-toggle-button");
  let fontButtons = document.querySelectorAll(".font-option");
  let colorGrid = document.getElementById("theme-colors-grid");

  // Dark and light mode - add or remove the dark class from the html tag
  function changeTheme(isDark) {
    document.documentElement.classList.toggle("dark", isDark);
    themeButton.setAttribute("aria-pressed", isDark);
    savedSettings.theme = isDark ? "dark" : "light";
    saveSettings();
  }

  changeTheme(savedSettings.theme !== "light");

  themeButton.addEventListener("click", function () {
    let darkModeIsOn = document.documentElement.classList.contains("dark");
    changeTheme(!darkModeIsOn);
  });

  // Change the font when one of the font buttons is clicked
  function changeFont(fontName) {
    document.body.classList.remove("font-tajawal", "font-alexandria", "font-cairo");
    document.body.classList.add("font-" + fontName);

    fontButtons.forEach(function (button) {
      let isSelected = button.dataset.font === fontName;
      button.classList.toggle("active", isSelected);
      button.setAttribute("aria-checked", isSelected);
    });

    savedSettings.font = fontName;
    saveSettings();
  }

  fontButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      changeFont(button.dataset.font);
    });
  });

  changeFont(savedSettings.font || "tajawal");

  // Add the color choices to the settings panel
  let colorThemes = [
    { name: "Indigo", primary: "#6366f1", secondary: "#8b5cf6", accent: "#ec4899" },
    { name: "Ocean", primary: "#0891b2", secondary: "#2563eb", accent: "#14b8a6" },
    { name: "Emerald", primary: "#059669", secondary: "#0d9488", accent: "#84cc16" },
    { name: "Sunset", primary: "#ea580c", secondary: "#e11d48", accent: "#f59e0b" },
    { name: "Rose", primary: "#e11d48", secondary: "#db2777", accent: "#a855f7" },
    { name: "Gold", primary: "#ca8a04", secondary: "#ea580c", accent: "#16a34a" },
    { name: "Violet", primary: "#7c3aed", secondary: "#4f46e5", accent: "#06b6d4" },
    { name: "Slate", primary: "#475569", secondary: "#0f766e", accent: "#d97706" }
  ];

  function changeColors(colors) {
    document.documentElement.style.setProperty("--color-primary", colors.primary);
    document.documentElement.style.setProperty("--color-secondary", colors.secondary);
    document.documentElement.style.setProperty("--color-accent", colors.accent);

    savedSettings.colors = colors;
    updateSelectedColor();
    saveSettings();
  }

  function updateSelectedColor() {
    colorGrid.querySelectorAll("button").forEach(function (button) {
      let color = JSON.parse(button.dataset.colors);
      let isSelected = savedSettings.colors &&
        color.primary === savedSettings.colors.primary &&
        color.secondary === savedSettings.colors.secondary &&
        color.accent === savedSettings.colors.accent;

      button.style.outline = isSelected ? "3px solid " + savedSettings.colors.primary : "";
      button.style.outlineOffset = isSelected ? "3px" : "";
      button.setAttribute("aria-pressed", isSelected);
    });
  }

  colorThemes.forEach(function (colors) {
    let colorButton = document.createElement("button");
    colorButton.type = "button";
    colorButton.className = "h-11 w-11 rounded-full border-2 border-white dark:border-slate-800 shadow-md transition-transform hover:scale-110";
    colorButton.title = colors.name;
    colorButton.setAttribute("aria-label", colors.name + " color theme");
    colorButton.dataset.colors = JSON.stringify(colors);
    colorButton.style.backgroundColor = colors.primary;

    colorButton.addEventListener("click", function () {
      changeColors(colors);
    });

    colorGrid.appendChild(colorButton);
  });

  changeColors(savedSettings.colors || colorThemes[0]);

  // Save settings in localStorage
  function saveSettings() {
    try {
      localStorage.setItem("portfolioSettings", JSON.stringify(savedSettings));
    } catch (error) {
      // The page still works if the browser does not allow localStorage
    }
  }

  // Open and close the settings sidebar
  let settingsButton = document.getElementById("settings-toggle");
  let settingsPanel = document.getElementById("settings-sidebar");
  let closeSettingsButton = document.getElementById("close-settings");

  function showSettings(show) {
    settingsPanel.classList.toggle("translate-x-0", show);
    settingsPanel.classList.toggle("translate-x-full", !show);
    settingsPanel.setAttribute("aria-hidden", !show);
    settingsButton.setAttribute("aria-expanded", show);
  }

  settingsButton.addEventListener("click", function () {
    showSettings(true);
  });

  closeSettingsButton.addEventListener("click", function () {
    showSettings(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      showSettings(false);
    }
  });

  // Reset the settings to their original values
  document.getElementById("reset-settings").addEventListener("click", function () {
    changeTheme(true);
    changeFont("tajawal");
    changeColors(colorThemes[0]);
  });

  // Filter the portfolio projects when a tab is clicked
  let filterButtons = document.querySelectorAll(".portfolio-filter");
  let portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      let category = button.dataset.filter;

      filterButtons.forEach(function (filterButton) {
        let isSelected = filterButton === button;
        filterButton.classList.toggle("active", isSelected);
        filterButton.setAttribute("aria-pressed", isSelected);

        if (isSelected) {
          filterButton.classList.add("bg-linear-to-r", "from-primary", "to-secondary", "text-white");
          filterButton.classList.remove("bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300");
        } else {
          filterButton.classList.remove("bg-linear-to-r", "from-primary", "to-secondary", "text-white");
          filterButton.classList.add("bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300");
        }
      });

      portfolioItems.forEach(function (item) {
        let shouldShow = category === "all" || item.dataset.category === category;
        item.classList.toggle("hidden", !shouldShow);
      });
    });
  });

  // Update the active navbar link when the page is scrolled
  let navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  let pageSections = Array.from(navLinks).map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);
  let topButton = document.getElementById("scroll-to-top");

  function updatePageOnScroll() {
    let currentSection = "hero-section";

    pageSections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 200) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(function (link) {
      let isActive = link.getAttribute("href") === "#" + currentSection;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    let showTopButton = window.scrollY > 350;
    topButton.classList.toggle("opacity-0", !showTopButton);
    topButton.classList.toggle("invisible", !showTopButton);
    topButton.classList.toggle("opacity-100", showTopButton);
    topButton.classList.toggle("visible", showTopButton);
  }

  window.addEventListener("scroll", updatePageOnScroll);
  window.addEventListener("resize", updatePageOnScroll);
  updatePageOnScroll();

  topButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Testimonials carousel
  let carousel = document.getElementById("testimonials-carousel");
  let testimonialCards = carousel.querySelectorAll(".testimonial-card");
  let indicators = document.querySelector('[aria-label="مؤشرات التوصيات"]');
  let nextButton = document.getElementById("next-testimonial");
  let previousButton = document.getElementById("prev-testimonial");
  let currentSlide = 0;
  let cardsToShow = 1;
  let carouselTimer;

  function getCardsToShow() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  function getLastSlide() {
    return Math.max(0, testimonialCards.length - cardsToShow);
  }

  function showSlide() {
    currentSlide = Math.min(currentSlide, getLastSlide());
    carousel.style.transform = "translateX(" + currentSlide * (100 / cardsToShow) + "%)";

    indicators.querySelectorAll(".carousel-indicator").forEach(function (indicator, index) {
      let isSelected = index === currentSlide;
      indicator.setAttribute("aria-selected", isSelected);
      indicator.classList.toggle("bg-accent", isSelected);
      indicator.classList.toggle("bg-slate-400", !isSelected);
      indicator.classList.toggle("dark:bg-slate-600", !isSelected);
    });
  }

  function makeIndicators() {
    let numberOfSlides = getLastSlide() + 1;
    indicators.innerHTML = "";

    for (let i = 0; i < numberOfSlides; i++) {
      let indicator = document.createElement("button");
      indicator.type = "button";
      indicator.className = "carousel-indicator w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 transition-all duration-300 hover:scale-125 cursor-pointer";
      indicator.setAttribute("role", "tab");
      indicator.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      indicator.dataset.index = i;

      indicator.addEventListener("click", function () {
        currentSlide = Number(this.dataset.index);
        showSlide();
        startCarousel();
      });

      indicators.appendChild(indicator);
    }

    showSlide();
  }

  function startCarousel() {
    clearInterval(carouselTimer);
  }
})
