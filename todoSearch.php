<?php

	//directory to search
	$dir = "C:/xampp/htdocs/E-Sird/";

	//initialize the RecursiveIteratorIterator
	$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));

	//loop through all the files in the directory(and subdirectory)
	foreach ($rii as $files) {
		
		//if it is a directory, just continue with the next one
		if ($files->isDir()) {
			continue;
		}
		
		//get the path and filename
		$filePathAndName = $files->getPath()."/".$files->getFileName();
		$file = file_get_contents($filePathAndName);
		
		//search for // TODO or // todo
		$regex = preg_grep('/(\/\/TODO)|(\/\/todo)/', explode("\n", $file));
		
		//if found, tell me which file and what the todo is about
		if($regex != null) {
			echo "File: ";
			echo $filePathAndName;
			
			echo "<pre>";
			print_r($regex);
			echo "</pre>";
			echo "</br>";
		}
	}

?>