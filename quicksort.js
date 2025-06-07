//alert("JavaScript is loaded!"); //this generates a popup as soon as the page is loaded

const arrayList = [];
let pivots = [];
let level = 0;

function inputNumbers(){
    const item = document.getElementById('array_number').value.trim();
    //console.log(typeof item);
    //const value = parseInt(item.value);
    
    if(item){
        arrayList.push(Number(item));
        console.log("Added:", item, "Array:", arrayList);

        const bar = document.createElement('div');
        bar.classList.add('bar');
        let barheight = Number(item);
        //bar.style.height = `${Number(item)}px`;
        bar.style.height = `${barheight*5}px`;
        bar.textContent = barheight;
        bar.accessKey = barheight;
        document.getElementById('bar-container').append(bar);
    }
    else{
        alert("Enter a number!");
    }
    document.getElementById('array_number').value = '';
}

function deleteNumbers(){
    const item = document.getElementById('array_number').value.trim();
    if(item){
        const index = arrayList.indexOf(Number(item));
        if(index !== -1){
            arrayList.splice(index, 1);
            console.log("Removed:", item, "Array:", arrayList);

            const container = document.getElementById('bar-container').children;
            for(let i=0 ; i<container.length ; i++){
                if (container[i].accessKey === item){
                    document.getElementById('bar-container').removeChild(container[i]);
                    break;
                }
            }
        }
        else{
            console.log("number not found to delete")
        }
    }
    //item.value = '';
    document.getElementById('array_number').value='';
}

