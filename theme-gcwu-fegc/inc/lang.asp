<%
  'Script to change languages
  Option Explicit 
  Response.Buffer = True
  
  Dim CurrentURL, NewURL
  
  'Get the referer
  CurrentURL = Request.ServerVariables("HTTP_Referer")

  'Check to see if the language was French
  If InStr(CurrentURL,"-fra.") Then
    'Convert to English copy
    NewURL = Replace(CurrentURL, "-fra.", "-eng.")
	NewURL = Replace(NewURL, "fra", "eng")
  Else
    'Convert to French copy
    NewURL = Replace(CurrentURL, "-eng.", "-fra.")
	NewURL = Replace(NewURL, "eng", "fra")
  End If

  Response.Redirect NewURL
%>
