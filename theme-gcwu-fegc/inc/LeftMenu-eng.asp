<%
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
					
					response.write("Nav file not found")
				 	
				end if
				
				Set objFSO = Nothing
			End Function  
%>  
	<!-- Primary navigation (left column) begins / Début de la navigation principale (colonne gauche) -->
	<div id="cn-left-col-gap"></div>
	<div id="cn-left-col"><div id="cn-left-col-inner">
	<nav role="navigation">
		<h2 id="cn-nav">Primary navigation (left column)</h2>
		<div class="cn-left-col-default">
<!-- clf2-nsi2 theme begins / Début du thème clf2-nsi2 -->
			<%
	' code to replace the main left navigation bar if the variable "leftMenu" is not empty

			Dim strInclude, strAppendInclude
				
			If leftMenu <> "" Then
			  strInclude = getFileContents(leftMenu)
			  Response.Write strInclude
			Else %>
			  <!-- #include virtual="/theme-gcwu-fegc/nav/leftNav-eng.html" --> 
			  <%
			End If
			
			' append to the left navigation bar after the main nav if variable "appendLeftNav" is not empty	
			if appendLeftNav <> "" then
				strAppendInclude = getFileContents(appendLeftNav)
			  	Response.Write strAppendInclude
			end if
			
			%>
<!-- clf2-nsi2 theme ends / Fin du thème clf2-nsi2 -->
		</div>
	</nav>
	</div></div>
	<!-- Primary navigation (left column) ends / Fin de la navigation principale (colonne gauche) -->