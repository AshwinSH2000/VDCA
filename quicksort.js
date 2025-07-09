//alert("JavaScript is loaded!"); //this generates a popup as soon as the page is loaded

let arrayList = [];
let pivots = [];
let level = 0;
let conquerFlag = false;
let solveDivideFlag = false;
let solveMode = false;
const activeTooltips = new Map();
let inputCounter = 0;

document.getElementById("divideButton").disabled = true;
document.getElementById("solveButton").disabled = true;
document.getElementById("conquerButton").disabled = true;


async function inputNumbers() {

    const item = document.getElementById('array_number').value.trim();
    //console.log(typeof item);
    //const value = parseInt(item.value);

    if (item) {

        let temp = [];
        if (item.includes(" ") && item.includes(",")) {
            alert("Be consistent. Separate the numbers with all space or all commas. Do not mix them.");
            return;
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
            alert("Not a number!");
            return;
        }

        for (let i = 0; i < temp.length; i++) {
            console.log("Length of temp is", temp.length);
            arrayList.push(Number(temp[i]));
            console.log("Added:", temp[i], "Array:", arrayList);

            const bar = document.createElement('div');
            //bar.classList.add(`level-${level}`);

            //old aprch
            bar.classList.add('bar');

            let barheight = Number(temp[i]);
            //bar.style.height = `${Number(item)}px`;
            bar.style.height = `${barheight * 5}px`;
            bar.textContent = barheight;
            bar.accessKey = barheight;
            document.getElementById('bar-container').append(bar);
        }
    }
    else {
        alert("Enter a number!");
        return;
    }
    document.getElementById("divideButton").disabled = false;
    document.getElementById("solveButton").disabled = false;
    document.getElementById('array_number').value = '';

    if (inputCounter === 0) {
        showDynamicTooltip(document.getElementById("array_number"), "You can enter more numbers or click on Divide or Solve", "left", 10000);
        await sleep(2000);
    }
    if (inputCounter <= 2) {
        showDynamicTooltip(document.getElementById("divideButton"), "Divide performs level-wise partitions", "top-left", 10000);
        await sleep(1000);
        showDynamicTooltip(document.getElementById('solveButton'), "Clicking Solve before Divide displays the final sorted array", "top-right", 10000);
    }
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
        }
        else {
            console.log("number not found to delete");
            alert("Number not found");
        }
    }
    else {
        alert("Enter a number to delete");
    }
    //item.value = '';
    document.getElementById('array_number').value = '';
}

// function divide() {

//     let map = new Map();
//     map.set(3, "ash");
//     map.set(2, "win");

//     for (let [key, value] of map.entries()) {
//         console.log(`Key: ${key}, Type: ${typeof key}`);
//     }
//     console.log(map);
//     map.
//         console.log(map);
//     //return;

//     if (level == 0) {
//         //this is the first "divide" operation. 
//         let pivot = findPivot(arrayList, 0, arrayList.length - 1);
//         // console.log("IN DIVIDE... PIVOT IS "+pivot);
//         pivots.push(pivot);
//         partition(arrayList, 0, arrayList.length - 1, arrayList.indexOf(pivot));
//         visualise();
//         level++;
//     }
//     else if (level == 1) {
//         let pivot1 = findPivot(arrayList, 0, arrayList.indexOf(pivots[level - 1]) - 1);
//         let pivot2 = findPivot(arrayList, arrayList.indexOf(pivots[level - 1]) + 1, arrayList.length - 1);
//         pivots.push(pivot1);
//         pivots.push(pivot2);

//         partition(arrayList, 0, arrayList.indexOf(pivots[level - 1]) - 1, arrayList.indexOf(pivot1));
//         partition(arrayList, arrayList.indexOf(pivots[level - 1]) + 1, arrayList.length - 1, arrayList.indexOf(pivot2))

//         visualise();
//         console.log("displayed stuff once");
//         level++;
//     }
//     else if (level == 2) {

