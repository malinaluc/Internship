let editIndex = null;
let deleteIndex = null;

const getProducts = () => JSON.parse(localStorage.getItem('products')) || [];
const getCategories = () => JSON.parse(localStorage.getItem('categories')) || [];

const openAddModal = async () => {
    const modal = document.getElementById("addProductModal");

    if (modal) {
        try {
            const response = await fetch("../addProductModal/addProductModal.html");
            modal.innerHTML = await response.text();
        } catch (err) {
            console.error('Fetch error:', err);
            return;
        }
    }
    modal.showModal();
};

const closeAddModal = () => {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.close();
    }
};

const openDeleteModal = async (productId) => {
    const products = getProducts();
    const index = products.findIndex(p => p.productId === productId);
    if (index === -1) {
        return;
    }
    deleteIndex = index;

    const modal = document.getElementById("deleteProductModal");

    if (modal) {
        try {
            const response = await fetch("../deleteProductModal/deleteProductModal.html");
            modal.innerHTML = await response.text();
        } catch (err) {
            console.error('Fetch error:', err);
            return;
        }
    }
    modal.showModal();
};

const closeDeleteModal = () => {
    const modal = document.getElementById('deleteProductModal');
    if (modal) {
        deleteIndex = null;
        modal.close();
    }
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
                    <p class="product-name-p">${product.productName}</p>
                    <div>
                        <div class="product-price-p">
                            <p class="label">Price:</p>
                            <div class="price-group">
                                <p class="value">$</p>
                                <p class="value">${product.productPrice}</p>
                            </div>
                        </div>
                        <div class="product-category-p">
                            <p class="label">Category:</p>
                            <p class="category-value">${product.productCategory}</p>
                        </div>
                        <div class="product-stock-p">
                            <p class="label">Stock:</p>
                            <p class="value">
                              ${product.productStock} ${addStockLabel(product.productStock)}
                            </p>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-button green" onclick=updateProduct('${product.productId}')>Edit</button>
                        <button class="action-button red" onclick=openDeleteModal('${product.productId}')>Delete</button>
                    </div>   
            `;
            productsList.appendChild(div);
        })
    }
};

const addStockLabel = (stock) => {
    if (stock === 0) {
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

    const modal = document.getElementById("addProductModal");
    if (modal) {
        try {
            const response = await fetch("../addProductModal/addProductModal.html");
            modal.innerHTML = await response.text();

            const products = getProducts();
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
                submitButton.textContent = 'Save';
            }

            modal.showModal();
        } catch (err) {
            console.error('Fetch error:', err);
            return;
        }
    }
};

const deleteProduct = () => {
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