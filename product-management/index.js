let editIndex = null;
let deleteIndex = null;
let bulkDeleteIndexes = [];

const getProducts = () => JSON.parse(localStorage.getItem('products')) || [];
const getCategories = () => JSON.parse(localStorage.getItem('categories')) || [];

const openAddModal = async () => {
    const template = document.getElementById("add-product-template");
    const clone = template.content.cloneNode(true);
    document.body.appendChild(clone);

    const modal = document.getElementById("addProductModal");
    if (modal) {
        modal.showModal();
    }
};

const closeAddModal = () => {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.close();
        modal.remove();
    }
};

const openDeleteModal = async (productId) => {
    const products = getProducts();
    const index = products.findIndex(p => p.productId === productId);
    if (index === -1) {
        return;
    }
    deleteIndex = index;

    const template = document.getElementById("delete-product-template");
    const clone = template.content.cloneNode(true);
    document.body.appendChild(clone);

    const modal = document.getElementById("deleteProductModal");
    if (modal) {
        modal.showModal();
    }
};

const closeDeleteModal = () => {
    const modal = document.getElementById('deleteProductModal');
    if (modal) {
        deleteIndex = null;
        modal.close();
        modal.remove();
    }
};

const openBulkDeleteModal = async () => {
    const checkboxes = document.getElementsByClassName('bulk-delete');
    const checked = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    bulkDeleteIndexes = checked.map(checkbox => checkbox.getAttribute('data-id'));

    if (bulkDeleteIndexes.length < 2) {
        alert("Please select at least 2 products to delete.");
        return;
    }

    const template = document.getElementById("delete-product-template");
    const clone = template.content.cloneNode(true);
    document.body.appendChild(clone);

    const modal = document.getElementById("deleteProductModal");

    const title = document.getElementById('delete-modal-title');
    if (title) {
        title.textContent = "Delete Products";
    }

    const description = document.getElementById('delete-modal-body');
    if (description) {
        description.textContent = "Are you sure you want to delete the selected products?";
    }

    const deleteButton = document.getElementById('delete-button');
    if (deleteButton) {
        deleteButton.textContent = "Delete Products";
    }
    modal.showModal();

};

const addProduct = () => {
    let products = getProducts()
    if (!Array.isArray(products)) products = [];

    let categories = getCategories()
    if (!Array.isArray(categories)) categories = [];

    const productId = products[editIndex] ? products[editIndex].productId : crypto.randomUUID();
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productCategory = document.getElementById('product-category').value;
    const productStock = document.getElementById('product-stock').value;

    if (!productName || !productPrice || productPrice <= 0 || !productCategory || !productStock || productStock < 0) {
        alert('Please fill all fields with valid values!');
        return;
    }

    const product = {productId, productName, productPrice, productCategory, productStock};
    if (editIndex !== null) {
        const pCategory = products[editIndex].productCategory;
        products[editIndex] = product;
        editIndex = null;

        const pCategoryExists = products.some(p => p.productCategory === pCategory);
        if (!pCategoryExists) {
            categories = categories.filter(c => c !== pCategory);
            localStorage.setItem('categories', JSON.stringify(categories));
        }
    } else {
        if (products.find(p => p.productName === productName)) {
            alert('Product name already exists!');
            return;
        }
        products.push(product);
    }
    localStorage.setItem('products', JSON.stringify(products));

    if (!categories.includes(productCategory)) {
        categories.push(productCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    closeAddModal();
    countProducts();
    renderProducts();
    renderCategories();
};

const renderCategories = () => {
    const categoriesSelector = document.getElementById('categories');
    let categories = getCategories();

    categoriesSelector.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Categories';
    categoriesSelector.appendChild(allOption);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoriesSelector.appendChild(option);
    });
};

const renderProducts = (products = null) => {
    if (!products) {
        products = getProducts();
    }

    const productsList = document.getElementById('list-items');
    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.className = 'list-items-empty';
        productsList.innerHTML =
            `
                <div class="list-text">
                    No products available.
                </div>
            `;
    } else {
        productsList.className = 'list-items';
        products.forEach((product) => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML =
                `       
                    <div class="product-header">
                        <p class="product-name-p">${product.productName}</p>
                        <input class="bulk-delete" type="checkbox" id="bulk-delete" name="Bulk Delete" data-id="${product.productId}"/>
                    </div>
                    <div class="product-content">
                        <div class="product-properties">
                            <p class="label">Price:</p>
                            <div class="price-group">
                                <p class="value">$</p>
                                <p class="value">${product.productPrice}</p>
                            </div>
                        </div>
                        <div class="product-properties category">
                            <p class="label">Category:</p>
                            <p class="category-value">${product.productCategory}</p>
                        </div>
                        <div class="product-properties">
                            <p class="label">Stock:</p>
                            <p class="value">
                              ${product.productStock} ${addStockLabel(product.productStock)}
                            </p>
                        </div>
                    </div>
                    <div class="product-footer">
                        <button class="product-action-button green" onclick=updateProduct('${product.productId}')>Edit</button>
                        <button class="product-action-button red" onclick=openDeleteModal('${product.productId}')>Delete</button>
                    </div>   
            `;
            productsList.appendChild(div);
        })
    }
};

