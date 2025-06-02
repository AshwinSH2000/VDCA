# Bugs and fixes in this project 

## Good practice to follow in <head> of html

`<head>`<br>
	`<meta charset="UTF-8">`<br>
	`<meta name="viewport" content="width=device-width, initial-scale=1.0">`<br>
	`<title>VDCA</title>`<br>
	`<link rel="stylesheet" href="main.css">`<br>
	`<link rel="icon" href="favicon.ico">`<br>
`</head>`<br>

I had not added the meta lines before and got to know it is a good practice to declare it beforehand.
the second meta line is to make it dynamic (sort of). 
Ok here is the full explanation for the meta second line
- name=viewpoer means... Tells the browser: "I'm giving you instructions about the visible area of the page (the viewport).
- content=width=device-width means... Sets the viewport width to match the device's screen width. If viewed on phone it will be a smaller/narrower, viewed on a larger screen will make it larger etc. 
- initial-scale=1.0 means... Sets the initial zoom level to 100% (i.e., no zoom). It makes it into readable size in all the devices the program loads. 


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
