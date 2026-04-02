// --- State Management ---
const initialServices = [
    { id: 1, name: 'Corte de Autor', price: 350, duration: '45 min', icon: 'fa-cut', featured: true },
    { id: 2, name: 'Ritual de Barba', price: 250, duration: '30 min', icon: 'fa-broom', featured: true },
    { id: 3, name: 'Corte + Barba', price: 500, duration: '75 min', icon: 'fa-user-tie', featured: false },
    { id: 4, name: 'Perfilado de Ceja', price: 100, duration: '15 min', icon: 'fa-eye', featured: false }
];

const initialProducts = [
    { id: 101, name: 'Playera Barber', price: 450, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400', featured: true },
    { id: 102, name: 'Gorra Barber Premium', price: 380, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400', featured: true },
    { id: 103, name: 'Pomada para Cabello', price: 220, image: 'https://images.unsplash.com/photo-1599305090598-fe179d501c27?auto=format&fit=crop&q=80&w=400', featured: false },
    { id: 104, name: 'Aceite para Barba', price: 280, image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?auto=format&fit=crop&q=80&w=400', featured: false }
];

let state = {
    view: 'home',
    cart: JSON.parse(localStorage.getItem('barber_cart')) || [],
    booking: JSON.parse(localStorage.getItem('barber_booking')) || null,
    allBookings: JSON.parse(localStorage.getItem('barber_all_bookings')) || [],
    services: JSON.parse(localStorage.getItem('barber_services')) || initialServices,
    products: JSON.parse(localStorage.getItem('barber_products')) || initialProducts,
    isAdmin: sessionStorage.getItem('barber_admin') === 'true'
};

// --- Navigation ---
function navigateTo(viewId, event) {
    if (event) event.preventDefault();
    
    // Admin route protection
    if (viewId === 'admin-dash' && !state.isAdmin) {
        viewId = 'admin-login';
    }
    
    // Update State
    state.view = viewId;
    
    // Update UI
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${viewId}'`)) {
            item.classList.add('active');
        }
    });

    window.scrollTo(0, 0);
    renderView();
}

// --- Render Logic ---
function renderView() {
    switch (state.view) {
        case 'home':
            renderHome();
            break;
        case 'servicios':
            renderServices();
            break;
        case 'tienda':
            renderStore();
            break;
        case 'carrito':
            renderCart();
            break;
        case 'checkout':
            renderCheckout();
            break;
        case 'admin-dash':
            renderAdminDashboard();
            break;
    }
    updateCartBadge();
}

