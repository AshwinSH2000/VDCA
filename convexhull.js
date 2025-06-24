let coordinates = [];
let partitions = [];
let convexHulls = [];
let partitionAdded = true;
let level=0;
let hulls = [];
let currentIndex=0;
let string_ans = []
function inputCoordinates(inputStr) {
    // @type {HTMLInputElement}
    // const inputStr = document.getElementById("coordinates2").value.trim(); //disabled this to have points by clickong on the graph

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
            if(!coordinates.some( a=> a[0]===coord[0] && a[1]===coord[1]))
            {
                coordinates.push(coord);   
                console.log("The input coord is", coordinates);
            }   
            else{
                console.log("Duplicate entry");
                alert("Duplicate entry. Discarding it.");
            }
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

function deleteCoordinates(inputStr) {
    // const inputStr = document.getElementById("coordinates2").value.trim();   //disabling this to enable deleting points from the graph
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
            let index=0;
            index=coordinates.findIndex(p=>(p[0]==coord[0]&&p[1]==coord[1]))
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
        //convexHulls.sort( (a,b)  =>  a[0][0]-b[0][0] );
        console.log("The final terminal CHs are", convexHulls);
        document.getElementById("divideButton2").disabled=true;
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
        let CH = [];
        CH = checkCollinear(coordinates, 0, coordinates.length-1)
        if(CH==null){
            console.log("Empty coordinates array. Hence no CH");
        }
        else if(CH){
            console.log("The CH is a line joining", CH);

            //this push likely wont cause trouble as its the first push into convexHulls. 
            convexHulls.push(CH);   
            hulls.push({
                points: CH,
                level: level,
                index: currentIndex++
            });
        }
        else
        {
            console.log("Need to find a CH using algo");
            let median = 0;
            median = findMedianPartition(coordinates, 0, coordinates.length-1);
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
            let CH = [];
            CH = checkCollinear(coordinates, low, high);
            if(CH){
                if(CH.length===1){
                    console.log("The CH is the point", CH);
                }
                else{
                    console.log("The CH is a line joining", CH);
                }
                //this if case is common to both the cases. hence added at the bottom
                if(!convexHulls.some(p=>(p[0][0]===CH[0][0]&&p[0][1]===CH[0][1]))){
                    convexHulls.push(CH);
                    hulls.push({
                        points: CH,
                        level: level,
                        index: currentIndex++
                    });
                }
            }
            else{
                console.log("Need to find a CH using algo");
                let median = 0;
                median = findMedianPartition(coordinates, low, high);
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
        result = cross(refCoord1, refCoord2, coord[i]);
        //((refCoord2[0]-refCoord1[0])*(coord[i][1]-refCoord1[1])-
                //  (refCoord2[1]-refCoord1[1])*(coord[i][0]-refCoord1[0]));
        console.log("Result is", result);
        console.log("coord is", coord[i]);
        if(result!==0)
        {
            console.log("Not collinear");
            return false;
        }
        i++;
    }
    console.log("Loop finished which means the points are collinear");
    coord.sort((a,b) => a[0]-b[0] || a[1] - b[1]);
    let returnCH=[];
    i=low;
    while(i<=high){
        returnCH.push(coord[i]);
        i++;
    } 
    console.log("Sorted coords are", coord, "and CH is", returnCH);
    // return collinearCH;
    return returnCH ;

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
    //access convexHulls array and partitions array
    console.log("The CHs are:",convexHulls);
    console.log("The partitions are:",partitions);
    console.log("The hulls array is", hulls);

    // test code...can be removed
    // // let left = [[0,1],[1,0],[1,6],[2,1]];
    // // let right = [[5,3], [6,10], [6,2], [7,1]];
    // let left=[];
    // let right = [];
    // left.push({
    //     points: [[0,1],[1,0],[1,2],[2,1]],
    //     level: 0,
    //     index: 1
    // });
    // right.push({
    //     points: [[5,1], [6,0], [6,2], [7,1]],
    //     level: 0,
    //     index: 1
    // })
    // console.log("KHLKEHLSERH GALHAILUERFH",left[0].points);
    // console.log("RIGHT GALHAILUERFH",right[0].points);
    // mergeConvexHulls(left[0].points, right[0].points);
    // return;

    //begin actual conquer phase

    //first get the max level in the hulls array
    let maxLevel = Math.max(...hulls.map(h=>h.level));

    if(maxLevel===0){
        console.log("The convex hull is already found...dinkachika!");
        
        for(let i=0 ; i<hulls[0].points.length ; i++)
        {
            string_ans.push("["+hulls[0].points[i]+"]");
        }
        console.log("String ans is...",string_ans);
        // document.getElementById('finalans').value=Array(hulls[0].points);
        document.getElementById('finalans2').textContent=string_ans;
        document.getElementById("conquerButton2").disabled=true;
        return;
    }

    //get all the hulls from the max lvel because thats what we will be merging first
    let levelHulls = hulls.filter(h=>h.level===maxLevel);
    levelHulls.sort((a, b) => {
        const minA = Math.min(...a.points.map(p => p[0]));
        const minB = Math.min(...b.points.map(p => p[0]));
        return minA - minB;
      });

    //then sorting it based on the index so that we can merge the ones cliser together
    //levelHulls.sort((a,b)=>a.index-b.index);

    let merged = [];    //this is an array to store merged hulls (so that we do not increase the length of levelHulls during its traversal)
    let i=0;
    while(i<levelHulls.length){
        if (i + 1 < levelHulls.length) {
            let left = levelHulls[i];
            let right = levelHulls[i + 1];

            // Merge them using your mergeConvexHulls() function
            let mergedHull = [];
            mergedHull = mergeConvexHulls(left.points, right.points);

            merged.push({
                points: mergedHull,
                level: maxLevel - 1,
                index: left.index / 2  // reduce index for next level
            });

            i += 2; // Move to next pair
        }
        else{
            // If odd number of hulls, carry forward the last one
            let leftover = levelHulls[i];
            merged.push({
                ...leftover,
                level: maxLevel - 1,
                index: leftover.index / 2
            });
            i++;
        }
    }//end of while
    // Remove old level hulls and add merged ones
    hulls = hulls.filter(h => h.level !== maxLevel).concat(merged);
    hulls.sort((a, b) => {
        const minA = Math.min(...a.points.map(p => p[0]));
        const minB = Math.min(...b.points.map(p => p[0]));
        return minA - minB;
      });

    console.log("After merging level", maxLevel, "->", maxLevel - 1);
    console.log("New hulls array:", hulls);
 
    // If only one hull left at level 0, done!
    if (hulls.length === 1 && hulls[0].level === 0) {
        //alert("✅ Final convex hull computed!");
        console.log("The merging is complete...FINAL CH:", hulls[0].points);
        document.getElementById('finalans').textContent='The final convex hull is:';
        //need to fix this one
        let string_ans = []
        for(let i=0 ; i<hulls[0].points.length ; i++)
        {
            string_ans.push("["+hulls[0].points[i]+"]");
        }
        console.log("String ans is...",string_ans);
        // document.getElementById('finalans').value=Array(hulls[0].points);
        document.getElementById('finalans2').textContent=string_ans;
        document.getElementById("conquerButton2").disabled=true;

    }
    
}

function mergeConvexHulls(leftHulls, rightHulls){

    console.log("Reached here");
    console.log("LeftHulls is", leftHulls);
    console.log("Riht hulls is", rightHulls);


    //find the right most point from lefthull and left most from right hull
    let rightHullPointUpper = leftHulls[leftHulls.length-1]; //(x2, y2)
    let leftHullPointUpper = rightHulls[0]; //(x1, y1)

    console.log("LeftHullspoint is", leftHullPointUpper);
    console.log("Riht hulls is point", rightHullPointUpper);

    
    // only for testing
    // console.log("left most is",leftMost);
    // console.log("right most is",rightMost);

    //fixed the rightmost... now iterating through the righthull
    let i=0;
    let crossProd=0;
    let changed=true;

    let counterrrr=0;
    while(changed){
        if(counterrrr===100){
            break;
        }
        changed=false;

        for(i=0;i<rightHulls.length;i++){
            //cross(A,B,C)=(x2−x1)(y3−y1)−(y2−y1)(x3−x1)
            crossProd = (rightHullPointUpper[0]-leftHullPointUpper[0])*(rightHulls[i][1]-leftHullPointUpper[1]) - 
                        (rightHullPointUpper[1]-leftHullPointUpper[1])*(rightHulls[i][0]-leftHullPointUpper[0]);
            if(crossProd<0){
                //it means point rightHulls[i] is the point where we anchor our tangent end point in righthull
                leftHullPointUpper = rightHulls[i];
                console.log("Updating leftmost (in rightHulls)...1");
                console.log("new point selected is...(1)",rightHulls[i] )

                changed=true;
            }
            else if(crossProd===0){
                //select the point that is farthest from the two
                if(leftHullPointUpper[0]===rightHulls[i][0] && leftHullPointUpper[1]===rightHulls[i][1]){
                    console.log("since its the same point, doing nothing :)");
                }
                else if(   Math.abs(rightHullPointUpper[0]-rightHulls[i][0])>
                      Math.abs(rightHullPointUpper[0]-leftHullPointUpper[0])){
                        leftHullPointUpper = rightHulls[i];
                        console.log("Updating leftmost (in rightHulls)...2");
                        console.log("new point selected is...(2)",rightHulls[i] )

                        changed=true;
                }

            }
        }

        //after coming out of loop, leftmost will be anchored
        for(i=0;i<leftHulls.length;i++){
            crossProd = (rightHullPointUpper[0]-leftHullPointUpper[0])*(leftHulls[i][1]-leftHullPointUpper[1]) - 
                        (rightHullPointUpper[1]-leftHullPointUpper[1])*(leftHulls[i][0]-leftHullPointUpper[0]);
            if(crossProd<0){
                //it means point leftHulls[i] is the point where we anchor out tangent end point in lefthull
                rightHullPointUpper = leftHulls[i];
                console.log("Updating rightmost (in leftHulls)...1");
                console.log("new point selected is (1)...",leftHulls[i] )
                changed=true;
            }
            else if(crossProd===0){

                if(rightHullPointUpper[0]===leftHulls[i][0] && rightHullPointUpper[1]===leftHulls[i][1]){
                    console.log("its the same point. hence doing nothing ::)");
                }
                else if(Math.abs(leftHullPointUpper[0]-leftHulls[i][0])>
                   Math.abs(leftHullPointUpper[0]-rightHullPointUpper[0])){
                    rightHullPointUpper = leftHulls[i];
                    console.log("Updating rightmost (in leftHulls)...2");
                    console.log("new point selected is...(2)",leftHulls[i] );
                    changed=true;
                }
            }
        }
        console.log("Finishing the while loop...counter is", counterrrr);
        counterrrr++;
    }
    console.log("The top tangent is a line passing through ", leftHullPointUpper, "and", rightHullPointUpper);



    //now finding the lower tangenst
    let rightHullPointLower = leftHulls[leftHulls.length-1]; //(x2, y2)
    let leftHullPointLower = rightHulls[0]; //(x1, y1)

    //fixed the rightmost... now iterating through the righthull
    changed=true;
    while(changed){

        if(counterrrr===100){
            break;
        }
        changed=false;
    
        for(i=0;i<rightHulls.length;i++){
            //cross(A,B,C)=(x2−x1)(y3−y1)−(y2−y1)(x3−x1)
            console.log("Looking at point", rightHulls[i]);
            crossProd = (rightHullPointLower[0]-leftHullPointLower[0])*(rightHulls[i][1]-leftHullPointLower[1]) - 
                        (rightHullPointLower[1]-leftHullPointLower[1])*(rightHulls[i][0]-leftHullPointLower[0]);
            if(crossProd>0){
                //it means point rightHulls[i] is the point where we anchor our tangent end point in righthull
                leftHullPointLower = rightHulls[i];
                console.log("Updating leftmost (in rightHulls)...1");
                changed=true;
            }
            else if(crossProd===0){
                if(leftHullPointLower[0]===rightHulls[i][0] && leftHullPointLower[1]===rightHulls[i][1]){
                    console.log("doing nothing because its a repeated point :::)");
                }
                else if(Math.abs(rightHullPointLower[0]-rightHulls[i][0])>
                   Math.abs(rightHullPointLower[0]-leftHullPointLower[0])){
                    leftHullPointLower = rightHulls[i];
                    console.log("Updating leftmost (in rightHulls)...2");
                    console.log("new point selected is",rightHulls[i] )

                    changed=true;
                }
            }
        }
        //after coming out of loop, leftmost will be anchored


        for(i=0;i<leftHulls.length;i++){
            console.log("Looking at point", leftHulls[i]);
            crossProd = (rightHullPointLower[0]-leftHullPointLower[0])*(leftHulls[i][1]-leftHullPointLower[1]) - 
                        (rightHullPointLower[1]-leftHullPointLower[1])*(leftHulls[i][0]-leftHullPointLower[0]);
            if(crossProd>0){
                //it means point leftHulls[i] is the point where we anchor out tangent end point in lefthull
                rightHullPointLower = leftHulls[i];
                console.log("Updating rightmost (in leftHulls)...1");
                changed=true;
            }
            else if(crossProd===0){
                if(rightHullPointLower[0]===leftHulls[i][0] && rightHullPointLower[1]===leftHulls[i][1]){
                    console.log("enchina illa marre..becoz its same ::::)");
                }
                else if(Math.abs(leftHullPointLower[0]-leftHulls[i][0])>
                   Math.abs(leftHullPointLower[0]-rightHullPointLower[0])){
                    rightHullPointLower = leftHulls[i];
                    console.log("Updating rightmost (in leftHulls)...2");
                    console.log("new point selected is",leftHulls[i] )

                    changed=true;
                }
            }
        }
        console.log("Finishing the while loop...counter is", counterrrr);
        counterrrr++;
    }
    console.log("The bottom tangent is a line passing through ", leftHullPointLower, "and", rightHullPointLower);

    //check which points actually form the merged hull
    i=0;
    let crossUpper=0;
    let crossLower=0;
    let crossLeft=0;
    let crossRight=0;
    let inRangeUpper=0;
    let inRangeLower=0;
    let mergedHull = [];

    console.log("Now entering the checking polygon phase:");
    // let leftMostPointArray = [];
    // let rightMostPointArray = [];
    // while(i<leftHulls.length){
    //     leftMostPointArray.push(leftHulls[i][0]);
    // }
    // while(i<rightHulls.length){
    //     rightMostPointArray.push(rightHulls[i][0]);
    // }
    // let leftMostPoint = Math.min(...leftMostPointArray);
    // let rightMostPoint = Math.max(...rightMostPointArray);
    let leftMostPoint = Math.min(...leftHulls.map(p => p[0]));
    let rightMostPoint = Math.max(...rightHulls.map(p => p[0]));

    console.log("The leftmost point of the left hull is", leftMostPoint);
    console.log("the rightmost point of the right hull is",rightMostPoint);

    while(i<leftHulls.length){
        console.log("left hull is:",leftHulls[i]);
        crossUpper=cross(leftHullPointUpper, rightHullPointUpper, leftHulls[i]);
        crossLower=cross(leftHullPointLower, rightHullPointLower, leftHulls[i]);

        if(leftHullPointUpper!==leftHullPointLower)
            crossLeft=cross(leftHullPointUpper, leftHullPointLower, leftHulls[i]);
        else
            crossLeft=1;

        if(rightHullPointUpper!==rightHullPointLower)
            crossRight=cross(rightHullPointUpper, rightHullPointLower, leftHulls[i]);
        else
            crossRight=1;
        
        // inRangeLower = checkInRange(leftMostPoint,rightMostPoint,leftHulls[i]);
        // inRangeUpper = checkInRange(leftMostPoint,rightMostPoint,leftHulls[i]);
        inRangeLower = checkInPolygon(leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper, leftHulls[i]);
        inRangeUpper = checkInPolygon(leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper, leftHulls[i]);
        if(crossUpper*crossLower===0){

            //include the point if it is the tangent end point
            //else it means it is a point on the tangent hence do not include

            if(compareEndPoints([leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper], leftHulls[i])){
                //it is a tangent end point
                console.log("It is a tangent endpoint\nPushing it");
                mergedHull.push(leftHulls[i]);
            }
            else{
                console.log("Product is zero for point\nIt means it is on the top or bottom tangents. \n Hence not including it. ", leftHulls[i]);
            }
            

            //old code
            //it means one of the two is zero.
            //mathematically it can also mean both are zero but thats not possible in this case
            // if(inRangeUpper||inRangeLower)

                //commenting the below line
                // mergedHull.push(leftHulls[i]);

            // else
                // console.log("THIS WILL PROBABLY NEVER GET EXECUTED...1");
        }
        else if(crossLeft * crossRight === 0){
            console.log("It is present in one of the sides\nHence not including it");
        }
        else if(inRangeUpper && inRangeLower){
            
                //this means the point is not on the tangent but not inside the polygon too
                //it means it is a part of the merged hull.
                console.log("Strictly inside the polygon..\nHence not including it", leftHulls[i]);
                // mergedHull.push(leftHulls[i]);
            
        }
        else{
            console.log("Finally a point between tangents but outside the polygon.\nPushing it in", leftHulls[i]);
            mergedHull.push(leftHulls[i]);
        }
        i++;
    }
    i=0;
 
    
    while(i<rightHulls.length){
        console.log("right hull is:",rightHulls[i]);

        crossUpper=cross(leftHullPointUpper, rightHullPointUpper, rightHulls[i]);
        crossLower=cross(leftHullPointLower, rightHullPointLower, rightHulls[i]);

        //do the below only if there are distinct values for LU&LL or RU&RL
        if(leftHullPointUpper!==leftHullPointLower)
            crossLeft=cross(leftHullPointUpper, leftHullPointLower, rightHulls[i]);
        else
            crossLeft=1;

        if(rightHullPointUpper!==rightHullPointLower)
            crossRight=cross(rightHullPointUpper, rightHullPointLower, rightHulls[i]);
        else
            crossRight=1;

        // inRangeLower = checkInRange(leftMostPoint,rightMostPoint,rightHulls[i]);
        // inRangeUpper = checkInRange(leftMostPoint,rightMostPoint,rightHulls[i]);
        inRangeLower = checkInPolygon(leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper, rightHulls[i]);
        inRangeUpper = checkInPolygon(leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper, rightHulls[i]);

        if(crossUpper*crossLower===0){

            if(compareEndPoints([leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper], rightHulls[i])){
                console.log("It is a tangent end point\n Pushing it");
                mergedHull.push(rightHulls[i]);
            }
            else{
                //it is on the tangents but are not the end points
                console.log("Product is zero for point\nIt means it is on the top or bottom tangents. \n Hence not including it. ", rightHulls[i]);
            }
            
            //old code
            //it means one of the two is zero.
            //mathematically it can also mean both are zero but thats not possible in this case

            // if(inRangeUpper||inRangeLower)

            //commenting the below line
                // mergedHull.push(rightHulls[i]);


            // else
                // console.log("THIS WILL PROBABLY NEVER GET EXECUTED...2")
        }
        else if(crossLeft * crossRight === 0){
            console.log("It is present in one of the sides\nHence not including it");
        }
        else if(inRangeUpper && inRangeLower){

                console.log("Strictly inside the polygon..\nHence not including it", rightHulls[i]);
               // mergedHull.push(rightHulls[i]);
            
        }
        else{
            console.log("Finally a point between tangents but outside the polygon.\nPushing it in", rightHulls[i]);
            mergedHull.push(rightHulls[i]);
        }
        i++;
    }
    console.log("The merged convex hull is................", mergedHull);
    return mergedHull;

}

function testingForPolygon(){
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [3,3]));    //true
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [2,2]));    //true
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [0,0]));        //true
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [5,5]));     //false
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [0,5]));        //false
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [5,0]));        //false
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [0,3]));        //true
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [3,0]));        //true
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [5,3]));    //false
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [3,5]));        //false
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [0,1]));    //true
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [1,0]));        //true
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [1,5]));    //false
    // console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [5,1])); //false
    console.log("Result is", checkInPolygon([0,5], [0,0], [5,5], [5,0], [4,4]));

}

