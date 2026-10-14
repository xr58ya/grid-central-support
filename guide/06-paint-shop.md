# Paint shop and spray booth

The **Paint** page (heading "Paint shop.", subtitle "Paint your car, helmet and suit, add numbers and logos, then drop them straight into iRacing.") is a livery painter built into Grid Central. You paint on iRacing's own template for your car, so everything lines up on the real car. One click puts the finished paint into iRacing. The **Spray Booth** shows your car in 3D while you work, and you can paint straight onto the 3D car.

**Rookie and Driver.** Painting the car, Download TGA and Install to iRacing are on every plan, including Rookie, the free plan. **Helmet**, **Suit**, **Live in iRacing**, the **Spray Booth**, the **Finish** panel, the **Cut** tool, **Symmetry** (**⇋ Mirror**), the **CAR NUMBER** and **VERSIONS** panels in Setup, and the colour dots on template layers are part of Driver. On Rookie, those buttons have a **DRIVER** tag and those panels a **DRIVER** cover (the colour dots have no tag), and clicking one explains it's part of Driver. If your plan drops back to Rookie, Live in iRacing switches off, the paint shop goes back to the car, the Cut tool switches back to **Move**, and Symmetry pauses. Nothing you made is lost. During the beta everything is unlocked.

**The companion.** Most of the "it just works" parts need the Grid Central companion running on your PC: finding your car and template by themselves, one-click install, Live in iRacing, Versions, and checking that the paint is still there. Without it you can still paint, then download the file or pick the paint folder yourself.

---

## Your first livery in 10 steps

1. **Start the companion** and open the **Paint** page. Look at the four boxes above the canvas: **CAR**, **TEMPLATE**, **IRACING ID** and **ONE-CLICK INSTALL**. Any box that needs something done is marked. Click it and it takes you to the fix.
2. **Choose your car.** Go to the **Setup** tab, then **CAR**. If you're sitting in a car in iRacing, it's picked for you, and the paint shop tells you "Paint shop: picked the …, the car you're in."
3. **Add your iRacing customer ID** in Setup, under **IRACING CUSTOMER ID**. It's on your iRacing account page. If the companion is running and you join any session, it fills itself in.
4. **Get the template in iRacing:** Paint Shop → Paint Your Car → Download Template (or My Content → Car Manager → Download Template).
5. **Load it.** With the companion running, the **Load the template for …** card on the canvas looks for it by itself and shows **Found it** with **Use it**. Otherwise press **Find it for me**, **Load a file…**, or drag the file onto the canvas.
6. **Pick a base look.** If your template has iRacing's patterns, the **PATTERNS** panel shows each one on your car: click one, then set **COLOUR 1**, **COLOUR 2** and **COLOUR 3**.
7. **Add your number and name.** Press **# Add number** or **T Add text** (or the **Number** and **Text** tools). Type in the **TEXT** box and set the font, colours and size. Drag the item onto a door. Near one of the template's number or sponsor blocks, it snaps in and sizes itself to fit.
8. **Add a sponsor logo** with the **Logo** tool (PNG, JPG, WebP, SVG or TGA).
9. **Check it in 3D** (Driver): press **Spray Booth**, turn the car around and look for anything out of place. Press **Leave** when you're done.
10. **Press Install to iRacing.** Look over the **BEFORE YOU INSTALL** list, then press **Install anyway** or **Fix first**. With the companion running, the card says "Installed. It's on your car now." If iRacing isn't running, it shows the next time you drive.

---

## The Paint page at a glance

| Area | Where | What's there |
|---|---|---|
| Header buttons | Top right | **Car / Helmet / Suit** switch, **Live in iRacing** tick box, **Spray Booth**, **Download TGA ↓**, **Install to iRacing** |
| Ready boxes | Under the header | CAR, TEMPLATE, IRACING ID, ONE-CLICK INSTALL, plus a summary ("1 thing to do before installing" or "Ready to install") |
| Toolbar | Above the canvas | Tools, tool options, More tools, Mirror, Undo, Redo, Before, zoom |
| Canvas | Middle | The 2048 × 2048 paint sheet with its guides |
| Status bar | Under the canvas | A hint for the current tool, the Live status, and where the file goes (for example "Car name · paint\carfolder\car_123456.tga") |
| Sidebar | Right | **Design** tab (Properties, Finish, Patterns, Layers) and **Setup** tab (Car & driver, Car number, Versions, Template, Base & pattern, Start a new livery). A dot on Setup means your iRacing ID is missing. |

---

## The ready boxes

**What it does.** These four boxes show what's ready for installing. Each one is clickable and takes you to its fix. Install and Download also check the car and the ID, and flash the box that's missing.

| Box | Shows | When clicked |
|---|---|---|
| **CAR** | The car's name, "Every car" (helmet or suit for all cars), "Use the …" (you're in a car) or "Choose your car" | Picks the car you're driving, or opens Setup → CAR |
| **TEMPLATE** | "iRacing's PSD", "Loaded", "Not used" (you chose to paint without one) or "Load it" | Searches for the template, or opens Setup once one is loaded. "Not used" goes back to asking for one. |
| **IRACING ID** | Your ID, or "Add your ID" | Opens Setup with the ID box ready to type in |
| **ONE-CLICK INSTALL** | "On" or "Start the companion" | Starts the companion |

The summary counts the **car**, the **template** and the **ID**, so a missing template shows as a thing to do. If you chose **Paint without a template**, the box shows "Not used" and isn't counted. Install and Download only need the car and the ID, and the companion is recommended, not required.

---

## Setup: car and driver

