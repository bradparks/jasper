// Generated by Haxe 3.4.4
(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = [];
	var i = $iterator(it)();
	while(i.hasNext()) {
		var i1 = i.next();
		a.push(i1);
	}
	return a;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = new _$List_ListNode(item,null);
		if(this.h == null) {
			this.h = x;
		} else {
			this.q.next = x;
		}
		this.q = x;
		this.length++;
	}
	,pop: function() {
		if(this.h == null) {
			return null;
		}
		var x = this.h.item;
		this.h = this.h.next;
		if(this.h == null) {
			this.q = null;
		}
		this.length--;
		return x;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,iterator: function() {
		return new _$List_ListIterator(this.h);
	}
};
var _$List_ListNode = function(item,next) {
	this.item = item;
	this.next = next;
};
_$List_ListNode.__name__ = true;
var _$List_ListIterator = function(head) {
	this.head = head;
};
_$List_ListIterator.__name__ = true;
_$List_ListIterator.prototype = {
	hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		var val = this.head.item;
		this.head = this.head.next;
		return val;
	}
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	remove: function(key) {
		if(!this.h.hasOwnProperty(key)) {
			return false;
		}
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) {
			a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
};
var haxe_ds_ObjectMap = function() {
	this.h = { __keys__ : { }};
};
haxe_ds_ObjectMap.__name__ = true;
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) {
			a.push(this.h.__keys__[key]);
		}
		}
		return HxOverrides.iter(a);
	}
};
var jasper_Constraint = function(expr,op,strength) {
	var vars = new haxe_ds_ObjectMap();
	var _g_head = expr.terms.h;
	while(_g_head != null) {
		var val = _g_head.item;
		_g_head = _g_head.next;
		var term = val;
		var value = vars.h[term.variable.__id__];
		if(value == null) {
			value = 0.0;
		}
		value += term.coefficient;
		vars.set(term.variable,value);
	}
	var reducedTerms = new List();
	var variable = vars.keys();
	while(variable.hasNext()) {
		var variable1 = variable.next();
		reducedTerms.add(jasper__$Term_Term_$Impl_$._new(variable1,vars.h[variable1.__id__]));
	}
	var this1 = new jasper_Expression_$(reducedTerms,expr.constant);
	this.expression = this1;
	this.operator = op;
	this.strength = jasper__$Strength_Strength_$Impl_$.clip(strength);
};
jasper_Constraint.__name__ = true;
jasper_Constraint.prototype = {
	toString: function() {
		return "expression: (" + Std.string(this.expression) + ") strength: " + this.strength + " operator: " + this.operator;
	}
};
var jasper_Expression_$ = function(terms,constant) {
	this.terms = terms;
	this.constant = constant;
};
jasper_Expression_$.__name__ = true;
jasper_Expression_$.prototype = {
	isConstant: function() {
		return this.terms.length == 0;
	}
	,toString: function() {
		var sb = "isConstant: " + Std.string(this.isConstant()) + " constant: " + this.constant;
		if(!this.isConstant()) {
			sb += " terms: [";
			var _g_head = this.terms.h;
			while(_g_head != null) {
				var val = _g_head.item;
				_g_head = _g_head.next;
				var term = val;
				sb += "(";
				sb += Std.string(term);
				sb += ")";
			}
			sb += "] ";
		}
		return sb;
	}
};
var jasper__$Expression_Expression_$Impl_$ = {};
jasper__$Expression_Expression_$Impl_$.__name__ = true;
jasper__$Expression_Expression_$Impl_$.multiplyCoefficient = function(expression,coefficient) {
	var terms = new List();
	var _g_head = expression.terms.h;
	while(_g_head != null) {
		var val = _g_head.item;
		_g_head = _g_head.next;
		var term = val;
		terms.add(jasper__$Term_Term_$Impl_$.multiply(term,coefficient));
	}
	var this1 = new jasper_Expression_$(terms,expression.constant * jasper__$Value_Value_$Impl_$.toFloat(coefficient));
	return this1;
};
jasper__$Expression_Expression_$Impl_$.negate = function(expression) {
	var this1 = -1.0;
	return jasper__$Expression_Expression_$Impl_$.multiplyCoefficient(expression,this1);
};
jasper__$Expression_Expression_$Impl_$.addExpression = function(first,second) {
	var terms = new List();
	var _g_head = first.terms.h;
	while(_g_head != null) {
		var val = _g_head.item;
		_g_head = _g_head.next;
		var t = val;
		terms.add(t);
	}
	var _g_head1 = second.terms.h;
	while(_g_head1 != null) {
		var val1 = _g_head1.item;
		_g_head1 = _g_head1.next;
		var t1 = val1;
		terms.add(t1);
	}
	var this1 = new jasper_Expression_$(terms,first.constant + second.constant);
	return this1;
};
jasper__$Expression_Expression_$Impl_$.subtractExpression = function(first,second) {
	return jasper__$Expression_Expression_$Impl_$.addExpression(first,jasper__$Expression_Expression_$Impl_$.negate(second));
};
jasper__$Expression_Expression_$Impl_$.equalsExpression = function(first,second) {
	return new jasper_Constraint(jasper__$Expression_Expression_$Impl_$.subtractExpression(first,second),2,1001001000);
};
jasper__$Expression_Expression_$Impl_$.equalsConstant = function(expression,constant) {
	var this1 = new jasper_Expression_$(new List(),constant);
	return jasper__$Expression_Expression_$Impl_$.equalsExpression(expression,this1);
};
var jasper_InternalSolverError = function(string) {
	throw new js__$Boot_HaxeError(string);
};
jasper_InternalSolverError.__name__ = true;
var jasper_Row = function(constant,cells) {
	this.constant = constant;
	this.cells = cells;
};
jasper_Row.__name__ = true;
jasper_Row.prototype = {
	insertSymbol: function(symbol,coefficient) {
		var existingCoefficient = this.cells.h[symbol];
		if(existingCoefficient != null) {
			coefficient += existingCoefficient;
		}
		if(jasper_Util.nearZero(coefficient)) {
			this.cells.remove(symbol);
		} else {
			this.cells.h[symbol] = coefficient;
		}
	}
	,insertSymbolWithDefault: function(symbol) {
		this.insertSymbol(symbol,1.0);
	}
	,insertRow: function(other,coefficient) {
		this.constant += other.constant * coefficient;
		var s = other.cells.keys();
		while(s.hasNext()) {
			var s1 = s.next();
			var coeff = other.cells.h[s1] * coefficient;
			var value = this.cells.h[s1];
			if(value == null) {
				this.cells.h[s1] = 0.0;
			}
			var temp = this.cells.h[s1] + coeff;
			this.cells.h[s1] = temp;
			if(jasper_Util.nearZero(temp)) {
				this.cells.remove(s1);
			}
		}
	}
	,remove: function(symbol) {
		this.cells.remove(symbol);
	}
	,reverseSign: function() {
		this.constant = -this.constant;
		var newCells = new haxe_ds_IntMap();
		var s = this.cells.keys();
		while(s.hasNext()) {
			var s1 = s.next();
			var value = -this.cells.h[s1];
			newCells.h[s1] = value;
		}
		this.cells = newCells;
	}
	,solveFor: function(symbol) {
		var coeff = -1.0 / this.cells.h[symbol];
		this.cells.remove(symbol);
		this.constant *= coeff;
		var newCells = new haxe_ds_IntMap();
		var s = this.cells.keys();
		while(s.hasNext()) {
			var s1 = s.next();
			var value = this.cells.h[s1] * coeff;
			newCells.h[s1] = value;
		}
		this.cells = newCells;
	}
	,solveForSymbols: function(lhs,rhs) {
		this.insertSymbol(lhs,-1.0);
		this.solveFor(rhs);
	}
	,coefficientFor: function(symbol) {
		if(this.cells.h.hasOwnProperty(symbol)) {
			return this.cells.h[symbol];
		} else {
			return 0.0;
		}
	}
	,substitute: function(symbol,row) {
		if(this.cells.h.hasOwnProperty(symbol)) {
			var coefficient = this.cells.h[symbol];
			this.cells.remove(symbol);
			this.insertRow(row,coefficient);
		}
	}
};
var jasper_Solver = function() {
	this.cns = new haxe_ds_ObjectMap();
	this.rows = new haxe_ds_IntMap();
	this.vars = new haxe_ds_ObjectMap();
	this.edits = new haxe_ds_ObjectMap();
	this.infeasibleRows = [];
	this.objective = new jasper_Row(0,new haxe_ds_IntMap());
	this.artificial = null;
};
jasper_Solver.__name__ = true;
jasper_Solver.chooseSubject = function(row,tag) {
	var key = row.cells.keys();
	while(key.hasNext()) {
		var key1 = key.next();
		if(key1 == 1) {
			return key1;
		}
	}
	if(tag.marker == 2 || tag.marker == 3) {
		if(row.coefficientFor(tag.marker) < 0.0) {
			return tag.marker;
		}
	}
	if(tag.other != 5 && (tag.other == 2 || tag.other == 3)) {
		if(row.coefficientFor(tag.other) < 0.0) {
			return tag.other;
		}
	}
	var this1 = 0;
	return this1;
};
jasper_Solver.getEnteringSymbol = function(objective) {
	var key = objective.cells.keys();
	while(key.hasNext()) {
		var key1 = key.next();
		if(key1 != 4 && objective.cells.h[key1] < 0.0) {
			return key1;
		}
	}
	var this1 = 0;
	return this1;
};
jasper_Solver.allDummies = function(row) {
	var key = row.cells.keys();
	while(key.hasNext()) {
		var key1 = key.next();
		if(key1 != 4) {
			return false;
		}
	}
	return true;
};
jasper_Solver.prototype = {
	addConstraint: function(constraint) {
		if(this.cns.h.__keys__[constraint.__id__] != null) {
			throw new js__$Boot_HaxeError(new jasper_exception_DuplicateConstraintException(constraint));
		}
		var tag = new jasper__$Solver_Tag();
		var row = this.createRow(constraint,tag);
		var subject = jasper_Solver.chooseSubject(row,tag);
		if(subject == 0 && jasper_Solver.allDummies(row)) {
			if(!jasper_Util.nearZero(row.constant)) {
				throw new js__$Boot_HaxeError(new jasper_exception_UnsatisfiableConstraintException(constraint));
			} else {
				subject = tag.marker;
			}
		}
		if(subject == 0) {
			if(!this.addWithArtificialVariable(row)) {
				throw new js__$Boot_HaxeError(new jasper_exception_UnsatisfiableConstraintException(constraint));
			}
		} else {
			row.solveFor(subject);
			this.substitute(subject,row);
			this.rows.h[subject] = row;
		}
		this.cns.set(constraint,tag);
		this.optimize(this.objective);
	}
	,updateVariables: function() {
		var key = this.vars.keys();
		while(key.hasNext()) {
			var key1 = key.next();
			var variable = key1;
			var row = this.rows.h[this.vars.h[key1.__id__]];
			if(row == null) {
				variable.setValue(0);
			} else {
				variable.setValue(row.constant);
			}
		}
	}
	,createRow: function(constraint,tag) {
		var expression = constraint.expression;
		var row = new jasper_Row(expression.constant,new haxe_ds_IntMap());
		var _g_head = expression.terms.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var term = val;
			if(!jasper_Util.nearZero(term.coefficient)) {
				var symbol = this.getVarSymbol(term.variable);
				var otherRow = this.rows.h[symbol];
				if(otherRow == null) {
					row.insertSymbol(symbol,term.coefficient);
				} else {
					row.insertRow(otherRow,term.coefficient);
				}
			}
		}
		var _g = constraint.operator;
		switch(_g) {
		case 0:
			break;
		case 1:
			var coeff = constraint.operator == 0 ? 1.0 : -1.0;
			var this1 = 2;
			var slack = this1;
			tag.marker = slack;
			row.insertSymbol(slack,coeff);
			if(constraint.strength < 1001001000) {
				var this2 = 3;
				var error = this2;
				tag.other = error;
				row.insertSymbol(error,-coeff);
				this.objective.insertSymbol(error,constraint.strength);
			}
			break;
		case 2:
			if(constraint.strength < 1001001000) {
				var this3 = 3;
				var errplus = this3;
				var this4 = 3;
				var errminus = this4;
				tag.marker = errplus;
				tag.other = errminus;
				row.insertSymbol(errplus,-1.0);
				row.insertSymbol(errminus,1.0);
				this.objective.insertSymbol(errplus,constraint.strength);
				this.objective.insertSymbol(errminus,constraint.strength);
			} else {
				var this5 = 4;
				var dummy = this5;
				tag.marker = dummy;
				row.insertSymbolWithDefault(dummy);
			}
			break;
		}
		if(row.constant < 0.0) {
			row.reverseSign();
		}
		return row;
	}
	,addWithArtificialVariable: function(row) {
		var this1 = 2;
		var art = this1;
		var this2 = this.rows;
		var clonedCells = new haxe_ds_IntMap();
		var otherCells = row.cells;
		var key = otherCells.keys();
		while(key.hasNext()) {
			var key1 = key.next();
			clonedCells.h[key1] = otherCells.h[key1];
		}
		var value = new jasper_Row(row.constant,clonedCells);
		this2.h[art] = value;
		var clonedCells1 = new haxe_ds_IntMap();
		var otherCells1 = row.cells;
		var key2 = otherCells1.keys();
		while(key2.hasNext()) {
			var key3 = key2.next();
			clonedCells1.h[key3] = otherCells1.h[key3];
		}
		this.artificial = new jasper_Row(row.constant,clonedCells1);
		this.optimize(this.artificial);
		var success = jasper_Util.nearZero(this.artificial.constant);
		this.artificial = null;
		var rowptr = this.rows.h[art];
		if(rowptr != null) {
			var deleteQueue = new List();
			var s = this.rows.keys();
			while(s.hasNext()) {
				var s1 = s.next();
				if(this.rows.h[s1] == rowptr) {
					deleteQueue.add(s1);
				}
			}
			while(!deleteQueue.isEmpty()) this.rows.remove(deleteQueue.pop());
			deleteQueue.clear();
			var cellsLength = Lambda.array(rowptr.cells).length;
			if(cellsLength == 0) {
				return success;
			}
			var entering = this.anyPivotableSymbol(rowptr);
			if(entering == 0) {
				return false;
			}
			rowptr.solveForSymbols(art,entering);
			this.substitute(entering,rowptr);
			this.rows.h[entering] = rowptr;
		}
		var value1 = this.rows.iterator();
		while(value1.hasNext()) {
			var value2 = value1.next();
			value2.remove(art);
		}
		this.objective.remove(art);
		return success;
	}
	,substitute: function(symbol,row) {
		var key = this.rows.keys();
		while(key.hasNext()) {
			var key1 = key.next();
			this.rows.h[key1].substitute(symbol,row);
			if(key1 != 1 && this.rows.h[key1].constant < 0.0) {
				this.infeasibleRows.push(key1);
			}
		}
		this.objective.substitute(symbol,row);
		if(this.artificial != null) {
			this.artificial.substitute(symbol,row);
		}
	}
	,optimize: function(objective) {
		while(true) {
			var entering = jasper_Solver.getEnteringSymbol(objective);
			if(entering == 0) {
				return;
			}
			var entry = this.getLeavingRow(entering);
			if(entry == null) {
				throw new js__$Boot_HaxeError(new jasper_InternalSolverError("The objective is unbounded."));
			}
			var this1 = 5;
			var leaving = this1;
			var key = this.rows.keys();
			while(key.hasNext()) {
				var key1 = key.next();
				if(this.rows.h[key1] == entry) {
					leaving = key1;
				}
			}
			var this2 = 5;
			var entryKey = this2;
			var key2 = this.rows.keys();
			while(key2.hasNext()) {
				var key3 = key2.next();
				if(this.rows.h[key3] == entry) {
					entryKey = key3;
				}
			}
			this.rows.remove(entryKey);
			entry.solveForSymbols(leaving,entering);
			this.substitute(entering,entry);
			this.rows.h[entering] = entry;
		}
	}
	,anyPivotableSymbol: function(row) {
		var this1 = 5;
		var symbol = this1;
		var key = row.cells.keys();
		while(key.hasNext()) {
			var key1 = key.next();
			if(key1 == 2 || key1 == 3) {
				symbol = key1;
			}
		}
		if(symbol == 5) {
			var this2 = 0;
			symbol = this2;
		}
		return symbol;
	}
	,getLeavingRow: function(entering) {
		var ratio = 1.79769313486231e+308;
		var row = null;
		var key = this.rows.keys();
		while(key.hasNext()) {
			var key1 = key.next();
			if(key1 != 1) {
				var candidateRow = this.rows.h[key1];
				var temp = candidateRow.coefficientFor(entering);
				if(temp < 0) {
					var temp_ratio = -candidateRow.constant / temp;
					if(temp_ratio < ratio) {
						ratio = temp_ratio;
						row = candidateRow;
					}
				}
			}
		}
		return row;
	}
	,getVarSymbol: function(variable) {
		var this1 = 5;
		var symbol = this1;
		if(this.vars.h.__keys__[variable.__id__] != null) {
			symbol = this.vars.h[variable.__id__];
		} else {
			var this2 = 1;
			symbol = this2;
			this.vars.set(variable,symbol);
		}
		return symbol;
	}
};
var jasper__$Solver_Tag = function() {
	var this1 = 0;
	this.marker = this1;
	var this2 = 0;
	this.other = this2;
};
jasper__$Solver_Tag.__name__ = true;
var jasper__$Solver_EditInfo = function() { };
jasper__$Solver_EditInfo.__name__ = true;
var jasper__$Strength_Strength_$Impl_$ = {};
jasper__$Strength_Strength_$Impl_$.__name__ = true;
jasper__$Strength_Strength_$Impl_$.clip = function(value) {
	var this1 = 0.0;
	var min = this1;
	var max = 1001001000;
	if(value < min) {
		return min;
	} else if(value > max) {
		return max;
	} else {
		return value;
	}
};
var jasper_Term_$ = function(variable,coefficient) {
	this.variable = variable;
	this.coefficient = coefficient;
};
jasper_Term_$.__name__ = true;
jasper_Term_$.prototype = {
	toString: function() {
		return "variable: (" + Std.string(this.variable) + ") coefficient: " + this.coefficient;
	}
};
var jasper__$Term_Term_$Impl_$ = {};
jasper__$Term_Term_$Impl_$.__name__ = true;
jasper__$Term_Term_$Impl_$._new = function(variable,coefficient) {
	var this1 = new jasper_Term_$(variable,coefficient);
	return this1;
};
jasper__$Term_Term_$Impl_$.multiply = function(term,coefficient) {
	return jasper__$Term_Term_$Impl_$._new(term.variable,term.coefficient * jasper__$Value_Value_$Impl_$.toFloat(coefficient));
};
jasper__$Term_Term_$Impl_$.addConstant = function(term,constant) {
	var terms = new List();
	terms.add(term);
	var this1 = new jasper_Expression_$(terms,constant);
	return this1;
};
var jasper_Util = function() { };
jasper_Util.__name__ = true;
jasper_Util.nearZero = function(value) {
	if(value < 0.0) {
		return -value < 1.0e-8;
	} else {
		return value < 1.0e-8;
	}
};
var jasper__$Value_Value_$Impl_$ = {};
jasper__$Value_Value_$Impl_$.__name__ = true;
jasper__$Value_Value_$Impl_$.toFloat = function(this1) {
	return this1;
};
var jasper_Variable_$ = function(name) {
	this._value = 0.0;
	this._name = name;
};
jasper_Variable_$.__name__ = true;
jasper_Variable_$.prototype = {
	getValue: function() {
		return this._value;
	}
	,setValue: function(value) {
		this._value = value;
	}
	,toString: function() {
		return "name: " + this._name + " value: " + this._value;
	}
};
var jasper__$Variable_Variable_$Impl_$ = {};
jasper__$Variable_Variable_$Impl_$.__name__ = true;
jasper__$Variable_Variable_$Impl_$.addConstant = function(variable,constant) {
	return jasper__$Term_Term_$Impl_$.addConstant(jasper__$Term_Term_$Impl_$._new(variable,1.0),constant);
};
var jasper_exception_KiwiException = function(message) {
	this._message = message;
};
jasper_exception_KiwiException.__name__ = true;
var jasper_exception_DuplicateConstraintException = function(constraint) {
	jasper_exception_KiwiException.call(this,constraint.toString());
	this.constraint = constraint;
};
jasper_exception_DuplicateConstraintException.__name__ = true;
jasper_exception_DuplicateConstraintException.__super__ = jasper_exception_KiwiException;
jasper_exception_DuplicateConstraintException.prototype = $extend(jasper_exception_KiwiException.prototype,{
});
var jasper_exception_UnsatisfiableConstraintException = function(constraint) {
	jasper_exception_KiwiException.call(this,constraint.toString());
	this.constraint = constraint;
};
jasper_exception_UnsatisfiableConstraintException.__name__ = true;
jasper_exception_UnsatisfiableConstraintException.__super__ = jasper_exception_KiwiException;
jasper_exception_UnsatisfiableConstraintException.prototype = $extend(jasper_exception_KiwiException.prototype,{
});
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) {
					return o[0];
				}
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) {
						str += "," + js_Boot.__string_rec(o[i],s);
					} else {
						str += js_Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g11 = 0;
			var _g2 = l;
			while(_g11 < _g2) {
				var i2 = _g11++;
				str1 += (i2 > 0 ? "," : "") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) {
			str2 += ", \n";
		}
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "string":
		return o;
	default:
		return String(o);
	}
};
var test_Assert = function() { };
test_Assert.__name__ = true;
test_Assert.lessThanDelta = function(a,b,delta,successMessage) {
	if(Math.abs(a - b) > delta) {
		throw new js__$Boot_HaxeError("lessThanDelta error");
	} else if(successMessage != null) {
		console.log(successMessage);
	}
};
var test_Main = function() { };
test_Main.__name__ = true;
test_Main.main = function() {
	console.log("holla");
	test_Tests.simpleNew();
};
var test_Tests = function() { };
test_Tests.__name__ = true;
test_Tests.simpleNew = function() {
	var solver = new jasper_Solver();
	var this1 = new jasper_Variable_$("x");
	var x = this1;
	solver.addConstraint(jasper__$Expression_Expression_$Impl_$.equalsConstant(jasper__$Variable_Variable_$Impl_$.addConstant(x,2),20));
	solver.updateVariables();
	test_Assert.lessThanDelta(x.getValue(),18,1.0e-8,"simpleNew() PASSED");
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
haxe_ds_ObjectMap.count = 0;
test_Main.main();
})();