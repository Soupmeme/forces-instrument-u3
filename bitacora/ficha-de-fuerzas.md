# Ficha de fuerzas — versión inicial (Fase 5)

Formaliza la dirección aprobada en `sintesis-fase4-propuesta.md`. Tres fuerzas, todas ya presentes en el repo base, todas ya verificadas en LAB — sin código nuevo hasta ahora.

## Radial — fuerza central

**Ecuación:** `F = normalize(atractor - p) * radialStrength / distancia²` (ley de inverso al cuadrado, `createSimulation.js:56-64`)

**Parámetros:** `radialStrength` (signo = atracción/repulsión, magnitud = intensidad), posición del atractor (ya es brush vía puntero)

**Predicción verificada:** signo positivo converge hacia el atractor (embudo denso); signo negativo se aleja (vacío expandiéndose). Confirmado en escenarios 3 y 4 del LAB base, comparación directa de signo hecha y registrada en `registro-pruebas.md`.

**Decisión de diseño:** representa la dualidad constricción/opresión ↔ apertura que domina la lectura de la pieza (Pasada B de `mapeo-temporal-lesalpx.md`). Es la fuerza que más tiempo está activa y la que el intérprete más manipula en vivo.

**Prueba de magnitud extrema (verificada, `registro-pruebas.md`):** `radialStrength = 8.0` (máximo del slider) converge de forma rápida y estable a un cúmulo apretado, sin explosión ni partículas escapando, sostenido 24+ segundos. `softening` + `maxSpeed` previenen la singularidad que advierte `PRUEBAS_Y_DEPURACION.md`, incluso más establemente de lo predicho (se esperaba jitter visible, no apareció). Esto satisface el requisito de rúbrica de una prueba específica de la fuerza central, más allá de las 5 base.

**Pendiente (menor):** no se ha probado el cambio de signo rápido y repetido (relevante para la técnica de "respiración" descrita más abajo) — esto es más una pregunta de viabilidad de interpretación en vivo que de estabilidad del sistema, se puede verificar directamente en ensayo con la música en vez de como prueba de laboratorio aislada.

## Viento — fuerza direccional

**Ecuación:** `F = wind * windEnabled` (fuerza constante, `createSimulation.js:54`)

**Parámetros:** `wind.x`, `wind.y` (dirección y magnitud)

**Predicción verificada:** fuerza constante → aceleración constante → velocidad crece con el tiempo, no es instantánea. Confirmado en escenario 2 del LAB base.

**Decisión de diseño:** representa el único tramo claramente direccional/fluido de la pieza (01:15–55, "fluye... como si fuese un río"). Uso puntual, no central.

## Vórtice + Drag — fuerza circulante

**Ecuación vórtice:** `F = (ejeZ × dirección_radial) * vortexStrength` (componente tangencial, `createSimulation.js:66-69`)
**Ecuación drag:** `F = -dragCoefficient * v` (fricción lineal, `createSimulation.js:72`)

**Parámetros:** `vortexStrength`, `dragCoefficient`

**Predicción verificada:** vórtice solo (combinado con radial suave en el preset base) produce rotación coherente de todo el bloque, visible como el contorno original girado/inclinado (escenario 5 del LAB base). Drag aislado produce amortiguación hacia el reposo — la nube deja de expandirse (prueba específica adicional, `registro-pruebas.md`).

**Decisión de diseño:** representa el tramo etéreo/circulante (02:10–03:00, "bailando en una discoteca llena de humo"), reasignado desde radial tras revisión conjunta — evita que el instrumento dependa de una sola fuerza repetida en distintos momentos. Drag da la quietud/"sobria" sin detener por completo el giro.

## Técnica de interpretación (no fuerza nueva)

**"Respiración" / acumulación hasta parar de golpe** (02:00–02:07, "el timbre... se acumula hasta parar de manera abrupta"): se aborda como técnica de interpretación sobre el radial existente — conducir la magnitud o el signo rítmicamente a mano — no como fuerza nueva con ecuación propia (decisión explícita según §6 del handoff). Si esto se siente insuficiente en la práctica, memoria/histéresis (extensión D de `vocabulario-fuerzas.md`) es la candidata a reconsiderar, pero no se implementa sin antes intentarlo como técnica.

## Siguiente paso

Esto es la ficha, no el ensayo. El paso real ahora es que Kiwi pruebe esta asignación en vivo — LAB o PERFORMANCE, con la pieza sonando, siguiendo la tabla tramo-por-tramo de `sintesis-fase4-propuesta.md` como guía — y vea si se siente correcto en la práctica, no solo en el papel. Lo que no funcione en el ensayo se corrige aquí después, no se asume que esta ficha es la versión final.
