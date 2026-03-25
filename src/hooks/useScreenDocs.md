# useScreen Hook - Полная документация

## 📦 Установка

Просто скопируйте хук в ваш проект:

```tsx
import { useScreen, DeviceSlot, breakpoints } from './hooks/useScreen'
```

## 🎯 Основные возможности

- 🔍 Определение текущего устройства (phone, tablet, laptop, desktop)
- 📱 Адаптивные значения с интерполяцией и наследованием
- 🎨 Компонент `DeviceSlot` для условного рендеринга
- ⚡ LRU кэш для оптимизации производительности
- 📐 Медиа-запросы и брейкпоинты

---

## 📱 Основное использование

### Получение текущего устройства

```tsx
const Component = () => {
  const { currentDevice, isPhone, isTablet, isLaptop, isDesktop } = useScreen()
  
  return (
    <div>
      <p>Текущее устройство: {currentDevice}</p>
      {isPhone && <p>📱 Вы на телефоне</p>}
      {isTablet && <p>📟 Вы на планшете</p>}
      {isLaptop && <p>💻 Вы на ноутбуке</p>}
      {isDesktop && <p>🖥️ Вы на десктопе</p>}
    </div>
  )
}
```

### Удобные флаги

```tsx
const Component = () => {
  const { isTouch, isPointer } = useScreen()
  
  return (
    <div>
      {isTouch && <button>👆 Тап для открытия</button>}
      {isPointer && <button>🖱️ Клик для открытия</button>}
    </div>
  )
}
```

---

## 🎨 Адаптивные значения (adaptiveValue)

### Базовое использование

```tsx
const Component = () => {
  const { adaptiveValue } = useScreen()
  
  const padding = adaptiveValue({ 
    phone: 8, 
    tablet: 12, 
    desktop: 16 
  }, { unit: 'px' })
  
  const fontSize = adaptiveValue({ 
    phone: 14, 
    desktop: 18 
  })
  
  return <div style={{ padding, fontSize }}>Контент</div>
}
```

### Наследование значений (inherit)

```tsx
// Наследование вниз (по умолчанию) - значения распространяются на меньшие устройства
const margin = adaptiveValue({ 
  desktop: 24,
  tablet: 16
}, { inherit: 'down' })
// Результат: phone: 16, tablet: 16, laptop: 24, desktop: 24

// Наследование вверх - значения распространяются на большие устройства
const gap = adaptiveValue({ 
  phone: 8,
  laptop: 16
}, { inherit: 'up' })
// Результат: phone: 8, tablet: 8, laptop: 16, desktop: 16

// Без наследования
const width = adaptiveValue({ 
  phone: 100,
  desktop: 300
}, { inherit: 'none' })
// Результат: phone: 100, tablet: undefined, laptop: undefined, desktop: 300
```

### Плавная интерполяция (smooth)

```tsx
// Плавный переход значений между брейкпоинтами
const fontSize = adaptiveValue({ 
  phone: 14, 
  tablet: 16,
  desktop: 20 
}, { 
  smooth: true,
  unit: 'px'
})
// Значения будут интерполированы для всех промежуточных устройств
// phone: 14px, tablet: 16px, laptop: 18px, desktop: 20px
```

### Значение по умолчанию

```tsx
// default используется для всех незаданных устройств
const spacing = adaptiveValue({ 
  phone: 8,
  default: 16
})
// Результат: phone: 8, tablet: 16, laptop: 16, desktop: 16
```

### Комбинирование всех опций

```tsx
const styles = useMemo(() => ({
  container: {
    padding: adaptiveValue({ phone: 8, desktop: 24 }, { unit: 'px' }),
    gap: adaptiveValue({ phone: 4, tablet: 8, laptop: 12 }, { smooth: true, unit: 'px' }),
    fontSize: adaptiveValue({ phone: 14, desktop: 18 }, { inherit: 'up', unit: 'px' })
  }
}), [adaptiveValue])
```

---

## 🎭 Компонент DeviceSlot

### Базовое использование

```tsx
// Только на телефоне
<DeviceSlot match="phone">
  <div>📱 Мобильное меню</div>
</DeviceSlot>

// Только на десктопе
<DeviceSlot match="desktop">
  <div>🖥️ Десктопная навигация</div>
</DeviceSlot>
```

### Несколько устройств

```tsx
// Массив устройств
<DeviceSlot match={['phone', 'tablet']}>
  <div>📱📟 Мобильная версия</div>
</DeviceSlot>
```

