// ===============================
// Пользовательский интерфейс на базе библиотеки React 18 (js/react-ui.js)
// Магазин комплектующих ПК «CoreMirea»:
// шапка действий, чат-консультант (слева), каталог с живым поиском,
// личный кабинет и форма оформления заказа.
// ===============================

(function () {
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const store = window.ElectroStore;

  if (!React || !ReactDOM || !store) return;

  const { useState, useEffect, useMemo, useRef } = React;
  const h = React.createElement;

  function useElectroStore() {
    const [, setTick] = useState(0);
    useEffect(() => {
      const handleUpdate = () => setTick((n) => n + 1);
      window.addEventListener('electrostore:change', handleUpdate);
      return () => window.removeEventListener('electrostore:change', handleUpdate);
    }, []);

    return {
      theme: store.getTheme(),
      profile: store.getProfile(),
      orders: store.getOrders(),
    };
  }

  const UserIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '12', cy: '7', r: '4' })
    );

  const SunIcon = () =>
    h(
      'svg',
      { className: 'theme-toggle__icon theme-toggle__icon--sun', viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      h('circle', { cx: '12', cy: '12', r: '5' }),
      h('line', { x1: '12', y1: '1', x2: '12', y2: '3' }),
      h('line', { x1: '12', y1: '21', x2: '12', y2: '23' }),
      h('line', { x1: '4.22', y1: '4.22', x2: '5.64', y2: '5.64' }),
      h('line', { x1: '18.36', y1: '18.36', x2: '19.78', y2: '19.78' }),
      h('line', { x1: '1', y1: '12', x2: '3', y2: '12' }),
      h('line', { x1: '21', y1: '12', x2: '23', y2: '12' }),
      h('line', { x1: '4.22', y1: '19.78', x2: '5.64', y2: '18.36' }),
      h('line', { x1: '18.36', y1: '5.64', x2: '19.78', y2: '4.22' })
    );

  const MoonIcon = () =>
    h(
      'svg',
      { className: 'theme-toggle__icon theme-toggle__icon--moon', viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      h('path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' })
    );

  const ChatIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      h('path', {
        d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      })
    );

  const SearchIcon = () =>
    h(
      'svg',
      { className: 'search-box__icon', viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
    );

  // ===============================
  // 1. Панель пользователя в шапке
  // ===============================
  function HeaderActionsWidget() {
    const { theme, profile } = useElectroStore();
    const path = window.location.pathname;
    const isAccountPage = path.endsWith('account.html');
    const firstName = (profile.name || 'Кабинет').trim().split(/\s+/)[0] || 'Кабинет';
    const isLight = theme === 'light';
    const themeLabel = isLight ? 'Включить тёмную тему' : 'Включить светлую тему';

    return h(
      React.Fragment,
      null,
      h(
        'a',
        {
          className: `header-action-link${isAccountPage ? ' header-action-link--active' : ''}`,
          href: 'account.html',
          title: 'Личный кабинет покупателя',
        },
        h(UserIcon),
        h('span', null, firstName)
      ),
      h(
        'button',
        {
          className: 'button button--primary button--sm',
          type: 'button',
          onClick: () => {
            if (window.openQuickOrderModal) window.openQuickOrderModal(1);
          },
        },
        'Быстрый заказ'
      ),
      h(
        'button',
        {
          className: `theme-toggle${isLight ? ' theme-toggle--light' : ''}`,
          type: 'button',
          id: 'theme-toggle',
          'aria-label': themeLabel,
          title: themeLabel,
          onClick: () => store.setTheme(store.getTheme() === 'light' ? 'dark' : 'light'),
        },
        h(SunIcon),
        h(MoonIcon)
      )
    );
  }

  // ===============================
  // 2. Виджет онлайн чат-консультанта (расположен СЛЕВА внизу)
  // ===============================
  function getConsultantReply(question) {
    const q = question.toLowerCase();
    if (q.includes('видеокарт') || q.includes('4070') || q.includes('5060') || q.includes('2k')) {
      return 'В наличии Palit GeForce RTX 4070 SUPER 12GB (83 490 руб.) для 2K Ultra и PNY GeForce RTX 5060 Ti 16GB (56 990 руб.) с 16 ГБ памяти. Все карты новые, в заводских пломбах.';
    }
    if (q.includes('сокет') || q.includes('am5') || q.includes('1700') || q.includes('процессор') || q.includes('плат')) {
      return 'Под AMD Ryzen 7 7800X3D (Socket AM5) подходят платы на чипсете B650 и память DDR5. Под Intel Core i5-14600KF (Socket LGA 1700) — платы B760. В каталоге можно сразу отфильтровать товары по сокету.';
    }
    if (q.includes('оплат') || q.includes('карт') || q.includes('сбп') || q.includes('бонус')) {
      return 'Принимаем оплату банковскими картами, через СБП и наличными. За каждый заказ начисляем 1% бонусами в Личный кабинет, а накопленными бонусами можно оплатить до 20% следующего заказа.';
    }
    if (q.includes('гарант') || q.includes('возврат') || q.includes('обмен')) {
      return 'На видеокарты, платы, СЖО и SSD действует официальная гарантия до 36 месяцев, на ОЗУ — 60 месяцев, на блоки питания — до 84 месяцев. Возврат возможен в течение 14 дней.';
    }
    if (q.includes('доставк') || q.includes('самовывоз') || q.includes('адрес')) {
      return 'Самовывоз из пункта выдачи на пр-те Вернадского, д. 78 — бесплатно через 20 минут после заказа. Доставка по Москве от 30 000 руб. — бесплатно.';
    }
    return 'Спасибо за обращение! Консультант магазина CoreMirea ответит в ближайшее время. Также можно позвонить по номеру +7 (495) 777-24-80.';
  }

  function ChatConsultantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
      {
        id: 1,
        sender: 'bot',
        text: 'Здравствуйте! Я консультант магазина комплектующих «CoreMirea». Подсказать наличие видеокарт, совместимость по сокету или условия доставки?',
      },
    ]);
    const listRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, [messages, isOpen]);

    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    const sendQuestion = (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: trimmed }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: getConsultantReply(trimmed) },
        ]);
      }, 300);
    };

    const quickQuestions = [
      { label: 'Видеокарты в наличии', q: 'Какие видеокарты сейчас есть в наличии?' },
      { label: 'Сокеты AM5 / 1700', q: 'Какие платы подходят под сокет AM5 и LGA 1700?' },
      { label: 'Доставка и самовывоз', q: 'Какие условия доставки и самовывоза?' },
      { label: 'Гарантия и оплата', q: 'Какая гарантия и способы оплаты?' },
    ];

    return h(
      'div',
      { className: 'chat-widget' },
      h(
        'div',
        {
          className: 'chat-widget__window',
          id: 'chat-window',
          role: 'dialog',
          'aria-label': 'Онлайн чат-консультант',
          hidden: !isOpen,
        },
        h(
          'div',
          { className: 'chat-widget__header' },
          h(
            'div',
            null,
            h('p', { className: 'chat-widget__title' }, 'Консультант CoreMirea'),
            h('span', { className: 'chat-widget__status' }, '● Онлайн — отвечаем сразу')
          ),
          h(
            'button',
            {
              className: 'chat-widget__close',
              type: 'button',
              'aria-label': 'Закрыть чат',
              onClick: () => setIsOpen(false),
            },
            '×'
          )
        ),
        h(
          'div',
          { className: 'chat-widget__messages', ref: listRef },
          messages.map((m) =>
            h('div', { key: m.id, className: `chat-msg chat-msg--${m.sender}` }, m.text)
          )
        ),
        h(
          'div',
          { className: 'chat-widget__quick' },
          quickQuestions.map((item) =>
            h(
              'button',
              {
                key: item.label,
                className: 'chat-widget__chip',
                type: 'button',
                onClick: () => sendQuestion(item.q),
              },
              item.label
            )
          )
        ),
        h(
          'form',
          {
            className: 'chat-widget__form',
            onSubmit: (e) => {
              e.preventDefault();
              sendQuestion(input);
              setInput('');
            },
          },
          h('input', {
            ref: inputRef,
            className: 'chat-widget__input',
            type: 'text',
            value: input,
            onChange: (e) => setInput(e.target.value),
            placeholder: 'Напишите ваш вопрос...',
            autoComplete: 'off',
          }),
          h('button', { className: 'button button--primary chat-widget__send', type: 'submit' }, 'Отправить')
        )
      ),
      h(
        'button',
        {
          className: 'chat-widget__toggle',
          type: 'button',
          id: 'chat-toggle',
          'aria-expanded': String(isOpen),
          onClick: () => setIsOpen((v) => !v),
        },
        h(ChatIcon),
        h('span', null, 'Чат-консультант')
      )
    );
  }

  // ===============================
  // 3. Карточка товара
  // ===============================
  function ProductCard({ product }) {
    const imgProps = product.responsiveBase
      ? {
          src: `${product.responsiveBase}-640.jpg`,
          srcSet: `${product.responsiveBase}-320.jpg 320w, ${product.responsiveBase}-480.jpg 480w, ${product.responsiveBase}-640.jpg 640w, ${product.responsiveBase}-960.jpg 960w`,
          sizes:
            '(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 24px), 300px',
        }
      : { src: product.image };

    const cardClass = [
      'product-card',
      product.cardModifier || '',
      !product.available ? 'product-card--unavailable' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return h(
      'article',
      { className: cardClass },
      h(
        'div',
        { className: 'product-card__media' },
        h('img', {
          ...imgProps,
          className: 'product-card__image',
          alt: product.name,
          width: 640,
          height: 480,
          loading: 'lazy',
        }),
        product.badge ? h('span', { className: 'product-card__badge' }, product.badge) : null
      ),
      h(
        'div',
        { className: 'product-card__meta' },
        h('span', { className: 'product-card__category' }, product.categoryTitle),
        h('span', null, `${product.sku} • ★ ${product.rating.toFixed(1)}`)
      ),
      h(
        'h3',
        { className: 'product-card__title' },
        h(
          'a',
          { className: 'product-card__title-link', href: `product.html?id=${product.id}` },
          product.name
        )
      ),
      h('p', { className: 'product-card__description' }, product.shortDesc),
      h(
        'div',
        { className: 'product-card__price-row' },
        h('p', { className: 'product-card__price' }, store.formatPrice(product.price)),
        product.oldPrice
          ? h('s', { className: 'product-card__old-price' }, store.formatPrice(product.oldPrice))
          : null
      ),
      h(
        'div',
        { className: 'product-card__actions' },
        product.available
          ? h(
              'button',
              {
                className: 'button button--primary button--sm product-card__button',
                type: 'button',
                onClick: () => {
                  if (window.openQuickOrderModal) window.openQuickOrderModal(product.id);
                },
              },
              'Купить'
            )
          : h(
              'button',
              {
                className: 'button button--primary button--sm product-card__button',
                type: 'button',
                disabled: true,
              },
              'Нет в наличии'
            ),
        h(
          'a',
          {
            className: 'button button--secondary button--sm',
            href: `product.html?id=${product.id}`,
          },
          'Подробнее'
        )
      )
    );
  }

  // ===============================
  // 4. Каталог комплектующих с живым поиском и фильтрами (catalog.html)
  // ===============================
  function CatalogApp() {
    const params = new URLSearchParams(window.location.search);

    const [category, setCategory] = useState(params.get('category') || 'all');
    const [socketFilter, setSocketFilter] = useState('all');
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [selectedBadges, setSelectedBadges] = useState([]);
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [search, setSearch] = useState(params.get('q') || '');
    const [sortBy, setSortBy] = useState('default');

    const toggleBadge = (badgeValue) => {
      setSelectedBadges((prev) =>
        prev.includes(badgeValue)
          ? prev.filter((b) => b !== badgeValue)
          : [...prev, badgeValue]
      );
    };

    const resetAll = () => {
      setCategory('all');
      setSocketFilter('all');
      setOnlyAvailable(false);
      setSelectedBadges([]);
      setPriceFrom('');
      setPriceTo('');
      setSearch('');
      setSortBy('default');
    };

    const filteredProducts = useMemo(() => {
      const q = search.trim().toLowerCase();
      const minP = priceFrom !== '' ? Number(priceFrom) : null;
      const maxP = priceTo !== '' ? Number(priceTo) : null;

      const list = store.PRODUCTS.filter((p) => {
        if (category !== 'all' && p.category !== category) return false;
        if (socketFilter !== 'all' && p.socket !== socketFilter) return false;
        if (onlyAvailable && !p.available) return false;
        if (selectedBadges.length > 0 && !selectedBadges.includes(p.badge)) return false;
        if (minP !== null && p.price < minP) return false;
        if (maxP !== null && p.price > maxP) return false;
        if (q) {
          const haystack = `${p.name} ${p.brand} ${p.categoryTitle} ${p.sku} ${p.socket || ''} ${p.shortDesc}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });

      if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (sortBy === 'rating-desc') list.sort((a, b) => b.rating - a.rating);
      else if (sortBy === 'title-asc') list.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

      return list;
    }, [category, socketFilter, onlyAvailable, selectedBadges, priceFrom, priceTo, search, sortBy]);

    const categories = [
      { value: 'all', label: 'Все товары (12)' },
      { value: 'gpu', label: 'Видеокарты' },
      { value: 'cpu', label: 'Процессоры' },
      { value: 'mobo', label: 'Материнские платы' },
      { value: 'memory', label: 'ОЗУ DDR5 и SSD' },
      { value: 'cooling', label: 'Охлаждение, БП, корпуса' },
    ];

    return h(
      'section',
      { className: 'catalog-layout' },
      h(
        'aside',
        { className: 'catalog-filters', 'aria-label': 'Фильтры каталога' },
        h('h2', { className: 'catalog-filters__title' }, 'Фильтры'),
        h(
          'form',
          { className: 'filters-form', onSubmit: (e) => e.preventDefault() },
          h(
            'fieldset',
            { className: 'filters-form__fieldset' },
            h('legend', { className: 'filters-form__legend' }, 'Категория'),
            categories.map((cat) =>
              h(
                'label',
                { key: cat.value, className: 'filters-form__label' },
                h('input', {
                  type: 'radio',
                  name: 'category',
                  value: cat.value,
                  checked: category === cat.value,
                  onChange: () => setCategory(cat.value),
                }),
                h('span', null, cat.label)
              )
            )
          ),
          h(
            'fieldset',
            { className: 'filters-form__fieldset' },
            h('legend', { className: 'filters-form__legend' }, 'Сокет (CPU / Платы)'),
            [
              { value: 'all', label: 'Любой сокет' },
              { value: 'AM5', label: 'Socket AM5' },
              { value: 'LGA 1700', label: 'Socket LGA 1700' },
            ].map((s) =>
              h(
                'label',
                { key: s.value, className: 'filters-form__label' },
                h('input', {
                  type: 'radio',
                  name: 'socket',
                  value: s.value,
                  checked: socketFilter === s.value,
                  onChange: () => setSocketFilter(s.value),
                }),
                h('span', null, s.label)
              )
            )
          ),
          h(
            'fieldset',
            { className: 'filters-form__fieldset' },
            h('legend', { className: 'filters-form__legend' }, 'Наличие и акции'),
            h(
              'label',
              { className: 'filters-form__label' },
              h('input', {
                type: 'checkbox',
                checked: onlyAvailable,
                onChange: (e) => setOnlyAvailable(e.target.checked),
              }),
              h('span', null, 'Только в наличии')
            ),
            ['Хит', 'Скидка', 'Новинка'].map((b) =>
              h(
                'label',
                { key: b, className: 'filters-form__label' },
                h('input', {
                  type: 'checkbox',
                  checked: selectedBadges.includes(b),
                  onChange: () => toggleBadge(b),
                }),
                h('span', null, b === 'Скидка' ? 'Со скидкой' : b)
              )
            )
          ),
          h(
            'fieldset',
            { className: 'filters-form__fieldset' },
            h('legend', { className: 'filters-form__legend' }, 'Цена, руб.'),
            h(
              'div',
              { className: 'filters-form__price-grid' },
              h(
                'div',
                null,
                h('label', { className: 'order-form__hint', htmlFor: 'price-from' }, 'От'),
                h('input', {
                  className: 'filters-form__input',
                  id: 'price-from',
                  type: 'number',
                  min: '0',
                  placeholder: '9000',
                  value: priceFrom,
                  onChange: (e) => setPriceFrom(e.target.value),
                })
              ),
              h(
                'div',
                null,
                h('label', { className: 'order-form__hint', htmlFor: 'price-to' }, 'До'),
                h('input', {
                  className: 'filters-form__input',
                  id: 'price-to',
                  type: 'number',
                  min: '0',
                  placeholder: '90000',
                  value: priceTo,
                  onChange: (e) => setPriceTo(e.target.value),
                })
              )
            )
          ),
          h(
            'div',
            { className: 'filters-form__actions' },
            h(
              'button',
              { className: 'button button--secondary', type: 'button', onClick: resetAll },
              'Сбросить фильтры'
            )
          )
        )
      ),
      h(
        'div',
        { className: 'catalog-products' },
        h(
          'div',
          { className: 'catalog-products__header' },
          h('h2', { className: 'catalog-products__title' }, 'Комплектующие для ПК'),
          h(
            'p',
            { className: 'catalog-products__count', id: 'catalog-count' },
            `Найдено товаров: ${filteredProducts.length} из ${store.PRODUCTS.length}`
          )
        ),
        h(
          'div',
          { className: 'catalog-toolbar' },
          h(
            'div',
            { className: 'search-box' },
            h('label', { className: 'visually-hidden', htmlFor: 'catalog-search' }, 'Поиск по каталогу'),
            h(SearchIcon),
            h('input', {
              className: 'order-form__input',
              id: 'catalog-search',
              type: 'search',
              placeholder: 'Поиск по модели, бренду или артикулу (RTX 4070, 7800X3D, DDR5)...',
              value: search,
              onChange: (e) => setSearch(e.target.value),
              autoComplete: 'off',
            })
          ),
          h(
            'div',
            null,
            h('label', { className: 'visually-hidden', htmlFor: 'catalog-sort' }, 'Сортировка товаров'),
            h(
              'select',
              {
                className: 'order-form__select',
                id: 'catalog-sort',
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value),
              },
              h('option', { value: 'default' }, 'Сортировка: популярные'),
              h('option', { value: 'price-asc' }, 'По цене: сначала дешевле'),
              h('option', { value: 'price-desc' }, 'По цене: сначала дороже'),
              h('option', { value: 'rating-desc' }, 'По рейтингу'),
              h('option', { value: 'title-asc' }, 'По названию: А — Я')
            )
          )
        ),
        filteredProducts.length === 0
          ? h(
              'div',
              { className: 'alert-box alert-box--warning' },
              'По выбранным параметрам товары не найдены. Попробуйте изменить запрос или ',
              h(
                'button',
                {
                  className: 'button button--secondary button--sm',
                  type: 'button',
                  style: { marginLeft: '8px' },
                  onClick: resetAll,
                },
                'сбросить фильтры'
              )
            )
          : h(
              'div',
              { className: 'products-grid' },
              filteredProducts.map((product) => h(ProductCard, { key: product.id, product }))
            )
      )
    );
  }

  // ===============================
  // 5. Страница «Личный кабинет» (account.html)
  // ===============================
  function AccountApp() {
    const { profile, orders } = useElectroStore();
    const [activeTab, setActiveTab] = useState('orders');
    const [formState, setFormState] = useState(profile);
    const [savedBanner, setSavedBanner] = useState(false);

    const initials = (profile.name || 'ГК')
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0] || '')
      .join('')
      .toUpperCase();

    const handleProfileSubmit = (e) => {
      e.preventDefault();
      store.saveProfile(formState);
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3500);
    };

    return h(
      React.Fragment,
      null,
      h(
        'div',
        { className: 'account-dashboard' },
        h(
          'div',
          { className: 'account-card' },
          h(
            'div',
            { className: 'account-profile-head' },
            h('div', { className: 'account-avatar', 'aria-hidden': 'true' }, initials),
            h(
              'div',
              null,
              h('h2', { style: { margin: '0 0 4px', fontSize: '19px' } }, profile.name),
              h('p', { className: 'text-muted', style: { margin: 0, fontSize: '14px' } }, profile.email),
              h(
                'p',
                { className: 'text-muted', style: { margin: '2px 0 0', fontSize: '14px' } },
                `Телефон: ${profile.phone}`
              )
            )
          ),
          h(
            'div',
            { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' } },
            h('span', { className: 'product__chip' }, `Заказов: ${orders.length}`),
            h('span', { className: 'product__chip' }, 'Постоянный покупатель')
          )
        ),
        h(
          'div',
          { className: 'account-card account-card--bonus' },
          h('span', { className: 'hero__tag' }, 'Бонусный счёт CoreClub'),
          h(
            'p',
            { className: 'account-bonus-points' },
            `${Number(profile.bonusPoints || 0).toLocaleString('ru-RU')} бонусов`
          ),
          h(
            'p',
            { className: 'text-muted', style: { margin: '0 0 14px', fontSize: '14px' } },
            '1 бонус = 1 рубль. Начисляем 1% бонусами с каждой покупки, ими можно оплатить до 20% стоимости заказа.'
          ),
          h(
            'div',
            { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } },
            h('a', { className: 'button button--primary button--sm', href: 'catalog.html' }, 'В каталог товаров'),
            h('a', { className: 'button button--secondary button--sm', href: 'order.html' }, 'Оформить заказ')
          )
        )
      ),
      h(
        'div',
        { className: 'account-tabs', role: 'tablist', 'aria-label': 'Разделы личного кабинета' },
        [
          { id: 'orders', label: `Мои заказы (${orders.length})` },
          { id: 'profile', label: 'Профиль и адрес' },
        ].map((tab) =>
          h(
            'button',
            {
              key: tab.id,
              type: 'button',
              role: 'tab',
              'aria-selected': String(activeTab === tab.id),
              className: `account-tab${activeTab === tab.id ? ' account-tab--active' : ''}`,
              onClick: () => setActiveTab(tab.id),
            },
            tab.label
          )
        )
      ),
      activeTab === 'orders'
        ? h(
            'div',
            { className: 'orders-list' },
            orders.map((ord) =>
              h(
                'article',
                { key: ord.orderNumber, className: 'order-history-card' },
                h(
                  'div',
                  { className: 'order-history-card__top' },
                  h(
                    'div',
                    null,
                    h('strong', { style: { fontSize: '16px' } }, `Заказ #${ord.orderNumber}`),
                    h(
                      'span',
                      { className: 'text-muted', style: { marginLeft: '10px', fontSize: '13px' } },
                      `от ${ord.date}`
                    )
                  ),
                  h(
                    'span',
                    { className: `status-pill${ord.isDone ? ' status-pill--done' : ''}` },
                    ord.status
                  )
                ),
                h('p', { style: { margin: '6px 0', fontWeight: 600 } }, ord.productName),
                ord.addons && ord.addons.length > 0
                  ? h(
                      'p',
                      { className: 'text-muted', style: { margin: '0 0 6px', fontSize: '13px' } },
                      `Доп. опции: ${ord.addons.join(', ')}`
                    )
                  : null,
                ord.bonusesUsed > 0
                  ? h(
                      'p',
                      { style: { margin: '0 0 6px', fontSize: '13px', color: 'var(--color-success-text)' } },
                      `Списано бонусов: −${store.formatPrice(ord.bonusesUsed)}`
                    )
                  : null,
                h(
                  'p',
                  { className: 'text-muted', style: { margin: '0 0 12px', fontSize: '13px' } },
                  `Получение: ${ord.delivery}`
                ),
                h(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                    },
                  },
                  h(
                    'strong',
                    { style: { fontSize: '17px', fontVariantNumeric: 'tabular-nums' } },
                    `Сумма: ${store.formatPrice(ord.total)}`
                  ),
                  h(
                    'button',
                    {
                      className: 'button button--secondary button--sm',
                      type: 'button',
                      onClick: () => {
                        if (window.openQuickOrderModal) window.openQuickOrderModal(ord.productName);
                      },
                    },
                    'Повторить заказ'
                  )
                )
              )
            )
          )
        : null,
      activeTab === 'profile'
        ? h(
            'form',
            { className: 'order-form', onSubmit: handleProfileSubmit },
            savedBanner
              ? h(
                  'div',
                  { className: 'alert-box alert-box--success', role: 'status' },
                  'Данные профиля успешно сохранены!'
                )
              : null,
            h(
              'fieldset',
              { className: 'order-form__fieldset' },
              h('legend', { className: 'order-form__legend' }, 'Контактные данные покупателя'),
              h(
                'div',
                { className: 'order-form__row' },
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'acc-name' }, 'Имя и фамилия'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'acc-name',
                    type: 'text',
                    required: true,
                    value: formState.name || '',
                    onChange: (e) => setFormState({ ...formState, name: e.target.value }),
                  })
                ),
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'acc-phone' }, 'Телефон'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'acc-phone',
                    type: 'tel',
                    required: true,
                    value: formState.phone || '',
                    onChange: (e) => setFormState({ ...formState, phone: e.target.value }),
                  })
                )
              ),
              h(
                'div',
                { className: 'order-form__row' },
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'acc-email' }, 'E-mail'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'acc-email',
                    type: 'email',
                    required: true,
                    value: formState.email || '',
                    onChange: (e) => setFormState({ ...formState, email: e.target.value }),
                  })
                ),
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'acc-addr' }, 'Адрес доставки'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'acc-addr',
                    type: 'text',
                    value: formState.address || '',
                    onChange: (e) => setFormState({ ...formState, address: e.target.value }),
                  })
                )
              ),
              h(
                'div',
                { className: 'order-form__actions' },
                h('button', { className: 'button button--primary', type: 'submit' }, 'Сохранить данные')
              )
            )
          )
        : null
    );
  }

  // ===============================
  // 6. Оформление заказа комплектующих (order.html)
  // ===============================
  function OrderFormApp() {
    const { profile } = useElectroStore();
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = Number(urlParams.get('id'));
    const availableProducts = store.PRODUCTS.filter((p) => p.available);

    const [productId, setProductId] = useState(
      availableProducts.some((p) => p.id === paramId) ? paramId : 1
    );
    const [qty, setQty] = useState(1);
    const [delivery, setDelivery] = useState('pickup');
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [useBonuses, setUseBonuses] = useState(false);
    const [bonusInput, setBonusInput] = useState(Number(profile.bonusPoints) || 0);
    const [name, setName] = useState(profile.name || '');
    const [phone, setPhone] = useState(profile.phone || '');
    const [email, setEmail] = useState(profile.email || '');
    const [comment, setComment] = useState('');
    const [agreed, setAgreed] = useState(true);
    const [submittedOrder, setSubmittedOrder] = useState(null);

    const product = store.getProductById(productId);
    const availableBalance = Number(profile.bonusPoints) || 0;

    const toggleAddon = (id) => {
      setSelectedAddons((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    const calc = useMemo(() => {
      const baseTotal = product.price * qty;
      const addonObjs = store.ADDONS.filter((a) => selectedAddons.includes(a.id));
      const addonsSum = addonObjs.reduce((acc, a) => acc + a.price, 0);
      const deliveryPrice =
        delivery === 'pickup' ? 0 : delivery === 'express' ? 890 : baseTotal >= 30000 ? 0 : 490;

      const subtotal = baseTotal + addonsSum;
      const maxRedeemable = Math.max(
        0,
        Math.min(availableBalance, Math.floor(subtotal * store.MAX_BONUS_SHARE))
      );
      const bonusesUsed = useBonuses
        ? Math.max(0, Math.min(Number(bonusInput) || 0, maxRedeemable))
        : 0;

      const finalTotal = Math.max(0, subtotal + deliveryPrice - bonusesUsed);
      const bonusCashback = store.calcCashback(finalTotal);

      return {
        baseTotal,
        addonObjs,
        addonsSum,
        deliveryPrice,
        maxRedeemable,
        bonusesUsed,
        finalTotal,
        bonusCashback,
      };
    }, [product, qty, selectedAddons, delivery, useBonuses, bonusInput, availableBalance]);

    const deliveryLabels = {
      pickup: 'Самовывоз из пункта выдачи (пр-т Вернадского, 78)',
      courier: 'Курьерская доставка по Москве',
      express: 'Экспресс-доставка за 2 часа',
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!e.currentTarget.checkValidity()) {
        e.currentTarget.reportValidity();
        return;
      }

      const result = store.addOrder({
        productName: qty > 1 ? `${product.name} × ${qty} шт.` : product.name,
        addons: calc.addonObjs.map((a) => a.title),
        delivery: deliveryLabels[delivery],
        total: calc.finalTotal,
        bonusesUsed: calc.bonusesUsed,
      });

      setUseBonuses(false);
      setSubmittedOrder(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return h(
      React.Fragment,
      null,
      submittedOrder
        ? h(
            'div',
            {
              className: 'alert-box alert-box--success',
              style: { width: 'min(100% - 32px, 1180px)', margin: '0 auto 24px' },
              role: 'status',
            },
            h('strong', null, `Заказ #${submittedOrder.order.orderNumber} успешно оформлен! `),
            submittedOrder.bonusesUsed > 0
              ? `Списано ${submittedOrder.bonusesUsed} Б. `
              : '',
            `В `,
            h('a', { href: 'account.html' }, 'Личном кабинете'),
            ` начислено +${submittedOrder.bonusEarned} Б (1%) и сохранена история заказа.`
          )
        : null,
      h(
        'form',
        { onSubmit: handleSubmit },
        h(
          'section',
          { className: 'order-layout' },
          h(
            'div',
            { className: 'order-form' },
            h(
              'fieldset',
              { className: 'order-form__fieldset' },
              h('legend', { className: 'order-form__legend' }, '1. Выбор товара и способа получения'),
              h(
                'div',
                { className: 'order-form__field' },
                h(
                  'label',
                  { className: 'order-form__label', htmlFor: 'cfg-product' },
                  'Комплектующее из каталога ',
                  h('span', { className: 'order-form__required', 'aria-hidden': 'true' }, '*')
                ),
                h(
                  'select',
                  {
                    className: 'order-form__select',
                    id: 'cfg-product',
                    value: productId,
                    onChange: (e) => setProductId(Number(e.target.value)),
                  },
                  availableProducts.map((p) =>
                    h(
                      'option',
                      { key: p.id, value: p.id },
                      `${p.name} — ${store.formatPrice(p.price)} (${p.sku})`
                    )
                  )
                )
              ),
              h(
                'div',
                { className: 'order-form__row' },
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'cfg-qty' }, 'Количество, шт.'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'cfg-qty',
                    type: 'number',
                    min: 1,
                    max: 10,
                    value: qty,
                    onChange: (e) => setQty(Math.max(1, Math.min(10, Number(e.target.value) || 1))),
                  })
                ),
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'cfg-delivery' }, 'Способ получения'),
                  h(
                    'select',
                    {
                      className: 'order-form__select',
                      id: 'cfg-delivery',
                      value: delivery,
                      onChange: (e) => setDelivery(e.target.value),
                    },
                    h('option', { value: 'pickup' }, 'Самовывоз (0 руб.)'),
                    h('option', { value: 'courier' }, 'Курьер по Москве (от 30 000 ₽ — 0 руб.)'),
                    h('option', { value: 'express' }, 'Экспресс за 2 часа (+890 руб.)')
                  )
                )
              )
            ),
            h(
              'fieldset',
              { className: 'order-form__fieldset' },
              h('legend', { className: 'order-form__legend' }, '2. Дополнительные опции'),
              h(
                'div',
                { className: 'addons-list' },
                store.ADDONS.map((addon) =>
                  h(
                    'label',
                    { key: addon.id, className: 'addon-option' },
                    h(
                      'span',
                      { className: 'addon-option__left' },
                      h('input', {
                        type: 'checkbox',
                        checked: selectedAddons.includes(addon.id),
                        onChange: () => toggleAddon(addon.id),
                      }),
                      h(
                        'span',
                        null,
                        h('strong', { className: 'addon-option__title' }, addon.title),
                        h('small', { className: 'addon-option__desc' }, addon.desc)
                      )
                    ),
                    h('span', { className: 'addon-option__price' }, `+${store.formatPrice(addon.price)}`)
                  )
                )
              )
            ),
            h(
              'fieldset',
              { className: 'order-form__fieldset' },
              h('legend', { className: 'order-form__legend' }, '3. Бонусы CoreClub'),
              h(
                'div',
                { className: 'order-form__field order-form__field--checkbox' },
                h(
                  'label',
                  { className: 'order-form__label', htmlFor: 'cfg-use-bonuses' },
                  h('input', {
                    id: 'cfg-use-bonuses',
                    type: 'checkbox',
                    disabled: calc.maxRedeemable <= 0,
                    checked: useBonuses && calc.maxRedeemable > 0,
                    onChange: (e) => {
                      const checked = e.target.checked;
                      setUseBonuses(checked);
                      if (checked) setBonusInput(calc.maxRedeemable);
                    },
                  }),
                  h(
                    'span',
                    null,
                    calc.maxRedeemable > 0
                      ? `Списать бонусы CoreClub (на счёте ${availableBalance.toLocaleString('ru-RU')} Б, можно списать до ${calc.maxRedeemable.toLocaleString('ru-RU')} Б)`
                      : 'На бонусном счёте пока нет доступных баллов для списания'
                  )
                )
              ),
              useBonuses && calc.maxRedeemable > 0
                ? h(
                    'div',
                    { className: 'order-form__field' },
                    h('label', { className: 'order-form__label', htmlFor: 'cfg-bonus-amount' }, 'Сколько бонусов списать (1 Б = 1 руб., до 20% от заказа)'),
                    h(
                      'div',
                      { className: 'bonus-slider-row' },
                      h(
                        'div',
                        { className: 'bonus-slider-wrap' },
                        h('input', {
                          className: 'bonus-slider',
                          id: 'cfg-bonus-range',
                          type: 'range',
                          min: 0,
                          max: calc.maxRedeemable,
                          step: 1,
                          'aria-label': 'Выбор количества списываемых бонусов ползунком',
                          value: Math.min(bonusInput, calc.maxRedeemable),
                          onChange: (e) =>
                            setBonusInput(
                              Math.max(0, Math.min(calc.maxRedeemable, Number(e.target.value) || 0))
                            ),
                        }),
                        h(
                          'div',
                          { className: 'bonus-slider__scale' },
                          h('span', null, '0 Б'),
                          h('span', null, `${calc.maxRedeemable.toLocaleString('ru-RU')} Б`)
                        )
                      ),
                      h('input', {
                        className: 'order-form__input',
                        id: 'cfg-bonus-amount',
                        type: 'number',
                        min: 0,
                        max: calc.maxRedeemable,
                        value: Math.min(bonusInput, calc.maxRedeemable),
                        onChange: (e) =>
                          setBonusInput(
                            Math.max(0, Math.min(calc.maxRedeemable, Number(e.target.value) || 0))
                          ),
                      })
                    )
                  )
                : null
            ),
            h(
              'fieldset',
              { className: 'order-form__fieldset' },
              h('legend', { className: 'order-form__legend' }, '4. Контакты получателя'),
              h(
                'div',
                { className: 'order-form__row' },
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'cfg-name' }, 'Имя и фамилия *'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'cfg-name',
                    type: 'text',
                    minLength: 2,
                    required: true,
                    value: name,
                    onChange: (e) => setName(e.target.value),
                  })
                ),
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'cfg-phone' }, 'Телефон *'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'cfg-phone',
                    type: 'tel',
                    required: true,
                    placeholder: '+7 (900) 000-00-00',
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                  })
                )
              ),
              h(
                'div',
                { className: 'order-form__field' },
                h('label', { className: 'order-form__label', htmlFor: 'cfg-email' }, 'E-mail для электронного чека *'),
                h('input', {
                  className: 'order-form__input',
                  id: 'cfg-email',
                  type: 'email',
                  required: true,
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                })
              ),
              h(
                'div',
                { className: 'order-form__field' },
                h('label', { className: 'order-form__label', htmlFor: 'cfg-comment' }, 'Комментарий к заказу'),
                h('textarea', {
                  className: 'order-form__textarea',
                  id: 'cfg-comment',
                  rows: 3,
                  placeholder: 'Удобное время доставки или пожелания по выдаче...',
                  value: comment,
                  onChange: (e) => setComment(e.target.value),
                })
              ),
              h(
                'div',
                { className: 'order-form__field order-form__field--checkbox' },
                h(
                  'label',
                  { className: 'order-form__label', htmlFor: 'cfg-agree' },
                  h('input', {
                    id: 'cfg-agree',
                    type: 'checkbox',
                    required: true,
                    checked: agreed,
                    onChange: (e) => setAgreed(e.target.checked),
                  }),
                  h('span', null, 'Согласен с условиями официальной гарантии и обработкой персональных данных *')
                )
              )
            )
          ),
          h(
            'aside',
            { className: 'order-summary' },
            h('h2', { className: 'order-summary__title' }, 'Ваш заказ'),
            h(
              'div',
              { style: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' } },
              h('img', {
                src: product.image,
                alt: product.name,
                width: 80,
                height: 60,
                style: { borderRadius: '6px', objectFit: 'cover', flexShrink: 0 },
              }),
              h(
                'div',
                null,
                h('strong', { style: { display: 'block', fontSize: '14px' } }, product.name),
                h('span', { className: 'text-muted', style: { fontSize: '12px' } }, `Артикул ${product.sku} • Гарантия ${product.warranty}`)
              )
            ),
            h(
              'ul',
              { className: 'order-summary__list' },
              h(
                'li',
                { className: 'order-summary__item' },
                h('span', null, `Товар (${qty} шт.):`),
                h('strong', null, store.formatPrice(calc.baseTotal))
              ),
              h(
                'li',
                { className: 'order-summary__item' },
                h('span', null, 'Доп. опции:'),
                h('strong', null, calc.addonsSum > 0 ? `+${store.formatPrice(calc.addonsSum)}` : 'Не выбрано')
              ),
              h(
                'li',
                { className: 'order-summary__item' },
                h('span', null, 'Доставка:'),
                h('strong', null, calc.deliveryPrice === 0 ? 'Бесплатно' : `+${store.formatPrice(calc.deliveryPrice)}`)
              ),
              calc.bonusesUsed > 0
                ? h(
                    'li',
                    { className: 'order-summary__item' },
                    h('span', null, 'Списание бонусов:'),
                    h('strong', { style: { color: 'var(--color-success)' } }, `−${store.formatPrice(calc.bonusesUsed)}`)
                  )
                : null,
              h(
                'li',
                { className: 'order-summary__item' },
                h('span', null, 'Начислим бонусов (1%):'),
                h('strong', { style: { color: 'var(--color-primary-light)' } }, `+${calc.bonusCashback} Б`)
              )
            ),
            h(
              'div',
              { className: 'order-summary__total' },
              h('span', null, 'Итого:'),
              h('span', null, store.formatPrice(calc.finalTotal))
            ),
            h(
              'div',
              { className: 'order-form__actions' },
              h('button', { className: 'button button--primary button--lg', style: { flex: 1 }, type: 'submit' }, 'Оформить заказ'),
              h(
                'button',
                {
                  className: 'button button--secondary',
                  type: 'button',
                  onClick: () => {
                    setQty(1);
                    setDelivery('pickup');
                    setSelectedAddons([]);
                    setUseBonuses(false);
                    setComment('');
                  },
                },
                'Сбросить'
              )
            )
          )
        )
      )
    );
  }

  const mount = (elementId, Component) => {
    const container = document.getElementById(elementId);
    if (container) {
      ReactDOM.createRoot(container).render(h(Component));
    }
  };

  mount('react-header-actions', HeaderActionsWidget);
  mount('react-chat-root', ChatConsultantWidget);
  mount('react-catalog-root', CatalogApp);
  mount('react-account-root', AccountApp);
  mount('react-order-root', OrderFormApp);
})();
