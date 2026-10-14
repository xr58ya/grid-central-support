# Overlays, streaming, Discord and team racing

This chapter covers everything Grid Central does for the people watching you race: overlays on your stream and on your own screen, OBS control, TV-style commentary, Discord, your league's schedule, and the team hub that lets your crew follow the car from anywhere.

**Before you start**

- Most of these features run through the **companion**, the small GridCentral window that opens with Grid Central. If you see "COMPANION NOT RUNNING", press **▶ Start companion** in Settings → Connections → iRacing.
- When you close Grid Central, the companion closes a few seconds later, **unless an overlay in OBS is still connected**. Then it keeps running for OBS. To keep the in-game overlay and the team hub running after you close the app, turn off **Close with Grid Central** in the same place.
- Features marked **PRO** in free mode: the Broadcast page and OBS control, the in-game overlay, most overlay widgets and extra designs, Discord, the League room and the team hub. The hosted team hub needs the **Team** plan. Click a PRO label to see what unlocks it.

---

## Race overlay designer

**What it does.** You build overlays from widgets (speed, lap times, standings, track map, flags and more), starting from a template. One design can go into OBS for your viewers, another can show on your own screen while you drive. OBS shows each change as you make it.

**Where to find it.** **Race overlay** in the left menu. At the top right: **Preview ↗**, **Copy OBS link** and **Add to OBS**.

### Your first overlay

1. Open **Race overlay**. You start with a design called **Minimal HUD**.
2. For a different look, press **+ New from template** and pick a card in **Choose a template**.
3. In the side panel's **Add** tab, click a widget. It appears in the middle of the canvas.
4. Drag it into place and pull its corners to resize it. Its text scales with the box.
5. With it selected, the **Selected** tab shows its **Options** and **Style**.
6. The **Theme** tab sets colours, font and text size for the whole design.
7. Press **Rename** to name the design. Changes save as you go; **Save** saves straight away and says whether OBS and the in-game overlay have it.

### Page buttons and the design bar

| Control | What it does | Default |
|---|---|---|
| **Preview ↗** | Opens the design in a browser tab, as OBS sees it. | – |
| **Copy OBS link** | Copies this design's link for an OBS Browser source. | – |
| **Add to OBS** | Adds the overlay to OBS's current scene in one click (OBS must be connected). | – |
| **OVERLAY** | Which design you're editing. Also switches the "Grid Central Overlay" source in OBS to it. | Minimal HUD |
| Save note | "Saving…", "All changes saved", "Saved here · start the companion for OBS" or "Not saved: too big". | – |
| **Save** | Saves now. | – |
| **+ New from template** | New design from a template. (Pro) | – |
| **Rename** | Renames the design (up to 40 characters). | – |
| **Duplicate** | Copies the design as "… copy". (Pro) | – |
| **Export** / **Import** | Saves the design as a `.grid-overlay.json` file, or loads one. Imports keep only real widgets and settings, so shared files are safe. (Import is Pro) | – |
| **Delete** | Deletes the design after asking. OBS sources using its link then show your first overlay. | – |
| **OBS BROWSER SOURCE** | This design's link, like `http://127.0.0.1:8765/overlay.html?layout=…`. | – |

### Canvas toolbar

| Control | What it does | Default |
|---|---|---|
| **↶** / **↷** | Undo and redo, up to 60 steps (Ctrl+Z, Ctrl+Y). | – |
| **Screen** | **16:9 standard**, **16:10**, **21:9 ultrawide**, **32:9 super ultrawide**, or **This screen (width × height)**. Widgets keep their side of the screen when you change it. | 16:9 standard |
| **Snap to grid** | Snaps widgets to an 8-pixel grid. | On |
| **Background** | What's behind the canvas while you design: **Track scene**, **Dark**, **Light** or **Transparent**. Doesn't change the overlay. | Track scene |
| **SAMPLE DATA** / **LIVE FROM IRACING** | Where the numbers come from: sample laps until you're in a session. | – |

**Shortcuts:** arrow keys nudge the selected widget 1 pixel (Shift: 10). **Delete** removes it, **Ctrl+D** duplicates it, **Esc** deselects. Hold **Shift** while pulling a corner to keep the shape. Shortcuts don't work while you're typing in a box.

