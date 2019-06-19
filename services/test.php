<?php

for($i=1; $i<=117; $i++){
	echo minerai_size(1,$i)."</br>";
}

function minerai_size($deg,$roll){
  $mod = array(0, 1, 2, 3, 4);
  $retour=26;
  $dec=1;
  $i=1;
  $k=1;
  $de=$roll+$mod[$deg];
  //$de=dice(1,117)+$mod[$deg];
  while($i < $de){
    $i += $dec;
    if($k%3==0)
      $dec++;
    $k++;
    $retour--;
  }
  return min(25,max(1,$retour));
}