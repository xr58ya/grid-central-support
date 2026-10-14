# Data, lap analysis, strategy and car setups

This chapter covers three pages in the left-hand menu, plus the session debrief on the Overview:

- **📈 Lap data**: every lap you drive, compared side by side, with your session history, race events, iRacing telemetry files, shared laps and the online lap library.
- **⛽ Race strategy**: the fuel and pit stop planner before the race, and the live pit window during it.
- **🔧 Race setup**: the car setup you're driving, the setup advisor, which setup is fastest, your setup files, a testing log and a side-by-side compare.

**What you need**

- The **Grid Central companion** running (the small window that opens with Grid Central). Without it these pages show **OFFLINE** or "Start the companion…". The status chips then go to **WAITING FOR IRACING** (companion running, no session) and **LIVE** once you're in a session.
- **Pro** for Race strategy, Race setup, lap comparison, race events, telemetry files, shared laps, the lap library and the debrief. During the beta everything is unlocked.
- Everything these pages learn is stored on your PC. **Settings → Appearance & data → Save a backup** keeps it safe or moves it to another PC.

---

## Lap data: picking a car and track

**What it does.** Every lap you complete with the companion running is recorded for its **car and track**, as a trace of 1,000 points around the lap: time, speed, throttle, brake, steering, gear, cornering force and your line.

**Where to find it.** Left menu → **Lap data** → the bar at the top.

**Steps**

1. Drive some laps with the companion running.
2. Open **Lap data** and pick the combination in **CAR AND TRACK** (shown as "Track · Car").
3. The line next to it sums up what's stored, for example "26 laps (3 kept) · best 1:47.312".

| Control (as shown) | What it means | Default |
|---|---|---|
| CAR AND TRACK | Which laps the whole page shows. Your last pick is remembered | Last pick |
| Keep my best lap for every car and track | Saves your fastest clean lap for each car and track for good, as **Personal best**, and replaces it when you beat it | On |

**Tips.** Each track layout is its own entry. Recent laps are limited to the **last 40 per car and track**; keep the ones you want for longer (see "Keeping, exporting and sharing laps").

**If it doesn't work.** An empty picker means nothing has been recorded yet: laps driven with the companion closed are lost. Laps you joined part-way round are marked "Out lap".

---

## Compare laps

**What it does.** Overlays two or three laps: a running time gap, speed, throttle, brake, steering and gear, a track map coloured by where you gain and lose, and a sector table.

**Where to find it.** **Lap data** → **COMPARE LAPS** ("Pick up to three laps").

**Steps**

1. Pick the car and track. Narrow the list with the filter if you like, and leave **Clean laps only** ticked.
2. Tick your **reference** lap first. The first lap you tick is always the reference.
3. Tick one or two more. Charts appear with two laps ticked; a fourth tick drops the oldest.
4. Move your mouse across the charts. A line follows on every chart, a dot follows on the map, and the readout shows the values at that point.

**Worked example.** Yesterday's 1:48.100 against today's 1:47.620: tick 1:48.100 first, then 1:47.620. The title reads "−0.480 s against the reference" and the summary says something like "1:47.620: quickest in sector 4 (turn 7), 0.31 s up". Hover sector 4 on the brake and throttle traces to see whether you braked later or got on the power earlier.

**The lap list**

| Item | What it means |
|---|---|
| Time and **BEST** | Lap time; BEST marks the fastest clean lap |
| Small text | The lap's name ("Lap 12", "Personal best", "Shared by Alex"), date, and why it wasn't clean: "Pit road", "Off track", "Incident", "Out lap" or "Incomplete lap" |
| Tag | **Recent** (driven lately), **Best** (kept personal best), **Saved** (kept with ☆), **File** (telemetry file), **Shared** (teammate or lap library) |
| Coloured dot | The lap's chart colour: lime = reference, cyan = lap 2, pink = lap 3 |
| ☆ / ★ | Keep for good / already kept (press to remove) |
| ⤓ | Export as a .gclap file |
| ◎ | Coach against this lap (clean laps only) |
| Show laps | **All laps** (default), **Recent laps**, or **Saved, files and shared** |
| Clean laps only | Hides laps that weren't clean. Default: ticked |

