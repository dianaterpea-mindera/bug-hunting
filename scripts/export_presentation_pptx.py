#!/usr/bin/env python3
"""Export the QA wrap-up presentation to PowerPoint (.pptx) for Keynote / PowerPoint."""

from __future__ import annotations

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

APP_NAME = "Insula după furtună"
OUT = Path(__file__).resolve().parents[1] / "presentations" / "Insula-dupa-furtuna-QA.key.pptx"

# Theme (island / sea)
SEA_DEEP = RGBColor(0x0F, 0x3D, 0x4C)
SEA = RGBColor(0x1F, 0x6F, 0x7E)
TEAL = RGBColor(0x3A, 0x9A, 0xAD)
CORAL = RGBColor(0xE0, 0x7A, 0x5F)
FOAM = RGBColor(0xF4, 0xF8, 0xF9)
CARD = RGBColor(0xFF, 0xFF, 0xFF)
MUTED = RGBColor(0x5A, 0x6F, 0x78)
OK = RGBColor(0x2F, 0x9E, 0x6E)
BAD = RGBColor(0xC4, 0x4E, 0x4E)
SOFT = RGBColor(0xE8, 0xF2, 0xF4)


def set_run(run, text: str, size: int, bold: bool = False, color: RGBColor = SEA_DEEP):
    run.text = text
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = "Helvetica Neue"


def add_textbox(slide, left, top, width, height, text, size=18, bold=False, color=SEA_DEEP, align=PP_ALIGN.LEFT):
    box = slide.shapes.add_textbox(left, top, width, height)
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    set_run(p.add_run() if not p.runs else p.runs[0], text, size, bold, color)
    if not p.runs:
        set_run(p.add_run(), text, size, bold, color)
    else:
        # first run may already exist empty from paragraph
        if p.runs[0].text == "":
            set_run(p.runs[0], text, size, bold, color)
        else:
            set_run(p.runs[0], text, size, bold, color)
    return box


def clear_and_set(tf, text, size=18, bold=False, color=SEA_DEEP, align=PP_ALIGN.LEFT):
    tf.clear()
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    set_run(p.add_run(), text, size, bold, color)


def add_para(tf, text, size=16, bold=False, color=SEA_DEEP, align=PP_ALIGN.LEFT, space_before=6):
    p = tf.add_paragraph()
    p.alignment = align
    p.space_before = Pt(space_before)
    set_run(p.add_run(), text, size, bold, color)
    return p


def fill_shape(shape, color: RGBColor):
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()


def rounded_card(slide, left, top, width, height, fill=CARD):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    fill_shape(shape, fill)
    shape.adjustments[0] = 0.12
    return shape


def set_notes(slide, notes: list[str]):
    notes_slide = slide.notes_slide
    tf = notes_slide.notes_text_frame
    tf.clear()
    for i, note in enumerate(notes):
        if i == 0:
            p = tf.paragraphs[0]
            set_run(p.add_run(), f"• {note}", 14, False, SEA_DEEP)
        else:
            p = tf.add_paragraph()
            set_run(p.add_run(), f"• {note}", 14, False, SEA_DEEP)


def eyebrow_title(slide, eyebrow: str, title: str, title_size: int = 36):
    add_textbox(
        slide,
        Inches(0.6),
        Inches(0.35),
        Inches(12.1),
        Inches(0.4),
        eyebrow.upper(),
        size=13,
        bold=True,
        color=SEA,
        align=PP_ALIGN.CENTER,
    )
    add_textbox(
        slide,
        Inches(0.6),
        Inches(0.75),
        Inches(12.1),
        Inches(1.0),
        title,
        size=title_size,
        bold=True,
        color=SEA_DEEP,
        align=PP_ALIGN.CENTER,
    )


def paint_bg(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    fill_shape(bg, FOAM)
    # decorative soft blobs
    blob = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(3.5), Inches(-1.2), Inches(6.5), Inches(3.2))
    fill_shape(blob, SOFT)
    blob2 = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(10.5), Inches(5.2), Inches(4), Inches(3))
    fill_shape(blob2, RGBColor(0xFB, 0xEB, 0xE6))
    # send decorative shapes to back by moving XML
    spTree = slide.shapes._spTree
    for el in (blob2._element, blob._element, bg._element):
        spTree.remove(el)
        spTree.insert(2, el)