function divide(){

    let map = new Map();
map.set(3, "ash");
map.set(2, "win");

for (let [key, value] of map.entries()) {
  console.log(`Key: ${key}, Type: ${typeof key}`);
}
    console.log(map);
    map.
    console.log(map);
    //return;

    if(level==0)
    {
        //this is the first "divide" operation. 
        let pivot=findPivot(arrayList, 0, arrayList.length-1);
        // console.log("IN DIVIDE... PIVOT IS "+pivot);
        pivots.push(pivot);
        partition(arrayList, 0, arrayList.length-1, arrayList.indexOf(pivot));
        visualise();
        level++;
    }
    else if(level==1){
        let pivot1=findPivot(arrayList, 0, arrayList.indexOf(pivots[level-1])-1);
        let pivot2=findPivot(arrayList, arrayList.indexOf(pivots[level-1])+1, arrayList.length-1);
        pivots.push(pivot1);
        pivots.push(pivot2);
     
        partition(arrayList, 0, arrayList.indexOf(pivots[level-1])-1, arrayList.indexOf(pivot1));
        partition(arrayList, arrayList.indexOf(pivots[level-1])+1, arrayList.length-1, arrayList.indexOf(pivot2))

        visualise();
        console.log("displayed stuff once");
        level++;
    }
    else if(level==2){
        
        console.log("going for the third divide");
        visualise();
        level++;
    }
}
function divide2(){

    console.log("----------------------------------------------");

    //let i=0;
    if (level===arrayList.length-1){
        console.log("reached max levels...terminating");
        return;
    }
    if(pivots.length>arrayList.length){
        console.log("array is sorted...terminating");
        return;
    }

    let noOfPivots = Math.pow(2,level);     
    let counter=0;

    while (counter<Math.min(noOfPivots, arrayList.length+1)){       //is +1 necessary?

        if(level==0){
            
            pivots.push({ position: Number(-1), pivot: Number(-1)} );         //this is the position of 
            pivots.push( {position: arrayList.length, pivot: -1});    //this is also the position of pivots. 
            console.log("I AM HERE!!!");
            console.log(pivots);

            //test code
            // console.log(pivots.some(p => p.position===-1 && p.pivot===-1));
            // console.log(pivots.some(p => p.position===-1 && p.pivot===-2));
            // console.log(pivots.some(p => p.position===-2 && p.pivot===-1));
            // return;
            
            //findPivot retuens the actual pivot for that part of the array
            let [tempPos, tempPivot] = findPivot(arrayList, pivots[counter].position+1, pivots[counter+1].position-1);

            //call partition
            tempPos = partition(arrayList, pivots[counter].position+1, pivots[counter+1].position-1, tempPos);

            //store the position of the pivot for next rounds
            pivots.push({ position: tempPos , pivot: tempPivot});
            //pivots.sort();  commenting since have that statement at the end. 
            
            console.log("Currently at level 0");
            console.log("pivot is ", tempPivot);
            console.log("array after 1 partition is "+arrayList);
            console.log("the pivots list is (only positions): ", pivots);
            
        }
        else{
            if(pivots[counter].position===arrayList.length && pivots[counter].pivot===-1)
            {
                    console.log("wait what happened?");
                    break;
            }
            console.log("THE VALUE OF COUNTER IS "+counter);
            let [tempPos, tempPivot] = findPivot(arrayList, pivots[counter].position+1, pivots[counter+1].position-1);

            //call partition
            tempPos = partition(arrayList, pivots[counter].position+1, pivots[counter+1].position-1, tempPos);

            //push the pivot position only if is is not present in the array
            //if(!pivots.includes(arrayList.indexOf(tempPivot)))   this is the old code
            if(!pivots.some(p=> p.position===tempPos && p.pivot===tempPivot))
            {
                console.log("Since "+tempPos+" is not present, inserting it.");
                pivots.push({position: tempPos, pivot: tempPivot});
            }
            
            console.log("Currently at level "+level+" iteration "+counter);
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
    
    visualise();
    level++;

    console.log("----------------------------------------------");
}

function partition(arr, low, high, pivot_loc){

    //in this if case, here there is no i value, hence pivot's position will be same after partition
    if(low>high)
        return pivot_loc;   
    let i=low-1;
    let pivot_elem = arr[pivot_loc];
    console.log("Incoming pivot's location is", pivot_loc);
    //moving the pivot element to the end to that it is easier to swap it in the end
    [arr[pivot_loc], arr[high]] = [arr[high], arr[pivot_loc]];
    for(let j=low ; j<high ; ++j){
        if(arr[j]<=pivot_elem){
            ++i;
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
    }
    [ arr[i+1], arr[high] ] = [ arr[high], arr[i+1] ];
    console.log("Outgoing pivot's location is", i+1);
    console.log(arr);
    console.log("HERE, I+1 IS ............................................... ", i+1);
    return Math.min(i+1, arrayList.length);     //returning the pivot's new position after partitioning
}


/*
Returns the pivot element (not its position)
low and high are the actual starting and ending point of the subarray
*/
function findPivot(arr, low, high){

    console.log("I CAME HERE BROOOOO");
    // if(low>high && high===-1){
    //     //this is a special case
    //     console.log("low>high && high===-1...so retuening lwo: "+arr[low]);
    //     console.log("the value of low is "+low);
    //     console.log("the value of high is "+high);
    //     return arr[low];
    // }
    // else 
    
    
    if(low>high && low===arrayList.length){
        //most probably this will never be reached but verify the same
        console.log("low>high && high===arrayList.length...so returning high:" );
        console.log("arr high is "+arr[high]+" and arr low is "+arr[low]);
        console.log("the value of low is "+low);
        console.log("the value of high is "+high);
        //thats because low can be 10 and high can be 9
        return [high, arr[high]];
    }
    else if(low>high){
        console.log("low>high ...so returning high: "+arr[low]);
        console.log("arr high is "+arr[high]+" and arr low is "+arr[low]);
        console.log("the value of low is "+low);
        console.log("the value of high is "+high);
        //thats because low can be 0 and high can be -1
        return [low, arr[low]];
    }
    
    console.log("the value of low is "+low);
    console.log("the value of high is "+high);
    let first = arr[low];
    let last = arr[high];
    let mid = arr[Math.ceil((high-low)/2)+low];
    // ((((high-low)%2)==0) ? (arr[ ((high-low)/2)+low ]) : (arr[ ((high-low+1)/2)+low ]));
    
    console.log("first elem=" + first); 
    console.log("mid elem=" + mid); 
    console.log("last elem=" + last); 
    // console.log(typeof first, typeof mid, typeof last);
    let pivot = -1;
    let pos = -1;
    if ( ((first > mid) && (first<last)) || 
    ((first > last) && (first < mid)))
    {
        pivot=first;
        pos=low;
    }           
    else if ((mid>=first && mid<=last) || (mid>=last && mid<=first))
    {
        pivot=mid;
        pos=Math.ceil((high-low)/2)+low;
    }   
    else{
        pivot=last;
        pos=high;
    }
    console.log("Pivot="+pivot);
    return [pos,pivot];
}


function visualise(){
    for(let i=0 ; i<arrayList.length ; i++){
        const bar = document.createElement('div');
        bar.classList.add('bar');
        let barheight = Number(arrayList[i]);
        //bar.style.height = `${Number(item)}px`;
        bar.style.height = `${barheight*5}px`;
        bar.textContent = barheight;
        if (level==0)
            document.getElementById('bar-container2').appendChild(bar);
        else if(level==1)
            document.getElementById('bar-container3').appendChild(bar);
        else if(level==2)
            document.getElementById('bar-container4').appendChild(bar);
        else if(level==3)
            document.getElementById('bar-container5').appendChild(bar);

    }      
}

document.getElementById('addButton').addEventListener('click', inputNumbers);
document.getElementById('deleteButton').addEventListener('click', deleteNumbers);
document.getElementById('divideButton').addEventListener('click', divide);
document.getElementById('conquerButton').addEventListener('click', divide2);