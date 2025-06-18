let inorder = [];
let preorder = [];
let level = 0;
let partitionIndexes = [];

document.getElementById("divideButton3").disabled = true;

function addPreorder() {
  //   let a = [];
  //   a.push({
  //     x: 1,
  //     y: 2,
  //   });
  //   let b = [];
  //   b.push({
  //     x: 3,
  //     y: 4,
  //   });
  //   b.push({
  //     x: 5,
  //     y: 6,
  //   });
  //   a.push(...b);
  //   console.log(a);
  //   console.log(b);
  //   return;

  const w = document.getElementById("preorder").value.trim();
  if (w) {
    let singleNum = Number(w);
    if (w.includes(" ") || !isNaN(singleNum)) {
      //split with comma as the separator.
      let temp = w.split(" ").map(Number);
      for (let i = 0; i < temp.length; i++) {
        preorder.push(temp[i]);
      }
    } else if (w.includes(",") || !isNaN(singleNum)) {
      let temp = w.split(",").map(Number);
      for (let i = 0; i < temp.length; i++) {
        preorder.push(temp[i]);
      }
    } else {
      //nonsense input
      alert("Something fishy!");
      console.log("The separator must either be comma or space");
      return;
    }
    console.log("added the array ", preorder);
    document.getElementById("preorder").value = "";
    document.getElementById("addButton4").disabled = true;
  } else {
    alert("Enter the preorder traversal");
  }
}

function deletePreorder() {
  //search for the entered preorder traversal.
  //if present delete it else justan error msg
  const w = document.getElementById("preorder").value.trim();
  if (w) {
    let singleNum = Number(w);
    if (w.includes(" ") || !isNaN(singleNum)) {
      //split with comma as the separator.
      let temp = w.split(" ").map(Number);
      for (let i = 0; i < temp.length; i++) {
        if (preorder[i] !== temp[i]) {
          //there is a mismatch. hence abort delete
          console.log("Cannot find item to delete");
          alert("Entered item not present. Hence nothing to delete");
          return;
        }
      }
    } else if (w.includes(",") || !isNaN(singleNum)) {
      let temp = w.split(",").map(Number);
      for (let i = 0; i < temp.length; i++) {
        if (preorder[i] !== temp[i]) {
          //there is a misamtch. hence abort delete
          console.log("Cannot find item to delete");
          alert("Entered item not present. Hence nothing to delete");
          return;
        }
      }
    } else {
      //nonsense input
      alert("Something fishy!");
      console.log("The separator must either be comma or space");
      return;
    }

    //if the code reaches this point, then it means the value presnet in the preorder can be deleted.
    preorder = [];
    console.log("deleted the entered preorder traversal", preorder);
    document.getElementById("addButton4").disabled = false;
    document.getElementById("preorder").value = "";
  } else {
    alert("Enter a preorder traversal to check and delete");
  }
}

// ---

function addInorder() {
  // for testing
  // let inorder = [3,4,5,2,1];
  // let preorder = [1,2,3,4,];
  // let inorder = [4,2,1,5,3,6];
  // let preorder = [1,2,4,3,5,6];
  // let inorder = [6,4,7,2,5,1,3];
  // let preorder = [1,2,4,6,7,5,3];
  // let inorder = [];
  // let preorder = [];

  // console.log("The result is...",checkTree(inorder, preorder));
  // return;

  document.getElementById("divideButton3").disabled = false;

  const w = document.getElementById("inorder").value.trim();
  // console.log("w.includes(space)",w.includes(" "));
  // console.log("w.includes(,)",w.includes(","));
  //  return;

  if (w) {
    let singleNum = Number(w);
    console.log(singleNum);

    // if(singleNum NaN){
    //     alert("it is nan");
    //     console.log(singleNum, "is singlenum");
    // }

    if (w.includes(",") || !isNaN(singleNum)) {
      //split with comma as the separator.
      let temp = w.split(",").map(Number);
      for (let i = 0; i < temp.length; i++) {
        inorder.push(temp[i]);
      }
      console.log("temp is (,)", temp);
    } else if (w.includes(" ") || !isNaN(singleNum)) {
      let temp = w.split(" ").map(Number);
      for (let i = 0; i < temp.length; i++) {
        inorder.push(temp[i]);
      }
      //   console.log("temp is (space)", temp);
    } else {
      //nonsense input
      alert("Something fishy!");
      console.log("The separator must either be comma or space");
      return;
    }
    console.log("added the array ", inorder);
    document.getElementById("inorder").value = "";
    document.getElementById("addButton3").disabled = true;
  } else {
    alert("Enter the inorder traversal");
  }
}

function deleteInorder() {
  //search for the entered inorder traversal.
  //if present delete it else justan error msg
  const w = document.getElementById("inorder").value.trim();
  if (w) {
    let singleNum = Number(w);
    if (w.includes(" ") || !isNaN(singleNum)) {
      //split with comma as the separator.
      let temp = w.split(" ").map(Number);
      for (let i = 0; i < temp.length; i++) {
        if (inorder[i] !== temp[i]) {
          //there is a mismatch. hence abort delete
          console.log("Cannot find item to delete");
          alert("Entered item not present. Hence nothing to delete");
          return;
        }
      }
    } else if (w.includes(",") || !isNaN(singleNum)) {
      let temp = w.split(",").map(Number);
      for (let i = 0; i < temp.length; i++) {
        if (inorder[i] !== temp[i]) {
          //there is a misamtch. hence abort delete
          console.log("Cannot find item to delete");
          alert("Entered item not present. Hence nothing to delete");
          return;
        }
      }
    } else {
      //nonsense input
      alert("Something fishy!");
      console.log("The separator must either be comma or space");
      return;
    }

    //if the code reaches this point, then it means the value presnet in the inorder can be deleted.
    inorder = [];
    console.log("deleted the entered inorder traversal", inorder);
    document.getElementById("addButton3").disabled = false;
    document.getElementById("inorder").value = "";
  } else {
    alert("Enter an inorder traversal to check and delete");
  }
}

