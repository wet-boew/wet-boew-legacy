<?php
$guid = $_POST['id'];
$guid_txt = $guid . '.txt';
$handle = fopen($guid_txt, "a");

$pos = $_POST['position'] .';'. microtime() . "\n";
fwrite($handle, $pos);
fclose($handle);
?>
