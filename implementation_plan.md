# Implementation Plan - Sage (Meeting VIP Alert System)

Based on `meeting_vip_prd.md`, this plan outlines the steps to build the MVP Version 1.0, including the Mobile App and Desktop Electron App.

## Phase 1: Project Initialization & Infrastructure

### 1.1 Repository Setup
- [ ] Initialize git repository in `/Users/mtungi/Desktop/Avizo`.
- [ ] Create `.gitignore` for Node.js, React Native, Electron, and environment files.
- [ ] Set up directory structure:
    - `backend/`
    - `mobile/`
    - `desktop/` (or shared `client/` if sharing code)

### 1.2 Backend Setup (Node.js + Express)
- [ ] Initialize Node.js project in `backend/`.
- [ ] Install core dependencies: `express`, `pg` (Postgres), `sequelize` (or generic ORM), `dotenv`, `cors`.
- [ ] Set up TypeScript configuration (`tsconfig.json`).
- [ ] Create basic Express server structure with health check endpoint.
- [ ] Configure ESLint and Prettier.

### 1.3 Database Setup
- [ ] Set up PostgreSQL database (local or hosted).
- [ ] Define database schema based on PRD Section 6.2:
    - `users`
    - `meetings`
    - `vip_alerts`
    - `notification_logs`
- [ ] Create migration scripts and run initial migrations.

## Phase 2: Backend Core Features

### 2.1 Authentication & Authorization
- [ ] Implement User model.
- [ ] Set up authentication middleware (Passport.js or similar).
- [ ] Implement Google OAuth strategy (Sign in + Calendar scope).
- [ ] Implement Zoom OAuth strategy (Meeting read scope).
- [ ] Create JWT handling for session management.
- [ ] **Endpoints**: `POST /api/auth/signup`, `POST /api/auth/login`.

### 2.2 Calendar & Meeting Integration
- [ ] Integrate Google Calendar API client.
- [ ] Implement logic to fetch "Today's Meetings" from connected Google Calendar.
- [ ] Implement parsing logic to identify Zoom/Meet links from calendar event descriptions/locations.
- [ ] **Endpoints**: 
    - `GET /api/meetings/today`
    - `POST /api/meetings/sync`

### 2.3 VIP Alert Logic & Webhooks
- [ ] Set up Twilio account & SDK for Voice/SMS.
- [ ] Create Webhook endpoint to receive Zoom Participant Join events.
- [ ] Implement Core Logic:
    1. Receive webhook payload.
    2. Check if the meeting ID exists in `meetings` table.
    3. Verify if the joining participant matches a record in `vip_alerts`.
    4. Trigger notification (Call/SMS/Push) via Twilio or Pusher.
- [ ] **Endpoints**: 
    - `POST /api/webhooks/zoom`
    - `POST /api/alerts` (Create VIP alert)
    - `GET /api/alerts/active`

## Phase 3: Mobile App Development (React Native)

### 3.1 Mobile Setup
- [ ] Initialize React Native project (Exp).
- [ ] Install dependencies (React Navigation, UI libraries, State management).
- [ ] Configure absolute paths and basic theming (Fonts, Colors).

### 3.2 Authentication Flows
- [ ] Create Login Screen.
- [ ] Implement "Sign in with Google" flow on mobile.
- [ ] Handle JWT storage securely (SecureStore).

### 3.3 Main UI Implementation
- [ ] **Home Screen (Today's Meetings)**: 
    - List meetings fetched from backend.
    - Implement countdown timers.
- [ ] **Meeting Detail Screen**:
    - Show meeting info.
    - List participants (mocked or fetched if available via API).
    - UI to toggle/select a VIP participant.
- [ ] **Settings Screen**:
    - Manage notification preferences (Call vs Push).
    - View connected accounts status (Zoom/Google).

## Phase 4: Desktop App Development (Electron)

### 4.1 Desktop Setup
- [ ] Initialize Electron project (e.g., using Electron Forge or a specific boilerplate).
- [ ] Set up React front-end for the Electron renderer process.
- [ ] Check if we can share code/components with the React Native web equivalent or keep separate.

### 4.2 Desktop Features
- [ ] **Authentication**: Implement OAuth flow handling in Electron (Deep linking or external browser strategy).
- [ ] **Notifications**: 
    - Integrate with native OS notification system.
    - Connect to a WebSocket/Pusher channel to receive "VIP Joined" events from backend in real-time.
- [ ] **UI Parity**: Replicate "Today's Meetings" and "Meeting Detail" views for desktop form factor.
- [ ] **Tray App**: (Optional) Allow app to minimize to system tray and run in background.

## Phase 5: Integration & Testing

### 5.1 End-to-End Integration
- [ ] Verify Mobile App -> Backend -> Database flow.
- [ ] Verify Desktop App -> Backend -> Database flow.
- [ ] Test Zoom Webhook triggering the actual phone call AND desktop notification.
- [ ] Check Calendar Sync timing and accuracy.

### 5.2 Quality Assurance
- [ ] Unit tests for critical backend logic (participant matching logic).
- [ ] Manual testing on physical device (iOS/Android) and Desktop (macOS).

## Phase 6: Deployment

- [ ] Deploy Backend to Cloud Provider (e.g., Railway, AWS, or Heroku).
- [ ] Set up production PostgreSQL Database.
- [ ] Configure Environment Variables for production.
- [ ] Build Mobile App binaries (APK/IPA).
- [ ] Build Desktop App installers (DMG/EXE).