function checkInPolygon(LT, LB, RT, RB, pointToCheck){
    //function call will be checkInPolygon(leftHullPointUpper, leftHullPointLower, rightHullPointUpper, rightHullPointLower, left/rightHulls[i]);
    // point: [x, y]
    // polygon: [[x1, y1], [x2, y2], ..., [xn, yn]] - where n will be 3 or 4

    let x = pointToCheck[0], y = pointToCheck[1];
    let inside = false;

    let polygon = [];
    polygon.push(LT);
    polygon.push(LB);
    polygon.push(RT);
    polygon.push(RB);

    polygon = reorderPolygonVertices(polygon);

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0], yi = polygon[i][1];
        let xj = polygon[j][0], yj = polygon[j][1];

        // This is the core ray casting logic
        let intersect = ((yi > y) != (yj > y)) &&
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        console.log("(xi,yi) is",xi, yi);
        console.log("(xj,yj) is",xj, yj);
        console.log("(x,y) is",x, y);
        console.log("intersect is", intersect);
        if (intersect) inside = !inside;
    }

    return inside;
}
function checkInRange(P,Q,R){
    //remember that i am checking only the x-axis value in this method
    // console.log("P[0]",P[0],"and Q[0]",Q[0],"and R[0]",R[0]);
    // console.log("P[1]",P[1],"and Q[1]",Q[1],"and R[1]",R[1]);
    if(( Math.min(P,Q)<R[0] && R[0]<Math.max(P,Q) ) )
        //&&
    //   ( Math.min(P[1],Q[1])<=R[1] && R[1]<=Math.max(P[1],Q[1]) ))
    {   
        console.log("Returning 1");
        console.log("min P[0] and Q[0] =",Math.min(P,Q));
        console.log("max P[0] and Q[0] =",Math.max(P,Q) );
        console.log("R[0] is",R[0]);
        return 1;
    }   
    else{
        console.log("Returning 0");
        console.log("min P[0] and Q[0] =",Math.min(P,Q));
        console.log("max P[0] and Q[0] =",Math.max(P,Q) );
        console.log("R[0] is",R[0]);
        return 0;
    }
        
}

