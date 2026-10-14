# Spotter, radar, track map, engineer and driving coach

Grid Central puts three people on your radio:

- **The spotter** watches the cars around you. It calls cars alongside, flags, and hazards on the track ahead.
- **The engineer** looks after your race: gaps, battles, rivals' pit stops, positions, laps to go, best laps, incidents, damage, fuel and strategy, and a debrief at the end.
- **The coach** looks at your driving. After each clean lap it finds the corner where you lose the most time and tells you what to change.

Each one has its own switch, voice and volume. The spotter is free. The engineer and the coach are part of Pro: on the free plan their panels have a **PRO** cover, and only the spotter speaks.

This chapter covers the **AI spotter** page (the live radar, the coach, lap analysis and progress), the track map on the **Overview**, the engineer's calls, **Rivals' strategy** on the **Race strategy** page, and **Your ratings and races** on the Overview.

---

## Before you start: getting live data

None of the live features work until the Grid Central companion is running and you're in the car in iRacing. The companion is the small program that reads iRacing's telemetry on your PC and passes it to Grid Central. Nothing leaves your computer.

### Steps

1. Open Grid Central. On the **Overview**, press **▶ Start companion**. You can also use **Settings → Connections → iRacing → ▶ Start companion**.
2. Leave the companion window open.
3. Start iRacing and load into a session. Get **in the car**: the menus and the garage screen aren't enough.
4. Click anywhere in Grid Central once. Browsers block sound until you've clicked the page, so do this before you drive.
5. Go to **AI spotter** in the left menu, or press **◉ Open live spotter** on the Overview.

### How to tell it's working

The status chip at the top right of the radar says **OFFLINE** (companion not running), **WAITING** (companion running, no session) or **LIVE**. The radar heading reads "Companion not running", "Waiting for iRacing", then "Get in the car to start spotting" until you're on track, and then the current call, such as "Clear around you".

### If it doesn't work

- **The chip stays OFFLINE.** The companion isn't running. Press **Start companion** again. If nothing happens, close Grid Central and open it again from the Start menu or the desktop shortcut, which starts the companion too.
- **The chip says WAITING.** iRacing isn't in a session yet, or you're still in the menus. Click **Drive** so you're sitting in the car.
- **Live, but silent.** Click once inside Grid Central (you may see "Your browser blocked the spoken call…"), then see **Voice and radio** below.

---

## The AI spotter page at a glance

Open it from **AI spotter** in the left menu. At the top are three buttons: **Lap data →**, **Spotter settings →** (jumps to the voice settings) and **◖ Test voice spotter**. Below them, from top to bottom:

- **LIVE RADAR** (free): the cars around you.
- **CORNER-BY-CORNER COACHING** (Pro): the coach's notes and your focus corner.
- **LAP ANALYSIS** (Pro): every lap against your best.
- **PROGRESS** (Pro): your sessions and the corners you've fixed.
- **SPOTTER RADIO** (free): the latest call and its time.

On the **Overview**, the **ON-TRACK SPOTTER** card has the master on/off switch ("Spotter ready" or "Spotter muted") and a **Configure spotter →** link to this page.

---

## Voice and radio: the basics

### What it does

Every spoken call goes through one radio. You pick the main voice, the speaking style and whether calls are read aloud at all. Then each person (spotter, engineer, coach) can be switched on or off, given their own voice, and set to their own volume.

### Where to find it

**Settings → Voice & radio**. The **Spotter settings →** button on the AI spotter page takes you straight there. The **Voice & radio** panel is at the top, followed by the **Spotter**, **Engineer**, **Coach** and **Talkback** panels.

### Setup

1. Go to **Settings → Voice & radio**.
2. Make sure the switch in the top-right corner of the **Voice & radio** panel is on. This is the master switch, and it's the same switch as the one on the Overview's spotter card.
3. Turn on **Read calls aloud**.
4. Pick a **Voice**. Voices in your language come first, and voices marked **★ natural** sound the most like a real person. When you pick one, you'll hear "Radio check. Car left. Clear."
5. Pick a **Speaking style**.
6. Go back to the AI spotter page and press **◖ Test voice spotter**. You should hear "Car left. Still there. Clear."

### Controls

