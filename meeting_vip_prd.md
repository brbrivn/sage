# Product Requirements Document (PRD)
## Sage - Meeting VIP Alert System

**Version:** 1.0 (MVP)  
**Date:** December 26, 2025  
**Status:** Draft  
**Owner:** Product Team

---

## 1. Executive Summary

### 1.1 Product Overview
Sage is a mobile-first application that eliminates the need to join meetings early or wait while muted. By syncing with your calendar and meeting platforms (Zoom, Google Meet), it detects when specific people you're tracking join the meeting and immediately alerts you with a notification or alarm, providing a direct link to join instantly. No more waiting, no more guessing - join exactly when it matters.

### 1.2 Problem Statement
Professionals with back-to-back meetings face:
- **Wasted time** joining meetings early and waiting for key participants
- **Meeting fatigue** from sitting muted while waiting for decision-makers
- **Missed context** when joining late after important people have started
- **Inefficiency** monitoring attendee lists or repeatedly checking if someone joined
- **Time zone challenges** staying awake for meetings that may start late

### 1.3 Target Users
- **Primary:** Executives and managers with 10+ meetings per day
- **Secondary:** Remote workers across multiple time zones
- **Tertiary:** Sales professionals waiting for client decision-makers
- **Quaternary:** Anyone who values their time and wants meeting efficiency

### 1.4 Success Metrics
- 95%+ accuracy in detecting when tracked participants join
- <30 second notification delay from participant join to user alert
- 70%+ weekly active user retention
- Users track participants in 5+ meetings per week
- Average 15+ minutes saved per user per day

---

## 2. MVP Scope

### 2.1 In Scope (Must Have)
✅ **Platform Integration:**
- Zoom meeting monitoring and participant detection
- Google Meet meeting monitoring (via Chrome extension)
- Google Calendar sync for automatic meeting discovery
- Real-time participant join detection

✅ **Participant Tracking:**
- Select specific people to track per meeting
- Track 1-3 people per meeting (MVP: 1 person)
- Visual indicators showing who you're tracking
- Easy change/cancel of tracked participants

✅ **Smart Notifications:**
- Phone call alert (bypasses Do Not Disturb)
- Push notification option
- In-app alarm with custom sound
- Notification includes participant name and meeting title

✅ **Instant Join:**
- Direct meeting link in notification
- One-tap join from notification
- SMS backup with meeting link
- Deep link directly into Zoom/Meet app

✅ **Core Features:**
- Today's meetings view with countdown timers
- Connection status for Zoom/Meet/Calendar
- Settings for notification preferences
- Mobile app (iOS and Android)
- Desktop app (Electron) for native notifications

### 2.2 Out of Scope (Future Versions)
❌ Microsoft Teams support (Phase 2)
❌ Outlook Calendar sync (Phase 2)

❌ Meeting transcription/recording
❌ Calendar write-back or meeting management
❌ Team/enterprise features (Phase 4)
❌ AI-powered features (Phase 3)

---

## 3. User Flows

### 3.1 First-Time User Onboarding
```
1. User downloads app from App Store/Play Store
2. User signs up with email or social auth
3. User connects Zoom account (OAuth)
4. User connects Google Calendar (OAuth)
5. Optional: Install Google Meet Chrome extension
6. App syncs today's meetings automatically
7. User sees welcome tutorial (explaining participant tracking)
8. User lands on Today's Meetings view
```

### 3.2 Setting Up Participant Tracking
```
1. User opens app to Today's Meetings view
2. User sees list of upcoming meetings with countdown timers
3. User taps a meeting card to open details
4. User sees meeting details and full participant list
5. User taps one participant name to track (e.g., "Brian Chen - CEO")
6. Green confirmation shows "Tracking Brian Chen - You'll be notified when they join"
7. User can change notification method (call/push/alarm) if desired
8. User returns to home screen
9. User goes about their day without joining meeting early
```

### 3.3 Receiving an Alert When Tracked Person Joins
```
1. Tracked participant (Brian Chen) joins the Zoom meeting at 2:05 PM
2. Meeting platform detects Brian's join within 5 seconds
3. System verifies Brian matches the tracked participant
4. System triggers user's chosen notification method within 30 seconds
5. User's phone rings/vibrates with alert: "Brian Chen joined Q4 Strategy Review"
6. User taps notification or answers call
7. Direct link opens Zoom/Meet app automatically
8. User joins meeting instantly - Brian is already there
9. Total time from Brian joining to user joining: <60 seconds
10. Meeting flows naturally without awkward "waiting for host" moments
```

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization
- **FR-1.1:** Users must be able to sign up with email/password
- **FR-1.2:** Users must be able to sign in with Google OAuth
- **FR-1.3:** Users must authorize Zoom account access via OAuth 2.0
- **FR-1.4:** Users must authorize Google Calendar read access
- **FR-1.5:** System must securely store OAuth tokens with encryption
- **FR-1.6:** Optional: Users can install Google Meet Chrome extension for Meet monitoring

