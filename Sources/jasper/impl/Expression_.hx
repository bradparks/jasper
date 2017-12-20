/*
 * Haxe Port Copyright (c) 2017 Jeremy Meltingtallow
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

package jasper.impl;

/**
 * Created by alex on 30/01/15.
 */
class Expression_
{
    /**
     *  [Description]
     *  @param terms - 
     *  @param constant - 
     */
    public function new(terms :List<Term>, constant :Float) : Void
    {
        _terms = terms;
        _constant = constant;
    }

    /**
     *  [Description]
     *  @return Expression
     */
    public static inline function empty() : Expression
    {
        return fromConstant(0);
    }

    /**
     *  [Description]
     *  @param constant - 
     *  @return Expression
     */
    public static inline function fromConstant(constant :Float) : Expression
    {
        return new Expression(new List<Term>(), constant);
    }

    /**
     *  [Description]
     *  @param term - 
     *  @param constant - 
     *  @return Expression
     */
    public static inline function fromTermAndConstant(term :Term, constant :Float) : Expression
    {
        var terms = new List<Term>();
        terms.add(term);
        return new Expression(terms, constant);
    }

    /**
     *  [Description]
     *  @param term - 
     *  @return Expression
     */
    public static inline function fromTerm(term :Term) : Expression
    {
        return fromTermAndConstant(term, 0.0);
    }

    /**
     *  [Description]
     *  @param terms - 
     *  @return Expression
     */
    public static inline function fromTerms(terms :List<Term>) : Expression
    {
        return new Expression(terms, 0.0);
    }

    /**
     *  [Description]
     *  @return Float
     */
    public function getConstant() : Float
    {
        return _constant;
    }

    /**
     *  [Description]
     *  @param constant - 
     */
    public function setConstant(constant :Float) : Void
    {
        _constant = constant;
    }

    /**
     *  [Description]
     *  @return List<Term>
     */
    public function getTerms() : List<Term>
    {
        return _terms;
    }

    /**
     *  [Description]
     *  @param terms - 
     */
    public function setTerms(terms :List<Term>) : Void
    {
        _terms = terms;
    }

    /**
     *  [Description]
     *  @return Float
     */
    public function getValue() : Float
    {
        var result = _constant;

        for (term in _terms) {
            result += term.getValue();
        }
        return result;
    }

    /**
     *  [Description]
     *  @return Bool
     */
    public function isConstant() : Bool
    {
        return _terms.length == 0;
    }

    /**
     *  [Description]
     *  @return String
     */
    public function toString() : String
    {
        var sb = "isConstant: " + isConstant() + " constant: " + _constant;
        if (!isConstant()) {
            sb += " terms: [";
            for (term in _terms) {
                sb += "(";
                sb += term;
                sb += ")";
            }
            sb += "] ";
        }
        return sb;
    }

    private var _terms :List<Term>;
    private var _constant :Float;
}