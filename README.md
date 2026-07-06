# CosechaClima — Functional Prototype

High-fidelity, fully navigable HTML/CSS/JS prototype for an agricultural decision-support mobile application. Designed for **Nicaraguan smallholder farmers**, it simulates the complete user journey from onboarding to daily risk alerts based on crop, soil, weather, and personalized thresholds.

---

## Quick Start

No build tools, servers, or dependencies required.

1. Open `index.html` in any modern browser.
2. For mobile view: press `F12` → toggle device emulation → select **390×844** (iPhone 14 Pro) or similar.
3. Navigate by clicking buttons and interactive elements throughout each screen.

**Desktop mode**: when the viewport is ≥1024px with a fine-pointing device (mouse/trackpad), the prototype centers itself inside a 430px-wide phone mockup on a dark background for presentation on laptops and projectors.

---

## User Flow

```
Splash → Tutorial (3 steps) → Create PIN → Confirm PIN → Crop → Location →
Planting Date → Soil Type → Thresholds → Dashboard
                                            ├── Home (traffic light + 3 actions)
                                            ├── Alerts (emergency protocol + SMS)
                                            └── Log (timeline history)
```

---

## Screen-by-Screen Walkthrough

### 1. Splash
Brand presentation with app name, tagline, and a "Start" button. Displays a simulated location (Carazo, Nicaragua) and the current agricultural cycle version.

### 2. Tutorial (3 steps)
Three slides that introduce the app's core value propositions:

- **Step 1**: Daily traffic-light risk assessment (green / amber / red)
- **Step 2**: Three concrete actions per alert — no lengthy videos, no theory
- **Step 3**: Offline SMS alerts that work without internet connection

A "Skip tutorial" button is available on each slide.

### 3. Create PIN
The user enters their **name** and defines a **4-digit security PIN**.

- The name personalizes the dashboard greeting ("Good morning, [name]").
- The PIN is stored locally on the device only — no phone number, no SMS OTP, no remote server.
- An info card explains that the PIN is encrypted with SHA-256 and never leaves the device.

### 4. Confirm PIN
The user re-enters the 4-digit PIN to confirm it matches.

- Validation ensures both PINs are identical and all 4 digits are filled.
- A "Create another PIN" link allows starting over from the previous screen.

### 5. Crop Selection
Visual choice between the two main staple crops in Nicaragua: **Maize (Maíz)** and **Beans (Frijol)**.

- The selected crop determines which technical guidelines apply for risk assessment.
- An info note explains that maize and beans have different thresholds for drought, rain, and wind.

### 6. Location
Shows GPS-detected department (Carazo) and asks the user to select their **municipality** from four options: Diriamba, Jinotepe, San Marcos, or Dolores.

- The municipality determines the hyperlocal weather data source (NASA POWER).
- The GPS indicator is simulated in the prototype.

### 7. Planting Date
Relative or exact planting date selection:

- Quick options: "This week", "2–3 weeks ago", "More than a month ago"
- An exact date picker for precise input
- The **phenological stage** (germination, growth, flowering, grain filling) is derived automatically from the date

### 8. Soil Type
Visual selection of soil type: **Loam**, **Clay**, **Sandy**, or "I don't know".

- Soil type is one of the four core variables feeding the decision engine.
- Each soil type modifies risk behavior (clay waterlogs, sand drains fast, loam is balanced).

### 9. Thresholds
Personalized configuration of six parameters:

| Parameter | Range | Default |
|---|---|---|
| Heavy rain | 50–150 mm/24h | 100 mm/24h |
| Strong wind | 20–60 km/h | 40 km/h |
| Dry spell | 5–15 dry days | 7 days |
| Crop variety | Criollo / Hybrid / Improved | Criollo |
| Irrigation available | On / Off | Off |
| SMS alert time | 5:00–8:00 AM | 6:00 AM |

Users can accept the recommended values or adapt them to their own field experience.

### 10. Dashboard
The main screen with three tabs:

#### Home Tab
- **Summary card**: temperature, weather condition, humidity, wind, rainfall, location, and risk level (red in the prototype)
- **Active alert**: a concrete risk scenario (e.g., paleo/anthracnose in beans) with description
- **3 actions of the day**: numbered tasks with completion checkboxes
- **Data sources**: NASA POWER (weather) and INTA (technical guidelines)

#### Alerts Tab
- **Emergency protocol**: high-risk alert with prioritized actions
- **SMS button**: opens the native messaging client with a pre-written alert message — no gateway, no cost
- **Offline mode**: the alert works with cached data and the device's native SMS

#### Log Tab
- **Field log timeline**: past alerts and completed actions with date, risk level, and event description
- **Share history** button for community reporting

---

## Decision Engine (90-rule simulation)

The prototype simulates a closed decision tree that takes four variables as input:

- **Weather event** (heavy rain, dry spell, strong wind, extreme temperature, frost)
- **Crop type** (maize, beans)
- **Phenological stage** (germination, seedling, development, flowering, filling, maturation)
- **Soil type** (loam, clay, sandy)

These 4 variables × 5 events × 2 crops × 6 stages × 3 soils yield ~180 combinations, of which ~90 are agronomically valid according to INTA technical sheets. Each combination produces three actionable recommendations in colloquial Nicaraguan farming language.

---

## Benefits & Rationale

### Why a local PIN instead of cloud-based authentication?

- Many farming areas in Nicaragua have limited or unreliable internet connectivity.
- A PIN stored locally with SHA-256 eliminates dependency on remote servers, SMS gateways, or third-party authentication providers.
- Zero recurring infrastructure cost for authentication.

### Why SMS for critical alerts instead of push-only?

- Push notifications require persistent internet connectivity and device-specific services (FCM).
- Native SMS works on any mobile phone with cellular signal — no data plan required.
- SMS is widely understood and trusted by farmers in the region.
- Zero cost: the Android `ACTION_SENDTO` intent uses the built-in messaging app without any per-message fee.

### Why a 90-rule decision tree instead of ML/AI?

- A deterministic, auditable engine can be validated row-by-row by agronomists from INTA.
- No training data, no model drift, no black-box decisions.
- The rules are documented, explainable, and easy to update as new INTA technical sheets are published.
- The closed tree fits entirely in device-local SQLite for offline operation.

---

**URL**: https://functional-agricultural-app-prototype.netlify.app/