| Control (as shown) | What it does | Default |
|---|---|---|
| Master switch (top right of **Voice & radio**; hover it to see "All voice calls: spotter, engineer and coach") | Mutes or unmutes all voice calls: spotter, engineer and coach. Talkback's answers and your crew's messages are still read out. The radar and the call log keep working while it's muted. | On |
| **Read calls aloud** | Speaks calls with your Windows voices. When it's off, calls still appear in the call log but aren't spoken. | On |
| **Voice** | The main voice. The spotter, engineer and coach all use it unless you give one its own voice. | System default (on first run, the best natural voice in your language is picked automatically if there is one) |
| **Speaking style** | How quickly calls are read. **Concise** is the quickest, **Enthusiastic** is a little slower, and **Calm** is the slowest. | Calm |

Language and units are set elsewhere: **Settings → Appearance & data → Language** (English, Español or Deutsch) also changes the language of the spoken calls, and **Units** (**Metric (litres, °C, km/h, metres)** or **Imperial (US gallons, °F, mph, feet)**) sets the fuel, temperatures, speeds and distances in the spoken calls (the spotter's hazard calls included), on the radar, in the coaching notes, and in the lap analysis chart and corner table. It also relabels the distance menus for **Hazards ahead** and **Reminder before the corner** in feet, rounded to the nearest 100 ft as the spoken hazard calls are.

### How calls take turns

When several calls come at once, they queue up, most important first:

1. **Urgent:** cars alongside and hazards ahead.
2. **Important:** flags, damage and engine warnings, "Box this lap" and "Box next lap", the end of a team stint, Talkback answers.
3. **Everything else:** coaching, gap reports, battles, rivals, positions, laps to go, best laps, lap times, incidents, weather, "pit window open", fuel saving and the debrief.

A more important call interrupts a less important one, which then carries on from the sentence it was on. Calls that wait too long are dropped rather than said late: after about 4 seconds for spotter calls, 20 seconds for important ones and 30 seconds for the rest.

### If it doesn't work

- **"Voice calls are muted. Turn them on to hear calls."** The master switch is off. Turn it on, either on the Overview card or in **Voice & radio**.
- **"Turn on Read calls aloud…"** or **"Spotter callouts are off…"**: turn that switch on in **Voice & radio**.
- **The voice list says "Unavailable in this browser".** The browser you're using can't speak. Use the Grid Central app window or Microsoft Edge.
- **The voice sounds robotic.** Choose a **★ natural** voice.
- **A different voice after changing language.** A voice for another language gives way to the best one for the new language. Pick yours again.

---

## The spotter

### What it does

The spotter calls cars alongside you, flags, and stopped or slow cars ahead. The alongside calls come straight from iRacing's own spotter, so they match what iRacing knows about cars beside you.

### Where to find it

Calls appear in the radar's **CALL LOG** and the **SPOTTER RADIO** panel. Settings: **Settings → Voice & radio → Spotter**.

### Setup

1. In **Settings → Voice & radio**, find the **Spotter** panel and make sure its switch (top right) is on.
2. Turn on **Spotter callouts**, **Flag callouts** and **Hazards ahead**.
3. Pick how far ahead hazards are called (the menu next to **Hazards ahead**).
4. Optional (Pro): give the spotter its own **Voice** so you can tell it apart from the engineer.

### Controls

| Control (as shown) | What it does | Default |
|---|---|---|
| **Spotter** switch (panel top right) | Turns the spotter on or off: alongside calls, flags and hazards | On |
| **Voice** | Gives the spotter its own voice. You hear "Car left. Clear." when you pick one. Pro only. | Same as main voice |
| **Volume** | How loud the spotter is, 10% to 100% in steps of 5 | 100% |
| **Spotter callouts** | Calls for cars alongside | On |
| **Flag callouts** | Yellow, caution, debris, blue, black, meatball, red, white and checkered flags, and "Green, green, green" after a caution | On |
| **Hazards ahead** (distance menu) | How far ahead stopped, slow or off-track cars are called: 200 m, 300 m, 500 m or 800 m (with **Imperial**: 700 ft, 1000 ft, 1600 ft or 2600 ft) | 300 m (1000 ft) |
| **Hazards ahead** (switch) | Turns hazard calls on or off | On |

### What each call means

**Cars alongside** (urgent; interrupts anything else):

| You hear | Meaning |
|---|---|
| "Car left" / "Car right" | One car is overlapping you on that side |
| "Three wide" | A car on each side of you |
| "Two cars left" / "Two cars right" | Two cars on that side of you |
| "Clear" | Nothing alongside any more. "Clear" is only said after a car was alongside, never on its own. |

**Flags** (each is called once when it comes out, and not repeated for a while):

- "Yellow flag. Careful ahead." / "Caution. Caution." / "Green, green, green." (the caution is over)
- "Debris flag. Watch the surface."
- "Blue flag. Faster car behind, let them by."
- "Black flag. Pit this lap." / "Meatball flag. Pit for repairs." (damage you must fix)
- "Red flag. Red flag." (the session is stopped)
- "White flag. Last lap." / "Checkered flag."

**Hazards ahead** (urgent):

- "Car stopped ahead, Turn 5. 250 metres." A car is barely moving (under about 8 km/h).
- "Slow car ahead. 300 metres." A car is going under about 40 km/h.
- "Car off ahead, Turn 9. 150 metres." A car has left the track.

The turn number is only given when Grid Central has iRacing's official map of the track (see **The track map**). Distances are rounded to the nearest 50 m. With **Imperial**, they're given in feet, rounded to the nearest 100 ft: "Slow car ahead. 1000 feet." Only the nearest new hazard is called at a time, and the same car isn't called again for 30 seconds unless its state changes (from slow to stopped, for example). Cars on pit road are ignored.

### Tips

- On fast tracks, set **Hazards ahead** to 500 m or 800 m (1600 ft or 2600 ft) to give yourself more warning. On tight street circuits, 200 m (700 ft) cuts down on calls about cars that aren't in your way.
- If you already use iRacing's own spotter, turn one of them down so you don't hear every call twice.

### If it doesn't work

- **No alongside calls in qualifying.** In lone qualifying everyone runs on their own, so iRacing doesn't report the other cars near you. The spotter and radar stay quiet on purpose.
- **No hazard calls while I'm in the pits.** That's on purpose: hazards are only called while you're on track and not on pit road.
- **Hazard calls don't say which turn.** The official map for this track couldn't be found or downloaded (see **The track map**). The call still gives the distance.
- **Calls appear in the log but aren't spoken.** **Read calls aloud** is off, or the master switch or the **Spotter** switch is off.

---

## The live radar

### What it does

The radar shows you in the middle and the cars around you. iRacing's spotter says which side a car is on, and every car's distance along the track says how far ahead or behind it is. iRacing doesn't report where other cars are across the road, so cars ahead and behind are drawn in your lane.

### Where to find it

**AI spotter → LIVE RADAR**. Switch views with the **Proximity** and **Pit wall** buttons at the top right of the radar. Grid Central remembers your choice.

### Setup

1. Start the companion and get in the car (see **Before you start**).
2. Choose **Proximity** for a big, easy-to-read radar, or **Pit wall** for a slim radar next to relative timing.

### The Proximity view

| Part | What it shows |
|---|---|
| The radar | Your car in the middle, with range lines at 10 m and 20 m ahead and behind (30 ft and 60 ft with **Imperial**). It shows about 21 m (70 ft) each way. A car alongside sits beside you on the side iRacing reports. |
| Side glow and bars | The side with a car glows amber. It turns red when it's tight: three wide, two cars on one side, or a car right level with you (within about 1.2 m). |
| Car badges | Each car shows its number, coloured by class in multiclass sessions. |
| Edge markers | A small arrow at the top or bottom edge for the nearest car just off the radar (up to 60 m away), for example "#44 · 35 m" ("#44 · 115 ft" with **Imperial**). |
| Big word | STANDBY (not on track), CLEAR, CAR LEFT, CAR RIGHT, THREE WIDE, TWO LEFT or TWO RIGHT |
| Line under it | Who's there and where, for example "#44 J. Smith · half a car ahead" (or "nose at your rear wheel", "half a car behind", "level with you", "at your front wheel"). Otherwise "Nothing alongside". |
| **AHEAD** and **BEHIND** cards | The nearest car each way within 200 m: number, name, distance, time gap and trend ("▲ closing 12 km/h", "▼ pulling away", "▼ dropping back" or "steady"). Otherwise "Nobody within 200 m" ("Nobody within 656 ft" with **Imperial**). |
| Class bar | Multiclass sessions only. "**Faster class behind** · GTP #10 · 80 m, closing 40 km/h, with you in about 7 s" or "**Slower class ahead**", for another class within 160 m and closing. Otherwise "No other classes nearby". |
| **CALL LOG** | The last 12 calls with the time. Its heading also shows iRacing's raw spotter state, for example "IRACING SPOTTER: LEFT". |

### The Pit wall view

| Part | What it shows |
|---|---|
| Radar strip | Three lanes with you in the middle (YOU). It shows about 28 m each way, with ticks at 10 m and 20 m (30 ft and 60 ft with **Imperial**). The side zones light up amber or red the same way as in Proximity. |
| Relative table | The nearest four cars ahead (at the top) and four behind, within 260 m, with you in the middle. |
| First column | A chip: AHEAD, BEHIND, LEFT, RIGHT or YOU |
| **CAR** | Number and name, coloured by class |
| **CLASS** | The car's class. It's only shown in multiclass sessions. **CLASS** and **TIME** are hidden when the Grid Central window is narrow. |
| **GAP** | Distance ahead (+) or behind (−), in metres or feet. For a car alongside, where it is ("half a car ahead"). On your row: your position, such as P5. |
| **TIME** | The time gap in seconds |
| **TREND** | "▲ 12 km/h" when the gap is closing, "▼ 8 km/h" when it's growing, "—" when it's steady. On your row: your speed. |
| Call chips | The last six calls, under the table |

Speeds on both views (closing speeds, the trend and your own speed) are in km/h or mph, following **Settings → Appearance & data → Units**. Distances follow it too: metres (to a tenth of a metre on the **AHEAD** and **BEHIND** cards and in **GAP**), or whole feet with **Imperial**.

### Tips

- Cars on pit road aren't shown unless you're on pit road too, so a pit lane next to the track won't set the radar off.
- The trend reacts within about a second, so use it to judge whether a car behind is really coming at you.

### If it doesn't work

- **The radar says STANDBY.** You're not on track (you're in the garage or the menus).
- **Cars are alongside but not drawn beside me.** iRacing calls the side, and the radar picks the nearest cars within about 7.5 m to put there. If iRacing's spotter isn't calling a car, the radar won't put it beside you, even when it's close along the track.
- **The radar is empty in qualifying.** In lone qualifying other cars aren't on your piece of track, so they aren't shown.
- **It's not updating.** The radar pauses while the page is hidden and picks up again as soon as you come back to it.

