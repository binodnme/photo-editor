<?php
$url = $_GET['url'];
header('Content-type: image/png;');
$a = file_get_contents($url);
echo $a;
?>
