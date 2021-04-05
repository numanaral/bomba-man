declare type StyledProps<T, Keys> = {
	[Property in keyof Pick<T, Keys> as `$${string & Property}`]: T[Property];
};

/**
 * Get the keys of the object as a type
 *
 * @example
 * ```ts
 * const AXIS = {
 * 	X: 'xVal',
 * 	Y: 'yVal',
 * };
 *
 * // 'X' | 'Y'
 * KeysOf<typeof AXIS>
 * ```
 */
declare type KeysOf<T> = keyof T;


declare type BaseColorVariant = 'primary' | 'secondary';
declare type AlertColorVariant = 'error' | 'success' | 'warning' | 'info';
declare type DefaultColorVariant = 'default';
declare type ColorVariants =
	| BaseColorVariant
	| AlertColorVariant
	| DefaultColorVariant;

declare type BaseSize = 'small' | 'medium' | 'large';

/** @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787 */
type BuildPowersOf2LengthArrays<
	N extends number,
	R extends never[][]
> = R[0][N] extends never
	? R
	: BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>;

/** @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787 */
type ConcatLargestUntilDone<
	N extends number,
	R extends never[][],
	B extends never[]
> = B['length'] extends N
	? B
	: [...R[0], ...B][N] extends never
	? ConcatLargestUntilDone<
			N,
			R extends [R[0], ...infer U]
				? U extends never[][]
					? U
					: never
				: never,
			B
	  >
	: ConcatLargestUntilDone<
			N,
			R extends [R[0], ...infer U]
				? U extends never[][]
					? U
					: never
				: never,
			[...R[0], ...B]
	  >;

/** @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787 */
type Replace<R extends any[], T> = { [K in keyof R]: T };

/** @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787 */
type TupleOf<T, N extends number> = number extends N
	? T[]
	: {
			[K in N]: BuildPowersOf2LengthArrays<K, [[never]]> extends infer U
				? U extends never[][]
					? Replace<ConcatLargestUntilDone<K, U, []>, T>
					: never
				: never;
	  }[N];

/**
 * @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-725812899
 *
 * @example
 * ```ts
 * const v: Vector<2> = [1, 2]
 * ```
 */
declare type Vector<Length extends number> = TupleOf<number, Length>;

/**
 * @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-725812899
 *
 * @example
 * ```ts
 * const m: Matrix<2, 3> = [
 *   [1, 2, 3],
 *   [1, 2, 3],
 * ]
 * ```
 */
declare type Matrix<Rows extends number, Columns extends number> = TupleOf<
	TupleOf<number, Columns>,
	Rows
>;

/**
 * @see https://github.com/microsoft/TypeScript/issues/15480#issuecomment-754770670
 *
 * @example
 * ```ts
 * // '0 | 1 | ... | 32'
 * type clzResult = RangeOf<32>
 * ```
 */
declare type RangeOf<N extends number> = Partial<Vector<N>>['length'];
