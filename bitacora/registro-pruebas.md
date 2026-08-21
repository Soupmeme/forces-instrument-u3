# Registro de pruebas — LAB scenarios base

Predicciones escritas por Kiwi antes de ejecutar cada prueba (2026-08-21), comparadas contra lo observado corriendo el proyecto en `npm run dev`, navegador real (Chrome vía Claude Browser). Screenshots tomados en vivo, no simulados.

## 1 · Inercia

**Predicción (Kiwi):** "It would move in a given direction maintaining that same initial velocity (no other force is acting to slow it down or accelerate it)."

**Observado:** Panel confirma las 4 fuerzas desactivadas (Radial/Vórtice/Drag/Viento sin marcar). A los 4s la nube se difumina hacia afuera desde el cubo inicial, sin desplazarse como bloque en una sola dirección.

**Comparación:** Correcto en lo esencial (sin fuerza, sin aceleración, el movimiento se conserva). Matiz para precisar en la ficha: no es "una dirección" compartida por todas las partículas — cada partícula conserva **su propia** velocidad inicial aleatoria (`initParticles`, `createSimulation.js:32-40`), por eso el resultado visual es una difusión/expansión de la nube, no una traslación en bloque. Vale la pena que reformules esa frase para la ficha de fuerzas.

## 2 · Fuerza constante +X (Viento)

**Predicción (Kiwi):** "The particles move in the positive X direction at the same rate of speed."

**Observado:** Bloque completo desplazado claramente hacia +X entre el frame inicial y los +4s; el color de las partículas se satura hacia el extremo cálido de la paleta (velocidad creciente) a medida que pasa el tiempo.

**Comparación:** La dirección es correcta. El matiz importante: no es "the same rate of speed" — la fuerza es constante, así que la **aceleración** es constante y la velocidad **crece** con el tiempo (`v += force * dt` cada frame, `createSimulation.js:76`), hasta el tope `maxSpeed`. Esto es justo la diferencia entre "constant force" y "constant velocity" que el LAB quiere que distingas explícitamente.

## 3 · Atracción

**Predicción (Kiwi):** "Towards the center of the attractor."

**Observado:** Convergencia clara hacia un punto brillante y denso (el atractor), con caída de densidad hacia afuera — patrón embudo/gravitacional típico de fuerza radial positiva con ley de inverso al cuadrado.

**Comparación:** Correcto, coincide con lo observado sin matices relevantes.

## 4 · Repulsión

**Predicción (Kiwi):** "They repel from the attractor."

**Observado:** Vacío creciente y limpio alrededor del atractor, con las partículas empujadas hacia un cascarón/anillo expandiéndose hacia afuera.

**Comparación:** Correcto, coincide con lo observado.

## 5 · Vórtice

**Predicción (Kiwi):** "They would deform sideways causing them to twist towards the attractor. Sideways and rotational motion?"

**Observado:** El bloque cuadrado inicial gira visiblemente como conjunto (el contorno cuadrado terminó rotado/inclinado respecto a su orientación inicial), distinto de los patrones puramente radiales de las pruebas 3 y 4.

**Comparación:** Correcto — identificaste bien que es un movimiento rotacional distinto de "atracción simple." Detalle para la ficha: este preset no es solo fuerza tangencial. `applyPreset('vortex')` (`main.js:106-112`) combina radial suave (`radialStrength: 1.0`) + vórtice (`vortexStrength: 3.0`) + drag (`dragCoefficient: 0.08`) simultáneamente — el drag es lo que evita que la rotación se desintegre y ayuda a que se vea como un giro coherente en vez de partículas dispersándose en espiral sin control.

## Prueba específica adicional: Drag aislado

Ninguna de las 5 pruebas base aísla Drag solo — siempre aparece combinado (preset Vórtice) o apagado. Se armó manualmente: preset Inercia (da velocidad inicial, todas las fuerzas apagadas) y luego se activó únicamente Drag (Radial/Vórtice/Viento permanecen apagados).

**Hipótesis a verificar (de `vocabulario-fuerzas.md`):** drag amortigua el movimiento hacia algo parecido a "estabilidad" — sin verificar hasta ahora porque nunca se probó aislado en el LAB base.

**Observado:** con solo Drag activo, la nube se expande brevemente (arrastre de la velocidad inicial) y luego se congela — entre las capturas en t≈5s y t≈11s no hay expansión adicional visible, la forma queda fija. Contraste directo con la prueba de Inercia pura (sin drag), donde la nube seguía difundiéndose de forma continua en la misma ventana de tiempo, sin señales de detenerse.

**Conclusión:** confirma la hipótesis. Drag no es solo fricción matemática abstracta, produce una amortiguación perceptible que lleva el sistema al reposo — coincide con "estabilidad" como cualidad perceptual, y respalda su uso propuesto para el tramo 02:10–03:00 ("sobria, muy sobria en dinámica musical") en `sintesis-fase4-propuesta.md`.

## Prueba específica de la fuerza central: Radial en magnitud extrema

Las 5 pruebas base y el registro anterior solo comparan signo de radial (escenarios 3 vs. 4, `radialStrength` = ±3.0). Esta prueba aísla radial en su magnitud máxima del slider (`radialStrength = 8.0`, más del doble del preset base) para verificar directamente la advertencia de `PRUEBAS_Y_DEPURACION.md`: *"Singularidad radial: las partículas explotan al acercarse al atractor. Revisa división por distancia y softening."*

**Predicción (antes de ejecutar):** convergencia rápida y ajustada gracias a `softening = 0.35` (limita el crecimiento de la fuerza a corta distancia) y `maxSpeed = 5.0` (limita la velocidad). Se esperaba algo de jitter/sobrepaso visible por la integración discreta a fuerza alta, no una explosión limpia.

**Observado:** convergencia casi instantánea (~1s) a un cúmulo más apretado que el radio del helper del atractor (0.12 unidades) — sin fuerza visible de dispersión, sin partículas escapando. Verificado con zoom de cámara progresivo (hasta llenar la mitad de la pantalla con la esfera del atractor) que no hay halo de partículas asomando detrás de la esfera. Sostenido así durante 24+ segundos sin degradarse, sin partículas dispersas en la vista amplia, consola sin errores.

**Comparación:** la predicción sobreestimó el jitter — el sistema es más estable de lo esperado incluso en el extremo del rango de `radialStrength`. Confirma que `softening` + `maxSpeed` juntos previenen la singularidad incluso al doble de la magnitud usada en el preset base. Sin drag activo (para no contaminar la prueba con otra fuerza), lo cual hace el resultado más contundente: ni siquiera sin amortiguación adicional el sistema se desestabiliza.

## Resumen

4 de 5 predicciones correctas en su idea central. Los dos matices a corregir antes de escribir la ficha de fuerzas final:
- Inercia: es difusión por velocidades individuales, no traslación compartida.
- Viento: la velocidad crece con el tiempo, no es constante desde el inicio.

Consola sin errores en ninguna de las 5 pruebas. Verificado en navegador real con WebGPU, no en un harness headless.
