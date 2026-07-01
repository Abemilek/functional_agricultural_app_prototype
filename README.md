# CosechaClima — Prototipo funcional

Prototipo navegable de alta fidelidad para validar flujo, interfaz y lógica antes del desarrollo en Flutter. Sirve como **especificación interactiva** del comportamiento esperado en la app Android final.

---

## Flujo completo del prototipo

```
Splash → Tutorial (3 pasos) → Crear PIN → Confirmar PIN → Cultivo → Ubicación →
Fecha de siembra → Tipo de suelo → Umbrales → Dashboard
                                                      ├── Inicio (semáforo + 3 acciones)
                                                      ├── Alertas (protocolo emergencia + SMS)
                                                      └── Bitácora (historial)
```

### 1. Splash (`#splash`)
Pantalla de bienvenida con marca, ubicación simulada (Carazo, Nicaragua) y botón "Comenzar".
- **En Flutter**: Mostrar una sola vez en primera ejecución, luego ir directo a validación de PIN.

### 2. Tutorial (`#tutorial-1`, `#tutorial-2`, `#tutorial-3`)
3 pantallas que explican: semáforo de riesgo, 3 acciones por alerta, alertas offline por SMS nativo.
- Botón "Omitir tutorial" salta a Crear PIN.
- **En Flutter**: Mostrar solo en primera ejecución. Almacenar flag en SharedPreferences.

### 3. Crear PIN (`#create-pin`)
El usuario ingresa su **nombre** y crea un **PIN de 4 dígitos**.
- El nombre se usa para el saludo en el Dashboard ("Buenos días, [nombre]").
- El PIN se almacena localmente con **hash SHA-256** (simulado en prototipo).
- **No hay SMS, no hay número telefónico, no hay OTP**.
- **En Flutter**:
  ```dart
  // Guardar PIN con hash al confirmar
  final hash = sha256.convert(utf8.encode(pin)).toString();
  await prefs.setString('user_pin_hash', hash);
  await prefs.setString('user_name', nombre);
  ```

### 4. Confirmar PIN (`#confirm-pin`)
El usuario repite los 4 dígitos para confirmar.
- Botón "Crear otro PIN" regresa a la pantalla anterior.
- **En Flutter**: Validar que ambos PIN coincidan antes de hash.

### 5. Registro de cultivo (`#crop`)
Selección visual: **Maíz** o **Frijol**.
- Determina las fichas técnicas del INTA que aplican.
- **En Flutter**: Guardar en SQLite como `cropType: 'maiz' | 'frijol'`.

### 6. Ubicación de parcela (`#location`)
GPS detectado con confirmación manual de **Municipio**.
- Opciones: Diriamba, Jinotepe, San Marcos, Dolores.
- La coordenada se usa para consultar NASA POWER.
- **En Flutter**: Obtener lat/lng real con `geolocator`, mapear a municipio.

### 7. Fecha de siembra (`#date`)
Selección de fecha relativa o exacta.
- Opciones: "Esta semana", "Hace 2-3 semanas", "Hace más de un mes", o fecha exacta tipo `date`.
- Determina la **etapa fenológica** calculada automáticamente.
- **En Flutter**: Calcular etapa restando días desde hoy:
  ```dart
  enum Etapa { germinacion, plantula, desarrollo, floracion, llenado, maduracion }
  Etapa calcularEtapa(DateTime siembra, String cultivo) { ... }
  ```

### 8. Tipo de suelo (`#soil`)
Selección visual: **Franco**, **Arcilloso**, **Arenoso** o "No sé".
- El tipo de suelo es la 4ª variable del motor de decisiones.
- **En Flutter**: Guardar en SQLite como `soilType`.

### 9. Umbrales (`#thresholds`)
Configuración personalizada de 6 parámetros:
| Parámetro | Rango | Default |
|---|---|---|
| Lluvia intensa | 50–150 mm/24h | 100 mm/24h |
| Viento fuerte | 20–60 km/h | 40 km/h |
| Canícula | 5–15 días secos | 7 días |
| Variedad | Criollo / Híbrido / Mejorado | Criollo |
| Riego | Sí / No | No |
| Horario SMS | 5:00–8:00 AM | 6:00 AM |

- **En Flutter**: Guardar en SQLite, cargar en el motor de decisiones.

### 10. Dashboard (`#dashboard`)
Pantalla principal con 3 tabs:

