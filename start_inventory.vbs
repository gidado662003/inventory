Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "start_inventory.bat" & chr(34), 0
Set WshShell = Nothing
