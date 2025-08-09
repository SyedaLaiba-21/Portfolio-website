const summaryDiv = document.getElementById("order-summary");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

// Display order summary
if (cart.length === 0) {
  summaryDiv.innerHTML += "<p>Your cart is empty.</p>";
} else {
  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "summary-item";
    div.innerHTML = `<span>${item.name}</span><span>Rs.${item.price}</span>`;
    summaryDiv.appendChild(div);
    total += item.price;
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "total";
  totalDiv.innerText = `Total: Rs.${total}`;
  summaryDiv.appendChild(totalDiv);
}

// Handle form submission
document.getElementById("order-form").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Order placed successfully! Thank you for choosing FreshBrew Café.");
  localStorage.removeItem("cart"); // Clear cart
  window.location.href = "index.html"; // Redirect to home
});