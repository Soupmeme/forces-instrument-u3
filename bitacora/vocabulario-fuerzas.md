# Vocabulario de fuerzas — Fase 3

Catálogo de trabajo, no decisión final. Las fuerzas base están respaldadas por lo verificado en `registro-pruebas.md`. Las extensiones son propuestas (§12 del handoff: proponer, nunca decidir) — ninguna está implementada ni aprobada. El mapeo a "cualidad perceptual" usa el vocabulario de `mapeo-temporal-lesalpx.md` y §8 del handoff como referencia, pero es una hipótesis mía a confirmar o corregir por Kiwi, no un hecho.

## Fuerzas base (ya en el repo, ya verificadas en LAB)

| Fuerza | Mecánica | Cualidad observada (registro de pruebas) | Posible palabra del vocabulario | Control ya expuesto |
|---|---|---|---|---|
| Viento (constante) | Aceleración constante → velocidad crece con el tiempo (`createSimulation.js:54`) | Desplazamiento direccional acumulativo, todo el bloque se mueve igual | acumulación (de velocidad) / transición (si mueve el foco de un lugar a otro) | `wind.x/y` (brush) |
| Radial + (atracción) | Inverso al cuadrado hacia un punto (`createSimulation.js:56-64`) | Convergencia, embudo denso y brillante | acumulación (de densidad) / tensión (si no llega a resolver) | `radialStrength` + posición del atractor (brush) |
| Radial − (repulsión) | Mismo término, signo negativo | Vacío limpio expandiéndose en cascarón | dispersión / ruptura (si el cambio de signo es súbito, como ya hace Espacio) | signo de `radialStrength` (key, Espacio) |
| Vórtice (+ radial suave + drag en el preset) | Fuerza tangencial perpendicular a la dirección radial (`createSimulation.js:66-69`) | Rotación coherente de todo el bloque | organización / reorganización (si aparece después de dispersión) | `vortexStrength` |
| Drag | Fricción lineal opuesta a `v` (`createSimulation.js:72`) | **Verificado** (prueba aislada, ver `registro-pruebas.md`): la nube se congela tras un breve arrastre inicial, contraste claro contra inercia pura que sigue difundiéndose | estabilidad | `dragCoefficient` |

Prueba aislada de Drag ya corrida y documentada en `registro-pruebas.md` — confirma la amortiguación hacia el reposo. Esta fila ya no es hipótesis.

## Extensiones posibles (propuestas, no implementadas, no aprobadas)

Las cuatro categorías que el handoff sugiere evaluar (§7). Para cada una: idea, ecuación/dirección en términos generales, cualidad candidata, control candidato, y qué tan cara sería de implementar.

### A. Atractores múltiples / ponderados
- **Idea:** en vez de un solo atractor, N puntos cada uno con su propio peso, sumando sus contribuciones radiales.
- **Cualidad candidata:** organización (varios centros) seguida de reorganización si los pesos cambian con el tiempo.
- **Control candidato:** número de atractores activos, o peso relativo entre ellos.
- **Costo de implementación:** moderado — requiere un buffer o loop de atractores dentro del compute shader.

### B. Perturbación basada en ruido
- **Idea:** sumar un campo de fuerza de ruido (tipo Perlin/simplex) de baja frecuencia sobre la posición.
- **Cualidad candidata:** tensión o inestabilidad sutil sin romper la forma general — textura, no forma.
- **Control candidato:** amplitud del ruido, escala espacial/temporal.
- **Costo de implementación:** moderado — depende de si TSL expone una función de ruido utilizable directamente.

### C. Fuerzas partícula-partícula (flocking)
- **Idea:** cada partícula reacciona a sus vecinas (cohesión/separación/alineación), no solo al atractor global.
- **Cualidad candidata:** la más genuinamente "emergente" de las cuatro — patrones tipo bandada que nadie dibuja directamente.
- **Control candidato:** radios de cohesión/separación, peso relativo entre reglas.
- **Costo de implementación:** alto — con 131,072 partículas, comparar cada partícula contra sus vecinas es caro sin una estructura espacial. Riesgo real de rendimiento, no solo de complejidad de código.

### D. Fuerzas con memoria / histéresis
- **Idea:** el comportamiento de la fuerza depende de su propio estado pasado (ej. un atractor que decae con el tiempo, o un umbral con memoria).
- **Cualidad candidata:** acumulación seguida de resolución, con una inercia propia distinta a la de las partículas.
- **Control candidato:** tasa de decaimiento/recuperación.
- **Costo de implementación:** moderado — necesita un estado extra persistente (buffer o uniform con su propia dinámica), no solo una función pura de la posición actual.

## Siguiente paso

Esto es un catálogo para reaccionar, no una lista para aprobar en bloque. Con lo que ya escribiste en `mapeo-temporal-lesalpx.md` y `referentes.md` en mente:
- ¿alguna de las cualidades que propuse para las fuerzas base te suena mal / no coincide con lo que sentiste al escuchar la pieza?
- ¿alguna de las cuatro extensiones (A-D) te llama la atención como candidata real, o ninguna encaja con lo que quieres decir con el instrumento?

Nada de esto se implementa hasta que elijas una dirección (Fase 4/5, §11 del handoff).
