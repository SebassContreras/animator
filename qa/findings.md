# QA End-to-End Report — `animator` × `lienzo`

- **Fecha:** 2026-11-02
- **Repo `lienzo`:** commit `7b7b45c` (`build 7b7b45c`, verificado en `instructions` del MCP y CLI `dist/cli.js`)
- **Repo `animator`:** commit `32085f6`
- **Entorno:** Node `v24.11.1` · pnpm `10.18.3` · Windows 11 (`pwsh`)
- **Marca de prueba:** `videos/qa-test/` (`Aether Solar`, proyecto `qa-test` en Lienzo)
- **Batería ejecutada:** `V1 minimal`, `V2 product`, `V3 claims`, `V4 dense`, `V5 errors`, `V6 formats`, `V7 repeat`

## Resumen de hallazgos abiertos

| Severidad | `lienzo` (bug) | `lienzo` (fricción) | `lienzo` (duda diseño) | `animator` (bug) | `animator` (fricción) | `animator` (duda diseño) | Total abiertos |
|---|---:|---:|---:|---:|---:|---:|---:|
| **P0** | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| **P1** | 5 | 1 | 0 | 2 | 1 | 0 | **9** |
| **P2** | 3 | 3 | 1 | 1 | 6 | 2 | **16** |
| **Total** | **8** | **4** | **1** | **3** | **7** | **2** | **25** |

### Índice rápido de hallazgos

