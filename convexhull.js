let coordinates = [];
let partitions = [];
let level=0;
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
        alert("Enter both x and y coordinates!");
        document.getElementById('coordinates2').value='';
        return;
    }
    if(coord){ 
        
        console.log("Coord is this inside if case:", coord);
        if(coord[0]<=10 && coord[1]<=10)
        {
            coordinates.push(coord);   
            console.log("The input coord is", coordinates);
        }
        else{
            alert("Enter a number <= 10");
        }
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

function divideCoordinates(){
    
    if(level==0){
        partitions.push(-1);
        partitions.push(11);
        console.log(partitions);
        let CH = checkCollinear(coordinates, 0, coordinates.length-1)
        if(CH){
            console.log("Uhe CH is a line joining", CH);
        }
        else
        {
            console.log("Need to find a CH using algo");
        }
        level++;
    }
}

function checkCollinear(coord, low, high){
    if(coord.length<=1){
        //its just a point. hence trivially collinear
        console.log("Just a point in the set");
        //returning coord because it has just one point and that is the CH
        return coord;
    }
    if(coord.length==2){
        //they are collinear because there are only two points!
        console.log("The two points are collinear");
        //returning the coord because it has two points and that is the CH
        return coord;
    }
    
    let refCoord1 = coord[low];         //x1 and y1
    let refCoord2 = coord[low+1];       //x2 and y2
    let i=low+2;
    let result=-1;
    while(i<=high){
        result = ((refCoord2[0]-refCoord1[0])*(coord[i][1]-refCoord1[1])-
                 (refCoord2[1]-refCoord1[1])*(coord[i][0]-refCoord1[0]));
        console.log("Result is", result);
        if(result!==0)
        {
            console.log("Not collinear");
            return false;
        }
        i++;
    }
    console.log("Loop finished which means the points are collinear");
    coord.sort((a,b) => a[0]-b[0]);
    let collinearCH = []
    collinearCH.push(coord[low]);
    collinearCH.push(coord[high]);
    console.log("Sorted coords are", coord, "and CH is", collinearCH);
    return collinearCH;
    /*
    The slope calculation fails when the denominator is zero
    To avoid that we do cross product calculation. How does it work?
    Take any two distinct points (x1,y1) and (x2,y2), and subs their values in the formula
    (x2-x1)(y3-y1)-(y2-y1)(x3-x1)
    You get a reference formula. Then take all other points in the set and substitute them into this formula. 
    If the result is 0, then the points are collinear. 
    */

}
function findMedianPartition(){

}
document.getElementById('addButton2').addEventListener('click', inputCoordinates);
document.getElementById('deleteButton2').addEventListener('click', deleteCoordinates);
document.getElementById('divideButton2').addEventListener('click', divideCoordinates);