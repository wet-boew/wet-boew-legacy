<?xml version="1.0" encoding="utf-8"?>
<!-- 
	XML/XSLT Abstraction Project v1.2 / Abstraction XML/XSLT  v1.2
	Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
	-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" xmlns:xhtml="http://www.w3.org/1999/xhtml" exclude-result-prefixes="xhtml">
    <!-- Include Utility template -->
	<xsl:include href="utils.xslt" />
	
	<!-- Get the template configurations -->
	<xsl:variable name="base_config" select="document('res/baseconfig.xml')/templateconfig" />
	<!-- Get the template strings -->
	<xsl:variable name="base_strings" select="document(concat('res/basetxt-', $lang, '.xml'))/strings/text" />
    
	<xsl:output method="xml" indent="yes"/>

	<xsl:variable name="content" select="/" />
	<xsl:variable name="header" select="document(/xhtml:html/xhtml:head/xhtml:link[@data-theme='header']/@href)/xhtml:body" />
	<xsl:variable name="footer" select="document(/xhtml:html/xhtml:head/xhtml:link[@data-theme='footer']/@href)/xhtml:body" />
	<xsl:variable name="leftnav" select="document(/xhtml:html/xhtml:head/xhtml:link[@data-navigation='left']/@href)/xhtml:body" />
	<xsl:variable name="rightnav" select="document(/xhtml:html/xhtml:head/xhtml:link[@data-navigation='right']/@href)/xhtml:body" />

    <!-- Gets the language of the page -->
		<xsl:variable name="lang">
			<xsl:choose>
				<xsl:when test="starts-with($content/xhtml:html/@lang, 'en') or $content/xhtml:html[lang('en') = true()]">
					<xsl:value-of select="'en'"/>
				</xsl:when>
				<xsl:when test="starts-with($content/xhtml:html/@lang, 'fr') or $content/xhtml:html[lang('fr') = true()]">
					<xsl:value-of select="'fr'"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:message terminate="yes">
						Document language not specified. Set the lang and/or the xml:lang attribute of the root (html) element.
					</xsl:message>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="lang_3">
			<xsl:choose>
				<xsl:when test="$lang = 'en'">
					<xsl:value-of select="'eng'"/>
				</xsl:when>
				<xsl:when test="$lang='fr'">
					<xsl:value-of select="'fra'"/>
				</xsl:when>
			</xsl:choose>
		</xsl:variable>
	
		<!-- Gets the number of column for the page -->
		<xsl:variable name="col_number">
			<xsl:choose>
				<xsl:when test="boolean($leftnav) = true() and boolean($rightnav) = true()">
					<xsl:text>3</xsl:text>
				</xsl:when>
				<xsl:when test="boolean($leftnav) = true() or boolean($rightnav) = true()">
					<xsl:text>2</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>1</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="rightIsPrimary">
			<xsl:choose>
				<xsl:when test="$col_number = '2' and boolean(/xhtml:html/xhtml:head/xhtml:link[@data-navigation='right']/@href) = true()">
					1
				</xsl:when>
				<xsl:otherwise>
					0
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<!-- Build the html tag-->
		<xsl:template match="xhtml:html">
			<xsl:choose>
				<xsl:when test="$lang != ''">
					<xsl:copy>
						<xsl:for-each select="@*">
							<xsl:attribute name="{name(.)}">
								<xsl:value-of select="."/>
							</xsl:attribute>
						</xsl:for-each>
						<xsl:apply-templates select="./*" />
					</xsl:copy>
				</xsl:when>
				<xsl:otherwise>
					<xsl:copy-of select="."/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:template>

		<!-- Build the head section -->
		<xsl:template match="xhtml:head">
			<xsl:copy>
				<xsl:comment>
				Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
				Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
				Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
				</xsl:comment>
				
				<xsl:call-template name="favicon" />
			
				<xsl:for-each select="@*">
					<xsl:attribute name="{name(.)}">
						<xsl:value-of select="."/>
					</xsl:attribute>
				</xsl:for-each>
				<xsl:apply-templates select="*[name(.) != 'script' and name(.) != 'link' or (name(.) = 'link' and ((boolean(@rel) = false() or @rel != 'stylesheet') and (boolean(@type) = false() or @type != 'text/css')))] | comment()" />
				
				<xsl:call-template name="styles" />
				<xsl:call-template name="scripts" />
			</xsl:copy>
		</xsl:template>

		<!-- build the body section -->
		<xsl:template match="xhtml:body">
			<xsl:copy>
				<xsl:for-each select="@*">
					<xsl:attribute name="{name(.)}">
						<xsl:value-of select="."/>
					</xsl:attribute>
				</xsl:for-each>
	      
				<xsl:comment>Column layout begins / Début de la mise en page de colonnes</xsl:comment>
				<div>
					<xsl:attribute name="id">
						<xsl:text>cn-body-inner-</xsl:text><xsl:value-of select="$col_number" /><xsl:text>col</xsl:text>
						<xsl:if test="$rightIsPrimary = 1"><xsl:text>-right</xsl:text></xsl:if>
					</xsl:attribute>
					<xsl:call-template name="acc_links" />
					<xsl:call-template name="header" />
					<div id="cn-cols">
					<xsl:call-template name="content" />
					<xsl:call-template name="navigation" />
					</div>
					<xsl:call-template name="footer" />
				</div>
				<xsl:comment>Column layout ends / Fin de la mis en page de colonnes</xsl:comment>
			</xsl:copy>
		</xsl:template>
		
		<!-- Output the unmatched tags as-is -->
		<xsl:template match="xhtml:*">
			<xsl:copy>
				<xsl:for-each select="@*">
					<xsl:attribute name="{name(.)}">
						<xsl:value-of select="." />
					</xsl:attribute>
				</xsl:for-each>
				<xsl:choose>
					<xsl:when test="count(./* | ./text()) &gt; 0">
						<xsl:apply-templates select="./* | ./text()" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:if test="name(.) != 'img' and name(.) != 'br' and name(.) != 'hr' and name(.) != 'meta' and name(.) != 'input' and name(.) != 'link' and name(.) != 'frame' and name(.) != 'param'">
							<xsl:text> </xsl:text>
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>
				
			</xsl:copy>
		</xsl:template>
	
	<!-- Disable output escaping for text inside script tags-->
	<xsl:template match="text()">
		<xsl:choose>
			<xsl:when test="name(..) = 'script'">
				<xsl:value-of select="." disable-output-escaping="yes"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
		
	</xsl:template>

		<!-- Pass the comment of the original document to the transformed document-->
		<xsl:template match="comment()">
			<xsl:comment>
				<xsl:value-of select="."/>
			</xsl:comment>
		</xsl:template>
		
		<xsl:template name="favicon">
			<xsl:if test="$base_config/icons/ico[@id='favicon']/@src != ''">
				<link rel="shortcut icon" href="{$base_config/icons/ico[@id='favicon']/@src}" />
			</xsl:if>
		</xsl:template>
		
		<xsl:template name="styles">
			<xsl:comment>WET CSS begin / Début des CSS de la BOEW</xsl:comment>
			<link href="{$base_config/stylesheets/stylesheet[@id='base']/@href}" rel="stylesheet" type="text/css" />
			<xsl:comment>[if IE 8]&gt;&lt;link href="<xsl:value-of select="$base_config/stylesheets/stylesheet[@id='ie8base']/@href" />" rel="stylesheet" type="text/css" /&gt;&lt;![endif]</xsl:comment>
			<xsl:comment>[if IE 7]&gt;&lt;link href="<xsl:value-of select="$base_config/stylesheets/stylesheet[@id='ie7base']/@href" />" rel="stylesheet" type="text/css" /&gt;&lt;![endif]</xsl:comment>
			<xsl:comment>[if lte IE 6]&gt;&lt;link href="<xsl:value-of select="$base_config/stylesheets/stylesheet[@id='ie6base']/@href" />" rel="stylesheet" type="text/css" /&gt;&lt;![endif]</xsl:comment>
			<link href="{$base_config/stylesheets/stylesheet[@id='util']/@href}" rel="stylesheet" type="text/css" />
			<xsl:call-template name="theme_basestyles" />
			<xsl:comment>WET CSS end / Fin des CSS de la BOEW</xsl:comment>
			<xsl:comment>WET print CSS begins / Début du CSS de la BOEW pour l'impression</xsl:comment>
			<link href="{$base_config/stylesheets/stylesheet[@id='printbase']/@href}" rel="stylesheet" media="print" type="text/css" />
			<xsl:call-template name="theme_printstyles" />
			<xsl:comment>WET print CSS ends / Fin du CSS de la BOEW pour l'impression</xsl:comment>
	    
			<xsl:comment>Custom CSS begin / Début des CSS personnalisés</xsl:comment>
			<xsl:for-each select="/xhtml:html/xhtml:head/xhtml:link[@rel='stylesheet' or @type='text/css'] | /xhtml:html/xhtml:head/xhtml:style">
				<xsl:copy-of select="."/>
			</xsl:for-each>
			<xsl:comment>Custom CSS end / Fin des CSS personnalisés</xsl:comment>
		</xsl:template>
	  
		<xsl:template name="scripts">
			<xsl:comment>Progressive enhancement begins / Début de l'amélioration progressive</xsl:comment>
			<script src="{$base_config/scripts/script[@id='jquery']/@href}"><xsl:text> </xsl:text></script>
			<script src="{$base_config/scripts/script[@id='pe']/@href}" id="progressive"><xsl:text> </xsl:text></script>
			<xsl:call-template name="theme_scripts" />
			<xsl:comment>Progressive enhancement ends / Fin de l'amélioration progressive</xsl:comment>
			<xsl:comment>Custom scripts begin / Début des scripts personnalisés</xsl:comment>
			<xsl:for-each select="/xhtml:html/xhtml:head/xhtml:script">
				<xsl:element name="script">
					<xsl:for-each select="@*">
						<xsl:attribute name="{name(.)}">
						<xsl:value-of select="." disable-output-escaping="yes"/>
					</xsl:attribute>
					</xsl:for-each>
					<xsl:choose>
						<xsl:when test="boolean(.//text()) = true() and string-length(.//text()) &gt; 0 ">
							<xsl:value-of select="." disable-output-escaping="yes"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text> </xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
			</xsl:for-each>
			<xsl:comment>Custom scripts end / Fin des scripts personnalisés</xsl:comment>
		</xsl:template>

		<xsl:template name="acc_links">
			<xsl:comment>Skip header begins / Début du saut de l'en-tête</xsl:comment>
			<div id="cn-skip-head">
				<ul id="cn-tphp">
					<li id="cn-sh-link-1">
						<a  href="#cn-cont"><xsl:value-of select ="$base_strings[@id = 'skiptocontent']"/></a>
					</li>
					<li id="cn-sh-link-2">
						<a href="#cn-nav"><xsl:value-of select ="$base_strings[@id = 'skiptonav']"/></a>
					</li>
				</ul>
			</div>
			<xsl:comment>Skip header ends / Fin du saut de l'en-tête</xsl:comment>
		</xsl:template>

		<xsl:template name="header">
			<xsl:comment>Header begins / Début de l'en-tête</xsl:comment>
			<div id="cn-head"><div id="cn-head-inner">
				<header>
					<xsl:call-template name="theme_header" />
				</header>
			</div></div>
			<xsl:comment>Header ends / Fin de l'en-tête</xsl:comment>
		</xsl:template>
		
		<xsl:template name="content">
			<xsl:comment>Main content begins / Début du contenu principal</xsl:comment>
			<xsl:if test="number($col_number) > 1"><div id="cn-centre-col-gap"><xsl:text> </xsl:text></div></xsl:if>
			<div id="cn-centre-col" role="main"><div id="cn-centre-col-inner">

				<xsl:apply-templates select="$content/xhtml:html/xhtml:body/*"/>
			</div></div>
			<xsl:comment>Main content ends / Fin du contenu principal</xsl:comment>
		</xsl:template>
		
		<xsl:template name="footer">
			<xsl:comment>Footer begins / Début du pied de page </xsl:comment>
			<div id="cn-foot"><div id="cn-foot-inner">
				<footer>
					<h2>
						<xsl:if test="number($col_number) &lt; 2">
							<xsl:attribute name="id">cn-nav</xsl:attribute>
						</xsl:if>
						<xsl:value-of select ="$base_strings[@id = 'footer']"/>
					</h2>
					<xsl:call-template name="theme_footer" />
				</footer>
			</div></div>
			<xsl:comment>Footer ends / Fin du pied de page</xsl:comment>
		</xsl:template>
		
		<xsl:template name="navigation">
				<xsl:call-template name="left_col" />
				<xsl:call-template name="right_col" />
		</xsl:template>
		
		<xsl:template name="left_col">
			<xsl:if test="boolean($leftnav)">
			<xsl:comment>Primary navigation (left column) begins / Début de la navigation principale (colonne gauche) </xsl:comment>
			<div id="cn-left-col-gap"><xsl:text> </xsl:text></div>
			<div id="cn-left-col"><div id="cn-left-col-inner">

				<section>
					<h2 id="cn-nav"><xsl:value-of select ="$base_strings[@id = 'primary']"/><xsl:text> </xsl:text><xsl:value-of select ="$base_strings[@id = 'leftcol']"/></h2>
						<xsl:copy-of select="$leftnav/*" />
				</section>
			</div></div>
			<xsl:comment>Primary navigation (left column) ends / Fin de la navigation principale (colonne gauche)</xsl:comment>
			</xsl:if>
		</xsl:template>

		<xsl:template name="right_col">
			<xsl:if test="boolean($rightnav)">
				<xsl:comment>
					<xsl:choose>
						<xsl:when test="$rightIsPrimary = 1">Primary navigation(right column) begins / Début de la navigation principale (colonne droite)</xsl:when><xsl:otherwise>Supplemental content (right column) begins / Début du contenu supplémentaire (colonne droite)</xsl:otherwise>
					</xsl:choose>
				</xsl:comment>
				<div id="cn-right-col-gap"><xsl:text> </xsl:text></div>
				<div id="cn-right-col">
					<xsl:if test="$rightIsPrimary != 1"><xsl:attribute name="role">complementary</xsl:attribute></xsl:if>
					<div id="cn-right-col-inner">
						<section>
							<h2>
							<xsl:choose><xsl:when test="$rightIsPrimary = 1"><xsl:value-of select ="$base_strings[@id = 'primary']"/></xsl:when><xsl:otherwise><xsl:value-of select ="$base_strings[@id = 'supplemental']"/></xsl:otherwise></xsl:choose>
							<xsl:text> </xsl:text><xsl:value-of select ="$base_strings[@id = 'rightcol']"/>
							</h2>
							<xsl:copy-of select="$rightnav/*" />
						</section>
					</div>
				</div>
				<xsl:comment>
					<xsl:choose>
						<xsl:when test="$rightIsPrimary = 1">Primary navigation(right column) ends / Début de la navigation principale (colonne droite)</xsl:when><xsl:otherwise>Supplemental content (right column) begins / Fin du contenu supplémentaire (colonne droite)</xsl:otherwise>
					</xsl:choose>
				</xsl:comment>
			</xsl:if>
		</xsl:template>
		
		<!-- Template for a nonvalid page error -->
		<xsl:template match="error">
			<html>
				
			</html>
		</xsl:template>
	
		<!-- Placeholder to be overidden in themes -->
		<xsl:template name="theme_basestyles"></xsl:template>
		<xsl:template name="theme_printstyles"></xsl:template>
		<xsl:template name="theme_scripts"></xsl:template>
		<xsl:template name="theme_header">
			<xsl:if test="boolean($header)">
				<xsl:copy-of select="$header/*" />
			</xsl:if>
		</xsl:template>
		<xsl:template name="theme_footer">
			<xsl:if test="boolean($footer)">
				<xsl:copy-of select="$footer/*" />
			</xsl:if>
		</xsl:template>
</xsl:stylesheet>
