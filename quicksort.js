//alert("JavaScript is loaded!"); //this generates a popup as soon as the page is loaded

const arrayList = [];
let pivots = []
let level = 0;

function inputNumbers(){
    const item = document.getElementById('array_number').value.trim();
    if(item){
        arrayList.push(item);
        console.log("Added:", item, "Array:", arrayList);
    }
    document.getElementById('array_number').value = '';
}

function deleteNumbers(){
    const item = document.getElementById('array_number').value.trim();
    if(item){
        const index = arrayList.indexOf(item);
        if(index !== -1){
            arrayList.splice(index, 1);
            console.log("Removed:", item, "Array:", arrayList);
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
        pivots.push(pivot);
        partition(arrayList, 0, arrayList.length-1, arrayList.indexOf(pivot));
        level++;
        // console.log("abcd"+pivots[0]);
    }
    else if(level==1){
        //this time 
        console.log("going for the second divide and prev pivot is "+ pivots[0]);
        let pivot1=findPivot(arrayList, 0, arrayList.indexOf(pivots[level-1])-1);
        let pivot2=findPivot(arrayList, arrayList.indexOf(pivots[level-1])+1, arrayList.length-1);
        
        partition(arrayList, 0, arrayList.indexOf(pivots[level-1])-1, arrayList.indexOf(pivot1));
        partition(arrayList, arrayList.indexOf(pivots[level-1])+1, arrayList.length-1, arrayList.indexOf(pivot2))
        level++;
    }
    else if(level==2){
        
        console.log("going for the third divide");
        level++;
    }
    
}


function partition(arr, low, high, pivot_loc){
    let i=low-1;
    let pivot_elem = arr[pivot_loc]

    //moving the pivot element to the end to that it is easier to swap it in the end
    [arr[pivot_loc], arr[high]] = [arr[high], arr[pivot_loc]];
    for(let j=low ; j<high ; ++j){
        if(arr[j]<pivot_elem){
            i++;
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
    }
    [ arr[i+1], arr[high] ] = [ arr[high], arr[i+1] ]
    console.log(arr);
}

function findPivot(arr, low, high){
    let first = arr[low];
    let last = arr[high];
    let mid = (high-low)%2==0 ? arr[ ((high-low)/2)+low ] : arr[ ((high-low+1)/2)+low ];

    console.log("first" + first);
    console.log("mid" + mid);
    console.log("last" + last);
    let pivot = 0;

    if ((first >= mid && first<=last) || (first >= last && first <= mid))
        pivot=first;
    else if ((mid>=first && mid<=last) || (mid>=last && mid<=first))
        pivot=mid;
    else
        pivot=last;

    console.log("Pivot="+pivot);
    return pivot;
}

document.getElementById('addButton').addEventListener('click', inputNumbers);
document.getElementById('deleteButton').addEventListener('click', deleteNumbers);
document.getElementById('divideButton').addEventListener('click', divide);