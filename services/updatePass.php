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
$team = $_GET['team'].trim();
$guild = $_GET['guild'].trim();

if(!($id && $team && $guild && is_int($id))){
	echo "{'success':false,'message':'1'}";
	exit();
}

$response = preg_replace('/[^A-Za-z0-9\-]/', '', file_get_contents("http://ie.gobland.fr/IE_Profil.php?id=".$id."&passwd=".$guild).trim());
if(strcmp(strval($response), "idoumotdepasseincorrects") == 0){
	echo "{'success':false,'message':'2'}";
	exit();
}

$result = mysql_query("insert into `##gobkipu_gobs` (GobID, TeamPass, GuildPass) values (".$id.", '".$team."', '".$guild."') on duplicate key update TeamPass='".$team."', GuildPass='".$guild."'", $link);
if(!$result == 1){
	echo "{'success':false,'message':'3'}";
	exit();
}

echo "{'success':true,'message':'ok'}";

require_once "includes/dbdisconnect.php";
