<?php get_header(); ?>
	<!-- Columns begin / Début des colonnes -->
	<div id="cn-cols"><div id="cn-cols-inner" class="equalize">
		<!-- Main content begins / Début du contenu principal --> 
        <div id="cn-centre-col" role="main" itemprop="mainContentOfPage"><div id="cn-centre-col-inner">
			<!-- Content title begins / Début du titre du contenu -->
			<h1 id="cn-cont">Page not found: 404 error</h1>
			<!-- Content Title ends / Fin du titre du contenu -->
			
<!-- clf2-nsi2 theme begins / Début du thème clf2-nsi2 -->
			<p><?php _e("<!--:en-->Unfortunately the content you're looking for isn't here. There may be a misspelling in your web address or you may have clicked a link for content that no longer exists. Perhaps you would be interested in our most recent articles.<!--:--><!--:fr-->Malheureusement, le contenu que vous recherchez n'est pas ici. Il peut y avoir une faute d'orthographe dans votre adresse web ou que vous ayez cliqué sur un lien pour le contenu qui n'existe plus. Peut-être que vous seriez intéressé par nos articles les plus récents.<!--:-->"); ?></p>
			<section>
				<h2><?php _e("<!--:en-->Recent Articles<!--:--><!--:fr-->Articles récents<!--:-->"); ?></h2>
				   <?php query_posts('cat=&showposts=5'); ?>
					<ul id="recentPosts">
				   <?php while (have_posts()) : the_post(); ?>
					<li><a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
					<pre><time datetime="<?php the_date('Y-m-d', '', ''); ?>" pubdate><?php the_time('F j, Y'); ?></time></pre></li>
					<?php endwhile; ?>
					</ul>
			</section>
            <!-- Date Modified begins / Début de la date de modification -->
			<dl id="cn-doc-dates" role="contentinfo">
				<dt><?php _e("<!--:en-->Date modified: <!--:--><!--:fr-->Date de modification&#160;:<!--:-->"); ?></dt>
				<dd><span><time pubdate="pubdate" itemprop="dateModified"><?php echo date('Y-m-d') ?></time></span></dd>
			</dl>
			<div class="clear"></div>
			<!-- Date Modified ends / Fin de la date de modification -->
<!-- clf2-nsi2 theme ends / Fin du thème clf2-nsi2 -->
		</div></div>
		<!-- Main content ends / Fin du contenu principal --> 

<?php get_sidebar(); ?>
<?php get_footer(); ?>