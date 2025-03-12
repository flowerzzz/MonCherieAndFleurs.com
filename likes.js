document.addEventListener("DOMContentLoaded", function () {
    attachLikeListeners();
    loadLikedProducts();
});

function attachLikeListeners() {
    let likeButtons = document.querySelectorAll(".product .fa-heart");

    likeButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            let product = this.closest(".product");
            let productId = product.querySelector(".add-to-cart").getAttribute("data-id");
            let productName = product.querySelector("h3").textContent;
            let productPrice = product.querySelector("p").textContent.replace("₱", "").replace(",", "");
            let productImage = product.querySelector("img").getAttribute("src");

            toggleLike(productId, productName, productPrice, productImage, this);
        });
    });
}

// toggle like
function toggleLike(id, name, price, image, button) {
    let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
    let index = likedProducts.findIndex(product => product.id === id);

    if (index === -1) {
        likedProducts.push({ id, name, price, image });
        button.classList.add("liked"); // Mark as liked
        showLikeMessage(`${name} has been added to Liked Products.`);
    } else {
        likedProducts.splice(index, 1);
        button.classList.remove("liked"); // Remove liked status
        showLikeMessage(`${name} has been removed from Liked Products.`);
    }

    localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
}

function loadLikedProducts() {
    let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
    let likeButtons = document.querySelectorAll(".product .fa-heart");

    likeButtons.forEach(button => {
        let product = button.closest(".product");
        let productId = product.querySelector(".add-to-cart").getAttribute("data-id");

        if (likedProducts.some(product => product.id === productId)) {
            button.classList.add("liked");
        }
    });
}

function showLikeMessage(message) {
    let messageBox = document.createElement("div");
    messageBox.classList.add("like-message");
    messageBox.textContent = message;
    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.classList.add("fade-out");
        setTimeout(() => {
            messageBox.remove();
        }, 500);
    }, 2000);
}