| ID | Sev | Tipo | Repo | Área | Origen / Spec previa | Spec destino | Resumen |
|---|---|---|---|---|---|---|---|
| `F-01` | P1 | bug | `animator` | `videos/_template` / `skill lienzo-storyboard` | **Regresión de `014/D2` y `014/T003`** (rompe `011/R1`, `011/R5`): `014/D2` exigía leer `../brand.lock.json` primero, pero `_template/scene.gen.cjs:10` se escribió al revés | Animator `016/R1`, `017/R1` | `cpSync('videos/_template', ...)` copia `_template/brand.lock.json` (`sample-brand`), que sombrea `../brand.lock.json` de la marca |
| `F-02` | P1 | bug | `animator` | `lib/objects.cjs` (`metricCard`) | **Introducido en `015/R3`, `015/D3` (`015/T003`)**: `metricCard` pasa `extra` sin filtrar a `group(...)` (descubierto por el notice de `Lienzo 080/R6`) | Animator `016/R3` | `metricCard` filtra claves propias (`bgColor`, `titleFont`, `titleColor`) al `group` padre generando `notices` de campos desconocidos |
| `F-03` | P1 | bug | `lienzo` | `tool scene_build` / `tool element_add` | **Brecha de `072`, `074` y `075/R1` (Clase 1)**: `rebindShot` (`075/D1`) sí recorre hijos de `group`, pero `expand.ts` y `element-add.ts` leen solo `child.shot` | Lienzo `092/R1` | Un `counter` hijo dentro de un `group` ligado a una toma (`shot: "s2"`) recibe su pista `progress` en `0..1.5s` en vez de desde `shot.start` |
| `F-04` | P1 | bug | `lienzo` | `tool element_update` | **Brecha de `051` y `082/R7` (Clase 1)**: `scene_build` y `element_add` usan `parent.cw × parent.ch`, pero `element_update` usa `s.width × s.height` | Lienzo `092/R2` | `element_update` con `at` sobre un hijo de grupo (`id: "g/child"`) posiciona respecto al lienzo raíz (`width×height`) en vez de la caja del grupo (`cw×ch`) |
| `F-05` | P1 | bug | `lienzo` | `tool scene_validate` / `tool scene_build` | **Incumplimiento parcial de `080/R5`, `083/R1-R3` y `090/R1` (Clase 1)**: `080/D5` relajó solo `elements` en `CompactSceneInputSchema`, dejando la cabecera estricta en `tool.input` | Lienzo `093/R1` | `scene_validate` y `scene_build` con `compact` inline fallan en `tool.input` (`invalid_input`, sin `valid: false`, sin `errors[]`, ocultando fallos de elementos), discrepando de `compactFile` y `data` |
| `F-06` | P1 | bug | `lienzo` | `tool element_add` / `tool scene_validate` / `tool scene_inspect_layout` | **Regresión de `080/D2` y `082/T024` (Clase 1)**: al ampliar `placedElements(scene)` para recorrer `symbols.*.children` (`93e66d2`), `danglingReferences` los incluyó como destinos válidos de `line` | Lienzo `093/R2` | `danglingReferences` acepta como destino de `line` los IDs internos de `symbols.*.children`, que luego fallan en `scene_inspect_layout` con `dangling_attachment` |
| `F-07` | P1 | bug | `lienzo` | `tool scene_generate_speech` | **Bug previo abierto (`qa-log.md:86`, `cf33234`, `029`/`060`, Clase 3)**: documentado en `roadmap.md:70` sin spec asignada hasta hoy | Lienzo `095/R1` | `scene_generate_speech` con `provider: "custom"` y sin `baseUrl` intenta `http://localhost:8880/v1/audio/speech` y reporta caída del servicio local en vez de pedir `baseUrl` |
| `F-08` | P1 | fricción | `lienzo` | `tool scene_inspect_layout` | **Brecha de `071/D4` y `080/R14` (Clase 4)**: `080/R14` trató `particles` como transparente en `contrast.ts`, pero `NOT_SHAPES` (`layout.ts:404`) no lo excluyó | Lienzo `094/R1` | `scene_inspect_layout` trata `particles` a pantalla completa como forma sólida en `shapesStack`, disparando falso positivo `shape_overlap` contra el fondo `s1-bg` |
| `F-09` | P1 | fricción | `animator` | `skill lienzo-animate` | **Nuevo (hueco documental + fricción de `011/D5`)**: ningún vídeo previo usó `chart`/`steps`/`badge`; `brandFonts` (`011/D5`) devuelve `{family,weight}` | Animator `017/R2` | Ni `lib/` ni `skills/lienzo-animate` documentan los nombres de campos compactos de `chart` (`type`, `data`), `steps` (`layout`, `labels`) o `badge` (`color` = texto, `fill.color` = fondo) |
| `F-10` | P2 | bug | `lienzo` | `component chart` (`pie`/`donut`) | **Bug nuevo en componente (`src/components/chart/draw.ts:143-166`, Clase 2)**: no auditado en rondas previas con sectores estrechos y `showValues: true` | Lienzo `094/R3` | En `chart` tipo `pie`/`donut`, `drawChart` dibuja arcos y textos en el mismo bucle: los sectores siguientes pintan encima del texto de sectores estrechos previos, y `showValues: true` oculta el valor si hay etiqueta |
| `F-11` | P2 | bug | `lienzo` | `tool element_add` (`atPatch` / `idPath`) | **Brecha de `078/R7`, `080/D6-D7` y `084/R2` (`4c90989`, Clase 2)**: `084` añadió el chequeo de `id` en `element_add`, pero `atPatch`/`idPath` no mapearon `""`, `"a/b"` ni duplicados a `patch.id` | Lienzo `093/R3` | `element_add` devuelve rutas rotas o internas (`elements..id`, `elements.a/b.id`, `elements.10.id`) en lugar de `patch.id` cuando `patch.id` es `""`, `"a/b"` o duplicado |
| `F-12` | P2 | bug | `lienzo` | `tool scene_validate` / `tool scene_build` | **Solapamiento entre `075/D3` (`rawRuleProblems`) y `expandScene` (`expand.ts:445`, Clase 1)**: `075/D3` añadió `checkUniqueIds` sin retirar `seenIds` de `expand.ts` | Lienzo `093/R4` | Un ID duplicado en `compact.elements` genera dos errores repetidos con distinto texto cuando hay otro fallo de esquema, y devuelve `code: "invalid_compact_scene"` en vez de `"duplicate_id"` |
| `F-13` | P2 | bug | `animator` | `videos/_template/scene.gen.cjs` | **Incumplimiento de `011/R5`, `011/R9` y `011/T012`**: `_template/brand.lock.json` tiene `duration: 6`, pero `_template/scene.gen.cjs:6` dejó `D = 4` fijo | Animator `016/R2` | `_template/scene.gen.cjs` fija `D = 4` en vez de `lock.canvas.duration`, contradiciendo `DESIGN.md` |
| `F-14` | P2 | fricción | `lienzo` | `tool scene_inspect_layout` | **Efecto colateral de `071/D4` (`shapesStack` / `contains`, Clase 4)**: `contains(s2-bg, el)` falla si `el` sale 1 px del canvas, disparando `shape_overlap` además de `out_of_bounds` | Lienzo `094/R2` | Cualquier elemento que sobresalga del lienzo (`out_of_bounds`) manteniendo >50% de su área dentro dispara además un falso `shape_overlap` contra `s2-bg` |
| `F-15` | P2 | fricción | `lienzo` | `tool background_set` | **Brecha de `076` (`input-hints`) y `077`/`079` (`descriptions`, Clase 3)**: el parámetro pasó a `patch`, pero el mensaje conservó `"valores"` en `path: ["preset"]` | Lienzo `093/R5` | Cuando falta `preset` y `patch`, `background_set` dice `"Indica un preset o valores"` y sugiere `¿van dentro de «preset»?` aunque `preset` es un string y el parámetro se llama `patch` |
| `F-16` | P2 | fricción | `lienzo` | `tool scene_generate_speech` | **Brecha de `029`/`060`/`086/D3` (`scene-generate-speech.ts:115,142`, Clase 2)**: `audio-duration.ts` soporta `"wav"`, pero el tool pasa `"mp3"` fijo | Lienzo `095/R2` | `scene_generate_speech` fuerza extensión `.mp3` y cálculo MP3 (`audioDuration(buf, "mp3")`); si un endpoint local/custom devuelve WAV, guarda `.mp3` con bytes WAV y estima mal la duración (`bytes / 16000`) |
| `F-17` | P2 | duda de diseño | `lienzo` | `shot-timing` / `anim` | **Premisa incompleta en `075/R1` y `075/D1` (`shot-timing.ts:1-6`, Clase 4)**: `075` asumió que `anim` ya era relativo a la toma, pero `anim.in/out.delay` usa tiempo global | Lienzo `094/R4` | En elementos ligados a una toma (`shot: "s2"`), `tracks` se desplazan con `shot.start` al cambiar/mover la toma, pero `anim.in.delay` y `anim.out.delay` quedan en segundos globales de escena sin aviso si caen fuera de la toma |
| `F-18` | P2 | fricción | `animator` | `lib/brand.cjs` y `lib/scene.cjs` | **Limitación de diseño en `011/R4` y `011/D5`**: `011/D1` validó `mono`/`accent`, pero `011/D5` devolvió solo `{ heading, body }` | Animator `016/R4` | `brandFonts(lock)` ignora los roles `"mono"` y `"accent"` del `brand.lock.json`, y `label()` solo acepta `extra.font === "body"` o `"heading"` |
| `F-19` | P2 | fricción | `animator` | `lib/environment.cjs` | **Brecha de evolución entre `002`, `010/D3` (tomas nativas) y `013/R3` (`blob`)**: `blob` recibió `extra`, pero `sea` y `particles` quedaron con su firma pre-`010` | Animator `016/R5` | `particles()` y `sea()` no aceptan parámetro `extra`, obligando a `{ ...particles(...), shot: "s1" }` (causó elementos sin `shot` en vídeos previos) |
| `F-20` | P2 | fricción | `animator` | `lib/scene.cjs` | **Brecha de `010/D3` frente a `DESIGN.md:97`**: `label()` copió el `anim.out` fijo de `text()` y `nativeShot()` omitió `transition` | Animator `016/R6` | `label()` añade siempre `anim.out` (desvaneciendo el cierre salvo `delete el.anim.out`) y `nativeShot()` no acepta `transition` |
| `F-21` | P2 | fricción | `animator` | `skill lienzo-animate` (`compact-format.md`) | **Deriva documental (`stale doc`) tras Lienzo `075/R4`, `080/R5` y `083/R1`** | Animator `017/R3` | `compact-format.md` documenta parámetros obsoletos en la tabla de herramientas (`background_set` con `values`, `scene_rename` con `name`, `scene_validate` "first failing path") |
| `F-22` | P2 | fricción | `animator` | `skill lienzo-animate` (`SKILL.md`, `drawing.md`, `gotchas.md`) | **Limpieza incompleta tras cerrar `Lienzo 080/R6`, `Lienzo 088` y `Lienzo 090`** (notas temporales dejadas por `Animator 013/R6` y `013/R8`) | Animator `017/R4` | Afirmaciones obsoletas en `lienzo-animate`: dice que campos desconocidos se ignoran sin `notice`, que no existe `compactFile` en MCP, que no existe `@scaleX`/`@scaleY`, que `particles` no caen y que la cámara nativa evita `out_of_bounds` |
| `F-23` | P2 | fricción | `animator` | `tests/videos/learnings.test.cjs` / `skill lienzo-animate` | **Fricción derivada de `004/R1`, `013/R1` y `013/R11`**: `013/R1` dejó `_template/learnings.md` sin viñetas, pero `SKILL.md:21` no avisó que `- None.` es inválido | Animator `017/R5` | Escribir `- None.` bajo `## Engine` en `learnings.md` rompe `pnpm test` (`learnings.test.cjs` exige sufijo `— tracks:` en toda viñeta bajo `## Engine`) |
| `F-24` | P2 | duda de diseño | `animator` | `skill lienzo-storyboard` / `lib/brand.cjs` | **Brecha entre `011/D1`, `Lienzo 086/R2` (`inspect.notices`) y `014/R2` (`brand.md`)** | Animator `016/R7`, `017/R1` | Duplicidad entre `videos/<brand>/brand.md` y `brand.lock.json` (`guide` ya viaja dentro de `brand.lock.json`, mientras que `brandLock()` descarta `notices` de fuentes no instaladas de `project_inspect`) |
| `F-25` | P2 | duda de diseño | `animator` | `DESIGN.md` / `AGENTS.md` | **Conflicto de convención (`2026-10-31`) frente a `011/R6` (la guía de marca define tono/idioma)** | Animator `017/R6` | Regla dura `"All on-screen text is English"` en `DESIGN.md` y `AGENTS.md` choca con briefs multilingües (`ES` + `EN`) |

---

## 1. Bugs (comportamiento defectuoso)

### F-01 · P1 · vivo · bug
repo: animator
área: videos/_template | skill lienzo-storyboard
caso: V1-minimal/brand-lock-shadowing
setup: Crear `videos/qa-test/brand.lock.json` (`project: "qa-test"`, `background: "#0F172A"`) y ejecutar el paso 0a de `skills/lienzo-storyboard/SKILL.md`: `node -e "fs.cpSync('videos/_template', 'videos/qa-test/minimal', { recursive: true })"`.
call: `node videos/qa-test/minimal/scene.gen.cjs`
esperado: El nuevo vídeo `videos/qa-test/minimal/scene.gen.cjs` debe heredar `videos/qa-test/brand.lock.json` (`project: "qa-test"`, paleta `#0F172A` / `#38BDF8` y fuentes `Space Grotesk` / `Inter`).
obtenido: `fs.cpSync` copia `videos/_template/brand.lock.json` (`project: "sample-brand"`, `background: "#1B1F4B"`) dentro de `videos/qa-test/minimal/brand.lock.json`. Como `videos/_template/scene.gen.cjs:9` comprueba `fs.existsSync(path.join(__dirname, "brand.lock.json"))` ANTES que `../brand.lock.json`, el generador ignora silenciosamente la marca `qa-test` y genera el vídeo con `sample-brand`.
evidencia: `videos/_template/scene.gen.cjs:9` · `skills/lienzo-storyboard/SKILL.md:20` · commit `32085f6` · `qa/evidence/v1-template-brand-lock-shadowing.json`
repro: sí en `32085f6` (`node -e "fs.cpSync('videos/_template', ...)"` seguido de `node videos/qa-test/minimal/scene.gen.cjs`)
propuesta: Eliminar `videos/_template/brand.lock.json` (o renombrarlo / cargarlo solo como fallback cuando `../brand.lock.json` no exista: comprobar primero `../brand.lock.json` en `_template/scene.gen.cjs:9`).

