/*
 * Copyright (c) 2013-2017, Nucleic Development Team.
 * Haxe Port Copyright (c) 2017 Jeremy Meltingtallow
 *
 * Distributed under the terms of the Modified BSD License.
 *  
 * The full license is in the file COPYING.txt, distributed with this software.
*/

package jasper;

import jasper.Errors.DuplicateConstraint;
import jasper.Errors.UnsatisfiableConstraint;
import jasper.Errors.UnknownConstraint;
import jasper.Errors.DuplicateEditVariable;
import jasper.Errors.BadRequiredStrength;
import jasper.Errors.UnknownEditVariable;
import jasper.Errors.InternalSolverError;
import jasper.ds.SolverMap;

import jasper.Symbol;
import jasper.Constraint;

typedef Tag =
{
	@:optional var marker :Symbol;
	@:optional var other :Symbol;
};

typedef EditInfo =
{
	@:optional var tag :Tag;
	@:optional var constraint :Constraint;
	@:optional var constant :Float;
};

typedef VarMap = SolverMap<Variable, Symbol>;

typedef RowMap = SolverMap<Symbol, Row>;

typedef CnMap = SolverMap<Constraint, Tag>;

typedef EditMap = SolverMap<Variable, EditInfo>;

// struct DualOptimizeGuard
// {
// 	DualOptimizeGuard( SolverImpl& impl ) : m_impl( impl ) {}
// 	~DualOptimizeGuard() { m_impl.dualOptimize(); }
// 	SolverImpl& m_impl;
// };

class SolverImpl
{
    @:allow(jasper.Solver)
    private function new() : Void
    {
        m_cns = new CnMap();
        m_rows = new RowMap();
        m_vars = new VarMap();
        m_edits = new EditMap();
        m_objective = new Row();
        m_artificial = null;
    }

	/* Add a constraint to the solver.
	Throws
	------
	DuplicateConstraint
		The given constraint has already been added to the solver.
	UnsatisfiableConstraint
		The given constraint is required and cannot be satisfied.
	*/
	public function addConstraint( constraint :Constraint )
	{
		if( m_cns.exists( constraint ) )
			throw new DuplicateConstraint( constraint );

		// Creating a row causes symbols to reserved for the variables
		// in the constraint. If this method exits with an exception,
		// then its possible those variables will linger in the var map.
		// Since its likely that those variables will be used in other
		// constraints and since exceptional conditions are uncommon,
		// i'm not too worried about aggressive cleanup of the var map.
		var tag :Tag = {};
		var rowptr :Row = createRow( constraint, tag );
		var subject :Symbol =  chooseSubject( rowptr, tag );

		// If chooseSubject could find a valid entering symbol, one
		// last option is available if the entire row is composed of
		// dummy variables. If the constant of the row is zero, then
		// this represents redundant constraints and the new dummy
		// marker can enter the basis. If the constant is non-zero,
		// then it represents an unsatisfiable constraint.
		if( subject.m_type == INVALID && allDummies( rowptr ) ) {
			if( !Util.nearZero( rowptr.m_constant ) )
				throw new UnsatisfiableConstraint( constraint );
			else
				subject = tag.marker;
		}

		// If an entering symbol still isn't found, then the row must
		// be added using an artificial variable. If that fails, then
		// the row represents an unsatisfiable constraint.
		if( subject.m_type == INVALID ) {
			if( !addWithArtificialVariable( rowptr ) )
				throw new UnsatisfiableConstraint( constraint );
		}
		else {
			rowptr.solveFor( subject );
			substitute( subject, rowptr );
			m_rows[ subject ] = rowptr;
		}

		m_cns[ constraint ] = tag;

		// Optimizing after each constraint is added performs less
		// aggregate work due to a smaller average system size. It
		// also ensures the solver remains in a consistent state.
		optimize( m_objective );
	}

