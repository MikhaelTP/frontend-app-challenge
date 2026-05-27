# Prueba Técnica - Programador Front-End (React Native)

## Introducción

Esta prueba técnica consiste en desarrollar una aplicación móvil en **React Native** utilizando **Expo**, **Tailwind CSS** y **TypeScript**. El objetivo es crear una interfaz de usuario limpia, escalable y responsive que incluya una calculadora de divisas simulando una llamada a la API de Kambista.

## Diseño en Figma

Para acceder al diseño detallado de la aplicación, por favor utiliza el siguiente enlace de Figma:

[Enlace al diseño en Figma](https://www.figma.com/design/0r7lOY04Vv3Ht9UJItO7yX/Prueba?node-id=0-1&node-type=canvas&t=xY3A9Vp4Xe4zmQCW-0)

Este diseño proporciona una guía visual para la implementación de la interfaz de usuario y el flujo de la aplicación.

## Objetivos de Evaluación

- Creatividad en la resolución de los requerimientos de diseño
- Calidad del código: arquitectura limpia y buenas prácticas
- Implementación de Expo, Tailwind CSS y TypeScript
- Simulación de la API de Kambista para conversión de divisas
- Diseño responsive adaptable a diferentes tamaños de pantalla móvil
- Manejo del estado global (usando Prop Drilling, Context API o Zustand)
- Generación del APK funcional

## Requerimientos de Diseño y Funcionalidad

### Flujo de la Aplicación

1. **Pantalla de Inicio de Sesión/Registro**
2. **Pantalla de Operaciones de Compra/Venta de Divisas**
   - Calculadora de divisas (Soles a Dólares)
   - Simulación de llamada a API de Kambista
3. **Pantalla de Funcionalidades**
4. **Formulario de Creación de Cuenta**
5. **Pantalla de Resumen de Cuentas**

### Navegación

Implementar un menú de navegación inferior para cambiar entre secciones.

## Funcionalidad Requerida

- Diseño responsive adaptable a diferentes tamaños de pantalla.
- Simulación de calculadora de divisas con API de Kambista.
- Navegación fluida entre pantallas
- Manejo de estado global.

## Requisitos Técnicos

- React Native con Expo.
- Tailwind CSS para estilos.
- TypeScript para tipado robusto.
- Simulación de API usando Axios, React Query o alguna otra librería.
- Gestión del estado global (Prop Drilling, Context API o Zustand).

## Simulación de la API

Endpoint a simular:

```
https://api.kambista.com/v1/exchange/calculates?originCurrency=PEN&destinationCurrency=USD&amount={cantidad}&active=S
```

## Gestión del Estado

Opciones:

- Prop Drilling
- Context API
- Zustand

## Requisitos de Entrega

### Repositorio GitHub

1. Hacer fork del repositorio: [Kambista-challenge-app](https://github.com/USERNAME/Kambista-challenge-app)
2. Clonar el fork:
   ```
   git clone git@github.com:USERNAME/FORKED-PROJECT.git
   ```
3. Crear un nuevo branch con tu nombre:
   ```
   git checkout -b {nombre-apellido}
   ```
4. Realizar commits frecuentes
5. Crear un Pull Request y notificar a talentohumano@kambista.com

### APK

Generar y adjuntar un archivo APK usando Expo

## Consideraciones Adicionales

- Modularización del código
- Buenas prácticas de programación
- Manejo adecuado de errores
- Animaciones (opcional)

---

Para cualquier duda o consulta, por favor contactar a talentohumano@kambista.com
