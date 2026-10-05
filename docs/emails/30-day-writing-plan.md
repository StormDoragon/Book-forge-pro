# 30-Day Writing Plan: Buttondown setup and email copy

The blueprint signup form promises "a free 30-day writing plan". This file
holds the email to deliver it and the setup steps in Buttondown.

## Setup in Buttondown

1. Put your Buttondown username in `index.html`:
   `<meta name="buttondown-username" content="YOUR_USERNAME" />`.
   The signup forms stay hidden until this is set.
2. **Settings → Subscribing:** keep double opt-in on (better deliverability and
   GDPR-friendly). The confirmation email is the first thing a new subscriber sees.
3. **Tags** (created automatically on first signup):
   - `bookforge`: every signup from the site
   - `fiction`, `nonfiction`, or `memoir`: signups from the blueprint card
     (the footer form sends only `bookforge`)
4. **Automations:** create one that sends the email below when a subscriber
   confirms *and* has the `bookforge` tag. If you later write separate versions per
   book type, branch on the `fiction` / `nonfiction` / `memoir` tags.

## Welcome email

**Subject:** Your 30-day plan: from blueprint to first draft

**Preview text:** One small, specific task a day. Start today.

---

Hi there,

You just turned an idea into a blueprint. Most book ideas never get that far.
Here's how to get from that blueprint to a finished first draft in 30 days.

**The rules:** write a little every day, skip nothing, and don't edit until Day
30. Keep your blueprint open while you work. It's your map.

**Week 1: Foundations (Days 1-7)**

- **Day 1:** Re-read your blueprint. Rewrite the logline (or reader promise) in
  your own words, in one sentence.
- **Day 2:** Set a daily target. 60,000 words ÷ 30 days ≈ 2,000 words a day; pick
  what's honest for you and write it down.
- **Day 3:** Write the opening scene of Chapter 1 badly and fast. 500 words minimum.
- **Day 4:** Finish Chapter 1. Make its last line match the blueprint's chapter-ending hook.
- **Day 5:** Write Chapter 2. Introduce the opposing force (or the reader's core problem).
- **Day 6:** Write Chapter 3. Raise the stakes from your blueprint, one notch higher.
- **Day 7:** Rest day. Reread nothing. List three things you now know about the
  book that you didn't on Day 1.

**Week 2: Momentum (Days 8-14)**

- **Days 8-13:** One chapter a day, following your blueprint's outline. Before
  each session, read only that chapter's beat (purpose, conflict, hook).
- **Day 14:** Write the midpoint. Something irreversible happens here; make it cost something.

**Week 3: The hard middle (Days 15-21)**

- **Days 15-20:** Keep going, one chapter a day. If you're stuck, write the scene
  you're most excited about and come back.
- **Day 21:** Rest day. Update your blueprint: what changed? (Use **Remix** in
  BookForge to regenerate with your new direction.)

**Week 4: The ending (Days 22-30)**

- **Days 22-27:** Build to the climax. Every chapter should close a door behind your character (or your reader).
- **Day 28:** Write the climax. Pay off the dramatic question (or the promise).
- **Day 29:** Write the final chapter. Echo your opening image or first line.
- **Day 30:** Type "The End". Then do one thing only: write a single paragraph on
  what the book is *really* about now. That paragraph starts your revision.

**If you fall behind:** don't double up. Skip ahead to the next day's task. A
finished messy draft beats a perfect half-draft.

Reply to this email and tell me what you're writing. I read every reply.

Happy writing,
The BookForge Pro team

P.S. Share your blueprint card with your writing group. It helps to have
someone ask "how's the book going?"

---

## Follow-up ideas (optional)

- **Day 7 check-in:** "One week in: how many words?" (short, ask for a reply)
- **Day 15 check-in:** "The middle is supposed to feel hard" (encouragement plus one craft tip)
- **Day 31:** "You finished. Now what?" (revision checklist; later, a soft Pro pitch)
