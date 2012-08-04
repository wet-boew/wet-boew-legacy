<?php
/**
 * The Header for our theme.
 *
 * @package WordPress
 * @subpackage gcwu-fegc
 * @since gcwu-fegc 1.0
 */
?>
<!DOCTYPE html>
<html <?php _e("<!--:en-->lang=\"en\"<!--:--><!--:fr-->lang=\"fr\"<!--:-->"); ?>>
<head>
	<meta charset="utf-8" />

	<!--
	GC Web Usability theme for WordPress v1.0a1 / Thème de la facilité d'emploi GC v1.0a1
	Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
	-->

	<!-- Title begins / Début du titre -->
	<title><?php bloginfo('name'); ?></title>
	<!-- Title ends / Fin du titre -->

	<!-- Favicon (optional) begins / Début du favicon (optionnel) -->
	<!-- <link rel="shortcut icon" href="images/favicon.ico" /> -->
	<!-- Favicon (optional) ends / Fin du favicon (optionnel) -->
	
	<!-- Meta-data begins / Début des métadonnées -->
	<meta name="dcterms.description" <?php _e("<!--:en-->content=\"English description / Description en anglais\"<!--:--><!--:fr-->content=\"French description / Description en français\"<!--:-->"); ?> />
	<meta name="description" <?php _e("<!--:en-->content=\"English description / Description en anglais\"<!--:--><!--:fr-->content=\"French description / Description en français\"<!--:-->"); ?> />
	<meta name="keywords" <?php _e("<!--:en-->content=\"English keywords / Mots-clés en anglais\"<!--:--><!--:fr-->content=\"French keywords / Mots-clés en français\"<!--:-->"); ?> />
	<meta name="dcterms.creator" <?php _e("<!--:en-->content=\"English name of the content author / Nom en anglais de l'auteur du contenu\"<!--:--><!--:fr-->content=\"French name of the content author / Nom en français de l'auteur du contenu\"<!--:-->"); ?> />
	<meta name="dcterms.title" content="<?php bloginfo('name'); ?>" />
	<meta name="dcterms.issued" title="W3CDTF" content="<?php the_time('Y-m-d') ?>" />
	<meta name="dcterms.modified" title="W3CDTF" content="<?php the_modified_time('Y-m-d') ?>" />
	<meta name="dcterms.subject" title="scheme" content="<?php _e("<!--:en-->English subject terms / Termes de sujet en anglais<!--:--><!--:fr-->French subject terms / Termes de sujet en français<!--:-->"); ?>" />
	<meta name="dcterms.language" title="ISO639-2" content="<?php _e("<!--:en-->eng<!--:--><!--:fr-->fra<!--:-->"); ?>" />
	<!-- Meta-data ends / Fin des métadonnées -->

	<!-- WET scripts/CSS begin / Début des scripts/CSS de la BOEW --><!--[if IE 6]><![endif]-->
	<link href="<?php bloginfo('template_directory'); ?>/css/base.css" rel="stylesheet" />
	<!--[if IE 8]><link href="<?php bloginfo('template_directory'); ?>/css/base-ie8.css" rel="stylesheet" /><![endif]-->
	<!--[if IE 7]><link href="<?php bloginfo('template_directory'); ?>/css/base-ie7.css" rel="stylesheet" /><![endif]-->
	<!--[if lte IE 6]><link href="<?php bloginfo('template_directory'); ?>/css/base-ie6.css" media="screen" rel="stylesheet" /><![endif]-->

<!-- CSS Grid System begins / Début du système de grille de CSS -->
	<link href="<?php bloginfo('template_directory'); ?>/grids/css/grid.css" media="screen" rel="stylesheet" />
	<link href="<?php bloginfo('template_directory'); ?>/grids/css/util.css" media="screen" rel="stylesheet" />
<!-- CSS Grid System ends / Fin du système de grille de CSS -->
<!-- GC Web Usability theme begins / Début du thème de la facilité d'emploi GC -->
	<link href="<?php bloginfo('template_directory'); ?>/css/framework-responsive-theme-gcwu-fegc.css" media="screen" rel="stylesheet" id="framework-responsive" />
	<link href="<?php bloginfo('template_directory'); ?>/css/theme-gcwu-fegc.css" rel="stylesheet" />
	<!--[if IE 8]><link href="<?php bloginfo('template_directory'); ?>/css/theme-gcwu-fegc-ie8.css" rel="stylesheet" /><![endif]-->
	<!--[if IE 7]><link href="<?php bloginfo('template_directory'); ?>/css/theme-gcwu-fegc-ie7.css" rel="stylesheet" /><![endif]-->
	<!--[if lte IE 6]><link href="<?php bloginfo('template_directory'); ?>/css/theme-gcwu-fegc-ie6.css" rel="stylesheet" /><![endif]-->