### 4.2 Calendar & Meeting Platform Integration
- **FR-2.1:** System must sync Google Calendar events every 5 minutes (configurable)
- **FR-2.2:** System must detect and parse Zoom meeting links from calendar events
- **FR-2.3:** System must detect and parse Google Meet links from calendar events
- **FR-2.4:** System must display only meetings scheduled for current day
- **FR-2.5:** System must show meeting title, time, platform icon, and participant count
- **FR-2.6:** System must display countdown timer ("in 2h 15m" or "Starting now")
- **FR-2.7:** System must maintain active connections to Zoom and Google Meet platforms
- **FR-2.8:** System must show connection status for each platform (connected/disconnected)

### 4.3 Meeting Monitoring & Participant Detection
- **FR-3.1:** System must subscribe to Zoom webhooks for real-time participant join events
- **FR-3.2:** System must receive participant join notifications from Google Meet extension
- **FR-3.3:** System must detect when a tracked participant joins a monitored meeting within 10 seconds
- **FR-3.4:** System must match participant identity using email address or display name
- **FR-3.5:** System must handle multiple simultaneous meeting monitors per user
- **FR-3.6:** System must gracefully handle webhook/extension failures with retry logic
- **FR-3.7:** System must stop monitoring after meeting ends or user cancels tracking
- **FR-3.8:** System must handle participants who join, leave, and rejoin meetings

### 4.4 Participant Tracking Selection
- **FR-4.1:** Users must be able to view all invited participants for a meeting
- **FR-4.2:** Users must be able to select exactly one participant to track per meeting (MVP)
- **FR-4.3:** System must show clear visual indicator of which participant is being tracked
- **FR-4.4:** System must allow users to change tracked participant until meeting starts
- **FR-4.5:** Users must be able to cancel participant tracking before meeting starts
- **FR-4.6:** System must show visual confirmation when tracking is active
- **FR-4.7:** System must persist tracking selection across app restarts

### 4.5 Notification & Alert System
- **FR-5.1:** System must trigger notification within 30 seconds of tracked participant joining
- **FR-5.2:** Users must be able to choose notification method: Phone Call, Push Notification, or In-App Alarm
- **FR-5.3:** Phone call must display custom caller ID showing participant name
- **FR-5.4:** Push notification must show participant name and meeting title
- **FR-5.5:** In-app alarm must play at high volume with vibration
- **FR-5.6:** All notifications must include direct "Join Now" action
- **FR-5.7:** System must send SMS with meeting link as backup (phone call only)
- **FR-5.8:** System must handle user not responding (retry once after 30 seconds for calls)
- **FR-5.9:** System must log all notification attempts for debugging
- **FR-5.10:** Notification must deep-link directly into Zoom/Meet app when tapped

### 4.6 Instant Meeting Join
- **FR-6.1:** Users must be able to join meeting with single tap from notification
- **FR-6.2:** System must provide direct meeting URL in all notifications
- **FR-6.3:** Deep link must open native Zoom/Meet app if installed
- **FR-6.4:** System must fallback to web browser if app not installed
- **FR-6.5:** Join action must work from locked screen (if permitted)
- **FR-6.6:** System must track successful join completions

### 4.7 Settings & Preferences
- **FR-7.1:** Users must see connection status for Zoom, Google Meet, and Calendar
- **FR-7.2:** Users must be able to disconnect and reconnect each platform independently
- **FR-7.3:** Users must see last calendar sync timestamp
- **FR-7.4:** Users must be able to manually trigger calendar sync
- **FR-7.5:** Users must be able to configure sync frequency (5/15/30 minutes)
- **FR-7.6:** Users must be able to select default notification method
- **FR-7.7:** Users must be able to test notifications before meetings
- **FR-7.8:** Users must be able to configure Do Not Disturb schedule

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **NFR-1.1:** App must load Today's Meetings view in <2 seconds
- **NFR-1.2:** Calendar sync must complete in <5 seconds for up to 20 meetings
- **NFR-1.3:** VIP detection and call trigger must occur in <30 seconds
- **NFR-1.4:** App must support 1,000+ concurrent users

### 5.2 Reliability
- **NFR-2.1:** System uptime must be 99.5% or higher
- **NFR-2.2:** VIP detection accuracy must be 95%+ (false negatives/positives)
- **NFR-2.3:** System must handle Zoom API rate limits gracefully
- **NFR-2.4:** Webhook failures must retry with exponential backoff