### Исключение устройств

```tsx
// Все кроме телефона
<DeviceSlot match="not:phone">
  <div>Показывать на всех устройствах кроме телефона</div>
</DeviceSlot>

// Все кроме телефона и планшета
<DeviceSlot match={['not:phone', 'not:tablet']}>
  <div>Только ноутбук и десктоп</div>
</DeviceSlot>
```

### Диапазоны

```tsx
// От планшета до ноутбука (включительно)
<DeviceSlot match="tablet-laptop">
  <div>Средние устройства</div>
</DeviceSlot>

// От планшета и выше
<DeviceSlot match=">=tablet">
  <div>Планшет, ноутбук, десктоп</div>
</DeviceSlot>

// До ноутбука включительно
<DeviceSlot match="<=laptop">
  <div>Телефон, планшет, ноутбук</div>
</DeviceSlot>
```

### Рендер-проп (функция как children)

```tsx
// Получаем текущее устройство
<DeviceSlot match="phone">
  {(device) => (
    <div>
      Текущее устройство: {device}
      {device === 'phone' && ' 📱'}
    </div>
  )}
</DeviceSlot>

// Сложная логика рендеринга
<DeviceSlot match=">=tablet">
  {(device) => (
    <nav className={`nav-${device}`}>
      {device === 'desktop' ? <FullMenu /> : <CompactMenu />}
    </nav>
  )}
</DeviceSlot>
```

### Сложные условия через функцию

```tsx
// Кастомная логика
<DeviceSlot match={(device) => device !== 'phone' && device !== 'tablet'}>
  <div>Только большие экраны (laptop/desktop)</div>
</DeviceSlot>

// Еще примеры
<DeviceSlot match={(device) => ['phone', 'tablet'].includes(device)}>
  <div>Мобильные устройства</div>
</DeviceSlot>

<DeviceSlot match={(device) => device === 'desktop' || device === 'laptop'}>
  <div>Десктопные устройства</div>
</DeviceSlot>
```

### Fallback (запасной контент)

```tsx
<DeviceSlot 
  match="phone" 
  fallback={<div>🖥️ Показать на десктопе</div>}
>
  <div>📱 Показать на телефоне</div>
</DeviceSlot>
```

---

## 🔧 Вспомогательные методы

### min() и max()

```tsx
const Component = () => {
  const { min, max } = useScreen()
  
  // От планшета и выше
  if (min('tablet')) {
    console.log('Планшет или больше')
  }
  
  // Строго больше планшета (только ноутбук и десктоп)
  if (min('tablet', true)) {
    console.log('Только ноутбук и десктоп')
  }
  
  // До ноутбука включительно
  if (max('laptop')) {
    console.log('Телефон, планшет или ноутбук')
  }
  
  // Строго меньше ноутбука (только телефон и планшет)
  if (max('laptop', true)) {
    console.log('Только телефон и планшет')
  }
}
```

### isMatch()

```tsx
const Component = () => {
  const { isMatch } = useScreen()
  
  // Точное соответствие
  if (isMatch('tablet')) {
    console.log('Только планшет')
  }
  
  // Диапазон
  if (isMatch('phone', 'tablet')) {
    console.log('Телефон или планшет')
  }
}
```

---

## 📐 Брейкпоинты

### Доступ к брейкпоинтам

```tsx
import { breakpoints } from './hooks/useScreen'

// breakpoints = {
//   phone: 480,
//   tablet: 768,
//   laptop: 1024,
//   desktop: 1280,
// }

const { phone, tablet, laptop, desktop } = breakpoints
```

---

## ⚡ Оптимизация производительности

### Используйте useMemo для групповых значений

```tsx
const Component = () => {
  const { adaptiveValue } = useScreen()
  
  // ✅ Хорошо - мемоизируем группу значений
  const styles = useMemo(() => ({
    container: {
      padding: adaptiveValue({ phone: 8, desktop: 16 }, { unit: 'px' }),
      margin: adaptiveValue({ phone: 4, desktop: 8 }, { unit: 'px' }),
      gap: adaptiveValue({ phone: 4, tablet: 8, desktop: 12 }, { unit: 'px' })
    },
    typography: {
      h1: adaptiveValue({ phone: 24, desktop: 48 }, { unit: 'px' }),
      body: adaptiveValue({ phone: 14, desktop: 16 }, { unit: 'px' })
    }
  }), [adaptiveValue])
  
  return <div style={styles.container}>...</div>
}
```

