// Error Tracking and Analytics Configuration

class ErrorTracker {
  constructor() {
    this.errors = [];
    this.initErrorListeners();
  }

  initErrorListeners() {
    // Capturar errores no manejados
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'uncaught_error',
        message: event.error.message,
        stack: event.error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // Capturar promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'unhandled_promise_rejection',
        message: event.reason,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // Capturar errores de red
    window.addEventListener('offline', () => {
      this.handleError({
        type: 'network_error',
        message: 'Usuario sin conexión a Internet',
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
    });
  }

  handleError(error) {
    this.errors.push(error);
    this.logError(error);
    this.notifyAdmin(error);

    // Mostrar mensaje al usuario si es necesario
    if (this.shouldNotifyUser(error)) {
      this.showUserNotification(error);
    }
  }

  logError(error) {
    console.error('Error registrado:', error);
    // Aquí puedes implementar el envío a un servicio de logging
    // como Sentry, LogRocket, etc.
  }

  notifyAdmin(error) {
    // Implementar notificación a administradores
    // por ejemplo, enviar un email o una notificación push
    if (this.isHighSeverity(error)) {
      // Enviar notificación urgente
    }
  }

  shouldNotifyUser(error) {
    // Determinar si el error debe ser mostrado al usuario
    return ['network_error', 'validation_error'].includes(error.type);
  }

  showUserNotification(error) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">${this.getUserFriendlyMessage(error)}</span>
        <button class="absolute top-0 right-0 px-4 py-3" onclick="this.parentElement.remove()">
          <span class="sr-only">Cerrar</span>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }

  getUserFriendlyMessage(error) {
    const messages = {
      'network_error': 'Hay problemas con la conexión a Internet. Por favor, verifica tu conexión.',
      'validation_error': 'Por favor, verifica los datos ingresados.',
      'uncaught_error': 'Ha ocurrido un error inesperado. Estamos trabajando para solucionarlo.',
      'unhandled_promise_rejection': 'No se pudo completar la operación. Por favor, intenta nuevamente.'
    };

    return messages[error.type] || 'Ha ocurrido un error. Por favor, intenta nuevamente.';
  }

  isHighSeverity(error) {
    return ['uncaught_error', 'unhandled_promise_rejection'].includes(error.type);
  }

  getErrorStats() {
    return {
      total: this.errors.length,
      byType: this.errors.reduce((acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      }, {}),
      lastError: this.errors[this.errors.length - 1]
    };
  }
}

// Inicializar el rastreador de errores
const errorTracker = new ErrorTracker();

// Exportar para uso en otros archivos
window.errorTracker = errorTracker;