#!/usr/bin/env python3
"""Build a visually rich QA wrap-up deck (island theme) for Keynote."""

from __future__ import annotations

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import nsmap, qn
from pptx.util import Emu, Inches, Pt
from lxml import etree

APP = "Insula după furtună"
OUT_PPTX = Path.home() / "Desktop" / "Insula-dupa-furtuna-QA.pptx"
OUT_COPY = Path(__file__).resolve().parents[1] / "presentations" / "Insula-dupa-furtuna-QA.pptx"

# Island palette
SEA_DEEP = RGBColor(0x0B, 0x3D, 0x4A)
SEA = RGBColor(0x1A, 0x6B, 0x7A)
SEA_LIGHT = RGBColor(0x3A, 0x9A, 0xAD)
FOAM = RGBColor(0xE8, 0xF6, 0xF4)
CORAL = RGBColor(0xE0, 0x7A, 0x5F)
CORAL_DEEP = RGBColor(0xC4, 0x5C, 0x42)
LEAF = RGBColor(0x2D, 0x6A, 0x4F)
LEAF_LIGHT = RGBColor(0x52, 0xB7, 0x88)
INK = RGBColor(0x1A, 0x2B, 0x2E)
MUTED = RGBColor(0x5A, 0x6E, 0x72)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
OK = RGBColor(0x2D, 0x6A, 0x4F)
BAD = RGBColor(0xC4, 0x5C, 0x42)
SOFT_TEAL = RGBColor(0xD4, 0xEE, 0xF0)
SOFT_CORAL = RGBColor(0xFB, 0xEB, 0xE6)
SOFT_LEAF = RGBColor(0xE3, 0xF5, 0xEC)

W, H = Inches(13.333), Inches(7.5)
DISPLAY = "Georgia"
BODY = "Avenir Next"


def rgb_hex(c: RGBColor) -> str:
    return f"{c[0]:02X}{c[1]:02X}{c[2]:02X}"


def set_solid_fill(shape, color: RGBColor):
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()


def set_soft_shadow(shape):
    """Add a gentle drop shadow via OOXML."""
    sp_pr = shape._element.spPr
    # remove existing effectLst
    for child in list(sp_pr):
        if child.tag == qn("a:effectLst"):
            sp_pr.remove(child)
    effect = etree.SubElement(sp_pr, qn("a:effectLst"))
    outer = etree.SubElement(
        effect,
        qn("a:outerShdw"),
        {
            "blurRad": "76200",
            "dist": "38100",
            "dir": "2700000",
            "algn": "tl",
            "rotWithShape": "0",
        },
    )
    srgb = etree.SubElement(outer, qn("a:srgbClr"), {"val": "0B3D4A"})
    etree.SubElement(srgb, qn("a:alpha"), {"val": "28000"})


def run(p, text, size, bold=False, color=INK, font=BODY, italic=False):
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = color
    r.font.name = font
    return r


def clear_tf(tf):
    tf.clear()
    tf.word_wrap = True


def text_in(shape, lines, valign=MSO_ANCHOR.MIDDLE):
    """lines: list of (text, size, bold, color, font?, align?, space_before?)"""
    tf = shape.text_frame
    clear_tf(tf)
    tf.auto_size = None
    try:
        tf.vertical_anchor = valign
    except Exception:
        pass
    for i, item in enumerate(lines):
        text, size, bold, color = item[0], item[1], item[2], item[3]
        font = item[4] if len(item) > 4 and item[4] else BODY
        align = item[5] if len(item) > 5 and item[5] is not None else PP_ALIGN.CENTER
        space_before = item[6] if len(item) > 6 else (4 if i else 0)
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_before = Pt(space_before)
        p.space_after = Pt(0)
        run(p, text, size, bold, color, font)


def card(slide, left, top, width, height, fill=WHITE, shadow=True, radius=0.15):
    sh = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    set_solid_fill(sh, fill)
    try:
        sh.adjustments[0] = radius
    except Exception:
        pass
    if shadow:
        set_soft_shadow(sh)
    return sh


