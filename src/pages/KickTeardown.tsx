import { createContext, useContext, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

/* In-site version of the Kick teardown: same colour system and fonts as the
   rest of the site, rendered as a scrollable long-form page instead of the
   standalone slide deck. Content is the full teardown from docs/kick, condensed
   into prose but with nothing dropped, and the seven Figma prototypes opened
   full screen. */

const FIGMA_FILE = "yAU8DS7jS3kBf1oxQPxN8P"

type Proto = { node: string; title: string; sub: string }

function protoURL(node: string, host: string) {
  return (
    `https://${host}/proto/${FIGMA_FILE}/Kick?node-id=${encodeURIComponent(node)}` +
    `&scaling=contain&content-scaling=fixed&hide-ui=1&embed-host=kick-teardown`
  )
}

/* The open prototype is owned by KickTeardown so only one plays at a time and
   Escape can close the viewer before it closes the whole teardown. */
const ProtoContext = createContext<(p: Proto) => void>(() => {})

/* A live cross-origin Figma iframe swallows wheel + key events, so each
   prototype stays a poster in the flow and opens full screen on click. */
function Prototype({
  node,
  title,
  sub,
  compact = false,
}: {
  node: string
  title: string
  sub: string
  compact?: boolean
}) {
  const open = useContext(ProtoContext)
  return (
    <div className="td-proto">
      <div className="td-proto__stage">
        <button
          type="button"
          className="td-proto__poster"
          onClick={() => open({ node, title, sub })}
          aria-label={`Open the interactive prototype full screen: ${title}`}
        >
          <span className="td-proto__ring">▶</span>
          <span className="td-proto__lab">
            {compact ? "Prototype" : "Interactive prototype"}
            <span>{sub}</span>
          </span>
        </button>
      </div>
      <div className="td-proto__foot">
        <span>{title}</span>
        <a href={protoURL(node, "www.figma.com")} target="_blank" rel="noopener noreferrer">
          Open in Figma ↗
        </a>
      </div>
    </div>
  )
}

export default function KickTeardown({ onClose }: { onClose: () => void }) {
  const [proto, setProto] = useState<Proto | null>(null)
  // Read live state inside the stable listener so one Escape only ever closes
  // one layer (prototype viewer first, then the page).
  const protoRef = useRef<Proto | null>(null)
  protoRef.current = proto
  const modalRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (protoRef.current) {
        e.preventDefault()
        e.stopPropagation()
        setProto(null)
      } else {
        onClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Lock the page scroll behind the full-screen prototype viewer.
  useEffect(() => {
    document.body.classList.toggle("td-modal-open", proto !== null)
    return () => document.body.classList.remove("td-modal-open")
  }, [proto])

  // A cross-origin Figma iframe captures keyboard events, so once it takes focus
  // (it self-focuses on load, and again on any click inside it) the window-level
  // Escape handler never fires. Keep focus on the parent: move it to the modal
  // on open, and reclaim it whenever it slips into the iframe. `document.hasFocus`
  // distinguishes "focus went into the iframe" from "user switched app/tab", so
  // we don't fight the browser when they leave.
  useEffect(() => {
    if (!proto) return
    modalRef.current?.focus({ preventScroll: true })
    const reclaim = () => {
      window.setTimeout(() => {
        if (document.hasFocus() && document.activeElement === iframeRef.current) {
          modalRef.current?.focus({ preventScroll: true })
        }
      }, 0)
    }
    window.addEventListener("blur", reclaim)
    return () => window.removeEventListener("blur", reclaim)
  }, [proto])

  return (
    <ProtoContext.Provider value={setProto}>
    <motion.div
      className="teardown-page"
      role="dialog"
      aria-modal="true"
      aria-label="Kick discovery teardown"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: [0.22, 0.68, 0.24, 1] }}
    >
      <button className="teardown-close" type="button" onClick={onClose} aria-label="Close teardown (Escape)">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>Esc</span>
      </button>

      <div className="teardown-page__inner">
        {/* 01 TITLE */}
        <div className="eyebrow">
          <b>Product teardown</b> <b>· Discovery, trust &amp; safety</b> <b>· Jul 2026</b>
        </div>
        <h1>Improving Discovery of Kick</h1>
        <p className="lede">
          Kick&apos;s onboarding asks two questions and changes nothing. Its content filter takes
          an explicit instruction, holds it on every shelf, and breaks it the moment you type a
          name into search. The product never closes the loop on what a viewer tells it.
        </p>
        <div className="td-meta-wrap">
        <dl className="td-meta">
          <div>
            <dt>Subject</dt>
            <dd>kick.com, new-viewer discovery</dd>
          </div>
          <div>
            <dt>Captured</dt>
            <dd>25–26 Jul 2026, Chrome on macOS, plus one iOS test</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>Timed cold-start task, then adversarial testing of two controls</dd>
          </div>
          <div>
            <dt>Access</dt>
            <dd>Outside-in. No internal data, one account</dd>
          </div>
          <div>
            <dt>By</dt>
            <dd>Jayanth. Daily Kick viewer, which cuts both ways</dd>
          </div>
          <div className="td-meta__art" aria-hidden="true">
            <span className="td-meta__stamp">
              <b>Field study</b>
              n=1 · 82 min · 31 captures
            </span>
          </div>
        </dl>
        {/* Outside the <dl>: it clips to its rounded corners, which cut the
            monkey's legs off. The wrapper is the unclipped box it sits on. */}
        <span
          className="monkey monkey--snack"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}monkey-snack-sheet.png)`,
          }}
        />
        </div>

        {/* 02 CONTEXT */}
        <h2>What Kick is, and what I set out to answer</h2>
        <h3>The platform</h3>
        <p>
          A livestreaming platform competing with Twitch, still carrying a <strong>beta</strong>{" "}
          label on its own logo. Creators keep <strong>95%</strong> of subscription revenue, which
          is the number Kick recruits on and the reason subscriptions can&apos;t fund the business
          by themselves. So the money has to come from ads. Kick started placing them in{" "}
          <strong>April 2026</strong>, channel by channel, with each creator deciding whether to
          switch them on at all.
        </p>
        <p>
          Its owner, <strong>Easygo Entertainment</strong>, was founded by the two people who also
          founded the casino <strong>Stake.com</strong>. Kick is not a Stake subsidiary. The link
          is two shared founders and a common parent, and that distinction is worth holding onto,
          because the sloppy version of it is how a piece like this gets dismissed.
        </p>
        <h3>The question</h3>
        <p className="lede">
          Can a brand new viewer, with no history and no streamer in mind, find something to watch?
        </p>
        <p>
          And a second question that turned out to be the same question: when a viewer <em>does</em>{" "}
          tell Kick something explicitly, does the product honour it?
        </p>
        <div className="td-callout">
          <div className="h">Scope</div>
          <p>
            kick.com on web, logged out through post-onboarding, plus one targeted test of the
            mobile Block control that web doesn&apos;t have. One account, one session, roughly 82
            minutes. Everything is tied to a timestamped screenshot.
          </p>
        </div>

        {/* 03 THE SHORT VERSION */}
        <h2>The short version</h2>
        <p className="lede">
          Kick ships two controls for hiding content you don&apos;t want to see. Two features with
          nothing to do with each other, and they break in the same place.
        </p>
        <p>
          Both hold on feeds and grids. Both leak the moment you use search, and both let the
          content play if you go straight to its URL. <strong>The controls are wired into the
          screens, not into the content itself.</strong> Hide something and the shelves obey. Ask
          for it by name and it comes straight back. That same gap explains the first half of the
          teardown too: there&apos;s no route from what a viewer says to what actually gets ranked,
          so onboarding answers go nowhere, and the product has nowhere to put a &quot;not
          interested&quot; button even if someone built one.
        </p>
        <h3>The four findings</h3>
        <ul>
          <li>
            <strong>01.</strong> Onboarding asks gender and country, promises more relevant content,
            and the recommendation shelf is unchanged after answering.
          </li>
          <li>
            <strong>02.</strong> Neither client offers a way to say &quot;not interested.&quot; The
            one control that exists, mobile Block, doesn&apos;t survive search, playback, or the web
            client.
          </li>
          <li>
            <strong>03.</strong> Hide Slots &amp; Casino holds on three surfaces and fails on three.
            The failure lands hardest on exactly the people the control exists to protect.
          </li>
          <li>
            <strong>04.</strong> Gambling occupies the logged-out homepage, before a visitor has
            declared an age. This one is strategy, not a bug, and I don&apos;t propose a fix for it.
          </li>
        </ul>
        <p>
          Seven fixes follow, in the order I&apos;d ship them, each one prototyped. Measured on{" "}
          <strong>time to first watch</strong> and <strong>D7 new-viewer retention</strong>, with
          watch time in Slots &amp; Casino declared up front as the counter-metric.
        </p>

        {/* 04 THE ADMISSION */}
        <h2>Kick&apos;s co-founder said it first</h2>
        <p className="lede">
          On 10 April 2026 Kick announced 100 million users. Co-founder Bijan Tehrani marked it by
          saying the platform wasn&apos;t where it needed to be.
        </p>
        <p>
          It shipped before the infrastructure was ready, and the beta label stayed on for a reason.
          He said a <strong>V1 algorithm</strong> was coming, meant to make Kick the best long-form
          platform for authentic engagement and <strong>discovery</strong>. So the diagnosis
          isn&apos;t in dispute. Three months later I went looking for the mechanism.
        </p>
        <div className="td-stats">
          <div>
            <div className="n">100M</div>
            <div className="k">users, announced Apr 2026</div>
          </div>
          <div>
            <div className="n">95/5</div>
            <div className="k">subscription split. Subs can&apos;t carry it, so ads have to</div>
          </div>
          <div>
            <div className="n">2</div>
            <div className="k">hide-content controls tested</div>
          </div>
          <div>
            <div className="n">0</div>
            <div className="k">that survive search</div>
          </div>
        </div>

        {/* 05–06 COLD START */}
        <h2>Ten minutes to find nothing</h2>
        <p>
          Before analysing anything I ran one task on myself, logged out, with a stopwatch: find
          something to watch that isn&apos;t a channel I already know.
        </p>
        <blockquote>
          &quot;And honestly I just feel like there&apos;s too many options to choose from and at
          some point I felt overwhelmed, Too many sub divisions to get into to find a decent
          category and then find a streamer.&quot;
          <span className="td-blockcite">
            Verbatim from my notes, written immediately after the task. Typos and all.
          </span>
        </blockquote>
        <div className="td-stats">
          <div>
            <div className="n">~10<small> min</small></div>
            <div className="k">to a candidate</div>
          </div>
          <div>
            <div className="n">4</div>
            <div className="k">clicks</div>
          </div>
          <div>
            <div className="n">2</div>
            <div className="k">viewers on it, including me</div>
          </div>
          <div>
            <div className="n">&lt;2<small> min</small></div>
            <div className="k">watched before quitting</div>
          </div>
        </div>
        <p>
          Where the ten minutes went: Top Live Categories, View all, a long scroll, Music
          Production, then a grid of roughly forty-eight streamers, sorted viewers high-to-low with
          one language filter and nothing else. That sort guarantees the same names surface every
          time. I picked one, lasted under two minutes, and went back to xQc.{" "}
          <strong>xQc was the featured stream on the homepage the whole time I was looking.</strong>{" "}
          Ten minutes of navigation returned me to where I started. The system worked exactly as
          designed. It just isn&apos;t designed for someone arriving without a name in mind.
        </p>

        {/* 07 FINDING 01 */}
        <span className="td-finding">Finding 01</span>
        <h2 style={{ marginTop: ".2rem" }}>Personalization theatre</h2>
        <p className="lede">
          There&apos;s exactly one moment when a new user will happily tell you what they want to
          watch: the onboarding modal, right after signup, before anything is at stake.
        </p>
        <p>
          Kick uses it to ask two questions. <strong>Gender</strong>, then <strong>country</strong>.
          Both captioned <em>&quot;This helps us find you more relevant content, and won&apos;t be
          shown on your profile.&quot;</em> Nothing asks what you want to watch.
        </p>
        <h3>What changed afterwards: nothing</h3>
        <p>
          The top of the recommendation shelf, sampled three times, logged out at 23:27, logged out
          at 23:46, and post-onboarding at 23:59:
        </p>
        <table className="td-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Logged out, 23:27</th>
              <th>Logged out, 23:46</th>
              <th>Post-onboarding, 23:59</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>01</td><td>xQc</td><td>xQc</td><td>xQc</td></tr>
            <tr><td>02</td><td>DeenTheGreat</td><td>DeenTheGreat</td><td>DeenTheGreat</td></tr>
            <tr><td>03</td><td>Knut</td><td>Knut</td><td>Knut</td></tr>
            <tr><td>04</td><td>markclarkk</td><td>hanvee · slots</td><td>markclarkk</td></tr>
            <tr><td>05</td><td>jacksonfelt · slots</td><td>markclarkk</td><td>Jared · slots</td></tr>
            <tr><td>06</td><td>Doge · slots</td><td>BreEazyy</td><td>BreEazyy</td></tr>
            <tr><td>07</td><td>BreEazyy</td><td>kaneljoseph</td><td>kaneljoseph</td></tr>
            <tr><td>08</td><td>kaneljoseph</td><td>Jared · slots</td><td>hanvee · slots</td></tr>
            <tr><td>09</td><td>TheBurntPeanut</td><td>TheBurntPeanut</td><td>TheBurntPeanut</td></tr>
            <tr><td>10</td><td>chessbrah</td><td>chessbrah</td><td>chessbrah</td></tr>
          </tbody>
        </table>
        <p>
          The same ten channels as twelve minutes earlier, reordered within positions four to eight.{" "}
          <strong>Not one new channel entered after Kick learned my gender and country.</strong> The
          two that did turn over changed at 23:46, while I was still logged out, and both
          replacements were also Slots &amp; Casino, a shelf rotating on a timer, not a system
          responding. Eight minutes after signup the home page still showed the same promo banner,
          the same featured stream and the same category order as the logged-out page, with the
          sidebar reading <em>&quot;You are not following any channel yet.&quot;</em>
        </p>
        <div className="td-callout">
          <div className="h">Why it costs something</div>
          <p>
            The highest-intent personalization moment in the product, spent on demographics that
            produce no observable change. If a user ever notices, the caption becomes the problem:
            the product told them this would help.
          </p>
        </div>

        <span className="td-finding">The fix for Finding 01</span>
        <h3 style={{ marginTop: ".2rem" }}>Spend the moment on taste, not demographics</h3>
        <p>
          Keep gender and country, because age gating and regional licensing need them. Stop
          captioning them with a promise they don&apos;t keep. Then add a third question: three to
          five category picks, and seed the first session from those. One question more than today,
          and the only one of the three that earns the caption the other two are already using.
        </p>
        <Prototype node="9-206" title="A · Personalization theatre" sub="Before and after, 9 screens" />

        {/* 11 FINDING 02 */}
        <span className="td-finding">Finding 02</span>
        <h2 style={{ marginTop: ".2rem" }}>No way to say no</h2>
        <p className="lede">A recommender needs two signals. Kick collects one.</p>
        <p>
          You can follow a channel. On web there is no way to say you don&apos;t want to see one.
          &quot;Show More&quot; and &quot;Show Less&quot; change the length of the list, not its
          contents. On the home shelf, the entire web interaction for a channel you&apos;d rather not
          see is a tooltip telling you more about it; on the Browse tab, hovering returns nothing at
          all. On mobile there is one control, and it isn&apos;t feedback: the channel Options sheet
          contains exactly two items, <strong>Block</strong> and <strong>Report</strong>.
        </p>
        <div className="td-promise">
          <div className="lab">The product&apos;s promise, verbatim</div>
          <q>Once you block DeenTheGreat, you will no longer see their content.</q>
          <div className="verdict">Held on 1 of 4 surfaces tested</div>
        </div>
        <h3>So I blocked him, and went looking</h3>
        <table className="td-table">
          <thead>
            <tr>
              <th>Surface</th>
              <th>Suppressed?</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Mobile home</td><td>Yes</td></tr>
            <tr><td>Mobile search</td><td><span className="bad">No</span></td></tr>
            <tr><td>Playback from that result</td><td><span className="bad">No</span></td></tr>
            <tr><td>Web sidebar, hard refresh</td><td><span className="bad">No</span></td></tr>
          </tbody>
        </table>
        <p>
          The block was live throughout, the profile Options sheet read <strong>Unblock</strong> the
          whole time. On mobile home the creator was gone; in mobile search he was the first result,
          marked LIVE; tapping it played the stream. That last row is the strangest one: same
          account, same login, on web, after a hard refresh, DeenTheGreat is still sitting in
          Recommended at <strong>17.7K viewers</strong>. Block state lives somewhere the web client
          never reads.
        </p>
        <h3>Even working, it would be the wrong control</h3>
        <p>
          Block is a moderation primitive. &quot;Not interested&quot; is recommender feedback. They
          express different things and belong in different places.
        </p>
        <table className="td-table">
          <thead>
            <tr>
              <th />
              <th>Block</th>
              <th>&quot;Not interested&quot; (missing)</th>
            </tr>
          </thead>
          <tbody>
            <tr><th>Intent</th><td>&quot;This person is a problem&quot;</td><td>&quot;This isn&apos;t for me&quot;</td></tr>
            <tr><th>Social weight</th><td>Heavy, severs interaction</td><td>None</td></tr>
            <tr><th>Location</th><td>Profile, after you&apos;ve opened it</td><td>The shelf, where the rejection happens</td></tr>
            <tr><th>Feels like</th><td>A permanent judgment</td><td>Tuning</td></tr>
          </tbody>
        </table>
        <p>
          Nobody blocks a slots streamer because they&apos;d rather watch chess. Asking a viewer to
          escalate to a moderation action to express mild disinterest guarantees the control goes
          unused, so the recommender learns nothing either way. Twitch has offered &quot;Not
          Interested&quot; in context for years. Three third-party tools fill the gap on Kick, and
          all three are browser extensions.
        </p>

        <span className="td-finding">The fix for Finding 02</span>
        <h3 style={{ marginTop: ".2rem" }}>Put &quot;Not interested&quot; on the card</h3>
        <p>
          Where the rejection actually happens, separate from Block, and wired to ranking rather
          than to moderation. The prototype opens on the current Browse hover, which returns nothing
          at all, then shows the control and the three outcomes behind it: not interested in this
          stream, not interested in this streamer, hide the whole category. The third one is the
          escape hatch that stops a viewer having to reject slots channels one at a time.
        </p>
        <Prototype node="10-410" title="C · No way to say not interested" sub="Before and after, 7 screens" />

        {/* 16 FINDING 03 */}
        <span className="td-finding">Finding 03</span>
        <h2 style={{ marginTop: ".2rem" }}>The setting that only works where you can see it</h2>
        <p className="lede">
          Kick ships a real harm-reduction feature. The people most likely to enable it are people
          managing a gambling problem.
        </p>
        <div className="td-promise">
          <div className="lab">The product&apos;s promise, verbatim</div>
          <q>Customize your experience by selecting the types of content you&apos;d like to hide.</q>
          <div className="verdict">Held on 3 of 6 surfaces tested</div>
        </div>
        <p>
          The control is three toggles on one screen, pools &amp; hot tubs, Slots &amp; Casino, VR
          chat. Nothing in the label &quot;Preferences&quot; says gambling controls live here. I&apos;ve
          used Kick daily for years and didn&apos;t know until I went looking.
        </p>
        <h3>With the toggle on, I searched &quot;slots&quot;</h3>
        <p>
          Behind the dropdown, Browse is correctly scrubbed of gambling, the filter works. Inside
          the dropdown: three gambling <strong>channels</strong>, three gambling{" "}
          <strong>categories</strong>, and livestreams including &quot;24/7 Live Slots | 18+&quot;
          and &quot;Stake/ Suggest slots.&quot;
        </p>
        <h3>Click the hidden category</h3>
        <p>
          It loads. The header renders in full: box art, <strong>&quot;20.7K watching · 170.7K
          followers&quot;</strong>, a Gambling tag, a working Follow button. Then the grid says
          &quot;There are no livestreams matching your filters.&quot; The page contradicts itself,
          reading as &quot;nobody is streaming this&quot; while stating that 20,700 people are
          watching. The honest string is &quot;Hidden by your content preferences,&quot; which would
          also be the only place in the product that tells a user the filter is doing anything.
        </p>
        <h3>Click a hidden channel, and it plays</h3>
        <p>
          auslots, opened from search with the filter on. Live slot machine, active chat, Follow and
          Subscribe buttons, a casino promo link pinned in chat. Nothing on the page acknowledges the
          setting. <strong>Then this:</strong> Hide Slots &amp; Casino is still switched on, and the
          stream is still running in the mini player, bottom left, on the settings page that claims
          to hide it, the toggle is green while the slot machine is spinning. Setting and violation
          in one screenshot, 38 seconds after the stream opened. The same frame also shows
          DeenTheGreat at 17.7K, still recommended after the mobile block.
        </p>
        <table className="td-table">
          <thead>
            <tr>
              <th>Surface</th>
              <th>Filtered?</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Home dashboard</td><td>Yes</td></tr>
            <tr><td>Browse, Categories</td><td>Yes</td></tr>
            <tr><td>Recommended sidebar</td><td>Yes</td></tr>
            <tr><td>Search results</td><td><span className="bad">No</span></td></tr>
            <tr><td>Hidden category, from search</td><td><span className="bad">Partial</span></td></tr>
            <tr><td>Hidden channel, from search</td><td><span className="bad">No</span></td></tr>
          </tbody>
        </table>
        <div className="td-callout warn">
          <div className="h">Why this one is different</div>
          <p>
            Every other finding here is a design judgment someone could argue with. This isn&apos;t.
            The product makes an explicit written promise and breaks it on three surfaces.
          </p>
          <p>
            The population most likely to switch it on is the population it fails, and it fails{" "}
            <strong>silently</strong>. Nothing anywhere tells the user the filter has stopped
            applying.
          </p>
        </div>

        <span className="td-finding">The fix for Finding 03</span>
        <h3 style={{ marginTop: ".2rem" }}>Make the filter hold everywhere, and say so when it does</h3>
        <p>
          Apply the preference in the content service instead of at the point of render, so search,
          category pages, channel pages and every client inherit it without being told to. The
          prototype starts with the toggle switched on, walks the same search that leaked, and ends
          on results that honour it with a line explaining what was removed and a link back to the
          setting. That line is the part I&apos;d argue hardest for: right now nothing in the product
          ever tells a user the filter did anything. This is the expensive fix, and the only one that
          addresses a cause rather than a symptom.
        </p>
        <Prototype node="33-1736" title="B · The filter leaks on search" sub="Before and after, 5 screens" />

        {/* 22 THE MECHANISM */}
        <h2>Two controls, one failure</h2>
        <table className="td-table">
          <thead>
            <tr>
              <th />
              <th>Hide Slots &amp; Casino</th>
              <th>Block a creator</th>
            </tr>
          </thead>
          <tbody>
            <tr><th>Feeds and grids</th><td>Held</td><td>Held</td></tr>
            <tr><th>Search</th><td><span className="bad">Leaks</span></td><td><span className="bad">Leaks</span></td></tr>
            <tr><th>Direct navigation</th><td><span className="bad">Plays</span></td><td><span className="bad">Plays</span></td></tr>
            <tr><th>Across clients</th><td>n/a</td><td><span className="bad">No sync</span></td></tr>
          </tbody>
        </table>
        <p>
          Separate features. Different surfaces, different data models, almost certainly different
          teams. If these were two unrelated bugs they would fail in different places. They fail in
          the same place. Anything that reaches content by being <em>served</em> it respects the
          user&apos;s choices. Anything that reaches content by <em>naming</em> it does not: search,
          a direct URL, a shared link, a second client each bypass every control the user has.
        </p>
        <p>
          <strong>Collecting better input and honouring the input already collected are not two
          projects.</strong> A system that treats suppression as display has no reason to feed
          choices back into ranking either. Same pathway, missing from both ends.
        </p>
        <div className="td-promise">
          <div className="lab">The finding underneath the findings</div>
          <q>Suppression is implemented at the feed rendering layer, and never in the content graph.</q>
          <div className="verdict">Proven twice, by two independent mechanisms</div>
        </div>

        {/* 23 FINDING 04 */}
        <span className="td-finding">Finding 04</span>
        <h2 style={{ marginTop: ".2rem" }}>The part that isn&apos;t a bug</h2>
        <p className="lede">
          Everything above can be fixed by a team that decides to. This can&apos;t, and I&apos;m not
          going to pretend otherwise.
        </p>
        <p>Served to a logged-out visitor, no account, no age declared:</p>
        <ul>
          <li>
            A <strong>&quot;LAST CHANCE: WIN A SHARE OF $100K&quot;</strong> banner with its own{" "}
            <strong>ENTER NOW</strong> button, top of page
          </li>
          <li><strong>Slots &amp; Casino</strong> as the 7th Top Live Category</li>
          <li>A dedicated <strong>Gambling</strong> row further down</li>
          <li>Gambling channels in the sidebar, 2 of 10 when I checked</li>
        </ul>
        <p>
          Every control in Finding 03 requires an account. This is what arrives before one exists.
          Kick&apos;s help centre states that <em>&quot;Viewers under 18 will not be able to access
          these categories by default.&quot;</em> So the platform does gate gambling by age, for
          account holders who declared a birthday. An anonymous visitor declares nothing. The
          protection is real, and it switches on one step after the exposure.
        </p>
        <p>
          Kick is owned by Easygo Entertainment; reporting puts Bijan Tehrani at roughly two-thirds
          and Ed Craven&apos;s Ashwood Holdings at roughly one-third, and the same two people founded{" "}
          <a className="inline" href="https://www.streamscheme.com/who-owns-kick-streaming/" target="_blank" rel="noopener noreferrer">Stake.com</a>. Kick
          is not owned by Stake, they share founders and a parent group. One livestream that leaked
          past the filter in Finding 03 was titled &quot;Stake/ Suggest slots.&quot;
        </p>
        <div className="td-callout">
          <div className="h">Why there&apos;s no fix here</div>
          <p>
            Asking Kick to remove gambling from its homepage is asking Kick to be a different company.
          </p>
          <p>
            The narrower question is real though, for whoever owns ad revenue. Ads began rolling out
            in April 2026, creator-optional, channel by channel. That product has to be attractive
            enough for streamers to switch on and safe enough for advertisers to buy.
          </p>
          <p>
            <strong>Four gambling placements on the logged-out homepage, two of them above the fold,
            price that inventory.</strong> Someone inside Kick already has this number.
          </p>
        </div>

        {/* 25 ALSO OBSERVED */}
        <h2>The rest of what I found</h2>
        <h3>The empty search state does nothing</h3>
        <p>
          Nothing appears until you type. Once you type, the results are good: channels, categories
          and livestream titles, cleanly separated. The ranking works and the surface exists. It sits
          idle at the exact moment someone has told you they&apos;re looking for something.
        </p>
        <h3>Username collision with no suggestions</h3>
        <p>
          &quot;Username is already taken,&quot; in red, no alternatives offered. I tried several,
          after I&apos;d already committed via Google OAuth. Abandonment at the last step, when
          acquisition cost is fully sunk.
        </p>
        <h3>Signup collects consent it can&apos;t rely on</h3>
        <p>
          &quot;Subscribe to our newsletter and promotions&quot; arrives pre-checked on the signup
          form and again on account setup. Pre-ticked marketing consent isn&apos;t valid consent
          under GDPR, and appearing twice reads as deliberate rather than accidental. The Terms modal
          then fires after Save with no scrollbar and no indication of length. I gave up reading and
          clicked accept. That&apos;s consent obtained by fatigue, on a platform already under
          regulatory attention.
        </p>

        {/* 26 FOUR SMALLER FIXES */}
        <h2>The cheap ones</h2>
        <p>Four smaller fixes, all prototyped.</p>
        <div className="td-protogrid">
          <div>
            <Prototype node="11-614" title="D · Empty search state" sub="2 screens" compact />
            <h4>Seed the empty search state</h4>
            <p>Recent searches, followed channels, a few categories. The surface exists and the ranking already works.</p>
          </div>
          <div>
            <Prototype node="37-2478" title="F · The empty state that lies" sub="2 screens" compact />
            <h4>Stop the empty state lying</h4>
            <p>Belongs to Finding 03. Swap &quot;no livestreams matching your filters&quot; for &quot;hidden by your content preferences,&quot; linked to the setting.</p>
          </div>
          <div>
            <Prototype node="37-2348" title="E · Findable safety controls" sub="4 screens" compact />
            <h4>Make the safety controls findable</h4>
            <p>Also Finding 03. Rename the tab so it says what it holds, and put an entry point on the gambling shelves themselves.</p>
          </div>
          <div>
            <Prototype node="26-1124" title="G · Username collision" sub="3 screens" compact />
            <h4>Suggest usernames on collision</h4>
            <p>Offer three names that are actually free, at the step where the user has already committed via OAuth.</p>
          </div>
        </div>

        {/* 27 WHAT'S GOOD */}
        <h2>What&apos;s good, because a teardown that finds nothing good isn&apos;t credible</h2>
        <ul>
          <li>Google and Apple OAuth, avoiding a long form.</li>
          <li>Clicking Follow while logged out prompts sign-in instead of failing silently.</li>
          <li>Search-as-you-type is well built once you&apos;ve started typing.</li>
          <li>An embedded, playing featured stream gives an immediate feel for the platform.</li>
          <li>
            The Content Preferences toggles <strong>do</strong> work on home, browse and the sidebar.
            The core feature is sound. The problem is its edges.
          </li>
        </ul>

        {/* 28 WHAT I'D FIX */}
        <h2>What I&apos;d fix, in order</h2>
        <p>
          Seven changes, one per problem, each one prototyped above next to the problem it solves.
          Sizing is outside-in guesswork: I have no visibility into Kick&apos;s architecture, and
          anyone who claims otherwise from a screenshot is bluffing. RICE would need a Reach number I
          don&apos;t have. The <em>order</em> is the part I&apos;d defend, and it runs cause before
          symptom.
        </p>
        <table className="td-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Change</th>
              <th>Size</th>
              <th>Solves</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>01</td><td><strong>Move suppression out of the render layer.</strong> Apply preferences and blocks in the content service, so every surface and every client inherits them. The only one that addresses a cause, which is why it leads despite the cost.</td><td>Large</td><td>03, half of 02</td></tr>
            <tr><td>02</td><td><strong>Stop the empty state lying.</strong> &quot;Hidden by your content preferences,&quot; linked to the setting. Ranks this high because it takes an afternoon and covers the damage while 01 is still being built.</td><td>Small</td><td>03</td></tr>
            <tr><td>03</td><td><strong>Add &quot;Not interested&quot; to the card,</strong> both clients, separate from Block, wired to ranking.</td><td>Medium</td><td>02</td></tr>
            <tr><td>04</td><td><strong>Spend onboarding on taste.</strong> Keep gender and country for age gating and licensing, drop the caption they don&apos;t earn, add three to five category picks.</td><td>Small</td><td>01</td></tr>
            <tr><td>05</td><td><strong>Seed the empty search state.</strong> Recent searches, followed channels, a few categories. Almost no engineering.</td><td>Small</td><td>Cheapest</td></tr>
            <tr><td>06</td><td><strong>Make the safety controls findable.</strong> Rename the tab, and put an entry point on the gambling shelves themselves.</td><td>Small</td><td>03&apos;s other half</td></tr>
            <tr><td>07</td><td><strong>Suggest usernames on collision.</strong> Three names that are actually free, at the step where the user has already committed.</td><td>Small</td><td>Also observed</td></tr>
          </tbody>
        </table>

        {/* 29 METRICS */}
        <h2>How I&apos;d know any of it worked</h2>
        <p>
          No target values here. Targets need baselines, and I have no access to Kick&apos;s. What an
          outsider <em>can</em> specify is what to instrument, and what result would mean the fix was
          wrong.
        </p>
        <table className="td-table">
          <thead>
            <tr>
              <th>#</th>
              <th>What I&apos;d instrument</th>
              <th>Guardrail: how I&apos;d know I was wrong</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>01</td><td>Leak rate: sessions with a preference enabled that are still served hidden content via search, category or channel</td><td>Search latency, since you&apos;ve added a filter to the query path</td></tr>
            <tr><td>02</td><td>Click-through from the empty state to Content Preferences</td><td>Support contacts asking why a category is empty should fall</td></tr>
            <tr><td>03</td><td>Adoption in the first 7 days, then shelf click-through for users who used it against those who didn&apos;t</td><td><strong>Block usage should fall, not rise.</strong> If it rises, the control is in the wrong place</td></tr>
            <tr><td>04</td><td>Completion rate of the new question, then D1 and D7 return against a holdout</td><td>Total onboarding drop-off, because this adds a step and signup friction is itself one of the problems here</td></tr>
            <tr><td>05</td><td>Search initiation rate, then share of searches ending in a watch over two minutes</td><td>None. It&apos;s additive to a surface that currently does nothing</td></tr>
            <tr><td>06</td><td>Share of accounts that reach Content Preferences within 30 days</td><td>Toggle enable rate should rise. If it doesn&apos;t, the problem was never discovery</td></tr>
            <tr><td>07</td><td>Account-setup completion, and attempts per successful username</td><td>Time spent on the setup step</td></tr>
          </tbody>
        </table>
        <div className="td-callout">
          <div className="h">North star</div>
          <p>
            Time to first watch for a new viewer, and D7 new-viewer retention. Every row above is
            instrumented against those two. The cold-start task at the front of this teardown is the
            same measurement, run once, by hand.
          </p>
        </div>
        <div className="td-callout warn">
          <div className="h">The counter-metric, named up front</div>
          <p>
            <strong>Watch time in Slots &amp; Casino.</strong> Fixes 1, 2 and 6 should all push it
            down. The people who own Kick founded Stake. That makes this a negotiation, not a ticket.
            Better to put the number on the dashboard myself than let someone in ad sales produce it
            later.
          </p>
        </div>

        {/* 30 METHOD */}
        <h2>What I did, and what I can&apos;t claim</h2>
        <p>
          I ran the timed cold-start task first, before analysing anything, because doing it the
          other way round would have contaminated it. Everything after was adversarial testing of two
          controls: enable, then try to defeat.
        </p>
        <h3>What I&apos;d test next</h3>
        <ul>
          <li>Whether the leak affects the other two toggles or only Slots &amp; Casino.</li>
          <li>Whether a shared link or an embed respects either control.</li>
          <li>Whether the sidebar changes after 24 hours of viewing history, which is the fair version of the Finding 01 test.</li>
          <li>Mobile properly, rather than as a single probe.</li>
        </ul>
        <h3>Limits I&apos;d want a reader to hold</h3>
        <ul>
          <li><strong>n=1.</strong> One person, one account, one session. The cold-start result proves the path can fail, not how often it does.</li>
          <li><strong>I&apos;m a regular Kick viewer.</strong> That&apos;s a bias and it&apos;s why I knew where to look. Every finding is tied to a captured screen, specifically because of it.</li>
          <li><strong>Web teardown</strong> plus one targeted mobile test. The mobile claims extend as far as four screenshots and no further.</li>
          <li><strong>Account state changed partway.</strong> By the block test I was following two channels. The &quot;follows nobody&quot; evidence is the 23:59 capture only.</li>
          <li><strong>Ownership and Trainwreckstv&apos;s role</strong> are secondary reporting, stated as reported.</li>
          <li><strong>Kick said a V1 discovery algorithm was coming.</strong> If it shipped after 26 July 2026, Finding 01 may be out of date.</li>
        </ul>

        {/* 31 SOURCES */}
        <h2>Sources &amp; verification</h2>
        <ul>
          <li>
            Kick help centre:{" "}
            <a className="inline" href="https://help.kick.com/en/articles/10137491-viewer-controls-streamer-controls" target="_blank" rel="noopener noreferrer">Viewer controls &amp; streamer controls</a>{" "}
            (updated 22 May 2026),{" "}
            <a className="inline" href="https://help.kick.com/en/articles/15159722-understanding-kick-s-revenue-split" target="_blank" rel="noopener noreferrer">Understanding Kick&apos;s revenue split</a>
          </li>
          <li>
            100M users and the co-founder&apos;s remarks:{" "}
            <a className="inline" href="https://streamscharts.com/news/kick-reaches-100-million-users" target="_blank" rel="noopener noreferrer">Streams Charts</a>,{" "}
            <a className="inline" href="https://win.gg/kick-hits-100-million-users-co-founder-talks-future/" target="_blank" rel="noopener noreferrer">win.gg</a>,{" "}
            <a className="inline" href="https://www.netinfluencer.com/kick-hits-100m-users-but-co-founder-warns-milestone-masks-deep-platform-flaws/" target="_blank" rel="noopener noreferrer">Net Influencer</a>
          </li>
          <li>
            Ownership:{" "}
            <a className="inline" href="https://www.streamscheme.com/who-owns-kick-streaming/" target="_blank" rel="noopener noreferrer">StreamScheme</a>,{" "}
            <a className="inline" href="https://www.dexerto.com/entertainment/trainwrecks-kick-streaming-platform-appears-to-be-a-stake-com-project-2003847/" target="_blank" rel="noopener noreferrer">Dexerto</a>
          </li>
          <li>
            Twitch benchmark:{" "}
            <a className="inline" href="https://help.twitch.tv/s/article/how-to-customize-content?language=en_US" target="_blank" rel="noopener noreferrer">How to customize content you see</a>
          </li>
          <li>
            Third-party workarounds:{" "}
            <a className="inline" href="https://chromewebstore.google.com/detail/kick-blocker/eihhplnmiccpdfdhlpdifmmemabionia" target="_blank" rel="noopener noreferrer">Kick Blocker</a>,{" "}
            <a className="inline" href="https://chromewebstore.google.com/detail/filtered-kick/hhclialnbibimhdjhddoemdlehofpmlo" target="_blank" rel="noopener noreferrer">Filtered Kick</a>,{" "}
            <a className="inline" href="https://github.com/sercanradulfr/kick-blocker-extension" target="_blank" rel="noopener noreferrer">kick-blocker-extension</a>
          </li>
        </ul>
        <p>
          All screenshots captured by me on 25–26 July 2026. No affiliation with Kick, Twitch, or any
          party named. Platform statistics verified against multiple secondary sources on 26 July
          2026; the revenue split against Kick&apos;s own documentation.
        </p>

        <button className="teardown-back" type="button" onClick={onClose}>
          ← Back to teardowns
        </button>
      </div>
    </motion.div>

    <AnimatePresence>
      {proto && (
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          className="td-protomodal"
          role="dialog"
          aria-modal="true"
          aria-label={`Prototype: ${proto.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 0.68, 0.24, 1] }}
        >
          <div className="td-protomodal__bar">
            <span className="t">{proto.title}</span>
            <span className="s">{proto.sub}</span>
            <span className="sp" />
            <a href={protoURL(proto.node, "www.figma.com")} target="_blank" rel="noopener noreferrer">
              Open in Figma ↗
            </a>
            <button
              className="td-protomodal__close"
              type="button"
              onClick={() => setProto(null)}
              aria-label="Close prototype (Escape)"
            >
              <span aria-hidden="true">✕</span>
              <span>Esc</span>
            </button>
          </div>
          <div className="td-protomodal__frame">
            <iframe
              ref={iframeRef}
              key={proto.node}
              src={protoURL(proto.node, "embed.figma.com")}
              title={proto.title}
              allowFullScreen
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </ProtoContext.Provider>
  )
}
