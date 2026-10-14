# Talkback, voices, commentary and the phone companion

This chapter covers the features you hear and the ones you hold in your hand. **Talkback** lets you talk to your race engineer with a wheel button. **Voices** are the voices your spotter, engineer, coach and stream commentators use. **Commentary** puts two TV-style commentators on your stream. The **phone pit wall** turns your phone into a second screen and a crew radio.

Everything here runs on your own PC. Speech recognition, the commentary voices and the phone connection all stay on your computer and your home network. The internet is only needed once, to download the speech model and the natural voices.

All four features are part of **Grid Central Pro**. In free mode the Talkback, Commentary and Phone panels are covered with a PRO cover and their controls can't be used. Only the spotter keeps talking.

---

## Talkback (talk to your engineer)

### What it does

Hold your push-to-talk button, ask your engineer a question, and let go. You hear a short radio click when the button goes down and another when it comes back up. The companion turns what you said into text on your PC, and Grid Central answers from the live race data in the engineer's voice. Talkback can also change iRacing's pit menu ("set fuel 40 litres", "four tyres") and, if you allow it, your in-car settings ("bias forward one click", "TC up two").

Some details worth knowing:

- **The microphone is only listened to while you hold the button.** It keeps about a third of a second from just before you pressed, so your first word isn't cut off. It also keeps listening for a quarter of a second after you let go, so your last word isn't cut off either.
- **Nothing is sent anywhere.** Recognition happens on your PC with a small offline speech model.
- **It understands two readings of what you said.** One reading is open: it hears any word. The other only listens for the words Grid Central knows. That makes key words like "box" and the numbers more reliable. The names of the drivers in your session are added to the list of words it listens for, so "how's my pace against Hoffmann?" works.
- **Answers come from the right person.** Traffic questions ("am I clear?", "is pit lane clear?") are answered in the spotter's voice. Coaching questions ("where am I losing time?", "how was turn 5?", "what's my optimal lap?") come from the coach. Everything else comes from the engineer.
- **Talkback answers use the engineer's volume** (Settings → Voice & radio → Engineer → Volume).

### Where to find it

**Settings → Voice & radio** tab → the **Talkback** panel (eyebrow "TALK TO YOUR ENGINEER"). You can also turn it on in the setup wizard: **Step 3 · Talkback (optional)**, with **Turn on talkback** and **Set push-to-talk button**.

### Setting it up step by step

1. **Start the companion.** Talkback needs it, because the companion reads your wheel buttons and your microphone. If it isn't running, the status chip shows **COMPANION NOT RUNNING**.
2. Go to **Settings → Voice & radio** and scroll to the **Talkback** panel.
3. Switch on **Talkback**. The first time, the companion downloads the speech model for your language (about 40 MB), so you need to be online once. The chip shows **DOWNLOADING SPEECH MODEL** with a percentage, then **LOADING SPEECH MODEL**, then **READY**.
4. Press **Set button**. The button changes to **Press your button…**.
5. Within 10 seconds, press the wheel button, button-box button or keyboard key you want to talk with. Anything you were already holding is ignored, so just press the new one. A message confirms it, for example "Push to talk: Fanatec Wheel button 7." or "Push to talk: F5 key.", and the name appears under **Push-to-talk button**.
   - Use a **different button from iRacing's voice chat**, or your team will hear you talking to your engineer.
   - Mouse buttons and lock keys can't be used.
   - If you unplug the wheel and plug it back in, Windows may give it a new number. Grid Central finds it again by its name.
6. Choose your headset under **Microphone**. Leave it on **Windows default microphone** if your headset is already Windows' default.
7. Try it without the car. Type "how's the fuel?" in the box under the settings and press **Ask**. Then hold your button and say "radio check". The engineer should answer "Loud and clear." While you hold the button the chip shows **LISTENING…**, and what it's hearing appears in quotes under the box.
8. Optional: switch on **In-car changes by voice** and set your keys (see below).

### Every control and setting

| Setting (as shown) | What it does | Default |
|---|---|---|
| Status chip (top right) | **OFF**, **COMPANION NOT RUNNING**, **DOWNLOADING SPEECH MODEL n%**, **LOADING SPEECH MODEL**, **READY**, **LISTENING…** or **ERROR**. Green means ready to listen. | OFF |
| **Talkback** | Turns listening for your button on or off. The first time, it downloads the speech model (about 40 MB). | Off |
| **Push-to-talk button** / **Set button** | Shows your button ("Not set" until you choose one). Press **Set button**, then the button or key. | Not set |
| **Microphone** | The headset mic you race with. Lists the microphones Windows has. | Windows default microphone |
| **Pit commands by voice** | Lets talkback change iRacing's pit menu: "Set fuel 40 litres", "fill it up", "four tyres", "left side only", "rears up one psi", "wets", "fast repair", "no fuel". When it's off, the engineer says "Voice pit commands are switched off in Settings." | On |
| **Check pit changes first** | Your engineer reads the change back and waits for "yes" before setting it. **When it isn't sure what it heard** (a number or pit word it doubted, or its two readings heard different numbers), **Always**, or **Never**. | When it isn't sure what it heard |
| **In-car changes by voice** | "Bias forward one click", "TC up two", "ABS down", "map 3". Grid Central presses your own iRacing keys, and only while iRacing is the active window. | Off |
| **Keys for in-car changes** (fold-out) | A grid of **Down (−)** and **Up (+)** buttons for each setting: Brake bias, Traction control, ABS, Engine map, Fuel mix, Front bar, Rear bar, Engine braking. Press **Set**, then the key you use in iRacing, holding Shift, Ctrl or Alt if your binding uses them. **Esc** cancels and **Delete** clears it. For brake bias, up is forward. | All unset |
| Error line (red text) | Explains a problem, for example "Press Set button, then press the wheel button or key you want to talk with." or a microphone or download error. | — |
| **Type a question to try it** + **Ask** | Ask in writing, exactly as if you'd said it. Good for testing in the garage. | — |
| Talkback log | The last 8 exchanges: "You: …" and the engineer's answer. Hover over an answer to see which kind of question it was taken as. | Example questions |
| **Teach it your phrases** (fold-out) | Lists up to 12 recent things it didn't understand. Pick **What did you mean?** from the list, then press **Teach it**. **✕** forgets one. **Your phrases** lists what you've taught it (up to 40), each with a **✕** to remove it. | Empty |

