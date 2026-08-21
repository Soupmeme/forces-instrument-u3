# Mapa del sistema — forces-instrument-u3

Borrador de trabajo (Actividad 02). Esto es un mapa de referencia con ubicaciones exactas en el código; el criterio de la rúbrica ("trazabilidad y comprensión") se cumple cuando Kiwi puede explicar cada fila con sus propias palabras en vivo, no por tener este archivo. Úsalo para verificar tu propio entendimiento, no para memorizar texto.

## Estado

| Qué | Dónde |
|---|---|
| Buffer de posición | `src/simulation/createSimulation.js:22` — `const positionBuffer = instancedArray(count, 'vec3')` |
| Buffer de velocidad | `src/simulation/createSimulation.js:23` — `const velocityBuffer = instancedArray(count, 'vec3')` |
| Cantidad de partículas | `src/main.js:25` — `PARTICLE_COUNT = 131072` (constante fija, no depende del hardware) |
| Inicialización | `src/simulation/createSimulation.js:27-41` — compute pass `initParticles`: posición aleatoria dentro de un cubo de lado `boundsSize * 0.45`, velocidad aleatoria escalada por `initialSpeed` |

**Pregunta:** ¿qué datos representan el estado y dónde viven? — Posición y velocidad de cada partícula, en dos buffers de almacenamiento GPU (`instancedArray`), no en arrays de JavaScript. `count` partículas se procesan en paralelo.

## Fuerzas

Todas en el compute `updateParticles`, `src/simulation/createSimulation.js:46-88`. Se acumulan en una variable `force` (línea 51) antes de integrar.

| Fuerza | Líneas | Ecuación / dirección |
|---|---|---|
| Viento / constante | `createSimulation.js:54` | `force += wind * windEnabled` — vector fijo, mismo para todas las partículas |
| Radial (atracción/repulsión) | `createSimulation.js:56-64` | `dir = normalize(atractor - p)`; `F = dir * radialStrength / distancia² * radialEnabled` — ley de inverso al cuadrado; el signo de `radialStrength` decide atracción (+) o repulsión (−) |
| Vórtice | `createSimulation.js:66-69` | `tangente = ejeZ × dir_radial`; `F += tangente * vortexStrength * vortexEnabled` — perpendicular a la dirección radial, produce giro |
| Drag (fricción lineal) | `createSimulation.js:72` | `F += -dragCoefficient * v * dragEnabled` — opuesta a la velocidad actual |

Uniforms/parámetros de estas fuerzas: `src/simulation/parameters.js:6-29` (`wind`, `windEnabled`, `attractor`, `radialStrength`, `radialEnabled`, `softening`, `vortexStrength`, `vortexEnabled`, `dragCoefficient`, `dragEnabled`).

**Pregunta:** ¿qué fuerzas se suman y qué ecuación representa cada una? — Ver tabla. Las cuatro son aditivas sobre el mismo vector `force` antes de integrar.

## Integración

`src/simulation/createSimulation.js:74-87`. Euler semiimplícito, masa unitaria (`a = F`):

1. `dt = params.dt * params.timeScale` (línea 50)
2. `v += force * dt` (línea 76) — se actualiza velocidad primero
3. Límite de velocidad: si `|v| > maxSpeed`, se reescala (líneas 78-81)
4. `p += v * dt` (línea 83) — posición se actualiza con la v ya actualizada (por eso "semiimplícito")
5. Condición de frontera periódica: si una partícula sale de `boundsSize`, reaparece del otro lado (líneas 86-87, vía `mod`)

**Pregunta:** ¿cómo pasa una fuerza a aceleración, velocidad y posición? — Fuerza = aceleración (masa 1). Se integra a velocidad con `dt`, luego la posición se integra con esa velocidad ya actualizada.

## Render

`src/simulation/createSimulation.js:92-115`.

- `SpriteNodeMaterial` (92-96), blending aditivo, sin escritura de profundidad.
- `positionNode = positionBuffer.toAttribute()` (línea 98) — el render **lee directamente el buffer GPU**, no vuelve a calcular física ni copia datos a CPU.
- `colorNode` (101-107): color interpolado azul→naranja según `|v| / maxSpeed`.
- `opacityNode` (línea 110): máscara circular vía `step()`, para que el sprite cuadrado se vea como partícula redonda.
- `InstancedMesh` con `count` instancias (112-114).

**Pregunta:** ¿cómo se dibuja el estado sin volver a simularlo? — El material lee el buffer de posición ya calculado por el compute pass anterior; el render no contiene lógica de fuerzas.

## Controles

| Control | Tipo | Dónde | Qué toca |
|---|---|---|---|
| Puntero (arrastrar) | Brush (continuo) | `src/main.js:66-79` — raycaster contra plano Z=0 | `params.attractor.value` (posición del atractor, no de partículas) |
| `P` | Key (discreto) | `src/main.js:149` | alterna `mode` LAB/PERFORMANCE vía `setMode` (`main.js:118-129`) |
| `R` | Key | `src/main.js:150` | `simulation.reset()` → relanza `initParticles` |
| `1`–`5` | Key | `src/main.js:151-155` | `applyPreset(id)` (`main.js:87-116`) — fija combinaciones de uniforms para cada escenario LAB |
| `Espacio` (mantener) | Key | `src/main.js:157-173` | invierte temporalmente el signo de `radialStrength`; `keyup` restaura el valor guardado |
| Panel LAB (sliders/checkboxes) | — | `src/ui/labPanel.js:90-107` | escribe directamente sobre `params.*.value` (uniforms) |

**Pregunta:** ¿qué parámetro puede tocar el intérprete y por qué esos? — Todo control, sin excepción, escribe sobre un uniform (`params.*`), nunca sobre `positionBuffer`/`velocityBuffer` directamente. Esto es lo que mantiene la regla "no controlar posiciones directamente" (§10 del handoff) verificable en el código, no solo como intención de diseño.
