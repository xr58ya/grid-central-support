# Getting started: installing, accounts, settings and troubleshooting

This chapter takes you from download to your first live session, then explains every setting and what to do when something goes wrong. New to Grid Central? Read the first five sections in order and use the rest as a reference.

## How Grid Central works

**What it does.** Grid Central is your race team for iRacing: spotter, engineer, coach, strategy, setups, overlays, paint shop and more. It has two parts:

- **Grid Central**, the app itself. It opens in its own window (Microsoft Edge's app mode, which has no tabs or address bar) at `http://127.0.0.1:8765`. If Edge isn't installed, it opens in your normal browser instead.
- **The companion**, a small black window titled GridCentral. iRacing only shares live data with programs on the same PC, so the companion reads it and passes it to Grid Central about 10 times a second. It also does what a web page can't: installing paints and setups, talkback, the phone pit wall, the in-game overlay, Discord and updates.

Nothing about your driving leaves your PC unless you share it (Discord, a phone or the team hub).

**Where to see it.** The status at the top right of every page tells you how things are connected:

| Top-bar status | What it means |
|---|---|
| **IRACING NOT CONNECTED** | The companion isn't running, or Grid Central can't reach it. The button next to it reads **Connect iRacing ↗** and takes you to Settings. |
| **WAITING FOR IRACING** | The companion is running, but you aren't in a session yet (or you are still in iRacing's menus). |
| **IRACING LIVE** | Live data is flowing. The button changes to **Live session ✓**. |

Grid Central keeps looking for the companion every few seconds, so there's no need to reload after starting it.

**What you need**