	/* Remove a constraint from the solver.
	Throws
	------
	UnknownConstraint
		The given constraint has not been added to the solver.
	*/
	public function removeConstraint( constraint :Constraint )
	{
		// CnMap::iterator cn_it = m_cns.find( constraint );
		if( !m_cns.exists(constraint) )
			throw new UnknownConstraint( constraint );

		var tag :Tag = m_cns.get(constraint);
		m_cns.remove( constraint );

		// Remove the error effects from the objective function
		// *before* pivoting, or substitutions into the objective
		// will lead to incorrect solver results.
		removeConstraintEffects( constraint, tag );

		// If the marker is basic, simply drop the row. Otherwise,
		// pivot the marker into the basis and then drop the row.
		if( m_rows.exists( tag.marker ) ) {
			m_rows.remove( tag.marker );
		}
		else {
			getMarkerLeavingRow(tag.marker, function(symbol, row) {
				if( row == null )
					throw new InternalSolverError( "failed to find leaving row" );
				m_rows.remove( tag.marker );
				row.solveForSymbols( symbol, tag.marker );
				substitute( tag.marker, row );
			});
		}

		// Optimizing after each constraint is removed ensures that the
		// solver remains consistent. It makes the solver api easier to
		// use at a small tradeoff for speed.
		optimize( m_objective );
	}

	/* Test whether a constraint has been added to the solver.
	*/
	public function hasConstraint( constraint :Constraint ) : Bool
	{
		return m_cns.exists( constraint );
	}

	/* Add an edit variable to the solver.
	This method should be called before the `suggestValue` method is
	used to supply a suggested value for the given edit variable.
	Throws
	------
	DuplicateEditVariable
		The given edit variable has already been added to the solver.
	BadRequiredStrength
		The given strength is >= required.
	*/
	public function addEditVariable( variable :Variable, strength :Strength )
	{
		throw "addEditVariable compare new Expression([term])";

		if( m_edits.exists( variable ) )
			throw new DuplicateEditVariable( variable );
		strength = Strength.clip( strength );
		if( strength == Strength.REQUIRED )
			throw new BadRequiredStrength();

		var term = new Term(variable);
		var cn = new Constraint( new Expression([term]), OP_EQ, strength );
		addConstraint( cn );
		var info :EditInfo = {};
		info.tag = m_cns[ cn ];
		info.constraint = cn;
		info.constant = 0.0;
		m_edits[ variable ] = info;
	}

	/* Remove an edit variable from the solver.
	Throws
	------
	UnknownEditVariable
		The given edit variable has not been added to the solver.
	*/
	public function removeEditVariable( variable :Variable )
	{
		if( !m_edits.exists( variable ) )
			throw new UnknownEditVariable( variable );
		removeConstraint( m_edits.get( variable ).constraint );
		m_edits.remove( variable );
	}

	/* Test whether an edit variable has been added to the solver.
	*/
	public function hasEditVariable( variable :Variable ) : Bool
	{
		return m_edits.exists( variable );
	}

	/* Suggest a value for the given edit variable.
	This method should be used after an edit variable as been added to
	the solver in order to suggest the value for that variable.
	Throws
	------
	UnknownEditVariable
		The given edit variable has not been added to the solver.
	*/
	public function suggestValue( variable :Variable, value :Float )
	{
		// EditMap::iterator it = m_edits.find( variable );
		if( !m_edits.exists( variable ) )
			throw new UnknownEditVariable( variable );

		// DualOptimizeGuard guard( *this );
		var info :EditInfo = m_edits.get(variable);
		var delta = value - info.constant;
		info.constant = value;

		// Check first if the positive error variable is basic.
		// RowMap::iterator row_it = m_rows.find( info.tag.marker );
		if( m_rows.exists(info.tag.marker) )
		{
			if( m_rows.get(info.tag.marker).add( -delta ) < 0.0 )
				m_infeasible_rows.push( info.tag.marker );
			return;
		}

		// Check next if the negative error variable is basic.
		// row_it = m_rows.find( info.tag.other );
		if( m_rows.exists( info.tag.other ) )
		{
			if( m_rows.get( info.tag.other ).add( delta ) < 0.0 )
				m_infeasible_rows.push( info.tag.other );
			return;
		}

		// Otherwise update each row where the error variables exist.
		m_rows.iterateKeyVal(function(symbol, row) {
			var coeff = row.coefficientFor( info.tag.marker );
			if( coeff != 0.0 &&
				row.add( delta * coeff ) < 0.0 &&
				symbol.m_type != EXTERNAL )
				m_infeasible_rows.push( symbol );
		});
	}

	/* Update the values of the external solver variables.
	*/
	public function updateVariables()
	{
		m_vars.iterateKeyVal(function(variable, symbol) {
			// Variable& var( const_cast<Variable&>( var_it->first ) );
			// row_iter_t row_it = m_rows.find( var_it->second );
			if( !m_rows.exists( symbol ) )
				variable.m_value = 0.0;
			else
				variable.m_value = m_rows.get(symbol).m_constant;
		});
	}