<!-- GC Web Usability theme ends / Fin du thème de la facilité d'emploi GC -->
<!-- Menu bar begins / Début de la barre de menu -->
	<link href="<?php bloginfo('template_directory'); ?>/js/support/menubar/style.css" rel="stylesheet" />
<!-- Menu bar ends /Fin de la barre de menu -->
<!-- FIP visual elements and identifiers begin / Début des éléments et identificateurs visuels de PCIM -->
	<link href="<?php bloginfo('template_directory'); ?>/fip-pcim/css/fip-pcim.css" rel="stylesheet" />
	<!--[if IE 8]><link href="<?php bloginfo('template_directory'); ?>/fip-pcim/css/fip-pcim-ie8.css" rel="stylesheet" /><![endif]-->
	<!--[if IE 7]><link href="<?php bloginfo('template_directory'); ?>/fip-pcim/css/fip-pcim-ie7.css" rel="stylesheet" /><![endif]-->
	<!--[if lte IE 6]><link href="<?php bloginfo('template_directory'); ?>/fip-pcim/css/fip-pcim-ie6.css" rel="stylesheet" /><![endif]-->
<!-- FIP visual elements and identifiers end / Fin des éléments et identificateurs visuels de PCIM -->
	<!-- WET scripts/CSS end / Fin des scripts/CSS de la BOEW -->
	<!-- Progressive enhancement begins / Début de l'amélioration progressive -->
	
    <?php gcwu_fegc_pe_js(); ?>
	<script>
	/* <![CDATA[ */
		var params = {
			menubar:""
		};
		PE.progress(params);
	/* ]]> */
	</script>
	<!-- Progressive enhancement ends / Fin de l'amélioration progressive -->
    
	<!-- Custom scripts/CSS begin / Début des scripts/CSS personnalisés -->
	<!--?php gcwu_fegc_css_options();?-->
	<!-- Custom scripts/CSS end / Fin des scripts/CSS personnalisés -->
	
<!-- WordPress Begins -->
<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" media="screen" />
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
<?php if ( is_singular() ) wp_enqueue_script( 'comment-reply' ); ?>
<?php wp_head(); ?>
<!-- WordPress Ends -->
</head>
<body itemscope="itemscope" itemtype="http://schema.org/WebPage" <?php body_class(); ?>>
<?php
global $clf_col_num;
if ($clf_col_num=='1') {
	echo "<!-- One column layout begins / Début de la mise en page d\'une colonne -->\r\n";
	echo "<div id=\"cn-body-inner-1col\">\r\n";
} elseif ($clf_col_num=='3') {
	echo "<!-- Three column layout begins / Début de la mise en page de trois colonnes -->\r\n";
	echo "<div id=\"cn-body-inner-3col\">\r\n";
} else {
	echo "<!-- Two column layout begins / Début de la mise en page de deux colonnes -->\r\n";
	echo "<div id=\"cn-body-inner-2col\">\r\n";
}
?>
	<!-- Skip header begins / Début du saut de l'en-tête -->
	<div id="cn-skip-head">
		<ul id="cn-tphp">
			<li id="cn-sh-link-1"><a href="#cn-cont"><?php _e("<!--:en-->Skip to main content<!--:--><!--:fr-->Passer au contenu principal<!--:-->"); ?></a></li>
<?php if ($clf_col_num=='1') { ?><li id="cn-sh-link-2"><a href="#cn-nav"><?php _e("<!--:en-->Skip to footer<!--:--><!--:fr-->Passer au pied de page<!--:-->"); ?></a></li>
<?php } else { ?>			<li id="cn-sh-link-2"><a href="#cn-nav"><?php _e("<!--:en-->Skip to primary navigation<!--:--><!--:fr-->Passer à la navigation principale<!--:-->"); ?></a></li><?php } ?>
		</ul>
	</div>
	<!-- Skip header ends / Fin du saut de l'en-tête -->
	<!-- Header begins / Début de l'en-tête -->
    <div id="cn-head"><div id="cn-head-inner">
	<header itemscope="itemscope" itemtype="http://schema.org/WPHeader">
