let coordinates = []

function inputCoordinates() {
    // @type {HTMLInputElement}
    const inputStr = document.getElementById("coordinates2").value.trim();
    let coord = [];
    if(inputStr.includes(",")){
        coord = inputStr.split(",").map(Number);
    }
    else if(inputStr.includes(" ")){
        coord = inputStr.split(" ").map(Number);
    }
    else{
        console.log("none got exed");
    }
    if(coord){ 
        
        coordinates.push(coord);        
        console.log("The input coord is", coordinates);
    }
    else{
        alert('Enter a number');
    }
    document.getElementById('coordinates2').value='';
}

function deleteCoordinates() {
    const inputStr = document.getElementById("coordinates2").value.trim();
    let coord = [];
    if(inputStr.includes(",")){
        coord = inputStr.split(",").map(Number);
    }
    else if(inputStr.includes(" ")){
        coord = inputStr.split(" ").map(Number);
    }
    else{
        console.log("none got exed");
    }
    if(coord){
        if(coordinates.some(p=>(p[0]==coord[0]&&p[1]==coord[1]))){
            let index=coordinates.findIndex(p=>(p[0]==coord[0]&&p[1]==coord[1]))
            console.log("Found at index", index);
            coordinates.splice(index, 1);
            console.log("This works!", coordinates);
        }
        else{
            console.log("This doesnt work", coordinates);
        }
    }
    document.getElementById("coordinates2").value='';
}
document.getElementById('addButton2').addEventListener('click', inputCoordinates);
document.getElementById('deleteButton2').addEventListener('click', deleteCoordinates);