function renderAdminDashboard() {
    // 1. Render Services Prices
    const servicesList = document.getElementById('admin-services-list');
    servicesList.innerHTML = state.services.map(s => `
        <div class="form-group" style="margin-bottom: 1rem">
            <label style="color: var(--text); font-size: 0.9rem">${s.name}</label>
            <div style="display: flex; gap: 0.5rem; align-items: center">
                <span style="color: var(--gold)">$</span>
                <input type="number" class="service-price-input" data-id="${s.id}" value="${s.price}" style="padding: 0.5rem">
            </div>
        </div>
    `).join('');

    // 2. Render Scheduled Bookings
    const bookingsList = document.getElementById('admin-bookings-list');
    if (state.allBookings.length === 0) {
        bookingsList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1rem">No hay citas agendadas.</p>`;
    } else {
        bookingsList.innerHTML = state.allBookings.sort((a, b) => new Date(a.date) - new Date(b.date)).map(b => {
            const service = state.services.find(s => s.id == b.serviceId);
            const statusColor = b.status === 'Confirmada' ? 'var(--success)' : (b.status === 'Cancelada' ? 'var(--danger)' : 'var(--gold)');
            return `
                <div class="card" style="margin-bottom: 0.8rem; border-color: ${statusColor}; padding: 0.8rem">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start">
                        <div style="flex: 1">
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <h4 style="font-size: 0.95rem; color: var(--gold)">${b.name}</h4>
                                <span style="font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 20px; background: ${statusColor}; color: #000; font-weight: 800">${b.status || 'Pendiente'}</span>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.2rem 0">
                                <i class="fas fa-cut"></i> ${service ? service.name : 'Servicio desconocido'}
                            </p>
                            <p style="font-size: 0.8rem; color: var(--text)">
                                <i class="fas fa-calendar"></i> ${b.date} | <i class="fas fa-clock"></i> ${b.time}
                            </p>
                            <p style="font-size: 0.8rem; color: var(--text-muted)">
                                <i class="fab fa-whatsapp"></i> ${b.phone}
                            </p>
                            ${b.proof ? `
                                <div style="margin-top: 0.5rem">
                                    <button class="btn btn-outline" style="padding: 0.3rem; font-size: 0.7rem; width: auto" onclick="viewProof('${b.proof}')">
                                        <i class="fas fa-eye"></i> Ver Comprobante
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem">
                        <button class="btn btn-primary" onclick="confirmAndNotify(${b.id})" style="padding: 0.4rem; font-size: 0.7rem; background: var(--success); color: #000">Confirmar & Notificar</button>
                        <button class="btn btn-outline" onclick="updateBookingStatus(${b.id}, 'Cancelada')" style="padding: 0.4rem; font-size: 0.7rem; border-color: var(--danger); color: var(--danger)">Cancelar</button>
                        <button onclick="deleteBooking(${b.id})" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.5rem">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 3. Render Product Management
    const productsList = document.getElementById('admin-products-list');
    productsList.innerHTML = state.products.map(p => `
        <div class="card" style="margin-bottom: 1rem; border-color: #333">
            <div style="display: flex; gap: 1rem; align-items: center">
                <img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px">
                <div style="flex: 1">
                    <input type="text" class="edit-prod-name" data-id="${p.id}" value="${p.name}" 
                           style="padding: 0.3rem; margin-bottom: 0.3rem; font-size: 0.9rem; background: transparent; border: 1px solid #444">
                    <div style="display: flex; align-items: center; gap: 0.5rem">
                        <span style="color: var(--gold); font-size: 0.8rem">$</span>
                        <input type="number" class="edit-prod-price" data-id="${p.id}" value="${p.price}" 
                               style="padding: 0.3rem; width: 80px; font-size: 0.8rem; background: transparent; border: 1px solid #444">
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem">
                    <button class="btn btn-primary" onclick="updateProduct(${p.id})" style="padding: 0.4rem; width: auto; font-size: 0.7rem">
                        <i class="fas fa-save"></i>
                    </button>
                    <button class="btn btn-outline" onclick="deleteProduct(${p.id})" style="padding: 0.4rem; width: auto; font-size: 0.7rem; border-color: var(--danger); color: var(--danger)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function deleteBooking(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
        state.allBookings = state.allBookings.filter(b => b.id !== id);
        localStorage.setItem('barber_all_bookings', JSON.stringify(state.allBookings));
        showToast('Cita eliminada');
        renderAdminDashboard();
    }
}

function updateBookingStatus(id, newStatus) {
    const booking = state.allBookings.find(b => b.id === id);
    if (booking) {
        booking.status = newStatus;
        localStorage.setItem('barber_all_bookings', JSON.stringify(state.allBookings));
        showToast(`Cita ${newStatus.toLowerCase()} exitosamente`);
        renderAdminDashboard();
    }
}

function confirmAndNotify(id) {
    const booking = state.allBookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'Confirmada';
        localStorage.setItem('barber_all_bookings', JSON.stringify(state.allBookings));
        
        // Prepare WhatsApp confirmation message
        const service = state.services.find(s => s.id == booking.serviceId);
        const message = `✅ *¡Cita Confirmada!*\n\nHola ${booking.name}, tu pago ha sido verificado. Te esperamos:\n\n✂️ *Servicio:* ${service.name}\n📅 *Fecha:* ${booking.date}\n⏰ *Hora:* ${booking.time}\n📍 *Ubicación:* BarberLA\n\n¡Gracias por tu confianza!`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${booking.phone}?text=${encodedMessage}`, '_blank');
        
        showToast('Cita confirmada y notificación preparada');
        renderAdminDashboard();
    }
}

function viewProof(base64) {
    const modal = document.getElementById('image-viewer');
    const fullImg = document.getElementById('full-image');
    modal.style.display = "block";
    fullImg.src = base64;
}

function closeImageViewer() {
    document.getElementById('image-viewer').style.display = "none";
}

function updateProduct(id) {
    const nameInput = document.querySelector(`.edit-prod-name[data-id="${id}"]`);
    const priceInput = document.querySelector(`.edit-prod-price[data-id="${id}"]`);
    
    const product = state.products.find(p => p.id === id);
    if (product) {
        product.name = nameInput.value;
        product.price = parseFloat(priceInput.value);
        
        localStorage.setItem('barber_products', JSON.stringify(state.products));
        showToast('Producto actualizado');
        renderView(); // Refresh everything
    }
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        state.products = state.products.filter(p => p.id !== id);
        localStorage.setItem('barber_products', JSON.stringify(state.products));
        showToast('Producto eliminado');
        renderAdminDashboard();
        if (state.view === 'home') renderHome();
        if (state.view === 'tienda') renderStore();
    }
}

function saveServicePrices() {
    const inputs = document.querySelectorAll('.service-price-input');
    inputs.forEach(input => {
        const id = parseInt(input.dataset.id);
        const newPrice = parseFloat(input.value);
        const service = state.services.find(s => s.id === id);
        if (service && !isNaN(newPrice)) {
            service.price = newPrice;
        }
    });

    localStorage.setItem('barber_services', JSON.stringify(state.services));
    showToast('Precios de servicios actualizados');
    
    // Refresh relevant views
    if (state.view === 'home') renderHome();
    if (state.view === 'servicios') renderServices();
    
    // Update booking select
    const serviceSelect = document.getElementById('booking-service');
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="">Selecciona un servicio</option>' + 
            state.services.map(s => `<option value="${s.id}">${s.name} - $${s.price}</option>`).join('');
    }
}

