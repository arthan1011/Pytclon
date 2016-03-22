/**
 * Created by ashamsiev on 22.03.2016.
 */

define([
    'dojo/Deferred',
    'dojo/promise/all'
], function(
    Deferred,
    all
) {
    return {
        wrapFunc: function(closure) {
            var deferred = new Deferred();
            deferred.resolve();
            return deferred.then(closure);
        },

        wrapVal: function(value) {
            return this.wrapFunc(function() {
                return value
            })
        }
    }
});