//alert("JavaScript is loaded!"); //this generates a popup as soon as the page is loaded

const arrayList = [];
let pivots = [];
let level = 0;

function inputNumbers(){
    const item = document.getElementById('array_number').value.trim();
    //console.log(typeof item);
    //const value = parseInt(item.value);
    
    if(item){
        // if(typeof Number(item)!=='number'){
        //     alert("Please enter a valid number!");
        // }
        // else{
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

       // }
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
        //this time 
        // console.log("going for the second divide and prev pivot is "+ pivots[0]);
        let pivot1=findPivot(arrayList, 0, arrayList.indexOf(pivots[level-1])-1);
        let pivot2=findPivot(arrayList, arrayList.indexOf(pivots[level-1])+1, arrayList.length-1);
        
        partition(arrayList, 0, arrayList.indexOf(pivots[level-1])-1, arrayList.indexOf(pivot1));
        partition(arrayList, arrayList.indexOf(pivots[level-1])+1, arrayList.length-1, arrayList.indexOf(pivot2))
        visualise();
        level++;
    }
    else if(level==2){
        
        console.log("going for the third divide");
        visualise();
        level++;
    }
}

// function divide2(){
//     for(leti=0 ; i<=)
// }

function visualise(){
    for(let i=0 ; i<arrayList.length ; i++){
        const bar = document.createElement('div');
        bar.classList.add('bar');
        let barheight = Number(arrayList[i]);
        //bar.style.height = `${Number(item)}px`;
        bar.style.height = `${barheight*5}px`;
        bar.textContent = barheight;
        document.getElementById('bar-container2').appendChild(bar);
    }      
}

function partition(arr, low, high, pivot_loc){
    let i=low-1;
    let pivot_elem = arr[pivot_loc];
    // console.log("-------");
    // console.log("Array is "+arr);
    // console.log("low is "+low);
    // console.log("high is "+high);
    // console.log("pivot_loc is "+pivot_loc);
    // console.log("-------");

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

function findPivot(arr, low, high){
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
        // console.log("(first > mid)"+(first > mid) + " first="+first + " mid="+mid);
        // console.log("(first < last)"+(first<last));
        // console.log("(first > last)"+(first > last));
        // console.log("(first < mid)"+(first < mid)+ " first="+first + " mid="+mid);

        pivot=first;
        // console.log("first if case");
    }           
    else if ((mid>=first && mid<=last) || (mid>=last && mid<=first))
    {
        pivot=mid;
        // console.log("second if case");
    }   
    else{
        pivot=last;
        // console.log("last/third if case");
    }
    console.log("Pivot="+pivot);
    return pivot;
}

document.getElementById('addButton').addEventListener('click', inputNumbers);
document.getElementById('deleteButton').addEventListener('click', deleteNumbers);
document.getElementById('divideButton').addEventListener('click', divide);