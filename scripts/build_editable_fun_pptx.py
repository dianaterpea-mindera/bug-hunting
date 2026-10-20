#!/usr/bin/env python3
"""Fun, well-aligned editable deck → open in Keynote and Save as .key"""

from __future__ import annotations

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches, Pt

APP = "Insula după furtună"
BG = Path(__file__).resolve().parents[1] / "presentations" / "slide-bgs"
OUT = Path.home() / "Desktop" / "Insula-QA-editabil.pptx"
OUT_COPY = Path(__file__).resolve().parents[1] / "presentations" / "Insula-QA-editabil.pptx"

SEA_DEEP = RGBColor(0x0B, 0x3D, 0x4A)
SEA = RGBColor(0x1A, 0x6B, 0x7A)
SEA_LIGHT = RGBColor(0x3A, 0x9A, 0xAD)
CORAL = RGBColor(0xE0, 0x7A, 0x5F)
CORAL_DEEP = RGBColor(0xC4, 0x5C, 0x42)
GOLD = RGBColor(0xF0, 0xC7, 0x5E)
LEAF = RGBColor(0x2D, 0x6A, 0x4F)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
FOAM = RGBColor(0xE8, 0xF6, 0xF4)
MUTED = RGBColor(0x5A, 0x6E, 0x72)
INK = RGBColor(0x1A, 0x2B, 0x2E)
SOFT_TEAL = RGBColor(0xD4, 0xEE, 0xF0)
SOFT_CORAL = RGBColor(0xFB, 0xEB, 0xE6)
SOFT_LEAF = RGBColor(0xE3, 0xF5, 0xEC)

W, H = Inches(13.333), Inches(7.5)
DISPLAY = "Georgia"
BODY = "Avenir Next"


def fill(shape, color: RGBColor):
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()


def run(p, text, size, bold=False, color=INK, font=BODY):
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.color.rgb = color
    r.font.name = font
    return r


def write(shape, lines, align=PP_ALIGN.CENTER, valign=MSO_ANCHOR.MIDDLE):
    """lines: (text, size, bold, color, font?)"""
    tf = shape.text_frame
    tf.clear()
    tf.word_wrap = True
    try:
        tf.vertical_anchor = valign
    except Exception:
        pass
    for i, item in enumerate(lines):
        text, size, bold, color = item[:4]
        font = item[4] if len(item) > 4 else BODY
        space = item[5] if len(item) > 5 else (6 if i else 0)
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_before = Pt(space)
        p.space_after = Pt(0)
        run(p, text, size, bold, color, font)


def bg(slide, idx: int):
    path = BG / f"bg-{idx:02d}.png"
    slide.shapes.add_picture(str(path), 0, 0, width=W, height=H)


def chip(slide, left, top, text, fill_c=GOLD, text_c=SEA_DEEP):
    sh = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.4), Inches(0.42))
    fill(sh, fill_c)
    try:
        sh.adjustments[0] = 0.5
    except Exception:
        pass
    write(sh, [(text, 12, True, text_c)])


def title(slide, left, top, width, text, size=44, color=WHITE):
    box = slide.shapes.add_textbox(left, top, width, Inches(1.3))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    run(p, text, size, True, color, DISPLAY)


def subtitle(slide, left, top, width, text, color=FOAM):
    box = slide.shapes.add_textbox(left, top, width, Inches(0.5))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    run(p, text, 18, True, color, BODY)


def card(slide, left, top, width, height, lines, fill_c=WHITE, radius=0.14):
    sh = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    fill(sh, fill_c)
    try:
        sh.adjustments[0] = radius
    except Exception:
        pass
    write(sh, lines)
    return sh


def notes(slide, items: list[str]):
    tf = slide.notes_slide.notes_text_frame
    tf.clear()
    for i, n in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"• {n}"


