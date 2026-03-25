import { useState, useEffect, useRef, useCallback, useMemo, ReactNode } from 'react'

export const breakpoints = {
	phone: 480,      // 0-479px: все телефоны (iPhone 14 Pro Max - 430px)
	tablet: 1024,    // 480-1023px: все планшеты (iPad Pro 12.9" - 1024px)
	laptop: 1440,    // 1024-1439px: все ноутбуки (MacBook Air - 1280px)
	desktop: 1920,   // 1440px+: десктопы (Full HD - 1920px)
}

export type DeviceType = keyof typeof breakpoints

const mediaQueries = {
	desktop: `(min-width: ${breakpoints.laptop}px)`,      // от 1440px
	laptop: `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.laptop - 1}px)`,  // 1024-1439px
	tablet: `(min-width: ${breakpoints.phone}px) and (max-width: ${breakpoints.tablet - 1}px)`,   // 480-1023px
	phone: `(max-width: ${breakpoints.phone - 1}px)`,     // 0-479px
}

const deviceOrder: DeviceType[] = ['phone', 'tablet', 'laptop', 'desktop']

const getDeviceType = (): DeviceType => {
	if (typeof window === 'undefined') return 'desktop'

	if (window.matchMedia(mediaQueries.desktop).matches) return 'desktop'
	if (window.matchMedia(mediaQueries.laptop).matches) return 'laptop'
	if (window.matchMedia(mediaQueries.tablet).matches) return 'tablet'
	return 'phone'
}

// Кэш с лимитом
class AdaptiveValueCache {
	private cache = new Map<string, any>()
	private readonly maxSize: number
	private accessOrder: string[] = []

	constructor(maxSize: number = 100) {
		this.maxSize = maxSize
	}

	private updateAccessOrder(key: string) {
		this.accessOrder = this.accessOrder.filter(k => k !== key)
		this.accessOrder.push(key)
	}

	private evictIfNeeded() {
		if (this.cache.size >= this.maxSize) {
			const oldestKey = this.accessOrder.shift()
			if (oldestKey) {
				this.cache.delete(oldestKey)
			}
		}
	}

	get(key: string): any | undefined {
		if (this.cache.has(key)) {
			this.updateAccessOrder(key)
			return this.cache.get(key)
		}
		return undefined
	}

	set(key: string, value: any): void {
		this.cache.set(key, value)
		this.updateAccessOrder(key)
		this.evictIfNeeded()
	}

	clear(): void {
		this.cache.clear()
		this.accessOrder = []
	}

	get size(): number {
		return this.cache.size
	}
}

const cache = new AdaptiveValueCache(200)

const getCacheKey = (values: any, options: any, currentDevice: string) => {
	return JSON.stringify({ values, options, currentDevice })
}

const interpolate = (start: number, end: number, ratio: number): number => {
	return start + (end - start) * ratio
}

const getDeviceIndex = (device: DeviceType): number => {
	return deviceOrder.indexOf(device)
}

// Типы для DeviceSlot
export type MatchPattern =
	| DeviceType
	| `${DeviceType}-${DeviceType}`
	| `>=${DeviceType}`
	| `<=${DeviceType}`
	| `not:${DeviceType}`
	| DeviceType[]
	| ((device: DeviceType) => boolean)

export interface DeviceSlotProps {
	match: MatchPattern
	children: ReactNode | ((device: DeviceType) => ReactNode)
	fallback?: ReactNode
}

