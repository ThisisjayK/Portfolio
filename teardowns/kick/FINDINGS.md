# Kick Discovery Teardown: Findings

**Status:** evidence gathered, thesis locked, ready to write.
**Scope:** new-viewer discovery on **kick.com web**, logged out through post-onboarding,
plus one targeted mobile test. The mobile app has a **Block** control that web lacks; that
control was tested end to end on 26 Jul and is evidenced by five captures (see A2). Nothing
else about the mobile app was torn down. Every finding below should be read as a web
finding unless it says otherwise.
**Captured:** 25–26 Jul 2026, Chrome on macOS, by Jay.
**Analyst position:** regular Kick viewer, primarily Trainwreckstv and xQc. Fan bias is
a live risk in this piece; every finding below is tied to a captured screen or a
timestamped observation rather than an impression.

---

## Thesis

> **Kick never closes the loop on what a user tells it.** Every finding in this teardown
> is an instance of the same failure: the product takes a signal and doesn't act on it,
> refuses to accept a signal at all, or accepts one and then overrides it. Onboarding asks
> two questions and changes nothing. There is no way to say "not interested" anywhere in
> either client. Content Preferences takes an explicit instruction, honours it on every
> feed, and hands the content straight back the moment you type a name into search.

The loop breaks in two distinct places, and both matter:

**Input never collected.** The one moment a new user will happily state their taste is
spent on gender and country, neither of which moves a single recommendation. There is no
negative-signal control on any surface: no "not interested," and on the Browse tab, no
hover affordance at all. The recommender is asked to personalize without ever being given
anything to personalize on.

**Input collected, then overridden.** Where a user *does* give an explicit instruction, the
product honours it on feeds and grids and breaks it everywhere else. This half has a single
architectural cause, established below, and it is the strongest finding in the piece.

Both halves produce the same experience: a viewer tells Kick something, and the product
behaves as though they hadn't.

### The mechanism behind the second half *(established 26 Jul)*

Kick ships two independent suppression controls. Both make an explicit written promise.
Both were tested to destruction on 26 Jul, and they fail the same way.

| | Content Preferences: Hide Slots & Casino | Block a creator |
|---|---|---|
| The promise | *"…the types of content you'd like to hide"* | *"…you will no longer see their content"* |
| Feeds and grids | Honoured | Honoured (mobile) |
| Search | **Leaks** | **Leaks** |
| Direct navigation | **Plays** | **Plays** |
| Across clients | n/a (account setting) | **Doesn't sync** |

Two different mechanisms, built by presumably different teams, failing identically. That's
not two bugs, it's one architectural fact: **suppression is implemented at the feed
rendering layer and never in the content graph.** Anything that reaches content by naming
it rather than by being served it bypasses every control the user has.

This is the strongest thing in the teardown. It's falsifiable, it's proven twice, and it
explains the failures rather than just listing them.

It also explains why the first half of the loop stays broken. A system that treats
suppression as a display concern has no reason to feed a user's choices back into ranking.
That is the same reason blocking someone on mobile hides them from a shelf and teaches the
recommender nothing, and the same reason there is no "not interested" to build: the product
has no pathway for a user's preference to reach the thing that does the ranking. Collecting
better input and honouring the input already collected are not two projects. They are the
same missing pathway, seen from either end.

The business consequence: Kick began rolling out ads in April 2026. Ad revenue needs
session depth and inventory advertisers will buy. A discovery surface that fails new
viewers caps the first. Gambling across four homepage placements caps the second. The 95/5
**subscription** split means subscriptions can't carry the platform, so ads have to work.

### Kick already said this, publicly, in April 2026 *(verified 26 Jul)*

The strongest framing available, and it isn't Jay's opinion. On 10 April 2026 Kick
announced 100 million users. Co-founder **Bijan Tehrani** used the milestone to say the
platform is not where it needs to be: it was rushed to market, the infrastructure wasn't
ready, and the beta label stayed on for a reason. He also said Kick is rolling out a **V1
algorithm** intended to make it, in his words, the best long-form streaming platform for
authentic engagement and **discovery**.

That reframes the teardown. This is not an outsider telling a company about a problem it
hasn't noticed. It's a documented account of the exact gap the co-founder named three
months earlier, captured on the live product, with the mechanism identified. Open on
Tehrani's admission and the reader arrives already agreeing that discovery is the problem.
The only question left is *how* it's broken, which is what the evidence answers.

It also does defensive work. The likeliest dismissal of a piece like this is "a fan with a
grievance." Leading with the company's own diagnosis makes that read unavailable.

**Caveat to hold.** If V1 ships between now and publication, Cluster A could be overtaken.
Date the piece prominently, state that all captures are 25–26 July 2026, and check whether
V1 has rolled out before posting.

---

## The causal chain

The spine of the argument. Each link is observed, not inferred.

1. Onboarding asks two questions: **gender** and **country**. Both captioned "this
   helps us find you more relevant content."
