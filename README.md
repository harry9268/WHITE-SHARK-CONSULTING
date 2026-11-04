# WHITE SHARK CONSULTING — Web corporativa

Web corporativa bilingüe (ES / EN) de **WHITE SHARK CONSULTING**.
Diseño y desarrollo: [Impulsa Digital](https://impulsadigital.me).

HTML5 semántico, CSS puro con variables y JavaScript vanilla. Sin frameworks ni librerías externas, sin CSS ni JS inline. Preparada para Hostinger (Apache/LiteSpeed + PHP 8).

---

## 1. Estructura

```
/
├── index.html                  Inicio (one-page con anclas)
├── servicios.html              Las 8 áreas en detalle
├── contacto.html
├── aviso-legal.html
├── politica-privacidad.html
├── politica-cookies.html
├── 404.html                    Rutas absolutas (/assets/...) porque se sirve desde cualquier URL
├── en/
│   ├── index.html
│   ├── services.html
│   ├── contact.html
│   ├── legal-notice.html
│   ├── privacy-policy.html
│   ├── cookie-policy.html
│   ├── 404.html
│   └── .htaccess               Solo define la 404 en inglés para /en/
├── assets/
│   ├── css/
│   │   ├── base.css            Fuentes, variables :root (paleta, tipografía, espaciado), reset, tipografía
│   │   ├── layout.css          Contenedores, grid, header, menú, footer, cabeceras de página
│   │   ├── components.css      Botones, tarjetas, cifras, formulario, slider, cookies, WhatsApp, textos legales
│   │   ├── animations.css      Aparición al hacer scroll, entrada del hero, movimiento reducido
│   │   └── pages/              home.css, servicios.css, contacto.css, legal.css (legales + 404)
│   ├── js/
│   │   ├── main.js             Config (WhatsApp), menú móvil, header al hacer scroll, scroll suave, año
│   │   └── components/
│   │       ├── testimonios.js  Carga assets/data/testimonios.json y oculta la sección si está vacío
│   │       ├── formulario.js   Validación en cliente + envío por fetch
│   │       ├── cookies.js      Banner RGPD: aceptar / rechazar / configurar
│   │       └── animaciones.js  IntersectionObserver + contador
│   ├── data/testimonios.json   Empieza vacío: []
│   ├── img/
│   │   ├── logo/               logo.svg (placeholder), favicons
│   │   ├── hero/               Fondos y fotos de sección (WebP)
│   │   ├── servicios/          Una imagen por área (1200px + versión -sm de 640px)
│   │   └── og/og-image.jpg     Imagen para redes, 1200×630
│   └── fonts/                  Montserrat e Inter (woff2, autoalojadas)
├── php/enviar.php              Envío del formulario
├── .htaccess                   HTTPS, caché, compresión, cabeceras de seguridad, 404
├── sitemap.xml                 Con hreflang ES/EN
├── robots.txt
└── README.md
```

### Páginas ES ↔ EN

| ES | EN |
|---|---|
| `index.html` | `en/index.html` |
| `servicios.html` | `en/services.html` |
| `contacto.html` | `en/contact.html` |
| `aviso-legal.html` | `en/legal-notice.html` |
| `politica-privacidad.html` | `en/privacy-policy.html` |
| `politica-cookies.html` | `en/cookie-policy.html` |
| `404.html` | `en/404.html` |

Cada página tiene `lang` correcto, `canonical`, `hreflang` (es, en, x-default → ES) y el selector **ES | EN** del header enlaza a su equivalente.
**Si se cambia un texto en una página, hay que cambiarlo también en su versión en el otro idioma.** El header y el footer se repiten en cada HTML: un cambio de menú o footer debe aplicarse en los 14 archivos (buscar y reemplazar).

---

## 2. Datos pendientes [PENDIENTE]

Todo lo que falta está marcado con `[PENDIENTE]` en el código (buscar ese texto en todo el proyecto). En la web se ve con un recuadro discontinuo para que no se olvide.

| # | Qué falta | Dónde |
|---|---|---|
| 1 | **Logo vectorial (opcional)** | Ya está puesto el logo del cliente (PNG de 500 px). Si envía versión vectorial (SVG/AI/EPS/PDF), regenerar `logo.svg` y `logo-vertical.svg`. Ver apartado 4. |
| 2 | **Favicon** | Hecho a partir del logo del cliente. Solo regenerar si llega el logo vectorial. |
| 3 | **Email de contacto** | Footer (14 páginas), bloques de contacto de `index.html`, `contacto.html` y sus versiones EN, textos legales |
| 4 | **Teléfono** | Footer y bloques de contacto (ES y EN) |
| 5 | **WhatsApp** | Número: `assets/js/main.js` → `CONFIG.whatsappNumber` (solo dígitos con prefijo, ej. `13055550123`). Mientras esté vacío, el botón flotante lleva a la página de contacto. Mostrar también el número en footer y bloques de contacto. |
| 6 | **Dirección** | Footer, bloques de contacto y textos legales |
| 7 | **Razón social, CIF/NIF/EIN, domicilio y datos registrales** | `aviso-legal.html`, `politica-privacidad.html`, `en/legal-notice.html`, `en/privacy-policy.html`, nota informativa bajo los formularios |
| 8 | **Legislación y juzgados aplicables** | Aviso legal (ES/EN), apartado 8 |
| 9 | **Plazo de conservación de datos** (meses) y **transferencias internacionales** | Política de privacidad (ES/EN), apartados 5 y 7 |
| 10 | **Email destinatario del formulario** | `php/enviar.php` → `DESTINATARIO` |
| 11 | **Email remitente del formulario** (cuenta del propio dominio, ej. `web@dominio.com`) | `php/enviar.php` → `REMITENTE` |
| 12 | **Dominio definitivo** | Se ha usado `https://www.whitesharkconsulting.com` de forma provisional en: `canonical`, `hreflang`, `og:url`, `og:image`, `twitter:image` y JSON-LD de las 14 páginas, `sitemap.xml` y `robots.txt`. Si el dominio es otro, buscar y reemplazar en todo el proyecto. |
| 13 | **Redirección a www** | `.htaccess`: bloque comentado; activarlo cuando el dominio definitivo esté conectado |
| 14 | **Revisión legal** | Los textos legales son una plantilla de referencia: deben revisarlos un asesor antes de publicar (y eliminar la nota "Texto legal de referencia" de cada página legal). Si la empresa es una LLC estadounidense, valorar requisitos adicionales (p. ej. leyes estatales de privacidad). |

---

## 3. Testimonios

La sección **Testimonios** del inicio se rellena desde `assets/data/testimonios.json`.

- Con el archivo vacío (`[]`) la sección **no se muestra** y no deja hueco (atributo `hidden` que solo se quita por JS si hay datos).
- Cada testimonio indica su `idioma` (`"es"` o `"en"`): la web en español solo muestra los `"es"` y la inglesa los `"en"`. Si se omite `idioma`, aparece en ambas.
- Con más tarjetas de las que caben, aparecen flechas y un avance automático (se pausa al pasar el ratón o con el teclado, y se desactiva con "movimiento reducido").
- **Solo testimonios reales y con autorización del cliente.**

### Añadir un testimonio

1. Abre `assets/data/testimonios.json`.
2. Copia este bloque dentro de los corchetes y sustituye los valores:

```json
[
  {
    "nombre": "Nombre y apellidos",
    "cargo": "Cargo",
    "empresa": "Empresa",
    "texto": "Texto del testimonio tal y como lo ha escrito el cliente.",
    "foto": "assets/img/testimonios/nombre-apellido.webp",
    "idioma": "es"
  }
]
```

3. Para añadir otro, pon una coma después del `}` anterior y pega un bloque nuevo.
4. `foto` es opcional: bórrala (o déjala `""`) si no hay foto. Si la hay, crear la carpeta `assets/img/testimonios/` y subir la imagen en WebP, cuadrada, de unos 200×200 px. La ruta se escribe siempre desde la raíz (`assets/...`), también para la versión EN.
5. Comprueba que el JSON es válido (por ejemplo en jsonlint.com) antes de subirlo. Si el JSON tiene un error, la sección simplemente se queda oculta.

---

## 4. Logo e identidad visual

Logo del cliente (dorado, PNG transparente de 500×500) preparado en `assets/img/logo/`:

| Archivo | Uso |
|---|---|
| `logo.svg` (610×113) | **Header.** Versión horizontal compuesta con las piezas del logo original: tiburón a la izquierda y "WHITE SHARK / Consulting LLC" a la derecha (el original apilado se leería demasiado pequeño en una barra de 80 px). |
| `logo-vertical.svg` (336×254) | **Footer.** Logo original apilado, recortado. |
| `logo-vertical.png` | Logo para Google (JSON-LD), que prefiere imágenes raster. |
| `favicon.svg`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` | Tiburón dorado sobre fondo azul marino. |
| `../og/og-image.jpg` | Imagen para redes con el logo. |

- Los `.svg` llevan dentro la imagen WebP del logo (no son vectoriales). Si el cliente envía el logo en vector, sustituir estos dos archivos manteniendo el nombre y regenerar favicons.
- Tamaño mostrado: 196 px de ancho en móvil, 230 px en tablet y 260 px en escritorio (header); 200 px en el footer (`.site-logo` en `layout.css`).
- El dorado se ve bien tanto sobre el azul marino del hero y el footer como sobre el header blanco al hacer scroll, así que no lleva filtros.
- **Paleta** en `assets/css/base.css` (`:root`). Todos los colores salen de ahí. Si se quiere incorporar el dorado del logo como acento, añadir una variable (p. ej. `--color-gold`) y sustituir `--color-accent`.
- Nota de accesibilidad: el cian `#3FA9D6` no tiene contraste AA como texto sobre blanco, por eso los enlaces sobre fondo claro usan el azul océano y los botones cian llevan texto azul marino (6,2:1).

---

## 5. Formulario de contacto

- Validación en cliente (`formulario.js`) y en servidor (`php/enviar.php`).
- Antispam: campo honeypot oculto (`website`), trampa de tiempo (envíos en menos de 3 s se descartan) y límite de 5 envíos por hora y sesión.
- Envío por `fetch`, sin recargar; respuesta JSON con mensaje de éxito o error en el idioma de la página.
- Usa `mail()` de PHP. En Hostinger:
  1. Crear un buzón del dominio (ej. `web@dominio.com`) y ponerlo en `REMITENTE`.
  2. Poner el correo que recibirá los mensajes en `DESTINATARIO`.
  3. Comprobar que el dominio tiene SPF y DKIM activos (hPanel → Emails) para no caer en spam.
- Mientras `DESTINATARIO` o `REMITENTE` estén vacíos, el formulario responde con un aviso de "formulario no configurado".
- En local con un servidor estático (sin PHP) el formulario muestra el mensaje de error: es lo esperado.

---

## 6. Cookies (RGPD)

- Banner con **Aceptar todas**, **Rechazar** y **Configurar** (mismo peso visual para aceptar y rechazar).
- La elección se guarda 12 meses en `localStorage` (`wsc_cookie_consent`) y se puede cambiar desde "Configurar cookies" en el footer.
- Hoy la web **no usa cookies de análisis ni de marketing**, y las fuentes están autoalojadas (no hay conexión con Google Fonts).
- Para añadir analítica en el futuro: cargar el script dentro de `applyConsent()` en `assets/js/components/cookies.js` solo si `c.analytics === true`, añadir su dominio a la cabecera `Content-Security-Policy` de `.htaccess` y actualizar la tabla de la política de cookies (ES/EN).

---

## 7. Imágenes

Todas en **WebP**, recortadas al tamaño de uso y con `loading="lazy"` (salvo las cabeceras, que se cargan con prioridad). Fotos de **Unsplash** ([licencia Unsplash](https://unsplash.com/license): uso comercial gratuito, sin atribución obligatoria). Sin personas reconocibles en primer plano.

| Archivo | Uso | Origen (Unsplash) |
|---|---|---|
| `hero/hero-rascacielos.webp` (1920×1080) y `hero-rascacielos-movil.webp` (800×1200) | Hero del inicio | https://images.unsplash.com/photo-1486406146926-c627a92ad1ab |
| `og/og-image.jpg` (1200×630) | Imagen para redes (JPG por compatibilidad con LinkedIn/WhatsApp) | Misma foto que el hero, con texto superpuesto |
| `hero/oficina.webp` | Quiénes somos | https://images.unsplash.com/photo-1497215728101-856f4ea42174 |
| `hero/oceano.webp` | Frase destacada (filosofía) | https://images.unsplash.com/photo-1439405326854-014607f694d7 |
| `hero/skyline-servicios.webp` | Cabecera de servicios | https://images.unsplash.com/photo-1477959858617-67f85cf4f1df |
| `hero/oceano-aereo.webp` | Página de contacto | https://images.unsplash.com/photo-1505142468610-359e7d316be0 |
| `servicios/01-internacional.webp` | Asesoramiento internacional | https://images.unsplash.com/photo-1451187580459-43490279c0fa |
| `servicios/02-fiscalidad.webp` | Fiscalidad y optimización | https://images.unsplash.com/photo-1554224155-6726b3ff858f |
| `servicios/03-ventas.webp` | Estrategias de ventas | https://images.unsplash.com/photo-1460925895917-afdab827c52f |
| `servicios/04-herramientas-digitales.webp` | Herramientas digitales | https://images.unsplash.com/photo-1520607162513-77705c0f0d4a |
| `servicios/05-automatizacion.webp` | Sistematización y automatización | https://images.unsplash.com/photo-1518770660439-4636190af475 |
| `servicios/06-digitalizacion.webp` | Digitalización de negocios | https://images.unsplash.com/photo-1551288049-bebda4e38f71 |
| `servicios/07-desarrollo.webp` | Programación y desarrollo tecnológico | https://images.unsplash.com/photo-1484417894907-623942c8ee29 |
| `servicios/08-innovacion.webp` | Innovación y crecimiento empresarial | https://images.unsplash.com/photo-1504384308090-c894fdcc538d |

Para cambiar una imagen: mantener el mismo nombre, formato WebP y proporción (servicios 3:2 a 1200×800 + versión `-sm` de 640×427).

Fuentes: Montserrat e Inter (SIL Open Font License), descargadas de Google Fonts. Iconos lineales basados en [Lucide](https://lucide.dev) (licencia ISC), en SVG inline.

---

## 8. SEO, rendimiento y accesibilidad

- `title` y `meta description` únicos por página e idioma; un solo `H1` por página; `alt` en todas las imágenes.
- Open Graph y Twitter Card en todas las páginas; JSON-LD `ProfessionalService` en el inicio (ES y EN). Cuando haya dirección y teléfono, añadir `address` y `telephone` al JSON-LD de `index.html` y `en/index.html`.
- `sitemap.xml` con alternativas hreflang. Enviar a Google Search Console tras publicar.
- Rendimiento: sin librerías; fuentes woff2 autoalojadas con `font-display: swap` y precarga; imagen del hero precargada con versión móvil; resto en lazy; CSS/JS con caché larga, HTML sin caché.
- Accesibilidad: enlace "Saltar al contenido", foco visible, menú móvil con `aria-expanded` y cierre con Esc, `labels` y mensajes de error asociados en el formulario, contraste AA, `prefers-reduced-motion` respetado. Todo el contenido es visible sin JavaScript.
- Seguridad: `Content-Security-Policy` estricta (posible porque no hay CSS/JS inline), HSTS y demás cabeceras en `.htaccess`. Si se añade algún script o servicio externo, hay que permitir su dominio en la CSP.

> Al actualizar CSS o JS ya publicados, los navegadores pueden tener la versión anterior en caché (1 mes). Añadir `?v=2` al final de la ruta en las etiquetas `<link>` / `<script>` fuerza la recarga.

---

## 9. Publicar en Hostinger

1. Subir **todo el contenido** de esta carpeta a `public_html/` (incluidos `.htaccess` y `en/.htaccess`, que son archivos ocultos).
2. Activar el certificado SSL en hPanel.
3. Completar `php/enviar.php` (destinatario y remitente) y probar el formulario en ES y EN.
4. Revisar la lista de [PENDIENTE] (apartado 2).
5. Comprobar con Lighthouse (Chrome DevTools) y con https://validator.w3.org.

## 10. Probar en local

Las páginas funcionan abriendo los HTML, pero los testimonios necesitan un servidor (el navegador bloquea `fetch` en `file://`):

```bash
python -m http.server 8000
```

Y abrir http://localhost:8000. El formulario solo envía con PHP (en Hostinger o con `php -S localhost:8000`).
