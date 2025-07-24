// Performance Optimization & Accessibility Enhancements

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
});

// Accessibility improvements
function enhanceAccessibility() {
  // Add ARIA labels to all interactive elements
  document.querySelectorAll('a, button, input, select, textarea').forEach(element => {
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      if (element.textContent.trim()) {
        element.setAttribute('aria-label', element.textContent.trim());
      }
    }
  });

  // Add keyboard navigation for dropdown menus
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (trigger && menu) {
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          menu.classList.toggle('hidden');
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

// Performance optimization
function optimizePerformance() {
  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimize scroll events
  const optimizedScroll = debounce(() => {
    // Add your scroll-based animations or calculations here
  }, 150);

  window.addEventListener('scroll', optimizedScroll);

  // Optimize resize events
  const optimizedResize = debounce(() => {
    // Add your resize-based calculations here
  }, 250);

  window.addEventListener('resize', optimizedResize);
}

// Initialize enhancements
document.addEventListener('DOMContentLoaded', () => {
  enhanceAccessibility();
  optimizePerformance();
});

// Error handling and logging
window.addEventListener('error', (e) => {
  console.error('Error occurred:', e.error);
  // You can implement your error tracking system here
});

// Service Worker Registration for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.error('ServiceWorker registration failed:', err);
      });
  });
}