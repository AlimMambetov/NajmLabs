'use client';
import { useScreen } from '@/hooks';
import React from 'react';

interface BlobProps {
	size?: number | string;
	colors?: string[] | 'blue' | 'orange';
	blur?: number;
	position?: 'fixed' | 'absolute' | 'relative';
	className?: string;
	zIndex?: number;
	opacity?: number;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	animate?: boolean;
	// New position props
	top?: number | string | boolean;
	right?: number | string | boolean;
	bottom?: number | string | boolean;
	left?: number | string | boolean;
	translate?: [number | string, number | string] | [number | string] | string;
}

// Predefined color palettes
const colorPresets = {
	blue: ['#6244CD', '#ABA2F3'],
	orange: ['#BF7D2F', '#ffbf65'],
};

const getColorArray = (colors: BlobProps['colors']): string[] => {
	if (!colors) return colorPresets.blue;
	if (typeof colors === 'string') return colorPresets[colors] || colorPresets.blue;
	return colors;
};

export const Blob: React.FC<BlobProps> = ({
	size = 500,
	colors = 'blue',
	blur = 160,
	position = 'absolute',
	zIndex = 0,
	opacity = 0.3,
	className,
	style = {},
	children,
	animate = false,
	// Position props
	top,
	right,
	bottom,
	left,
	translate,
}) => {
	const { isTouch } = useScreen();
	const mediaSize = isTouch ? 300 : size;
	const mediaBlur = isTouch ? 100 : blur;
	const mediaOpacity = isTouch ? 0.2 : opacity;
	const sizeValue = typeof mediaSize === 'number' ? `${mediaSize}px` : mediaSize;
	const colorArray = getColorArray(colors);
	const gradientColors = colorArray.join(', ');
	const posXY = {} as any;
	if (!left && !right) posXY.left = 0;
	if (!top && !bottom) posXY.top = 0;
	if (bottom === true) posXY.bottom = 0;
	if (right === true) posXY.right = 0;
	if (typeof left !== 'boolean' && left) posXY.left = left;
	if (typeof right !== 'boolean' && right) posXY.right = right;
	if (typeof top !== 'boolean' && top) posXY.top = top;
	if (typeof bottom !== 'boolean' && bottom) posXY.bottom = bottom;
	if (typeof translate == 'string') posXY.translate = translate;
	if (Array.isArray(translate)) posXY.translate = translate.join(' ');


	const baseStyles: React.CSSProperties = {
		width: sizeValue,
		height: sizeValue,
		position,
		borderRadius: '50%',
		background: `radial-gradient(circle at 30% 30%, ${gradientColors})`,
		filter: `blur(${mediaBlur}px)`,
		opacity: mediaOpacity,
		zIndex,
		pointerEvents: 'none',
		...posXY,
		...style,
	};


	const animateStyles: React.CSSProperties = animate
		? {
			animation: 'pulse 6s ease-in-out infinite',
		}
		: {};

	const mergedStyles = { ...baseStyles, ...animateStyles };

	return (
		<>
			{animate && (
				<style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              transform: scale(1) translate(0, 0);
              filter: blur(${blur}px) brightness(1);
            }
            33% {
              transform: scale(1.1) translate(5%, 5%);
              filter: blur(${blur * 0.8}px) brightness(1.1);
            }
            66% {
              transform: scale(0.9) translate(-3%, 2%);
              filter: blur(${blur * 1.2}px) brightness(0.95);
            }
          }
        `}</style>
			)}
			<div className={className} style={mergedStyles}>
				{children}
			</div>
		</>
	);
};

export default Blob;