### 5.3 Security
- **NFR-3.1:** All OAuth tokens must be encrypted at rest (AES-256)
- **NFR-3.2:** API communications must use HTTPS/TLS 1.3
- **NFR-3.3:** User phone numbers must be hashed and never logged in plain text
- **NFR-3.4:** System must comply with GDPR for EU users

### 5.4 Scalability
- **NFR-4.1:** Database must support 10,000+ users without performance degradation
- **NFR-4.2:** System must handle 100+ simultaneous webhook events
- **NFR-4.3:** Twilio integration must queue calls if concurrent limit reached

### 5.5 Usability
- **NFR-5.1:** New users must complete onboarding in <3 minutes
- **NFR-5.2:** Setting a VIP alert must require ≤3 taps
- **NFR-5.3:** App must follow iOS Human Interface and Material Design guidelines
- **NFR-5.4:** All text must be legible with minimum 16px font size

---

## 6. Technical Architecture

### 6.1 Tech Stack

**Mobile App:**
- React Native 0.73+ (iOS 14+, Android 10+)
- TypeScript for type safety
- Redux or Zustand for state management
- React Navigation for routing

**Desktop App:**
- Electron (integrated with React web codebase if possible)
- Native notification API support


**Backend:**
- Node.js 20+ with Express.js
- PostgreSQL 15+ for data persistence
- Redis for session management and caching
- Hosted on AWS (EC2/ECS) or Railway

**Third-Party Services:**
- Zoom API (webhooks + OAuth)
- Google Calendar API
- Twilio Voice + SMS API
- SendGrid for transactional emails

### 6.2 Data Model

**User Table:**
```sql
- user_id (PK)
- email
- phone_number (encrypted)
- zoom_token (encrypted)
- google_token (encrypted)
- created_at
- last_login
```

**Meeting Table:**
```sql
- meeting_id (PK)
- user_id (FK)
- calendar_event_id
- zoom_meeting_id
- title
- start_time
- end_time
- participants (JSON array)
- created_at
```

**VIP Alert Table:**
```sql
- alert_id (PK)
- user_id (FK)
- meeting_id (FK)
- vip_name
- vip_email
- status (active/triggered/cancelled)
- triggered_at
- created_at
```

**Notification Log Table:**
```sql
- log_id (PK)
- alert_id (FK)
- notification_type (call/sms)
- status (sent/failed/answered)
- attempt_number
- created_at
```

### 6.3 API Endpoints

