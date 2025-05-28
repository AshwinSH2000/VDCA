# Bugs and fixes in this project 

## Good practice to follow in <head> of html

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>VDCA</title>
	<link rel="stylesheet" href="main.css">
	<link rel="icon" href="favicon.ico">
</head>

## Unexpected Token "{"
When binarytree file was loaded, the console was priting Unexpected token "{" and was pointing to binarytree.css. 
This was confusing because binarytree.css had only 3 lines:
body{
	background-color: darkkhaki;
}

The syntax was correct. Upon finding further I got to know that if CSS file is included in the <script> tag, then it gives the same error
I checked and found that I had mistypes "binarytree.css" instead of "binarytree.js" inside <script> and </script> tag! Thats it!
If it is an external css file, then the above applies. Instead you are adding normal styling attribute, then it needs to be properly
inserted in between <style> tag which needs to be placed inside <head> tag. 