#### Tab Inicio
- **Card resumen**: ubicación, nivel de riesgo (verde/amarillo/rojo), temperatura, clima, humedad, viento, lluvia.
- **Alerta activa**: riesgo de paleo/antracnosis con descripción.
- **3 acciones del día**: numeradas, con checkbox para marcar como completadas.
- **Fuentes**: NASA POWER + INTA.

#### Tab Alertas
- **Protocolo de emergencia**: alerta roja con acciones prioritarias.
- **Botón SMS**: abre el cliente nativo con mensaje preescrito:
  ```
  sms:?body=ALERTA%20CosechaClima%3A%20riesgo%20alto%20de%20paleo%20en%20frijol.%20...
  ```
- **Modo offline**: la alerta funciona sin internet.

#### Tab Bitácora
- Línea de tiempo con alertas anteriores y acciones completadas.
- Cada entrada muestra: fecha, nivel de riesgo, evento, acciones tomadas.
- Botón "Compartir historial".

---

## Motor de decisiones (árbol de 90 reglas)

El prototipo simula el motor. En Flutter debe implementarse como:

```dart
String decidirAccion({
  required String evento,    // lluvia_intensa | canicula | viento_fuerte | temp_extrema | helada
  required String cultivo,   // maiz | frijol
  required Etapa etapa,      // germinacion | plantula | desarrollo | floracion | llenado | maduracion
  required String suelo,     // franco | arcilloso | arenoso
  Map<String, int> umbrales, // configuración del usuario
}) {
  // Árbol if-else cerrado, 90 combinaciones posibles
  // Retorna 3 acciones en lenguaje coloquial nicaragüense
}
```

Las variables de entrada son exactamente 4 (5 eventos × 2 cultivos × 6 etapas × 3 suelos = 180 combinaciones, de las cuales ~90 son válidas según las fichas técnicas del INTA).

---

## Datos simulados vs. reales

| Dato | Prototipo | Flutter real |
|---|---|---|
| Clima (temp, humedad, viento, lluvia) | Valores fijos | API NASA POWER (`GET /api/temporal/daily/point`) |
| GPS | Simulado ("Carazo, Nicaragua") | `geolocator` + coordenadas reales |
| Nivel de riesgo | Hardcodeado (rojo) | Calculado del motor de 90 reglas |
| Acciones del día | Texto fijo | Generadas por el motor según 4 variables |
| Bitácora | Entradas fijas | SQLite local con registro automático |
| PIN | Visual (sin hash real) | SHA-256 + SharedPreferences |
| SMS | `href="sms:..."` | `Intent(Intent.ACTION_SENDTO, Uri.parse("sms:"))` en Android |

---

## Arquitectura objetivo (Flutter + C# + SQL Server)

```
┌─────────────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Flutter App       │────▶│  ASP.NET Core    │────▶│  Azure SQL    │
│  (Android 8.0+)     │◀────│  (Azure App Svc) │◀────│  Database     │
│                     │     │                  │     │               │
│  - PIN local (SHA)  │     │  - Motor 90 reg. │     │  - Usuarios   │
│  - SQLite offline   │     │  - NASA POWER    │     │  - Parcelas   │
│  - SMS native       │     │  - Alertas push  │     │  - Bitácora   │
│  - FCM notif. push  │     │  - FCM sender    │     │  - Umbrales   │
└─────────────────────┘     └──────────────────┘     └───────────────┘
```

### Decisiones clave para la fase real

1. **Autenticación**: PIN local con SHA-256. No hay login remoto, no hay SMS OTP, no hay Firebase Auth.
   - El PIN nunca sale del dispositivo.
   - Si el usuario olvida el PIN: opción "Restablecer" que borra datos locales y reinicia registro.

2. **Datos offline**: SQLite local con caché de 5 días de pronóstico NASA POWER.
   - Sincronización cuando haya conexión.

3. **Alertas**: Canal dual:
   - **Push**: Firebase Cloud Messaging (gratis, sin límite) para notificaciones normales.
   - **SMS**: Intent nativo de Android (ACTION_SENDTO) solo para alertas ROJAS como respaldo.

4. **Motor de decisiones**: Árbol cerrado en C# (API REST), con fallback local en SQLite
   si no hay conexión al backend.

5. **Costo mensual estimado**: ~USD 20 (Azure App Service B1 + SQL Basic).
   Cero costo en SMS: el Intent nativo no tiene tarifa por mensaje.

---

## Cómo ejecutar el prototipo

No requiere instalación, servidor ni dependencias.

1. Abrir `index.html` directamente en el navegador.
2. Para vista móvil: F12 → modo dispositivo → seleccionar 390×844.
3. Navegar haciendo clic en botones.

---