### F-02 · P1 · vivo · bug
repo: animator
área: lib/objects.cjs (metricCard)
caso: V2-product/shot-3-metricCard
setup: Importar `metricCard` de `lib/objects.cjs` en `videos/qa-test/product/scene.gen.cjs` pasando `extra: { shot: "s3", bgColor: C.surface.base, titleFont: F.body.family, titleColor: C.text.base }`.
call: `pnpm lienzo scene_validate --json '{"project":"qa-test","compactFile":"C:/Users/scontreras/Documents/GitHub/animator/videos/qa-test/product/scene.json"}'`
esperado: `metricCard` consume sus opciones propias (`bgColor`, `border`, `titleY`, `titleFont`, `titleSize`, `titleWeight`, `titleColor`, `counterY`, `counterH`, `counterSize`, `counterColor`, `glow`) y pasa al `group(...)` únicamente las propiedades válidas de un elemento `group`.
obtenido: `lib/objects.cjs:43` hace `return group(id, x, y, w, h, [bg, titleEl, counterEl], extra);`, propagando `bgColor`, `titleFont`, `titleColor`, etc. al elemento `group`. Lienzo emite `notices` por cada una: `"Campo desconocido ignorado: compact.elements.s3-card.bgColor"`, `"Campo desconocido ignorado: compact.elements.s3-card.titleFont"`, `"Campo desconocido ignorado: compact.elements.s3-card.titleColor"`.
evidencia: `lib/objects.cjs:20-44` · commit `32085f6` · `qa/evidence/v2-metricCard-notices.json`
repro: sí en `32085f6` (`pnpm lienzo scene_validate --json '{"project":"qa-test","compactFile":"C:/Users/scontreras/Documents/GitHub/animator/videos/qa-test/product/scene.json"}'`)
propuesta: Desestructurar las claves propias de `metricCard` (`const { bgColor, border, titleY, titleFont, titleSize, titleWeight, titleColor, counterY, counterH, counterSize, counterColor, glow, ...groupExtra } = extra;`) y pasar `groupExtra` a `group(...)`.

### F-03 · P1 · vivo · bug
repo: lienzo
área: tool scene_build | tool element_add
caso: V2-product/shot-3 y V5-errors/child-counter-in-shot-group
setup: Escena `errors` en el proyecto `qa-test` con toma `s2` (`start: 4, end: 8`) y un grupo `s1-box` ligado a `shot: "s2"`.
call: `pnpm lienzo element_add --json '{"project":"qa-test","scene":"errors","parent":"s1-box","kind":"counter","patch":{"id":"child-counter-s2","to":500}}'`
esperado: Igual que `element_update` (`rebindShot` en `src/model/shot-timing.ts:86-97`) y `shot_set` desplazan las pistas de los hijos de un grupo con la toma del grupo, un `counter` (o un `preset` con pistas) creado dentro de un grupo ligado a `shot: "s2"` (`4..8s`) mediante `scene_build` o `element_add` (`parent`) debe iniciar su pista `progress` en `t = 4..5.5s` (el `start` de la toma del grupo padre).
obtenido: `expand.ts:291-293` y `element-add.ts:120-123` llaman a `withCountUp(element, raw, state.timing)` / `fromShotStart` mirando únicamente `element.shot` del hijo (que es `undefined` porque `shot` vive en el grupo padre). Como resultado, la pista `progress` queda en `t = 0..1.5s`, por lo que el contador ya terminó de contar (`100%`) antes de que empiece la toma `s2` (`t = 4s`). En cambio, si el contador se añade cuando el grupo está en `s1` (`0..4s`) y luego se actualiza el grupo a `shot: "s2"` con `element_update`, `rebindShot` sí mueve la pista del hijo a `t = 4..5.5s`.
evidencia: `src/service/compact/expand.ts:291-293,319-331` · `src/service/elements/tools/element-add.ts:120-124` · `src/components/counter/count-up.ts:22-35` · commit `7b7b45c` · `qa/evidence/v5-errors-battery.json` (`writerDiscrepancyRepros.child_counter_in_shot_group`) y `qa/evidence/product-s3.png`
repro: sí en `7b7b45c` (ver `writerDiscrepancyRepros.child_counter_in_shot_group` en `qa/evidence/v5-errors-battery.json`)
propuesta: Pasar el `shot` efectivo del grupo ancestro a `buildElement` en `expand.ts` y a `withCountUp` / `fromShotStart` cuando `parent` está presente en `element-add.ts`.

### F-04 · P1 · vivo · bug
repo: lienzo
área: tool element_update
caso: V5-errors/group-child-at-center
setup: En proyecto `qa-test`, escena `errors` (`1080×1920`) con grupo `s1-box` (`x: 190, y: 960, w: 700, h: 260, cw: 700, ch: 260`) e hijo `s1-box-pill` (`w: 300, h: 80`).
call: `pnpm lienzo element_update --json '{"project":"qa-test","scene":"errors","id":"s1-box/s1-box-pill","at":"center","patch":{}}'`
esperado: `s1-box-pill` se centra dentro del área de contenido de su grupo padre `s1-box` (`cw: 700, ch: 260`), quedando en `x: 200, y: 90` — igual que hacen `scene_build` (`expand.ts:481-484`) y `element_add` con `parent: "s1-box", at: "center"` (`element-add.ts:134-136`).
obtenido: `element_update` (`src/service/elements/tools/element-update.ts:65`) llama a `placeAt(out, at, s)` usando las dimensiones del lienzo raíz `s` (`1080×1920`) en lugar del `cw × ch` del grupo padre, dejando al hijo en `x: 390, y: 920` (fuera de la caja `700×260` del grupo).
evidencia: `src/service/elements/tools/element-update.ts:65` vs `src/service/elements/tools/element-add.ts:134-136` y `src/service/compact/expand.ts:481-484` · commit `7b7b45c` · `qa/evidence/v5-errors-battery.json` (`writerDiscrepancyRepros.group_child_at_center`)
repro: sí en `7b7b45c` (`pnpm lienzo element_update --json '{"project":"qa-test","scene":"errors","id":"s1-box/s1-box-pill","at":"center","patch":{}}'`)
propuesta: En `element-update.ts`, cuando `id` es una ruta `group/child`, resolver las dimensiones del grupo padre inmediato (`{ width: parentGroup.cw, height: parentGroup.ch }`) y pasarlas a `placeAt`.