### В списках выносите значения наружу

```tsx
// ❌ Плохо - каждый элемент пересчитывает значение
const List = ({ items }) => (
  <>
    {items.map(item => (
      <Card padding={adaptiveValue({ phone: 8, desktop: 16 })} />
    ))}
  </>
)

// ✅ Хорошо - значение вычисляется один раз
const List = ({ items }) => {
  const cardPadding = useMemo(
    () => adaptiveValue({ phone: 8, desktop: 16 }, { unit: 'px' }),
    [adaptiveValue]
  )
  
  return (
    <>
      {items.map(item => (
        <Card padding={cardPadding} />
      ))}
    </>
  )
}
```

### Создавайте общий хук для значений

```tsx
// hooks/useAdaptiveStyles.ts
export const useAdaptiveStyles = () => {
  const { adaptiveValue } = useScreen()
  
  return useMemo(() => ({
    spacing: {
      small: adaptiveValue({ phone: 4, tablet: 8, desktop: 12 }, { unit: 'px' }),
      medium: adaptiveValue({ phone: 8, tablet: 12, desktop: 16 }, { unit: 'px' }),
      large: adaptiveValue({ phone: 12, tablet: 16, desktop: 24 }, { unit: 'px' })
    },
    typography: {
      h1: adaptiveValue({ phone: 24, tablet: 32, desktop: 48 }, { unit: 'px' }),
      h2: adaptiveValue({ phone: 20, tablet: 24, desktop: 32 }, { unit: 'px' }),
      body: adaptiveValue({ phone: 14, desktop: 16 }, { unit: 'px' })
    }
  }), [adaptiveValue])
}

// Использование
const Component = () => {
  const { spacing, typography } = useAdaptiveStyles()
  return <div style={{ padding: spacing.medium, fontSize: typography.body }} />
}
```

---

## 🎯 Практические примеры

### Адаптивная навигация

```tsx
const Navigation = () => {
  const { isTouch, isPointer } = useScreen()
  
  return (
    <nav>
      {isTouch ? (
        <MobileMenu />
      ) : (
        <DesktopMenu />
      )}
    </nav>
  )
}
```

### Адаптивная сетка

```tsx
const Grid = () => {
  const { adaptiveValue } = useScreen()
  
  const gridTemplate = adaptiveValue({
    phone: '1fr',
    tablet: 'repeat(2, 1fr)',
    desktop: 'repeat(4, 1fr)'
  })
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: gridTemplate,
      gap: adaptiveValue({ phone: 8, desktop: 16 }, { unit: 'px' })
    }}>
      {/* items */}
    </div>
  )
}
```

### Комбинирование DeviceSlot и adaptiveValue

```tsx
const ResponsiveCard = () => {
  const { adaptiveValue } = useScreen()
  
  const styles = useMemo(() => ({
    padding: adaptiveValue({ phone: 8, desktop: 16 }, { unit: 'px' }),
    fontSize: adaptiveValue({ phone: 14, desktop: 18 }, { unit: 'px' })
  }), [adaptiveValue])
  
  return (
    <div style={styles}>
      <DeviceSlot match="phone">
        <div>📱 Мобильная версия карточки</div>
      </DeviceSlot>
      
      <DeviceSlot match=">=tablet">
        <div>🖥️ Десктопная версия карточки</div>
      </DeviceSlot>
    </div>
  )
}
```

---

## 📝 TypeScript

Все типы экспортируются автоматически:

```tsx
import { useScreen, DeviceSlot, DeviceType, MatchPattern } from './hooks/useScreen'

const Component = () => {
  const { currentDevice } = useScreen() // currentDevice: DeviceType
  
  return (
    <DeviceSlot match="phone"> {/* match: MatchPattern */}
      {/* children */}
    </DeviceSlot>
  )
}
```

---

## 🚀 Советы

1. **Всегда мемоизируйте групповые значения** с `useMemo`
2. **В списках вычисляйте значения один раз** перед map
3. **Используйте `DeviceSlot` вместо условного рендеринга** для чистоты JSX
4. **Smooth интерполяцию** используйте только когда нужен плавный переход
5. **Кэш работает автоматически**, не нужно о нем думать

---

## 📊 Производительность

- **LRU кэш** на 200 записей автоматически очищается
- **Debounce 50ms** на ресайз
- **useCallback** и **useMemo** для стабильных ссылок
- **Эффективно** даже при 100+ компонентах

