// Variables globales
let token = localStorage.getItem('token') || null;
let currentUser = null;

// URLs de la API
const API_URL = 'http://localhost:8080/api';
const USERS_URL = `${API_URL}/users`;
const SESSIONS_URL = `${API_URL}/sessions`;
const PRODUCTS_URL = `${API_URL}/products`;

// Elementos DOM
const authSection = document.getElementById('auth-section');
const productsSection = document.getElementById('products-section');
const adminSection = document.getElementById('admin-section');
const adminSectionTab = document.getElementById('admin-section-tab');
const userInfo = document.getElementById('userInfo');
const userInfoContent = document.getElementById('userInfoContent');
const productsList = document.getElementById('productsList');
const logoutBtn = document.getElementById('logoutBtn');
const alertElement = document.getElementById('alert');

// Formularios
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const productForm = document.getElementById('productForm');
const autoFillBtn = document.getElementById('autoFillBtn');

// Funciones de utilidad
function showAlert(message, type = 'danger') {
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.classList.remove('hidden');
    setTimeout(() => {
        alertElement.classList.add('hidden');
    }, 3000);
}

function setAuthHeader() {
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// Navegación entre secciones
document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Mostrar la sección seleccionada
        document.getElementById(sectionId).classList.remove('hidden');
        
        // Actualizar estado activo en la navegación
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Registro de usuario
registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value),
        password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch(USERS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Usuario registrado con éxito. Ahora puedes iniciar sesión.', 'success');
            registerForm.reset();
        } else {
            showAlert(`Error: ${data.message || 'No se pudo registrar el usuario'}`);
        }
    } catch (error) {
        showAlert(`Error: ${error.message}`);
    }
});

// Autorrelleno de credenciales de administrador
autoFillBtn.addEventListener('click', function() {
    document.getElementById('loginEmail').value = 'admin@example.com';
    document.getElementById('loginPassword').value = 'admin123456';
});

// Login de usuario
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const credentials = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };
    
    try {
        const response = await fetch(`${SESSIONS_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.data.token;
            localStorage.setItem('token', token);
            showAlert('Inicio de sesión exitoso', 'success');
            loginForm.reset();
            
            // Actualizar UI después del login
            await getCurrentUser();
            loadProducts();
        } else {
            showAlert(`Error: ${data.message || 'Credenciales inválidas'}`);
        }
    } catch (error) {
        showAlert(`Error: ${error.message}`);
    }
});

// Obtener usuario actual
async function getCurrentUser() {
    if (!token) {
        logoutBtn.classList.add('d-none');
        userInfo.classList.add('d-none');
        adminSectionTab.style.display = 'none';
        return null;
    }
    
    try {
        const response = await fetch(`${SESSIONS_URL}/current`, {
            method: 'GET',
            headers: setAuthHeader()
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.data.user;
            
            // Mostrar info de usuario
            userInfoContent.innerHTML = `
                <p><strong>Nombre:</strong> ${currentUser.first_name} ${currentUser.last_name}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Rol:</strong> ${currentUser.role}</p>
            `;
            userInfo.classList.remove('d-none');
            logoutBtn.classList.remove('d-none');
            
            // Mostrar tab de admin si corresponde
            if (currentUser.role === 'admin') {
                adminSectionTab.style.display = 'block';
            } else {
                adminSectionTab.style.display = 'none';
            }
            
            return currentUser;
        } else {
            // Token inválido
            logout();
            return null;
        }
    } catch (error) {
        showAlert(`Error: ${error.message}`);
        return null;
    }
}

// Cerrar sesión
function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    userInfo.classList.add('d-none');
    logoutBtn.classList.add('d-none');
    adminSectionTab.style.display = 'none';
    
    // Volver a la sección de autenticación
    document.querySelector('[data-section="auth-section"]').click();
}

logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    logout();
    showAlert('Sesión cerrada correctamente', 'info');
});

// Cargar productos
async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_URL);
        
        if (response.ok) {
            const data = await response.json();
            const products = data.data.products;
            
            // Mostrar productos
            productsList.innerHTML = products.length > 0 ? '' : '<p class="col-12">No hay productos disponibles</p>';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'col-md-4 mb-4';
                productCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
                            <p class="card-text"><strong>Stock:</strong> ${product.stock} unidades</p>
                            <button class="btn btn-primary add-to-cart" data-id="${product._id}">Agregar al carrito</button>
                            ${currentUser && currentUser.role === 'admin' ? `
                                <button class="btn btn-danger delete-product mt-2" data-id="${product._id}">Eliminar</button>
                            ` : ''}
                        </div>
                    </div>
                `;
                productsList.appendChild(productCard);
            });
            
            // Agregar eventos a los botones de los productos
            document.querySelectorAll('.delete-product').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    deleteProduct(productId);
                });
            });
            
            // Acá iría la lógica para agregar productos al carrito
        } else {
            showAlert('Error al cargar los productos');
        }
    } catch (error) {
        showAlert(`Error: ${error.message}`);
    }
}

