# Kick Discovery Teardown: Capture Brief

> **Historical.** This brief was written before the capture session and is superseded by
> `FINDINGS.md`. Kept for provenance. The filenames it asks for were not the filenames
> used; see the evidence inventory in `FINDINGS.md` for what is actually on disk.

Everything below is what I need from you before I can write anything. Work through it
in one sitting if you can, roughly 30–40 minutes. Save all images into
`kick-teardown/screens/` using the filenames given.

**The one rule:** don't clean up your experience for the camera. If the home page is
full of stuff you don't watch, that's the finding. Capture it as-is.

---

## Part 1. The timed task (do this FIRST, before anything else)

This is the most valuable thing in the brief and it only works if you do it before you
start thinking analytically. Start a stopwatch.

**Task:** Find something to watch that is *not* Trainwrecks and not anyone you already
follow. Something you'd actually watch for 10+ minutes.

Record:

- **Time to decide:** ____
- **Number of taps/clicks:** ____
- **Did you succeed, or give up and go to a channel you already knew?** ____
- **Where did the candidate come from?** (home carousel / category / search / sidebar)
- **What made you reject the options you skipped past?**

Write this into `kick-teardown/notes.md` immediately, before the memory fades. Raw and
messy is fine. This is the only genuine behavioural data in the whole teardown, so
don't tidy it.

---

## Part 2. Screenshots, mobile app

| # | Filename | What to capture |
|---|---|---|
| 1 | `m-01-home-top.png` | Home screen, top. First thing you see on open. |
| 2 | `m-02-home-scroll1.png` | One full scroll down |
| 3 | `m-03-home-scroll2.png` | Two full scrolls down |
| 4 | `m-04-following.png` | The Following tab / feed |
| 5 | `m-05-following-empty.png` | Following tab when nobody you follow is live (may need to check at an off hour) |
| 6 | `m-06-browse.png` | Browse / categories page |
| 7 | `m-07-category-page.png` | Any one category page, opened |
| 8 | `m-08-search-empty.png` | Search, tapped but nothing typed yet |
| 9 | `m-09-search-typing.png` | Mid-typing, showing suggestions |
| 10 | `m-10-search-results.png` | Full results for a real query |
| 11 | `m-11-settings.png` | Any settings related to content, mature content, or preferences |
| 12 | `m-12-thumbnail-closeup.png` | Close crop of 3–4 stream cards, so the metadata on each card is legible |

## Part 3. Screenshots, web (kick.com, logged in)

| # | Filename | What to capture |
|---|---|---|
| 13 | `w-01-home.png` | Home, full window, above the fold |
| 14 | `w-02-home-scrolled.png` | Scrolled down one screen |
| 15 | `w-03-browse.png` | Browse / categories |
| 16 | `w-04-search-results.png` | Same query as #10, so mobile and web are comparable |
| 17 | `w-05-logged-out-home.png` | **Log out or use a private window.** What a brand-new user sees. |

---

## Part 4. The stress tests

These are the ones that produce real findings. For each, capture what happens and
write down what you expected instead.

1. **Try to remove a recommended streamer.** Long-press, tap the three dots, whatever
   you can find. Try to make one specific recommended channel stop appearing. Capture
   every option you're offered. If there's no way to do it, capture the menu that
   *should* have had it. → `t-01-remove-attempt.png`

2. **Try to hide a whole category.** Gambling, or any category you never watch. Can
   you? → `t-02-hide-category.png`

3. **Does the home page change?** Open the app, screenshot. Watch something for five
   minutes. Close, reopen, screenshot again. Did anything about the recommendations
   move? → `t-03-before.png`, `t-04-after.png`

4. **Search for something misspelled.** Type your streamer's name wrong on purpose.
   Does it recover? → `t-05-search-typo.png`

5. **Cold-start check.** Logged out, in a private window: how many clicks from landing
   on kick.com to actually watching a live stream? Count them. → `t-06-loggedout-path.png`

---

## Part 5. Notes to write while you go

In `kick-teardown/notes.md`, jot down anything in these buckets. Bullet points, no
structure needed:

- **Moments of friction.** Anywhere you paused, backtracked, or felt annoyed.
- **Things you've learned to work around.** The stuff you do automatically now because
  the app doesn't do it for you. These are gold and you'll almost forget to mention
  them because they feel normal.
- **Anything you actively like.** The teardown needs to be credible, and a piece that
  finds nothing good is a piece nobody believes.
- **What you'd expect Twitch to do differently**, if you've used it.

---

## What happens next

Once the screens and notes are in, I'll research how Kick's discovery ranking actually
works and benchmark it against Twitch, then turn your friction into a ranked findings
list where each item is tied to a business consequence. You'll approve the thesis and
the findings order before I write the full document.