### F-05 · P1 · vivo · bug
repo: lienzo
área: tool scene_validate | tool scene_build
caso: V4-dense/limits y V5-errors/compact-vs-compactFile
setup: Proyecto `qa-test` existente.
call: `pnpm lienzo scene_validate --json '{"project":"qa-test","compact":{"duration":601,"fps":61,"elements":[{"id":"bad-el","kind":"unknown_kind_xyz"}]}}'`
esperado: Según la descripción de `scene_validate` (`"Every problem with the input, also passing both or neither, is a verdict (valid: false); only a wrong project fails the call"`), debe devolver `{ "valid": false, "message": "...", "path": "compact.duration", "errors": [...] }` listando tanto `compact.duration` y `compact.fps` como `compact.elements.bad-el.kind` (igual que hace cuando el mismo JSON se pasa por `compactFile` o `data`). Y `scene_build` con `compact` inline debe devolver el mismo `code: "invalid_scene"` y lista completa `errors` que `scene_build` con `compactFile`.
obtenido: Como `CompactSceneInputSchema` (`src/model/compact.ts:402-410`) relaja `elements` y `symbols.*.children` a `z.unknown()` pero mantiene `width`, `height`, `duration`, `fps`, `size`, `background`, `defaults`, `shots` y `audioTracks` estrictos en `tool.input`, `callTool` (`src/service/core/registry.ts:242-260`) intercepta la llamada antes de entrar en `scene_validate.run` / `buildCompact`:
1. `scene_validate` falla la herramienta con `{"code":"invalid_input","message":"compact.duration: ...\ncompact.fps: ...","path":"compact.duration"}` en vez de devolver `{"valid":false,...}`.
2. No incluye el array `errors` (porque `callTool` en `registry.ts:248-259` no construye `errors`).
3. Oculta `compact.elements.bad-el.kind`, mientras que pasando el mismo objeto por `compactFile` sí devuelve `valid: false` y los 3 errores en `errors`.
evidencia: `src/model/compact.ts:402-410` · `src/service/scenes/tools/scene-validate.ts:32-39` · `src/service/core/registry.ts:242-260` · commit `7b7b45c` · `qa/evidence/v4-dense-limits.json` y `qa/evidence/v5-errors-battery.json` (`multiErrorAndSchemaDiscrepancies`)
repro: sí en `7b7b45c` (comparar `validate_inline_compact_top_and_el_error` vs `validate_compactFile_top_and_el_error` en `qa/evidence/v5-errors-battery.json`)
propuesta: En `scene_validate` y `scene_build`, aceptar `compact: z.record(z.string(), z.unknown()).optional()` en `tool.input` para que `buildCompact` ejecute `CompactSceneSchema.safeParse` + `laterProblems` uniformemente en `compact` y `compactFile`, e incluir `errors` en `callTool` cuando `tool.input` tiene múltiples fallos.

### F-06 · P1 · vivo · bug
repo: lienzo
área: tool element_add | tool scene_validate | tool scene_inspect_layout
caso: V5-errors/line-attached-to-symbol-child
setup: Escena `errors` en proyecto `qa-test`, que define el símbolo `symbols.solardrop` con hijos internos `drop-shade`, `drop-core`, `drop-shine`.
call: `pnpm lienzo element_add --json '{"project":"qa-test","scene":"errors","kind":"line","patch":{"id":"line-to-symbol-child","shot":"s1","a":{"x":100,"y":100,"attach":"drop-shade"},"b":{"x":300,"y":300,"attach":"s1-orb-a"}}}'`
esperado: Un elemento `line` de la escena solo puede conectar elementos colocados en `scene.elements`, nunca hijos internos de una definición en `scene.symbols`. `element_add`, `element_update`, `scene_build` y `scene_validate` deben rechazar `attach: "drop-shade"` con `code: "unknown_target"`, y la lista de `ids:` sugeridos en el mensaje de `unknown_target` no debe incluir los hijos internos de `symbols`.
obtenido: `danglingReferences` (`src/service/scenes/scene-references.ts:76-77`) construye `ids` a partir de `placedElements(scene)` (`src/service/scenes/scene-changes.ts:8-23`), que recorre tanto `scene.elements` como `scene.symbols.*.children`. Por ello:
1. `element_add` y `scene_validate` aceptan `attach: "drop-shade"` como válido (`ok: true`).
2. Cuando un `attach` falla, el mensaje de `unknown_target` sugiere los IDs internos del símbolo (`«drop-shade», «drop-core», «drop-shine»`) como destinos válidos.
3. Acto seguido, `scene_inspect_layout` (`src/service/layout/layout.ts:253,473-479`, que solo indexa `scene.elements`) reporta `dangling_attachment`: `"El extremo inicial está conectado al id inexistente «drop-shade»"`.
evidencia: `src/service/scenes/scene-references.ts:76-77,135-144` · `src/service/scenes/scene-changes.ts:8-23` · `src/service/layout/layout.ts:253,473-479` · commit `7b7b45c` · `qa/evidence/v5-errors-battery.json` (`writerDiscrepancyRepros.line_attached_to_symbol_child`)
repro: sí en `7b7b45c` (ver `writerDiscrepancyRepros.line_attached_to_symbol_child` en `qa/evidence/v5-errors-battery.json`)
propuesta: En `danglingReferences`, comprobar `line` `attach` únicamente contra los IDs del mismo ámbito (`scene.elements` para líneas de la escena, o los hijos del propio símbolo para líneas dentro de un símbolo).

### F-07 · P1 · vivo · bug
repo: lienzo
área: tool scene_generate_speech
caso: V2-product/speech-custom-missing-baseUrl
setup: Proyecto `qa-test` con escena `product` creada y ningún servidor escuchando en `localhost:8880`.
call: `pnpm lienzo scene_generate_speech --json '{"project":"qa-test","scene":"product","text":"Hola mundo","provider":"custom"}'`
esperado: Error de validación `invalid_input` en `path: "baseUrl"` indicando que `baseUrl` es obligatorio cuando `provider` es `"custom"`.
obtenido: `createTtsService` (`src/service/speech/factory.ts:35-44`) usa `DEFAULT_LOCAL_TTS_URL` (`http://localhost:8880/v1/audio/speech`) cuando `options.baseUrl` es `undefined`, y `scene-generate-speech.ts:127-139` captura el error de conexión devolviendo `{"code":"tts_unavailable","message":"El servicio de voz local no está encendido en http://localhost:8880/v1/audio/speech...","path":"provider"}`. (Hallazgo ya listado como abierto en `lienzo/docs/qa-log.md`, confirmado vivo en `7b7b45c`).
evidencia: `src/service/speech/factory.ts:35-44` · `src/service/speech/tools/scene-generate-speech.ts:71-79,127-139` · commit `7b7b45c` · `qa/evidence/v2-speech-errors.json`
repro: sí en `7b7b45c` (`pnpm lienzo scene_generate_speech --json '{"project":"qa-test","scene":"product","text":"Hola","provider":"custom"}'`)
propuesta: Validar en el esquema de entrada de `scene_generate_speech` (`superRefine`) que `baseUrl` esté presente cuando `provider === "custom"`.

### F-10 · P2 · vivo · bug
repo: lienzo
área: component chart (pie / donut)
caso: V3-claims/shot-3-donut
setup: En proyecto `qa-test`, escena `claims`, elemento `s3-donut` (`kind: "chart", type: "donut", showValues: true, data: "Solar 6.9%: 6.9\nRenew 25.1%: 25.1\nOther 68%: 68.0"`).
call: `pnpm lienzo scene_preview --json '{"project":"qa-test","scene":"claims","t":14,"scale":0.5,"out":"claims-s3.png"}'`
esperado: 1) Todos los textos de etiqueta/valor de los sectores deben dibujarse por encima de todos los sectores del gráfico sin ser tapados por el relleno del sector siguiente. 2) Con `showValues: true`, un gráfico `pie`/`donut` con etiquetas debe mostrar el valor además de la etiqueta (o respetar `el.color` en vez de fijar `#ffffff`).
obtenido: En `src/components/chart/draw.ts:143-166`, `pie()` dibuja el arco (`ctx.fill()`) y el texto (`ctx.fillText(d.label || short(d.value), ...)`) dentro del mismo `data.forEach`. Por tanto, el arco del sector 1 (`Renew 25.1%`) y el del sector 2 (`Other 68%`) se pintan encima de los extremos del texto del sector 0 (`"Solar 6.9%"` queda cortado como `"olar 6.9"`), sin que `scene_inspect_layout` lo detecte. Además, `d.label || short(d.value)` descarta el valor numérico siempre que haya etiqueta.
evidencia: `src/components/chart/draw.ts:143-166` · commit `7b7b45c` · `qa/evidence/claims-s3-donut-overpaint.png`
repro: sí en `7b7b45c` (`pnpm lienzo scene_preview --json '{"project":"qa-test","scene":"claims","t":14,"scale":0.5}'`)
propuesta: En `pie()` (`src/components/chart/draw.ts`), separar el bucle en dos pasadas (primero rellenar todos los sectores y después dibujar todos los textos) y mostrar `d.label` + `short(d.value)` cuando `el.showValues` es `true`.

