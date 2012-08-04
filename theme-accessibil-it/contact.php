
<?
$subject="from ".$_GET['name'];
$headers= "From: webform@accessibilit.com ";
 $headers.='Content-type: text/html; charset=iso-8859-1';
mail("info@accessibilit.com", $subject,  "
<html>
<head>
 <title>Website Inquiry</title>
</head>
<body>

<br>
  ". "Email: " .$_GET['email']. "<br>" ."Phone: " .$_GET['phone']. "<br>" $_GET['message']."
</body>
</html>" , $headers);
echo ("Your message was successfully sent!");
?>
<script>
	resizeTo(300, 300)
	//window.close()
</script>