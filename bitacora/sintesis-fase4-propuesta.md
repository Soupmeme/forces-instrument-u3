# Síntesis Fase 4 - dirección elegida

**Aprobada por Kiwi el 2026-08-21**, tras revisión y una corrección real (ver más abajo). Cruza `mapeo-temporal-lesalpx.md` con lo verificado en `registro-pruebas.md`. Esta es ahora la dirección de diseño (§11 del handoff) - Fase 5 (Convergencia) empieza a partir de aquí.

## Patrón dominante en la propia lectura de Kiwi

Casi todos los tramos de la Pasada B oscilan entre dos polos: "opresiva / metálica / paredes que se cierran" contra "se abre / fluye / étereo / abierta." No son cinco cualidades distintas pidiendo cinco fuerzas distintas - es una sola dualidad (constricción vs. apertura) repetida varias veces a lo largo de la pieza.

Esa dualidad es exactamente lo que ya hace el signo de la fuerza radial, ya verificado en `registro-pruebas.md`: atracción produjo un embudo denso y cerrado, repulsión produjo un vacío limpio expandiéndose. La fuerza radial sigue siendo la candidata más fuerte para ser la fuerza central.

**Corrección tras revisión (2026-08-21):** la primera versión de esta síntesis apoyaba casi todo el instrumento en radial, con viento como única excepción puntual. Kiwi señaló el riesgo correctamente: un mismo par atracción/repulsión repitiéndose 6-7 veces en 4.5 minutos puede leerse como repetición, no como rango, aunque cada momento esté bien fundamentado por separado. La fila de 02:10–03:00 se reasigna más abajo de radial a vórtice por esta razón - ver el porqué en la tabla.

## Traducción propuesta, tramo por tramo

| Tiempo | Lectura de Kiwi | Fuerza/estado candidato | Por qué |
|---|---|---|---|
| 00:00–06 | chord solitario, bajo leve | Radial casi apagado, reposo | Nada "opresivo" ni "abierto" todavía, es el punto neutro |
| 00:35–50 | "tensión aumenta... más metálico, opresivo" | Radial + (atracción), magnitud creciendo | Coincide con el embudo denso verificado en el LAB |
| 00:50–01:14 | "el build-up se disipa, la pieza se abre" | Cambio de signo, de atracción a repulsión | Literalmente lo observado al invertir el signo radial: de embudo a vacío |
| 01:15–55 | "fluye... como si fuese un río" | Viento, no radial | Un río no converge ni se aleja de un punto, avanza en una dirección - mecánicamente es viento, no radial |
| 02:10–03:00 | "étereo, muy abierta... sobria... **como estar bailando en una discoteca llena de humo con las luces apagadas**" | Vórtice + drag (antes: radial − suave + drag) | "Bailando" es una imagen circulante/giratoria, no de vacío expandiéndose - más cercana a lo que vórtice produce (visto en vivo: todo el bloque rota como conjunto) que a repulsión. Drag se mantiene para la quietud/"sobria" (**verificado**, `registro-pruebas.md`). Reasignado desde radial también porque es el tramo más largo sin cambio interno (50s) y el que más se sentiría repetido si fuera otro estado radial más |
| 04:24–42 | "las paredes se cierran... hasta silencio, el bajo el último en irse" | Radial + creciendo, luego apagar fuerzas una por una | Cierre progresivo, no un corte de golpe - coincide con "cada elemento se queda en silencio" |

## Vacíos honestos

- La primera versión de esta tabla no le dio a vórtice ningún tramo, porque ningún texto de Kiwi usaba literalmente "giro" o "rotación." Eso fue leer demasiado literal - "bailando en una discoteca" es una imagen de movimiento circulante aunque no use esa palabra. Vale la pena tenerlo en cuenta para el resto del análisis: buscar la cualidad detrás de la metáfora, no solo el vocabulario de §8 usado palabra por palabra.

## Sobre las cuatro extensiones propuestas en Fase 3

Ninguna parece necesaria para la lectura central. El único lugar donde una extensión ganaría su espacio es "acumulación hasta parar de manera abrupta" (02:00–02:07) y "onda que crece y decrece" (02:10–03:00) - describen una fuerza construyendo su propia tensión interna con el tiempo, algo que ninguna de las 4 fuerzas base hace (todas son funciones instantáneas de posición/velocidad actual, sin memoria). Eso es justo lo que la extensión D (memoria/histéresis) proponía.

Antes de tratar esto como "necesitamos una fuerza nueva," decidir explícitamente según §6 del handoff: ¿es una fuerza nueva con su propia ecuación, o es Kiwi conduciendo rítmicamente el control radial existente durante la interpretación? La segunda opción no requiere código nuevo y podría bastar.

## Recomendación

Tres fuerzas, cada una con trabajo real y distinto, no una fuerza central con una excepción: radial (signo + magnitud) para la dualidad constricción/apertura que domina la pieza, viento para el tramo direccional/fluido, vórtice + drag para el tramo etéreo/circulante. Las tres ya existen, las tres ya están verificadas en el LAB - sigue sin requerir código nuevo. Tratar la cualidad de "respiración" (acumulación hasta parar de golpe) como técnica de interpretación sobre el radial existente en vez de fuerza nueva, al menos como primera versión. Si se siente insuficiente en ensayo contra la música, memoria/histéresis es la única extensión de las cuatro que vale la pena reconsiderar, no las otras tres.