**Where:** the **Setup** tab → **CAR & DRIVER** ("Where it goes.").

**Step by step**
1. Pick your car in **CAR**. The companion lists the cars from your iRacing paint and setups folders.
2. Car not listed? Press **Car not listed? Choose its folder…** and pick the car's own folder inside Documents\iRacing\paint. Or choose **Other car…** and type the folder name in **IRACING PAINT FOLDER NAME**.
3. Type your **IRACING CUSTOMER ID** (numbers only).

| Control | What it does | Default |
|---|---|---|
| **CAR** | The car this paint is for. It names the iRacing folder the paint goes into. | Empty ("Choose your car…"). It's picked for you when you get in a car in iRacing. |
| **Car not listed? Choose its folder…** | Pick the car's folder in Documents\iRacing\paint. Picking "paint", "iRacing", "Documents", "setups" or "telemetry" is refused. | Only shown in browsers that can open folders |
| **IRACING PAINT FOLDER NAME** | Shown for **Other car…**: type iRacing's folder name for the car | Empty |
| **IRACING CUSTOMER ID** | Names the file (car_ID.tga) so iRacing puts it on your car | Empty. Filled in from a live session. |
| **USE IT WITH** (helmet and suit only) | **Every car (Documents\iRacing\paint)** or **Only the car above** | Every car |
| **Change iRacing paint folder** | Forgets the paint folder you picked for installing without the companion | — |

**Each car keeps its own design.** Choosing a different car puts the current design away, with its template and finishes, and brings out that car's design (or a fresh one). If you only had a template loaded and nothing painted yet, the template comes along with the car instead.

Three helper lines can appear here:
- "You're driving the …" with **Paint this car**: you're in a different car in iRacing.
- "Painted the wrong car? Your … design can come to the …" with **Bring it here**: this moves the design over. The other car starts fresh next time.
- "This template looks like the …, not the …" with **Switch car**: the template's file name matches another of your cars.

---

## Getting the template

The template is iRacing's picture of your car laid flat. Paint on it and everything lines up on the car.

**Where:** the **START HERE** card on an empty canvas, and Setup → **TEMPLATE** ("The picture you paint on.").

**Getting it from iRacing**
- Car: Paint Shop → Paint Your Car → Download Template (or My Content → Car Manager → Download Template).
- Helmet: Paint Shop → Design Your Helmet → Model Options → Download Template.
- Suit: Paint Shop → Design Your Suit → Model Options → Download Template.

**Which file type?** Load **iRacing's PSD** if you can. You get its real layers: the base, the patterns, the panel outlines (wire), the car's shape (mask), the number and sponsor blocks, and its spec map. A flat **PNG, JPG or TGA** opens as one picture layer that you paint on directly, like in GIMP or Photoshop.

### The start card

| Control | What it does |
|---|---|
| **Found it** … **Use it** | With the companion running, the card searches once per car by itself and shows the newest match. **Use it** loads it. |
| **Find it for me** | Searches Downloads, Documents\iRacing and the Desktop, inside zip files too |
| **Load a file…** | Opens a .psd, .tga, .png, .jpg or .webp file |
| **How to get it** | Shows the iRacing steps for the car, helmet or suit |
| **Paint without a template** | Hides the card. You then paint with a base colour and pattern (see below). The TEMPLATE box shows "Not used". |

### Setup → Template

| Control | What it does | Default |
|---|---|---|
| **Load template** | Opens a template file. You can also drop one anywhere on the canvas. | — |
| **Remove** | Removes the template (it asks first). Your edits to the car layers are cleared. | — |
| **How to get the template** | The iRacing steps | Closed |
| **Find downloaded template** | Lists every template found (name, where, date, size). Click one to load it. | — |
| **MY TEMPLATES FOLDER → Choose folder… / Change folder… / Forget** | Point it at one folder holding all of iRacing's templates (unzipped is fine). The right one then loads by itself whenever you choose a car. It says how many car templates it found. | Not set |
| **Split the picture into colour layers instead (the old way)** | Flat pictures only. The picture is split into colour layers rather than painted as pixels. | Off |
| **COLOUR LAYERS TO DETECT** | With the old way on: how many colour layers to look for (2–10). Changing it resets your car layer edits (it asks first). | 5 |
| **Show the car's shape (mask)** | Shows iRacing's Mask guide on top, marking what isn't paintable. It isn't part of the paint. | On (only shown if the template has a mask) |
| **Show guides** + slider | Shows the template's guide layers (wire, number blocks and so on) and how strongly | On, 60% |

### Base & pattern (no template)

Shown only when there's no template ("Without a template.").

| Control | Choices | Default |
|---|---|---|
| **BASE** | Colour | Near-black |
| **PATTERN** | Solid, Twin stripes, Split, Fade, Chevrons | Solid |
| **PRIMARY**, **ACCENT** | Colours (greyed out on Solid) | Lime, white |
| **PATTERN ANGLE** | 0–180° | 0° |

**If it doesn't work**
- *"Choose your car first, so Grid Central knows which template to look for."*: pick the car before searching.
- *"Start the companion (Settings → Connections → iRacing) to search for templates."*: searching needs the companion. Use Load a file instead.
- *"No template found for the …"*: download it in iRacing first, then search again. Templates saved somewhere unusual won't be found, so use Load a file.
- *"This template looks like the …, not the …"*: you loaded another car's template. Use **Switch car**, or load the right template.
- Templates folder says *"No iRacing template folders (like 67_template_MX16) in it"*: choose the folder that holds the template folders themselves.
- *"The template couldn't be saved for next time, but you can keep painting."*: the browser storage is full or blocked. Keep a copy of the template file to hand.

