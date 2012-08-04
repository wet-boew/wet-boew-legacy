<?php 
	/*
	CodeIgniter variant  v1.0 / Variante pour CodeIgniter   v1.0
	Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
*/

class Home_Accueil extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->lang->load('home_accueil');
		$this->lang->load('pages');
	}
	
	function index()
	{
		$this->load->view('home_accueil', array());
	}
	
}
?>