// Agregar producto (admin)
productForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!currentUser || currentUser.role !== 'admin') {
        showAlert('No tienes permisos para realizar esta acción');
        return;
    }
    
    const productData = {
        title: document.getElementById('productTitle').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value || 'https://via.placeholder.com/150'
    };
    
    try {
        const response = await fetch(PRODUCTS_URL, {
            method: 'POST',
            headers: setAuthHeader(),
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Producto agregado con éxito', 'success');
            productForm.reset();
            loadProducts();
        } else {
            showAlert(`Error: ${data.message || 'No se pudo agregar el producto'}`);
        }
    } catch (error) {
        showAlert(`Error: ${error.message}`);
    }
});

// Eliminar producto (admin)
async function deleteProduct(productId) {
    if (!currentUser || currentUser.role !== 'admin') {
        showAlert('No tienes permisos para realizar esta acción');
        return;
    }
    
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${PRODUCTS_URL}/${productId}`, {
            method: 'DELETE',
            headers: setAuthHeader()
        });
        
        if (response.ok) {
            showAlert('Producto eliminado con éxito', 'success');
            loadProducts();
        } else {
            const data = await response.json();
            showAlert(`Error: ${data.message || 'No se pudo eliminar el producto'}`);
        }
    } catch (error) {
        showAlert(`Error: ${error.message}`);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    if (token) {
        await getCurrentUser();
    }
    loadProducts();
});

// Crear un usuario administrador al inicio para pruebas
async function createAdminUser() {
    const adminExists = localStorage.getItem('adminCreated');
    
    if (adminExists) {
        return;
    }
    
    const adminData = {
        first_name: "Admin",
        last_name: "Ecommerce",
        email: "admin@example.com",
        age: 30,
        password: "admin123456",
        role: "admin"
    };
    
    try {
        const response = await fetch(USERS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });
        
        if (response.ok) {
            localStorage.setItem('adminCreated', 'true');
            console.log('Usuario administrador creado: admin@example.com / admin123456');
        }
    } catch (error) {
        console.error('Error al crear admin:', error);
    }
}

// Crear algunos productos de ejemplo
async function createSampleProducts() {
    const productsCreated = localStorage.getItem('productsCreated');
    
    if (productsCreated) {
        return;
    }
    
    // Primero autenticamos como admin
    try {
        const loginResponse = await fetch(`${SESSIONS_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: "admin@example.com",
                password: "admin123456"
            })
        });
        
        const loginData = await loginResponse.json();
        
        if (!loginResponse.ok) {
            return;
        }
        
        const adminToken = loginData.data.token;
        
        // Productos de ejemplo
        const sampleProducts = [
            {
                title: "Smartphone Galaxy S23",
                description: "Samsung Galaxy S23 con 256GB de almacenamiento",
                price: 799.99,
                stock: 25,
                category: "Electrónica",
                image: "https://via.placeholder.com/150?text=Galaxy+S23"
            },
            {
                title: "MacBook Pro 2023",
                description: "MacBook Pro con procesador M2 Pro, 16GB RAM y 512GB SSD",
                price: 1999.99,
                stock: 10,
                category: "Computadoras",
                image: "https://via.placeholder.com/150?text=MacBook+Pro"
            },
            {
                title: "Zapatillas Running",
                description: "Zapatillas para running con amortiguación especial",
                price: 89.99,
                stock: 50,
                category: "Deportes",
                image: "https://via.placeholder.com/150?text=Zapatillas"
            },
            {
                title: "Smart TV 55 pulgadas",
                description: "Smart TV 4K OLED con Android TV integrado",
                price: 699.99,
                stock: 15,
                category: "Electrónica",
                image: "https://via.placeholder.com/150?text=Smart+TV"
            }
        ];
        
        // Crear los productos
        for (const product of sampleProducts) {
            await fetch(PRODUCTS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(product)
            });
        }
        
        localStorage.setItem('productsCreated', 'true');
        console.log('Productos de ejemplo creados');
        
    } catch (error) {
        console.error('Error al crear productos de ejemplo:', error);
    }
}

// Crear datos de ejemplo
createAdminUser().then(() => {
    setTimeout(() => {
        createSampleProducts();
    }, 1000);
}); 