const recipecontainer = document.querySelector('.recipe-container');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
let allRecipes = [];

searchButton.addEventListener('click', showFilteredRecipes);
searchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        showFilteredRecipes();
    }
});

function fetchRecipe() {
    fetch('https://dummyjson.com/recipes')
        .then(response => response.json())
        .then(data => {
            allRecipes = data.recipes;
            createCards(allRecipes);
        });
}

function showFilteredRecipes() {
    if (searchInput.value === '') {
        recipecontainer.innerHTML = '';
        createCards(allRecipes);
        return;
    }

    const filteredRecipes = [];
    for (let i = 0; i < allRecipes.length; i++) {
        const recipe = allRecipes[i];
        const nameMatches = recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
        if (nameMatches) { 
            filteredRecipes.push(recipe);
        }
    }
    recipecontainer.innerHTML = '';
    createCards(filteredRecipes);
}

function getFavorites() {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) {
        return JSON.parse(savedFavorites);
    }
    return [];
}

function isFavorite(recipeId) {
    const favorites = getFavorites();
    for (let i = 0; i < favorites.length; i++){
        if (favorites[i].id === recipeId) {
            return true;
        } }
    return false;
}

function changeFavorite(recipe) {
    const favorites = getFavorites(); let recipeFound = false;
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].id === recipe.id) {
            favorites.splice(i, 1); recipeFound = true;
            break;
        }
    }
    if (recipeFound === false) { favorites.push(recipe); }
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
}

function createCards(data) {
    if (data.length === 0) {
        recipecontainer.innerHTML = '<p class="empty-message">No recipes found.</p>';
        return; }
    for (let i = 0; i < data.length; i++) {
        const recipe = data[i];
        const card = document.createElement('div');
        const image = document.createElement('img');
        const name = document.createElement('h3');
        const details = document.createElement('div');
        const viewButton = document.createElement('button');
        const favoriteButton = document.createElement('button');
        card.className = 'cards';
        image.setAttribute("src", recipe.image);
        image.setAttribute("alt", recipe.name);
        name.textContent = recipe.name;
        details.innerHTML = '<p>Cuisine: ' + recipe.cuisine + '</p><p>Rating: ' + recipe.rating + '</p><p>Difficulty: ' + recipe.difficulty + '</p><p>Prep: ' + recipe.prepTimeMinutes + ' min</p><p>Cook: ' + recipe.cookTimeMinutes + ' min</p><p>Serves: ' + recipe.servings + '</p>';
        viewButton.textContent = 'View Recipe';
        favoriteButton.className = 'favorite-button';
        if (isFavorite(recipe.id)) {
            favoriteButton.textContent = 'Liked'; favoriteButton.classList.add('liked');
        } else {
            favoriteButton.textContent = 'Favorite';
        }
        viewButton.addEventListener('click', function () {
            showModal(recipe);
        });
        favoriteButton.addEventListener('click', function () {
            changeFavorite(recipe);
            if (isFavorite(recipe.id)) {
                favoriteButton.textContent = 'Liked'; favoriteButton.classList.add('liked');
            }
            else {
                favoriteButton.textContent = 'Favorite'; favoriteButton.classList.remove('liked');
            }
        });
        card.append(image, name, details, viewButton, favoriteButton);
        recipecontainer.append(card);
    }
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
fetchRecipe();
