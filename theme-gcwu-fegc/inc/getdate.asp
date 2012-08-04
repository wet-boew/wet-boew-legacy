<%
' Used to determine page created and last modified dates
function GetFileDate( which )

	dim strPath, varDate, fsObj, fsObjParam
	dim varDateModified, varDateCreated

	'PATH_TRANSLATED turns a virtual path into a physical path
	strPath =  Request.servervariables("PATH_TRANSLATED")
	
	set fsObj = CreateObject("Scripting.FileSystemObject")
	set fsObjParam = fsObj.GetFile(strPath)

	if which = "Created" then
		varDate = fsObjParam.DateCreated
		GetFileDate = ParseDate(varDate)
	end if
	if which = "Modified" then
		varDate = fsObjParam.DateLastModified
		GetFileDate = ParseDate(varDate)
	end if
end function 

'Used to configure the dates used in function GetFileCreatModDate()

function ParseDate(varDate)

	dim strYear, strMonth, strDay

	'Parsing the date
	strYear = Year(varDate)
	strMonth = Month(varDate)
	strDay = Day(varDate)
		
	'Determines if the month or the day needs a "0" in front of it
	if (strMonth < 10) then
		strMonth = "0" & strMonth
	end if
	
	if (strDay < 10) Then
		strDay = "0" & strDay
	end if
	ParseDate =  strYear & "-" & strMonth & "-" & strDay	
end function 'ParseDate(varDate)
%>		