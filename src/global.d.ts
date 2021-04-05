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

/**
 * Get the values of the object with const assertion as a type.
 * - `{} as const`
 * - `<const>{}`
 * - `[] as const`
 * - `<const>[]`
 *
 * @example
 * ```ts
 * // note the "as const"
 * const AXIS = {
 * 	X: 'xVal',
 * 	Y: 'yVal',
 * } as const;
 *
 * // 'xVal' | 'yVal'
 * ValuesOf<typeof AXIS>
 *
 * const NUMBERS = [1, 2] as const;
 * // 1 | 2
 * ValuesOf<typeof NUMBERS>
 * ```
 */
declare type ValuesOf<T> = Exclude<T[KeysOf<T>], Function>;

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
 * Gives range of numbers as type. Recursive combination of the following two.
 * @see https://github.com/microsoft/TypeScript/issues/15480#issuecomment-754770670
 * @see https://github.com/microsoft/TypeScript/issues/15480#issuecomment-754795473
 *
 * @example
 * ```ts
 * // 0 | 1 | 2 | 3
 * RangeFromTo<3>
 * // 1 | 2 | 3
 * RangeFromTo<3, 1>
 * ```
 */
declare type RangeOf<To extends number, From = 0> = From extends 0
	? Partial<Vector<To>>['length']
	: Exclude<RangeOf<To>, RangeOf<From>> | From;
