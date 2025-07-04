# 🎧 Lofi Vibes

Una experiencia web inmersiva centrada en el universo *lofi*: música relajante, visuales animados y una interfaz cuidadosamente diseñada para desconectar del ruido del mundo.

---

## 🌐 Demo en vivo

[Ver sitio desplegado en Render](https://lofi-vibes.onrender.com) <!-- Actualiza este enlace cuando lo tengas -->

---

## 📁 Estructura del proyecto

lofi-vibes/
│
├── public/                  # Archivos estáticos accesibles al cliente
│   ├── assets/
│   │   ├── images/          # Ilustraciones, fondos, íconos
│   │   └── audio/           # Pistas lofi, sonidos ambientales
│   ├── css/
│   │   └── styles.css       # Estilos globales
│   ├── js/
│   │   └── main.js          # Lógica del frontend
│   └── index.html           # Página principal (semántica y accesible)
│
├── src/                     # Código fuente del backend
│   ├── controllers/         # Lógica de negocio (manejo de pistas, usuarios)
│   ├── models/              # Esquemas de base de datos (MongoDB o SQL)
│   ├── routes/              # Rutas de la API (RESTful)
│   ├── services/            # Funciones auxiliares (audio, autenticación)
│   └── app.js               # Configuración principal de Express
│
├── views/                   # Plantillas si usas motor como EJS o Pug
│   └── layout.ejs           # Estructura base reutilizable
│
├── config/                  # Configuración de entorno y base de datos
│   ├── db.js                # Conexión a la base de datos
│   └── env.js               # Variables de entorno
│
├── .env                     # Variables sensibles (puertos, URIs)
├── .gitignore               # Ignorar node_modules, .env, etc.
├── package.json             # Dependencias y scripts
└── README.md                # Documentación del proyecto

---

## 🧠 Características

- 🎵 Reproductor de música lofi con controles personalizados
- 🌌 Visualizador animado con `Canvas` y `Web Audio API`
- 📱 Diseño responsivo con `clamp()` y media queries
- 🧩 Estructura semántica y accesible en HTML5
- ☁️ Preparado para despliegue en Render

---

## 🚀 Instalación local

```bash
git clone https://github.com/tuusuario/lofi-vibes.git
cd lofi-vibes
npm install
npm start

---

🛠️ Tecnologías
HTML5 + CSS3 + JavaScript

Node.js + Express

MongoDB (opcional para futuras funciones)

Render (para despliegue)

📬 Contacto
Creado por Gabriel González Diseño, código y visión por un desarrollador apasionado por la estética y la funcionalidad.

📄 Licencia
MIT © 2025 Gabriel González