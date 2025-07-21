// Mobile menu functionality
const mobileToggle = document.getElementById('mobile-toggle');
const navbarNav = document.getElementById('navbar-nav');
const mobileServicesToggle = document.getElementById('mobile-services-toggle');
const mobileServicesMenu = document.getElementById('mobile-services-menu');
const mobileMenuActiveClass = 'mobile-menu-open'; // Clase para mostrar el menú

if (mobileToggle && navbarNav) {
  mobileToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    navbarNav.classList.toggle(mobileMenuActiveClass);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbarNav.contains(e.target) && !mobileToggle.contains(e.target) && navbarNav.classList.contains(mobileMenuActiveClass)) {
      navbarNav.classList.remove(mobileMenuActiveClass);
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (mobileServicesToggle && mobileServicesMenu) {
  mobileServicesToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    mobileServicesMenu.classList.toggle('hidden');
  });

  // Cerrar submenú servicios al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!mobileServicesMenu.contains(e.target) && !mobileServicesToggle.contains(e.target)) {
      mobileServicesMenu.classList.add('hidden');
    }
  });
}

// Mostrar/ocultar menú desplegable móvil en index.html
const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');

if (mobileDropdownToggle && mobileDropdownMenu) {
  mobileDropdownToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    mobileDropdownMenu.classList.toggle('hidden');
  });
  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!mobileDropdownMenu.contains(e.target) && !mobileDropdownToggle.contains(e.target)) {
      mobileDropdownMenu.classList.add('hidden');
    }
  });
}