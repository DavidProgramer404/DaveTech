document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbarMain = document.getElementById('navbar-main');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Mobile menu toggle
    if (mobileToggle && navbarMain) {
        mobileToggle.addEventListener('click', function () {
            navbarMain.classList.toggle('show');
            this.setAttribute('aria-expanded', navbarMain.classList.contains('show'));
        });
    }

    // Dropdown menu toggle
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function (e) {
            e.preventDefault();
            dropdownMenu.classList.toggle('hidden');
            this.setAttribute('aria-expanded', !dropdownMenu.classList.contains('hidden'));
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!mobileToggle.contains(e.target) && !navbarMain.contains(e.target) && navbarMain.classList.contains('show')) {
            navbarMain.classList.remove('show');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });
});