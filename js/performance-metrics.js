// Performance Monitoring and Metrics

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.initPerformanceObserver();
    this.trackCoreWebVitals();
    this.initUserExperienceMetrics();
  }

  initPerformanceObserver() {
    // Observar métricas de rendimiento
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.logMetric(entry);
      });
    });

    // Observar diferentes tipos de métricas
    observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'] });
  }

  trackCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.cls = clsValue;
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  initUserExperienceMetrics() {
    // Tiempo de interacción del usuario
    this.metrics.userInteractions = [];
    document.addEventListener('click', () => this.trackUserInteraction('click'));
    document.addEventListener('scroll', this.throttle(() => this.trackUserInteraction('scroll'), 1000));

    // Tiempo en página
    this.startTimeOnPage = Date.now();
    window.addEventListener('beforeunload', () => {
      this.metrics.timeOnPage = Date.now() - this.startTimeOnPage;
      this.logMetrics();
    });
  }

  trackUserInteraction(type) {
    this.metrics.userInteractions.push({
      type,
      timestamp: Date.now()
    });
  }

  logMetric(entry) {
    const metric = {
      name: entry.name,
      type: entry.entryType,
      startTime: entry.startTime,
      duration: entry.duration,
      timestamp: Date.now()
    };

    if (!this.metrics[entry.entryType]) {
      this.metrics[entry.entryType] = [];
    }
    this.metrics[entry.entryType].push(metric);

    // Analizar si hay problemas de rendimiento
    this.analyzePerformance(metric);
  }

  analyzePerformance(metric) {
    // Umbrales de rendimiento
    const thresholds = {
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1   // 0.1
    };

    // Verificar métricas críticas
    if (metric.type === 'largest-contentful-paint' && metric.startTime > thresholds.lcp) {
      this.notifyPerformanceIssue('LCP alto detectado', metric);
    }
    if (metric.type === 'first-input' && metric.duration > thresholds.fid) {
      this.notifyPerformanceIssue('FID alto detectado', metric);
    }
  }

  notifyPerformanceIssue(message, metric) {
    console.warn(`Problema de rendimiento: ${message}`, metric);
    // Aquí puedes implementar notificaciones al equipo de desarrollo
  }

  getMetricsSummary() {
    return {
      coreWebVitals: {
        lcp: this.metrics.lcp,
        fid: this.metrics.fid,
        cls: this.metrics.cls
      },
      userExperience: {
        timeOnPage: this.metrics.timeOnPage,
        interactionCount: this.metrics.userInteractions.length
      },
      resources: this.metrics.resource?.length || 0
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  logMetrics() {
    const summary = this.getMetricsSummary();
    console.log('Resumen de métricas de rendimiento:', summary);
    // Aquí puedes implementar el envío a un servicio de análisis
  }
}

// Inicializar el monitor de rendimiento
const performanceMonitor = new PerformanceMonitor();

// Exportar para uso en otros archivos
window.performanceMonitor = performanceMonitor;