---

## The track map

### What it does

The **Overview**'s race control panel shows a map of the track with a marker for your car, the part of the lap you've done, the start/finish line, and turn numbers. The same map gives the coach and the hazard calls their corner names ("Turn 5").

### Where to find it

**Overview**, in the panel with the track name. Before you're in a session, it shows the last track you drove, labelled **LAST SESSION**. In a session it shows **CURRENT SESSION**.

### Where the map comes from

1. **iRacing's official map.** In a session, Grid Central reads the shape, start/finish line and turn numbers from iRacing's published map of the track and draws it in its own style. This needs the internet the first time; after that it's kept.
2. **Your own laps.** If no official map is found, the map is traced from your first clean lap and redrawn from each new best lap.
3. **Nothing yet.** At a new track you'll see "The track map appears after your first full lap at a track."

### What's on it

| Mark | Meaning |
|---|---|
| Moving dot | Your car |
| Brighter line | How much of the current lap you've done |
| Short line across the track | Start/finish (hover for "Start / finish") |
| Numbered badges | With the official map: iRacing's turn numbers. Without it: the coach's own corner numbers (shown only when **Corner-by-corner coaching** is on). |
| Lit-up badge or ring | The corner you're working on. Hover over it to see "· focus corner" or "· target corner". |

### Corner names

