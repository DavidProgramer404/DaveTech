document.addEventListener("DOMContentLoaded", function () {
  const mobileToggle = document.getElementById("mobile-toggle");
  const navbarMain = document.getElementById("navbar-main");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  // Mobile menu toggle
  if (mobileToggle && navbarMain) {
    mobileToggle.addEventListener("click", function () {
      navbarMain.classList.toggle("show");
      this.setAttribute("aria-expanded", navbarMain.classList.contains("show"));
    });
  }

  // Dropdown menu toggle
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", function (e) {
      e.preventDefault();
      dropdownMenu.classList.toggle("hidden");
      this.setAttribute(
        "aria-expanded",
        !dropdownMenu.classList.contains("hidden")
      );
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !dropdownToggle.contains(e.target) &&
        !dropdownMenu.contains(e.target)
      ) {
        dropdownMenu.classList.add("hidden");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      mobileToggle &&
      navbarMain &&
      !mobileToggle.contains(e.target) &&
      !navbarMain.contains(e.target) &&
      navbarMain.classList.contains("show")
    ) {
      navbarMain.classList.remove("show");
      mobileToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Toggle mobile menu
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Toggle mobile services dropdown
  // Toggle mobile services dropdown
  const mobileServicesDropdownBtn = document.getElementById(
    "mobile-services-dropdown-btn"
  );
  const mobileServicesDropdown = document.getElementById(
    "mobile-services-dropdown"
  );
  if (mobileServicesDropdownBtn && mobileServicesDropdown) {
    mobileServicesDropdownBtn.addEventListener("click", function () {
      mobileServicesDropdown.classList.toggle("hidden");
    });
  }

  // Desktop services dropdown (show on hover)
  const servicesDropdownBtn = document.getElementById("services-dropdown-btn");
  const servicesDropdown = document.getElementById("services-dropdown");
  if (servicesDropdownBtn && servicesDropdown) {
    servicesDropdownBtn.addEventListener("mouseenter", function () {
      servicesDropdown.classList.remove("hidden");
    });
    servicesDropdownBtn.addEventListener("mouseleave", function () {
      setTimeout(() => {
        if (!servicesDropdown.matches(":hover")) {
          servicesDropdown.classList.add("hidden");
        }
      }, 100);
    });
    servicesDropdown.addEventListener("mouseleave", function () {
      servicesDropdown.classList.add("hidden");
    });
    servicesDropdown.addEventListener("mouseenter", function () {
      servicesDropdown.classList.remove("hidden");
    });
  }
});
