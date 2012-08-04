<div id="cn-body-inner-<% =page_columns %>col">
<div id="cn-skip-head">
  <ul id="cn-tphp">
    <li id="cn-sh-link-1"><a href="#cn-cont">
      <% =cn_sh_link_1 %>
      </a></li>
    <% if page_columns <> 1 then %>
    <li id="cn-sh-link-2"><a href="#cn-nav">
      <% =cn_sh_link_2 %>
      </a></li>
    <% else %>
    <li id="cn-sh-link-2"><a href="#cn-nav">
      <% =cn_sh_link_2_1_col %>
      </a></li>
    <% end if %>
  </ul>
</div>
<div id="cn-head">
  <div id="cn-head-inner">
    <header> 
      <!-- HeaderStart -->
      
      <nav role="navigation">
        <div id="cn-gcnb">
          <h2><%= cn_gcnb %></h2>
          <div id="cn-gcnb-inner">
            <div id="fip-pcim-gcnb">
              <div id="cn-sig">
                <div id="cn-sig-inner">
                  <div id="fip-pcim-sig-eng" title="<% =cn_sig %>"><img src="fip-pcim/images/sig-<% =language %>.gif" width="214" height="20" alt="<% =cn_sig %>" /></div>
                </div>
              </div>
              <ul>
                <li id="cn-gcnb1"><a rel="external" href="<% =cn_cmb1_href %>">
                  <% =cn_cmb1_text %>
                  </a></li>
                <li id="cn-gcnb2"><a rel="external" href="<% =cn_cmb2_href %>">
                  <% =cn_cmb2_text %>
                  </a></li>
                <li id="cn-gcnb3"><a rel="external" href="<% =cn_cmb3_href %>">
                  <% =cn_cmb3_text %>
                  </a></li>
                <li id="cn-gcnb-lang"><a href="/theme-gcwu-fegc/inc/lang.asp" lang="<% =cn_cmblang %>">
                  <% =cn_cmblang_text %>
                  </a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div id="cn-banner" role="banner">
        <div id="cn-banner-inner">
          <div id="cn-wmms">
            <div id="cn-wmms-inner">
              <div id="fip-pcim-wmms" title="<% =cn_wwms %>"><img src="fip-pcim/images/wmms.gif" width="126" height="30"  alt="<% =cn_wwms %>" /></div>
            </div>
          </div>
          <div id="cn-site-title">
            <p id="cn-site-title-inner"><a href="home-accueil-megamenu-theme-gcwu-fegc-eng.asp">
              <% =cn_banner_text %>
              </a></p>
          </div>
          <section role="search">
            <div id="cn-search-box">
              <h2><%= cn_search %></h2>
              <form action="<%= cn_search_action %>" method="post">
                <div id="cn-search-box-inner">
                  <label for="cn-search"><%= cn_search_lable %></label>
                  <input id="cn-search" name="cn-search" type="text" value="" size="27" maxlength="150" />
                  <input id="cn-search-submit" name="cn-search-submit" type="submit" value="<%= cn_search_value %>" />
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
      <nav role="navigation">
        <div id="cn-psnb">
          <h2><%= prim_nav_text %></h2>
          <div id="cn-psnb-inner">
            <% If language = "fra" Then %>
            <!--#include virtual="/theme-gcwu-fegc/nav/site-nav-fra.asp"-->
            <% Else %>
            <!--#include virtual="/theme-gcwu-fegc/nav/site-nav-eng.asp"-->
            <% End If %>
          </div>
        </div>
        <div id="cn-bc">
          <h2>
            <% =cn_bcrumb %>
          </h2>
          <div id="cn-bc-inner">
            <ol>
              <!-- #include virtual="/theme-gcwu-fegc/inc/trail-arr.asp" -->
            </ol>
          </div>
        </div>
      </nav>
      <!-- HeaderEnd --> 
    </header>
  </div>
</div>
<div id="cn-cols">
<div id="cn-cols-inner" class="equalize">
<div id="cn-centre-col" role="main">
<div id="cn-centre-col-inner">
<!-- MainContentStart --> 