With an official map, the coach and the hazard calls use iRacing's turn numbers, such as "Turn 5" or "T11a" (named corners like "Carousel" aren't used). Without one, the coach numbers the corners itself ("Corner 3", "C3"), counting from the start/finish line, and these numbers may not match the track's real turn numbers.

### If it doesn't work

- **No map after several laps.** None of your laps there were clean (see **Corner-by-corner coaching** for what counts as a clean lap), and no official map was found. Drive one clean lap.
- **The coach says "Corner 4" instead of "Turn 4".** The official map couldn't be found or downloaded. Check your internet connection and reload Grid Central while you're in the session.

---

## Corner-by-corner coaching

### What it does

After each clean lap, the coach compares every corner with your best and finds where you lost time. It works out *which part* of the corner lost it (the approach, the middle or the exit) and gives you the main fix, plus one more of a different kind if that also cost time. It can keep you on one **focus corner** until it's fixed, remind you before you get there, and tell you straight after whether you were quicker.

Corners are found from your own driving: slow corners where the speed dips, and fast kinks from the sideways g. Together they cover the whole lap.

### Where to find it

**AI spotter → CORNER-BY-CORNER COACHING** for the notes, and the **One thing to work on** card on the Overview. The settings are in **Settings → Voice & radio → Coach**. This is a Pro feature.

### Setup

1. In **Settings → Voice & radio → Coach**, check that the panel's switch and **Corner-by-corner coaching** are on.
2. Choose **How much it talks** (see below).
3. Drive with the companion running. Your first clean lap becomes the reference; from the next lap on, you get notes.

