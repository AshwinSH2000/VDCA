//alert("JavaScript is loaded!"); //this generates a popup as soon as the page is loaded

const arrayList = [];

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
    console.log("dividing the nunmbers");
    //const pivot = Math.floor(Math.random())
    //decided to go with the median

    var first = arrayList[0];
    var last = arrayList[arrayList.length-1];
    var mid = arrayList.length%2==0 ? arrayList[ arrayList.length / 2] : arrayList[ (arrayList.length-1) / 2];

    console.log("first" + first);
    console.log("mid" + mid);
    console.log("last" + last);
    var pivot = 0;

    if ((first >= mid && first<=last) || (first >= last && first <= mid))
        pivot=first;
    else if ((mid>=first && mid<=last) || (mid>=last && mid<=first))
        pivot=mid;
    else
        pivot=last;
    
    console.log("Pivot="+pivot);

    //for putting elements to the left and right of pivot you need to do the actual quicksort partition step
}

document.getElementById('addButton').addEventListener('click', inputNumbers);
document.getElementById('deleteButton').addEventListener('click', deleteNumbers);
document.getElementById('divideButton').addEventListener('click', divide);