// Функция проверки соответствия
const checkMatch = (pattern: MatchPattern, currentDevice: DeviceType): boolean => {
	// Функция
	if (typeof pattern === 'function') {
		return pattern(currentDevice)
	}

	// Массив
	if (Array.isArray(pattern)) {
		return pattern.some(p => {
			if (p.startsWith('not:')) {
				const device = p.replace('not:', '') as DeviceType
				return currentDevice !== device
			}
			return p === currentDevice
		})
	}

	// Строковые паттерны
	const patternStr = pattern

	// not:phone
	if (patternStr.startsWith('not:')) {
		const device = patternStr.replace('not:', '') as DeviceType
		return currentDevice !== device
	}

	// >=tablet
	if (patternStr.startsWith('>=')) {
		const device = patternStr.slice(2) as DeviceType
		const currentIndex = getDeviceIndex(currentDevice)
		const targetIndex = getDeviceIndex(device)
		return currentIndex >= targetIndex
	}

	// <=laptop
	if (patternStr.startsWith('<=')) {
		const device = patternStr.slice(2) as DeviceType
		const currentIndex = getDeviceIndex(currentDevice)
		const targetIndex = getDeviceIndex(device)
		return currentIndex <= targetIndex
	}

	// phone-laptop (диапазон)
	if (patternStr.includes('-')) {
		const [from, to] = patternStr.split('-') as [DeviceType, DeviceType]
		const fromIndex = getDeviceIndex(from)
		const toIndex = getDeviceIndex(to)
		const currentIndex = getDeviceIndex(currentDevice)
		return currentIndex >= fromIndex && currentIndex <= toIndex
	}

	// Одиночное устройство
	return patternStr === currentDevice
}