### What counts as a clean lap

A lap is used for coaching (and can be your reference) only if it's a complete lap with no pit road, no time off track and no incident. In the lap list, a lap that doesn't count is marked "NOT COUNTED" with the reason: **OUT LAP**, **PIT ROAD**, **OFF TRACK**, **INCIDENT** or **INCOMPLETE LAP**. Grid Central keeps your last 40 laps for each car and track, and remembers them between sessions.

### Controls

| Control (as shown) | What it does | Default |
|---|---|---|
| **Coach** switch (panel top right) | Turns the coach's voice on or off | On |
| **Voice** | The coach's own voice | Same as main voice |
| **Volume** | How loud the coach is, 10% to 100% | 100% |
| **How much it talks** | **Essential**: a note after the lap. **Standard** adds the reminder before the corner. **Everything** adds the result after it. It shows **Custom** if you change the switches yourself. | Everything (all three switches on) |
| **Corner-by-corner coaching** | The coach itself: notes, the focus corner, corner badges on the map | On |
| **Compare each corner with** | **Your best through it** (your best time in each corner from all your clean laps, your optimal lap) or **Your best lap** (your single fastest lap) | Your best through it |
| **Focus corner until fixed** | Keeps working on the corner you lose the most time in until it's sorted | On |
| **Target corner from last lap** | When focus is off, coaches the corner you lost the most time in on your last lap | On |
| **Reminder before the corner** (distance) | How far before your braking point the reminder comes: 100 m, 150 m, 200 m or 300 m (with **Imperial**: 300 ft, 500 ft, 700 ft or 1000 ft) | 150 m (500 ft) |
| **Reminder before the corner** (switch) | A spoken cue on the approach | On |
| **Corner result after it** | Tells you straight away whether you were quicker or slower than your best | On |
| **Progress across sessions** | Shows the **PROGRESS** panel | On |

### The coaching notes

For the selected lap, the panel shows up to three corners where you lost the most time (at least 0.04 s), worst first, and up to two where you were quicker. Each note looks like:

> **01** Turn 5 · Braking **0.21s lost**
> You braked 14 m earlier than your best. Stay flat a little longer and brake at your reference point.
> Also: get to full throttle 9 metres sooner.
> LAP 12 VS YOUR BEST HERE, LAP 8 · CLICK TO SEE THE TRACE

With **Imperial**, distances in the notes are in feet and speeds in mph, so this note says "You braked 46 ft earlier…" and "Also: get to full throttle 30 feet sooner."

Click a note to jump to that corner in **LAP ANALYSIS**. The **Open lap analysis ↓** button does the same for the whole lap.

### What each kind of note means

| Area | What the coach saw (and the fix) |
|---|---|
| **Braking** | You braked at least 6 m earlier than your best (brake later), or later but over-slowed (brake a touch earlier, release gently) |
| **Lift** | Fast corners: you lifted where your best stayed flat, or lifted longer or deeper |
| **Apex speed** / **Corner speed** | At least 3 km/h slower through the corner (trail off the brake, let the car roll in) |
| **Turn-in** | At least 8 m early, tightening the exit, or late, scrubbing speed in the middle |
| **Understeer** | More steering lock but less turning than your best: the fronts were sliding (slow a bit more, add lock gradually) |
| **Steering** | Two or more extra corrections (one smooth input) |
| **Oversteer** | You caught a slide on the way out (squeeze the throttle on more gently) |
| **Corner exit** | Full throttle at least 8 m later than your best |
| **Coasting** | At least 0.2 s longer with neither pedal pressed (blend brake to throttle) |
| **Exit speed** | At least 4 km/h slower leaving the corner |
| **Line** | At least 0.1 s lost with no single cause (compare the trace) |
| **Keep it up** | You were quicker here than your best |
| **Grip in reserve** | Even your best here uses clearly less grip than the car has held at the same speed elsewhere. It's a hint: banking, camber and bumps matter. |

These limits are measured in metres and km/h whatever your units. With **Imperial**, 6 m is about 20 ft and 8 m about 26 ft.

When the coach sees a slide on the way out, it doesn't also blame late throttle or extra steering, because the slide explains both.

### The focus card

When **Focus corner until fixed** is on, the card at the top of the coaching panel says **FOCUS CORNER · UNTIL IT'S FIXED**, with the corner, the area, the advice and three dots. A dot fills in for each clean lap in a row where you're within 0.06 s of your best through that corner. Three in a row and the corner is fixed: it moves to **CORNERS YOU'VE FIXED**, and the coach picks a new focus.

