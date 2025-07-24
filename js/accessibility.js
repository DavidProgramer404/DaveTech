// Accessibility Enhancements

class AccessibilityManager {
  constructor() {
    this.initAccessibilityFeatures();
    this.setupKeyboardNavigation();
    this.setupHighContrastMode();
    this.setupFontSizeControls();
    this.setupAccessibilityChecker();
  }

  initAccessibilityFeatures() {
    // Agregar roles ARIA faltantes
    this.addMissingAriaLabels();
    this.addMissingRoles();
    this.enhanceFormAccessibility();
    this.setupFocusManagement();
  }

  addMissingAriaLabels() {
    // Agregar etiquetas ARIA a elementos interactivos
    document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        if (element.textContent.trim()) {
          element.setAttribute('aria-label', element.textContent.trim());
        } else if (element.getAttribute('placeholder')) {
          element.setAttribute('aria-label', element.getAttribute('placeholder'));
        }
      }
    });

    // Agregar descripciones a iconos
    document.querySelectorAll('i[class*="fa-"]').forEach(icon => {
      if (!icon.getAttribute('aria-hidden')) {
        icon.setAttribute('aria-hidden', 'true');
        if (icon.parentElement.tagName === 'BUTTON' || icon.parentElement.tagName === 'A') {
          if (!icon.parentElement.getAttribute('aria-label')) {
            icon.parentElement.setAttribute('aria-label', icon.className.split('fa-')[1].split(' ')[0]);
          }
        }
      }
    });
  }

  addMissingRoles() {
    // Agregar roles semánticos
    const roleMap = {
      header: 'banner',
      nav: 'navigation',
      main: 'main',
      footer: 'contentinfo',
      aside: 'complementary',
      article: 'article',
      section: 'region'
    };

    Object.entries(roleMap).forEach(([tag, role]) => {
      document.querySelectorAll(tag).forEach(element => {
        if (!element.getAttribute('role')) {
          element.setAttribute('role', role);
        }
      });
    });
  }

  enhanceFormAccessibility() {
    // Mejorar accesibilidad de formularios
    document.querySelectorAll('form').forEach(form => {
      // Agregar roles y atributos necesarios
      form.setAttribute('role', 'form');

      // Mejorar mensajes de error
      form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('invalid', (e) => {
          const errorId = `error-${field.id || Math.random().toString(36).substr(2, 9)}`;
          let errorMessage = field.validationMessage;

          // Crear o actualizar mensaje de error
          let errorElement = document.getElementById(errorId);
          if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            field.parentNode.insertBefore(errorElement, field.nextSibling);
          }

          errorElement.textContent = errorMessage;
          field.setAttribute('aria-describedby', errorId);
        });
      });
    });
  }

  setupKeyboardNavigation() {
    // Mejorar navegación por teclado
    document.addEventListener('keydown', (e) => {
      // Atajos de teclado para navegación
      if (e.altKey) {
        switch(e.key) {
          case 'm':
            // Saltar al contenido principal
            document.querySelector('main')?.focus();
            break;
          case 'n':
            // Saltar a la navegación
            document.querySelector('nav')?.focus();
            break;
          case 'f':
            // Saltar al primer formulario
            document.querySelector('form')?.focus();
            break;
        }
      }
    });

    // Mejorar navegación en menús desplegables
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      const menu = dropdown.querySelector('.dropdown-menu');

      if (trigger && menu) {
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menu.classList.toggle('hidden');
            if (!menu.classList.contains('hidden')) {
              menu.querySelector('a')?.focus();
            }
          }
        });

        menu.querySelectorAll('a').forEach(link => {
          link.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              menu.classList.add('hidden');
              trigger.focus();
            }
          });
        });
      }
    });
  }

  setupHighContrastMode() {
    // Agregar botón de alto contraste
    const contrastButton = document.createElement('button');
    contrastButton.innerHTML = '<i class="fas fa-adjust"></i>';
    contrastButton.className = 'fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg';
    contrastButton.setAttribute('aria-label', 'Alternar modo de alto contraste');

    contrastButton.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
    });

    document.body.appendChild(contrastButton);

    // Restaurar preferencia de contraste
    if (localStorage.getItem('highContrast') === 'true') {
      document.body.classList.add('high-contrast');
    }
  }

  setupFontSizeControls() {
    // Agregar controles de tamaño de fuente
    const fontControls = document.createElement('div');
    fontControls.className = 'fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded-full shadow-lg';
    fontControls.innerHTML = `
      <button aria-label="Reducir tamaño de texto" class="px-2">A-</button>
      <button aria-label="Tamaño de texto normal" class="px-2">A</button>
      <button aria-label="Aumentar tamaño de texto" class="px-2">A+</button>
    `;

    const [decreaseBtn, resetBtn, increaseBtn] = fontControls.children;
    let fontSize = parseInt(localStorage.getItem('fontSize')) || 100;

    const updateFontSize = (size) => {
      fontSize = Math.max(80, Math.min(120, size));
      document.body.style.fontSize = `${fontSize}%`;
      localStorage.setItem('fontSize', fontSize);
    };

    decreaseBtn.addEventListener('click', () => updateFontSize(fontSize - 10));
    resetBtn.addEventListener('click', () => updateFontSize(100));
    increaseBtn.addEventListener('click', () => updateFontSize(fontSize + 10));

    document.body.appendChild(fontControls);
    updateFontSize(fontSize);
  }

  setupFocusManagement() {
    // Gestionar el foco del teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-user');
    });
  }

  setupAccessibilityChecker() {
    // Verificar problemas comunes de accesibilidad
    const checkAccessibility = () => {
      const issues = [];

      // Verificar imágenes sin alt
      document.querySelectorAll('img:not([alt])').forEach(img => {
        issues.push({
          type: 'missing-alt',
          element: img,
          message: 'Imagen sin texto alternativo'
        });
      });

      // Verificar contraste de color
      document.querySelectorAll('*').forEach(element => {
        const style = window.getComputedStyle(element);
        const backgroundColor = style.backgroundColor;
        const color = style.color;

        if (this.hasLowContrast(backgroundColor, color)) {
          issues.push({
            type: 'low-contrast',
            element: element,
            message: 'Contraste insuficiente entre texto y fondo'
          });
        }
      });

      return issues;
    };

    // Ejecutar verificación periódicamente
    setInterval(() => {
      const issues = checkAccessibility();
      if (issues.length > 0) {
        console.warn('Problemas de accesibilidad encontrados:', issues);
      }
    }, 5000);
  }

  hasLowContrast(bg, fg) {
    // Implementar cálculo de contraste
    // Esta es una implementación simplificada
    const getBrightness = (color) => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0;
      return (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    };

    const brightness1 = getBrightness(bg);
    const brightness2 = getBrightness(fg);
    const diff = Math.abs(brightness1 - brightness2);

    return diff < 125; // Umbral de contraste
  }
}

// Inicializar el gestor de accesibilidad
const accessibilityManager = new AccessibilityManager();

// Exportar para uso en otros archivos
window.accessibilityManager = accessibilityManager;