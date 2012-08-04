<?xml version="1.0" encoding="utf-8"?>
<!-- 
	XML/XSLT Abstraction Project v1.2 / Abstraction XML/XSLT  v1.2
	Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
	-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:ut="http://www.tbs-sct.gc.ca/clf-nsi/ut" exclude-result-prefixes="xhtml">
  
	<!-- This stylesheet depends on base.xslt and does not work as a standalone stylesheet -->
	
	<xsl:variable name="utilstrings" select="document(concat('res/utiltxt-', $lang, '.xml'))/strings//txt" />
	
	<!-- Template for a mediaplayer -->
	<!-- Usage : <ut:mediaplayer id="myid" src="somevideo.flv" caption="captions.xml" img="preview.jpg" height="300" width="400" /> -->
	<xsl:template match="ut:mediaplayer">
		 <!-- TODO: MediaPlayer Template -->
	 </xsl:template>
	
	<!-- Template for a Table of Content Generated from metadata information-->
	<!-- Usage : <ut:toc id="..." />-->
	<xsl:template match="ut:toc">
		<xsl:if test="count(/xhtml:html/xhtml:head/xhtml:link[@rel='index']/@href) &gt;0 and count(@id) &gt; 0">
			<div id="{@id}" class="tableContent">
				<nav>
				<ul>
					<li id="{@id}_first">
					<xsl:choose>
						<xsl:when test="/xhtml:html/xhtml:head/xhtml:link[@rel='first']/@href">
							<a href="{/xhtml:html/xhtml:head/xhtml:link[@rel='first']/@href}" title="{$utilstrings[@id = 'toc_first']} - {/xhtml:html/xhtml:head/xhtml:link[@rel='first']/@title}"><xsl:value-of select="$utilstrings[@id = 'toc_first']"/></a>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$utilstrings[@id = 'toc_first']"/>
						</xsl:otherwise>
					</xsl:choose>
					</li>
					<li id="{@id}_previous">
						<xsl:choose>
							<xsl:when test="/xhtml:html/xhtml:head/xhtml:link[@rel='last']/@href">
								<a href="{/xhtml:html/xhtml:head/xhtml:link[@rel='last']/@href}" title="{$utilstrings[@id = 'toc_previous']} - {/xhtml:html/xhtml:head/xhtml:link[@rel='previous']/@title}"><xsl:value-of select="$utilstrings[@id = 'toc_previous']"/></a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="$utilstrings[@id = 'toc_previous']"/>
							</xsl:otherwise>
						</xsl:choose>
					</li>
					<li id="{@id}_index">
						<xsl:choose>
							<xsl:when test="/xhtml:html/xhtml:head/xhtml:link[@rel='index']/@href">
								<a href="{/xhtml:html/xhtml:head/xhtml:link[@rel='index']/@href}" title="{$utilstrings[@id = 'toc_index']} - {/xhtml:html/xhtml:head/xhtml:link[@rel='index']/@title}"><xsl:value-of select="$utilstrings[@id = 'toc_index']"/></a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="$utilstrings[@id = 'toc_index']"/>
							</xsl:otherwise>
						</xsl:choose>
					</li>
					<li id="{@id}_next">
						<xsl:choose>
							<xsl:when test="/xhtml:html/xhtml:head/xhtml:link[@rel='next']/@href">
								<a href="{/xhtml:html/xhtml:head/xhtml:link[@rel='next']/@href}" title="{$utilstrings[@id = 'toc_next']} - {/xhtml:html/xhtml:head/xhtml:link[@rel='next']/@title}"><xsl:value-of select="$utilstrings[@id = 'toc_next']"/></a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="$utilstrings[@id = 'toc_next']"/>
							</xsl:otherwise>
						</xsl:choose>
					</li>
					<li id="{@id}_last">
						<xsl:choose>
							<xsl:when test="/xhtml:html/xhtml:head/xhtml:link[@rel='last']/@href">
								<a href="{/xhtml:html/xhtml:head/xhtml:link[@rel='last']/@href}" title="{$utilstrings[@id = 'toc_last']} - {/xhtml:html/xhtml:head/xhtml:link[@rel='last']/@title}"><xsl:value-of select="$utilstrings[@id = 'toc_last']"/></a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="$utilstrings[@id = 'toc_last']"/>
							</xsl:otherwise>
						</xsl:choose>
					</li>
				</ul>
				</nav>
			</div>
		</xsl:if>
	</xsl:template>
	
	<!-- Include the an external document to the current one -->
	<!-- Usage : <ut:include href="http://www.canada.gc.ca" elementid="..." /> -->
	<xsl:template match="ut:include">
		<xsl:if test="boolean(@href)">
			<xsl:choose>
				<xsl:when test="boolean(@elementid)">
					<xsl:copy-of select="document(@href)//*[@id = @elementid]"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:variable name="doc" select="document(@href)/xhtml:html/xhtml:body" />
					<xsl:copy-of select="$doc/* | $doc/comment()"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
