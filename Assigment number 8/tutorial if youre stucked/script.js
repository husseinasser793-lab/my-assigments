/**
 * ========================================================
 * WHAT'S FOR DINNER - JAVASCRIPT GUIDE & EXPLANATION
 * ========================================================
 *
 * HOW THIS WORKS:
 * 1. We create an array of "recipe" objects. Each recipe has properties:
 *    - name, description, imgCover
 *    - prepTime, cookTime, totalTime, servings
 *    - difficulty, category, ratingsAverage, ratingsQuantity
 *    - ingredients (array of strings)
 *    - instructions (array of strings)
 *    - nutrition (object with calories, protein, carbs, fat, fiber, sodium)
 *    - tips (array of strings)
 *
 * 2. When the page loads, we call `renderRecipe(recipes[0])`.
 *
 * 3. When the user clicks the "Try Another Recipe" button, we pick a random
 *    index different from the current one and re-call `renderRecipe(...)`.
 */

// 1. DATA SOURCE: List of recipes
const recipes = [
  {
    name: "Creamy Spaghetti Carbonara",
    description: "A classic Italian pasta dish with eggs, cheese, and pancetta",
    imgCover: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800&auto=format&fit=crop",
    prepTime: "15 min",
    cookTime: "20 min",
    totalTime: 35, // in minutes (<= 45, no warning)
    servings: "4 people",
    difficulty: "Easy",
    category: "Italian",
    ratingsAverage: 4.8,
    ratingsQuantity: 234,
    ingredients: [
      "400g spaghetti pasta",
      "200g pancetta or guanciale, diced",
      "4 large eggs",
      "100g Pecorino Romano cheese, grated",
      "50g Parmesan cheese, grated",
      "Freshly ground black pepper",
      "Salt for pasta water"
    ],
    instructions: [
      "Bring a large pot of salted water to boil. Cook spaghetti according to package directions until al dente.",
      "While pasta cooks, heat a large skillet over medium heat. Add diced pancetta and cook until crispy, about 5-7 minutes.",
      "In a bowl, whisk together eggs, grated Pecorino Romano, and Parmesan cheese. Add plenty of freshly ground black pepper.",
      "Reserve 1 cup of pasta cooking water before draining. Drain pasta and immediately add to the skillet with pancetta.",
      "Remove skillet from heat. Quickly pour in egg mixture while tossing pasta vigorously. Add reserved pasta water as needed to create a creamy sauce.",
      "Serve immediately with extra cheese and black pepper on top. Enjoy your authentic carbonara!"
    ],
    nutrition: {
      calories: "520 kcal",
      protein: "28g",
      carbs: "62g",
      fat: "18g",
      fiber: "3g",
      sodium: "680mg"
    },
    tips: [
      "Use room temperature eggs for a smoother sauce consistency.",
      "Work quickly when mixing eggs with hot pasta to avoid scrambling.",
      "Reserve extra pasta water - it's the secret to perfect creaminess.",
      "Never add heavy cream: authentic carbonara gets all its creaminess from eggs and cheese!"
    ]
  },
  {
    name: "Honey Garlic Salmon",
    description: "Pan-seared salmon with a sweet and savory garlic glaze",
    imgCover: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
    prepTime: "10 min",
    cookTime: "15 min",
    totalTime: 25,
    servings: "2 people",
    difficulty: "Easy",
    category: "Seafood",
    ratingsAverage: 4.9,
    ratingsQuantity: 187,
    ingredients: [
      "2 salmon fillets (6oz each)",
      "3 tablespoons honey",
      "2 tablespoons soy sauce",
      "4 cloves garlic, minced",
      "1 tablespoon olive oil",
      "1 teaspoon fresh ginger, grated",
      "Sesame seeds for garnish",
      "Green onions, sliced"
    ],
    instructions: [
      "Pat salmon fillets dry with paper towels. Season with salt and pepper.",
      "In a small bowl, whisk together honey, soy sauce, minced garlic, and grated ginger.",
      "Heat olive oil in a large skillet over medium-high heat.",
      "Place salmon fillets skin-side up in the pan. Cook for 4-5 minutes until golden.",
      "Flip salmon and pour honey garlic sauce over the top. Cook for another 4-5 minutes.",
      "Garnish with sesame seeds and sliced green onions. Serve with steamed vegetables or rice."
    ],
    nutrition: {
      calories: "380 kcal",
      protein: "35g",
      carbs: "28g",
      fat: "14g",
      fiber: "0g",
      sodium: "720mg"
    },
    tips: [
      "Don't overcook salmon - it should be slightly pink and tender in the center.",
      "Use wild-caught salmon for the best flavor and nutritional value.",
      "Let the sauce bubble and caramelize slightly for deeper flavor.",
      "Pair with steamed broccoli or asparagus for a balanced, complete meal."
    ]
  },
  {
    name: "Mediterranean Quinoa Bowl",
    description: "Healthy bowl with quinoa, fresh vegetables, feta, and tahini dressing",
    imgCover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    prepTime: "20 min",
    cookTime: "35 min",
    totalTime: 55, // Triggers "Extended Preparation Time" warning (> 45 min)
    servings: "2 people",
    difficulty: "Intermediate",
    category: "Mediterranean",
    ratingsAverage: 4.5,
    ratingsQuantity: 156,
    ingredients: [
      "1 cup quinoa, rinsed",
      "Cherry tomatoes, halved",
      "Cucumber, diced",
      "Red onion, sliced",
      "Kalamata olives",
      "Feta cheese, crumbled",
      "Fresh parsley, chopped",
      "3 tablespoons tahini dressing"
    ],
    instructions: [
      "Rinse quinoa thoroughly under cold water. Cook in boiling water according to package directions (about 15 minutes).",
      "While quinoa cooks, chop all fresh vegetables and set them aside.",
      "For tahini dressing: whisk tahini, lemon juice, minced garlic, and a splash of water until smooth.",
      "Fluff cooked quinoa with a fork and allow it to cool slightly.",
      "Arrange quinoa in serving bowls. Top with tomatoes, cucumber, onion, and kalamata olives.",
      "Sprinkle with crumbled feta and fresh parsley. Drizzle tahini dressing generously over the top."
    ],
    nutrition: {
      calories: "480 kcal",
      protein: "18g",
      carbs: "58g",
      fat: "20g",
      fiber: "10g",
      sodium: "540mg"
    },
    tips: [
      "Rinse quinoa well before boiling to remove saponin (the bitter outer coating).",
      "Let quinoa cool to room temperature before tossing with crisp fresh veggies.",
      "Make extra tahini dressing - it stores well in an airtight jar for up to a week."
    ]
  },
  {
    name: "Chicken Tikka Masala",
    description: "Rich and aromatic Indian curry with tender spiced chicken pieces",
    imgCover: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop",
    prepTime: "20 min",
    cookTime: "30 min",
    totalTime: 50, // Triggers warning (> 45 min)
    servings: "4 people",
    difficulty: "Intermediate",
    category: "Asian",
    ratingsAverage: 4.7,
    ratingsQuantity: 389,
    ingredients: [
      "600g chicken breast, cubed",
      "1 cup plain Greek yogurt",
      "2 tablespoons tikka masala curry paste",
      "400ml canned coconut cream or cream",
      "1 large onion, diced",
      "4 cloves garlic, minced",
      "2 tablespoons fresh ginger, grated",
      "400g canned crushed tomatoes",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Marinate chicken cubes in half the yogurt and 1 tbsp tikka paste for at least 20 minutes.",
      "Heat oil in a deep skillet; sear marinated chicken until golden brown. Remove and set aside.",
      "In the same skillet, sauté diced onion until translucent. Add garlic and grated ginger; cook for 1 minute.",
      "Stir in remaining tikka paste and crushed tomatoes. Simmer gently for 10 minutes.",
      "Stir in coconut cream and remaining yogurt. Return the cooked chicken to the pan.",
      "Simmer for 15 minutes until sauce is luscious and thick. Garnish with cilantro and serve with warm naan or basmati rice."
    ],
    nutrition: {
      calories: "540 kcal",
      protein: "42g",
      carbs: "18g",
      fat: "32g",
      fiber: "4g",
      sodium: "780mg"
    },
    tips: [
      "Marinating chicken for longer (even overnight) tenderizes the meat remarkably.",
      "For authentic smoke flavor, sear chicken pieces over high heat before simmering.",
      "Adjust chili or cayenne to match your preferred spice level."
    ]
  }
];

