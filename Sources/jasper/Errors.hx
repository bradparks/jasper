/*
 * Copyright (c) 2013-2017, Nucleic Development Team.
 * Haxe Port Copyright (c) 2017 Jeremy Meltingtallow
 *
 * Distributed under the terms of the Modified BSD License.
 *  
 * The full license is in the file COPYING.txt, distributed with this software.
*/

package jasper;

class UnsatisfiableConstraint
{
    public function new(constraint :Constraint) : Void
    {
        trace('UnsatisfiableConstraint: $constraint');
    }
}

class UnknownConstraint
{
    public function new(constraint :Constraint) : Void
    {
        trace('UnknownConstraint: $constraint');
    }
}

class DuplicateConstraint
{
    public function new(constraint :Constraint) : Void
    {
        trace('DuplicateConstraint: $constraint');
    }
}

class UnknownEditVariable
{
    public function new(variable :Variable) : Void
    {
        trace('UnknownEditVariable: $variable');
    }
}

class DuplicateEditVariable
{
    public function new(variable :Variable) : Void
    {
        trace('DuplicateEditVariable: $variable');
    }
}

class BadRequiredStrength
{
    public function new() : Void
    {
        trace('BadRequiredStrength');
    }
}

class InternalSolverError
{
    public function new(message :String) : Void
    {
        trace('InternalSolverError: $message');
    }
}