# 🍳 Tutorial: "If You're Stuck" — Assignment 8 ("What's For Dinner")

Welcome! If you are feeling stuck while building the **What's For Dinner** project, this guide breaks down every single component, every CSS trick, and every line of JavaScript step-by-step.

You have a complete working example inside this folder (`index.html`, `style.css`, and `script.js`). You can double-click `index.html` to test it anytime!

---

## 📌 Table of Contents
1. [Mental Model & Visual Breakdown](#1-mental-model--visual-breakdown)
2. [Section 1: Navbar / Header](#2-section-1-navbar--header)
3. [Section 2: The Two-Column Recipe Card (Bootstrap Grid)](#3-section-2-the-two-column-recipe-card)
4. [Section 3: Left Column (Image & Floating Glass Badges)](#4-section-3-left-column)
5. [Section 4: Right Column (Badges, Headings, and Conditional Alert)](#5-section-4-right-column)
6. [Section 5: Interactive Tabs (Ingredients, Steps, Nutrition, Tips)](#6-section-5-interactive-tabs)
7. [Section 6: The "Try Another Recipe" Button](#7-section-6-the-try-another-recipe-button)
8. [Section 7: JavaScript Step-by-Step](#8-section-7-javascript-step-by-step)
9. [Common Pitfalls & Why Things Break](#9-common-pitfalls--why-things-break)

---

## 1. Mental Model & Visual Breakdown

The application is composed of two main zones:
```text
+---------------------------------------------------------------+
| HEADER: Brand Logo ("What's For Dinner") + Bookmark/User Icons|
+---------------------------------------------------------------+
| MAIN CONTAINER:                                               |
|  +-----------------------------+----------------------------+ |
|  | LEFT (col-lg-5):            | RIGHT (col-lg-7):          | |
|  | - Food photo                | - Badges (Easy, Italian)   | |
|  | - Floating Rating pill      | - Title & Description      | |
|  | - Floating Glass info card: | - [!] Extended Time Alert  | |
|  |   Prep / Cook / Servings    | - Tabs:                    | |
|  |                             |   [Ingredients][Steps]...  | |
|  |                             | - Scrollable Tab Content   | |
|  |                             | - [Try Another Recipe Btn] | |
|  +-----------------------------+----------------------------+ |
+---------------------------------------------------------------+
```

---

## 2. Section 1: Navbar / Header

### What you need:
- Left: Circular icon with utensils + Title + Subtitle.
- Right: Action icons (`bookmark`, `history`, `gear`) + Avatar (hidden on mobile with `d-none d-md-flex`).
- Mobile: Hamburger toggle (`d-md-none`) that opens a Bootstrap collapse menu.

### Key Bootstrap Classes Used:
- `sticky-top`: Keeps the navbar pinned to the top.
- `d-flex align-items-center justify-content-between`: Pushes logo left and icons right.
- `data-bs-toggle="collapse"` + `data-bs-target="#mobileMenu"`: Enables mobile dropdown with zero JavaScript.

---

## 3. Section 2: The Two-Column Recipe Card

Use a Bootstrap card with no border and `overflow-hidden`:
```html
<div class="card border-0 shadow-lg overflow-hidden main-recipe-card">
  <div class="row g-0">
    <div class="col-lg-5"> <!-- Left: Media --> </div>
    <div class="col-lg-7"> <!-- Right: Details & Tabs --> </div>
  </div>
</div>
```
- `g-0`: Removes gutters so the left image touches the edges smoothly.
- `col-lg-5` / `col-lg-7`: Stacks vertically on phones/tablets, then becomes 5-col / 7-col side-by-side on desktops (`lg`).

---

## 4. Section 3: Left Column

### Floating Overlays with CSS:
The parent `.recipe-media-wrapper` must have `position: relative`.
Then child elements use `position: absolute`:

1. **Top-Left Rating Pill**:
   ```html
   <div class="position-absolute top-0 start-0 m-3 m-md-4 bg-white rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2">
     <i class="fa-solid fa-star text-warning"></i>
     <span id="ratingAverage">4.8</span>
     <span id="ratingQuantity">(234 reviews)</span>
   </div>
   ```

2. **Bottom Glassmorphism Card**:
   ```css
   .glass-quick-info {
     background: rgba(255, 255, 255, 0.92);
     backdrop-filter: blur(12px);
     -webkit-backdrop-filter: blur(12px);
   }
   ```
   Contains 3 columns with borders: Prep Time, Cook Time, and Servings.

---

## 5. Section 4: Right Column

### Conditional Preparation Time Alert:
The site has an alert:
```html
<div id="timeWarningAlert" class="alert alert-danger d-flex align-items-center gap-3 rounded-3 d-none">
  <i class="fa-solid fa-triangle-exclamation fs-4"></i>
  <div>
    <div class="fw-bold">Extended Preparation Time</div>
    <div class="small">This recipe takes more than 45 minutes to prepare. Plan accordingly!</div>
  </div>
</div>
```
**How JavaScript controls it:**
```javascript
if (recipe.totalTime > 45) {
  timeWarningAlert.classList.remove('d-none'); // Show it!
} else {
  timeWarningAlert.classList.add('d-none');    // Hide it!
}
```

---

## 6. Section 5: Interactive Tabs

Bootstrap 5 does **all** the tab switching for you! You do **not** need complex JS tab listeners.

1. **Tab Buttons** using `nav-pills`:
   ```html
   <ul class="nav nav-pills" id="recipeTabsList" role="tablist">
     <li class="nav-item">
       <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#tab-ingredients" type="button">
         Ingredients
       </button>
     </li>
     <li class="nav-item">
       <button class="nav-link" data-bs-toggle="pill" data-bs-target="#tab-instructions" type="button">
         Instructions
       </button>
     </li>
   </ul>
   ```
2. **Tab Content Panes**:
   ```html
   <div class="tab-content" id="recipeTabsContent">
     <div class="tab-pane fade show active" id="tab-ingredients">...</div>
     <div class="tab-pane fade" id="tab-instructions">...</div>
   </div>
   ```
> 💡 Notice how `data-bs-target="#tab-ingredients"` matches `id="tab-ingredients"`. That's all Bootstrap needs!

---

## 7. Section 6: The "Try Another Recipe" Button

```html
<button id="tryAnotherRecipeBtn" class="btn btn-gradient-dinner text-white fw-bold">
  <i class="fa-solid fa-rotate me-2"></i>Try Another Recipe
</button>
```

When clicked, JavaScript generates a random index:
```javascript
document.getElementById("tryAnotherRecipeBtn").addEventListener("click", () => {
  let nextIndex;
  // Keep picking until it's different from the current recipe
  do {
    nextIndex = Math.floor(Math.random() * recipes.length);
  } while (nextIndex === currentRecipeIndex && recipes.length > 1);

  currentRecipeIndex = nextIndex;
  renderRecipe(recipes[currentRecipeIndex]);
});
```

---

## 8. Section 7: JavaScript Step-by-Step

### 1. The Recipe Data Model:
Each recipe is a simple object:
```javascript
const recipe = {
  name: "...",
  description: "...",
  imgCover: "https://...",
  prepTime: "15 min",
  cookTime: "20 min",
  totalTime: 35,
  servings: "4 people",
  difficulty: "Easy",
  category: "Italian",
  ratingsAverage: 4.8,
  ratingsQuantity: 234,
  ingredients: ["item 1", "item 2"],
  instructions: ["step 1", "step 2"],
  nutrition: { calories: "520 kcal", protein: "28g", ... },
  tips: ["tip 1", "tip 2"]
};
```

### 2. Rendering arrays dynamically with `.map().join("")`:
Instead of writing repetitive HTML for 10 ingredients, use `.map()`:
```javascript
const ingredientsContainer = document.getElementById("ingredientsListContainer");

ingredientsContainer.innerHTML = recipe.ingredients
  .map((item, index) => `
    <li class="d-flex align-items-center gap-3">
      <span class="step-number-pill">${index + 1}</span>
      <span class="text-secondary">${item}</span>
    </li>
  `)
  .join("");
```

---

## 9. Common Pitfalls & Why Things Break

| Problem | Cause | How to Fix |
| :--- | :--- | :--- |
| **Clicking tabs doesn't switch content** | Missing Bootstrap JS bundle | Ensure `<script src="...bootstrap.bundle.min.js"></script>` is included at the bottom before your `script.js`. |
| **Hamburger button doesn't open** | Missing `data-bs-target` or id mismatch | Check that `data-bs-target="#myMenu"` matches `<div id="myMenu">`. |
| **Images look stretched or squished** | Missing CSS object fit | Add class `object-fit-cover` on the `<img>` tag and `height: 100%`. |
| **Ingredients list shows commas `,` between items** | Forgot `.join("")` | When using `.map()`, it produces an array. Always append `.join("")` at the end! |
| **Random button picks the same recipe twice** | Using pure `Math.random()` without a loop | Use `do { ... } while (nextIndex === currentRecipeIndex)` so it rerolls if it picks the same recipe. |

---

🎯 **Ready to test?** Double-click `index.html` inside `tutorial if youre stucked` in your browser!
