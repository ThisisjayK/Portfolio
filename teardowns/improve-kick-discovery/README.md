# Nothing You Tell It Sticks

A product teardown of new-viewer discovery on **kick.com**, captured 25 to 26 July 2026.

**→ [Read the deck](https://ThisisjayK.github.io/product-teardowns/kick/)** (31 panels, horizontal, about 10 minutes)

---

## The finding

Kick ships two separate controls for hiding content you don't want: a **Hide Slots & Casino**
preference, and a **Block** on the mobile client. They were built for different jobs, almost
certainly by different teams. They fail in exactly the same place.

| | Hide Slots & Casino | Block a creator |
|---|---|---|
| The promise | *"…the types of content you'd like to hide"* | *"…you will no longer see their content"* |
| Feeds and grids | Held | Held (mobile) |
| Search | **Leaks** | **Leaks** |
| Direct navigation | **Plays** | **Plays** |
| Across clients | n/a, account setting | **Doesn't sync** |

Two mechanisms, one failure: **suppression is implemented at the feed rendering layer, and
never in the content graph.** Anything that reaches content by being *served* it respects the
user's choices. Anything that reaches it by *naming* it does not.

That same missing pathway explains the other half of the teardown. A system that treats
suppression as a display concern has no reason to feed a user's choices back into ranking,
which is why onboarding asks two questions and changes nothing, and why there is no "not
interested" anywhere in either client to build on.

## What's in this repo

This folder holds the written record only:

| | |
|---|---|
| [`FINDINGS.md`](FINDINGS.md) | The full evidence file. Every claim, every citation, every open gap |
| [`CAPTURE-BRIEF.md`](CAPTURE-BRIEF.md) | The original capture plan. Largely superseded, kept for method |

The reader-facing version of this teardown is the page on the portfolio site,
**Teardowns → Improving Discovery of Kick**, at
[`src/pages/KickTeardown.tsx`](../../src/pages/KickTeardown.tsx). The seven
interactive prototypes are in Figma and open full screen from inside it.

The 30 original captures, the standalone deck and `KICK.pdf` (my raw session
notes, kept as the source of record) live in the separate
[`product-teardowns`](https://github.com/ThisisjayK/product-teardowns) repo,
which is what the deck link above serves. They are not duplicated here.

## Method, and its limits

A timed cold-start task run first, before any analysis, to avoid contaminating it: logged
out, find something to watch that isn't a channel I already know. Ten minutes, four clicks,
abandoned. Everything after that was adversarial testing of the two content controls: switch
them on, then try to defeat them.

Worth holding while you read it:

- **n=1.** One person, one account, one session of roughly 80 minutes. The cold-start result
  proves the path can fail, not how often it does.
- **I'm a daily Kick viewer.** That's a bias, and it's also why I knew where to look. Every
  finding is tied to a timestamped capture specifically because of it.
- **Web teardown**, plus one targeted test of the mobile Block control that web doesn't have.
  The mobile claims extend as far as four screenshots and no further.
- Captured 25 to 26 July 2026. Kick announced a V1 discovery algorithm in April 2026 that had
  not shipped as of publication. If it ships, Finding 01 may date.

No affiliation with Kick, Twitch, or any party named. All screenshots are my own.