function renderHome() {
    const featServices = state.services.filter(s => s.featured);
    const featProducts = state.products.filter(p => p.featured);
    
    document.getElementById('featured-services').innerHTML = featServices.map(s => `
        <div class="card service-item" onclick="selectServiceForBooking(${s.id})">
            <div class="info">
                <h4>${s.name}</h4>
                <p><i class="fas fa-clock"></i> ${s.duration}</p>
            </div>
            <div class="price">$${s.price}</div>
        </div>
    `).join('');

    document.getElementById('featured-products').innerHTML = featProducts.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h4>${p.name}</h4>
                <div class="summary-line">
                    <span class="price">$${p.price}</span>
                    <button class="btn btn-primary" style="padding: 0.5rem; width: auto" onclick="addToCart(${p.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderServices() {
    document.getElementById('services-list').innerHTML = state.services.map(s => `
        <div class="card service-item">
            <div class="info">
                <h4>${s.name}</h4>
                <p>${s.duration}</p>
            </div>
            <div style="text-align: right">
                <div class="price" style="margin-bottom: 0.5rem">$${s.price}</div>
                <button class="btn btn-outline" style="padding: 0.4rem 1rem; width: auto; font-size: 0.7rem" onclick="selectServiceForBooking(${s.id})">Reservar</button>
            </div>
        </div>
    `).join('');
}

