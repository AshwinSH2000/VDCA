const arrayList = [];
function addNumber(){
    const w = document.getElementById('firstNum').value.trim();
    const x = document.getElementById('secondNum').value.trim();
    arrayList.push(w);
    arrayList.push(x);
    const y = document.getElementById('thirdNum').value.trim();
    const z = document.getElementById('fourthNum').value.trim();
    arrayList.push(y);
    arrayList.push(z);
    console.log("added the array ", arrayList);
    document.getElementById('firstNum').value='';
    document.getElementById('secondNum').value='';
    document.getElementById('thirdNum').value='';
    document.getElementById('fourthNum').value='';
}

function deleteArray(){
    //not deleting a specific number. 
    //instead spilicing the entire array
    var len=arrayList.length;
    arrayList.splice(0,len);
    console.log("deleted the entire array", arrayList);
}

document.getElementById('addButton2').addEventListener('click', addNumber);
document.getElementById('delete2').addEventListener('click', deleteArray);