2. The recommender takes **positive signal only**, on both clients. You can follow a
   channel. Neither web nor mobile offers a "not interested." The only channel-level
   control is **Block**, mobile-only, a moderation primitive, and it doesn't reach
   search, playback, or the web client. See A2.
3. A new user follows nobody. The sidebar reads *"You are not following any channel yet."*
4. So the system has no usable input, and the post-onboarding home is materially the
   anonymous home.
5. The new user fails to find anything and retreats to a channel they already knew.

Observed end to end across roughly 80 minutes, 23:27 to 00:50, verified against the
menu-bar clock in every original screenshot.

---

## Primary evidence: the timed cold-start task

Jay, logged out, instructed to find something to watch that wasn't a channel he already
knew.

| Measure | Result |
|---|---|
| Time to a candidate | ~10 minutes |
| Clicks | 4 |
| Watch duration | under 2 minutes |
| Candidate's audience | 2 viewers, including Jay |
| Outcome | **Abandoned.** Returned to xQc, a known channel. |
| Path | Top Live Categories → View all → long scroll → Music Production → grid of ~6–8 rows × 6 |

In his words, verbatim from the notes, comma splice and capitalisation intact: *"And
honestly I just feel like there's too many options to choose from and at some point I
felt overwhelmed, Too many sub divisions to get into to find a decent category and then
find a streamer"*

**xQc was the featured stream on the homepage the entire time.** Ten minutes of navigation returned him to where he started. The system worked as
designed; it just wasn't designed for him.

---

# Findings

Grouped into four clusters. A, B, and C carry the argument. D is supporting texture.

---

## Cluster A. The personalization is hollow

### A1. Personalization theatre in onboarding

The modal, verbatim, in three parts: heading **"Tell us a bit about you"**, then the
username, then body copy **"Help us answer the upcoming questions to find the right
content for you."**, then a **Get started** button.

Then two questions, both verbatim below and both re-read off the originals 26 Jul:

- **Question 1/2. "How do you identify yourself?"** Sub-caption: *"This helps us find you
  more relevant content, and won't be shown on your profile."* Four radio options: Female,
  Male, Prefer not to say, Other. Jay selected Male.
- **Question 2/2. "Where are you based?"** Same sub-caption word for word. One field
  labelled **Country/Region**, a **dropdown**, defaulting to United States. It is not a
  radio group; the Figma prototype was corrected to match.
- Both carry the same footer: *"Disclaimer: We don't sell your personal data or use it to
  track you across other apps or websites."*

The sub-caption is the whole finding in one line. The product tells the user, twice, that
answering will produce more relevant content. It produces none.

Logged-out home (23:27) vs post-onboarding home (23:59): identical promo banner,
identical featured stream, identical category order.

**Sidebar comparison, re-verified 26 Jul at 3x against the original captures.** Four
states, three of them before Jay answered a single question:

| # | Logged out, 23:27:34 | Logged out, 23:46:55 | Mid-onboarding, 23:57:49 | Post-onboarding, 23:59:18 |
|---|---|---|---|---|
| 1 | xQc | xQc | xQc | xQc |
| 2 | DeenTheGreat | DeenTheGreat | DeenTheGreat | DeenTheGreat |
| 3 | Knut | Knut | Knut | Knut |
| 4 | markclarkk | hanvee *(Slots & Casino)* | markclarkk | markclarkk |
| 5 | jacksonfelt *(Slots & Casino)* | markclarkk | Jared *(Slots & Casino)* | Jared *(Slots & Casino)* |
| 6 | Doge *(Slots & Casino)* | BreEazyy | BreEazyy | BreEazyy |
| 7 | BreEazyy | kaneljoseph | kaneljoseph | kaneljoseph |
| 8 | kaneljoseph | Jared *(Slots & Casino)* | hanvee *(Slots & Casino)* | hanvee *(Slots & Casino)* |
| 9 | TheBurntPeanut | TheBurntPeanut | TheBurntPeanut | TheBurntPeanut |
| 10 | chessbrah | chessbrah | chessbrah | chessbrah |

Evidence, in column order: `screens/Home.png`, `screens/After searching XQC on search
bar.png`, `screens/Onboarding.png`, `screens/After onbaording home page.png`. Every
timestamp is read off the macOS menu-bar clock in the capture itself.

The post-onboarding roster is **the same ten channels as the logged-out roster twelve
minutes earlier**, reordered within positions 4–8. Not one new channel entered the list
after Kick learned Jay's gender and country.

**Be precise about which twelve minutes.** The comparison that yields "the same ten
channels" is **column 2 against column 4**, 23:46:55 to 23:59:18, which is twelve minutes
and twenty-three seconds. Column 1 against column 4 is thirty-two minutes, and across that
span the roster is *eight* of ten, not ten of ten, because jacksonfelt and Doge drop out.
Both statements are true and they are not interchangeable. A draft briefly said
"thirty-two minutes" with "the same ten channels" attached to it, which is false.

