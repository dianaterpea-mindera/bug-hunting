-- Export prezentarea QA din „Insula după furtună” ca document Keynote nativ.
-- Rulează: osascript scripts/export_presentation_keynote.applescript

property appName : "Insula după furtună"
property outName : "Insula-dupa-furtuna-QA.key"

on joinNotes(noteList)
	set AppleScript's text item delimiters to return & return
	set joined to noteList as text
	set AppleScript's text item delimiters to ""
	return joined
end joinNotes

on addSlide(theDoc, theTitle, theBody, theNotes)
	tell application "Keynote"
		tell theDoc
			set newSlide to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
			tell newSlide
				set object text of default title item to theTitle
				set object text of default body item to theBody
				set presenter notes to theNotes
			end tell
		end tell
	end tell
end addSlide

on addStatement(theDoc, theTitle, theBody, theNotes)
	tell application "Keynote"
		tell theDoc
			set newSlide to make new slide at end of slides with properties {base layout:slide layout "Statement"}
			tell newSlide
				try
					set object text of default title item to theTitle
				end try
				try
					set object text of default body item to theBody
				end try
				set presenter notes to theNotes
			end tell
		end tell
	end tell
end addStatement

tell application "Keynote"
	activate
	set theDoc to make new document with properties {document theme:theme "Basic White", width:1920, height:1080}
	
	-- remove the default empty first slide after we add ours
	tell theDoc
		-- Slide 1
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Ați salvat animale… sau?"
			set object text of default body item to "După misiune" & return & return & "🐢 🦜 🦊  Ce ați crezut: salvatori în " & appName & return & return & "VS" & return & return & "?  Ce ați făcut de fapt: o meserie reală din IT…"
			set presenter notes to "• Întreabă grăbita: „Ce credeți că ați făcut azi, pe scurt?”" & return & "• Lasă-i să zică „am căutat greșeli / probleme pe ecrane”." & return & "• Spune că aveți o surpriză: meseria pe care ați practicat-o are un nume."
		end tell
		
		-- Slide 2
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Ați făcut Software Testing"
			set object text of default body item to "Revelație" & return & return & "QA  ·  Quality Assurance" & return & "Vânători de bug-uri profesioniști" & return & return & "CERTIFICAT DETECTIV  🐞"
			set presenter notes to "• Explică pe scurt: înainte ca o aplicație să ajungă pe telefonul lor, cineva o „vânează” de greșeli." & return & "• QA = Quality Assurance = „ne asigurăm că e de calitate”." & return & "• În joc ați fost exact echipa de QA din " & appName & "."
		end tell
		
		-- Slide 3
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "De unde vine „bug”?"
			set object text of default body item to "Vocabular" & return & return & "🐛 Un gândac real a stricat un computer vechi" & return & "→" & return & "💻💥 Azi = „bug”: orice greșeală în program — de găsit și reparat"
			set presenter notes to "• Poveste scurtă: acum mult timp, un gândac real a stricat un computer — de-asta zicem „bug”." & return & "• În joc le-ați zis „probleme”. În job se numesc bug-uri." & return & "• Întreabă: „Cui i s-a blocat un joc / un story / o temă online?” — treci apoi la slide-ul cu exemple."
		end tell
		
		-- Slide 4
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Aceiași pași, alt vocabular"
			set object text of default body item to "Joc → job" & return & return & "👀 Ai observat → Bug detection" & return & "🎯 Ai marcat zona → Localizare" & return & "📸 Screenshot → Evidence" & return & "✍️ Ai raportat → Bug report" & return & "⚖️ Așteptat vs real → Expected / Actual"
			set presenter notes to "• Arată pe ecran (sau pe Review) un raport al lor: selecție + text." & return & "• Leagă fiecare pas: observat = bug detection; marcat = localizare; screenshot = evidence; textul = bug report." & return & "• „Ce ar fi trebuit” vs „ce s-a întâmplat” = expected vs actual — limba pe care o folosesc testerii în fiecare zi."
		end tell
		
		-- Slide 5
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Când imaginea minte"
			set object text of default body item to "Bug-uri din misiune" & return & return & "Scena 1 — Text vs iconiță: 🚤 „Ai ajuns cu barca” ≠ 🚗 mașină pe ecran" & return & "Scena 3 — Nume greșit: 🐢 Tessa ≠ 📋 Tina pe fișă" & return & "Scena 10 — Specie greșită: 🦜 Kiko = papagal ≠ 🙈 etichetă „Maimuță”"
			set presenter notes to "• Dacă ai al doilea ecran: deschide Mod Review → scenele 1, 3, 10." & return & "• Spune: uneori bug-ul e o nepotrivire între ce scrie și ce vezi." & return & "• În QA: verificăm UI-ul și datele — nu doar „merge butonul?”, ci „are sens ce scrie?”."
		end tell
		
		-- Slide 6
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Când logica o ia razna"
			set object text of default body item to "Bug-uri din misiune" & return & return & "➡️ Pădurea — Ar trebui: Dreapta → Centru / În joc: Dreapta → Poiană ↑" & return & "💧 Rucsacul — Ar trebui: 3 sticle = ×3 / În joc: contorul rămâne ×2" & return & "🏥 Filtrul „Toate” — Ar trebui: 5 animale / În joc: 4 pe listă — Pico 👻"
			set presenter notes to "• Review: scenele 5, 4, 8 — sau povestește din memorie dacă nu vrei să schimbi ecranul." & return & "• Astea sunt bug-uri de logică / stare: programul „crede” ceva greșit." & return & "• QA apasă, numără, schimbă filtrele — exact ce ați făcut voi."
		end tell
		
		-- Slide 7
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Nu crede bifa verde!"
			set object text of default body item to "Bug-uri din misiune" & return & return & "✓ „Gata, a băut apă” → 🦊 Ruxi e tot însetată" & return & "✓ Bot: Habitat apt → 🤖 Dosarul are avertismente" & return & "✓ „Eliberare 17:20” → 📸 E poza de la prânz"
			set presenter notes to "• Scenele 6, 11, 12 — perfecte pentru „nu crede orbeste ecranul”." & return & "• Mesaj: un QA bun e curajos să zică „asta nu e corect”, chiar dacă aplicația arată un bife verde." & return & "• În viața reală: alerte false, mesaje de succes greșite, poze greșit etichetate."
		end tell
		
		-- Slide 8
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Le-ai trăit deja pe telefon"
			set object text of default body item to "Viața ta = jobul de QA" & return & return & "🎮 Jocuri — scorul nu se salvează / skin-ul nu apare" & return & "💬 Chat — mesaj dublu sau „trimis” nevăzut" & return & "📚 Școală — ecran OK, la profesor nu e nimic" & return & "🛒 Magazin — ai plătit, itemul lipsește" & return & "🔔 Notificări — de 10 ori… sau deloc" & return & "🚌 Hărți — „vine în 2 min” de 15 minute"
			set presenter notes to "• Nu numi branduri ca să „dai vina” — vorbește generic: joc, chat, catalog, magazin în app." & return & "• Lasă 20–30 secunde: „Ridicați mâna dacă vi s-a întâmplat măcar unul.”" & return & "• Mesaj: QA e persoana care testează exact astea înainte să ajungă la milioane de utilizatori." & return & "• Leagă de joc: „Succes pe ecran ≠ adevăr” — ca la Ruxi / bot / poza de eliberare."
		end tell
		
		-- Slide 9
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "O zi de QA arată cam așa"
			set object text of default body item to "Jobul" & return & return & "09:00  🧪  Încerci app-ul" & return & "11:00  🐞  Găsești bug-uri" & return & "13:00  📝  Scrii rapoarte" & return & "15:00  🤝  Cu programatorii" & return & "17:00  🔁  Verifici din nou"
			set presenter notes to "• Nu e doar „apasă random”: e ca o misiune cu obiective — ca ecranele voastre." & return & "• După ce developerii repară, QA verifică din nou (retest) — ca steaua plină din prima vs după greșeli." & return & "• Nu trebuie să fii „cel mai bun la mate” — trebuie să fii curios și clar când explici."
		end tell
		
		-- Slide 10
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Fără QA… haos pe telefon"
			set object text of default body item to "De ce contează" & return & return & "💥 App crashed — retry?" & return & return & "🎮 Jocul se blochează — exact în finală / rank" & return & "📱 Story-ul nu urcă — sau like-ul „dispare”" & return & "📚 Catalog online greșit — nota / absența e aiurea" & return & "🎵 Melodia sare — sau video-ul se blochează"
			set presenter notes to "• Reia 1–2 exemple de pe slide-ul anterior (joc, catalog, plată)." & return & "• Un bug mic pe ecran poate ascunde o problemă mare în spate." & return & "• În " & appName & " ați protejat „utilizatorii” de pe insulă — în job protejezi utilizatori reali."
		end tell
		
		-- Slide 11
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Power-up-uri deblocate azi"
			set object text of default body item to "Superputerile voastre" & return & return & "🔎 Ochi de vultur — vezi ce nu se potrivește" & return & "🧩 Detective mode — „Hmm, ciudat…”" & return & "🗣️ Raport clar — alții înțeleg din prima" & return & "💪 Retry power — greșeala nu te oprește"
			set presenter notes to "• Amintește-le: greșelile la selecție nu le-au luat stele — în QA e normal să explorezi." & return & "• Raportul bun = colegul care repară înțelege din prima." & return & "• Întreabă: „Care bug v-a plăcut cel mai mult să-l găsiți?”"
		end tell
		
		-- Slide 12
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Ți-a plăcut să cauți greșeli?"
			set object text of default body item to "Poate e pentru tine" & return & return & "🕵️ Ție ți-a plăcut?" & return & return & "🐞 QA — pui aplicația la încercare" & return & "👩‍💻 sau altceva în IT — curiozitatea rămâne arma ta"
			set presenter notes to "• Ton ușor, fără presiune: e o meserie reală, cu salariu, echipe, proiecte." & return & "• Poți menționa pe scurt că există cursuri / licee IT / facultăți — fără listă lungă." & return & "• Închide cu: „Azi ați fost deja junior QA în " & appName & ".”"
		end tell
		
		-- Slide 13
		set s to make new slide at end of slides with properties {base layout:slide layout "Title & Bullets"}
		tell s
			set object text of default title item to "Misiune îndeplinită!"
			set object text of default body item to "Final" & return & return & "⭐  🐞  ⭐" & return & return & "Junior QA — " & appName & return & return & "Întrebări?"
			set presenter notes to "• Lasă 2–3 minute pentru întrebări." & return & "• Dacă se blochează: „Care a fost cel mai sneaky bug?” / „Ce ați verifica voi într-un joc sau la catalogul online?”" & return & "• Mulțumește-le și trimite-i înapoi la ecranul de start când termini."
		end tell
		
		-- delete the original blank first slide created with the document
		try
			delete slide 1
		end try
	end tell
	
	-- save (Keynote wants HFS path via `file`, not POSIX file)
	set outFile to (path to desktop folder as text) & outName
	save theDoc in file outFile
end tell

return "Saved to Desktop:" & outName
