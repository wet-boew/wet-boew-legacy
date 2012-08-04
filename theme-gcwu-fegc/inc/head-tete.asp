<!-- #include virtual="/theme-gcwu-fegc/inc/page_script.asp" -->
<!-- #include virtual="/theme-gcwu-fegc/inc/getdate.asp" -->
	<meta charset="utf-8" />

	<!-- Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions -->

	<title><% =title %></title>

<link rel="shortcut icon" href="fip-pcim/images/favicon.ico" />
	<meta name="dcterms.description" content="<% =page_description %>" />
	<meta name="description" content="<% =page_description %>" />
	<meta name="keywords" content="<% =keywords %>" />
	<meta name="dcterms.creator" content="English name of the content author / Nom en anglais de l'auteur du contenu" />
	<meta name="dcterms.title" content="<% =title %>" />
	<meta name="dcterms.issued" title="W3CDTF" content="<%= GetFileDate("Created") %>" />
	<meta name="dcterms.modified" title="W3CDTF" content="<%= GetFileDate("Modified") %>" />
	<meta name="dcterms.subject" title="scheme"  content="<% =subject %>" />
    <meta name="dcterms.language" title="ISO639-2"  content="<% =language %>" />
    
<link href="../css/base.css" rel="stylesheet" />
<!--[if IE 6]><![endif]-->
<!--[if IE 8]><link href="../css/base-ie8.css" rel="stylesheet" /><![endif]-->
<!--[if IE 7]><link href="../css/base-ie7.css" rel="stylesheet" /><![endif]-->
<!--[if lte IE 6]><link href="../css/base-ie6.css" rel="stylesheet" /><![endif]-->
<!-- CSSStart -->
<link href="../grids/css/util.css" media="screen" rel="stylesheet" />
<link href="css/framework-responsive-theme-gcwu-fegc.css" media="screen" rel="stylesheet" />
<link href="css/theme-gcwu-fegc.css" rel="stylesheet" />
<!--[if IE 8]><link href="css/theme-gcwu-fegc-ie8.css" rel="stylesheet" /><![endif]-->
<!--[if IE 7]><link href="css/theme-gcwu-fegc-ie7.css" rel="stylesheet" /><![endif]-->
<!--[if lte IE 6]><link href="css/theme-gcwu-fegc-ie6.css" rel="stylesheet" /><![endif]-->
<link href="../js/support/menubar/style.css" rel="stylesheet" />
<link href="fip-pcim/css/fip-pcim.css" rel="stylesheet" />
<!--[if IE 8]><link href="fip-pcim/css/fip-pcim-ie8.css" rel="stylesheet" /><![endif]-->
<!--[if IE 7]><link href="fip-pcim/css/fip-pcim-ie7.css" rel="stylesheet" /><![endif]-->
<!--[if lte IE 6]><link href="fip-pcim/css/fip-pcim-ie6.css" rel="stylesheet" /><![endif]-->
<!-- CSSEnd -->

	<!-- Progressive enhancement begins / Début de l'amélioration progressive -->
	<script src="../js/lib/jquery.min.js"></script>
	<script src="../js/pe-ap.js" id="progressive"></script>