document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileServicesDropdownBtn = document.getElementById("mobile-services-dropdown-btn");
  const mobileServicesDropdown = document.getElementById("mobile-services-dropdown");
  const mobileUserDropdownBtn = document.getElementById("mobile-user-dropdown-btn");
  const mobileUserDropdown = document.getElementById("mobile-user-dropdown");
  const desktopDropdownToggles = document.querySelectorAll(".dropdown-toggle");

  // Toggle mobile menu
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
      console.log("Mobile menu button clicked. Mobile menu hidden: " + mobileMenu.classList.contains("hidden"));
    });

    // Add event listener for close button (X)
    const mobileMenuCloseBtn = document.getElementById("mobile-menu-close");
    if (mobileMenuCloseBtn) {
      mobileMenuCloseBtn.addEventListener("click", function() {
        mobileMenu.classList.add("hidden");
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target) && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }
    });
  }

  // La lógica de los dropdowns móviles ahora es manejada por Bootstrap.

  // La lógica de los dropdowns de escritorio ahora es manejada por Bootstrap.
});