function cross(a,b,c){
    //cross(A,B,C)=(x2−x1)(y3−y1)−(y2−y1)(x3−x1)
    // a => (x1,y1)
    // b => (x2,y2)
    // c => (x3,y3)
    return ((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])) ;
}

function resetConvexHull(){

    document.getElementById('addButton2').disabled=false;
    document.getElementById('deleteButton2').disabled=false;
    document.getElementById("conquerButton2").disabled=false;
    document.getElementById("divideButton2").disabled=false;
    coordinates = [];
    partitions = [];
    
    points.clear();
    // pointsLayer.innerHTML="";
    renderPoints();
    partitionAdded = true;
    level=0;
    console.log("reset all things");
    console.clear();
    console.log("Reset the interface. Starting fresh!");
    string_ans = [];
    document.getElementById('finalans2').textContent=string_ans;
    convexHulls = [];
    hulls = [];
}

function reorderPolygonVertices(points) {
    if (points.length < 3) {
        // Not enough points to form a polygon
        return points;
    }

    // 1. Calculate Centroid
    let centerX = 0;
    let centerY = 0;
    for (const p of points) {
        centerX += p[0];
        centerY += p[1];
    }
    centerX /= points.length;
    centerY /= points.length;

    // 2. Calculate Angles and 3. Sort by Angle
    const sortedPoints = [...points].sort((a, b) => {
        const angleA = Math.atan2(a[1] - centerY, a[0] - centerX);
        const angleB = Math.atan2(b[1] - centerY, b[0] - centerX);
        return angleA - angleB;
    });

    return sortedPoints;
}

