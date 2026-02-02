# ☕ Tazita - Rastreador de Café

Una aplicación web cozy y divertida para llevar el control de tus cafés diarios, con temática Pompompurin 🍮

## ✨ Características

- **🎨 Temática Pompompurin**: Diseño adorable con colores amarillos, cremas y rosas suaves
- **📱 Mobile-first**: Optimizada para usar desde el celular
- **☕ Tipos de café**: Instantáneo, Cápsula, Expresso, Especialidad, Café Frío, Starbucks
- **📝 Notas**: Agregá notas personalizadas a cada café (ej: "con leche", "estaba delicioso")
- **📊 Estadísticas**: Visualizá tus preferencias y patrones de consumo
- **🔥 Streak**: Seguimiento de días consecutivos tomando café
- **📅 Calendario**: Vista mensual con todos tus registros
- **💾 Persistencia**: Guardado automático en localStorage
- **🔑 Código de recuperación**: Exportá e importá tus datos fácilmente
- **📤 Compartir**: Generá imágenes bonitas para compartir tus stats en redes

## 🚀 Deploy en Vercel

### Opción 1: Deploy automático (Recomendado)

1. Creá una cuenta en [Vercel](https://vercel.com) (gratis)
2. Conectá tu cuenta de GitHub
3. Importá este repositorio
4. ¡Listo! Vercel detectará automáticamente que es un proyecto Next.js

### Opción 2: Deploy manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Opción 3: Subir archivos estáticos

Los archivos ya están generados en la carpeta `dist/`. Podés subirlos a cualquier hosting estático:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
- O cualquier servidor web

## 🛠️ Tecnologías

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **Framer Motion** - Animaciones
- **html2canvas** - Generación de imágenes

## 📁 Estructura del proyecto

```
my-app/
├── app/                    # Páginas de Next.js
│   ├── globals.css        # Estilos globales + tema Pompompurin
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── AddCoffeeButton.tsx
│   ├── CoffeeTypeModal.tsx
│   ├── Calendar.tsx
│   ├── Counter.tsx
│   ├── Streak.tsx
│   ├── Stats.tsx
│   ├── RecoveryCode.tsx
│   └── ShareStats.tsx
├── hooks/                 # Custom hooks
│   └── useCoffeeData.ts   # Manejo de datos
├── types/                 # Tipos TypeScript
│   └── coffee.ts
└── components/ui/         # Componentes shadcn/ui
```

## 🎨 Paleta de colores Pompompurin

- **Amarillo principal**: `#FFE4A1`
- **Marrón café**: `#8B6F47`
- **Marrón claro**: `#D4A574`
- **Crema**: `#FFF8E7`
- **Rosa suave**: `#FFD1DC`
- **Texto oscuro**: `#5C4A3A`

## 📝 Uso

1. Abrí la app en tu celular
2. Tocá el botón amarillo (+) para agregar un café
3. Seleccioná el tipo de café
4. Opcional: agregá una nota
5. ¡Listo! Se guarda automáticamente

### Recuperar datos en otro dispositivo:

1. Andá a Configuración (⚙️)
2. Copiá el código de recuperación o descargá el backup
3. En el nuevo dispositivo, andá a Configuración > Cargar
4. Pegá el código o el contenido del archivo

## 🎁 Para tu novia

Esta app fue hecha con mucho cariño 💛

- Diseño adorable y cozy
- Animaciones suaves y divertidas
- Fácil de usar desde el celular
- Sus cafés siempre guardados

## 📄 Licencia

Hecho con ☕ y 🍮 - Para uso personal

---

**Nota**: Los datos se guardan localmente en el navegador. Usá el código de recuperación para hacer backup!
