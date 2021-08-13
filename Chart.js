sap.ui.defin([
    'sap/ui/core/Control'
], function (Control) {
    return Control.extend('sap.ui.amchart.Line', {
        metadata : {
            properties : {
                "data": {
                    type: "string"
                }
            },
            aggregations : {
                xAxis: {
                    multiple: false
                },
                yAxis: {
                    multiple: false
                },
                series: {
                    multiple: true
                }
            }
        },
        init : function () {
            // Create div element that will contain chart
            let chartdiv = document.createElement('div');
            chartdiv.id = 'chartdiv';
            // Creating a chart instance
            let chart = this.chart = am4core.create();
            
        },
        onBeforeRendering: function () {

        },
        onAfterRendering: function () {

        },
        exit: function () {

        },
        renderer: function (oRenderManager, oControl) {

        }
    });
});