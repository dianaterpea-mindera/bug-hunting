-- Fun editable Keynote: designed backgrounds + editable text/shapes on top.
-- Backup images: Insula-QA-vizual.key
-- Usage: osascript scripts/build_keynote_editable.applescript

property outName : "Insula-QA-editabil.key"
property bgDir : "/Users/diana.terpea/bug-hunting/presentations/slide-bgs"

property cWhite : {65535, 65535, 65535}
property cFoam : {59500, 63000, 62500}
property cSeaDeep : {2831, 15721, 19026}
property cCoral : {57568, 31354, 24415}
property cGold : {61680, 51143, 24158}
property cInk : {2800, 11000, 12800}
property cMuted : {22000, 28000, 30000}

on pad2(n)
	if n < 10 then return "0" & n
	return n as text
end pad2

on styleText(theText, theColor, theSize, theFont)
	try
		set color of theText to theColor
		set size of theText to theSize
		set font of theText to theFont
	end try
end styleText

on setBg(theDoc, theSlide, idx)
	set p to bgDir & "/bg-" & my pad2(idx) & ".png"
	set a to (POSIX file p) as alias
	tell application "Keynote"
		set base layout of theSlide to slide layout "Photo" of theDoc
		tell theSlide
			set file name of image 1 to a
			set width of image 1 to 1920
			set height of image 1 to 1080
			set position of image 1 to {0, 0}
		end tell
	end tell
end setBg

on label(theSlide, x, y, w, txt, col)
	tell application "Keynote"
		tell theSlide
			set t to make new text item with properties {object text:txt, position:{x, y}, width:w, height:46}
		end tell
		my styleText(object text of t, col, 16, "Avenir Next Bold")
	end tell
end label

on titleText(theSlide, x, y, w, h, txt, col, sz)
	tell application "Keynote"
		tell theSlide
			set t to make new text item with properties {object text:txt, position:{x, y}, width:w, height:h}
		end tell
		my styleText(object text of t, col, sz, "Avenir Next Bold")
	end tell
end titleText

on bodyText(theSlide, x, y, w, h, txt, col, sz)
	tell application "Keynote"
		tell theSlide
			set t to make new text item with properties {object text:txt, position:{x, y}, width:w, height:h}
		end tell
		my styleText(object text of t, col, sz, "Avenir Next Demi Bold")
	end tell
end bodyText

on card(theSlide, x, y, w, h, txt, col, sz)
	tell application "Keynote"
		tell theSlide
			set sh to make new shape with properties {position:{x, y}, width:w, height:h}
			set object text of sh to txt
		end tell
		my styleText(object text of sh, col, sz, "Avenir Next Demi Bold")
	end tell
end card