function checkTree(inorder, preorder) {
  if (inorder.length !== preorder.length) return false;

  if (
    inorder.length === preorder.length &&
    inorder.length === 1 &&
    inorder[0] === preorder[0]
  )
    return true;
  else if (
    inorder.length === preorder.length &&
    inorder.length === 1 &&
    inorder[0] !== preorder[0]
  )
    return false;
  else if (inorder.length === preorder.length && inorder.length === 0)
    return true;

  let x = inorder.indexOf(preorder[0]);
  if (x == -1) return false;
  else {
    let left_inorder = inorder.slice(0, x);
    let right_inorder = inorder.slice(x + 1);

    let left_preorder = preorder.slice(1, 1 + left_inorder.length);
    let right_preorder = preorder.slice(1 + left_inorder.length);

    let result1 = checkTree(left_inorder, left_preorder);
    let result2 = checkTree(right_inorder, right_preorder);

    // console.log("Rin, Rpre, res2", right_inorder, right_preorder, result2);

    return result1 && result2;
  }
}

function divide3() {
  if (!checkTree(inorder, preorder)) {
    alert("Tree cannot be constructed from the inputs given.");
    return;
  }
  //else begin computations
  if (level === 0) {
    partitionIndexes.push(0);
    partitionIndexes.push(inorder.length);
    let focus_elem = preorder[0];
    let pos = inorder.indexOf(focus_elem);
    partitionIndexes.push(pos);
    partitionIndexes.sort((a, b) => a - b);
    //need a stopping point to know if i have to stop at level 0 itself.
    level++;
  } else {
    //find a similar partition for all the partitions created in the partitionIndexes
    //if a partition index results in being null, you can treat it as valid(remember the len==0 usecase in checktree?)
    let traverseVar = partitionIndexes.length;
    for (let i = 0; i < traverseVar - 1; i++) {
      //need to find the partiton in range partitionIndex[i]+1...partition[i+1]
      if (partitionIndexes[i] >= inorder.length - 1) {
        //this is because the code below accesses the element present in partitionIndexes[i] + 1 pos
        //which wont exist
        console.log("adhakhkjhskjfhskfjdhskfjhslfkjbhs i=", i);
        continue;
      }
      let focus_elem2 = preorder[partitionIndexes[i] + 1];
      let pos = inorder.indexOf(focus_elem2);
      if (!partitionIndexes.some((p) => p === pos)) {
        partitionIndexes.push(pos);
        console.log("pushed", pos);
        console.log("focuselem is", focus_elem2);
        console.log("i is", i);
      } else {
        console.log("repeated element pos", pos);
      }
    }
    level++;
  }
  partitionIndexes.sort((a, b) => a - b);
  console.log(partitionIndexes);
}

function divide4() {
  if (!checkTree(inorder, preorder)) {
    alert("Tree cannot be constructed from the inputs given.");
    return;
  }

  if (level === 0) {
    partitionIndexes = [0, inorder.length];
    level++;
    preIndex = 0;
    return;
  }

  if (partitionIndexes.length >= inorder.length) {
    console.log("all elements traversed");
    return;
  }

  let newPartitions = [];

  // For every current partition, split it based on the root from preorder
  for (let i = 0; i < partitionIndexes.length - 1; i++) {
    let start = partitionIndexes[i];
    let end = partitionIndexes[i + 1];

    if (start >= end) continue;

    if (preIndex >= preorder.length) {
      console.warn("Ran out of preorder elements unexpectedly");
      continue;
    }

    let root = preorder[preIndex];
    let rootIndex = inorder.indexOf(root, start); // restrict to current partition

    if (rootIndex === -1 || rootIndex >= end) {
      console.warn(
        `Root ${root} not found in inorder segment [${start}, ${end})`
      );
      continue;
    }

    preIndex++; // move to next root in preorder

    // Split the current segment around the root
    newPartitions.push(rootIndex);
  }

  partitionIndexes.push(...newPartitions);
  partitionIndexes = Array.from(new Set(partitionIndexes)).sort(
    (a, b) => a - b
  ); // keep unique & sorted
  level++;

  console.log("Level:", level);
  console.log("Partition Indexes:", partitionIndexes);
  console.log("Next preorder root index:", preIndex);
}

document.getElementById("addButton4").addEventListener("click", addPreorder);
document
  .getElementById("deleteButton4")
  .addEventListener("click", deletePreorder);
document.getElementById("addButton3").addEventListener("click", addInorder);
document
  .getElementById("deleteButton3")
  .addEventListener("click", deleteInorder);
document.getElementById("divideButton3").addEventListener("click", divide3);
document.getElementById("conquerButton3").addEventListener("click", divide4);
