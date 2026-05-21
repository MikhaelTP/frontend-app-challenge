Prueba Técnica - Programador Front-End (React Native)
Introducción
Esta prueba técnica consiste en desarrollar una aplicación móvil en React Native utilizando Expo, Tailwind CSS y TypeScript. El objetivo es crear una interfaz de usuario limpia, escalable y responsive que incluya una calculadora de divisas simulando una llamada a la API de Kambista.

Diseño en Figma
Para acceder al diseño detallado de la aplicación, por favor utiliza el siguiente enlace de Figma:

Enlace al diseño en Figma

Este diseño proporciona una guía visual para la implementación de la interfaz de usuario y el flujo de la aplicación.

Objetivos de Evaluación
Creatividad en la resolución de los requerimientos de diseño
Calidad del código: arquitectura limpia y buenas prácticas
Implementación de Expo, Tailwind CSS y TypeScript
Simulación de la API de Kambista para conversión de divisas
Diseño responsive adaptable a diferentes tamaños de pantalla móvil
Manejo del estado global (usando Prop Drilling, Context API o Zustand)
Generación del APK funcional
Requerimientos de Diseño y Funcionalidad
Flujo de la Aplicación
Pantalla de Inicio de Sesión/Registro
Pantalla de Operaciones de Compra/Venta de Divisas
Calculadora de divisas (Soles a Dólares)
Simulación de llamada a API de Kambista
Pantalla de Funcionalidades
Formulario de Creación de Cuenta
Pantalla de Resumen de Cuentas
Navegación
Implementar un menú de navegación inferior para cambiar entre secciones.

Funcionalidad Requerida
Diseño responsive adaptable a diferentes tamaños de pantalla.
Simulación de calculadora de divisas con API de Kambista.
Navegación fluida entre pantallas
Manejo de estado global.
Requisitos Técnicos
React Native con Expo.
Tailwind CSS para estilos.
TypeScript para tipado robusto.
Simulación de API usando Axios, React Query o alguna otra librería.
Gestión del estado global (Prop Drilling, Context API o Zustand).
Simulación de la API
Endpoint a simular:

https://api.kambista.com/v1/exchange/calculates?originCurrency=PEN&destinationCurrency=USD&amount={cantidad}&active=S
Gestión del Estado
Opciones:

Prop Drilling
Context API
Zustand
Requisitos de Entrega
Repositorio GitHub
Hacer fork del repositorio: Kambista-challenge-app
Clonar el fork:
git clone git@github.com:USERNAME/FORKED-PROJECT.git
Crear un nuevo branch con tu nombre:
git checkout -b {nombre-apellido}
Realizar commits frecuentes
Crear un Pull Request y notificar a talentohumano@kambista.com
APK
Generar y adjuntar un archivo APK usando Expo

Criterios de Evaluación
Calidad de código: Arquitectura limpia, modularización y buenas prácticas.
Fidelidad al diseño: Fidelidad y creatividad en la resolución de los requerimientos de diseño
Performance: Componentes optimizados y manejo eficiente de estado.
Mantenibilidad: Prioriza legibilidad y escalabilidad, con estructura de archivos clara y consistente.
Bonus (Opcional)

Animaciones
Agregar en la documentación (README.md) las decisiones técnicas relevantes