### Selected and Theme tabs

| Control | What it does | Default |
|---|---|---|
| **X**, **Y**, **W**, **H** | Exact position and size in pixels (the canvas is 1080 tall; minimum 32). | – |
| **Send back** / **Bring forward** | Moves the widget behind or in front of others. | Newest on top |
| **Duplicate** / **Delete** | Copies or removes the widget. | – |
| **OPTIONS** | The widget's own settings (see "Overlay widgets"). | Per widget |
| **Own colours (instead of the overlay theme)** | Gives this widget its own style controls (the same as the Theme tab). | Off |
| **Accent** | Highlight colour. | Lime (#d2ff50) |
| **Text** | Text colour. | Off-white |
| **Background** | Card colour. | Near-black |
| **Font** | **Space Grotesk**, **DM Sans**, **System** or **Mono**. | Space Grotesk |
| **Border colour** | Colour of the text border. | Black |
| **Text size** | 60% to 160%. | 100% |
| **Text border** | Outline around letters, off or 0.5 to 4 px. Keeps text readable over bright scenery. | Off |
| **Background opacity** | 0% (only text and graphics) to 100%. | 88% |
| **Corner radius** | 0 to 32 px. | 8 px |

Templates bring their own theme.

### Templates

| Template | What's in it |
|---|---|
| **Minimal HUD** | Badge, session, spotter, speed and gear, lap times, delta. |
| **Broadcast** | TV-style: session, 12-row standings, flags, track map, position, speed and gear. |
| **Driver focus** | Relative, delta, flags, spotter, speed and gear, inputs, fuel, damage. |
| **Endurance** | 20-row standings, session, fuel, position, incidents, damage, race strategy, track map, lap times, delta. |
| **Streamer** | Webcam frame with name tag, channel text, logo, speed and gear, delta, spotter. |
| **Blank** | An empty canvas. |

### Tips

- **See-through widget:** select it, turn on **Own colours**, and lower **Background opacity** to 0%. Add a **Text border** for readability.
- If bigger text gets tight, make the widget bigger.
- Logos are shrunk to 640 pixels when added. If you see "This overlay is too big to save in the browser. Try smaller images.", use smaller images.
- Widgets that appear only sometimes (spotter, flags, captions) show faded in the designer so you can place them.
- Designs are also kept by the companion in overlays.json in the Grid Central folder. Back it up when moving PCs.

### If it doesn't work

| Problem | Fix |
|---|---|
| "Saved here · start the companion for OBS" | Start the companion; the design is sent to OBS automatically. |
| A widget opens "This is part of Pro" | In free mode you can use **Standings**, **Fuel** and **Flags**. |
| A widget shows dashes (—) | It's waiting for data. Fuel per lap, strategy and tyre wear need a few laps. |
| A design changed by itself | A newer copy came from the companion (an edit in another window). The newest wins. |

---

## Overlay widgets

Defaults are in brackets.

### Driving

| Widget | What it shows | Options (default) |
|---|---|---|
| **Speed & gear** | Speed, gear, and 12 shift lights (green, amber, red, flashing at the shift point). | **Speed units** km/h or mph (km/h). **Shift lights** (on). |
| **Lap times** | Lap number (of total), current, last and best lap. | **Current lap**, **Last lap**, **Best lap** (on). |
| **Delta to best** | Gap to your best lap, with a bar from the centre that changes colour when you're slower. | **Bar range** ± 0.5 s, ± 1 s, ± 2 s (± 1 s). |
| **Position** | Position out of the field, plus class position. | **Show class position** (on). |
| **Session** | Session type with laps or time left. | – |
| **Fuel** | IN TANK, PER LAP, LAPS LEFT. Uses Race strategy's figure until it has measured a few laps. | **Units** Litres or US gallons (Litres). |
| **Race strategy** | Strategy advice, fuel spare or short at the end, STOPS, how much to ADD (or FILL), and the pit WINDOW. Turns orange when you're short or due to box. | **Units** (Litres). |
| **Fuel calculator** | LAPS OF FUEL, LAPS TO GO, SPARE or SHORT, and PER LAP TO MAKE IT (the fuel per lap that gets you to the end). | **Units** (Litres). |
| **Incidents** | Your incident count, like "4x". | – |

### Field

| Widget | What it shows | Options (default) |
|---|---|---|
| **Battle** | The car just ahead and behind, with gaps and whether they're catching or pulling away. | **My class only** (on). |
| **Relative** | Cars around you on track with time gaps; cars in the pits left out. In races, cars a lap up are reddish, a lap down blue. | **Cars shown** 5, 7, 9, 11 (7). **iRating & licence** (on). **iRating change (races, estimate)** (off). |
| **Standings** | Running order with gaps to the leader in races, or best laps in practice and qualifying. Pit cars dimmed and marked PIT. You always appear, in the last row if needed. | **Cars shown** 8, 10, 12, 15, 20 (12). **My class only** (off). **iRating change (races, estimate)** (off). |

The **iRating change** is what each driver would gain or lose if the race ended now, using the community's formula, within each class. Treat it as an estimate.

### Inputs & map

| Widget | What it shows | Options (default) |
|---|---|---|
| **Inputs** | Throttle and brake bars, a turning steering wheel, and a 6-second trace (green throttle, red brake). | **Input trace** (on). **Steering wheel** (on). |
| **Track map** | iRacing's track map with you (big dot) and the field in class colours. | **Other cars** (on). **Turn numbers** (on). |

### Race control

| Widget | What it shows | Options (default) |
|---|---|---|
| **Pit exit** | "IF YOU PIT NOW": the position you'd rejoin in, who'd be just ahead and behind, and about how long the stop takes (about 25 s until Race strategy has measured it). | – |
| **Spotter** | CAR LEFT, CAR RIGHT, THREE WIDE, TWO CARS LEFT/RIGHT with side arrows. Hidden when nobody's alongside; briefly shows CLEAR. | **Show when clear** (off). |
| **Damage** | REPAIRS, OPTIONAL and FAST REPAIRS left, warning lights (WATER, OIL TEMP, OIL PRESS, FUEL PRESS, STALL), water and oil temperatures, and a car diagram coloured by how badly each area is hit (estimated). | **Car diagram (estimated hit areas)**, **Tyre wear on the car**, **Engine temperatures**, **Colour key under the car** (all on). **Minor damage**, **Major damage**, **Wrecked** colours (yellow, orange, red). |
| **Tyres** | Tread left on each tyre with bars across it (inside, middle, outside), COMPOUND, LAPS ON SET, SETS LEFT. Green, amber below 60%, red below 30%. | **Wear across each tyre** (on). **Compound, laps and sets** (on). |
| **Flags** | The flag that's out as a real flag rippling on a pole (waved flags flap faster), with its name: red, black, meatball, caution, yellow, debris, blue, white and chequered. Hidden when no flag is out. | **Flag name** (on). **Waving in the wind** (on). |
| **Commentary captions** | Subtitles for the Broadcast commentary, with LEAD or ANALYST. | **Who's talking** (on). **Background** (on). |

iRacing only measures tyres in the pits. Between stops, Grid Central estimates them from how fast they wore and marks the numbers with **~**.

### Branding

| Widget | What it shows | Options (default) |
|---|---|---|
| **Text** | Any text, like your channel name. | **Text** (YOUR TEXT, up to 80 characters). **Align** Left, Centre, Right (Centre). **Capitals** (on). **Background** (on). |
| **Image / logo** | Your logo. Empty, it shows "IMAGE" in the designer only. | **Choose image** / **Replace** / **Remove**. **Fit** Fit inside or Fill (Fit inside). |
| **Webcam frame** | A frame with corner accents for your camera, with an optional name tag. Put your OBS camera source under it. | **Name tag** (empty). **Corner accents** (on). |
| **Grid Central badge** | The GC. GRID CENTRAL badge. | – |

When the companion is running but you're not in an iRacing session, the data widgets hide, and only Text, Image / logo, Webcam frame and the badge stay on screen.

---

## Adding your overlay to OBS (Browser source)

**What it does.** Your overlay runs in OBS as a see-through Browser source on top of your game capture, updating live as you race and as you edit.

**Where to find it.** **Race overlay → Add to OBS** or **Copy OBS link**, or **Broadcast → Add Grid Central overlay to scene**.

### The one-click way

1. Connect OBS (see "Broadcast control" below).
2. Pick your streaming scene in OBS, or in **Broadcast → PROGRAM SCENE**.
3. On **Race overlay**, choose your design in **OVERLAY** and press **Add to OBS**.
4. A Browser source called **Grid Central Overlay** appears, sized to your design, with **Control audio via OBS** ticked and audio monitoring off (ready for the commentary).
5. Keep it **above** your game capture in OBS's Sources list.

Pressing it again updates the source, and adds it to the current scene if that scene doesn't have it yet.

### Doing it yourself

1. On **Race overlay**, pick the design and press **Copy OBS link**.
2. In OBS, **Sources → + → Browser**, name it, press OK.
3. Untick **Local file** and paste the link into **URL**.
4. Set **Width** × **Height**: 1920 × 1080 for 16:9. Other shapes are 1080 high and 1728 (16:10), 2560 (21:9) or 3840 (32:9) wide.
5. For the commentary, tick **Control audio via OBS**. Press OK.

### Tips

- **The one-click source follows the designer:** it switches to whatever you pick in **OVERLAY**. For a fixed design in a scene (say, "Starting soon"), add your own Browser source with that design's link.
- Without the companion, OBS shows sample data tagged "SAMPLE DATA · START GRID CENTRAL FOR LIVE DATA", so you can line things up any time.
- **Free plan:** OBS shows one overlay (the one picked in the designer) with only Standings, Fuel and Flags.

### If it doesn't work

| Problem | Fix |
|---|---|
| "Connect OBS first (Settings → OBS Studio)…" | Connect OBS under Settings → Connections → OBS Studio. |
| Blank in OBS | Start the companion and get in a session. Right-click the source → **Refresh**. |
| Sample data during a race | The companion isn't running. Start it and refresh the source. |
| Wrong size or cut off | Match the source size to the design, then right-click → **Transform → Fit to screen**. |
| Edits don't reach OBS | Designs reach OBS through the companion: start it and press **Save**. |
| "Couldn't access the clipboard…" | Copy the link under **OBS BROWSER SOURCE** by hand. |

---

## In-game overlay

**What it does.** Shows one of your designs on top of iRacing on your own monitor. It's a see-through, always-on-top window that clicks pass straight through. It never shows sample data.

**Where to find it.** **Race overlay**, panel **IN-GAME OVERLAY** ("On your screen while you drive"). (Pro)

1. In iRacing's graphics options, use **windowed or borderless**, not full screen.
2. Start the companion.
3. Pick a **DESIGN** and a **SCREEN**, then press **Show on screen**. The chip changes from **OFF** to **ON SCREEN**.
4. While driving, **Ctrl+Alt+O** hides and shows it. **Hide from screen** closes it.

| Control | What it does | Default |
|---|---|---|
| **DESIGN** | The design shown on your screen (can differ from OBS's). Switches live. | The design you're editing |
| **SCREEN** | **Main screen**, or **Screen 1 (left)** to **Screen 4**, counted from the left. | Main screen |
| **Show on screen** / **Hide from screen** | Opens or closes the overlay. | – |
| **Change** | Press it, then your new shortcut: **Ctrl** or **Alt** plus a key, or an **F key** alone. **Esc** or **Cancel** keeps the old one. | Ctrl+Alt+O |

**Tips:** set the canvas **Screen** to **This screen** so the design matches your monitor. Keep it light: fewer widgets, lower opacity. The shortcut works inside iRacing without blocking other programs. The window closes when the companion stops. You can also show, hide or switch it from the phone pit wall's **More** tab.

| Problem | Fix |
|---|---|
| "The in-game overlay is opened by the companion. Start it first…" | Start the companion and press **Show on screen** again. |
| ON SCREEN but nothing visible | Run iRacing windowed or borderless, check **SCREEN**, press your shortcut in case it's hidden. |
| Only logo and text show | You're not in an iRacing session yet. |
| "Couldn't serve the overlay page (is port 8767 in use?)." | Close the program using port 8767, or restart the PC. |
| "The in-game overlay files are missing from this Grid Central folder." | Reinstall Grid Central. |

---

## Broadcast control (OBS, Twitch and YouTube)

**What it does.** Lets you switch OBS scenes, start and stop streaming and recording, and add the overlay from Grid Central. Twitch and YouTube go **through OBS**: Grid Central never reads your stream key.

**Where to find it.** Connect in **Settings → Connections → OBS Studio**; control from the **Broadcast** page. (Pro)

### Connect OBS

1. Open **OBS Studio 28 or newer**.
2. **Tools → WebSocket Server Settings**, tick **Enable WebSocket server**, press Apply.
3. Press **Show Connect Info** for the **Server Port** (usually 4455) and **Server Password**.
4. In Grid Central, **Settings → Connections → OBS Studio**: keep **HOST** as `localhost`, enter **PORT** and **PASSWORD**.
5. Tick **Remember password on this device** if you like, and press **Connect OBS**. The chip turns **CONNECTED**.

Grid Central reconnects by itself next time, until you press **Disconnect**.

| Setting | What it does | Default |
|---|---|---|
| **HOST** | Where OBS runs (`localhost` for this PC, or a streaming PC's address). | localhost |
| **PORT** | OBS's WebSocket port. | 4455 |
| **PASSWORD** | From Show Connect Info. | Empty |
| **Remember password on this device** | Keeps the password so you don't retype it. | Off |
| **Connect OBS** / **Disconnect** | Connects or disconnects. | – |

### The Broadcast page

| Control | What it does |
|---|---|
| Status chip | **NOT STREAMING**, **LIVE**, **RECORDING** or **LIVE · RECORDING**. |
| **PROGRAM SCENE** | Your OBS scenes, in OBS's order. Picking one switches OBS. |
| **Add Grid Central overlay to scene +** | Same as **Add to OBS**. |
| **Start recording** / **Stop recording** | Records in OBS; when it stops, a toast says where the file went. |
| **Start streaming** / **Stop streaming** | Asks "Start streaming in OBS? You'll go live on the service configured in OBS." then goes live. |
| **Race-day checklist** | **Mic level checked**, **Overlay added as OBS browser source** (ticks itself when the overlay is found in OBS), **Stream key configured in OBS**, **Audio levels balanced**. Ticks are remembered. |
| **STREAM DESTINATIONS** | OBS Studio, Twitch and YouTube Live (both "THROUGH OBS"), each with a **Setup guide ↗**. |

### Twitch

1. In OBS, **Settings → Stream**, **Service: Twitch**.
2. Press **Connect Account (recommended)** and sign in (or use a stream key, kept in OBS only). Press OK.
3. In Grid Central, add the overlay, tick the checklist, and press **Start streaming**.

### YouTube Live

1. Turn on live streaming for your channel in YouTube Studio (the first time can take up to a day).
2. In OBS, **Settings → Stream**, choose YouTube as the **Service**, press **Connect Account** and sign in (or use a stream key in OBS only). Press OK.
3. Press **Start streaming** in Grid Central.

**Tips:** never paste a stream key into Grid Central; it never asks for one. With Discord set up, your going-live post goes out when OBS starts streaming. The phone pit wall's **More** tab can switch scenes and start and stop streaming and recording.

| Message | Fix |
|---|---|
| "Couldn't reach OBS. Check that OBS is open and its WebSocket server is enabled." | Open OBS, enable the server, check the port. |
| "Wrong OBS WebSocket password." / "OBS needs the WebSocket password." | Enter the password from Show Connect Info. |
| "Timed out connecting to OBS." | Check HOST and PORT, and the other PC's firewall. |
| "This page can't sign in to OBS. Open Grid Central from localhost or https." | Open Grid Central from its normal shortcut. |
| "Couldn't start the stream: …" | Set up a service in OBS's **Settings → Stream**. |

---

## Commentary on your stream

**What it does.** Two commentators call your race like TV: a **lead** for the action and an **analyst** for the story. Viewers hear them through your overlay in OBS; you don't. It runs while Grid Central is open.

**Where to find it.** **Broadcast → Commentary** ("ON YOUR STREAM ONLY"). (Pro)

1. Add the overlay with **Add to OBS** (that sets the sound up). If you added it yourself, tick **Control audio via OBS** in its properties.
2. In OBS, **Edit → Advanced Audio Properties**: the overlay's **Audio Monitoring** must be **Monitor Off**.
3. Keep the overlay source visible in your scene (it can be see-through), or OBS mutes it.
4. Optional: add the **Commentary captions** widget.
5. Turn on the switch, press **Test on stream**, and watch the overlay's level in OBS's Audio Mixer.

The settings: **Follow** (**My car**, iRacing's camera car, or the whole field), **Language**, **Where viewers hear it** (**Through OBS** or **A sound device**), **Voices** (**Natural voices**, a one-time download of about 340 MB, or **Windows voices**), a voice for the **Lead commentator** and **Analyst** with **Listen**, **How much they talk** (**Key moments**, **Standard**, **Non-stop**; Standard by default), **TV sound** (on), **Your name on the stream**, and **Say names like this** (for example `Lindqvist = Lindkvist`).

**Other streaming apps:** install a virtual audio cable (the free VB-Audio Virtual Cable), set **Where viewers hear it** to **A sound device**, pick **CABLE Input**, and add **CABLE Output** as an audio input in your streaming app. Never pick your headset.

**If nobody hears it:** "No Grid Central overlay is open in OBS, so nobody hears it yet" means add the overlay and keep it visible. "That's your main sound output…" means pick another device.

---

## Discord

**What it does.** Three separate connections; use any of them:

1. **Post to a channel (webhook)**: results, summaries, personal bests, going live and driver changes.
2. **Rich Presence**: your Discord status shows what you're driving.
3. **League bot**: slash commands, sign-ups, reminders, announcements and the League room.

Your webhook link and bot token stay on this PC (in discord.json) and are only ever sent to Discord. All three need the companion running.

**Where to find it.** **Settings → Discord**. The chip shows what's set up, like **WEBHOOK · STATUS · BOT ONLINE**, or **NOT SET UP**. (Pro)

### 1. Post to a channel (webhook)

1. In Discord: the channel's settings (⚙) → **Integrations** → **Webhooks** → **New Webhook** (you need Manage Webhooks).
2. Press **Copy Webhook URL**, paste it in Grid Central and press **Save**.
3. Press **Send test**. "Grid Central is connected" appears in the channel.
4. Choose what's posted.

| Setting | What it does | Default |
|---|---|---|
| **Save**, **Send test**, **Remove** | Saves, tests or forgets the webhook. | – |
| **Race results** | Finish (places gained, class position), best lap, laps, race pace, incidents, stops, at the chequered flag (or when you leave a race after 2+ laps). | On |
| **Practice and qualifying summaries** | Laps, best lap and pace when you leave a session with 3 or more laps. | On |
| **Personal bests** | A new best at a track in a car, with the improvement. | On |
| **Going live** | When you start streaming in OBS (connected in Grid Central), with your links. | On |
| **Driver changes** | Who takes over, lap and position, in team races. | On |
| **Include tyre and fuel details** | Adds fuel per lap, fuel left, laps a tank, tyre wear (from your last stop) and pace fall-off. Fuel follows your units. | On |
| **YOUR STREAM LINKS (FOR "GOING LIVE")** | Up to 5 links, each named from its address (Twitch, YouTube, Kick…). **+ Add another link**, **Remove**. | Empty |

With the bot connected and a results channel picked, posts go through the bot instead.

### 2. Rich Presence

1. **discord.com/developers/applications** → **New Application**, named **Grid Central** (your status says "Playing Grid Central").
2. Copy the **Application ID** from **General Information** into Grid Central.
3. Turn on **Show my status**.
4. Optional: upload a logo under **Rich Presence → Art Assets** named `gridcentral`.

| Setting | What it does | Default |
|---|---|---|
| **Application ID** | Your application's ID. | Empty |
| **Show my status** | Turns it on. | Off |
| **Include my position** | Adds your position in races. | On |

In a session, your status shows car and track, the session (or "in the garage"), position and lap, your best lap outside races, and time left in timed races. The Discord desktop app must be running.

### 3. League bot

1. In your application, **Bot** → **Reset Token** → copy it. Turn on **Message Content Intent** on the same page.
2. Paste the token and press **Save**. The status goes "Connecting…" then "Online as" your bot.
3. Press **Invite the bot ↗**. A server admin adds it to the league's server.
4. Pick the **SERVER** and channels, then press **Send test to results channel**.

| Setting | What it does | Default |
|---|---|---|
| **Remove token** | Takes the bot offline. | – |
| **ANNOUNCEMENTS (SHOWN IN THE LEAGUE ROOM)** | The channel the League room shows and posts to. | Not used |
| **RESULTS AND UPDATES (THE BOT POSTS HERE)** | Where results and updates go. | Not used |
| **RACE REMINDERS** | Where reminders go, with who's signed up. | Not used |
| **REMIND BEFORE EACH RACE** | **1 day before**, **1 hour before**, **15 minutes before**. A late-added race gets only the latest reminder due. | 1 hour and 15 minutes |

| Slash command | What it does |
|---|---|
| `/nextrace` | Next race, start time and sign-ups. |
| `/signup` / `/withdraw` | Adds or removes you for the next race (only you see the reply). |
| `/signups` | Who's signed up. |
| `/session` | What the driver is doing in iRacing: session, position, laps, fuel. |
| `/standings` | Live standings (top 10, plus the driver). |
| `/results` | The driver's last session. |

"The driver" is whoever runs the companion that hosts the bot. The bot is online while that companion runs.

**Tips:** the webhook takes two minutes to set up. Personal bests, going live and driver changes are posted by Grid Central itself, so keep it open for those. Spray Booth photos from the paint shop can go to Discord too.

| Message or problem | Fix |
|---|---|
| "Start the companion first. It connects Grid Central to Discord." | Start the companion. |
| "That isn't a Discord webhook link…" | Copy it again; it starts with `https://discord.com/api/webhooks/`. |
| "Discord said: … (404)" | The webhook was deleted. Make a new one. |
| "The Discord app isn't running on this PC." | Open the Discord desktop app. |
| "Discord didn't accept the Application ID…" | Copy it again from General Information. |
| "That bot token wasn't accepted…" | Reset the token and paste the new one. |
| "The bot isn't in a server yet. Press Invite the bot." | Invite it with a server admin. |
| "The bot can't read message text…" | Turn on **Message Content Intent**. |
| "The bot can't read the announcements channel…" | Give the bot View Channel and Read Message History there. |
| Slash commands missing | Wait a minute after the bot comes online and restart Discord. |

---

## League room

**What it does.** Your league's schedule, a countdown to the next race, who's signed up, and your Discord announcements. The schedule works on its own; sign-ups, reminders and announcements need the league bot.

**Where to find it.** **League room** in the left menu, with **Discord settings →** and **+ Add a race** at the top. (Pro)

1. Start the companion (it keeps the schedule).
2. Type your league's name in **NAME**.
3. Press **+ Add a race**, fill in the form and press **Save race**.
4. With the bot connected, drivers sign up with `/signup`, and reminders go out before the race.

| Field or control | What it does | Default |
|---|---|---|
| **NAME** (race) | Required, like "Round 6 · Road America 120". | Empty |
| **DATE AND TIME** | Required, your local time. Discord shows it in each driver's time zone. | A week ahead, 20:00 |
| **TRACK**, **CAR OR CLASS**, **LENGTH**, **NOTES** | Shown on the card, the schedule and in Discord. | Empty |
| **NEXT RACE** | Countdown (days, hours, minutes, then "Lights out"), details, notes and **SIGNED UP**. **×** removes a sign-up. | – |
| **Coming up** | Upcoming races with sign-up counts, **Edit** and **Delete** (deletes its sign-ups too). | – |
| **Latest from the paddock.** | Your announcements channel, checked every minute; **Refresh** checks now. | – |
| **Post an announcement to Discord** + **Post** | Posts through the bot (up to 1,900 characters). | – |

**Tips:** races stay listed until 3 hours after the start. Changing a start time re-sends its reminders.

| Problem | Fix |
|---|---|
| "The companion isn't running." | Start it. |
| "Give the race a name and a date and time." | Fill in both. |
| No announcements | Set up the bot and pick **ANNOUNCEMENTS** in Settings → Discord. |

---

## Team hub

**What it does.** Your team follows the car live from anywhere in a web page: position, laps, gaps, fuel, flags, the strategy with **BOX THIS LAP**, standings and the radio. They can send messages that your engineer reads out ("Sam says: …"). Unlike the phone pit wall, it isn't limited to your Wi-Fi.

**Where to find it.** **Settings → Phone & team hub**, panel **Team hub**. The chip shows **OFF**, **STARTING**, **LIVE · SHARING**, **PROBLEM** or **COMPANION NOT RUNNING**. (Pro)

### Option A: hosted by Grid Central (Team plan)

1. Join or create a team in **Settings → Account → Team** (drivers enter the owner's **join code** and press **Join team**).
2. Start the companion.
3. Press **Share with my team**, then **Copy team link** and send it to your team.

Every driver can share; the page follows whoever is driving, with a button per sharing driver. The link is the same for the whole team. The owner can replace it with **New team link** in Settings → Account → Team.

### Option B: your own free hosting

**1. The live database (Firebase)**

1. **console.firebase.google.com** → **Create a project** (free Spark plan, no card).
2. **Build → Realtime Database → Create database**, pick a location, start in **locked mode**.
3. Press **Copy rules** in Grid Central, paste them on Firebase's **Rules** tab, and press **Publish**.
4. Copy the address from Firebase's **Data** tab into **DATABASE ADDRESS**.

**2. The team page (GitHub Pages)**

1. Download **team.html** and **team.js** from the panel.
2. On **github.com**, create a public repository (like *grid-central-team*), **Add file → Upload files**, upload both.
3. **Settings → Pages** → **Deploy from a branch**, branch **main**, folder **/ (root)** → Save.
4. Paste the page address (like `https://your-name.github.io/grid-central-team/team.html`) into **TEAM PAGE ADDRESS**. If it's already filled in, that's a ready-made team page you can use.

**3. Go live:** type a team name, press **Start sharing** ("Sharing with your team now."), then **Copy team link**.

| Control | What it does | Default |
|---|---|---|
| **Share with my team** / **Stop sharing** | Hosted hub on or off. Only one hub shares at a time. | Off |
| **DATABASE ADDRESS** | Your Firebase address (starts with https://). | Empty |
| **TEAM PAGE ADDRESS** | Your team page. | Empty or ready-made |
| Team name | Shown on the team page. | Empty |
| **Start sharing** / **Stop sharing** | Your own hub on or off. | Off |
| **Copy team link** | Copies the link for your team. | – |
| **New link** | A new private link; the old one stops working. | – |

### What your team sees

- A chip: **LIVE**, **WAITING FOR THE CAR**, **NOT IN IRACING**, **NOT SENDING** (nothing for 15 seconds), **RECONNECTING**, **NO ACCESS** or **NO LINK**.
- A banner for the flag that's out, or **BOX THIS LAP** / **BOX NEXT LAP**.
- **Position**, **Lap**, **Last lap**, **Gap ahead**, **Gap behind** and **Fuel**.
- **Standings** (top 15 plus the driver), **Race strategy** (**To the finish**, **Stops left**, **Add at next stop**, **Pit window**) and the **Radio**.
- A message box: **Your name**, **Message to the driver** (up to 200 characters), **Send**.

**Tips:** anyone with the link can watch and send messages, so share it only with your team, and use **New link** if it gets out. The companion sends the car every 2 seconds and checks messages every 3, well inside Firebase's free limits. Messages are spoken by Grid Central, so keep it open on the driver's PC with calls read aloud. Back up teamhub.json when moving PCs.

| Message or problem | Fix |
|---|---|
| "Start the companion (the small GridCentral window) first…" | Start the companion. |
| "Fill in the database and team page addresses first (steps 1 and 2)." | Both are needed. |
| "The database said no. Check its rules…" | Paste the rules and press **Publish** in Firebase. |
| "There's no database at that address…" | Copy the address again from the Data tab. |
| "The team hub didn't accept the car…" | Sign in again under Settings → Account and check you're in the team. |
| Team page says **NO LINK** or **NO ACCESS** | Send the current link from **Copy team link** (old links stop after **New link**). |
| Stuck on **WAITING FOR THE CAR** | Press **Start sharing** and check the chip says LIVE · SHARING. |
| GitHub page shows 404 | Wait a minute, and check both files are in the root of **main**. |
| The driver doesn't hear messages | Keep Grid Central open with **Read calls aloud** on (Settings → Voice & radio). |