### F-11 · P2 · vivo · bug
repo: lienzo
área: tool element_add
caso: V5-errors/element-add-id-paths
setup: Proyecto `qa-test`, escena `errors` (que ya contiene `s1-orb-a`).
call: `pnpm lienzo element_add --json '{"project":"qa-test","scene":"errors","kind":"rect","patch":{"id":""}}'` (y con `{"id":"a/b"}` y `{"id":"s1-orb-a"}`)
esperado: Según la descripción de `element_add` (`"A failure about the new element points at its input (patch.w, patch.shot)"`), cualquier fallo en el `id` pasado en `patch.id` debe apuntar a `path: "patch.id"` (igual que ocurre con `patch: { id: " padded " }`, que sí devuelve `path: "patch.id"`).
obtenido:
- Con `patch: { id: "" }`: devuelve `path: "elements..id"` (con doble punto `..`), porque `idPath` (`src/model/id-path.ts:21`) acepta `""` como `typeof id === "string"`, y `atPatch` (`src/service/elements/tools/element-add.ts:37`) usa `/^elements\.([^.]+)(\..*)?$/`, que no casa con `elements..id`.
- Con `patch: { id: "a/b" }`: devuelve `path: "elements.a/b.id"`, porque `atPatch` hace `m[1]?.split("/").at(-1) === id` (`"b" === "a/b"` → `false`).
- Con `patch: { id: "s1-orb-a" }` (duplicado): devuelve `path: "elements.10.id"`, porque `idPath` mantiene el índice numérico `10` cuando `twice.length > 1`, y `atPatch` compara `"10" === "s1-orb-a"` (`false`).
evidencia: `src/model/id-path.ts:20-23` · `src/service/elements/tools/element-add.ts:34-39` · commit `7b7b45c` · `qa/evidence/v5-errors-battery.json` (`invalidWrites[0..3]`)
repro: sí en `7b7b45c` (ver `empty_id_element_add`, `slash_id_element_add`, `duplicate_id_element_add` en `qa/evidence/v5-errors-battery.json`)
propuesta: En `idPath` (`src/model/id-path.ts:21`), rechazar `id === ""` o `id.includes("/")`; y en `element-add.ts`, pasar el índice del nuevo elemento además de su `id` a `atPatch` para renombrar también `elements.<newIndex>.id` a `patch.id`.

### F-12 · P2 · vivo · bug
repo: lienzo
área: tool scene_validate | tool scene_build
caso: V5-errors/duplicate-id-in-compact
setup: Proyecto `qa-test`.
call: `pnpm lienzo scene_validate --json '{"project":"qa-test","compact":{"size":[1080,1920],"duration":6,"fps":30,"elements":[{"id":"dup","kind":"rect","opacity":2},{"id":"dup","kind":"rect"}]}}'`
esperado: El ID duplicado `"dup"` debe reportarse una sola vez en `errors` con mensaje y código consistentes (`duplicate_id`: `"ID duplicado «dup» (ya está en elements.0)"`).
obtenido: Se reporta dos veces en `errors` sobre `compact.elements.1.id` con mensajes distintos: `"ID duplicado «dup» (ya está en elements.0)"` (desde `rawRuleProblems` → `checkUniqueIds`) y `"ID duplicado «dup» en la escena compacta"` (desde `laterProblems` → `expandScene` en `expand.ts:447`). Además, cuando no hay error de esquema previo, `scene_build` falla en `expand.ts:447` devolviendo `code: "invalid_compact_scene"` en vez de `code: "duplicate_id"`.
evidencia: `src/service/compact/expand.ts:445-449` · `src/service/compact/build-compact.ts:177-212` · `src/service/scenes/scenes.ts:228-258` · commit `7b7b45c` · `qa/evidence/v5-errors-battery.json` (`validate_multi_element_and_rule_errors`)
repro: sí en `7b7b45c` (`pnpm lienzo scene_validate --json '{"project":"qa-test","compact":{"size":[1080,1920],"duration":6,"fps":30,"elements":[{"id":"dup","kind":"rect","opacity":2},{"id":"dup","kind":"rect"}]}}'`)
propuesta: Eliminar el chequeo redundante de `seenIds` en `expand.ts:445-449` y dejar que `checkUniqueIds` (`scenes.ts:228`) lo reporte de forma única con `code: "duplicate_id"`.

### F-13 · P2 · vivo · bug
repo: animator
área: videos/_template/scene.gen.cjs
caso: V1-minimal/duration-inheritance
setup: Inspeccionar `videos/_template/scene.gen.cjs:6` frente a `DESIGN.md` § Brand inheritance.
call: `node videos/_template/scene.gen.cjs`
esperado: Según `DESIGN.md` (`"duration: from the brief or canvas.duration"`), la plantilla debe tomar `D = lock.canvas.duration` por defecto en lugar de un literal fijo de `4` segundos (mientras el propio `_template/brand.lock.json` declara `"duration": 6`).
obtenido: `videos/_template/scene.gen.cjs:6` fija `const W = 1080, H = 1920, D = 4;`, ignorando `lock.canvas.width`, `lock.canvas.height`, `lock.canvas.duration` y `lock.canvas.fps`.
evidencia: `videos/_template/scene.gen.cjs:6` · `videos/_template/brand.lock.json:18-23` · `DESIGN.md:18` · commit `32085f6`
repro: sí en `32085f6` (`node videos/_template/scene.gen.cjs` produce `"duration": 4` aunque `_template/brand.lock.json` tiene `"duration": 6`)
propuesta: Cambiar la línea 6 de `videos/_template/scene.gen.cjs` a `const { width: W, height: H, duration: D, fps: FPS } = lock.canvas;`.

---

## 2. Fricciones (funciona pero cuesta: doc, mensajes, esquemas, pasos manuales)

### F-08 · P1 · vivo · fricción
repo: lienzo
área: tool scene_inspect_layout
caso: V2-product/shot-1-particles-overlap
setup: En proyecto `qa-test`, escena con fondo de toma `s1-bg` (`kind: "rect", x: 0, y: 0, w: 1080, h: 1920, shot: "s1"`) y capa ambiental `s1-particles` (`kind: "particles", x: 0, y: 0, w: 1080, h: 1920, shot: "s1"`), generada con `particles()` de `animator/lib/environment.cjs`.
call: `pnpm lienzo scene_inspect_layout --json '{"project":"qa-test","scene":"product","times":[2]}'`
esperado: Un campo ambiental `particles` a pantalla completa no es una forma sólida que compita por el espacio con el rectángulo de fondo `s1-bg`; `scene_inspect_layout` no debe reportar `shape_overlap` entre `s1-bg` y `s1-particles`.
obtenido: En `src/service/layout/layout.ts:404`, `NOT_SHAPES = new Set(["text", "line", "group"])` no excluye `"particles"` (ni `"subtitles"`). Como `s1-bg` y `s1-particles` miden ambos `1080×1920`, `contains(a, b)` es `false` (`area(inner) < 0.9 * area(outer)`) y `shapesStack` devuelve `true`, emitiendo el falso positivo: `{"code":"shape_overlap","elementId":"s1-bg","shot":"s1","t":2,"message":"Se superpone con «s1-particles» en más de la mitad del menor, sin que uno contenga al otro"}`.
evidencia: `src/service/layout/layout.ts:404,411-429,536-551` · commit `7b7b45c`
repro: sí en `7b7b45c` (cualquier escena con `rect` `1080×1920` y `particles` `1080×1920` en la misma toma)
propuesta: Añadir `"particles"` (y `"subtitles"`) a `NOT_SHAPES` en `src/service/layout/layout.ts:404`.

