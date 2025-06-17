let inorder = [];
let preorder = [];

function addPreorder(){
    const w = document.getElementById('preorder').value.trim();
    if(w){
        let singleNum = Number(w);
        if(w.includes(" ") || !isNaN(singleNum)){
            //split with comma as the separator. 
            let temp = w.split(" ").map(Number);
            for(let i=0 ; i<temp.length ; i++){
                preorder.push(temp[i]);
            }
        }
        else if(w.includes(",") || !isNaN(singleNum)){
            let temp = w.split(",").map(Number);
            for(let i=0 ; i<temp.length ; i++){
                preorder.push(temp[i]);
            }
        }
        else{
            //nonsense input
            alert("Something fishy!");
            console.log("The separator must either be comma or space");
            return;
        }
        console.log("added the array ", preorder);
        document.getElementById('preorder').value='';
        document.getElementById('addButton4').disabled = true;
    }
    else{
        alert("Enter the preorder traversal");
    }
}

function deletePreorder(){
    //search for the entered preorder traversal. 
    //if present delete it else justan error msg
    const w = document.getElementById('preorder').value.trim();
    if(w){
        let singleNum=Number(w);
        if(w.includes(" ") || !isNaN(singleNum)){
            //split with comma as the separator. 
            let temp = w.split(" ").map(Number);
            for(let i=0 ; i<temp.length ; i++){
                if(preorder[i]!==temp[i]){
                    //there is a mismatch. hence abort delete
                    console.log("Cannot find item to delete");
                    alert("Entered item not present. Hence nothing to delete")
                    return;
                }
            }
        }
        else if(w.includes(",") || !isNaN(singleNum)){
            let temp = w.split(",").map(Number);
            for(let i=0 ; i<temp.length ; i++){
                if(preorder[i]!==temp[i]){
                    //there is a misamtch. hence abort delete
                    console.log("Cannot find item to delete");
                    alert("Entered item not present. Hence nothing to delete");
                    return;
                }
            }
        }
        else{
            //nonsense input
            alert("Something fishy!");
            console.log("The separator must either be comma or space");
            return;
        }

        //if the code reaches this point, then it means the value presnet in the preorder can be deleted. 
        preorder = [];
        console.log("deleted the entered preorder traversal", preorder);
        document.getElementById('addButton4').disabled=false;
        document.getElementById('preorder').value='';
    }
    else{
        alert("Enter a preorder traversal to check and delete");
    }
}


// ---

function addInorder(){
    const w = document.getElementById('inorder').value.trim();
    // console.log("w.includes(space)",w.includes(" "));
    // console.log("w.includes(,)",w.includes(","));
    //  return;

    if(w){
        let singleNum = Number(w);
        console.log(singleNum);

        // if(singleNum NaN){
        //     alert("it is nan");
        //     console.log(singleNum, "is singlenum");
        // }
        
        if(w.includes(",") || !isNaN(singleNum)){
            //split with comma as the separator. 
            let temp = w.split(",").map(Number);
            for(let i=0 ; i<temp.length ; i++){
                inorder.push(temp[i]);
            }
            console.log("temp is (,)", temp);
        }
        else if(w.includes(" ") || !isNaN(singleNum)){
            let temp = w.split(" ").map(Number);
            for(let i=0 ; i<temp.length ; i++){
                inorder.push(temp[i]);
            }
            console.log("temp is (space)", temp);
        }
        else{
            //nonsense input
            alert("Something fishy!");
            console.log("The separator must either be comma or space");
            return;
        }
        console.log("added the array ", inorder);
        document.getElementById('inorder').value='';
        document.getElementById('addButton3').disabled = true;
       
    }
    else{
        alert("Enter the inorder traversal");
    }
}

function deleteInorder(){
    //search for the entered inorder traversal. 
    //if present delete it else justan error msg
    const w = document.getElementById('inorder').value.trim();
    if(w){
        let singleNum=Number(w);
        if(w.includes(" ") || !isNaN(singleNum)){
            //split with comma as the separator. 
            let temp = w.split(" ").map(Number);
            for(let i=0 ; i<temp.length ; i++){
                if(inorder[i]!==temp[i]){
                    //there is a mismatch. hence abort delete
                    console.log("Cannot find item to delete");
                    alert("Entered item not present. Hence nothing to delete")
                    return;
                }
            }
        }
        else if(w.includes(",") || !isNaN(singleNum)){
            let temp = w.split(",").map(Number);
            for(let i=0 ; i<temp.length ; i++){
                if(inorder[i]!==temp[i]){
                    //there is a misamtch. hence abort delete
                    console.log("Cannot find item to delete");
                    alert("Entered item not present. Hence nothing to delete");
                    return;
                }
            }
        }
        else{
            //nonsense input
            alert("Something fishy!");
            console.log("The separator must either be comma or space");
            return;
        }

        //if the code reaches this point, then it means the value presnet in the inorder can be deleted. 
        inorder = [];
        console.log("deleted the entered inorder traversal", inorder);
        document.getElementById('addButton3').disabled=false;
        document.getElementById('inorder').value='';
    }
    else{
        alert("Enter an inorder traversal to check and delete");
    }
}

document.getElementById('addButton4').addEventListener('click', addPreorder);
document.getElementById('deleteButton4').addEventListener('click', deletePreorder);
document.getElementById('addButton3').addEventListener('click', addInorder);
document.getElementById('deleteButton3').addEventListener('click', deleteInorder);