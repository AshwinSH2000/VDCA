//convexhull.js
let coordinates = [];
let partitions = [];
let convexHulls = [];
let partitionAdded = true;
let level = 0;
let hulls = [];
let currentIndex = 0;
let string_ans = [];
let partitionForRendering = [];
let divideFlag = false;
let conquerFlag = false;
let solveDivideFlag = false;
let solveConquerFlag = false;
let activeTooltips = new Map();
let inputToolTipFlag = true;
let solveMode = false;
let endTutorial = false;
document.getElementById("divideButton2").disabled = true;
document.getElementById("conquerButton2").disabled = true;
document.getElementById("solveButton2").disabled = true;

function inputCoordinates(inputStr) {
    // @type {HTMLInputElement}
    // const inputStr = document.getElementById("coordinates2").value.trim(); //disabled this to have points by clickong on the graph

    let coord = [];
    if (inputStr.includes(",")) {
        coord = inputStr.split(",").map(Number);
    }
    else if (inputStr.includes(" ")) {
        coord = inputStr.split(" ").map(Number);
    }
    else {
        console.log("none got exed");
        // alert("Enter both x and y coordinates!");
        showToast("Enter both x and y coordinates", "error");
        //document.getElementById('coordinates2').value='';
        return;
    }
    if (coord) {
        document.getElementById("divideButton2").disabled = false;
        document.getElementById("solveButton2").disabled = false;

        console.log("Coord is this inside if case:", coord);
        if (coord[0] <= 10 && coord[1] <= 10) {
            if (!coordinates.some(a => a[0] === coord[0] && a[1] === coord[1])) {
                coordinates.push(coord);
                showToast(`Point [${coord}] added`, "info");
                console.log("The input coord is", coordinates);
            }
            else {
                console.log("Duplicate entry");
                // alert("Duplicate entry. Discarding it.");
                showToast("Duplicate entry. Discarding it", "info");
            }
        }
        else {
            // alert("Enter a number <= 10");
            showToast("Enter a number <=10", "error");
        }
    }
    else {
        // alert('Enter a number');
        showToast("Enter a number", "error");
    }
    //document.getElementById('coordinates2').value='';
    // if (inputToolTipFlag) {
    //     showDynamicTooltip(document.getElementById("divideButton2"), "Divide splits the points into smaller partitions", "top-left");
    //     showDynamicTooltip(document.getElementById("solveButton2"), "Clicking on Solve before Divide displays the convex hull of all the selected points", "top-right");
    //     inputToolTipFlag = false;
    // }


}

function deleteCoordinates(inputStr) {
    // const inputStr = document.getElementById("coordinates2").value.trim();   //disabling this to enable deleting points from the graph
    let coord = [];
    if (inputStr.includes(",")) {
        coord = inputStr.split(",").map(Number);
    }
    else if (inputStr.includes(" ")) {
        coord = inputStr.split(" ").map(Number);
    }
    else {
        console.log("none got exed");
    }
    if (coord) {
        if (coordinates.some(p => (p[0] == coord[0] && p[1] == coord[1]))) {
            let index = 0;
            index = coordinates.findIndex(p => (p[0] == coord[0] && p[1] == coord[1]))
            console.log("Found at index", index);
            coordinates.splice(index, 1);
            showToast(`Point [${coord}] deleted`, "info");
            console.log("This works!", coordinates);
            if (coordinates.length === 0) {
                document.getElementById("divideButton2").disabled = true;
                document.getElementById("solveButton2").disabled = true;
            }
        }
        else {
            console.log("This doesnt work", coordinates);
        }
    }
    //document.getElementById("coordinates2").value='';
}
let firstDivideFlag = true;
function divideCoordinates() {
    // if (firstDivideFlag && !solveMode) {
    //     showDynamicTooltip(document.getElementById("solveButton2"), "Clicking on Solve at any point will display the convex hulls of the current partition(s)", "top-right");
    //     showDynamicTooltip(document.getElementById("divideButton2"), "Divide will continue splitting the points into smaller partitions", "top-left");
    //     firstDivideFlag = false;
    // }



    divideFlag = true;

    if (partitionAdded === false) {
        console.log("All partitions are now terminal convex hulls. No further division needed. ");
        //convexHulls.sort( (a,b)  =>  a[0][0]-b[0][0] );
        console.log("The final terminal CHs are", convexHulls);
        console.log("Partitions for rendering array is", partitionForRendering);
        document.getElementById("divideButton2").disabled = true;
        renderTerminalHulls();
        solveDivideFlag = true;
        console.log("Max level is...", level);
        document.getElementById("conquerButton2").disabled = false;

        //this was a quickfix. need to find and avoid this dual printing of toast
        if (solveMode === false) showToast("Divide phase complete", "success");
        return;
    }
    let partitionForToast = [];
    partitionAdded = false;
    if (level == 0) {
        // document.getElementById('addButton2').disabled=true;
        // document.getElementById('deleteButton2').disabled=true;
        partitions.push(-1);
        partitions.push(11);
        console.log(partitions);
        coordinates.sort((a, b) => a[0] - b[0]);
        let CH = [];
        CH = checkCollinear(coordinates, 0, coordinates.length - 1)
        if (CH == null) {
            console.log("Empty coordinates array. Hence no CH");
        }
        else if (CH && CH.length === 1) {
            console.log("The CH is the point", CH);
            convexHulls.push(CH);
            hulls.push({
                // points: CH,
                points: [CH[0]],
                level: level,
                index: currentIndex++
            });
        }
        else if (CH && (CH.length === 2 || CH.every(p => p[0] === CH[0][0]))) {
            console.log("The CH is a line joining", CH);
            //this push likely wont cause trouble as its the first push into convexHulls. 
            CH.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            //now push only the end points. 

            // convexHulls.push(CH);   
            convexHulls.push([CH[0], CH[CH.length - 1]]);
            hulls.push({
                // points: CH,
                points: [CH[0], CH[CH.length - 1]],
                level: level,
                index: currentIndex++
            });
        }
        else {
            console.log("Need to find a CH using algo");
            let median = 0;
            median = findMedianPartition(coordinates, 0, coordinates.length - 1);
            console.log("The median for division is", median);
            partitions.push(median);
            partitionForRendering.push({
                value: median,
                level: level,
            });
            partitionForToast.push(` ${median}`);
            renderPartitionLines();
            partitionAdded = true;
            partitions.sort((a, b) => a - b);
            console.log("New partitions is", partitions);
        }
        level++;
    }
    else {
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
        while (counter < partitionsLength - 1) {
            //this runs partitions.length-1 times
            //check what are the coordinates between partitions[counter] and partitions[counter+1]
            let i = 0;
            let lowerLimit = partitions[counter];
            let upperLimit = partitions[counter + 1];
            let low = -1;
            let high = -1;
            while (i < coordinates.length) {
                if (coordinates[i][0] >= lowerLimit && coordinates[i][0] <= upperLimit) {
                    //this point is in range.
                    if (low === -1) {
                        low = high = i;
                    }
                    else {
                        high = i;
                    }
                }
                i++;
            }
            console.log("partition", counter, "is", low, high);

            //checking for collinearity
            let CH = [];
            CH = checkCollinear(coordinates, low, high);
            if (CH && (CH.length === 1 || CH.length === 2 || CH.every(p => p[0] === CH[0][0]))) {
                if (CH.length === 1) {
                    console.log("The CH is the point", CH);
                }
                else {
                    console.log("The CH is a line joining", CH);
                }
                //this if case is common to both the cases. hence added at the bottom
                CH.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
                // if(!convexHulls.some(p=>(p[0][0]===CH[0][0]&&p[0][1]===CH[0][1]))){
                if (!convexHulls.some(hull => isHullAlreadyPresent(hull, CH))) {
                    // console.log("p is", convexHulls);
                    // console.log("CH[0] is", CH[0]);
                    convexHulls.push(CH);
                    hulls.push({
                        points: CH,
                        level: level,
                        index: currentIndex++
                    });
                    convexHulls.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
                    console.log("hulls before pushing ...", hulls);
                    console.log("Pushed...", CH);
                    console.log("hulls after pushing ...", hulls);
                }
            }
            else {
                console.log("Need to find a CH using algo");
                let median = 0;
                median = findMedianPartition(coordinates, low, high);
                console.log("The median for division is", median);
                partitions.push(median);
                partitionForRendering.push({
                    value: median,
                    level: level,
                });
                partitionForToast.push(` ${median}`);
                renderPartitionLines();
                partitionAdded = true;
                console.log("New partitions is", partitions);
            }
            counter++
            console.log("----------------End of iteration", counter, "in level", level);
        }
        console.log("----------------End of level", level, "----------------");
        partitions.sort((a, b) => a - b);
        level++;
    }
    // console.log("ACHU, partitions is ", partitions);

    console.log("At this level, checkforending is", checkForEnding());
    if (checkForEnding()) {
        if (partitionAdded === false) {
            console.log("All partitions are now terminal convex hulls. No further division needed. ");
            console.log("The final terminal CHs are", convexHulls);
            console.log("Partitions for rendering array is", partitionForRendering);
            console.log("Max level is...", level);
            showToast("Divide phase complete", "success");
            return;
        }
        else {
            document.getElementById("divideButton2").disabled = true;
            // if (partitionForToast.length === 1)
            showToast(`Using ${partitionForToast} to partition the points at level ${level}`);
            // else {
            //     showToast(`Using ${partitionForToast} to partition the points`);
            //     console.log("this is just after toasting", partitionForToast);
            // }
            divideCoordinates();
        }
    }
    else {
        // if (partitionForToast.length === 1)
        showToast(`Using ${partitionForToast} to partition the points  at level ${level}`);
        // else {
        //     showToast(`${partitionForToast} are the highlighted partitions`);
        //     console.log("this is just after toasting", partitionForToast);
        // }
    }

    // if (partitionAdded === false) {
    //     console.log("All partitions are now terminal convex hulls. No further division needed. ");
    //     //convexHulls.sort( (a,b)  =>  a[0][0]-b[0][0] );
    //     console.log("The final terminal CHs are", convexHulls);
    //     console.log("Partitions for rendering array is", partitionForRendering);
    //     document.getElementById("divideButton2").disabled = true;
    //     // renderTerminalHulls();
    //     // solveDivideFlag = true;
    //     console.log("Max level is...", level);
    //     document.getElementById("divideButton2").disabled = true;

    //     return;
    // }
}

