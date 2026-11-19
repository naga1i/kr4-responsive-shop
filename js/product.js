// ===============================
// Динамическое заполнение страницы карточки товара (product.html?id=...)
// ===============================

(function () {
  const store = window.ElectroStore;
  if (!store) return;

  const productSection = document.getElementById('product-detail');
  if (!productSection) return;

  const productId = Number(new URLSearchParams(window.location.search).get('id')) || 1;
  const product = store.getProductById(productId);

  document.title = `${product.name} — ElectroMirea`;

  const breadcrumbEl = document.getElementById('product-breadcrumb');
  const titleEl = document.getElementById('product-title');
  const descEl = document.getElementById('product-description');
  const skuEl = document.getElementById('product-sku');
  const catChipEl = document.getElementById('product-category-chip');
  const warrantyChipEl = document.getElementById('product-warranty-chip');
  const ratingChipEl = document.getElementById('product-rating-chip');
  const imageEl = document.getElementById('product-image');
  const badgeEl = document.getElementById('product-badge');
  const priceEl = document.getElementById('product-price');
  const quickBtn = document.getElementById('product-quick-order');
  const configLink = document.getElementById('product-config-link');
  const favBtn = document.getElementById('product-fav-btn');
  const specsTbody = document.getElementById('product-specs-tbody');

  if (breadcrumbEl) breadcrumbEl.textContent = product.name;
  if (titleEl) titleEl.textContent = product.name;
  if (descEl) descEl.textContent = product.description;
  if (skuEl) skuEl.textContent = `Артикул: ${product.sku}`;
  if (catChipEl) catChipEl.textContent = product.categoryTitle;
  if (warrantyChipEl) warrantyChipEl.textContent = `Гарантия: ${product.warranty}`;
  if (ratingChipEl) ratingChipEl.textContent = `★ ${product.rating.toFixed(1)}`;

  if (imageEl) {
    imageEl.src = product.image;
    imageEl.alt = product.name;
  }

  if (badgeEl) {
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.hidden = false;
    } else {
      badgeEl.hidden = true;
    }
  }

  if (priceEl) {
    priceEl.textContent = store.formatPrice(product.price);
    if (product.oldPrice) {
      const oldEl = document.createElement('s');
      oldEl.className = 'product-card__old-price';
      oldEl.style.marginLeft = '10px';
      oldEl.textContent = store.formatPrice(product.oldPrice);
      priceEl.appendChild(oldEl);
    }
  }

  if (quickBtn) {
    quickBtn.dataset.productId = String(product.id);
    if (!product.available) {
      quickBtn.disabled = true;
      quickBtn.textContent = 'Нет в наличии';
    }
  }

  if (configLink) {
    configLink.href = `order.html?id=${product.id}`;
  }

  const updateProductFavButton = () => {
    if (!favBtn) return;
    const fav = store.isFavorite(product.id);
    favBtn.textContent = fav ? '♥ В избранном' : '♡ В избранное';
    favBtn.classList.toggle('button--primary', fav);
    favBtn.classList.toggle('button--secondary', !fav);
  };

  if (favBtn) {
    favBtn.addEventListener('click', () => {
      store.toggleFavorite(product.id);
      updateProductFavButton();
    });
    window.addEventListener('electrostore:change', updateProductFavButton);
    updateProductFavButton();
  }

  if (specsTbody) {
    const rows = [
      ['Бренд', product.brand],
      ['Категория', product.categoryTitle],
      ['Артикул', product.sku],
      ['Цена', store.formatPrice(product.price)],
      ['Наличие в шоуруме', product.available ? 'В наличии (самовывоз сегодня)' : 'Временно нет в наличии'],
      ['Официальная гарантия', product.warranty],
      ...Object.entries(product.specs || {}),
    ];

    specsTbody.innerHTML = '';
    rows.forEach(([param, val]) => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.className = 'product-table__cell product-table__cell--head';
      th.scope = 'row';
      th.textContent = param;

      const td = document.createElement('td');
      td.className = 'product-table__cell';
      td.textContent = val;

      tr.appendChild(th);
      tr.appendChild(td);
      specsTbody.appendChild(tr);
    });
  }
})();