**The tightest version of the claim, added 26 Jul.** Column 3 is the onboarding modal
itself at 23:57:49, twelve seconds before the gender question appeared and sixty-nine
seconds before the country question. The roster in that frame is *already identical* to
the post-onboarding roster at 23:59:18. So the shelf reached its final state before Jay
answered anything, and answering changed nothing at all. Use this pair as the exhibit;
it is the same argument with the confound removed.

The two channels that did turn over (jacksonfelt and Doge out, hanvee and Jared in)
turned over at 23:46:55, *while still logged out*, and were replaced by two more Slots &
Casino channels. That's shelf rotation, not a response to anything the user said.

**This is stronger than the original framing.** The earlier read ("8 of 10 unchanged")
implicitly credited onboarding with two changes it didn't make. The verified version is
that onboarding changed nothing, and the churn the user might mistake for
personalization is a gambling shelf cycling through gambling channels.

**Cost:** the highest-intent personalization moment in the product, spent on
demographics that produce no observable change. A trust liability if a user notices.

**Still assumed:** that a longer observation window wouldn't show a delayed change. Only
22 minutes of post-onboarding state was captured. Worth one more capture at +24h before
publishing, though the claim as stated ("no observable change at signup") holds.

### A2. Neither client has a "not interested." The one control that exists is a block, and it leaks

**Tested and evidenced 26 Jul.** Earlier drafts of this finding were rescoped twice. This
version is the one the screenshots support.

