# 🔐 get2fa - Espacios de trabajo TOTP seguros en local

![Status](https://img.shields.io/badge/Status-Production-success)
![Security](https://img.shields.io/badge/Security-Client--Side-violet)
![PWA](https://img.shields.io/badge/PWA-Supported-orange)

[🇺🇸 English](./README.md) | [🇻🇳 Tiếng Việt](./README.vi.md) | [🇨🇳 中文](./README.zh.md) | [🇪🇸 Español](./README.es.md) | [🇯🇵 日本語](./README.ja.md) | [🇩🇪 Deutsch](./README.de.md) | [🇫🇷 Français](./README.fr.md)

`get2fa` es una app TOTP centrada en la privacidad que mantiene tus códigos en local, organizados y listos para usar en escritorio y móvil.

## ✨ Características principales

*   🛡️ **100% del lado del cliente**：Toda la lógica se ejecuta en tu navegador. No se envían datos a ningún servidor.
*   📱 **Compatibilidad con PWA**：Se puede instalar en escritorio y móvil, y funciona **100% sin conexión**.
*   🌍 **Multilenguaje**：Soporta **inglés, vietnamita, chino, español, japonés, alemán y francés**. Detecta automáticamente el idioma del usuario.
*   🎨 **Interfaz moderna**：Diseño Glassmorphism pulido con tipografía **JetBrains Mono**.
*   ⚡ **Arrastrar y soltar**：Reordena tus cuentas de forma intuitiva.
*   🚀 **Buen rendimiento**：Renderizado optimizado y uso fluido.
*   🗂️ **Workspaces**：Separa los códigos por uso personal, trabajo o proyectos.
*   📦 **Copia y restauración**：Importación y exportación JSON para uno o varios workspaces.
*   🌗 **Modo oscuro**：Compatible con el tema del sistema.

---

## 🛠️ Stack tecnológico

*   **Framework**：React 19 + Vite
*   **Lenguaje**：TypeScript
*   **Runtime**：Bun
*   **Estilos**：TailwindCSS v4 + Shadcn UI
*   **Animación**：Framer Motion
*   **PWA**：Vite Plugin PWA
*   **i18n**：i18next

---

## 📲 Progressive Web App (PWA)

Esta aplicación es una PWA, así que puedes instalarla en tu dispositivo para tener una experiencia similar a una app nativa.

*   **Funciona sin conexión**：Consulta tus códigos incluso sin Internet.
*   **Instalar en Chrome/Edge**：Haz clic en el icono de instalación en la barra de direcciones.
*   **Instalar en iOS**：Safari > Compartir > "Añadir a pantalla de inicio".
*   **Instalar en Android**：Chrome > Menú > "Instalar aplicación".

---

## 🚀 Despliegue (Ubuntu + PM2)

Esta guía asume que ya tienes **Bun** y **PM2** instalados.

### 1. Configuración y build
```bash
# Clonar el repositorio
git clone https://github.com/manhlinhfs/get2fa.git
cd get2fa

# Instalar dependencias
bun install

# Compilar para producción
bun run build
```

### 2. Ejecutar con PM2 (recomendado)
Usamos PM2 para servir los archivos estáticos con **soporte SPA**.

```bash
# Iniciar la aplicación en el puerto 3333
pm2 serve dist 3333 --spa --name "get2fa"

# Guardar la lista de PM2 para reiniciar tras reboot
pm2 save
pm2 startup
```

### 3. Actualizar la aplicación
Para actualizar a la versión más reciente:
```bash
git pull --ff-only origin main
bun run build
pm2 restart get2fa
```

---

## ⚠️ Aviso de seguridad

*   **Local Storage**：Los datos se guardan en el `localStorage` del navegador.
*   **Pérdida de datos**：Borrar la caché del navegador **eliminará** tus códigos.
*   **Recomendación**：Exporta siempre una copia de seguridad justo después de añadir nuevas cuentas y guarda el archivo en un lugar seguro (por ejemplo, nube cifrada o USB).

---

<p align="center">
  Creado para la gestión local-first de 2FA.
</p>