<!-- GC Web Usability theme begins / Début du thème de la facilité d'emploi GC -->
		
      <!-- GC navigation bar begins / Début de la barre de navigation GC -->
		<nav role="navigation">
			<div id="cn-gcnb">
				<h2><?php _e("<!--:en-->Government of Canada navigation bar<!--:--><!--:fr-->Barre de navigation de la gouvernement de Canada<!--:-->"); ?></h2>
				<div id="cn-gcnb-inner">
					<div id="fip-pcim-gcnb" itemscope="itemscope" itemtype="http://schema.org/WPAdBlock">
						<div id="cn-sig"><div id="cn-sig-inner"><div id="fip-pcim-sig-eng" title="<?php _e("<!--:en-->Government of Canada<!--:--><!--:fr-->Gouvernement du Canada<!--:-->"); ?>"><img src="<?php bloginfo('template_directory'); ?>/fip-pcim/images/sig-<?php _e("<!--:en-->eng<!--:--><!--:fr-->fra<!--:-->"); ?>.gif" width="214" height="20" alt="<?php _e("<!--:en-->Government of Canada<!--:--><!--:fr-->Gouvernement du Canada<!--:-->"); ?>" /></div></div></div>
						<ul>
							<li id="cn-gcnb1"><a rel="external" href="http://www.canada.gc.ca/<?php _e("<!--:en-->home.html<!--:--><!--:fr-->accueil.html<!--:-->"); ?>">Canada.gc.ca</a></li>
							<li id="cn-gcnb2"><a rel="external" href="http://www.servicecanada.gc.ca/<?php _e("<!--:en-->eng/home.shtml<!--:--><!--:fr-->fra/accueil.shtml<!--:-->"); ?>">Services</a></li>
							<li id="cn-gcnb3"><a rel="external" href="http://www.canada.gc.ca/depts/major/depind-<?php _e("<!--:en-->eng<!--:--><!--:fr-->fra<!--:-->"); ?>.html">Departments</a></li>
							<li id="cn-gcnb-lang" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="<?php _e("<!--:en-->" . qtrans_convertURL($url, 'fr') . "<!--:--><!--:fr-->" . qtrans_convertURL($url, 'en') . "<!--:-->"); ?>" lang="<?php _e("<!--:en-->fr<!--:--><!--:fr-->en<!--:-->"); ?>"><?php _e("<!--:en-->Français<!--:--><!--:fr-->English<!--:-->"); ?></a></li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
		<!-- GC navigation bar ends / Fin de la barre de navigation GC -->
        
        <!-- Banner begins / Début de la bannière -->
		<div id="cn-banner" role="banner"><div id="cn-banner-inner">
			<div id="cn-wmms"><div id="cn-wmms-inner"><div id="fip-pcim-wmms" title="<?php _e("<!--:en-->Symbol of the Government of Canada<!--:--><!--:fr-->Symbole du gouvernement du Canada<!--:-->"); ?>"><img src="<?php bloginfo('template_directory'); ?>/fip-pcim/images/wmms.gif" width="126" height="30"  alt="<?php _e("<!--:en-->Symbol of the Government of Canada<!--:--><!--:fr-->Symbole du gouvernement du Canada<!--:-->"); ?>" /></div></div></div>

			<!-- Site title begins / Début du titre du site -->
			<div id="cn-site-title"><p id="cn-site-title-inner"><a href="<?php bloginfo('url'); ?>"><?php bloginfo('name'); ?></a></p></div>
			<!-- Site title ends / Fin du titre du site -->

			<!-- Site search begins / Début de la recherche du site -->
			<section role="search">
				<div id="cn-search-box">
					<h2><?php _e("<!--:en-->Search<!--:--><!--:fr-->Recherche<!--:-->"); ?></h2>
					<form action="<?php bloginfo('url'); ?>" method="get" id="searchform" >
						<div id="cn-search-box-inner">
							<label for="s">Search Web site</label>
                            <input id="s" name="s" type="search" class="field" value="<?php the_search_query(); ?>" size="27" maxlength="150" />
							<input id="cn-search-submit" name="cn-search-submit" type="submit" value="<?php _e("<!--:en-->Search<!--:--><!--:fr-->Recherche<!--:-->"); ?>" />
                            <?php if(qtrans_getLanguage()=='fr'): ?>
							<input id="lang" name="lang" type="hidden" value="fr" />
							<?php endif; ?>
						</div>
					</form>
				</div>
			</section>
			<!-- Site search ends / Fin de la recherche du site -->
		</div></div>
		<!-- Banner ends / Fin de la bannière -->
        <nav role="navigation">