### F-09 · P1 · vivo · fricción
repo: animator
área: skill lienzo-animate | lib/objects.cjs
caso: V3-claims/component-schemas
setup: Seguir `skills/lienzo-animate/SKILL.md` y sus `references/*.md` para construir una escena informativa con `chart`, `steps` y `badge` en `scene.gen.cjs`.
call: `node videos/qa-test/claims/scene.gen.cjs` + `scene_validate`
esperado: `skills/lienzo-animate` debe documentar los campos reales de los componentes de datos (`chart`, `steps`, `list`, `table`, `code`, `bubble`, `badge`) o proporcionar constructores en `lib/objects.cjs` para no obligar al agente a adivinar o fallar en el primer `scene_validate`.
obtenido: `skills/lienzo-animate/references/compact-format.md:4` remite a `lienzo/docs/components.md`, pero `docs/components.md` es solo prosa general y no lista los campos de `chart` (`type: "bar"|"donut"`, `data: "Etiqueta: valor\n..."`), `steps` (`layout: "horizontal"|"vertical"`, `labels: "Paso 1\nPaso 2"`), ni que en `badge` el color de texto es `color` y el color de pastilla es `fill.color` (y que `badge` no tiene `w`/`h`). Además, al pasar `F.heading` de `brandFonts(lock)` como `font` de un componente directo, falla con `se esperaba texto, recibido objeto` porque `brandFonts` devuelve `{ family, weight }`.
evidencia: `skills/lienzo-animate/references/compact-format.md:4` · `C:\Users\scontreras\Documents\GitHub\lienzo\docs\components.md:93-140` · commit `32085f6`
repro: sí en `32085f6`
propuesta: Añadir una tabla concisa de firmas de componentes (`badge`, `chart`, `steps`, `list`, `table`, `code`, `bubble`, `counter`, `progress`) en `skills/lienzo-animate/references/compact-format.md` (o helpers en `lib/objects.cjs`).

### F-14 · P2 · vivo · fricción
repo: lienzo
área: tool scene_inspect_layout
caso: V4-dense/shot-2-oob-shape-overlap
setup: En proyecto `qa-test`, escena `dense`, toma `s2` con fondo `s2-bg` (`0,0,1080,1920`) y tarjeta `s2-oob-card` (`x: 860, y: 1360, w: 360, h: 160`, que sobresale 140 px por la derecha del lienzo).
call: `pnpm lienzo scene_inspect_layout --json '{"project":"qa-test","scene":"dense","times":[60]}'`
esperado: Reportar únicamente `out_of_bounds` sobre `s2-oob-card`.
obtenido: Además de `out_of_bounds` en `s2-oob-card`, `shapesStack` (`src/service/layout/layout.ts:411-429`) reporta un segundo diagnóstico confuso: `{"code":"shape_overlap","elementId":"s2-bg","shot":"s2","t":60,"message":"Se superpone con «s2-oob-card» en más de la mitad del menor, sin que uno contenga al otro"}`. Ocurre porque `contains(s2-bg, s2-oob-card)` exige `inner.x + inner.w <= outer.x + outer.w`, que falla en cuanto un elemento asoma 1 px fuera del fondo `s2-bg`, mientras el 61% de `s2-oob-card` sigue dentro de `s2-bg`.
evidencia: `src/service/layout/layout.ts:411-429` · commit `7b7b45c` · `qa/evidence/v4-dense-layout.json`
repro: sí en `7b7b45c` (`pnpm lienzo scene_inspect_layout --json '{"project":"qa-test","scene":"dense","times":[60]}'`)
propuesta: En `shapesStack` (`src/service/layout/layout.ts:423`), no reportar `shape_overlap` cuando una de las cajas cubre >=90% del lienzo (`area(outer) >= 0.9 * scene.width * scene.height`) y actúa como fondo de toma.

### F-15 · P2 · vivo · fricción
repo: lienzo
área: tool background_set
caso: V5-errors/background-set-param-hint
setup: Proyecto `qa-test`, escena `errors`.
call: `pnpm lienzo background_set --json '{"project":"qa-test","scene":"errors","values":{"color":"#0F172A"}}'`
esperado: El mensaje de error debe nombrar el parámetro real `patch` (`"Indica un preset o patch"`) y `misplacedHint` debe preguntar `¿van dentro de «patch»?` (no `«preset»`, que es un string).
obtenido: Devuelve `{"code":"invalid_input","message":"preset: Indica un preset o valores\n«values» no es un parámetro de background_set: ¿van dentro de «preset»?","path":"preset"}`. El mensaje en `background-set.ts` dice `"valores"` en vez de `"patch"`, y `misplacedHint` (`src/service/core/registry.ts:178-189`) sugiere `«preset»` porque el `superRefine` colgó el issue en `path: ["preset"]`.
evidencia: `src/service/core/registry.ts:168-190` · commit `7b7b45c` · `qa/evidence/v5-errors-battery.json` (`invalid_hex_color_background_set`)
repro: sí en `7b7b45c` (`pnpm lienzo background_set --json '{"project":"qa-test","scene":"errors","values":{"color":"#0F172A"}}'`)
propuesta: Actualizar el mensaje de `background_set` a `"Indica `preset` o `patch`"` y en `misplacedHint` filtrar los candidatos a parámetros de tipo objeto/registro (`patch`) cuando la clave extra o su valor es un objeto.

### F-16 · P2 · vivo · fricción
repo: lienzo
área: tool scene_generate_speech
caso: V2-product/speech-wav-duration
setup: Servidor TTS local compatible con `/v1/audio/speech` que responde con audio PCM WAV (`RIFF....WAVEfmt `), habitual en motores locales ligeros (Piper/Kokoro WAV).
call: `pnpm lienzo scene_generate_speech --json '{"project":"qa-test","scene":"product","text":"Every day, your roof receives enough sunlight to power your entire home.","provider":"local","baseUrl":"http://127.0.0.1:18880","asTrack":true,"startOffset":0.2}'`
esperado: Si el buffer devuelto empieza por cabecera `RIFF....WAVE` (o `Content-Type: audio/wav`), `scene_generate_speech` debe medir la duración con la rama WAV de `audioDuration` (`src/service/speech/audio-duration.ts:44-50`, que ya implementa soporte WAV!) y guardarlo con extensión `.wav`.
obtenido: `src/service/speech/tools/scene-generate-speech.ts:115,142` pasa siempre `format: "mp3"` de forma fija a `audioDuration(audioBuffer, "mp3")` y guarda `.mp3`. Como `mp3Duration` no encuentra frames MP3 válidos en un WAV (o encuentra falsos sincronismos `0xFFE0` en muestras PCM), devuelve una duración errónea (`2.33s` para un WAV de `4.00s` a 22.05 kHz) y guarda bytes WAV bajo extensión `.mp3`.
evidencia: `src/service/speech/tools/scene-generate-speech.ts:115,142` · `src/service/speech/audio-duration.ts:40-55` · commit `7b7b45c` · `qa/evidence/v2-speech-results.json`
repro: sí en `7b7b45c` (ver `qa/evidence/v2-speech-results.json`, donde `duration` dio `2.33` para un WAV de `4.0s`)
propuesta: En `scene-generate-speech.ts` / `audio-duration.ts`, detectar si `buf` empieza por `"RIFF"` y `"WAVE"` para usar `wavDuration(buf)` y extensión `.wav` automáticamente.