---

## Moving around the sheet

| Control | What it does | Shortcut |
|---|---|---|
| **Move** (➤) | Click to select, drag to move. Corners resize, the side bars stretch, the top handle rotates. | V |
| **Pan** (✥) | Drag to move around the sheet | H, or hold Space with any tool, or drag with the middle button |
| **−** / **+** | Zoom out or in by a quarter | − and + (or =) |
| **100%** | Fit to view | 0 |
| Mouse wheel | Ctrl + scroll zooms at the pointer. Scrolling without Ctrl pans when you're zoomed in. | — |

**Tips for Move**
- A dragged item snaps to the middle of the sheet, and into number and sponsor blocks. Hold **Alt** to move it freely.
- Hold **Shift** while rotating for 15° steps. Hold Shift while dragging a shape's corner to keep its proportions.
- The arrow keys nudge the selected item 4 pixels at a time, or 32 with **Shift**.
- **[** sends it back one place in the layer list and **]** brings it forward. **Ctrl+D** duplicates it. **Delete** or **Backspace** deletes it.
- **Esc** cancels what you're doing. A second Esc drops the selection, then you're back on Move.

---

## Shapes: Rect, Ellipse, Line and Stroke

**What they do.** They add shapes you can move, resize and recolour later, like stickers.

**Step by step**
1. Pick **Rect** (R), **Ellipse** (E), **Line** (L) or **Stroke** (B, under More tools). You can also use **+ Add** in Layers ("Drag on the car to draw it."), or **▭ Draw shape**.
2. Drag on the sheet. Hold **Shift** for a square or circle, or to snap the line's angle (15° steps).
3. A click without dragging drops a standard-size shape there.
4. Rect, Ellipse and Line go back to Move once drawn. Stroke stays on, so press **V** when you're done.

While a drawing tool is picked and nothing is selected, the Properties panel shows **NEW SHAPE STYLE** ("These settings apply to the next shape you draw."). Editing a shape also updates that style, so the next one matches it.

| Shape | Starts as |
|---|---|
| Rectangle | Lime fill, no stroke, square corners. A click without dragging makes 500 × 300. |
| Ellipse | White fill, no stroke. A click without dragging makes 500 × 500. |
| Line or stripe | White, 60 px wide. A click without dragging makes it 600 long. |
| Stroke (freehand) | Lime, 24 px wide |

---

## Text and numbers

**Where:** the **Text** (T) and **Number** (N) tools, **# Add number** / **T Add text** in the empty Properties panel, or **+ Add**.

**Step by step**
1. Pick **Text** or **Number** and click where it goes. The quick buttons put it in the middle of your view instead.
2. A new text reads "GRID CENTRAL", in white Space Grotesk with a thin dark outline. A new number reads "27", in lime Arial Black with a thick outline.
3. Type in **TEXT** (up to 40 characters). A text that is only digits counts as a number for the install checks.
4. Set **DIRECTION** to **⇣ Vertical** to stack letters top to bottom.

---

## Logos

**Where:** the **Logo** (▣) tool, or **+ Add → ▣ Logo**.

1. Click **Logo** and pick a PNG, JPG, WebP, SVG or TGA file.
2. It lands in the middle of your view at size 600. In the Spray Booth you click the car where it goes instead.
3. Use transparent PNGs or SVGs for clean edges. Logos are saved with the design.

---

## The Properties panel

**Where:** the **Design** tab, at the top. It shows **PROPERTIES – Nothing selected** with quick buttons and a shortcut list until you select something. The heading reads **SELECTED** (or **SELECTED · LOCKED**). Only the fields that suit the item show up.

