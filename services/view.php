<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header("Cache-Control: post-check=0, pre-check=0", false);
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
header("Pragma: no-cache");

if($_SERVER['REQUEST_METHOD'] == "OPTIONS"){
	echo "{'success':true,'message':'options ok'}";
	exit();
}

session_start();
require_once "includes/dbconnect.php";

$id = intval($_GET['id'].trim());
$key = $_GET['key'].trim();
$idView = intval($_GET['id_view'].trim());

if(!($id && $key && $idView && is_int($id) && is_int($idView) && !preg_match('/[^A-Za-z0-9]/',$key))){
	echo "{'success':false,'message':'1'}";
	exit();
}

$pass = null;
$result = mysql_query("select * from `##gobkipu_gobs` where GuildID = (SELECT GuildID FROM `##gobkipu_gobs` WHERE GobID=".$id." and GuildPass='".$key."') and GobID=".$idView, $link);
while($row=mysql_fetch_array($result)){
	$pass = $row['GuildPass'];
}
if(!$pass){
	echo "{'success':false,'message':'2'}";
	exit;
}

echo file_get_contents("http://ie.gobland.fr/IE_Vue.php?id=" . $idView . "&passwd=" . $pass);
exit();


/*

switch($_GET['id']){
	case 332:
		$passwd="f89e21da535146c0abe79cb9a17690eb";
		break;
	case 333:
		$passwd="8b0b80dfce88bd3a92c279085f1cf5eb";
		break;
	case 334:
		$passwd="d7408cf3e63ba1985ee1bb77452122ee";
		break;
	case  340:
		$passwd="4529f4e32520b4f56eae527a9b8ada1a";
		break;
}

*/