### F-18 · P2 · vivo · fricción
repo: animator
área: lib/brand.cjs | lib/scene.cjs
caso: V3-claims/brand-fonts-roles
setup: Marca `qa-test` con 3 fuentes declaradas en `brand.lock.json`: `Space Grotesk` (`role: "heading"`), `Inter` (`role: "body"`), `JetBrains Mono` (`role: "mono"`).
call: `brandFonts(lock)` y `label("id", "name", "TEXT", 200, 28, 0.1, 5.5, { font: "mono" })`
esperado: `brandFonts(lock)` debería exponer también `mono` y `accent` cuando existen en `lock.fonts` (validados por `FONT_ROLES` en `lib/brand.cjs:6`), y `label()` debería permitir `extra.font: "mono"` / `"accent"` (o una familia explícita).
obtenido: `brandFonts(lock)` (`lib/brand.cjs:43-51`) solo devuelve `{ heading, body }`, descartando `"mono"` y `"accent"`. Y `fontOf` en `lib/scene.cjs:14` hace `fonts[extra.font === "body" ? "body" : "heading"]`, por lo que `extra: { font: "mono" }` usa silenciosamente `heading`.
evidencia: `lib/brand.cjs:6,43-51` · `lib/scene.cjs:14,43` · commit `32085f6`
repro: sí en `32085f6`
propuesta: Incluir `mono` y `accent` opcionales en `brandFonts(lock)` (con fallback a `body`/`heading`) y permitir `fonts[extra.font]` en `lib/scene.cjs:14`.

### F-19 · P2 · vivo · fricción
repo: animator
área: lib/environment.cjs
caso: V2-product/particles-extra
setup: Usar `particles()` o `sea()` de `lib/environment.cjs` dentro de una escena con tomas nativas (`shots`).
call: `particles("s1-particles", "Shot 1 · ambient dust", { x: 0, y: 0, w: W, h: H }, { count: 35, drift: 20, seed: 11, size: 4, color: C.solar.highlight, opacity: 0.45 })`
esperado: Igual que `blob(..., extra)`, `rect(..., extra)`, `ell(..., extra)`, `path(..., extra)` y `group(..., extra)`, `particles()` y `sea()` deberían aceptar `extra = {}` (o propagar `shot`, `tracks`, `anim` desde el objeto de opciones) para ligar el elemento a una toma (`shot: "s1"`).
obtenido: `particles()` (`lib/environment.cjs:5-9`) y `sea()` (`lib/environment.cjs:12-23`) no aceptan `extra` ni propagan `shot`. Si el autor pasa `shot: "s1"` dentro del 4.º argumento de `particles()`, se pierde silenciosamente (en `videos/pulse-metrics/speed/scene.gen.cjs:20` y `chaos/scene.gen.cjs:19`, `s1-stars` y `s2-stars` quedaron sin `shot`, dibujándose durante todo el vídeo).
evidencia: `lib/environment.cjs:5-23` · `videos/pulse-metrics/speed/scene.gen.cjs:20-22` · commit `32085f6`
repro: sí en `32085f6`
propuesta: Añadir `extra = {}` a `particles(id, name, box, opts, extra = {})` y `sea(id, name, box, opts, extra = {})` en `lib/environment.cjs`.

### F-20 · P2 · vivo · fricción
repo: animator
área: lib/scene.cjs
caso: V1-minimal, V2-product, V3-claims/label-and-nativeShot
setup: Crear textos del plano final con `label()` y tomas con transición usando `nativeShot()` de `lib/scene.cjs`.
call: `label("t4", "Brand", "AETHER SOLAR", 1180, 84, 18.4, 24, { shot: "s4" })` y `nativeShot("s2", "Shot 2", 6, 12, cam)`
esperado: 1) En el último plano (donde `DESIGN.md` exige `"the final image holds >= 1.5 s with the message"`), `label()` debería permitir omitir `anim.out` sin mutar el objeto devuelto (`delete el.anim.out`). 2) `nativeShot` debería aceptar `transition` (o un objeto `extra`) sin obligar a `{ ...nativeShot(...), transition }`.
obtenido: `label()` (`lib/scene.cjs:41-49`) añade siempre `out: { kind: "fade", delay: b - 0.25, duration: 0.25 }`, haciendo que el cierre desaparezca en el último fotograma salvo que cada vídeo escriba un wrapper `holdLabel` con `delete el.anim.out`. Y `nativeShot(id, name, start, end, camera)` (`lib/scene.cjs:55`) no acepta `transition` y mantiene además un comentario obsoleto (`do not use it on shots with groups: see shots-camera.md`).
evidencia: `lib/scene.cjs:41-55` · `DESIGN.md:97` · commit `32085f6`
repro: sí en `32085f6`
propuesta: Soportar `extra.out === false` (o `b >= duration`) en `label()` para omitir `anim.out`, añadir `transition` a `nativeShot(id, name, start, end, camera, transition)` y actualizar el comentario de la línea 54.

### F-21 · P2 · vivo · fricción
repo: animator
área: skill lienzo-animate (references/compact-format.md)
caso: V5-errors/stale-tool-table
setup: Consultar la tabla de herramientas en `skills/lienzo-animate/references/compact-format.md:48-74` para invocar `background_set`, `scene_rename` y `scene_validate`.
call: Invocar `background_set` con `values` o `scene_rename` con `name` según `compact-format.md:56-57`.
esperado: La tabla de referencia rápida en `compact-format.md` debe coincidir con los nombres de parámetros reales del MCP de Lienzo.
obtenido:
- Línea 56: dice `scene_rename / scene_delete | manage scene files (name)`, pero `scene_rename` exige `{ project, from, to }` (no `name` ni `scene`).
- Línea 57: dice `background_set | background from a preset or values`, pero el parámetro se llama `patch` (no `values`).
- Línea 60: dice `scene_validate | first failing path + notices, without saving`, pero `scene_validate` devuelve todos los fallos en `errors`.
evidencia: `skills/lienzo-animate/references/compact-format.md:56-60` · commit `32085f6` · `qa/evidence/v5-errors-battery.json`
repro: sí en `32085f6`
propuesta: Actualizar las líneas 56, 57 y 60 de `skills/lienzo-animate/references/compact-format.md` con `{ from, to }`, `patch` y `every failing path in errors + notices`.