| Field | For | What it does | Range or default |
|---|---|---|---|
| **TEXT** | Text, numbers | The words | Up to 40 characters |
| **FONT** | Text | Space Grotesk, DM Sans, Arial Black, Impact, Segoe UI, Trebuchet MS, Georgia, Courier New | Space Grotesk (text), Arial Black (number) |
| **FILL** | Text | Letter colour | White (text), lime (number) |
| **OUTLINE** / **OUTLINE WIDTH** | Text | Outline colour and thickness | 0–40 px; 8 (text), 18 (number) |
| **FILL** tick + colour | Rect, ellipse | Fill on or off, and its colour | On |
| **CORNER RADIUS** | Rect | Rounded corners | 0–400 px, 0 |
| **STROKE** / **STROKE WIDTH** | Shapes | Edge colour and width (the width of a line) | 0–160 px |
| **GRADIENT** | Everything except logos | None, Linear, Radial | None |
| **END COLOUR** | With a gradient | The colour the gradient fades to | White |
| **GRADIENT ANGLE** | Linear gradient | Its direction | 0–360°, 0 |
| **DIRECTION** | Text | **A B C Horizontal** or **⇣ Vertical** | Horizontal |
| **SIZE** | Text, logos | Overall size | 20–2048 px |
| **STRETCH ↔** / **STRETCH ↕** | Text, logos | Squash or stretch one way. The side handles do the same. | 10–500%, 100% |
| **WIDTH** / **HEIGHT** | Rect, ellipse, stroke | Exact size | 2–4096 |
| **LENGTH** | Line | Length | 10–2900 px |
| **ROTATION** | All | Turn it | −180° to 180°, 0 |
| **OPACITY** | All | See-through | 5–100%, 100% |
| **POSITION X** / **POSITION Y** | All | Exact place on the sheet | −2048 to 4096 |
| **↔ Centre** / **↕ Centre** | All | Centre it across or up and down the sheet | — |
| **⇋ Flip** / **⇵ Flip** | Logos, shapes | Mirror it across or up and down | — |
| **↺ Stretch** | Text, logos | Undo any stretching | — |
| **Duplicate** / **Forward** / **Back** / **Delete** | All | Copy it (offset a little), move it one place up or down the layer list, remove it | Ctrl+D, ], [, Delete |

A locked item shows "Locked: unlock it in Layers (🔒︎) to change it. Duplicate makes an unlocked copy."

Under the properties, **ONLY ON** says where the selected layer shows (see *Panels*).

### The colour palette ▾

Every colour box in the paint shop has a small **▾** on its corner. Click it for colours to pick from:

- **Easy to read here** (number and text colours only): colours that stand out on the paint underneath, black or white first.
- **Recent**: up to eight colours you've picked lately.
- **On the car**: the main colours on the paint right now.
- **Goes with this colour**: its opposite, its neighbours, and a lighter and darker shade.

---

## Car number and number blocks

**Where:** Setup → **CAR NUMBER** ("Where iRacing puts your number."). Shown for the car only. The **CAR NUMBER** panel is part of Driver.

**How it works.** **iRacing shows my number** is the same switch as in iRacing's Paint Shop. When it's on, iRacing paints your number into the template's number areas itself. So Grid Central keeps your text and logos out of those areas, and only shows your number as a preview on the sheet and the 3D car. When it's off, the areas are yours, for a number of your own.

| Control | What it does | Default |
|---|---|---|
| **iRacing shows my number** | See above. Match it to iRacing's Paint Shop. | On |
| **NUMBER AREAS** | **As painted** (what's painted there stays for the number to sit on) or **A number panel colour** | As painted |
| **PANEL COLOUR** | The panel's colour when one is chosen | White |
| **YOUR NUMBER** | Up to 3 digits, for the preview only | Your number in the current session, or 00 |
| **NUMBER** / **OUTLINE** | Preview colours. Set them as in iRacing. | White / near-black |

"This template doesn't mark iRacing's number areas (no Number Blocks layer), so nothing can be kept out of them." means the template has no number blocks.

**Snapping into blocks.** With iRacing's PSD templates, a number, text or logo put down inside a number or sponsor block is centred and sized to fit ("Fitted into the … block. Drag it out to place it freely (hold Alt to stop it snapping)."). If you drop something into a number block while iRacing shows your number, it stays where you put it and you get a reminder, because nothing of yours shows there.

---

## Template layers: recolouring the car

**What it does.** With a PSD, every template layer (base, cockpit, pit box colours, logos printed in the template) can be recoloured.

**Where:** click the car with **Move**, or click a layer in **Layers**. The panel reads **CAR PAINT LAYER** (or HELMET or SUIT).

**Quick way** (Driver): the round colour dots before a template layer's name in Layers. Click one and pick a colour. A layer made of a few flat colours, like the pit box, gets one dot per colour, and each changes exactly the way iRacing reads them.

| Control | What it does | Default |
|---|---|---|
| **PAINT** | **Pattern colours** (pattern layers only), **Original**, **Solid colour**, **Gradient**, **Pattern** | Original (Pattern colours for pattern layers) |
| **COLOUR** | The colour for Solid, Gradient or Pattern | The layer's own average colour |
| **PATTERN COLOURS** + **⇆** | Three colours for iRacing's pattern areas. ⇆ swaps two neighbouring colours. | Blue, white, black |
| **GRADIENT** / **END COLOUR** | Linear or Radial, and the end colour | Linear, white |
| **PATTERN** / **PRIMARY** / **ACCENT** | Twin stripes, Split, Fade, Chevrons, and their colours | Twin stripes |
| **ANGLE** | Gradient or pattern direction | 0–360°, 0 |
| **OPACITY** | How strongly the layer shows | 0–100% |
| **Keep original shading and shine** | Keeps the template's shading under the new colour | On |
| **Guide only (not included in the paint)** | Shows the layer while you paint, but leaves it out of the file | Off |
| **Split into panels** | Splits the layer into one layer per separate piece ("This layer is already a single panel." if it can't) | — |
| **Reset layer** | Back to the template's own look | — |

If the car's 3D model is loaded (Spray Booth), gradients run front to back or top to bottom over the whole car, and stripes run along the car, instead of across the flat sheet.

---

## Patterns

**Where:** the **PATTERNS** panel on the Design tab ("iRacing's patterns, in your colours."). In the Spray Booth it's the strip under the car. It shows only when the template has pattern layers (car_pattern, helmet_pattern, suit_pattern).

1. Each tile (**None**, **Pattern 1**, **Pattern 2**…) is a picture of your car in your three colours.
2. Click a tile to use that pattern. Only one pattern is used at a time, as in iRacing.
3. Set **COLOUR 1**, **COLOUR 2** and **COLOUR 3**. They apply to every pattern, so you can switch patterns and keep your colours.

The tiles show the 3D car once its model has been loaded in the Spray Booth. Until then you see "Load this car's 3D model in the Spray Booth to see the patterns on the car." On Rookie the note doesn't show, because the Spray Booth is part of Driver. and flat pictures of the sheet.

---

## Picture tools: Paint, Erase, Fill and Pick

**What they do.** They change pixels, like an ordinary paint program.

**Where they paint.** With a PSD, Paint and Fill go onto the template's **base layer** (Base, Base Paint or similar), under the patterns, logos and numbers ("Painting on "…", the template's base layer. For a layer of its own, use + Add → Paint layer."). A paint layer you've picked in Layers gets the paint instead. With a flat picture, you paint on the picture itself.

| Tool | Key | What it does |
|---|---|---|
| **Paint** (✐) | P | Brush strokes, kept inside the selection if there is one |
| **Erase** (⌫) | X | On the template picture, brings the original back. On an added layer, clears it. |
| **Fill** (◧) | G | Fills the joined area of similar colour you click |
| **Pick** (⊙, More tools) | I | Takes the colour under the pointer as the paint colour ("Paint colour #……") |

**Tool options** (shown next to the tools):

| Option | For | Range | Default |
|---|---|---|---|
| Colour box | Paint, Fill, Pick | Any colour | Lime |
| **SIZE** | Paint, Erase | 2–400 px. **,** makes it smaller and **.** bigger. | 40 px |
| **OPACITY** | Paint, Erase, Fill | 5–100% | 100% |
| **TOLERANCE** | Fill, Area | 1–100 ("How different a colour can be and still be picked") | 25 |
| **▣ In panel** | Paint, Erase, Fill | Stops at the outline of the panel you start on | On |
| **✂︎ Cut panels** | Paint, Erase, Fill | Switches to the Cut tool (Driver) | — |

**In panel** and **Cut panels** show only with a template that has panel outlines (iRacing's PSD).

---

## Selections and colour changes

**Where:** **Select** (M), **Lasso** (F), **Area** (W) and **Colour** (C). These are under **More tools**.

| Tool | How |
|---|---|
| **Select** (⬚) | Drag a rectangle. A click without dragging clears the selection. |
| **Lasso** (∿) | Draw around the part |
| **Area** (✦) | Click: selects the joined area of similar colour (uses TOLERANCE) |
| **Colour** (◉) | Click: selects exactly that colour everywhere on the car |

Hold **Shift** to add to the selection and **Alt** to take away. **Ctrl+A** selects all, **Ctrl+Shift+A** deselects and **Ctrl+Shift+I** inverts. **Delete** clears the pixels inside the selection.

When a picture tool is active, the panel shows **PICTURE LAYER** (or **PAINTING ON THE BASE LAYER**). It says "No selection: changes apply to the whole layer." or "Changes apply inside the selection."

| Control | What it does | Default |
|---|---|---|
| **Select all** / **Deselect** / **Invert** | Selection shortcuts | — |
| **REPLACE THE COLOUR WITH** + **Replace colour** | Turns everything selected into the new colour | Lime |
| **Keep original shading and shine** | Keeps the shading when replacing | On |
| **HUE** | Shifts the colours, shown live | −180° to 180°, 0° |
| **SATURATION** / **BRIGHTNESS** | Shown live | −100 to 100, 0 |
| **Apply colour change** | Keeps the Hue, Saturation and Brightness change | — |
| **Reset sliders** | Back to 0 without changing anything | — |
| **Fill with paint colour** | Fills the selection (or the layer) with the brush colour | — |
| **Clear** | Clears the layer, or on the base picture brings the original back | — |
| **LAYER OPACITY** | The whole picture layer's opacity | 100% |

**Old way only:** with "Split the picture into colour layers instead" on, **Area** lifts the clicked area into a layer of its own ("Picked "…" (…% of the sheet). Shift-click adds more · Ctrl+Z undoes.").

---

## Panels: In panel, Only on and Cut

The panels come from the outlines in iRacing's PSD template: the mask and the wire's outlines.

**Only on.** Select any layer and look at **ONLY ON** under its properties.
1. Press **Pick panels**. The button changes to **Done**.
2. Click the panels it should show on, on the sheet or on the 3D car. Click a panel again to take it off. Esc stops picking.
3. **Whole car** goes back to everywhere. The layer list shows **ONLY ON 2** and so on.

**Cut** (K, More tools; Driver). Templates often leave a door and the front guard as one panel.
1. Pick **Cut**. The wire's lines show at full strength.
2. Click along the gap from outline to outline, or around a door and back to your first click. The cut follows the template's lines.
3. **Double-click** or **Enter** finishes the cut. **Esc** drops it. **Backspace** takes back the last click.
4. "Cut made: the panels on each side of it are separate now." means it worked. "That cut doesn't divide a panel yet" means it has to reach outline to outline.
5. **Clear cuts** removes every cut. Undo takes back one.

**If it doesn't work:** "Only on needs the panel outlines in iRacing's PSD template." / "Cutting panels needs the panel outlines in iRacing's PSD template." Load the PSD rather than a flat picture.

---

## Symmetry (⇋ Mirror)

**What it does.** Paint, Erase and Fill work on both sides of the car at once. In the Spray Booth, numbers, text and logos go on both sides as a pair: changing one's text, colours, font or size changes the other, and each keeps its own place and angle.

**Where:** **⇋ Mirror** in the toolbar, or **S**. It's part of Driver, car only, and off for a new design. On Rookie, Symmetry you turned on earlier is kept but doesn't work until you have Driver again.

**If it doesn't work:** it needs your car chosen and its 3D model. "Symmetry on. It works once this car's 3D model is loaded (open the Spray Booth)." Open the booth once, and keep the stand-in in mind (see below).

---

## Layers

**Where:** the **Design** tab → **LAYERS** ("Everything in your design."), listed **TOP FIRST · DRAG TO REORDER**.

Everything goes in one list: template layers, paint layers, numbers, text, logos and shapes. iRacing's pattern layers are chosen in **Patterns**, so they aren't listed. The guide layers (wire, mask, number blocks) are listed underneath, under **TEMPLATE GUIDES**. Turning one on also turns guides on.

| Part of a row | What it does |
|---|---|
| Eye | Show or hide. Hidden layers aren't in the paint. |
| 🔓︎ / 🔒︎ | Lock: stops it being painted, changed, moved or deleted |
| Colour dots | Template layers only: recolour (see above). Part of Driver. |
| Name | Click to select, drag to reorder |
| Tag | TEMPLATE · %, TEMPLATE PICTURE, PAINT · %, GUIDE, CAR SHAPE, HIDDEN, LOCKED, ONLY ON n |

**Right-click a layer:** **Move up**, **Move down**, **Bring to the top**, **Send to the bottom**, **Put in a new folder**, **Put in "folder"**, **Take out of the folder**, **Duplicate**, **Rename**, **Delete**.

**Right-click a folder:** Move up, Move down, Bring to the top, Send to the bottom, **Rename**, **Ungroup (keep the layers)**. A folder's eye and lock work on everything in it. Click its name to open or close it. Drop a layer just under the folder's name to put it in.

**+ Add:** **# Number**, **T Text**, **▣ Logo**, **▭ Rectangle**, **◯ Ellipse**, **╱ Line or stripe**, **🖌︎ Paint layer**, **📁︎ Folder (for the selected layer)**. For a folder, select a layer first.

---

## Finish (Driver)

**What it does.** Sets how the car shines. Install saves it as iRacing's spec map, car_spec_ID.tga, next to the paint. It's car only: "iRacing only uses finishes (its spec map) on the car, not on helmets or suits."

**Where:** the **Design** tab → **FINISH** ("Shine, metal and matte."). In the Spray Booth, it's under **Look**.

**Whole car:** choose **WHOLE CAR**: iRacing's standard finish (default), Gloss, Metallic, Pearl, Satin, Matte, Chrome, Brushed metal or Custom.

**Parts of the car**
1. Tick **Paint finishes on parts of the car**, or click a finish swatch, which ticks it for you. You get "Painting finishes now: Paint, Fill and Erase change the finish, not the colour."
2. Either select a part and press **Apply to selection**, or paint with Paint, Fill and Erase. Pick reads the finish at a spot. A coloured overlay shows where each finish goes. It isn't part of the paint.
3. To paint colours again, click the **Painting …** chip in the toolbar ("Painting colours again. Your finishes are kept.").

| Control | What it does | Default |
|---|---|---|
| **WHOLE CAR** | One finish for everything | iRacing's standard finish |
| **Paint finishes on parts of the car** | Paint, Fill and Erase paint finishes | Off |
| Swatches | Gloss, Metallic, Pearl, Satin, Matte, Chrome, Brushed metal, Custom: the finish to paint | Chrome |
| **PEARL** / **ROUGHNESS** (Pearl) | How much flake shows (0 none, 255 like metal), and 0 mirror-smooth to 255 fully matte | 100 / 50 |
| **METALLIC** / **ROUGHNESS** / **CLEAR COAT** (Custom) | 0–255. Clear coat below 16 is "Off": 16 is the shiniest, 255 the dullest. | 128 / 80 / 16 |
| **Apply to selection** / **Remove from selection** | Needs a selection ("Select part of the car first") | — |
| **Remove all** | Removes every painted finish (asks first). The whole-car finish stays. | — |

**Tip:** chrome and metal show the paint underneath, so light colours look best. Template parts like chrome trim and black plastic keep their own finish.

---

## Helmet and suit (Driver)

1. Switch **Car / Helmet / Suit** at the top. Each one keeps its own design, template and layers ("Painting your helmet.").
2. Load iRacing's helmet or suit template (see *Getting the template*).
3. In Setup, set **USE IT WITH**. **Every car** puts helmet_ID.tga or suit_ID.tga in Documents\iRacing\paint. **Only the car above** puts it in that car's folder. iRacing uses a car folder's helmet or suit for that car, and the paint folder's one for every other car.
4. The Car number section, Symmetry and Finishes are car only.

---

## Undo, Before, saving and versions

| Control | What it does | Shortcut |
|---|---|---|
| **Undo** / **Redo** | Steps back or forward. The message says what changed. | Ctrl+Z / Ctrl+Y (or Ctrl+Shift+Z) |
| **◐ Before** | Hold it to see the paint as it was when you opened it ("Nothing to compare yet." at first) | Hold \ |
| **Start a new livery** (bottom of Setup) | Clears the design (it asks first). Keeps your car, ID and brush. Undo can bring the old design back. | — |

**Saving.** Your design saves itself in the browser as you work. If it can't, you see "Your design can't be saved in this browser. Download the TGA to keep it."

**Versions** (Setup → **VERSIONS**, "Keep a copy to come back to."; needs the companion; part of Driver):
1. Type a **Name (optional)** and press **Save version** (or Enter). It's saved as a .gcpaint file in Documents\Grid Central\Liveries\carfolder (Helmet and Suit have their own folders).
2. **Open** goes back to a version. What you have now is saved as a version first. **Delete** removes one (this can't be undone). **Show the folder** opens it.
3. Every Install saves one by itself ("Installed date time"). The newest 10 of those are kept.
4. A version holds your design, logos, pictures and finishes. It doesn't hold the template or your iRacing ID.

---

## Getting it into iRacing

### Before you install: the check

Install and Download first check for things that won't come out as they look. The list is titled **BEFORE YOU INSTALL – Things to look at**. Each item has **Show me**. Then press **Fix first** or **Install anyway** (**Download anyway**). Esc means Fix first. The check catches:
- an item going off the edge of the sheet
- an item that's mostly outside the paintable area
- an item under iRacing's own stickers (Car Mandatory)
- text or a number that's hard to read on the paint under it
- hidden layers ("1 hidden layer won't be in the paint.")
- text or a logo in, or running into, a number area while iRacing shows your number
- iRacing's number switched off with no number of your own in the number areas
- a template that looks like it's for another car

### Install to iRacing

**With the companion (one click):**
1. Press **Install to iRacing**. It changes to "Installing…".
2. The companion keeps a backup of the paint that was there, writes car_ID.tga (and car_spec_ID.tga if you set finishes) into Documents\iRacing\paint\carfolder, and tells iRacing to reload your car. There's no folder to pick and no Ctrl+R.
3. A card on the canvas says "Installed. It's on your car now." If iRacing isn't running, it says "iRacing isn't running. The paint is saved and shows next time you drive."
4. The card has **Check again**, **Undo install** (puts the previous paint back) and **×**.
5. Grid Central checks again about 20 seconds and 90 seconds later, and shortly after you join a session.

**Without the companion:**
1. Press Install. The first time, pick your Documents\iRacing\paint folder. If you pick the iRacing folder, its paint folder is used. A different folder asks before it's used.
2. If a paint file is already there, it asks before replacing it.
3. "Installed. In iRacing, press Ctrl+R to see it." **Change iRacing paint folder** in Setup makes it ask for the folder again.
4. If your browser can't open folders, the files download instead.

### Download TGA

**Download TGA ↓** saves car_ID.tga (and car_spec_ID.tga) to your Downloads ("Copy them into Documents\iRacing\paint\carfolder."). Use it to back up your paint, or to install it by hand.

### Live in iRacing (Driver)

1. Tick **Live in iRacing**. It asks first, because it replaces the paint file that's there.
2. About a second after each change, the paint is sent to iRacing and reloaded on your car. Watch it in the garage or on track. The status bar shows "Live: sending to iRacing…", then "Live: updated in iRacing at …" (or "Live: saved at …").
3. Untick it to stop.

### If the paint doesn't show in iRacing

| What you see | Fix |
|---|---|
| "This paint is named for another iRacing ID" | Your ID in Setup is wrong. Press **Use … and install again**. |
| "You're in a different car" | Get in the painted car, or press **Paint the …** to paint the car you're in |
| "Your Grid Central paint was replaced" / "…isn't there any more" | Usually the Trading Paints Downloader. Untick "Update my own paints" in the Downloader (or remove your Trading Paints paint for this car on their website), then press **Install again**. |
| "The paint couldn't be installed" | Try again. If it keeps happening, use Download and copy the file in by hand. |
| "The companion didn't answer. Try again, or use Download." | Restart the companion. Use Download for now. |
| "iRacing didn't reload the paint: …" | The file is in place. Leave the car and get back in. |
| Installed without the companion and nothing changed | Press Ctrl+R in iRacing, and check the file went into the car's own folder |
| Wrong colours on the number | iRacing paints the number from its own Paint Shop. Set the number colours there. |
| Live: "start the companion (Settings → Connections → iRacing)…" | Start the companion |
| "You're driving a different car (…)" during Live | Pick that car in Setup |
| Paint looks fine here but parts are missing in iRacing | Look at the check list: hidden layers, items off the sheet, outside the mask, or under Car Mandatory |
| Finishes don't show | They're car only and need car_spec_ID.tga next to the paint. Install writes it, Download saves both files. |

---

## The Spray Booth (Driver)

**What it does.** Your car in 3D in Grid Central, painted as you work. Every change shows on it straight away, and iRacing doesn't need to be open. The car stands on a turntable in a paint booth whose lights show in the paint.

**Where:** the **Spray Booth** button in the paint shop's header. **Leave** (or Esc) closes it. The first time, a short tour runs (**Next**, **Previous**, **Skip the tour**). You can run it again from **?** → **Take the tour**.

### Layout

| Area | What's there |
|---|---|
| Top bar | SPRAY BOOTH and the car's name, the model's name, **Saved** light (Saving…, Saved, Not saved), **Live** light (Live: sending, saved, on your car, problem, companion off), Undo, Redo, Before, **Simple / Advanced**, Live in iRacing, Install to iRacing, **?**, **Photo**, **Leave** |
| Left rail | The paint shop's tools |
| Middle | The 3D car with the tool options, the view chips, and the **SHEET** in the corner (**⤢** makes it bigger) |
| Under the car | The pattern strip and its three colours. The mouse wheel scrolls along it. |
| Right | **Selected** (properties), **Layers**, **Look** (Finish and Wheels), **Scene** (backdrop, quality, 3D model, plus everything from the Setup tab: car, ID, number, versions, template) |

**Simple** (the default) keeps to the everyday tools and hides the sheet, the Layers tab, More tools, the model's name in the top bar, and the **Rect**, **Ellipse** and **Line** tools (they draw on the sheet). If one of those is picked when Simple comes on, you're put back on **Move**. **Advanced** shows everything. Your choice is remembered.

### Mouse controls

| Doing | Move tool (and other non-painting tools) | Paint tools (Paint, Erase, Fill, Pick, Area, Colour, Text, Number) |
|---|---|---|
| Turn the car | Left-drag | Right-drag |
| Move the car | Right-drag | Middle-drag |
| Zoom | Scroll (or middle-drag) | Scroll |
| Left-click | Selects what's there. Drag a number, text or logo to move it. | Paints or places |
| Double-click | Closes in on that spot. Off the car, goes back to the whole car. | — (use the right-click menu's Focus here) |
| Right-click | The menu for that spot | The menu for that spot |

**Painting on the car**
- **Paint** and **Erase** paint where you point, and a ring shows the brush (red for Erase). With Symmetry, a fainter ring shows on the other side.
- **Fill**, **Pick**, **Area** and **Colour** work where you click.
- **Text** and **Number** show a faint preview, then go where you click.
- **Logo** asks for the file, then "Click the car where it goes. Esc cancels."
- With **Move**, hovering lights up what a click would select and shows its name. Dragging a number, text or logo follows the car's surface and snaps into blocks. Hold **Alt** for no snapping.
- Shapes, Select, Lasso and Stroke work on the sheet only: "Shapes and selections are drawn on the sheet (bottom left; ⤢ makes it bigger)." In Simple, where the sheet is hidden, it says "Shapes and selections are drawn on the sheet: switch to Advanced (top bar) to show it."

**Right-click menu.** For an item: **Edit…**, **Duplicate**, **Bring forward**, **Send back**, **Delete**. For **This panel** (or **These panels (both sides)** with Symmetry): **Fill with the paint colour**, **Select it**, **Show "layer" only here**. Under **Finish**: Gloss, Satin, Matte, Metallic, Pearl, Chrome, Brushed metal, **The whole car's finish**. Under **Here**: **Pick this colour**, **Focus here**, **Back to the whole car**.

### Views and scene

| Control | What it does | Default or key |
|---|---|---|
| **Front**, **Side**, **Rear ¾**, **Top** | Fly to that view | 1, 2, 3, 4 |
| **iRacing** | Front three-quarters, the way iRacing shows a car | 5 |
| **Reset view** | Back to the start | Home |
| **Turntable** | Spins the car | Off |
| **BACKDROP** | Steps through Spray booth, Studio light, Garage, Daylight, Night | Spray booth |
| **QUALITY** | **Quality: high** (glow, sharper shadows, full resolution) or **Quality: standard** for slower PCs | High |
| **Load 3D model…** | Your own .glb or .gltf for this car | — |
| **?** | Shortcut list and tour | ? |

### 3D models

- Cars show as a simple **Stand-in car** until there's a 3D model for them. Grid Central downloads models by itself as they're added ("Getting the 3D model for the …"). A downloaded model is kept, and the credit shows in the top bar in **Advanced**.
- On the stand-in, the paint won't line up: "There's no 3D model for the … yet…". A **Live in iRacing** button appears in Scene so you can see the paint on the real car.
- **Load 3D model…** takes a .glb whose UV map matches iRacing's template. The paint goes on the material named like "paint", "livery", "body", "car_skin" or "decal". If none is found it goes on the biggest part, with a note telling you to name the material "paint" in Blender. Your own model is kept for that car in this browser, and downloads never replace it.
- Finishes show as iRacing shows them: chrome mirrors the booth, and matte goes flat.

### Wheels (Look tab)

| Control | Choices | Default |
|---|---|---|
| **COLOUR** | Rim colour | Silver-grey |
| **FINISH** | Original wheels, Gloss, Matte, Metallic, Chrome | Original wheels |

The wheel settings are kept for each car, and they show in the booth only. In iRacing, choose the same rim colour in iRacing's Paint Shop.

### Photo

Press **Photo** for a picture of the car as shown. Add **Say something about it (optional)**, then **Save picture** (saved to your Downloads as grid-central-car.jpg), **Post to Discord** (needs the companion and Discord connected), or **Back to the booth**.

**Esc** in the booth steps back one thing at a time: a logo waiting to be placed, the shortcut list, the photo, the big sheet, and then the booth itself.

**If it doesn't work**
- "The 3D view couldn't start: …": the browser couldn't start 3D graphics. The sheet and tools still work; use Live in iRacing to see the paint on the car, and try reopening the booth after updating your browser or graphics drivers.
- "Choose your car in Setup to see it in 3D.": pick the car (Scene tab).
- "That's not on the car's paint. Point at the body.": windows, tyres and so on can't be painted.
- **No template loaded** card: press **Find my template**, or **Paint without one**.
- No Rect, Ellipse or Line on the rail, or shape tools do nothing on the car: switch to **Advanced** and draw on the sheet.
- "That model couldn't be loaded: …" / "That file has no 3D model in it.": export the model as .glb.

---

## Keyboard shortcuts

Shortcuts work while the Paint page (or booth) is open and you're not typing in a box.

| Key | Action | Key | Action |
|---|---|---|---|
| V | Move | H / hold Space | Pan |
| M | Select (rectangle) | F | Lasso |
| W | Area | C | Colour |
| P | Paint | X | Erase |
| G | Fill | I | Pick |
| K | Cut | R | Rectangle |
| E | Ellipse | L | Line |
| B | Stroke | T | Text |
| N | Number | S | Symmetry |
| , / . | Brush smaller / bigger | \ (hold) | Before |
| + / − / 0 | Zoom in / out / fit | Arrows (Shift) | Nudge 4 (32) px |
| [ / ] | Back / forward one place | Delete | Delete item or clear selection |
| Ctrl+Z / Ctrl+Y | Undo / Redo | Ctrl+D | Duplicate |
| Ctrl+A / Ctrl+Shift+A | Select all / deselect | Ctrl+Shift+I | Invert selection |
| Esc | Cancel, drop selection, back to Move | Enter (Cut) | Finish cut |
| Booth: 1–5 | Front, Side, Rear, Top, iRacing | Booth: Home / ? | Reset view / shortcuts |

Pressing the key of a tool hidden under **More tools** shows all the tools. **More tools** / **Fewer tools** is remembered in this browser.