def card_text(shape, lines: list[tuple[str, int, bool, RGBColor]], align=PP_ALIGN.CENTER):
    tf = shape.text_frame
    tf.clear()
    tf.word_wrap = True
    tf.auto_size = None
    for i, (text, size, bold, color) in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_before = Pt(4 if i else 0)
        set_run(p.add_run(), text, size, bold, color)


def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # 1 Hook
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "După misiune", "Ați salvat animale… sau?")
    left = rounded_card(s, Inches(1.4), Inches(2.2), Inches(4.4), Inches(3.6), CARD)
    card_text(
        left,
        [
            ("🐢 🦜 🦊", 28, False, SEA_DEEP),
            ("Ce ați crezut", 22, True, SEA_DEEP),
            (f"Salvatori în {APP_NAME}", 16, False, MUTED),
        ],
    )
    vs = rounded_card(s, Inches(6.05), Inches(3.4), Inches(1.2), Inches(1.0), TEAL)
    card_text(vs, [("VS", 20, True, CARD)])
    right = rounded_card(s, Inches(7.5), Inches(2.2), Inches(4.4), Inches(3.6), SEA_DEEP)
    card_text(
        right,
        [
            ("?", 40, True, CORAL),
            ("Ce ați făcut de fapt", 20, True, CARD),
            ("O meserie reală din IT…", 16, False, RGBColor(0xC8, 0xE0, 0xE6)),
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

    # 2 Reveal
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Revelație", "Ați făcut Software Testing", 34)
    badge = rounded_card(s, Inches(3.2), Inches(2.3), Inches(6.9), Inches(2.4), CARD)
    card_text(
        badge,
        [
            ("QA  ·  Quality Assurance", 28, True, SEA),
            ("Vânători de bug-uri profesioniști", 18, False, MUTED),
            ("CERTIFICAT DETECTIV", 14, True, CORAL),
        ],
    )
    bug = rounded_card(s, Inches(5.9), Inches(5.0), Inches(1.5), Inches(1.3), TEAL)
    card_text(bug, [("🐞", 36, False, CARD)])
    set_notes(
        s,
        [
            "Explică pe scurt: înainte ca o aplicație să ajungă pe telefonul lor, cineva o „vânează” de greșeli.",
            "QA = Quality Assurance = „ne asigurăm că e de calitate”.",
            f"În joc ați fost exact echipa de QA din {APP_NAME}.",
        ],
    )

    # 3 Bug word
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Vocabular", "De unde vine „bug”?", 34)
    a = rounded_card(s, Inches(1.3), Inches(2.2), Inches(4.6), Inches(3.8), CARD)
    card_text(
        a,
        [
            ("🐛  ERROR", 26, True, BAD),
            ("Un gândac real a stricat\nun computer vechi", 16, False, MUTED),
        ],
    )
    arrow = add_textbox(s, Inches(6.1), Inches(3.6), Inches(1), Inches(0.6), "→", 40, True, TEAL, PP_ALIGN.CENTER)
    b = rounded_card(s, Inches(7.4), Inches(2.2), Inches(4.6), Inches(3.8), SOFT)
    card_text(
        b,
        [
            ("💻💥", 28, False, SEA_DEEP),
            ("Azi = „bug”", 22, True, SEA_DEEP),
            ("Orice greșeală în program\n— de găsit și reparat", 16, False, MUTED),
        ],
    )
    set_notes(
        s,
        [
            "Poveste scurtă: acum mult timp, un gândac real a stricat un computer — de-asta zicem „bug”.",
            "În joc le-ați zis „probleme”. În job se numesc bug-uri.",
            "Întreabă: „Cui i s-a blocat un joc / un story / o temă online?” — treci apoi la slide-ul cu exemple.",
        ],
    )

    # 4 Bridge
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Joc → job", "Aceiași pași, alt vocabular", 34)
    steps = [
        ("👀", "Ai observat", "Bug detection"),
        ("🎯", "Ai marcat zona", "Localizare"),
        ("📸", "Screenshot", "Evidence"),
        ("✍️", "Ai raportat", "Bug report"),
        ("⚖️", "Așteptat vs real", "Expected / Actual"),
    ]
    for i, (icon, game, qa) in enumerate(steps):
        x = Inches(0.55 + i * 2.55)
        card = rounded_card(s, x, Inches(2.3), Inches(2.35), Inches(3.8), CARD)
        card_text(
            card,
            [
                (icon, 26, False, SEA_DEEP),
                (game, 13, True, SEA_DEEP),
                (f"{i + 1}", 12, True, TEAL),
                (qa, 14, True, SEA),
            ],
        )
    set_notes(
        s,
        [
            "Arată pe ecran (sau pe Review) un raport al lor: selecție + text.",
            "Leagă fiecare pas: observat = bug detection; marcat = localizare; screenshot = evidence; textul = bug report.",
            "„Ce ar fi trebuit” vs „ce s-a întâmplat” = expected vs actual — limba pe care o folosesc testerii în fiecare zi.",
        ],
    )

    # 5 Mismatch
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Bug-uri din misiune", "Când imaginea minte", 34)
    mismatches = [
        ("Scena 1", "Text vs iconiță", "🚤 „Ai ajuns cu barca”", "🚗 Pe ecran: mașină"),
        ("Scena 3", "Nume greșit", "🐢 Tessa", "📋 Fișa zice Tina"),
        ("Scena 10", "Specie greșită", "🦜 Kiko = papagal", "🙈 Etichetă: Maimuță"),
    ]
    for i, (tag, label, left_t, right_t) in enumerate(mismatches):
        x = Inches(0.7 + i * 4.15)
        card = rounded_card(s, x, Inches(2.15), Inches(3.9), Inches(4.2), CARD)
        card_text(
            card,
            [
                (tag, 12, True, TEAL),
                (f"{left_t}\n≠\n{right_t}", 15, False, SEA_DEEP),
                (label, 14, True, MUTED),
            ],
        )
    set_notes(
        s,
        [
            "Dacă ai al doilea ecran: deschide Mod Review → scenele 1, 3, 10.",
            "Spune: uneori bug-ul e o nepotrivire între ce scrie și ce vezi.",
            "În QA: verificăm UI-ul și datele — nu doar „merge butonul?”, ci „are sens ce scrie?”.",
        ],
    )

    # 6 Logic
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Bug-uri din misiune", "Când logica o ia razna", 34)
    logic = [
        ("➡️", "Pădurea", "Dreapta → Centru", "Dreapta → Poiană ↑"),
        ("💧", "Rucsacul", "3 sticle = ×3", "Contorul rămâne ×2"),
        ("🏥", "Filtrul „Toate”", "5 animale", "4 pe listă — Pico 👻"),
    ]
    for i, (icon, title, expected, actual) in enumerate(logic):
        x = Inches(0.7 + i * 4.15)
        card = rounded_card(s, x, Inches(2.15), Inches(3.9), Inches(4.2), CARD)
        card_text(
            card,
            [
                (f"{icon}  {title}", 18, True, SEA_DEEP),
                (f"Ar trebui\n{expected}", 14, False, OK),
                (f"În joc\n{actual}", 14, False, BAD),
            ],
        )
    set_notes(
        s,
        [
            "Review: scenele 5, 4, 8 — sau povestește din memorie dacă nu vrei să schimbi ecranul.",
            "Astea sunt bug-uri de logică / stare: programul „crede” ceva greșit.",
            "QA apasă, numără, schimbă filtrele — exact ce ați făcut voi.",
        ],
    )

    # 7 Trust
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Bug-uri din misiune", "Nu crede bifa verde!", 34)
    trust = [
        ("🦊", "„Gata, a băut apă”", "Ruxi e tot însetată"),
        ("🤖", "Bot: Habitat apt ✓", "Dosarul are avertismente"),
        ("📸", "„Eliberare 17:20”", "E poza de la prânz"),
    ]
    for i, (icon, fake, real) in enumerate(trust):
        x = Inches(0.7 + i * 4.15)
        card = rounded_card(s, x, Inches(2.3), Inches(3.9), Inches(3.9), CARD)
        card_text(
            card,
            [
                (f"✓  {fake}", 15, True, OK),
                (f"{icon}  {real}", 16, True, BAD),
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

    # 8 Real life
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Viața ta = jobul de QA", "Le-ai trăit deja pe telefon", 32)
    add_textbox(
        s,
        Inches(0.8),
        Inches(1.7),
        Inches(11.7),
        Inches(0.45),
        "Dacă ți s-a întâmplat — un QA ar fi trebuit să prindă asta înainte",
        14,
        False,
        MUTED,
        PP_ALIGN.CENTER,
    )
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
        x = Inches(0.55 + col * 4.2)
        y = Inches(2.25 + row * 2.35)
        card = rounded_card(s, x, y, Inches(4.0), Inches(2.15), CARD)
        card_text(
            card,
            [
                (f"{icon}  {where}", 14, True, SEA_DEEP),
                (bug, 12, False, MUTED),
                (f"QA: {ask}", 11, True, SEA),
            ],
        )
    set_notes(
        s,
        [
            "Nu numi branduri ca să „dai vina” — vorbește generic: joc, chat, catalog, magazin în app.",
            "Lasă 20–30 secunde: „Ridicați mâna dacă vi s-a întâmplat măcar unul.”",
            "Mesaj: QA e persoana care testează exact astea înainte să ajungă la milioane de utilizatori.",
            "Leagă de joc: „Succes pe ecran ≠ adevăr” — ca la Ruxi / bot / poza de eliberare.",
        ],
    )

    # 9 Day job
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Jobul", "O zi de QA arată cam așa", 34)
    day = [
        ("09:00", "🧪", "Încerci app-ul"),
        ("11:00", "🐞", "Găsești bug-uri"),
        ("13:00", "📝", "Scrii rapoarte"),
        ("15:00", "🤝", "Cu programatorii"),
        ("17:00", "🔁", "Verifici din nou"),
    ]
    track = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.2), Inches(4.05), Inches(10.9), Inches(0.08))
    fill_shape(track, TEAL)
    for i, (time, icon, label) in enumerate(day):
        x = Inches(1.0 + i * 2.4)
        card = rounded_card(s, x, Inches(2.5), Inches(2.1), Inches(3.5), CARD)
        card_text(
            card,
            [
                (time, 14, True, TEAL),
                (icon, 28, False, SEA_DEEP),
                (label, 14, True, SEA_DEEP),
            ],
        )
    set_notes(
        s,
        [
            "Nu e doar „apasă random”: e ca o misiune cu obiective — ca ecranele voastre.",
            "După ce developerii repară, QA verifică din nou (retest) — ca steaua plină din prima vs după greșeli.",
            "Nu trebuie să fii „cel mai bun la mate” — trebuie să fii curios și clar când explici.",
        ],
    )

    # 10 Chaos / why
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "De ce contează", "Fără QA… haos pe telefon", 34)
    phone = rounded_card(s, Inches(0.8), Inches(2.2), Inches(3.6), Inches(4.2), SEA_DEEP)
    card_text(
        phone,
        [
            ("💥", 36, False, CARD),
            ("App crashed", 20, True, CARD),
            ("retry?", 14, False, RGBColor(0xC8, 0xE0, 0xE6)),
        ],
    )
    chaos = [
        ("🎮", "Jocul se blochează", "exact în finală / rank"),
        ("📱", "Story-ul nu urcă", "sau like-ul „dispare”"),
        ("📚", "Catalog online greșit", "nota / absența e aiurea"),
        ("🎵", "Melodia sare", "sau video-ul se blochează"),
    ]
    for i, (icon, title, vibe) in enumerate(chaos):
        y = Inches(2.2 + i * 1.05)
        card = rounded_card(s, Inches(4.9), y, Inches(7.5), Inches(0.95), CARD)
        card_text(
            card,
            [(f"{icon}  {title}  —  {vibe}", 16, True, SEA_DEEP)],
            align=PP_ALIGN.LEFT,
        )
    set_notes(
        s,
        [
            "Reia 1–2 exemple de pe slide-ul anterior (joc, catalog, plată).",
            "Un bug mic pe ecran poate ascunde o problemă mare în spate.",
            f"În {APP_NAME} ați protejat „utilizatorii” de pe insulă — în job protejezi utilizatori reali.",
        ],
    )

    # 11 Powers
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Superputerile voastre", "Power-up-uri deblocate azi", 34)
    powers = [
        ("🔎", "Ochi de vultur", "Vezi ce nu se potrivește"),
        ("🧩", "Detective mode", "„Hmm, ciudat…”"),
        ("🗣️", "Raport clar", "Alții înțeleg din prima"),
        ("💪", "Retry power", "Greșeala nu te oprește"),
    ]
    for i, (icon, title, blurb) in enumerate(powers):
        x = Inches(0.7 + i * 3.15)
        card = rounded_card(s, x, Inches(2.4), Inches(2.95), Inches(3.6), CARD)
        card_text(
            card,
            [
                (icon, 32, False, SEA_DEEP),
                (title, 16, True, SEA_DEEP),
                (blurb, 13, False, MUTED),
            ],
        )
    set_notes(
        s,
        [
            "Amintește-le: greșelile la selecție nu le-au luat stele — în QA e normal să explorezi.",
            "Raportul bun = colegul care repară înțelege din prima.",
            "Întreabă: „Care bug v-a plăcut cel mai mult să-l găsiți?”",
        ],
    )

    # 12 Path
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Poate e pentru tine", "Ți-a plăcut să cauți greșeli?", 32)
    you = rounded_card(s, Inches(4.4), Inches(1.95), Inches(4.5), Inches(1.4), TEAL)
    card_text(you, [("🕵️  Ție ți-a plăcut?", 20, True, CARD)])
    qa = rounded_card(s, Inches(1.5), Inches(3.7), Inches(4.8), Inches(2.6), CARD)
    card_text(
        qa,
        [
            ("🐞", 28, False, SEA_DEEP),
            ("QA", 22, True, SEA),
            ("Pui aplicația la încercare", 15, False, MUTED),
        ],
    )
    other = rounded_card(s, Inches(7.0), Inches(3.7), Inches(4.8), Inches(2.6), CARD)
    card_text(
        other,
        [
            ("👩‍💻", 28, False, SEA_DEEP),
            ("sau altceva în IT", 20, True, CORAL),
            ("Curiozitatea rămâne arma ta", 15, False, MUTED),
        ],
    )
    set_notes(
        s,
        [
            "Ton ușor, fără presiune: e o meserie reală, cu salariu, echipe, proiecte.",
            "Poți menționa pe scurt că există cursuri / licee IT / facultăți — fără listă lungă.",
            f"Închide cu: „Azi ați fost deja junior QA în {APP_NAME}.”",
        ],
    )

    # 13 Finale
    s = prs.slides.add_slide(blank)
    paint_bg(s)
    eyebrow_title(s, "Final", "Misiune îndeplinită!", 40)
    stars = add_textbox(
        s,
        Inches(0.6),
        Inches(2.2),
        Inches(12.1),
        Inches(1.0),
        "⭐   🐞   ⭐",
        40,
        False,
        SEA_DEEP,
        PP_ALIGN.CENTER,
    )
    banner = rounded_card(s, Inches(3.2), Inches(3.4), Inches(6.9), Inches(1.3), SEA_DEEP)
    card_text(banner, [(f"Junior QA — {APP_NAME}", 22, True, CARD)])
    q = rounded_card(s, Inches(4.8), Inches(5.1), Inches(3.7), Inches(1.1), CORAL)
    card_text(q, [("Întrebări?", 24, True, CARD)])
    set_notes(
        s,
        [
            "Lasă 2–3 minute pentru întrebări.",
            "Dacă se blochează: „Care a fost cel mai sneaky bug?” / „Ce ați verifica voi într-un joc sau la catalogul online?”",
            "Mulțumește-le și trimite-i înapoi la ecranul de start când termini.",
        ],
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(OUT))
    desktop = Path.home() / "Desktop" / OUT.name
    prs.save(str(desktop))
    print(f"Saved: {OUT}")
    print(f"Saved: {desktop}")


if __name__ == "__main__":
    build()
