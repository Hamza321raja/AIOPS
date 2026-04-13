const menuData = [
  { id: 1, name: "Burger", price: 5, category: "fast" },
  { id: 2, name: "Pizza", price: 8, category: "fast" },
  { id: 3, name: "Fries", price: 3, category: "fast" },
  { id: 4, name: "Biryani", price: 6, category: "desi" },
  { id: 5, name: "Karahi", price: 10, category: "desi" }
];

let cart = [];

// Load Menu
function loadMenu(data = menuData) {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  data.forEach(item => {
    menu.innerHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
        <button onclick="addToCart(${item.id})">Add</button>
      </div>
    `;
  });
}

// Add to Cart
function addToCart(id) {
  const item = menuData.find(i => i.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCart();
}

// Update Cart
function updateCart() {
  const cartDiv = document.getElementById("cart");
  const totalDiv = document.getElementById("total");

  cartDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartDiv.innerHTML += `
      <div class="card">
        <h4>${item.name}</h4>
        <p>${item.qty} x $${item.price}</p>
        <button onclick="changeQty(${index},1)">+</button>
        <button onclick="changeQty(${index},-1)">-</button>
      </div>
    `;
  });

  totalDiv.innerText = "Total: $" + total;
}

// Change Qty
function changeQty(index, val) {
  cart[index].qty += val;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
}

// Filter
function filterCategory(cat) {
  if (cat === "all") loadMenu();
  else loadMenu(menuData.filter(i => i.category === cat));
}

// Search
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  loadMenu(menuData.filter(i => i.name.toLowerCase().includes(value)));
});

// Place Order (Backend)
async function placeOrder() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;

  if (!name || !address) return alert("Fill all fields");
  if (cart.length === 0) return alert("Cart empty");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const res = await fetch("http://localhost:5000/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, address, items: cart, total })
  });

  await res.json();

  alert("Order Placed 🎉");

  cart = [];
  updateCart();
}

loadMenu();