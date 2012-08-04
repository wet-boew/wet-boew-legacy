<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
	CodeIgniter variant  v1.0 / Variante pour CodeIgniter   v1.0
	Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
*/

class WETRendering {
	function __construct()
	{
		$this->CI =& get_instance();
		$this->CI->config->load('wetrendering');
	}
	
	function Render($params){
		$this->CI =& get_instance();
		
		$content = utf8_encode($this->CI->output->get_output());
		
		if(!in_array($this->CI->router->class, $this->CI->config->item('render_exclusions'))){
		
			try{
				$objXml = new DOMDocument();
				$objXml->loadXML($content);
				
				$xslt = new XSLTProcessor();
				
				$XSL = new DOMDocument();
				if ($XSL->load(site_url($this->CI->config->item('xsl_stylesheet')), LIBXML_NOCDATA)){
					$xslt->importStylesheet( $XSL );
					$Xml = $xslt->transformToXml( $objXml );
					
					if (!empty($Xml)){
						$this->CI->output->set_output($Xml);
						echo($Xml);
						
						return;
					}
				}
			}catch(Exception $err){
				
			}
		}
		
		echo($content);
	}
}
?>