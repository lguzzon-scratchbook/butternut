"use strict";module.export({default:()=>TemplateLiteral});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);var UNKNOWN,TRUTHY,FALSY;module.watch(require('../../utils/sentinels.js'),{UNKNOWN:function(v){UNKNOWN=v},TRUTHY:function(v){TRUTHY=v},FALSY:function(v){FALSY=v}},1);var stringify;module.watch(require('../../utils/stringify.js'),{default:function(v){stringify=v}},2);



class TemplateLiteral extends Node {
	getValue () {
		let values = new Array( this.expressions.length );
		let i;

		for ( i = 0; i < this.expressions.length; i += 1 ) {
			const expression = this.expressions[i];
			const value = expression.getValue();

			if ( value === UNKNOWN || value === TRUTHY || value === FALSY ) return UNKNOWN;

			values[i] = value;
		}

		let result = '';

		for ( i = 0; i < this.expressions.length; i += 1 ) {
			const value = values[i];

			result += this.quasis[i].value.raw;
			result += value;
		}

		result += this.quasis[i].value.raw;

		return result;
	}

	minify ( code ) {
		const value = this.getValue();

		if ( value !== UNKNOWN ) {
			code.overwrite( this.start, this.end, stringify( value ) );
			return;
		}

		let c = this.start;
		let i;
		for ( i = 0; i < this.expressions.length; i += 1 ) {
			const expression = this.expressions[i];
			const quasi = this.quasis[i];

			expression.minify( code );

			if ( quasi.start > c + 1 ) {
				code.remove( c, quasi.start - 1 );
			}

			if ( expression.start > quasi.end + 2 ) {
				code.remove( quasi.end + 2, expression.start );
			}

			c = expression.end;
		}

		const lastQuasi = this.quasis[i];

		if ( lastQuasi.start > c + 1 ) {
			code.remove( c, lastQuasi.start - 1 );
		}
	}
}
