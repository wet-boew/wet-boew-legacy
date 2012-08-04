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
	<xsl:variable name="theme_config" select="document('res/config.xml')/templateconfig" />
	
	<xsl:template name="theme_basestyles">
		<xsl:comment>base theme begins / Début du thème base</xsl:comment>
		<link href="{$theme_config/stylesheets/stylesheet[@id='themebase']/@href}" rel="stylesheet" type="text/css" />
		<xsl:comment>[if lte IE 6]&gt;&lt;link href="<xsl:value-of select="$theme_config/stylesheets/stylesheet[@id='ie6themebase']/@href" />" rel="stylesheet" type="text/css" /&gt;&lt;![endif]</xsl:comment>
		<xsl:comment>base theme begins / Début du thème base</xsl:comment>
	</xsl:template>
	
	<xsl:template name="theme_printstyles">

	</xsl:template>
	
	<xsl:template name="theme_scripts">
			
	</xsl:template>
  
</xsl:stylesheet> 