- Windows 10 or 11
- iRacing
- Microsoft Edge or Google Chrome
- An internet connection the first time you drive each track (for iRacing's track map), the first time you turn on talkback (about 40 MB), and the first time you use the natural commentary voices (about 340 MB)
- For the phone pit wall: a phone on the same Wi-Fi as your PC

You don't need to install anything else.

## Installing Grid Central

**What it does.** The Setup program (`GridCentral-Setup-<version>.exe`, recommended) installs Grid Central for your Windows user only, with no admin rights needed. It adds Start menu and desktop shortcuts and an entry with an uninstaller in Windows' installed apps. There is also a **zip version**.

### Installing with the Setup program

1. Download `GridCentral-Setup-<version>.exe` and double-click it.
2. If Windows shows **"Windows protected your PC"**, click **More info**, then **Run anyway**. The beta isn't digitally signed yet, so Windows doesn't recognise it.
3. The window **Install Grid Central &lt;version&gt;** opens. Check the options (see the table below) and press **Install**.
4. When it says **Grid Central is installed.**, press **Finish**. Grid Central starts if **Start Grid Central when Setup finishes** is ticked.

| Setup option | What it does | Default |
|---|---|---|
| Folder box and **Change…** | Where Grid Central goes. When updating, Setup suggests its current folder. | `AppData\Local\Programs\Grid Central` in your user folder |
| **Add a desktop shortcut** | A desktop shortcut as well as the Start menu one. | On |
| **Start Grid Central when Setup finishes** | Opens Grid Central when done. | On |

Setup closes a running Grid Central first, and keeps your settings files (overlay designs, phone pairing, Discord, imported telemetry) when you install over an older version.

### Using the zip version

1. Unzip the zip file somewhere permanent, for example `Documents\Grid Central`. Don't run Grid Central from inside the zip.
2. Open the folder and double-click **GridCentral.exe**.
3. If Windows warns you, choose **More info** and then **Run anyway**.

It works the same, except that updates aren't installed for you: the banner offers **Download** instead of **Update now**.

### Upgrading from an older beta

Run the new Setup. Your laps, settings, paints and strategy data are kept (they're in your browser). Coming from a zip version? Copy `overlays.json`, `phone.json`, `discord.json` and `teamhub.json` from the old folder into the installed one (Start menu → right-click Grid Central → **Open file location**) before starting it, then delete the old folder.

### If it doesn't work

| Problem | Fix |
|---|---|
| "Windows protected your PC" | Click **More info**, then **Run anyway**. The beta isn't signed yet. |
| Antivirus blocks GridCentral.exe or Setup | Allow it, and tell support which antivirus it was. |
| "Setup failed: …" in red | A file was locked (antivirus scan, or Grid Central still running). Close Grid Central and its small window, wait, and run Setup again. |

## Your beta code

**What it does.** During the closed beta, the installed Grid Central asks for your personal beta code the first time it opens. Codes look like `GC-XXXX-XXXX-XXXX`.

**Where to find it.** The **Enter your beta code** window appears by itself over Grid Central before anything else. You can't close it with Esc.

1. Type or paste your code into the box. You don't have to get the dashes or capital letters right.
2. Press **Unlock**. It shows "Checking…" while it checks the code online.
3. When the code is accepted, the window closes and the setup wizard starts.

After that you go straight in, and the code is re-checked in the background at each start. Offline, it keeps working for up to **30 days**. The code also gives your Grid Central account 6 months of Driver free from release day (see "Your account and plans").

**Tip.** If you don't have a code, ask whoever invited you to the beta, or email support.gridcentral@gmail.com.

### If it doesn't work

| Message | What to do |
|---|---|
| "Beta codes look like GC-XXXX-XXXX-XXXX." | The code is too short. Check you copied all of it. |
| "That code isn't valid. Check it and try again." | Check for typos. Letters like O and 0 are easy to mix up. |
| "Couldn't check the code. Check your internet connection and try again." | You have to be online the first time you enter a code. |
| "This beta code is no longer active. Enter a new one to carry on." | Your code has been withdrawn. Contact support for a new one. |
| "…hasn't been able to check your beta code for 30 days…" | Go online and enter your code again. |

## Starting Grid Central and the companion

**What it does.** Starting Grid Central from the Start menu or desktop shortcut opens the companion window, then Grid Central in its own window. **Leave the small window open**: closing it stops live data, overlays, talkback and the phone pit wall.

If you open Grid Central another way (a bookmark, say) and the companion isn't running, Grid Central starts it (**Start with Grid Central** in **Settings → Connections**). Your browser may ask **"Open apex-companion?"**: tick **Always allow** and click **Open**. You can also press **▶ Start companion** on the Overview, in **Settings → Connections** or in the setup wizard. It reads **Starting…**, then **✓ Companion running** (on the Overview, **◉ Open live spotter**). If nothing happens within about 12 seconds, a message says what to do.

**Closing.** With **Close with Grid Central** on (default), the companion stops about 10 seconds after the last Grid Central window closes (a reload doesn't count). If an OBS overlay is still connected, it keeps running until that's gone too.

**The companion window** shows what's happening ("Waiting for iRacing...", "Connected to iRacing.", "Recorded lap 3: 92.418s"). Clicking in it doesn't pause it. Close it or press Ctrl+C to stop it. Everything it shows is saved in `companion.log` in the Grid Central folder; the run before is `companion-previous.log`.

**If Grid Central's window closes by itself** (Discord's Go Live can do this), the companion reopens it after about 10 seconds, at most once a minute.

### If it doesn't work

| Problem | Fix |
|---|---|
| "The companion didn't start automatically. Press Start companion in Settings, or open Grid Central from the Start menu." | Your browser may have blocked the link. Press **▶ Start companion** and allow "Open apex-companion?". |
| "The companion didn't start. Close Grid Central and open it again from the Start menu…" | The start link is set up when GridCentral.exe first runs. Open Grid Central from the Start menu once. |
| "The Grid Central companion is already running (port 8766 is in use). This window will close." | Nothing's wrong: the copy already running carries on. |
| "Port 8765 is already in use, so the app isn't served from here." | Another program uses port 8765. Close it or other copies, and restart. |

## The setup wizard

**What it does.** A two-minute guided setup. Each choice changes the real setting, so you can change it later in Settings.

**Where to find it.** It opens by itself the first time Grid Central starts, just after the beta code window. To run it again, go to **Settings → Appearance & data → Your data → Setup wizard** and press **Run setup again**.

Move with **Next** and **Back**. **Skip setup** closes it; skipping, Esc or finishing all stop it opening by itself again.

1. **Welcome.** "Your race engineer, ready in two minutes." Press **Let's go**.
2. **Step 1 · iRacing.** Press **▶ Start companion** if it shows "The companion isn't running yet." You can carry on while it connects ("✓ Companion running", then "✓ Connected to iRacing.").
3. **Step 2 · Your engineer's voice: How should your engineer sound?**
   - **VOICE**: the main voice. **★ natural** voices sound most like a real engineer.
   - **◖ Test the voice**: plays "Radio check. Car left. Still there. Clear. Box this lap."
   - **Read calls aloud**: the main switch for spoken calls.
   - **HOW MUCH SHOULD IT TALK?**: pick one of three presets (below).
4. **Step 3 · Talkback (optional).** Tick **Turn on talkback**, press **Set push-to-talk button**, then press your wheel button or key. Needs the companion running. Talkback is part of Driver.
5. **Step 4 · Units and look.** Choose **UNITS** (Metric or Imperial) and **COLOUR SCHEME** (Match Windows, Dark or Light).
6. **All set.** Links lead to **Phone pit wall**, **Discord**, **Race overlay** and the **User guide**. Press **Finish**.

| "How much should it talk?" choice | What it turns on |
|---|---|
| **Full race engineer** (default) | Spotter, flags, hazards, damage, strategy, weather, team stints, gaps, battles, rivals' stops, positions, laps to go, best laps, incidents, coaching and the debrief. |
| **Spotter and flags** | Cars alongside, flags, hazards and damage. No coaching or gap reports. |
| **Quiet** | Only cars alongside. |

Whichever you choose, **All voice calls** (the switch at the top of **Settings → Voice & radio**) is switched on.

## The Overview page

**What it does.** Your session at a glance: live while you drive, and from your saved laps otherwise.

**Where to find it.** **Overview**, top of the sidebar (or click the GC logo).

| Part | What it shows |
|---|---|
| **▶ Start companion** / **◉ Open live spotter** | Starts the companion, or once it's running, opens the AI spotter page. |
| Notice bar | When not live, says why ("iRacing isn't connected…") and which past session is shown. **Set up iRacing →** opens Settings. |
| **SAFETY RATING**, **iRATING** | From your iRacing profile; when not live, the last values seen. |
| **BEST LAP** | Your best at your last track, the car, and sessions there. |
| **THIS WEEK** | How many sessions and laps you've done this week. |
| **SESSION DEBRIEF** | After a session, your engineer's report: pace and consistency against last time, the race, where you lose time, corners fixed and what to work on. The menu picks one of your last 20. Part of Driver. |
| **Race control** | Track map with your car on it; car, track and air temp, conditions, position. |
| **Lap analysis** | A chart of your lap times (from two laps on), with **BEST LAP**, **LAST LAP** and **OPTIMAL LAP**. |
| **Your ratings and races** | Charts of your iRating and safety rating over time, and your **RECENT RACES**. |
| **One thing to work on** | The coach's top tip. **Open driver coach →** Part of Driver. |
| **ON-TRACK SPOTTER** | "Spotter ready" or "Spotter muted". Its switch is **All voice calls**, the same one as in **Settings → Voice & radio**: it mutes the spotter, engineer and coach. |

**Your iRacing profile.** After your first session, the sidebar shows your name, licence and iRating. **···** opens your profile card (licence, iRating, club, division, team, car, session) with **View on iRacing ↗** and **Copy customer ID**.

The footer shows your version (for example **V 0.5.9.1 · BETA**).

**Tips**

- The track map comes from iRacing's own map, downloaded the first time you drive a track (be online). Otherwise it's traced from your first full lap.
- In offline sessions (testing, AI races), the ratings shown are from your last online session.
- Ratings history comes from your sessions with Grid Central until iRacing reopens access for apps; then a **Sign in with iRacing** button appears.
- A short spoken version of the debrief is read out when you leave a session. Turn it off in **Settings → Voice & radio → Engineer → Session debrief**.

### If it doesn't work

| Problem | Fix |
|---|---|
| Everything shows "—" | No session has been recorded yet. Start the companion and drive a few laps. |
| "The track map appears after your first full lap at a track." | Complete a full lap, or go online so the map can download. |
| "Your lap times appear here once you've completed two laps." | Drive two complete laps. |

## Your account and plans

**What it does.** An account (email and password) gives a **7-day free trial** of Driver, no card needed, and carries your beta code's free months and later your subscription. One PC per subscription. Your laps, settings and paints stay on your PC.

**Where to find it.** **Settings → Account**, in the **Account** panel. The chip at the top right of the panel shows your status.

**During the beta, everything stays unlocked**, with or without an account. The one exception is the hosted team hub, which needs a seat in a team on Race Team. Running the team hub on your own free hosting works for everyone (see "Team hub" in chapter 5). The plans and their labels start when Grid Central goes on sale. Until then the Account panel already shows your plan, followed by "During the beta, everything stays unlocked.", so it can say **ROOKIE** while nothing is locked.

### Creating an account or signing in

1. Start the companion (it tells Grid Central which PC this is).
2. In **Settings → Account**, enter **EMAIL** and **PASSWORD** (at least 8 characters for a new account).
3. Press **Create account**, or **Sign in** if you have one. The panel shows "Signed in as …".
4. Beta tester? If **BETA TESTER? ENTER YOUR BETA CODE FOR 6 MONTHS OF DRIVER FREE** shows, enter your code and press **Use code**. A new account made on the PC where you unlocked the beta gets the code automatically.

| Control | What it does |
|---|---|
| **Create account** | New account; starts the trial if this PC hasn't had one. |
| **Forgot password?** | Type your email first; a reset link is emailed. |
| **Move my subscription here** | Shown when it's on another PC; moves it here (that PC goes to Rookie). |
| **Subscribe** | Greyed out ("Coming soon"). |
| **Sign out** | Signs you out on this PC. |
| **Use code** | Adds a beta code (6 months of Driver free from release day; one account per code). |

| Status chip | What it means |
|---|---|
| **NOT SIGNED IN**, **ROOKIE** | No account, or no plan: you're on Rookie, the free plan. |
| **TRIAL · N DAYS LEFT**, **BETA TESTER**, **DRIVER**, **RACE TEAM** | Your plan; the line below says when it ends. The trial and a beta code give Driver. |
| **+ BROADCAST** after the plan, for example **DRIVER + BROADCAST** | You have the Broadcast add-on too. |
| **IN USE ON ANOTHER PC** | Your subscription is on another PC. Press **Move my subscription here**. |
| **NEEDS A CHECK** | Not checked online for 30 days. Connect to the internet. |

The account is checked at start and every 6 hours, and works offline for up to 30 days.

### Beta testers' free months

A beta code gives **Driver** free for **6 months from release day** (the day Grid Central goes on sale), whenever you entered your code. It doesn't include Race Team or the Broadcast add-on.

- Until Grid Central goes on sale, the line under the chip reads "Thanks for testing! Driver is free for 6 months from release day."
- Once it goes on sale, the line shows the end date: "Thanks for testing! Driver is free until …".
- From 30 days before the end, it reads "Your free months as a beta tester end on …" with the date, then "Subscribe before then to keep Driver at your beta tester price." The same message pops up once 30 days before the end and once 7 days before.
- The beta tester price is for testers who entered their code by 30 days after release day. Codes entered later get the same message without "at your beta tester price".
- When the free months end, you're on Rookie unless you subscribe or drive for a team on Race Team.

### The plans

Once Grid Central goes on sale, it has three plans and an add-on:

| Plan | What you get |
|---|---|
| **Rookie** (free) | Your spotter with a simple radar, the dashboard, your lap times, the in-game overlay with the core widgets (**Relative**, **Standings** and **Flags**), car painting and your Discord status. |
| **Driver** | Everything in Rookie, plus the engineer and coach on the radio, talkback, race strategy, race setups, lap comparison and telemetry, the full radar, every overlay widget and OBS overlays, the whole paint shop (helmet and suit, finishes, Spray Booth, Live in iRacing, car numbers), the phone pit wall and Discord posts. The 7-day free trial and a beta code give Driver. |
| **Race Team** | For teams and leagues: every driver in the team gets Driver on their own PC, plus team races, shared laps, view-only phone links for teammates, talking to your crew by voice, the team hub (hosted with no setup, or on your own free hosting) and the League room with its bot. It's for 3 drivers, and you can add 5 more at a time. |
| **Broadcast add-on** | For streaming, on top of Driver or Race Team: AI race commentary with natural voices (the **Broadcast** page), OBS control from Grid Central and your phone (the **OBS Studio** panel and **Add to OBS**), and going-live posts on Discord. If a team has it, every driver in the team gets it. It isn't part of the trial or the beta code. |

Once plans are on sale, areas your plan doesn't include are dimmed, with a label naming the plan they need, for example **DRIVER · Race strategy**, **RACE TEAM · The team hub** or **BROADCAST · OBS control**. Single buttons, switches and menu items get a small tag instead (**DRIVER**, **RACE TEAM** or **BROADCAST**); a menu item with a tag still opens its page. A few small buttons, such as the ones on each lap in **Lap data**, show no tag. Clicking anything locked opens a window that says which plan it's part of, for example "PART OF GRID CENTRAL DRIVER". Its first button is **Start your 7-day free trial** (for Driver) or **Create account** (for Race Team and the add-on) when you aren't signed in, and **See your account** when you are (or **Move my subscription here** if your subscription is on another PC). **Not now** closes it.

### Race Team and the Team panel

The **Team** panel (also in **Settings → Account**, headed **THE RACE TEAM PLAN**): one person runs the team and buys its seats, and every driver with a seat gets Race Team on their own PC: Driver plus the team features. If the team has the Broadcast add-on, every driver gets that too. The owner only gets them by taking a seat with **I drive for this team**.

The chip at the top right shows **NO TEAM** when you aren't in a team, **NO SEATS YET** or the seats used (for example **2 OF 3 SEATS**) when you own one, and **DRIVER** when you drive for one. That **DRIVER** is your role in the team, not the Driver plan.

| Control | What it does |
|---|---|
| **RUN A TEAM: NAME IT, THEN BUY SEATS FOR YOUR DRIVERS** + **Create team** | Creates your team (name up to 60 characters). |
| **Rename** | Changes the team's name. |
| **JOIN CODE**, **Copy** | The code your drivers enter, in the form `XXXX-XXXX-XXXX`. |
| **New code** | New join code; the old one stops, drivers stay. |
| **New team link** | New team page link; the old one stops. Drivers pick it up by themselves. |
| **I drive for this team** | On: you take one of the team's seats and get Driver and the team features too. Off: you manage the team without a seat. |
| **DRIVERS** list, **Remove** | Shows who's in the team. **Remove** frees that driver's seat. |
| **Buy seats** | Greyed out ("Coming soon"). |
| **JOIN A TEAM: ENTER THE CODE FROM YOUR TEAM OWNER** + **Join team** | For drivers: joins the team with the owner's code. |
| **Leave team** | Leaves the team. You lose the Race Team plan it gives you. |

### If it doesn't work

| Message | Fix |
|---|---|
| "Start the companion first, so Grid Central knows which PC this is." | Start the companion, then try again. |
| "There's already an account with that email." | **Sign in**, or **Forgot password?**. |
| "Wrong email or password." | Check both, or reset your password. |
| "Use a password of at least 8 characters." | Choose a longer password. |
| "Couldn't reach the account server. Check your internet connection." | Go online and try again. |
| "That code isn't valid, or it has already been used." | Check the beta code. Each code works on one account only. |
| "Team codes look like XXXX-XXXX-XXXX." / "That team code isn't right. Check it with your team owner." | Check the code with your team owner. |
| "No free seat: the team is full or has no seats yet." | Ask the team owner to free or buy a seat. |
| "This account has been turned off." | Contact support.gridcentral@gmail.com. |

## The Settings page

**What it does.** All of Grid Central's settings, in six tabs: **Connections**, **Voice & radio**, **Appearance & data**, **Phone & team hub**, **Discord** and **Account**.

**Where to find it.** **⚙ Settings** at the bottom of the sidebar, or **Connect iRacing ↗** in the top bar. It opens your last tab; the left and right arrow keys switch tabs.

Changes save straight away, often with a short confirmation ("Spotter callouts on."). Most messages that send you to a setting name the tab and then the panel, such as "Settings → Connections → iRacing" or "Settings → Voice & radio → Spotter". This is which tab each panel is in:

| Panel | Tab |
|---|---|
| iRacing, OBS Studio | Connections |
| Voice & radio, Spotter, Engineer, Coach, Talkback | Voice & radio |
| Appearance, Your data | Appearance & data |
| Phone, Team hub | Phone & team hub |
| Discord | Discord |
| Account, Team | Account |

## Settings: Connections tab

### iRacing panel

The chip shows **COMPANION NOT RUNNING**, **COMPANION RUNNING · WAITING FOR IRACING** or **CONNECTED**. The panel lists three steps: 1. Press **Start companion**, 2. Leave its window open, 3. Load into a session in iRacing.

| Control | What it does | Default |
|---|---|---|
| **Start with Grid Central** | Starts the companion when Grid Central opens, once per window (closing it on purpose and reloading doesn't restart it). | On |
| **Close with Grid Central** | Stops the companion when you close Grid Central (unless OBS still uses it). Turn off to keep OBS overlays, the in-game overlay and phones running. | On |
| **▶ Start companion** | Starts the companion now. Shows **✓ Companion running** when it's running. | n/a |
| **Connection guide ↗** | Opens a short explanation of how to connect. | n/a |

### OBS Studio panel (Broadcast add-on)

Controls streaming, recording and scenes from Grid Central. The chip shows **NOT CONNECTED** until connected.

1. Open OBS Studio 28 or newer.
2. In OBS, go to **Tools → WebSocket Server Settings**, tick **Enable WebSocket server**, and click **Show Connect Info** to see the port and password.
3. Enter them in Grid Central and press **Connect OBS**.

| Control | What it does | Default |
|---|---|---|
| **HOST** | The PC OBS runs on. | localhost |
| **PORT** | OBS WebSocket's port. | 4455 |
| **PASSWORD** | From OBS's WebSocket settings. | Empty |
| **Connect OBS** | Connects to OBS. | n/a |
| **Remember password on this device** | Saves the password so you don't have to type it again. | Off |
| **Setup guide ↗** | Step-by-step OBS instructions. | n/a |

Your stream keys stay in OBS. Grid Central never asks for them. For more about OBS, see "Broadcast control" in chapter 5.

## Settings: Voice & radio tab

Your race team is three people on the radio: the **spotter** (cars around you), the **engineer** (your race) and the **coach** (your driving). Each has its own switch at the top right of its panel, plus **Voice** (its own voice, or **Same as main voice**; Driver) and **Volume** (10% to 100%, default 100%). The Engineer, Coach and Talkback panels are part of Driver: on Rookie, only the spotter talks. The calls themselves are described in the AI spotter and Talkback chapters. All switches below are on by default unless the table says otherwise.

### Voice & radio panel

| Control | What it does | Default |
|---|---|---|
| **All voice calls** (the switch at the top right; hover it to see its name) | Mutes or brings back every call from the spotter, engineer and coach (the same switch as on the Overview). Talkback's answers and your crew's messages are still read out. | On |
| **Read calls aloud** | Speaks calls with your Windows voices. | On |
| **Voice** | The main voice for all three. Your language's voices come first; ★ natural ones sound best. | Best natural voice, else System default |
| **Speaking style** | **Calm**, **Concise** or **Enthusiastic**: how quickly calls are read. | Calm |

### Spotter panel

| Control | What it does | Default |
|---|---|---|
| **Spotter callouts** | Car left, car right, clear. | On |
| **Flag callouts** | Yellow, caution, debris, blue, black, meatball, red, white and checkered flags. | On |
| **Hazards ahead** | Stopped, slow or off-track cars ahead, and which turn. Warns 200, 300, 500 or 800 m ahead (in Imperial the choices read 700, 1000, 1600 or 2600 ft). | On, 300 m |

### Engineer panel (Driver)

**How much it talks** sets the call switches in one go: **Essential** (strategy, damage, weather, team stints, laps to go), **Standard** (adds gaps, battles, rivals, positions, best laps, incidents and the debrief) or **Everything** (adds every lap time). It shows **Custom** once you change a switch yourself. Default: Standard.

| Switch | What you hear | Default |
|---|---|---|
| **Strategy callouts** | Pit window open, box this lap, fuel to add, fuel saving. | On |
| **Damage callouts** | Repair time after contact, engine warnings. | On |
| **Weather callouts** | Rain, the track wetting or drying, wets or slicks. | On |
| **Team stint callouts** | Stint time warnings and who's next, in team races (needs Race Team). | On |
| **Gap reports** | Position and gaps ahead and behind, every 2, 3 or 5 laps. | On, every 3 laps |
| **Battle calls** | "Car 44 behind is quicker, defend". | On |
| **Rivals' pit stops** | "Car 25 ahead has pitted, push now". | On |
| **Position changes** | "Up to P5". | On |
| **Laps and time to go** | 10, 5, 3, 2 laps; 30, 15, 10, 5, 1 minutes. | On |
| **Best laps** | "Best lap, 2:07.1". | On |
| **Every lap time** | Each lap time and the gap to your best. | Off |
| **Incidents** | "Incident, that's 4x now." | On |
| **Session debrief** | A short spoken summary when you leave a session. | On |

### Coach panel (Driver)

**How much it talks**: **Essential** (a note after the lap), **Standard** (adds a reminder before the corner) or **Everything** (adds the result after it). Default: Everything.

| Control | What it does | Default |
|---|---|---|
| **Corner-by-corner coaching** | Post-lap notes based on your driving. | On |
| **Compare each corner with** | **Your best through it** (your optimal lap) or **Your best lap**. | Your best through it |
| **Focus corner until fixed** | Stays on your worst corner until it's sorted. | On |
| **Target corner from last lap** | With focus off, coaches your worst corner from the last lap. | On |
| **Reminder before the corner** | A cue 100, 150, 200 or 300 m before your braking point (in Imperial the choices read 300, 500, 700 or 1000 ft). | On, 150 m |
| **Corner result after it** | Quicker or slower than your best, straight away. | On |
| **Progress across sessions** | Corners you've fixed and how your laps are improving. | On |

### Talkback panel (Driver)

The chip shows **OFF**, **LOADING SPEECH MODEL**, **READY**, **LISTENING…** or **ERROR**. Speech is recognised on your PC, and the mic is only listened to while you hold the button.

| Control | What it does | Default |
|---|---|---|
| **Talkback** | Listens for your button. Downloads the speech model (about 40 MB) the first time. | Off |
| **Push-to-talk button**: **Set button** | Press it, then the wheel button or key to talk with. | Not set |
| **Microphone** | Your headset mic. Use a different button from iRacing's voice chat. | Windows default microphone |
| **Pit commands by voice** | "Set fuel 40 litres", "four tyres", "fast repair"… | On |
| **Check pit changes first** | **When it isn't sure what it heard**, **Always** or **Never**. A change from a phrase you taught it, or an in-car change of three clicks or more, is always read back first. | When it isn't sure |
| **In-car changes by voice** | "Bias forward one click", "TC up two"… Grid Central presses your iRacing keys (set them under **Keys for in-car changes**), only while iRacing is the active window. | Off |
| **Ask** box | Type a question to test it. | n/a |
| **Teach it your phrases** | Tell it what you meant by phrases it missed. | n/a |

## Settings: Appearance & data tab

### Appearance panel

| Control | What it does | Default |
|---|---|---|
| **Language** | **English**, **Español** or **Deutsch**. Changes Grid Central, your engineer's spoken calls and Talkback. The page reloads straight away. | English |
| **Colour scheme** | **Match Windows** (follows Windows' light or dark mode and changes with it), **Dark** or **Light**. | Dark |
| **Text size** | **Small**, **Default**, **Large** or **Extra large**. Your overlays keep their own sizes. | Default |
| **Accent colour** | The colour of buttons, highlights and live indicators: Lime, Cyan, Blue, Purple, Pink, Red or Orange. | Lime |

**About languages.** Spanish and German are first versions, so a few labels may still be in English. When you switch:

- Talkback understands questions in that language. It downloads that language's speech model (about 40 MB) the first time.
- The phone pit wall and the team page open in that language too.
- If the voice you chose doesn't speak the new language, Grid Central picks the best natural voice that does, if Windows has one. To add one, go to Windows **Settings → Time & language → Speech**.

### Your data panel

| Control | What it does | Default |
|---|---|---|
| **Units** | **Metric (litres, °C, km/h, metres)** or **Imperial (US gallons, °F, mph, feet)**: fuel, temperatures, speeds and distances in Grid Central and spoken calls. In Imperial, fuel use a lap shows in gal/lap (and in gal in Setup performance), and distances are in feet on the radar, in hazard calls, in the coach's notes, spoken cues and corner table, in Talkback's coaching answers, in the phone's coaching notes, in the Lap data readout and in the distance choices in Settings. The planner's fuel boxes stay in litres, as iRacing's pit menu does (in Imperial, the planner says so), and the phone's pit card shows litres with the gallons alongside. | Metric |
| **Backup**: **Save a backup** and **Restore** | See "Backup and restore" below. | n/a |
| **Setup wizard**: **Run setup again** | Opens the setup wizard. | n/a |
| **Open-source licences**: **View licences** | The open-source parts Grid Central uses and their licences (also `THIRD-PARTY-NOTICES.txt` in the Grid Central folder). | n/a |

## Settings: Phone & team hub tab (Driver)

These panels are covered in full in the Phone and Team hub chapters. Here is a summary of the controls.

**Phone panel.** Use your phone as a second screen next to your wheel, over your home Wi-Fi. The chip shows **OFF** until you switch it on.

| Control | What it does | Default |
|---|---|---|
| **Let my phone connect** | Turns on the phone pit wall and shows a QR code. If Windows asks, allow Grid Central on *private* networks. Needs the companion running ("Start the companion first."). | Off |
| **Crew** / **View only** | Which link the QR code is for: Crew (with pit menu and radio buttons) or View only. View only needs Race Team. | Crew |
| **Copy link** | Copies the phone link. | n/a |
| **New pairing code** | Makes a new code. Phones that used this link before are disconnected, but the other link keeps working. | n/a |

**Team hub panel (Race Team).** Your team follows the car live from anywhere in a web page.

| Control | What it does |
|---|---|
| **Share with my team** + **Copy team link** | The hosted team hub, with no setup needed. It needs a seat in a team on Race Team, even during the beta. |
| **Copy rules**, **DATABASE ADDRESS**, **TEAM PAGE ADDRESS** | Settings for running the hub on your own free Firebase and GitHub Pages hosting. |
| **Team name** + **Start sharing** | Starts sharing. **Copy team link** copies the link and **New link** stops the old one working. |

## Settings: Discord tab

Covered in full in the Discord chapter. There are three independent ways to connect, and the chip shows **NOT SET UP** until one is done. Your webhook link and bot token stay on your PC, in the companion's folder.

Your Discord status is free on every plan. Posting to a channel is part of Driver (its **Going live** posts and stream links need the Broadcast add-on, and **Driver changes** posts need Race Team), and the league bot is part of Race Team.

| Section | Controls |
|---|---|
| **1 Post to a channel** (webhook) | Webhook link + **Save**, **Send test**, **Remove**; **Include tyre and fuel details** (on by default); **YOUR STREAM LINKS (FOR "GOING LIVE")** with **+ Add another link**. |
| **2 Show what you're driving in your Discord status** (Rich Presence) | **Application ID**, **Show my status** (off by default), **Include my position** (on by default). The Discord app has to be running on your PC. |
| **3 League bot** | Bot token + **Save**, **Invite the bot ↗**, **Remove token**; then **SERVER**, **ANNOUNCEMENTS**, **RESULTS AND UPDATES**, **RACE REMINDERS**, **REMIND BEFORE EACH RACE** and **Send test to results channel**. |

## Settings: Account tab

This tab has the **Account** and **Team** panels, described in "Your account and plans" above. It also shows the support address: support.gridcentral@gmail.com.

## Backup and restore

**What it does.** **Save a backup** puts everything Grid Central keeps in your browser into one file: laps, lap data, coaching, setups and notes, strategy, overlays, paint designs, debriefs and settings. Use it to keep your data safe or to move to another PC.

**Where to find it.** **Settings → Appearance & data → Your data → Backup**.

### Saving a backup

1. Press **Save a backup**.
2. Your browser saves a file named like `grid-central-backup-2026-10-14.json` (with the date you saved it) to your Downloads folder.
3. A message confirms it, for example "Backup saved (12.4 MB, 830 laps). Keep it somewhere safe."
4. Copy the file somewhere safe, such as a USB stick or cloud storage.

### Restoring a backup

1. On the new PC (or after a reinstall), install Grid Central and open it.
2. Go to **Settings → Appearance & data → Your data** and press **Restore**.
3. Choose your backup file.
4. Confirm the question: "Restore the backup from …? It replaces everything Grid Central has saved in this browser (laps, settings, overlays, setups and so on)."
5. Grid Central shows "Backup restored. Reloading Grid Central…" and reloads.

**The companion's own files aren't in the backup.** Copy these from the Grid Central folder (Start menu → right-click Grid Central → **Open file location**) to the same folder on the new PC:

- `overlays.json` (overlay designs)
- `phone.json` (phone pairing)
- `discord.json` (Discord webhook, bot and presence)
- `teamhub.json` (your own team hub settings)

**Tips**

- Restoring **replaces** what's there, so it doesn't merge with it. Save a backup on the new PC first if it already has data you want.
- The folder permission for the paint shop's paint folder can't move between PCs. You'll be asked for it again.
- Your data is saved per browser. If you open Grid Central in Chrome instead of Edge, you see a separate, empty copy, and backup and restore is how you move between them.

### If it doesn't work

| Message | Fix |
|---|---|
| "That isn't a Grid Central backup file." | Pick the `.json` file made by **Save a backup**. |
| "Couldn't make the backup: …" / "Couldn't restore everything: …" | Close other Grid Central tabs and try again. Make sure your disk isn't full. |

## Updates

**What it does.** The companion checks GitHub for a newer Grid Central about 8 seconds after it starts, and then every 6 hours. When there is one, a banner appears at the top of Grid Central: **Grid Central &lt;version&gt; is available. You have &lt;version&gt;.**

**Where to find it.** The update banner, just under the top bar.

1. Optionally click **What's new** for the release notes.
2. Press **Update now (NN MB)**. The banner shows the download, then "Installing Grid Central …. It restarts in a moment."
3. Setup installs quietly and Grid Central restarts; your window reloads into the new version.

With the zip version, the button reads **Download** and opens the release page instead. Download the new Setup and run it.

A minute after starting, the companion also clears old Setup downloads and leftover copies of Grid Central from Windows' temp folder.

### If it doesn't work

| Problem | Fix |
|---|---|
| "Couldn't check for updates: …" in the banner | GitHub couldn't be reached. Check your connection; it checks again later. |
| "The download failed: …" | Press **Update now** again. If it keeps failing, download the Setup from the release page. |
| "The update couldn't start: …" | Your antivirus may have blocked the Setup program. Allow it, or run the Setup yourself. |
| A window says "Grid Central's update didn't finish: …" | Grid Central starts again as it was. Download the Setup from the release page and run it. |
| A new feature is missing after an update | Press Ctrl+F5. If it's still missing, close every Grid Central tab and open `http://127.0.0.1:8765` again. |

## Uninstalling

**Installed with Setup:**

1. Open Windows **Settings → Apps → Installed apps**, find **Grid Central** and choose **Uninstall**.
2. Answer **Yes** to "Remove Grid Central from this PC?". Grid Central and its companion are closed.
3. You're asked "Keep your Grid Central settings files (Discord, phone pairing, overlay designs) in case you install it again?". Choose **Yes** to keep them in the Grid Central folder, or **No** to delete everything.
4. A message confirms "Grid Central has been removed."

The uninstaller removes the shortcuts, the Windows apps entry and the "Start companion" link. **Laps and settings saved in your browser stay there.** To remove those too, clear the site data for `127.0.0.1` in your browser. Save a backup first if you might want it again.

**Zip version:** double-click **Remove start button link.bat** in the Grid Central folder, then delete the folder.

## Troubleshooting

Start with the top-bar status and the companion window. Most problems come down to the companion not running, or iRacing not sending data yet.

| Problem | What to do |
|---|---|
| **"IRACING NOT CONNECTED"** or **"Companion not running"** | Start the companion (**Settings → Connections → ▶ Start companion**, or open Grid Central from the Start menu) and leave its window open. |
| **"WAITING FOR IRACING"** or **"Waiting for iRacing"** | The companion is running. Load into a session and get in the car. The garage menus don't send live data. |
| **No spoken calls** | Click anywhere in Grid Central once, because browsers block sound until you do. Check the **All voice calls** switch at the top, **Read calls aloud**, and each role's switch and volume in **Settings → Voice & radio**. Try **◖ Test the voice** in the setup wizard. |
| **Engineer speaks English after switching language** | Install a voice for that language in Windows **Settings → Time & language → Speech**, then pick it under **Voice**. |
| **The in-game overlay doesn't show over iRacing** | Set iRacing to windowed or borderless. Full screen covers everything else. On Rookie, only the **Relative**, **Standings** and **Flags** widgets are drawn, so a design without them (such as **Minimal HUD**) shows nothing: add one in the **Add** tab. |
| **Talkback doesn't hear me** | Check the microphone and button in **Settings → Voice & radio → Talkback**, and that the status shows **READY**. Hold the button a moment before speaking. If it says "Press Set button, then press the wheel button or key you want to talk with.", set a button first. On Rookie the status stays **OFF**, because talkback is part of Driver. |
| **Phone can't connect** | Allow GridCentral.exe on **private** networks when Windows asks. Set your Wi-Fi to Private in Windows **Settings → Network & internet**. Make sure the phone is on the same Wi-Fi. On Rookie, phones can't connect: the phone pit wall is part of Driver. |
| **"No QR code"** on the Phone panel | Type the link shown under it into your phone instead. |
| **Windows or antivirus blocks GridCentral.exe** | The beta isn't signed yet. Choose **More info → Run anyway**, or allow it in your antivirus. |
| **The companion closed, or overlays stopped** | Look at `companion.log` in the Grid Central folder (the run before is `companion-previous.log`) and send it with your report. |
| **"A page stopped reading live data, so it was disconnected"** in the companion window | A frozen page or a paused OBS source was disconnected so it didn't hold up everyone else. It reconnects by itself. |
| **The natural commentary voices don't start** | They need the internet the first time (about 340 MB). The Commentary panel shows the download. If it fails, switch the commentary off and on to try again. Windows' voices are used in the meantime. |
| **"Offline install is unavailable in this browser session."** | Harmless. Grid Central works normally; only its offline copy isn't available. |
| **Settings or laps disappeared** | Check you're using the same browser as before (Edge or Chrome keep separate data). Restore your latest backup if needed. |

### Reporting a problem

Email **support.gridcentral@gmail.com** and include:

- Your version, from the bottom right of Grid Central (for example **V 0.5.9.1 · BETA**)
- The track, the car and the session type
- What you were doing, what you expected and what happened, and how often it happens
- `companion.log` from the Grid Central folder (and `companion-previous.log` if the problem was in the run before)
- After your first session, the `iracing-variables.txt` file next to GridCentral.exe helps too: it lists everything your iRacing version reports

To find the Grid Central folder, right-click Grid Central in the Start menu and choose **Open file location**.
