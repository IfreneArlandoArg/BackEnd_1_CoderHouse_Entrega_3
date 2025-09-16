# Entrega 3 - Backend CoderHouse

## Descripción

Este proyecto es una API y aplicación web para la gestión de productos y carritos de compras, utilizando Node.js, Express, MongoDB (Mongoose) y Handlebars. Incluye paginación, filtros, ordenamiento, vistas dinámicas y manejo de carritos con referencias a productos.

## Características principales

- CRUD de productos con persistencia en MongoDB
- CRUD de carritos y productos dentro del carrito
- Paginación, filtrado y ordenamiento de productos vía query params
- Vistas con Handlebars para productos, detalle de producto, carrito y productos en tiempo real (WebSocket)
- Botón para agregar productos al carrito desde la lista y el detalle
- Botón para eliminar productos del carrito y de la base de datos (en tiempo real)
- Cada usuario tiene su propio carrito (simulado por IP)

## Instalación

1. Clona el repositorio y entra a la carpeta del proyecto:
   ```
   git clone <repo-url>
   cd BackEnd_1_CoderHouse_Entrega_3
   ```
2. Instala las dependencias:
   ```
   npm install
   ```
3. Configura tu string de conexión a MongoDB en `src/app.js` si es necesario.
4. Inicia el servidor:
   ```
   npm start
   ```

## Endpoints principales

### Productos
- `GET /api/products` - Listado con paginación, filtros y ordenamiento
- `POST /api/products` - Crear producto
- `PUT /api/products/:pid` - Actualizar producto
- `DELETE /api/products/:pid` - Eliminar producto

### Carritos
- `POST /api/carts/:cid/products/:pid` - Agregar producto al carrito
- `DELETE /api/carts/:cid/products/:pid` - Eliminar producto del carrito
- `PUT /api/carts/:cid` - Actualizar todos los productos del carrito
- `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad de un producto
- `DELETE /api/carts/:cid` - Vaciar carrito
- `GET /api/carts/:cid` - Ver carrito (con populate)

## Vistas
- `/products` - Lista de productos con paginación y botón para agregar al carrito
- `/products/:pid` - Detalle de producto con botón para agregar al carrito
- `/carts/:cid` - Vista de carrito con productos y opción de eliminar
- `/realtimeproducts` - Gestión de productos en tiempo real (WebSocket)

## Notas
- El helper `multiply` está registrado para Handlebars para mostrar subtotales en el carrito.
- El carrito es único por usuario (simulado por IP, no para producción).
- El proyecto no incluye autenticación.

## Autor
- Ifrene Arlando Arg

---
Entrega 3 - CoderHouse Backend


