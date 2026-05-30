const products = [
  {
    id: "california",
    name: "California Vintage Tee",
    price: 45,
    image: "assets/california-vintage-tee.svg",
    alt: "Grey California Pirate Life vintage tee"
  },
  {
    id: "y2k",
    name: "Y2K Print Tee",
    price: 55,
    image: "assets/y2k-print-tee.svg",
    alt: "Black Y2K print tee"
  },
  {
    id: "nike",
    name: "Vintage Nike Swoosh Tee",
    price: 60,
    image: "assets/vintage-nike-swoosh-tee.svg",
    alt: "White vintage Nike swoosh tee"
  },
  {
    id: "graphic",
    name: "90s Graphic Tee",
    price: 50,
    image: "assets/90s-graphic-tee.svg",
    alt: "Black 90s graphic tee"
  },
  {
    id: "retro",
    name: "Retro Streetwear Tee",
    price: 55,
    image: "assets/retro-streetwear-tee.svg",
    alt: "Black Fear No Evil graphic tee"
  },
  {
    id: "band",
    name: "Vintage Band Tee",
    price: 75,
    image: "assets/vintage-band-tee.svg",
    alt: "White vintage band tee"
  }
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
const cartSubtotal = document.querySelector("#cartSubtotal");
const checkoutTotal = document.querySelector("#checkoutTotal");
const summaryTotal = document.querySelector("#summaryTotal");
const checkoutForm = document.querySelector("#checkoutForm");
const formError = document.querySelector("#formError");
const searchInput = document.querySelector("#searchInput");

function formatPrice(value) {
  return `$${value}`;
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.product.price, 0);
}

function createShirt(product) {
  const wrapper = document.createElement("div");
  wrapper.className = "product-photo-wrap";
  wrapper.innerHTML = `
    <img class="product-photo" src="${product.image}" alt="${product.alt}">
  `;
  return wrapper;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.append(createShirt(product));
  card.insertAdjacentHTML("beforeend", `
    <strong>${product.name} ${formatPrice(product.price)}</strong>
    <div class="product-actions">
      <button class="secondary-button" type="button" data-product-id="${product.id}">View details</button>
      <button class="mini-cart-button" type="button" data-add-product-id="${product.id}">Add to cart</button>
    </div>
  `);
  return card;
}

function showView(viewId) {
  views.forEach(view => view.classList.toggle("active", view.id === viewId));
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showProduct(product) {
  selectedProduct = product;
  productImage.replaceChildren(createShirt(product));
  productName.textContent = `${product.name} ${formatPrice(product.price)}`;
  showView("product");
}

function addProductToCart(product, size = "M") {
  if (!product) return;
  cart.push({ product, size });
  updateCart();
  showView("cart");
}

function updateCart() {
  const total = getTotal();
  cartCount.textContent = cart.length;
  cartSubtotal.textContent = formatPrice(total);
  checkoutTotal.textContent = formatPrice(total);
  summaryTotal.textContent = formatPrice(total);

  cartItems.replaceChildren();
  summaryItems.replaceChildren();

  cart.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "cart-item";
    row.append(createShirt(item.product));
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
    summaryRow.append(createShirt(item.product));
    summaryRow.insertAdjacentHTML("beforeend", `
      <div>
        <h3>${item.product.name}</h3>
        <p>Size: ${item.size}</p>
        <p>Condition: Good</p>
      </div>
      <strong>${formatPrice(item.product.price)}</strong>
    `);
    summaryItems.append(summaryRow);
  });
}

function renderProducts(list = products) {
  resultsGrid.replaceChildren(...list.map(createProductCard));
  trendingGrid.replaceChildren(...products.map(createProductCard));
}

function validateCheckout() {
  const requiredFields = ["email", "firstName", "lastName", "address", "cardNumber", "expiry", "cvv"];
  const missing = requiredFields.some(id => !document.querySelector(`#${id}`).value.trim());

  if (cart.length === 0) {
    return "Your cart is empty. Add an item before checkout.";
  }

  if (missing) {
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
    event.preventDefault();
    event.stopPropagation();
    const product = products.find(item => item.id === addButton.dataset.addProductId);
    addProductToCart(product);
    return;
  }

  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    event.preventDefault();
    showView(routeButton.dataset.route);
  }

  const productCard = event.target.closest("[data-product-id]");
  if (productCard) {
    const product = products.find(item => item.id === productCard.dataset.productId);
    showProduct(product);
  }

  const removeButton = event.target.closest("[data-remove-index]");
  if (removeButton) {
    cart.splice(Number(removeButton.dataset.removeIndex), 1);
    updateCart();
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
