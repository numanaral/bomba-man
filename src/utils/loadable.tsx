import baseLoadable, {
	DefaultComponent,
	OptionsWithoutResolver,
} from '@loadable/component';
import LoadingIndicator, { HexColor } from 'components/LoadingIndicator';

/**
 * Creates lazily loadable component with default fallback using the
 * <LoadingIndicator />
 *
 * @example
 * ```tsx
 * // Default - creates medium sized <LoadingIndicator /> as a fallback
 * const LazySomeComponent = loadable(() => import('components/SomeComponent'));
 * const Container = () => <LazySomeComponent />;
 *
 * // Custom Size - creates large sized <LoadingIndicator /> as a fallback
 * const LazySomeComponent = loadable(() => import('components/SomeComponent'), 'large');
 * const Container = () => <LazySomeComponent />;
 *
 * // Custom Fallback - uses custom component passed in as the fallback
 * const LazySomeComponent = loadable(() => import('components/SomeComponent'), { fallback: <MyCustomLoadingIndicator /> });
 * const Container = () => <LazySomeComponent />;
 *
 * // No fallback - does not create a loading indicator as a fallback
 * const LazySomeComponent = loadable(() => import('components/SomeComponent'), { noFallback: true });
 * const Container = () => <LazySomeComponent />;
 *
 * // Shared Component - prevents caching when different instantiations are needed based on the given key and passed in prop
 * const LazySharedComponent = loadable(() => import('components/SharedComponent'), 'entity');
 * const ContainerA = () => <LazySharedComponent entity="A" />;
 * const ContainerB = () => <LazySharedComponent entity="B" />;
 *
 * // Multiple options - You have to pass in an object so that it can be differentiated
 * const LazySharedComponent = loadable(() => import('components/SharedComponent'), { color: '#2196f3', entity: 'entity'});
 * const ContainerA = () => <LazySharedComponent entity="A" />;
 * const ContainerB = () => <LazySharedComponent entity="B" />;
 *
 * ```
 *
 * @param loadFn Import function, eg:
 * - () => import('components/SomeComponent')
 * @param fallback Loadable options as object or string
 * - Leaving this empty will result in the following options object to be passed in
 * - {
 *		fallback: <LoadingIndicator size={options.size || 'medium'} />,
 *	}
 * - Otherwise, you can provide OptionsWithoutResolver & FallbackSizeOptions with the following keys:
 * 	- fallback, cacheKey, size, noFallback
 * - Or pass in one of the following:
 * 	- 'small' | 'medium' | 'large' | cacheKey
 */
const loadable = <T,>(
	loadFn: LoadableFunction<T>,
	{ fallback, cacheKey, color, noFallback }: LoadableCustomOptions = {}
) => {
	const fallbackOption: LoadableOptions = {
		...((noFallback && {}) || {
			fallback: fallback || (
				<LoadingIndicator color={color || '#f44336'} />
			),
		}),
	};
	const cacheKeyOption: LoadableOptions = {
		...(cacheKey && { cacheKey: props => props[cacheKey as string] }),
	};
	const options = {
		...cacheKeyOption,
		...fallbackOption,
	};

	return baseLoadable(loadFn, options);
};

type LoadableFunction<T> = (props: T) => Promise<DefaultComponent<T>>;
type LoadableOptions = OptionsWithoutResolver<Record<string, any>>;
type LoadableCustomOptions = {
	color?: HexColor;
	fallback?: JSX.Element;
	cacheKey?: string;
	noFallback?: boolean;
};

export default loadable;
