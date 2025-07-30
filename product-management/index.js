const openModal = async () => {
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

const closeModal = () =>{
    const modal = document.getElementById('addProductModal');
    if(modal) {
        modal.close();
    }
};

const addProduct = () =>{
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if(!Array.isArray(products)) products = [];

    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    if(!Array.isArray(categories)) categories = [];

    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productCategory = document.getElementById('product-category').value;
    const productStock = document.getElementById('product-stock').value;

    if(!productName || !productPrice || !productCategory || !productStock) {
        alert('Please complete all fields');
    }

    const product = {productName, productPrice, productCategory, productStock};
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    if(!categories.includes(productCategory)) {
        categories.push(productCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    closeModal();
    //countProducts();
    renderProducts();
};

const renderCategories = () => {
    const categoriesSelector = document.getElementById('categories');
    let categories = localStorage.getItem('categories');
    categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'select';
        div.innerHTML = `
            <option value="${category}">${category}</option>
        `;
        categoriesSelector.appendChild(div);
    })
};

const renderProducts = () => {
    let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    const productsList = document.getElementById('list-items');

    productsList.innerHTML = '';

    products.forEach((product, index) => {
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
                            <p class="value">${product.productStock}</p>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-button green" onclick=updateProduct(${index})>Edit</button>
                        <button class="action-button red" onclick=deleteProduct(${index})>Delete</button>
                    </div>   
            `
        productsList.appendChild(div);
    })
};

const countProducts = () => {
    let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    let count = products.length;

    const numberOfItems = document.getElementById('items-number');

    const div = document.createElement('div');
    div.innerHTML = ``;
    div.className = 'items-number';
    div.innerHTML = `<p>(${count})</p>`;

    numberOfItems.appendChild(div);
};

const deleteProduct = (index) => {
    let text = "Are you sure you want to delete this product?";
    if (confirm(text) === true) {
        let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        //countProducts();
        renderProducts();
    } else {
        alert("Be more careful next time! :)")
    }
};

const updateProduct = async (index) => {
    const products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    const product = products[index];

    const productName = product.productName
    const productPrice = product.productPrice;
    const productCategory = product.productCategory;
    const productStock = product.productStock;

    const modal = document.getElementById("addProductModal");
    if (modal) {
        try {
            const response = await fetch("../addProductModal/addProductModal.html");

        } catch (err) {
            console.error('Fetch error:', err);
            return;
        }
    }
};

const handleSortElements = () => {
    const orderSelectorValue = document.getElementById('order').value;
    let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];

    switch(orderSelectorValue) {
        case 'nameasc':
            sortAscendingByName(products);
            break;
        case 'namedsc':
            sortDescendingByName(products);
            break;
        case 'priceasc':
            sortAscendingByPrice(products);
            break;
        case 'pricedsc':
            sortDescendingByPrice(products);
            break;
        case 'stockasc':
            sortAscendingByStock(products);
            break;
        case 'stockdsc':
            sortDescendingByStock(products);
            break;
    }
};

const sortAscendingByName = (products) => {
    products.sort((a,b) => a.productName.localeCompare(b.productName));
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
};

const sortDescendingByName = (products) => {
    products.sort((a,b) => b.productName.localeCompare(a.productName));
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
};

const sortAscendingByPrice = (products) => {
    products.sort((a,b) => a.productPrice - b.productPrice);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
};

const sortDescendingByPrice = (products) => {
    products.sort((a,b) => b.productPrice - a.productPrice);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
};

const sortAscendingByStock = (products) => {
    products.sort((a,b) => a.productStock - b.productStock);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
};

const sortDescendingByStock = (products) => {
    products.sort((a,b) => b.productStock - a.productStock);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
};

const handleClearFilters = () => {
    let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    sortAscendingByName(products);
};