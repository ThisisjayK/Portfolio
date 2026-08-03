# MBTA Go: a product/UX teardown

**Product:** MBTA Go v2.1.2 (iOS), the MBTA's official rider app for real-time arrivals, vehicle tracking, and closure alerts.
**Lens:** Product / UX. **Domain:** public sector.
**Observation window:** August 1, 2026. Device session captured 1:31–1:43 AM ET, Allston/Brighton, Green Line B/C/D corridor.
**Written at:** early-career PM depth. No legal, financial, or procurement analysis.
**Evidence base:** direct device capture and source/API testing. No app-store or Play-store reviews are used anywhere in this document.

---

## One line

MBTA Go is a live-departures board for Greater Boston, built in-house by the MBTA, that answers "when is my train coming" well and mostly declines to answer anything else.

## Why this product is worth tearing down

Most teardowns pick a product with a revenue model, so the analysis writes itself: acquisition, conversion, retention. MBTA Go has none of that. Nobody pays for it, nobody is forced to use it, and the agency competes against free third-party apps that run on the MBTA's own open data feed. The only thing the product can win on is being more correct and more legible than the alternatives. That makes it a clean test of a narrow question: does the interface tell the rider the truth, clearly, at the moment they need it?

It is also unusually inspectable. The app is open source under MIT ([`mbta/mobile_app`](https://github.com/mbta/mobile_app)), so claims about screen behavior can be checked against the code that produces them rather than guessed at. Most of this teardown does exactly that.

---

## Method, and what I did not do

Being precise here matters more than the findings themselves, because a teardown that overstates its evidence collapses under one follow-up question.

**Directly observed (device):** 10 screenshots from a real iOS session on v2.1.2, timestamped 1:31, 1:36, 1:38, 1:39, and 1:43 AM, around Cleveland Circle and Sutherland Road. Every screen-level claim below points at a specific one.

**Directly tested (by me):** the production source at commit `76bf3ec` (2026-07-31), and the live backend. `GET /api/global`, the app's cold-start payload, returned HTTP 200 in 0.34–0.73s across three runs, 484 KB gzipped and 3.38 MB decoded. The public V3 API showed 88 active alerts at time of writing, including 11 elevator closures and 16 escalator closures.

**Not done, and it changes what I can claim.** I did not use the app myself, so there is **no timed cold-start number** in this teardown. I did not run one and will not invent one. I also did not run the adversarial test on Disruption Notifications; the toggle is off in the captured session. The notification findings (F5, F6) are read off the source, and each names the exact device test that would confirm or kill it. Those are predictions, not observations, and they are labeled that way.

---

## Stakeholders, and where they conflict

Public-sector products fail differently than consumer ones, because "the user" is not one person and the definitions of good are in tension.

| Stakeholder | What good looks like to them | Where they collide |
|---|---|---|
| **Habitual commuter** (same 2–3 stops daily) | Open app, see my departure, close app. Under 5 seconds. | Wants zero-config speed. The default landing tab is empty until they configure it. |
| **Occasional / spontaneous rider** | Where am I, what's near me, which direction do I want | Needs discovery and orientation, competing for the same screen space as the commuter's saved list. |
| **Rider with a disability** | Is this station accessible, is the elevator working, and if not what is my alternative | The app answers the first two and not the third. Accessibility info is also opt-in, so the default is silence. |
| **Late-night / shift rider** | Is there still service, and if not, when does it resume | Structurally underserved. See F1 and F4. |
| **Non-English-speaking rider** | The whole thing, in my language | Genuinely well served (8 languages). But translation lead time is a real constraint on shipping new copy quickly. |
| **The MBTA as an agency** | Riders trust our number over a third party's | Every external link cedes a rider job to something else, which cuts against being the authoritative source. |
| **The product team (TID)** | Ship every 4–6 weeks, learn from feedback | A small in-house team choosing depth on one job over breadth. Most of what follows is a consequence of that choice, and mostly it was the right choice. |

The important tension: **the commuter and the newcomer want opposite things from the first screen**, and the app resolves that in the commuter's favor while showing the newcomer an empty box. That is F2.

---

## What's good

Worth saying plainly, because several of these are better than what a large agency typically ships.

1. **Direction-first information architecture.** Rows read "Westbound to Boston College," not "Route B." That is how riders actually think at a platform, and it removes the most common orientation error. Visible in every Nearby screenshot.

2. **Two arrival times per direction, not one.** "2 min / 10 min" tells you whether to run. One number does not. Small choice, large behavioral difference.

3. **Live vs. scheduled is visually distinguished.** A realtime indicator icon sits next to predicted times and is absent from non-predicted states. The app is telling you how much to trust the number, which most transit UIs skip.

4. **Staleness is modeled as a first-class state.** The code carries an explicit `ErrorBannerState.StalePredictions` with a `minutesAgo()` readout, distinct from `DataError` and `NetworkError`. Three failure modes get three messages instead of one generic "something went wrong." That is a mature design decision.

5. **Screen-reader-aware onboarding.** The "Hide Maps" onboarding screen only appears if a screen reader is actually enabled (`OnboardingScreen.HideMaps.applies()` checks `isScreenReaderEnabled()`). The app is not asking sighted users a question that is meaningless to them. A thoughtful detail that costs real effort.

6. **Eight languages, with an honest translation pipeline.** Machine translations are committed marked "Needs review" so human translators know to audit them. Process integrity most teams skip.

7. **It is open source, and says so in the app.** "View Source on GitHub" sits in the More tab. For a public agency, that is the right instinct about public money and public accountability.

8. **The team already knows about its own edge cases.** See F1, where a code comment concedes a state should have been filtered out. Not a defense of the bug, but it means the fix is a filtering change, not a redesign.

---

## Findings, ranked

Ranked by rider harm multiplied by evidence strength. Each names the evidence, the likely reason the tradeoff was made, and a fix at the screen level.

---

### F1. A departure row can render with no status at all, and the rider cannot tell why

**Severity: high. Evidence: observed + code-confirmed.**

At **1:31 AM**, three eastbound rows (Government Center via B, Government Center via C, Union Square via D) rendered with a route name, a chevron, and **nothing where the time goes**. Not "Service ended," not "No predictions," not a spinner. Blank.

At **1:39 AM**, the same three rows read **"Service ended"** with a warning icon.

So for at least an 8-minute window, the app showed a rider a row indistinguishable from a loading state, a bug, and a dead service. A rider on that platform cannot tell whether to keep waiting.

The code explains how this is possible. The renderer has an explicit case:

```swift
case .hidden:
    // should have been filtered out already
    Text(verbatim: "")
```

`TripInstantDisplay.Hidden` is returned in several situations, including when a prediction's remaining time has gone negative, and when a prediction has no departure time at a stop where arrival-only is not allowed. It renders an empty string. The comment concedes that reaching this branch on screen is not intended.

*Inferred, not proven:* the 1:31 blanks were `Hidden` rows produced by predictions that had aged past their departure time but had not yet cleared the feed, which then resolved to `ServiceEndedToday` once they did. I cannot prove which branch fired from a screenshot alone. The product problem holds either way: **the UI has a state that renders as nothing, and "nothing" is the one thing a rider cannot interpret.**

**Why it probably shipped this way:** `Hidden` is a legitimate internal concept (filter this trip out of the list). The bug is that it can survive as the *only* item in a list, at which point the list is empty and nothing tells the rider that. It surfaces mostly near end of service, which is exactly when the fewest people are watching, including the team.

**Fix, at the screen level.** In the departures list builder, after computing formatted trips for a direction, check whether every trip resolved to `Hidden`. If so, do not render an empty row; fall through to `NoTripsFormat` resolution so the row gets real text. Then make `Text(verbatim: "")` unreachable by construction rather than by comment: change the row model so a row must carry either a time, a status string, or a loading placeholder, and let the compiler reject a fourth option. Belt and braces, add a fallback status string ("Times unavailable") for the case where no branch resolves, so the worst outcome is vague text rather than silence.

---

### F2. The default landing tab is empty, and offers no way out of empty

**Severity: high. Evidence: observed, two screenshots.**

Favorites is the first tab and the app's landing screen. With no favorites saved, it reads:

> **Favorites**
> No stops added

That is the entire content. No "+" button, no "Add your first stop," no explanation of what a favorite is or why to make one.

The comparison screenshot proves this is a real gap and not a crop: once favorites exist, a **"+"** and an **"Edit"** button appear in that same header. The affordance for adding a stop is only visible **after** you already have one.

So a first-time rider opens the official transit app of the MBTA and lands on a screen that tells them nothing and lets them do nothing. Their only recovery is noticing the Nearby tab or the search field on the map behind the sheet.

**Why it probably shipped this way:** the header buttons are almost certainly bound to the populated-list component rather than to the tab, so the empty state was built as a separate, simpler view and the add affordance was not carried over. Classic empty-state omission, and invisible to the team, because everyone who works on the app has favorites saved.

**Fix, at the screen level.** Replace the empty Favorites body with: one line of purpose copy ("Save the stops you use most to see departures here"), a primary button reading **"Add a stop"** that opens the same "Add favorite stops" modal the "+" opens, and, below a divider, a live preview of the 2–3 nearest stops pulled from the Nearby data already in memory, each with a star to save it in one tap. That last part matters most: it converts a dead screen into the fastest path to a configured app, using data already fetched. Keep "+" and "Edit" in the header in both states so the control does not move.

---

### F3. Accessibility is labeled only in the negative, opt-in by default, and offers no alternative

**Severity: high (equity is first-order in a public-sector product). Evidence: observed + code-confirmed.**

Three problems stack.

**It is negative-only.** In the Nearby list, Sutherland Road and Dean Road carry a "Not accessible" badge. Beaconsfield carries no badge. A wheelchair user is expected to infer "accessible" from the *absence* of a warning. In the code there is a `showInaccessible` computed property and a `not_accessible` string, with no positive counterpart anywhere. Absence of evidence is doing the work of evidence, and if the badge ever fails to render, the failure mode is false reassurance.

To give the team its due: the collapse runs in the safe direction. `WheelchairBoardingStatus` has exactly two values, `ACCESSIBLE` and `INACCESSIBLE`, and the field is nullable, so unknown is a real third state. `isWheelchairAccessible` returns true only on an explicit `ACCESSIBLE`, meaning unknown gets badged as not accessible. That is conservative and correct as a default. The problem is not the direction of the conflation, it is that a rider cannot tell a confirmed-accessible stop from an unknown one, and neither can they tell a data gap from a real barrier.

**One sharp edge worth flagging separately.** The same property contains a blanket override:

```kotlin
val isWheelchairAccessible: Boolean =
    wheelchairBoarding == WheelchairBoardingStatus.ACCESSIBLE ||
        this.vehicleType == RouteType.BUS
```

**Every bus stop is treated as accessible**, regardless of what the underlying data says. A bus stop explicitly marked `INACCESSIBLE` will still never show the badge. The reasoning is probably sound (the MBTA's bus fleet is low-floor with ramps, so the vehicle is accessible even where the curb is not), but it means the app cannot warn about a bus stop with no curb cut, no sidewalk connection, or a boarding area blocked by construction. That is a real category of barrier the badge is silent on, and I would want to know whether that override was a deliberate policy decision or a convenience. I could not determine which from the code alone.

**It is opt-in.** Station Accessibility Info is a setting. The onboarding copy reads "By opting in, we can show you which stations are inaccessible or have elevator closures." A rider who skips or misses that prompt gets an app that silently omits accessibility information. For a public agency whose mandate is universal access, defaulting to silence on accessibility is the wrong default.

**It is a dead end.** The stop detail sheet for Sutherland Road at 1:43 AM shows a prominent banner, "This stop is not accessible," a departures card, and then a large expanse of empty sheet. The app tells a wheelchair user this stop will not work for them and offers nothing: no nearest accessible stop, no distance, no "the next accessible stop westbound is X." The empty space is literally there.

**Why it probably shipped this way:** the opt-in framing is likely well-intentioned, treating accessibility info as a preference rather than an assumption about the user, and reducing clutter for riders who do not need it. Nearest-accessible-alternative is genuinely harder than a badge, because it needs routing logic the app does not otherwise have. Both are defensible engineering calls that produce a bad outcome for the rider who needs the most help.

**Fix, at the screen level.** Three changes, increasing in cost.

1. **Render all three states, since the data already has three.** Explicit `ACCESSIBLE` gets the wheelchair glyph without the X and the label "Accessible." Explicit `INACCESSIBLE` keeps today's badge. Null gets a distinct muted treatment reading "Accessibility not confirmed," which is honest and still steers a rider toward caution without claiming a barrier that may not exist. Separately, drop the blanket bus override so a bus stop marked inaccessible can actually say so, or, if the override reflects a real policy, replace it with copy that states the policy ("Buses are ramp-equipped; curb access not confirmed") instead of silence.
2. **Flip the default.** Show accessibility info by default and let riders turn it off. Keep the onboarding screen, reframed as "we show accessibility info by default, you can turn it off."
3. **Fill the dead space.** In the stop detail sheet, when a stop is not accessible or has an active elevator closure, render a card directly under the banner: "Nearest accessible stop: [name], [n] min walk," tappable through to that stop. The app already holds the global stop list with accessibility flags and coordinates, and already ships a k-d tree for nearest-stop lookup, so this is a query over data in memory rather than a new service.

---

### F4. Late-night riders get the least information at the moment they need the most

**Severity: medium-high. Evidence: observed + code-confirmed.**

At 1:43 AM the eastbound row reads "Service ended." It does not say when service resumes.

The code explains why, and the reason is arbitrary from the rider's point of view:

```kotlin
if (subwayServiceStartTime != null &&
    now.local.time >= LocalTime(3, 30) &&
    now <= subwayServiceStartTime
) {
    return SubwayEarlyMorning(subwayServiceStartTime)
}
```

A rider who checks at **3:31 AM** gets `SubwayEarlyMorning` with the actual first-train time. A rider who checks at **1:43 AM** gets a bare "Service ended." The information exists in both cases. It is withheld for the two hours when a stranded rider most needs to decide between waiting, walking, and paying for a ride.

**Why it probably shipped this way:** the 3:30 cutoff is a reasonable proxy for "today's service is over versus tomorrow's hasn't started," and it avoids showing a first-train time four hours out as though it were an arrival estimate. The team chose not to over-promise. But the rider reads the absence as "no information," which is worse.

**Fix, at the screen level.** Keep "Service ended" as primary text, and add a secondary line beneath it in the muted style already used for scheduled times: "Next service 5:16 AM." Same data source as `SubwayEarlyMorning`, just not gated on the 3:30 clock check. If the concern is that a distant time reads as an arrival estimate, prefix it with the day ("Tomorrow 5:16 AM") and suppress the realtime indicator icon, which the app already omits for non-predicted states.

---

### F5. Disruption Notifications cannot express a window that crosses midnight, and each platform fails differently

**Severity: medium. Evidence: code-confirmed. Not device-tested.**

Notification windows are per-favorite, defined as a start time, an end time, and a set of days. The end time is constrained to be after the start time, which makes an overnight window unrepresentable. A rider whose shift ends at 11:30 PM cannot say "notify me about disruptions on my ride home."

The two platforms enforce this differently, and Android is worse:

- **iOS** clamps the end-time picker's selectable range to `minimumEndTime()...23:59:59`. You physically cannot scroll to 1:00 AM. Restrictive, but at least legible.
- **Android** lets you spin the dial to 1:00 AM and then **silently disables the OK button** (`enabled = minimumTime < selected`). No message, no explanation. The control just stops working and the rider is left to work out why.

The workaround (two windows, 10 PM–11:59 PM and 12 AM–1 AM) is not equivalent, because the days-of-week set applies per window, so a Friday-night ride home needs Friday checked on one window and Saturday on the other. No rider will reason this out unprompted.

**Why it probably shipped this way:** enforcing start < end is the obvious way to prevent nonsense input, and midnight-crossing intervals are a genuinely annoying modeling problem. The data model supports it fine (`Window` is just two `LocalTime`s), so this is a UI constraint, not a backend one. The kind of edge case that gets deferred in a beta, which this feature is.

**Fix, at the screen level.** Remove the end-time clamp. When the selected end time is earlier than the start time, render an inline caption under the row: "Overnight, ends [time] the next day." Keep the constraint that start and end cannot be equal. On Android specifically, never ship a disabled confirm button without adjacent text saying what is wrong. Longer term, offer a preset chip row ("Weekday mornings," "Weekday evenings," "Overnight") above the custom pickers, since most riders want one of three windows and should not be operating two time pickers at all.

**Device test that would confirm this:** More → turn on Disruption Notifications → save a favorite → open its notification settings → try to set 10:00 PM to 1:00 AM. Predicted: iOS will not let you scroll past 11:59 PM; Android will let you pick 1:00 AM but the OK button will be greyed out with no explanation.

---

### F6. A notification can be switched on with zero days selected, so it can never fire

**Severity: medium. Evidence: code-confirmed. Not device-tested.**

The day-of-week control permits an empty set. On iOS each day toggles via `formSymmetricDifference`, on Android via `daysOfWeek - day`. Neither enforces a minimum. I searched the shared, iOS, and Android layers for any validation of `daysOfWeek` emptiness and found none.

The subscription builder filters only on whether notifications are enabled:

```kotlin
val enabled = favorites.filter { it.value?.notifications?.enabled == true }
```

An empty `days_of_week: []` therefore ships to the backend. The result is a toggle that reads ON, a settings screen that looks configured, and a notification that can never arrive. The rider has no way to detect this except by never being notified, which is indistinguishable from there being no disruptions.

A related case: setting the start time to 23:59 causes `minimumEndTime()` to return the start time itself, permitting a zero-length window. Same outcome, same silence.

**Why it probably shipped this way:** validation is what gets cut when a beta ships. The happy path was tested; nobody deselected all seven days.

**Fix, at the screen level.** Prevent the last day from being deselected: attempting it leaves the day selected and shows a brief caption, "Pick at least one day." Enforce the same rule server-side by rejecting a `SubscriptionRequest` with an empty `windows` list or an empty `days_of_week`, so a client bug cannot produce a silently dead subscription. Add a summary line at the top of the notification card stating the resulting behavior in plain words: "You'll be notified about disruptions Mon–Fri, 8:00–9:00 AM." If that sentence cannot be constructed, the configuration is invalid and the UI should say so.

**Device test that would confirm this:** enable notifications on a favorite, then tap every highlighted day until none are selected. Predicted: all seven deselect, the master toggle stays ON, and no warning appears.

---

### F7. Saved favorites are deleted silently, with no notice and no undo

**Severity: medium. Evidence: code-confirmed. Not device-tested.**

On launch, `FavoritesViewModel` compares saved favorites against current global data and removes any whose route, stop, or direction no longer exists, or which is now the last stop for its route. Four removal reasons are enumerated, and the enum carries the team's own annotation:

```kotlin
// Purely for logging
internal enum class RemovalReason { MissingRoute, MissingStop, MissingDirection, LastStopForRoute }
```

The removal is reported to Sentry with a breadcrumb. Nothing is reported to the rider. Searching for `StaleCheck` in the UI layer returns only the view model and the enum definition, with no toast, banner, or dialog attached.

This is not hypothetical for the MBTA specifically. Bus route changes, stop consolidations, and station closures happen on a regular cadence, and each one can silently empty a rider's saved list. The rider opens the app expecting their commute and finds the empty state from F2, with no explanation.

**Why it probably shipped this way:** the intent is right. A favorite pointing at a nonexistent stop would crash or render garbage, so cleanup is necessary. The team also instrumented it, which shows they wanted visibility. They gave the visibility to themselves and not to the rider, which is the specific mistake.

**Fix, at the screen level.** On the launch after a removal, show a dismissible banner at the top of the Favorites list: "1 saved stop was removed because [Route 57 no longer stops here]." Map each `RemovalReason` to a plain-language clause. Add a "Find a replacement" action opening the add-favorite flow pre-filtered to stops near the removed one. If a replacement cannot be offered, the notice alone is still far better than silence, and it costs one banner component the app already has.

---

### F8. The three most common rider jobs after "when is it coming" all leave the app

**Severity: medium. Evidence: observed.**

The More tab groups Trip Planner, Fare Information, and Commuter Rail and Ferry Tickets under "Resources." All three carry the external-link arrow. Trip Planner opens mbta.com in the browser; the captured session shows a "◀ Safari" return indicator in the status bar at 1:38 and 1:39, evidence of that round trip actually happening. Tickets hand off to a separate app (mTicket).

This is a deliberate scope decision and mostly a defensible one. A small in-house team that tried to build trip planning, fare calculation, and ticketing at once would likely ship all four badly. Doing departures well first is the right sequencing.

The cost is real, though. The MBTA's own [endorsed-apps page](https://www.mbta.com/mbta-endorsed-apps) lists MBTA Go, mTicket, The RIDE, PayByPhone, and SeeSay. Its intro says these apps "can help you plan trips on the MBTA," and yet **no trip-planning app appears on the list**. The agency's answer to "plan my trip on my phone" is a web page. That is the gap a third-party app fills, and it is why a rider keeps a second transit app installed. Every rider who does that is a rider whose default is not the authoritative source, which cuts against the app's stated reason to exist.

*Note on a source conflict:* some third-party app-listing sites describe MBTA Go as offering full origin-to-destination route planning. The captured screenshots contradict this directly; Trip Planner is an outbound link in v2.1.2. Separately, [GBH reported at launch](https://www.wgbh.org/news/local/2024-11-21/t-releases-new-mbta-go-app-to-track-and-plan-rides) that a Google-Maps-style trip planner was planned. I could not verify a ship date, and it is not in this build.

**Fix, at the screen level.** Do not build a trip planner to close this. Reduce the cost of the handoff instead. Open Trip Planner in an in-app browser (`SFSafariViewController`) rather than kicking to Safari, so the rider returns with one tap and the app keeps its place. Pre-fill the origin with the currently selected stop, since the app knows it. And move Fare Information inline: a single line on the stop detail sheet reading "Subway $2.40" answers the question with no navigation at all, and it is static data that changes rarely.

---

### F9. The add-favorite picker leads with Bus and buries Subway

**Severity: low. Evidence: observed.**

The "Add favorite stops" modal orders modes: Bus, Silver Line, Commuter Rail, Ferry, then a "Subway" section containing Red, Mattapan, Orange, Green, and Blue. The subway lines, which carry the largest share of rides, sit at the bottom, and Mattapan (among the lowest-ridership services in the system) gets equal visual weight to the Red Line.

Adding a favorite already costs four steps: mode, line, stop, direction. Ordering that does not match likely intent adds scrolling to a flow that is already the main barrier identified in F2.

**Why it probably shipped this way:** the order likely mirrors the route-type enumeration in the data model rather than any deliberate ranking. Bus is route type 3, subway is 0 and 1, and the grouping suggests the sections were built around the data structure.

**Fix, at the screen level.** Put the Subway group first. Above it, add a "Near you" section listing the 3–5 closest stops with their line colors, so the common case (favoriting the stop you are standing at) takes one tap instead of four. Keep the full mode list below for everything else.

---

## Recommendation: what I would ship first

If I owned one release cycle, I would ship **F1, F2, and F6 together**, framed internally as one theme rather than three bugs: *the app should never show a control or a row whose state the rider cannot read.*

The reasoning is sequencing, not severity. F2 is the cheapest fix in the list and it gates everything else, because a rider who never configures the app never reaches the features the rest of the findings are about. F1 is the highest-harm defect, and the team's own code comment says the state was not supposed to reach the screen, so it is a filtering change rather than a redesign. F6 is a validation guard that prevents the notifications beta from generating a class of complaints that is very hard to debug later ("I turned it on and never got anything"), and it is cheaper to add before the beta widens than after.

I would hold F3's nearest-accessible-stop card for the following cycle, not because it matters less (it may matter most) but because it is the only item here needing new logic rather than new copy, and I would rather scope it properly than rush it. F3's positive-state label and default-on change are small and belong in the first cycle.

What I would want to see before committing: the existing `recordSession(favoritesCount:)` data, split by whether the session ended with any departure tapped. If the zero-favorites population is small, F2 is worth less than I think and F1 should go alone.

---

## Counter-metric, named first

**If these fixes work, notification permission denial rate will get worse, and that is the number I would watch.**

The mechanism is direct. F2 removes the barrier to creating a favorite. F5 and F6 make notification setup less broken and therefore more likely to be attempted. More riders reaching the favorites-and-notifications flow means the system permission prompt fires more often, and more prompts means more denials in absolute terms and probably as a rate too, since the newly-arriving population is less committed than today's self-selected early adopters. On iOS a denial is close to permanent, recoverable only through system settings. It is possible to make the product better and burn the permission in the process. The app already emits `notificationsPermissionDenied()` and `notificationsPermissionGranted()`, so this is measurable from day one, and I would gate a wider notifications rollout on the denial rate staying flat.

**A second one, more counterintuitive:** the share of departure rows displaying no arrival time will **go up** after F1, because rows that currently render blank will start rendering "Service ended" or "Times unavailable." A dashboard tracking "rows with an arrival time" would show a regression. It is not one. Worth writing down before shipping, because someone will otherwise flag it as a defect in the following sprint.

---

## Instrumentation plan

No target numbers, because I have no baseline and inventing one would be worse than having none. What follows is the question each measure answers.

**What already exists** (from the analytics layer at `76bf3ec`, so no new work needed):
`recordSession(favoritesCount:)`, `recordSession(locationAccess:)`, `recordSessionStationAccessibility()`, `recordSessionVoiceOver()`, `recordSessionHideMaps()`, `favoritesUpdated()`, `notificationsPermissionGranted/Denied()`, `notificationsWindowSet()`, `notificationsFallback()`, `tappedDeparture()`, `tappedTripPlanner()`, `performedSearch()`.

A good foundation. It already answers "how many riders have zero favorites" and "how many have accessibility info on," the two baselines this whole teardown rests on.

**What is missing, in priority order:**

| Add | Answers | Ties to |
|---|---|---|
| `departureRowRendered(state:)` where state ∈ {time, serviceEnded, predictionsUnavailable, noSchedules, earlyMorning, **hidden**, loading} | How often does a rider actually see a blank row, and at what hours? The single highest-value missing event; today the failure is invisible to the team. | F1 |
| `favoritesEmptyStateShown()` and `favoritesEmptyStateActionTapped()` | Do riders who land on the empty tab ever escape it, and by which route? | F2 |
| `staleFavoritesRemoved(count:reason:)` surfaced to product analytics, not only Sentry | How often are riders silently losing their saved commute? Currently only engineering can see this. | F7 |
| `notificationConfigSaved(dayCount:windowCount:crossesMidnight:)` | How many live subscriptions are configured such that they can never fire? Answers F6 with real numbers instead of my inference. | F5, F6 |
| `accessibilityBannerShown(stopId:)` paired with `alternativeStopTapped()` once the card exists | Does the nearest-accessible-stop card get used, or is it clutter? | F3 |
| Cold-start timing: launch to first rendered departure, segmented by cold/warm and by favorites/nearby | The number I could not produce. Segment it, because a configured commuter and a first-time user are different products. | Method gap |

**Two guardrails to set before any of this ships:** notification permission denial rate (per the counter-metric), and p95 time-to-first-departure. The `/api/global` payload is 3.38 MB decoded, and if F2 succeeds in pushing more riders through cold start, that payload becomes the bottleneck everyone feels.

---

## Takeaways

1. **The dangerous states in a transit app are the empty ones.** A wrong arrival time gets corrected in 15 seconds. A blank row leaves the rider with no next action and no way to tell whether the app is broken, the service is over, or the train is coming. MBTA Go models failure carefully in three named error-banner states and then still has a code path that renders an empty string with a comment admitting it should not have gotten there.

2. **Negative-only labeling quietly transfers risk to the person least able to absorb it.** Badging only inaccessible stops means a wheelchair user infers safety from the absence of a warning. The underlying data carries three states (accessible, inaccessible, unknown) and the UI renders two, so "we confirmed this works" and "we have no idea" look identical on screen. A blanket rule that all bus stops are accessible compounds it, because the one category where curb-level barriers are most common is the one the badge can never flag.

3. **The empty state is the product for anyone who has not configured it.** MBTA Go's default landing tab shows "No stops added" and hides the button that would fix that until you have already fixed it. The first screen is the whole product for a first-time rider, and it is the screen the team is least likely to see.

4. **Scope discipline is correct until it starts contradicting the positioning.** Punting trip planning was right for a small in-house team. But the app's claim is to be the authoritative source, and the agency's own endorsed-apps list has no trip planner on it, so riders solve that job elsewhere and their default stops being the official app. The fix is not to build a trip planner; it is to make the handoff cheap.

5. **Open-sourcing the app changes what a teardown can be.** Most of the sharpest findings here came from reading the code next to a screenshot, not from either alone. The screenshot showed blank rows; the code named the branch that produces them and carried a comment conceding it. That combination is only possible because the MBTA publishes the source, which is worth crediting.

---

## Confidence footer

**As of August 1, 2026.** App version 2.1.2 (iOS). Source at commit `76bf3ec`, dated 2026-07-31. Products change; a rebuild could invalidate any code claim here.

**Verified, from the device session (10 screenshots, 1:31–1:43 AM ET):** the blank-then-"Service ended" transition on three eastbound rows; the empty Favorites body reading "No stops added" with no add affordance, versus "+" and "Edit" present when populated; "Not accessible" badges on Sutherland Road and Dean Road with none on Beaconsfield; "This stop is not accessible" on the Sutherland Road detail sheet with empty space below the departures card; "Service ended" at 1:43 AM with no resume time; Trip Planner, Fare Information, and Tickets as external links; the "◀ Safari" return indicator; the add-favorite modal's mode ordering; Map Display and Station Accessibility Info both on; Disruption Notifications off.

**Verified, from source:** `TripInstantDisplay.Hidden` rendering `Text(verbatim: "")` with the comment "should have been filtered out already"; the 3:30 AM gate on `SubwayEarlyMorning`; iOS end-time picker range clamping and Android's confirm-button disabling; absence of any `daysOfWeek` emptiness validation across shared, iOS, and Android; `SubscriptionRequest.fromFavorites` filtering only on `enabled`; `showInaccessible` with no positive counterpart and no positive string resource; `WheelchairBoardingStatus` having only `ACCESSIBLE` and `INACCESSIBLE` on a nullable field, and `isWheelchairAccessible` forcing true for all bus stops via `vehicleType == RouteType.BUS`; `RemovalReason` annotated "Purely for logging" with no UI reference to `StaleCheck`; the onboarding screen sequence and its applicability rules; the full analytics event list.

**Verified, measured by me:** `/api/global` returning HTTP 200 in 0.34–0.73s across three runs, 484 KB gzipped and 3.38 MB decoded; 88 active alerts on the public V3 API including 11 elevator and 16 escalator closures.

**Verified, from official MBTA sources:** iOS launch November 2024, Android February 25, 2025; built in-house by the Technology Innovation Department; 8 languages; the endorsed-apps list and its lack of a trip planner; fares ($2.40 subway, $1.70 local bus, $90 LinkPass); support line hours (M–F 6:30 AM–8 PM).

**Inferred, labeled as such in the text:** that the 1:31 AM blank rows were specifically the `Hidden` branch rather than a loading state. The screenshot cannot distinguish these. The product finding holds under either explanation, but the causal claim is not proven.

**Assumed:** that the iOS behavior in the captured session generalizes to Android, except where I found explicit divergence (F5). The shared Kotlin layer makes this reasonable, but I verified it only for the notification widget.

**Not confident about, and not checked firsthand:**

- **No timed cold-start measurement exists in this teardown.** I could not run one.
- **F5 and F6 are code-derived predictions, not observations.** Each names the exact device test that would confirm or kill it. Until those are run, treat them as hypotheses with strong code support.
- **Adoption figures.** MBTA press materials cited 57,000+ downloads in early 2025; a third-party estimate suggests roughly 69,000 by mid-2026. Third-party download estimates are unreliable and neither belongs in front of an interviewer as fact.
- **Peer comparison is deliberately absent.** I did not verify any competitor's current Boston feature set from a primary source, so I confined the discussion to what the MBTA's own endorsed-apps page shows.
- **Whether a trip planner has since shipped.** GBH reported one was planned at launch. It is not in v2.1.2, and I found no ship date.
- **Sources conflict on scope.** Some app-listing sites describe MBTA Go as offering full route planning. The screenshots contradict this. I trusted the screenshots.
- **No user research.** Every claim about what riders want is reasoning from the interface and from general transit-UX principles, not from talking to anyone. Segment names in the stakeholder table are analytical constructs, not researched personas.
- **Single session, single corridor, single time of night.** All device evidence comes from one rider, on the Green Line B/C/D branches, between 1:31 and 1:43 AM. Late-night conditions likely exaggerate F1 and F4 relative to a weekday rush hour. A daytime session could change the ranking.
- **Whether the blanket bus-accessibility override is deliberate policy.** The code is unambiguous about what it does. Why it does it is not in the code, and I did not find an MBTA document stating a policy that all bus stops count as accessible. Treat my reading of the intent as a guess; the behavior itself is verified.

**Sources:** [MBTA Go product page](https://www.mbta.com/goapp) · [MBTA-Endorsed Apps](https://www.mbta.com/mbta-endorsed-apps) · [Launch announcement, Nov 2024](https://www.mbta.com/news/2024-11-21/mbta-launches-new-mobile-app-mbta-go) · [Android release, Feb 2025](https://www.mbta.com/news/2025-02-25/mbta-releases-android-version-mbta-go-mobile-app) · [GBH launch coverage](https://www.wgbh.org/news/local/2024-11-21/t-releases-new-mbta-go-app-to-track-and-plan-rides) · [Source code, mbta/mobile_app](https://github.com/mbta/mobile_app) · [MBTA V3 API](https://api-v3.mbta.com)
