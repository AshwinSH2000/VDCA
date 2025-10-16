# 📊 VDCA – Visualising Divide-and-Conquer Algorithms  

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)  
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-blue)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](#-contributing)  

An **interactive, web-based visualiser** that simplifies the understanding of **Divide-and-Conquer (D&C) algorithms** through step-by-step graphical depictions.  

**Live Demo**: [vdca.netlify.app](https://vdca.netlify.app)  

---

## Features  

- **Minimalist UI** – clean, user-friendly design focused on learning  
- **Step-by-step recursion flow** – observe divide, conquer, and solve phases visually  
- **Three algorithms implemented**:
  - **Quicksort** – pivot selection & recursive partitioning  
  - **Convex Hull** – recursive geometric construction  
  - **Binary Tree Construction** – bottom-up tree building from traversals  
- **Colour-coded recursion depth** – partitions and merges clearly visualised  
- **Toast notifications & logs** – real-time feedback while exploring algorithms  
- **Built-in FAQs** – guiding learners through the process  

---

## 🖼️ Screenshots  


### Quicksort Visualiser  
https://github.com/user-attachments/assets/72428c78-d77a-4b13-a6f3-cd257836bead

### Convex Hull Visualiser  
https://github.com/user-attachments/assets/b961864f-99bd-4dea-b0bd-d1795a2bbcbf

### Binary Tree Construction  
https://github.com/user-attachments/assets/5a2a2e19-693c-4646-a537-9227c82cd948



---

## 🚀 Getting Started  

Follow these steps to run the project locally.  

### 1. Clone the repo  
```bash
git clone https://github.com/yourusername/vdca.git
```
### 2. Navigate to the repository and open the file
```bash
cd vdca
open index.html
```
This will open the web-app in the default browser

---

## Methodology

### Common Design Principles

All three visualisers (Quicksort, Convex Hull, and Binary Tree Construction) share a unified, learner-focused design:

- **Consistent UI Layout:** The interface is split into a fixed top section (containing input fields and control buttons) and a scrollable bottom section (the dynamic visualisation area).
- **Primary Controls:** Each visualiser includes three main buttons:
  - **Divide:** Performs a single divide operation, breaking the input into smaller subproblems and visually displaying the partitioning.
  - **Conquer:** Progressively merges or combines results from divided subproblems, building up the solution.
  - **Solve:** Skips intermediate steps and shows the solution for the current state, enabling quick exploration or confirmation.
- **Reset:** A common Reset button clears all input and restarts the visualisation.
- **Colour-Coding:** Distinct colours represent different recursion depths or partitions, visually linking divide steps to their corresponding conquer steps and helping users track progress.
- **Supplementary Features:** Additional buttons in the top-right provide:
  - **FAQs Overlay:** Common questions and explanations for each algorithm.
  - **Guide Me!:** Tooltip-based walkthroughs for UI elements and steps.
  - **Toast Notifications & Logs:** Real-time feedback (success, error, info) is shown briefly as toast messages and permanently logged for review.

The design intentionally empowers users to step through each phase, encouraging exploration and deeper understanding, rather than watching a fully automated animation.

**Tech Stack:**  
- **JavaScript (vanilla):** Handles algorithm logic, dynamic updates, and interactivity.
- **HTML5:** Structures the layout and input controls.
- **CSS:** Provides styling, colour transitions, responsive layouts, and visual cues.
- **SVG:** Used extensively for rendering graphical elements (bars, grid points, tree nodes, etc).

### Common Methodology

- **Controlled Iterative Execution:**  
  While the underlying algorithms are recursive, the visualisers implement an iterative, checkpointed execution model, pausing after each major step for explicit user input. This enables step-by-step exploration and learning.
- **Visual Hierarchy & Colour Mapping:**  
  Colour is used not only for aesthetics but also to highlight algorithmic structure—such as pivots in Quicksort, partition lines in Convex Hull, and root nodes in Binary Tree construction—guiding user attention to critical points in the computation.

---

### Algorithm-Specific Methodologies

#### Quicksort Visualiser

- **Design:**  
  - **Layout:** Left side shows successive partitions (divide steps), right side displays merging (conquer steps). Each recursion level is grouped and colour-coded.
  - **User Interaction:**  
    - Insert/Delete buttons allow modification of the input array.
    - Divide highlights pivots and partitions with distinct colours and spacing.
    - Conquer merges partitions, reverting colours for clarity.
    - Solve completes all remaining steps instantly for the current partitions.

- **Methodology:**  
  - **Level-Based Representation:** Each divide step is tagged with its recursion depth, visually grouping subproblems, and showing their eventual convergence during the conquer phase.
  - **Progressive Abstraction:** Early steps emphasise concrete values and changes; later steps shift focus to structural relationships and the overall sorting process.

#### Convex Hull Visualiser

- **Design:**  
  - **Grid Input:** Users add or remove points by clicking on an 11x11 grid.
  - **Partitioning:** Divide draws vertical, colour-coded partition lines of decreasing thickness for deeper levels.
  - **Hull Construction:** Conquer/Solve draws convex hulls with colours matching the most recent partitions; merged hulls and their partition lines are updated accordingly.

- **Methodology:**  
  - **Guided Merging via Tangents:** The conquer phase visually demonstrates finding upper and lower tangents between hulls, streamlining the merge process.
  - **Geometric Base Cases:** Base cases (single point, pair, or stack) are visually and conceptually highlighted, reinforcing when direct hull construction is possible.

#### Binary Tree Construction Visualiser

- **Design:**  
  - **Input:** Inorder and preorder traversals are entered via two text boxes.
  - **Partitioning:** Divide displays split traversals and highlights the next root element with unique colours for each level.
  - **Tree Assembly:** Conquer draws tree nodes and links them, using colour to indicate their origin level; completed nodes revert to black.

- **Methodology:**  
  - **Recursive Root Identification:** The root is always the first element of the current preorder partition, anchoring the recursive construction.
  - **Bottom-Up Assembly:** The conquer phase builds the tree starting from leaf nodes, visually connecting earlier divide decisions with their eventual placement in the tree.

---

By combining these design and methodological choices, VDCA offers an interactive, user-driven environment for understanding and exploring the inner workings of classic Divide & Conquer algorithms.
