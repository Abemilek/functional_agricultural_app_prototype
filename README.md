# CosechaClima - Prototipo funcional

CosechaClima es un prototipo de aplicacion movil/web para pequeños productores agropecuarios de Carazo, Nicaragua. Su objetivo es convertir informacion climatica en decisiones de campo concretas mediante un semaforo diario de riesgo y tres acciones prioritarias para proteger cultivos de maiz y frijol.

## Problema que atiende

Los pequenos productores de Carazo enfrentan lluvias intensas, caniculas, vientos fuertes y exceso de humedad que pueden afectar directamente sus cosechas. Las entrevistas realizadas para el informe mostraron que el problema principal no es saber cuando sembrar, sino saber que hacer cuando el clima cambia de forma inesperada durante una cosecha ya sembrada.

CosechaClima propone una solucion enfocada en accion inmediata:

- Semaforo de riesgo climatico: verde, amarillo o rojo.
- Tres acciones concretas para ejecutar ese dia.
- Recomendaciones segun cultivo, etapa fenologica y tipo de suelo.
- Alertas mediante SMS nativo, sin pasarela externa.
- Bitacora para registrar alertas y acciones completadas.

## Alcance del prototipo

Este repositorio contiene un prototipo visual y funcional de navegacion. No es una aplicacion Android final ni consume datos reales en tiempo real. Su objetivo es validar flujo, interfaz y propuesta de valor antes del desarrollo en Flutter.

El prototipo incluye 12 pantallas principales:

1. Splash / bienvenida.
2. Tutorial: semaforo del dia.
3. Tutorial: tres acciones para hoy.
4. Tutorial: alertas sin internet.
5. Login por numero telefonico.
6. Verificacion OTP.
7. Registro de cultivo.
8. Registro de ubicacion.
9. Fecha de siembra.
10. Tipo de suelo.
11. Configuracion de umbrales.
12. Dashboard principal con tabs de Inicio, Alertas y Bitacora.

## Funciones representadas

- Registro de cultivo: maiz o frijol.
- Seleccion de municipio de Carazo.
- Fecha o periodo aproximado de siembra.
- Seleccion de tipo de suelo: franco, arcilloso, arenoso o desconocido.
- Configuracion de umbrales:
  - Lluvia intensa.
  - Viento fuerte.
  - Canicula.
  - Variedad del cultivo.
  - Disponibilidad de riego.
  - Horario de alerta SMS.
- Dashboard con clima simulado, nivel de riesgo y tres acciones.
- Alerta roja simulada por riesgo de paleo/antracnosis en frijol.
- Boton para preparar SMS con mensaje prellenado.
- Bitacora de campo con eventos y acciones registradas.

## Base tecnica planteada en el informe

Aunque este repositorio contiene solo el prototipo web, el informe plantea la arquitectura futura:

- Cliente movil: Flutter.
- Backend: ASP.NET Core.
- Base de datos: Azure SQL Database.
- Almacenamiento local: SQLite / SharedPreferences.
- Fuente climatica principal: NASA POWER Agroclimatology API.
- Referencia agronomica: fichas tecnicas del INTA Nicaragua.
- Alertas SMS: Intent nativo de Android, sin Twilio ni pasarela externa.
- Motor de decisiones: arbol cerrado de 90 reglas, sin IA generativa.

El motor de decisiones se basa en cuatro variables:

- Tipo de evento climatico.
- Cultivo registrado.
- Etapa fenologica.
- Tipo de suelo.

## Estructura del proyecto

```text
.
├── functional_prototype/
   ├── index.html
   ├── styles.css
   └── script.js
    └── README.md


```

## Como ejecutar el prototipo

No requiere instalacion, servidor local ni dependencias.

1. Abrir la carpeta del proyecto.
2. Entrar a `functional_prototype/`.
3. Abrir `index.html` directamente en el navegador.

Tambien se puede abrir desde la ruta:

```text
functional_prototype/index.html
```

## Como probar vista movil

El prototipo es responsive. En escritorio se abre como pagina web normal y en pantallas pequenas se adapta a vista movil.

Para probarlo como celular desde Firefox, Chrome o Edge:

1. Abrir `functional_prototype/index.html`.
2. Presionar `F12` para abrir herramientas de desarrollador.
3. Activar el modo de dispositivo movil.
4. Seleccionar un telefono o definir un ancho como 390 x 844.
5. Recargar la pagina si es necesario.

## Estado actual

Estado: prototipo navegable de alta fidelidad.

Completado:

- Flujo de onboarding.
- Login y verificacion simulada.
- Registro productivo.
- Configuracion de umbrales.
- Dashboard con semaforo.
- Alertas simuladas.
- Bitacora.
- Adaptacion responsive para escritorio y movil.

Pendiente para una version real:

- Implementar app movil en Flutter.
- Conectar API de NASA POWER.
- Implementar motor real de 90 reglas.
- Persistir datos localmente.
- Validar reglas con tecnico agronomo.
- Realizar pruebas de usabilidad con productores.

## Equipo y contexto

Proyecto academico desarrollado para el Concurso Multidisciplinario de Aplicaciones Moviles Creativas, Segunda Edicion, CUR Carazo.

Nombre del proyecto en el informe: AgroGuard Carazo.

Nombre de la aplicacion: CosechaClima - Tu semaforo de decisiones climaticas para el campo.
