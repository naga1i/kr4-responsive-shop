// ===============================
// Общая клиентская логика страниц: кнопка «Наверх», модальное окно быстрого заказа, избранное на статических карточках
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

  // 2. Модальное окно быстрого заказа (<dialog id="order-dialog">)
  const orderDialog = document.getElementById('order-dialog');
  const orderForm = document.getElementById('order-form');
  const closeDialogButton = document.getElementById('close-order-dialog');
  const closeDialogCross = document.getElementById('close-order-dialog-cross');
  const dialogProductName = document.getElementById('dialog-product-name');
  const quickProductSelect = document.getElementById('quick-product');
  const successMessage = document.getElementById('success-message');

  const openQuickOrder = (productIdentifier) => {
    if (!orderDialog || !orderForm) return;

    const product =
      typeof productIdentifier === 'number' || /^\d+$/.test(String(productIdentifier))
        ? store.getProductById(Number(productIdentifier))
        : store.getProductByName(productIdentifier);

    if (quickProductSelect && product) {
      quickProductSelect.value = String(product.id);
    }

    if (dialogProductName && product) {
      dialogProductName.textContent = `Вы выбрали: ${product.name} (${store.formatPrice(product.price)})`;
    }

    // Автоподстановка контактов из Личного кабинета, если поля пустые
    const profile = store.getProfile();
    const nameInput = document.getElementById('order-name');
    const phoneInput = document.getElementById('order-phone');
    const emailInput = document.getElementById('order-email');
    if (nameInput && !nameInput.value) nameInput.value = profile.name || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = profile.phone || '';
    if (emailInput && !emailInput.value) emailInput.value = profile.email || '';

    orderDialog.showModal();
    lockPageScroll();
  };

  // Экспортируем функцию открытия модального окна для React-компонентов
  window.openQuickOrderModal = openQuickOrder;

  // Делегирование клика по любой кнопке .js-quick-order
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.js-quick-order');
    if (!trigger || trigger.disabled) return;
    event.preventDefault();
    const prod = trigger.dataset.productId || trigger.dataset.product || 4;
    openQuickOrder(prod);
  });

  if (orderDialog && orderForm) {
    if (quickProductSelect && dialogProductName) {
      quickProductSelect.addEventListener('change', () => {
        const p = store.getProductById(Number(quickProductSelect.value));
        dialogProductName.textContent = `Вы выбрали: ${p.name} (${store.formatPrice(p.price)})`;
      });
    }

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

      const chosenId = quickProductSelect ? Number(quickProductSelect.value) : 4;
      const product = store.getProductById(chosenId);
      const qtyInput = document.getElementById('order-qty');
      const qty = Math.max(1, Number(qtyInput ? qtyInput.value : 1));
      const deliverySelect = document.getElementById('order-delivery');
      const deliveryLabel = deliverySelect
        ? deliverySelect.options[deliverySelect.selectedIndex].text
        : 'Самовывоз из шоурума';

      const { order, bonusEarned } = store.addOrder({
        productName: qty > 1 ? `${product.name} × ${qty} шт.` : product.name,
        addons: [],
        delivery: deliveryLabel,
        total: product.price * qty,
      });

      if (successMessage) {
        successMessage.innerHTML = `<strong>Заказ #${order.orderNumber} успешно оформлен!</strong> Начислено <strong>+${bonusEarned} бонусов</strong> в <a href="account.html">Личном кабинете</a>. Менеджер свяжется с вами в течение 10 минут.`;
        successMessage.hidden = false;
      }

      orderForm.reset();
      orderDialog.close();
    });
  }
})();
