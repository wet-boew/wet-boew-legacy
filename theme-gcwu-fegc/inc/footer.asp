			<dl id="cn-doc-dates" role="contentinfo">
            <dt><% =date_modified_text %></dt>
            <dd><span>
              <time pubdate="pubdate"><%= GetFileDate("Modified") %></time>
              </span></dd>
          </dl>
          <div class="clear"></div>
          <!-- MainContentEnd --> 
        </div>
      </div>
      
      <!-- #include virtual="/theme-gcwu-fegc/inc/navigations.asp" -->
      
    </div>
  </div>

<div id="cn-foot">
    <div id="cn-foot-inner">
      <footer>
        <h2 id="cn-nav"><%= cn_foot %></h2>
        <!-- FooterStart -->
        <nav role="navigation">
          <div id="cn-sft">
            <h3><%= cn_foot_site %></h3>
            <div id="cn-sft-inner">
              <div id="cn-ft-tctr">
                <ul>
                  <li class="terms"><a href="<%= terms_href %>" rel="license"><%= terms_text %></a></li>
                  <li class="trans"><a href="<%= trans_href %>"><%= trans_text %></a></li>
                </ul>
              </div>
              <div class="clear"></div>
              <% If language = "fra" Then %>
              	<!--#include virtual="/theme-gcwu-fegc/nav/footer-nav-fra.asp"-->
              <% Else %>
              	<!--#include virtual="/theme-gcwu-fegc/nav/footer-nav-eng.asp"-->
              <% End If %>

            </div>
          </div>
        </nav>
        <nav role="navigation">
          <div id="cn-gcft">
            <h3><%= cn_gc_foot %></h3>
            <div id="cn-gcft-inner">
              <div id="fip-pcim-gcft">
                <ul>
                  <li><a rel="external" href="<%= cn_gc_foot1_href %>"><span><%= cn_gc_foot1_text %></span><br />
                    <%= cn_gc_foot1_url %></a></li>
                  <li><a rel="external" href="<%= cn_gc_foot2_href %>"><span><%= cn_gc_foot2_text %></span><br />
                    <%= cn_gc_foot2_url %></a></li>
                  <li><a rel="external" href="<%= cn_gc_foot3_href %>"><span><%= cn_gc_foot3_text %></span><br />
                    <%= cn_gc_foot3_url %></a></li>
                  <li><a rel="external" href="<%= cn_gc_foot4_href %>"><span><%= cn_gc_foot4_text %></span><br />
                    <%= cn_gc_foot4_url %></a></li>
                  <li><a rel="external" href="<%= cn_gc_foot5_href %>"><span><%= cn_gc_foot5_text %></span><br />
                    <%= cn_gc_foot5_url %></a></li>
                  <li id="cn-ft-ca">
                    <div><a rel="external" href="<%= cn_cmb1_href %>"><%= cn_cmb1_text %></a></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <!-- FooterEnd --> 
      </footer>
    </div>
  </div>
</div>