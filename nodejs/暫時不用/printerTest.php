<?php
$printer = "您的打印机名称";
$text = "这是一个打印测试。";
shell_exec("echo $text > LPT1");
?>