	/* Reset the solver to the empty starting condition.
	This method resets the internal solver state to the empty starting
	condition, as if no constraints or edit variables have been added.
	This can be faster than deleting the solver and creating a new one
	when the entire system must change, since it can avoid unecessary
	heap (de)allocations.
	*/
	public function reset()
	{
		throw "reset!!";
		// clearRows();
		// m_cns.clear();
		// m_vars.clear();
		// m_edits.clear();
		// m_infeasible_rows.clear();
		// m_objective.reset( new Row() );
		// m_artificial.reset();
		// m_id_tick = 1;
	}

	// struct RowDeleter
	// {
	// 	template<typename T>
	// 	void operator()( T& pair ) { delete pair.second; }
	// };

	private function clearRows()
	{
		throw "clearRows!!";
		// std::for_each( m_rows.begin(), m_rows.end(), RowDeleter() );
		// m_rows.clear();
	}

	/* Get the symbol for the given variable.
	If a symbol does not exist for the variable, one will be created.
	*/
	private function getVarSymbol( variable :Variable ) : Symbol
	{
		if( m_vars.exists( variable ) )
			return m_vars.get( variable );
		var symbol = new Symbol( EXTERNAL );
		m_vars[ variable ] = symbol;
		return symbol;
	}

	/* Create a new Row object for the given constraint.
	The terms in the constraint will be converted to cells in the row.
	Any term in the constraint with a coefficient of zero is ignored.
	This method uses the `getVarSymbol` method to get the symbol for
	the variables added to the row. If the symbol for a given cell
	variable is basic, the cell variable will be substituted with the
	basic row.
	The necessary slack and error variables will be added to the row.
	If the constant for the row is negative, the sign for the row
	will be inverted so the constant becomes positive.
	The tag will be updated with the marker and error symbols to use
	for tracking the movement of the constraint in the tableau.
	*/
	private function createRow( constraint :Constraint, tag :Tag ) : Row
	{
		var expr :Expression = constraint.m_expression;
		var row :Row = new Row( expr.m_constant );

		// Substitute the current basic variables into the row.
		for( term in expr.m_terms )
		{
			if( !Util.nearZero( term.m_coefficient ) )
			{
				var symbol :Symbol = getVarSymbol( term.m_variable );
				if( m_rows.exists( symbol) )
					row.insertRow( m_rows.get( symbol), term.m_coefficient );
				else
					row.insertSymbol( symbol, term.m_coefficient );
			}
		}

		// Add the necessary slack, error, and dummy variables.
		switch( constraint.m_op )
		{
			case OP_LE:
			{
				var coeff = 1.0;
				var slack = new Symbol(SLACK);
				tag.marker = slack;
				row.insertSymbol( slack, coeff );
				if( constraint.m_strength < Strength.REQUIRED )
				{
					var error = new Symbol( ERROR );
					tag.other = error;
					row.insertSymbol( error, -coeff );
					m_objective.insertSymbol( error, constraint.m_strength );
				}
			}
			case OP_GE:
			{
				var coeff = -1.0;
				var slack = new Symbol(SLACK);
				tag.marker = slack;
				row.insertSymbol( slack, coeff );
				if( constraint.m_strength < Strength.REQUIRED )
				{
					var error = new Symbol( ERROR );
					tag.other = error;
					row.insertSymbol( error, -coeff );
					m_objective.insertSymbol( error, constraint.m_strength );
				}
			}
			case OP_EQ:
			{
				if( constraint.m_strength < Strength.REQUIRED )
				{
					var errplus = new Symbol( ERROR );
					var errminus = new Symbol( ERROR );
					tag.marker = errplus;
					tag.other = errminus;
					row.insertSymbol( errplus, -1.0 ); // v = eplus - eminus
					row.insertSymbol( errminus, 1.0 ); // v - eplus + eminus = 0
					m_objective.insertSymbol( errplus, constraint.m_strength );
					m_objective.insertSymbol( errminus, constraint.m_strength );
				}
				else
				{
					var dummy = new Symbol( DUMMY );
					tag.marker = dummy;
					row.insertSymbol( dummy );
				}
			}
		}

		// Ensure the row as a positive constant.
		if( row.m_constant < 0.0 )
			row.reverseSign();

		return row;
	}

