// ===============================
// Пользовательский интерфейс на базе библиотеки React 18 (js/react-ui.js)
// Магазин комплектующих и сборки ПК «CoreMirea»:
// шапка действий, чат-консультант по сборке ПК (слева), каталог с живым поиском,
// избранное, личный кабинет и интерактивный конфигуратор сборки ПК с проверкой сокетов.
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
      favorites: store.getFavorites(),
      profile: store.getProfile(),
      orders: store.getOrders(),
    };
  }

  const HeartIcon = () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      h('path', {
        d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
      })
    );

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
      { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
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
      { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
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
  // 1. Панель пользователя в шапке (Избранное, Кабинет, Собрать ПК / Быстрый заказ, Тема)
  // ===============================
  function HeaderActionsWidget() {
    const { theme, favorites, profile } = useElectroStore();
    const path = window.location.pathname;
    const isFavPage = path.endsWith('favorites.html');
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
          className: `header-action-link${isFavPage ? ' header-action-link--active' : ''}`,
          href: 'favorites.html',
          'aria-label': `Избранное: позиций ${favorites.length}`,
          title: 'Избранные комплектующие',
        },
        h(HeartIcon),
        h('span', null, 'Избранное'),
        h('span', { className: 'header-action-link__badge' }, String(favorites.length))
      ),
      h(
        'a',
        {
          className: `header-action-link${isAccountPage ? ' header-action-link--active' : ''}`,
          href: 'account.html',
          title: 'Личный кабинет и мои сборки',
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
          className: 'theme-toggle',
          type: 'button',
          id: 'theme-toggle',
          'aria-label': themeLabel,
          title: themeLabel,
          onClick: () => store.setTheme(store.getTheme() === 'light' ? 'dark' : 'light'),
        },
        isLight ? h(MoonIcon) : h(SunIcon)
      )
    );
  }

  // ===============================
  // 2. Виджет чат-консультанта по сборке ПК (расположен СЛЕВА внизу)
  // ===============================
  function getConsultantReply(question) {
    const q = question.toLowerCase();
    if (q.includes('совмест') || q.includes('сокет') || q.includes('am5') || q.includes('1700')) {
      return 'Процессор Ryzen 7 7800X3D работает только с платами Socket AM5 (например, ASUS TUF B650-PLUS WIFI) и памятью DDR5. Для Intel Core i5-14600KF нужна плата LGA 1700 (ASUS ROG STRIX B760-F). В нашем конфигураторе (order.html) совместимость проверяется автоматически!';
    }
    if (q.includes('видеокарт') || q.includes('4070') || q.includes('5060') || q.includes('2k') || q.includes('fps')) {
      return 'Под монитор 2K 144–180 Гц оптимальный выбор — GeForce RTX 4070 SUPER 12GB (83 490 руб.). Для Full HD и нейросетей отлично подойдёт RTX 5060 Ti 16GB (56 990 руб.).';
    }
    if (q.includes('блок') || q.includes('бп') || q.includes('ватт') || q.includes('12vhpwr')) {
      return 'Для связки Ryzen 7 7800X3D + RTX 4070 SUPER рекомендуем Corsair RM850e 850W 80+ Gold ATX 3.0 (12 990 руб.) — у него прямой кабель 12VHPWR без переходников и запас мощности под апгрейд.';
    }
    if (q.includes('студ') || q.includes('скидк') || q.includes('промокод') || q.includes('мирэа')) {
      return 'По студенческому промокоду MIREA10 действует скидка 10%, а код BUILD1500 даёт скидку 1 500 руб. на сборку ПК! За каждый заказ начисляем 3% бонусами в Личный кабинет.';
    }
    if (q.includes('сборк') || q.includes('тест') || q.includes('гарант')) {
      return 'Собираем ПК за 24 часа с кабель-менеджментом (+3 490 руб.), прошиваем BIOS, включаем EXPO/XMP и проводим 4-часовой стресс-тест OCCT + FurMark. Гарантия на комплектующие — до 7 лет!';
    }
    if (q.includes('доставк') || q.includes('самовывоз') || q.includes('адрес')) {
      return 'Самовывоз из сборочного цеха и шоурума на пр-те Вернадского, 78 — бесплатно. Готовые системные блоки доставляем курьером по Москве в защитном транспортировочном коробе.';
    }
    return 'Инженер сборочного цеха CoreMirea на связи! Могу проверить совместимость ваших комплектующих, рассчитать блок питания или оформить резерв по тел. +7 (495) 777-24-80.';
  }

  function ChatConsultantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
      {
        id: 1,
        sender: 'bot',
        text: 'Привет! Я инженер-консультант «CoreMirea» по сборке ПК. Помочь подобрать видеокарту, проверить совместимость сокетов AM5 / LGA 1700 или подсказать промокод?',
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
      }, 320);
    };

    const quickQuestions = [
      { label: 'Сокеты AM5 / 1700', q: 'Как проверить совместимость процессора и платы AM5 / LGA 1700?' },
      { label: 'Карта под 2K', q: 'Какую видеокарту выбрать под 2K гейминг?' },
      { label: 'Расчёт БП', q: 'Какой блок питания нужен под RTX 4070 SUPER?' },
      { label: 'Скидка студентам', q: 'Какой промокод даёт скидку студентам?' },
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
          'aria-label': 'Онлайн чат с инженером по сборке ПК',
          hidden: !isOpen,
        },
        h(
          'div',
          { className: 'chat-widget__header' },
          h(
            'div',
            null,
            h('p', { className: 'chat-widget__title' }, 'Инженер сборки CoreMirea'),
            h('span', { className: 'chat-widget__status' }, '● В сети — подбор железа онлайн')
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
            placeholder: 'Спросите про сокет, FPS, БП...',
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
        h('span', null, 'Чат со сборщиком')
      )
    );
  }

  // ===============================
  // 3. Карточка комплектующего (общий React-компонент)
  // ===============================
  function ProductCard({ product, isFav, onToggleFav }) {
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
        product.badge ? h('span', { className: 'product-card__badge' }, product.badge) : null,
        h(
          'button',
          {
            className: `fav-btn${isFav ? ' fav-btn--active' : ''}`,
            type: 'button',
            'aria-pressed': String(isFav),
            'aria-label': isFav ? 'Убрать из избранного' : 'Добавить в избранное',
            title: isFav ? 'Убрать из избранного' : 'Добавить в избранное',
            onClick: () => onToggleFav(product.id),
          },
          h(HeartIcon)
        )
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
              'В заказ'
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
          'Характеристики'
        )
      )
    );
  }

  // ===============================
  // 4. Каталог комплектующих ПК с живым поиском, сокетами и фильтрацией (catalog.html)
  // ===============================
  function CatalogApp() {
    const { favorites } = useElectroStore();
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
      { value: 'all', label: 'Все комплектующие (12)' },
      { value: 'gpu', label: 'Видеокарты (GPU)' },
      { value: 'cpu', label: 'Процессоры (CPU)' },
      { value: 'mobo', label: 'Материнские платы' },
      { value: 'memory', label: 'ОЗУ DDR5 и NVMe SSD' },
      { value: 'cooling', label: 'СЖО, блоки питания, корпуса' },
    ];

    return h(
      'section',
      { className: 'catalog-layout' },
      h(
        'aside',
        { className: 'catalog-filters', 'aria-label': 'Фильтры комплектующих ПК' },
        h('h2', { className: 'catalog-filters__title' }, 'Подбор железа'),
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
            h('legend', { className: 'filters-form__legend' }, 'Платформа / Сокет (CPU + Платы)'),
            [
              { value: 'all', label: 'Любой сокет' },
              { value: 'AM5', label: 'Socket AM5 (AMD Ryzen)' },
              { value: 'LGA 1700', label: 'Socket LGA 1700 (Intel)' },
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
            h('legend', { className: 'filters-form__legend' }, 'Статус и наличие'),
            h(
              'label',
              { className: 'filters-form__label' },
              h('input', {
                type: 'checkbox',
                checked: onlyAvailable,
                onChange: (e) => setOnlyAvailable(e.target.checked),
              }),
              h('span', null, 'Только в наличии на складе')
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
          h('h2', { className: 'catalog-products__title' }, 'Комплектующие для сборки ПК'),
          h(
            'p',
            { className: 'catalog-products__count', id: 'catalog-count' },
            `Найдено комплектующих: ${filteredProducts.length} из ${store.PRODUCTS.length}`
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
              placeholder: 'Поиск по модели, чипу, сокету или коду (RTX 4070, 7800X3D, DDR5, AM5)...',
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
              h('option', { value: 'rating-desc' }, 'По оценке покупателей'),
              h('option', { value: 'title-asc' }, 'По названию: А — Я')
            )
          )
        ),
        filteredProducts.length === 0
          ? h(
              'div',
              { className: 'alert-box alert-box--warning' },
              'По выбранным параметрам комплектующие не найдены. Попробуйте изменить запрос или ',
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
              filteredProducts.map((product) =>
                h(ProductCard, {
                  key: product.id,
                  product,
                  isFav: favorites.includes(product.id),
                  onToggleFav: store.toggleFavorite,
                })
              )
            )
      )
    );
  }

  // ===============================
  // 5. Страница «Избранное» (favorites.html)
  // ===============================
  function FavoritesApp() {
    const { favorites } = useElectroStore();
    const favProducts = useMemo(
      () => store.PRODUCTS.filter((p) => favorites.includes(p.id)),
      [favorites]
    );
    const totalSum = favProducts.reduce((acc, p) => acc + p.price, 0);

    if (favProducts.length === 0) {
      return h(
        'div',
        { className: 'empty-state' },
        h('h2', { className: 'section__title' }, 'В избранном пока нет комплектующих'),
        h(
          'p',
          { className: 'section__text', style: { marginBottom: '20px' } },
          'Отмечайте сердечком видеокарты, процессоры и память в каталоге, чтобы отложить детали под будущую сборку ПК.'
        ),
        h(
          'div',
          { style: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' } },
          h('a', { className: 'button button--primary', href: 'catalog.html' }, 'Перейти в каталог железа'),
          h(
            'button',
            {
              className: 'button button--secondary',
              type: 'button',
              onClick: () => {
                store.toggleFavorite(1);
                store.toggleFavorite(2);
                store.toggleFavorite(3);
              },
            },
            'Добавить связку RTX 4070S + 7800X3D + DDR5'
          )
        )
      );
    }

    return h(
      React.Fragment,
      null,
      h(
        'div',
        {
          className: 'account-card',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
          },
        },
        h(
          'div',
          null,
          h('strong', { style: { fontSize: '18px' } }, `Отложено комплектующих: ${favProducts.length}`),
          h(
            'p',
            { className: 'section__text', style: { fontSize: '14px' } },
            `Суммарная стоимость выбранного железа: ${store.formatPrice(totalSum)}`
          )
        ),
        h(
          'div',
          { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } },
          h('a', { className: 'button button--primary button--sm', href: 'order.html' }, 'Открыть конфигуратор ПК'),
          h(
            'button',
            {
              className: 'button button--secondary button--sm',
              type: 'button',
              onClick: () => store.clearFavorites(),
            },
            'Очистить избранное'
          )
        )
      ),
      h(
        'div',
        { className: 'products-grid' },
        favProducts.map((product) =>
          h(ProductCard, {
            key: product.id,
            product,
            isFav: true,
            onToggleFav: store.toggleFavorite,
          })
        )
      )
    );
  }

  // ===============================
  // 6. Страница «Личный кабинет» (account.html)
  // ===============================
  function AccountApp() {
    const { profile, orders, favorites } = useElectroStore();
    const [activeTab, setActiveTab] = useState('orders');
    const [formState, setFormState] = useState(profile);
    const [savedBanner, setSavedBanner] = useState(false);
    const [copiedCode, setCopiedCode] = useState('');

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

    const copyPromo = (code) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000);
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
              h('h2', { style: { margin: '0 0 4px', fontSize: '20px' } }, profile.name),
              h(
                'p',
                { className: 'text-muted', style: { margin: 0, fontSize: '14px' } },
                `${profile.email} • Группа: ${profile.studentGroup || 'РТУ МИРЭА'}`
              ),
              h(
                'p',
                { className: 'text-muted', style: { margin: '2px 0 0', fontSize: '14px' } },
                `Телефон: ${profile.phone}`
              )
            )
          ),
          h(
            'div',
            { style: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' } },
            h('span', { className: 'product__chip' }, `Заказов и сборок: ${orders.length}`),
            h('span', { className: 'product__chip' }, `В избранном: ${favorites.length}`),
            h('span', { className: 'product__chip' }, 'Тариф: Студент МИРЭА (−10%)')
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
            '1 бонус = 1 рубль. Начисляем 3% бонусами за любые комплектующие и кастомные сборки ПК.'
          ),
          h(
            'div',
            { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } },
            h('a', { className: 'button button--primary button--sm', href: 'order.html' }, 'Собрать ПК в конфигураторе'),
            h('a', { className: 'button button--secondary button--sm', href: 'favorites.html' }, 'Моё избранное')
          )
        )
      ),
      h(
        'div',
        { className: 'account-tabs', role: 'tablist', 'aria-label': 'Разделы личного кабинета' },
        [
          { id: 'orders', label: `Мои заказы и сборки (${orders.length})` },
          { id: 'profile', label: 'Профиль и доставка' },
          { id: 'promos', label: 'Промокоды на железо' },
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
                    h('strong', { style: { fontSize: '17px' } }, `Заказ #${ord.orderNumber}`),
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
                      `Услуги цеха: ${ord.addons.join(', ')}`
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
                    { style: { fontSize: '18px', color: 'var(--color-primary)' } },
                    `Сумма: ${store.formatPrice(ord.total)}`
                  ),
                  h(
                    'a',
                    { className: 'button button--secondary button--sm', href: 'order.html' },
                    'Открыть в конфигураторе'
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
                  'Профиль покупателя сохранён и синхронизирован с шапкой и формами заказа!'
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
                  h('label', { className: 'order-form__label', htmlFor: 'acc-group' }, 'Учебная группа / статус'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'acc-group',
                    type: 'text',
                    value: formState.studentGroup || '',
                    onChange: (e) => setFormState({ ...formState, studentGroup: e.target.value }),
                  })
                )
              ),
              h(
                'div',
                { className: 'order-form__row' },
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'acc-phone' }, 'Телефон для SMS'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'acc-phone',
                    type: 'tel',
                    required: true,
                    value: formState.phone || '',
                    onChange: (e) => setFormState({ ...formState, phone: e.target.value }),
                  })
                ),
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'acc-email' }, 'E-mail для чека и гарантии'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'acc-email',
                    type: 'email',
                    required: true,
                    value: formState.email || '',
                    onChange: (e) => setFormState({ ...formState, email: e.target.value }),
                  })
                )
              ),
              h(
                'div',
                { className: 'order-form__field' },
                h('label', { className: 'order-form__label', htmlFor: 'acc-addr' }, 'Адрес доставки готового ПК'),
                h('input', {
                  className: 'order-form__input',
                  id: 'acc-addr',
                  type: 'text',
                  value: formState.address || '',
                  onChange: (e) => setFormState({ ...formState, address: e.target.value }),
                })
              ),
              h(
                'div',
                { className: 'order-form__actions' },
                h('button', { className: 'button button--primary', type: 'submit' }, 'Сохранить данные')
              )
            )
          )
        : null,
      activeTab === 'promos'
        ? h(
            'div',
            { className: 'promo-grid' },
            Object.values(store.PROMO_CODES).map((p) =>
              h(
                'div',
                { key: p.code, className: 'promo-card' },
                h(
                  'div',
                  null,
                  h('span', { className: 'promo-code' }, p.code),
                  h('p', { style: { margin: '8px 0 0', fontSize: '14px' } }, p.description)
                ),
                h(
                  'button',
                  {
                    className: 'button button--secondary button--sm',
                    type: 'button',
                    onClick: () => copyPromo(p.code),
                  },
                  copiedCode === p.code ? 'Скопировано!' : 'Скопировать код'
                )
              )
            )
          )
        : null
    );
  }

  // ===============================
  // 7. Интерактивный Конфигуратор сборки ПК и заказа комплектующих (order.html)
  // ===============================
  function OrderConfiguratorApp() {
    const { profile } = useElectroStore();
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = Number(urlParams.get('id'));
    const availableProducts = store.PRODUCTS.filter((p) => p.available);

    const [mode, setMode] = useState(paramId ? 'single' : 'builder');
    // Состояние для одиночного товара
    const [singleId, setSingleId] = useState(
      availableProducts.some((p) => p.id === paramId) ? paramId : 1
    );
    const [qty, setQty] = useState(1);

    // Состояние для полной сборки ПК
    const [cpuId, setCpuId] = useState(2); // Ryzen 7 7800X3D (AM5)
    const [moboId, setMoboId] = useState(7); // ASUS TUF B650 (AM5)
    const [gpuId, setGpuId] = useState(1); // RTX 4070 SUPER
    const [ramId, setRamId] = useState(3); // 32GB DDR5-6000
    const [ssdId, setSsdId] = useState(4); // Samsung 980 PRO 1TB
    const [coolerId, setCoolerId] = useState(9); // Corsair H150i 360mm
    const [psuId, setPsuId] = useState(10); // Corsair RM850e 850W
    const [caseId, setCaseId] = useState(11); // Thermaltake ARGB TG

    const [delivery, setDelivery] = useState('pickup');
    const [selectedAddons, setSelectedAddons] = useState(paramId ? [] : ['assembly', 'bios_os']);
    const [promoInput, setPromoInput] = useState('MIREA10');
    const [name, setName] = useState(profile.name || '');
    const [phone, setPhone] = useState(profile.phone || '');
    const [email, setEmail] = useState(profile.email || '');
    const [comment, setComment] = useState('');
    const [agreed, setAgreed] = useState(true);
    const [submittedOrder, setSubmittedOrder] = useState(null);

    const cpu = store.getProductById(cpuId);
    const mobo = store.getProductById(moboId);
    const socketCompatible = cpu.socket === mobo.socket;

    const fixCompatibleMobo = () => {
      const match = store.PRODUCTS.find((p) => p.category === 'mobo' && p.socket === cpu.socket);
      if (match) setMoboId(match.id);
    };

    const toggleAddon = (id) => {
      setSelectedAddons((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    const calc = useMemo(() => {
      const buildParts = [cpuId, moboId, gpuId, ramId, ssdId, coolerId, psuId, caseId].map((id) =>
        store.getProductById(id)
      );
      const singleProd = store.getProductById(singleId);

      const baseTotal =
        mode === 'builder'
          ? buildParts.reduce((s, p) => s + p.price, 0)
          : singleProd.price * qty;

      const estimatedTdp =
        mode === 'builder'
          ? buildParts.reduce((s, p) => s + (p.tdp || 0), 0) + 45
          : (singleProd.tdp || 0) * qty;

      const addonObjs = store.ADDONS.filter((a) => selectedAddons.includes(a.id));
      const addonsSum = addonObjs.reduce((acc, a) => acc + a.price, 0);
      const deliveryPrice =
        delivery === 'pickup' ? 0 : delivery === 'express' ? 890 : baseTotal >= 30000 ? 0 : 490;

      const normalizedCode = promoInput.trim().toUpperCase();
      const promoObj = store.PROMO_CODES[normalizedCode] || null;

      let discount = 0;
      if (promoObj) {
        if (promoObj.discountPercent > 0) {
          discount = Math.round(((baseTotal + addonsSum) * promoObj.discountPercent) / 100);
        } else if (promoObj.discountFixed > 0 && baseTotal >= 20000) {
          discount = promoObj.discountFixed;
        }
      }

      const finalTotal = Math.max(0, baseTotal + addonsSum + deliveryPrice - discount);
      const bonusCashback = Math.max(100, Math.round(finalTotal * 0.03));

      return {
        buildParts,
        singleProd,
        baseTotal,
        estimatedTdp,
        addonObjs,
        addonsSum,
        deliveryPrice,
        promoObj,
        discount,
        finalTotal,
        bonusCashback,
      };
    }, [mode, cpuId, moboId, gpuId, ramId, ssdId, coolerId, psuId, caseId, singleId, qty, selectedAddons, delivery, promoInput]);

    const deliveryLabels = {
      pickup: 'Самовывоз из сборочного шоурума (пр-т Вернадского, 78)',
      courier: 'Бережная доставка по Москве',
      express: 'Экспресс-доставка в день готовности (+890 руб.)',
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (mode === 'builder' && !socketCompatible) {
        fixCompatibleMobo();
        return;
      }
      if (!e.currentTarget.checkValidity()) {
        e.currentTarget.reportValidity();
        return;
      }

      const titleSummary =
        mode === 'builder'
          ? `Сборка ПК (${cpu.socket}): ${cpu.name.replace('Процессор ', '')} + ${store
              .getProductById(gpuId)
              .name.replace('Видеокарта ', '')}`
          : qty > 1
            ? `${calc.singleProd.name} × ${qty} шт.`
            : calc.singleProd.name;

      const result = store.addOrder({
        productName: titleSummary,
        addons: calc.addonObjs.map((a) => a.title),
        delivery: deliveryLabels[delivery],
        total: calc.finalTotal,
      });

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
            h('strong', null, `Заказ #${submittedOrder.order.orderNumber} передан в сборочный цех! `),
            `В `,
            h('a', { href: 'account.html' }, 'Личном кабинете'),
            ` начислено +${submittedOrder.bonusEarned} бонусов и добавлен статус сборки.`
          )
        : null,
      h(
        'div',
        {
          className: 'account-tabs',
          style: { width: 'min(100% - 32px, 1180px)', margin: '0 auto 20px' },
          role: 'tablist',
          'aria-label': 'Режим оформления заказа',
        },
        h(
          'button',
          {
            type: 'button',
            className: `account-tab${mode === 'builder' ? ' account-tab--active' : ''}`,
            onClick: () => setMode('builder'),
          },
          'Конфигуратор полной сборки ПК'
        ),
        h(
          'button',
          {
            type: 'button',
            className: `account-tab${mode === 'single' ? ' account-tab--active' : ''}`,
            onClick: () => setMode('single'),
          },
          'Заказ отдельного комплектующего'
        )
      ),
      h(
        'form',
        { onSubmit: handleSubmit },
        h(
          'section',
          { className: 'order-layout' },
          h(
            'div',
            { className: 'order-form' },
            mode === 'builder'
              ? h(
                  'fieldset',
                  { className: 'order-form__fieldset' },
                  h('legend', { className: 'order-form__legend' }, '1. Конфигурация системного блока (проверка совместимости)'),
                  socketCompatible
                    ? h(
                        'div',
                        { className: 'alert-box alert-box--success', style: { margin: 0 } },
                        `✓ Совместимость проверена: платформа ${cpu.socket} + DDR5 • Расчётное энергопотребление ~${calc.estimatedTdp} Вт (запас БП 850 Вт оптимален)`
                      )
                    : h(
                        'div',
                        { className: 'alert-box alert-box--warning' },
                        `⚠ Внимание: сокет процессора (${cpu.socket}) не совпадает с сокетом материнской платы (${mobo.socket})! `,
                        h(
                          'button',
                          {
                            className: 'button button--primary button--sm',
                            type: 'button',
                            style: { marginLeft: '8px' },
                            onClick: fixCompatibleMobo,
                          },
                          `Подобрать плату под ${cpu.socket}`
                        )
                      ),
                  h(
                    'div',
                    { className: 'order-form__row' },
                    h(
                      'div',
                      { className: 'order-form__field' },
                      h('label', { className: 'order-form__label', htmlFor: 'b-cpu' }, 'Процессор (CPU)'),
                      h(
                        'select',
                        {
                          className: 'order-form__select',
                          id: 'b-cpu',
                          value: cpuId,
                          onChange: (e) => setCpuId(Number(e.target.value)),
                        },
                        store.PRODUCTS.filter((p) => p.category === 'cpu').map((p) =>
                          h('option', { key: p.id, value: p.id }, `${p.name} — ${store.formatPrice(p.price)}`)
                        )
                      )
                    ),
                    h(
                      'div',
                      { className: 'order-form__field' },
                      h('label', { className: 'order-form__label', htmlFor: 'b-mobo' }, 'Материнская плата'),
                      h(
                        'select',
                        {
                          className: 'order-form__select',
                          id: 'b-mobo',
                          value: moboId,
                          onChange: (e) => setMoboId(Number(e.target.value)),
                        },
                        store.PRODUCTS.filter((p) => p.category === 'mobo').map((p) =>
                          h('option', { key: p.id, value: p.id }, `${p.name} — ${store.formatPrice(p.price)}`)
                        )
                      )
                    )
                  ),
                  h(
                    'div',
                    { className: 'order-form__field' },
                    h('label', { className: 'order-form__label', htmlFor: 'b-gpu' }, 'Видеокарта (GPU)'),
                    h(
                      'select',
                      {
                        className: 'order-form__select',
                        id: 'b-gpu',
                        value: gpuId,
                        onChange: (e) => setGpuId(Number(e.target.value)),
                      },
                      availableProducts
                        .filter((p) => p.category === 'gpu')
                        .map((p) =>
                          h('option', { key: p.id, value: p.id }, `${p.name} — ${store.formatPrice(p.price)}`)
                        )
                    )
                  ),
                  h(
                    'div',
                    { className: 'order-form__row' },
                    h(
                      'div',
                      { className: 'order-form__field' },
                      h('label', { className: 'order-form__label', htmlFor: 'b-ram' }, 'Оперативная память'),
                      h(
                        'select',
                        {
                          className: 'order-form__select',
                          id: 'b-ram',
                          value: ramId,
                          onChange: (e) => setRamId(Number(e.target.value)),
                        },
                        store.PRODUCTS.filter((p) => p.id === 3).map((p) =>
                          h('option', { key: p.id, value: p.id }, `${p.name} — ${store.formatPrice(p.price)}`)
                        )
                      )
                    ),
                    h(
                      'div',
                      { className: 'order-form__field' },
                      h('label', { className: 'order-form__label', htmlFor: 'b-ssd' }, 'NVMe накопитель'),
                      h(
                        'select',
                        {
                          className: 'order-form__select',
                          id: 'b-ssd',
                          value: ssdId,
                          onChange: (e) => setSsdId(Number(e.target.value)),
                        },
                        store.PRODUCTS.filter((p) => p.id === 4).map((p) =>
                          h('option', { key: p.id, value: p.id }, `${p.name} — ${store.formatPrice(p.price)}`)
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
                      h('label', { className: 'order-form__label', htmlFor: 'b-cool' }, 'Охлаждение процессора'),
                      h(
                        'select',
                        {
                          className: 'order-form__select',
                          id: 'b-cool',
                          value: coolerId,
                          onChange: (e) => setCoolerId(Number(e.target.value)),
                        },
                        store.PRODUCTS.filter((p) => p.id === 9).map((p) =>
                          h('option', { key: p.id, value: p.id }, `${p.name} — ${store.formatPrice(p.price)}`)
                        )
                      )
                    ),
                    h(
                      'div',
                      { className: 'order-form__field' },
                      h('label', { className: 'order-form__label', htmlFor: 'b-case' }, 'Блок питания и корпус'),
                      h(
                        'input',
                        {
                          className: 'order-form__input',
                          id: 'b-case',
                          type: 'text',
                          readOnly: true,
                          value: 'Corsair RM850e Gold + Thermaltake ARGB TG',
                        }
                      )
                    )
                  )
                )
              : h(
                  'fieldset',
                  { className: 'order-form__fieldset' },
                  h('legend', { className: 'order-form__legend' }, '1. Выбор комплектующего и количества'),
                  h(
                    'div',
                    { className: 'order-form__field' },
                    h('label', { className: 'order-form__label', htmlFor: 'cfg-product' }, 'Комплектующее из каталога *'),
                    h(
                      'select',
                      {
                        className: 'order-form__select',
                        id: 'cfg-product',
                        value: singleId,
                        onChange: (e) => setSingleId(Number(e.target.value)),
                      },
                      availableProducts.map((p) =>
                        h('option', { key: p.id, value: p.id }, `${p.name} — ${store.formatPrice(p.price)} (${p.sku})`)
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
                        h('option', { value: 'pickup' }, 'Самовывоз из шоурума (0 руб.)'),
                        h('option', { value: 'courier' }, 'Доставка по Москве (от 30 000 ₽ — 0 руб.)'),
                        h('option', { value: 'express' }, 'Экспресс-курьер (+890 руб.)')
                      )
                    )
                  )
                ),
            h(
              'fieldset',
              { className: 'order-form__fieldset' },
              h('legend', { className: 'order-form__legend' }, '2. Услуги сборочного цеха CoreMirea'),
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
              h('legend', { className: 'order-form__legend' }, '3. Промокод и контакты получателя'),
              h(
                'div',
                { className: 'order-form__row' },
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'cfg-promo' }, 'Промокод'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'cfg-promo',
                    type: 'text',
                    placeholder: 'MIREA10 или BUILD1500',
                    value: promoInput,
                    onChange: (e) => setPromoInput(e.target.value),
                  }),
                  h(
                    'small',
                    { className: 'order-form__hint' },
                    calc.promoObj
                      ? `Активен код ${calc.promoObj.code}: экономия ${store.formatPrice(calc.discount)}`
                      : 'Доступные коды: MIREA10 (−10%), BUILD1500 (−1 500 ₽)'
                  )
                ),
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
                )
              ),
              h(
                'div',
                { className: 'order-form__row' },
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
                ),
                h(
                  'div',
                  { className: 'order-form__field' },
                  h('label', { className: 'order-form__label', htmlFor: 'cfg-email' }, 'E-mail для гарантийного талона *'),
                  h('input', {
                    className: 'order-form__input',
                    id: 'cfg-email',
                    type: 'email',
                    required: true,
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                  })
                )
              ),
              h(
                'div',
                { className: 'order-form__field' },
                h('label', { className: 'order-form__label', htmlFor: 'cfg-comment' }, 'Пожелания к сборке / цвету подсветки ARGB'),
                h('textarea', {
                  className: 'order-form__textarea',
                  id: 'cfg-comment',
                  rows: 3,
                  placeholder: 'Например: выставить профиль подсветки в синий цвет, разбить SSD на два раздела...',
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
            h(
              'h2',
              { className: 'order-summary__title' },
              mode === 'builder' ? 'Сводка вашей сборки ПК' : 'Ваш заказ'
            ),
            h(
              'ul',
              { className: 'order-summary__list' },
              mode === 'builder'
                ? calc.buildParts.map((part) =>
                    h(
                      'li',
                      { key: part.id, className: 'order-summary__item' },
                      h('span', null, part.categoryTitle + ':'),
                      h('strong', { style: { textAlign: 'right' } }, store.formatPrice(part.price))
                    )
                  )
                : h(
                    'li',
                    { className: 'order-summary__item' },
                    h('span', null, `${calc.singleProd.name} (${qty} шт.):`),
                    h('strong', null, store.formatPrice(calc.baseTotal))
                  ),
              h(
                'li',
                { className: 'order-summary__item' },
                h('span', null, 'Услуги цеха:'),
                h('strong', null, calc.addonsSum > 0 ? `+${store.formatPrice(calc.addonsSum)}` : 'Без сборки')
              ),
              h(
                'li',
                { className: 'order-summary__item' },
                h('span', null, 'Доставка:'),
                h('strong', null, calc.deliveryPrice === 0 ? 'Бесплатно' : `+${store.formatPrice(calc.deliveryPrice)}`)
              ),
              calc.discount > 0
                ? h(
                    'li',
                    { className: 'order-summary__item' },
                    h('span', null, `Скидка (${calc.promoObj.code}):`),
                    h('strong', { style: { color: 'var(--color-success)' } }, `−${store.formatPrice(calc.discount)}`)
                  )
                : null,
              h(
                'li',
                { className: 'order-summary__item' },
                h('span', null, 'Бонусы CoreClub:'),
                h('strong', { style: { color: 'var(--color-primary)' } }, `+${calc.bonusCashback} Б`)
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
              h(
                'button',
                { className: 'button button--primary button--lg', style: { flex: 1 }, type: 'submit' },
                mode === 'builder' ? 'Заказать сборку ПК' : 'Оформить заказ'
              ),
              h(
                'button',
                {
                  className: 'button button--secondary',
                  type: 'button',
                  onClick: () => {
                    setSelectedAddons([]);
                    setPromoInput('');
                    setComment('');
                  },
                },
                'Сбросить опции'
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
  mount('react-favorites-root', FavoritesApp);
  mount('react-account-root', AccountApp);
  mount('react-order-root', OrderConfiguratorApp);
})();
