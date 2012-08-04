<% if page_columns <> 1 then %>	

<div id="cn-left-col">
        <div id="cn-left-col-inner">
          <nav role="navigation">
            <h2 id="cn-nav"><%= left_nav_text %></h2>
            <div class="cn-left-col-default"> 
              <!-- SideNavLeftStart -->
              <!--<section>-->

<%
	' code to replace the main left navigation bar if the variable "left_nav" is not empty, else get the default navigation
			Dim strInclude, strAppendInclude
				
			If left_nav <> "" Then
			  strInclude = getFileContents(left_nav)
			  Response.Write strInclude
			Else 
				if language = "fra" then
			%>
				<!-- #include virtual="/theme-gcwu-fegc/nav/leftNav-fra.html" -->
				<% else %>
				<!-- #include virtual="/theme-gcwu-fegc/nav/leftNav-eng.html" --> 
			<%
			  	end if
			End If
			
			' append to the left navigation bar after the main nav if variable "append_left_nav" is not empty	
			if append_left_nav <> "" then
				strAppendInclude = getFileContents(append_left_nav)
			  	Response.Write strAppendInclude
			end if
			
			%>
            
				<!--</section>-->
              <!-- SideNavLeftEnd --> 
            </div>
          </nav>
        </div>
      </div>            
            
            
            
            


<% 'If the variable page_columns is 3 then display the right navigation bar  %>	
<% If page_columns = 3 then %>
	<!-- Supplemental content (right column) begins / Début du contenu supplémentaire (colonne droite) -->
		<div id="cn-right-col-gap"></div>
		<div id="cn-right-col" role="complementary"><div id="cn-right-col-inner">
		<section>
			<h2><% =supp_nav_text %></h2>
			<div class="cn-right-col-default">
<!-- clf2-nsi2 theme begins / Début du thème clf2-nsi2 -->
			<%
			if right_nav <> "" then	
				Dim strInclude_right
				strInclude_right = getFileContents(right_nav)
				response.Write (strInclude_right)
			else
				response.write("Navigation file not found / Fichier de navigation introuvable <br /> Please add variable 'right_nav' with absolute path to the file")	
			end if 
			%>
<!-- clf2-nsi2 theme ends / Fin du thème clf2-nsi2 -->
			</div>
		</section>
		</div></div>
	<!-- Supplemental content (right column) ends / Fin du contenu supplémentaire (colonne droite) -->
	<% End If %>
    
    
<% end if %>