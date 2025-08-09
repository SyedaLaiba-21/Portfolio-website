let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsDiv = document.getElementById("cart-items");
const totalPriceDiv = document.getElementById("total-price");

let total = 0;

// Display cart items
function displayCartItems() {
  cartItemsDiv.innerHTML = ""; // Clear previous items

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <span>${item.name}</span>
        <span>Rs.${item.price}</span>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      cartItemsDiv.appendChild(itemDiv);
      total += item.price;
    });

    totalPriceDiv.innerText = `Total: Rs.${total}`;
  }
}

// Remove item from cart
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.getAttribute("data-index");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    total = 0; // Reset total
    displayCartItems(); // Refresh display
  }
});

// Proceed to order summary
function goToOrderSummary() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add items to proceed.");
  } else {
    window.location.href = "order.html";
  }
}

// Initialize cart display
displayCartItems();