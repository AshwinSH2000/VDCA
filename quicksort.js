// quicksort.js

let arrayList = [];
let pivots = [];
let level = 0;
let conquerFlag = false;
let solveDivideFlag = false;
let solveMode = false;
const activeTooltips = new Map();
let inputCounter = 0;
let endTutorial = false;


document.getElementById("divideButton").disabled = true;
document.getElementById("solveButton").disabled = true;
document.getElementById("conquerButton").disabled = true;


async function inputNumbers() {
    let negativeNumberFlag = false;
    const item = document.getElementById('array_number').value.trim();
    //console.log(typeof item);
    //const value = parseInt(item.value);

    if (item) {

        let temp = [];
        if (item.includes(" ") && item.includes(",")) {
            temp = item.split(",").map(Number);
            if (temp.includes(NaN)) {
                showToast("Please separate the numbers with all space or all commas. ", "error");
                return;
            }
        }
        else if (item.includes(" ")) {
            temp = item.split(/\s+/).map(Number);
        }
        else if (item.includes(",")) {
            temp = item.split(",").map(Number);

        }
        else if (!isNaN(item)) {
            temp = [item];
            // console.log("Came in here", "temp is", temp, "and item is", item);
        }
        else {
            // alert("Not a number!");
            showToast("Not a number", "error");
            return;
        }

        for (let i = 0; i < temp.length; i++) {
            negativeNumberFlag = false;
            let barheight = Number(temp[i]);
            if (barheight < 0) {
                showToast(`Negative number not allowed. Discarding entry`, "error");
                negativeNumberFlag = true;
                break;
            }
            console.log("Length of temp is", temp.length);
            arrayList.push(Number(temp[i]));
            console.log("Added:", temp[i], "Array:", arrayList);

            const bar = document.createElement('div');
            //bar.classList.add(`level-${level}`);

            //old aprch
            bar.classList.add('bar');

            //bar.style.height = `${Number(item)}px`;
            bar.style.height = `${barheight * 5}px`;
            bar.textContent = barheight;
            bar.accessKey = barheight;
            document.getElementById('bar-container').append(bar);
        }
        if (!negativeNumberFlag)
            showToast(`Inserted ${temp} into the array`, "info");
    }
    else {
        // alert("Enter a number!");
        showToast("Enter a number", "error");
        return;
    }
    document.getElementById("divideButton").disabled = false;
    document.getElementById("solveButton").disabled = false;
    document.getElementById('array_number').value = '';

    // if (inputCounter === 0) {
    //     showDynamicTooltip(document.getElementById("array_number"), "You can enter more numbers or click on Divide or Solve", "left", 10000);
    //     await sleep(1000);
    // }
    // if (inputCounter <= 2) {
    //     showDynamicTooltip(document.getElementById("divideButton"), "Divide performs level-wise partitions", "top-left", 10000);
    //     await sleep(1000);
    //     showDynamicTooltip(document.getElementById('solveButton'), "Clicking Solve before Divide displays the final sorted array", "top-right", 10000);
    // }
    inputCounter++;

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function deleteNumbers() {
    const item = document.getElementById('array_number').value.trim();
    if (item) {
        const index = arrayList.indexOf(Number(item));
        if (index !== -1) {
            arrayList.splice(index, 1);
            console.log("Removed:", item, "Array:", arrayList);
            const container = document.getElementById('bar-container').children;
            for (let i = 0; i < container.length; i++) {
                if (container[i].accessKey === item) {
                    document.getElementById('bar-container').removeChild(container[i]);
                    break;
                }
            }
            if (container.length === 0) {
                document.getElementById("solveButton").disabled = true;
                document.getElementById("divideButton").disabled = true;
            }
            showToast(`Deleted ${item} from the array`, "info");
        }
        else {
            console.log("number not found to delete");
            // alert("Number not found");
            showToast("Number not found", "error");

        }
    }
    else {
        // alert("Enter a number to delete");
        showToast("Enter a number to delete", "error");
    }
    //item.value = '';
    document.getElementById('array_number').value = '';
}


function divide2() {

    console.log("Level inside divide2 is", level);
    document.getElementById("addButton").disabled = true;
    document.getElementById("deleteButton").disabled = true;
    document.getElementById("array_number").disabled = true;

    console.log("----------------------------------------------");

    //let i=0;
    // if (level === arrayList.length - 1) {
    //     console.log("reached max levels...terminating");
    //     document.getElementById('divideButton').disabled = true;
    //     solveDivideFlag = true;
    //     // document.getElementById("conquerButton").disabled = true;
    //     return;
    // }
    // if (pivots.length > arrayList.length) {
    //     console.log("array is sorted...terminating");
    //     document.getElementById('divideButton').disabled = true;
    //     solveDivideFlag = true;
    //     // document.getElementById("conquerButton").disabled = true;
    //     return;
    // }

    let noOfPivots = Math.pow(2, level);
    let counter = 0;

    let pivotsForToast = [];
    while (counter < Math.min(noOfPivots, arrayList.length + 1)) {

        if (level == 0) {


            //adding gap to the first 
            let container = document.getElementById('bar-container');

            console.log("adding the leftAlignBar in level 0");
            //add the space only when it is not in conquer mode...it if its conquer, delete the space
            const leftAlignBar = document.createElement('div');
            leftAlignBar.setAttribute("id", "leftAlignBar");
            leftAlignBar.style.width = `${arrayList.length * 35 - 5}px`;
            leftAlignBar.style.height = "0px";
            container.appendChild(leftAlignBar);

            const bar2 = document.createElement('div');
            bar2.setAttribute("id", "bar2space");
            bar2.style.height = "0px";
            bar2.style.width = "60px";
            container.appendChild(bar2);


            document.getElementById('addButton').disabled = true;
            document.getElementById('deleteButton').disabled = true;

            pivots.push({ position: Number(-1), pivot: -1, level: -1 });         //this is the position of 
            pivots.push({ position: arrayList.length, pivot: -1, level: -1 });    //this is also the position of pivots. 
            console.log("I AM HERE!!!");
            console.log(pivots);


            //findPivot retuens the actual pivot for that part of the array
            let [tempPos, tempPivot] = findPivot(arrayList, pivots[counter].position + 1, pivots[counter + 1].position - 1);

            //call partition
            tempPos = partition(arrayList, pivots[counter].position + 1, pivots[counter + 1].position - 1, tempPos);
            pivotsForToast.push(` ${tempPivot}`);

            //store the position of the pivot for next rounds
            pivots.push({ position: tempPos, pivot: tempPivot, level: level });
            //pivots.sort();  commenting since have that statement at the end. 

            console.log("Currently at level 0");
            console.log("pivot is ", tempPivot);
            console.log("array after 1 partition is " + arrayList);
            console.log("the pivots list is (only positions): ", pivots);


        }
        else {
            if (pivots[counter].position === arrayList.length && pivots[counter].pivot === -1) {
                //this if case it to check if... in this level, is the counter accessing pivots 
                //beyond what it needs to access?
                //there can be pivots beyond this pivot but its for next level only. 
                break;
            }
            console.log("THE VALUE OF COUNTER IS " + counter);
            let [tempPos, tempPivot] = findPivot(arrayList, pivots[counter].position + 1, pivots[counter + 1].position - 1);

            //call partition
            tempPos = partition(arrayList, pivots[counter].position + 1, pivots[counter + 1].position - 1, tempPos);

            //push the pivot position only if is is not present in the array
            //if(!pivots.includes(arrayList.indexOf(tempPivot)))   this is the old code
            if (!pivots.some(p => p.position === tempPos && p.pivot === tempPivot)) {
                console.log("Since " + tempPos + " is not present, inserting it.");
                pivots.push({ position: tempPos, pivot: tempPivot, level: level });
            }

            console.log("Currently at level " + level + " iteration " + counter);
            console.log("pivot is ", tempPivot);
            console.log("array after 1 partition is ", arrayList);
            console.log("the pivots list is (only positions): ", pivots);
            console.log("---");
            pivotsForToast.push(` ${tempPivot}`);
            console.log("NOKIA pushed", tempPivot);

        }
        counter++;

    }
    console.log("NOKIA -----------------");
    console.log("The array is ", arrayList);
    if (pivotsForToast.length === 1) {
        showToast(`Using ${pivotsForToast} as pivot`);// at level ${level}`);
    } else {
        showToast(`Using ${pivotsForToast} as pivots`);// at level ${level}`, "info");
    }

    pivots.sort(((a, b) => a.position - b.position));
    console.log("Sorted pivot is ", pivots);

    if (solveMode && level >= calledLevel) {
        console.log("D2...Supposed to call visualise but not calling because of solvemode");
        console.log("D2...level is", level);
        console.log("D2...called level is", calledLevel);
    }
    else {
        console.log("D2...level is", level);
        console.log("D2...called level is", calledLevel);
        visualise();
    }

    level++;

    //the below code is to check if divide needs to be called again or not. 
    //I still have the code at the top... Now I dont think that is necessary anymore. Will remove after some testing. 
    console.log("Possible ending here? ", checkForEnding());
    if (checkForEnding() === true) {
        console.log("Array has only 1 element partition..hence stopping partitioning");
        document.getElementById('divideButton').disabled = true;
        solveDivideFlag = true;
        showToast("Divide phase complete", "success");
        let maxLevel = Math.max(...pivots.map(p => p.level));
        let uTurnArrow = document.getElementById(`arrow-container${maxLevel + 3}`);

        const bar2 = document.createElement('div');
        bar2.setAttribute("id", "uturnspace");
        bar2.classList.add("u-turn");
        bar2.style.height = "0px";
        bar2.style.width = "30px";
        bar2.style.backgroundColor = "red";

        uTurnArrow.appendChild(bar2);

        uTurnArrow.appendChild(bar2);
        return;

    }
    if (level === arrayList.length - 1) {
        console.log("reached max levels...terminating");
        document.getElementById('divideButton').disabled = true;
        solveDivideFlag = true;
        // if (solveMode === false)
        //     showDynamicTooltip(document.getElementById('solveButton'), "Solve shows the solution for the last partition created", "top-right", 10000);

        // document.getElementById("conquerButton").disabled = true;
        showToast("Divide phase complete", "success");
        let maxLevel = Math.max(...pivots.map(p => p.level));
        let uTurnArrow = document.getElementById(`arrow-container${maxLevel + 3}`);

        const bar2 = document.createElement('div');
        bar2.setAttribute("id", "uturnspace");
        bar2.classList.add("u-turn");
        bar2.style.height = "0px";
        bar2.style.width = "30px";
        bar2.style.backgroundColor = "red";

        uTurnArrow.appendChild(bar2);

        return;
    }
    if (pivots.length > arrayList.length) {
        console.log("array is sorted...terminating");
        document.getElementById('divideButton').disabled = true;
        solveDivideFlag = true;
        // if (solveMode === false)
        //     showDynamicTooltip(document.getElementById('solveButton'), "Solve shows the solution for the last partition created", "top-right", 10000);
        // document.getElementById("conquerButton").disabled = true;
        showToast("Divide phase complete", "success");
        let maxLevel = Math.max(...pivots.map(p => p.level));
        let uTurnArrow = document.getElementById(`arrow-container${maxLevel + 3}`);
        const bar2 = document.createElement('div');
        bar2.setAttribute("id", "uturnspace");
        bar2.classList.add("u-turn");
        bar2.style.height = "0px";
        bar2.style.width = "30px";
        bar2.style.backgroundColor = "red";

        uTurnArrow.appendChild(bar2);
        return;
    }
}

function partition(arr, low, high, pivot_loc) {

    //in this if case, here there is no i value, hence pivot's position will be same after partition
    if (low > high)
        return pivot_loc;
    let i = low - 1;
    let pivot_elem = arr[pivot_loc];
    console.log("Incoming pivot's location is", pivot_loc);
    //moving the pivot element to the end to that it is easier to swap it in the end
    [arr[pivot_loc], arr[high]] = [arr[high], arr[pivot_loc]];
    for (let j = low; j < high; ++j) {
        if (arr[j] <= pivot_elem) {
            ++i;
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    console.log("Outgoing pivot's location is", i + 1);
    console.log(arr);
    console.log("HERE, I+1 IS ............................................... ", i + 1);
    return Math.min(i + 1, arrayList.length);     //returning the pivot's new position after partitioning
}


/*
Returns the pivot element (not its position)
low and high are the actual starting and ending point of the subarray
*/
function findPivot(arr, low, high) {

    console.log("I CAME HERE BROOOOO");
    // if(low>high && high===-1){
    //     //this is a special case
    //     console.log("low>high && high===-1...so retuening lwo: "+arr[low]);
    //     console.log("the value of low is "+low);
    //     console.log("the value of high is "+high);
    //     return arr[low];
    // }
    // else 


    if (low > high && low === arrayList.length) {
        //most probably this will never be reached but verify the same
        console.log("low>high && high===arrayList.length...so returning high:");
        console.log("arr high is " + arr[high] + " and arr low is " + arr[low]);
        console.log("the value of low is " + low);
        console.log("the value of high is " + high);
        //thats because low can be 10 and high can be 9
        return [high, arr[high]];
    }
    else if (low > high) {
        console.log("low>high ...so returning high: " + arr[low]);
        console.log("arr high is " + arr[high] + " and arr low is " + arr[low]);
        console.log("the value of low is " + low);
        console.log("the value of high is " + high);
        //thats because low can be 0 and high can be -1
        return [low, arr[low]];
    }

    console.log("the value of low is " + low);
    console.log("the value of high is " + high);
    let first = arr[low];
    let last = arr[high];
    let mid = arr[Math.ceil((high - low) / 2) + low];
    // ((((high-low)%2)==0) ? (arr[ ((high-low)/2)+low ]) : (arr[ ((high-low+1)/2)+low ]));

    console.log("first elem=" + first);
    console.log("mid elem=" + mid);
    console.log("last elem=" + last);
    // console.log(typeof first, typeof mid, typeof last);
    let pivot = -1;
    let pos = -1;
    if (((first > mid) && (first < last)) ||
        ((first > last) && (first < mid))) {
        pivot = first;
        pos = low;
    }
    else if ((mid >= first && mid <= last) || (mid >= last && mid <= first)) {
        pivot = mid;
        pos = Math.ceil((high - low) / 2) + low;
    }
    else {
        pivot = last;
        pos = high;
    }
    console.log("Pivot=" + pivot);
    showToast(`The pivot element among ${first}, ${mid} and ${last} is ${pivot}`);
    return [pos, pivot];
}

function checkForEnding() {
    for (let i = 0; i < pivots.length - 1; i++) {
        if (pivots[i].position + 1 === pivots[i + 1].position)
            continue;
        if (pivots[i].position + 1 !== pivots[i + 1].position - 1) {
            return false;
        }
    }
    return true;
}

function visualiseOld() {
    for (let i = 0; i < arrayList.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        let barheight = Number(arrayList[i]);
        //bar.style.height = `${Number(item)}px`;
        bar.style.height = `${barheight * 5}px`;
        bar.textContent = barheight;
        document.getElementById(`bar-container${level + 2}`).appendChild(bar);
        // if (level==0)
        //     document.getElementById('bar-container2').appendChild(bar);
        // else if(level==1)
        //     document.getElementById('bar-container3').appendChild(bar);
        // else if(level==2)
        //     document.getElementById('bar-container4').appendChild(bar);
        // else if(level==3)
        //     document.getElementById('bar-container5').appendChild(bar);

    }
}

function visualise() {

    if (level < 0) {
        return;
    }

    let container = document.getElementById(`bar-container${level + 2}`);
    let continueArrow = document.getElementById(`arrow-container${level + 2}`);

    if (level === 0 && conquerFlag) {
        {
            container = document.getElementById('bar-container');
            continueArrow = document.getElementById('arrow-container');

            const bar = document.createElement('div');
            bar.setAttribute("id", "bar1space");
            bar.classList.add('bar');
            bar.style.height = "0px";
            // container.appendChild(bar);
            //since i am adding 60px in the divide phase itself I do not think I need this...
            //anyway this will be removed when i have two separate divs. 
            container.removeChild(container.querySelector("#leftAlignBar"));
        }
    }
    else if (conquerFlag) {
        //this is to create some space between the two
        container = document.getElementById(`bar-container${level + 1}`);
        continueArrow = document.getElementById(`arrow-container${level + 1}`);


        let leftAlignBar = container.querySelector("#leftAlignBar");
        console.log("container inside visualise is", container);
        console.log("leftalignbar is", leftAlignBar);
        if (leftAlignBar)
            container.removeChild(leftAlignBar);
        else
            console.log("Not present in this container");


        const bar = document.createElement('div');
        bar.setAttribute("id", "bar1space");
        bar.classList.add('bar');
        bar.style.height = "0px";

        // container.appendChild(bar);
        const arrowDiv = document.createElement('div');
        arrowDiv.setAttribute("id", "upArrow");
        arrowDiv.classList.add("up-arrow");
        continueArrow.appendChild(arrowDiv);
    }
    else {
        container = document.getElementById(`bar-container${level + 2}`);
        continueArrow = document.getElementById(`arrow-container${level + 2}`);
    }



    if (!container) {
        container = document.createElement('div');
        container.id = `bar-container${level + 2}`;
        console.log("Current level is", level, container.id);
        return;

    }
    let leftAlignBarWidth = 0;
    for (let i = 0; i < arrayList.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        let barheight = Number(arrayList[i]);
        bar.style.height = `${barheight * 5}px`;
        bar.textContent = barheight;
        leftAlignBarWidth += 35;


        // Check if this index is a pivot at this level
        const pivotData = pivots.find(p => p.position === i);
        if (pivotData) {
            bar.classList.add(`pivot-level-${pivotData.level}`);
            bar.style.marginLeft = '15px';
            bar.style.marginRight = '15px';
            leftAlignBarWidth += 30;
        }
        container.appendChild(bar);
    }

    //create and append a bar of similar width which needs to be deleted later
    if (!conquerFlag) {
        console.log("adding the leftAlignBar");
        //add the space only when it is not in conquer mode...it if its conquer, delete the space
        const leftAlignBar = document.createElement('div');
        leftAlignBar.setAttribute("id", "leftAlignBar");
        leftAlignBar.style.width = `${leftAlignBarWidth - 5}px`;
        leftAlignBar.style.height = "0px";
        // leftAlignBar.style.border = "1px solid black";
        container.appendChild(leftAlignBar);

        const bar2 = document.createElement('div');
        bar2.setAttribute("id", "bar2space");
        bar2.style.height = "15px";
        bar2.style.width = "60px";
        // bar2.style.border = "1px solid black";
        // bar2.style.backgroundColor = "red";
        container.appendChild(bar2);
        console.log("The continer is", container);

        //here i have to append the text, then both right?
        const arrowDiv = document.createElement('div');
        arrowDiv.setAttribute("id", "downArrow");
        arrowDiv.classList.add("down-arrow");
        continueArrow.appendChild(arrowDiv);
        const cloneBar2 = bar2.cloneNode(true);      //true means it will do deep clone (includes children)
        continueArrow.appendChild(cloneBar2);
        // continueArrow.appendChild(leftAlignBar);

    }
}

function resetQuickSort() {
    //this has many debugging statements. clear them
    console.log("reached reset");
    document.getElementById('addButton').disabled = false;
    document.getElementById('deleteButton').disabled = false;
    document.getElementById('divideButton').disabled = false;
    document.getElementById('conquerButton').disabled = false;
    console.log("enabled all the buttons");
    level = 0;
    pivots = [];
    arrayList = [];
    console.log("reset all the variables");
    for (let i = 2, flag = true; flag; i++) {
        flag = false;

        const container = document.getElementById(`bar-container${i}`);

        if (container) {
            container.innerHTML = '';
            flag = true;

        }
    }
    document.getElementById("bar-container").innerHTML = '';
    //console.clear();
    console.log("Reset the interface. Starting fresh!");
    location.reload();
}

async function conquer() {

    document.getElementById('solveButton').disabled = true;
    console.log("level is", level);
    if (level <= 0) {
        console.log("All partitions conquered. They array is sorted. ");
        document.getElementById('conquerButton').disabled = true;
        showToast("Sorted successfully!", "success");
    }
    conquerFlag = true;

    if (level >= 0) {

        if (solveMode && level !== calledLevel) {
            console.log("Supposed to call visualise but not calling because of solvemode");
            console.log("C2...level is", level);
            console.log("C2...called level is", calledLevel);
        }
        else {
            console.log("C2...level is", level);
            console.log("C2...called level is", calledLevel);
            visualise();
        }
        console.log("When I first cae onto conquer, the level is ", level);
        level--;

        //remove the maxlevel partitions from 
        let maxLevel = Math.max(...pivots.map(p => p.level));
        console.log("maxlevel deleted", maxLevel);
        let flag = true;
        let conquerForToast = [];
        while (flag) {
            flag = false;
            let delIndex = pivots.findIndex(p => p.level === maxLevel);
            console.log("deIndex is", delIndex);
            if (delIndex >= 0) {
                conquerForToast.push(` ${pivots[delIndex].pivot}`);
                pivots.splice(delIndex, 1);
                console.log("After deleting, pivots is", pivots);
                flag = true;
            }
        }
        if (level >= 0)
            showToast(`Partitions across ${conquerForToast} sorted`, "info");
    }
}


let calledLevel = -10;
function solve1() {
    document.getElementById("conquerButton").disabled = false;
    solveMode = true;
    calledLevel = level;
    while (!solveDivideFlag) {
        console.log("Called divide inside solve");
        divide2();
    }
    while (level >= calledLevel) {
        console.log("Called conquer in solve");
        conquer();
    }
    document.getElementById("solveButton").disabled = true;
    solveMode = false;

}

function showDynamicTooltip(targetElement, message, arrowDirection = "left", duration = 5000) {

    if (activeTooltips.has(targetElement)) {
        const old = activeTooltips.get(targetElement);
        // clearTimeout(old.timer); // if you store timer too
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
        tooltip.style.top = `${rect.top + scrollTop - 10}px`;
        tooltip.style.left = `${rect.right + scrollLeft + 10}px`;

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
    if (arrowDirection === "right") {
        tooltip.style.top = `${rect.top + scrollTop - 20}px`;
        tooltip.style.left = `${rect.left + scrollLeft - 240}px`;

        arrow.style.top = "20px";
        arrow.style.left = "2px";

        arrow.style.borderTop = "10px solid transparent";
        arrow.style.borderLeft = "10px solid #fefefe";
        arrow.style.borderBottom = "10px solid transparent";
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
    // showDynamicTooltip(document.getElementById("array_number"), "Enter comma/space separated numbers and click Insert.", "left");
    showToast("Click on FAQs button to know more about quicksort.", "first");
});

function removeToolTip(targetElement) {
    if (activeTooltips.has(targetElement)) {
        const old = activeTooltips.get(targetElement);
        //clearTimeout(old.timer); // if you store timer too
        old.element.remove();
        activeTooltips.delete(targetElement);
    }
}

const toast = document.getElementById("toast");
const toastLogModal = document.getElementById("toastLogModal");
const toastLogList = document.getElementById("toastLogList");
let toastTimer = null;
let currentToastType = "info";
let currentToastMessage = "";
const bell = document.getElementById("logsButton");
const FAQsModal = document.getElementById("faqsModal");
const FAQsList = document.getElementById("faqsList");
const FAQs = document.getElementById("FAQs");



// Open log when bell is clicked
bell.addEventListener("click", () => {
    toastLogModal.classList.remove("hidden");
    bell.classList.remove("new"); // remove red dot

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

    if (type !== "first") {
        // Add to log
        const entry = document.createElement("li");
        entry.textContent = `[${type.toUpperCase()}] ${message}`;
        toastLogList.prepend(entry);
    }
    // Auto-dismiss after 10s
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add("hidden");
        bell.classList.add("new");

    }, 8000);
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


    // toast.textContent = currentToastMessage;
    // toast.className = `toast ${currentToastType}`;
    // toast.classList.remove("hidden");

    // rebuild peek stack. since the function just calls for each toast build, it needs to be rebuilt again!
    // toast.innerHTML = `<div>${currentToastMessage}</div>`;
    // const peeks = toastLogList.querySelectorAll("li");
    // const maxPeeks = 0; //0 means no peeks possible;it will just display the current log and nothing else. 
    // for (let i = 0; i < Math.min(maxPeeks, peeks.length); i++) {
    //     const peek = document.createElement("div");
    //     peek.className = "toast-peek";
    //     peek.textContent = peeks[i].textContent;
    //     toast.appendChild(peek);
    // }
}


// async function showTutorial2() {

//     /*
//     logic: 
//     if activetool tips still has the above thing, then wait for 1 more secind. do it until 5 secinds are over. 
//     if active tool tips does not have it then end the sleep timer and move forward. 
//     */
//     // let sleepTimer = 0;


//     sleepTimer = 0;
//     showDynamicTooltip(document.getElementById("array_number"), "Enter numbers (comma or space separated)", "left");

//     while (sleepTimer <= 5000) {
//         if (activeTooltips.has(document.getElementById("array_number"))) {
//             if (endTutorial === true) {
//                 removeToolTip(document.getElementById("array_number"));
//                 endTutorial = false;
//                 return;
//             }

//             sleepTimer += 100;
//             await sleep(100);
//         }
//         else {
//             break;
//         }
//     }

//     sleepTimer = 0;
//     showDynamicTooltip(document.getElementById("addButton"), "Add numbers to array", "left");

//     while (sleepTimer <= 5000) {
//         if (activeTooltips.has(document.getElementById("addButton"))) {
//             if (endTutorial === true) {
//                 removeToolTip(document.getElementById("addButton"));
//                 endTutorial = false;
//                 return;
//             }

//             sleepTimer += 100;
//             await sleep(100);
//         }
//         else {
//             break;
//         }
//     }

//     sleepTimer = 0;
//     showDynamicTooltip(document.getElementById("deleteButton"), "Remove matching numbers from array", "left");

//     while (sleepTimer <= 5000) {
//         if (activeTooltips.has(document.getElementById("deleteButton"))) {
//             if (endTutorial === true) {
//                 removeToolTip(document.getElementById("deleteButton"));
//                 endTutorial = false;
//                 return;
//             }
//             sleepTimer += 100;
//             await sleep(100);
//         }
//         else {
//             break;
//         }
//     }



//     sleepTimer = 0;
//     showDynamicTooltip(document.getElementById("divideButton"), "Split array into partitions (level-wise)", "top-left", 5000);
//     while (sleepTimer <= 5000) {
//         if (activeTooltips.has(document.getElementById("divideButton"))) {
//             if (endTutorial === true) {
//                 removeToolTip(document.getElementById("divideButton"));
//                 endTutorial = false;
//                 return;
//             }
//             sleepTimer += 100;
//             await sleep(100);
//         }
//         else {
//             break;
//         }
//     }

//     sleepTimer = 0;
//     showDynamicTooltip(document.getElementById('conquerButton'), "Perform level-wise merge of the array", "top-right", 5000);
//     while (sleepTimer <= 5000) {
//         if (activeTooltips.has(document.getElementById("conquerButton"))) {
//             if (endTutorial === true) {
//                 removeToolTip(document.getElementById("conquerButton"));
//                 endTutorial = false;
//                 return;
//             }
//             sleepTimer += 100;
//             await sleep(100);
//         }
//         else {
//             break;
//         }
//     }
//     sleepTimer = 0;
//     showDynamicTooltip(document.getElementById('solveButton'), "Clicking \'Solve\' before \'Divide\' instantly shows sorted array", "top-right", 5000);
//     while (sleepTimer <= 5000) {
//         if (activeTooltips.has(document.getElementById("solveButton"))) {
//             if (endTutorial === true) {
//                 removeToolTip(document.getElementById("solveButton"));
//                 endTutorial = false;
//                 return;
//             }
//             sleepTimer += 100;
//             await sleep(100);
//         }
//         else {
//             break;
//         }
//     }

//     sleepTimer = 0;
//     showDynamicTooltip(document.getElementById('solveButton'), "Clicking \'Solve\' after \'Divide\' shows solution for current partitions", "top-right", 5000);
//     while (sleepTimer <= 5000) {
//         if (activeTooltips.has(document.getElementById("solveButton"))) {
//             if (endTutorial === true) {
//                 removeToolTip(document.getElementById("solveButton"));
//                 endTutorial = false;
//                 return;
//             }
//             sleepTimer += 100;
//             await sleep(100);
//         }
//         else {
//             break;
//         }
//     }

//     sleepTimer = 0;
//     showDynamicTooltip(document.getElementById('resetButton'), "Clear array and reset interface", "top-right", 5000);
//     while (sleepTimer <= 5000) {
//         if (activeTooltips.has(document.getElementById("resetButton"))) {
//             if (endTutorial === true) {
//                 removeToolTip(document.getElementById("resetButton"));
//                 endTutorial = false;
//                 return;
//             }
//             sleepTimer += 100;
//             await sleep(100);
//         }
//         else {
//             break;
//         }
//     }


// }
let tutorialData = [
    ["array_number", "Enter numbers (comma or space separated)", "left"],
    ["addButton", "Add numbers to array", "left"],
    ["deleteButton", "Remove matching numbers from array", "left"],
    ["divideButton", "Split array into partitions (level-wise)", "top-left"],
    ["conquerButton", "Perform level-wise merge of the array", "top-right"],
    ["solveButton", "Clicking \'Solve\' before \'Divide\' instantly shows sorted array", "top-right"],
    ["solveButton", "Clicking \'Solve\' after \'Divide\' shows solution for current partitions", "top-right"],
    ["resetButton", "Clear array and reset interface", "top-right"]
];
let tutorialToShow = 0;

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

async function showTutorial() {

    console.log("pixel 1");
    removeAllToolTips();
    console.log("pixel 2");
    if (tutorialToShow >= 8) {
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

function showFAQs() {
    FAQsList.textContent = "";

    const entry = document.createElement("li");
    entry.innerHTML = `<b>What is quicksort?</b><br>It is an efficient sorting algorithm. It has a best and average time complexity of O(n logn) and in the worst case, it can degrade to O(n^2). `;
    FAQsList.appendChild(entry);

    const entry2 = document.createElement("li");
    entry2.innerHTML += `<b>How is divide and conquer algorithm applied here?</b><br>
    The array of numbers is divided into smaller sub arrays by choosing a pivot element. The subarrays are conquered by placing the pivot in its correct position and rearranging the array such that all elements smaller than the pivot is placed in its left subarray and all elements larger are placed in its right subarray. New pivots are chosen in each of the subarrays and the process is recursively repeated until all the elements are in their correct position. `;
    FAQsList.appendChild(entry2);

    const entry3 = document.createElement("li");
    entry3.innerHTML += `<b>How is the pivot chosen? </b><br>
    The usual methods include choosing the first/last/middle element as the pivots but in this visualisation, it is chosen by “median of 3”. In this method, the median of the first, middle and last elements is chosen as pivot. For example: if we have 6,1,5,2,4,3,7 as the array, the initial pivot element would be 6. How? The first, middle and last elements are 6, 2 and 7 respectively. On sorting them, we obtains 2, 6, 7 whose median is 6. `;
    FAQsList.appendChild(entry3);

    const entry4 = document.createElement("li");
    entry4.innerHTML += `<b>Why are some bars coloured?</b><br>
    The coloured bars represent pivots and are also placed with more gap compared to normal grey bars. The colours signify the level in which these partitions were made. 
    <ul>
    <li style="color: red;">Level 0: red</li> 
    <li style="color: blue;">Level 1: blue</li>
    <li style="color: green;">Level 2: green </li>
    <li style="color: orange;">Level 3: orange </li>
    <li style="color: brown;">Level 4: brown </li>
    <li style="color: violet;">Level 5: violet </li>
    <li style="color: rgb(133, 197, 36);">Level 6: greenyellow </li>
    </ul>`;
    FAQsList.appendChild(entry4);

    const entry7 = document.createElement("li");
    entry7.innerHTML += `<b>As the levels increase, why do some bars disappear?</b><br>
    When dealing with larger inputs, the display area might not be sufficient to show every bar. However, all bars are present and can be viewed by scrolling each individual row. You may try giving a smaller input to view the complete sorting procedure. <br> For example, 16 12 8 4 3 2 1 or 12 5 4 9 6 15 7`;
    FAQsList.appendChild(entry7);

    const entry8 = document.createElement("li");
    entry8.innerHTML += `<b>Why are some buttons disabled at times?</b><br>
    At certain point of time, the usage of some buttons are not permitted. Hence to prevent the user from clicking on it inadvertently, it will be disabled. Depending upon the situation, it can get enabled again.`;
    FAQsList.appendChild(entry8);

    const entry5 = document.createElement("li");
    entry5.innerHTML += `<b>What are the functions of different buttons?</b><br>
    Each button has a very specific purpose. Click on 'Guide me!' button to navigate and understand what each button does.`;
    FAQsList.appendChild(entry5);

    const entry6 = document.createElement("li");
    entry6.innerHTML += `<b>How to view old logs?</b><br>
    Click on the 'Logs' button at any point to view all the logs generated until then. `;
    FAQsList.appendChild(entry6);
}

FAQs.addEventListener("click", () => {
    FAQsModal.classList.remove("hidden");
    FAQs.classList.remove("new"); // remove red dot

});
function closeFAQs() {
    FAQsModal.classList.add("hidden");
}

document.getElementById("togglePanelBtn").addEventListener("click", () => {
    document.getElementById("sidePanel").classList.toggle("open");
});
document.getElementById('addButton').addEventListener('click', inputNumbers);
document.getElementById('deleteButton').addEventListener('click', deleteNumbers);
document.getElementById('divideButton').addEventListener('click', divide2);
document.getElementById('conquerButton').addEventListener('click', conquer);
document.getElementById('resetButton').addEventListener('click', resetQuickSort);
document.getElementById('solveButton').addEventListener('click', () => {
    //empty the entire activetooltips
    removeAllToolTips();
    console.log("Activetooltips", activeTooltips);
    solve1();
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

// Add event listener to close the FAQ modal when clicking outside its content
FAQsModal.addEventListener('click', function (event) {
    // Check if the click target is exactly the modal backdrop itself
    // (i.e., not a child element within the modal's content)
    if (event.target === FAQsModal) {
        closeFAQs();
    }
});
var textBox = document.getElementById("array_number");
textBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addButton").click();
    }
});