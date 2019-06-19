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

//session_start();
//require_once "includes/dbconnect.php";

$value = file_get_contents("http://ie.gobland.fr/IE_MeuteMembres2.php?id=".$_GET['id']."&passwd=".$_GET['key']);

/*$i=0;
$team=0;
$gobs=Array();
foreach(preg_split("/((\r?\n)|(\r\n?))/", $value) as $line){
	if($line != ""){
		$tmp = explode(";", $line);
		if($i>0){
			$team = preg_replace('/[^A-Za-z0-9\-]/', '', $tmp[0]);
			$gobs[] = preg_replace('/[^A-Za-z0-9\-]/', '', $tmp[2]);
		}
		$i++;
	}
}

foreach($gobs as $gob){
	mysql_query("insert into `##gobkipu_gobs` (GobID, TeamID) values (".$gob.", ".$team.") on duplicate key update TeamID='".$team."'", $link);
}
mysql_query("update `##gobkipu_gobs` set TeamID = null where TeamID=" . $team . " and GobID not in (".implode(",", $gobs).")", $link);*/

echo $value;

//require_once "includes/dbdisconnect.php";
