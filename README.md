# U3 · Forces Instrument

[App desplegada](https://juanferfranco.github.io/forces-instrument-u3/)


Proyecto base que servirá como caso de estudio. Nos permitirá abordar los conceptos 
necesarios para comprender el código generado por la IA al momente 
de materializar las ideas.


## Requisitos

- Node.js 22 recomendado (Vite 8 requiere Node 20.19+ o 22.12+).
- Navegador con WebGPU habilitado; usa una versión actual de Chrome, Edge o un navegador con soporte equivalente.
- Git necesario para clonar el repositorio y trabajar localmente.

## Clonar y poner en funcionamiento

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/juanferfranco/forces-instrument-u3.git
cd forces-instrument-u3
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre en el navegador la URL local que muestra Vite. Se necesita un navegador con WebGPU habilitado.

## Ejecutar

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite.

## Build de producción

```bash
npm run build
npm run preview
```

`preview` sirve el contenido construido en `dist/`; úsalo antes de publicar.

## Controles

- `P`: LAB / PERFORMANCE.
- `R`: reset.
- `1..5`: escenarios de exploración.
- puntero: mueve el atractor sobre el plano Z=0.
- espacio (PERFORMANCE): invierte temporalmente el signo de la fuerza radial.

## Publicar en GitHub Pages

El repositorio ya incluye `.github/workflows/deploy.yml`.

1. Crea un repositorio en GitHub y sube estos archivos a la rama `main`.
2. En **Settings → Pages**, selecciona **GitHub Actions** como fuente.
3. Haz push a `main`.
4. El workflow ejecutará `npm install`, build y despliegue.

`vite.config.js` usa `base: './'` para que los assets sean relativos y el mismo build funcione bajo una ruta de proyecto de GitHub Pages.

## Archivos que debes entender primero

1. `src/main.js`: escena, cámara, renderer, loop, interacción y modos.
2. `src/simulation/parameters.js`: parámetros/uniforms accesibles desde CPU.
3. `src/simulation/createSimulation.js`: estado GPU, fuerzas, integración y render.
4. `src/ui/labPanel.js`: controles del laboratorio y escenarios de exploración.

Lee la `GUIA_ESTUDIANTE.md` para comprender la estructura del proyecto y 
cómo se relacionan los archivos.

## Documentación complementaria

- [Guía del estudiante](GUIA_ESTUDIANTE.md)
- [Validación y depuración](PRUEBAS_Y_DEPURACION.md)
- [Bitácora del proyecto](bitacora/) (mapa del sistema, registro de pruebas, mapeo temporal, referentes, vocabulario de fuerzas, síntesis, ficha de fuerzas, controles, bitácora de IA)

## Autoevaluación ponderada


| Criterio | Peso | Qué exige la evidencia | Evidencia (enlaces) | Autoevaluación |
|---|---|---|---|---|
| Trazabilidad y comprensión del sistema | 25 | Explicar estado, fuerzas, integración, render, controles; ubicar qué produjo/modificó la IA | [Mapa del sistema](bitacora/mapa-sistema.md), [Ficha de fuerzas](bitacora/ficha-de-fuerzas.md) | 70 |
| Verificación del algoritmo de fuerzas | 25 | Aislar una fuerza central, predecir, ejecutar, comparar, cambiar signo/parámetro deliberadamente y explicar la diferencia | [Registro de pruebas](bitacora/registro-pruebas.md) (5 escenarios base + drag aislado + radial en magnitud extrema + integración en vivo) | 100 |
| Diseño de fuerzas e intención | 20 | El comportamiento hace perceptible una intención; emerge, no está dibujado | [Síntesis Fase 4](bitacora/sintesis-fase4-propuesta.md), [Vocabulario de fuerzas](bitacora/vocabulario-fuerzas.md), [Ficha de fuerzas](bitacora/ficha-de-fuerzas.md) | 100 |
| Instrumento, score e interpretación | 15 | El score conecta escucha con decisiones; pocos controles expresivos; se conduce en vivo sin control automático por audio | [App desplegada](https://soupmeme.github.io/forces-instrument-u3/) (LAB y PERFORMANCE), [Controles y tabla de ensayo](bitacora/controles.txt), [Mapeo temporal](bitacora/mapeo-temporal-lesalpx.md) | 100 |
| Experimentación y criterio frente a IA | 10 | Comparó alternativas, registró descartes, corrigió propuestas de IA | [Bitácora de IA](bitacora/bitacora-ia.md) | 100 |
| Entrega técnica y documentación | 5 | URL abre; bitácora permite verificar el proceso | [App desplegada](https://soupmeme.github.io/forces-instrument-u3/), [Bitácora completa](bitacora/) | 100 |