**Charts and numbers**

| Name (as shown) | What it means |
|---|---|
| Title | Each lap's finishing gap to the reference, "+0.215 s · −0.480 s against the reference" |
| TIME GAP | The gap to the reference around the lap. Above the centre line = slower, below = quicker. The scale is printed underneath |
| SPEED, THROTTLE, BRAKE, STEERING, GEAR | The laps' traces on top of each other |
| Readout | Distance into the lap (metres when the track length is known, otherwise "% of the lap"), then per lap: speed in km/h, throttle %, brake %, gear and, for laps 2 and 3, the gap at that point |
| Map | The reference line, green where lap 2 is quicker, red where slower; brighter = bigger difference. With three laps it compares lap 2 only |
| Sector table | The lap in **10 equal sectors** (not iRacing's official sectors). Reference time, then each lap's difference (green quicker, red slower). Turn numbers like "Sector 3 T5" appear once iRacing's track map is loaded |

**Tips.** Compare like with like: a lap in traffic against a clean qualifying lap mostly shows the traffic. Use a faster driver's lap as the reference to see where they brake and get on the power.

**If it doesn't work**

- "No laps match. Try All laps, or untick Clean laps only.": change the filter.
- "No track line for this lap": that lap has no position data, so there's no map. The charts still work.
- No turn numbers: drive the track once with iRacing running so its map loads.

---

## Keeping, exporting and sharing laps

**Where to find it.** The ☆, ⤓ and ◎ buttons on each lap, and **Import a shared lap** at the top right of Lap data.

**Steps**

1. **Keep a lap:** press **☆**. "Lap kept. It stays in your library for good." It becomes **Saved** (★). Press ★ and confirm to remove it.
2. **Share a lap:** press **⤓**; a .gclap file named after the track and time downloads. Send it to your teammate. They press **Import a shared lap** (several files at once is fine) and see "1 shared lap added. Tick it to compare." It's tagged **Shared**, named "Shared by <you>".
3. **Coach against a lap:** press **◎** on any clean lap. "Coaching against… Your laps are now compared with it on the AI spotter page." The coach now compares every corner with that lap. **Use my own best again** on the AI spotter page switches back.

**If it doesn't work.** "That isn't a Grid Central lap file" means it isn't a .gclap. Telemetry (.ibt) files go through **Import telemetry file**.

---

## Session history

**What it does.** Sums up every session at this car and track and charts your progress.

**Where to find it.** **Lap data** → **SESSION HISTORY · Your progress**.

| Name (as shown) | What it means |
|---|---|
| BEST LAP AND RACE PACE PER SESSION | Chart of each session's best and race pace, oldest on the left, with "first best → latest best". Needs two sessions with clean laps |
| SESSION | When it started |
| LAPS | Clean laps / all laps, "14/18" |
| BEST | Best clean lap; your best ever here is green |
| RACE PACE | Average of clean laps within 3% of your best, so traffic laps don't drag it down |
| CONSISTENCY | How much those laps vary, "± 0.31 s". Smaller is better |
| INCIDENTS | Incident points from race events at around that time (within 12 hours) |

**Tip.** In races, consistency wins. Bring that number down before chasing the best lap.

---

## Race events and Watch in replay

**What it does.** Records incidents, pit road visits, important flags and damage in each session, where they happened, your incident hotspots, and can jump iRacing's replay to an event.

**Where to find it.** **Lap data** → **RACE EVENTS · What happened**. The drop-down picks the session (the last 40 per car and track are kept).

**Steps: review an incident**

1. Stay in the session: iRacing keeps its replay only until you leave.
2. Pick the current session, find the incident and press **▶ Watch in replay**.
3. "Replay is at that moment in iRacing." The replay jumps to 10 seconds before the event and plays. Switch to the iRacing window.

| Item | What it means |
|---|---|
| Incident hotspots | "Incident hotspots, last 30 days: 4x at Turn 1, 2x at Turn 9." or "No incidents in the last 30 days here. Nice and clean." |
| Map | The track with a dot per event; bigger dots for bigger incidents |
| "2x incident" | Incident points, with lap, place ("Turn 5" or "62% round the lap") and time |
| "Pit road" | You entered pit road |
| Flags | Caution, red, black, meatball, debris, chequered. Local yellows aren't logged |
| "Damage, 12 s of repairs" | iRacing's repair time went up |
| "8 times a car came alongside" | Spotter calls that session |

**If it doesn't work.** No ▶ button means you've left that session or iRacing isn't running. "The track appears after your first lap" means no lap has been driven here yet.

---

## iRacing telemetry files (.ibt)

**What it does.** Lists iRacing's telemetry recordings, splits one into laps, and adds the laps you pick to your library to compare like any other lap. Also takes files other people send you.

**Where to find it.** **Lap data** → **IRACING TELEMETRY FILES**, and **Import telemetry file** at the top right.

**Steps**

1. In iRacing, press **Alt+L** in the car to start recording (or switch telemetry recording on). Drive, then stop recording or leave the car.
2. In **Lap data**, press **Refresh**. Your file appears, newest first, with track, car, date and size. Files you import are marked "· imported".
3. Press **Load laps**. After "Reading laps…" you get the track, car, driver and a button per lap, "Lap 4: 1:47.880".
4. Press a lap to add it, or **Add all clean laps**. Added laps get a ✓, are tagged **File** and named like "12 Mar file, lap 4". The page switches to that car and track.

To use a file someone sent you, press **Import telemetry file**, pick it ("Imported… Press Load laps on it below."), then continue from step 3. Their name shows as the driver.

| Control (as shown) | What it does |
|---|---|
| Open telemetry folder | Opens Documents\iRacing\telemetry in Explorer |
| Refresh | Reloads the file list |
| Load laps / Reload | Splits the file into laps (up to 120) |
| Lap buttons | Add that lap. Greyed laps weren't clean; hover to see why |
| Add all clean laps | Adds every clean lap in the file |
| Import telemetry file | Copies an .ibt into the companion's "telemetry imports" folder; a same-named file gets a number added |

**If it doesn't work**

- "No telemetry files yet.": press Alt+L in the car to record one.
- "Couldn't import it… Grid Central needs to be open from the companion (http://127.0.0.1:8765).": use the normal Grid Central window.
- "This file doesn't have… so it can't be split into laps." or "No complete laps in this file.": that file can't be used.
- "That's part of Grid Central Pro.": loading files needs Pro.

---

## Lap library

**What it does.** Fast reference laps shared online through a GitHub repository. Download one to compare with, or coach against it.

**Where to find it.** **Lap data** → **ONLINE · REFERENCE LAPS · Lap library**.

**Steps**

1. Pick your car and track. The library shows laps for it, fastest first (**Every car and track** shows them all).
2. Press **Download** to add the lap (tagged **Shared**, named "Library · <driver>"), or **◎ Coach against it** to download it and make it the coach's reference.

Columns: TIME, DRIVER, CAR, TRACK, ADDED. **Refresh** reloads from GitHub.

**Run your own lap library** (expand it at the bottom of the panel): create a public GitHub repository with a folder called **lap-library**; put its name, like *your-name/grid-central*, as **"lapLibrary"** in **release.json** next to GridCentral.exe and restart the companion; then to add a lap, tick it in the lap list, press **Prepare for the library**, and upload the two files it saves (the lap and the new **index.json**) to the lap-library folder, replacing the old index.json.

**If it doesn't work.** "No lap library is set up yet." means none is named in release.json. "…the library has no index.json yet" means you need to upload one. "Tick a lap in the lap list first." applies to **Prepare for the library**, which uses the first lap you ticked.

---

## Session debrief

**What it does.** When you leave a session, your engineer writes a plain-English report and reads out a short version.

**Where to find it.** **Overview** → **YOUR RACE ENGINEER · SESSION DEBRIEF** card (appears after your first debrief). The drop-down holds the last 20.

**What it covers**

- Headline: "Race at Okayama Full Course: 22 laps, best 1:27.410."
- Against your last session here: best lap quicker or slower, race pace, consistency, "More consistent than last time."
- With 8+ clean laps: "You got quicker as it went on", "Your pace dropped off… towards the end" or "Your pace held steady all session."
- Races: "Finished P6 from P9 (+3). 1 stop, 38.2 L of fuel used, 4x incidents."
- From the coach: where you lose most time, corners you fixed, and the lap your best corners add up to.
- **Next time:** one thing to work on.

The spoken version is **Settings → Voice & radio → Engineer → Session debrief** (on). Sessions with fewer than three timed laps get no debrief.

---

## Race strategy: the race planner

**What it does.** Plans your stops before the race: how many, which lap to box, the window for each stop, fuel to add, tyres, and stop time. When realistic, it adds a fuel-saving plan with one stop fewer and says how much lifting is worth it.

**Where to find it.** Left menu → **Race strategy** → **RACE PLANNER · Your race** (left) and **PLANS · Compare strategies** (right).

**Steps**

1. In practice, drive at least **two green-flag laps** (no pit road, no caution, not the session's first lap). Fuel use and lap time are measured and remembered for that car and track.
2. Open **Race strategy**. Empty boxes fill themselves as numbers come in: length, lap time, fuel per lap and tank first, then pit lane loss, refuel rate, tyre time and tyre sets after a stop.
3. Press **Fill from iRacing** to fill everything now. This also resets **START FUEL (L)** to a full tank.
4. Check **START FUEL (L)**, **SAFETY MARGIN**, **TYRES PER STOP (S)** and **TYRE SETS FOR STOPS**, then read the plans.

**Worked example: a 1-hour race**

Practice laps of about 1:45.0, 2.9 L a lap, 90 L tank.

1. **RACE LENGTH** → **Minutes**, then **60**.
2. **LAP TIME** 1:45.0, **FUEL PER LAP (L)** 2.9, **TANK (L)** 90.
3. Leave **START FUEL (L)** empty, **SAFETY MARGIN** ½ lap, **PIT LANE LOSS (S)** 25, **REFUEL RATE (L/S)** 2.5, **TYRES PER STOP (S)** empty.
4. The title reads **"1:00:00 race · about 35 laps"**.
5. **1-stop** (FLAT OUT): "2.90 L/lap · 30 s in the pits"; stints 1–18, 19–35; 103.0 L in all. The table: **Stop 1 · Lap 18 · Laps 5–30 · +12.9 L · 30.2 s**. Box on lap 18 for even stints, but anywhere from lap 5 to 30 works. Add 12.9 L, just enough to finish with half a lap spare. The stop costs 25 s of pit lane plus about 5 s of fuelling.
6. **No stop, saving fuel**: "Use 2.54 L a lap (13% less). Worth it if lifting costs you less than 0.86 s a lap." If you can save that much while losing less than 0.86 s a lap, skip the stop.
7. Type **20** in **TYRES PER STOP (S)**. The stop now takes about 49 s with new tyres, a **TYRES** column shows "New", and the fuel-saving break-even rises to about 1.40 s a lap, because the stop you'd skip costs more.

**Planner inputs**

| Input (as shown) | What it means | Default / filled from |
|---|---|---|
| RACE LENGTH | **Laps** or **Minutes** | From iRacing |
| LAPS / MINUTES | Race length. For timed races, laps are worked out allowing for time in the pits; the race ends on the first lap after the clock runs out | From iRacing |
| LAP TIME | Typical race lap: 2:08.4, 128.4 or 2:08 | Your green-flag laps (laps over 4% off your usual pace left out) |
| FUEL PER LAP (L) | Litres per lap | Average of your last 5 green-flag laps, or remembered from here |
| TANK (L) | Usable tank, allowing for any series fuel limit | From iRacing |
| START FUEL (L) | Fuel at the start | Empty = **Full** |
| SAFETY MARGIN | Fuel in hand at the finish: None, ¼ lap, ½ lap, 1 lap, 2 laps | **½ lap** |
| PIT LANE LOSS (S) | Time lost through pit lane versus staying on track, not counting time stationary | **25 s** if empty; measured from your stops |
| REFUEL RATE (L/S) | How fast fuel goes in | **2.5 L/s** if empty; measured from fuel-only stops |
| TYRES PER STOP (S) | Extra seconds a tyre change adds | Empty or 0 = **no tyres**; measured from a tyre stop |
| TYRE SETS FOR STOPS | Sets available for stops. With fewer sets than stops, changes are spread so each set does a similar distance | Empty = **Unlimited**; sets left in iRacing |

The fuel boxes stay in litres even with US units, because iRacing's pit menu takes litres.

**The plans**

| Item (as shown) | What it means |
|---|---|
| Plan name | "No stop", "1-stop", "2-stop"…, or "…, saving fuel" |
| FLAT OUT | The fewest-stops plan at normal fuel use |
| L/lap · time | Fuel use assumed and total time in the pits (plus total race time for lap races). The saving plan shows "… s less in the pits" |
| Stint bar / Stints | Each stint's laps (hover for driver), total fuel, and how many stops get new tyres |
| BOX ON | Suggested lap, for even stints |
| WINDOW | Earliest to latest lap for this stop on this number of stops |
| ADD | Fuel to add |
| TYRES | "New" or "Keep" (when TYRES PER STOP is set) |
| NEXT DRIVER | Who takes over (when drivers are entered under Team race) |
| STOP TIME | Pit lane loss + fuelling + tyres |

A fuel-saving plan only appears when the saving is 15% a lap or less.

**Tips.** Anything you type is kept; boxes filled from iRacing keep updating. Make one practice stop with race-like fuel to measure the real pit lane loss and refuel rate.

**If it doesn't work**

- "Enter a lap time, fuel per lap and tank size to see your plans." or "Enter how long the race is.": a box is empty.
- "The tank is too small for this race at that fuel use.": check fuel per lap and tank.
- The source line says "Drive two green-flag laps to measure fuel use.": pit, caution, first, refuelled or reset laps don't count.

---

## Race strategy: live strategy

**What it does.** Lap by lap: fuel to the finish, stops left, the pit window, what to add, possible fuel saving, where you'd rejoin, plus checks of iRacing's pit menu, tyres and weather. Your engineer reads out the key calls.

**Where to find it.** **Race strategy** → **LIVE STRATEGY** at the top. The heading gives the advice; the chip shows **OFFLINE**, **WAITING**, **LIVE · RACE** or the session type ("LIVE · PRACTICE").

**The heading:** "Get in the car to start measuring", "Drive two green-flag laps to measure fuel use", "Fuel to the finish appears in races", "Fuel to the finish" (or ", just" when it's using the margin), "Pit window opens in 3 laps", "Pit window open", "Box next lap", "Box this lap" (red), "Race finished".

| Name (as shown) | What it means |
|---|---|
| FUEL TO FINISH | **Covered** (litres spare), **Just** (into the safety margin by less than half of it, so still OK), or "12.4 L short"; with laps to go |
| STOPS NEEDED | "Fuel to the finish", "One more stop", "2 more stops" |
| ADD AT NEXT STOP | Litres for your last stop, or **Fill up** when more follow; "About 31 s in the pits" |
| PIT WINDOW | **Open now** or "In 3 laps"; "Fuel runs out in 9 laps" or "Box this lap" |
| FUEL SAVE | Litres a lap to save for one stop fewer, as %, and "Worth it under 0.80 s a lap". Up to 15% with more than two laps left; else "Too much to save, take the stop" or "Not needed" |
| IF YOU PIT NOW | Time lost, the position you'd rejoin in, and the cars just ahead and behind after the stop (an estimate) |
| PIT MENU | What the pit menu (F4) is set to, with warnings: "Fuel is unticked in the pit menu", "Set to 20.0 L, but you need 32.0 L" |
| TYRES | Compound and age, last measured wear per corner (LF, RF, LR, RR), wear per lap, estimated wear now, sets left |
| WEATHER | Track wetness, rain, declared wet, and a suggestion |
| MEASURED | Fuel per lap and where it's from (green laps, "earlier laps here", "estimate"), lap time, pit lane loss (measured or estimate), tank |

**Engineer calls** (races, once per stint, at the line): "Pit window is open. 42 litres gets you to the finish.", "Box next lap. Add 42 litres.", "Box this lap. Add 42 litres." (with "Check the pit menu fuel." if the menu is short), "Save 0.25 litres a lap and you can skip a stop." (at most every 5 laps), "Fuel is good to the finish." Switch them with **Settings → Voice & radio → Engineer → Strategy callouts**; the **Callout settings** button at the top of the page goes to the call settings.

**If it doesn't work.** "Companion not running" / "Waiting for iRacing": start the companion or join a session. Numbers at "—": complete two green-flag laps first.

---

## Automatic pit fuel

**What it does.** Sets the fuel in iRacing's pit menu for you every lap until you enter pit road: a full tank before your last stop, then exactly what you need plus about a third of a lap. Once you can finish with the full margin, it unticks fuel. Races only, with you driving.

**Where to find it.** **Race strategy** → **LIVE STRATEGY** → **Set pit fuel automatically** (off by default).

**Steps**

1. Switch it on ("Automatic pit fuel is on…").
2. Try it in a practice race first, watching the state label and the pit menu (F4).

**State label:** OFF; OFF · PRO; ON · WAITING FOR IRACING; ON · RACES ONLY; ON · WAITING FOR YOU IN THE CAR; ON · MEASURING FUEL USE; ON · PAUSED ON PIT ROAD; ON · SETTING 34 L or ON · 34 L SET (working); ON · NO FUEL NEEDED; ON · YOUR SETTING UNTIL THE STOP (you set fuel by voice); ON · RACE FINISHED; or ON · plus an error (it retries after 15 seconds).

**Tips.** It only re-sends when it needs more fuel, or about one and a half laps' worth less, so your own F4 change usually sticks. The engineer says "Pit fuel set to 34 litres." or "You've got the fuel to finish. Pit fuel unticked."

---

## Tyres and weather

**What it does.** iRacing only measures tyre wear in the pits, so Grid Central keeps the last reading, works out wear per lap from the tyres' distance, and estimates what's left now. It reads track wetness and rain and suggests tyres.

**Where to find it.** **LIVE STRATEGY** → **TYRES** and **WEATHER**.

- **Lightly wet** or wetter: "Wets suggested at your next stop" (if your car has wets and you're on slicks).
- **Very lightly wet**: "slicks are usually still quicker."
- **Mostly dry** or drier on wets: "Slicks suggested at your next stop".
- A warning if the pit menu has the wrong tyre type for the track.

Calls: "Rain is starting.", "The race has been declared wet. Wet tyres are allowed.", "Track is getting wetter…", "Track is drying…" (**Engineer → Weather callouts**). These are suggestions; it's your call.

**If it doesn't work.** "Wear is measured each time you're in the pits.": make a stop. Wear per lap needs tyres that have done more than two laps.

---

## Team race

**What it does.** Shares out planned stints between drivers, checks the stint limit and minimum drive time, and in team races records each driver change live.

**Where to find it.** **Race strategy** → **TEAM RACE · Driver stints**. Chip: **NOT A TEAM RACE**, **TEAM · WAITING FOR THE RACE** or **LIVE · TEAM RACE**.

| Input (as shown) | What it means | Default |
|---|---|---|
| DRIVERS, IN STINT ORDER | Names with commas, "You, Alex". Drivers seen in the race are added | Empty |
| MAX STINT (MIN) | Longest stint allowed | No limit |
| MIN DRIVE TIME EACH (MIN) | Minimum each driver must drive | None |

**Worked example.** The 1-hour race above with "You, Alex", a 40-minute stint limit and 20-minute minimum: the 1-stop window narrows to laps 13–22 (22 laps of 1:45 fit in 40 minutes), with "Driving: You 31:30, Alex 29:45". The fuel-saving no-stop plan warns "Alex is under the minimum drive time. Change the driver order or add a stint."

**During the race** it shows who's driving, for how long, time left in the stint (or "Over the stint limit by…"), the next driver ("Swap at the next stop" when they can't fit another full tank), and a table of DRIVER, STINTS, LAPS, DRIVEN and MINIMUM. The next driver is whoever is furthest short of the minimum, then the next in your order. Calls: "Five minutes left in this stint…", "Stint time is up. Box for a driver change." (**Engineer → Team stint callouts**).

**If it doesn't work.** Whoever spectates during a teammate's stint needs Grid Central running, or that time isn't recorded.

---

## Rivals' strategy

**What it does.** In races, records the pit stops of the four cars ahead and four behind you in your class, and predicts their next stop.

**Where to find it.** **Race strategy** → **THE CARS AROUND YOU · Rivals' strategy** (chip **RACES ONLY** or **LIVE · RACE**).

| Column | What it means |
|---|---|
| POS / CAR | Class position, number and driver; **IN PITS** on pit road |
| GAP TO YOU | + ahead, − behind |
| STOPS / LAPS SINCE STOP | Stops so far, laps since the last |
| USUAL STINT | Average stint; * = guessed from your own fuel range before their first stop |
| NEXT STOP (ABOUT) | Predicted lap; "· soon" within two laps |

Calls for cars within 6 seconds: "Car 25 ahead has pitted. Push, you can jump them while they're in the pits." (or overcut advice when your window is open), and for a car behind, "Push now: fresh tyres will make them quicker." or "Box this lap to cover the undercut…" (**Engineer → Rivals' pit stops**).

---

## Race setup: Loaded now and notes

**What it does.** Shows the car setup you're driving, read from iRacing, and keeps your notes on it. (This page is about car setups. The first-run setup wizard is **Run setup again** in Settings.)

**Where to find it.** Left menu → **Race setup** → **LOADED NOW**.

**Steps**

1. With the companion running, load a setup in iRacing's garage. The name appears and the chip shows **LIVE**.
2. Type in **YOUR NOTES ON <SETUP NAME>** and press tags. They save by themselves ("Saved").

| Item (as shown) | What it means |
|---|---|
| Car | The car's name |
| Loaded from | Your setups, iRacing's setups, Shared with you, or Baseline |
| Changed since loading | "Yes: save it in the garage to keep the changes" or "No" |
| Passed tech | "Yes" or "No: iRacing won't let you race it" |
| Here (track) | Best lap and clean laps on this setup here |
| Key values | Up to 12: pressures, wing, brake bias, anti-roll bars, camber, ride height, TC, ABS, fuel |
| Tags | Race, Qualifying, Wet, Dry, Hot track, Cold track, Low fuel, Kerbs, Work in progress |

**Tips.** Notes are saved by setup name for that car. They pop up when you load it and show in the setup manager and compare. If a race starts on a setup named like a qualifying setup, the engineer says "Heads up, you're on a qualifying setup… Check the fuel and the tyre pressures."

---

## Setup advisor

**What it does.** Pick what the car is doing and get the garage changes to try, in order, with each one's current value on your car, plus a check of your last laps.

**Where to find it.** **Race setup** → **WHAT'S THE CAR DOING? · Setup advisor**.

**Steps**

1. Press your problem (press again to clear). Or tell your engineer, "it's understeering on entry".
2. Read what your last laps show (needs two clean laps here with Grid Central open).
3. Make **one** change, a click or two, in the garage, **Save As** with a new name, and load it.
4. Drive 3 clean laps; the testing log shows the result.

**Problems:** Understeer (On entry, Mid-corner, On exit); Oversteer (loose) (On entry or braking, Mid-corner, On exit or wheelspin); Other problems (No grip in fast corners, Slow on the straights, Unsettled over bumps and kerbs, Bottoming out, Front brakes locking, Rear brakes locking, Tyre pressures too high when hot).

| Item | What it means |
|---|---|
| WHAT YOUR LAST 2 LAPS SHOW (AN ESTIMATE) | Where you need the most steering for the grip ("18% more steering… on entry" = understeer) and how often you catch the car with opposite lock ("1.5 times a lap on exit, mostly at Turn 3" = oversteer), and whether it matches what you picked |
| Numbered changes | "Lower front anti-roll bar" with why; **Now:** the current value |
| IN THE CAR | Adjustable from the cockpit (brake bias, bars, TC, ABS and similar) |
| "Not in this car's setup" | Greyed, listed last |

On most cars a higher number is stiffer or more, but check your car's garage. "Other problems" have no lap check.

---

## Setup performance

**What it does.** Records clean laps against the setup you're on, per car and track. Pit, caution and incident laps are left out.

**Where to find it.** **Race setup** → **SETUP PERFORMANCE**; the drop-down picks the track, the Setup manager picks the car.

| Column | What it means |
|---|---|
| SETUP | Name, "(modified)" if unsaved changes. Tags **FASTEST**, **BEST RACE PACE** (3+ laps), **MOST CONSISTENT** (5+ laps), **LOADED** |
| LAPS | Clean laps (last 80 per setup) |
| BEST | Best lap, with the gap to the fastest |
| RACE PACE / CONSISTENCY | Average of laps within 3% of the best, and how much they vary |
| FUEL/LAP / LAST DRIVEN | Average fuel per lap; date |

---

## Setup manager

**What it does.** Lists each car's setup files by folder and installs .sto files you've bought or been sent. Nothing is overwritten: a same-named file becomes "Race (2)".

**Where to find it.** **Race setup** → **YOUR SETUPS · Setup manager**, plus **Open setups folder** and **Install setup files** at the top right.

**Steps**

1. Start the companion and pick the car (it follows the car you're driving).
2. Optionally type a subfolder in **INSTALL INTO** (up to three levels).
3. Press **Install setup files**, or drag .sto files onto the page.
4. "Installed… In iRacing, open the garage and load it."

| Control (as shown) | What it does | Default |
|---|---|---|
| Car drop-down | The car for setups, performance, compare and testing log | Your car |
| INSTALL INTO | Subfolder of Documents\iRacing\setups\<car> | The car's folder |
| Refresh | Reloads the list | |
| Open setups folder | Opens that folder in Explorer, creating it if needed | |

Grid Central can't write setup files (iRacing's format isn't published): make changes in the garage.

**If it doesn't work.** "Start the companion first.", "Pick a car first.", "Those aren't iRacing setup files (.sto).", or "…is empty or too big to be a setup." (over 2 MB).

---

## Setup testing log

**What it does.** Logs each garage change or newly loaded setup, with which values changed, and compares your laps before and after.

**Where to find it.** **Race setup** → **DID IT HELP? · Setup testing log**.

**Steps.** With Grid Central open, drive 3 clean laps, change one thing, drive 3 more.

Each entry: "Race v1 → Race v2", date and track, the changes ("Front anti-roll bar 3 → **2**"), and the verdict: "Drive 3 clean laps on each to see the result (before: 1, after: 0)", "**Faster by 0.18 s a lap**" (with race pace and best), "Slower by…" or "About the same pace". It can add "Quicker: Turn 3 −0.08 s" and warns when more than three things changed at once.

**Tips.** Several clicks before a lap count as one change. Fuel level and values iRacing calculates aren't changes. Only laps driven with Grid Central open count.

---

## Setup compare

**What it does.** Every setup you load is remembered with all its values (40 per car). Pick two to see what differs.

**Where to find it.** **Race setup** → **SETUP COMPARE · Side by side**.

| Control (as shown) | What it means | Default |
|---|---|---|
| Differences only | Only settings that differ | On |
| SETUP A / SETUP B | The two setups; "(loaded now)" marks yours | A = loaded |
| Summary | "7 settings differ", when and where each was seen, and their notes | |
| Table | SETTING, A, B and **B − A**, grouped by section | |

**If it doesn't work.** "Grid Central has seen one setup for this car…": load another setup in the garage with the companion running. Values that change while driving (hot pressures, temperatures, tread) are left out.