	/* Choose the subject for solving for the row.
	This method will choose the best subject for using as the solve
	target for the row. An invalid symbol will be returned if there
	is no valid target.
	The symbols are chosen according to the following precedence:
	1) The first symbol representing an external variable.
	2) A negative slack or error tag variable.
	If a subject cannot be found, an invalid symbol will be returned.
	*/
	private function chooseSubject( row :Row, tag :Tag ) : Symbol
	{
		return null;
	}

 	/* Add the row to the tableau using an artificial variable.
	This will return false if the constraint cannot be satisfied.
 	*/
 	private function addWithArtificialVariable( row :Row ) : Bool
 	{
		 return false;
 	}

	/* Substitute the parametric symbol with the given row.
	This method will substitute all instances of the parametric symbol
	in the tableau and the objective function with the given row.
	*/
	private function substitute( symbol :Symbol, row :Row )
	{
	}

	/* Optimize the system for the given objective function.
	This method performs iterations of Phase 2 of the simplex method
	until the objective function reaches a minimum.
	Throws
	------
	InternalSolverError
		The value of the objective function is unbounded.
	*/
	private function optimize( objective :Row )
	{
	}

	/* Optimize the system using the dual of the simplex method.
	The current state of the system should be such that the objective
	function is optimal, but not feasible. This method will perform
	an iteration of the dual simplex method to make the solution both
	optimal and feasible.
	Throws
	------
	InternalSolverError
		The system cannot be dual optimized.
	*/
	private function dualOptimize()
	{
	}

	/* Compute the entering variable for a pivot operation.
	This method will return first symbol in the objective function which
	is non-dummy and has a coefficient less than zero. If no symbol meets
	the criteria, it means the objective function is at a minimum, and an
	invalid symbol is returned.
	*/
	private function getEnteringSymbol( objective :Row ) : Symbol
	{
		return null;
	}

	/* Compute the entering symbol for the dual optimize operation.
	This method will return the symbol in the row which has a positive
	coefficient and yields the minimum ratio for its respective symbol
	in the objective function. The provided row *must* be infeasible.
	If no symbol is found which meats the criteria, an invalid symbol
	is returned.
	*/
	private function getDualEnteringSymbol( row :Row ) : Symbol
	{
		return null;
	}

	/* Get the first Slack or Error symbol in the row.
	If no such symbol is present, and Invalid symbol will be returned.
	*/
	private function anyPivotableSymbol( row :Row ) : Symbol
	{
		return null;
	}

	/* Compute the row which holds the exit symbol for a pivot.
	This method will return an iterator to the row in the row map
	which holds the exit symbol. If no appropriate exit symbol is
	found, the end() iterator will be returned. This indicates that
	the objective function is unbounded.
	*/
	// RowMap::iterator getLeavingRow( const Symbol& entering )
	// {
	// }

	/* Compute the leaving row for a marker variable.
	This method will return an iterator to the row in the row map
	which holds the given marker variable. The row will be chosen
	according to the following precedence:
	1) The row with a restricted basic varible and a negative coefficient
	   for the marker with the smallest ratio of -constant / coefficient.
	2) The row with a restricted basic variable and the smallest ratio
	   of constant / coefficient.
	3) The last unrestricted row which contains the marker.
	If the marker does not exist in any row, the row map end() iterator
	will be returned. This indicates an internal solver error since
	the marker *should* exist somewhere in the tableau.
	*/
	private function getMarkerLeavingRow( marker :Symbol, cb :Symbol -> Row -> Void ) //symbol,row
	{
	}

	/* Remove the effects of a constraint on the objective function.
	*/
	private function removeConstraintEffects( cn :Constraint, tag :Tag )
	{
	}

	/* Remove the effects of an error marker on the objective function.
	*/
	private function removeMarkerEffects( marker :Symbol, strength :Strength )
	{
	}

	/* Test whether a row is composed of all dummy variables.
	*/
	private function allDummies( row :Row ) : Bool
	{
		return false;
	}

	private var m_cns :CnMap;
	private var m_rows :RowMap;
	private var m_vars :VarMap;
	private var m_edits :EditMap;
	private var m_infeasible_rows :Array<Symbol>;
	private var m_objective :Row;
	private var m_artificial :Row;
}