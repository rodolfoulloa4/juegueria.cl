(function () {
  var storage = window.JuegueriaStorage;
  var auth = window.JuegueriaAuth;

  if (!storage || !auth) {
    return;
  }

  var state = {
    catalogProducts: []
  };

  var elements = {
    menuPrincipal: document.getElementById("menuPrincipal"),
    submenuUsuario: document.getElementById("submenuUsuario"),
    badgeUsuarioMenu: document.getElementById("badgeUsuarioMenu"),
    btnCarritoRapido: document.getElementById("btnCarritoRapido"),
    btnCarritoCantidad: document.getElementById("btnCarritoCantidad"),
    btnVolverMenu: document.getElementById("btnVolverMenu"),
    estadoSesion: document.getElementById("estadoSesion"),
    navRegistro: document.getElementById("navRegistro"),
    navLogin: document.getElementById("navLogin"),
    navRecuperacion: document.getElementById("navRecuperacion"),
    navPerfil: document.getElementById("navPerfil"),
    navCarrito: document.getElementById("navCarrito"),
    navHistorial: document.getElementById("navHistorial"),
    navInventario: document.getElementById("navInventario"),
    navClientes: document.getElementById("navClientes"),
    cerrarSesionNav: document.getElementById("cerrarSesionNav"),
    registerSection: document.getElementById("registro"),
    loginSection: document.getElementById("login"),
    recoverySection: document.getElementById("recuperacion"),
    profileSection: document.getElementById("perfil"),
    cartSection: document.getElementById("carrito"),
    historySection: document.getElementById("historial"),
    inventorySection: document.getElementById("gestionInventario"),
    clientsSection: document.getElementById("clientes"),
    loginForm: document.getElementById("form-login"),
    loginMessage: document.getElementById("mensajeLogin"),
    recoveryForm: document.getElementById("form-recuperacion"),
    recoveryMessage: document.getElementById("mensajeRecuperacion"),
    profileForm: document.getElementById("form-perfil"),
    profileMessage: document.getElementById("mensajePerfil"),
    profileName: document.getElementById("perfilNombre"),
    profileUser: document.getElementById("perfilUsuario"),
    profileEmail: document.getElementById("perfilCorreo"),
    profileAddress: document.getElementById("perfilDireccion"),
    profilePassword: document.getElementById("perfilClave"),
    cartEmpty: document.getElementById("carritoVacio"),
    cartTableWrapper: document.getElementById("tablaCarritoWrapper"),
    cartTableBody: document.getElementById("tablaCarrito"),
    cartSummary: document.getElementById("resumenCarrito"),
    cartTotal: document.getElementById("totalCarrito"),
    cartMessage: document.getElementById("mensajeCarrito"),
    buyButton: document.getElementById("btnComprar"),
    confirmationSection: document.getElementById("confirmacionCompra"),
    confirmationOrderId: document.getElementById("confirmacionOrdenId"),
    confirmationDate: document.getElementById("confirmacionFecha"),
    confirmationTotal: document.getElementById("confirmacionTotal"),
    historyContent: document.getElementById("historialContenido"),
    inventoryForm: document.getElementById("form-inventario"),
    inventoryMessage: document.getElementById("mensajeInventario"),
    inventoryId: document.getElementById("inventarioId"),
    inventoryName: document.getElementById("inventarioNombre"),
    inventoryCategory: document.getElementById("inventarioCategoria"),
    inventoryPrice: document.getElementById("inventarioPrecio"),
    inventoryStock: document.getElementById("inventarioStock"),
    inventoryDescription: document.getElementById("inventarioDescripcion"),
    inventoryLabel: document.getElementById("inventarioEtiqueta"),
    inventoryTableBody: document.getElementById("tablaInventario"),
    clientsTableBody: document.getElementById("tablaClientes")
  };

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }).format(value);
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function parsePrice(value) {
    return Number(String(value).replace(/[^\d]/g, "")) || 0;
  }

  function getCurrentUser() {
    return auth.getCurrentUser();
  }

  function getCurrentOwner() {
    var currentUser = getCurrentUser();
    return currentUser ? currentUser.usuario : "visitante";
  }

  function isAdmin() {
    var currentUser = getCurrentUser();
    return Boolean(currentUser && currentUser.rol === "administrador");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isStrongPassword(value) {
    return /^(?=.*[A-Z])(?=.*\d).{6,18}$/.test(value);
  }

  function setMessage(element, message, type) {
    if (!element) {
      return;
    }

    element.innerHTML = message;
    element.className = "mensaje-formulario" + (type ? " " + type : "");
  }

  function extractCatalogProducts() {
    var cards = document.querySelectorAll(".ficha-juego");

    return Array.prototype.map.call(cards, function (card) {
      var title = card.querySelector("h3").textContent.trim();
      var price = parsePrice(card.querySelector(".precio").textContent);
      var description = card.querySelector("p").textContent.trim();
      var discount = card.querySelector(".descuento").textContent.trim();
      var image = card.querySelector("img").getAttribute("src");
      var category = card.closest("section").id;

      return {
        id: slugify(title),
        nombre: title,
        precio: price,
        descripcion: description,
        etiqueta: discount,
        imagen: image,
        categoria: category,
        stock: 10
      };
    });
  }

  function dedupeProductsById(products) {
    return products.reduce(function (uniqueProducts, product) {
      var exists = uniqueProducts.some(function (item) {
        return item.id === product.id;
      });

      if (!exists) {
        uniqueProducts.push(product);
      }

      return uniqueProducts;
    }, []);
  }

  function normalizeInventory(items) {
    return dedupeProductsById(items).map(function (item) {
      return {
        id: item.id,
        nombre: item.nombre,
        categoria: item.categoria,
        precio: item.precio,
        stock: item.stock,
        descripcion: item.descripcion,
        etiqueta: item.etiqueta
      };
    });
  }

  function ensureInventorySeed() {
    var inventory = storage.getInventory();
    var normalizedInventory = normalizeInventory(inventory);

    if (normalizedInventory.length > 0) {
      if (normalizedInventory.length !== inventory.length) {
        storage.saveInventory(normalizedInventory);
      }
      return;
    }

    storage.saveInventory(normalizeInventory(state.catalogProducts.map(function (product) {
      return {
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoria,
        precio: product.precio,
        stock: product.stock,
        descripcion: product.descripcion,
        etiqueta: product.etiqueta
      };
    })));
  }

  function addCatalogButtons() {
    document.querySelectorAll(".ficha-juego").forEach(function (card) {
      if (card.querySelector("[data-add-cart]")) {
        return;
      }

      var title = card.querySelector("h3").textContent.trim();
      var button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-primary mt-2 w-100";
      button.dataset.addCart = slugify(title);
      button.textContent = "Agregar al carrito";
      card.appendChild(button);
    });
  }

  function getSectionIds() {
    return Array.prototype.map.call(document.querySelectorAll("main > section"), function (section) {
      return section.id;
    });
  }

  function getAllowedSectionIds() {
    var currentUser = getCurrentUser();
    var adminView = isAdmin();
    var all = getSectionIds();

    if (!currentUser) {
      return all.filter(function (id) {
        return id !== "perfil" && id !== "historial" && id !== "gestionInventario" && id !== "clientes" && id !== "confirmacionCompra";
      });
    }

    if (adminView) {
      return all.filter(function (id) {
        return id !== "registro" && id !== "login" && id !== "recuperacion" && id !== "historial" && id !== "confirmacionCompra";
      });
    }

    return all.filter(function (id) {
      return id !== "registro" && id !== "login" && id !== "recuperacion" && id !== "gestionInventario" && id !== "clientes";
    });
  }

  function getFallbackSection() {
    if (isAdmin()) {
      return "gestionInventario";
    }

    if (getCurrentUser()) {
      return "perfil";
    }

    return "destacados";
  }

  function getRequestedSection() {
    var hash = window.location.hash ? window.location.hash.slice(1) : "";

    if (!hash || hash === "inicio") {
      return getFallbackSection();
    }

    return hash;
  }

  function highlightActiveNav(activeSectionId) {
    document.querySelectorAll("#menuPrincipal a").forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + activeSectionId;
      link.classList.toggle("activo", isActive);
    });
  }

  function mergeGuestCartIntoUserCart(username) {
    var guestOwner = "visitante";
    var guestCart = storage.getCart(guestOwner);

    if (!guestCart.length) {
      return;
    }

    var userCart = storage.getCart(username);

    guestCart.forEach(function (guestItem) {
      var existingItem = userCart.find(function (userItem) {
        return userItem.id === guestItem.id;
      });

      if (existingItem) {
        existingItem.cantidad += guestItem.cantidad;
      } else {
        userCart.push(guestItem);
      }
    });

    storage.saveCart(username, userCart);
    storage.clearCart(guestOwner);
  }

  function closeUserSubmenu() {
    if (!elements.submenuUsuario) {
      return;
    }

    elements.submenuUsuario.classList.remove("show");

    var trigger = document.getElementById("submenuUsuarioTrigger");
    if (trigger) {
      trigger.classList.remove("show");
      trigger.setAttribute("aria-expanded", "false");
    }
  }

  function renderSingleSection() {
    var requested = getRequestedSection();
    var allowed = getAllowedSectionIds();
    var activeSectionId = allowed.indexOf(requested) >= 0 ? requested : getFallbackSection();

    document.querySelectorAll("main > section").forEach(function (section) {
      section.hidden = section.id !== activeSectionId;
    });

    if (window.location.hash !== "#" + activeSectionId) {
      window.location.hash = "#" + activeSectionId;
      return;
    }

    highlightActiveNav(activeSectionId);
    closeUserSubmenu();
  }

  function renderSessionState() {
    var currentUser = getCurrentUser();
    var adminView = isAdmin();
    var authenticated = Boolean(currentUser);

    elements.navRegistro.hidden = authenticated;
    elements.navLogin.hidden = authenticated;
    elements.navRecuperacion.hidden = authenticated;
    elements.navPerfil.hidden = !authenticated;
    elements.cerrarSesionNav.hidden = !authenticated;
    elements.navInventario.hidden = !adminView;
    elements.navClientes.hidden = !adminView;
    elements.navCarrito.hidden = !authenticated || adminView;
    elements.navHistorial.hidden = !authenticated || adminView;

    if (!authenticated) {
      if (elements.estadoSesion) {
        elements.estadoSesion.textContent = "Estás navegando como visitante.";
      }
      if (elements.badgeUsuarioMenu) {
        elements.badgeUsuarioMenu.textContent = "Invitado";
        elements.badgeUsuarioMenu.classList.remove("logueado");
      }
      renderSingleSection();
      return;
    }

    if (elements.badgeUsuarioMenu) {
      elements.badgeUsuarioMenu.textContent = adminView ? "Admin" : currentUser.nombre.split(" ")[0];
      elements.badgeUsuarioMenu.classList.add("logueado");
    }
    if (elements.estadoSesion) {
      elements.estadoSesion.textContent = "Sesión activa: " + currentUser.nombre + " (" + currentUser.rol + ").";
    }
    renderSingleSection();
  }

  function renderQuickCartButton() {
    if (!elements.btnCarritoCantidad) {
      return;
    }

    var cart = storage.getCart(getCurrentOwner());
    var itemCount = cart.reduce(function (sum, item) {
      return sum + item.cantidad;
    }, 0);

    elements.btnCarritoCantidad.textContent = itemCount > 0 ? "(" + itemCount + ")" : "";
  }

  function fillProfileForm() {
    var currentUser = getCurrentUser();

    if (!currentUser) {
      if (elements.profileForm) {
        elements.profileForm.reset();
      }
      return;
    }

    elements.profileName.value = currentUser.nombre || "";
    elements.profileUser.value = currentUser.usuario || "";
    elements.profileEmail.value = currentUser.correo || "";
    elements.profileAddress.value = currentUser.direccion || "";
    elements.profilePassword.value = "";
  }

  function renderCart() {
    var cart = storage.getCart(getCurrentOwner());
    var total = cart.reduce(function (sum, item) {
      return sum + item.precio * item.cantidad;
    }, 0);

    renderQuickCartButton();

    elements.cartTableBody.innerHTML = "";

    if (cart.length === 0) {
      elements.cartEmpty.hidden = false;
      elements.cartTableWrapper.hidden = true;
      elements.cartSummary.hidden = true;
      elements.cartTotal.textContent = formatCurrency(0);
      return;
    }

    elements.cartEmpty.hidden = true;
    elements.cartTableWrapper.hidden = false;
    elements.cartSummary.hidden = false;
    elements.cartTotal.textContent = formatCurrency(total);

    cart.forEach(function (item) {
      var row = document.createElement("tr");
      row.innerHTML = ""
        + "<td>" + item.nombre + "</td>"
        + "<td>" + formatCurrency(item.precio) + "</td>"
        + "<td><span class=\"cantidad-badge\">" + item.cantidad + "</span></td>"
        + "<td>" + formatCurrency(item.precio * item.cantidad) + "</td>"
        + "<td class=\"acciones-tabla\">"
        + "<button type=\"button\" class=\"btn btn-sm btn-outline-secondary\" data-cart-action=\"restar\" data-id=\"" + item.id + "\">-</button> "
        + "<button type=\"button\" class=\"btn btn-sm btn-outline-secondary\" data-cart-action=\"sumar\" data-id=\"" + item.id + "\">+</button> "
        + "<button type=\"button\" class=\"btn btn-sm btn-outline-danger\" data-cart-action=\"eliminar\" data-id=\"" + item.id + "\">Eliminar</button>"
        + "</td>";
      elements.cartTableBody.appendChild(row);
    });
  }

  function updateCartItem(productId, action) {
    var owner = getCurrentOwner();
    var cart = storage.getCart(owner);
    var item = cart.find(function (entry) {
      return entry.id === productId;
    });

    if (!item) {
      return;
    }

    if (action === "sumar") {
      item.cantidad += 1;
    }

    if (action === "restar") {
      item.cantidad -= 1;
    }

    if (action === "eliminar" || item.cantidad <= 0) {
      cart = cart.filter(function (entry) {
        return entry.id !== productId;
      });
    }

    storage.saveCart(owner, cart);
    renderCart();
  }

  function renderHistory() {
    var currentUser = getCurrentUser();

    if (!currentUser) {
      elements.historyContent.className = "seccion-vacia";
      elements.historyContent.textContent = "Inicia sesión para revisar tu historial de compras.";
      return;
    }

    var orders = storage.getOrders(currentUser.usuario);

    if (orders.length === 0) {
      elements.historyContent.className = "seccion-vacia";
      elements.historyContent.textContent = "Todavía no tienes compras registradas.";
      return;
    }

    elements.historyContent.className = "grilla-resumen";
    elements.historyContent.innerHTML = orders.map(function (order) {
      return ""
        + "<article class=\"tarjeta-resumen\">"
        + "<h3>Compra " + order.id + "</h3>"
        + "<p><strong>Fecha:</strong> " + order.fecha + "</p>"
        + "<p><strong>Total:</strong> " + formatCurrency(order.total) + "</p>"
        + "<p><strong>Productos:</strong> " + order.items.map(function (item) { return item.nombre + " x" + item.cantidad; }).join(", ") + "</p>"
        + "</article>";
    }).join("");
  }

  function renderPurchaseConfirmation(order) {
    if (!elements.confirmationOrderId || !elements.confirmationDate || !elements.confirmationTotal) {
      return;
    }

    var orderToShow = order;
    var currentUser = getCurrentUser();

    if (!orderToShow && currentUser) {
      var orders = storage.getOrders(currentUser.usuario);
      orderToShow = orders.length > 0 ? orders[orders.length - 1] : null;
    }

    if (!orderToShow) {
      elements.confirmationOrderId.textContent = "-";
      elements.confirmationDate.textContent = "-";
      elements.confirmationTotal.textContent = formatCurrency(0);
      return;
    }

    elements.confirmationOrderId.textContent = orderToShow.id;
    elements.confirmationDate.textContent = orderToShow.fecha;
    elements.confirmationTotal.textContent = formatCurrency(orderToShow.total);
  }

  function renderInventory() {
    var inventory = storage.getInventory();

    elements.inventoryTableBody.innerHTML = inventory.map(function (item) {
      return ""
        + "<tr>"
        + "<td>" + item.nombre + "</td>"
        + "<td>" + item.categoria + "</td>"
        + "<td>" + formatCurrency(item.precio) + "</td>"
        + "<td>" + item.stock + "</td>"
        + "<td>" + (item.etiqueta || "Sin etiqueta") + "</td>"
        + "<td class=\"acciones-tabla\">"
        + "<button type=\"button\" class=\"btn btn-sm btn-outline-secondary\" data-inventory-action=\"editar\" data-id=\"" + item.id + "\">Editar</button> "
        + "<button type=\"button\" class=\"btn btn-sm btn-outline-danger\" data-inventory-action=\"eliminar\" data-id=\"" + item.id + "\">Eliminar</button>"
        + "</td>"
        + "</tr>";
    }).join("");
  }

  function resetInventoryForm() {
    elements.inventoryId.value = "";
    elements.inventoryForm.reset();
  }

  function renderClients() {
    var users = storage.getUsers().filter(function (user) {
      return user.rol === "cliente";
    });

    elements.clientsTableBody.innerHTML = users.map(function (user) {
      return ""
        + "<tr>"
        + "<td>" + user.nombre + "</td>"
        + "<td>" + user.usuario + "</td>"
        + "<td>" + user.correo + "</td>"
        + "<td><span class=\"rol-chip\">" + user.rol + "</span></td>"
        + "<td>" + (user.direccion || "Sin dirección") + "</td>"
        + "</tr>";
    }).join("");
  }

  function handleLogin(event) {
    event.preventDefault();

    var identifier = document.getElementById("loginIdentificador").value.trim();
    var password = document.getElementById("loginClave").value;

    if (!identifier || !password) {
      setMessage(elements.loginMessage, "Debes completar ambos campos para iniciar sesión.", "error");
      return;
    }

    var result = auth.login(identifier, password);

    if (!result.ok) {
      setMessage(elements.loginMessage, result.message, "error");
      return;
    }

    mergeGuestCartIntoUserCart(result.user.usuario);
    setMessage(elements.loginMessage, "Inicio de sesión correcto.", "ok");
    renderSessionState();
    fillProfileForm();
    renderCart();
    renderHistory();
    renderClients();
    window.location.hash = result.user.rol === "administrador" ? "#gestionInventario" : "#perfil";
  }

  function handleRecovery(event) {
    event.preventDefault();

    var email = document.getElementById("recuperacionEmail").value.trim();

    if (!isValidEmail(email)) {
      setMessage(elements.recoveryMessage, "Ingresa un correo válido para recuperar tu acceso.", "error");
      return;
    }

    var user = storage.findUserByEmail(email);

    if (!user) {
      setMessage(elements.recoveryMessage, "Si el correo existe en el sistema, enviamos instrucciones de recuperación simuladas.", "ok");
      elements.recoveryForm.reset();
      return;
    }

    var recoveryMessage = "Tu contraseña es: <strong>" + user.contrasena + "</strong>. Usa esta clave junto con tu usuario <strong>" + user.usuario + "</strong> para iniciar sesión.";
    setMessage(elements.recoveryMessage, recoveryMessage, "ok");
    elements.recoveryForm.reset();
  }

  function handleProfileSubmit(event) {
    event.preventDefault();

    var nombre = elements.profileName.value.trim();
    var correo = elements.profileEmail.value.trim();
    var direccion = elements.profileAddress.value.trim();
    var nuevaClave = elements.profilePassword.value;

    if (!nombre || !isValidEmail(correo)) {
      setMessage(elements.profileMessage, "Revisa nombre y correo antes de guardar tu perfil.", "error");
      return;
    }

    if (nuevaClave && !isStrongPassword(nuevaClave)) {
      setMessage(elements.profileMessage, "La nueva contraseña no cumple los requisitos.", "error");
      return;
    }

    var result = auth.updateProfile({
      nombre: nombre,
      correo: correo,
      direccion: direccion,
      contrasena: nuevaClave
    });

    if (!result.ok) {
      setMessage(elements.profileMessage, result.message, "error");
      return;
    }

    setMessage(elements.profileMessage, "Perfil actualizado correctamente.", "ok");
    renderSessionState();
    fillProfileForm();
    renderClients();
  }

  function handleBuy() {
    var currentUser = getCurrentUser();
    var owner = getCurrentOwner();
    var cart = storage.getCart(owner);

    if (cart.length === 0) {
      setMessage(elements.cartMessage, "Tu carrito está vacío.", "error");
      return;
    }

    if (!currentUser) {
      setMessage(elements.cartMessage, "Debes iniciar sesión para simular la compra y guardar tu historial.", "error");
      return;
    }

    var total = cart.reduce(function (sum, item) {
      return sum + item.precio * item.cantidad;
    }, 0);

    var order = {
      id: "ORD-" + Date.now(),
      fecha: new Date().toLocaleString("es-CL"),
      total: total,
      items: cart
    };

    storage.addOrder(currentUser.usuario, order);

    storage.clearCart(owner);
    renderCart();
    renderHistory();
    renderPurchaseConfirmation(order);
    window.location.hash = "#confirmacionCompra";
  }

  function handleInventorySubmit(event) {
    event.preventDefault();

    if (!isAdmin()) {
      setMessage(elements.inventoryMessage, "Solo un administrador puede gestionar inventario.", "error");
      return;
    }

    var inventory = storage.getInventory();
    var itemId = elements.inventoryId.value || slugify(elements.inventoryName.value.trim());
    var item = {
      id: itemId,
      nombre: elements.inventoryName.value.trim(),
      categoria: elements.inventoryCategory.value.trim(),
      precio: Number(elements.inventoryPrice.value),
      stock: Number(elements.inventoryStock.value),
      descripcion: elements.inventoryDescription.value.trim(),
      etiqueta: elements.inventoryLabel.value.trim()
    };

    if (!item.nombre || !item.categoria || !item.descripcion || item.precio < 0 || item.stock < 0) {
      setMessage(elements.inventoryMessage, "Completa todos los campos obligatorios del inventario.", "error");
      return;
    }

    var existingIndex = inventory.findIndex(function (entry) {
      return entry.id === item.id;
    });

    if (existingIndex >= 0) {
      inventory[existingIndex] = item;
      setMessage(elements.inventoryMessage, "Juego actualizado correctamente.", "ok");
    } else {
      inventory.push(item);
      setMessage(elements.inventoryMessage, "Juego agregado al inventario.", "ok");
    }

    storage.saveInventory(inventory);
    renderInventory();
    resetInventoryForm();
  }

  function setupFloatingMenuButton() {
    if (!elements.btnVolverMenu || !elements.menuPrincipal) {
      return;
    }

    function updateButton(menuVisible) {
      var shouldShow = !menuVisible && window.scrollY > 120;
      elements.btnVolverMenu.hidden = !shouldShow;
    }

    var observer = new IntersectionObserver(function (entries) {
      updateButton(entries[0].isIntersecting);
    });

    observer.observe(elements.menuPrincipal);

    window.addEventListener("scroll", function () {
      var menuRect = elements.menuPrincipal.getBoundingClientRect();
      var menuVisible = menuRect.bottom > 0 && menuRect.top < window.innerHeight;
      updateButton(menuVisible);
    }, { passive: true });

    elements.btnVolverMenu.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      var addCartButton = event.target.closest("[data-add-cart]");
      var cartButton = event.target.closest("[data-cart-action]");
      var inventoryButton = event.target.closest("[data-inventory-action]");

      if (addCartButton) {
        addProductToCart(addCartButton.dataset.addCart);
      }

      if (cartButton) {
        updateCartItem(cartButton.dataset.id, cartButton.dataset.cartAction);
      }

      if (inventoryButton) {
        var inventory = storage.getInventory();
        var item = inventory.find(function (entry) {
          return entry.id === inventoryButton.dataset.id;
        });

        if (!item) {
          return;
        }

        if (inventoryButton.dataset.inventoryAction === "editar") {
          elements.inventoryId.value = item.id;
          elements.inventoryName.value = item.nombre;
          elements.inventoryCategory.value = item.categoria;
          elements.inventoryPrice.value = item.precio;
          elements.inventoryStock.value = item.stock;
          elements.inventoryDescription.value = item.descripcion;
          elements.inventoryLabel.value = item.etiqueta || "";
          window.location.hash = "#gestionInventario";
        }

        if (inventoryButton.dataset.inventoryAction === "eliminar") {
          storage.saveInventory(inventory.filter(function (entry) {
            return entry.id !== item.id;
          }));
          renderInventory();
          setMessage(elements.inventoryMessage, "Juego eliminado del inventario.", "ok");
        }
      }
    });

    elements.loginForm.addEventListener("submit", handleLogin);
    elements.recoveryForm.addEventListener("submit", handleRecovery);
    elements.profileForm.addEventListener("submit", handleProfileSubmit);
    elements.buyButton.addEventListener("click", handleBuy);
    elements.inventoryForm.addEventListener("submit", handleInventorySubmit);
    elements.inventoryForm.addEventListener("reset", function () {
      setTimeout(function () {
        elements.inventoryId.value = "";
      }, 0);
    });

    elements.cerrarSesionNav.addEventListener("click", function () {
      auth.logout();
      renderSessionState();
      fillProfileForm();
      renderCart();
      renderHistory();
      setMessage(elements.loginMessage, "Sesión cerrada correctamente.", "ok");
      window.location.hash = "#login";
    });

    window.addEventListener("hashchange", renderSingleSection);

    window.addEventListener("storage", function () {
      renderSessionState();
      renderCart();
      renderHistory();
      renderInventory();
      renderClients();
    });
  }

  function addProductToCart(productId) {
    var product = state.catalogProducts.find(function (item) {
      return item.id === productId;
    });

    if (!product) {
      setMessage(elements.cartMessage, "No fue posible agregar el juego seleccionado.", "error");
      return;
    }

    var owner = getCurrentOwner();
    var cart = storage.getCart(owner);
    var existingItem = cart.find(function (item) {
      return item.id === product.id;
    });

    if (existingItem) {
      existingItem.cantidad += 1;
    } else {
      cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1
      });
    }

    storage.saveCart(owner, cart);
    renderCart();
    setMessage(elements.cartMessage, product.nombre + " fue agregado al carrito.", "ok");
  }

  auth.ensureAdminUser();
  state.catalogProducts = dedupeProductsById(extractCatalogProducts());
  ensureInventorySeed();
  addCatalogButtons();
  bindEvents();
  setupFloatingMenuButton();
  renderSessionState();
  fillProfileForm();
  renderCart();
  renderHistory();
  renderPurchaseConfirmation();
  renderInventory();
  renderClients();
})();
