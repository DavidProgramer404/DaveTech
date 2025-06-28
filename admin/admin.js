document.addEventListener('DOMContentLoaded', () => {
  // Function to display a custom alert modal (copied from script.js)
  function showAlert(title, message) {
    // Assuming the custom-alert-modal HTML is available in admin/login.html and admin/dashboard.html
    // This might require adding the modal HTML to those files as well, or ensuring index.html's modal is globally accessible.
    // For now, we'll assume it's accessible or will be added.
    document.getElementById('custom-alert-title').textContent = title;
    document.getElementById('custom-alert-message').textContent = message;
    document.getElementById('custom-alert-modal').classList.remove('hidden');
  }

  // Event listeners for custom alert modal buttons (copied from script.js)
  document.getElementById('custom-alert-close').addEventListener('click', function() {
      document.getElementById('custom-alert-modal').classList.add('hidden');
  });
  document.getElementById('custom-alert-ok').addEventListener('click', function() {
      document.getElementById('custom-alert-modal').classList.add('hidden');
  });

  const loginForm = document.getElementById('login-form');
  const summaryTableBody = document.getElementById('summary-table-body');
  const downloadBtn = document.getElementById('download-summary');
  const clearBtn = document.getElementById('clear-summary');
  const logoutBtn = document.getElementById('logout');

  // Proteger rutas de administrador
  if (window.location.pathname.includes('dashboard.html') && !localStorage.getItem('isAdmin')) {
    window.location.href = 'login.html';
  }

  // Lógica de inicio de sesión
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = e.target.username.value;
      const password = e.target.password.value;

      // Credenciales de administrador (en un entorno real, esto debería ser manejado en el backend)
      const users = {
        admin: 'password',
        dave: 'tech'
      };

      if (users[username] && users[username] === password) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('davetech_admin_logged_in', 'true');
        window.location.href = 'dashboard.html';
      } else {
        showAlert('Error de Inicio de Sesión', 'Usuario o contraseña incorrectos');
      }
    });
  }

  // Cargar resumen de pedidos (simulado)
  if (summaryTableBody) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.forEach(order => {
      const row = document.createElement('tr');
      const optionsHtml = order.details.options.map(option => `<li>${option.name} (${option.priceText})</li>`).join('');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">${order.id}</td>
        <td class="px-6 py-4 whitespace-nowrap">${order.details.baseService.name}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <ul>${optionsHtml}</ul>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">$${order.total.toLocaleString('es-CL')} CLP</td>
        <td class="px-6 py-4 whitespace-nowrap">${new Date(order.date).toLocaleDateString()}</td>
      `;
      summaryTableBody.appendChild(row);
    });
  }

  // Descargar resumen en Excel
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const dataForExcel = orders.map(order => ({
        'ID Cotización': order.id,
        'Servicio Base': order.details.baseService.name,
        'Opciones': order.details.options.map(opt => opt.name).join(', '),
        'Total': order.total,
        'Fecha': new Date(order.date).toLocaleDateString('es-CL')
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Cotizaciones');
      XLSX.writeFile(workbook, 'Resumen_Cotizaciones.xlsx');
    });
  }

  // Limpiar resumen
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      // For a more robust solution, a custom confirmation modal could be implemented here as well.
      if (confirm('¿Estás seguro de que quieres limpiar el resumen de pedidos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('orders');
        summaryTableBody.innerHTML = '';
        showAlert('Resumen Limpiado', 'El resumen de pedidos ha sido limpiado.');
      }
    });
  }

  // Lógica de cierre de sesión
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('davetech_admin_logged_in');
      window.location.href = 'login.html';
    });
  }
});