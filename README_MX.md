# Calculando México (bootstrap)

Esta rama agrega la estructura inicial para habilitar páginas y calculadoras en México sin afectar la versión chilena.

## Dónde ajustar IVA MX real (16%)
- Archivo base de la página: `mx/iva/index.html`.
- Configuración de SEO y ruteo: `src/countries/mx/config.js` (clave `iva`).
- Lógica de demo: bloque `<script>` dentro de `mx/iva/index.html`. Reemplaza `renderDemo()` con el cálculo real al 16% y, si es necesario, guarda constantes en un archivo JS dedicado.

## Dónde agregar nuevas calculadoras MX
- **Sueldo neto MX**: crea la página en `mx/sueldo/` (o ruta equivalente) y registra su SEO en `src/countries/mx/config.js`. Reutiliza estilos de `/css/calculando.css`.
- **ISR**: crea una sección o página en `mx/isr/` con su SEO en `src/countries/mx/config.js`.
- **Finiquito MX**: prepara la ruta `mx/finiquito/` y agrega la entrada correspondiente en la configuración MX.
- **Resolver de país**: cualquier página nueva debe importar `bootstrapPage` desde `/js/country-bootstrap.js` para cargar el SEO correcto según la ruta.

## Checklist de QA manual
- `/` sigue mostrando la versión Chile sin cambios funcionales.
- Navegación hacia México disponible (link “Versión México” en cabeceras).
- `/mx/` carga con estilos y navegación base.
- `/mx/iva/` carga la plantilla, permite escribir montos y muestra el cálculo demo.
- Verifica que el título/description cambien según el país: CL mantiene sus textos, MX muestra los placeholders en construcción.
