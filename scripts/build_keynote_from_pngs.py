#!/usr/bin/env python3
"""Build a PPTX where each slide is a full-bleed PNG (survives Keynote import)."""

from pathlib import Path

from pptx import Presentation
from pptx.util import Inches

APP = "Insula după furtună"
PNG_DIR = Path(__file__).resolve().parents[1] / "presentations" / "slide-pngs"
OUT = Path.home() / "Desktop" / "Insula-QA-vizual.pptx"
OUT_COPY = Path(__file__).resolve().parents[1] / "presentations" / "Insula-QA-vizual.pptx"

NOTES = [
    [
        "Întreabă grăbita: „Ce credeți că ați făcut azi, pe scurt?”",
        "Lasă-i să zică „am căutat greșeli / probleme pe ecrane”.",
        "Spune că aveți o surpriză: meseria pe care ați practicat-o are un nume.",
    ],
    [
        "Explică pe scurt: înainte ca o aplicație să ajungă pe telefonul lor, cineva o „vânează” de greșeli.",
        "QA = Quality Assurance = „ne asigurăm că e de calitate”.",
        f"În joc ați fost exact echipa de QA din {APP}.",
    ],
    [
        "Poveste scurtă: un gândac real a stricat un computer — de-asta zicem „bug”.",
        "În joc le-ați zis „probleme”. În job se numesc bug-uri.",
        "Întreabă: „Cui i s-a blocat un joc / un story / o temă online?”",
    ],
    [
        "Arată pe ecran (sau pe Review) un raport al lor: selecție + text.",
        "Leagă fiecare pas: observat = bug detection; marcat = localizare; screenshot = evidence; textul = bug report.",
        "„Ce ar fi trebuit” vs „ce s-a întâmplat” = expected vs actual.",
    ],
    [
        "Dacă ai al doilea ecran: deschide Mod Review → scenele 1, 3, 10.",
        "Spune: uneori bug-ul e o nepotrivire între ce scrie și ce vezi.",
        "În QA: verificăm UI-ul și datele — nu doar „merge butonul?”, ci „are sens ce scrie?”.",
    ],
    [
        "Review: scenele 5, 4, 8 — sau povestește din memorie.",
        "Astea sunt bug-uri de logică / stare: programul „crede” ceva greșit.",
        "QA apasă, numără, schimbă filtrele — exact ce ați făcut voi.",
    ],
    [
        "Scenele 6, 11, 12 — perfecte pentru „nu crede orbeste ecranul”.",
        "Un QA bun e curajos să zică „asta nu e corect”, chiar dacă aplicația arată un bife verde.",
        "În viața reală: alerte false, mesaje de succes greșite, poze greșit etichetate.",
    ],
    [
        "Nu numi branduri — vorbește generic: joc, chat, catalog, magazin în app.",
        "Lasă 20–30 secunde: „Ridicați mâna dacă vi s-a întâmplat măcar unul.”",
        "QA testează exact astea înainte să ajungă la milioane de utilizatori.",
        "Leagă de joc: „Succes pe ecran ≠ adevăr” — ca la Ruxi / bot / poza de eliberare.",
    ],
    [
        "Nu e doar „apasă random”: e ca o misiune cu obiective — ca ecranele voastre.",
        "După ce developerii repară, QA verifică din nou (retest).",
        "Nu trebuie să fii „cel mai bun la mate” — trebuie să fii curios și clar când explici.",
    ],
    [
        "Reia 1–2 exemple de pe slide-ul anterior (joc, catalog, plată).",
        "Un bug mic pe ecran poate ascunde o problemă mare în spate.",
        f"În {APP} ați protejat „utilizatorii” de pe insulă — în job protejezi utilizatori reali.",
    ],
    [
        "Amintește-le: greșelile la selecție nu le-au luat stele — în QA e normal să explorezi.",
        "Raportul bun = colegul care repară înțelege din prima.",
        "Întreabă: „Care bug v-a plăcut cel mai mult să-l găsiți?”",
    ],
    [
        "Ton ușor, fără presiune: e o meserie reală, cu salariu, echipe, proiecte.",
        "Poți menționa pe scurt că există cursuri / licee IT / facultăți — fără listă lungă.",
        f"Închide cu: „Azi ați fost deja junior QA în {APP}.”",
    ],
    [
        "Lasă 2–3 minute pentru întrebări.",
        "Dacă se blochează: „Care a fost cel mai sneaky bug?” / „Ce ați verifica voi într-un joc?”",
        "Mulțumește-le și trimite-i înapoi la ecranul de start când termini.",
    ],
]


def main():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    pngs = sorted(PNG_DIR.glob("slide-*.png"))
    if len(pngs) != 13:
        raise SystemExit(f"Expected 13 PNGs, found {len(pngs)} in {PNG_DIR}")

    for i, png in enumerate(pngs):
        slide = prs.slides.add_slide(blank)
        slide.shapes.add_picture(str(png), 0, 0, width=prs.slide_width, height=prs.slide_height)
        tf = slide.notes_slide.notes_text_frame
        tf.clear()
        for j, note in enumerate(NOTES[i]):
            p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
            p.text = f"• {note}"

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT_COPY.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(OUT))
    prs.save(str(OUT_COPY))
    print(OUT)
    print(OUT_COPY)


if __name__ == "__main__":
    main()
