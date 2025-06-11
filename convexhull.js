let coordinates = [];
let partitions = [];
let convexHulls = [];
let partitionAdded = true;
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
        if(coord[0]<=10 && coord[1]<=10){
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
    
    if(partitionAdded===false){
        console.log("All partitions are now terminal convex hulls. No further division needed. ");
        console.log("The final terminal CHs are", convexHulls);
        return;
    }
    partitionAdded=false;
    if(level==0){
        document.getElementById('addButton2').disabled=true;
        document.getElementById('deleteButton2').disabled=true;
        partitions.push(-1);
        partitions.push(11);
        console.log(partitions);
        coordinates.sort((a,b)=>a[0]-b[0]);
        let CH = checkCollinear(coordinates, 0, coordinates.length-1)
        if(CH==null){
            console.log("Empty coordinates array. Hence no CH");
        }
        else if(CH){
            console.log("The CH is a line joining", CH);
            convexHulls.push(CH);
        }
        else
        {
            console.log("Need to find a CH using algo");
            let median = findMedianPartition(coordinates, 0, coordinates.length-1);
            console.log("The median for division is", median);
            partitions.push(median);
            partitionAdded=true;
            partitions.sort((a,b)=>a-b);
            console.log("New partitions is", partitions);
        }
        level++;
    }
    else{
        //any other level
        /*
        What to do?
        1. check for collinearity of the points in each of the partition. 
        2. Else check for the median and add it to the partition
        */
        
        //sanity check ... are partitions and coordinates in order?
        console.log("Partitions", partitions);
        console.log("Coordinates", coordinates);
        let counter = 0;
        let partitionsLength = partitions.length;
        while(counter < partitionsLength-1){
            //this runs partitions.length-1 times
            //check what are the coordinates between partitions[counter] and partitions[counter+1]
            let i=0;
            let lowerLimit = partitions[counter];
            let upperLimit = partitions[counter+1];
            let low=-1;
            let high=-1;
            while(i<coordinates.length){
                if(coordinates[i][0]>=lowerLimit && coordinates[i][0]<=upperLimit){
                    //this point is in range.
                    if(low===-1){
                        low=high=i;
                    }
                    else{
                        high=i;
                    }
                }
                i++;
            }
            console.log("partition",counter,"is",low,high);

            //checking for collinearity
            let CH = checkCollinear(coordinates, low, high);
            if(CH){
                // do i need to include the entire portion of code as written in level 0?
                if(CH.length===1){
                    console.log("The CH is the point", CH);
                    convexHulls.push(CH);
                }
                else{
                    console.log("The CH is a line joining", CH);
                    convexHulls.push(CH);
                }
            }
            else{
                console.log("Need to find a CH using algo");
                let median = findMedianPartition(coordinates, low, high);
                console.log("The median for division is", median);
                partitions.push(median);
                partitionAdded=true;
                console.log("New partitions is", partitions); 
            }
            counter++
            console.log("----------------End of iteration",counter,"in level",level);
        }
        console.log("----------------End of level",level,"----------------");
        partitions.sort((a,b)=>a-b);
        level++;
    }
}


function checkCollinear(coord, low, high){
    //if(coord.length===0){
    if(low>high){
        //will this ever get executed? check it
        console.log("Empty coordinates array. ");
        return null;
    }
    //if(coord.length===1){
    if(high-low===0){
        //its just a point. hence trivially collinear
        console.log("Just a point in the set");
        //returning coord because it has just one point and that is the CH
        return [coord[high]];
    }
    //if(coord.length===2){
    if(high-low===1){
        //they are collinear because there are only two points!
        console.log("The two points are collinear");
        //returning the coord because it has two points and that is the CH
        return [coord[low],coord[high]] ;
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
    console.log("Sorted coords are", coord, "and CH is", [coord[low],coord[high]] );
    // return collinearCH;
    return [coord[low],coord[high]] ;

    /*
    The slope calculation fails when the denominator is zero
    To avoid that we do cross product calculation. How does it work?
    Take any two distinct points (x1,y1) and (x2,y2), and subs their values in the formula
    (x2-x1)(y3-y1)-(y2-y1)(x3-x1)
    You get a reference formula. Then take all other points in the set and substitute them into this formula. 
    If the result is 0, then the points are collinear. 
    */

}
function findMedianPartition(coord, low, high){
    let setOfXCoord = [];
    let i=low;
    while (i<=high){
        if(!setOfXCoord.includes(coord[i][0]))
            setOfXCoord.push(coord[i][0]);
        i++;
    }
    setOfXCoord.sort((a,b)=> a-b);
    console.log("The sorted non repetitive x coordinates are", setOfXCoord);
    let size = Math.floor(setOfXCoord.length/2);
    let median = (setOfXCoord[size-1]+setOfXCoord[size])/2;
    return median;
}
function conquerCoordinates(){

}
function resetConvexHull(){
    document.getElementById('addButton2').disabled=false;
    document.getElementById('deleteButton2').disabled=false;
    coordinates = [];
    partitions = [];
    partitionAdded = true;
    level=0;
    console.log("reset all things");
    console.clear();
    console.log("Reset the interface. Starting fresh!");
}
document.getElementById('addButton2').addEventListener('click', inputCoordinates);
document.getElementById('deleteButton2').addEventListener('click', deleteCoordinates);
document.getElementById('divideButton2').addEventListener('click', divideCoordinates);
document.getElementById('resetButton2').addEventListener('click', resetConvexHull);