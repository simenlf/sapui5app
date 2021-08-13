sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("sap.ui.fishtank.Component", {

        metadata: {
            "rootView": {
                "viewName": "sap.ui.fishtank.temperature",
                "type": "XML",
                "id": "mainView"
            }
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
        }
    })
})