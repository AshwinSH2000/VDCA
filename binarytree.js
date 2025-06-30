let inorder = [];
let preorder = [];
let level = 0;
let partitionIndexes = [];
let treeNodes = []; //this is to store the class nodes
let nodes = [];
let limits = [];
let divideSteps = [];
let treeLevels = [];
let vizLevel = -1;
let divLevel = 0;
let vizConcPtr = [];
const SVGLink = "http://www.w3.org/2000/svg";

class treeNode {
  constructor(value, level) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.level = level;
  }
}

document.getElementById("divideButton3").disabled = true;
document.getElementById("conquerButton3").disabled = true;
createOverlaySVG();

function addPreorder() {
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
  // console.log("The result is...",checkTree(inorder, preorder));
  // return;
  document.getElementById("divideButton3").disabled = false;
  document.getElementById("conquerButton3").disabled = false;

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

  //check for duplicates
  for (let i = 0; i < inorder.length; i++) {
    for (let j = 0; j < inorder.length; j++) {
      if (i === j) continue;
      else {
        if (inorder[i] === inorder[j]) {
          console.log("Duplicates found INORDER");
          return false;
        }
        if (preorder[i] === preorder[j]) {
          console.log("Duplicates dound PREORDER");
          return false;
        }
      }
    }
  }

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

////////////////////////////divide3////////////////////////////
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

////////////////////////////divide4////////////////////////////
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

////////////////////////////divide5////////////////////////////

function divide5() {

  //test code
  // let textttt = document.getElementById("treeContainer");
  // textttt.innerHTML="Hello";

  document.getElementById("addButton3").disabled = true;
  document.getElementById("addButton4").disabled = true;
  document.getElementById("deleteButton3").disabled = true;
  document.getElementById("deleteButton4").disabled = true;

  if (!checkTree(inorder, preorder)) {
    alert("Tree cannot be constructed from the inputs given.");
    return;
  }

  if (nodes.length === inorder.length) {
    console.log("All nodes have been created. Cannot divide further. ");
    console.log("The max level is", level);
    console.log("Vizlevel is", vizLevel);
    document.getElementById('divideButton3').disabled = true;
    return;
  }

  if (level === 0) {
    limits = [-1, inorder.length];
    //in this level, I need to find 2^0 = 1 root
    nodes.push({
      value: preorder[0],
      left: null,
      right: null,
      level: level,
    });
    const newNode = new treeNode(preorder[0], level);
    treeNodes.push(newNode);

    limits.push(inorder.indexOf(preorder[0]));
    limits.sort((a, b) => a - b);

    console.log("At the end of level 0:", nodes);
    console.log("limits is", limits);
    vizDivideBT();
    level++;
    return;
  } else {
    //any higher level
    let maxNodes = Math.pow(2, level);
    let startpoint = level;
    //need to iterate over all the limit nodes to find out the nodes(roots) for the sub trees
    let limitsLength = limits.length;
    for (let i = 0; i < limitsLength - 1; i++) {
      let newinorder = inorder.slice(limits[i] + 1, limits[i + 1]);
      let newpreorder = preorder.slice(startpoint, startpoint + newinorder.length);
      console.log("inorder...", newinorder);
      console.log("preorder...", newpreorder);

      for (let i = 0; true; i++) {
        if (!nodes.some(p => p.value === preorder[startpoint + newinorder.length + i])) {
          startpoint = startpoint + newinorder.length + i;
          break;
        }
        //if !preoroder[startpoint+=newinorder.length+i] is present in nodes.value
        //    startpoint += newinorder.length+i;
        //    break
        //in my op, this wont be an infinite loop because not all numbers are present in nodes

      }

      //did you get it?.....yassss thisis working

      let returnedRoot = doVirtualLevel0(newinorder, newpreorder, level);
      console.log("returned root is", returnedRoot);
      if (returnedRoot !== null) {
        if (!nodes.some((p) => p.value === returnedRoot.value)) {
          console.log("pushing root");
          limits.push(inorder.indexOf(returnedRoot.value));
          findRoot(returnedRoot, level);
          nodes.push(returnedRoot);
          const newNode = new treeNode(returnedRoot.value, returnedRoot.level);
          treeNodes.push(newNode);

        }
        else
          console.log("repetitive root. hence not pushing");
      }
      else {
        console.log("got back null");
      }

      //send a portion of that inorder thing to identify the node in it.
      //basically do a level 0 thing on that.
    }
    console.log("At the end of level " + level + " nodes is", nodes);
    console.log("The class object is", treeNodes);
    limits.sort((a, b) => a - b);
    console.log("limits is", limits);
    vizDivideBT();
    level++;
  }
}

function findRoot(node, curLevel) {
  //goal is to find the closest root (in position) and level
  //maybe like a linear search...
  //first search and filter the roots with value (curLevel-1)
  //if only one, then thats the root. if more, select the closest one (in distance/index)
  let possibleRoots = nodes.filter(p => p.level === curLevel - 1);
  console.log("The possible roots are", possibleRoots);

  //now find the closest one...
  if (possibleRoots.length === 1) {
    //only one root to be attached..so problem simplified
    //better to make changes i think,,,but which side to attach?
    if (inorder.indexOf(node.value) < inorder.indexOf(possibleRoots[0].value)) {
      //leftside
      console.log("This needs to be attached to the left side");
      let indexToEdit = nodes.findIndex(p => p.value === possibleRoots[0].value);
      nodes[indexToEdit].left = node.value;
      treeNodes[indexToEdit].left = node.value;

    } else {
      console.log("This node needs to be attached to the right side");
      let indexToEdit = nodes.findIndex(p => p.value === possibleRoots[0].value);
      nodes[indexToEdit].right = node.value;
      treeNodes[indexToEdit].right = node.value;
    }
  }
  else {
    //need to calculate the closest root by iterating through all
    let closest = Infinity;
    let pointer = 0;
    for (let i = 0; i < possibleRoots.length; i++) {
      console.log("with root", possibleRoots[i].value, "the distance is", Math.abs(inorder.indexOf(node.value) - inorder.indexOf(possibleRoots[i].value)));
      if (Math.abs(inorder.indexOf(node.value) - inorder.indexOf(possibleRoots[i].value)) < closest) {
        closest = Math.abs(inorder.indexOf(node.value) - inorder.indexOf(possibleRoots[i].value));
        pointer = i;
      }
    }
    console.log("Root wil be", possibleRoots[pointer])
    //i will have the root. but which direction?
    if (inorder.indexOf(node.value) < inorder.indexOf(possibleRoots[pointer].value)) {
      //leftside
      console.log("This needs to be attached to the left side");
      let indexToEdit = nodes.findIndex(p => p.value === possibleRoots[pointer].value);
      nodes[indexToEdit].left = node.value;
      treeNodes[indexToEdit].left = node.value;

    } else {
      console.log("This node needs to be attached to the right side");
      let indexToEdit = nodes.findIndex(p => p.value === possibleRoots[pointer].value);
      nodes[indexToEdit].right = node.value;
      treeNodes[indexToEdit].right = node.value;
    }
  }

  //inorder 4 2 5 1 6 3 7
  //prorder 1 2 4 5 3 6 7

}

function doVirtualLevel0(inorder, preorder, givelLevel) {
  /* multiple cases
  1. both null
  2. both len=1 and same elem
  3. both len=2 and same elems
  4. 3 or more length
  */

  if (inorder.length === preorder.length && inorder.length === 0) {
    return null;
  }

  if (inorder.length === preorder.length && inorder.length === 1 && inorder[0] !== preorder[0]) {
    return null;
  }
  return {
    value: preorder[0],
    left: null,
    right: null,
    level: givelLevel,
  };
}

function mergeTree() {
  //ok so i have the nodes array which has complete info about the tree... how to join?
  //got a plannn

  //so start from the max levels that was reached during divide and then decrease to zero.
  //iterate through each of the node and check if anything needs to be attached.
  if (level <= 0) {
    console.log("no more conquer possible...returning");
    console.log("final binary tree:", treeNodes[0]);
    document.getElementById('conquerButton3').disabled = true;
    return;
  }
  level--;
  //decreasing the lvel because it was 1+maxLevel while coming out of divide part
  let levelNodes = treeNodes.filter(p => p.level === level);//.map(p => p.value);;
  let posToDelete = 0;
  for (let i = 0; i < levelNodes.length; i++) {
    console.log("------begin------")
    console.log("The nodes in this level are", levelNodes);

    //find the corresponding treeNodes[i];
    let nodePos = treeNodes.findIndex(p => p.value === levelNodes[i].value);
    //console.log("levelNodes[i].left...1",levelNodes[i].left);

    if (levelNodes[i].left !== null) {
      //find and attach the actual node
      treeNodes[nodePos].left = treeNodes.filter(p => p.value === levelNodes[i].left);

      //code to delete
      // console.log("levelNodes[i].left...2",levelNodes[i].left);
      // posToDelete = treeNodes.findIndex(p=>p.value===levelNodes[i].left);
      // console.log("posToDelete is", posToDelete);
      // if(posToDelete!==-1){
      //   console.log("Delete happening...", posToDelete);
      //   treeNodes.splice(posToDelete,1);
      // }

    }
    if (levelNodes[i].right !== null) {
      //find and attach the actual node
      treeNodes[nodePos].right = treeNodes.filter(p => p.value === levelNodes[i].right);

      //code to delete
      // posToDelete = treeNodes.findIndex(p=>p.value === levelNodes[i].right);
      // console.log("posToDelete is", posToDelete);
      // if(posToDelete!==-1){
      //   console.log("Delete happening...", posToDelete);
      //   treeNodes.splice(posToDelete,1);
      // }
    }
    console.log("the levelnodes afer updating are:", levelNodes);
    console.log("------end------")
  }
  vizConquerBT();
}

function reset() {
  document.getElementById("addButton3").disabled = false;
  document.getElementById("addButton4").disabled = false;
  document.getElementById("deleteButton3").disabled = false;
  document.getElementById("deleteButton4").disabled = false;
  document.getElementById("divideButton3").disabled = false;
  document.getElementById("conquerButton3").disabled = false;
  inorder = [];
  preorder = [];
  level = 0;
  partitionIndexes = [];
  treeNodes = []; //this is to store the class nodes
  nodes = [];
  limits = [];
  console.clear();
  console.log("cleared the console. starting fresh");
}

function vizConquerBT() {
  //use the level var to find the nodes to display in this level. 
  //but have to display the elements found in the order of inorder...so basically the same as divide but in reverse order
  //one important part is to add link between the root and children
  //another imp part is to try to have circular nodes. 
  //try if it is possible...to search the left and right of each node and link it to the value present there...
  //how to do it im not sure. 


  let container = document.getElementById(`RtreeContainer`);
  console.log("Inside the conquer visualiser fn");
  if (level === 0) {
    container = document.getElementById(`RtreeContainer`);
    container.innerHTML = '';
  }
  else {
    container = document.getElementById(`RtreeContainer${level + 1}`);
    container.innerHTML = '';
  }

  let outerSVG = document.getElementById("linkLayer");


  for (let i = 0; i < inorder.length; i++) {
    console.log("Inside the conquer forloop");

    let indexOfText = nodes.findIndex((p) => p.value === inorder[i]);
    console.log("indexOfText is", indexOfText);
    console.log("The values inside conqurtBT is1", nodes[indexOfText]);
    const SVG = document.createElementNS(SVGLink, "svg");

    if (nodes[indexOfText].level === level) {
      console.log("The values inside conqurtBT is2", nodes[indexOfText]);
      //svg for the node
      SVG.setAttribute("width", "50");   //used when there was circle around node
      // SVG.setAttribute("width", "30"); //used whrn there is no circle around node
      SVG.setAttribute("height", "50");
      SVG.style.display = "flex";
      SVG.style.justifyContent = "center";
      SVG.style.alignItems = "center";
      SVG.style.border = "0.5px solid";
      SVG.setAttribute("class", `partitionLevel${nodes[indexOfText].level}`);

      //circle for the node
      const CIRCLE = document.createElementNS(SVGLink, "circle");
      CIRCLE.setAttribute("cx", "25");
      CIRCLE.setAttribute("cy", "25");
      CIRCLE.setAttribute("r", "24");
      CIRCLE.setAttribute("class", `partitionLevel${nodes[indexOfText].level}`);
      CIRCLE.setAttribute("fill", "none");
      // CIRCLE.setAttribute("fill", "solid rgba(248, 248, 248, 0.55)");        // Diff border but black background 
      // CIRCLE.style.background = "rgba(120,120,120,50)";
      // CIRCLE.setAttribute("stroke", "black");     // Border color
      CIRCLE.setAttribute("stroke-width", "3");
      SVG.appendChild(CIRCLE);

      // EITHER HARD CODE EVERYTHING
      // OR TRY GETTING THE X, Y, TOP, RIGHT, BOTTOM AND LEFT SOMEHOW.THEN TRY SOME.

      //text for the node
      const text = document.createElementNS(SVGLink, "text");
      text.textContent = inorder[i];
      text.setAttribute("x", "25");   //used when there was a circle around node
      text.setAttribute("y", "29"); // a little below center
      text.setAttribute("text-anchor", "middle"); // center horizontally
      text.setAttribute("font-size", "20");
      text.setAttribute("class", `textPartitionLevel${nodes[indexOfText].level}`);
      SVG.setAttribute("id", `Node${inorder[i]}`);
      SVG.appendChild(text);
      console.log("The values inside conqurtBT is3", nodes[indexOfText]);
    }
    else {
      //inserting a black space
      // if (level <= 1)
      SVG.setAttribute("width", "30");
      // else if (level === 2)
      //   SVG.setAttribute("width", "40");
      // else if (level === 3)
      //   SVG.setAttribute("width", "50");
      // else if (level === 4)
      //   SVG.setAttribute("width", "60");
      // else if (level === 5)
      //   SVG.setAttribute("width", "70");
      // else if (level === 6)
      //   SVG.setAttribute("width", "80");
      // else
      //   SVG.setAttribute("width", "90");

      SVG.setAttribute("height", "50");
      SVG.style.display = "flex";
      SVG.style.justifyContent = "center";
      SVG.style.alignItems = "center";
      SVG.style.border = "0.5px solid";
    }

    container.appendChild(SVG);
    console.log("appended sth");
    console.log("The values inside conqurtBT is4", nodes[indexOfText]);
    if (nodes[indexOfText].level === level) {
      //   let belowPoints = getPointInOuterSVG(SVG, 25, 50, outerSVG);
      //   let abovePoints = getPointInOuterSVG(SVG, 25, 0, outerSVG);
      //   vizConcPtr.push({
      //     value: inorder[i],
      //     topX: abovePoints.x,
      //     topY: abovePoints.y,
      //     botX: belowPoints.x,
      //     botY: belowPoints.y,
      //   })
      //   console.log("vizConcPtr is", vizConcPtr);

      console.log("The values inside conqurtBT is5", nodes[indexOfText]);
      drawLines(SVG, nodes[indexOfText]);
    }

  }

}

function drawLines(topSVG, focusNode) {

  console.log("Focus node is", focusNode);

  let outerSVG = document.getElementById("linkLayer");

  //need to draw the lines...
  if (focusNode.left !== null) {
    console.log("Printing the left path now");

    //created the line..ok
    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");

    //get the present svg and the one below
    //present SVG is topSVG
    let bottomContainer = document.getElementById('RtreeContainer');
    if (level === 0) {
      bottomContainer = document.getElementById(`RtreeContainer${level + 2}`);
    } else {
      bottomContainer = document.getElementById(`RtreeContainer${level + 2}`);
    }
    let botSVG = bottomContainer.querySelector(`#Node${focusNode.left}`);
    console.log("Bottom container is", bottomContainer);
    console.log("Bottom svg is", botSVG);
    console.log("`Node${focusNode.left}` is", `#Node${focusNode.left}`)

    let RootPtr = getPointInOuterSVG(topSVG, 25, 50, outerSVG);
    let ChildPtr = getPointInOuterSVG(botSVG, 25, 0, outerSVG);


    line1.setAttribute("x1", RootPtr.x);
    line1.setAttribute("y1", RootPtr.y);
    line1.setAttribute("x2", ChildPtr.x);
    line1.setAttribute("y2", ChildPtr.y);
    console.log("This shit");
    line1.setAttribute("stroke-width", "4");
    line1.setAttribute("class", `partitionLevelBlack`);
    outerSVG.appendChild(line1);

  }
  else {
    console.log("Null needs to be attached to left child of", focusNode);
  }
  if (focusNode.right !== null) {
    console.log("Printing the right path now");
    //no need to create an svg, this marking will come in linkLayer
    //but need to find the x and y coords... how


    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");

    let bottomContainer = document.getElementById('RtreeContainer');
    if (level === 0) {
      bottomContainer = document.getElementById(`RtreeContainer${level + 2}`);
    } else {
      bottomContainer = document.getElementById(`RtreeContainer${level + 2}`);
    }
    let botSVG = bottomContainer.querySelector(`#Node${focusNode.right}`);

    let RootPtr = getPointInOuterSVG(topSVG, 25, 50, outerSVG);
    let ChildPtr = getPointInOuterSVG(botSVG, 25, 0, outerSVG);


    line2.setAttribute("x1", RootPtr.x);
    line2.setAttribute("y1", RootPtr.y);
    line2.setAttribute("x2", ChildPtr.x);
    line2.setAttribute("y2", ChildPtr.y);
    line2.setAttribute("stroke-width", "4");
    line2.setAttribute("class", `partitionLevelBlack`);
    outerSVG.appendChild(line2);

  }
  else {
    console.log("Null needs to be attached to right child of", focusNode);
  }

}

function drawLinesOld2(topSVG, inorderElem) {
  let outerSVG = document.getElementById("linkLayer");

  //now get the element to check. 
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].level === level) {
      //need to draw the lines...
      if (nodes[i].left !== null) {
        console.log("Printing the left path now");

        //created the line..ok
        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");

        //get the present svg and the one below
        //present SVG is topSVG
        let bottomContainer = document.getElementById('RtreeContainer');
        if (level === 0) {
          bottomContainer = document.getElementById('RtreeContainer');
        } else {
          bottomContainer = document.getElementById(`RtreeContainer${level + 2}`);
        }
        let botSVG = bottomContainer.querySelector(`svg#${inorderElem}Node`);

        let RootPtr = getPointInOuterSVG(topSVG, 25, 50, outerSVG);
        let ChildPtr = getPointInOuterSVG(botSVG, 25, 0, outerSVG);


        line1.setAttribute("x1", RootPtr.x);
        line1.setAttribute("y1", RootPtr.y);
        line1.setAttribute("x2", ChildPtr.x);
        line1.setAttribute("y2", ChildPtr.y);
        console.log("This shit");
        line1.setAttribute("stroke-width", "4");
        line1.setAttribute("class", `partitionLevelBlack`);
        outerSVG.appendChild(line1);

      }
      else {
        console.log("Null needs to be attached to left child of", nodes[i].value);
      }
      if (nodes[i].right !== null) {
        console.log("Printing the right path now");
        //no need to create an svg, this marking will come in linkLayer
        //but need to find the x and y coords... how


        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");

        let bottomContainer = document.getElementById('RtreeContainer');
        if (level === 0) {
          bottomContainer = document.getElementById('RtreeContainer');
        } else {
          bottomContainer = document.getElementById(`RtreeContainer${level + 2}`);
        }
        let botSVG = bottomContainer.querySelector(`svg#${inorderElem}Node`);

        if (index !== -1) {
          line1.setAttribute("x1", vizConcPtr[index].topX);
          line1.setAttribute("y1", vizConcPtr[index].topY);
          line1.setAttribute("x2", vizConcPtr[index].botX);
          line1.setAttribute("y2", vizConcPtr[index].botY);
          line1.setAttribute("stroke-width", "4");
          line1.setAttribute("class", `partitionLevelBlack`);
          outerSVG.appendChild(line1);
        }
      }
      else {
        console.log("Null needs to be attached to right child of", nodes[i].value);
      }
    }

  }
}
function drawLinesOld() {

  // testcode
  // const svg = document.getElementById("linkLayer");
  // const testLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  // testLine.setAttribute("x1", 0);
  // testLine.setAttribute("y1", 0);
  // testLine.setAttribute("x2", 300);
  // testLine.setAttribute("y2", 300);
  // testLine.setAttribute("stroke", "red");
  // testLine.setAttribute("stroke-width", "2");
  // svg.appendChild(testLine);

  // let container = document.getElementById(`RpathContainer`);
  // console.log("Inside the drawlines fn");
  // if (level === 0) {
  //   container = document.getElementById(`RpathContainer`);
  //   container.innerHTML = '';
  // }
  // else {
  //   container = document.getElementById(`RpathContainer${level + 1}`);
  //   container.innerHTML = '';
  // }

  let outerSVG = document.getElementById("linkLayer");

  //now get the element to check. 
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].level === level) {
      //need to draw the lines...
      if (nodes[i].left !== null) {
        console.log("Printing the left path now");
        //no need to create an svg, this marking will come in linkLayer
        //but need to find the x and y coords... how

        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        let index = vizConcPtr.findIndex(p => p.value === nodes[i].left);
        if (index !== -1) {
          line1.setAttribute("x1", vizConcPtr[index].topX);
          line1.setAttribute("y1", vizConcPtr[index].topY);
          line1.setAttribute("x2", vizConcPtr[index].botX);
          line1.setAttribute("y2", vizConcPtr[index].botY);
          ;
          console.log("This shit");
          line1.setAttribute("stroke-width", "4");
          line1.setAttribute("class", `partitionLevelBlack`);
          outerSVG.appendChild(line1);
        }
      }
      else {
        console.log("Null needs to be attached to left child of", nodes[i].value);
      }
      if (nodes[i].right !== null) {
        console.log("Printing the right path now");
        //no need to create an svg, this marking will come in linkLayer
        //but need to find the x and y coords... how


        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        let index = vizConcPtr.findIndex(p => p.value === nodes[i].right);
        if (index !== -1) {
          line1.setAttribute("x1", vizConcPtr[index].topX);
          line1.setAttribute("y1", vizConcPtr[index].topY);
          line1.setAttribute("x2", vizConcPtr[index].botX);
          line1.setAttribute("y2", vizConcPtr[index].botY);
          line1.setAttribute("stroke-width", "4");
          line1.setAttribute("class", `partitionLevelBlack`);
          outerSVG.appendChild(line1);
        }
      }
      else {
        console.log("Null needs to be attached to right child of", nodes[i].value);
      }
    }
  }
  // container.appendChild(outerSVG);

}

