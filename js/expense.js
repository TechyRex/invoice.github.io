document.addEventListener('DOMContentLoaded', function() {
    // Currency handling
    const currencySelect = document.getElementById('expense-currency');
    const currencySymbol = document.querySelector('.currency-symbol');
    
    currencySelect.addEventListener('change', function() {
        currencySymbol.textContent = this.value;
    });
    
    // Category management
    const categorySelect = document.getElementById('expense-category');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const newCategoryInput = document.getElementById('new-category-input');
    const newCategoryName = document.getElementById('new-category-name');
    const saveCategoryBtn = document.getElementById('save-category-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    
    addCategoryBtn.addEventListener('click', function() {
        categorySelect.classList.add('hidden');
        addCategoryBtn.classList.add('hidden');
        newCategoryInput.classList.remove('hidden');
        newCategoryName.focus();
    });
    
    cancelCategoryBtn.addEventListener('click', function() {
        newCategoryInput.classList.add('hidden');
        categorySelect.classList.remove('hidden');
        addCategoryBtn.classList.remove('hidden');
        newCategoryName.value = '';
    });
    
    saveCategoryBtn.addEventListener('click', function() {
        const categoryName = newCategoryName.value.trim();
        if (categoryName) {
            // Add new option to select
            const newOption = document.createElement('option');
            newOption.value = categoryName;
            newOption.textContent = categoryName;
            categorySelect.appendChild(newOption);
            
            // Select the new option
            categorySelect.value = categoryName;
            
            // Reset UI
            newCategoryInput.classList.add('hidden');
            categorySelect.classList.remove('hidden');
            addCategoryBtn.classList.remove('hidden');
            newCategoryName.value = '';
        }
    });
    
    // Load saved categories from localStorage if available
    const savedCategories = JSON.parse(localStorage.getItem('expenseCategories')) || [];
    savedCategories.forEach(category => {
        if (!Array.from(categorySelect.options).some(opt => opt.value === category)) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    });
    
    // Save new categories to localStorage when added
    saveCategoryBtn.addEventListener('click', function() {
        const categoryName = newCategoryName.value.trim();
        if (categoryName && !savedCategories.includes(categoryName)) {
            savedCategories.push(categoryName);
            localStorage.setItem('expenseCategories', JSON.stringify(savedCategories));
        }
    });
    
    // Rest of your expense tracking functionality
    // ...
});