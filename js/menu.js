document.addEventListener('DOMContentLoaded', function() {
    // --- Funcionalidad del Dropdown "Servicios" ---
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function() {
            dropdownMenu.classList.toggle('hidden');
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
        });

        // Cierra el dropdown si se hace clic fuera de él
        document.addEventListener('click', function(event) {
            if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('hidden');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Funcionalidad del Menú Móvil (Botón de Hamburguesa) ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbarMain = document.getElementById('navbar-main');

    if (mobileToggle && navbarMain) {
        mobileToggle.addEventListener('click', function() {
            // Alterna la clase 'hidden' para mostrar/ocultar la navegación principal
            navbarMain.classList.toggle('hidden');

            // En pantallas móviles, queremos que el menú se muestre como un bloque y no como flex horizontal
            // Tailwind ya tiene `md:flex` y `hidden` en el nav,
            // pero si necesitas más control para sobrescribir en móvil:
            // navbarMain.classList.toggle('flex-col'); // Si no usaste flex-col en el HTML del nav
            // navbarMain.classList.toggle('absolute'); // Podrías querer que sea absoluto para cubrir contenido

            // Alterna el atributo aria-expanded para accesibilidad
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }
});