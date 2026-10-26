# 🎃 Atiempo Halloween Spooky Awards — Sistema de Votaciones

Aplicación web moderna desarrollada en **Astro 5 + React 19 + Tailwind CSS**, diseñada especialmente para el concurso de disfraces, comparsas y áreas temáticas de Halloween en **Atiempo**.

---

## 👻 Características y Requerimientos Implementados

### 1. Sistema de Autenticación con 3 Roles:
- 👑 **1) Administrador (`admin`):**
  - **Creación de usuarios:** Registra usuarios asignando nombre, nombre de usuario (`username`), rol y su **grupo de Halloween**.
  - **Creación de categorías:** Permite crear categorías **Grupales** (equipos) o **Individuales** (personas/disfraces).
  - **Acceso a la tabla de puntuación:** Visualiza en vivo el podio y ranking general con votos detallados.
  - **Herramientas de control:** Monitoreo del censo electoral (quién ya votó y quién está pendiente) y botón para resetear votos para nuevas pruebas.
- 🎃 **2) Usuario Normal (`user`):**
  - Al iniciar sesión, va **directamente a la ventana de votación**.
  - **Regla estricta de juego limpio:** **NO PUEDE VOTAR POR EL GRUPO AL QUE PERTENECE**. Su propio equipo aparece bloqueado con un candado y advertencia.
  - **Voto único e irreversible:** Apenas envía su calificación, el sistema bloquea el formulario permanentemente y le muestra la pantalla de agradecimiento y confirmación de voto sellado.
- 🧙‍♀️ **3) Gestión Humana (`gh`):**
  - Funciona con las mismas reglas de votación de un usuario normal (vota una sola vez y no puede autovotar por su propio equipo).
  - **Diferencia clave:** Tiene acceso completo en la barra superior a la **Tabla de Puntuación en Tiempo Real**.

---

### 2. Dinámica de Preguntas y Puntuaciones:
- **Categorías Grupales (Equipos):**
  - Las opciones son los nombres de los equipos de Halloween.
  - Cada voto suma **1 punto** al equipo seleccionado en la tabla de clasificación.
- **Categorías Individuales (Personas):**
  - Las opciones son nombres de personas candidatas y sus disfraces.
  - Cuenta con su propia **Tabla de Puntuación Individual** para premiar al mejor disfraz.

---

### 3. Paleta Visual y Temática Spooky:
- Fondo oscuro interactivo con resplandores neón naranja y morado, murciélagos animados flotantes y telarañas.
- Efectos de celebración con **confetti temático** (naranja, negro, slime verde, violeta y dorado) al confirmar la votación.
- Selector rápido de demostración en el encabezado para alternar entre roles en un solo clic y probar todos los flujos fácilmente.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

```bash
# 1. Instalar dependencias (ya instaladas)
npm install

# 2. Iniciar el servidor de desarrollo en http://localhost:4321
npm run dev

# 3. Compilar para producción
npm run build

# 4. Previsualizar la compilación de producción
npm run preview
```

---

## 👥 Perfiles de Prueba Precargados (Demo)

Puedes iniciar sesión ingresando el nombre de usuario o pulsando directamente sobre cualquiera de ellos en la pantalla de bienvenida:

| Rol | Usuario | Nombre | Equipo Asignado |
| :--- | :--- | :--- | :--- |
| **👑 Administrador** | `admin` | Sebastián Administrador | Comité Organizador |
| **🧙‍♀️ Gestión Humana** | `carolina.gh` | Carolina Morales | Las Brujas de Gestión Humana |
| **🧛‍♂️ Usuario Normal** | `carlos.dev` | Carlos Mendoza | Los Vampiros de Tecnología |
| **👻 Usuario Normal** | `laura.ops` | Laura Restrepo | Fantasmas de Operaciones |
| **🧟‍♂️ Usuario Normal** | `jorge.conta` | Jorge Gómez | Zombis de Contabilidad |

---

## ☁️ Próxima Fase: Conexión con Terraform

La arquitectura estática / SSR de Astro está lista para desplegarse en infraestructura como código:
- **Opción A (Serverless AWS):** S3 + CloudFront + API Gateway + DynamoDB + Lambda con Terraform.
- **Opción B (Docker / Contenedor):** AWS ECS Fargate o GCP Cloud Run aprovisionado mediante Terraform.
- **Opción C (Edge Computing):** Cloudflare Pages / AWS Amplify.
