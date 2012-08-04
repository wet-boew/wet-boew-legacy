<%

' If the date_modified variable is empty, then populate the Date Modified with the created date
	if date_modified="" then 
		date_modified = date_created
	end if

' Page columns validation, if variable is more then 3 then default to 3 columns 
	if page_columns > 3 then
		page_columns = 3
	end if	
		
'To add a dynamic include - Pass the path of the file to the function.
			Function getFileContents(strIncludeFile)
				  Dim objFSO
				  Dim objText
				  Dim strPage
							
				  'Instantiate the FileSystemObject Object.
				  Set objFSO = Server.CreateObject("Scripting.FileSystemObject")
						
				  ' check if the file exist
				if objFSO.FileExists(Server.MapPath(strIncludeFile))=true then
				  
				  'Open the file and pass it to a TextStream Object (objText)	
				  	Set objText = objFSO.OpenTextFile(Server.MapPath(strIncludeFile))
				  	
				  	'Read and return the contents of the file as a string.
				  	getFileContents = objText.ReadAll
				  
				 	objText.Close
				 	Set objText = Nothing
				else
					
					response.write("Navigation file not found / Fichier de navigation non trouvé")
				 	
				end if
				
				Set objFSO = Nothing
			End Function  

		
%>
