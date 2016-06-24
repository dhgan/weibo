<?php
$img=$_FILES['img'];
$path=$img['name'];
move_uploaded_file($img["tmp_name"], "./upload/".(iconv("UTF-8","GB2312",$path)).".png");
echo "http://localhost:8090/WebstormProjects/weibo-alpha/upload/".$path.".png";
?>
