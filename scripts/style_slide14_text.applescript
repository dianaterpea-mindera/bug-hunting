-- Style the text box on the last slide of Insula-QA-editabil.key
property keyPath : "/Users/diana.terpea/bug-hunting/presentations/Insula-QA-editabil.key"
property cWhite : {65535, 65535, 65535}

tell application "Keynote"
	activate
	set theDoc to open POSIX file keyPath
	delay 1.5
	
	tell theDoc
		set slideCount to count of slides
		set s to slide slideCount
		set found to false
		set info to "slides=" & slideCount & " "
		
		set itemList to every text item of s
		repeat with theItem in itemList
			try
				set ot to (object text of theItem) as string
				set info to info & "[" & ot & "] "
				if ot contains "Multz" or ot contains "detectivi" then
					set object text of theItem to "Multzuuuuuu"
					try
						tell object text of theItem
							set font to "Georgia"
							set size to 54
							set color to cWhite
						end tell
					end try
					try
						set position of theItem to {1040, 420}
						set width of theItem to 800
						set height of theItem to 120
					end try
					set found to true
				end if
			end try
		end repeat
		
		if found is false then
			set shapeList to every shape of s
			repeat with theShape in shapeList
				try
					set ot to (object text of theShape) as string
					set info to info & "{shape:" & ot & "} "
					if ot contains "Multz" or ot contains "detectivi" then
						set object text of theShape to "Multzuuuuuu"
						try
							tell object text of theShape
								set font to "Georgia"
								set size to 54
								set color to cWhite
							end tell
						end try
						try
							set position of theShape to {1040, 420}
							set width of theShape to 800
							set height of theShape to 120
						end try
						set found to true
					end if
				end try
			end repeat
		end if
	end tell
	
	save theDoc
	if found then
		return "OK " & info
	else
		return "NOT_FOUND " & info
	end if
end tell