### F-22 · P2 · vivo · fricción
repo: animator
área: skill lienzo-animate (SKILL.md, references/drawing.md, references/gotchas.md)
caso: V2-product y V4-dense/stale-skill-notes
setup: Revisar las notas operativas de `skills/lienzo-animate/SKILL.md`, `references/drawing.md` y `references/gotchas.md` contra Lienzo `7b7b45c`.
call: Lectura y ejecución del flujo `lienzo-animate`.
esperado: Las notas del skill no deben contradecirse entre sí ni describir limitaciones ya resueltas en Lienzo (specs 063, 088, 090).
obtenido: Cinco notas obsoletas o contradictorias en `skills/lienzo-animate`:
1. `SKILL.md:16`: dice `until Lienzo 090 builds from a file over MCP` — `scene_build` y `scene_validate` ya aceptan `compactFile` por MCP.
2. `SKILL.md:63`: dice `Unknown fields are dropped without a notice` — contradice `references/gotchas.md:14` y el comportamiento real de Lienzo (que emite `Campo desconocido ignorado: ...`).
3. `references/drawing.md:49`: dice `(there is no per-axis scale channel), until Lienzo 088 adds per-axis scale channels` — `@scaleX` y `@scaleY` ya existen.
4. `references/drawing.md:57-58`: la línea 57 dice `"fall" for snow and rain` y la línea 58 inmediatamente debajo dice `(particles cannot fall)`.
5. `references/gotchas.md:24`: dice `out_of_bounds on a legacy group shot that zooms: expected ... use the native camera instead`, pero `shotBox` en `scene_inspect_layout` (`src/service/layout/layout.ts:101,165`) aplica la cámara de la toma a `s1-bg`, por lo que `camera.zoom > 1` también dispara `out_of_bounds` en cada fondo `s1-bg`.
evidencia: `skills/lienzo-animate/SKILL.md:16,63` · `skills/lienzo-animate/references/drawing.md:49,57-58` · `skills/lienzo-animate/references/gotchas.md:24` · commit `32085f6`
repro: sí en `32085f6`
propuesta: Limpiar las 5 notas obsoletas en `skills/lienzo-animate/`.

### F-23 · P2 · vivo · fricción
repo: animator
área: tests/videos/learnings.test.cjs | skill lienzo-animate
caso: V7-repeat/learnings-none-bullet
setup: Escribir `- None.` bajo `## Engine` en `videos/qa-test/<video>/learnings.md` cuando un vídeo no encontró un bug nuevo del motor.
call: `pnpm test`
esperado: `skills/lienzo-animate/SKILL.md:50` o `videos/_template/learnings.md` deberían advertir que una sección vacía en `learnings.md` debe dejarse sin viñetas (en blanco), o `learnings.test.cjs` debería ignorar `- None.`.
obtenido: `tests/videos/learnings.test.cjs:40-42` exige que toda línea que empiece por `- ` bajo `## Engine` termine con `— tracks: Lienzo spec NNN` o URL de issue, por lo que `- None.` hace fallar `pnpm test`.
evidencia: `tests/videos/learnings.test.cjs:10,40-42` · `skills/lienzo-animate/SKILL.md:50-56` · commit `32085f6`
repro: sí en `32085f6`
propuesta: Indicar explícitamente en `skills/lienzo-animate/SKILL.md:50` que las secciones sin hallazgos en `learnings.md` se dejan sin viñetas (como en `videos/_template/learnings.md`).

---

## 3. Dudas de diseño (decisiones debatibles)

### F-17 · P2 · vivo · duda de diseño
repo: lienzo
área: model/shot-timing.ts | engine/anim.ts
caso: V3-claims/shot-2-anim-delays
setup: Elemento ligado a `shot: "s2"` (`start: 5.5, end: 11.0`) con `anim.in.delay: 0.15` y `anim.out.delay: 5.25` (valores relativos a la duración de la toma en vez de segundos de escena `5.65` y `10.75`).
call: `pnpm lienzo scene_validate --json '{"project":"qa-test","compactFile":"..."}'` y `scene_inspect_layout` en `t = 8`
esperado: O bien `anim.in.delay` / `anim.out.delay` se desplazan con `shot.start` igual que `tracks` cuando un elemento se liga/mueve de toma (`src/model/shot-timing.ts:1-6` dice `"its tracks are timed from its shot's start, and an unbound element's from 0, as anim already is"`), o bien `scene_validate` / `scene_build` emiten un `notice` cuando `anim.in` o `anim.out` de un elemento con `shot` caen fuera del intervalo `[shot.start, shot.end]` (igual que `cameraOutsideShot` avisa de keyframes de cámara fuera de la toma).
obtenido: Si un elemento en `shot: "s2"` (`5.5..11.0s`) tiene `anim.out.delay: 5.25, duration: 0.25`, sale en `t = 5.5s` justo cuando empieza su toma, quedando invisible durante toda la toma `s2` sin ningún `notice` en `scene_validate`, `scene_build` ni `scene_inspect_layout`. Además, al mover una toma con `shot_set` o cambiar `shot` con `element_update`, `rebindShot` mueve `tracks` pero no mueve `anim.in.delay` ni `anim.out.delay`.
evidencia: `src/model/shot-timing.ts:1-6,86-97` · `src/service/scenes/scene-notices.ts:159-196` · `src/service/layout/layout.ts:108-123` · commit `7b7b45c`
repro: sí en `7b7b45c`
propuesta: Emitir un `notice` en `contentNotices` (`scene-notices.ts`) cuando un elemento con `shot` tiene `anim.in` o `anim.out` (o todos sus keyframes de `tracks`) fuera de `[shot.start, shot.end]`, y decidir si `rebindShot` / `shot_set` debe desplazar también `anim.in.delay` y `anim.out.delay`.

### F-24 · P2 · vivo · duda de diseño
repo: animator
área: skill lienzo-storyboard | lib/brand.cjs
caso: qa-test/brand-md-vs-brand-lock
setup: Ejecutar `skills/lienzo-storyboard/SKILL.md` paso 1 (`project_create` / `project_update` → `project_inspect` → `brandLock(inspect)`).
call: `brandLock(inspect)` en `lib/brand.cjs:10-13`
esperado: Una única fuente de verdad local para el snapshot de la marca, conservando las advertencias (`notices`) de fuentes no instaladas que devuelve `project_inspect`.
obtenido: `brandLock(inspect)` ya guarda el Markdown completo de `guide` dentro de `videos/<brand>/brand.lock.json` (`lock.guide`), pero también existe el concepto de `videos/<brand>/brand.md` que ninguna herramienta ni módulo de `lib/` lee ni valida. Además, `brandLock({ manifest, guide })` descarta `inspect.notices` (por ejemplo, fuentes o pesos declarados en la marca que no están instalados en Lienzo: ver `qa/evidence/brand-fonts-notices.json`).
evidencia: `lib/brand.cjs:10-13` · `skills/lienzo-storyboard/SKILL.md:27-35` · commit `32085f6` · `qa/evidence/brand-fonts-notices.json`
repro: sí en `32085f6`
propuesta: Documentar que `brand.lock.json` (`guide`) es el único snapshot canónico (o generar `brand.md` automáticamente desde `lock.guide`) y hacer que el paso 1 de `lienzo-storyboard` verifique que `project_inspect.notices` esté vacío antes de escribir `brand.lock.json`.

### F-25 · P2 · vivo · duda de diseño
repo: animator
área: DESIGN.md | AGENTS.md
caso: V6-formats/bilingual-copy
setup: Crear un vídeo con texto en pantalla en español (`ES`) e inglés (`EN`) según el caso `V6 formats`.
call: Revisión contra `DESIGN.md:79` (`"All on-screen text is English."`) y `AGENTS.md:9` (`"English in all code files, markdown documents, and on-screen text"`).
esperado: Permitir que el idioma del texto en pantalla (`on-screen text`) y de la locución venga determinado por el `brief.md` o por `brand.md` (con inglés como valor por defecto cuando el brief no especifique otro idioma).
obtenido: `DESIGN.md:79` y `AGENTS.md:9` imponen inglés en todo `on-screen text` como regla absoluta del repositorio, lo que contradice la producción de piezas para marcas en español o campañas multilingües (`ES` + `EN`).
evidencia: `DESIGN.md:79` · `AGENTS.md:9` · commit `32085f6`
repro: sí en `32085f6`
propuesta: Matizar en `AGENTS.md` y `DESIGN.md` que el código y documentación técnica van siempre en inglés, mientras que el texto en pantalla (`on-screen text`) y la voz siguen el idioma declarado en `brief.md` / `brand.md` (por defecto inglés).
