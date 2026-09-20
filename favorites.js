const recipecontainer = document.querySelector('.recipe-container');

function getFavorites() {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) { return JSON.parse(savedFavorites); }
    return [];
}

function removeFavorite(recipeId) {
    const favorites = getFavorites();
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].id === recipeId) { favorites.splice(i, 1); break; }
    }
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    showFavoriteRecipes();
}

function showModal(recipe) {
    const modal = document.createElement('div');
    const content = document.createElement('div');
    const title = document.createElement('h2');
    const ingredientsHeading = document.createElement('h3');
    const ingredients = document.createElement('ul');
    const instructionsHeading = document.createElement('h3');
    const instructions = document.createElement('ol');
    const closeButton = document.createElement('button');
    modal.className = 'recipe-modal';
    content.className = 'modal-content';
    title.textContent = recipe.name;
    ingredientsHeading.textContent = 'Ingredients';
    instructionsHeading.textContent = 'Instructions';
    closeButton.textContent = 'Close';
    for (let i = 0; i < recipe.ingredients.length; i++) {
        const item = document.createElement('li'); item.textContent = recipe.ingredients[i]; ingredients.append(item);
    }
    for (let i = 0; i < recipe.instructions.length; i++) {
        const item = document.createElement('li'); item.textContent = recipe.instructions[i]; instructions.append(item);
    }
    closeButton.addEventListener('click', function () {
        modal.remove();
    });
    content.append(title, ingredientsHeading, ingredients, instructionsHeading, instructions, closeButton);
    modal.append(content);
    document.body.append(modal);
}

function showFavoriteRecipes() {
    const favorites = getFavorites();
    recipecontainer.innerHTML = '';
    if (favorites.length === 0) {
        recipecontainer.innerHTML = '<p class="empty-message">No favorite recipes yet.</p>'; return;
    }
    for (let i = 0; i < favorites.length; i++) {
        const recipe = favorites[i];
        const card = document.createElement('div');
        const image = document.createElement('img');
        const name = document.createElement('h3');
        const details = document.createElement('div');
        const viewButton = document.createElement('button');
        const removeButton = document.createElement('button');
        card.className = 'cards';
        image.src = recipe.image;
        image.alt = recipe.name;
        name.textContent = recipe.name;
        details.innerHTML = '<p>Cuisine: ' + recipe.cuisine + '</p><p>Rating: ' + recipe.rating + '</p><p>Difficulty: ' + recipe.difficulty + '</p>';
        viewButton.textContent = 'View Recipe'; removeButton.textContent = 'Remove Favorite'; removeButton.className = 'favorite-button liked';
        viewButton.addEventListener('click', function () {
            showModal(recipe);
        });
        removeButton.addEventListener('click', function () {
            removeFavorite(recipe.id);
        });
        card.append(image, name, details, viewButton, removeButton);
        recipecontainer.append(card);
    }
}
showFavoriteRecipes();
