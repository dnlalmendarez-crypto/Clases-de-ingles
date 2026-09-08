# Clases de Inglés 🎓

Aplicación web interactiva para aprender inglés **desde cero**, pensada para
adultos hispanohablantes de El Salvador. Combina presentaciones visuales de
vocabulario con actividades de **listening**, **speaking** y **writing**, y
usa la API de Claude (Anthropic) para corregir la escritura y dar
retroalimentación de pronunciación adaptada al nivel de cada estudiante.

## ¿Qué incluye?

- **Diagnóstico inicial**: el estudiante indica su nombre y cuánto inglés
  sabe (nada, algunas palabras, o frases simples).
- **Mapa de unidades** estilo "camino de aprendizaje" (saludos, números,
  familia, comida, rutina diaria, trabajo), cada una desbloqueando la
  siguiente al completarse.
- Por cada unidad, cuatro etapas:
  1. **Presentación**: tarjetas con emoji/imagen, palabra en inglés,
     traducción y una frase de ejemplo, con botón de audio (🔊).
  2. **Listening**: se reproduce la palabra en inglés y el estudiante elige
     la traducción correcta entre 4 opciones.
  3. **Speaking**: el estudiante repite una frase en voz alta; el
     reconocimiento de voz del navegador la transcribe y Claude da un
     consejo breve de pronunciación en español.
  4. **Writing**: el estudiante traduce una frase; Claude corrige la
     respuesta y explica el error en español sencillo, adaptado a su nivel.
- **Progreso local**: XP, racha de días y estrellas por unidad, guardado en
  el navegador (`localStorage`).
- **Funciona sin configurar nada**: si no hay una llave de Claude
  configurada, la app usa una corrección local (comparación de texto) para
  que siempre sea utilizable; al configurar la llave, las correcciones y
  consejos se vuelven más naturales y personalizados.

## Tecnología

- **Cliente**: React + TypeScript + Vite + Tailwind CSS. Usa la
  [Web Speech API](https://developer.mozilla.org/docs/Web/API/Web_Speech_API)
  del navegador para texto-a-voz (escuchar) y voz-a-texto (hablar) — sin
  costo y sin necesitar credenciales de Google. Funciona mejor en
  **Chrome** (escritorio o Android).
- **Servidor**: Node.js + Express, expone dos endpoints que llaman a la API
  de Claude:
  - `POST /api/correct` — corrige un ejercicio de escritura.
  - `POST /api/speak-feedback` — da un consejo de pronunciación.

  La llave de API nunca se expone al navegador: solo vive en el servidor.

> ¿Por qué no la API de reconocimiento de voz de Google Cloud? Para una
> primera versión gratuita y sin fricción de configuración se usa la Web
> Speech API nativa del navegador. Si más adelante se necesita mejor
> precisión (por ejemplo, para evaluar acentos con más detalle), se puede
> añadir Google Cloud Speech-to-Text como reemplazo del reconocimiento de
> voz en `client/src/lib/speech.ts` sin cambiar el resto de la app.

## Cómo correrlo localmente

Requiere Node.js 18 o superior.

```bash
# 1. Instalar dependencias (cliente + servidor)
npm install

# 2. (Opcional pero recomendado) configurar la llave de Claude
cp server/.env.example server/.env
# Edita server/.env y pega tu ANTHROPIC_API_KEY
# (consíguela en https://console.anthropic.com/)

# 3. Levantar cliente y servidor juntos
npm run dev
```

Esto abre el cliente en `http://localhost:5173` (con proxy automático hacia
el servidor en `http://localhost:8787`).

Para correr cada parte por separado:

```bash
npm run dev:server   # http://localhost:8787
npm run dev:client   # http://localhost:5173
```

## Estructura del proyecto

```
client/    App de React (interfaz, actividades, contenido de las lecciones)
server/    API de Express que llama a Claude para corregir y dar feedback
```

Contenido de las lecciones: `client/src/data/curriculum.ts`. Para agregar
una unidad nueva basta con añadir un objeto `Unit` (vocabulario + frases de
escritura) a ese archivo.

## Próximos pasos posibles

- Agregar más unidades y niveles (intermedio, viajes, entrevistas de
  trabajo, etc.).
- Guardar el progreso en una base de datos para acceder desde varios
  dispositivos.
- Reemplazar los emoji por ilustraciones/fotos reales.
- Integrar Google Cloud Speech-to-Text/Text-to-Speech para voces y
  reconocimiento más naturales en dispositivos sin buen soporte de la Web
  Speech API.
