"use strict";module.export({default:()=>ConditionalExpression});var Node;module.watch(require('../Node.js'),{default:function(v){Node=v}},0);var UNKNOWN,FALSY;module.watch(require('../../utils/sentinels.js'),{UNKNOWN:function(v){UNKNOWN=v},FALSY:function(v){FALSY=v}},1);


class ConditionalExpression extends Node {
	getLeftHandSide () {
		const testValue = this.test.getValue();
		const node = testValue === UNKNOWN ? this.test : ( testValue && testValue !== FALSY ? this.consequent : this.alternate );

		return node.getLeftHandSide();
	}

	getPrecedence () {
		const testValue = this.test.getValue();
		return testValue === UNKNOWN ? 4 : ( testValue && testValue !== FALSY ? this.consequent : this.alternate ).getPrecedence();
	}

	getRightHandSide () {
		const testValue = this.test.getValue();
		const node = testValue === UNKNOWN ? this.alternate : ( testValue && testValue !== FALSY ? this.alternate : this.consequent );

		return node.getRightHandSide();
	}

	getValue () {
		const testValue = this.test.getValue();
		const consequentValue = this.consequent.getValue();
		const alternateValue = this.alternate.getValue();

		if ( testValue === UNKNOWN || consequentValue === UNKNOWN || alternateValue === UNKNOWN ) return UNKNOWN;

		return ( testValue && testValue !== FALSY ) ? consequentValue : alternateValue;
	}

	initialise ( scope ) {
		const testValue = this.test.getValue();

		if ( testValue === UNKNOWN ) {
			super.initialise( scope );
		} else if ( testValue ) {
			this.consequent.initialise( scope );
		} else {
			this.alternate.initialise( scope );
		}
	}

	minify ( code ) {
		const testValue = this.test.getValue();

		// TODO rewrite `!a ? b() : c()` as `a ? c() : b()`

		if ( testValue === UNKNOWN ) {
			// remove whitespace
			if ( this.consequent.start > this.test.end + 1 ) {
				code.overwrite( this.test.end, this.consequent.start, '?' );
			}

			if ( this.alternate.start > this.consequent.end + 1 ) {
				code.overwrite( this.consequent.end, this.alternate.start, ':' );
			}

			super.minify( code );
		} else if ( testValue && testValue !== FALSY ) {
			// remove test and alternate
			code.remove( this.start, this.consequent.start );
			code.remove( this.consequent.end, this.end );

			this.consequent.minify( code );
		} else {
			// remove test and consequent
			code.remove( this.start, this.alternate.start );

			this.alternate.minify( code );
		}
	}
}