function renderStore() {
    document.getElementById('store-list').innerHTML = state.products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h4>${p.name}</h4>
                <div class="price" style="margin-bottom: 0.8rem">$${p.price}</div>
                <button class="btn btn-primary" onclick="addToCart(${p.id})">Agregar</button>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    const cartEl = document.getElementById('cart-details');
    if (state.cart.length === 0) {
        cartEl.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem">Tu carrito está vacío</p>`;
        document.getElementById('checkout-btn').style.display = 'none';
        return;
    }

    document.getElementById('checkout-btn').style.display = 'block';
    let html = '';
    let total = 0;

    state.cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
            <div class="service-item" style="border-bottom: 1px solid #222; margin-bottom: 1rem; padding-bottom: 1rem">
                <div class="info">
                    <h4>${item.name}</h4>
                    <p>$${item.price} c/u</p>
                </div>
                <div style="text-align: right">
                    <div class="price" style="margin-bottom: 0.5rem">$${subtotal}</div>
                    <div style="display: flex; align-items: center; gap: 0.8rem; justify-content: flex-end">
                        <div class="quantity-control">
                            <button class="btn-qty" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="btn-qty" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 1.1rem" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
        <div class="summary-total" style="margin-top: 1rem">
            <div class="summary-line">
                <span>Total Carrito</span>
                <span>$${total}</span>
            </div>
        </div>
    `;

    cartEl.innerHTML = html;
}

function renderCheckout() {
    const summaryEl = document.getElementById('checkout-summary');
    let html = '';
    let total = 0;

    // Appointment Summary
    if (state.booking) {
        const service = state.services.find(s => s.id == state.booking.serviceId);
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem">
                    <h4 style="color: var(--gold)">Tu Cita</h4>
                    <button class="btn btn-outline" style="width: auto; padding: 0.3rem 0.6rem; font-size: 0.65rem" onclick="clearBooking()">Cancelar Cita</button>
                 </div>`;
        html += `
            <div class="summary-line">
                <span>${service.name}</span>
                <span>$${service.price}</span>
            </div>
            <div class="summary-line" style="color: var(--text-muted); font-size: 0.85rem">
                <span>${state.booking.date} a las ${state.booking.time}</span>
            </div>
            <div style="margin-bottom: 1.5rem"></div>
        `;
        total += service.price;
    }

    // Products Summary
    if (state.cart.length > 0) {
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem">
                    <h4 style="color: var(--gold)">Productos</h4>
                    <button class="btn btn-outline" style="width: auto; padding: 0.3rem 0.6rem; font-size: 0.65rem" onclick="navigateTo('carrito')">Editar</button>
                 </div>`;
        state.cart.forEach(item => {
            html += `
                <div class="summary-line">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${item.price * item.quantity}</span>
                </div>
            `;
            total += item.price * item.quantity;
        });
    }

    if (!state.booking && state.cart.length === 0) {
        html = `<p style="text-align: center; color: var(--text-muted)">No hay nada en tu pedido.</p>`;
    } else {
        html += `
            <div class="summary-total">
                <div class="summary-line">
                    <span>Total</span>
                    <span>$${total}</span>
                </div>
            </div>
        `;
    }

    summaryEl.innerHTML = html;
}

// --- Cart Actions ---
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    const existing = state.cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('barber_cart', JSON.stringify(state.cart));
    showToast('Producto agregado al carrito');
    updateCartBadge();
    
    // Suggest going to cart
    setTimeout(() => {
        if (confirm('¿Deseas ver tu carrito ahora?')) {
            navigateTo('carrito');
        }
    }, 500);
}

function updateQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('barber_cart', JSON.stringify(state.cart));
            renderCart();
            updateCartBadge();
        }
    }
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    localStorage.setItem('barber_cart', JSON.stringify(state.cart));
    updateCartBadge();
    if (state.view === 'carrito') renderCart();
    if (state.view === 'checkout') renderCheckout();
}

function clearCart() {
     state.cart = [];
     localStorage.removeItem('barber_cart');
     updateCartBadge();
     renderView();
 }
 
 function clearBooking() {
    state.booking = null;
    localStorage.removeItem('barber_booking');
    renderCheckout();
 }

function updateCartBadge() {
    const count = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    const floatCart = document.getElementById('floating-cart');
    const floatBadge = document.getElementById('cart-count-float');

    if (count > 0) {
        // Nav badge
        badge.textContent = count;
        badge.style.display = 'flex';
        
        // Floating cart
        if (state.view !== 'carrito' && state.view !== 'checkout') {
            floatCart.style.display = 'flex';
            floatBadge.textContent = count;
        } else {
            floatCart.style.display = 'none';
        }
    } else {
        badge.style.display = 'none';
        floatCart.style.display = 'none';
    }
}

// --- Admin Actions ---
let currentProductImage = '';
let currentBookingProof = '';

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.innerHTML = ''; // Limpiar iconos/texto
            currentProductImage = e.target.result; // Guardar Base64
        };
        reader.readAsDataURL(file);
    }
}

function previewBookingProof(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('booking-proof-preview');
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.innerHTML = ''; 
            currentBookingProof = e.target.result; 
        };
        reader.readAsDataURL(file);
    }
}

function checkAdmin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === 'admin123') { // Contraseña simple para el ejemplo
        state.isAdmin = true;
        sessionStorage.setItem('barber_admin', 'true');
        showToast('Bienvenido, Admin');
        navigateTo('admin-dash');
    } else {
        showToast('Contraseña incorrecta');
    }
}

function logoutAdmin() {
    state.isAdmin = false;
    sessionStorage.removeItem('barber_admin');
    navigateTo('home');
}

function addNewProduct() {
    const name = document.getElementById('new-prod-name').value;
    const price = parseFloat(document.getElementById('new-prod-price').value);
    const featured = document.getElementById('new-prod-featured').checked;

    if (!name || !price || !currentProductImage) {
        showToast('Por favor completa todos los campos (incluyendo la foto)');
        return;
    }

    const newProduct = {
        id: Date.now(),
        name,
        price,
        image: currentProductImage,
        featured
    };

    state.products.push(newProduct);
    localStorage.setItem('barber_products', JSON.stringify(state.products));
    
    showToast('Producto agregado con éxito');
    
    // Refresh relevant views
    if (state.view === 'home') renderHome();
    if (state.view === 'tienda') renderStore();
    if (state.view === 'admin-dash') renderAdminDashboard();
    
    // Clear form
    document.getElementById('new-prod-name').value = '';
    document.getElementById('new-prod-price').value = '';
    document.getElementById('new-prod-file').value = '';
    document.getElementById('new-prod-featured').checked = false;
    
    const preview = document.getElementById('image-preview');
    preview.style.backgroundImage = 'none';
    preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Haz clic para subir o arrastra una imagen</p>';
    currentProductImage = '';
}

// --- Booking Actions ---
function selectServiceForBooking(serviceId) {
    navigateTo('agenda');
    document.getElementById('booking-service').value = serviceId;
}

function confirmBooking() {
    const serviceId = document.getElementById('booking-service').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;

    if (!serviceId || !date || !time || !name || !phone) {
        showToast('Por favor completa todos los campos');
        return;
    }

    if (!currentBookingProof) {
        showToast('Por favor sube tu comprobante de pago');
        return;
    }

    // Duplicate prevention: check if date and time are already booked
    const isDuplicate = state.allBookings.some(b => b.date === date && b.time === time && b.status !== 'Cancelada');
    if (isDuplicate) {
        showToast('Lo sentimos, este horario ya está reservado. Por favor elige otro.');
        return;
    }

    state.booking = { serviceId, date, time, name, phone, proof: currentBookingProof };
    localStorage.setItem('barber_booking', JSON.stringify(state.booking));
    
    // Add to allBookings list (as a record of scheduled appointments)
    const newBooking = { ...state.booking, id: Date.now(), status: 'Pendiente' };
    state.allBookings.push(newBooking);
    localStorage.setItem('barber_all_bookings', JSON.stringify(state.allBookings));
    
    // Reset booking proof for next use
    currentBookingProof = '';
    const proofPreview = document.getElementById('booking-proof-preview');
    if (proofPreview) {
        proofPreview.style.backgroundImage = 'none';
        proofPreview.innerHTML = '<i class="fas fa-receipt"></i><p>Haz clic para subir comprobante</p>';
    }

    navigateTo('checkout');
}

// --- WhatsApp Integration ---
function sendToWhatsApp() {
    if (!state.booking && state.cart.length === 0) {
        showToast('Tu pedido está vacío');
        return;
    }

    let total = 0;
    let message = `Hola, quiero agendar una cita y hacer un pedido:\n\n`;

    if (state.booking) {
        const service = state.services.find(s => s.id == state.booking.serviceId);
        message += `👤 *Nombre:* ${state.booking.name}\n`;
        message += `✂️ *Servicio:* ${service.name}\n`;
        message += `📅 *Fecha:* ${state.booking.date}\n`;
        message += `⏰ *Hora:* ${state.booking.time}\n\n`;
        total += service.price;
    }

    if (state.cart.length > 0) {
        message += `🛍️ *Productos:*\n`;
        state.cart.forEach(item => {
            message += `- ${item.name} (x${item.quantity}) - $${item.price * item.quantity}\n`;
            total += item.price * item.quantity;
        });
        message += `\n`;
    }

    message += `💰 *Total:* $${total}`;

    const encodedMessage = encodeURIComponent(message);
    const phone = "5611451113"; 
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
}

// --- UI Helpers ---
function showToast(text) {
    const toast = document.getElementById('toast');
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- Initialization ---
window.addEventListener('load', () => {
    // Populate service select
    const serviceSelect = document.getElementById('booking-service');
    serviceSelect.innerHTML = '<option value="">Selecciona un servicio</option>' + 
        state.services.map(s => `<option value="${s.id}">${s.name} - $${s.price}</option>`).join('');

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('booking-date').setAttribute('min', today);

    // Initial render
    renderView();

    // Hide loader
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
    }, 1000);
});
