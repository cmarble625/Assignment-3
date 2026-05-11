const products = [
  { id: "california", name: "California Vintage Tee", price: 45, image: "assets/california-vintage-tee.svg", alt: "Grey California vintage tee" },
  { id: "y2k", name: "Y2K Print Tee", price: 55, image: "assets/y2k-print-tee.svg", alt: "Black Y2K print tee" },
  { id: "nike", name: "Vintage Nike Swoosh Tee", price: 60, image: "assets/vintage-nike-swoosh-tee.svg", alt: "White vintage Nike swoosh tee" },
  { id: "graphic", name: "90s Graphic Tee", price: 50, image: "assets/90s-graphic-tee.svg", alt: "Black 90s graphic tee" },
  { id: "retro", name: "Retro Streetwear Tee", price: 55, image: "assets/retro-streetwear-tee.svg", alt: "Black retro streetwear tee" },
  { id: "band", name: "Vintage Band Tee", price: 75, image: "assets/vintage-band-tee.svg", alt: "White vintage band tee" }
];

let selectedProduct = products[0];
let cart = [];

const views = document.querySelectorAll(".view");
const trendingGrid = document.querySelector("#trendingGrid");
const resultsGrid = document.querySelector("#resultsGrid");
const productImage = document.querySelector("#productImage");
const productName = document.querySelector("#productName");
const sizeSelect = document.querySelector("#sizeSelect");
const cartItems = document.querySelector("#cartItems");
const summaryItems = document.querySelector("#summaryItems");
const cartCount = document.querySelector("#cartCount");
const subtotal = document.querySelector("#subtotal");
const checkoutTotal = document.querySelector("#checkoutTotal");
const summaryTotal = document.querySelector("#summaryTotal");
const emptyCart = document.querySelector("#emptyCart");
const checkoutForm = document.querySelector("#checkoutForm");
const formError = document.querySelector("#formError");
const searchInput = document.querySelector("#searchInput");

function formatPrice(price) {
  return `$${price}`;
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.product.price, 0);
}

function showView(viewId) {
  views.forEach(view => {
    view.classList.toggle("active", view.id === viewId);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function createProductImage(product) {
  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image";
  imageWrap.innerHTML = `<img src="${product.image}" alt="${product.alt}">`;
  return imageWrap;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.append(createProductImage(product));
  card.insertAdjacentHTML("beforeend", `
    <strong>${product.name} ${formatPrice(product.price)}</strong>
    <div class="product-actions">
      <button class="secondary-button" type="button" data-product-id="${product.id}">View details</button>
      <button class="mini-cart-button" type="button" data-add-product-id="${product.id}">Add to cart</button>
    </div>
  `);
  return card;
}

function renderProducts(list = products) {
  resultsGrid.replaceChildren(...list.map(createProductCard));
  trendingGrid.replaceChildren(...products.slice(3, 5).map(createProductCard));
}

function showProduct(product) {
  selectedProduct = product;
  productImage.replaceChildren(createProductImage(product));
  productName.textContent = `${product.name} ${formatPrice(product.price)}`;
  showView("product");
}

function addProductToCart(product, size = "M") {
  if (!product) return;
  cart.push({ product, size });
  updateCart();
  showView("cart");
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const total = getCartTotal();
  cartCount.textContent = cart.length;
  subtotal.textContent = formatPrice(total);
  checkoutTotal.textContent = formatPrice(total);
  summaryTotal.textContent = formatPrice(total);
  emptyCart.hidden = cart.length > 0;

  cartItems.replaceChildren();
  summaryItems.replaceChildren();

  cart.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "cart-item";
    row.append(createProductImage(item.product));
    row.insertAdjacentHTML("beforeend", `
      <div>
        <h2>${item.product.name}</h2>
        <p>Size: ${item.size}</p>
        <p>Condition: Good</p>
        <button class="remove-button" type="button" data-remove-index="${index}">remove</button>
      </div>
      <strong>${formatPrice(item.product.price)}</strong>
    `);
    cartItems.append(row);

    const summaryRow = document.createElement("article");
    summaryRow.className = "summary-item";
    summaryRow.append(createProductImage(item.product));
    summaryRow.insertAdjacentHTML("beforeend", `
      <div>
        <h3>${item.product.name}</h3>
        <p>Size: ${item.size}</p>
      </div>
      <strong>${formatPrice(item.product.price)}</strong>
    `);
    summaryItems.append(summaryRow);
  });
}

function validateCheckout() {
  const requiredFields = ["email", "firstName", "lastName", "address", "cardNumber", "expiry", "cvv"];
  const missingField = requiredFields.some(id => !document.querySelector(`#${id}`).value.trim());

  if (cart.length === 0) {
    return "Please add at least one item before checkout.";
  }

  if (missingField) {
    return "Please complete all checkout fields before paying.";
  }

  if (!document.querySelector("#email").checkValidity()) {
    return "Please enter a valid email address.";
  }

  return "";
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add-product-id]");
  if (addButton) {
    const product = products.find(item => item.id === addButton.dataset.addProductId);
    addProductToCart(product);
    return;
  }

  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    event.preventDefault();
    showView(routeButton.dataset.route);
    return;
  }

  const productButton = event.target.closest("[data-product-id]");
  if (productButton) {
    const product = products.find(item => item.id === productButton.dataset.productId);
    showProduct(product);
    return;
  }

  const removeButton = event.target.closest("[data-remove-index]");
  if (removeButton) {
    removeCartItem(Number(removeButton.dataset.removeIndex));
  }
});

document.querySelector("#addToCart").addEventListener("click", () => {
  addProductToCart(selectedProduct, sizeSelect.value);
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => product.name.toLowerCase().includes(term));
  renderProducts(filtered.length ? filtered : products);
});

checkoutForm.addEventListener("submit", event => {
  event.preventDefault();
  const error = validateCheckout();
  formError.textContent = error;

  if (!error) {
    showView("confirmation");
  }
});

renderProducts();
showProduct(products[0]);
showView("home");
updateCart();
