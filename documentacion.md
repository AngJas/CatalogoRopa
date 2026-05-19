# Documentación del sistema.

---

---

## Información del Producto

**Nombre del producto:** TUROPA.COM - Catálogo de Ropa en Línea.

**Materia:** Desarrollo e Implementación de Sistemas

**Fecha de última actualización:** 17/05/2026

## Integrantes del Equipo 5

| Apellido(s)      | Nombre(s)    |
| ---------------- | ------------ |
| Estrada Rios     | Daiana       |
| González Erenas  | Jean Paul    |
| Hernández López  | Jesús Noel   |
| Hernández Valdez | Ángel Jasiel |

---

## 1. Introducción

<p align="justify">
Turopa.com es una aplicación web tipo revista digital que funciona como un catálogo de ropa en línea, diseñado para que los usuarios puedan explorar productos de forma rápida, intuitiva y visualmente atractiva. A diferencia de un e-commerce tradicional, este sistema se enfoca exclusivamente en la consulta y visualización de prendas, sin requerir autenticación de usuarios ni procesos de compra en línea.
El proyecto fue desarrollado siguiendo las fases de análisis y diseño de software, transformando los requerimientos iniciales en una estructura técnica clara que comprende el diagrama de clases, el diseño de base de datos, la interfaz de usuario y la arquitectura del sistema. El objetivo principal es ofrecer una experiencia de navegación fluida que permita al usuario descubrir productos a través de categorías, filtros y elementos visuales que faciliten la toma de decisiones.

Este documento describe los componentes técnicos y funcionales del sistema, sirviendo como referencia para su implementación, mantenimiento y posibles expansiones futuras.

</p>

---

## 2. Resumen del Sistema

Es una plataforma web -turopa.com- que presenta un catálogo digital de prendas de vestir organizado por categorías (Novedades, Promociones, Hombre, Mujer, Todo). El sistema permite al usuario navegar entre productos, aplicar filtros de búsqueda y visualizar información detallada de cada artículo sin necesidad de registrarse.

### 2.1. Características principales

- **Catálogo visual**: muestra productos con imagen, descripción breve y precio.
- **Navegación por categorías**: secciones específicas para Hombre, Mujer, Novedades, Promociones y Todo.
- **Sistema de filtros**: permite filtrar prendas por tipo, talla y rango de precio.
- **Banner promocional**: destaca ofertas y campañas vigentes.
- **Barra de búsqueda**: permite localizar prendas específicas por nombre.
- **Diseño responsivo y limpio**: pensado para una experiencia de usuario intuitiva en navegador de escritorio.

### 2.2. Arquitectura

El sistema se construye bajo una **arquitectura en capas Cliente-Servidor**, dividida en tres niveles:

| Capa              | Responsabilidad                                  | Tecnologías                                       |
| ----------------- | ------------------------------------------------ | ------------------------------------------------- |
| **Frontend**      | Presentación e interacción con el usuario        | HTML, CSS, JavaScript                             |
| **Backend**       | Lógica de negocio y procesamiento de solicitudes | C#, API REST (Controlador, Servicio, Repositorio) |
| **Base de Datos** | Almacenamiento persistente de información        | SQL Server (Modelo relacional)                    |

### 2.3. Entidades principales del modelo de datos

- `Producto` — información general de cada prenda.
- `Variante` — combinaciones de talla, color y stock por producto.
- `Categoría` — clasificación jerárquica de prendas.
- `Marca` — fabricantes asociados a los productos.
- `Colección` — agrupaciones por temporada o año.
- `Promoción` — descuentos aplicables a productos.
- `ImagenProducto` — recursos visuales asociados a cada artículo.

---

## 3. Requisitos

### 3.1 Requisitos Funcionales

| Requisito                           | Descripción                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| Visualización de catálogo           | El sistema debe mostrar un listado de productos con imagen, descripción breve y precio.         |
| Navegación por categorías           | El usuario podrá acceder a secciones específicas: Novedades, Promociones, Hombre, Mujer y Todo. |
| Filtrado de productos               | El sistema debe permitir filtrar prendas por tipo de prenda, talla y rango de precio.           |
| Búsqueda de prendas                 | El usuario podrá buscar productos específicos a través de una barra de búsqueda.                |
| Visualización de promociones        | El sistema debe mostrar un banner promocional con las ofertas vigentes.                         |
| Gestión de variantes                | Cada producto podrá tener múltiples variantes (talla, color, stock).                            |
| Cálculo de precio con descuento     | El sistema debe aplicar promociones vigentes sobre el precio base de los productos.             |
| Categorización jerárquica           | Las categorías podrán contener subcategorías (relación padre/hijo).                             |
| Visualización de imágenes múltiples | Cada producto puede tener varias imágenes, con una marcada como principal.                      |
| Navegación rápida                   | El sistema debe ofrecer un botón "Ir Arriba" y acceso al inicio mediante el logotipo.           |
| Indicador de sección activa         | La opción seleccionada en el menú debe cambiar de color para indicar la ubicación actual.       |
| Acceso a información de la empresa  | El footer debe mostrar información del negocio, ayuda, tiendas físicas y redes sociales.        |

