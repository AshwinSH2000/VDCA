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

    var pivot = arrayList.length % 2 == 1 ? arrayList.length

    // for(var i=0 ; i<arrayList.length ; ++i){
    //     console.log(arrayList[i]);
    // }
}

document.getElementById('addButton').addEventListener('click', inputNumbers);
document.getElementById('deleteButton').addEventListener('click', deleteNumbers);
document.getElementById('divideButton').addEventListener('click', divide);