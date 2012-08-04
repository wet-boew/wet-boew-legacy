<?php
/*
	CodeIgniter variant  v1.0 / Variante pour CodeIgniter   v1.0
	Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
*/
?>
<html  xmlns="http://www.w3.org/1999/xhtml" lang="<?php echo $this->lang->lang(ISO_639_1);?>">
<head>
			<meta charset="utf-8" />
			
			<!-- Title begins / Début du titre -->
			<title><?php echo $this->lang->line('home.title');?></title>
			<!-- Title ends / Fin du titre -->
			
			<!-- Metadata begins / Début des métadonnées -->
			<meta name="dc.description" content="English description | Description en anglais" />
			<meta name="description" content="English description | Description en anglais" />
			<meta name="keywords" content="English keywords | Mots-clés en anglais" />
			<meta name="dcterms.creator" content="English name of the content author | Nom en anglais de l'auteur du contenu" />
			<meta name="dcterms.title" content="<?php echo $this->lang->line('home.title');?>" />
			<meta name="dcterms.issued" content="2009-11-20" />
			<meta name="dcterms.modified" content="2009-12-08" />
			<meta name="dcterms.subject" content="English subject terms | Termes de sujet en anglais" />
			<meta name="dcterms.language" content="<?php echo $this->lang->lang();?>" />

			<link rel="alternate" hreflang="<?php echo $this->lang->alternate_lang(ISO_639_1) ?>" href="<?php echo site_url($this->lang->switch_uri($this->lang->alternate_lang()));?>" />
		
			<link rel="prefetch" data-breadcrum-level="3" href="#" title="<?php echo $this->lang->line('level0.title');?>"/>
			<link rel="prefetch" data-breadcrum-level="2" href="#" title="<?php echo $this->lang->line('level1.title');?>"/>
			<link rel="prefetch" data-breadcrum-level="1" href="#" title="<?php echo $this->lang->line('level2.title');?>" />
		
			<link rel="other" data-navigation="left" href="<?php echo site_url($this->lang->localized('navigation/Left'));?>" />
			<link rel="other" data-navigation="right" href="<?php echo site_url($this->lang->localized('navigation/Right'));?>" />
			<!-- Metadata ends / Fin des métadonnées -->
			
			<script>
				/* <![CDATA[ */
					var params = {
					};
					PE.progress(params);
				/* ]]> */
			</script>
	</head>
	<body>
		<!-- Content title begins / Début du titre du contenu -->
		<h1 id="cn-cont"><?php echo $this->lang->line('home.title');?></h1>
		<!-- Content Title ends / Fin du titre du contenu -->

<!-- clf2-nsi2 theme begins / Début du thème clf2-nsi2 -->
		<p><?php echo $this->lang->line('home.message');?></p>
<!-- clf2-nsi2 theme ends / Fin du thème clf2-nsi2 -->
	</body>
</html>