function compareEndPoints(endPoints, point){

    let ans=endPoints.some(p=>(p[0]===point[0]&&p[1]===point[1]));
    if(point[0]===3 && (point[1]===0 || point[1]===5)){
        console.log("Special case, the endPoints array is", endPoints);
        console.log("The value of ans is", ans);
        
    }
    return ans;
}


//////////////////codeforgraph
const grid = document.getElementById("grid");
const pointsLayer = document.getElementById("points");
const points = new Set(); // store as "x,y" strings for easy lookup 

function togglePoint(x, y) {
    const key = `${x},${y}`;
    // console.log("key is...",key);
    if (points.has(key)) {
      points.delete(key);
      deleteCoordinates(key)
    } else {
      points.add(key);
        inputCoordinates(key);
    }
    renderPoints();
}

function renderPoints() {
    pointsLayer.innerHTML = "";
    points.forEach(p => {
      const [x, y] = p.split(",").map(Number);
      pointsLayer.innerHTML += `<circle cx="${x}" cy="${10-y}" r="0.08" />`;
    });
}

grid.addEventListener("click", (e) => {
    const bbox = grid.getBoundingClientRect(); 

    //the below code converts pixels to grid units itseems. bbox contains left, right, hright and with in pixels and we are converting that into more usable form (grid units).
    const scaleX = 12 / bbox.width;
    const scaleY = 12 / bbox.height;

    //this is to get the left top coordinate when clicked. 
    // const x = Math.floor((e.clientX - bbox.left) * scaleX);
    // const y = Math.floor((e.clientY - bbox.top) * scaleY);
    // Only allow clicks in valid range (1 to 10)
    // if (x >= 1 && x <= 10 && y >= 1 && y <= 10) {
    //   togglePoint(x, 11 - y); // invert y-axis
    // }

    
    const clickX = (e.clientX - bbox.left) * scaleX;
    const clickY = (e.clientY - bbox.top) * scaleY;
    const logicalX = clickX;
    const logicalY = clickY;
    let found = false;
    const radius = 0.15;
    //this poiont clicking is my logic of an invisible activation circle
    //rather than clicking inside the box, it expects users to normally click on the point.
    for (let x = 0; x <= 10 && !found; x++) {
        for (let y = 0; y <= 10 && !found; y++) {
          const dx = logicalX - x-1;
          const dy = logicalY - (11 - y); // invert y back
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= radius) {
            togglePoint(x, y);
            found = true;
          }
        }
      }
});
//////////////////codeforgraph

document.getElementById('addButton2').addEventListener('click', inputCoordinates);
document.getElementById('deleteButton2').addEventListener('click', deleteCoordinates);
document.getElementById('divideButton2').addEventListener('click', divideCoordinates);
document.getElementById('resetButton2').addEventListener('click', resetConvexHull);
document.getElementById('conquerButton2').addEventListener('click', conquerCoordinates);
// document.getElementById('conquerButton2').addEventListener('click', compareEndPoints);


/*




*/