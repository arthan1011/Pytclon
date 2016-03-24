/**
    * Created by ashamsiev on 24.03.2016.
    */

define([
    'dojo/dom-prop',
    'pytclon/util/deferred'
], function(
    domProp,
    utilDeferred
) {
    return {
        shouldRepeat: function(otherInputGroup) {
            return function() {
                var self = this;
                return utilDeferred.wrapFunc(function() {
                    var fieldValue = domProp.get(self.field, 'value');
                    var repeatFieldValue = domProp.get(otherInputGroup.field, 'value');
                    if (fieldValue !== repeatFieldValue) {
                        return {
                            valid: false,
                            msg: otherInputGroup.title + ' should be repeated'
                        }
                    } else {
                        return { valid: true };
                    }
                });
            }
        },
        maxLength: function(limit) {
            return function() {
                var self = this;
                return utilDeferred.wrapFunc(function() {
                    if (domProp.get(self.field, 'value').length > limit) {
                        return {
                            valid: false,
                            msg: self.title + ' should be no more than ' + limit + ' symbols!'
                        }
                    } else {
                        return { valid: true }
                    }
                });
            }
        },
        required: function() {
            var self = this;
            return utilDeferred.wrapFunc(function() {
                if (!domProp.get(self.field, 'value')) {
                    return {
                        valid: false,
                        msg: self.title + ' should be specified!'
                    }
                } else {
                    return { valid: true }
                }
            });
        },
        pattern: function(regex, message) {
            return function() {
                var self = this;
                return utilDeferred.wrapFunc(function() {
                    if (regex.test(domProp.get(self.field, 'value'))) {
                        return { valid: true }
                    } else {
                        return {
                            valid: false,
                            msg: message
                        }
                    }
                });
            }
        },
        resourceExists: function(store) {
            return function() {
                var self = this;
                var inputValue = domProp.get(self.field, 'value');
                if (inputValue) {
                    return store.get(inputValue)
                        .then(function (data) {
                            if (data) {
                                return {
                                    valid: false,
                                    msg: self.title + ' with id "' + inputValue + '" already exists!'
                                }
                            } else {
                                return {
                                    valid: true
                                };
                            }
                        }
                    );
                } else {
                    return utilDeferred.wrapVal({valid: true});
                }

            }
        }
    };
});
