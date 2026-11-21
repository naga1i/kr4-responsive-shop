// ===============================
// Бизнес-логика и база комплектующих ПК магазина «CoreMirea» (JS Logic Layer)
// ===============================

(function () {
  const STORAGE_KEYS = {
    THEME: 'coremirea-theme',
    FAVORITES: 'coremirea-favorites',
    PROFILE: 'coremirea-profile',
    ORDERS: 'coremirea-orders',
  };

  const PRODUCTS = [
    {
      id: 1,
      sku: 'PC-4070S',
      name: 'Видеокарта Palit GeForce RTX 4070 SUPER JetStream OC 12GB',
      brand: 'Palit / NVIDIA',
      category: 'gpu',
      categoryTitle: 'Видеокарты',
      socket: null,
      tdp: 220,
      price: 83490,
      oldPrice: 88990,
      badge: 'Хит',
      cardModifier: 'product-card--featured',
      available: true,
      rating: 5.0,
      warranty: '36 месяцев',
      image: 'images/gpu-rtx4070s.jpg',
      responsiveBase: 'images/gpu-rtx4070s',
      shortDesc: '12 ГБ GDDR6X, 7168 ядер CUDA, DLSS 3.5 Frame Generation, тихое 3-вентиляторное охлаждение.',
      description:
        'Оптимальная видеокарта для 2K Ultra гейминга с трассировкой лучей, стриминга через NVENC AV1 и 3D-рендеринга в Blender. Массивный радиатор JetStream удерживает температуру чипа в пределах 64 °C.',
      specs: {
        'Графический процессор': 'NVIDIA GeForce RTX 4070 SUPER (Ada Lovelace, 5 нм)',
        'Видеопамять': '12 ГБ GDDR6X, шина 192 бит, 504 ГБ/с',
        'Частота Boost': 'До 2640 МГц (заводской OC-разгон)',
        'Энергопотребление': 'TDP 220 Вт, разъём 16-pin (12VHPWR), БП от 650 Вт',
      },
    },
    {
      id: 2,
      sku: 'PC-7800X3D',
      name: 'Процессор AMD Ryzen 7 7800X3D OEM (AM5, 8 ядер)',
      brand: 'AMD',
      category: 'cpu',
      categoryTitle: 'Процессоры',
      socket: 'AM5',
      tdp: 120,
      price: 30750,
      oldPrice: null,
      badge: 'Хит',
      cardModifier: 'product-card--featured',
      available: true,
      rating: 5.0,
      warranty: '12 месяцев',
      image: 'images/cpu-ryzen7800x3d.jpg',
      responsiveBase: 'images/cpu-ryzen7800x3d',
      shortDesc: 'Сокет AM5, 8 ядер / 16 потоков до 5.0 ГГц, гигантский 3D V-Cache L3 96 МБ — эталон для игр.',
      description:
        'Эталонный игровой процессор на архитектуре Zen 4 с вертикальным кэшем 3D V-Cache объёмом 96 МБ. Обеспечивает максимальный и стабильный 1% Low FPS в современных играх при скромном реальном потреблении.',
      specs: {
        'Сокет и архитектура': 'Socket AM5, AMD Zen 4 (5 нм Raphael)',
        'Ядра и потоки': '8 ядер / 16 потоков, частота 4.2 — 5.0 ГГц',
        'Кэш-память': 'L2: 8 МБ, L3: 96 МБ (3D V-Cache)',
        'Тепловыделение': 'TDP 120 Вт, встроенная графика Radeon Graphics',
      },
    },
    {
      id: 3,
      sku: 'PC-DDR5-32',
      name: 'Оперативная память G.Skill Trident Z5 RGB 32 ГБ (2×16 ГБ) DDR5-6000',
      brand: 'G.Skill',
      category: 'memory',
      categoryTitle: 'Память и SSD',
      socket: null,
      tdp: 10,
      price: 13490,
      oldPrice: null,
      badge: 'Хит',
      cardModifier: 'product-card--featured',
      available: true,
      rating: 4.9,
      warranty: '60 месяцев',
      image: 'images/ram-ddr5.jpg',
      responsiveBase: 'images/ram-ddr5',
      shortDesc: 'Двухканальный кит 32 ГБ DDR5 6000 МГц с низкими таймингами CL30, профили AMD EXPO и Intel XMP 3.0.',
      description:
        'Высокоскоростной комплект оперативной памяти на отборных чипах SK Hynix A-die с алюминиевыми радиаторами и адресуемой ARGB-подсветкой. Идеальная частота «золотой середины» для Ryzen 7000/9000 и Intel Core.',
      specs: {
        'Объём и состав': '32 ГБ (комплект 2 × 16 ГБ Dual Channel)',
        'Частота и тайминги': 'DDR5-6000 МГц, CL30-38-38-96, 1.35 В',
        'Профили разгона': 'AMD EXPO и Intel XMP 3.0 в один клик',
        'Охлаждение': 'Матовые чёрные алюминиевые радиаторы с ARGB',
      },
    },
    {
      id: 4,
      sku: 'PC-980PRO',
      name: 'SSD-накопитель Samsung 980 PRO 1 ТБ M.2 NVMe PCIe 4.0',
      brand: 'Samsung',
      category: 'memory',
      categoryTitle: 'Память и SSD',
      socket: null,
      tdp: 8,
      price: 11990,
      oldPrice: 13690,
      badge: 'Скидка',
      cardModifier: 'product-card--discount',
      available: true,
      rating: 4.9,
      warranty: '36 месяцев',
      image: 'images/ssd-980pro.jpg',
      responsiveBase: 'images/ssd-980pro',
      shortDesc: 'Скорость чтения до 7000 МБ/с, буфер DRAM 1 ГБ LPDDR4, фирменный контроллер Samsung Elpis.',
      description:
        'Сверхбыстрый твердотельный накопитель форм-фактора M.2 2280 с интерфейсом PCIe 4.0 x4 и полноценным DRAM-буфером. Моментально загружает операционную систему, тяжёлые проекты IDE и игровые локации DirectStorage.',
      specs: {
        'Форм-фактор': 'M.2 2280, интерфейс PCIe Gen 4.0 x4, NVMe 1.3c',
        'Скорость': 'Чтение до 7000 МБ/с, запись до 5000 МБ/с',
        'Память и буфер': 'Samsung 3-bit MLC V-NAND + 1 ГБ LPDDR4 DRAM',
        'Ресурс записи': '600 TBW, никелированное теплоотводящее покрытие',
      },
    },
    {
      id: 5,
      sku: 'PC-5060TI',
      name: 'Видеокарта PNY GeForce RTX 5060 Ti Overclocked 16GB',
      brand: 'PNY / NVIDIA',
      category: 'gpu',
      categoryTitle: 'Видеокарты',
      socket: null,
      tdp: 180,
      price: 56990,
      oldPrice: null,
      badge: 'Новинка',
      cardModifier: 'product-card--new',
      available: true,
      rating: 4.9,
      warranty: '36 месяцев',
      image: 'images/gpu-rtx5060ti.jpg',
      responsiveBase: null,
      shortDesc: 'Увеличенный буфер 16 ГБ видеопамяти, компактная двухслотовая конструкция, отлична для игр и нейросетей.',
      description:
        'Современная энергоэффективная видеокарта с 16 ГБ памяти — отличный выбор как для игр в 1440p, так и для локального запуска языковых моделей, Stable Diffusion и видеомонтажа в DaVinci Resolve.',
      specs: {
        'Графический процессор': 'NVIDIA GeForce RTX 5060 Ti Overclocked',
        'Видеопамять': '16 ГБ высокоскоростной памяти',
        'Охлаждение': 'Два осевых вентилятора с режимом полной остановки 0 dB',
        'Энергопотребление': 'TDP 180 Вт, рекомендуемый БП от 550 Вт',
      },
    },
    {
      id: 6,
      sku: 'PC-14600KF',
      name: 'Процессор Intel Core i5-14600KF OEM (LGA 1700, 14 ядер)',
      brand: 'Intel',
      category: 'cpu',
      categoryTitle: 'Процессоры',
      socket: 'LGA 1700',
      tdp: 125,
      price: 21890,
      oldPrice: 24990,
      badge: 'Скидка',
      cardModifier: 'product-card--discount',
      available: true,
      rating: 4.9,
      warranty: '12 месяцев',
      image: 'images/cpu-i514600kf.jpg',
      responsiveBase: null,
      shortDesc: 'Сокет LGA 1700, 14 ядер (6P + 8E) / 20 потоков, частота Turbo до 5.3 ГГц, разблокированный множитель.',
      description:
        'Универсальный 14-ядерный процессор поколения Raptor Lake Refresh для игровых и рабочих станций. Сочетает высокую однопоточную частоту 5.3 ГГц для игр и 20 потоков для компиляции кода и многозадачности.',
      specs: {
        'Сокет': 'Intel Socket LGA 1700',
        'Конфигурация ядер': '14 ядер (6 производительных + 8 энергоэффективных), 20 потоков',
        'Частоты и кэш': 'До 5.3 ГГц Turbo Boost, L2 20 МБ + L3 24 МБ',
        'Память и TDP': 'Поддержка DDR5-5600+ и DDR4, базовый TDP 125 Вт',
      },
    },
    {
      id: 7,
      sku: 'PC-B650-TUF',
      name: 'Материнская плата ASUS TUF GAMING B650-PLUS WIFI (AM5)',
      brand: 'ASUS',
      category: 'mobo',
      categoryTitle: 'Материнские платы',
      socket: 'AM5',
      tdp: 35,
      price: 20490,
      oldPrice: null,
      badge: 'Хит',
      cardModifier: 'product-card--featured',
      available: true,
      rating: 4.9,
      warranty: '36 месяцев',
      image: 'images/mobo-b650.jpg',
      responsiveBase: null,
      shortDesc: 'Сокет AM5, подсистема питания 12+2 фазы DrMOS, радиаторы на всех M.2 (PCIe 5.0), Wi-Fi 6 и 2.5G LAN.',
      description:
        'Полноразмерная ATX-плата повышенной надёжности серии TUF Gaming для процессоров AMD Ryzen 7000/8000/9000. Массивные радиаторы VRM легко справляются даже с 16-ядерными чипами под нагрузкой.',
      specs: {
        'Сокет и чипсет': 'Socket AM5, чипсет AMD B650, форм-фактор ATX',
        'Подсистема питания': '12+2 каскада питания (60A), 6-слойный текстолит',
        'Слоты памяти и M.2': '4× DDR5 до 192 ГБ (7600+ OC), 3× M.2 (включая PCIe 5.0 x4)',
        'Сеть и звук': 'Realtek 2.5Gb Ethernet, модуль Wi-Fi 6 + Bluetooth 5.2',
      },
    },
    {
      id: 8,
      sku: 'PC-B760-STRIX',
      name: 'Материнская плата ASUS ROG STRIX B760-F GAMING WIFI (LGA 1700)',
      brand: 'ASUS ROG',
      category: 'mobo',
      categoryTitle: 'Материнские платы',
      socket: 'LGA 1700',
      tdp: 35,
      price: 23990,
      oldPrice: null,
      badge: 'Новинка',
      cardModifier: 'product-card--new',
      available: true,
      rating: 4.8,
      warranty: '36 месяцев',
      image: 'images/mobo-b760.jpg',
      responsiveBase: null,
      shortDesc: 'Сокет LGA 1700, 16+1 фаза питания, слот PCIe 5.0 x16 с кнопкой Q-Release, звук SupremeFX и Wi-Fi 6E.',
      description:
        'Премиальная игровая материнская плата под процессоры Intel Core 12/13/14-го поколения с фирменной подсветкой ROG, усиленным слотом видеокарты SafeSlot и тремя скоростными разъёмами M.2 PCIe 4.0.',
      specs: {
        'Сокет и чипсет': 'Socket LGA 1700, Intel B760, форм-фактор ATX',
        'Питание VRM': '16+1 фаза по 60A с массивными алюминиевыми радиаторами',
        'Расширение': 'PCIe 5.0 x16 с кнопкой быстрого извлечения видеокарты',
        'Сеть и аудио': 'Intel 2.5Gb LAN, Wi-Fi 6E, кодек ROG SupremeFX ALC4080',
      },
    },
    {
      id: 9,
      sku: 'PC-H150I',
      name: 'СЖО Corsair iCUE H150i RGB ELITE 360 мм (TDP 300 Вт)',
      brand: 'Corsair',
      category: 'cooling',
      categoryTitle: 'Охлаждение, БП и корпуса',
      socket: null,
      tdp: 15,
      price: 15990,
      oldPrice: null,
      badge: 'Новинка',
      cardModifier: 'product-card--new',
      available: true,
      rating: 4.9,
      warranty: '36 месяцев',
      image: 'images/cooler-aio.jpg',
      responsiveBase: null,
      shortDesc: 'Трёхсекционная водянка 360 мм с медным водоблоком, 3×120 мм вентиляторами AF Elite и креплением AM5 / LGA 1700.',
      description:
        'Производительная необслуживаемая система жидкостного охлаждения с тихой помпой, гидродинамическими вентиляторами с режимом Zero RPM и яркой настраиваемой подсветкой крышки водоблока.',
      specs: {
        'Радиатор': '360 мм алюминиевый (397 × 120 × 27 мм)',
        'Вентиляторы': '3 × 120 мм Corsair AF120 Elite PWM (400 — 1850 об/мин)',
        'Совместимость': 'Socket AM5, AM4, Intel LGA 1700, 1200, 1851',
        'Отводимая мощность': 'До 300 Вт TDP, термопаста нанесена с завода',
      },
    },
    {
      id: 10,
      sku: 'PC-RM850E',
      name: 'Блок питания Corsair RM850e 850W (80 PLUS Gold, ATX 3.0)',
      brand: 'Corsair',
      category: 'cooling',
      categoryTitle: 'Охлаждение, БП и корпуса',
      socket: null,
      tdp: 0,
      price: 12990,
      oldPrice: null,
      badge: 'Хит',
      cardModifier: 'product-card--featured',
      available: true,
      rating: 4.9,
      warranty: '84 месяца',
      image: 'images/psu-850w.jpg',
      responsiveBase: null,
      shortDesc: 'Полностью модульный БП 850 Вт, сертификат 80+ Gold, родной кабель PCIe 5.0 12VHPWR для видеокарт RTX 40/50.',
      description:
        'Надёжный блок питания стандарта ATX 3.0 на базе резонансного преобразователя LLC и DC-DC с конденсаторами с рабочей температурой 105 °C. Поддерживает полупассивный бесшумный режим вентилятора.',
      specs: {
        'Мощность и КПД': '850 Вт по линии +12В (99.9%), сертификат 80 PLUS Gold',
        'Стандарт': 'ATX 3.0 и PCIe 5.0 (прямой кабель 12VHPWR 600 Вт в комплекте)',
        'Кабели': 'Полностью модульные плоские чёрные кабели',
        'Защиты': 'OVP, UVP, SCP, OTP, OPP, гарантия 7 лет',
      },
    },
    {
      id: 11,
      sku: 'PC-CASE-TG',
      name: 'Корпус Thermaltake View ARGB TG Black (Mid-Tower)',
      brand: 'Thermaltake',
      category: 'cooling',
      categoryTitle: 'Охлаждение, БП и корпуса',
      socket: null,
      tdp: 10,
      price: 9490,
      oldPrice: 10990,
      badge: 'Скидка',
      cardModifier: 'product-card--discount',
      available: true,
      rating: 4.8,
      warranty: '24 месяца',
      image: 'images/case-argb.jpg',
      responsiveBase: null,
      shortDesc: 'Закалённое стекло 4 мм, 4 предустановленных ARGB-вентилятора 120 мм с контроллером, поддержка СЖО 360 мм.',
      description:
        'Просторный продуваемый корпус формата Mid-Tower под платы ATX, Micro-ATX и Mini-ITX. Вмещает видеокарты длиной до 410 мм, башенные кулеры до 166 мм и оснащён магнитными пылевыми фильтрами.',
      specs: {
        'Форм-фактор': 'Mid-Tower (ATX, Micro-ATX, Mini-ITX)',
        'Охлаждение в комплекте': '4 × 120 мм ARGB PWM вентилятора + хаб подсветки',
        'Ограничения': 'Видеокарта до 410 мм, СЖО 360 мм сверху и спереди',
        'Панель ввода-вывода': 'USB 3.2 Gen 2 Type-C, 2× USB 3.0, HD Audio',
      },
    },
    {
      id: 12,
      sku: 'PC-7800XT',
      name: 'Видеокарта XFX AMD Radeon RX 7800 XT Speedster QICK 16GB',
      brand: 'XFX / AMD',
      category: 'gpu',
      categoryTitle: 'Видеокарты',
      socket: null,
      tdp: 263,
      price: 58490,
      oldPrice: null,
      badge: null,
      cardModifier: 'product-card--unavailable',
      available: false,
      rating: 4.8,
      warranty: '24 месяца',
      image: 'images/gpu-rx7800xt.jpg',
      responsiveBase: null,
      shortDesc: '16 ГБ видеопамяти GDDR6 256 бит, массивное 3-слотовое охлаждение, чистая мощь растеризации в 2K.',
      description:
        'Мощная игровая видеокарта архитектуры AMD RDNA 3 с 16 ГБ памяти и металлическим бэкплейтом. В данный момент партия раскуплена — доступна запись на поставку через чат-консультанта.',
      specs: {
        'Графический процессор': 'AMD Radeon RX 7800 XT (RDNA 3, 3840 потоковых ядер)',
        'Видеопамять': '16 ГБ GDDR6, шина 256 бит + 64 МБ Infinity Cache',
        'Длина карты': '335 мм, трёхвентиляторный кулер QICK 319',
        'Питание': '2 × 8-pin PCIe, TDP 263 Вт, БП от 700 Вт',
      },
    },
  ];

  const ADDONS = [
    {
      id: 'warranty_plus',
      title: 'Расширенная гарантия +1 год',
      desc: 'Дополнительный год сервисного обслуживания и приоритетная замена товара',
      price: 2490,
    },
    {
      id: 'bench_check',
      title: 'Проверка комплектующего на стенде перед выдачей',
      desc: 'Запуск и проверка работоспособности, температур и отсутствия дефектов при получении',
      price: 990,
    },
    {
      id: 'safe_pack',
      title: 'Усиленная антистатическая упаковка для доставки',
      desc: 'Дополнительная амортизирующая защита коробки при курьерской доставке',
      price: 490,
    },
  ];

  const PROMO_CODES = {
    WELCOME5: {
      code: 'WELCOME5',
      discountPercent: 5,
      discountFixed: 0,
      description: 'Скидка 5% на заказ комплектующих в интернет-магазине',
    },
    PARTS1500: {
      code: 'PARTS1500',
      discountPercent: 0,
      discountFixed: 1500,
      description: 'Скидка 1 500 руб. на заказ от 20 000 руб.',
    },
  };

  const DEFAULT_PROFILE = {
    name: 'Георгий Крапчатов',
    email: 'g.krapchatov@mail.ru',
    phone: '+7 (900) 555-24-80',
    address: 'г. Москва, пр-т Вернадского, д. 78',
    bonusPoints: 3450,
  };

  const DEFAULT_ORDERS = [
    {
      orderNumber: 'CM-2026-412',
      date: '2026-11-08',
      productName: 'SSD-накопитель Samsung 980 PRO 1 ТБ M.2 NVMe PCIe 4.0',
      addons: ['Проверка комплектующего на стенде перед выдачей'],
      delivery: 'Самовывоз из пункта выдачи (пр-т Вернадского, 78)',
      total: 12980,
      status: 'Выдан',
      isDone: true,
    },
    {
      orderNumber: 'CM-2026-489',
      date: '2026-11-17',
      productName: 'Видеокарта Palit GeForce RTX 4070 SUPER JetStream OC 12GB',
      addons: ['Расширенная гарантия +1 год'],
      delivery: 'Доставка курьером по Москве',
      total: 85980,
      status: 'Готов к выдаче',
      isDone: false,
    },
  ];

  const safeReadJson = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const safeWriteJson = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage quota errors
    }
  };

  const emitChange = (detail = {}) => {
    window.dispatchEvent(new CustomEvent('electrostore:change', { detail }));
  };

  const formatPrice = (num) =>
    `${Number(num || 0).toLocaleString('ru-RU')} руб.`;

  const getTheme = () => localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';

  const setTheme = (theme) => {
    const normalized = theme === 'light' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEYS.THEME, normalized);
    if (normalized === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    emitChange({ type: 'theme', theme: normalized });
  };

  const getFavorites = () => {
    const stored = safeReadJson(STORAGE_KEYS.FAVORITES, null);
    if (Array.isArray(stored)) {
      return stored.map(Number);
    }
    const initial = [1, 2, 3];
    safeWriteJson(STORAGE_KEYS.FAVORITES, initial);
    return initial;
  };

  const isFavorite = (productId) => getFavorites().includes(Number(productId));

  const toggleFavorite = (productId) => {
    const id = Number(productId);
    const current = getFavorites();
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    safeWriteJson(STORAGE_KEYS.FAVORITES, next);
    emitChange({ type: 'favorites', favorites: next });
    return next.includes(id);
  };

  const clearFavorites = () => {
    safeWriteJson(STORAGE_KEYS.FAVORITES, []);
    emitChange({ type: 'favorites', favorites: [] });
  };

  const getProfile = () => {
    const stored = safeReadJson(STORAGE_KEYS.PROFILE, null);
    if (stored && typeof stored === 'object') {
      return { ...DEFAULT_PROFILE, ...stored };
    }
    safeWriteJson(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    return { ...DEFAULT_PROFILE };
  };

  const saveProfile = (patch) => {
    const next = { ...getProfile(), ...patch };
    safeWriteJson(STORAGE_KEYS.PROFILE, next);
    emitChange({ type: 'profile', profile: next });
    return next;
  };

  const getOrders = () => {
    const stored = safeReadJson(STORAGE_KEYS.ORDERS, null);
    if (Array.isArray(stored)) {
      return stored;
    }
    safeWriteJson(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    return [...DEFAULT_ORDERS];
  };

  const addOrder = ({ productName, addons = [], delivery = 'Самовывоз из шоурума', total = 0 }) => {
    const orders = getOrders();
    const randomNum = Math.floor(510 + Math.random() * 480);
    const today = new Date().toISOString().slice(0, 10);
    const newOrder = {
      orderNumber: `CM-2026-${randomNum}`,
      date: today,
      productName,
      addons,
      delivery,
      total: Number(total) || 0,
      status: 'Принят в обработку',
      isDone: false,
    };
    const nextOrders = [newOrder, ...orders];
    safeWriteJson(STORAGE_KEYS.ORDERS, nextOrders);

    const bonusEarned = Math.max(100, Math.round((Number(total) || 0) * 0.03));
    const profile = getProfile();
    saveProfile({ bonusPoints: (Number(profile.bonusPoints) || 0) + bonusEarned });

    emitChange({ type: 'orders', order: newOrder });
    return { order: newOrder, bonusEarned };
  };

  const getProductById = (id) =>
    PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];

  const getProductByName = (name) =>
    PRODUCTS.find((p) => p.name === name) || PRODUCTS[0];

  setTheme(getTheme());

  window.ElectroStore = {
    PRODUCTS,
    ADDONS,
    PROMO_CODES,
    formatPrice,
    getTheme,
    setTheme,
    getFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getProfile,
    saveProfile,
    getOrders,
    addOrder,
    getProductById,
    getProductByName,
  };
})();