// Tracks the index of the currently shown recipe
let currentRecipeIndex = 0;

/**
 * 2. RENDER FUNCTION
 * This function takes a single recipe object and writes its data into HTML elements.
 */
function renderRecipe(recipe) {
  // A. Left Column - Media & Quick Stats
  document.getElementById("recipeImage").src = recipe.imgCover;
  document.getElementById("recipeImage").alt = recipe.name;
  document.getElementById("ratingAverage").textContent = recipe.ratingsAverage;
  document.getElementById("ratingQuantity").textContent = `(${recipe.ratingsQuantity} reviews)`;
  document.getElementById("prepTimeDisplay").textContent = recipe.prepTime;
  document.getElementById("cookTimeDisplay").textContent = recipe.cookTime;
  document.getElementById("servingsDisplay").textContent = recipe.servings;

  // B. Right Column - Badges, Title, and Description
  document.getElementById("difficultyBadge").textContent = recipe.difficulty;
  document.getElementById("categoryBadge").textContent = recipe.category;
  document.getElementById("recipeName").textContent = recipe.name;
  document.getElementById("recipeDescription").textContent = recipe.description;

  // C. Extended Preparation Alert Check
  // If recipe.totalTime > 45, remove 'd-none' class so it shows; otherwise add 'd-none' to hide it.
  const timeWarningAlert = document.getElementById("timeWarningAlert");
  if (recipe.totalTime > 45) {
    timeWarningAlert.classList.remove("d-none");
  } else {
    timeWarningAlert.classList.add("d-none");
  }

  // D. Render Ingredients Tab (Looping with Array.map)
  const ingredientsContainer = document.getElementById("ingredientsListContainer");
  ingredientsContainer.innerHTML = recipe.ingredients
    .map((item, index) => `
      <li class="d-flex align-items-center gap-3">
        <span class="step-number-pill">${index + 1}</span>
        <span class="text-secondary">${item}</span>
      </li>
    `)
    .join("");

  // E. Render Instructions Tab
  const instructionsContainer = document.getElementById("instructionsListContainer");
  instructionsContainer.innerHTML = recipe.instructions
    .map((step, index) => `
      <div class="d-flex align-items-start gap-3">
        <span class="instruction-step-badge">${index + 1}</span>
        <p class="text-secondary mb-0 pt-2">${step}</p>
      </div>
    `)
    .join("");

  // F. Render Nutrition Tab
  const nutritionContainer = document.getElementById("nutritionCardsContainer");
  const nutrientsData = [
    { label: "Calories", val: recipe.nutrition.calories, icon: "fa-fire text-danger", bg: "bg-danger-subtle" },
    { label: "Protein", val: recipe.nutrition.protein, icon: "fa-dumbbell text-primary", bg: "bg-primary-subtle" },
    { label: "Carbs", val: recipe.nutrition.carbs, icon: "fa-wheat-awn text-warning", bg: "bg-warning-subtle" },
    { label: "Fat", val: recipe.nutrition.fat, icon: "fa-droplet text-danger", bg: "bg-danger-subtle" },
    { label: "Fiber", val: recipe.nutrition.fiber, icon: "fa-seedling text-success", bg: "bg-success-subtle" },
    { label: "Sodium", val: recipe.nutrition.sodium, icon: "fa-cube text-info", bg: "bg-info-subtle" }
  ];

  nutritionContainer.innerHTML = nutrientsData
    .map(n => `
      <div class="col-6 col-md-4">
        <div class="p-3 nutrition-card d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <div class="p-2 rounded-2 ${n.bg} d-flex align-items-center justify-content-center" style="width: 34px; height: 34px;">
              <i class="fa-solid ${n.icon} small"></i>
            </div>
            <span class="text-muted small">${n.label}</span>
          </div>
          <span class="fw-bold text-dark small">${n.val}</span>
        </div>
      </div>
    `)
    .join("");

  // G. Render Chef Tips Tab
  const tipsContainer = document.getElementById("tipsListContainer");
  tipsContainer.innerHTML = recipe.tips
    .map(tip => `
      <div class="alert alert-warning border-start border-4 border-warning mb-0 d-flex align-items-start gap-2">
        <i class="fa-solid fa-circle-check text-warning fs-5 mt-1"></i>
        <div class="text-dark small">${tip}</div>
      </div>
    `)
    .join("");
}

/**
 * 3. EVENT LISTENER: "Try Another Recipe" Button
 * Picks a random recipe different from the currently displayed one.
 */
document.getElementById("tryAnotherRecipeBtn").addEventListener("click", () => {
  let nextIndex;

  // Keep generating a random index until it differs from the current one
  do {
    nextIndex = Math.floor(Math.random() * recipes.length);
  } while (nextIndex === currentRecipeIndex && recipes.length > 1);

  currentRecipeIndex = nextIndex;
  renderRecipe(recipes[currentRecipeIndex]);
});

/**
 * 4. INITIALIZATION
 * Render the first recipe as soon as the DOM is ready.
 */
document.addEventListener("DOMContentLoaded", () => {
  renderRecipe(recipes[0]);
});
