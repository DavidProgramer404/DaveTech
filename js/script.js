document.addEventListener("DOMContentLoaded", function () {
  // Initialize local storage
  const quoteData = JSON.parse(localStorage.getItem("davetech_quote")) || {
    service: null,
    options: [],
    basePrice: 0,
    totalPrice: 0,
  };

  // Function to display a custom alert modal
  function showAlert(title, message) {
      document.getElementById('custom-alert-title').textContent = title;
      document.getElementById('custom-alert-message').textContent = message;
      document.getElementById('custom-alert-modal').classList.remove('hidden');
  }

  // Event listeners for custom alert modal buttons
  document.getElementById('custom-alert-close').addEventListener('click', function() {
      document.getElementById('custom-alert-modal').classList.add('hidden');
  });
  document.getElementById('custom-alert-ok').addEventListener('click', function() {
      document.getElementById('custom-alert-modal').classList.add('hidden');
  });

  // Función para limpiar los detalles de la cotización en la UI
  function clearQuoteDetailsUI() {
    document.getElementById("options-list").innerHTML = '<p class="text-gray-500 text-sm">No hay opciones seleccionadas</p>';
    document.getElementById("final-quote-details").innerHTML = "";
    document.getElementById("total-price").textContent = "$0 CLP";
    document.getElementById("final-quote-total").textContent = "$0 CLP";
    document.getElementById("quote-date").textContent = "";
    document.getElementById("quote-number").textContent = "";
    // Ocultar la sección de "quote-ready" y mostrar "quote-loading" si es necesario
    document.getElementById("quote-ready").classList.add("hidden");
    document.getElementById("quote-loading").classList.remove("hidden");
  }
  
  // Check admin login status
  const isAdminLoggedIn = localStorage.getItem("davetech_admin_logged_in") === "true";
  
  // Hide/show quote summary panel based on admin status
  const quoteSummaryPanel = document.getElementById("quote-summary-panel");
  if (quoteSummaryPanel) {
    if (isAdminLoggedIn) {
      quoteSummaryPanel.style.display = "block";
    } else {
      quoteSummaryPanel.style.display = "none";
      // Si no es admin, limpiar los detalles de la UI para que no se muestren
      clearQuoteDetailsUI();
    }
  }

  // Start Quote Button
  document.getElementById("start-quote").addEventListener("click", function () {
    document.getElementById("quote-wizard").classList.remove("hidden");
    document.getElementById("start-quote").classList.add("hidden");
  });

  // Service Selection Logic
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Reset selected state
      serviceCards.forEach((c) => c.classList.remove("selected"));
      // Add selected state to clicked card
      this.classList.add("selected");

      // Store service data
      const service = this.getAttribute("data-service");
      const serviceNameElement = document.getElementById("service-name");
      const baseServiceNameElement =
        document.getElementById("base-service-name");

      // Set service name based on selection
      let serviceName, basePrice;
      switch (service) {
        case "remote":
          serviceName = "Soporte Remoto";
          basePrice = 15000;
          break;
        case "onsite":
          serviceName = "Soporte Presencial";
          basePrice = 25000;
          break;
        case "maintenance":
          serviceName = "Mantención y Actualización";
          basePrice = 18000;
          break;
        case "software":
          serviceName = "Instalación Software/OS";
          basePrice = 20000;
          break;
        default:
          serviceName = "Servicio Seleccionado";
          basePrice = 0;
      }

      serviceNameElement.textContent = serviceName;
      baseServiceNameElement.textContent = serviceName;
      document.getElementById(
        "base-price"
      ).textContent = `$${basePrice.toLocaleString("es-CL")} CLP`;

      // Update quote data
      quoteData.service = {
        type: service,
        name: serviceName,
        basePrice: basePrice,
      };
      quoteData.basePrice = basePrice;
      quoteData.totalPrice = basePrice;

      // Store in localStorage
      localStorage.setItem("davetech_quote", JSON.stringify(quoteData));

      // Go to next step
      goToStep(2);

      // Show the correct options panel
      document.querySelectorAll(".options-panel").forEach((panel) => {
        panel.classList.add("hidden");
      });
      document.getElementById(`${service}-options`).classList.remove("hidden");

      // Update total price display
      updateTotalPrice();
    });
  });

  // Back buttons
  document
    .getElementById("back-to-step1")
    .addEventListener("click", function () {
      goToStep(1);
    });

  document
    .getElementById("back-to-step2")
    .addEventListener("click", function () {
      goToStep(2);
    });

  // Continue to step 3
  document
    .getElementById("continue-to-step3")
    .addEventListener("click", function () {
      goToStep(3);

      // Show loading state
      document.getElementById("quote-loading").classList.remove("hidden");
      document.getElementById("quote-ready").classList.add("hidden");

      // Simulate API call for quote generation
      setTimeout(function () {
        document.getElementById("quote-loading").classList.add("hidden");
        document.getElementById("quote-ready").classList.remove("hidden");

        // Set date
        const today = new Date();
        document.getElementById("quote-date").textContent =
          today.toLocaleDateString("es-CL");

        // Generate random quote number
        const quoteNumber = `DT-2025-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`;
        document.getElementById("quote-number").textContent = quoteNumber;
        
        // Save quote to orders in localStorage for admin dashboard
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({
          id: quoteNumber,
          customer: 'Cliente', // Puedes agregar un campo para el nombre del cliente
          service: quoteData.service.name,
          date: today.toISOString(),
          total: quoteData.totalPrice,
          details: {
            baseService: quoteData.service,
            options: quoteData.options
          }
        });
        localStorage.setItem('orders', JSON.stringify(orders));

        // Build quote details
        const finalDetails = document.getElementById("final-quote-details");
        finalDetails.innerHTML = "";

        // Add base service
        const serviceRow = document.createElement("div");
        serviceRow.className =
          "flex justify-between items-center mb-2 pb-2 border-b border-gray-600";
        serviceRow.innerHTML = `
            <div>
              <div class="font-medium">${quoteData.service.name}</div>
              <div class="text-gray-400 text-sm">Servicio base</div>
            </div>
            <div class="font-medium">$${quoteData.basePrice.toLocaleString(
              "es-CL"
            )} CLP</div>
          `;
        finalDetails.appendChild(serviceRow);

        // Add selected options
        if (quoteData.options.length > 0) {
          quoteData.options.forEach((option) => {
            const optionRow = document.createElement("div");
            optionRow.className = "flex justify-between items-center my-2";
            optionRow.innerHTML = `
                <div>
                  <div class="font-medium">${option.name}</div>
                  <div class="text-gray-400 text-sm">${
                    option.description || ""
                  }</div>
                </div>
                <div class="font-medium">${option.priceText}</div>
              `;
            finalDetails.appendChild(optionRow);
          });
        }

        // Set total
        document.getElementById(
          "final-quote-total"
        ).textContent = `$${quoteData.totalPrice.toLocaleString("es-CL")} CLP`;
      }, 2000);
    });

  // New quote button
  document.getElementById("new-quote").addEventListener("click", function () {
    // Reset all data in localStorage
    localStorage.removeItem("davetech_quote");

    // Reset quoteData object
    quoteData.service = null;
    quoteData.options = [];
    quoteData.basePrice = 0;
    quoteData.totalPrice = 0;

    // Reset UI state
    document.querySelectorAll(".service-card").forEach((card) => {
      card.classList.remove("selected");
    });

    document.querySelectorAll(".option-item").forEach((option) => {
      option.classList.remove("selected");
    });

    // Clear quote summary and final details
    document.getElementById("options-list").innerHTML = '<p class="text-gray-500 text-sm">No hay opciones seleccionadas</p>';
    document.getElementById("final-quote-details").innerHTML = "";
    document.getElementById("total-price").textContent = "$0 CLP";
    document.getElementById("final-quote-total").textContent = "$0 CLP";
    document.getElementById("quote-date").textContent = "";
    document.getElementById("quote-number").textContent = "";

    // Limpiar UI usando la nueva función
    clearQuoteDetailsUI();

    // Go back to step 1
    goToStep(1);
  });

  // Option selection
  document.querySelectorAll(".option-item").forEach((option) => {
    option.addEventListener("click", function () {
      const value = this.getAttribute("data-value");
      const price = parseInt(this.getAttribute("data-price"));

      // Handle selection within the same group (find siblings)
      const parent = this.parentElement;
      parent.querySelectorAll(".option-item").forEach((sibling) => {
        if (sibling !== this) {
          sibling.classList.remove("selected");

          // Remove old option from quoteData if it exists
          const siblingValue = sibling.getAttribute("data-value");
          const optionIndex = quoteData.options.findIndex(
            (o) => o.value === siblingValue
          );
          if (optionIndex > -1) {
            const removedOption = quoteData.options.splice(optionIndex, 1)[0];
            quoteData.totalPrice -= removedOption.price;
          }
        }
      });

      // Toggle selection for this item
      if (this.classList.contains("selected")) {
        this.classList.remove("selected");

        // Remove this option
        const optionIndex = quoteData.options.findIndex(
          (o) => o.value === value
        );
        if (optionIndex > -1) {
          const removedOption = quoteData.options.splice(optionIndex, 1)[0];
          quoteData.totalPrice -= removedOption.price;
        }
      } else {
        this.classList.add("selected");

        // Add this option
        const optionName = this.querySelector("h5").textContent;
        const optionDescription = this.querySelector("p").textContent;
        const priceTag = this.querySelector(".price-tag").textContent;

        quoteData.options.push({
          value: value,
          name: optionName,
          description: optionDescription,
          price: price,
          priceText: priceTag,
        });

        quoteData.totalPrice += price;
        showAlert('Servicio Agregado', `Servicio '${optionName}' agregado a la cotización.`);
      }

      // Update localStorage
      localStorage.setItem("davetech_quote", JSON.stringify(quoteData));

      // Update total price display
      updateTotalPrice();

      // Update options summary
      updateOptionsSummary();
    });
  });

  // Download quote (mock functionality)
  document
    .getElementById("download-quote")
    .addEventListener("click", function () {
      showAlert('Descarga', "Descargando cotización como PDF...");
    });

  // Send via WhatsApp (mock functionality)
  document
    .getElementById("send-whatsapp")
    .addEventListener("click", function () {
      const whatsappMsg = encodeURIComponent(
        `Hola, quiero confirmar mi cotización #${
          document.getElementById("quote-number").textContent
        } por ${document.getElementById("final-quote-total").textContent}`
      );
      window.open(`https://wa.me/56999442312?text=${whatsappMsg}`, "_blank");
    });

  // WhatsApp floating button
  document
    .getElementById("whatsapp-btn")
    .addEventListener("click", function () {
      const whatsappMsg = encodeURIComponent(
        "Hola, quiero obtener más información sobre sus servicios."
      );
      window.open(`https://wa.me/56999442312?text=${whatsappMsg}`, "_blank");
    });

  // Helper functions
  function goToStep(step) {
    // Update active step indicator
    document.querySelectorAll(".step").forEach((el, index) => {
      if (index < step) {
        el.classList.add("active-step");
      } else {
        el.classList.remove("active-step");
      }
    });

    // Update step connectors
    document.querySelectorAll(".step-connector").forEach((el, index) => {
      if (index < step - 1) {
        el.classList.add("active-connector");
      } else {
        el.classList.remove("active-connector");
      }
    });

    // Show the correct step content
    document.querySelectorAll(".wizard-section").forEach((el, index) => {
      if (index === step - 1) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  }

  function updateTotalPrice() {
    document.getElementById(
      "total-price"
    ).textContent = `$${quoteData.totalPrice.toLocaleString("es-CL")} CLP`;
  }

  function updateOptionsSummary() {
    const optionsListEl = document.getElementById("options-list");
    optionsListEl.innerHTML = "";

    if (quoteData.options.length === 0) {
      optionsListEl.innerHTML =
        '<p class="text-gray-500 text-sm">No hay opciones seleccionadas</p>';
      return;
    }

    quoteData.options.forEach((option) => {
      const optionEl = document.createElement("div");
      optionEl.className = "flex justify-between items-center my-2";
      optionEl.innerHTML = `
            <span class="text-gray-300 text-sm">${option.name}:</span>
            <span class="text-gray-300 text-sm">${option.priceText}</span>
            <button class="remove-option-btn text-red-500 hover:text-red-700 ml-2" data-option-name="${option.name}">X</button>
          `;
      optionsListEl.appendChild(optionEl);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-option-btn').forEach(button => {
      button.addEventListener('click', function() {
        const optionName = this.getAttribute('data-option-name');
        removeOption(optionName);
      });
    });
  }

  function removeOption(optionName) {
    const optionIndex = quoteData.options.findIndex(opt => opt.name === optionName);
    if (optionIndex > -1) {
      const removedOption = quoteData.options.splice(optionIndex, 1)[0];
      quoteData.totalPrice -= removedOption.price;
      localStorage.setItem("davetech_quote", JSON.stringify(quoteData));
      updateOptionsSummary();
      updateTotalPrice();
    }
  }

  // Edit Quote Modal Logic
  const editQuoteBtn = document.getElementById('edit-quote-btn');
  const editQuoteModal = document.getElementById('edit-quote-modal');
  const closeEditModalBtn = document.getElementById('close-edit-modal');
  const saveQuoteChangesBtn = document.getElementById('save-quote-changes');
  const modalOptionsList = document.getElementById('modal-options-list');

  editQuoteBtn.addEventListener('click', function() {
    editQuoteModal.classList.remove('hidden');
    loadOptionsIntoModal();
  });

  closeEditModalBtn.addEventListener('click', function() {
    editQuoteModal.classList.add('hidden');
  });

  saveQuoteChangesBtn.addEventListener('click', function() {
    // The changes are already saved to localStorage by removeOption function
    // This button just closes the modal
    editQuoteModal.classList.add('hidden');
  });

  function loadOptionsIntoModal() {
    modalOptionsList.innerHTML = '';
    if (quoteData.options.length === 0) {
      modalOptionsList.innerHTML = '<p class="text-gray-500 text-sm">No hay opciones seleccionadas para editar.</p>';
      return;
    }

    quoteData.options.forEach(option => {
      const optionEl = document.createElement('div');
      optionEl.className = 'flex justify-between items-center my-2 bg-gray-700 p-3 rounded-md';
      optionEl.innerHTML = `
        <span class="text-gray-300">${option.name}</span>
        <div class="flex items-center">
          <span class="text-gray-300 mr-4">${option.priceText}</span>
          <button class="remove-option-modal-btn text-red-500 hover:text-red-700" data-option-name="${option.name}">X</button>
        </div>
      `;
      modalOptionsList.appendChild(optionEl);
    });

    document.querySelectorAll('.remove-option-modal-btn').forEach(button => {
      button.addEventListener('click', function() {
        const optionName = this.getAttribute('data-option-name');
        removeOption(optionName);
        loadOptionsIntoModal(); // Reload options in modal after removal
      });
    });
  }

  // If we have stored data, restore it
  if (quoteData.service) {
    // Find and select the correct service card
    const savedServiceCard = document.querySelector(
      `.service-card[data-service="${quoteData.service.type}"]`
    );
    if (savedServiceCard) {
      savedServiceCard.click();
    }

    // Select saved options
    quoteData.options.forEach((option) => {
      const optionEl = document.querySelector(
        `.option-item[data-value="${option.value}"]`
      );
      if (optionEl) {
        optionEl.click();
      }
    });
  }
  
  // Clear the service base field if not admin
  if (!isAdminLoggedIn) {
    const baseServiceNameElement = document.getElementById("base-service-name");
    if (baseServiceNameElement) {
      baseServiceNameElement.textContent = "";
    }
  }
});

const menuButton = document.getElementById("menu-button");
const mainNavLinks = document.getElementById("main-nav-links");
const iconHamburger = menuButton.querySelector(".icon-hamburger");
const iconClose = menuButton.querySelector(".icon-close");

menuButton.addEventListener("click", () => {
  // Alterna la visibilidad del menú de navegación
  mainNavLinks.classList.toggle("hidden");

  // Alterna los iconos del botón
  iconHamburger.classList.toggle("hidden");
  iconClose.classList.toggle("hidden");
});
