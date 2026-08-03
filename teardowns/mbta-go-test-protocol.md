# MBTA Go: device test protocol

Two tests I could not run, written so you can. Each has a predicted outcome derived from the source at commit `76bf3ec`, so the result either confirms the finding or kills it. Both matter: a prediction that fails is a better teardown than a prediction never tested.

Total time: about 20 minutes. Do Test A first, on a phone where MBTA Go is either freshly installed or has had its data cleared.

---

## Test A: timed cold start

**Fills:** the gap in the teardown's Method section. There is currently no cold-start number in the document because I could not produce one.

**Task to time:** *"You are standing at a stop you have never saved. Find out when the next train going your direction arrives."*

### Setup

Do this once, before timing. A cold start means cold.

- iOS: delete MBTA Go and reinstall from the App Store. Do not restore any settings.
- Put the phone in airplane mode for 10 seconds, then back on cellular (not Wi-Fi). Cellular is the realistic condition; Wi-Fi at home is not.
- Do this outdoors, near a stop, so location resolves to something real.

### What to record

Start the stopwatch **the instant you tap the app icon**, not when the app appears. Record each of these as a split, in seconds:

| Split | Definition |
|---|---|
| T1 | App icon tap → first onboarding screen appears |
| T2 | → location permission prompt dismissed |
| T3 | → all onboarding screens cleared (expect 3: Location, Station Accessibility, Feedback) |
| T4 | → first screen with actual content |
| T5 | → a real arrival time for your direction is on screen and readable |

**T5 is the number that matters.** T1 through T4 explain where it went.

Also note, in one line each:

- Which tab you landed on after onboarding
- Whether you had to figure out where to go next, and how long you hesitated (estimate is fine, mark it as an estimate)
- Any screen showing a spinner for more than 2 seconds
- Any row that appeared with no time in it (this is F1; screenshot it immediately if so)

### Screenshot at each split

Five screenshots, one per split. The onboarding sequence in particular is not documented anywhere I could find, so those frames are new evidence.

### What I expect, and why

**Prediction: onboarding is 3 screens for a sighted user.** From `OnboardingScreen.applies()`, the sequence is Location, StationAccessibility, HideMaps, NotificationsBeta, Feedback. HideMaps only shows if a screen reader is on. NotificationsBeta only shows if the Notifications setting is already true, which it is not on a fresh install. So a sighted first-time user should see exactly three.

**Prediction: T4 lands on Favorites, and Favorites is empty.** That is F2. If you land there and there is no way to add a stop, F2 is confirmed on a genuinely fresh install rather than inferred from your two existing screenshots.

**Prediction: T5 has high variance and is dominated by network, not UI.** The cold-start payload `/api/global` is 3.38 MB decoded (484 KB gzipped). I measured 0.34–0.73s to fetch it from a datacenter. On congested cellular it will be substantially worse. If T5 is above 8 seconds, the payload is the story and it belongs in the teardown as a finding in its own right.

**Run it three times** (delete and reinstall between runs) and report all three. One number is an anecdote.

---

## Test B: adversarial test of Disruption Notifications

**Fills:** F5 and F6, currently code-derived predictions with no device confirmation.

**The feature:** More tab → Test New Features → Disruption Notifications. It is off in your captured session.

### Setup

1. More → toggle **Disruption Notifications** on.
2. Grant the system notification permission when prompted. If you deny it, the rest of the test cannot run.
3. Go to Favorites → **+** → add any stop and direction (Green Line, Sutherland Road, Westbound is fine).
4. Open that favorite's notification settings. You should see a "Get disruption notifications" toggle. Turn it on. A default window should appear: **8:00 AM to 9:00 AM, Mon–Fri**.

Screenshot that default state. That is the baseline.

### B1: the overnight window (tests F5)

Try to set the window to **10:00 PM → 1:00 AM**.

- Set "From" to 10:00 PM first.
- Then try to set "To" to 1:00 AM.

**Predicted (iOS):** the end-time picker will not let you scroll past 11:59 PM. The range is clamped in code to `minimumEndTime()...23:59:59`. You will find the wheel simply stops.

**Also predicted:** when you change "From" to 10:00 PM, "To" will *auto-jump* to 11:00 PM without you touching it (`setSafeEndTime` pushes end to one hour after start whenever start passes end). Note whether this happens silently or with any indication.

**Record:** can you express an overnight window at all? If not, is there any message explaining why, or does the control just stop?

**If you have an Android device**, repeat there. Predicted difference: Android *will* let you dial 1:00 AM, and then the OK button goes grey with no explanation. Same limitation, worse feedback. Confirming the divergence is the strongest version of this finding.

### B2: zero days selected (tests F6, the important one)

With notifications still on, tap each highlighted day until **none** are selected.

**Predicted:** all seven deselect. No minimum is enforced anywhere in the code. The master toggle stays ON, the card still looks configured, and no warning appears.

**Record, precisely:**

- Did all seven deselect? Screenshot the state with zero days and the toggle still on.
- Did anything warn you?
- Back out of the screen and return. Did the empty-days state persist, or did it silently repopulate?

**Why this is the sharpest test in the set:** if it behaves as predicted, the app will happily save a notification subscription that can never fire, and the rider's only signal is never receiving anything, which is indistinguishable from there being no disruptions. That is a trust failure you cannot debug as a user.

### B3: the 23:59 zero-length window

Set "From" to **11:59 PM**.

**Predicted:** `minimumEndTime()` returns the start time itself when start is 23:59, so "To" will also become 11:59 PM. A zero-length window. Nothing will warn you.

Screenshot it if it happens.

### B4: revoke permission after configuring

With a notification configured and enabled, go to iOS Settings → MBTA Go → Notifications → turn **off** Allow Notifications. Return to MBTA Go and reopen the favorite's notification settings.

**Predicted (iOS):** the toggle renders disabled at reduced opacity with an "Allow Notifications in Settings" link, but the *stored* setting stays enabled underneath. **Predicted (Android):** the app force-writes the setting back to disabled (`LaunchedEffect` calls `setSettings(Notifications.disabled)` on permission denial).

**Record:** on returning to the screen, does the toggle read on or off? Then re-grant permission and check whether your window configuration survived or was wiped. If Android silently discards a configured set of windows because you toggled a system permission, that is a finding worth adding.

### B5: unfavorite while notifications are on

Delete the favorite entirely while its notifications are enabled.

**Record:** any confirmation? Any mention that you are also deleting a notification subscription? `SubscriptionRequest.fromFavorites` rebuilds the whole subscription list from remaining favorites, so the backend should clean up, but the rider gets no acknowledgment that a notification they set up has been silently cancelled.

---

## Reporting back

For each of B1–B5, one line: **predicted / observed / match or not**. Screenshots for anything that does not match, and for B2 regardless.

Anything that comes back "not a match" is the most valuable result in the batch. It means the code says one thing and the shipped app does another, and running down that gap is exactly the kind of thing that plays well in an interview.

Once you send results, I will fold them into the teardown, move F5 and F6 from "code-derived prediction" to "observed," and add the cold-start numbers to the Method section, which currently says plainly that no timed measurement exists.
