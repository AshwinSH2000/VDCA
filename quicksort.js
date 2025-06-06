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
    if((pivots.length-1===arrayList.length)||(pivots.length>arrayList.length)){
        console.log("array is sorted...terminating");
        return;
    }

    let noOfPivots = Math.pow(2,level);     //idk the use of this...let me check later
    let levelPivots=[];
    let counter=0;

    while (counter<noOfPivots){
        if(level==0){
            pivots.push(Number(-1));         //this is the position of pivots. 
            pivots.push(arrayList.length);    //this is also the position of pivots. 

            //findPivot retuens the actual pivot for that part of the array
            let tempPivot = findPivot(arrayList, pivots[counter]+1, pivots[counter+1]-1);

            //call partition
            partition(arrayList, pivots[counter]+1, pivots[counter+1]-1, arrayList.indexOf(tempPivot));

            //store the position of the pivot for next rounds
            pivots.push(arrayList.indexOf(tempPivot));
            //pivots.sort();  commenting since have that statement at the end. 
            //i++;
            
            console.log("Currently at level 0");
            console.log("pivot is "+tempPivot);
            console.log("array after 1 partition is "+arrayList);
            console.log("the pivots list is (only positions): "+ pivots);
            
        }
        else{
            console.log("THE VALUE OF COUNTER IS "+counter);
            let tempPivot = findPivot(arrayList, pivots[counter]+1, pivots[counter+1]-1);

            //call partition
            partition(arrayList, pivots[counter]+1, pivots[counter+1]-1, arrayList.indexOf(tempPivot));

            //push the pivot position only if is is not present in the array
            if(!pivots.includes(arrayList.indexOf(tempPivot)))
            {
                console.log("Since "+arrayList.indexOf(tempPivot)+" is not present, inserting it.");
                pivots.push(arrayList.indexOf(tempPivot));
            }
            //counter++;
            //i++;
            console.log("Currently at level "+level+" iteration "+counter);
            console.log("pivot is "+tempPivot);
            console.log("array after 1 partition is "+arrayList);
            console.log("the pivots list is (only positions): "+ pivots);
            console.log("---");
        }
       //i++;
       counter++;
        
    }
    console.log("The array is ");
    level++;
    pivots.sort(((a, b) => a - b));
    console.log("Sorted pivot is "+pivots);



    console.log("----------------------------------------------");
}

function partition(arr, low, high, pivot_loc){

    if(low>high)
        return;
    let i=low-1;
    let pivot_elem = arr[pivot_loc];

    //moving the pivot element to the end to that it is easier to swap it in the end
    [arr[pivot_loc], arr[high]] = [arr[high], arr[pivot_loc]];
    for(let j=low ; j<high ; ++j){
        if(arr[j]<pivot_elem){
            ++i;
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
    }
    [ arr[i+1], arr[high] ] = [ arr[high], arr[i+1] ]
    console.log(arr);
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
        return arr[high];
    }
    else if(low>high){
        console.log("low>high ...so returning high: "+arr[low]);
        console.log("arr high is "+arr[high]+" and arr low is "+arr[low]);
        console.log("the value of low is "+low);
        console.log("the value of high is "+high);
        //thats because low can be 0 and high can be -1
        return arr[low];
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
    let pivot = 0;
    if ( ((first > mid) && (first<last)) || 
    ((first > last) && (first < mid)))
    {
        pivot=first;
    }           
    else if ((mid>=first && mid<=last) || (mid>=last && mid<=first))
    {
        pivot=mid;
    }   
    else{
        pivot=last;
    }
    console.log("Pivot="+pivot);
    return pivot;
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

    }      
}

document.getElementById('addButton').addEventListener('click', inputNumbers);
document.getElementById('deleteButton').addEventListener('click', deleteNumbers);
document.getElementById('divideButton').addEventListener('click', divide);
document.getElementById('conquerButton').addEventListener('click', divide2);