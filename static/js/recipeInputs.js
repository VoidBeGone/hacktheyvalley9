// Function to render the recipe dynamically
function renderRecipe(recipe) {
    // Set the title
    document.getElementById('recipe-title').textContent = recipe.title;
  
    // Populate ingredients
    const ingredientsList = document.getElementById('ingredients-list');
    recipe.ingredients.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = ingredient;
      ingredientsList.appendChild(listItem);
    });
  
    // Populate instructions
    const instructionsList = document.getElementById('instructions-list');
    recipe.instructions.forEach(instruction => {
      const listItem = document.createElement('li');
      listItem.textContent = instruction;
      instructionsList.appendChild(listItem);
    });
  }
  