### Everything you can say

Talkback looks for key words, so you don't have to use these exact sentences. "How's the fuel looking?", "fuel?" and "do we make it to the end?" all reach the fuel answer. When two kinds of question match, the stronger match wins. A number in your sentence (spoken as "forty two" or "42", or "two point five") is understood.

**The radio itself**

| Say something like | What happens |
|---|---|
| "Radio check", "Can you hear me?" | "Loud and clear." |
| "Repeat that", "Say again", "Pardon?" | Repeats the last answer. |
| "Thanks", "Copy", "Roger", "Cheers" | "Copy." |
| "Help", "What can I ask?" | A short list of what you can ask. |
| "Quiet", "Mute", "Less talk", "No coaching" | Switches off **Corner-by-corner coaching** and **Strategy callouts** in Settings. |
| "Resume", "Talk to me", "Calls on", "Unmute" | Switches them back on. |

**Pit stops and strategy**

| Say something like | What you get |
|---|---|
| "Box box", "Should I box now?", "Can I pit this lap?", "Undercut?", "I can't pass", "Dirty air" | Box or stay out, and why. If it says box, you also hear how much fuel to add and where you'd rejoin. |
| "When do I pit?", "Which lap do I stop?", "Pit window?" | When the window opens, or that it's open, the latest lap, and the fuel to add. |
| "Where do I come out if I box now?", "Where will I rejoin?" | About how much time you'd lose, the position you'd come out in, and the cars just ahead and behind ("Clean air", or "Tight on exit, watch your mirrors"). |
| "Is pit lane clear?", "Traffic in the pits?" | How many cars are on pit road (and their numbers, if three or fewer), a caution warning, and "Watch the speed limit." (Spotter's voice.) |
| "How much fuel do I need to add?" | The fuel for the next stop. |
| "How's the fuel?", "Do I make it to the end?" | Laps of fuel left, and whether you're short or have some spare. |
| "Fuel per lap?", "What's my fuel consumption?" | Fuel used per lap. |
| "Do I need to save?", "Lift and coast?" | How much to save per lap, and whether it saves a stop. |
| "Push", "Give me maximum power", "Flat out", "Go for it" | Whether you have the fuel to push, and for how long. |
| "What's the strategy?", "What's the plan?" | The fuel answer and the pit window answer together. |

Fuel is spoken in your units (litres or US gallons, from Settings → Appearance & data → Your data).

**Gaps, pace and position**

| Say something like | What you get |
|---|---|
| "Gap ahead?", "Who's in front?", "How far to the car ahead?" | The gap, and whether you're catching ("On him in about 4 laps", or "Not enough laps to catch him at this rate"). |
| "Gap behind?", "Who's in my mirrors?" | The gap behind, and whether he's closing. |
| "Where is car 12?", "Gap to car 44?" | That car's gap and position. |
| "How's my pace against car 44?" (or a driver's surname), "Am I faster?" | Your last lap against theirs, your best laps compared, and the gap trend. |
| "Who's leading?" | The leader and your gap to them. |
| "What position am I?" | Your position, and your class position in multi-class races. |
| "Why did we lose that position?", "What happened?" | Who got past and how: on track, an undercut, or while you were in the pits. |
| Follow-ups: "And behind?", "What about car 12?", "Is he catching me?" | The last gap or pace question again, about another car, for up to a minute and a half after the first question. "He" or "him" means the car the last answer was about. |

**Session**

| Say something like | What you get |
|---|---|
| "How many laps left?" | Laps to go (or, in a timed race, a hint to ask about time). |
| "How much time is left?" | Time remaining. |
| "Last lap?", "How was that?" | Your last lap time and how far off your best. |
| "Best lap?", "Personal best?" | Your best lap this session. |
| "Delta?" | Up or down on your best this lap. |
| "Incidents?" | Your incident count (and the team's in team races). |
| "Any flags?", "Caution?", "Safety car?" | The current flags, or "Green flag. Track's clear." |
| "Weather?", "Is it raining?", "Track temp?" | Track wetness, rain, any wets or slicks advice, and track and air temperatures. |
| "Stint?", "Who's next?", "Driver change?" | Your stint time, time left in the stint and the next driver (team races only). |
| "Am I clear?", "Anyone alongside?" | "Car left", "Car right", "Three wide", or "Clear all round." (Spotter's voice.) |

**Car health and handling**

| Say something like | What you get |
|---|---|
| "Tyres are done", "No grip", "Rears are falling off", "The tyres are graining" | Tyre age and wear, then advice: hang on until the window opens, box when you want, or look after them to the end. |
| "How are the tyres?" | Laps on them, the estimated life left and the sets left. |
| "Front left is opening up" (any corner) | That tyre's last reading and an estimate for now. (Tyre wear is only measured in the pits.) |
| "Is there damage?", "Any repairs?" | Required and optional repair time, which side took the hit, warning lights and fast repairs left. |
| "No power", "Engine temps?", "Is it overheating?" | Warning lights and water and oil temperatures. |
| "Brakes are soft", "The rears are locking", "Fronts locking" | Your brake bias and ABS, and what to try. Locking also asks the setup advisor. |
| "It's understeering", "It won't turn" | Tips for bias, front bar and TC, plus setup advisor changes. |
| "It's oversteering", "It's loose", "Snappy" | Tips for TC, bias and rear bar, plus setup advisor changes. |
| "It's bottoming out", "Unsettled over the kerbs", "No grip in fast corners", "Slow on the straights", "Tyre pressures are too high" | The setup advisor's tip and garage changes for this car. |
| "What's my brake bias?", "What are my settings?", "Which map am I on?" | Your in-car settings (bias, ABS, TC, map, fuel mix, bars, engine braking), whichever this car reports. |

**Setup**

| Say something like | What you get |
|---|---|
| "What setup am I on?" | The setup name, any unsaved changes, and your best lap with it here. |
| "Which setup is fastest?" | Your quickest setup here, how much slower the next one is, and the most consistent. |
| "What are my tyre pressures?" | Starting pressures from the setup. |
| "What's my wing?", "Downforce?" | Wing settings from the setup. |

**Coaching** (these work from your saved laps, even with iRacing closed)

| Say something like | What you get |
|---|---|
| "Where am I losing time?", "What should I work on?" | Your focus corner, and the corner that costs you most per lap. |
| "How was turn 5?" | That corner on your last lap against your best. "How was that corner?" gives the last corner result. |
| "What's my optimal lap?" | Your best sectors put together, and how far under your best that is. |

**Pit menu commands** (need **Pit commands by voice**)

| Say something like | What it sets |
|---|---|
| "Set fuel 40 litres", "Put in 10 gallons" | That much fuel. It uses gallons if you say so, or if your units are imperial and you didn't say litres. It warns you if that's short of what you need. |
| "Fill it up", "Full tank" | A full tank. |
| "No fuel", "Untick fuel" | Fuel off. |
| "Four tyres", "New tyres", "Fresh tyres" | Four new tyres. |
| "No tyres", "Keep these tyres" | Tyres off. |
| "Left side only", "New rears", "Fronts only", "Front left only" | Just those tyres. |
| "Rears up one psi", "Pressures down half a psi", "Drop two kPa all round" | Pressures for the new tyres, from what the pit menu has now. |
| "Put the wets on", "Slicks at the stop" | That compound, with four new tyres (if the car has it). |
| "Fast repair" / "No fast repair" | Fast repair on or off. If you have none left, it says so. |
| "Tear-off", "Clean the visor" | A windscreen tear-off. |
| "Clear the pit menu", "Nothing at the stop", "No service" | No fuel, no tyres and no repairs. |
| "Cancel that", "Undo", "Put it back", "Never mind" | Puts the pit menu back as it was before your last voice change, or takes back the last in-car change, whichever came last. Works for 3 minutes, and is never read back first. |

You can combine changes in one breath: "four tyres and fast repair". When a change is read back ("42 litres of fuel, is that right? Say yes to set it, or no."), answer within 20 seconds with a short "yes", "correct", "go ahead" or "do it", or with "no", "cancel" or "leave it". Only a short reply counts, so "right side tyres only" is taken as a new change, not as a "yes". A fuel amount you set by voice stays until your stop. Automatic pit fuel leaves it alone.

**In-car changes** (need **In-car changes by voice** and your keys)

| Say something like | What it does |
|---|---|
| "Bias forward one click", "Brake bias rearward two" | Presses your brake bias key that many times. |
| "TC up two", "Traction control down" | Traction control. |
| "ABS down", "ABS up one" | ABS. |
| "Map 3", "Set engine map to 2", "Map up" | Engine map, by direction or to a number. |
| "Fuel mix up", "Front bar down one", "Rear bar up", "Engine braking down" | The other settings. |

With no number it's one click. The most is ten clicks at a time ("That's more than ten clicks. Tell me in smaller steps."). Changes of **three clicks or more are always read back first**, whatever **Check pit changes first** is set to. Afterwards the engineer reads the car's new value ("Brake bias 54.5."). If nothing changed, it tells you to check the key matches iRacing. Asking for a value ("set TC to five") works out the clicks from what the car reports now. For brake bias, make one change by clicks first, so it learns how big one click is.

**Alerts you ask for** (they last until the session ends)

| Say something like | What happens |
|---|---|
| "Tell me when I'm within a second of the car ahead" | One call when the gap ahead drops under that. "Half a second", "five tenths" and "1.5 seconds" also work. |
| "Tell me when car 44 is within half a second" | The same, for a car by number or surname. |
| "Warn me if the car behind is within a second" | The same, for the car behind. |
| "Remind me to box on lap 20", "Remind me to box in 5 laps" | "Lap 20. Box this lap, as you asked." |
| "Remind me on lap 15 to check the brakes" | "Lap 15. Reminder: Check the brakes." |
| "Give me the gaps every lap" (or "gap ahead every lap", "gap behind every lap") | A gap call each time you cross the line. |
| "What alerts do I have?" | Lists them. |
| "Cancel my alerts", "Stop the gap calls", "Clear my reminders" | Clears all of them, or just that kind. |

**The crew** (needs a phone pit wall or the team hub connected)

| Say something like | What happens |
|---|---|
| "Tell the crew I'm boxing next lap", "Crew, the rears are gone" | Your words, as you said them, appear on the crew's radio. |
| "Yes" or "No" after the crew asks something ("Box this lap?", "Everything OK?") | Your answer goes to their radio. You have 45 seconds to answer. |

Everything you say and every answer also appears on the crew's radio.

**Questions that work without iRacing running:** radio check, repeat, thanks, help, quiet, resume, the coaching questions and the crew messages. Anything else, with iRacing closed, gets "I've no data from the car. Is iRacing running?"

### Talkback in Spanish or German

Set **Settings → Appearance & data → Language** to Español or Deutsch. The page reloads, and talkback listens for that language. It downloads that language's speech model (about 40 MB) the first time. Ask the same questions in your language, for example "¿cómo va el combustible?", "pon cuarenta y dos litros", "wie sieht der Sprit aus?" or "Bremsbalance einen Klick nach vorne". The engineer answers in your language. Driver names stay as they are.

### Teaching it your own phrases

1. Say your phrase on track (for example "chuck in forty"). If the engineer doesn't understand, it says "Say again? Ask me about fuel, gaps, pace, tyres or the pit window."
2. Open **Settings → Voice & radio → Talkback → Teach it your phrases**.
3. Find your phrase in the list, choose what you meant (for example **Set fuel (with the number you say)**), and press **Teach it**.
4. Next time it understands you, with any number you say. A pit change from a taught phrase is always read back first.

The things you can teach it are: How's my fuel?, When should I pit?, Gap to the car ahead?, Gap to the car behind?, Who's leading?, What position am I?, How many laps to go?, My last lap time?, How are my tyres?, Any damage?, What's the weather doing?, Where do I come out if I box now?, Where am I losing time?, Am I clear?, Box this lap, Set fuel (with the number you say), Fill it up, No fuel, Four new tyres, No tyres, Fast repair, Tear-off, Clear the pit menu, Cancel that, Say again, Quiet, no more calls, Talk to me again, Radio check.

### Tips

- Press the button, wait a beat, then speak. Talk at your normal radio volume. Don't let go until you've finished the last word.
- Short, clear questions work best: "gap behind?" beats "so how far back is that guy now".
- Use car numbers rather than names when names are unusual. "Car 44" is the most reliable.
- Set **Check pit changes first** to **Always** for important races, so nothing gets set without your "yes".
- iRacing only takes pit menu changes with you in the car.
- The talkback log shows exactly what it heard. If it keeps mishearing one word, teach it the phrase.

### If it doesn't work

| Problem | Fix |
|---|---|
| Chip says **COMPANION NOT RUNNING** | Start the companion (the small GridCentral window). |
| Chip stays **OFF** with the switch on | You're in free mode. Talkback is part of Pro. |
| **Set button** says "Start the companion first, it reads your wheel buttons." | Start the companion, then try again. |
| "No button pressed. Press Set button and try again." | You have 10 seconds after pressing **Set button**. Press a button you weren't already holding. |
| **ERROR**: "Couldn't download the speech model" | You need the internet the first time. Switch Talkback off and on again to retry. A half-finished download is thrown away and starts again. |
| **ERROR**: "Couldn't open the microphone" | Pick your headset under **Microphone** instead of the Windows default. Check Windows' microphone privacy setting allows desktop apps. It tries again every few seconds. |
| Chip shows **READY** but never **LISTENING…** when you press | Press **Set button** again. The button may have changed number, or you may have picked a key that iRacing grabs. |
| It hears you but misunderstands | Look at the log. Speak a little slower, use car numbers, or teach it the phrase. |
| "Voice pit commands are switched off in Settings." | Switch on **Pit commands by voice**. |
| "In-car changes by voice are switched off in Settings." | Switch on **In-car changes by voice**. |
| "Set your key for brake bias forward first…" | Open **Keys for in-car changes** and set that key. |
| "I can only press your keys while iRacing is the active window." | Click into iRacing so it has focus. |
| "That didn't change the brake bias. Check its key in Settings is the same as in iRacing." | The key in Grid Central doesn't match your iRacing binding (Options → Controls). |
| "Windows blocked the key press." | Windows refused the simulated key press. Try again with iRacing focused. If it keeps happening, check that iRacing and Grid Central are started the same way (both normally, or both as administrator). |
| "There's no crew connected. Open the phone pit wall or the team hub first." | Connect a phone or the team hub before using "tell the crew". |

---

## Voices: your spotter, engineer, coach and commentators

### What it does

Grid Central uses two kinds of voice.

1. **Your race team on the radio** (spotter, engineer and coach, including Talkback answers) speaks with the **voices installed in Windows**. Voices whose name includes "Natural" or "Neural" (Microsoft's natural online voices) are marked **★ natural** in the list and are put first. They sound the most like a real engineer. A natural voice in your language is picked for you if there is one.
2. **The stream commentary** can use Grid Central's own **Natural voices**. These come from an offline AI voice model made on your PC (see Commentary below). They are only used for the commentary, never for your race team.

### Where to find it

- **Settings → Voice & radio → Voice & radio** panel: **Voice** and **Speaking style** for everyone.
- The **Spotter**, **Engineer** and **Coach** panels each have their own **Voice** and **Volume**.
- The setup wizard, **Step 2 · Your engineer's voice**, has **◖ Test the voice**.
- The commentary voices are on **Broadcast → Commentary** (next section).

### Setting it up

1. Open **Settings → Voice & radio**.
2. Pick a **Voice**. Choose one marked **★ natural** if you have one.
3. Pick a **Speaking style**: **Calm** (a little slower), **Concise** (quickest) or **Enthusiastic**.
4. To tell who's talking, give the **Spotter**, **Engineer** or **Coach** a voice of its own. Choosing one plays a sample ("Car left. Clear.", "Box this lap…", "Brake a touch later into turn one.").
5. Set each role's **Volume** (10% to 100%).

| Setting (as shown) | What it does | Default |
|---|---|---|
| **Voice** (Voice & radio) | The main voice for spotter, engineer and coach. | System default, or the best ★ natural voice for your language |
| **Speaking style** | Calm, Concise or Enthusiastic: how quickly calls are read. | Calm |
| **Voice** (Spotter / Engineer / Coach) | That role's own voice. Separate voices are part of Pro. | Same as main voice |
| **Volume** (each role) | How loud that role is. The engineer's volume is also Talkback's. | 100% |

**Adding more Windows voices:** Windows Settings → Time & language → Speech → add voices. A Spanish or German Windows voice is needed for the race team to speak those languages naturally.

### How the natural commentary voices are made

- The voice model is **Kokoro**, run on your PC with ONNX Runtime. It uses only two processor cores, so the rest stay free for iRacing. It takes about half a gigabyte of memory while in use, and gives it back when you switch the commentary to Windows voices.
- **eSpeak NG** is a small separate program in the **espeak-ng** folder next to Grid Central. It works out how each word is pronounced before Kokoro speaks it. It's installed with Grid Central and you don't need to do anything with it.
- The model and voices (about 340 MB) download once, the first time the commentary is switched on with natural voices. They're saved in the companion's **models\kokoro** folder and checked to make sure they arrived whole.
- There are **28 English voices** (American and British) and **3 Spanish**. They're shown as name, accent and gender, for example "George (British, male)":
  - American female: Alloy, Aoede, Bella, Heart, Jessica, Kore, Nicole, Nova, River, Sarah, Sky
  - American male: Adam, Echo, Eric, Fenrir, Liam, Michael, Onyx, Puck, Santa
  - British female: Alice, Emma, Isabella, Lily
  - British male: Daniel, Fable, George, Lewis
  - Spanish: Dora (female), Alex (male), Santa (male)
- German has no natural voice yet. German commentary uses Windows' voices.

### Tips

- If calls sound robotic, install a natural voice in Windows and pick the **★ natural** one.
- Give the spotter a very different voice from the engineer (for example, male and female), so you know instantly whether a call is about traffic.

### If it doesn't work

| Problem | Fix |
|---|---|
| No voice at all, and a message says the browser blocked the spoken call | Click anywhere in Grid Central once. Browsers block speech until the page has been clicked. |
| Only the spotter talks | You're in free mode. The engineer and coach are part of Pro. Also check the role switches on the **Engineer** and **Coach** panels. |
| The voice speaks English after switching language | Add a voice in that language in Windows (Settings → Time & language → Speech), then pick it. |

---

## Commentary and the TV sound

### What it does

Two commentators call your race for your stream viewers, like TV. **You don't hear them while you drive.**

- The **lead** calls the action: the start, passes, battles, offs, cars stopped on track, pit stops, cautions and restarts, the white flag, laps to go, fastest laps and the finish.
- The **analyst** tells the story around it: places gained since the start, who's catching whom, pace and pit stops, an intro before the start and a wrap-up after the flag. In quiet spells the analyst fills in the story, and now and then the lead asks about the driver of the moment.
- They remember the race's story (a comeback after an off, a race that went wrong, two drivers fighting again). They say who drivers are (one of the highest rated in the class, or a rookie doing well), react to each other ("Lovely move."), and cut in when something big happens.
- In **league races** they remember past races, kept on your PC for each league: last time's winner, runs of wins and podiums, and old rivalries.
- Big moments at the front (the top three of a class) are called whichever car they follow.
- In practice and qualifying they call new top times.

The commentary is written by Grid Central, so **Grid Central must be open**. The companion turns each line into speech and sends it to your Grid Central overlay in OBS, or to a sound device you choose.

### Where to find it

The **Broadcast** page → the **Commentary** panel (eyebrow "ON YOUR STREAM ONLY"), with its own on/off switch at the top right.

### Setting it up with OBS step by step

1. Connect OBS first: **Settings → Connections → OBS Studio**. In OBS 28 or newer, go to Tools → WebSocket Server Settings → Enable, then enter the port and password in Grid Central and press **Connect OBS**.
2. Add your Grid Central overlay to OBS. The easiest way is **Broadcast → OBS control → Add Grid Central overlay to scene**, which sets the sound up for you. You can also use Race overlay → Add to OBS, or add a Browser source with the overlay's link. If you added the Browser source yourself, tick **Control audio via OBS** in its properties.
3. In OBS, open **Edit → Advanced Audio Properties** and check the overlay's **Audio Monitoring** is **Monitor Off**. Viewers hear it, you don't.
4. Keep the overlay source **visible** in your scene (it can be see-through). OBS mutes hidden sources.
5. In Grid Central, switch on the **Commentary** switch. With **Natural voices**, the voices download now (about 340 MB). The status line shows "Downloading the natural voices… n%".
6. Choose **Follow**, **Language**, the two voices and **How much they talk**. Use **Listen** to hear each voice on your PC.
7. Press **Test on stream** and watch the overlay's level move in OBS's Audio Mixer. The test is a welcome from the lead and a line from the analyst.
8. Optional: add the **Commentary captions** widget to your overlay for subtitles. It's in the overlay editor's Race control group, with options **Who's talking** and **Background**.

### Setting it up without OBS (Streamlabs, XSplit, Twitch Studio…)

1. Install a virtual audio cable, such as the free **VB-Audio Virtual Cable** (vb-audio.com/Cable). It adds a sound device nobody hears.
2. Set **Where viewers hear it** to **A sound device (Streamlabs, XSplit, Twitch Studio…)**. A **Sound device** row appears. Pick **CABLE Input**.
3. In your streaming app, add an audio source (microphone or input capture) from **CABLE Output**.
4. Press **Test on stream** and watch that source's level in your streaming app.

Don't pick your headset or speakers: you'd hear the commentary while you drive. If you pick your main output, Grid Central warns you.

### Every control and setting

| Setting (as shown) | What it does | Default |
|---|---|---|
| Commentary switch (top right) | Turns the commentary on or off. | Off |
| Status chip | **OFF**, **COMPANION NOT RUNNING**, **ON**, **ON · NO OBS OVERLAY** (nobody's listening yet), **ON · SOUND DEVICE**, or **ON · NO SOUND DEVICE**. | OFF |
| **Follow** | Whose race they call: **My car**; **iRacing's camera car (spectating, league broadcasts)**, which gives a word about each car the camera settles on; or **The whole field (the best action)**. | My car |
| **Language** | **Same as Grid Central**, English, Español or Deutsch. Natural voices speak English and Spanish. German needs a Windows voice in German. | Same as Grid Central |
| **Where viewers hear it** | **Through OBS (the Grid Central overlay)** or **A sound device**. | Through OBS |
| **Sound device** | Only shown for a sound device. Pick one you don't listen to. Your main output is marked "(your main output)". | Choose a sound device… |
| **Voices** | **Natural voices (English, Spanish)** or **Windows voices**. Each kind remembers its own voice choices. | Natural voices |
| **Lead commentator** + **Listen** | The lead's voice. **Listen** plays "Lights out, and away they go! This is how I'll sound on your stream." on your PC only, with the TV sound if it's on. | George (British, male); Spanish: Alex |
| **Analyst** + **Listen** | The analyst's voice. | Emma (British, female); Spanish: Dora |
| **How much they talk** | **Key moments**: only bigger calls, a long breath between them, no quiet-spell talk and no reactions. **Standard**: everything, with the analyst filling silences after about 45 seconds. **Non-stop**: short pauses, and silences filled after about 18 seconds. | Standard |
| **TV sound** | Makes the voices sound like a commentary booth on TV: low rumble taken out, more presence, gentle compression, and every line brought to the same loudness without clipping. | On |
| **Your name on the stream** | What they call you. Leave it empty for your iRacing name. Up to 40 characters. | Empty |
| **Say names like this** | One per line: the name as iRacing writes it, then = and how to say it, for example `Lindqvist = Lindkvist`. Works for any word. | Empty |
| **Test on stream** | Sends two test lines to the stream (not to you). | — |
| Last line said | Shows **LEAD** or **ANALYST** and the last line spoken. | Hidden |
| **Set up OBS (once)** / **Other streaming apps (a sound device)** | Fold-out step lists (above). | — |

Exciting lead calls are said a little faster and louder. The analyst's quiet-spell talk is a little calmer and softer. That happens whether TV sound is on or off.

### Tips

- For a league broadcast where you're spectating, set **Follow** to **iRacing's camera car**, so the commentary follows whatever your camera shows.
- Fill in **Say names like this** for the regulars in your league before race day. **Listen** only plays a fixed sample line, so check the names during a practice session.
- **Key moments** suits short sprint races. **Non-stop** suits long races with few cars nearby.
- While the natural voices download, Windows' default voice is used, so the stream isn't silent.

### If it doesn't work

| Problem | Fix |
|---|---|
| **ON · NO OBS OVERLAY**: "No Grid Central overlay is open in OBS, so nobody hears it yet." | Add the overlay as a Browser source and keep it visible in the current scene. |
| Viewers don't hear it | Tick **Control audio via OBS** on the Browser source, and check the overlay isn't muted in OBS's Audio Mixer. |
| You hear it while driving | Set the overlay's **Audio Monitoring** to **Monitor Off**. With a sound device, pick a virtual cable, not your headset. |
| "Start the companion first. It makes the speech." / "Start the companion to listen to the voices." | Start the companion. |
| "The natural voices are downloading. Listen again when they're ready." | Wait for the download to finish. |
| "Couldn't download the natural voices…" | Check your internet, then switch the commentary off and on again to retry. |
| "The natural voices can't start: eSpeak NG is missing from Grid Central's folder. Install Grid Central again." | Reinstall Grid Central. Antivirus may have removed the espeak-ng folder. |
| "There's no Spanish (or German) voice in Windows yet…" | Add one in Windows: Settings → Time & language → Speech. |
| "No Windows voices were found." | Add a voice in Windows Speech settings, or use Natural voices. |
| "The natural voices don't speak German yet, so German commentary uses your Windows voices." | That's expected. Add a German Windows voice. |
| No commentary during the race | Grid Central must be open on the PC, not just the companion. Commentary is part of Pro. |

---

## The phone pit wall (phone companion)

### What it does

Your phone becomes a second screen next to your wheel. It shows live race data, the race strategy, pit menu buttons, the radio, your lap history and remote control of OBS and the in-game overlay. It connects straight to the companion on your PC over your home Wi-Fi. Nothing goes over the internet. A phone needs the pairing code in the QR code to connect.

There are two kinds of link:

- **Crew** links get everything, including the pit menu, radio calls and messages, and remote control. For you and your crew chief.
- **View only** links show everything, but can't change the pit menu, send radio calls or messages, or use remote control. For friends and viewers.

**What needs what:** live data, the relative, standings, the map, the Car tab and the session summary only need the **companion** running. The race strategy, the radio, lap history and remote control also need **Grid Central open** on your PC.

### Where to find it

On the PC: **Settings → Phone & team hub** tab → the **Phone** panel (eyebrow "PIT WALL IN YOUR POCKET").

### Connecting a phone step by step

1. Start the companion on your PC.
2. Go to **Settings → Phone & team hub** and switch on **Let my phone connect**. If Windows asks, allow Grid Central on **private** networks.
3. The chip shows **ON · WAITING FOR A PHONE**, and a QR code appears. Choose **Crew** or **View only** above it.
4. Connect your phone to the **same Wi-Fi as the PC**, not mobile data or a guest network.
5. Open the phone's camera, scan the code, and open the link. The page opens with **GC. PIT WALL** at the top and connects. The code is then remembered on the phone and removed from the address bar.
6. To open it like an app: on iPhone, **Share → Add to Home Screen**. On Android, **⋮ → Add to Home screen**.
7. Tap the page once, so it's allowed to make sound, then go to **More → Test alerts**.

No camera? Press **Copy link** on the PC and send the link to your phone, or type it in. It looks like `http://192.168.1.20:8768/phone.html#k=…`.

### PC settings

| Setting (as shown) | What it does | Default |
|---|---|---|
| Status chip | **COMPANION NOT RUNNING**, **OFF**, **COULDN'T START**, **ON · WAITING FOR A PHONE**, or **ON · 1 CREW · 2 VIEW ONLY** (how many of each are connected). | OFF |
| **Let my phone connect** | Lets phones with the pairing code connect over your network. | Off |
| **Crew** / **View only** | Which link and QR code to show. | Crew |
| QR code and link | Scan it, or copy it. | — |
| **Copy link** | Copies the link shown. | — |
| **New pairing code** | Makes a new code for the link shown. Phones that used that link before must scan again. The other link keeps working. | — |

The phone page follows Grid Central's language and units (litres or gallons, °C or °F) and its accent colour.

### The phone screens

Six tabs run along the bottom: **Race**, **Car**, **Pit wall**, **Laps**, **Radio** and **More**. A chip at the top shows **CONNECTING**, **CONNECTED**, **WAITING FOR IRACING**, **LIVE** (or **LIVE · DEMO**), **OFFLINE** or **NOT PAIRED**. Under it are your car, track and session. A **full-width banner** shows flags (RED FLAG, BLACK FLAG, MEATBALL · PIT FOR REPAIRS, CHEQUERED FLAG, CAUTION, YELLOW FLAG, WHITE FLAG · LAST LAP, BLUE FLAG, DEBRIS), then **BOX THIS LAP** or **BOX NEXT LAP**.

**Race**

| Item | What it shows |
|---|---|
| POSITION | Your position, "of n" cars, or "P3 in class" in multi-class races. |
| LAP | Lap (out of the total in lap races), and time left or laps to go. |
| LAST / BEST / DELTA | Lap times. Delta is green when you're up and red when you're down. |
| FUEL | Fuel in the car, and laps of fuel (with Grid Central open). |
| GAP AHEAD / GAP BEHIND | Gaps in races, with the car number and name. |
| **Relative** | Three cars ahead and three behind on track, with the gap. Cars in the pits are marked. |
| **Standings** | P, #, DRIVER, GAP to the leader (BEST outside races), LAST, STOPS ("2 · 5 ago"). In multi-class races, buttons filter by class (**All** or a class), starting with yours. Stops are counted while Grid Central is running. |
| **Map** | A dot for every car in its class colour. Your car is the big dot labelled YOU, cars within two places show their number, and cars in the pits are faded. The track's shape appears after your first full lap. |
| INCIDENTS / TRACK / AIR | Incident count and temperatures. |

**Car**

| Item | What it shows |
|---|---|
| Warning bar | Water temperature high, Oil temperature high, Oil pressure low, Fuel pressure low, Engine stalled. |
| Car picture | Your car from above. Damaged areas are red (darker for heavy hits). This is Grid Central's estimate from the hits it felt, because iRacing only reports repair time. The tyres show tread left in %. |
| REPAIRS / OPTIONAL / FAST REPAIR | Required and optional repair seconds, and fast repairs left (∞ if unlimited). |
| WATER / OIL / OIL PRESSURE | Turn red with a warning light. |
| Tyres | Compound, LAPS ON THEM, LEFT NOW (an estimate), SETS LEFT, inside/middle/outside tread per corner from your last pit visit, and weather advice. |

A red dot on the **Car** tab means damage or a warning light.

**Pit wall** (strategy needs Grid Central open)

| Item | What it does |
|---|---|
| RACE STRATEGY | The advice from the Race strategy page, highlighted when urgent. |
| TO THE FINISH / STOPS LEFT / ADD AT NEXT STOP / PIT WINDOW | The key figures. |
| **Next stop** | When to box (for example "Window open · box within 3 laps"), ADD, STOP TIME, LATEST lap, and any driver change. |
| **If you box this lap** | The position you'd rejoin in, your position now, the time lost, and who'd be AHEAD and BEHIND. |
| **Stops to come** | Every remaining stop from the fuel in the car now: STOP, LAP, WINDOW, ADD, TYRES (New or Keep), TIME. |
| **Pit menu** | What's set now. **−5 / −1 / +1 / +5** set an amount (in litres), and **Set fuel** sends it. **Use strategy** fills in the strategy's figure. **No fuel**, **4 tyres**, **No tyres**, **Fast repair**, **No fast repair** and **Tear-off** do what they say. Crew only. |

A fuel amount set from the phone stays until your stop, like one set by voice. iRacing only takes pit menu changes with the driver in the car.

**Laps**

| Item | What it shows |
|---|---|
| **This session** → Session summary | FINISH (and start position, places gained), BEST LAP, LAPS (clean count), INCIDENTS, STOPS, FUEL USED. It's marked **Finished** after the chequered flag. **Save as image** saves a square picture to share. On iPhone, press and hold it to save to Photos. |
| BEST / LAST 5 AVG / CONSISTENCY | Your consistency over the last five clean laps (green under 0.3 s). |
| Lap times | The last 15 laps as bars of time lost to your best: Best, Within 0.5 s, Slower, Didn't count, Pit lap. |
| Gaps each lap | Lines for the car ahead and behind, with "Catching #16 by 0.30 s a lap (… about 6 laps to reach them)", "is closing by…" or "holding at…". |
| Every lap | The last 40 laps: LAP, TIME, +BEST, POS, AHEAD, BEHIND. |
| **History** | Choose **Car and track** (your current one comes first). You get Progress (sessions and a best/race-pace chart), Best laps, and Coaching: FOCUS CORNER ("2 of 3 clean laps to fix it"), Your last lap, Where you lose time most, Fixed, and your optimal lap. Needs Grid Central open. |

**Radio**

| Item | What it does |
|---|---|
| Radio log | Race calls, your talkback questions (DRIVER), the engineer's answers (ENGINEER) and crew messages (CREW), with times. A red dot on the tab means new messages. |
| **Message to the driver** + **Send** | Read out on the PC in the engineer's voice. End it with a question mark ("Box this lap?") and the driver can answer yes or no by talkback. The answer shows here. Crew only. |
| **Quick calls** | Box this lap, Box next lap, Push now, push, Save fuel, Gap is closing behind, defend, Hold position. Bring it home, Great lap, keep it up, Box this lap?, Everything OK? The last two are questions the driver can answer yes or no. Crew only. |

If Grid Central isn't open on the PC, sending says "Grid Central isn't open on your PC, so nobody heard that."

**More**

| Item | What it does | Default |
|---|---|---|
| **Remote control → OBS** | **Start/Stop recording**, **Start/Stop streaming** (asks to confirm before going live), and **Scene**. Needs OBS connected in Grid Central. Crew only. | — |
| **Remote control → In-game overlay** | Pick a **Design**, then **Show on screen** or **Hide from screen**. Crew only. | — |
| **Car alongside** | A short buzz for a car next to you (two for the right, three for both sides). | On |
| **Flags** | Yellow, blue, black, meatball, red, white and chequered. | On |
| **Box and fuel** | Box next lap, box this lap, and fuel for less than two laps. | On |
| **Damage and warning lights** | New damage, water or oil temperature, oil pressure and stalls. | On |
| **Radio messages** | A short beep for each new radio message. | On |
| **Vibrate** | Android phones. | On |
| **Sound** | A beep from the phone's speaker. | On |
| **Test alerts** | Plays car left, car right, flag, box this lap and damage in turn. | — |
| **This phone** (Crew or View only) → **Keep the screen on** | Stops the phone sleeping while the page is open. It shows **Screen stays on** when it's working. | Off |
| **Forget this PC** | Removes the pairing code from this phone. Scan again to reconnect. | — |

The alert switches are saved on each phone.

### Tips

- Mount the phone where you can glance at it, turn on **Keep the screen on**, and leave it on the **Race** or **Pit wall** tab.
- Give your crew chief the **Crew** link and your stream viewers the **View only** link.
- If someone shouldn't have your link any more, press **New pairing code** for that link.
- iPhones can't vibrate from a web page, so they only beep. Turn the ringer volume up.

### If it doesn't work

| Problem | Fix |
|---|---|
| Phone says **OFFLINE**: "Can't reach your PC…" | Check the companion is running, **Let my phone connect** is on, and the phone is on the same Wi-Fi (not mobile data or a guest network). |
| Nothing loads at all | In Windows Settings → Network & internet, set your network to **Private**. Windows blocks phones on public networks. Allow Grid Central through the firewall on private networks. |
| **NOT PAIRED**: "This phone's pairing code is out of date…" | Someone pressed **New pairing code**. Scan the QR code again. |
| "Phone access was turned off on your PC." | Switch **Let my phone connect** back on. |
| PC chip says **COULDN'T START** | Another program may be using the ports (8768 and 8769). Close it, or restart the PC, then switch phone access off and on. |
| "This PC doesn't seem to be on a home network…" | Connect the PC to your router (Wi-Fi or cable), then switch phone access off and on. |
| Worked yesterday, not today | Your PC's address may have changed (after a router restart, for example). Scan the QR code again. |
| No QR code ("the companion is missing the segno package") | Type or copy the link instead. |
| Strategy says "Open Grid Central on your PC to see the race strategy here." | Open Grid Central on the PC, not just the companion. |
| Pit buttons are missing | It's a **View only** link. Use the **Crew** link. |
| Pit buttons do nothing ("iRacing didn't take that.") | You have to be in the car. |
| No beeps | Tap the page once first, and check **Sound** is on. |
| "This browser can't keep the screen on…" | Set your phone's auto-lock to a longer time instead. |