function vizDivideBT() {

  let container = document.getElementById(`treeContainer`);
  console.log("Inside the visualise fn");
  if (level === 0) {
    container = document.getElementById(`treeContainer`);
    container.innerHTML = '';
  }
  else {
    container = document.getElementById(`treeContainer${level + 1}`);
    container.innerHTML = '';
  }

  for (let i = 0; i < inorder.length; i++) {
    //output the value of each node based on its level's colour'
    console.log("Inside the forloop");

    let indexOfText = nodes.findIndex((p) => p.value === inorder[i]);
    //idu yaake andre, in level 0, there will be only the root in the nodes class. 
    //so if an element is found, you put a partition around it and display it.
    //if it is not present, you put it in a blank svg and display it
    console.log("indexOfText is", indexOfText);

    // if(indexOfText===-1){
    //   //output the number only
    //   const NODE = document.createElement('div');
    //   NODE.textContent = inorder[i];
    //   NODE.classList.add('partitionLevelBlack');
    //   container.appendChild(NODE);
    // }
    // else{
    //create and push a node
    // const NODE = document.createElement('g');
    // NODE.classList.add(`partitionLevel${nodes[indexOfText].level}`);
    // NODE.innerHTML+= '<circle cx="10" cy="10" r="5" />'
    // container.appendChild(NODE);


    const SVG = document.createElementNS(SVGLink, "svg");

    if (indexOfText === -1 || nodes[indexOfText].level > vizLevel) {


      if (indexOfText === -1) {
        SVG.setAttribute("width", "30");
        SVG.setAttribute("height", "50");
        SVG.style.display = "flex";
        SVG.style.justifyContent = "center";
        SVG.style.alignItems = "center";
        // SVG.style.border = "0.5px solid";
        SVG.setAttribute("class", 'partitionLevelBlack');
      }
      else {
        // SVG.setAttribute("width", "50");   //used when there was circle around node
        SVG.setAttribute("width", "30");
        SVG.setAttribute("height", "50");
        SVG.style.display = "flex";
        SVG.style.justifyContent = "center";
        SVG.style.alignItems = "center";
        // SVG.style.border = "0.5px solid";
        SVG.setAttribute("class", `partitionLevel${nodes[indexOfText].level}`);
      }


      if (indexOfText !== -1) {
        // const CIRCLE = document.createElementNS(SVGLink, "circle");
        // CIRCLE.setAttribute("cx", "25");
        // CIRCLE.setAttribute("cy", "25");
        // CIRCLE.setAttribute("r", "18");
        // CIRCLE.setAttribute("class", `partitionLevel${nodes[indexOfText].level}`);
        // CIRCLE.setAttribute("fill", "none");        // Hollow circle
        // // CIRCLE.setAttribute("stroke", "black");     // Border color
        // CIRCLE.setAttribute("stroke-width", "3");
        // SVG.appendChild(CIRCLE); 

        const line1 = document.createElementNS(SVGLink, "line");
        line1.setAttribute("x1", 0);
        line1.setAttribute("y1", 0);
        line1.setAttribute("x2", 0);
        line1.setAttribute("y2", 50);
        line1.setAttribute("stroke-width", "4");
        line1.setAttribute("class", `partitionLevel${nodes[indexOfText].level}`);
        SVG.appendChild(line1);
        const line2 = document.createElementNS(SVGLink, "line");
        line2.setAttribute("x1", 30);
        line2.setAttribute("y1", 0);
        line2.setAttribute("x2", 30);
        line2.setAttribute("y2", 50);
        line2.setAttribute("stroke-width", "4");
        line2.setAttribute("class", `partitionLevel${nodes[indexOfText].level}`);
        SVG.appendChild(line2);
      }

      const text = document.createElementNS(SVGLink, "text");

      text.textContent = inorder[i];
      if (indexOfText === -1) {
        text.setAttribute("x", "15");
        text.setAttribute("y", "29"); // a little below center
        text.setAttribute("text-anchor", "middle"); // center horizontally
        text.setAttribute("font-size", "20");
        text.setAttribute("class", 'textPartitionLevelBlack');
      } else {
        text.setAttribute("x", "15");
        // text.setAttribute("x", "25");   //used when there was a circle around node
        text.setAttribute("y", "29"); // a little below center
        text.setAttribute("text-anchor", "middle"); // center horizontally
        text.setAttribute("font-size", "20");
        text.setAttribute("class", `textPartitionLevel${nodes[indexOfText].level}`);
      }

      SVG.appendChild(text);
    }
    else {
      SVG.setAttribute("width", "60");
      SVG.setAttribute("height", "50");
      SVG.style.display = "flex";
      SVG.style.justifyContent = "center";
      SVG.style.alignItems = "center";
      // SVG.style.border = "0.5px solid";
    }
    container.appendChild(SVG);

    // }
    // NODE.classList.add(`partitionLevel${1}`);
    console.log("appended sth");
  }
  vizLevel++;
}