### 3.2 Requisitos No Funcionales}

| Requisito      |
| -------------- |
| Usabilidad     |
| Rendimiento    |
| Mantenibilidad |
| Escalabilidad  |
| Compatibilidad |
| Disponibilidad |
| Seguridad      |

### 3.3 Tecnicos

<p align="justify"> Los requisitos técnicos definen las herramientas, lenguajes, frameworks y plataformas necesarias para construir, ejecutar y mantener el sistema Turopa.com. </p>

| Requisito     | Descripción                             |
| ------------- | --------------------------------------- |
| Frontend      | HTML, CSS, JavaScript, Bootstrap        |
| Backend       | C#, ASP.NET Core, Entity Framework Core |
| Base de Datos | SQL Server                              |
| API REST      | Controlador, Servicio, Repositorio      |
| Servidor      | IIS, Windows Server                     |
| Hosting       | Cloud (Azure)                           |

---

## 3.4 De Arquitectura del sistema

<p align="justify"> La arquitectura del sistema define cómo se organizan y comunican los componentes del sistema para lograr sus objetivos. </p>

| Requisito           | Descripción                                                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cliente-Servidor    | El sistema está diseñado como una aplicación Cliente-Servidor, donde el cliente (navegador web) se comunica con el servidor para acceder a los datos y funcionalidades del sistema. |
| Capas de aplicación | El sistema está dividido en capas de aplicación, cada una con responsabilidades específicas: frontend, backend y base de datos.                                                     |




## 4. Instalacion del sistema

<p align="justify"> Para instalar y ejecutar el sistema Turopa.com, se deben seguir los siguientes pasos: </p>



## 5 Uso de sistema






<p align="justify"> El sistema Turopa.com está diseñado para facilitar la experiencia de compra en línea, permitiendo a los usuarios navegar por el catálogo de productos, aplicar filtros y realizar búsquedas específicas. </p>



1. **Navegar por el catálogo**: Explorar el catálogo de productos, seleccionar la categoría y prenda deseada.

En la barra lateral o superior (según diseño), el usuario puede seleccionar:

Tipo de prenda (camisa, pantalón, chaqueta, etc.) – se carga dinámicamente desde la base de datos.

Talla (S, M, L, XL, etc.).

Rango de precio (desde – hasta).

Al aplicar los filtros, el sistema recarga automáticamente la lista de productos sin recargar la página completa.

Visualización de detalles
Al hacer clic en una tarjeta de producto, se abre una vista modal o una página de detalle que muestra:

Imagen principal y galería de imágenes adicionales.

Nombre, descripción, marca, colección.

Precio original (si aplica descuento) y precio final con promoción.

Variantes disponibles (tallas y colores con stock).

Botón “Ver más” (no hay compra, solo informativo).

## 6. Base de datos (Modelado)

<p align="justify"> La base de datos de Turopa.com almacena información sobre los productos, categorías, marcas, colecciones, promociones e imágenes. A continuación, se presenta un modelo conceptual simplificado de la base de datos. </p>

### 6.1 Modelo conceptual de la base de datos

<p align="justify"> El modelo conceptual de la base de datos de Turopa.com se compone de las siguientes tablas: </p>

| Tabla    | Descripción                         |
| -------- | ----------------------------------- |
| Producto | Información general de cada prenda. |

Consideraciones adicionales
Índices recomendados:

IX_Producto_Categoria sobre IdCategoria

IX_Variante_Producto sobre IdProducto

IX_Promocion_Fechas sobre FechaInicio, FechaFin

Vista útil para el catálogo:
vw_ProductoConPrecioFinal – calcula el precio aplicando la mejor promoción vigente (si existe) usando una subconsulta.

Datos de prueba:
Es recomendable insertar al menos 10 productos de ejemplo, con sus variantes, imágenes y alguna promoción activa para validar el comportamiento del sistema.
