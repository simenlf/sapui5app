sap.ui.jsview("sapui5.ui.aquarium.temperature", {
    getControllerName: function () {
        return "sapui5.ui.aquarium.temperature";
    },
    createContent: function (oController) {
        var oCalendar = new sap.ui.unified.Calendar({
            id: "calendar",
            intervalSelection: "true"
        }).placeAt("content");
    }
});