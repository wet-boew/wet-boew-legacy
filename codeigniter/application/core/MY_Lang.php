<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

// CodeIgniter i18n library by Jérôme Jaglale
// http://maestric.com/en/doc/php/codeigniter_i18n
// version 6 - April 20, 2009
define("ISO_639_1", 1);
define("ISO_639_2", 2);
	
class MY_Lang extends CI_Lang {

    /**************************************************
     configuration
    ***************************************************/

    // languages
    var $languages = array(
        'eng' => 'english',
        'fra' => 'french'
    );

    // special URIs (not localized)
    var $special = array (
        ""
    );
    
    // where to redirect if no language in URI
    var $default_uri = '/'; 

    /**************************************************/
    
    
   function __construct()
    {
        parent::__construct();    
        
        global $CFG;
        global $URI;
        global $RTR;
        
        $segment = $URI->segment(1);
        
        if (isset($this->languages[$segment]))    // URI with language -> ok
        {
            $language = $this->languages[$segment];
            $CFG->set_item('language', $language);

        }
        else if($this->is_special($segment)) // special URI -> no redirect
        {
            return;
        }
        else    // URI without language -> redirect to default_uri
        {
            // set default language
            $CFG->set_item('language', $this->languages[$this->default_lang()]);

            // redirect
            header("Location: " . $CFG->site_url($this->localized($this->default_uri)), TRUE, 302);
            exit;
        }
    }
    
    
    // get current language
    // ex: return 'en' if language in CI config is 'english' 
    function lang($format = ISO_639_2)
    {
        global $CFG;        
        $language = $CFG->item('language');
        
        $lang = array_search($language, $this->languages);
        if ($lang)
        {
		return $this->format_lang($lang, $format);
        }
        
        return NULL;    // this should not happen
    }
    
    function alternate_lang ($format = ISO_639_2){
	if ($this->lang() == 'eng'){
		$lang = 'fra';
	}elseif ($this->lang() == 'fra'){
		$lang = 'eng';
	}
	
	return $this->format_lang($lang, $format);
    }
    
    function format_lang ($lang, $format){
	if ($format == ISO_639_2){
		return $lang;
	}else if ($format == ISO_639_1){
		return substr($lang,0,2);
	}
    }
    
    
    function is_special($uri)
    {
        $exploded = explode('/', trim($uri, '/'));
        if (in_array($exploded[0], $this->special))
        {
            return TRUE;
        }
        if(isset($this->languages[$uri]))
        {
            return TRUE;
        }
        return FALSE;
    }
    
    /*
    function switch_uri($lang)
    {
        $CI =& get_instance();

        $uri = $CI->uri->uri_string();
        if ($uri != "")
        {
            $exploded = explode('/', $uri);
            if($exploded[1] == $this->lang())
            {
                $exploded[1] = $lang;
            }
            $uri = implode('/',$exploded);
        }
        return $uri;
    }
    */
    function switch_uri($lang)
    {
        $CI =& get_instance();
        $uri = $CI->uri->uri_string();

        if ($uri != "")
        {
            $exploded = explode('/', $uri);

            // If we have an URI with a lang --> es/controller/method
            if($exploded[0] == $this->lang())
            $exploded[0] = $lang;

            // If we have an URI without lang --> /controller/method
            // "Default language"
            else if (strlen($exploded[0]) != 2)
            $exploded[0] = $lang . "/" . $exploded[0];

            $uri = implode('/',$exploded);
        }

        return $uri;
    }
    // is there a language segment in this $uri?
    function has_language($uri)
    {
        $first_segment = NULL;
        
        $exploded = explode('/', $uri);
        if(isset($exploded[0]))
        {
            if($exploded[0] != '')
            {
                $first_segment = $exploded[0];
            }
            else if(isset($exploded[1]) && $exploded[1] != '')
            {
                $first_segment = $exploded[1];
            }
        }
        
        if($first_segment != NULL)
        {
            return isset($this->languages[$first_segment]);
        }
        
        return FALSE;
    }
    
    
    // default language: first element of $this->languages
    function default_lang()
    {
        foreach ($this->languages as $lang => $language)
        {
            return $lang;
        }
    }
    
    // add language segment to $uri (if appropriate)
    function localized($uri)
    {
        if($this->has_language($uri)
                || $this->is_special($uri)
                || preg_match('/(.+)\.[a-zA-Z0-9]{2,4}$/', $uri))
        {
            // we don't need a language segment because:
            // - there's already one
            // - or it's a special uri (set in $special)
            // - or that's a link to a file
        }
        else
        {
            $uri = $this->lang() . (substr($uri,0,1) == '/' ? '' : '/') . $uri;
        }
        
        return $uri;
    }
    
}  