<?php
// https://www.chifret.be/gobkipu/services/view.php?key=e618f823c1948db83494380d35dee07d04dabfbc&id=334

if (strcmp($_GET['key'], "e618f823c1948db83494380d35dee07d04dabfbc") !== 0) {
    echo "key invalid";
	exit();
}

$id=$_GET['id'];
$passwd=null;

switch($id){
	case 332:
		$passwd="f89e21da535146c0abe79cb9a17690eb";
		break;
	case 333:
		$passwd="8b0b80dfce88bd3a92c279085f1cf5eb";
		break;
	case 334:
		$passwd="d7408cf3e63ba1985ee1bb77452122ee";
		break;
}


if($passwd === null){
	echo "id invalid";
	exit();
}
$response = file_get_contents("http://ie.gobland.fr/IE_Equipement.php?id=".$id."&passwd=".$passwd);
echo $response;
exit();
