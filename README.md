# Clases de Inglés 🎓

Aplicación web interactiva para aprender inglés **desde cero**, pensada para
adultos hispanohablantes de El Salvador. Combina presentaciones visuales de
vocabulario con actividades de **listening**, **speaking** y **writing**, y
usa la API de Claude (Anthropic) para corregir la escritura y dar
retroalimentación de pronunciación adaptada al nivel de cada estudiante.

Desplegada en **Vercel**: el frontend (Vite) y el backend (funciones
serverless) viven en un solo proyecto.

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

- **Frontend**: React + TypeScript + Vite + Tailwind CSS. Usa la
  [Web Speech API](https://developer.mozilla.org/docs/Web/API/Web_Speech_API)
  del navegador para texto-a-voz (escuchar) y voz-a-texto (hablar) — sin
  costo y sin necesitar credenciales de Google. Funciona mejor en
  **Chrome** (escritorio o Android).
- **Backend**: funciones serverless de Vercel (Node.js) en `client/api/`,
  que llaman a la API de Claude:
  - `POST /api/correct` — corrige un ejercicio de escritura.
  - `POST /api/speak-feedback` — da un consejo de pronunciación.
  - `GET /api/health` — healthcheck, indica si Claude está configurado.

  La llave de API nunca se expone al navegador: solo vive en el entorno de
  las funciones serverless.

> ¿Por qué no la API de reconocimiento de voz de Google Cloud? Para una
> primera versión gratuita y sin fricción de configuración se usa la Web
> Speech API nativa del navegador. Si más adelante se necesita mejor
> precisión (por ejemplo, para evaluar acentos con más detalle), se puede
> añadir Google Cloud Speech-to-Text como reemplazo del reconocimiento de
> voz en `client/src/lib/speech.ts` sin cambiar el resto de la app.

## Desplegar en Vercel

El proyecto está pensado para desplegarse directo desde este repositorio de
GitHub, con la **raíz del proyecto (Root Directory) configurada como
`client`** (ahí vive el `package.json`, el frontend Vite y las funciones en
`api/`).

1. En [vercel.com](https://vercel.com), importa este repositorio de GitHub
   (`Add New... -> Project`).
2. En **Root Directory**, selecciona `client`. Vercel detecta Vite
   automáticamente (build command `vite build`, output `dist`) y las
   funciones dentro de `client/api/` sin configuración extra.
3. En **Environment Variables**, agrega:
   - `ANTHROPIC_API_KEY` — tu llave de [console.anthropic.com](https://console.anthropic.com/).
     Sin esta variable la app sigue funcionando, pero usando el modo de
     corrección local en vez de Claude.
4. Deploy. Cada push a la rama de producción despliega automáticamente.

Si ya tienes la [Vercel CLI](https://vercel.com/docs/cli) instalada, también
puedes hacerlo desde la terminal:

```bash
cd client
vercel link        # conecta esta carpeta con el proyecto de Vercel
vercel env add ANTHROPIC_API_KEY
vercel deploy       # preview
vercel deploy --prod
```

## Cómo correrlo localmente

Requiere Node.js 18 o superior.

**Opción A — solo frontend (más simple, sin llamadas a Claude):**

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Las llamadas a `/api/*` no responderán (no hay
servidor local para ellas), así que la app usa automáticamente su modo de
corrección local — sigue siendo utilizable para probar todo el flujo.

**Opción B — frontend + funciones serverless (recomendado para probar Claude):**

Requiere la [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`) y
haber enlazado el proyecto (`vercel link`, una sola vez).

```bash
cd client
cp .env.example .env.local
# Edita .env.local y pega tu ANTHROPIC_API_KEY
vercel dev
```

Esto corre el frontend y las funciones de `api/` juntos, tal como en
producción.

## Estructura del proyecto

```
client/
  src/     App de React (interfaz, actividades, contenido de las lecciones)
  api/     Funciones serverless de Vercel que llaman a Claude
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