function checkForEnding() {
    //use coordinates, partitions to make a check. 
    let i = 1;
    let prevPartition = -1;
    for (; i < partitions.length - 1; i++) {
        let partitionPoints = coordinates.filter(p => p[0] < partitions[i] && p[0] > prevPartition);
        console.log("The partition is", partitions[i]);
        console.log("The partition points are", partitionPoints);
        prevPartition = partitions[i];
        if (partitionPoints.length === 1 || partitionPoints.length === 2)
            continue;
        else if (partitionPoints.length > 2) {
            //check for collinearity here. 
            let resultCollinearity = checkCollinear(partitionPoints, 0, partitionPoints.length - 1)
            if (resultCollinearity == false) {
                //i am not sure why i added this line. 
                //it doesnt matter if the points are collinear or not right? if there are more than 2, just return false. 
                console.log("Non collinear points before the last partition");
                return false
            }
            else if (partitionPoints.every(p => p[0] === partitionPoints[0][0])) {
                //this means they are collinear and are placed on the same x coordinate
                //eat 5star, do nothing! 
                console.log("collinear points but are on same x coord");

            }
            else {
                //it means they are collinear but points are having different x coord values. 
                console.log("collinear points but are on different x coord");
                return false;
            }
            // return false;   //added this line after observing divide calls itself when there are >2 pts but are collinear. 
        }
    }

    //until now all the elements to the left of the partition points were checked. 
    //but the points to the right of the last partition could not be checked and the below code is just for that. 
    i--;
    let partitionPoints = coordinates.filter(p => p[0] > partitions[i]);
    console.log("The partition is (outside)", partitions[i]);
    console.log("The partition points are (outside)", partitionPoints);
    if (partitionPoints.length > 2) {
        //check for collinearity here. 
        let resultCollinearity = checkCollinear(partitionPoints, 0, partitionPoints.length - 1)
        if (resultCollinearity == false) {
            //same as above, not sure why i added this if case. 
            console.log("Non collinear points after the last partition");
            return false
        }
        else if (partitionPoints.every(p => p[0] === partitionPoints[0][0])) {
            //i was checking of resultcollinearity was true but that was not at all needed as id the result of that function was true, then it would not return true, instrad it would retuen the collinear points..so that checkinf of resultCollinearity===true was wrongly placed. After removing it both here and in the upper if case it is working fine.. 
            //the pts are collinear and are on same x-coord value
            //do nothing
            console.log("collinear points after last partition but are on same x coord");
            ;
        }
        else {
            //the pts are on collinear but different x-coord values
            console.log("collinear points after last partition but on differnet x coord")
            return false;
        }
    }
    return true;
}

function isHullAlreadyPresent(a, b) {
    if (a.length !== b.length) return false;
    return a.every((point, i) => point[0] === b[i][0] && point[1] === b[i][1]);
}

// function checkIfAllXAreSame(CH){

//     for(let i=0 ; i<CH.length ; i++){
//         if(CH[i][0]!==CH[0][0])
//             return false;
//     }
//     return true;
// }

