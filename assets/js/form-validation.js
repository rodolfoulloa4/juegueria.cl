(function () {
  var form = document.getElementById("form-registro");
  if (!form) {
    return;
  }

  var nombre = document.getElementById("nombreCompleto");
  var usuario = document.getElementById("usuario");
  var email = document.getElementById("email");
  var fechaNacimiento = document.getElementById("fechaNacimiento");
  var clave = document.getElementById("clave");
  var repetirClave = document.getElementById("repetirClave");
  var direccion = document.getElementById("direccion");
  var mensaje = document.getElementById("mensajeFormulario");
  var resumen = document.getElementById("resumenRegistro");

  var resumenNombre = document.querySelector('[data-resumen="nombre"]');
  var resumenUsuario = document.querySelector('[data-resumen="usuario"]');
  var resumenEmail = document.querySelector('[data-resumen="email"]');
  var resumenFecha = document.querySelector('[data-resumen="fechaNacimiento"]');
  var resumenDireccion = document.querySelector('[data-resumen="direccion"]');

  function setCampoEstado(campo, esValido) {
    campo.classList.remove("is-valid", "is-invalid");
    campo.classList.add(esValido ? "is-valid" : "is-invalid");
  }

  function edadValida(valorFecha) {
    if (!valorFecha) {
      return false;
    }

    var hoy = new Date();
    var nacimiento = new Date(valorFecha + "T00:00:00");
    if (Number.isNaN(nacimiento.getTime())) {
      return false;
    }

    var edad = hoy.getFullYear() - nacimiento.getFullYear();
    var mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad -= 1;
    }

    return edad >= 13;
  }

  function correoValido(valorCorreo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorCorreo);
  }

  function claveValida(valorClave) {
    return /^(?=.*[A-Z])(?=.*\d).{6,18}$/.test(valorClave);
  }

  function limpiarEstadoVisual() {
    form.classList.remove("was-validated");
    document.body.classList.remove("registro-exitoso");
    [nombre, usuario, email, fechaNacimiento, clave, repetirClave].forEach(function (campo) {
      campo.classList.remove("is-valid", "is-invalid");
    });
    mensaje.textContent = "";
    mensaje.className = "mensaje-formulario";
    resumen.hidden = true;
  }

  function validarFormulario() {
    var nombreOk = nombre.value.trim().length > 0;
    var usuarioOk = usuario.value.trim().length >= 3;
    var emailOk = email.value.trim().length > 0 && correoValido(email.value.trim());
    var fechaOk = edadValida(fechaNacimiento.value);
    var claveOk = claveValida(clave.value);
    var repetirOk = repetirClave.value.length > 0 && repetirClave.value === clave.value;

    setCampoEstado(nombre, nombreOk);
    setCampoEstado(usuario, usuarioOk);
    setCampoEstado(email, emailOk);
    setCampoEstado(fechaNacimiento, fechaOk);
    setCampoEstado(clave, claveOk);
    setCampoEstado(repetirClave, repetirOk);

    return nombreOk && usuarioOk && emailOk && fechaOk && claveOk && repetirOk;
  }

  function actualizarResumen() {
    var direccionTexto = direccion.value.trim() || "Sin dirección registrada";
    var fechaTexto = new Date(fechaNacimiento.value + "T00:00:00").toLocaleDateString("es-CL");

    resumenNombre.textContent = nombre.value.trim();
    resumenUsuario.textContent = usuario.value.trim();
    resumenEmail.textContent = email.value.trim();
    resumenFecha.textContent = fechaTexto;
    resumenDireccion.textContent = direccionTexto;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var formularioOk = validarFormulario();
    form.classList.add("was-validated");

    if (!formularioOk) {
      mensaje.textContent = "Revisa los campos en rojo para completar tu registro.";
      mensaje.className = "mensaje-formulario error";
      resumen.hidden = true;
      return;
    }

    actualizarResumen();
    resumen.hidden = false;
    mensaje.textContent = "Registro enviado correctamente. Bienvenido a La Jueguería.";
    mensaje.className = "mensaje-formulario ok";
    document.body.classList.add("registro-exitoso");
  });

  form.addEventListener("reset", function () {
    setTimeout(limpiarEstadoVisual, 0);
  });
})();