function getPointInOuterSVG(innerSVG, x, y, outerSVG) {
  console.log(innerSVG, outerSVG);
  if (!innerSVG || !outerSVG) {
    throw new Error("Invalid SVG elements provided.");
  }

  const pt = innerSVG.createSVGPoint();
  pt.x = x;
  pt.y = y;
  // console.log("pt is", pt);

  // Get screen CTMs
  const screenCTM = innerSVG.getScreenCTM();
  // console.log("screenCTM is", screenCTM);
  const outerScreenCTM = outerSVG.getScreenCTM();
  // console.log("outerScreenCTM is", outerScreenCTM);

  if (!screenCTM || !outerScreenCTM) {
    throw new Error("Elements must be in the DOM to compute CTM.");
  }

  // Transform to screen coordinates
  const screenPoint = pt.matrixTransform(screenCTM);
  // console.log("screenPoint is", screenPoint);

  // Invert outer CTM (handle non-invertible)
  const inverseOuterCTM = outerScreenCTM.inverse();
  // console.log("inverseOuterCTM is", inverseOuterCTM);
  if (!inverseOuterCTM) {
    throw new Error("Outer SVG's CTM is not invertible.");
  }

  // Transform to outer SVG's space
  const outerPoint = screenPoint.matrixTransform(inverseOuterCTM);
  // console.log("outerPoint is", outerPoint);

  return { x: outerPoint.x, y: outerPoint.y };
}

