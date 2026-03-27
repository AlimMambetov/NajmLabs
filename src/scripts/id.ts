type IdType = 'number' | 'string' | 'mixed' | 'hex' | 'alphanumeric'

interface IdOptions {
	/** Тип генерируемого ID */
	type?: IdType
	/** Префикс ID */
	prefix?: string
	/** Суффикс ID */
	suffix?: string
	/** Длина ID (для number - количество цифр, для остальных - количество символов) */
	length?: number
	/** Разделитель между префиксом/суффиксом и основным ID */
	separator?: string
	/** Использовать заглавные буквы */
	uppercase?: boolean
	/** Использовать строчные буквы */
	lowercase?: boolean
	/** Кастомный набор символов */
	customChars?: string
	/** Минимальное значение (для числового типа) */
	min?: number
	/** Максимальное значение (для числового типа) */
	max?: number
}

export const setId = (options: IdOptions = {}): string => {
	const {
		type = 'mixed',
		prefix = '',
		suffix = '',
		length = 10,
		separator = '',
		uppercase = false,
		lowercase = false,
		customChars,
		min = 0,
		max = 999999
	} = options

	let id = ''

	// Генерация основного ID в зависимости от типа
	switch (type) {
		case 'number':
			// Генерация числа в заданном диапазоне
			const numValue = Math.floor(Math.random() * (max - min + 1)) + min
			id = numValue.toString()
			// Если нужна фиксированная длина, дополняем нулями
			if (length && length > id.length) {
				id = id.padStart(length, '0')
			}
			break

		case 'string':
			// Только буквы (латиница)
			const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
			const charsSet = customChars || letters
			for (let i = 0; i < length; i++) {
				id += charsSet.charAt(Math.floor(Math.random() * charsSet.length))
			}
			break

		case 'mixed':
			// Буквы и цифры
			const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
			const mixedSet = customChars || alphanumeric
			for (let i = 0; i < length; i++) {
				id += mixedSet.charAt(Math.floor(Math.random() * mixedSet.length))
			}
			break

		case 'hex':
			// Шестнадцатеричный формат
			const hex = '0123456789abcdef'
			for (let i = 0; i < length; i++) {
				id += hex.charAt(Math.floor(Math.random() * hex.length))
			}
			break

		case 'alphanumeric':
			// Только цифры и заглавные буквы (без нижнего регистра)
			const upperAlphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
			const alphaSet = customChars || upperAlphanumeric
			for (let i = 0; i < length; i++) {
				id += alphaSet.charAt(Math.floor(Math.random() * alphaSet.length))
			}
			break

		default:
			id = Math.random().toString(36).substring(2, length + 2)
	}

	// Применяем регистр
	if (uppercase) {
		id = id.toUpperCase()
	} else if (lowercase) {
		id = id.toLowerCase()
	}

	// Собираем финальный ID с префиксом и суффиксом
	const parts = []
	if (prefix) parts.push(prefix)
	parts.push(id)
	if (suffix) parts.push(suffix)

	return parts.join(separator)
}

/**
 * Генератор кастомных ID
 * 
 * @example
 * // Базовое использование
 * setId({ type: 'mixed', length: 12 }) // "a7B3dE9fG2hI"
 * 
 * @example
 * // С префиксом и суффиксом
 * setId({ 
 *   type: 'alphanumeric', 
 *   prefix: 'USER', 
 *   suffix: '2024',
 *   separator: '_',
 *   length: 8
 * }) // "USER_A7B3D9E2_2024"
 * 
 * @example
 * // Числовой ID с фиксированной длиной
 * setId({ type: 'number', length: 6, prefix: 'ORDER', separator: '_' }) // "ORDER_045892"
 * 
 * @example
 * // Кастомный набор символов (без похожих символов)
 * setId({ 
 *   type: 'mixed', 
 *   customChars: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
 *   length: 12 
 * }) // "A3B7C9E2F4G6"
 */

/* 
 * === ТИПЫ ID ===
 * 
 * number      - только цифры (0-9)
 *              → ID: "045892", применение: коды, PIN, номера заказов
 * 
 * string      - только буквы (A-Z, a-z)
 *              → ID: "aBcDeF", применение: кодовые слова, имена переменных
 * 
 * mixed       - буквы + цифры (A-Z, a-z, 0-9)
 *              → ID: "a7B3dE9f", применение: универсальный, токены, API ключи
 * 
 * hex         - шестнадцатеричный (0-9, a-f)
 *              → ID: "a3f5b7d9", применение: цвета, хэши, MAC-адреса
 * 
 * alphanumeric - заглавные буквы + цифры (A-Z, 0-9)
 *              → ID: "A7B3D9E2", применение: промокоды, коды активации
 * 
 * === ПАРАМЕТРЫ ===
 * 
 * type        - тип ID (по умолчанию: 'mixed')
 * prefix      - префикс ID
 * suffix      - суффикс ID
 * length      - длина (для number: кол-во цифр, остальные: символов)
 * separator   - разделитель (по умолчанию: '')
 * uppercase   - привести к верхнему регистру
 * lowercase   - привести к нижнему регистру
 * customChars - кастомный набор символов
 * min/max     - диапазон для числового типа (по умолчанию: 0-999999)
 */