"use strict";module.export({default:()=>ForInOfStatement});var LoopStatement;module.watch(require('./LoopStatement.js'),{default:function(v){LoopStatement=v}},0);

class ForInOfStatement extends LoopStatement {
	getRightHandSide () {
		return this.body.getRightHandSide();
	}

	hasVariableDeclaration () {
		return this.left.type === 'VariableDeclaration';
	}

	minify ( code, transforms ) {
		if ( this.left.start > this.start + 4 ) {
			code.overwrite( this.start + 3, this.left.start, '(' );
		}

		if ( this.right.start > this.left.end + 4 ) {
			code.overwrite( this.left.end, this.right.start, ' in ' );
		}

		if ( this.body.start > this.right.end + 1 ) {
			code.overwrite( this.right.end, this.body.start, ')' );
		}

		super.minify( code, transforms );
	}
}
