<%

' ******* head variable declaration ******
dim title,  date_created, date_modified, page_description, keywords, subject, pg_columns ,leftMenu, right_menu, appendLeftNav



' ***** language variables *****
	dim language, url, site, iLen, lang, otherLang
	url = Request.ServerVariables("URL") 
	site = Request.ServerVariables("SERVER_NAME") 
	iLen= Instr(url, ".asp")
	lang = Mid(url, iLen-3, 3)
		
	if lang = "eng" or language="en" or language="e" then
		language = "eng"
		otherLang = "fra"
		
	elseif lang ="fra" or language="fr" or language="f" then
		language = "fra"
		otherLang = "eng"
	else
		language = "eng"
		otherLang = "fra"	
	end if
		
' ****** output language variables *****
dim prim_nav_text, supp_nav_text, date_modified_text, cn_toppage_foot_text, cn_toppage_foot_title, cn_foot, cn_inotices_link_text, cn_inotices_link_href, cn_sig , cn_banner_text, cn_domain, cn_cmblang_href, cn_cmb2_href, cn_cmb2_title, cn_cmb2_text, cn_cmb3_href, cn_cmb3_title, cn_cmb3_text, cn_cmb4_href, cn_cmb4_title, cn_cmb4_text, cn_cmb5_href, cn_cmb5_title, cn_cmb5_text, cn_cmb6_href, cn_cmb6_title, cn_cmb6_text,cn_sh_link_1, cn_sh_link_2, cn_wwms, cn_cmb, cn_cmblang_text, cn_cmblang, cn_cmblang_title, cn_bcrumb, pd_text, pd_link


if language = "fra" then

' ***** To be updated ********
	cn_inotices_link_href = "#"
	cn_sig = "Gouvernement du Canada"
	cn_banner_text = "Nom de l'institution"
	cn_domain = "[www.]siteprimaire-mainsite.gc.ca"
	cn_cmblang_href = "#"
	cn_gcnb = "Barre de navigation de la gouvernement de Canada"
	prim_nav_text = "Barre de navigation du site"
	left_nav_text = "Navigation latérale (colonne gauche)"
	cn_cmb1_href = "http://www.canada.gc.ca/accueil.html"
	cn_cmb1_text = "Canada.gc.ca"
	cn_cmb2_href = "http://www.servicecanada.gc.ca/fra/accueil.shtml"
	cn_cmb2_text = "Services"
	cn_cmb3_href = "http://www.canada.gc.ca/depts/major/depind-fra.html"
	cn_cmb3_text = "Ministères"
	
	date_modified_text = "Date de modification&#160;:"	
	
	terms_href = "#"
	terms_text = "Avis"
	trans_href = "#"
	trans_text = "Transparence"
	
	cn_foot = "Pied de page"
	cn_foot_site = "Pied de page du site" 
	cn_gc_foot = "Pied de page du gouvernement du Canada"
	cn_gc_foot1_text = "Santé"
	cn_gc_foot1_url = "canadiensensante.gc.ca"
	cn_gc_foot1_href = "http://canadiensensante.gc.ca/index-fra.php"
	cn_gc_foot2_text = "Voyage"
	cn_gc_foot2_url = "travel.gc.ca"
	cn_gc_foot2_href = "http://www.voyage.gc.ca/index-fra.asp"
	cn_gc_foot3_text = "Service Canada"
	cn_gc_foot3_url = "servicecanada.gc.ca"
	cn_gc_foot3_href = "http://www.servicecanada.gc.ca/fra/accueil.shtml"
	cn_gc_foot4_text = "Emplois"
	cn_gc_foot4_url = "guichetemplois.gc.ca"
	cn_gc_foot4_href = "http://www.guichetemplois.gc.ca/Intro-fra.aspx"
	cn_gc_foot5_text = "Économie"
	cn_gc_foot5_url = "plandaction.gc.ca"
	cn_gc_foot5_href = "http://www.plandaction.gc.ca/fra/index.asp"
	
	
	
	cn_sh_link_1 = "Passer au contenu principal"
	cn_sh_link_2 = "Passer à la navigation principale"
	cn_sh_link_2_1_col = "Passer au pied de page"
	cn_wwms = "Symbole du gouvernement du Canada"
	
	cn_cmblang_text = "English"
	cn_cmblang = "en"
	cn_bcrumb = "Fil d'Ariane"
	
	cn_search = "Recherche"
	cn_search_action = "#"
	cn_search_lable = "Recherchez le site Web"
	cn_search_value = "Recherche"
	
	
	
	
