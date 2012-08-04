/*!
 * Geomap v1.3 / Géocarte v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
 YUI.add("lang/queryresults_fr", function(Y) {

    Y.Intl.add(

        "queryresults",     // Associated Module 
        "fr",             // BCP 47 Language Tag

        {                 // Translated String Key/Value Pairs 
            show_button_label:      "Voir plus",
            show_button_header:     "Voir plus",
            
            pagination_text:        "Paginationion",
            
            word_display_record:    "Affichage des dossiers",
            prep_to:        "à",
            prep_of:        "sur",
            word_records:   "",
            
            first_page_text:        "<<",
            first_page_alt:         "Première Page",
            previous_page_text:     "<",
            previous_page_alt:      "Page précédente",
            last_page_text:         ">>",
            last_page_alt:          "Dernière page",
            next_page_text:         ">",
            next_page_alt:          "Page suivante",
            page_button_alt:        "Page ",
            current_page_button_alt:"Actuellement vous lisez la page ",
            goto_page_label:        "Page:",
            items_per_page_label:   "Articles par page:",
            show_button_title:      "Voir plus",
            show_button_title_about:" sur {cellText}",
            show_button_title_information:      " d'informations sur le numéro {number} rangs"
        }

    );

}, "3.1.0");