const addStockLabel = (stock) => {
    if (stock == 0) {
        return `<span>(Out of Stock)</span>`;
    } else if (stock < 5) {
        return `<span>(Low Stock)</span>`;
    } else if (stock > 50) {
        return `<span>(High Stock)</span>`;
    } else {
        return ``;
    }
};

const countProducts = (products = null) => {
    if (!products) {
        products = getProducts();
    }
    let count = products.length;
    const numberOfItems = document.getElementById('items-number');
    numberOfItems.innerHTML = `<p>(${count})</p>`;
};

const updateProduct = async (productId) => {
    const products = getProducts();
    const index = products.findIndex(p => p.productId === productId);

    if (index === -1) {
        return;
    }
    editIndex = index;

    let existing = document.getElementById("addProductModal");
    if (existing) {
        existing.remove();
    }

    const template = document.getElementById("add-product-template");

    const clone = template.content.cloneNode(true);
    document.body.appendChild(clone);

    const modal = document.getElementById("addProductModal");
    if (!modal) return;

    const product = products[editIndex];

    document.getElementById('product-name').value = product.productName;
    document.getElementById('product-price').value = product.productPrice;
    document.getElementById('product-category').value = product.productCategory;
    document.getElementById('product-stock').value = product.productStock;

    const title = document.getElementById('modal-title');
    if (title) {
        title.textContent = `Edit Product`;
    }

    const submitButton = document.getElementById('submit-button');
    if (submitButton) {
        submitButton.textContent = 'Edit Product';
    }

    modal.showModal();
};

const deleteProduct = () => {
    if (bulkDeleteIndexes && bulkDeleteIndexes.length > 0) {
        handleBulkDelete();
    } else {
        let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
        const deleteProduct = products[deleteIndex];
        const deletedCategory = deleteProduct.productCategory;

        products.splice(deleteIndex, 1);
        localStorage.setItem('products', JSON.stringify(products));

        const checkCategory = products.some(p => p.productCategory === deletedCategory);
        if (!checkCategory) {
            let categories = JSON.parse(localStorage.getItem('categories')) || [];
            categories = categories.filter(category => category !== deletedCategory);
            localStorage.setItem('categories', JSON.stringify(categories));
        }

        closeDeleteModal();
        countProducts();
        renderProducts();
        renderCategories();
    }
};

const handleClearFilters = () => {
    document.getElementById('categories').value = 'all';
    document.getElementById('order').value = 'nameasc';
    document.getElementById('search').value = '';

    const products = getProducts();
    products.sort((a, b) => a.productName.localeCompare(b.productName));

    renderProducts(products);
    countProducts(products);
};

const refreshPage = () => {
    let products = getProducts();

    const selectedCategory = document.getElementById('categories').value;
    if (selectedCategory !== 'all') {
        products = products.filter(p => p.productCategory === selectedCategory);
    }

    const searchValue = document.getElementById('search').value.toLowerCase();
    if (searchValue) {
        products = products.filter(p => p.productName.toLowerCase().includes(searchValue));
    }

    const orderSelectorValue = document.getElementById('order').value;
    switch (orderSelectorValue) {
        case 'nameasc':
            products.sort((a, b) => a.productName.localeCompare(b.productName));
            break;
        case 'namedsc':
            products.sort((a, b) => b.productName.localeCompare(a.productName));
            break;
        case 'priceasc':
            products.sort((a, b) => a.productPrice - b.productPrice);
            break;
        case 'pricedsc':
            products.sort((a, b) => b.productPrice - a.productPrice);
            break;
        case 'stockasc':
            products.sort((a, b) => a.productStock - b.productStock);
            break;
        case 'stockdsc':
            products.sort((a, b) => b.productStock - a.productStock);
            break;
    }

    renderProducts(products);
    countProducts(products);
};

const handleBulkDelete = () => {
    let products = getProducts();
    const remainingProducts = products.filter(p => !bulkDeleteIndexes.includes(p.productId));
    const deletedProducts = products.filter(p => bulkDeleteIndexes.includes(p.productId));
    const deletedProductsCategory = deletedProducts.map(p => p.productCategory);

    localStorage.setItem('products', JSON.stringify(remainingProducts));
    bulkDeleteIndexes = [];

    let categories = getCategories();
    deletedProductsCategory.forEach(category => {
        const stillExists = remainingProducts.some(p => p.productCategory === category);
        if (!stillExists) {
            categories = categories.filter(c => c !== category);
        }
    });
    localStorage.setItem('categories', JSON.stringify(categories));

    closeDeleteModal();
    countProducts();
    renderProducts();
    renderCategories();
};