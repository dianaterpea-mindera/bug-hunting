-- Build a native Keynote deck from slide PNG images (full-bleed Photo layout).
-- Usage: osascript scripts/build_keynote_from_pngs.applescript

property pngDirPOSIX : "/Users/diana.terpea/bug-hunting/presentations/slide-pngs"
property outName : "Insula-QA-vizual.key"

on notesFor(i)
	if i is 0 then
		return "• Întreabă grăbita: „Ce credeți că ați făcut azi, pe scurt?”" & return & "• Lasă-i să zică „am căutat greșeli / probleme pe ecrane”." & return & "• Spune că aveți o surpriză: meseria pe care ați practicat-o are un nume."
	else if i is 1 then
		return "• Explică pe scurt: înainte ca o aplicație să ajungă pe telefonul lor, cineva o „vânează” de greșeli." & return & "• QA = Quality Assurance = „ne asigurăm că e de calitate”." & return & "• În joc ați fost exact echipa de QA din Insula după furtună."
	else if i is 2 then
		return "• Poveste scurtă: un gândac real a stricat un computer — de-asta zicem „bug”." & return & "• În joc le-ați zis „probleme”. În job se numesc bug-uri." & return & "• Întreabă: „Cui i s-a blocat un joc / un story / o temă online?”"
	else if i is 3 then
		return "• Arată pe ecran (sau pe Review) un raport al lor: selecție + text." & return & "• Leagă fiecare pas: observat = bug detection; marcat = localizare; screenshot = evidence; textul = bug report." & return & "• „Ce ar fi trebuit” vs „ce s-a întâmplat” = expected vs actual."
	else if i is 4 then
		return "• Dacă ai al doilea ecran: deschide Mod Review → scenele 1, 3, 10." & return & "• Spune: uneori bug-ul e o nepotrivire între ce scrie și ce vezi." & return & "• În QA: verificăm UI-ul și datele — nu doar „merge butonul?”, ci „are sens ce scrie?”."
	else if i is 5 then
		return "• Review: scenele 5, 4, 8 — sau povestește din memorie." & return & "• Astea sunt bug-uri de logică / stare: programul „crede” ceva greșit." & return & "• QA apasă, numără, schimbă filtrele — exact ce ați făcut voi."
	else if i is 6 then
		return "• Scenele 6, 11, 12 — perfecte pentru „nu crede orbeste ecranul”." & return & "• Un QA bun e curajos să zică „asta nu e corect”, chiar dacă aplicația arată un bife verde." & return & "• În viața reală: alerte false, mesaje de succes greșite, poze greșit etichetate."
	else if i is 7 then
		return "• Nu numi branduri — vorbește generic: joc, chat, catalog, magazin în app." & return & "• Lasă 20–30 secunde: „Ridicați mâna dacă vi s-a întâmplat măcar unul.”" & return & "• QA testează exact astea înainte să ajungă la milioane de utilizatori." & return & "• Leagă de joc: „Succes pe ecran ≠ adevăr” — ca la Ruxi / bot / poza de eliberare."
	else if i is 8 then
		return "• Nu e doar „apasă random”: e ca o misiune cu obiective — ca ecranele voastre." & return & "• După ce developerii repară, QA verifică din nou (retest)." & return & "• Nu trebuie să fii „cel mai bun la mate” — trebuie să fii curios și clar când explici."
	else if i is 9 then
		return "• Reia 1–2 exemple de pe slide-ul anterior (joc, catalog, plată)." & return & "• Un bug mic pe ecran poate ascunde o problemă mare în spate." & return & "• În Insula după furtună ați protejat „utilizatorii” de pe insulă — în job protejezi utilizatori reali."
	else if i is 10 then
		return "• Amintește-le: greșelile la selecție nu le-au luat stele — în QA e normal să explorezi." & return & "• Raportul bun = colegul care repară înțelege din prima." & return & "• Întreabă: „Care bug v-a plăcut cel mai mult să-l găsiți?”"
	else if i is 11 then
		return "• Ton ușor, fără presiune: e o meserie reală, cu salariu, echipe, proiecte." & return & "• Poți menționa pe scurt că există cursuri / licee IT / facultăți — fără listă lungă." & return & "• Închide cu: „Azi ați fost deja junior QA în Insula după furtună.”"
	else
		return "• Lasă 2–3 minute pentru întrebări." & return & "• Dacă se blochează: „Care a fost cel mai sneaky bug?” / „Ce ați verifica voi într-un joc?”" & return & "• Mulțumește-le și trimite-i înapoi la ecranul de start când termini."
	end if
end notesFor

on pad2(n)
	if n < 10 then
		return "0" & n
	end if
	return (n as text)
end pad2

tell application "Keynote"
	activate
	try
		close every document saving no
	end try
	
	set doc to make new document with properties {document theme:theme "Basic White", width:1920, height:1080}
	
	tell doc
		-- configure first slide
		set base layout of slide 1 to slide layout "Photo"
		
		-- add remaining slides
		repeat with i from 2 to 13
			make new slide at end of slides with properties {base layout:slide layout "Photo"}
		end repeat
		
		-- place images + notes
		repeat with i from 0 to 12
			set slideNum to i + 1
			set pngPath to pngDirPOSIX & "/slide-" & my pad2(i) & ".png"
			set pngAlias to (POSIX file pngPath) as alias
			tell slide slideNum
				set file name of image 1 to pngAlias
				set width of image 1 to 1920
				set height of image 1 to 1080
				set position of image 1 to {0, 0}
				set presenter notes to my notesFor(i)
			end tell
		end repeat
	end tell
	
	set outFile to (path to desktop folder as text) & outName
	try
		do shell script "rm -rf " & quoted form of (POSIX path of (path to desktop folder) & outName)
	end try
	save doc in file outFile
	return "Saved Desktop:" & outName & " slides=" & (count of slides of doc)
end tell