function checkCollinear(coord, low, high) {
    //if(coord.length===0){
    if (low > high) {
        //will this ever get executed? check it
        console.log("Empty coordinates array. ");
        return null;
    }
    //if(coord.length===1){
    if (high - low === 0) {
        //its just a point. hence trivially collinear
        console.log("Just a point in the set");
        //returning coord because it has just one point and that is the CH
        return [coord[high]];
    }
    //if(coord.length===2){
    if (high - low === 1) {
        //they are collinear because there are only two points!
        console.log("The two points are collinear");
        //returning the coord because it has two points and that is the CH
        return [coord[low], coord[high]];
    }

    let refCoord1 = coord[low];         //x1 and y1
    let refCoord2 = coord[low + 1];       //x2 and y2
    let i = low + 2;
    let result = -1;
    while (i <= high) {
        result = cross(refCoord1, refCoord2, coord[i]);
        //((refCoord2[0]-refCoord1[0])*(coord[i][1]-refCoord1[1])-
        //  (refCoord2[1]-refCoord1[1])*(coord[i][0]-refCoord1[0]));
        console.log("Result is", result);
        console.log("coord is", coord[i]);
        if (result !== 0) {
            console.log("Not collinear");
            return false;
        }
        i++;
    }
    console.log("Loop finished which means the points are collinear");
    coord.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let returnCH = [];
    i = low;
    while (i <= high) {
        returnCH.push(coord[i]);
        i++;
    }
    console.log("Sorted coords are", coord, "and CH is", returnCH);
    // return collinearCH;
    return returnCH;

    /*
    The slope calculation fails when the denominator is zero
    To avoid that we do cross product calculation. How does it work?
    Take any two distinct points (x1,y1) and (x2,y2), and subs their values in the formula
    (x2-x1)(y3-y1)-(y2-y1)(x3-x1)
    You get a reference formula. Then take all other points in the set and substitute them into this formula. 
    If the result is 0, then the points are collinear. 
    */

}
function findMedianPartition(coord, low, high) {
    let setOfXCoord = [];
    let i = low;
    while (i <= high) {
        if (!setOfXCoord.includes(coord[i][0]))
            setOfXCoord.push(coord[i][0]);
        i++;
    }
    setOfXCoord.sort((a, b) => a - b);
    console.log("The sorted non repetitive x coordinates are", setOfXCoord);
    let size = Math.floor(setOfXCoord.length / 2);
    let median = (setOfXCoord[size - 1] + setOfXCoord[size]) / 2;
    return median;
}
function conquerCoordinates() {
    let conquerForToast = [];
    conquerFlag = true;
    document.getElementById("solveButton2").disabled = true;
    //access convexHulls array and partitions array
    console.log("The CHs are:", convexHulls);
    console.log("The partitions are:", partitions);
    console.log("The hulls array is", hulls);

    //begin actual conquer phase

    //first get the max level in the hulls array
    let maxLevel = Math.max(...hulls.map(h => h.level));

    if (maxLevel === 0) {
        console.log("The convex hull is already found...dinkachika!");

        for (let i = 0; i < hulls[0].points.length; i++) {
            string_ans.push("[" + hulls[0].points[i] + "]");
        }
        console.log("String ans is...", string_ans);
        // document.getElementById('finalans').value=Array(hulls[0].points);
        document.getElementById('finalans2').textContent = string_ans;
        document.getElementById("conquerButton2").disabled = true;
        solveConquerFlag = true;
        return;
    }

    level--;

    //get all the hulls from the max lvel because thats what we will be merging first
    let levelHulls = hulls.filter(h => h.level === maxLevel);
    levelHulls.sort((a, b) => {
        const minA = Math.min(...a.points.map(p => p[0]));
        const minB = Math.min(...b.points.map(p => p[0]));
        return minA - minB;
    });

    //then sorting it based on the index so that we can merge the ones cliser together
    //levelHulls.sort((a,b)=>a.index-b.index);

    let merged = [];    //this is an array to store merged hulls (so that we do not increase the length of levelHulls during its traversal)
    let i = 0;
    while (i < levelHulls.length) {
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
        else {
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


    //   renderPartitionLines() is the function that is called inside renderTerminalHulls()
    //   in that I access partitionForRendering...so here i need to edit that
    //   can i remove all the elements in partitionForRendering whose level=maxlevel? mostly yes
    let tempPos = 0;
    while (tempPos !== -1) {

        tempPos = partitionForRendering.findIndex((p) => p.level === maxLevel - 1);
        if (tempPos > -1) {
            conquerForToast.push(` ${partitionForRendering[tempPos].value}`);
            partitionForRendering.splice(tempPos, 1);
        }
    }
    renderTerminalHulls();
    showToast(`Hulls across partitions ${conquerForToast} merged`, "info");

    // If only one hull left at level 0, done!
    if (hulls.length === 1 && hulls[0].level === 0) {
        //alert("final convex hull computed!");
        console.log("The merging is complete...FINAL CH:", hulls[0].points);

        // document.getElementById('finalans').textContent='The final convex hull is:';
        //need to fix this one
        let string_ans = []
        for (let i = 0; i < hulls[0].points.length; i++) {
            string_ans.push("[" + hulls[0].points[i] + "]");
        }
        console.log("String ans is...", string_ans);
        // document.getElementById('finalans').value=Array(hulls[0].points);
        document.getElementById('finalans2').textContent = string_ans;
        document.getElementById("conquerButton2").disabled = true;
        showToast("Final Convex Hull found!", "success");
    }

}

function mergeConvexHulls(leftHulls, rightHulls) {

    console.log("Reached here");
    console.log("LeftHulls is", leftHulls);
    console.log("Riht hulls is", rightHulls);


    //find the right most point from lefthull and left most from right hull
    let rightHullPointUpper = leftHulls[leftHulls.length - 1]; //(x2, y2)
    let leftHullPointUpper = rightHulls[0]; //(x1, y1)

    console.log("LeftHullspoint is", leftHullPointUpper);
    console.log("Riht hulls is point", rightHullPointUpper);


    // only for testing
    // console.log("left most is",leftMost);
    // console.log("right most is",rightMost);

    //fixed the rightmost... now iterating through the righthull
    let i = 0;
    let crossProd = 0;
    let changed = true;

    let counterrrr = 0;
    while (changed) {
        if (counterrrr === 100) {
            break;
        }
        changed = false;

        for (i = 0; i < rightHulls.length; i++) {
            //cross(A,B,C)=(x2−x1)(y3−y1)−(y2−y1)(x3−x1)
            crossProd = (rightHullPointUpper[0] - leftHullPointUpper[0]) * (rightHulls[i][1] - leftHullPointUpper[1]) -
                (rightHullPointUpper[1] - leftHullPointUpper[1]) * (rightHulls[i][0] - leftHullPointUpper[0]);
            if (crossProd < 0) {
                //it means point rightHulls[i] is the point where we anchor our tangent end point in righthull
                leftHullPointUpper = rightHulls[i];
                console.log("Updating leftmost (in rightHulls)...1");
                console.log("new point selected is...(1)", rightHulls[i])

                changed = true;
            }
            else if (crossProd === 0) {
                //select the point that is farthest from the two
                if (leftHullPointUpper[0] === rightHulls[i][0] && leftHullPointUpper[1] === rightHulls[i][1]) {
                    console.log("since its the same point, doing nothing :)");
                }
                else if (Math.abs(rightHullPointUpper[0] - rightHulls[i][0]) >
                    Math.abs(rightHullPointUpper[0] - leftHullPointUpper[0])) {
                    leftHullPointUpper = rightHulls[i];
                    console.log("Updating leftmost (in rightHulls)...2");
                    console.log("new point selected is...(2)", rightHulls[i])

                    changed = true;
                }

            }
        }

        //after coming out of loop, leftmost will be anchored
        for (i = 0; i < leftHulls.length; i++) {
            crossProd = (rightHullPointUpper[0] - leftHullPointUpper[0]) * (leftHulls[i][1] - leftHullPointUpper[1]) -
                (rightHullPointUpper[1] - leftHullPointUpper[1]) * (leftHulls[i][0] - leftHullPointUpper[0]);
            if (crossProd < 0) {
                //it means point leftHulls[i] is the point where we anchor out tangent end point in lefthull
                rightHullPointUpper = leftHulls[i];
                console.log("Updating rightmost (in leftHulls)...1");
                console.log("new point selected is (1)...", leftHulls[i])
                changed = true;
            }
            else if (crossProd === 0) {

                if (rightHullPointUpper[0] === leftHulls[i][0] && rightHullPointUpper[1] === leftHulls[i][1]) {
                    console.log("its the same point. hence doing nothing ::)");
                }
                else if (Math.abs(leftHullPointUpper[0] - leftHulls[i][0]) >
                    Math.abs(leftHullPointUpper[0] - rightHullPointUpper[0])) {
                    rightHullPointUpper = leftHulls[i];
                    console.log("Updating rightmost (in leftHulls)...2");
                    console.log("new point selected is...(2)", leftHulls[i]);
                    changed = true;
                }
            }
        }
        console.log("Finishing the while loop...counter is", counterrrr);
        counterrrr++;
    }
    console.log("The top tangent is a line passing through ", leftHullPointUpper, "and", rightHullPointUpper);



    //now finding the lower tangenst
    let rightHullPointLower = leftHulls[leftHulls.length - 1]; //(x2, y2)
    let leftHullPointLower = rightHulls[0]; //(x1, y1)

    //fixed the rightmost... now iterating through the righthull
    changed = true;
    while (changed) {

        if (counterrrr === 100) {
            break;
        }
        changed = false;

        for (i = 0; i < rightHulls.length; i++) {
            //cross(A,B,C)=(x2−x1)(y3−y1)−(y2−y1)(x3−x1)
            console.log("Looking at point", rightHulls[i]);
            crossProd = (rightHullPointLower[0] - leftHullPointLower[0]) * (rightHulls[i][1] - leftHullPointLower[1]) -
                (rightHullPointLower[1] - leftHullPointLower[1]) * (rightHulls[i][0] - leftHullPointLower[0]);
            if (crossProd > 0) {
                //it means point rightHulls[i] is the point where we anchor our tangent end point in righthull
                leftHullPointLower = rightHulls[i];
                console.log("Updating leftmost (in rightHulls)...1");
                changed = true;
            }
            else if (crossProd === 0) {
                if (leftHullPointLower[0] === rightHulls[i][0] && leftHullPointLower[1] === rightHulls[i][1]) {
                    console.log("doing nothing because its a repeated point :::)");
                }
                else if (Math.abs(rightHullPointLower[0] - rightHulls[i][0]) >
                    Math.abs(rightHullPointLower[0] - leftHullPointLower[0])) {
                    leftHullPointLower = rightHulls[i];
                    console.log("Updating leftmost (in rightHulls)...2");
                    console.log("new point selected is", rightHulls[i])

                    changed = true;
                }
            }
        }
        //after coming out of loop, leftmost will be anchored


        for (i = 0; i < leftHulls.length; i++) {
            console.log("Looking at point", leftHulls[i]);
            crossProd = (rightHullPointLower[0] - leftHullPointLower[0]) * (leftHulls[i][1] - leftHullPointLower[1]) -
                (rightHullPointLower[1] - leftHullPointLower[1]) * (leftHulls[i][0] - leftHullPointLower[0]);
            if (crossProd > 0) {
                //it means point leftHulls[i] is the point where we anchor out tangent end point in lefthull
                rightHullPointLower = leftHulls[i];
                console.log("Updating rightmost (in leftHulls)...1");
                changed = true;
            }
            else if (crossProd === 0) {
                if (rightHullPointLower[0] === leftHulls[i][0] && rightHullPointLower[1] === leftHulls[i][1]) {
                    console.log("enchina illa marre..becoz its same ::::)");
                }
                else if (Math.abs(leftHullPointLower[0] - leftHulls[i][0]) >
                    Math.abs(leftHullPointLower[0] - rightHullPointLower[0])) {
                    rightHullPointLower = leftHulls[i];
                    console.log("Updating rightmost (in leftHulls)...2");
                    console.log("new point selected is", leftHulls[i])

                    changed = true;
                }
            }
        }
        console.log("Finishing the while loop...counter is", counterrrr);
        counterrrr++;
    }
    console.log("The bottom tangent is a line passing through ", leftHullPointLower, "and", rightHullPointLower);

    //check which points actually form the merged hull
    i = 0;
    let crossUpper = 0;
    let crossLower = 0;
    let crossLeft = 0;
    let crossRight = 0;
    let inRangeUpper = 0;
    let inRangeLower = 0;
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
    console.log("the rightmost point of the right hull is", rightMostPoint);

    while (i < leftHulls.length) {
        console.log("left hull is:", leftHulls[i]);
        crossUpper = cross(leftHullPointUpper, rightHullPointUpper, leftHulls[i]);
        crossLower = cross(leftHullPointLower, rightHullPointLower, leftHulls[i]);

        if (leftHullPointUpper !== leftHullPointLower)
            crossLeft = cross(leftHullPointUpper, leftHullPointLower, leftHulls[i]);
        else
            crossLeft = 1;

        if (rightHullPointUpper !== rightHullPointLower)
            crossRight = cross(rightHullPointUpper, rightHullPointLower, leftHulls[i]);
        else
            crossRight = 1;

        // inRangeLower = checkInRange(leftMostPoint,rightMostPoint,leftHulls[i]);
        // inRangeUpper = checkInRange(leftMostPoint,rightMostPoint,leftHulls[i]);
        inRangeLower = checkInPolygon(leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper, leftHulls[i]);
        inRangeUpper = checkInPolygon(leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper, leftHulls[i]);
        if (crossUpper * crossLower === 0) {

            //include the point if it is the tangent end point
            //else it means it is a point on the tangent hence do not include

            if (compareEndPoints([leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper], leftHulls[i])) {
                //it is a tangent end point
                console.log("It is a tangent endpoint\nPushing it");
                mergedHull.push(leftHulls[i]);
            }
            else {
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
        else if (crossLeft * crossRight === 0) {
            console.log("It is present in one of the sides\nHence not including it");
        }
        else if (inRangeUpper && inRangeLower) {

            //this means the point is not on the tangent but not inside the polygon too
            //it means it is a part of the merged hull.
            console.log("Strictly inside the polygon..\nHence not including it", leftHulls[i]);
            // mergedHull.push(leftHulls[i]);

        }
        else {
            console.log("Finally a point between tangents but outside the polygon.\nPushing it in", leftHulls[i]);
            mergedHull.push(leftHulls[i]);
        }
        i++;
    }
    i = 0;


    while (i < rightHulls.length) {
        console.log("right hull is:", rightHulls[i]);

        crossUpper = cross(leftHullPointUpper, rightHullPointUpper, rightHulls[i]);
        crossLower = cross(leftHullPointLower, rightHullPointLower, rightHulls[i]);

        //do the below only if there are distinct values for LU&LL or RU&RL
        if (leftHullPointUpper !== leftHullPointLower)
            crossLeft = cross(leftHullPointUpper, leftHullPointLower, rightHulls[i]);
        else
            crossLeft = 1;

        if (rightHullPointUpper !== rightHullPointLower)
            crossRight = cross(rightHullPointUpper, rightHullPointLower, rightHulls[i]);
        else
            crossRight = 1;

        // inRangeLower = checkInRange(leftMostPoint,rightMostPoint,rightHulls[i]);
        // inRangeUpper = checkInRange(leftMostPoint,rightMostPoint,rightHulls[i]);
        inRangeLower = checkInPolygon(leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper, rightHulls[i]);
        inRangeUpper = checkInPolygon(leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper, rightHulls[i]);

        if (crossUpper * crossLower === 0) {

            if (compareEndPoints([leftHullPointLower, leftHullPointUpper, rightHullPointLower, rightHullPointUpper], rightHulls[i])) {
                console.log("It is a tangent end point\n Pushing it");
                mergedHull.push(rightHulls[i]);
            }
            else {
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
        else if (crossLeft * crossRight === 0) {
            console.log("It is present in one of the sides\nHence not including it");
        }
        else if (inRangeUpper && inRangeLower) {

            console.log("Strictly inside the polygon..\nHence not including it", rightHulls[i]);
            // mergedHull.push(rightHulls[i]);

        }
        else {
            console.log("Finally a point between tangents but outside the polygon.\nPushing it in", rightHulls[i]);
            mergedHull.push(rightHulls[i]);
        }
        i++;
    }
    console.log("The merged convex hull is................", mergedHull);
    return mergedHull;

}

function checkInPolygon(LT, LB, RT, RB, pointToCheck) {
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
        console.log("(xi,yi) is", xi, yi);
        console.log("(xj,yj) is", xj, yj);
        console.log("(x,y) is", x, y);
        console.log("intersect is", intersect);
        if (intersect) inside = !inside;
    }

    return inside;
}
function checkInRange(P, Q, R) {
    //remember that i am checking only the x-axis value in this method
    // console.log("P[0]",P[0],"and Q[0]",Q[0],"and R[0]",R[0]);
    // console.log("P[1]",P[1],"and Q[1]",Q[1],"and R[1]",R[1]);
    if ((Math.min(P, Q) < R[0] && R[0] < Math.max(P, Q)))
    //&&
    //   ( Math.min(P[1],Q[1])<=R[1] && R[1]<=Math.max(P[1],Q[1]) ))
    {
        console.log("Returning 1");
        console.log("min P[0] and Q[0] =", Math.min(P, Q));
        console.log("max P[0] and Q[0] =", Math.max(P, Q));
        console.log("R[0] is", R[0]);
        return 1;
    }
    else {
        console.log("Returning 0");
        console.log("min P[0] and Q[0] =", Math.min(P, Q));
        console.log("max P[0] and Q[0] =", Math.max(P, Q));
        console.log("R[0] is", R[0]);
        return 0;
    }

}

function cross(a, b, c) {
    //cross(A,B,C)=(x2−x1)(y3−y1)−(y2−y1)(x3−x1)
    // a => (x1,y1)
    // b => (x2,y2)
    // c => (x3,y3)
    return ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
}

function resetConvexHull() {

    divideFlag = false;
    conquerFlag = false;
    // document.getElementById('addButton2').disabled=false;
    // document.getElementById('deleteButton2').disabled=false;
    document.getElementById("conquerButton2").disabled = false;
    document.getElementById("divideButton2").disabled = false;
    coordinates = [];
    partitions = [];

    points.clear();
    // pointsLayer.innerHTML="";
    renderPoints();
    partitionAdded = true;
    level = 0;
    console.log("reset all things");
    console.clear();
    console.log("Reset the interface. Starting fresh!");
    string_ans = [];
    document.getElementById('finalans2').textContent = string_ans;
    convexHulls = [];
    hulls = [];

    redLines.innerHTML = "";
    blueLines.innerHTML = "";
    greenLines.innerHTML = "";
    yellowLines.innerHTML = "";
    cyanLines.innerHTML = "";

    location.reload();
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

function compareEndPoints(endPoints, point) {

    let ans = endPoints.some(p => (p[0] === point[0] && p[1] === point[1]));
    if (point[0] === 3 && (point[1] === 0 || point[1] === 5)) {
        console.log("Special case, the endPoints array is", endPoints);
        console.log("The value of ans is", ans);

    }
    return ans;
}

//////////////////codeforgraph
const grid = document.getElementById("grid");
const pointsLayer = document.getElementById("points");
const redLines = document.getElementById("redline");
const blueLines = document.getElementById("blueline");
const yellowLines = document.getElementById("yellowline");
const greenLines = document.getElementById("greenline");
const cyanLines = document.getElementById("cyanline");
const whiteLines = document.getElementById("whiteline");
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
        pointsLayer.innerHTML += `<circle cx="${x}" cy="${10 - y}" r="0.08" />`;
    });
}

async function renderPartitionLines() {
    //i will invoke thsi function before i increment the level. 
    //hence i can use the same level value

    // level0: red partition
    // level1: blue partition 
    // level2: green partition
    // level3: yellow partition
    // level4: cyan partition

    let maxLevel = -1;
    for (let i = 0; i < partitionForRendering.length; i++) {
        if (partitionForRendering[i].level > maxLevel) {
            maxLevel = partitionForRendering[i].level;
        }
    }
    console.log("Max level inside renderpartitionLines is", maxLevel);
    //use the values present in partitionForRendering along with level to draw the lines

    // redLines.setAttribute("class", "disappear");
    // blueLines.setAttribute("class", "disappear");
    // yellowLines.setAttribute("class", "disappear");
    // cyanLines.setAttribute("class", "disappear");
    // whiteLines.setAttribute("class", "disappear");
    // await sleep(2000);
    redLines.innerHTML = "";
    blueLines.innerHTML = "";
    yellowLines.innerHTML = "";
    cyanLines.innerHTML = "";
    whiteLines.innerHTML = "";





    for (let i = 0; i < partitionForRendering.length; i++) {
        // await sleep(50);
        if (partitionForRendering[i].level === 0) {
            //redLines.innerHTML = ""; //this doesnt give error here but is it required? probably not
            if (partitionForRendering[i].level === maxLevel) {
                // redLines.classList.remove("redlineDull");
                // redLines.classList.add("redline");
                redLines.setAttribute("class", "redline");
            }
            else {
                // redLines.classList.remove("redline");
                // redLines.classList.add("redlineDull");
                redLines.setAttribute("class", "redlineDull");
            }

            redLines.innerHTML += `<line class="spawnIn" x1="${partitionForRendering[i].value}" y1="-1" x2="${partitionForRendering[i].value}" y2="11"/>`;
        }
        else if (partitionForRendering[i].level === 1) {
            if (partitionForRendering[i].level === maxLevel) {
                // blueLines.classList.remove("bluelineDull")
                // blueLines.classList.add("blueline");
                blueLines.setAttribute("class", "blueline");
            }
            else {
                // blueLines.classList.remove("blueline");
                // blueLines.classList.add("bluelineDull");
                blueLines.setAttribute("class", "bluelineDull");
            }

            blueLines.innerHTML += `<line class="spawnIn" x1="${partitionForRendering[i].value}" y1="-1" x2="${partitionForRendering[i].value}" y2="11"/>`;
            // console.log("Printed blue line.............................");
        }
        else if (partitionForRendering[i].level === 2) {
            if (partitionForRendering[i].level === maxLevel) {
                // yellowLines.classList.remove("yellowlineDull");
                // yellowLines.classList.add("yellowline");
                yellowLines.setAttribute("class", "yellowline");
            }
            else {
                // yellowLines.classList.remove("yellowline");
                // yellowLines.classList.add("yellowlineDull");
                yellowLines.setAttribute("class", "yellowlineDull");
            }

            yellowLines.innerHTML += `<line class="spawnIn" x1="${partitionForRendering[i].value}" y1="-1" x2="${partitionForRendering[i].value}" y2="11"/>`;
        }
        else if (partitionForRendering[i].level === 3) {
            if (partitionForRendering[i].level === maxLevel) {
                // cyanLines.classList.remove("cyanlineDull");
                // cyanLines.classList.add("cyanline");
                cyanLines.setAttribute("class", "cyanline");
            }

            else {
                // cyanLines.classList.remove("cyanline");
                // cyanLines.classList.add("cyanlineDull");
                cyanLines.setAttribute("class", "cyanlineDull");
            }


            cyanLines.innerHTML += `<line class="spawnIn" x1="${partitionForRendering[i].value}" y1="-1" x2="${partitionForRendering[i].value}" y2="11"/>`;
        }

        //not sure if this will get executed as in my set of coordinates, I dont think level 4 will be reached
        else if (partitionForRendering[i].level === 4) {
            if (partitionForRendering[i].level === maxLevel) {
                // whiteLines.classList.remove("whitelineDull");
                // whiteLines.classList.add("whiteline");
                whiteLines.setAttribute("class", "whiteline");
            }
            else {
                // whiteLines.classList.remove("whiteline");
                // whiteLines.classList.add("whitelineDull");
                whiteLines.setAttribute("class", "whitelineDull");
            }

            whiteLines.innerHTML += `<line class="spawnIn" x1="${partitionForRendering[i].value}" y1="-1" x2="${partitionForRendering[i].value}" y2="11"/>`;
        }
    }
}

function renderTerminalHulls() {

    // redLines.innerHTML = "";
    // blueLines.innerHTML = "";
    // yellowLines.innerHTML = "";
    // cyanLines.innerHTML = "";

    renderPartitionLines();
    //use the hulls to draw the termial hulls
    for (let i = 0; i < hulls.length; i++) {
        console.log("Drawing a line between the points", hulls[i]);

        if (hulls[i].level === 4) {
            if (hulls[i].points.length === 1) {
                //just a single point
                //do nothing I guess....as it is already highlighted
                cyanLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`;
                console.log("A POINT");
            }
            else if (hulls[i].points.length === 2) {
                //proper two points
                cyanLines.innerHTML += `<line class="spawnIn" x1="${hulls[i].points[0][0]}" 
                                                y1="${10 - hulls[i].points[0][1]}" 
                                                x2="${hulls[i].points[1][0]}" 
                                                y2="${10 - hulls[i].points[1][1]}"
                                            />`;
                cyanLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`;
                cyanLines.innerHTML += `<circle cx="${hulls[i].points[1][0]}" cy="${10 - hulls[i].points[1][1]}" r="0.08" />`;
                console.log("A LINE");

            }
            else if (hulls[i].points.length > 2) {
                console.log("collinear points detected. hence selecting the hull points of that polygon");

                //iterate through all the points of the hulls[i]...make a polygon out of it. 
                //then draw a line joining each part of the polygon
                //hulls[i].points will have all the points needed
                let colouredHullPoints = hulls[i].points;
                colouredHullPoints = reorderPolygonVertices(colouredHullPoints);
                for (let i = 0, j = colouredHullPoints.length - 1; i < colouredHullPoints.length; j = i++) {
                    cyanLines.setAttribute("class", "cyanline");
                    // void line.offsetWidth;  // Trigger reflow

                    cyanLines.innerHTML += `<circle cx="${colouredHullPoints[i][0]}" 
                                                    cy="${10 - colouredHullPoints[i][1]}" r="0.08" />`;

                    cyanLines.innerHTML += `<line class="spawnIn" x1="${colouredHullPoints[i][0]}" 
                                                    y1="${10 - colouredHullPoints[i][1]}" 
                                                    x2="${colouredHullPoints[j][0]}" 
                                                    y2="${10 - colouredHullPoints[j][1]}"
                                                />`;
                }


                // cyanLines.innerHTML += `<circle cx="${hulls[i].points[hulls[i].points.length-1][0]}" cy="${10-hulls[i].points[hulls[i].points.length-1][1]}" r="0.08" />`;
            }
        }

        else if (hulls[i].level === 3) {
            if (hulls[i].points.length === 1) {
                //just a single point
                //do nothing I guess....as it is already highlighted
                yellowLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`;
                console.log("A POINT");
            }
            else if (hulls[i].points.length === 2) {
                //proper two points
                yellowLines.innerHTML += `<line class="spawnIn" x1="${hulls[i].points[0][0]}" 
                                                y1="${10 - hulls[i].points[0][1]}" 
                                                x2="${hulls[i].points[1][0]}" 
                                                y2="${10 - hulls[i].points[1][1]}"
                                            />`;
                console.log("A LINE");
                yellowLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`;
                yellowLines.innerHTML += `<circle cx="${hulls[i].points[1][0]}" cy="${10 - hulls[i].points[1][1]}" r="0.08" />`;

            }
            else if (hulls[i].points.length > 2) {
                console.log("collinear points detected. hence selecting the end points");
                // yellowLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10-hulls[i].points[0][1]}" r="0.08" />`;
                // yellowLines.innerHTML += `<circle cx="${hulls[i].points[hulls[i].points.length-1][0]}" cy="${10-hulls[i].points[hulls[i].points.length-1][1]}" r="0.08" />`;
                //  yellowLines.innerHTML += `<line x1="${hulls[i].points[0][0]}" 
                //                                     y1="${10-hulls[i].points[0][1]}" 
                //                                     x2="${hulls[i].points[hulls[i].points.length-1][0]}" 
                //                                     y2="${10-hulls[i].points[hulls[i].points.length-1][1]}"
                //                             />`;
                let colouredHullPoints = hulls[i].points;
                colouredHullPoints = reorderPolygonVertices(colouredHullPoints);
                for (let i = 0, j = colouredHullPoints.length - 1; i < colouredHullPoints.length; j = i++) {
                    yellowLines.innerHTML += `<circle cx="${colouredHullPoints[i][0]}" 
                                                    cy="${10 - colouredHullPoints[i][1]}" r="0.08" />`;

                    yellowLines.innerHTML += `<line class="spawnIn" x1="${colouredHullPoints[i][0]}" 
                                                    y1="${10 - colouredHullPoints[i][1]}" 
                                                    x2="${colouredHullPoints[j][0]}" 
                                                    y2="${10 - colouredHullPoints[j][1]}"
                                                />`;
                }
            }
        }
        else if (hulls[i].level === 0) {
            console.log("hang on ash");

            if (hulls[i].points.length === 1) {
                //just a single point
                //do nothing I guess....as it is already highlighted
                console.log("A POINT");
                greenLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`
            }
            else if (hulls[i].points.length === 2) {
                //proper two points
                // greenLines.classList.add("greenline");
                greenLines.setAttribute("class", "greenline");
                greenLines.innerHTML += `<line class="spawnIn" x1="${hulls[i].points[0][0]}" 
                                                y1="${10 - hulls[i].points[0][1]}" 
                                                x2="${hulls[i].points[1][0]}" 
                                                y2="${10 - hulls[i].points[1][1]}"
                                            />`;
                console.log("A LINE");
                greenLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`;
                greenLines.innerHTML += `<circle cx="${hulls[i].points[1][0]}" cy="${10 - hulls[i].points[1][1]}" r="0.08" />`;

            }
            else if (hulls[i].points.length > 2) {
                console.log("collinear points detected. hence selecting the points forming the hull");
                // greenLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10-hulls[i].points[0][1]}" r="0.08" />`;
                // greenLines.innerHTML += `<circle cx="${hulls[i].points[hulls[i].points.length-1][0]}" cy="${10-hulls[i].points[hulls[i].points.length-1][1]}" r="0.08" />`;
                //  greenLines.innerHTML += `<line x1="${hulls[i].points[0][0]}" 
                //                                 y1="${10-hulls[i].points[0][1]}" 
                //                                 x2="${hulls[i].points[hulls[i].points.length-1][0]}" 
                //                                 y2="${10-hulls[i].points[hulls[i].points.length-1][1]}"
                //                             />`;
                let colouredHullPoints = hulls[i].points;
                colouredHullPoints = reorderPolygonVertices(colouredHullPoints);
                for (let i = 0, j = colouredHullPoints.length - 1; i < colouredHullPoints.length; j = i++) {
                    console.log("la la la")
                    // greenLines.classList.add("greenline");
                    greenLines.setAttribute("class", "greenline");
                    greenLines.innerHTML += `<circle cx="${colouredHullPoints[i][0]}" 
                                                    cy="${10 - colouredHullPoints[i][1]}" r="0.08" />`;

                    greenLines.innerHTML += `<line class="spawnIn" x1="${colouredHullPoints[i][0]}" 
                                                    y1="${10 - colouredHullPoints[i][1]}" 
                                                    x2="${colouredHullPoints[j][0]}" 
                                                    y2="${10 - colouredHullPoints[j][1]}"
                                                />`;
                }
            }
        }
        else if (hulls[i].level === 2) {
            if (hulls[i].points.length === 1) {
                //just a single point
                //do nothing I guess....as it is already highlighted
                console.log("A POINT");
                blueLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`;
            }
            else if (hulls[i].points.length === 2) {
                //proper two points
                blueLines.innerHTML += `<line class="spawnIn" x1="${hulls[i].points[0][0]}" 
                                                y1="${10 - hulls[i].points[0][1]}" 
                                                x2="${hulls[i].points[1][0]}" 
                                                y2="${10 - hulls[i].points[1][1]}"
                                    />`;
                console.log("A LINE");
                blueLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`;
                blueLines.innerHTML += `<circle cx="${hulls[i].points[1][0]}" cy="${10 - hulls[i].points[1][1]}" r="0.08" />`;

            }
            else if (hulls[i].points.length > 2) {
                console.log("collinear points detected. hence selecting the points of the hull");
                // blueLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10-hulls[i].points[0][1]}" r="0.08" />`;
                // blueLines.innerHTML += `<circle cx="${hulls[i].points[hulls[i].points.length-1][0]}" cy="${10-hulls[i].points[hulls[i].points.length-1][1]}" r="0.08" />`;
                //  blueLines.innerHTML += `<line x1="${hulls[i].points[0][0]}" 
                //                                 y1="${10-hulls[i].points[0][1]}" 
                //                                 x2="${hulls[i].points[hulls[i].points.length-1][0]}" 
                //                                 y2="${10-hulls[i].points[hulls[i].points.length-1][1]}"
                //                         />`;
                let colouredHullPoints = hulls[i].points;
                colouredHullPoints = reorderPolygonVertices(colouredHullPoints);
                for (let i = 0, j = colouredHullPoints.length - 1; i < colouredHullPoints.length; j = i++) {
                    blueLines.innerHTML += `<circle cx="${colouredHullPoints[i][0]}" 
                                                    cy="${10 - colouredHullPoints[i][1]}" r="0.08" />`;

                    blueLines.innerHTML += `<line class="spawnIn" x1="${colouredHullPoints[i][0]}" 
                                                    y1="${10 - colouredHullPoints[i][1]}" 
                                                    x2="${colouredHullPoints[j][0]}" 
                                                    y2="${10 - colouredHullPoints[j][1]}"
                                                />`;
                }
            }
        }
        else if (hulls[i].level === 1) {
            if (hulls[i].points.length === 1) {
                //just a single point
                //do nothing I guess....as it is already highlighted
                console.log("A POINT");
                redLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`;
            }
            else if (hulls[i].points.length === 2) {
                //proper two points
                redLines.innerHTML += `<line class="spawnIn" x1="${hulls[i].points[0][0]}" 
                                                y1="${10 - hulls[i].points[0][1]}" 
                                                x2="${hulls[i].points[1][0]}" 
                                                y2="${10 - hulls[i].points[1][1]}"
                                        />`;
                console.log("A LINE");
                redLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10 - hulls[i].points[0][1]}" r="0.08" />`;
                redLines.innerHTML += `<circle cx="${hulls[i].points[1][0]}" cy="${10 - hulls[i].points[1][1]}" r="0.08" />`;

            }
            else if (hulls[i].points.length > 2) {
                console.log("collinear points detected. hence selecting the points forming the hull");
                // redLines.innerHTML += `<circle cx="${hulls[i].points[0][0]}" cy="${10-hulls[i].points[0][1]}" r="0.08" />`;
                // redLines.innerHTML += `<circle cx="${hulls[i].points[hulls[i].points.length-1][0]}" cy="${10-hulls[i].points[hulls[i].points.length-1][1]}" r="0.08" />`;
                //  redLines.innerHTML += `<line x1="${hulls[i].points[0][0]}" 
                //                             y1="${10-hulls[i].points[0][1]}" 
                //                             x2="${hulls[i].points[hulls[i].points.length-1][0]}" 
                //                             y2="${10-hulls[i].points[hulls[i].points.length-1][1]}"
                //                         />`;
                let colouredHullPoints = hulls[i].points;
                colouredHullPoints = reorderPolygonVertices(colouredHullPoints);
                for (let i = 0, j = colouredHullPoints.length - 1; i < colouredHullPoints.length; j = i++) {
                    redLines.innerHTML += `<circle cx="${colouredHullPoints[i][0]}" 
                                                    cy="${10 - colouredHullPoints[i][1]}" r="0.08" />`;

                    redLines.innerHTML += `<line class="spawnIn" x1="${colouredHullPoints[i][0]}" 
                                                    y1="${10 - colouredHullPoints[i][1]}" 
                                                    x2="${colouredHullPoints[j][0]}" 
                                                    y2="${10 - colouredHullPoints[j][1]}"
                                                />`;
                }
            }
        }
    }
}


grid.addEventListener("click", (e) => {

    if (divideFlag || conquerFlag) {
        return;
    }

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
    const radius = 0.2;
    //this poiont clicking is my logic of an invisible activation circle
    //rather than clicking inside the box, it expects users to normally click on the point.
    for (let x = 0; x <= 10 && !found; x++) {
        for (let y = 0; y <= 10 && !found; y++) {
            const dx = logicalX - x - 1;
            const dy = logicalY - (11 - y); // invert y back
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= radius) {
                togglePoint(x, y);
                found = true;
            }
        }
    }
    if (found === false) {
        showToast("Point not registered. Click closer to the intersection", "error");
    }
});
//////////////////codeforgraph


async function solveCoordinates() {
    let calledLevel = level;
    solveMode = true;
    while (!solveDivideFlag) {
        divideCoordinates();
        console.log("Called divideCoordinates in solve");
        // await sleep(500);
    }
    showToast("All the base-case convex hulls solved", "info");
    document.getElementById("conquerButton2").disabled = false;
    console.log("called level is", calledLevel);
    console.log("level - 1 is", level - 1);
    while (level - 1 > calledLevel) {
        // await sleep(500);
        console.log("value of level inside solvedCoord is", level);
        console.log("Called level is", calledLevel);
        if (solveConquerFlag)
            break;
        conquerCoordinates();
        console.log("Called conquerCoordinates in solve");
    }
    document.getElementById("solveButton2").disabled = true;
    // if (level - 1 <= calledLevel) {
    //     showDynamicTooltip(document.getElementById('conquerButton2'), "Clicking on conquer merges the hulls together", "top-right", 5000);
    // }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showDynamicTooltip(targetElement, message, arrowDirection = "left", duration = 5000) {

    if (activeTooltips.has(targetElement)) {
        const old = activeTooltips.get(targetElement);
        clearTimeout(old.timer); // if you store timer too
        old.element.remove();
        activeTooltips.delete(targetElement);
    }

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");

    const tooltipText = document.createElement("div");
    tooltipText.textContent = message;
    tooltip.appendChild(tooltipText);

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "→";
    closeBtn.classList.add("close-btn");
    tooltip.appendChild(closeBtn);

    const closeBtn2 = document.createElement("span");
    closeBtn2.textContent = "✕";
    closeBtn2.classList.add("close-btn2");
    tooltip.appendChild(closeBtn2);

    const closeBtn3 = document.createElement("span");
    closeBtn3.textContent = "←";
    closeBtn3.classList.add("close-btn3");
    tooltip.appendChild(closeBtn3);

    const arrow = document.createElement("div");
    arrow.classList.add("tooltip-arrow");
    tooltip.appendChild(arrow);

    document.body.appendChild(tooltip);

    // Positioning
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;



    // Adjust based on direction
    if (arrowDirection === "left") {
        tooltip.style.top = `${rect.top + scrollTop + 60}px`;
        tooltip.style.left = `${rect.left + scrollLeft + 1000}px`;

        arrow.style.top = "10px";
        arrow.style.left = "-10px";
        arrow.style.borderTop = "10px solid transparent";
        arrow.style.borderBottom = "10px solid transparent";
        arrow.style.borderRight = "10px solid #fefefe";
    }
    if (arrowDirection === "top-right") {
        tooltip.style.top = `${rect.top + scrollTop + 40}px`;
        tooltip.style.left = `${rect.left + scrollLeft - 20}px`;

        arrow.style.top = "-10px";
        arrow.style.left = "30px";

        arrow.style.borderBottom = "10px solid #fefefe";
        arrow.style.borderLeft = "10px solid transparent";
        arrow.style.borderRight = "10px solid transparent";
    }
    if (arrowDirection === "top-left") {
        tooltip.style.top = `${rect.top + scrollTop + 40}px`;
        tooltip.style.left = `${rect.left + scrollLeft - 100}px`;

        arrow.style.top = "-10px";
        arrow.style.left = "120px";

        arrow.style.borderBottom = "10px solid #fefefe";
        arrow.style.borderLeft = "10px solid transparent";
        arrow.style.borderRight = "10px solid transparent";
    }
    if (arrowDirection === "bottom") {
        tooltip.style.top = `${rect.top + scrollTop + 0}px`;
        tooltip.style.left = `${rect.left + scrollLeft + 100}px`;

        arrow.style.top = "68px";
        arrow.style.left = "40px";

        arrow.style.borderTop = "10px solid #fefefe";
        arrow.style.borderLeft = "10px solid transparent";
        arrow.style.borderRight = "10px solid transparent";
    }
    // More directions can be added here...

    // Auto remove
    // const timeout = setTimeout(() => {
    //     tooltip.remove();
    //     removeToolTip(targetElement);
    // }, duration);

    // activeTooltips.set(targetElement, { element: tooltip, timer: timeout });
    activeTooltips.set(targetElement, { element: tooltip });

    // Manual close
    closeBtn.addEventListener("click", () => {
        // clearTimeout(timeout);
        tooltip.remove();
        removeToolTip(targetElement);
        showTutorial();
    });

    closeBtn2.addEventListener("click", () => {
        // clearTimeout(timeout);
        removeToolTip(targetElement);
        tooltip.remove();
        tutorialToShow = 0;
        // endTutorial = true;
    })

    closeBtn3.addEventListener("click", () => {
        // clearTimeout(timeout);
        tooltip.remove();
        removeToolTip(targetElement);
        tutorialToShow -= 2; //this is because in showTutorial, there is a +1 by default for everything. 
        showTutorial();
    })
}

window.addEventListener("load", () => {
    // showTutorial();
    drawInvisiblePoints();
});

function drawInvisiblePoints() {
    const grid = document.getElementById("grid");
    const pointsLayer = document.getElementById("points");
    const points = [];
    for (let i = 0; i <= 10; i++) {
        for (let j = 0; j <= 10; j++) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

            circle.setAttribute('cx', i);
            circle.setAttribute('cy', j);
            circle.setAttribute('r', '0.09');
            circle.setAttribute("class", "invisible-circle");
            points.push({ i, j, circle });

            // circle.addEventListener("mouseenter", (e) => {
            //     circle.classList.remove("invisible-circle");
            //     circle.classList.add("white-circle");
            // });
            // circle.addEventListener("mouseleave", (e) => {
            //     circle.classList.remove("white-circle");
            //     circle.classList.add("invisible-circle");
            // })

            grid.appendChild(circle);
        }
    }
    grid.addEventListener("mousemove", (e) => {
        if (divideFlag || conquerFlag) return;

        const pt = grid.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPoint = pt.matrixTransform(grid.getScreenCTM().inverse());

        for (const p of points) {
            const dist = Math.hypot(p.i - svgPoint.x, p.j - svgPoint.y);
            if (dist <= 0.2) {
                p.circle.classList.remove("invisible-circle");
                p.circle.classList.add("white-circle");
            } else {
                p.circle.classList.remove("white-circle");
                p.circle.classList.add("invisible-circle");
            }
        }
    });
}

function removeToolTip(targetElement) {
    if (activeTooltips.has(targetElement)) {
        const old = activeTooltips.get(targetElement);
        clearTimeout(old.timer); // if you store timer too
        old.element.remove();
        activeTooltips.delete(targetElement);
    }
}


let tutorialData = [
    ["chgrid", "Click to add/remove points on the grid", "left"],
    ["divideButton2", "Split points into smaller partitions", "top-left"],
    ["conquerButton2", "Merge convex hulls of adjacent partitions", "top-right"],
    ["solveButton2", "Clicking on \'Solve\' before \'Divide\' instantly shows final convex hull", "top-right"],
    ["solveButton2", "Clicking on \'Solve\' after \'Divide\' shows convex hulls for current partitions", "top-right"],
    ["resetButton2", "Clear inputs and reset interface", "top-right"]
];
let tutorialToShow = 0;
async function showTutorial() {
    console.log("pixel 1");
    removeAllToolTips();
    console.log("pixel 2");
    if (tutorialToShow >= 7) {
        console.log("pixel 3");
        showToast("All tips shown. Click \'Guide Me!\' again to restart", "info");
        tutorialToShow = 0;
        console.log("pixel 4");
        return;
    }
    if (tutorialToShow < 0) {
        tutorialToShow = 0;
        return;
    }
    console.log("pixel 5");
    showDynamicTooltip(document.getElementById(`${tutorialData[tutorialToShow][0]}`), `${tutorialData[tutorialToShow][1]}`, `${tutorialData[tutorialToShow][2]}`, 5000);
    console.log("pixel 6");
    tutorialToShow++;
    console.log("pixel 7");
    if (endTutorial === true) {
        console.log("pixel 8");
        // removeAllToolTips();
        console.log("pixel 9");
        endTutorial = false;
        tutorialToShow = 0;
        console.log("pixel 10");
        return;
    }
    console.log("pixel 11");
}




function removeAllToolTips() {
    for (let i = 0; i < tutorialData.length; i++) {
        if (activeTooltips.has(document.getElementById(`${tutorialData[i][0]}`))) {
            const old = activeTooltips.get(document.getElementById(`${tutorialData[i][0]}`));
            // clearTimeout(old.timer); // if you store timer too
            old.element.remove();
            activeTooltips.delete(document.getElementById(`${tutorialData[i][0]}`));
        }
    }
}


const toast = document.getElementById("toast");
const toastLogModal = document.getElementById("toastLogModal");
const FAQsModal = document.getElementById("faqsModal");
const toastLogList = document.getElementById("toastLogList");
const FAQsList = document.getElementById("faqsList");

let toastTimer = null;
let currentToastType = "info";
let currentToastMessage = "";
const bell = document.getElementById("logsButton");
const FAQs = document.getElementById("FAQs");


// Open log when bell is clicked
bell.addEventListener("click", () => {
    toastLogModal.classList.remove("hidden");
    bell.classList.remove("new"); // remove red dot

});

FAQs.addEventListener("click", () => {
    FAQsModal.classList.remove("hidden");
    FAQs.classList.remove("new"); // remove red dot

});

// Show a toast and log it
function showToast(message, type = "info") {

    currentToastType = type;
    currentToastMessage = message;
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove("hidden");

    //reset peek stack after it has been expanded and colsed
    toast.innerHTML = `<div>${message}</div>`;
    const peeks = toastLogList.querySelectorAll("li");
    const maxPeeks = 0;
    for (let i = 0; i < Math.min(maxPeeks, peeks.length); i++) {
        const peek = document.createElement("div");
        peek.className = "toast-peek";
        peek.textContent = peeks[i].textContent;
        toast.appendChild(peek);
    }

    // Add to log
    const entry = document.createElement("li");
    entry.textContent = `[${type.toUpperCase()}] ${message}`;
    toastLogList.prepend(entry);

    // Auto-dismiss after 10s
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add("hidden");
        bell.classList.add("new");

    }, 8000);
}
function showFAQs() {
    FAQsList.textContent = "";

    const entry = document.createElement("li");
    entry.innerHTML = `<b>What is Convex Hull? </b><br>For any given point(s), its convex hull is the smallest set of points that encloses all the points forming a convex polygon. The image below shows the set of points and its convex hull. The red highlighted point is excluded from the convex hull as it lies on the line segment between the two endpoints and doesn't contribute to the boundary of the shape.`;
    const image = document.createElement("img");
    image.src = "./convex_hull.jpg";
    image.alt = "convex hull example";
    image.style.width = "500px";
    image.style.marginTop = "8px";
    FAQsList.appendChild(entry);
    FAQsList.appendChild(image);

    const entry2 = document.createElement("li");
    entry2.innerHTML += `<b>What is a convex polygon?</b><br>
    A convex polygon is a polygon where all interior angles are less than 180 degrees. This means all vertices point outwards and no interior angle “caves in”.`;
    FAQsList.appendChild(entry2);
    const image2 = document.createElement("img");
    image2.src = "./convex_concave.jpg";
    image2.alt = "convex and concave polygon example";
    image2.style.width = "400px";
    image2.style.marginTop = "8px";
    FAQsList.appendChild(image2);

    const entry3 = document.createElement("li");
    entry3.innerHTML += `<b>How is divide and conquer algorithm applied here?</b><br>
    The set of points are recursively divided into smaller partitions until each partition contains either one or two points (base case). For a single point, its convex hull is the point itself and for two points, it is the line joining the two points. These base cases are recursively merged creating larger convex hulls until the hull of the entire set of points is found out. `;
    FAQsList.appendChild(entry3);

    const entry6 = document.createElement("li");
    entry6.innerHTML += `<b>What are solid (& bright) and dotted (& dull) lines during execution?</b><br>
    Solid lines represent the currently active or in-focus partition line(s) and hull(s) while the dotted lines represent the old or inactive partition line(s) and hull(s).`;
    FAQsList.appendChild(entry6);

    const entry7 = document.createElement("li");
    entry7.innerHTML += `<b>What do different coloured lines mean?</b><br>
    The partition lines and the hulls are drawn with different colours to signify the levels in which these partitions were created.  
    <ul>
    <li style="color: red;">Level 0: red</li> 
    <li style="color: blue;">Level 1: blue</li>
    <li style="color: rgb(225, 225, 0);">Level 2: yellow </li>
    <li style="color: rgb(0,225,225);">Level 3: cyan </li>
    <li style="color: rgb(0,120,0);">Final solution: darkgreen </li>
    </ul>`;
    FAQsList.appendChild(entry7);

    const entry4 = document.createElement("li");
    entry4.innerHTML += `<b>What are the functions of different buttons?</b><br>
    Each button has a very specific purpose. Click on 'Guide me!' button to navigate and understand what each button does.`;
    FAQsList.appendChild(entry4);

    const entry5 = document.createElement("li");
    entry5.innerHTML += `<b>How to view old logs?</b><br>
    Click on the 'Logs' button at any point to view all the logs generated until then. `;
    FAQsList.appendChild(entry5);

}
// Expand log on toast click
toast.addEventListener("click", () => {
    toast.classList.add("hidden");
    toastLogModal.classList.remove("hidden");
    bell.classList.remove("new");
});

