declare module 'react-vivus' {
	import { Component, CSSProperties } from 'react';

	interface VivusOptions {
		type?: 'oneByOne' | 'delayed' | 'sync' | 'scenario';
		duration?: number;
		start?: 'autostart' | 'manual' | 'inViewport';
		animTimingFunction?: string;
		dashGap?: number;
		forceRender?: boolean;
		onReady?: () => void;
		onFinish?: () => void;
		file?: string;
	}

	interface VivusProps {
		id?: string;
		className?: string;
		style?: CSSProperties;
		svg?: string;
		option?: VivusOptions;
		onFinish?: () => void;
		onReady?: () => void;
	}

	export default class Vivus extends Component<VivusProps> { }
}