//         console.log("going for the third divide");
//         visualise();
//         level++;
//     }
// }
function divide2() {

    console.log("Level inside divide2 is", level);
    document.getElementById("addButton").disabled = true;
    document.getElementById("deleteButton").disabled = true;

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

    while (counter < Math.min(noOfPivots, arrayList.length + 1)) {       //is +1 necessary?

        if (level == 0) {

            /*
            temporary code begins...replace this with two separate divs
            one for the divide phase and one for hte conquer phase. 
            */

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

            /*
            temporary code ends...replace this with two separate divs
            one for the divide phase and one for hte conquer phase. 
            */


            document.getElementById('addButton').disabled = true;
            document.getElementById('deleteButton').disabled = true;

            pivots.push({ position: Number(-1), pivot: -1, level: -1 });         //this is the position of 
            pivots.push({ position: arrayList.length, pivot: -1, level: -1 });    //this is also the position of pivots. 
            console.log("I AM HERE!!!");
            console.log(pivots);

            //test code
            // console.log(pivots.some(p => p.position===-1 && p.pivot===-1));
            // console.log(pivots.some(p => p.position===-1 && p.pivot===-2));
            // console.log(pivots.some(p => p.position===-2 && p.pivot===-1));
            // return;

            //findPivot retuens the actual pivot for that part of the array
            let [tempPos, tempPivot] = findPivot(arrayList, pivots[counter].position + 1, pivots[counter + 1].position - 1);

            //call partition
            tempPos = partition(arrayList, pivots[counter].position + 1, pivots[counter + 1].position - 1, tempPos);

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
                console.log("wait what happened?");
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
        }
        counter++;

    }
    console.log("The array is ", arrayList);
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
    if (level === arrayList.length - 1) {
        console.log("reached max levels...terminating");
        document.getElementById('divideButton').disabled = true;
        solveDivideFlag = true;
        if (solveMode === false)
            showDynamicTooltip(document.getElementById('solveButton'), "Solve shows the solution for the last partition created", "top-right", 10000);

        // document.getElementById("conquerButton").disabled = true;
        showToast("Divide phase complete", "info");
        return;
    }
    if (pivots.length > arrayList.length) {
        console.log("array is sorted...terminating");
        document.getElementById('divideButton').disabled = true;
        solveDivideFlag = true;
        if (solveMode === false)
            showDynamicTooltip(document.getElementById('solveButton'), "Solve shows the solution for the last partition created", "top-right", 10000);
        // document.getElementById("conquerButton").disabled = true;
        showToast("Divide phase complete", "info");
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
    return [pos, pivot];
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
    // Clear all containers
    // for (let i = 2; i <= 5; i++) {
    //     document.getElementById(`bar-container${i}`).innerHTML = '';
    // }
    if (level < 0) {
        return;
    }

    let container = document.getElementById(`bar-container${level + 2}`);

    if (level === 0 && conquerFlag) {
        {
            container = document.getElementById('bar-container');

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
    }
    else
        container = document.getElementById(`bar-container${level + 2}`);


    if (!container) {
        console.log("afnaioenjfavliejaf\naufhnvaliefhvabih\naiufybaieufybavaufha\nawkunerca");
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
        container.appendChild(leftAlignBar);

        const bar2 = document.createElement('div');
        bar2.setAttribute("id", "bar2space");
        bar2.style.height = "0px";
        bar2.style.width = "60px";
        container.appendChild(bar2);

    }

    // const container = document.getElementById('bar-container');
    // container.innerHTML = ''; // Clear previous bars

    // for (let i = 0; i < arrayList.length; i++) {
    //     const bar = document.createElement('div');
    //     bar.classList.add('bar');

    //     let barHeight = Number(arrayList[i]);
    //     bar.style.height = `${barHeight * 5}px`;
    //     bar.textContent = barHeight;

    //     const isPivot = pivots.some(p => p.position === i && p.pivot === arrayList[i]);
    //     if (isPivot) {
    //         bar.classList.add('bg-red-500'); // Pivot style
    //         bar.style.marginLeft = '12px'; // Separation from left partition
    //         bar.style.marginRight = '12px'; // Separation from right partition
    //     } else {
    //         bar.classList.add('bg-blue-500'); // Normal style
    //     }

    //     container.appendChild(bar);
    // }
}

// function visualise(level) {
//     let container = document.getElementById(`bar-container-level-${level}`);

//     // If container doesn't exist yet, create it
//     if (!container) {
//         container = document.createElement('div');
//         container.id = `bar-container-level-${level}`;
//         // container.className = 'flex gap-2 mb-4 flex-wrap';
//         container.className = 'flex flex-row gap-2 flex-wrap';
//         document.getElementById('bar-wrapper').appendChild(container); // Wrap all bar-containers in one parent
//     }

//     // Create the bar group
//     const barGroup = document.createElement('div');
//     // barGroup.className = 'flex gap-2';
//     barGroup.className = 'flex flex-row gap-2';

//     for (let i = 0; i < arrayList.length; i++) {
//         const bar = document.createElement('div');
//         bar.classList.add('bar');

//         let barHeight = Number(arrayList[i]);
//         bar.style.height = `${barHeight * 5}px`;
//         bar.textContent = barHeight;

//         const isPivot = pivots.some(p => p.position === i && p.pivot === arrayList[i]);
//         if (isPivot) {
//             bar.classList.add('bg-red-500');
//             bar.style.marginLeft = '12px';
//             bar.style.marginRight = '12px';
//             bar.style.width = '30px';
//         } else {
//             bar.classList.add('bg-blue-500');
//         }

//         barGroup.appendChild(bar);
//     }

//     container.appendChild(barGroup); // Append barGroup to this level's container
// }


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
}

async function conquer() {

    document.getElementById('solveButton').disabled = true;
    console.log("level is", level);
    if (level <= 0) {
        console.log("All partitions conquered. They array is sorted. ");
        document.getElementById('conquerButton').disabled = true;
        showToast("Sorted successfully!", "success");
        // await sleep(1000);
        // showToast("Please enter numbers!", "error");
        // await sleep(1000);   //this cased some async issues when testing. it made the normal solve mode go into infinite loop.

        // document.getElementById('solveButton').disabled = true;
        // return;
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
        while (flag) {
            flag = false;
            let delIndex = pivots.findIndex(p => p.level === maxLevel);
            console.log("deIndex is", delIndex);
            if (delIndex >= 0) {
                pivots.splice(delIndex, 1);
                console.log("After deleting, pivots is", pivots);
                flag = true;
            }
        }

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
    if (level >= 0) {
        showDynamicTooltip(document.getElementById('conquerButton'), "Clicking on conquer merges the array together", "top-right", 10000);
    }

}

function showDynamicTooltip(targetElement, message, arrowDirection = "left", duration = 10000) {

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
    closeBtn.textContent = "✕";
    closeBtn.classList.add("close-btn");
    tooltip.appendChild(closeBtn);

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
    // More directions can be added here...

    // Auto remove
    const timeout = setTimeout(() => {
        tooltip.remove();
    }, duration);

    // Manual close
    closeBtn.addEventListener("click", () => {
        clearTimeout(timeout);
        tooltip.remove();
    });

    activeTooltips.set(targetElement, { element: tooltip, timer: timeout });

}

window.addEventListener("load", () => {
    showDynamicTooltip(document.getElementById("array_number"), "Enter comma/space separated numbers and click Insert.", "left");
});

function removeAllToolTips() {
    if (activeTooltips.has(document.getElementById('solveButton'))) {
        const old = activeTooltips.get(document.getElementById('solveButton'));
        clearTimeout(old.timer); // if you store timer too
        old.element.remove();
        activeTooltips.delete(document.getElementById('solveButton'));
    }

    if (activeTooltips.has(document.getElementById('array_number'))) {
        const old = activeTooltips.get(document.getElementById('array_number'));
        clearTimeout(old.timer); // if you store timer too
        old.element.remove();
        activeTooltips.delete(document.getElementById('array_number'));
    }

    if (activeTooltips.has(document.getElementById('divideButton'))) {
        const old = activeTooltips.get(document.getElementById('divideButton'));
        clearTimeout(old.timer); // if you store timer too
        old.element.remove();
        activeTooltips.delete(document.getElementById('divideButton'));
    }
}

const toast = document.getElementById("toast");
const toastLogModal = document.getElementById("toastLogModal");
const toastLogList = document.getElementById("toastLogList");
let toastTimer = null;
let currentToastType = "info";
let currentToastMessage = "";

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
    const maxPeeks = 2;
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
    }, 10000);
}

// Expand log on toast click
toast.addEventListener("click", () => {
    toast.classList.add("hidden");
    toastLogModal.classList.remove("hidden");
});

//close log from the main view but then still keep it until the timer ends
function closeToastLog() {
    toastLogModal.classList.add("hidden");


    toast.textContent = currentToastMessage;
    toast.className = `toast ${currentToastType}`;
    toast.classList.remove("hidden");

    // rebuild peek stack. since the function just calls for each toast build, it needs to be rebuilt again!
    toast.innerHTML = `<div>${currentToastMessage}</div>`;
    const peeks = toastLogList.querySelectorAll("li");
    const maxPeeks = 2;
    for (let i = 0; i < Math.min(maxPeeks, peeks.length); i++) {
        const peek = document.createElement("div");
        peek.className = "toast-peek";
        peek.textContent = peeks[i].textContent;
        toast.appendChild(peek);
    }
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