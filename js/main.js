// ===============================
// Общая клиентская логика страниц: кнопка «Наверх», карусель отзывов и модальное окно быстрого заказа
// ===============================

(function () {
  const store = window.ElectroStore;
  if (!store) return;

  // 1. Плавный возврат «Наверх» и блокировка прокрутки фона для <dialog>
  const scrollTopButton = document.getElementById('scroll-top');
  let pageScrollPosition = 0;

  const lockPageScroll = () => {
    pageScrollPosition = window.scrollY;
    document.body.style.top = `-${pageScrollPosition}px`;
    document.body.classList.add('page--locked');
  };

  const unlockPageScroll = () => {
    document.body.classList.remove('page--locked');
    document.body.style.top = '';
    window.scrollTo({ top: pageScrollPosition, behavior: 'instant' });
  };

  if (scrollTopButton) {
    const updateScrollTopButton = () => {
      scrollTopButton.hidden = window.scrollY < 280;
    };

    window.addEventListener('scroll', updateScrollTopButton, { passive: true });
    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    updateScrollTopButton();
  }

  // 2. Листаемая карусель отзывов на главной странице
  const reviewsList = document.getElementById('reviews-list');
  const reviewsPrev = document.getElementById('reviews-prev');
  const reviewsNext = document.getElementById('reviews-next');

  if (reviewsList && reviewsPrev && reviewsNext) {
    const updateReviewButtons = () => {
      const maxScroll = reviewsList.scrollWidth - reviewsList.clientWidth;
      reviewsPrev.disabled = reviewsList.scrollLeft <= 4;
      reviewsNext.disabled = reviewsList.scrollLeft >= maxScroll - 4;
    };

    const getScrollStep = () => {
      const firstCard = reviewsList.querySelector('.review-card');
      return firstCard ? firstCard.getBoundingClientRect().width + 20 : 360;
    };

    reviewsPrev.addEventListener('click', () => {
      reviewsList.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    reviewsNext.addEventListener('click', () => {
      reviewsList.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    reviewsList.addEventListener('scroll', updateReviewButtons, { passive: true });
    window.addEventListener('resize', updateReviewButtons, { passive: true });
    updateReviewButtons();
  }

  // 3. Модальное окно быстрого заказа (<dialog id="order-dialog">) с возможностью списания бонусов
  const orderDialog = document.getElementById('order-dialog');
  const orderForm = document.getElementById('order-form');
  const closeDialogButton = document.getElementById('close-order-dialog');
  const closeDialogCross = document.getElementById('close-order-dialog-cross');
  const dialogProductName = document.getElementById('dialog-product-name');
  const quickProductSelect = document.getElementById('quick-product');
  const quickQtyInput = document.getElementById('order-qty');
  const bonusCheckbox = document.getElementById('order-use-bonuses');
  const bonusLabelText = document.getElementById('order-bonus-label');
  const successMessage = document.getElementById('success-message');

  const refreshDialogPricing = () => {
    if (!quickProductSelect || !dialogProductName) return;
    const product = store.getProductById(Number(quickProductSelect.value));
    const qty = Math.max(1, Number(quickQtyInput ? quickQtyInput.value : 1));
    const subtotal = product.price * qty;
    const maxRedeemable = store.calcMaxRedeemable(subtotal);

    if (bonusCheckbox && bonusLabelText) {
      bonusCheckbox.disabled = maxRedeemable <= 0;
      if (maxRedeemable <= 0) bonusCheckbox.checked = false;
      const balance = Number(store.getProfile().bonusPoints) || 0;
      bonusLabelText.textContent =
        maxRedeemable > 0
          ? `Списать ${maxRedeemable.toLocaleString('ru-RU')} бонусов (на счёте ${balance.toLocaleString('ru-RU')} Б, до 20% заказа)`
          : 'На бонусном счёте нет доступных баллов';
    }

    const used = bonusCheckbox && bonusCheckbox.checked ? maxRedeemable : 0;
    const finalPrice = Math.max(0, subtotal - used);
    dialogProductName.textContent =
      used > 0
        ? `Вы выбрали: ${product.name} — ${store.formatPrice(finalPrice)} (списано ${used} Б)`
        : `Вы выбрали: ${product.name} (${store.formatPrice(finalPrice)})`;
  };

  const openQuickOrder = (productIdentifier) => {
    if (!orderDialog || !orderForm) return;

    const product =
      typeof productIdentifier === 'number' || /^\d+$/.test(String(productIdentifier))
        ? store.getProductById(Number(productIdentifier))
        : store.getProductByName(productIdentifier);

    if (quickProductSelect && product) {
      quickProductSelect.value = String(product.id);
    }

    if (bonusCheckbox) {
      bonusCheckbox.checked = false;
    }

    const profile = store.getProfile();
    const nameInput = document.getElementById('order-name');
    const phoneInput = document.getElementById('order-phone');
    const emailInput = document.getElementById('order-email');
    if (nameInput && !nameInput.value) nameInput.value = profile.name || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = profile.phone || '';
    if (emailInput && !emailInput.value) emailInput.value = profile.email || '';

    refreshDialogPricing();
    orderDialog.showModal();
    lockPageScroll();
  };

  window.openQuickOrderModal = openQuickOrder;

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.js-quick-order');
    if (!trigger || trigger.disabled) return;
    event.preventDefault();
    const prod = trigger.dataset.productId || trigger.dataset.product || 1;
    openQuickOrder(prod);
  });

  if (orderDialog && orderForm) {
    if (quickProductSelect) quickProductSelect.addEventListener('change', refreshDialogPricing);
    if (quickQtyInput) quickQtyInput.addEventListener('input', refreshDialogPricing);
    if (bonusCheckbox) bonusCheckbox.addEventListener('change', refreshDialogPricing);

    if (closeDialogButton) {
      closeDialogButton.addEventListener('click', () => orderDialog.close());
    }

    if (closeDialogCross) {
      closeDialogCross.addEventListener('click', () => orderDialog.close());
    }

    orderDialog.addEventListener('click', (event) => {
      if (event.target === orderDialog) {
        orderDialog.close();
      }
    });

    orderDialog.addEventListener('close', unlockPageScroll);

    orderForm.addEventListener('reset', () => {
      Array.from(orderForm.elements).forEach((el) => el.removeAttribute('aria-invalid'));
      setTimeout(refreshDialogPricing, 0);
    });

    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formElements = Array.from(orderForm.elements);
      formElements.forEach((el) => {
        if (el.willValidate) el.removeAttribute('aria-invalid');
      });

      if (!orderForm.checkValidity()) {
        formElements.forEach((el) => {
          if (el.willValidate && !el.checkValidity()) {
            el.setAttribute('aria-invalid', 'true');
          }
        });
        orderForm.reportValidity();
        return;
      }

      const chosenId = quickProductSelect ? Number(quickProductSelect.value) : 1;
      const product = store.getProductById(chosenId);
      const qty = Math.max(1, Number(quickQtyInput ? quickQtyInput.value : 1));
      const subtotal = product.price * qty;
      const bonusesUsed =
        bonusCheckbox && bonusCheckbox.checked ? store.calcMaxRedeemable(subtotal) : 0;
      const deliverySelect = document.getElementById('order-delivery');
      const deliveryLabel = deliverySelect
        ? deliverySelect.options[deliverySelect.selectedIndex].text
        : 'Самовывоз из шоурума';

      const { order, bonusEarned } = store.addOrder({
        productName: qty > 1 ? `${product.name} × ${qty} шт.` : product.name,
        addons: [],
        delivery: deliveryLabel,
        total: Math.max(0, subtotal - bonusesUsed),
        bonusesUsed,
      });

      if (successMessage) {
        const spentText = bonusesUsed > 0 ? ` Списано <strong>${bonusesUsed} Б</strong>.` : '';
        successMessage.innerHTML = `<strong>Заказ #${order.orderNumber} успешно оформлен!</strong>${spentText} Начислено <strong>+${bonusEarned} Б (1%)</strong> в <a href="account.html">Личном кабинете</a>.`;
        successMessage.hidden = false;
      }

      orderForm.reset();
      orderDialog.close();
    });
  }
})();