tell application "Keynote"
	activate
	try
		close every document saving no
	end try
	
	set doc to make new document with properties {document theme:theme "Basic White", width:1920, height:1080}
	
	tell doc
		------------------------------------------------ 0 Hook
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 0)
		my label(s, 70, 40, 700, "🕵️  RECAPITULARE · DUPĂ MISIUNE", cGold)
		my titleText(s, 70, 100, 1200, 200, "Ați salvat animale…" & return & "sau?", cWhite, 64)
		my bodyText(s, 70, 320, 1100, 60, "Ceva nu se potrivește. Detectivii observă tot.", cFoam, 24)
		my card(s, 70, 420, 820, 540, "🐢   🦜   🦊" & return & return & "NIVEL 1" & return & "Ce credeați" & return & return & "Eroi pe" & return & "Insula după furtună", cSeaDeep, 28)
		my card(s, 980, 420, 860, 540, "?" & return & return & "NIVEL SECRET" & return & "Ce ați făcut de fapt" & return & return & "O meserie reală" & return & "din IT… cu lupă", cCoral, 28)
		set presenter notes of s to "• Întreabă: ce credeți că ați făcut azi?" & return & "• Surpriză: meseria are un nume."
		
		------------------------------------------------ 1 Reveal
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 1)
		my label(s, 70, 50, 500, "🔓  REVELAȚIE", cGold)
		my titleText(s, 70, 140, 1780, 120, "Răsturnare: ați făcut Software Testing", cWhite, 52)
		my card(s, 280, 320, 1360, 420, "QA" & return & return & "Quality Assurance" & return & "Vânători de bug-uri profesioniști" & return & return & "Înainte ca app-ul să ajungă la milioane de oameni", cWhite, 32)
		my card(s, 560, 800, 800, 120, "🎖️  CERTIFICAT DETECTIV — ECHIPA INSULEI", cSeaDeep, 22)
		set presenter notes of s to "• QA = ne asigurăm că e de calitate." & return & "• Ați fost echipa de QA din joc."
		
		------------------------------------------------ 2 Bug lore (light)
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 2)
		my label(s, 70, 40, 500, "📚  TERMENI NOI", cCoral)
		my titleText(s, 70, 100, 1600, 100, "De ce zicem „bug”?", cSeaDeep, 56)
		my bodyText(s, 70, 210, 1400, 50, "Spoiler: a existat un gândac. Real. Într-un computer.", cMuted, 22)
		my card(s, 70, 300, 840, 660, "DEMULT" & return & return & "🐛💻" & return & return & "Un gândac real a stricat" & return & "un computer — de-atunci" & return & "greșelile se cheamă bug-uri", cSeaDeep, 26)
		my card(s, 980, 300, 860, 660, "AZI" & return & return & "💥📱" & return & return & "Bug = greșeală în program" & return & return & "Ce ați vânat pe insulă." & return & "Ce QA vânează zilnic.", cCoral, 26)
		set presenter notes of s to "• Poveste scurtă." & return & "• Cui i s-a blocat un joc / story / temă?"
		
		------------------------------------------------ 3 Quest bridge
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 3)
		my label(s, 70, 30, 600, "🎮 → 💼  TRADUCERE", cGold)
		my titleText(s, 70, 80, 1780, 90, "Ați vorbit deja limba testerilor", cWhite, 46)
		my bodyText(s, 70, 180, 1500, 40, "Aceiași pași. Alt vocabular. Quest level 2.", cFoam, 22)
		my card(s, 40, 260, 350, 720, "1" & return & "👀" & return & return & "Ai observat" & return & "ceva ciudat" & return & return & "→ Bug detection", cWhite, 20)
		my card(s, 420, 260, 350, 720, "2" & return & "🎯" & return & return & "Ai marcat" & return & "zona" & return & return & "→ Localizare", cWhite, 20)
		my card(s, 800, 260, 350, 720, "3" & return & "📸" & return & return & "Screenshot" & return & return & "→ Evidence", cWhite, 20)
		my card(s, 1180, 260, 350, 720, "4" & return & "✍️" & return & return & "Ai raportat" & return & return & "→ Bug report", cWhite, 20)
		my card(s, 1560, 260, 320, 720, "5" & return & "⚖️" & return & return & "Așteptat" & return & "vs real" & return & return & "→ Expected" & return & "/ Actual", cWhite, 18)
		set presenter notes of s to "• Arată un raport din Review." & return & "• Leagă pașii de termeni QA."
		
		------------------------------------------------ 4 Cases (light)
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 4)
		my label(s, 70, 30, 700, "🗂️  DOSARE DIN MISIUNE", cCoral)
		my titleText(s, 70, 80, 1700, 90, "Cazul #1: imaginea minte", cSeaDeep, 48)
		my bodyText(s, 70, 180, 1400, 40, "Când ce scrie ≠ ce vezi. Classic sneaky bug.", cMuted, 22)
		my card(s, 50, 260, 580, 720, "SCENA 1" & return & return & "🚤 „Ai ajuns cu barca”" & return & "≠" & return & "🚗 Pe ecran: mașină" & return & return & "🔍 Text vs iconiță", cSeaDeep, 24)
		my card(s, 670, 260, 580, 720, "SCENA 3" & return & return & "🐢 Tessa" & return & "≠" & return & "📋 Fișa zice Tina" & return & return & "🔍 Nume greșit", cSeaDeep, 24)
		my card(s, 1290, 260, 570, 720, "SCENA 10" & return & return & "🦜 Kiko = papagal" & return & "≠" & return & "🙈 Etichetă: Maimuță" & return & return & "🔍 Specie greșită", cSeaDeep, 24)
		set presenter notes of s to "• Review opțional: 1, 3, 10."
		
		------------------------------------------------ 5 Logic
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 5)
		my label(s, 70, 30, 600, "🧠  EROARE DE LOGICĂ", cGold)
		my titleText(s, 70, 80, 1780, 100, "Cazul #2: creierul app-ului o ia razna", cWhite, 42)
		my card(s, 50, 240, 580, 740, "➡️  Pădurea" & return & return & "AR TREBUI" & return & "Dreapta → Centru" & return & return & "ÎN JOC" & return & "Dreapta → Poiană ↑", cWhite, 24)
		my card(s, 670, 240, 580, 740, "💧  Rucsacul" & return & return & "AR TREBUI" & return & "3 sticle = ×3" & return & return & "ÎN JOC" & return & "Contorul rămâne ×2", cWhite, 24)
		my card(s, 1290, 240, 570, 740, "🏥  Filtrul „Toate”" & return & return & "AR TREBUI" & return & "5 animale" & return & return & "ÎN JOC" & return & "4 — Pico e 👻", cWhite, 24)
		set presenter notes of s to "• Review: 5, 4, 8."
		
		------------------------------------------------ 6 Trust (light)
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 6)
		my label(s, 70, 30, 500, "⚠️  TRAP ALERT", cCoral)
		my titleText(s, 70, 80, 1700, 90, "Nu crede bifa verde!", cSeaDeep, 56)
		my bodyText(s, 70, 180, 1400, 40, "App-ul zice OK. Realitatea zice „hmm…”", cMuted, 22)
		my card(s, 50, 260, 580, 720, "✓" & return & "„Gata, a băut apă”" & return & return & "↓" & return & return & "🦊" & return & "Ruxi e tot însetată", cSeaDeep, 26)
		my card(s, 670, 260, 580, 720, "✓" & return & "Bot: Habitat apt" & return & return & "↓" & return & return & "🤖" & return & "Dosarul are avertismente", cSeaDeep, 24)
		my card(s, 1290, 260, 570, 720, "✓" & return & "„Eliberare 17:20”" & return & return & "↓" & return & return & "📸" & return & "E poza de la prânz", cSeaDeep, 26)
		set presenter notes of s to "• Scenele 6, 11, 12."
		
		------------------------------------------------ 7 Real life
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 7)
		my label(s, 70, 20, 800, "📱  VIAȚA TA = TRAINING", cGold)
		my titleText(s, 70, 70, 1780, 80, "Le-ai trăit deja. Pe telefon.", cWhite, 46)
		my bodyText(s, 70, 160, 1600, 40, "Ridică mâna dacă ți s-a întâmplat măcar unul!", cFoam, 22)
		my card(s, 40, 230, 600, 360, "🎮  Jocuri" & return & "Scorul nu se salvează" & return & return & "QA: după Continua?", cWhite, 22)
		my card(s, 670, 230, 600, 360, "💬  Chat" & return & "Mesaj dublu / nevăzut" & return & return & "QA: ce vede celălalt?", cWhite, 22)
		my card(s, 1300, 230, 570, 360, "📚  Școală" & return & "Tema „trimisă” — profesoara n-o vede" & return & return & "QA: ce vede profesoara?", cWhite, 20)
		my card(s, 40, 630, 600, 360, "🛒  Shop" & return & "Ai plătit, itemul lipsește" & return & return & "QA: banii → produs?", cWhite, 22)
		my card(s, 670, 630, 600, 360, "🔔  Notificări" & return & "De 10 ori… sau deloc" & return & return & "QA: prea mult / puțin?", cWhite, 22)
		my card(s, 1300, 630, 570, 360, "🚌  Hărți" & return & "„2 min” × 15 minute" & return & return & "QA: e actualizat?", cWhite, 22)
		set presenter notes of s to "• Nu numi branduri. 20–30 sec mâini sus."
		
		------------------------------------------------ 8 Day (light)
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 8)
		my label(s, 70, 30, 500, "🗓️  O ZI DE QA", cCoral)
		my titleText(s, 70, 80, 1780, 90, "Nu e „apasă random”. E misiune.", cSeaDeep, 44)
		my card(s, 40, 240, 350, 720, "09:00" & return & return & "🧪" & return & return & "Încerci" & return & "app-ul", cSeaDeep, 24)
		my card(s, 420, 240, 350, 720, "11:00" & return & return & "🐞" & return & return & "Găsești" & return & "bug-uri", cSeaDeep, 24)
		my card(s, 800, 240, 350, 720, "13:00" & return & return & "📝" & return & return & "Scrii" & return & "rapoarte", cSeaDeep, 24)
		my card(s, 1180, 240, 350, 720, "15:00" & return & return & "🤝" & return & return & "Cu" & return & "dev-ii", cSeaDeep, 24)
		my card(s, 1560, 240, 310, 720, "17:00" & return & return & "🔁" & return & return & "Verifici" & return & "din nou", cSeaDeep, 22)
		set presenter notes of s to "• Retest după fix."
		
		------------------------------------------------ 9 Chaos
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 9)
		my label(s, 70, 30, 500, "💣  DE CE CONTEAZĂ", cGold)
		my titleText(s, 70, 90, 1700, 100, "Fără QA… haos pe telefon", cWhite, 48)
		my card(s, 70, 250, 500, 700, "💥" & return & return & "App crashed" & return & return & "retry?" & return & "retry?" & return & "retry?", cWhite, 28)
		my card(s, 620, 250, 1220, 150, "🎮   Jocul se blochează          —  exact în finală", cWhite, 26)
		my card(s, 620, 430, 1220, 150, "📱   Story-ul nu urcă            —  like-ul „dispare”", cWhite, 26)
		my card(s, 620, 610, 1220, 150, "📚   Catalog online greșit       —  nota e aiurea", cWhite, 26)
		my card(s, 620, 790, 1220, 150, "🎵   Melodia / video-ul sare     —  sau se blochează", cWhite, 26)
		set presenter notes of s to "• Bug mic pe ecran → problemă mare în spate."
		
		------------------------------------------------ 10 Powers
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 10)
		my label(s, 70, 30, 800, "⚡  POWER-UP-URI DEBLOCATE", cGold)
		my titleText(s, 70, 90, 1700, 90, "Azi ați deblocat astea", cWhite, 52)
		my card(s, 40, 240, 440, 720, "🔎" & return & return & "Ochi de vultur" & return & return & "Vezi ce nu" & return & "se potrivește" & return & return & "████████░", cWhite, 24)
		my card(s, 510, 240, 440, 720, "🧩" & return & return & "Detective mode" & return & return & "„Hmm…" & return & "ciudat”" & return & return & "████████░", cWhite, 24)
		my card(s, 980, 240, 440, 720, "🗣️" & return & return & "Raport clar" & return & return & "Alții înțeleg" & return & "din prima" & return & return & "████████░", cWhite, 24)
		my card(s, 1450, 240, 420, 720, "💪" & return & return & "Retry power" & return & return & "Greșeala nu" & return & "te oprește" & return & return & "████████░", cWhite, 24)
		set presenter notes of s to "• Greșeala la selecție nu a luat stele."
		
		------------------------------------------------ 11 Path (light)
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 11)
		my label(s, 70, 30, 500, "🗺️  NEXT LEVEL?", cCoral)
		my titleText(s, 70, 90, 1700, 90, "Ți-a plăcut să cauți greșeli?", cSeaDeep, 48)
		my bodyText(s, 70, 200, 1500, 40, "Fără presiune. Doar curiozitate. (E o meserie reală.)", cMuted, 22)
		my card(s, 100, 300, 820, 660, "🐞" & return & return & "QA" & return & return & "Pui aplicația" & return & "la încercare" & return & "— înaintea tuturor", cSeaDeep, 30)
		my card(s, 1000, 300, 840, 660, "👩‍💻" & return & return & "sau altceva în IT" & return & return & "Curiozitatea rămâne" & return & "arma ta secretă", cCoral, 28)
		set presenter notes of s to "• Ton ușor. Junior QA pe Insulă."
		
		------------------------------------------------ 12 Finale
		set s to make new slide at end of slides with properties {base layout:slide layout "Photo"}
		my setBg(doc, s, 12)
		my label(s, 620, 80, 700, "🏁  FINAL BOSS DEFEATED", cGold)
		my titleText(s, 200, 200, 1520, 140, "Misiune îndeplinită!", cWhite, 72)
		my titleText(s, 650, 380, 620, 100, "⭐    🐞    ⭐", cGold, 56)
		my card(s, 420, 540, 1080, 160, "Junior QA — Insula după furtună", cSeaDeep, 34)
		my card(s, 660, 760, 600, 160, "Întrebări? 🔥", cWhite, 36)
		set presenter notes of s to "• 2–3 min întrebări." & return & "• Care a fost cel mai sneaky bug?"
		
		-- transitions
		repeat with i from 1 to (count of slides)
			try
				set transition properties of slide i to {transition effect:dissolve, transition duration:0.4, transition delay:0, automatic transition:false}
			end try
		end repeat
		
		try
			delete slide 1
		end try
	end tell
	
	set outFile to (path to desktop folder as text) & outName
	try
		do shell script "rm -rf " & quoted form of (POSIX path of (path to desktop folder) & outName)
	end try
	save doc in file outFile
	return "Saved " & outName & " slides=" & (count of slides of doc)
end tell
