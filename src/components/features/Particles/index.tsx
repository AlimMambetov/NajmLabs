'use client'
import Variant_1 from './variant-1';
import Variant_2 from './variant-2';
import Variant_3 from './variant-3';
import Variant_4 from './variant-4';

export const Particles = ({ variant = 2 }: { variant?: 1 | 2 | 3 | 4 }) => {


	return (<>
		{variant === 1 && <Variant_1 />}
		{variant === 2 && <Variant_2 />}
		{variant === 3 && <Variant_3 />}
		{variant === 4 && <Variant_4 />}
	</>)
}

export default Particles;