export const useScreen = () => {
	const [currentDevice, setCurrentDevice] = useState<DeviceType>(getDeviceType)

	const timeoutRef = useRef<NodeJS.Timeout>(null)
	const lastDeviceRef = useRef<DeviceType>(currentDevice)
	const isUpdatingRef = useRef(false)

	const updateDevice = useCallback(() => {
		if (isUpdatingRef.current) return

		isUpdatingRef.current = true

		const newDevice = getDeviceType()

		if (lastDeviceRef.current !== newDevice) {
			lastDeviceRef.current = newDevice
			setCurrentDevice(newDevice)
		}

		isUpdatingRef.current = false
	}, [])

	useEffect(() => {
		updateDevice()

		const debouncedUpdate = () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
			timeoutRef.current = setTimeout(() => {
				updateDevice()
			}, 50)
		}

		window.addEventListener('resize', debouncedUpdate)

		const mediaQueryLists = Object.values(mediaQueries).map(query => {
			const mql = window.matchMedia(query)
			mql.addEventListener('change', debouncedUpdate)
			return mql
		})

		return () => {
			window.removeEventListener('resize', debouncedUpdate)
			mediaQueryLists.forEach(mql => {
				mql.removeEventListener('change', debouncedUpdate)
			})
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [updateDevice])

	const adaptiveValue = useCallback(
		<T extends number | string>(
			values: {
				phone?: T
				tablet?: T
				laptop?: T
				desktop?: T
				default?: T
			},
			options?: {
				inherit?: 'down' | 'up' | 'none'
				smooth?: boolean
				unit?: 'px' | 'rem' | string
			}
		): T | string => {
			const { inherit = 'down', smooth = false, unit } = options || {}

			const cacheKey = getCacheKey(values, options, currentDevice)
			const cachedValue = cache.get(cacheKey)
			if (cachedValue !== undefined) {
				return cachedValue
			}

			const deviceValues: Partial<Record<DeviceType, T>> = {}

			deviceValues.phone = values.phone
			deviceValues.tablet = values.tablet
			deviceValues.laptop = values.laptop
			deviceValues.desktop = values.desktop

			if (smooth) {
				const numericDevices = deviceOrder.filter(device =>
					deviceValues[device] !== undefined && typeof deviceValues[device] === 'number'
				)

				if (numericDevices.length >= 2) {
					for (let i = 0; i < deviceOrder.length; i++) {
						const device = deviceOrder[i]
						if (deviceValues[device] !== undefined) continue

						let lowerDevice: DeviceType | undefined
						let lowerValue: number | undefined
						let upperDevice: DeviceType | undefined
						let upperValue: number | undefined

						for (let j = i; j >= 0; j--) {
							const prevDevice = deviceOrder[j]
							const val = deviceValues[prevDevice]
							if (val !== undefined && typeof val === 'number') {
								lowerDevice = prevDevice
								lowerValue = val
								break
							}
						}

						for (let j = i; j < deviceOrder.length; j++) {
							const nextDevice = deviceOrder[j]
							const val = deviceValues[nextDevice]
							if (val !== undefined && typeof val === 'number') {
								upperDevice = nextDevice
								upperValue = val
								break
							}
						}

						if (lowerDevice && upperDevice && lowerValue !== undefined && upperValue !== undefined) {
							const lowerIndex = getDeviceIndex(lowerDevice)
							const upperIndex = getDeviceIndex(upperDevice)
							const ratio = (i - lowerIndex) / (upperIndex - lowerIndex)
							const interpolatedValue = interpolate(lowerValue, upperValue, ratio)
							deviceValues[device] = interpolatedValue as T
						}
					}
				}
			}

			if (values.default !== undefined) {
				for (const device of deviceOrder) {
					if (deviceValues[device] === undefined) {
						deviceValues[device] = values.default
					}
				}
			}

			if (inherit !== 'none') {
				const isUp = inherit === 'up'
				const orderedDevices = isUp ? [...deviceOrder].reverse() : deviceOrder

				let lastValue: T | undefined

				for (const device of orderedDevices) {
					if (deviceValues[device] !== undefined) {
						lastValue = deviceValues[device]
					} else if (lastValue !== undefined) {
						deviceValues[device] = lastValue
					}
				}
			}

			let result = deviceValues[currentDevice]

			if (result === undefined) {
				const fallback = values.default !== undefined ? values.default : '' as T
				result = fallback
			}

			if (unit && typeof result === 'number') {
				result = `${result}${unit}` as T
			}

			cache.set(cacheKey, result)

			return result
		},
		[currentDevice]
	)

	const bools = useMemo(() => ({
		isPhone: currentDevice === 'phone',
		isTablet: currentDevice === 'tablet',
		isLaptop: currentDevice === 'laptop',
		isDesktop: currentDevice === 'desktop',
	}), [currentDevice])

	const min = useCallback((device: DeviceType, strict?: boolean) => {
		const currentIndex = getDeviceIndex(currentDevice)
		const targetIndex = getDeviceIndex(device)
		return strict ? currentIndex > targetIndex : currentIndex >= targetIndex
	}, [currentDevice])

	const max = useCallback((device: DeviceType, strict?: boolean) => {
		const currentIndex = getDeviceIndex(currentDevice)
		const targetIndex = getDeviceIndex(device)
		return strict ? currentIndex < targetIndex : currentIndex <= targetIndex
	}, [currentDevice])

	const isMatch = useCallback((from: DeviceType, to?: DeviceType) => {
		if (!to) return currentDevice === from
		const fromIndex = getDeviceIndex(from)
		const toIndex = getDeviceIndex(to)
		const minIndex = Math.min(fromIndex, toIndex)
		const maxIndex = Math.max(fromIndex, toIndex)
		const currentIndex = getDeviceIndex(currentDevice)
		return currentIndex >= minIndex && currentIndex <= maxIndex
	}, [currentDevice])

	return {
		...bools,
		isTouch: bools.isPhone || bools.isTablet,
		isPointer: bools.isLaptop || bools.isDesktop,
		currentDevice,
		min,
		max,
		isMatch,
		adaptiveValue,
	}
}

// Компонент DeviceSlot
export const DeviceSlot = ({ match, children, fallback }: DeviceSlotProps) => {
	const { currentDevice } = useScreen()

	const shouldRender = useMemo(
		() => checkMatch(match, currentDevice),
		[match, currentDevice]
	)

	if (!shouldRender) {
		return fallback || null
	}

	if (typeof children === 'function') {
		return children(currentDevice)
	}

	return children
}