The focus is the corner that keeps losing you the most time over your last five laps. "Last time through:" shows how your last pass went, for example "0.12 s slower than your best · 1/3 clean laps".

With focus off and **Target corner from last lap** on, the card says **TARGET CORNER · FROM YOUR LAST LAP** and changes after every lap.

### What the coach says while you drive

| You hear | When |
|---|---|
| "New focus: Turn 5. Brake 14 metres later." | A new focus corner is picked |
| "Turn 5 next. Brake 14 metres later." | The reminder, the set distance before the braking point (or lift, on fast corners) |
| "Turn 5: two tenths slower." / "Turn 5: a tenth better." / "Turn 5: matched your best." | The corner result, straight after the corner |
| "Turn 5 sorted. Nice work." | Three clean laps in a row through your focus corner |
| "Turn 5: brake 14 metres later." | After a lap, with focus off and target on, if that corner lost at least 0.1 s |

With **Imperial**, distances are spoken in feet: "Brake 46 feet later."

Reminders and results stay quiet while a car is alongside you. Laps re-sent after Grid Central reconnects update the notes silently.

### Tips

- Leave **Compare each corner with** on **Your best through it**. Even your best lap gets coached where another lap was quicker, and the **OPTIMAL LAP** shows what that's worth.
- Use **Standard** if the corner results feel like too much talking, or **Essential** for one note per lap.

### If it doesn't work

- **"No clean lap yet to compare against."** All your laps so far went onto pit road, off track, had an incident, or were out laps. Drive a full clean lap.
- **"Lap 7 is your best lap, so it's the reference…"** You've selected the reference lap while comparing against your best lap. Pick another lap, or switch **Compare each corner with** to **Your best through it**.
- **No voice from the coach.** The coach is Pro. Check the **Coach** switch, **Corner-by-corner coaching**, **Read calls aloud** and the master switch. The coach is muted when the master switch is off.
- **No reminders.** Turn on **Reminder before the corner**, and make sure **Focus corner until fixed** or **Target corner from last lap** is on. Without either, there's no corner to remind you about.
- **The coaching changed after I switched car or track.** Coaching is kept separately for each car and track combination, layout included.
- **My laps and coaching are gone.** They're kept in this browser on this PC. Use **Settings → Appearance & data → Backup** to keep them safe or move them to another PC.

---

## Lap analysis

### What it does

It shows any lap against your reference: the speed, throttle, brake and steering traces, and a corner-by-corner table.

### Where to find it

**AI spotter → LAP ANALYSIS** (Pro). The tag at the top right shows the car and track.

### Controls and readouts

