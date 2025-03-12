document.addEventListener("DOMContentLoaded", function () {
    attachCartListeners(); // Attach listeners to add-to-cart buttons
    loadCart(); // Load cart on page load
});

function attachCartListeners() {
    let cartButtons = document.querySelectorAll(".add-to-cart");
    cartButtons.forEach(button => {
        button.addEventListener("click", addToCart);
    });
}

function addToCart(event) {
    event.preventDefault();
    
    let button = event.target.closest(".add-to-cart");
    let product = {
        id: button.getAttribute("data-id"),
        name: button.getAttribute("data-name"),
price: parseFloat(button.getAttribute("data-price").replace(/₱/g, '').replace(/,/g, '')) || 0,


        image: button.getAttribute("data-image"),
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showCartMessage(product.name);

    // Reload the cart table immediately
    loadCart();
}

function showCartMessage(productName) {
    let messageBox = document.createElement("div");
    messageBox.className = "cart-message";
    messageBox.innerHTML = `${productName} has been added to your cart!`;

    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.classList.add("fade-out");
        setTimeout(() => {
            messageBox.remove();
        }, 500);
    }, 1500);
}

function loadCart() {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let cartTable = document.getElementById("cart-items");
    let grandTotalElement = document.getElementById("grand-total");
    
    if (!cartTable || !grandTotalElement) return; // Prevent errors

    let grandTotal = 0;
    cartTable.innerHTML = "";

    if (cartItems.length === 0) {
        cartTable.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
        grandTotalElement.textContent = "0.00";
        return;
    }

    cartItems.forEach((item, index) => {
        let totalPrice = (item.price || 0) * item.quantity;
        grandTotal += totalPrice;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" width="50"></td>
            <td>${item.name}</td>
            <td>₱${(item.price || 0).toFixed(2)}</td>
            <td>
                <button class="decrease-qty" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-qty" data-index="${index}">+</button>
            </td>
            <td>₱${totalPrice.toFixed(2)}</td>
            <td><button class="remove-item" data-index="${index}">Remove</button></td>
        `;
        cartTable.appendChild(row);
    });

    grandTotalElement.textContent = grandTotal.toFixed(2);
    attachCartPageListeners();
}

function attachCartPageListeners() {
    document.querySelectorAll(".increase-qty").forEach(button => {
        button.addEventListener("click", function () {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let index = this.getAttribute("data-index");
            cart[index].quantity++;
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart();
        });
    });

    document.querySelectorAll(".decrease-qty").forEach(button => {
        button.addEventListener("click", function () {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let index = this.getAttribute("data-index");
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart();
        });
    });

    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let index = this.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart();
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadCart();
    
    let checkoutButton = document.getElementById("checkout-btn");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", checkout);
    }
});

function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to checkout.");
        return;
    }

    // Store cart data in sessionStorage before redirecting
    sessionStorage.setItem("cart", JSON.stringify(cart));

    // Clear the cart from localStorage
    localStorage.removeItem("cart");

    // Redirect to checkout.html
    window.location.href = "checkout.html";
}