def pill(slide, left, top, width, height, fill, text, size=12, color=WHITE):
    sh = card(slide, left, top, width, height, fill=fill, shadow=False, radius=0.5)
    text_in(sh, [(text, size, True, color, BODY)])
    return sh


def eyebrow_title(slide, eyebrow, title, y_eyebrow=0.42, y_title=0.78, title_size=40):
    box = slide.shapes.add_textbox(Inches(0.8), Inches(y_eyebrow), Inches(11.7), Inches(0.35))
    tf = box.text_frame
    clear_tf(tf)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, eyebrow.upper(), 13, True, SEA_LIGHT, BODY)

    tbox = slide.shapes.add_textbox(Inches(0.8), Inches(y_title), Inches(11.7), Inches(0.85))
    tf = tbox.text_frame
    clear_tf(tf)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, title, title_size, True, SEA_DEEP, DISPLAY)


def paint_bg(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, W, H)
    set_solid_fill(bg, FOAM)
    # soft blobs
    b1 = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(2.8), Inches(-1.4), Inches(7.5), Inches(3.4))
    set_solid_fill(b1, SOFT_TEAL)
    b1.opacity = None
    # opacity via OOXML
    try:
        solid = b1.fill._fill
    except Exception:
        pass
    # lower opacity by alpha on solid fill
    spPr = b1._element.spPr
    solidFill = spPr.find(qn("a:solidFill"))
    if solidFill is not None:
        srgb = solidFill.find(qn("a:srgbClr"))
        if srgb is not None:
            etree.SubElement(srgb, qn("a:alpha"), {"val": "55000"})

    b2 = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(10.2), Inches(5.0), Inches(4.5), Inches(3.2))
    set_solid_fill(b2, SOFT_CORAL)
    spPr = b2._element.spPr
    solidFill = spPr.find(qn("a:solidFill"))
    if solidFill is not None:
        srgb = solidFill.find(qn("a:srgbClr"))
        if srgb is not None:
            etree.SubElement(srgb, qn("a:alpha"), {"val": "45000"})

    b3 = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(-1.2), Inches(5.4), Inches(3.8), Inches(2.8))
    set_solid_fill(b3, SOFT_LEAF)
    spPr = b3._element.spPr
    solidFill = spPr.find(qn("a:solidFill"))
    if solidFill is not None:
        srgb = solidFill.find(qn("a:srgbClr"))
        if srgb is not None:
            etree.SubElement(srgb, qn("a:alpha"), {"val": "40000"})

    # send to back
    spTree = slide.shapes._spTree
    for el in (b3._element, b2._element, b1._element, bg._element):
        spTree.remove(el)
        spTree.insert(2, el)


def set_notes(slide, notes: list[str]):
    tf = slide.notes_slide.notes_text_frame
    tf.clear()
    for i, note in enumerate(notes):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.clear()
        run(p, f"• {note}", 14, False, INK, BODY)