| Item (as shown) | What it is |
|---|---|
| **REFERENCE · YOUR BEST** | Your reference lap ("fastest clean lap" or "pinned"). Shows **REFERENCE · CHOSEN LAP** and a **Use my own best again** button when you're coaching against another lap. |
| **OPTIMAL LAP** | Your best of every corner, combined |
| **SELECTED LAP** | The lap you're looking at and how far it is from your best |
| **TIME ON THE TABLE** | Selected lap vs your optimal lap |
| **Clear laps** | Deletes every recorded lap for this car and track, your reference included. You're asked to confirm. The track map is kept. |
| **LAPS** list | Newest first: lap number, time, gap to the reference, and the time of day (or "NOT COUNTED · reason"). Click a lap to select it. |
| ☆ / ★ next to a lap | ★ is the reference. Click ☆ on a clean lap to pin it as the reference ("Compare against this lap instead"). Click the pinned ★ again to go back to your fastest lap. |
| **SPEED & PEDALS** chart | Speed (selected lap bright, **Best** grey), then **Throttle**, **Brake** and **Steering** (left above the line). Dashed lines mark the corners. The speed grid is marked every 50 km/h, or every 30 mph with **Imperial**, and the top line shows the unit. |
| Corner table | **Corner** (name, distance from the line, "fast" for fast corners, and which lap it's compared with), **Time** (+ lost, − gained), **Braking** (how far earlier or later), **Turn-in**, **Apex speed** (with the difference), **Full throttle** (how far sooner or later), **Coaching** (the short fix). Distances are in metres, or feet with **Imperial**; **Apex speed** is in km/h or mph. |

Click a corner row to zoom into that corner (click again, or **Show full lap**, to zoom out). The orange dot is where you braked, the hollow circle where your best did; the blue and dashed lines mark the two turn-ins.

### If it doesn't work

- **"Corners appear once you have a clean lap."** The corners are found on your reference lap, so you need one clean lap first.
- **No steering trace.** Older laps, or laps from some sources, may not have steering data.

---

## Coaching progress

### What it does

It tracks how you're getting on with this car and track over time.

### Where to find it

**AI spotter → PROGRESS** (Pro). It appears once you've driven at least one session here, and only while **Progress across sessions** is on.

| Part | What it shows |
|---|---|
| **SESSIONS** table | Each session, newest first: **Session** (date and time), **Laps**, **Best lap**, **Optimal**, and **vs previous** (your best against the session before) |
| **CORNERS YOU'VE FIXED** | Your last six fixed focus corners, with the area, how many laps it took and the date. With none yet: "None yet. Fix your focus corner for 3 clean laps and it appears here." |
| **KEEPS COMING BACK** | Corners that lost time on two or more of your last 20 clean laps, for example "slower on 6 of 20 laps · avg 0.14 s". With none: "No corner keeps costing you time. Keep it up." |

Progress is recorded even while the panel is off.

---

## Coach against a faster lap

### What it does

Instead of your own best, the coach compares every corner with someone else's lap: a teammate's shared lap, a lap from an iRacing telemetry file, or one from the lap library. All the notes then say "Alex's lap" instead of "your best".

### Steps

1. Go to **Lap data** and pick the car and track.
2. Find the lap in the list. Shared laps, telemetry file laps and library laps all appear there; clean laps have a **◎** button.
3. Press **◎** ("Coach against this lap"). A message confirms "Coaching against Alex's 1:47.320. Your laps are now compared with it on the AI spotter page."
4. Drive. Each note says, for example, "VS ALEX'S LAP".
5. To go back, press **Use my own best again** under **REFERENCE · CHOSEN LAP** in **LAP ANALYSIS**.

In the **Lap library** panel, ◎ does the same for a lap you've downloaded.

### Tips

- Pick a lap from the same car, track and similar conditions. A lap in different weather or with a different setup gives you misleading advice.
- While you're coaching against another lap, every corner is compared with that one lap, whatever **Compare each corner with** is set to.

---

## Your race engineer

### What it does

The engineer talks you through the session. It's part of Pro.

### Where to find it

**Settings → Voice & radio → Engineer**. Strategy calls are explained in the Race strategy chapter. This section covers the rest.

### Setup

1. Make sure the **Engineer** panel's switch is on.
2. Pick **How much it talks** (see the table below).
3. Fine-tune with the individual switches. The menu then shows **Custom**.

### Controls

| Control (as shown) | What it does | Default |
|---|---|---|
| **Engineer** switch | The engineer on or off | On |
| **Voice** | The engineer's own voice | Same as main voice |
| **Volume** | Engineer calls and Talkback answers, 10% to 100% | 100% |
| **How much it talks** | **Essential**: strategy, damage, weather, team stints and laps to go. **Standard** adds gaps, battles, rivals, positions, best laps, incidents and the debrief. **Everything** adds every lap time. | Standard |
| **Strategy callouts** | Pit window open, box this lap, fuel to add and fuel saving, in races | On |
| **Damage callouts** | Repair time after contact, and engine warnings | On |
| **Weather callouts** | Rain, the track getting wetter or drying, wets or slicks | On |
| **Team stint callouts** | Stint time warnings and who's next, in team races | On |
| **Gap reports** (menu) | Every 2, 3 or 5 laps | Every 3 laps |
| **Gap reports** (switch) | Your position and the gaps ahead and behind, in races | On |
| **Battle calls** | Defending from a quicker car behind, catching the car ahead | On |
| **Rivals' pit stops** | When the car ahead or behind in your class pits | On |
| **Position changes** | Gaining or losing places, in races | On |
| **Laps and time to go** | 10, 5, 3 and 2 laps; 30, 15, 10, 5 and 1 minutes | On |
| **Best laps** | When you beat your best this session | On |
| **Every lap time** | Your lap time and the gap to your best after every lap | Off |
| **Incidents** | When your incident count goes up | On |
| **Session debrief** | A short spoken summary when you leave a session (the full debrief is on the Overview) | On |

### What the calls sound like

| Call | Example | When |
|---|---|---|
| Gap report | "P6. Gap ahead 1.8, catching 3 tenths a lap. Behind 2.4, you're pulling away." | Races, every 2, 3 or 5 laps. The trend is only mentioned when it's at least a tenth a lap. |
| Defend | "Car 44 behind is quicker, about 4 tenths a lap, 8 tenths back. Defend the inside into the braking zones." | The car behind is within 1.5 s and was at least 0.25 s quicker last lap |
| Catching | "You're catching car 25, 3 tenths a lap. 2.1 to go." | The car ahead is within 3 s and you were at least 0.3 s quicker |
| Position | "Up to P5." / "Down to P7." | Races, once the position has held for 4 seconds (not on pit road) |
| Laps to go | "5 laps to go." | Races |
| Time to go | "15 minutes to go." / "One minute to go." | Timed races |
| Best lap | "Best lap, 1 47.3. Good job." | Any session, when you beat an earlier best |
| Every lap time | "1 48.1. 8 tenths off your best." or "1 47.3. Best lap." | Any session, when switched on |
| Incident | "Incident. That's 4 x now." | Any session |
| Damage | "Damage, probably front left. 12 seconds of repairs needed, 5 optional." | A hit adds about a second or more of repairs |
| Engine | "Water temperature warning." / "Oil temperature warning." / "Oil pressure warning." / "Fuel pressure warning." / "Engine stalled." | When iRacing raises the warning |

Battle calls skip laps that had a gap report, and call each car at most every 4 laps. "Probably front left" is an estimate from the jolt in the g-forces, since iRacing doesn't say where you were hit; with no clear jolt, it's left out.

### Tips

- If the radio is busy in close racing, set gap reports to every 5 laps, or switch **Battle calls** off.

### If it doesn't work

- **Gap reports, battles and laps to go never come in practice.** They're for races only.
- **No damage call after a hit.** The hit has to add about a second of repairs. Offline testing often reports no repair time at all.
- **The engineer is silent on the free plan.** The engineer is part of Pro. Only the spotter talks on the free plan.

---

## Rivals' strategy

### What it does

In races, it records every car's pit stops and predicts the next stop of the cars around you. It also feeds the engineer's **Rivals' pit stops** calls.

### Where to find it

**Race strategy → Rivals' strategy** ("THE CARS AROUND YOU"). The Race strategy page is part of Pro. The chip says **RACES ONLY** outside races and **LIVE · RACE** in a race.

| Column | Meaning |
|---|---|
| **POS** | Class position |
| **CAR** | Number and name; **IN PITS** while on pit road |
| **GAP TO YOU** | Seconds: + ahead, − behind |
| **STOPS** / **LAPS SINCE STOP** | Stops so far, laps since the last one |
| **USUAL STINT** | Average stint; * means guessed from your own fuel range |
| **NEXT STOP (ABOUT)** | The predicted lap, with "· soon" when it's two laps away or less |

It shows four cars ahead and four behind you in your class.

### The calls

- "Car 25 ahead has pitted. Push, you can jump them while they're in the pits." If your own pit window is open: "Push now, and we'll box to come out ahead on the overcut."
- "Car 44 behind has pitted, 2.3 back. Push now: fresh tyres will make them quicker." If your pit window is open: "Box this lap to cover the undercut, or push hard on these laps."

Only for cars in your class within 6 seconds, while you're on track, and at most once per car every 3 laps.

### If it doesn't work

- **Every car shows 0 stops.** Stops are only counted from when Grid Central started watching the race. If you joined late or reconnected, earlier stops are missed.

---

## Your ratings and races

### What it does

It charts your iRating and safety rating over time, and lists your recent races.

### Where to find it

**Overview → Your ratings and races**. The small heading says where the numbers come from: **FROM YOUR SESSIONS WITH GRID CENTRAL**, or **FROM IRACING · NAME** once you're signed in.

| Part | What it shows |
|---|---|
| **iRATING** chart | Your iRating each time it changed, with a summary such as "2,145 iR · +62 since 14 Sep" (the change over the last month) |
| **SAFETY RATING** chart | The same for your safety rating |
| **RECENT RACES** | Your last eight races: finishing position, track, date, car, starting position with places gained or lost, and incidents |

Your ratings are recorded each time Grid Central sees you in an online session (offline sessions don't send real ratings). Recent races come from the session debriefs, so they only include races driven with Grid Central running. The **Sign in with iRacing** button and category menu only appear once Grid Central has been approved for iRacing's official data; until then they stay hidden.

---

## Seeing spotter calls in the car

To see calls on your main screen, add the **Spotter** widget (in the **Race control** group) to a design on the **Race overlay** page. It shows CAR LEFT, CAR RIGHT, THREE WIDE, TWO CARS LEFT, TWO CARS RIGHT or CLEAR, and the **Minimal HUD** design already has it. Press **Show on screen** in the **In-game overlay** panel to put it over iRacing. iRacing must run windowed or borderless, and **Ctrl+Alt+O** hides and shows it. See the Race overlay chapter for more.