def build():
    prs = Presentation()
    prs.slide_width = W
    prs.slide_height = H
    blank = prs.slide_layouts[6]

    # 0 Hook
    s = prs.slides.add_slide(blank)
    bg(s, 0)
    chip(s, Inches(0.7), Inches(0.45), "🕵️  RECAPITULARE", GOLD, SEA_DEEP)
    title(s, Inches(0.7), Inches(1.05), Inches(12), "Ați salvat animale… sau?", 50)
    subtitle(s, Inches(0.7), Inches(1.95), Inches(11), "Ceva nu se potrivește. Detectivii observă tot.")
    card(
        s,
        Inches(0.7),
        Inches(2.7),
        Inches(5.5),
        Inches(4.2),
        [
            ("🐢  🦜  🦊", 36, False, INK),
            ("Ce credeați", 26, True, SEA_DEEP, DISPLAY, 14),
            ("Eroi pe Insula după furtună", 16, False, MUTED, BODY, 10),
        ],
    )
    vs = card(s, Inches(6.4), Inches(4.3), Inches(0.9), Inches(0.9), [("VS", 16, True, WHITE)], CORAL, 0.5)
    card(
        s,
        Inches(7.5),
        Inches(2.7),
        Inches(5.1),
        Inches(4.2),
        [
            ("?", 48, True, CORAL, DISPLAY),
            ("Ce ați făcut de fapt", 24, True, WHITE, DISPLAY, 10),
            ("O meserie reală din IT… cu lupă", 16, False, FOAM, BODY, 10),
        ],
        SEA_DEEP,
    )
    notes(s, ["Întreabă: ce credeți că ați făcut azi?", "Surpriză: meseria are un nume."])

    # 1 Reveal
    s = prs.slides.add_slide(blank)
    bg(s, 1)
    chip(s, Inches(0.7), Inches(0.5), "🔓  REVELAȚIE", GOLD, SEA_DEEP)
    title(s, Inches(0.7), Inches(1.15), Inches(12), "Răsturnare: ați făcut Software Testing", 42)
    card(
        s,
        Inches(2.2),
        Inches(2.5),
        Inches(8.9),
        Inches(3.4),
        [
            ("QA", 56, True, GOLD, DISPLAY),
            ("Quality Assurance", 28, True, WHITE, DISPLAY, 8),
            ("Vânători de bug-uri profesioniști", 18, False, FOAM, BODY, 10),
            ("Înainte ca app-ul să ajungă la milioane de oameni", 15, False, FOAM, BODY, 8),
        ],
        SEA_DEEP,
    )
    card(
        s,
        Inches(3.8),
        Inches(6.2),
        Inches(5.7),
        Inches(0.75),
        [("🎖️  CERTIFICAT DETECTIV — ECHIPA INSULEI", 14, True, WHITE)],
        CORAL,
        0.4,
    )
    notes(s, ["QA = ne asigurăm că e de calitate.", "Ați fost echipa de QA din joc."])

    # 2 Bug lore
    s = prs.slides.add_slide(blank)
    bg(s, 2)
    chip(s, Inches(0.7), Inches(0.4), "📚  TERMENI NOI", CORAL, WHITE)
    title(s, Inches(0.7), Inches(1.0), Inches(12), "De ce zicem „bug”?", 48, SEA_DEEP)
    subtitle(s, Inches(0.7), Inches(1.85), Inches(11), "Spoiler: a existat un gândac. Real. Într-un computer.", MUTED)
    card(
        s,
        Inches(0.7),
        Inches(2.6),
        Inches(5.6),
        Inches(4.3),
        [
            ("DEMULT", 12, True, SEA_LIGHT),
            ("🐛💻", 44, False, INK, BODY, 12),
            ("Gândacul din mașinărie", 24, True, SEA_DEEP, DISPLAY, 12),
            ("Un insectă adevărată a stricat\nun computer — de-atunci zicem „bug”", 15, False, MUTED, BODY, 10),
        ],
        WHITE,
    )
    card(
        s,
        Inches(6.9),
        Inches(2.6),
        Inches(5.6),
        Inches(4.3),
        [
            ("AZI", 12, True, CORAL_DEEP),
            ("💥📱", 44, False, INK, BODY, 12),
            ("Bug = greșeală în program", 24, True, SEA_DEEP, DISPLAY, 12),
            ("Ce ați vânat pe insulă.\nCe QA vânează în fiecare zi.", 15, False, MUTED, BODY, 10),
        ],
        SOFT_CORAL,
    )
    notes(s, ["Poveste scurtă.", "Cui i s-a blocat un joc / story / temă?"])

    # 3 Quest
    s = prs.slides.add_slide(blank)
    bg(s, 3)
    chip(s, Inches(0.55), Inches(0.35), "🎮 → 💼  TRADUCERE", GOLD, SEA_DEEP)
    title(s, Inches(0.55), Inches(0.9), Inches(12.2), "Ați vorbit deja limba testerilor", 40)
    subtitle(s, Inches(0.55), Inches(1.7), Inches(11), "Aceiași pași. Alt vocabular. Quest level 2.")
    steps = [
        ("1", "👀", "Ai observat\nceva ciudat", "Bug detection"),
        ("2", "🎯", "Ai marcat\nzona", "Localizare"),
        ("3", "📸", "Ai făcut\nscreenshot", "Evidence"),
        ("4", "✍️", "Ai scris ce e\nîn neregulă", "Bug report"),
        ("5", "⚖️", "Așteptat\nvs real", "Expected / Actual"),
    ]
    for i, (n, ico, fr, to) in enumerate(steps):
        x = Inches(0.4 + i * 2.55)
        card(
            s,
            x,
            Inches(2.4),
            Inches(2.4),
            Inches(4.5),
            [
                (n, 14, True, GOLD),
                (ico, 34, False, WHITE, BODY, 8),
                (fr, 14, True, FOAM, BODY, 10),
                (to, 13, True, SEA_DEEP, BODY, 14),
            ],
            SEA_DEEP,
        )
        # accent pill for QA term - overlay bottom area with colored strip via second shape
    notes(s, ["Arată un raport din Review.", "Leagă pașii de termeni QA."])

    # 4 Cases
    s = prs.slides.add_slide(blank)
    bg(s, 4)
    chip(s, Inches(0.55), Inches(0.35), "🗂️  DOSARE", CORAL, WHITE)
    title(s, Inches(0.55), Inches(0.9), Inches(12), "Cazul #1: imaginea minte", 42, SEA_DEEP)
    subtitle(s, Inches(0.55), Inches(1.7), Inches(11), "Când ce scrie ≠ ce vezi. Classic sneaky bug.", MUTED)
    crops = Path(__file__).resolve().parents[1] / "presentations" / "bug-crops"
    cases = [
        (
            "SCENA 1",
            "🚤 „Ai ajuns cu barca”  ≠  🚗 pe ecran",
            "🔍 Text vs iconiță",
            CORAL,
            crops / "bug-01-transport.png",
        ),
        (
            "SCENA 3",
            "🐢 Tessa  ≠  📋 fișa zice Tina",
            "🔍 Nume greșit",
            SEA_LIGHT,
            crops / "bug-03-tessa-tina.png",
        ),
        (
            "SCENA 10",
            "🦜 Kiko = papagal  ≠  🙈 etichetă: Maimuță",
            "🔍 Specie greșită",
            LEAF,
            crops / "bug-10-kiko-maimuta.png",
        ),
    ]
    for i, (tag, summary, clue, accent, shot) in enumerate(cases):
        x = Inches(0.45 + i * 4.25)
        # Background card (text sits in the top band; screenshot below)
        sh = s.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2), Inches(4.05), Inches(4.85)
        )
        fill(sh, WHITE)
        try:
            sh.adjustments[0] = 0.12
        except Exception:
            pass
        head = s.shapes.add_textbox(x + Inches(0.2), Inches(2.3), Inches(3.65), Inches(1.15))
        write(
            head,
            [
                (tag, 12, True, accent),
                (summary, 13, True, SEA_DEEP, BODY, 8),
                (clue, 12, True, MUTED, BODY, 6),
            ],
            align=PP_ALIGN.CENTER,
            valign=MSO_ANCHOR.TOP,
        )
        # Crop from the live app — only the buggy UI fragment
        if shot.exists():
            from PIL import Image as PILImage

            with PILImage.open(shot) as im:
                iw, ih = im.size
            max_w = Inches(3.55)
            max_h = Inches(3.0)
            scale = min(max_w / iw, max_h / ih)
            pw, ph = iw * scale, ih * scale
            pic_left = x + (Inches(4.05) - pw) / 2
            pic_top = Inches(3.55) + (max_h - ph) / 2
            s.shapes.add_picture(str(shot), pic_left, pic_top, width=pw, height=ph)
    notes(s, ["Review opțional: scenele 1, 3, 10.", "Screenshot-urile arată exact zona greșită din app."])

    # 5 Logic
    s = prs.slides.add_slide(blank)
    bg(s, 5)
    chip(s, Inches(0.55), Inches(0.35), "🧠  EROARE", GOLD, SEA_DEEP)
    title(s, Inches(0.55), Inches(0.9), Inches(12.2), "Cazul #2: creierul app-ului o ia razna", 36)
    logic = [
        (
            "➡️  Pădurea",
            "În joc: Dreapta → Poiană ↑",
            crops / "bug-05-padure.png",
        ),
        (
            "💧  Rucsacul",
            "În joc: 3 sticle, contor ×2",
            crops / "bug-04-rucsac.png",
        ),
        (
            "🏥  Filtrul „Toate”",
            "În joc: 5 pe chip, 4 pe listă",
            crops / "bug-08-filtru.png",
        ),
    ]
    for i, (heading, summary, shot) in enumerate(logic):
        x = Inches(0.45 + i * 4.25)
        sh = s.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.15), Inches(4.05), Inches(4.9)
        )
        fill(sh, SEA_DEEP)
        try:
            sh.adjustments[0] = 0.12
        except Exception:
            pass
        head = s.shapes.add_textbox(x + Inches(0.2), Inches(2.25), Inches(3.65), Inches(0.95))
        write(
            head,
            [
                (heading, 18, True, WHITE, DISPLAY),
                (summary, 13, True, FOAM, BODY, 6),
            ],
            align=PP_ALIGN.CENTER,
            valign=MSO_ANCHOR.TOP,
        )
        if shot.exists():
            from PIL import Image as PILImage

            with PILImage.open(shot) as im:
                iw, ih = im.size
            max_w = Inches(3.55)
            max_h = Inches(3.35)
            scale = min(max_w / iw, max_h / ih)
            pw, ph = iw * scale, ih * scale
            pic_left = x + (Inches(4.05) - pw) / 2
            pic_top = Inches(3.35) + (max_h - ph) / 2
            s.shapes.add_picture(str(shot), pic_left, pic_top, width=pw, height=ph)
    notes(s, ["Review: scenele 5, 4, 8.", "Screenshot-urile arată exact zona greșită din app."])

    # 6 Trust
    s = prs.slides.add_slide(blank)
    bg(s, 6)
    chip(s, Inches(0.55), Inches(0.35), "⚠️  TRAP ALERT", CORAL, WHITE)
    title(s, Inches(0.55), Inches(0.9), Inches(12), "Nu crede bifa verde!", 42, SEA_DEEP)
    subtitle(s, Inches(0.55), Inches(1.7), Inches(11), "App-ul zice OK. Realitatea zice „hmm…”", MUTED)
    traps = [
        (
            "🦊  Ruxi + apa",
            "✓ Băut apă — tot însetată",
            crops / "bug-06-ruxi.png",
        ),
        (
            "🤖  InspectorBot",
            "✓ Habitat apt — cu avertismente",
            crops / "bug-11-habitat.png",
        ),
        (
            "📸  Eliberare 17:20",
            "Etichetă eliberare — poză de prânz",
            crops / "bug-12-eliberare.png",
        ),
    ]
    for i, (heading, summary, shot) in enumerate(traps):
        x = Inches(0.45 + i * 4.25)
        sh = s.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.15), Inches(4.05), Inches(4.9)
        )
        fill(sh, WHITE)
        try:
            sh.adjustments[0] = 0.12
        except Exception:
            pass
        head = s.shapes.add_textbox(x + Inches(0.2), Inches(2.25), Inches(3.65), Inches(0.95))
        write(
            head,
            [
                (heading, 16, True, SEA_DEEP, DISPLAY),
                (summary, 12, True, CORAL_DEEP, BODY, 6),
            ],
            align=PP_ALIGN.CENTER,
            valign=MSO_ANCHOR.TOP,
        )
        if shot.exists():
            from PIL import Image as PILImage

            with PILImage.open(shot) as im:
                iw, ih = im.size
            max_w = Inches(3.55)
            max_h = Inches(3.35)
            scale = min(max_w / iw, max_h / ih)
            pw, ph = iw * scale, ih * scale
            pic_left = x + (Inches(4.05) - pw) / 2
            pic_top = Inches(3.35) + (max_h - ph) / 2
            s.shapes.add_picture(str(shot), pic_left, pic_top, width=pw, height=ph)
    notes(s, ["Scenele 6, 11, 12.", "Screenshot-urile arată exact zona greșită din app."])

    # 7 Real life
    s = prs.slides.add_slide(blank)
    bg(s, 7)
    chip(s, Inches(0.5), Inches(0.3), "📱  TRAINING", GOLD, SEA_DEEP)
    title(s, Inches(0.5), Inches(0.8), Inches(12.2), "Le-ai trăit deja. Pe telefon.", 40)
    subtitle(s, Inches(0.5), Inches(1.55), Inches(12), "Ridică mâna dacă ți s-a întâmplat măcar unul!")
    apps = [
        ("🎮", "Jocuri", "Scorul nu se salvează", "QA: după Continua?"),
        ("💬", "Chat", "Mesaj dublu / nevăzut", "QA: ce vede celălalt?"),
        ("📚", "Școală", "Tema „trimisă” — profesoara n-o vede", "QA: ce vede profesoara?"),
        ("🛒", "Shop", "Ai plătit, itemul lipsește", "QA: banii → produs?"),
        ("🔔", "Notificări", "De 10 ori… sau deloc", "QA: prea mult / puțin?"),
        ("🚌", "Hărți", "„2 min” × 15 minute", "QA: e actualizat?"),
    ]
    for i, (ico, where, bug, ask) in enumerate(apps):
        col, row = i % 3, i // 3
        x = Inches(0.4 + col * 4.25)
        y = Inches(2.2 + row * 2.45)
        card(
            s,
            x,
            y,
            Inches(4.05),
            Inches(2.25),
            [
                (f"{ico}  {where}", 18, True, SEA_DEEP, DISPLAY),
                (bug, 14, False, MUTED, BODY, 8),
                (ask, 13, True, SEA, BODY, 10),
            ],
            WHITE,
        )
    notes(s, ["Nu numi branduri.", "20–30 sec mâini sus."])

    # 8 Day
    s = prs.slides.add_slide(blank)
    bg(s, 8)
    chip(s, Inches(0.55), Inches(0.35), "🗓️  O ZI DE QA", CORAL, WHITE)
    title(s, Inches(0.55), Inches(0.9), Inches(12), "Nu e „apasă random”. E misiune.", 40, SEA_DEEP)
    day = [
        ("09:00", "🧪", "Încerci app-ul"),
        ("11:00", "🐞", "Găsești bug-uri"),
        ("13:00", "📝", "Scrii rapoarte"),
        ("15:00", "🤝", "Cu programatorii"),
        ("17:00", "🔁", "Verifici din nou"),
    ]
    track = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.5), Inches(11.3), Inches(0.12))
    fill(track, GOLD)
    for i, (t, ico, lab) in enumerate(day):
        x = Inches(0.45 + i * 2.55)
        card(
            s,
            x,
            Inches(2.4),
            Inches(2.4),
            Inches(4.4),
            [
                (t, 14, True, SEA_LIGHT),
                (ico, 40, False, INK, BODY, 12),
                (lab, 15, True, SEA_DEEP, BODY, 10),
            ],
            WHITE,
        )
    notes(s, ["Retest după fix."])

    # 9 Chaos
    s = prs.slides.add_slide(blank)
    bg(s, 9)
    chip(s, Inches(0.55), Inches(0.35), "💣  DE CE CONTEAZĂ", GOLD, SEA_DEEP)
    title(s, Inches(0.55), Inches(0.9), Inches(12), "Fără QA… haos pe telefon", 42)
    card(
        s,
        Inches(0.55),
        Inches(2.2),
        Inches(3.8),
        Inches(4.7),
        [
            ("💥", 52, False, WHITE),
            ("App crashed", 24, True, WHITE, DISPLAY, 10),
            ("retry? retry? retry?", 16, False, FOAM, BODY, 10),
        ],
        SEA_DEEP,
    )
    chaos = [
        ("🎮", "Jocul se blochează", "exact în finală"),
        ("📱", "Story-ul nu urcă", "like-ul „dispare”"),
        ("📚", "Catalog online greșit", "nota e aiurea"),
        ("🎵", "Melodia / video-ul sare", "sau se blochează"),
    ]
    for i, (ico, a, b) in enumerate(chaos):
        y = Inches(2.2 + i * 1.2)
        card(
            s,
            Inches(4.7),
            y,
            Inches(8.0),
            Inches(1.05),
            [(f"{ico}    {a}    —    {b}", 18, True, WHITE)],
            RGBColor(0x1A, 0x2F, 0x36),
        )
    notes(s, ["Bug mic pe ecran → problemă mare în spate."])

    # 10 Powers
    s = prs.slides.add_slide(blank)
    bg(s, 10)
    chip(s, Inches(0.55), Inches(0.35), "⚡  POWER-UPS", GOLD, SEA_DEEP)
    title(s, Inches(0.55), Inches(0.9), Inches(12), "Azi ați deblocat astea", 46)
    powers = [
        ("🔎", "Ochi de vultur", "Vezi ce nu se potrivește", SEA_LIGHT),
        ("🧩", "Detective mode", "„Hmm… ciudat”", CORAL),
        ("🗣️", "Raport clar", "Alții înțeleg din prima", RGBColor(0x52, 0xB7, 0x88)),
        ("💪", "Retry power", "Greșeala nu te oprește", GOLD),
    ]
    for i, (ico, name, blurb, accent) in enumerate(powers):
        x = Inches(0.4 + i * 3.2)
        card(
            s,
            x,
            Inches(2.3),
            Inches(3.0),
            Inches(4.5),
            [
                (ico, 40, False, WHITE),
                (name, 20, True, WHITE, DISPLAY, 12),
                (blurb, 14, False, FOAM, BODY, 10),
            ],
            accent if accent != GOLD else RGBColor(0xD4, 0xA0, 0x17),
        )
    notes(s, ["Greșeala la selecție nu a luat stele."])

    # 11 Path
    s = prs.slides.add_slide(blank)
    bg(s, 11)
    chip(s, Inches(0.55), Inches(0.35), "🗺️  NEXT LEVEL?", CORAL, WHITE)
    title(s, Inches(0.55), Inches(0.9), Inches(12), "Ți-a plăcut să cauți greșeli?", 42, SEA_DEEP)
    subtitle(s, Inches(0.55), Inches(1.75), Inches(11), "Fără presiune. Doar curiozitate. (E o meserie reală.)", MUTED)
    you = card(
        s,
        Inches(4.0),
        Inches(2.35),
        Inches(5.3),
        Inches(0.85),
        [("🕵️   Ție ți-a plăcut?", 22, True, SEA_DEEP, DISPLAY)],
        GOLD,
        0.45,
    )
    card(
        s,
        Inches(0.7),
        Inches(3.5),
        Inches(5.7),
        Inches(3.4),
        [
            ("🐞", 44, False, INK),
            ("QA", 32, True, SEA, DISPLAY, 10),
            ("Pui aplicația la încercare\n— înaintea tuturor", 16, False, MUTED, BODY, 10),
        ],
        WHITE,
    )
    card(
        s,
        Inches(6.9),
        Inches(3.5),
        Inches(5.7),
        Inches(3.4),
        [
            ("👩‍💻", 44, False, WHITE),
            ("sau altceva în IT", 26, True, GOLD, DISPLAY, 10),
            ("Curiozitatea rămâne\narma ta secretă", 16, False, FOAM, BODY, 10),
        ],
        SEA_DEEP,
    )
    notes(s, ["Ton ușor.", f"Azi ați fost deja junior QA în {APP}."])

    # 12 Finale
    s = prs.slides.add_slide(blank)
    bg(s, 12)
    chip(s, Inches(5.0), Inches(1.0), "🏁  FINAL BOSS DEFEATED", GOLD, SEA_DEEP)
    tbox = s.shapes.add_textbox(Inches(1), Inches(1.8), Inches(11.3), Inches(1.2))
    tf = tbox.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, "Misiune îndeplinită!", 56, True, WHITE, DISPLAY)
    stars = s.shapes.add_textbox(Inches(1), Inches(3.1), Inches(11.3), Inches(0.9))
    tf = stars.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, "⭐     🐞     ⭐", 40, False, GOLD, BODY)
    card(
        s,
        Inches(3.2),
        Inches(4.3),
        Inches(6.9),
        Inches(1.1),
        [(f"Junior QA — {APP}", 22, True, SEA_DEEP, DISPLAY)],
        GOLD,
    )
    card(
        s,
        Inches(5.0),
        Inches(5.7),
        Inches(3.3),
        Inches(1.0),
        [("Întrebări? 🔥", 24, True, WHITE, DISPLAY)],
        CORAL,
    )
    notes(s, ["2–3 min întrebări.", "Care a fost cel mai sneaky bug?"])

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT_COPY.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(OUT))
    prs.save(str(OUT_COPY))
    print(OUT)


if __name__ == "__main__":
    build()
