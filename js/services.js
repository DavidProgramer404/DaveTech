


document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function() {
            // Alterna la clase 'hidden' para mostrar/ocultar el menú desplegable
            dropdownMenu.classList.toggle('hidden');

            // Alterna el atributo aria-expanded para accesibilidad
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
        });

        // Cierra el menú desplegable si el usuario hace clic fuera de él
        document.addEventListener('click', function(event) {
            if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('hidden');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