function getPointInOuterSVGold(innerSVG, x, y, outerSVG) {
  const pt = innerSVG.createSVGPoint();
  pt.x = x;
  pt.y = y;

  // Transform the point to screen space
  const screenCTM = innerSVG.getScreenCTM();
  const screenPoint = pt.matrixTransform(screenCTM);

  // Convert the screen point to outerSVG's coordinate space
  const outerCTM = outerSVG.getScreenCTM().inverse();
  const outerPoint = screenPoint.matrixTransform(outerCTM);

  return { x: outerPoint.x, y: outerPoint.y };
}

function createOverlaySVG() {
  const rightHalfDiv = document.querySelector('.rightHalfDiv');

  // Create the SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");


  svg.setAttribute("id", "linkLayer");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.pointerEvents = "none"; // Let clicks pass through
  svg.style.zIndex = "0"; // Behind content
  // svg.style.border = "1px solid black";

  // Match the size and position of .rightHalfDiv
  const rect = rightHalfDiv.getBoundingClientRect();
  console.log("The bounding client rect of right half div is...", rect);
  svg.style.width = rect.width + "px";
  svg.style.height = rect.height + "px";
  svg.style.transform = `translate(${rect.left}px, ${rect.top}px)`;

  svg.style.display = "flex";
  svg.style.justifyContent = "center";
  svg.style.alignItems = "center";

  // Add to body or a positioned parent
  document.body.appendChild(svg);
}



document.getElementById("addButton4").addEventListener("click", addPreorder);
document.getElementById("deleteButton4").addEventListener("click", deletePreorder);
document.getElementById("addButton3").addEventListener("click", addInorder);
document.getElementById("deleteButton3").addEventListener("click", deleteInorder);
document.getElementById("divideButton3").addEventListener("click", divide5);
document.getElementById("conquerButton3").addEventListener("click", mergeTree);
document.getElementById("resetButton3").addEventListener('click', reset);
