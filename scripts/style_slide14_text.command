#!/bin/bash
# Double-click this file (or run in Terminal) to restyle "Multzuuuuuu" on the last slide.
# Uses Keynote directly — safe, won't corrupt the .key file.

set -e
KEY="/Users/diana.terpea/bug-hunting/presentations/Insula-QA-editabil.key"
BAK="/Users/diana.terpea/bug-hunting/presentations/Insula-QA-editabil.key.bak"

cp -f "$KEY" "$BAK"
echo "Backup salvat."

osascript <<'APPLESCRIPT'
property keyPath : "/Users/diana.terpea/bug-hunting/presentations/Insula-QA-editabil.key"
property cWhite : {65535, 65535, 65535}
property cGold : {61680, 51143, 24158}

tell application "Keynote"
	activate
	set theDoc to open POSIX file keyPath
	delay 1.5
	tell theDoc
		set s to slide (count of slides)
		set found to false
		
		-- text items
		repeat with theItem in (get every text item of s)
			try
				set ot to (object text of theItem) as string
				if ot contains "Multz" or ot contains "detectivi" then
					set object text of theItem to "Multzuuuuuu"
					try
						tell object text of theItem
							set font to "Georgia"
							set size to 56
							set color to cWhite
						end tell
					end try
					try
						set position of theItem to {1000, 400}
						set width of theItem to 850
						set height of theItem to 140
					end try
					set found to true
				end if
			end try
		end repeat
		
		-- shapes with text
		if found is false then
			repeat with theShape in (get every shape of s)
				try
					set ot to (object text of theShape) as string
					if ot contains "Multz" or ot contains "detectivi" then
						set object text of theShape to "Multzuuuuuu"
						try
							tell object text of theShape
								set font to "Georgia"
								set size to 56
								set color to cWhite
							end tell
						end try
						try
							set position of theShape to {1000, 400}
							set width of theShape to 850
							set height of theShape to 140
						end try
						set found to true
					end if
				end try
			end repeat
		end if
	end tell
	save theDoc
	if found then
		display notification "Text stilizat: Multzuuuuuu" with title "Insula QA"
		return "OK"
	else
		display dialog "Nu am găsit textul Multz… pe ultimul slide. Stilizează manual în Keynote." buttons {"OK"} default button 1
		return "NOT_FOUND"
	end if
end tell
APPLESCRIPT

echo ""
echo "Gata. Verifică ultimul slide în Keynote."
echo "Apasă Enter ca să închizi."
read