//close log from the main view but then still keep it until the timer ends
function closeToastLog() {
    toastLogModal.classList.add("hidden");
}

function closeFAQs() {
    FAQsModal.classList.add("hidden");
}

// document.getElementById('addButton2').addEventListener('click', inputCoordinates);
// document.getElementById('deleteButton2').addEventListener('click', deleteCoordinates);
document.getElementById('divideButton2').addEventListener('click', divideCoordinates);
document.getElementById('resetButton2').addEventListener('click', resetConvexHull);
document.getElementById('conquerButton2').addEventListener('click', conquerCoordinates);
document.getElementById('solveButton2').addEventListener('click', () => {
    removeAllToolTips();
    solveCoordinates();
});
// document.getElementById('conquerButton2').addEventListener('click', compareEndPoints);
document.getElementById("togglePanelBtn").addEventListener("click", () => {
    document.getElementById("sidePanel").classList.toggle("open");
});
document.getElementById('tutorialButton').addEventListener('click', () => {
    // tutorialState = !tutorialState;
    console.log("pixel before: tutorialtoshow", tutorialToShow);
    tutorialToShow = 0;
    showTutorial();
    // tutorialToShow = 0;
    console.log("pixel after: tutorialtoshow", tutorialToShow);
    endTutorial = false;
});
document.getElementById('FAQs').addEventListener('click', () => {
    showFAQs();
});