**Authentication:**
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/auth/zoom/callback` - Zoom OAuth callback
- `GET /api/auth/google/callback` - Google OAuth callback

**Meetings:**
- `GET /api/meetings/today` - Get today's meetings for user
- `POST /api/meetings/sync` - Manually trigger calendar sync
- `GET /api/meetings/:id` - Get meeting details with participants

**VIP Alerts:**
- `POST /api/alerts` - Create VIP alert for meeting
- `PUT /api/alerts/:id` - Update VIP selection
- `DELETE /api/alerts/:id` - Cancel VIP alert
- `GET /api/alerts/active` - Get all active alerts for user

**Webhooks:**
- `POST /api/webhooks/zoom` - Receive Zoom participant events

**Settings:**
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

---

## 7. User Interface Specifications

### 7.1 Key Screens

**Home Screen - Today's Meetings:**
- Header: Date, current time, settings icon
- Connection status bar (Zoom connected, last sync time)
- "Add Meeting Manually" button (dashed border)
- Meeting cards showing:
  - Platform icon (Zoom blue)
  - Meeting title
  - Time + countdown ("in 2h 15m")
  - Participant count
  - Chevron to enter

**Meeting Detail Screen:**
- Back button
- Meeting info card (platform icon, title, time, countdown)
- "Who should trigger your alert?" header
- Participant list (tappable cards)
- Selected participant shows phone icon + checkmark
- Green confirmation box when VIP selected

**Settings Screen:**
- Connected Accounts section (Zoom status)
- Notification Method (Phone Call selected by default)
- Calendar Sync frequency selector

### 7.2 Design Principles
- **Minimalist:** No unnecessary UI elements
- **One action per screen:** Focus user on single task
- **Clear feedback:** Visual confirmation for all actions
- **Accessible:** High contrast, large tap targets (44x44px minimum)

---

## 8. Business Requirements

### 8.1 Pricing Strategy (MVP)
- **Free Tier:** 5 VIP alerts per month
- **Pro Tier:** $9.99/month - Unlimited alerts
- **Annual:** $99/year (17% discount)

### 8.2 Cost Structure
- Twilio Voice: ~$0.013 per minute (avg 30 sec call = $0.0065)
- Twilio SMS: ~$0.0079 per message
- Cost per notification: ~$0.015
- Target margin: 80%+ at Pro tier

### 8.3 Go-to-Market Strategy
- **Beta Launch:** 20 hand-picked users (executives/managers)
- **Feedback Loop:** Weekly surveys + in-app feedback
- **Public Launch:** Product Hunt, HackerNews, LinkedIn
- **Distribution:** App Store + Google Play Store

---

## 9. Dependencies & Risks

### 9.1 Critical Dependencies
- **Zoom API Stability:** Changes could break participant detection
- **Twilio Reliability:** Call delivery failures impact core experience
- **Google Calendar API:** Rate limits could affect sync frequency
- **App Store Approval:** Review process may delay launch

### 9.2 Risk Mitigation
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Zoom API changes | High | Medium | Monitor Zoom changelog, maintain API version flexibility |
| Phone calls marked as spam | High | Medium | Use verified Twilio numbers, clear caller ID |
| Poor VIP detection accuracy | High | Low | Extensive testing, webhook retry logic |
| User privacy concerns | Medium | Low | Clear privacy policy, minimal data collection |
| High Twilio costs | Medium | Medium | Optimize call duration, consider tiered pricing |

---

## 10. Success Criteria & Metrics

### 10.1 Launch Criteria (Beta)
- [ ] 20 beta users onboarded
- [ ] 95%+ VIP detection accuracy over 100 test meetings
- [ ] <30 second average notification delay
- [ ] Zero critical bugs in production

### 10.2 MVP Success Metrics (30 days post-launch)
- **Acquisition:** 500+ downloads
- **Activation:** 60%+ complete onboarding
- **Engagement:** 5+ VIP alerts set per active user per week
- **Retention:** 40%+ week 2 retention
- **Revenue:** 10% conversion to paid tier

### 10.3 KPIs to Track
- Daily active users (DAU)
- VIP alerts set per user
- Notification success rate
- Call answer rate
- Time from VIP join to user joining meeting
- Churn rate by cohort

---

## 11. Timeline & Milestones

### Phase 1: Foundation (Week 1-2)
- [ ] Backend infrastructure setup (AWS/Railway)
- [ ] Database schema implementation
- [ ] User authentication system
- [ ] Zoom OAuth integration
- [ ] Google Calendar OAuth integration

### Phase 2: Core Features (Week 3-4)
- [ ] Zoom webhook integration for participant events
- [ ] VIP tracking and detection logic
- [ ] Twilio call + SMS integration
- [ ] Calendar sync worker (5-minute intervals)

### Phase 3: Mobile App (Week 5-6)
- [ ] React Native project setup
- [ ] Today's Meetings UI
- [ ] Meeting detail + VIP selection UI
- [ ] Settings screen
- [ ] Push notification handling (for call backup)

### Phase 4: Testing & Polish (Week 7)
- [ ] End-to-end testing with real Zoom meetings
- [ ] Beta user testing (10 users)
- [ ] Bug fixes and performance optimization
- [ ] App Store/Play Store submission

### Phase 5: Launch (Week 8)
- [ ] App Store approval received
- [ ] Public launch announcement
- [ ] Monitor metrics and user feedback
- [ ] Rapid iteration based on feedback

---

## 12. Open Questions

1. **How do we handle meetings with >50 participants?** Display all or show search?
2. **Should we allow VIP alerts for meetings already in progress?** Yes, but may miss early attendees.
3. **What happens if user has multiple meetings at same time?** Allow VIP selection for both, prioritize first trigger.
4. **Should we support international phone numbers from day 1?** Yes, Twilio supports global calls.
5. **How do we verify Zoom meeting host permissions?** User must be invited participant with calendar access.

---

## 13. Appendix

### 13.1 Competitive Analysis
- **Calendly:** Meeting scheduling, no VIP alerts
- **Reclaim.ai:** Calendar optimization, no real-time participant tracking
- **Clara/x.ai:** Meeting scheduling assistants, no Zoom integration
- **Direct competition:** None identified (greenfield opportunity)

### 13.2 User Research Insights
- 78% of surveyed managers attend 8+ meetings daily (source: internal survey)
- Average time wasted waiting in meetings: 15 minutes/day
- Most requested feature: "Tell me when my boss joins the call"

### 13.3 References
- [Zoom Webhooks Documentation](https://developers.zoom.us/docs/api/rest/webhooks/)
- [Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [Twilio Voice API](https://www.twilio.com/docs/voice)

---

**Document Control:**
- **Created:** December 26, 2025
- **Last Updated:** December 26, 2025
- **Next Review:** January 15, 2026
- **Approved By:** [Pending]