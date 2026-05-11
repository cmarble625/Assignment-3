const products = [
  { id: "california", name: "California Vintage Tee", price: 45 },
  { id: "y2k", name: "Y2K Print Tee", price: 55 },
  { id: "nike", name: "Vintage Nike Swoosh Tee", price: 60 },
  { id: "graphic", name: "90s Graphic Tee", price: 50 },
  { id: "retro", name: "Retro Streetwear Tee", price: 55 },
  { id: "band", name: "Vintage Band Tee", price: 75 }
];

let selectedProduct = products[0];
let cart = [];

const views = document.querySelectorAll(".view");
const trendingGrid = document.querySelector("#trendingGrid");
const resultsGrid = document.querySelector("#resultsGrid");
const productName = document.querySelector("#productName");
const productImage = document.querySelector("#productImage");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const subtotal = document.querySelector("#subtotal");

function formatPrice(price) {
  return `$${price}`;
}

function showView(viewId) {
  views.forEach(view => {
    view.classList.toggle("active", view.id === viewId);
  });
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="placeholder-image">Product Image</div>
    <strong>${product.name}</strong>
    <span>${formatPrice(product.price)}</span>
    <button type="button" data-product-id="${product.id}">View details</button>
  `;
  return card;
}

function showProduct(product) {
  selectedProduct = product;
  productName.textContent = `${product.name} ${formatPrice(product.price)}`;
  productImage.textContent = "Product Image";
  showView("product");
}

function updateCart() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartCount.textContent = cart.length;
  subtotal.textContent = formatPrice(total);

  cartItems.replaceChildren();
  cart.forEach(item => {
    const row = document.createElement("article");
    row.className = "cart-item";
    row.innerHTML = `
      <span>${item.name}</span>
      <strong>${formatPrice(item.price)}</strong>
    `;
    cartItems.append(row);
  });
}

function renderProducts() {
  resultsGrid.replaceChildren(...products.map(createProductCard));
  trendingGrid.replaceChildren(...products.slice(3, 5).map(createProductCard));
}

document.addEventListener("click", event => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    event.preventDefault();
    showView(routeButton.dataset.route);
  }

  const productButton = event.target.closest("[data-product-id]");
  if (productButton) {
    const product = products.find(item => item.id === productButton.dataset.productId);
    showProduct(product);
  }
});

document.querySelector("#addToCart").addEventListener("click", () => {
  cart.push(selectedProduct);
  updateCart();
  showView("cart");
});

renderProducts();
updateCart();
