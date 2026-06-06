(function () {
  var storage = window.JuegueriaStorage;
  var ADMIN = {
    nombre: "Administrador La Jueguería",
    usuario: "admin",
    correo: "admin@lajuegueria.cl",
    contrasena: "admin123",
    direccion: "Casa matriz",
    rol: "administrador"
  };

  function sanitizeSession(user) {
    return {
      nombre: user.nombre,
      usuario: user.usuario,
      correo: user.correo,
      direccion: user.direccion || "",
      rol: user.rol || "cliente"
    };
  }

  function ensureAdminUser() {
    var admin = storage.findUserByUsername(ADMIN.usuario);

    if (!admin) {
      storage.upsertUser(ADMIN);
      return;
    }

    if (admin.rol !== "administrador") {
      admin.rol = "administrador";
      admin.contrasena = ADMIN.contrasena;
      admin.correo = admin.correo || ADMIN.correo;
      storage.upsertUser(admin);
    }
  }

  function login(identifier, password) {
    ensureAdminUser();

    var user = storage.findUserByCredentials(identifier.trim(), password);

    if (!user) {
      return { ok: false, message: "Credenciales inválidas. Intenta nuevamente." };
    }

    storage.setSession(sanitizeSession(user));
    return { ok: true, user: sanitizeSession(user) };
  }

  function logout() {
    storage.clearSession();
  }

  function getCurrentUser() {
    return storage.getSession();
  }

  function updateProfile(data) {
    var currentUser = getCurrentUser();

    if (!currentUser) {
      return { ok: false, message: "No hay una sesión activa." };
    }

    var user = storage.findUserByUsername(currentUser.usuario);

    if (!user) {
      return { ok: false, message: "No fue posible encontrar el usuario actual." };
    }

    var updatedUser = {
      nombre: data.nombre,
      usuario: user.usuario,
      correo: data.correo,
      contrasena: data.contrasena || user.contrasena,
      direccion: data.direccion,
      rol: user.rol || currentUser.rol || "cliente"
    };

    storage.upsertUser(updatedUser);
    storage.setSession(sanitizeSession(updatedUser));

    return { ok: true, user: sanitizeSession(updatedUser) };
  }

  window.JuegueriaAuth = {
    ensureAdminUser: ensureAdminUser,
    login: login,
    logout: logout,
    getCurrentUser: getCurrentUser,
    updateProfile: updateProfile
  };
})();(function () {
  var storage = window.JuegueriaStorage;
  var ADMIN = {
    nombre: "Administrador La Jueguería",
    usuario: "admin",
    correo: "admin@lajuegueria.cl",
    contrasena: "admin123",
    direccion: "Casa matriz",
    rol: "administrador"
  };

  function sanitizeSession(user) {
    return {
      nombre: user.nombre,
      usuario: user.usuario,
      correo: user.correo,
      direccion: user.direccion || "",
      rol: user.rol || "cliente"
    };
  }

  function ensureAdminUser() {
    var admin = storage.findUserByUsername(ADMIN.usuario);

    if (!admin) {
      storage.upsertUser(ADMIN);
      return;
    }

    if (admin.rol !== "administrador") {
      admin.rol = "administrador";
      admin.contrasena = ADMIN.contrasena;
      admin.correo = admin.correo || ADMIN.correo;
      storage.upsertUser(admin);
    }
  }

  function login(identifier, password) {
    ensureAdminUser();

    var user = storage.findUserByCredentials(identifier.trim(), password);

    if (!user) {
      return { ok: false, message: "Credenciales inválidas. Intenta nuevamente." };
    }

    storage.setSession(sanitizeSession(user));
    return { ok: true, user: sanitizeSession(user) };
  }

  function logout() {
    storage.clearSession();
  }

  function getCurrentUser() {
    return storage.getSession();
  }

  function updateProfile(data) {
    var currentUser = getCurrentUser();

    if (!currentUser) {
      return { ok: false, message: "No hay una sesión activa." };
    }

    var user = storage.findUserByUsername(currentUser.usuario);

    if (!user) {
      return { ok: false, message: "No fue posible encontrar el usuario actual." };
    }

    var updatedUser = {
      nombre: data.nombre,
      usuario: user.usuario,
      correo: data.correo,
      contrasena: data.contrasena || user.contrasena,
      direccion: data.direccion,
      rol: user.rol || currentUser.rol || "cliente"
    };

    storage.upsertUser(updatedUser);
    storage.setSession(sanitizeSession(updatedUser));

    return { ok: true, user: sanitizeSession(updatedUser) };
  }

  window.JuegueriaAuth = {
    ensureAdminUser: ensureAdminUser,
    login: login,
    logout: logout,
    getCurrentUser: getCurrentUser,
    updateProfile: updateProfile
  };
})();