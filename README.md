# Advance Home Interior — Website

A dark, cinematic, multi-page marketing website for **Advance Home Interior**, an
interior design and bespoke furniture practice based in Gurugram, India.
Tagline: *"Design is not our job — it's our passion."*

The design language is inspired by high-end brand-experience sites
(large editorial serif display type, generous negative space, a warm champagne-brass
accent on near-black, subtle grain/vignette, and scroll-driven reveals).

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, services overview, featured work, process, CTA |
| `about.html` | The Studio — story, principles, stats |
| `services.html` | Detailed services + how a project runs |
| `portfolio.html` | Work — project gallery |
| `contact.html` | Contact form + studio details |

## Structure

```
index.html · about.html · services.html · portfolio.html · contact.html
assets/css/style.css   Shared design system, layout, responsive rules
assets/js/main.js      Sticky header, mobile nav, scroll reveals, stat counters, form
assets/img/            Drop your real project photos here
```

Fonts (Cormorant Garamond + Manrope) load from Google Fonts and degrade
gracefully to system serif/sans if offline.

## Running

Fully static — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Make it yours — before going live

The site is built with clearly-marked placeholders. Replace these:

1. **Contact details** — phone, email, exact address and hours appear in
   `contact.html` and in the footer of every page. Search for
   `+91 00000 00000` and `hello@advancehomeinterior.com` and update them.
2. **Photos** — the site is already wired to use five images as full-bleed
   section backgrounds and portfolio frames. Just drop the files into
   `assets/img/` with these exact names (see `assets/img/README.txt`):
   `living-1.jpg`, `living-2.jpg`, `living-3.jpg`, `living-4.jpg`, `living-5.jpg`.
   Missing files fall back to a styled placeholder — never a broken image.
3. **Copy & stats** — the headline stats (years, projects) and body copy are
   sensible placeholders; adjust to the studio's real numbers and voice.
4. **Contact form** — currently a front-end-only acknowledgement. Wire it to
   email, a form service (e.g. Formspree), or a WhatsApp link to receive
   enquiries. See `data-contact-form` handling in `assets/js/main.js`.
5. **Social links** — the Instagram link points to `@advancehomeinterior`; confirm
   or update.

## Accessibility & performance

- Respects `prefers-reduced-motion` (animations and counters degrade to static).
- Semantic landmarks, labelled form fields, keyboard-dismissable mobile menu.
- No build step, no framework, no external JS dependencies — loads fast.
