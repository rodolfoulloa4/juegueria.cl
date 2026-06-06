(function () {
  var KEYS = {
    users: "usuariosLaJuegueria",
    session: "sesionLaJuegueria",
    inventory: "inventarioLaJuegueria",
    history: "historialLaJuegueria"
  };

  function readJson(storage, key, fallback) {
    var raw = storage.getItem(key);

    if (!raw) {
      return fallback;
    }

    try {
      var value = JSON.parse(raw);
      return value === null || value === undefined ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

  function getUsers() {
    var users = readJson(localStorage, KEYS.users, []);
    return Array.isArray(users) ? users : [];
  }

  function saveUsers(users) {
    writeJson(localStorage, KEYS.users, users);
  }

  function upsertUser(user) {
    var users = getUsers();
    var index = users.findIndex(function (item) {
      return item.usuario === user.usuario;
    });

    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }

    saveUsers(users);
    return user;
  }

  function findUserByCredentials(identifier, password) {
    return getUsers().find(function (user) {
      return (user.usuario === identifier || user.correo === identifier) && user.contrasena === password;
    }) || null;
  }

  function findUserByUsername(username) {
    return getUsers().find(function (user) {
      return user.usuario === username;
    }) || null;
  }

  function findUserByEmail(email) {
    var normalizedEmail = String(email || "").trim().toLowerCase();

    return getUsers().find(function (user) {
      return String(user.correo || "").trim().toLowerCase() === normalizedEmail;
    }) || null;
  }

  function getSession() {
    return readJson(sessionStorage, KEYS.session, null);
  }

  function setSession(sessionData) {
    writeJson(sessionStorage, KEYS.session, sessionData);
    return sessionData;
  }

  function clearSession() {
    sessionStorage.removeItem(KEYS.session);
  }

  function getInventory() {
    var items = readJson(localStorage, KEYS.inventory, []);
    return Array.isArray(items) ? items : [];
  }

  function saveInventory(items) {
    writeJson(localStorage, KEYS.inventory, items);
  }

  function getCartKey(owner) {
    return "carritoLaJuegueria_" + owner;
  }

  function getCart(owner) {
    var items = readJson(localStorage, getCartKey(owner), []);
    return Array.isArray(items) ? items : [];
  }

  function saveCart(owner, items) {
    writeJson(localStorage, getCartKey(owner), items);
  }

  function clearCart(owner) {
    localStorage.removeItem(getCartKey(owner));
  }

  function getHistory() {
    return readJson(localStorage, KEYS.history, {});
  }

  function addOrder(username, order) {
    var history = getHistory();
    history[username] = Array.isArray(history[username]) ? history[username] : [];
    history[username].push(order);
    writeJson(localStorage, KEYS.history, history);
  }

  function getOrders(username) {
    var history = getHistory();
    return Array.isArray(history[username]) ? history[username] : [];
  }

  window.JuegueriaStorage = {
    keys: KEYS,
    getUsers: getUsers,
    saveUsers: saveUsers,
    upsertUser: upsertUser,
    findUserByCredentials: findUserByCredentials,
    findUserByUsername: findUserByUsername,
    findUserByEmail: findUserByEmail,
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    getInventory: getInventory,
    saveInventory: saveInventory,
    getCart: getCart,
    saveCart: saveCart,
    clearCart: clearCart,
    addOrder: addOrder,
    getOrders: getOrders
  };
})();