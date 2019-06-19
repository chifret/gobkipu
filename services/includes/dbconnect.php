<?php
$link=mysql_connect("chifretbva.mysql.db","chifretbva","2pY7RhaYTAuB") or die("Error " . mysql_error($link));
mysql_select_db("chifretbva", $link);
mysql_query("SET names 'utf8'",$link);