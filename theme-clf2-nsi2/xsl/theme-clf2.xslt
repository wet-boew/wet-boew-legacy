<?xml version="1.0" encoding="utf-8"?>
<!-- 
	XML/XSLT Abstraction Project v1.2 / Abstraction XML/XSLT  v1.2
	Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
	-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" xmlns:xhtml="http://www.w3.org/1999/xhtml" exclude-result-prefixes="xhtml">
	
	<xsl:import href="../../xsl/base.xslt"/>
	
	
	<xsl:output method="xml" doctype-system="about:legacy-compat" indent="yes" encoding="utf-8" omit-xml-declaration="yes"/>
	
	<!-- Get the theme configurations -->
	<xsl:variable name="clfconfig" select="document('res/clfconfig.xml')/templateconfig" />
	<!-- Gets the theme strings -->
	<xsl:variable name="clfstrings" select="document(concat('res/clftxt-', $lang, '.xml'))/strings/text" />
	
	<xsl:template name="theme_basestyles">
		<xsl:comment>clf2-nsi2 theme begins / Début du thème clf2-nsi2</xsl:comment>
		<link href="{$clfconfig/stylesheets/stylesheet[@id='themeclf2']/@href}" rel="stylesheet" type="text/css" />
		<xsl:comment>[if IE 7]&gt;&lt;link href="<xsl:value-of select="$clfconfig/stylesheets/stylesheet[@id='ie7themeclf2']/@href" />" rel="stylesheet" type="text/css" /&gt;&lt;![endif]</xsl:comment>
		<xsl:comment>[if lte IE 6]&gt;&lt;link href="<xsl:value-of select="$clfconfig/stylesheets/stylesheet[@id='ie6themeclf2']/@href" />" rel="stylesheet" type="text/css" /&gt;&lt;![endif]</xsl:comment>
		<xsl:comment>clf2-nsi2 theme ends / Fin du thème clf2-nsi2</xsl:comment>
	</xsl:template>
	
	<xsl:template name="theme_printstyles">
		<xsl:comment>clf2-nsi2 theme begins / Début du thème clf2-nsi2</xsl:comment>
		<link href="{$clfconfig/stylesheets/stylesheet[@id='printthemeclf2']/@href}" rel="stylesheet" media="print" type="text/css" />
		<xsl:comment>clf2-nsi2 theme ends / Fin du thème clf2-nsi2</xsl:comment>
	</xsl:template>
	
	<xsl:template name="theme_scripts">
			
	</xsl:template>

  <xsl:template name="theme_header">
    <xsl:comment>clf2-nsi2 theme begins / Début du thème clf2-nsi2</xsl:comment>
        <xsl:call-template name="fip" />
        <xsl:call-template name="banner" />
			<div role="navigation">
				<nav>
					<xsl:call-template name="commonbar" />
					<xsl:call-template name="breadcrumb" />
				</nav>
			</div>
    <xsl:comment>clf2-nsi2 theme ends / Fin du thème clf2-nsi2</xsl:comment>
  </xsl:template>
	
	<xsl:template name="theme_footer">
		<xsl:comment>clf2-nsi2 theme begins / Début du thème clf2-nsi2</xsl:comment>
				<div id="cn-in-pd">
					<dl id="cn-doc-dates" role="contentinfo">
						<dt><xsl:value-of select ="$clfstrings[@id = 'datemodified']"/></dt>
						<dd><span><time><xsl:value-of select="/xhtml:html/xhtml:head/xhtml:meta[@name = 'dcterms.modified']/@content" /></time></span></dd>
					</dl>
					<div id="cn-toppage-foot">
						<a href="#cn-tphp" title="{$clfstrings[@id = 'toplinktitle']}"><xsl:value-of select="$clfstrings[@id = 'toplinktext']"/></a>
					</div>
					<div id="cn-in-pd-links">
						<ul>
							<li id="cn-inotices-link"><a href="{$clfconfig/links/link[@id = 'importantnotices']/src[lang($lang) = true()]}" rel="license"><xsl:value-of select ="$clfstrings[@id = 'importantnotices']"/></a></li>
						</ul>
					</div>
				</div>
		<xsl:comment>clf2-nsi2 theme ends / Fin du thème clf2-nsi2</xsl:comment>
  </xsl:template>
  
  <xsl:template name="fip">
    <div id="cn-sig"><img src="{$clfconfig/images/img[@id=concat('sig-', $lang)]/@src}" width="{$clfconfig/images/img[@id=concat('sig-', $lang)]/@width}" height="{$clfconfig/images/img[@id=concat('sig-', $lang)]/@height}" alt="{$clfconfig/strings/string[@id='sigalt']/text[lang($lang) = true()]}" title="{$clfconfig/strings/string[@id='sigalt']/text[lang($lang) = true()]}" /></div>
    <div id="cn-wmms"><img src="{$clfconfig/images/img[@id='wmms']/@src}" width="83" height="20" alt="{$clfstrings[@id = 'wmtext']}" title="{$clfstrings[@id = 'wmtext']}" /></div>
  </xsl:template>
  
  <xsl:template name="banner">
    <xsl:comment>Banner begins / Début de la bannière</xsl:comment>
		<div id="cn-leaf"><xsl:text> </xsl:text></div>
    <div id="cn-banner-{$lang_3}" role="banner">
      <p id="cn-banner-text"><xsl:value-of select="$clfconfig/strings/string[@id='bannername']/text[lang($lang) = true()]" /></p>
      <p><xsl:value-of select="$clfconfig/strings/string[@id='bannerurl']/text[lang($lang) = true()]" /></p>
    </div>
    <xsl:comment>Banner ends / Fin de la bannière</xsl:comment>
  </xsl:template>
  
  <xsl:template name="commonbar">
    <xsl:comment>Common menu bar begins / Début de la barre de menu commune</xsl:comment>
    <div id="cn-cmb">
        <h2><xsl:value-of select ="$clfstrings[@id = 'commonbar']"/></h2>
        <ul>
          <xsl:variable name="langlink" select="/xhtml:html/xhtml:head/xhtml:link[@rel='alternate' and @hreflang]" />
          <li id="cn-cmb1">
            <a href="{$langlink/@href}" lang="{$langlink/@hreflang}" xml:lang="{$langlink/@hreflang}" title="{$clfstrings[@id = 'langlinktitle']}"><xsl:value-of select ="$clfstrings[@id = 'langlinktext']"/></a>
          </li>
          <li id="cn-cmb2">
            <a href="{$clfconfig/links/link[@id = 'home']/src[lang($lang) = true()]}" title="{$clfstrings[@id = 'homelinktitle']}"><xsl:value-of select ="$clfstrings[@id = 'homelinktext']"/></a>
          </li>
          <li id="cn-cmb3">
            <a href="{$clfconfig/links/link[@id = 'contactus']/src[lang($lang) = true()]}" title="{$clfstrings[@id = 'contactlinktitle']}"><xsl:value-of select ="$clfstrings[@id = 'contactlinktext']"/></a>
          </li>
          <li id="cn-cmb4">
            <a href="{$clfconfig/links/link[@id = 'help']/src[lang($lang) = true()]}" title="{$clfstrings[@id = 'helplinktitle']}"><xsl:value-of select ="$clfstrings[@id = 'helplinktext']"/></a>
          </li>
          <li id="cn-cmb5">
            <a rel="search" href="{$clfconfig/links/link[@id = 'search']/src[lang($lang) = true()]}" title="{$clfstrings[@id = 'searchlinktitle']}"><xsl:value-of select ="$clfstrings[@id = 'searchlinktext']"/></a>
          </li>
          <li id="cn-cmb6">
            <a rel="external" href="{$clfconfig/links/link[@id = 'canadasite']/src[lang($lang) = true()]}" title="{$clfstrings[@id = 'canadalinktitle']}"><xsl:value-of select ="$clfstrings[@id = 'canadalinktext']"/></a>
          </li>
        </ul>
    </div>
    <xsl:comment>Common menu bar ends / Fin de la barre de menu commune</xsl:comment>
  </xsl:template>
  
  <xsl:template name="breadcrumb">
    <xsl:comment>Breadcrumb begins / Début du fil d'Ariane</xsl:comment>
    <div id="cn-bcrumb">
        <h2><xsl:value-of select ="$clfstrings[@id = 'breadcrumb']"/></h2>
				<ol>
				<li><a href="{$clfconfig/links/link[@id = 'home']/src[lang($lang) = true()]}" title="{$clfstrings[@id = 'homelinktitle']}"><xsl:value-of select ="$clfstrings[@id = 'homelinktext']"/></a><xsl:text> &gt; </xsl:text></li>
				<xsl:variable name="crumbs" select="/xhtml:html/xhtml:head/xhtml:link[@data-breadcrum-level]" />
				<xsl:for-each select="$crumbs">
					<xsl:sort select="@data-breadcrum-level" order="descending" />
					<li><a href="{@href}">
						<xsl:value-of select="@title"/>
					</a><xsl:text> &gt; </xsl:text></li> 
				</xsl:for-each>
				<li><span>
					<xsl:value-of select="/xhtml:html/xhtml:head/xhtml:title"/>
				</span></li>
				</ol>
    </div>
    <xsl:comment>Breadcrumb ends / Fin du fil d'Ariane</xsl:comment>
  </xsl:template>
</xsl:stylesheet> 
