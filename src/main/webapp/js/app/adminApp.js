/**
 * Created by ashamsiev on 02.03.2016.
 */

require([
    'dojo/parser',
    'dojo/_base/window',
    'dojo/dom-construct',
    'dojo/text!./pages/adminLayout.html',
    'dojo/domReady!'
], function(
    parser,
    win,
    domConstruct,
    adminLayoutFragment
) {
    domConstruct.place(adminLayoutFragment, win.body());

    parser.parse();
});