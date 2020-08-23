// Originally by: Rogier Schouten <https://github.com/rogierschouten>
// Adapted by: Madhav Varshney <https://github.com/madhavarshney>
declare module 'kleur' {
	namespace kleur {
		interface Color {
			(x: string | number): string;
			(): Kleur;
		}

		interface Kleur {
			// Colors
			black: Color;
			red: Color;
			green: Color;
			yellow: Color;
			blue: Color;
			magenta: Color;
			cyan: Color;
			white: Color;
			gray: Color;
			grey: Color;

			// Backgrounds
			bgBlack: Color;
			bgRed: Color;
			bgGreen: Color;
			bgYellow: Color;
			bgBlue: Color;
			bgMagenta: Color;
			bgCyan: Color;
			bgWhite: Color;

			// Modifiers
			reset: Color;
			bold: Color;
			dim: Color;
			italic: Color;
			underline: Color;
			inverse: Color;
			hidden: Color;
			strikethrough: Color;
		}
	}

	let kleur: kleur.Kleur & { enabled: boolean };
	export = kleur;
}

declare module 'kleur/colors' {
	function print(input: string | boolean | number): string;
	function print(input: undefined | void): undefined;
	function print(input: null): null;
	type Colorize = typeof print;

	namespace kleur {
		interface Context {
			enabled: boolean;
		}

		interface Kleur {
			// Colors
			black: Colorize;
			red: Colorize;
			green: Colorize;
			yellow: Colorize;
			blue: Colorize;
			magenta: Colorize;
			cyan: Colorize;
			white: Colorize;
			gray: Colorize;
			grey: Colorize;

			// Backgrounds
			bgBlack: Colorize;
			bgRed: Colorize;
			bgGreen: Colorize;
			bgYellow: Colorize;
			bgBlue: Colorize;
			bgMagenta: Colorize;
			bgCyan: Colorize;
			bgWhite: Colorize;

			// Modifiers
			reset: Colorize;
			bold: Colorize;
			dim: Colorize;
			italic: Colorize;
			underline: Colorize;
			inverse: Colorize;
			hidden: Colorize;
			strikethrough: Colorize;
		}
	}


	let kleur: kleur.Kleur & { $: kleur.Context };
	export = kleur;
}
