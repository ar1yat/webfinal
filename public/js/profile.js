// Получаем токен
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login.html?error=Please+login';
} else {
    // 1. Загрузка профиля
    fetch('/api/users/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch profile');
            return response.json();
        })
        .then(data => {
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
        })
        .catch(err => {
            console.error(err);
            window.location.href = '/login.html?error=Please+login';
        });

    // 2. Загрузка списка рецептов
    loadRecipes();
}

// Функция для загрузки рецептов текущего пользователя
function loadRecipes() {
    fetch('/api/recipes', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch recipes');
            return response.json();
        })
        .then(recipes => {
            const recipeList = document.getElementById('recipeList');
            recipeList.innerHTML = '';
            recipes.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');

                // Пример отображения
                recipeDiv.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>
        <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <button class="deleteBtn">Delete</button>
      `;

                // Вешаем обработчик на кнопку Delete
                const deleteBtn = recipeDiv.querySelector('.deleteBtn');
                deleteBtn.addEventListener('click', () => {
                    deleteRecipe(recipe._id);
                });

                recipeList.appendChild(recipeDiv);
            });
        })
        .catch(err => {
            console.error(err);
            // Можно вывести сообщение об ошибке
        });
}
// Logout
document.getElementById('logout-link').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
});

// Обработка формы профиля (PUT /api/users/profile)
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newEmail = document.getElementById('newEmail').value;
    try {
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ username: newUsername, email: newEmail })
        });

        // Если статус не 2xx, читаем ошибку ОДИН раз
        if (!response.ok) {
            const errData = await response.json();  // (1) — единственный вызов для ошибки
            alert(errData.error || 'Error updating profile');
            return;
        }

        // Если всё хорошо, тоже читаем JSON ОДИН раз
        const data = await response.json();        // (2) — единственный вызов для успеха
        alert('Profile updated successfully!');

        // Обновляем на странице
        document.getElementById('username').textContent = data.username;
        document.getElementById('email').textContent = data.email;

    } catch (err) {
        console.error(err);
        alert('An error occurred while updating the profile.');
    }
});

// Переключение формы создания рецепта
document.getElementById('toggleRecipeForm').addEventListener('click', function() {
    const form = document.getElementById('recipeForm');
    form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
    // Сброс полей
    document.getElementById('recipeId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('ingredients').value = '';
    document.getElementById('instructions').value = '';
    document.getElementById('saveRecipeBtn').textContent = 'Save Recipe';
});

// Заполнение формы для редактирования рецепта
function editRecipe(recipe) {
    document.getElementById('recipeForm').style.display = 'block';
    document.getElementById('recipeId').value = recipe._id;
    document.getElementById('title').value = recipe.title;
    document.getElementById('description').value = recipe.description;
    document.getElementById('ingredients').value = recipe.ingredients.join(', ');
    document.getElementById('instructions').value = recipe.instructions;
    document.getElementById('saveRecipeBtn').textContent = 'Update Recipe';
}

// Обработка отправки формы рецепта (Create или Update)
document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const recipeId = document.getElementById('recipeId').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;
    const method = recipeId ? 'PUT' : 'POST';
    const url = recipeId ? `/api/recipes/${recipeId}` : '/api/recipes';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ title, description, ingredients, instructions })
        });
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || 'Error saving recipe');
            return;
        }
        await response.json();
        alert(recipeId ? 'Recipe updated successfully!' : 'Recipe created successfully!');
        document.getElementById('recipeForm').reset();
        document.getElementById('recipeForm').style.display = 'none';
        loadRecipes();
    } catch (err) {
        console.error(err);
        alert('An error occurred while saving the recipe.');
    }
});

async function deleteRecipe(recipeId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You are not logged in!');
        return;
    }

    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            const errData = await response.json();
            alert(errData.error || 'Error deleting recipe');
            return;
        }
        alert('Recipe deleted successfully!');
        // Обновим список рецептов
        loadRecipes();
    } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the recipe.');
    }
}
