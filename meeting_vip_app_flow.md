# App Flow Document
## Meeting VIP - Complete User Journey Maps

**Version:** 1.0  
**Date:** December 26, 2025  
**Status:** Draft  
**Document Owner:** Product & Design Team

---

## Table of Contents
1. [Overview](#1-overview)
2. [User Journey Maps](#2-user-journey-maps)
3. [Screen Flow Diagrams](#3-screen-flow-diagrams)
4. [Interaction Patterns](#4-interaction-patterns)
5. [Error & Edge Case Flows](#5-error--edge-case-flows)
6. [Notification Flows](#6-notification-flows)
7. [Settings & Configuration Flows](#7-settings--configuration-flows)
8. [Multi-Platform Flows](#8-multi-platform-flows)

---

## 1. Overview

### 1.1 Purpose
This document maps all user flows through the Meeting VIP application, from first-time onboarding through daily usage patterns, error states, and advanced features.

### 1.2 Flow Notation

```
┌────────┐
│ Screen │  = App Screen
└────────┘

┌─ ─ ─ ─┐
  Modal    = Modal/Dialog
└─ ─ ─ ─┘

[Action]    = User Action/Tap
{Decision}  = System Decision Point
→           = Flow Direction
```

### 1.3 Core User Goals

1. **Setup Goal:** Connect platforms and sync meetings
2. **Daily Goal:** Track important people, get notified, join instantly
3. **Management Goal:** Configure preferences and manage connections

---

## 2. User Journey Maps

### 2.1 First-Time User Journey (Happy Path)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIRST-TIME USER JOURNEY                       │
│                  Duration: 3-5 minutes                           │
└─────────────────────────────────────────────────────────────────┘

START: User downloads app
    ↓
┌──────────────────┐
│  Splash Screen   │  (2 seconds - app initializing)
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Welcome Screen  │
│  - App logo      │
│  - Tagline       │
│  - [Get Started] │
└────────┬─────────┘
         │
    [Tap Get Started]
         │
         ↓
┌──────────────────┐
│  Sign Up Screen  │
│  - Email field   │
│  - Password      │
│  - [Sign Up]     │
│  - [Google SSO]  │
└────────┬─────────┘
         │
    [Enter credentials & submit]
         │
         ↓
    {Account Created}
         │
         ↓
┌──────────────────┐
│ Onboarding 1/3   │
│ "Connect Zoom"   │
│  - Illustration  │
│  - Explanation   │
│  - [Connect Now] │
│  - [Skip]        │
└────────┬─────────┘
         │
    [Tap Connect Now]
         │
         ↓
┌──────────────────┐
│  Zoom OAuth      │  (External - Zoom website)
│  - Login to Zoom │
│  - Authorize app │
└────────┬─────────┘
         │
    [User authorizes]
         │
         ↓
    {Zoom Connected ✓}
         │
         ↓
┌──────────────────┐
│ Onboarding 2/3   │
│ "Connect Calendar│
│  - Illustration  │
│  - Explanation   │
│  - [Connect Now] │
│  - [Skip]        │
└────────┬─────────┘
         │
    [Tap Connect Now]
         │
         ↓
┌──────────────────┐
│ Google OAuth     │  (External - Google)
│ - Select account │
│ - Grant calendar │
│   permissions    │
└────────┬─────────┘
         │
    [User authorizes]
         │
         ↓
    {Calendar Connected ✓}
    {Syncing meetings...}
         │
         ↓
┌──────────────────┐
│ Onboarding 3/3   │
│ "How It Works"   │
│  - Track people  │
│  - Get notified  │
│  - Join instantly│
│  - [Got It!]     │
└────────┬─────────┘
         │
    [Tap Got It]
         │
         ↓
┌──────────────────┐
│ Today's Meetings │  ← MAIN APP SCREEN
│  - Header (time) │
│  - Meeting cards │
│  - Empty state?  │
└──────────────────┘

END: User ready to use app
```

**Success Criteria:**
- ✅ User completes signup
- ✅ Zoom connected
- ✅ Calendar connected
- ✅ At least 1 meeting synced
- ✅ User lands on main screen

**Drop-off Points to Monitor:**
1. Sign up form abandonment
2. Zoom OAuth cancellation
3. Calendar OAuth denial
4. No meetings found (empty state)

---

### 2.2 Daily Usage Journey (Core Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                    DAILY USAGE JOURNEY                           │
│              Duration: 30 seconds per meeting                    │
└─────────────────────────────────────────────────────────────────┘

START: User opens app (9:00 AM)
    ↓
┌──────────────────────────────────┐
│     Today's Meetings Screen      │
│                                  │
│  ┌────────────────────────────┐ │
│  │ Q4 Strategy Review         │ │
│  │ 2:00 PM • in 5h            │ │
│  │ 🔵 Zoom • 8 participants   │ │
│  └────────────────────────────┘ │
│                                  │
│  ┌────────────────────────────┐ │
│  │ Product Demo               │ │
│  │ 3:30 PM • in 6h 30m        │ │
│  │ 🟢 Meet • 5 participants   │ │
│  └────────────────────────────┘ │
│                                  │
│  ┌────────────────────────────┐ │
│  │ Team Standup               │ │
│  │ 4:00 PM • in 7h            │ │
│  │ 🔵 Zoom • 12 participants  │ │
│  └────────────────────────────┘ │
└──────────────┬───────────────────┘
               │
    [User taps "Q4 Strategy Review"]
               │
               ↓
┌──────────────────────────────────┐
│    Meeting Detail Screen         │
│                                  │
│  🔵 Q4 Strategy Review           │
│  2:00 PM • Starting in 5h        │
│  https://zoom.us/j/123...        │
│                                  │
│  ─────────────────────────────  │
│  Track someone for this meeting: │
│                                  │
│  ┌────────────────────────────┐ │
│  │ ○ Brian Chen (CEO)         │ │  ← Tappable
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ ○ Sarah Johnson (CFO)      │ │  ← Tappable
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ ○ Mike Torres (COO)        │ │  ← Tappable
│  └────────────────────────────┘ │
│  + 5 more participants          │
└──────────────┬───────────────────┘
               │
    [User taps "Brian Chen (CEO)"]
               │
               ↓
┌──────────────────────────────────┐
│    Meeting Detail Screen         │
│    (Updated with selection)      │
│                                  │
│  🔵 Q4 Strategy Review           │
│  2:00 PM • Starting in 5h        │
│                                  │
│  ┌────────────────────────────┐ │
│  │ ✓ Brian Chen (CEO)         │ │  ← Selected
│  │ 📞 Tracking active         │ │
│  └────────────────────────────┘ │
│                                  │
│  ┌────────────────────────────┐ │
│  │ ✅ You'll be notified when │ │
│  │    Brian Chen joins        │ │
│  │                            │ │
│  │    [Change Person]         │ │
│  │    [Cancel Tracking]       │ │
│  └────────────────────────────┘ │
│                                  │
│  [← Back to Meetings]            │
└──────────────┬───────────────────┘
               │
    [User taps Back]
               │
               ↓
┌──────────────────────────────────┐
│     Today's Meetings Screen      │
│     (Shows tracking indicator)   │
│                                  │
│  ┌────────────────────────────┐ │
│  │ Q4 Strategy Review    👁️  │ │  ← Eye icon
│  │ 2:00 PM • in 5h            │ │
│  │ 🔵 Zoom • 8 participants   │ │
│  │ Tracking: Brian Chen       │ │  ← Status
│  └────────────────────────────┘ │
└──────────────┬───────────────────┘
               │
    [User closes app, goes about day]
               │
               ↓
    ⏰ 2:05 PM - Brian joins meeting
               │
               ↓
┌──────────────────────────────────┐
│   NOTIFICATION RECEIVED          │
│   (Phone rings / Push / Alarm)   │
│                                  │
│   📞 Meeting VIP                 │
│                                  │
│   Brian Chen joined              │
│   Q4 Strategy Review             │
│                                  │
│   [Join Now]  [Dismiss]          │
└──────────────┬───────────────────┘
               │
    [User taps "Join Now"]
               │
               ↓
    {Deep link opens Zoom app}
               │
               ↓
┌──────────────────────────────────┐
│      Zoom App Opens              │
│      Joining meeting...          │
│      ✓ Brian Chen is here        │
└──────────────────────────────────┘

END: User successfully joined meeting when it mattered
     Total time from notification to joined: <10 seconds
```

**Success Metrics:**
- Time to set tracking: <30 seconds
- Notification delivery: <30 seconds after participant joins
- Join completion rate: >90%

---

### 2.3 Multi-Meeting Day Journey

```
┌─────────────────────────────────────────────────────────────────┐
│              BUSY DAY - MULTIPLE MEETINGS                        │
│                   Duration: Full day                             │
└─────────────────────────────────────────────────────────────────┘

9:00 AM - User opens app
    ↓
Views 5 meetings for today
    ↓
Sets tracking for 3 meetings:
  • 10:00 AM Client Call → Track "Jennifer (Client)"
  • 2:00 PM Strategy → Track "Brian (CEO)"
  • 4:30 PM Review → Track "Sarah (CFO)"
    ↓
Closes app, starts work
    ↓
─────────────────────────────────────
10:05 AM - Jennifer joins
    ↓
🔔 Notification received
    ↓
User joins immediately
    ↓
Meeting flows naturally (30 min)
    ↓
─────────────────────────────────────
2:03 PM - Brian joins
    ↓
🔔 Notification received
    ↓
User in another meeting, dismisses
    ↓
Opens app, manually joins via link
    ↓
─────────────────────────────────────
4:25 PM - User proactively checks
    ↓
Opens app, sees "Starting in 5m"
    ↓
Decides to join early anyway
    ↓
Taps meeting card → [Join Now]
    ↓
Joins via direct link
    ↓
Sarah joins at 4:32 PM
    ↓
No notification sent (user already in meeting)
    ↓
─────────────────────────────────────

END: User saved time on 2/3 meetings
     Total time saved: ~10 minutes
```

---

## 3. Screen Flow Diagrams

### 3.1 Main App Navigation Structure

```
                    ┌─────────────────┐
                    │   App Launch    │
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
          {First Time?}           {Returning User}
                  │                     │
                  ↓                     ↓
         ┌────────────────┐    ┌────────────────┐
         │   Onboarding   │    │ Today's        │
         │   Flow         │    │ Meetings       │
         └────────┬───────┘    └────────┬───────┘
                  │                     │
                  └──────────┬──────────┘
                             │
                             ↓
                    ┌────────────────┐
                    │ Today's        │ ← HOME SCREEN
                    │ Meetings       │
                    │                │
                    │ - Meeting List │
                    │ - Status Bar   │
                    │ - Settings Btn │
                    └────┬───────┬───┘
                         │       │
              ┌──────────┘       └──────────┐
              │                             │
              ↓                             ↓
     ┌────────────────┐           ┌────────────────┐
     │ Meeting Detail │           │ Settings       │
     │                │           │                │
     │ - Participants │           │ - Accounts     │
     │ - Track Person │           │ - Notifications│
     │ - Join Link    │           │ - Preferences  │
     └────────────────┘           └────────────────┘
```

### 3.2 Meeting Detail Screen Flow

```
Today's Meetings Screen
         │
    [Tap Meeting Card]
         │
         ↓
┌─────────────────────────────────────┐
│     Meeting Detail Screen           │
│                                     │
│  Meeting Info (top)                 │
│  ├─ Title                           │
│  ├─ Time & Countdown                │
│  ├─ Platform icon                   │
│  └─ Join URL                        │
│                                     │
│  Action Buttons                     │
│  ├─ [Join Now] (if meeting started) │
│  └─ [Add to Calendar]               │
│                                     │
│  Participant Tracking (main)        │
│  ├─ "Track someone:"                │
│  ├─ Participant List (scrollable)   │
│  │   ├─ ○ Person 1                  │
│  │   ├─ ○ Person 2                  │
│  │   └─ ○ Person 3                  │
│  └─ [Show All X Participants]       │
│                                     │
│  Confirmation (if tracking set)     │
│  └─ ✅ Tracking: [Name]             │
│      ├─ [Change Person]             │
│      └─ [Cancel Tracking]           │
└─────────────────────────────────────┘
         │
         ├──[Tap Participant]──────────┐
         │                             │
         │                             ↓
         │                    Tracking set
         │                    Show confirmation
         │                             │
         │                             │
         ├──[Tap Change Person]────────┤
         │                             │
         │                             ↓
         │                    Clear selection
         │                    Allow new selection
         │                             │
         │                             │
         ├──[Tap Cancel Tracking]──────┐
         │                             │
         │                             ↓
         │                    ┌─ ─ ─ ─ ─ ─ ─ ─┐
         │                      Confirm Dialog
         │                    │ Cancel tracking?│
         │                     [Yes]  [No]
         │                    └─ ─ ─ ─ ─ ─ ─ ─┘
         │                             │
         │                      [Yes]  │  [No]
         │                        │    │
         │                        ↓    ↓
         │                    Clear   Dismiss
         │                    tracking
         │                        │
         ├──[Tap Join Now]────────┐
         │                        │
         │                        ↓
         │               Open meeting platform
         │               (Zoom/Meet app or web)
         │                        │
         ├──[Tap Back]────────────┐
         │                        │
         ↓                        ↓
    Return to               Return to
    Today's Meetings        Today's Meetings
```

### 3.3 Settings Screen Flow

```
[Tap Settings Icon from Header]
         │
         ↓
┌─────────────────────────────────────┐
│        Settings Screen              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Connected Accounts          │   │
│  │                             │   │
│  │ 🔵 Zoom                     │   │
│  │ ✓ Connected                 │   │
│  │ [Disconnect]                │───┼──→ Disconnect flow
│  │                             │   │
│  │ 🟢 Google Meet              │   │
│  │ ✓ Extension Installed       │   │
│  │ [Manage]                    │───┼──→ Extension settings
│  │                             │   │
│  │ 📅 Google Calendar          │   │
│  │ ✓ Connected                 │   │
│  │ Last synced: 2m ago         │   │
│  │ [Sync Now] [Disconnect]     │───┼──→ Manual sync
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Notification Method         │   │
│  │                             │   │
│  │ ○ Phone Call (Default)      │───┼──→ Set notification type
│  │ ○ Push Notification         │   │
│  │ ○ In-App Alarm              │   │
│  │                             │   │
│  │ [Test Notification]         │───┼──→ Send test
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Preferences                 │   │
│  │                             │   │
│  │ Calendar Sync Frequency     │   │
│  │ [5 min] [15 min] [30 min]   │───┼──→ Set sync interval
│  │                             │   │
│  │ Do Not Disturb              │   │
│  │ [Configure Schedule]        │───┼──→ DND settings
│  │                             │   │
│  │ Language                    │   │
│  │ [English ▼]                 │───┼──→ Language picker
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Account                     │   │
│  │ [Edit Profile]              │───┼──→ Profile editor
│  │ [Change Password]           │───┼──→ Password change
│  │ [Privacy Policy]            │───┼──→ Open policy
│  │ [Terms of Service]          │───┼──→ Open terms
│  │ [Log Out]                   │───┼──→ Logout confirmation
│  └─────────────────────────────┘   │
│                                     │
│  [← Back]                           │
└─────────────────────────────────────┘
```

---

## 4. Interaction Patterns

### 4.1 Pull-to-Refresh Pattern

```
Today's Meetings Screen (at top)
         │
    [User pulls down]
         │
         ↓
    Loading spinner appears
         │
         ↓
    API call to sync calendar
         │
    ┌────┴────┐
    │         │
Success    Error
    │         │
    ↓         ↓
Update    Show error
list      toast
    │         │
    └────┬────┘
         │
         ↓
    Spinner disappears
    "Last synced: just now"
```

### 4.2 Swipe Actions on Meeting Cards

```
┌────────────────────────────┐
│ Meeting Card               │
│ Q4 Strategy Review         │◄──── Swipe left
│ 2:00 PM • in 5h            │      reveals actions
└────────────────────────────┘

         Swipe ←
              │
              ↓
┌────────────────────┬───┬───┬───┐
│ Meeting Card       │📝 │👁️│🗑️│
│ Q4 Strategy...     │   │   │   │
└────────────────────┴───┴───┴───┘
                      │   │   │
                      │   │   └─→ Delete/Hide
                      │   └─────→ Track person
                      └─────────→ Edit meeting

[Tap action] → Execute action
[Tap card] → Swipe closes, return to normal
```

### 4.3 Long-Press Context Menu

```
[User long-presses meeting card]
         │
         ↓
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
  Context Menu
│                           │
  📋 Copy Meeting Link
│ 👁️ Track Someone          │
  📞 Join Now
│ 📅 Open in Calendar       │
  🗑️ Hide Meeting
│ ❌ Cancel                  │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
         │
    [Select option]
         │
         ↓
    Execute action
```

### 4.4 Search/Filter Meetings

```
Today's Meetings Screen
         │
    [Tap Search Icon]
         │
         ↓
┌─────────────────────────────────────┐
│  🔍 [Search meetings...]            │
│                                     │
│  Filters:                           │
│  [All] [Zoom] [Meet] [Tracked]      │
│                                     │
│  ───────────────────────────────   │
│  Results:                           │
│  ┌─────────────────────────────┐   │
│  │ Q4 Strategy Review          │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         │
    [Type query]
         │
         ↓
    Filter results in real-time
         │
    [Tap result]
         │
         ↓
    Open meeting detail
```

---

## 5. Error & Edge Case Flows

### 5.1 No Internet Connection Flow

```
User opens app
         │
    {Check connectivity}
         │
         ├─ Connected ─→ Normal flow
         │
         └─ No connection
                │
                ↓
┌─────────────────────────────────────┐
│     Offline Mode                    │
│                                     │
│  ⚠️ No Internet Connection          │
│                                     │
│  Showing cached meetings:           │
│  ┌─────────────────────────────┐   │
│  │ Q4 Strategy Review (cached) │   │
│  └─────────────────────────────┘   │
│                                     │
│  Some features unavailable:         │
│  • Can't set new tracking           │
│  • Can't sync calendar              │
│  • Notifications may not work       │
│                                     │
│  [Retry Connection]                 │
└─────────────────────────────────────┘
         │
    [Connection restored]
         │
         ↓
    Sync automatically
    Show success toast
    Enable all features
```

### 5.2 No Meetings Found Flow

```
Calendar sync completes
         │
    {Check meeting count}
         │
    ┌────┴────┐
    │         │
   >0        =0
    │         │
    │         ↓
    │   ┌─────────────────────────────┐
    │   │ Empty State                 │
    │   │                             │
    │   │ 📅 No meetings today        │
    │   │                             │
    │   │ You're all clear!           │
    │   │ Enjoy your free time        │
    │   │                             │
    │   │ [Refresh] [Add Meeting]     │
    │   └─────────────────────────────┘
    │                │
    │           [Tap Refresh]
    │                │
    └────────────────┘
         │
         ↓
    Sync calendar again
```

### 5.3 OAuth Connection Failed Flow

```
User attempts to connect Zoom
         │
    Redirect to Zoom OAuth
         │
    ┌────┴────┐
    │         │
Success    Failure
    │         │
    │         ├─ User denied permission
    │         ├─ Network error
    │         └─ Invalid credentials
    │         │
    ↓         ↓
Connect   ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
success     Connection Failed
    │     │                           │
    │       ⚠️ Couldn't connect Zoom
    │     │                           │
    │       Reason: [Error message]
    │     │                           │
    │       [Try Again] [Skip]
    │     └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
    │                │
    │           [Try Again]
    │                │
    └────────────────┘
         │
         ↓
    Retry OAuth flow
```

### 5.4 Participant Not in Meeting Flow

```
User tracks "Brian Chen"
         │
    Meeting time: 2:00 PM
         │
    2:00 PM - Meeting starts
         │
    System monitors participants
         │
    2:05 PM, 2:10 PM, 2:15 PM...
         │
    Brian never joins
         │
    2:30 PM - Meeting ends
         │
         ↓
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
  Notification (optional)
│                                 │
  ℹ️ Meeting ended
│ Brian Chen didn't join          │
  Q4 Strategy Review
│                                 │
  [OK]
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
         │
    [User dismisses]
         │
         ↓
    Tracking auto-cancelled
    Meeting archived
```

### 5.5 Webhook Delivery Failure Flow

```
Brian joins meeting at 2:05 PM
         │
    Zoom attempts webhook delivery
         │
    ┌────┴────┐
    │         │
Success    Failure (timeout/500 error)
    │         │
    │         ↓
    │    Retry #1 (5 seconds later)
    │         │
    │    ┌────┴────┐
    │    │         │
    │  Success  Failure
    │    │         │
    │    │         ↓
    │    │    Retry #2 (15 seconds later)
    │    │         │
    │    │    ┌────┴────┐
    │    │    │         │
    │    │  Success  Failure
    │    │    │         │
    │    │    │         ↓
    │    │    │    Log error
    │    │    │    Fallback: Poll API
    │    │    │         │
    └────┴────┴─────────┘
         │
         ↓
    Notification sent
    (may be delayed if fallback used)
```

---

## 6. Notification Flows

### 6.1 Phone Call Notification Flow

```
Tracked participant joins
         │
    System detects join
         │
    {User notification preference?}
         │
    "Phone Call"
         │
         ↓
┌─────────────────────────────────────┐
│  Initiate Twilio Call               │
│  - To: User's phone                 │
│  - Caller ID: "Meeting VIP: Brian"  │
│  - TwiML: Voice message             │
└────────┬────────────────────────────┘
         │
    Phone rings
         │
    ┌────┴────┐
    │         │
 Answered  No Answer (30s timeout)
    │         │
    │         ↓
    │    Retry call (30s later)
    │         │
    │    ┌────┴────┐
    │    │         │
    │  Answered  No Answer
    │    │         │
    │    │         ↓
    │    │    Send SMS fallback
    │    │    Log "no-answer"
    │    │         │
    └────┴─────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  User Hears Message:                │
│  "Brian Chen has joined your Q4     │
│   Strategy Review meeting."         │
│                                     │
│  [User hangs up]                    │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  SMS Sent:                          │
│  "Join now: https://zoom.us/j/123"  │
└────────┬────────────────────────────┘
         │
    [User taps link]
         │
         ↓
    Deep link opens Zoom app
    User joins meeting
```

### 6.2 Push Notification Flow

```
Tracked participant joins
         │
    System detects join
         │
    {User notification preference?}
         │
    "Push Notification"
         │
         ↓
┌─────────────────────────────────────┐
│  Send Push via FCM/APNs             │
│                                     │
│  Notification:                      │
│  ┌─────────────────────────────┐   │
│  │ 📞 Meeting VIP              │   │
│  │                             │   │
│  │ Brian Chen joined           │   │
│  │ Q4 Strategy Review          │   │
│  │                             │   │
│  │ [Join Now]  [Dismiss]       │   │
│  └─────────────────────────────┘   │
└────────┬────────────────────────────┘
         │
    ┌────┴────┐
    │         │
Join Now   Dismiss
    │         │
    │         ↓
    │    Mark as read
    │    Log dismissal
    │         │
    ↓         │
Deep link     │
opens app     │
    │         │
    ↓         │
Join meeting  │
    │         │
    └────┬────┘
         │
         ↓
    Update tracking status
```

### 6.3 In-App Alarm Flow

```
Tracked participant joins
         │
    System detects join
         │
    {User notification preference?}
         │
    "In-App Alarm"
         │
    {Is app in foreground?}
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    │         ↓
    │    Send push to wake app
    │         │
    └────┬────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Full-Screen Alarm                  │
│  (covers entire screen)             │
│                                     │
│  🔔 🔔 🔔                            │
│                                     │
│  BRIAN CHEN JOINED                  │
│  Q4 Strategy Review                 │
│                                     │
│  [LOUD ALARM SOUND PLAYING]         │
│  [PHONE VIBRATING]                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    [JOIN NOW]               │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Snooze 2 min]  [Dismiss]          │
└────────┬────────────────────────────┘
         │
    ┌────┴────┐
    │         │
Join Now   Snooze
    │         │
    │         ↓
    │    Silence alarm
    │    Set 2-min timer
    │    Show snooze indicator
    │         │
    │    [2 min later]
    │         │
    │    Show alarm again
    │         │
    ↓         │
Deep link     │
opens         │
meeting       │
    │         │
    └────┬────┘
         │
         ↓
    Stop alarm
    Update status
```

---

## 7. Settings & Configuration Flows

### 7.1 Change Notification Method

```
Settings Screen
         │
    [Tap notification method section]
         │
         ↓
┌─────────────────────────────────────┐
│  Notification Method                │
│                                     │
│  ● Phone Call                       │
│    Most reliable, works with DND    │
│                                     │
│  ○ Push Notification                │
│    Silent, less intrusive           │
│                                     │
│  ○ In-App Alarm                     │
│    Loud alarm with vibration        │
│                                     │
│  [Test Notification]                │
└────────┬────────────────────────────┘
         │
    [Select new method]
         │
         ↓
    Save preference
    Show confirmation toast
         │
    [Tap Test Notification]
         │
         ↓
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
  Test Notification Sent
│                                 │
  Check your device to see
│ how notifications will appear   │
                                 
│ [OK]                            │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
         │
         ↓
    Trigger test notification
    using selected method
```

### 7.2 Configure Do Not Disturb

```
Settings → Preferences
         │
    [Tap Do Not Disturb]
         │
         ↓
┌─────────────────────────────────────┐
│  Do Not Disturb Schedule            │
│                                     │
│  ⚠️ Notifications will be silenced  │
│     during these hours              │
│                                     │
│  Weekdays:                          │
│  From: [10:00 PM ▼]                 │
│  To:   [7:00 AM ▼]                  │
│                                     │
│  Weekends:                          │
│  From: [11:00 PM ▼]                 │
│  To:   [9:00 AM ▼]                  │
│                                     │
│  ☐ Allow critical notifications     │
│     (Can override DND for VIPs)     │
│                                     │
│  [Save]  [Cancel]                   │
└─────────────────────────────────────┘
         │
    [Configure times, tap Save]
         │
         ↓
    Save DND schedule
    Show confirmation
         │
    {During DND hours?}
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    ↓         ↓
Queue     Send
notifications immediately
until DND
ends
```

### 7.3 Disconnect Platform

```
Settings → Connected Accounts
         │
    [Tap Disconnect next to Zoom]
         │
         ↓
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
  Disconnect Zoom?
│                                 │
  ⚠️ This will:
│ • Stop monitoring Zoom meetings │
  • Cancel all active tracking
│ • Remove Zoom meetings from list│
                                 
│ You can reconnect anytime.      │
                                 
│ [Disconnect]  [Cancel]          │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
         │
    [Tap Disconnect]
         │
         ↓
    Revoke OAuth tokens
    Cancel all Zoom tracking
    Remove Zoom meetings
    Update UI status
         │
         ↓
┌─────────────────────────────────────┐
│  Settings (Updated)                 │
│                                     │
│  🔵 Zoom                            │
│  ❌ Not connected                   │
│  [Connect]                          │
└─────────────────────────────────────┘
```

---

## 8. Multi-Platform Flows

### 8.1 Handling Both Zoom and Google Meet

```
User has meetings on both platforms
         │
         ↓
┌─────────────────────────────────────┐
│     Today's Meetings                │
│                                     │
│  🔵 Zoom Meeting 1                  │
│  2:00 PM • in 3h                    │
│  Tracking: Brian Chen               │
│                                     │
│  🟢 Google Meet Meeting             │
│  3:00 PM • in 4h                    │
│  Not tracking anyone                │
│                                     │
│  🔵 Zoom Meeting 2                  │
│  4:00 PM • in 5h                    │
│  Tracking: Sarah Johnson            │
└─────────────────────────────────────┘
         │
    System monitors:
    - Zoom via webhook API
    - Meet via Chrome extension
         │
    ┌────┴────┐
    │         │
Zoom event  Meet event
  joins      joins
    │         │
    └────┬────┘
         │
         ↓
    Process notification
    (same flow regardless of platform)
```

### 8.2 Google Meet Extension Installation

```
User connects Google Calendar
         │
    System detects Google Meet links
         │
         ↓
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
  Google Meet Extension Needed
│                                 │
  📱 To track participants in
│ Google Meet meetings, install   │
  our Chrome extension.
│                                 │
  ✓ Secure & private
│ ✓ Only monitors your meetings   │
  ✓ Works seamlessly
│                                 │
  [Install Extension]  [Skip]
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
         │
    [Tap Install Extension]
         │
         ↓
    Open Chrome Web Store
    User installs extension
         │
    Extension installed
         │
         ↓
    Extension connects to app
    (via shared auth token)
         │
         ↓
┌─────────────────────────────────────┐
│  ✅ Google Meet Ready               │
│                                     │
│  Extension installed successfully!  │
│  You can now track participants     │
│  in Google Meet meetings.           │
│                                     │
│  [Got It]                           │
└─────────────────────────────────────┘
```

### 8.3 Cross-Platform Notification Consistency

```
Regardless of platform (Zoom/Meet):
         │
    Participant joins
         │
         ↓
    System detects via:
    - Zoom: Webhook API
    - Meet: Extension message
         │
         ↓
    Normalize data:
    {
      meeting_id,
      participant_name,
      participant_email,
      platform: "zoom" | "meet",
      timestamp
    }
         │
         ↓
    Verify against tracked participant
         │
    {Match found?}
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    ↓         ↓
Trigger    Ignore
notification event
    │
    ↓
Send notification (method from settings)
    │
    ↓
Notification includes:
- Participant name
- Meeting title
- Platform icon
- Direct join link
         │
         ↓
User joins meeting
(platform-specific deep link)
```

---

## 9. Accessibility Flows

### 9.1 Screen Reader Navigation

```
User with VoiceOver/TalkBack enabled
         │
    Opens app
         │
         ↓
Focus on: "Today's Meetings. Heading."
         │
    [Swipe right]
         │
         ↓
Focus on: "Q4 Strategy Review. Meeting at 2:00 PM, 
           starting in 5 hours. Zoom meeting. 
           8 participants. Tracking Brian Chen. 
           Double tap to open details."
         │
    [Double tap]
         │
         ↓
Focus on: "Meeting details. Heading."
         │
    [Swipe right]
         │
         ↓
Focus on: "Meeting title: Q4 Strategy Review"
         │
    [Swipe right]
         │
         ↓
Focus on: "Start time: 2:00 PM, in 5 hours"
         │
    [Swipe right]
         │
         ↓
Focus on: "Track someone for this meeting. Heading."
         │
    [Swipe right]
         │
         ↓
Focus on: "Brian Chen, CEO. Button. Currently tracking. 
           Double tap to change."
         │
    [Continue navigation...]
```

### 9.2 High Contrast Mode

```
User enables high contrast in device settings
         │
         ↓
App detects high contrast mode
         │
         ↓
Apply high contrast theme:
- Increase contrast ratios (7:1 minimum)
- Thicker borders on cards
- Larger icons
- Remove subtle shadows
- Use solid colors only
         │
         ↓
┌─────────────────────────────────────┐
│ Today's Meetings (High Contrast)    │
│                                     │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│ ┃ Q4 STRATEGY REVIEW          ┃   │
│ ┃ 2:00 PM • IN 5H             ┃   │
│ ┃ 🔵 ZOOM • 8 PARTICIPANTS    ┃   │
│ ┃ TRACKING: BRIAN CHEN        ┃   │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
│                                     │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│ ┃ PRODUCT DEMO                ┃   │
│ ┃ 3:30 PM • IN 6H 30M         ┃   │
│ ┃ 🟢 MEET • 5 PARTICIPANTS    ┃   │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
└─────────────────────────────────────┘
```

---

## 10. Advanced Scenarios

### 10.1 Participant Joins Then Leaves Then Rejoins

```
2:00 PM - Meeting starts
         │
2:05 PM - Brian joins
         │
    System detects join
    Notification sent ✓
    User joins meeting
         │
2:15 PM - Brian leaves (connection issue)
         │
    System detects leave
    Log event, don't notify user
         │
2:17 PM - Brian rejoins
         │
    {Has notification been sent for this tracking?}
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    ↓         ↓
 Don't      Send
 notify     notification
 again
    │         │
    └────┬────┘
         │
         ↓
    User already in meeting
    No action needed
```

### 10.2 User Tracks Same Person in Multiple Meetings

```
User setup:
- Meeting A at 2 PM: Tracking Brian
- Meeting B at 3 PM: Tracking Brian
- Meeting C at 4 PM: Tracking Sarah
         │
2:05 PM - Brian joins Meeting A
         │
    Notification sent ✓
    Mark Meeting A tracking as "triggered"
         │
    User joins Meeting A
         │
3:05 PM - Brian joins Meeting B
         │
    {Check Meeting B tracking status}
         │
    Status: "active" (not triggered yet)
         │
    Notification sent ✓
    Mark Meeting B tracking as "triggered"
         │
    User joins Meeting B
         │
4:05 PM - Sarah joins Meeting C
         │
    Notification sent ✓
    (Different person, separate tracking)
```

### 10.3 Rapid-Fire Notifications (Multiple Meetings)

```
User tracking people in 3 meetings:
- Meeting A: Brian joins at 2:00:30
- Meeting B: Sarah joins at 2:01:00
- Meeting C: Mike joins at 2:01:15
         │
2:00:30 - Brian joins
         │
    Queue notification #1
    Start sending (phone call initiated)
         │
2:01:00 - Sarah joins (30s later)
         │
    {Is notification #1 still in progress?}
         │
   Yes - Queue notification #2
   Wait for #1 to complete
         │
2:01:15 - Mike joins (15s later)
         │
    Queue notification #3
         │
2:01:45 - Notification #1 completes
         │
    Send notification #2 immediately
         │
2:02:15 - Notification #2 completes
         │
    Send notification #3 immediately
         │
Result: All notifications delivered
        with ~30-45s gaps between
        to avoid overwhelming user
```

---

## 11. State Diagrams

### 11.1 Meeting Tracking State Machine

```
                    ┌──────────┐
         ┌──────────│  IDLE    │◄────────────┐
         │          └──────────┘             │
         │                                   │
    [User sets                          [Meeting
     tracking]                           ended]
         │                                   │
         ↓                                   │
    ┌──────────┐                       ┌──────────┐
    │ ACTIVE   │───[Participant────────│TRIGGERED │
    │          │      joins]           │          │
    └──────────┘                       └──────────┘
         │                                   │
    [User cancels]                     [User joins]
         │                                   │
         ↓                                   ↓
    ┌──────────┐                       ┌──────────┐
    │CANCELLED │                       │ COMPLETED│
    └──────────┘                       └──────────┘
         │                                   │
         └───────────────┬───────────────────┘
                        │
                        ↓
                   [Archive]
                        │
                        ↓
                  ┌──────────┐
                  │ ARCHIVED │
                  └──────────┘

States:
- IDLE: No tracking set
- ACTIVE: Tracking someone, monitoring in progress
- TRIGGERED: Participant joined, notification sent
- CANCELLED: User cancelled before trigger
- COMPLETED: User joined meeting via notification
- ARCHIVED: Meeting ended, historical record
```

### 11.2 Notification Delivery State Machine

```
    ┌──────────┐
    │ PENDING  │  (Queued, waiting to send)
    └─────┬────┘
          │
     [Send attempt]
          │
          ↓
    ┌──────────┐
    │ SENDING  │  (API call in progress)
    └─────┬────┘
          │
    ┌─────┴─────┐
    │           │
[Success]   [Failure]
    │           │
    ↓           ↓
┌──────────┐ ┌──────────┐
│DELIVERED │ │  FAILED  │
└────┬─────┘ └────┬─────┘
     │            │
     │       [Retry logic]
     │            │
     │       ┌────┴────┐
     │       │         │
     │   [Success]  [Max retries]
     │       │         │
     │       ↓         ↓
     │  ┌──────────┐ ┌──────────┐
     └──│DELIVERED │ │ABANDONED │
        └────┬─────┘ └──────────┘
             │
        [User action]
             │
        ┌────┴────┐
        │         │
    [Opened]  [Dismissed]
        │         │
        ↓         ↓
   ┌──────────┐ ┌──────────┐
   │  OPENED  │ │DISMISSED │
   └──────────┘ └──────────┘
```

---

## 12. Analytics & Tracking Points

### 12.1 Key Events to Track

```
User Journey Events:
├─ signup_started
├─ signup_completed
├─ zoom_connection_started
├─ zoom_connection_completed
├─ calendar_connection_started
├─ calendar_connection_completed
├─ onboarding_completed
│
Daily Usage Events:
├─ app_opened
├─ meetings_viewed
├─ meeting_detail_opened
├─ participant_tracked_set
├─ participant_tracked_changed
├─ participant_tracked_cancelled
├─ notification_sent
├─ notification_delivered
├─ notification_opened
├─ meeting_joined_via_notification
├─ meeting_joined_manually
│
Settings Events:
├─ notification_method_changed
├─ sync_frequency_changed
├─ platform_disconnected
├─ platform_reconnected
│
Error Events:
├─ api_error
├─ webhook_failed
├─ notification_failed
├─ sync_failed
└─ oauth_failed
```

### 12.2 Conversion Funnels to Monitor

```
Onboarding Funnel:
100% - App Downloaded
 90% - Signup Started
 80% - Signup Completed
 75% - Zoom Connection Started
 70% - Zoom Connected
 65% - Calendar Connection Started
 60% - Calendar Connected
 55% - First Meeting Viewed
 50% - Onboarding Completed

Core Feature Funnel:
100% - Meeting Detail Viewed
 85% - Participant List Viewed
 70% - Participant Selected
 65% - Tracking Confirmed
 60% - Notification Received
 55% - Notification Opened
 50% - Meeting Joined

Retention Funnel:
100% - Day 1 Active
 70% - Day 2 Active
 60% - Day 7 Active
 50% - Day 14 Active
 40% - Day 30 Active
```

---

## 13. Performance Considerations

### 13.1 Load Time Targets

```
Screen Load Time Targets:

App Launch (Cold)
├─ Target: <2s
├─ Acceptable: <3s
└─ Critical Path:
    ├─ Initialize app (0.5s)
    ├─ Check auth (0.3s)
    ├─ Load cached data (0.5s)
    └─ Render UI (0.7s)

Today's Meetings Load
├─ Target: <1s
├─ Acceptable: <2s
└─ Critical Path:
    ├─ Check cache (0.1s)
    ├─ Fetch if needed (0.6s)
    └─ Render list (0.3s)

Meeting Detail Load
├─ Target: <0.5s
├─ Acceptable: <1s
└─ Critical Path:
    ├─ Navigate (0.1s)
    ├─ Load data (0.2s)
    └─ Render (0.2s)

Notification Delivery
├─ Target: <30s from participant join
├─ Acceptable: <45s
└─ Critical Path:
    ├─ Webhook received (instant)
    ├─ Process event (0.1s)
    ├─ Trigger notification (0.2s)
    └─ Delivery latency (variable)
```

### 13.2 Optimization Strategies

```
Data Loading:
├─ Cache today's meetings (5min TTL)
├─ Prefetch tomorrow's meetings
├─ Lazy load participant lists
└─ Paginate long participant lists

Image/Asset Loading:
├─ Use vector icons (SVG)
├─ Lazy load images
├─ Cache profile pictures
└─ Optimize bundle size

Network Optimization:
├─ Batch API calls where possible
├─ Use HTTP/2 multiplexing
├─ Compress responses (gzip)
└─ Implement request deduplication

Background Processing:
├─ Sync calendar in background
├─ Prefetch next meeting details
├─ Queue notifications for offline delivery
└─ Clean up old data periodically
```

---

## 14. Conclusion

This App Flow Document provides comprehensive mapping of all user journeys through Meeting VIP. Key takeaways:

**For Product Managers:**
- Use journey maps for user testing
- Monitor conversion funnels
- Identify drop-off points
- Prioritize flow improvements

**For Designers:**
- Reference interaction patterns
- Ensure consistency across flows
- Design for error states
- Consider accessibility

**For Engineers:**
- Implement state machines
- Handle edge cases
- Log analytics events
- Optimize critical paths

**For QA:**
- Test all flows thoroughly
- Verify error handling
- Check state transitions
- Validate notifications

---

**Document Status:** ✅ Complete  
**Last Updated:** December 26, 2025  
**Next Review:** After user testing