<div id="cn-psnb"><h2>Site navigation bar</h2><div id="cn-psnb-inner"><div class="wet-boew-menubar mb-megamenu"><div>
<ul class="mb-menu">
<li><section><h3><a href="#">Section 1</a></h3><div class="mb-sm"><div class="span-2">
<ul>
<li><a href="#">Item 1.1</a></li>
<li><a href="#">Item 1.2</a></li>
<li><a href="#">Item 1.3</a></li>
<li><a href="#">Item 1.4</a></li>
<li><a href="#">Item 1.5</a></li>
<li><a href="#">Item 1.6</a></li>
<li><a href="#">Item 1.7</a></li>
<li><a href="#">Item 1.8</a></li>
</ul>
</div>
<div class="clear"></div>
</div></section></li>
<li><section><h3><a href="#">Section 2</a></h3><div class="mb-sm">
<div class="span-2">
<section><h4><a href="#">Section 2.1</a></h4>
<ul>
<li><a href="#">Item 2.1.1</a></li>
<li><a href="#">Item 2.1.2</a></li>
<li><a href="#">Item 2.1.3</a></li>
<li><a href="#">Item 2.1.4</a></li>
<li><a href="#">Item 2.1.5</a></li>
<li><a href="#">Item 2.1.6</a></li>
</ul>
</section>
</div>
<div class="span-2">
<section><h4><a href="#">Section 2.2</a></h4>
<ul>
<li><a href="#">Item 2.2.1</a></li>
<li><a href="#">Item 2.2.2</a></li>
<li><a href="#">Item 2.2.3</a></li>
<li><a href="#">Item 2.2.4</a></li>
<li><a href="#">Item 2.2.5</a></li>
<li><a href="#">Item 2.2.6</a></li>
<li><a href="#">Item 2.2.7</a></li>
<li><a href="#">Item 2.2.8</a></li>
</ul>
</section>
</div>
<div class="clear"></div>
</div></section></li>
<li><section><h3><a href="#">Section 3</a></h3><div class="mb-sm">
<div class="span-2">
<section><h4><a href="#">Section 3.1</a></h4>
<ul>
<li><a href="#">Item 3.1.1</a></li>
<li><a href="#">Item 3.1.2</a></li>
<li><a href="#">Item 3.1.3</a></li>
<li><a href="#">Item 3.1.4</a></li>
<li><a href="#">Item 3.1.5</a></li>
<li><a href="#">Item 3.1.6</a></li>
</ul>
</section>
</div>
<div class="span-2">
<section><h4><a href="#">Section 3.2</a></h4>
<ul>
<li><a href="#">Item 3.2.1</a></li>
<li><a href="#">Item 3.2.2</a></li>
<li><a href="#">Item 3.2.3</a></li>
<li><a href="#">Item 3.2.4</a></li>
<li><a href="#">Item 3.2.5</a></li>
<li><a href="#">Item 3.2.6</a></li>
<li><a href="#">Item 3.2.7</a></li>
<li><a href="#">Item 3.2.8</a></li>
</ul>
</section>
</div>
<div class="span-2">
<section><h4><a href="#">Section 3.3</a></h4>
<ul>
<li><a href="#">Item 3.3.1</a></li>
<li><a href="#">Item 3.3.2</a></li>
<li><a href="#">Item 3.3.3</a></li>
</ul>
</section>
</div>
<div class="clear"></div>
</div></section></li>
<li><section><h3><a href="#">Section 4</a></h3><div class="mb-sm">
<div class="span-2">
<section><h4><a href="#">Section 4.1</a></h4>
<ul>
<li><a href="#">Item 4.1.1</a></li>
<li><a href="#">Item 4.1.2</a></li>
<li><a href="#">Item 4.1.3</a></li>
</ul>
</section>
<section><h4><a href="#">Section 4.2</a></h4>
<ul>
<li><a href="#">Item 4.2.1</a></li>
<li><a href="#">Item 4.2.2</a></li>
<li><a href="#">Item 4.2.3</a></li>
<li><a href="#">Item 4.2.4</a></li>
</ul>
</section>
<section><h4><a href="#">Section 4.3</a></h4>
<ul>
<li><a href="#">Item 4.3.1</a></li>
<li><a href="#">Item 4.3.2</a></li>
</ul>
</section>
</div>
<div class="span-2">
<section><h4><a href="#">Section 4.4</a></h4>
<ul>
<li><a href="#">Item 4.4.1</a></li>
<li><a href="#">Item 4.4.2</a></li>
<li><a href="#">Item 4.4.3</a></li>
<li><a href="#">Item 4.4.4</a></li>
</ul>
</section>
<section><h4><a href="#">Section 4.5</a></h4>
<ul>
<li><a href="#">Item 4.5.1</a></li>
<li><a href="#">Item 4.5.2</a></li>
<li><a href="#">Item 4.5.3</a></li>
<li><a href="#">Item 4.5.4</a></li>
<li><a href="#">Item 4.5.5</a></li>
</ul>
</section>
</div>
<div class="clear"></div>
</div></section></li>
<li><div><a href="#">Section 5</a></div></li>
<li><section><h3><a href="#">Section 6</a></h3><div class="mb-sm">
<div class="span-2">
<section><h4><a href="#">Section 6.1</a></h4>
<ul>
<li><a href="#">Item 6.1.1</a></li>
<li><a href="#">Item 6.1.2</a></li>
<li><a href="#">Item 6.1.3</a></li>
<li><a href="#">Item 6.1.4</a></li>
<li><a href="#">Item 6.1.5</a></li>
<li><a href="#">Item 6.1.6</a></li>
</ul>
</section>
</div>
<div class="span-2">
<section><h4><a href="#">Section 6.2</a></h4>
<ul>
<li><a href="#">Item 6.2.1</a></li>
<li><a href="#">Item 6.2.2</a></li>
<li><a href="#">Item 6.2.3</a></li>
<li><a href="#">Item 6.2.4</a></li>
<li><a href="#">Item 6.2.5</a></li>
<li><a href="#">Item 6.2.6</a></li>
<li><a href="#">Item 6.2.7</a></li>
<li><a href="#">Item 6.2.8</a></li>
</ul>
</section>
</div>
<div class="span-2">
<section><h4><a href="#">Section 6.3</a></h4>
<ul>
<li><a href="#">Item 6.3.1</a></li>
<li><a href="#">Item 6.3.2</a></li>
<li><a href="#">Item 6.3.3</a></li>
</ul>
</section>
</div>
<div class="span-2">
<section><h4><a href="#">Section 6.4</a></h4>
<ul>
<li><a href="#">Item 6.4.1</a></li>
<li><a href="#">Item 6.4.2</a></li>
<li><a href="#">Item 6.4.3</a></li>
<li><a href="#">Item 6.4.4</a></li>
<li><a href="#">Item 6.4.5</a></li>
<li><a href="#">Item 6.4.6</a></li>
</ul>
</section>
</div>
<div class="clear"></div>
</div></section></li>
<li><section><h3><a href="#">Section 7</a></h3><div class="mb-sm">
<div class="span-2">
<section><h4><a href="#">Section 7.1</a></h4>
<ul>
<li><a href="#">Item 7.1.1</a></li>
<li><a href="#">Item 7.1.2</a></li>
<li><a href="#">Item 7.1.3</a></li>
<li><a href="#">Item 7.1.4</a></li>
<li><a href="#">Item 7.1.5</a></li>
<li><a href="#">Item 7.1.6</a></li>
</ul>
</section>
</div>
<div class="span-2">
<section><h4><a href="#">Section 7.2</a></h4>
<ul>
<li><a href="#">Item 7.2.1</a></li>
<li><a href="#">Item 7.2.2</a></li>
<li><a href="#">Item 7.2.3</a></li>
<li><a href="#">Item 7.2.4</a></li>
<li><a href="#">Item 7.2.5</a></li>
<li><a href="#">Item 7.2.6</a></li>
<li><a href="#">Item 7.2.7</a></li>
<li><a href="#">Item 7.2.8</a></li>
</ul>
</section>
</div>
<div class="span-2">
<section><h4><a href="#">Section 7.3</a></h4>
<ul>
<li><a href="#">Item 7.3.1</a></li>
<li><a href="#">Item 7.3.2</a></li>
<li><a href="#">Item 7.3.3</a></li>
</ul>
</section>
</div>
<div class="clear"></div>
</div></section></li>
</ul>
</div></div></div></div>
			<!-- Site navigation bar ends / Fin de la barre de navigation du site -->

			<!-- Breadcrumbs begins / Début du fil d'Ariane -->
			<div id="cn-bc">
				<h2><?php _e("<!--:en-->Breadcrumb<!--:--><!--:fr-->Fil d'Ariane<!--:-->"); ?></h2>
				<div id="cn-bc-inner">
					<?php the_breadcrumb($post); ?>
				</div>
			</div>
			<!-- Breadcrumbs end / Fin du fil d'Ariane -->
		</nav>
<!-- GC Web Usability theme ends / Fin du thème de la facilité d'emploi GC -->
	</header>
	</div></div>
	<!-- Header ends / Fin de l'en-tête -->