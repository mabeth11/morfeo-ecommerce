// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('El DOM ha cargado completamente. Iniciando JavaScript para Morfeo.');

    // --- 1. Validación de Formulario ---
    const contactForm = document.querySelector('#contacto form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            console.log('Intento de envío de formulario detectado.');

            const nombreInput = document.getElementById('nombre');
            const emailInput = document.getElementById('email');
            const mensajeInput = document.getElementById('mensaje');

            let isValid = true;

            if (nombreInput.value.trim() === '') {
                alert('Por favor, ingresa tu nombre.');
                nombreInput.focus();
                isValid = false;
                return; 
            }

            if (emailInput.value.trim() === '') {
                alert('Por favor, ingresa tu correo electrónico.');
                emailInput.focus();
                isValid = false;
                return;
            } else if (!isValidEmail(emailInput.value.trim())) {
                alert('Por favor, ingresa un formato de correo electrónico válido.');
                emailInput.focus();
                isValid = false;
                return;
            }

            if (mensajeInput.value.trim() === '') {
                alert('Por favor, ingresa tu mensaje.');
                mensajeInput.focus();
                isValid = false;
                return;
            }

            if (isValid) {
                console.log('Formulario validado correctamente. Enviar a Formspree...');
                alert('¡Gracias por tu mensaje! Lo recibimos y te responderemos pronto.');
                this.submit(); 
            }
        });
    } else {
        console.warn('Formulario de contacto no encontrado en el DOM.');
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // --- 2. Carrito de Compras Dinámico y Persistente ---

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const floatingCartIcon = document.querySelector('.floating-cart-icon');
    const floatingCartCountSpan = floatingCartIcon ? floatingCartIcon.querySelector('.cart-count') : null;
    
    const carritoSection = document.getElementById('carrito');
    const carritoItemsList = carritoSection ? carritoSection.querySelector('.carrito-items-list') : null;
    const cartTotalElement = document.getElementById('cart-total');
    
    // Referencias a los botones del carrito y su contenedor
    const buyButton = document.getElementById('buy-button');
    const clearCartButton = document.getElementById('clear-cart-button');
    const carritoActionsDiv = document.querySelector('.carrito-actions'); 

    function saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartDisplay();
        alert(`"${product.title}" ha sido añadido al carrito.`);
        console.log('Carrito actual:', cartItems);
    }

    function removeFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        saveCart();
        updateCartDisplay();
        console.log('Producto eliminado. Carrito actual:', cartItems);
    }

    function updateQuantity(productId, newQuantity) {
        const item = cartItems.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId); 
            } else {
                item.quantity = newQuantity;
                saveCart();
                updateCartDisplay();
            }
        }
    }

    /**
     * Vacía completamente el carrito.
     */
    function clearCart() {
        cartItems = [];
        saveCart();
        updateCartDisplay();
        alert('El carrito ha sido vaciado.');
        console.log('Carrito vaciado.');
    }

    /**
     * Lógica al hacer clic en el botón "Comprar".
     */
    function handleBuy() {
        if (cartItems.length === 0) {
            alert('Tu carrito está vacío. ¡Añade algunos vinilos antes de comprar!');
            return;
        }
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`¡Gracias por tu compra en Morfeo! El total es: $${total.toFixed(2)}. (Esta es una simulación)`);
        console.log('Procesando compra...');
        clearCart(); // Opcional: Vaciar el carrito después de una "compra" simulada
    }


    /**
     * Actualiza la visualización del carrito: contador en el ícono flotante, lista de productos, total y visibilidad de los botones.
     */
    function updateCartDisplay() {
        // Contador en el Ícono Flotante
        if (floatingCartCountSpan) {
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            floatingCartCountSpan.textContent = totalItems;
            floatingCartCountSpan.style.display = totalItems > 0 ? 'flex' : 'none'; 
        }

        // Visualización detallada en la sección #carrito
        if (carritoItemsList) {
            carritoItemsList.innerHTML = ''; 
            let totalCompra = 0;

            if (cartItems.length === 0) {
                carritoItemsList.innerHTML = '<p>El carrito está vacío.</p>';
                // OCULTAR botones y total si el carrito está vacío
                if (cartTotalElement) cartTotalElement.style.display = 'none';
                if (carritoActionsDiv) carritoActionsDiv.style.display = 'none';

            } else {
                cartItems.forEach(item => {
                    const listItem = document.createElement('li');
                    const itemTotalPrice = item.price * item.quantity;
                    totalCompra += itemTotalPrice;

                    listItem.innerHTML = `
                        <span>${item.title}</span>
                        <input type="number" min="1" value="${item.quantity}" class="item-quantity" data-id="${item.id}">
                        <span>x $${item.price.toFixed(2)} = <strong>$${itemTotalPrice.toFixed(2)}</strong></span>
                        <button class="remove-item-btn" data-id="${item.id}">Eliminar</button>
                    `;
                    carritoItemsList.appendChild(listItem);
                });

                // MOSTRAR botones y total si hay productos
                if (cartTotalElement) {
                    cartTotalElement.textContent = `$${totalCompra.toFixed(2)}`;
                    cartTotalElement.style.display = 'block'; 
                }
                if (carritoActionsDiv) carritoActionsDiv.style.display = 'flex'; 
            }

            // Añadir event listeners a los nuevos elementos de cantidad y eliminar
            document.querySelectorAll('.item-quantity').forEach(input => {
                input.addEventListener('change', (e) => {
                    const productId = e.target.dataset.id;
                    const newQuantity = parseInt(e.target.value);
                    if (!isNaN(newQuantity)) {
                        updateQuantity(productId, newQuantity);
                    }
                });
            });

            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    removeFromCart(productId);
                });
            });
        }
    }

    // Inicializar la visualización del carrito y los botones al cargar la página
    updateCartDisplay();

    // Event Listeners para los botones
    if (buyButton) {
        buyButton.addEventListener('click', handleBuy);
    } else {
        console.warn('Botón "Comprar" no encontrado.');
    }

    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    } else {
        console.warn('Botón "Vaciar Carrito" no encontrado.');
    }


    // --- 3. Consumo de API REST (DummyJSON) y Visualización de Productos ---

    const PRODUCTS_API_URL = 'https://dummyjson.com/products?limit=8'; 
    const productsContainer = document.querySelector('#productos .lista-vinilos');

    async function fetchProducts() {
        if (!productsContainer) {
            console.error('Contenedor de productos no encontrado.');
            return;
        }

        productsContainer.innerHTML = '<p>Cargando vinilos de Morfeo...</p>'; 

        try {
            const response = await fetch(PRODUCTS_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const products = data.products; 

            console.log('Productos obtenidos de DummyJSON:', products);
            displayProducts(products);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            productsContainer.innerHTML = '<p>No se pudieron cargar los vinilos. Intenta de nuevo más tarde.</p>';
        }
    }

    function displayProducts(products) {
        productsContainer.innerHTML = ''; 

        if (products.length === 0) {
            productsContainer.innerHTML = '<p>No hay vinilos disponibles en este momento.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('article');
            productCard.className = 'vinilo-card';

            const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/250x250/ccc/fff?text=No+Image'; 
            const title = product.title || 'Vinilo Desconocido';
            const price = product.price || 0.00;

            productCard.innerHTML = `
                <h3>${title}</h3>
                <img src="${imageUrl}" alt="${title}">
                <p>Precio: $${price.toFixed(2)}</p>
                <button class="add-to-cart" 
                        data-id="${product.id}"
                        data-title="${title}" 
                        data-price="${price}">Añadir al carrito</button>
            `;

            const addButton = productCard.querySelector('.add-to-cart');
            addButton.addEventListener('click', () => {
                addToCart({
                    id: product.id,
                    title: title,
                    price: price
                });
            });

            productsContainer.appendChild(productCard);
        });
    }

    fetchProducts();

    // --- 4. Navegación Suave ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});