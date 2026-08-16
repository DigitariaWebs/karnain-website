# Blender product imagery brief

The prompt to paste into Claude Desktop (with the Blender MCP connected), together with
photos of the real Karnain bottle. It produces the sober “first photo” that the homepage
and the collection grid need — one per fragrance.

## Where this came from

Maroin’s voice notes of 27 July 2026, transcribed from the source audio. Two points drive
the whole brief:

- **VN2** — he wants one presentation photo, the _first_ photo, the same treatment for
  every fragrance: pale **beige** background (he rejects white as «banal»), a plinth,
  product only, «simple, efficace». Mise-en-situation shots belong behind it on the
  product page.
- **VN3 / VN4** — he takes Dior’s own product photography apart and shows that every
  bottle in the line is a single CGI render re-coloured with a swapped label: same air
  bubble, same highlights, same two black flaws in the glass base. «Forcément, ça a été
  fait via ordinateur.» He is endorsing that workflow, not objecting to it.

So: one master scene, re-chroma’d per fragrance. Deliberate per-shot variation is _not_
wanted — an earlier written summary of these notes inverted his meaning.

Reference images live in Slack (Maroin → Morgane, 27 July): Gris Dior and Oud Ispahan on a
bare onyx plinth are the target for the grid shot; the red-silk-and-roses frame and the
macro label detail are the product-page variants.

## Open questions before rendering

- **Sucre Addictée** and **Rose des Bois** have no imagery anywhere — read their liquid
  colours off the real bottles.
- Confirm the strikethrough on `CHÉRIE` is on the physical label and not an artifact of
  the current render.
- Volume is unsettled: he expects 100–150 images to feed Instagram, and is negotiating the
  cost with Ilyes. Settle that before scaling this pipeline up.

## The prompt

```text
I've attached photos of the real Karnain perfume bottle. Use the Blender MCP tools to
build a photoreal product shot of it, then produce one render for every fragrance in the
range.

Read this whole brief before writing any code. Inspect the current scene first with
get_objects_summary / get_blendfile_summary_* — don't assume it's empty, and don't delete
anything you didn't create.

## The one rule that matters

Build ONE master scene, then generate each fragrance by changing only two things: the
liquid colour and the label text. Do not rebuild or re-light per fragrance. The client
explicitly wants this — he analysed Dior's own product photography, proved every bottle in
their line is the same render re-coloured with a swapped label, and asked for exactly that.
Identical lighting, identical reflections, identical bubbles across the range is the
desired outcome, not a defect.

## The bottle (match the attached photos)

- Heavy cylindrical clear-glass flacon with a THICK SOLID GLASS BASE — the bottom ~15% is
  solid glass, visible as a bright refractive block. Get this right; it's the most
  recognisable part of the silhouette.
- Softly rounded shoulder, short neck.
- Gold cap in two parts: a wide flat disc/plateau on top, sitting on a narrower gold collar
  that grips the neck. Polished, mirror-like gold.
- White rectangular label, centred, roughly the middle third of the body, with a thin
  double-rule border inset a couple of millimetres from the edge.
- Label text, three lines, black serif, centred:
    EXTRAIT DE PARFUM   — small, letter-spaced, top
    <FRAGRANCE NAME>    — large, the dominant element
    KARNAIN             — medium, bottom
- Fill the liquid to just below the shoulder, with a slight meniscus at the surface.

Take real measurements off the photo for proportions rather than guessing — check the
height-to-diameter ratio and the cap width against the body width before you commit.

## Materials

- Glass: Principled BSDF, Transmission 1.0, IOR 1.45–1.5, Roughness 0.0–0.02.
- Liquid: a SEPARATE mesh, slightly inset from the glass interior, with its own Glass BSDF
  and VOLUME ABSORPTION for the colour. Do not colour the liquid with base colour alone —
  absorption is what makes the tint deepen with thickness and read as real perfume. Tune
  the density so the colour is rich at the widest part and lighter near the meniscus.
- Gold cap: Principled BSDF, Metallic 1.0, Roughness 0.05–0.12, warm gold base colour.
- Label: slightly offset from the glass surface and curved to the cylinder, matte paper
  with a faint texture — not pure white, a touch warm.

## Scene, lighting, camera

- Backdrop: warm greige / beige seamless with a subtle vertical gradient and a very faint
  plaster or marble texture. NOT WHITE — the client specifically rejected white as "banal".
  Think warm sand, not grey.
- Plinth: a rectangular block of pale cream onyx or alabaster with soft translucency and
  gentle veining; the bottle sits on top. Place a second, larger block partially visible
  below and behind it for a stepped base. NOTHING ELSE IN FRAME — no fabric, no flowers,
  no ribbon, no props.
- Lighting: large soft area light (a broad softbox) from the front-left, slightly above the
  bottle; a weaker fill from the right; a subtle rim or gradient to separate the glass from
  the backdrop. Aim for a long, soft vertical highlight down the glass.
- Camera: straight-on, lens 85–135mm to avoid perspective distortion, at about label
  height. PORTRAIT framing, 2:3, bottle centred with generous headroom.
- Render: Cycles, denoising on, enough samples for clean glass and caustics, AgX or Filmic
  view transform with mild contrast.

## The range — 7 fragrances

Same bottle every time; change liquid colour and the name on the label:

  Tobacco                    golden amber
  Cuir 90                    cognac / amber brown
  Rose des Îles              clear rose pink
  Tentation                  bright golden yellow
  Chérie, Cherry Je t'aime   vivid red-coral
  Sucre Addictée             CONFIRM from the real bottle
  Rose des Bois              CONFIRM from the real bottle

Two label notes: "Chérie, Cherry Je t'aime" sets on two lines and the word CHÉRIE is
printed with a STRIKETHROUGH. "Rose des Îles" also sets on two lines. Check the attached
photos and match the real typography rather than inventing it.

## Deliverables

1. The master .blend with the scene built and named cleanly.
2. A Python script that loops the seven fragrances, sets the liquid absorption colour and
   the label text, and batch-renders to renders/<slug>.png at high resolution. Slugs:
   tobacco, cuir-90, rose-des-iles, tentation, cherry-je-taime, sucre-addictee,
   rose-des-bois.
3. Render Tobacco FIRST as a single test frame and show it to me. Wait for my approval on
   lighting and glass before batch-rendering the other six.

Work incrementally: build, render a low-sample preview, look at it, fix, and only then
increase quality. Show me viewport screenshots as you go.
```

## Where the renders go

Drop the finished files into `public/images/fragrances/` as `<slug>-1.png` (the grid shot
comes first in `Fragrance.images`), or upload them through `/admin` — the admin writes to
Supabase Storage and `next/image` serves both repo paths and Storage URLs. No code change
is needed to add photos or extra gallery angles; see
[features/shop.md](features/shop.md) and [features/admin.md](features/admin.md).
