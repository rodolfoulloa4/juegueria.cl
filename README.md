# La Juegueria

Aplicacion web frontend (sin backend) para catalogo y simulacion de compra de juegos de mesa.
La experiencia actual incluye navegacion tipo SPA por secciones, gestion de sesion por roles,
carrito persistente, historial de compras y panel administrativo.

## Estado actual del proyecto

- Navegacion en una sola pagina con secciones visibles por hash.
- Navbar unificado con categorias a la izquierda y menu de usuario a la derecha.
- Boton rapido de carrito siempre visible con contador dinamico.
- Registro, login, recuperacion y edicion de perfil.
- Carrito con incremento/disminucion, eliminacion y simulacion de compra.
- Pantalla de confirmacion de compra y historial por usuario.
- Vistas de administracion para inventario y mantenedor de clientes.

## Tecnologias

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (modular en archivos separados)
- LocalStorage y SessionStorage para persistencia en cliente

## Estructura de carpetas

```text
juegueria.cl/
|-- index.html
|-- README.md
`-- assets/
		|-- css/
		|   |-- bootstrap.min.css
		|   `-- styles.css
		|-- img/
		|   |-- categoria-estrategia.svg
		|   |-- categoria-familiares.svg
		|   |-- categoria-fiesta.svg
		|   |-- categoria-infantiles.svg
		|   |-- juego-estrategia.svg
		|   |-- juego-familiares.svg
		|   |-- juego-fiesta.svg
		|   `-- juego-infantiles.svg
		`-- js/
				|-- bootstrap.bundle.min.js
				|-- storage.js
				|-- auth.js
				|-- form-validation.js
				`-- app.js
```

## Flujo de navegacion y secciones

La aplicacion usa secciones HTML y hash routing para mostrar solo una seccion activa a la vez.

Secciones disponibles:

- Publicas: destacados, categorias, estrategia, familiares, infantiles, fiesta, registro, login, recuperacion.
- Cliente autenticado: perfil, carrito, historial, confirmacion de compra.
- Administrador: gestion de inventario, mantenedor de clientes.

## Roles y acceso

- Invitado: puede navegar catalogo, registrarse, iniciar sesion y usar carrito.
- Cliente: accede a perfil, carrito e historial.
- Administrador: accede a inventario y clientes.

Cuenta de prueba administrador:

- Usuario: admin
- Clave: admin123

## Funcionalidades principales

### 1) Registro

- Valida nombre, usuario, correo, fecha de nacimiento y clave.
- Evita usuario/correo duplicados.
- Exige clave fuerte (mayuscula y numero).
- Al registrar correctamente:
	- guarda usuario en localStorage,
	- muestra resumen,
	- oculta formulario,
	- entrega acceso rapido a login.

### 2) Autenticacion y perfil

- Login por usuario o correo.
- Cierre de sesion.
- Edicion de perfil (nombre, correo, direccion y clave opcional).
- Badge de estado en menu de usuario (Invitado, nombre o Admin).

### 2.1) Recuperacion de contraseña

- Formulario que requiere correo valido.
- Si el correo existe en la base de datos: muestra la contraseña real del usuario de forma visual.
- Si el correo no existe: muestra mensaje generico (por seguridad, no revela si el correo esta registrado).
- Permite acceder con las credenciales recuperadas.

### 3) Carrito de compras

- Agregar productos desde tarjetas del catalogo.
- Modificar cantidades (+/-) y eliminar items.
- Boton de carrito rapido siempre visible.
- Muestra contador de items entre parentesis solo si hay productos.
- Si un invitado agrega productos y luego inicia sesion, el carrito se fusiona
	con el del usuario autenticado para no perder items.

### 4) Simulacion de compra

- Simula orden con ID, fecha, total e items.
- Limpia carrito al confirmar.
- Redirige automaticamente a pantalla de confirmacion.
- Guarda compra en historial del usuario.

### 5) Historial

- Lista compras simuladas por usuario autenticado.
- Muestra fecha, total y productos.

### 6) Administracion

- CRUD simulado de inventario.
- Mantenedor de clientes registrados.

## Persistencia de datos

Se usan las siguientes claves de storage:

- usuariosLaJuegueria: usuarios registrados.
- sesionLaJuegueria: sesion actual (sessionStorage).
- inventarioLaJuegueria: catalogo editable para admin.
- historialLaJuegueria: compras por usuario.
- carritoLaJuegueria_<owner>: carrito por usuario o invitado.

## Experiencia de usuario y accesibilidad

- Navegacion por seccion activa para reducir ruido visual.
- Boton flotante para volver al menu.
- Link de salto a contenido principal para teclado.
- Contraste reforzado en elementos clave del navbar.
- Diseno responsive para escritorio y movil.

## Ejecucion local

1. Clona o descarga el repositorio.
2. Abre la carpeta del proyecto.
3. Abre index.html en tu navegador.

No se requiere instalacion de dependencias ni servidor para uso basico.

## Notas

- El proyecto es 100% cliente. Los datos persisten en el navegador.
- Para resetear estado, limpia localStorage y sessionStorage del sitio.