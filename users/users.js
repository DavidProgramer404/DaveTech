document.addEventListener('DOMContentLoaded', () => {
  // Formularios
  const loginForm = document.getElementById('user-login-form');
  const registerForm = document.getElementById('user-register-form');

  // Funciones de gestión de usuarios
  const getUsers = () => {
    return JSON.parse(localStorage.getItem('users')) || [];
  };

  const saveUser = (username, password) => {
    const users = getUsers();
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
  };

  const findUser = (username, password) => {
    const users = getUsers();
    return users.find(user => user.username === username && user.password === password);
  };

  // Manejo del registro de usuarios
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = e.target['new-username'].value;
      const password = e.target['new-password'].value;
      const confirmPassword = e.target['confirm-password'].value;

      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      const users = getUsers();
      if (users.some(user => user.username === username)) {
        alert('El nombre de usuario ya existe');
        return;
      }

      saveUser(username, password);
      sessionStorage.setItem('currentUser', username);
      window.location.href = '../index.html';
    });
  }

  // Manejo del inicio de sesión
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = e.target.username.value;
      const password = e.target.password.value;

      const user = findUser(username, password);
      if (user) {
        sessionStorage.setItem('currentUser', username);
        window.location.href = '../index.html';
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    });
  }

  // Verificar si el usuario está logueado y actualizar la interfaz
  const checkUserLogin = () => {
    const currentUser = sessionStorage.getItem('currentUser');
    const loginButtons = document.querySelectorAll('.login-button');
    const userInfos = document.querySelectorAll('.user-info');
    const logoutButtons = document.querySelectorAll('.logout-button');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    if (currentUser) {
      // Ocultar botones de login y mostrar información de usuario
      loginButtons.forEach(button => {
        if (!button.closest('.dropdown-menu')) {
          button.classList.add('hidden');
        }
      });
      userInfos.forEach(info => {
        info.textContent = `¡Hola, ${currentUser}!`;
        info.classList.remove('hidden');
      });
      logoutButtons.forEach(button => button.classList.remove('hidden'));

      // Ocultar opciones de login en los menús desplegables
      dropdownMenus.forEach(menu => {
        const loginItems = menu.querySelectorAll('.login-button');
        loginItems.forEach(item => item.classList.add('hidden'));
      });
    } else {
      // Mostrar botones de login y ocultar información de usuario
      loginButtons.forEach(button => button.classList.remove('hidden'));
      userInfos.forEach(info => info.classList.add('hidden'));
      logoutButtons.forEach(button => button.classList.add('hidden'));

      // Mostrar opciones de login en los menús desplegables
      dropdownMenus.forEach(menu => {
        const loginItems = menu.querySelectorAll('.login-button');
        loginItems.forEach(item => item.classList.remove('hidden'));
      });
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    sessionStorage.removeItem('currentUser');
    const currentPath = window.location.pathname;
    const loginPath = currentPath.includes('/pages/') ? '../users/login.html' : 'users/login.html';
    window.location.href = loginPath;
  };

  // Configurar dropdowns del menú
  const setupDropdowns = () => {
    // Dropdown de servicios desktop
    const servicesDropdown = document.querySelector('.dropdown-toggle');
    if (servicesDropdown) {
      servicesDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = e.currentTarget.nextElementSibling;
        menu.classList.toggle('hidden');
      });
    }

    // Dropdown de usuario desktop
    const userDropdown = document.querySelector('.dropdown-toggle:last-of-type');
    if (userDropdown) {
      userDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = e.currentTarget.nextElementSibling;
        menu.classList.toggle('hidden');
      });
    }

    // Dropdowns móviles
    const mobileServicesBtn = document.getElementById('mobile-services-dropdown-btn');
    const mobileUserBtn = document.getElementById('mobile-user-dropdown-btn');

    if (mobileServicesBtn) {
      mobileServicesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('mobile-services-dropdown').classList.toggle('hidden');
      });
    }

    if (mobileUserBtn) {
      mobileUserBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('mobile-user-dropdown').classList.toggle('hidden');
      });
    }

    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', (e) => {
      const dropdowns = document.querySelectorAll('.dropdown-menu, .mobile-dropdown-menu');
      if (!e.target.closest('.dropdown') && !e.target.closest('.mobile-dropdown-toggle')) {
        dropdowns.forEach(menu => menu.classList.add('hidden'));
      }
    });
  };

  // Inicializar funcionalidades
  checkUserLogin();
  setupDropdowns();

  // Configurar botones de logout
  document.querySelectorAll('.logout-button').forEach(button => {
    button.addEventListener('click', logout);
  });

  // Manejar el envío de cotización a WhatsApp
  const sendToWhatsApp = (quoteDetails) => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
      alert('Debes iniciar sesión para solicitar un servicio');
      window.location.href = 'users/login.html';
      return;
    }

    const message = `*Solicitud de Servicio - DaveTech*\n\n` +
      `*Usuario:* ${currentUser}\n` +
      `*Servicio:* ${quoteDetails.service}\n` +
      `*Opciones seleccionadas:*\n${quoteDetails.options.join('\n')}\n` +
      `*Total:* ${quoteDetails.total}\n\n` +
      `*Fecha:* ${new Date().toLocaleDateString()}`;

    const whatsappUrl = `https://wa.me/+56912345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Inicializar el asistente de cotización si estamos en la página principal
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const startQuoteBtn = document.getElementById('start-quote');
    const quoteWizard = document.getElementById('quote-wizard');

    if (startQuoteBtn && quoteWizard) {
      startQuoteBtn.addEventListener('click', () => {
        const currentUser = sessionStorage.getItem('currentUser');
        if (currentUser) {
          quoteWizard.classList.remove('hidden');
          startQuoteBtn.classList.add('hidden');
        } else {
          alert('Debes iniciar sesión para cotizar un servicio.');
          window.location.href = 'users/login.html';
        }
      });
    }

    // Configurar el botón de envío a WhatsApp
    const whatsappButton = document.getElementById('send-whatsapp');
    if (whatsappButton) {
      whatsappButton.addEventListener('click', () => {
        const quoteDetails = {
          service: document.getElementById('base-service-name').textContent,
          options: Array.from(document.getElementById('options-list').children).map(option => option.textContent),
          total: document.getElementById('total-price').textContent
        };
        sendToWhatsApp(quoteDetails);
      });
    }
  }
});