def build():
    prs = Presentation()
    prs.slide_width = W
    prs.slide_height = H
    blank = prs.slide_layouts[6]

    # ── 1 Hook ──────────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "După misiune", "Ați salvat animale… sau?")

    left = card(s, Inches(1.2), Inches(2.15), Inches(4.7), Inches(4.2), WHITE)
    text_in(
        left,
        [
            ("🐢  🦜  🦊", 36, False, INK, BODY),
            ("Ce ați crezut", 22, True, SEA_DEEP, DISPLAY, PP_ALIGN.CENTER, 14),
            (f"Salvatori în\n{APP}", 16, False, MUTED, BODY, PP_ALIGN.CENTER, 10),
        ],
    )

    vs = card(s, Inches(6.15), Inches(3.7), Inches(1.05), Inches(1.05), CORAL, shadow=True, radius=0.5)
    text_in(vs, [("VS", 18, True, WHITE, BODY)])

    right = card(s, Inches(7.45), Inches(2.15), Inches(4.7), Inches(4.2), SEA_DEEP)
    text_in(
        right,
        [
            ("?", 48, True, CORAL, DISPLAY),
            ("Ce ați făcut de fapt", 20, True, WHITE, DISPLAY, PP_ALIGN.CENTER, 10),
            ("O meserie reală\ndin IT…", 16, False, FOAM, BODY, PP_ALIGN.CENTER, 10),
        ],
    )
    set_notes(
        s,
        [
            "Întreabă grăbita: „Ce credeți că ați făcut azi, pe scurt?”",
            "Lasă-i să zică „am căutat greșeli / probleme pe ecrane”.",
            "Spune că aveți o surpriză: meseria pe care ați practicat-o are un nume.",
        ],
    )

    # ── 2 Reveal ────────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Revelație", "Ați făcut Software Testing", title_size=38)

    # magnifier-ish circle
    glass = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(2.4), Inches(2.5), Inches(2.6), Inches(2.6))
    set_solid_fill(glass, SEA_LIGHT)
    set_soft_shadow(glass)
    text_in(glass, [("🐞", 54, False, WHITE)])
    handle = s.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.5), Inches(4.55), Inches(1.35), Inches(0.38)
    )
    set_solid_fill(handle, SEA)
    try:
        handle.rotation = 40
    except Exception:
        pass

    badge = card(s, Inches(5.6), Inches(2.55), Inches(5.6), Inches(2.5), WHITE)
    text_in(
        badge,
        [
            ("QA", 36, True, SEA, DISPLAY),
            ("Quality Assurance", 20, True, SEA_DEEP, BODY, PP_ALIGN.CENTER, 6),
            ("Vânători de bug-uri profesioniști", 15, False, MUTED, BODY, PP_ALIGN.CENTER, 8),
        ],
    )
    stamp = card(s, Inches(6.4), Inches(5.4), Inches(4.0), Inches(0.7), CORAL, shadow=False, radius=0.2)
    text_in(stamp, [("CERTIFICAT DETECTIV", 14, True, WHITE, BODY)])
    set_notes(
        s,
        [
            "Explică pe scurt: înainte ca o aplicație să ajungă pe telefonul lor, cineva o „vânează” de greșeli.",
            "QA = Quality Assurance = „ne asigurăm că e de calitate”.",
            f"În joc ați fost exact echipa de QA din {APP}.",
        ],
    )

    # ── 3 Bug word ──────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Vocabular", "De unde vine „bug”?")

    a = card(s, Inches(1.15), Inches(2.15), Inches(4.8), Inches(4.2), WHITE)
    screen = card(s, Inches(2.05), Inches(2.65), Inches(3.0), Inches(2.15), SEA_DEEP, shadow=False, radius=0.1)
    text_in(screen, [("🐛", 40, False, WHITE), ("ERROR", 14, True, CORAL, BODY, PP_ALIGN.CENTER, 6)])
    base = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.55), Inches(4.85), Inches(2.0), Inches(0.22))
    set_solid_fill(base, SEA)
    cap = s.shapes.add_textbox(Inches(1.35), Inches(5.25), Inches(4.4), Inches(0.8))
    tf = cap.text_frame
    clear_tf(tf)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, "Un gândac real a stricat\nun computer vechi", 15, False, MUTED, BODY)

    arrow = s.shapes.add_textbox(Inches(6.15), Inches(3.7), Inches(1.0), Inches(0.7))
    tf = arrow.text_frame
    clear_tf(tf)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, "→", 44, True, SEA_LIGHT, BODY)

    b = card(s, Inches(7.35), Inches(2.15), Inches(4.8), Inches(4.2), SOFT_TEAL, shadow=True)
    text_in(
        b,
        [
            ("💻💥", 40, False, INK),
            ("Azi = „bug”", 26, True, SEA_DEEP, DISPLAY, PP_ALIGN.CENTER, 14),
            ("Orice greșeală în program\n— de găsit și reparat", 16, False, MUTED, BODY, PP_ALIGN.CENTER, 12),
        ],
    )
    set_notes(
        s,
        [
            "Poveste scurtă: acum mult timp, un gândac real a stricat un computer — de-asta zicem „bug”.",
            "În joc le-ați zis „probleme”. În job se numesc bug-uri.",
            "Întreabă: „Cui i s-a blocat un joc / un story / o temă online?”",
        ],
    )

    # ── 4 Bridge ────────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Joc → job", "Aceiași pași, alt vocabular", title_size=36)
    steps = [
        ("👀", "Ai observat", "Bug detection"),
        ("🎯", "Ai marcat zona", "Localizare"),
        ("📸", "Screenshot", "Evidence"),
        ("✍️", "Ai raportat", "Bug report"),
        ("⚖️", "Așteptat vs real", "Expected / Actual"),
    ]
    for i, (icon, game, qa) in enumerate(steps):
        x = Inches(0.45 + i * 2.55)
        top = card(s, x, Inches(2.2), Inches(2.4), Inches(1.7), WHITE)
        text_in(
            top,
            [
                (icon, 28, False, INK),
                (game, 13, True, SEA_DEEP, BODY, PP_ALIGN.CENTER, 6),
            ],
        )
        num = s.shapes.add_shape(MSO_SHAPE.OVAL, x + Inches(0.9), Inches(4.05), Inches(0.55), Inches(0.55))
        set_solid_fill(num, SEA_LIGHT)
        text_in(num, [(str(i + 1), 14, True, WHITE)])
        bot = card(s, x, Inches(4.8), Inches(2.4), Inches(1.55), SEA_DEEP)
        text_in(bot, [(qa, 14, True, WHITE, BODY)])
    set_notes(
        s,
        [
            "Arată pe ecran (sau pe Review) un raport al lor: selecție + text.",
            "Leagă fiecare pas: observat = bug detection; marcat = localizare; screenshot = evidence; textul = bug report.",
            "„Ce ar fi trebuit” vs „ce s-a întâmplat” = expected vs actual.",
        ],
    )

    # ── 5 Mismatch ──────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Bug-uri din misiune", "Când imaginea minte", title_size=36)
    mismatches = [
        ("Scena 1", "Text vs iconiță", "🚤", "„Ai ajuns cu barca”", "🚗", "Pe ecran: mașină"),
        ("Scena 3", "Nume greșit", "🐢", "Tessa", "📋", "Fișa zice Tina"),
        ("Scena 10", "Specie greșită", "🦜", "Kiko = papagal", "🙈", "Etichetă: Maimuță"),
    ]
    for i, (tag, label, li, lc, ri, rc) in enumerate(mismatches):
        x = Inches(0.55 + i * 4.2)
        card(s, x, Inches(2.05), Inches(4.0), Inches(4.5), WHITE)
        pill(s, x + Inches(1.15), Inches(2.25), Inches(1.7), Inches(0.38), SEA_LIGHT, tag, 11, WHITE)
        leftb = card(s, x + Inches(0.25), Inches(2.85), Inches(1.55), Inches(2.0), SOFT_TEAL, shadow=False)
        text_in(leftb, [(li, 28, False, INK), (lc, 11, True, SEA_DEEP, BODY, PP_ALIGN.CENTER, 6)])
        neq = s.shapes.add_textbox(x + Inches(1.8), Inches(3.5), Inches(0.4), Inches(0.5))
        tf = neq.text_frame
        clear_tf(tf)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run(p, "≠", 22, True, CORAL, BODY)
        rightb = card(s, x + Inches(2.2), Inches(2.85), Inches(1.55), Inches(2.0), SOFT_CORAL, shadow=False)
        text_in(rightb, [(ri, 28, False, INK), (rc, 11, True, CORAL_DEEP, BODY, PP_ALIGN.CENTER, 6)])
        lab = s.shapes.add_textbox(x, Inches(5.15), Inches(4.0), Inches(0.5))
        tf = lab.text_frame
        clear_tf(tf)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run(p, label, 14, True, MUTED, BODY)
    set_notes(
        s,
        [
            "Dacă ai al doilea ecran: deschide Mod Review → scenele 1, 3, 10.",
            "Spune: uneori bug-ul e o nepotrivire între ce scrie și ce vezi.",
            "În QA: verificăm UI-ul și datele — nu doar „merge butonul?”, ci „are sens ce scrie?”.",
        ],
    )

    # ── 6 Logic ─────────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Bug-uri din misiune", "Când logica o ia razna", title_size=36)
    logic = [
        ("➡️", "Pădurea", "Dreapta → Centru", "Dreapta → Poiană ↑"),
        ("💧", "Rucsacul", "3 sticle = ×3", "Contorul rămâne ×2"),
        ("🏥", "Filtrul „Toate”", "5 animale", "4 pe listă — Pico 👻"),
    ]
    for i, (icon, title, expected, actual) in enumerate(logic):
        x = Inches(0.55 + i * 4.2)
        card(s, x, Inches(2.1), Inches(4.0), Inches(4.4), WHITE)
        head = s.shapes.add_textbox(x + Inches(0.2), Inches(2.3), Inches(3.6), Inches(0.9))
        tf = head.text_frame
        clear_tf(tf)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run(p, f"{icon}  {title}", 20, True, SEA_DEEP, DISPLAY)
        okb = card(s, x + Inches(0.3), Inches(3.5), Inches(3.4), Inches(1.15), SOFT_LEAF, shadow=False)
        text_in(
            okb,
            [
                ("AR TREBUI", 10, True, LEAF, BODY),
                (expected, 15, True, SEA_DEEP, BODY, PP_ALIGN.CENTER, 4),
            ],
        )
        badb = card(s, x + Inches(0.3), Inches(4.85), Inches(3.4), Inches(1.15), SOFT_CORAL, shadow=False)
        text_in(
            badb,
            [
                ("ÎN JOC", 10, True, CORAL_DEEP, BODY),
                (actual, 15, True, SEA_DEEP, BODY, PP_ALIGN.CENTER, 4),
            ],
        )
    set_notes(
        s,
        [
            "Review: scenele 5, 4, 8 — sau povestește din memorie.",
            "Astea sunt bug-uri de logică / stare: programul „crede” ceva greșit.",
            "QA apasă, numără, schimbă filtrele — exact ce ați făcut voi.",
        ],
    )

    # ── 7 Trust ─────────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Bug-uri din misiune", "Nu crede bifa verde!", title_size=36)
    trust = [
        ("🦊", "„Gata, a băut apă”", "Ruxi e tot însetată"),
        ("🤖", "Bot: Habitat apt ✓", "Dosarul are avertismente"),
        ("📸", "„Eliberare 17:20”", "E poza de la prânz"),
    ]
    for i, (icon, fake, real) in enumerate(trust):
        x = Inches(0.55 + i * 4.2)
        card(s, x, Inches(2.2), Inches(4.0), Inches(4.2), WHITE)
        fakeb = card(s, x + Inches(0.3), Inches(2.6), Inches(3.4), Inches(1.5), SOFT_LEAF, shadow=False)
        text_in(
            fakeb,
            [
                ("✓  PARE OK", 11, True, LEAF, BODY),
                (fake, 15, True, SEA_DEEP, BODY, PP_ALIGN.CENTER, 8),
            ],
        )
        realb = card(s, x + Inches(0.3), Inches(4.35), Inches(3.4), Inches(1.6), SOFT_CORAL, shadow=False)
        text_in(
            realb,
            [
                (f"{icon}  REALITATEA", 11, True, CORAL_DEEP, BODY),
                (real, 16, True, SEA_DEEP, BODY, PP_ALIGN.CENTER, 8),
            ],
        )
    set_notes(
        s,
        [
            "Scenele 6, 11, 12 — perfecte pentru „nu crede orbeste ecranul”.",
            "Mesaj: un QA bun e curajos să zică „asta nu e corect”, chiar dacă aplicația arată un bife verde.",
            "În viața reală: alerte false, mesaje de succes greșite, poze greșit etichetate.",
        ],
    )

    # ── 8 Real life ─────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Viața ta = jobul de QA", "Le-ai trăit deja pe telefon", title_size=34)
    lead = s.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(11.3), Inches(0.4))
    tf = lead.text_frame
    clear_tf(tf)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, "Dacă ți s-a întâmplat — un QA ar fi trebuit să prindă asta înainte", 14, False, MUTED, BODY)

    real = [
        ("🎮", "Jocuri", "Scorul nu se salvează / skin-ul nu apare", "„Ce se întâmplă după Continua?”"),
        ("💬", "Chat & social", "Mesaj dublu sau „trimis” nevăzut", "„Ce vede celălalt utilizator?”"),
        ("📚", "Școală / teme", "Ecran OK, la profesor nu e nimic", "„Succes pe ecran = realitate?”"),
        ("🛒", "Magazin în app", "Ai plătit — itemul lipsește", "„Banii au plecat, produsul a venit?”"),
        ("🔔", "Notificări", "De 10 ori… sau deloc", "„Când e prea mult / puțin?”"),
        ("🚌", "Hărți & orare", "„Vine în 2 min” de 15 minute", "„Informația e actualizată?”"),
    ]
    for i, (icon, where, bug, ask) in enumerate(real):
        col, row = i % 3, i // 3
        x = Inches(0.45 + col * 4.25)
        y = Inches(2.2 + row * 2.4)
        c = card(s, x, y, Inches(4.05), Inches(2.2), WHITE)
        text_in(
            c,
            [
                (f"{icon}  {where}", 15, True, SEA_DEEP, DISPLAY),
                (bug, 13, False, MUTED, BODY, PP_ALIGN.CENTER, 8),
                (f"QA: {ask}", 12, True, SEA, BODY, PP_ALIGN.CENTER, 10),
            ],
        )
    set_notes(
        s,
        [
            "Nu numi branduri — vorbește generic: joc, chat, catalog, magazin în app.",
            "Lasă 20–30 secunde: „Ridicați mâna dacă vi s-a întâmplat măcar unul.”",
            "QA testează exact astea înainte să ajungă la milioane de utilizatori.",
            "Leagă de joc: „Succes pe ecran ≠ adevăr” — ca la Ruxi / bot / poza de eliberare.",
        ],
    )

    # ── 9 Day job ───────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Jobul", "O zi de QA arată cam așa", title_size=36)
    day = [
        ("09:00", "🧪", "Încerci app-ul"),
        ("11:00", "🐞", "Găsești bug-uri"),
        ("13:00", "📝", "Scrii rapoarte"),
        ("15:00", "🤝", "Cu programatorii"),
        ("17:00", "🔁", "Verifici din nou"),
    ]
    track = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.1), Inches(4.35), Inches(11.1), Inches(0.12))
    set_solid_fill(track, SEA_LIGHT)
    for i, (time, icon, label) in enumerate(day):
        x = Inches(0.85 + i * 2.45)
        c = card(s, x, Inches(2.25), Inches(2.25), Inches(4.2), WHITE)
        text_in(
            c,
            [
                (time, 14, True, SEA_LIGHT, BODY),
                (icon, 36, False, INK, BODY, PP_ALIGN.CENTER, 10),
                (label, 15, True, SEA_DEEP, BODY, PP_ALIGN.CENTER, 10),
            ],
        )
        # bring track visually behind cards already ok
    set_notes(
        s,
        [
            "Nu e doar „apasă random”: e ca o misiune cu obiective — ca ecranele voastre.",
            "După ce developerii repară, QA verifică din nou (retest).",
            "Nu trebuie să fii „cel mai bun la mate” — trebuie să fii curios și clar când explici.",
        ],
    )

    # ── 10 Chaos ────────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "De ce contează", "Fără QA… haos pe telefon", title_size=36)
    phone = card(s, Inches(0.9), Inches(2.1), Inches(3.7), Inches(4.5), SEA_DEEP, radius=0.2)
    text_in(
        phone,
        [
            ("💥", 48, False, WHITE),
            ("App crashed", 22, True, WHITE, DISPLAY, PP_ALIGN.CENTER, 10),
            ("retry?", 16, False, FOAM, BODY, PP_ALIGN.CENTER, 8),
        ],
    )
    chaos = [
        ("🎮", "Jocul se blochează", "exact în finală / rank"),
        ("📱", "Story-ul nu urcă", "sau like-ul „dispare”"),
        ("📚", "Catalog online greșit", "nota / absența e aiurea"),
        ("🎵", "Melodia sare", "sau video-ul se blochează"),
    ]
    for i, (icon, title, vibe) in enumerate(chaos):
        y = Inches(2.1 + i * 1.1)
        c = card(s, Inches(5.0), y, Inches(7.4), Inches(0.98), WHITE)
        text_in(
            c,
            [(f"{icon}   {title}   —   {vibe}", 17, True, SEA_DEEP, BODY, PP_ALIGN.LEFT)],
            valign=MSO_ANCHOR.MIDDLE,
        )
    set_notes(
        s,
        [
            "Reia 1–2 exemple de pe slide-ul anterior (joc, catalog, plată).",
            "Un bug mic pe ecran poate ascunde o problemă mare în spate.",
            f"În {APP} ați protejat „utilizatorii” de pe insulă — în job protejezi utilizatori reali.",
        ],
    )

    # ── 11 Powers ───────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Superputerile voastre", "Power-up-uri deblocate azi", title_size=36)
    powers = [
        ("🔎", "Ochi de vultur", "Vezi ce nu se potrivește", SEA_LIGHT),
        ("🧩", "Detective mode", "„Hmm, ciudat…”", CORAL),
        ("🗣️", "Raport clar", "Alții înțeleg din prima", LEAF_LIGHT),
        ("💪", "Retry power", "Greșeala nu te oprește", SEA),
    ]
    for i, (icon, title, blurb, accent) in enumerate(powers):
        x = Inches(0.55 + i * 3.2)
        card(s, x, Inches(2.2), Inches(3.0), Inches(4.2), WHITE)
        badge = s.shapes.add_shape(MSO_SHAPE.OVAL, x + Inches(0.85), Inches(2.55), Inches(1.3), Inches(1.3))
        set_solid_fill(badge, accent)
        text_in(badge, [(icon, 28, False, WHITE)])
        title_box = s.shapes.add_textbox(x + Inches(0.15), Inches(4.1), Inches(2.7), Inches(1.3))
        tf = title_box.text_frame
        clear_tf(tf)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run(p, title, 18, True, SEA_DEEP, DISPLAY)
        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.CENTER
        p2.space_before = Pt(8)
        run(p2, blurb, 14, False, MUTED, BODY)
        bar = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.7), Inches(5.7), Inches(1.6), Inches(0.14))
        set_solid_fill(bar, accent)
    set_notes(
        s,
        [
            "Amintește-le: greșelile la selecție nu le-au luat stele — în QA e normal să explorezi.",
            "Raportul bun = colegul care repară înțelege din prima.",
            "Întreabă: „Care bug v-a plăcut cel mai mult să-l găsiți?”",
        ],
    )

    # ── 12 Path ─────────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Poate e pentru tine", "Ți-a plăcut să cauți greșeli?", title_size=34)
    you = card(s, Inches(4.15), Inches(1.95), Inches(5.0), Inches(1.15), SEA_LIGHT)
    text_in(you, [("🕵️   Ție ți-a plăcut?", 22, True, WHITE, DISPLAY)])
    qa = card(s, Inches(1.2), Inches(3.5), Inches(5.1), Inches(3.0), WHITE)
    text_in(
        qa,
        [
            ("🐞", 40, False, INK),
            ("QA", 26, True, SEA, DISPLAY, PP_ALIGN.CENTER, 8),
            ("Pui aplicația la încercare", 15, False, MUTED, BODY, PP_ALIGN.CENTER, 8),
        ],
    )
    other = card(s, Inches(7.0), Inches(3.5), Inches(5.1), Inches(3.0), WHITE)
    text_in(
        other,
        [
            ("👩‍💻", 40, False, INK),
            ("sau altceva în IT", 22, True, CORAL, DISPLAY, PP_ALIGN.CENTER, 8),
            ("Curiozitatea rămâne arma ta", 15, False, MUTED, BODY, PP_ALIGN.CENTER, 8),
        ],
    )
    set_notes(
        s,
        [
            "Ton ușor, fără presiune: e o meserie reală, cu salariu, echipe, proiecte.",
            "Poți menționa pe scurt că există cursuri / licee IT / facultăți — fără listă lungă.",
            f"Închide cu: „Azi ați fost deja junior QA în {APP}.”",
        ],
    )

    # ── 13 Finale ───────────────────────────────────────────
    s = prs.slides.add_slide(blank)
    # darker celebratory bg
    bg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, W, H)
    set_solid_fill(bg, SEA_DEEP)
    b1 = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(3), Inches(-1), Inches(7), Inches(3))
    set_solid_fill(b1, SEA)
    spPr = b1._element.spPr
    solidFill = spPr.find(qn("a:solidFill"))
    if solidFill is not None:
        srgb = solidFill.find(qn("a:srgbClr"))
        if srgb is not None:
            etree.SubElement(srgb, qn("a:alpha"), {"val": "40000"})
    b2 = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(9.5), Inches(5), Inches(5), Inches(3.5))
    set_solid_fill(b2, CORAL)
    spPr = b2._element.spPr
    solidFill = spPr.find(qn("a:solidFill"))
    if solidFill is not None:
        srgb = solidFill.find(qn("a:srgbClr"))
        if srgb is not None:
            etree.SubElement(srgb, qn("a:alpha"), {"val": "25000"})

    eye = s.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.7), Inches(0.4))
    tf = eye.text_frame
    clear_tf(tf)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, "FINAL", 14, True, SEA_LIGHT, BODY)

    t = s.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.7), Inches(1.0))
    tf = t.text_frame
    clear_tf(tf)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, "Misiune îndeplinită!", 44, True, WHITE, DISPLAY)

    stars = s.shapes.add_textbox(Inches(0.8), Inches(3.0), Inches(11.7), Inches(0.9))
    tf = stars.text_frame
    clear_tf(tf)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run(p, "⭐     🐞     ⭐", 40, False, WHITE, BODY)

    banner = card(s, Inches(3.4), Inches(4.2), Inches(6.5), Inches(1.1), SEA_LIGHT)
    text_in(banner, [(f"Junior QA — {APP}", 20, True, WHITE, DISPLAY)])
    q = card(s, Inches(5.1), Inches(5.7), Inches(3.1), Inches(0.9), CORAL)
    text_in(q, [("Întrebări?", 24, True, WHITE, DISPLAY)])
    set_notes(
        s,
        [
            "Lasă 2–3 minute pentru întrebări.",
            "Dacă se blochează: „Care a fost cel mai sneaky bug?” / „Ce ați verifica voi într-un joc sau la catalogul online?”",
            "Mulțumește-le și trimite-i înapoi la ecranul de start când termini.",
        ],
    )

    OUT_PPTX.parent.mkdir(parents=True, exist_ok=True)
    OUT_COPY.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(OUT_PPTX))
    prs.save(str(OUT_COPY))
    print(OUT_PPTX)
    print(OUT_COPY)


if __name__ == "__main__":
    build()
