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

document.getElementById('addButton').addEventListener('click', inputNumbers);
document.getElementById('deleteButton').addEventListener('click', deleteNumbers);