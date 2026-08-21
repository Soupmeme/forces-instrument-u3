# Bitácora de IA

Registro de las decisiones de diseño reales tomadas junto con asistencia de IA a lo largo del proyecto: qué se propuso, qué se aceptó, qué se corrigió y por qué, qué se rechazó. No incluye trabajo de infraestructura rutinario (clonar, instalar, hacer commits) salvo cuando ese trabajo reveló un problema real que cambió una decisión. Borrador — las etiquetas Aceptado/Corregido/Rechazado reflejan mi lectura de lo ocurrido; Kiwi debe confirmarlas o ajustarlas, es su criterio el que cuenta para la rúbrica, no el mío.

## Fase 1-2 — Escucha y referentes: la IA no genera contenido interpretativo

**Petición:** ayuda para hacer el mapeo temporal sin instalar Audacity para un solo uso.

**Propuesta de la IA:** sustituir Audacity por un formato de texto plano con timestamps manuales, sin cambiar el contenido que Kiwi debía producir.

**Resultado:** Aceptado. La IA solo propuso formato/estructura (3 pasadas, vocabulario de referencia), nunca contenido de la escucha ni de los referentes. Cuando Kiwi pidió aclarar las cuatro preguntas de análisis de referentes (sistema/instrumento/interpreta/emerge), la IA las explicó usando el propio repo base como ejemplo neutral — deliberadamente evitando responder por los referentes reales (Hodgin, Lumicles, Scribble), que Kiwi analizó por su cuenta.

## Fase 3 — Vocabulario de fuerzas: hipótesis sin verificar, cuestionada antes de aceptarse

**Propuesta de la IA:** catálogo de las 4 fuerzas base con cualidad perceptual candidata, incluyendo Drag → "estabilidad/resolución" como hipótesis, más 4 extensiones posibles (atractores múltiples, ruido, flocking, memoria/histéresis).

**Reacción de Kiwi:** *"Let's test drag isolated before trusting that row."* No aceptó la hipótesis de Drag sin evidencia.

**Resultado:** Corregido mediante verificación, no mediante argumento. Se corrió una prueba aislada de Drag (Inercia + solo Drag activo) que confirmó la hipótesis — la fila pasó de "sin verificar" a "verificado" con evidencia real (`registro-pruebas.md`). Las 4 extensiones fueron implícitamente descartadas: ninguna se usó en la dirección final elegida.

## Fase 4 — Síntesis: corrección real de una propuesta ya aceptada

**Propuesta inicial de la IA:** radial (signo + magnitud) como fuerza casi única para toda la pieza, con viento como única excepción puntual.

**Reacción de Kiwi:** *"It seems we are depending too much on the radial force. It [is] not a bad effect visually, but I'm unsure that emergence emanating from the same force over different snapshots of time might be good enough."*

**Resultado:** Corregido. Esta es la corrección más significativa del proyecto — Kiwi identificó un riesgo real (monotonía de un instrumento de 4.5 minutos apoyado en una sola fuerza) que la propuesta original no resolvía bien, aunque cada mapeo individual estuviera bien fundamentado. La IA revisó la lectura y reasignó el tramo 02:10–03:00 de radial a vórtice+drag, apoyándose en una relectura de "bailando en una discoteca llena de humo" como imagen circulante — una imagen que la primera pasada había leído demasiado literal (buscando la palabra "giro" en vez de la cualidad detrás de la metáfora). Documentado con la corrección explícita en `sintesis-fase4-propuesta.md`.

## Fase 5 — Prueba específica de la fuerza central

**Petición:** verificar radial más allá de las 5 pruebas base, ya que la fila de Drag había mostrado el valor de no dar hipótesis por buenas sin probarlas.

**Propuesta de la IA:** prueba de magnitud extrema (`radialStrength = 8.0`, sin drag) para verificar la advertencia de singularidad radial de `PRUEBAS_Y_DEPURACION.md`.

**Resultado:** Aceptado, con hallazgo honesto incluido. La predicción de la IA (esperaba jitter visible) fue más pesimista que lo observado (el sistema fue más estable de lo predicho) — se registró la discrepancia entre predicción y observación en vez de ajustar la predicción retroactivamente para que coincidiera.

## Controles de interpretación: la IA implementa, Kiwi dirige el diseño

**Petición:** *"Moving the sliders around seems counter productive to me... maybe we can do a modification that allows me to activate each force at the press of a button."*

**Resultado:** Rechazo explícito del enfoque por defecto (sliders en vivo) y redirección hacia un diseño distinto, propuesto por Kiwi. La IA implementó el mapeo de teclas (`1`/`2`/`3` para toggles de fuerzas) según esa dirección, no al revés.

**Petición siguiente:** controles adicionales para `timeScale` y `dragCoefficient`, con la pregunta *"Would this work with a keyboard with numpad?"*

**Resultado:** Aceptado sin corrección. La IA propuso el mapeo numpad (`event.code` distinto de `Digit1-9`, sin colisión) y Kiwi lo aprobó directamente.

**Petición siguiente:** agregar control de magnitud para `radialStrength` también.

**Resultado:** Aceptado. Mismo patrón (`Numpad8`/`Numpad2`), verificado con clamps antes de entregarse.

Nota de la IA aceptada sin objeción: activar Drag de forma independiente de Vórtice (`Numpad0`) reabre una decisión de diseño ya cerrada ("siempre combinados" en la ficha) — se marcó explícitamente como tal y Kiwi continuó de todas formas, lo cual cuenta como aceptación consciente del cambio, no como omisión.

## Prueba de integración en vivo: la IA se autocorrige antes de llegar a Kiwi

**Petición:** *"Give it a try yourself... Interact with it live."*

**Resultado:** la IA encontró y corrigió un bug real por su cuenta (el toggle de Viento no producía ninguna fuerza porque `wind.x` partía en 0) antes de reportarlo, y documentó 4 discrepancias más entre lo verificado en LAB aislado y el comportamiento real en una sesión continua sin resets — incluyendo que la tecla `3` no reproduce exactamente la combinación de fuerzas que se había verificado como "vórtice" en el LAB base. Ninguno de estos hallazgos fue una corrección de Kiwi hacia la IA; fue la IA verificando su propio trabajo antes de entregarlo, y reportando honestamente lo que no encajaba en vez de ocultarlo.

## Patrón general observable en esta bitácora

La IA propuso activamente (síntesis, catálogo de fuerzas, mapeo de teclas) pero nunca decidió la dirección final por su cuenta — cada decisión de diseño (elegir la dirección de Fase 4, decidir el conjunto de teclas, aceptar la reapertura del acople Vórtice/Drag) requirió una confirmación explícita de Kiwi. Los descartes más claros: las 4 extensiones de fuerza de Fase 3, y el enfoque de sliders en vivo para interpretación. Las correcciones más claras: la sobre-dependencia de radial en la síntesis inicial, y la hipótesis de Drag sin verificar.
