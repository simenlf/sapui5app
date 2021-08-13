sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/m/MessageToast', 'sap/ui/core/format/DateFormat', 'sap/ui/core/library'],
	function(Controller, DateRange, MessageToast, DateFormat, coreLibrary) {
	"use strict";

	var CalendarType = coreLibrary.CalendarType;

	return Controller.extend("sap.ui.fishtank.controller", {

		chart: null,

		fetchCurrentPH: async function () {
			let response = await fetch("http://localhost:5000/ph/current");
			let currentTemp = await response.json();
			return currentTemp;
		},

		onAfterRendering: async function () {
				if (!this.chart) {
						var dataset;
						// Create chart instance
						let chart = this.chart = am4core.create("mainView--ph--chartdiv", am4charts.XYChart);

						// Set input format for dates
						chart.dateFormatter.inputDateFormat = "yyyy-MM-dd-H-m-s";
						
						// Creating axes - types of which are date (x) and pH (y)
						let dateAxis = new am4charts.DateAxis();
						chart.xAxes.push(dateAxis);
						let valueAxis = new am4charts.ValueAxis();
						chart.yAxes.push(valueAxis);
						
						// Creating pH series
						let seriesPH = new am4charts.LineSeries();
						
						// Creating bullets for inside series
						let bullet = seriesPH.bullets.push(new am4charts.Bullet());
						let square = bullet.createChild(am4core.Rectangle);
						square.width = 10;
						square.height = 10;
						square.horizontalCenter = "middle";
						square.verticalCenter = "middle";

						// Adding pH series to the chart
						chart.series.push(seriesPH);
						
						// Naming the series
						seriesPH.name = "pH";

						// Binding series to the data
						seriesPH.dataFields.dateX = "date";
                        seriesPH.dataFields.valueY = "pH"
						var response = await fetch("http://localhost:5000/ph/last10");
						var data = await response.json();
						dataset = chart.data = data;
						var oModel = new sap.ui.model.json.JSONModel({
                            pH: dataset[dataset.length - 1].pH
						});
						this.getView().setModel(oModel);
						const fetchCurrentPH = this.fetchCurrentPH;

						setInterval(async function () {
							var currentPH = await fetchCurrentPH();
							if (currentPH.date !== dataset[dataset.length-1].date) {
								dataset.shift();
								dataset.push(currentPH);
								chart.data = dataset;
								oModel.setProperty("/pH", currentPH.pH);
							}
						}, 5000);
			}
		}
	});

});