'	cn_cmb = "Barre de menu commune"
'	cn_cmb4_href = "#"
'	cn_cmb4_title = "Aide - Renseignements sur la façon d'utiliser le site Web"
'	cn_cmb4_text = "Aide"
'	cn_cmb5_href = "#"
'	cn_cmb5_title = "Recherche - Recherche dans le site Web"
'	cn_cmb5_text = "Recherche"
'	pd_text = "Divulgation proactive"
'	pd_link = "#" 	
'	cn_cmb6_href = "http://www.canada.gc.ca/accueil.html"
'	cn_cmb6_title = "canada.gc.ca - Site Web du gouvernement du Canada"
'	cn_cmb6_text = "canada.gc.ca"
'
'	prim_nav_text = "Site navigation bar"
'	supp_nav_text = "Contenu supplémentaire (colonne droite)"
'
'	cn_toppage_foot_text = "Haut de la page"
'	cn_toppage_foot_title = "Retourner au haut de la page"
'	
'	cn_inotices_link_text ="Avis importants"
	
	
				
	
else
	
' ********** To be updated **********
	cn_inotices_link_href = "#"
	cn_sig = "Government of Canada"
	cn_banner_text = "Name of Institution"
	cn_domain = "[www.]mainsite-siteprimaire.gc.ca"
	cn_cmblang_href = "#"
	cn_gcnb = "Government of Canada navigation bar"
	prim_nav_text = "Site navigation bar"
	left_nav_text = "Side navigation (left column)"
	cn_cmb1_href = "http://www.canada.gc.ca/home.html"
	cn_cmb1_text = "Canada.gc.ca"
	cn_cmb2_href = "http://www.servicecanada.gc.ca/eng/home.shtml"
	cn_cmb2_text = "Services"
	cn_cmb3_href = "http://www.canada.gc.ca/depts/major/depind-eng.html"
	cn_cmb3_text = "Departments"
		
	date_modified_text = "Date Modified:"
	
	
	terms_href = "#"
	terms_text = "Terms and conditions"
	trans_href = "#"
	trans_text = "Transparency"
	
	cn_foot = "Footer"
	cn_foot_site = "Site Footer" 
	cn_gc_foot = "Government of Canada footer"
	
	cn_gc_foot1_text = "Health"
	cn_gc_foot1_url = "healthycanadians.gc.ca"
	cn_gc_foot1_href = "http://healthycanadians.gc.ca/index-eng.php"
	cn_gc_foot2_text = "Travel"
	cn_gc_foot2_url = "travel.gc.ca"
	cn_gc_foot2_href = "http://www.voyage.gc.ca/index-eng.asp"
	cn_gc_foot3_text = "Service Canada"
	cn_gc_foot3_url = "servicecanada.gc.ca"
	cn_gc_foot3_href = "http://www.servicecanada.gc.ca/eng/home.shtml"
	cn_gc_foot4_text = "Jobs"
	cn_gc_foot4_url = "jobbank.gc.ca"
	cn_gc_foot4_href = "http://www.jobbank.gc.ca/intro-eng.aspx"
	cn_gc_foot5_text = "Economy"
	cn_gc_foot5_url = "actionplan.gc.ca"
	cn_gc_foot5_href = "http://actionplan.gc.ca/eng/index.asp"

	
	cn_cmblang_text = "Français"
	cn_cmblang = "fr"
	cn_bcrumb = "Breadcrumb Trail"
	cn_sh_link_1 = "Skip to main content"
	cn_sh_link_2 = "Skip to primary navigation"
	cn_sh_link_2_1_col = "Skip to footer"
	cn_wwms = "Symbol of the Government of Canada"
	
	cn_search = "Search"
	cn_search_action = "#"
	cn_search_lable = "Search website"
	cn_search_value = "Search"
	
	
	'
'	
'	
'	pd_text = "Proactive Disclosure"
'	pd_link = "#"
'	
'	
'	cn_cmb6_title = "canada.gc.ca - Government of Canada Web site"
'	cn_cmb6_href = "http://www.canada.gc.ca/home.html"
'	cn_cmb6_text = "canada.gc.ca"
'	
'	
'	supp_nav_text = "Supplemental content (right column)"
'	
'	cn_toppage_foot_text = "Top of Page"
'	cn_toppage_foot_title = "Return to Top of Page"
'	
'	cn_inotices_link_text = "Important Notices"
'	
'	cn_cmb = "Common menu bar"
	
	
end if

%>

