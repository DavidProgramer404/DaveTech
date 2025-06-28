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

  // Verificar si el usuario está logueado
  const checkUserLogin = () => {
    const currentUser = sessionStorage.getItem('currentUser');
    const userActions = document.querySelectorAll('.user-action');
    const loginButton = document.querySelector('.login-button');
    const userInfo = document.querySelector('.user-info');

    if (currentUser) {
      userActions.forEach(action => action.classList.remove('hidden'));
      if (loginButton) loginButton.classList.add('hidden');
      if (userInfo) {
        userInfo.textContent = `Bienvenido, ${currentUser}`;
        userInfo.classList.remove('hidden');
      }
    } else {
      userActions.forEach(action => action.classList.add('hidden'));
      if (loginButton) loginButton.classList.remove('hidden');
      if (userInfo) userInfo.classList.add('hidden');
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'users/login.html';
  };

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

  const initQuoteWizard = () => {
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
  };

  // Inicializar la verificación de login y el asistente de cotización
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    checkUserLogin();
    initQuoteWizard();

    // Configurar el botón de logout
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', logout);
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