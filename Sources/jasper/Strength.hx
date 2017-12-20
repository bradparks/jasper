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

package jasper;

/**
 * Created by alex on 30/01/15.
 */
class Strength 
{
    public static var REQUIRED :Float = create(1000.0, 1000.0, 1000.0);
    public static var STRONG :Float = create(1.0, 0.0, 0.0);
    public static var MEDIUM :Float = create(0.0, 1.0, 0.0);
    public static var WEAK :Float = create(0.0, 0.0, 1.0);

    /**
     *  [Description]
     *  @param a - 
     *  @param b - 
     *  @param c - 
     *  @param w - 
     *  @return Float
     */
    public static function create_w(a :Float, b :Float, c :Float, w :Float) : Float
    {
        var result = 0.0;
        result += Math.max(0.0, Math.min(1000.0, a * w)) * 1000000.0;
        result += Math.max(0.0, Math.min(1000.0, b * w)) * 1000.0;
        result += Math.max(0.0, Math.min(1000.0, c * w));
        return result;
    }

    /**
     *  [Description]
     *  @param a - 
     *  @param b - 
     *  @param c - 
     *  @return Float
     */
    public static function create(a :Float, b :Float, c :Float) : Float
    {
        return create_w(a, b, c, 1.0);
    }

    /**
     *  [Description]
     *  @param value - 
     *  @return Float
     */
    public static function clip(value :Float) :Float
    {
        var min = 0.0;
        var max = REQUIRED;

        return if(value < min) min
            else if (value > max) max
            else value;
    }
}