**Neither platform offers recommender feedback.** On web, the Recommended module's only
controls are "Show More" and "Show Less," which change list length, not content. Hovering
a channel you don't want on the home shelf returns a tooltip with the stream title, and
nothing else (`screens/No option to select "not interested" on any streamer.png`,
00:44:50). On the Browse tab, under both Livestreams and
Categories, hovering a card returns **nothing at all**: no tooltip, no description, no
preview, no control (captured 26 Jul, 03:08). The negative-signal surface is not thin,
it is absent, and it is absent on the one page a viewer lands on when they are actively
looking for something to watch. On mobile, the channel Options sheet contains exactly two items:
**Block** and **Report**. Both clients offer a language filter and a sort control
(Recommended / Featured / Viewers high to low), and on web the Recommended shelf's "Show
More" opens nothing further (`screens/Once I clicked the show more on recommended, I can
only filter by language and sort based on recommended, featured and viewers.png`,
00:47:35). That's the whole surface.

**Evidence gap, flagged 26 Jul.** The mobile Options sheet is the one claim in A2 with no
standalone original on disk. It survives only inside `KICK.pdf`. Same for the Block
confirmation dialog quoted below, which currently runs on a 669px crop pulled out of that
PDF. Recapture both from the phone if they are still there.

**What Block promises.** The confirmation dialog reads: *"Once you block DeenTheGreat, you
will no longer see their content."* Unambiguous, and in the product's own words.

**What Block actually does.** Jay blocked DeenTheGreat on mobile and tested four surfaces:

| Surface | Blocked creator suppressed? | Evidence |
|---|---|---|
| Mobile home (Featured Creators, Streams For You) | **Yes** | `After blocking deenTheGreat on mobile.PNG` |
| Mobile search | **No.** Returns first under Channels, with a LIVE badge | `DeenTheGreat search result after blocking him.PNG` |
| Mobile playback from that search result | **No.** The stream plays, with chat | `Live visibile even after blocking him.PNG` |
| Web Recommended sidebar, same account, hard refresh | **No.** Still listed at 17.7K | `Blocked him on mobile but still see him on kick.com on the same account.png` (00:43:43) |

The block was active throughout: the profile Options sheet reads **Unblock**
(`DeenTheGreat blocked proof.PNG`). A second web capture at 00:49:46 shows him still in
the Recommended sidebar at 17.7K, six minutes after the first (`Proof that slots and
casinos is hidden.png`). So a blocked creator remains searchable, watchable, and recommended, and
the profile still offers a working **Follow** button.

**Three separate failures in one control:**

1. **It doesn't survive search.** Same failure as B1, different mechanism.
2. **It doesn't survive direct navigation.** The stream plays.
3. **It doesn't cross the client boundary.** A block set on mobile has no effect on web
   for the same logged-in account, after a hard refresh. That points at block state being
   held somewhere the web client never reads.

**Even if it worked, it would be the wrong control.** Block is a moderation primitive, not
recommender feedback:

| | Block | "Not interested" (missing) |
|---|---|---|
| Intent expressed | "This person is a problem" | "This isn't for me" |
| Social weight | Heavy, severs interaction | None |
| Where it lives | Profile, after you've opened it | On the shelf, where the rejection happens |
| Feels like | A permanent judgment | Tuning |

Nobody blocks a slots streamer because they'd rather watch chess. Asking a viewer to
escalate to a moderation action to express mild disinterest guarantees the control goes
unused, so the recommender learns nothing either way.

- **Benchmark:** Twitch offers "Not Interested" in context on channels and categories,
  which removes the item from the shelf and feeds the recommender.
- **Demand evidence:** at least three third-party tools exist to fill this gap (Kick
  Blocker, Filtered Kick, and an open-source extension), all advertising "hide unwanted
  streamers from Kick." All three are browser extensions, which is what you'd expect when
  the web client ignores the platform's own block state.
- **Undocumented:** Kick's help centre
  ([Viewer controls](https://help.kick.com/en/articles/10137491-viewer-controls-streamer-controls),
  updated 22 May 2026) describes only Content Preferences for viewers. Block isn't
  mentioned, on either platform.

**Cost:** a recommender taking only positive signal, from a user who follows nobody, can
never improve. This is the mechanism behind A1. And the one suppression control that does
exist makes a promise it doesn't keep, which is the same liability as B1 with a smaller
blast radius.

**Scope note for the write-up:** the mobile observations here are a single targeted test,
not a mobile teardown. Say so, and keep the mobile claims to exactly what the four
screenshots show.

---

## Cluster B. The safety controls don't hold

### B1. The content filter leaks into search *(strongest finding)*

Content Preferences offers three toggles: Hide Pools, Hot Tubs & Bikinis; Hide Slots &
Casino; Hide VR Chat. Section copy: *"Customize your experience by selecting the types
of content you'd like to hide."*

With **Hide Slots & Casino enabled**, verified at 00:06–00:09 on 26 Jul:

| Surface | Filtered? |
|---|---|
| Home dashboard | Yes |
| Browse → Categories | Yes |
| Recommended sidebar | Yes (after navigating; not on the current view) |
| **Search** | **No** |

Searching "slots" still returns **three gambling categories** (Slots & Casino, The Four
Kings Casino and Slots, Tasty Slot Machine), three gambling **channels** (auslots, slots,
NordicSlots), and **livestreams** including "24/7 Live Slots | 18+", "5/20 SLOTS EN
!1XBET", and "Stake/ Suggest slots". Stake is the casino founded by the same two people
who own Kick (see B3 for the precise relationship; don't write "parent company," it's
wrong and a reviewer will catch it). Evidence: `screens/Preferences tab.png` (00:06:09,
toggle on) and `screens/After hiding the slows and casino categories:streams .jpg`
(00:08:57, the leak). The second shot carries the whole finding on its own: the filtered
Browse grid, the unfiltered search dropdown, and the menu-bar clock, in one frame.

### B1b. The hidden category loads, and lies about why it's empty *(new, 26 Jul)*

Following the leak through answers the open question. Clicking **Slots & Casino** from the
search results loads `kick.com/category/slots` and the page renders in full:

- Header intact: box art, **"20.7K watching · 170.7K followers"**, a "Gambling" tag, and
  a working **Follow** button
- Grid empty: *"There are no livestreams / There are no livestreams matching your filters"*

Evidence: `screens/Slots and casino category.png` (00:18:08).

Two things follow. First, this **is a search-indexing gap, not a total filter bypass**.
The grid honours the toggle. That closes the open question and makes B1 a narrower,
more defensible claim: the filter is applied at the listing layer and search was never
wired into it.

Second, the empty state is wrong in a way that matters. It reads as *"nobody is streaming
this right now"* while the header on the same page says 20.7K people are watching. The
page contradicts itself. The honest string is *"Hidden by your content preferences"* with
a link to the setting, which would also be the only place in the product that tells a
user the filter is doing something.

**Why this sharpens the piece:** it converts B1 from "the filter is broken" into "the
filter works everywhere it renders a grid, and nowhere it renders a name." That is a
specific, cheap, believable bug, and it's harder to argue with than the broader version.

**Why this is the strongest item:** it isn't a design opinion anyone can argue with. The
product makes an explicit promise and breaks it on one surface. The population most
likely to enable this toggle is people managing a gambling problem, so the failure lands
hardest on exactly who the control exists to protect. The shape of the bug suggests the
filter is applied at the feed layer and search was never wired in.

**Cost:** a safety control that fails silently. Regulatory exposure in jurisdictions with
gambling advertising rules, and a duty-of-care problem that's hard to defend if it ever
gets attention.

**Answered 26 Jul:** both. See B1b and B1c.

### B1c. A hidden channel plays, in full *(new, 26 Jul)*

With **Hide Slots & Casino** confirmed on, Jay opened **auslots** from search. The stream
played: a live slot machine spinning "WIN NZ$30,075.00," chat active, Follow and Subscribe
buttons live (`screens/Auslots stream visible firectly form live search even after slots
and casinos is hidden.png`, 00:49:08).

The proof shot is the one to use in the write-up. `screens/Proof that slots and casinos
is hidden.png` (00:49:46) is the Settings → Preferences page showing **Hide Slots &
Casino toggled on**, with the slots stream still playing in a picture-in-picture mini
player in the corner of the same screenshot. The setting and its own violation are in one
frame. Verified 26 Jul: the toggle is green and on, the PiP shows a slot machine at
"227,250.00", the search field still reads "auslots", and the Recommended sidebar still
lists DeenTheGreat at 17.7K after the mobile block. One screenshot, three findings.

So the filter's coverage is now fully mapped:

| Surface | Filtered? |
|---|---|
| Home dashboard | Yes |
| Browse → Categories | Yes |
| Recommended sidebar | Yes |
| Search results | **No** |
| Hidden category page, opened from search | Partially. Header and follower count render, grid is empty |
| **Hidden channel page, opened from search** | **No. The stream plays** |

### B2. The safety controls are unlabelled and undiscoverable

**Corrected 26 Jul.** The earlier claim ("three tabs deep") overstated the depth and the
screenshots don't support it. Settings is a flat seven-tab bar (Profile · Security ·
**Preferences** · Notifications · Connections · Developer · Payment methods) and Content
Preferences sits one click away under Preferences. Evidence: `screens/profile menu.jpg`
(00:05:34, the unlabelled avatar menu), `screens/Settings tab from profile menu.png`
(00:05:44, Settings landing on Profile) and `screens/Preferences tab.png` (00:06:09,
Preferences tab active).

The real finding is discoverability, not depth:

- Entry is an unlabelled avatar menu → Settings, and Settings **lands on Profile**, not on
  anything content-related.
- Nothing in the tab label "Preferences" or the section heading "Content Preferences"
  signals that gambling controls live there. A user looking for them has to open tabs and
  guess. Jay's own account is that he clicked Profile, then Security, then Preferences.
- Nothing anywhere else in the product points at the setting. The gambling shelves on
  home, the Gambling row, and the category pages carry no affordance back to it.

Jay is a long-time daily Kick user and didn't know these toggles existed until he went
looking.

**Don't overclaim this one in the write-up.** One click behind a generic label is a
labelling and signposting failure, which is real but ordinary. The force of Cluster B
comes from B1/B1b, where the control that *is* found silently fails to hold. B2's job in
the argument is to establish that almost nobody reaches the control in the first place,
so state it plainly and move on.

**Cost:** a control nobody can find is a control that doesn't exist. Kick can point to it
in a regulatory conversation while almost no user benefits from it, which is arguably
worse than not shipping it, because it discharges the obligation without the outcome.

### B3. Gambling occupies the unauthenticated homepage

Served to a logged-out visitor with no age gate:

- A promotional banner across the top of the page reading **"LAST CHANCE: WIN A SHARE OF
  $100K"** above an **ENTER NOW** button. (These are two separate elements in the banner,
  not one string. Quote them separately.)
- "Slots & Casino" as the 7th Top Live Category
- A dedicated **Gambling** row further down
- Gambling channels in the Recommended sidebar (2 of 10 at 00:02 on 26 Jul)

Note the ordering problem: the filter in B1/B2 requires an account, but this is what an
anonymous visitor sees. There is no pre-auth control at all.

**Kick's own documentation sharpens this.** The help centre states that *"Viewers under 18
will not be able to access these categories by default"*
([Viewer controls](https://help.kick.com/en/articles/10137491-viewer-controls-streamer-controls),
updated 22 May 2026). So Kick does gate gambling by age, for account holders who declared
a birthday. An anonymous visitor declares nothing, and gets the $100K banner, the Slots &
Casino category, and the Gambling row on first paint. The protection is real and it
switches on one step *after* the exposure. Quote the help centre line in the write-up; it
lets Kick's own policy make the point.

**Cost:** brand safety for the ad business launched three months earlier, plus
regulatory exposure on age verification.

**Context to state accurately** *(verified 26 Jul, phrasing tightened):*

- Kick is owned by **Easygo Entertainment**. Reported split: **Bijan Tehrani ~two-thirds,
  Ed Craven's Ashwood Holdings ~one-third**. The pair are also the co-founders of
  **Stake.com** and have put close to **$1bn** into Kick.
- **Kick is not owned by Stake.** The two companies share founders and a parent group.
  Write it that way. "Kick is owned by a casino" is the version that gets the piece
  dismissed, and it isn't what the sources say.
- **Trainwreckstv:** no public record confirms an equity stake, and he has not been named a
  co-founder in any official capacity. Reporting describes an early promoter and advisor
  role. State the ambiguity, don't resolve it.

The relationship still carries the argument without any exaggeration: the people who own
the platform own the casino, and the platform's homepage sells the casino's category to
logged-out visitors. That's enough.

---

## Cluster C. The surface fails new viewers

### C1. Cold-start failure

See the timed task above. 10 minutes, 4 clicks, abandoned, retreat to a known channel.

**Cost:** new-viewer retention, the metric a challenger platform lives on.

### C2. Choice overload by structure

Top Live Categories → View all → long scroll → category page → undifferentiated grid of
~48 streamers, sorted viewers-high-to-low with only a language filter. The sort
guarantees the same top names surface every time and nothing routes a viewer toward fit.

**Cost:** time-to-first-watch, the leading indicator for everything downstream.

### C3. The empty search state does nothing

Tapping search shows no suggestions until you type. Once typing, results are genuinely
good: channels, categories, livestream titles, and "show all results," cleanly
separated.

**Cost:** a free, high-intent personalization surface sitting idle. Cheapest fix on the
list.

---

## Cluster D. Signup friction

### D1. Username collision with no suggestions

"Username is already taken," in red, no alternatives offered. Jay tried 2–4 before
succeeding, after already committing via Google OAuth. Evidence:
`screens/Username issue.png` (23:51:53).

**Cost:** abandonment at the last step, when acquisition cost is fully sunk.

### D2. Pre-checked newsletter opt-in, twice in one flow

"Subscribe to our newsletter and promotions," pre-checked, on both the signup form and
the account setup form. Jay unchecked it both times.

**Cost:** pre-ticked marketing consent is not valid consent under GDPR. Appearing twice
reads as deliberate rather than accidental.

### D3. Terms of Service modal with no scroll affordance

Fires after clicking Save. Dense, compact, no visible scrollbar, no indication of length.
Jay: *"I'm confused as to when will I reach the end, got annoyed and clicked I accept."*

Related: on the signup form, the Terms and Privacy Policy links are styled almost
identically to body text and don't read as clickable.

**Cost:** consent obtained through fatigue is weak consent, on a platform already under
regulatory attention.

---

## Positives (the piece needs these to be credible)

- Google and Apple OAuth on signup, avoiding a long form.
- Clicking Follow while logged out correctly prompts sign-in rather than silently failing.
- Search-as-you-type is good once you start typing: channels, categories, and livestream
  titles, cleanly separated.
- An embedded, playing featured stream on the homepage gives an immediate feel for the
  platform.
- The Content Preferences toggles do work on home, browse, and the sidebar. The problem
  is discoverability and the search gap, not the core feature.

---

## Open gaps before writing

- [x] ~~Re-verify the A1 sidebar comparison at full resolution.~~ **Done 26 Jul, then
      re-done against the originals.** Result was stronger than the original claim, twice.
      A1 now carries four sidebar states, one of them mid-onboarding, and one spelling
      correction: the channel is **hanvee**, not "harvee". Every other name and position
      in the table was confirmed at 3x.
- [x] ~~Decide: propose fixes or state findings only.~~ **Decided:** propose fixes for A1,
      A2, B1, B2, C3. Name B3 as a strategy problem without pretending to solve it.
- [x] ~~Recapture the Cluster B evidence.~~ **Done 26 Jul**, and since replaced by Jay's
      full-resolution originals. Now on disk: the avatar menu, Settings landing on Profile,
      the Preferences tab, all three Content Preferences toggles, the "slots" search leak,
      and the hidden category page. B1 and B2 are evidenced.
- [x] ~~Test whether a hidden category still loads when reached from search.~~ **Done.**
      It loads with the header and follower counts intact and an empty grid. Search-indexing
      gap, not a total bypass. Written up as **B1b** above.
- [x] ~~Capture the A2 evidence.~~ **Done 26 Jul, partially.** Web hover with no hide
      affordance is on disk. The mobile Options sheet showing only Block and Report is
      **not**; it survives only inside `KICK.pdf`. See the evidence gap note in A2.
- [x] ~~Test what mobile Block actually does.~~ **Done, and it was the highest-leverage
      test in the list.** Block suppresses the mobile feed and nothing else: the creator is
      still searchable, still playable, and still recommended on web after a hard refresh
      on the same account. A2 rewritten; the result also produced the architectural claim
      now sitting in the Thesis section.
- [x] ~~Does a hidden channel's page load?~~ **Done.** auslots plays in full with the
      toggle on. Written up as **B1c**. The proof screenshot has the stream running in a
      mini player on the same page as the enabled toggle.
- [x] ~~Mobile scope.~~ Resolved: web teardown, plus one targeted mobile test that is fully
      evidenced by four screenshots. Hold that line and don't let other findings drift.
- [ ] **Decide whether to disclose the block test to Kick before publishing.** A2 and B1c
      together describe how to bypass a gambling content filter. It's low severity and
      trivially rediscoverable, so this isn't a vulnerability disclosure in the security
      sense. But a portfolio piece that says "here's how to defeat a harm-reduction control"
      reads differently depending on whether you contacted them first. A short note to
      Kick support before you publish costs nothing and is worth a line in the write-up.
- [ ] Capture Twitch's new-user onboarding for a side-by-side against A1. **Recommend
      skipping.** A1 is now strong on its own evidence and the one Twitch fact needed
      ("Not Interested" exists in context) is already documented in Sources.
- [x] ~~Re-verify the secondary-source platform stats.~~ **Done 26 Jul.** All four hold,
      with corrections folded in above. Results:

| Claim | Verdict | Correction |
|---|---|---|
| 100M users | **Confirmed** | Announced 10 Apr 2026, three years after launch |
| 95/5 split | **Confirmed** | It's the **subscription** split. Partner Program opened 2024, $400M+ paid out, entry bar 25 subs / 250 followers as of Nov 2025. Kick documents it themselves |
| Ads from April 2026 | **Confirmed, with nuance** | A *rollout*, not a launch: overlay and pre-roll in select channels, broader availability later in 2026, and **creator-optional per channel**. Say "began rolling out" |
| Ownership | **Confirmed, phrasing was loose** | Easygo Entertainment. Tehrani ~⅔, Craven's Ashwood ~⅓. Not owned by Stake, shares founders. See B3 |

      The creator-optional detail actually helps the argument: if streamers choose whether
      to carry ads, Kick needs the ad product to be attractive, which needs brand-safe
      inventory, which is B3.

### Evidence inventory: what is actually on disk

`screens/` holds **Jay's original captures**, 1920×1080 on desktop and 1290×2796 on mobile.
It no longer holds `page-01…21.png` renders of `KICK.pdf`, and there is no `derived/`
folder; both were replaced. `KICK.pdf`, the 21-page Notes export, is kept as the source
of record and as the only home of two mobile frames noted below.

Every desktop timestamp below is read off the macOS menu-bar clock in the capture itself,
re-verified 26 Jul.

| File in `screens/` | Time | Evidences |
|---|---|---|
| `Home.png` | 25 Jul 23:27:34 | Logged-out home: $100K banner, Slots & Casino 7th category, sidebar state 1. **A1, B3** |
| `Pasted Graphic 1.png` | 23:28:25 | Logged-out home, scrolled |
| `Pasted Graphic 3.png` | 23:29:04 | Logged-out home, scrolled |
| `Pasted Graphic 6.png` | 23:30:00 | The dedicated **Gambling** row. **B3** |
| `Search bar.png` | 23:42:01 | Empty search state, no suggestions. **C3** |
| `All categories tab.png` | 23:43:22 | Browse, all categories. **C2** |
| `IRL Category.png` | 23:43:52 | Category page, undifferentiated grid. **C2** |
| `After searching XQC on search bar.png` | 23:46:55 | Search results, and sidebar state 2. **A1** |
| `Login:Signup prompt.png` | 23:47:54 | Follow while logged out prompts sign-in. *Positives* |
| `Signup flow.png` | 23:48:04 | Signup form, pre-checked newsletter, TOS link styling. **D2, D3** |
| `Account setup step after signing up with my gmail acc.png` | 23:50:56 | Account setup, second pre-checked opt-in. **D2** |
| `Username issue.png` | 23:51:53 | "Username is already taken," no suggestions. **D1** |
| `Onboarding.png` | 23:57:49 | The "Tell us a bit about you" modal, and sidebar state 3, *before* either question. **A1** |
| `gender question.png` | 23:58:01 | Question 1/2. **A1** |
| `Country question.png` | 23:58:58 | Question 2/2. **A1** |
| `After onbaording home page.png` | 23:59:18 | Post-onboarding home, sidebar state 4. **A1** |
| `profile menu.jpg` | 26 Jul 00:05:34 | Unlabelled avatar menu. **B2** |
| `Settings tab from profile menu.png` | 00:05:44 | Settings lands on Profile; the seven-tab bar. **B2** |
| `Preferences tab.png` | 00:06:09 | Content Preferences, all three toggles. **B1, B2** |
| `After hiding the slows and casino categories:streams .jpg` | 00:08:57 | The "slots" search leak with the filter on. **B1** |
| `Slots and casino category.png` | 00:18:08 | Hidden category page: header renders, grid empty. **B1b** |
| `After blocking deenTheGreat on mobile.PNG` | device clock 12:36 | Mobile home, creator gone. **A2** |
| `DeenTheGreat search result after blocking him.PNG` | 12:36 | Mobile search returns him LIVE. **A2** |
| `Live visibile even after blocking him.PNG` | 12:36 | His stream plays, with chat. **A2** |
| `DeenTheGreat blocked proof.PNG` | 12:36 | Profile reads **Unblock**. **A2** |
| `Blocked him on mobile but still see him on kick.com on the same account.png` | 00:43:43 | Web sidebar still lists him at 17.7K. **A2** |
| `No option to select "not interested" on any streamer.png` | 00:44:50 | Web hover returns a title tooltip and nothing else. **A2** |
| `Once I clicked the show more on recommended…png` | 00:47:35 | Show More offers only a language filter and a sort. **A2** |
| `Auslots stream visible firectly form live search…png` | 00:49:08 | Hidden channel plays in full. **B1c** |
| `Proof that slots and casinos is hidden.png` | 00:49:46 | Toggle on + slots stream in PiP + Deen still at 17.7K. **B1c, A2** |

**The mobile timestamps are an assumption, not a reading.** The four iPhone captures show
only a device clock reading 12:36 with no date. That is consistent with 00:36 on 26 Jul,
between the 00:18 desktop capture and the 00:43 one, and the block sequence has to sit
there for the 00:43 web capture to mean anything. It is consistent, not proven. If the
write-up gives a time for the mobile test, say "approximately 00:36" and nothing tighter.

**Two claims have no standalone original.** The mobile channel Options sheet (Block and
Report only) and the mobile Block confirmation dialog (*"Once you block DeenTheGreat, you
will no longer see their content."*) exist only inside `KICK.pdf`. The dialog currently
runs in the deck on a 669px crop pulled from that PDF, against 1290px for every other
mobile shot. It is the highest-value single recapture left.

**Everything else in this file points at a full-resolution original.**

**Scope caveat: the account state changes partway through.** From 00:05 onward the sidebar
reads *"Following: xQc, trainwreckstv."* Step 3 of the causal chain ("a new user follows
nobody") is evidenced only up to 23:59:18, where the sidebar reads *"You are not following
any channel yet."* Don't cite a post-00:05 screenshot as new-user state, and say explicitly
in the write-up that Clusters A2 and B were captured after two follows. It doesn't affect
the findings (the content filter and block are independent of follows) but a careful
reader will notice the sidebar changed and the piece should get there first.

**One number to sanity-check before publishing.** The web sidebar lists DeenTheGreat at
17.7K in both `Blocked him on mobile…png` (00:43:43) and `Proof that slots and casinos is
hidden.png` (00:49:46), each captured after the mobile block. Confirm you were logged into
the same account in that browser window. The avatar in the header says yes, and the
sidebar reads "Following: xQc, Trainwreckstv" which only a logged-in session shows, but
the whole cross-client claim rests on it and a reviewer will ask.

---

## Sources

- Kick help centre: [Viewer controls & streamer controls](https://help.kick.com/en/articles/10137491-viewer-controls-streamer-controls), [Managing your viewer profile](https://help.kick.com/en/articles/15064276-managing-your-viewer-profile-on-kick)
- Twitch: [How to customize content you see](https://help.twitch.tv/s/article/how-to-customize-content?language=en_US), [Recommendations on Twitch](https://www.twitch.tv/p/en/legal/recommendations-on-twitch/)
- Third-party workarounds: [Kick Blocker](https://chromewebstore.google.com/detail/kick-blocker/eihhplnmiccpdfdhlpdifmmemabionia), [Filtered Kick](https://chromewebstore.google.com/detail/filtered-kick/hhclialnbibimhdjhddoemdlehofpmlo), [kick-blocker-extension](https://github.com/sercanradulfr/kick-blocker-extension)
- Kick gambling/hot-tub filter announcement: [Sportskeeda](https://www.sportskeeda.com/esports/news-kick-introduces-option-filter-hot-tub-gambling-related-content-platform-fans-react)
- Ownership: [Dexerto](https://www.dexerto.com/entertainment/trainwrecks-kick-streaming-platform-appears-to-be-a-stake-com-project-2003847/), [Who Owns Kick](https://www.companieshistory.com/who-owns-kick/)
- Platform scale and the co-founder's own diagnosis: [Streams Charts](https://streamscharts.com/news/kick-reaches-100-million-users), [Kick hits 100M users, co-founder talks future (win.gg)](https://win.gg/kick-hits-100-million-users-co-founder-talks-future/), [Kick Hits 100M Users But Co-Founder Warns Milestone Masks Deep Platform Flaws (netinfluencer)](https://www.netinfluencer.com/kick-hits-100m-users-but-co-founder-warns-milestone-masks-deep-platform-flaws/), [Tehrani on funding and growth (Tribuna)](https://tribuna.com/en/casino/news/2026-04-14-bijan-tehrani-kick-reaches-100m-users-after-nearly-1bn-funding-from-stake-founder-edd-cra/)
- Revenue split, primary source: [Understanding KICK's revenue split](https://help.kick.com/en/articles/15159722-understanding-kick-s-revenue-split), [How to become a KICK Partner](https://help.kick.com/en/articles/12273402-how-to-become-a-kick-partner-and-how-kick-streaming-works), [Kick Partner Program](https://streamer.kick.com/partner)
- Ads rollout: [Kick (service) — Wikipedia](https://en.wikipedia.org/wiki/Kick_(service)), [Kick confirms advertising features are in development (Creator Handbook)](https://www.creatorhandbook.net/kick-confirms-advertising-features-are-in-development/)
- Ownership detail: [Who Owns Kick (StreamScheme)](https://www.streamscheme.com/who-owns-kick-streaming/), [Who Owns Kick (stream-rise)](https://stream-rise.com/blog/who-owns-kick)

**Verification status, 26 Jul 2026:** all platform statistics above have been checked
against multiple secondary sources, and the 95/5 split against Kick's own documentation.
Corrections are recorded in the Open gaps table. Two things remain sourced only to
secondary reporting and should be worded as reported rather than asserted: the precise
Easygo ownership percentages, and Trainwreckstv's role.
