sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/m/MessageToast', 'sap/ui/core/format/DateFormat', 'sap/ui/core/library'],
	function(Controller, DateRange, MessageToast, DateFormat, coreLibrary) {
	"use strict";

	var CalendarType = coreLibrary.CalendarType;

	return Controller.extend("sap.ui.fishtank.controller", {

		chart: null,

		onInit: function () {

		},

		fetchCurrentTemp: async function () {
			let response = await fetch("http://localhost:5000/temperature/current");
			let currentTemp = await response.json();
			return currentTemp;
		},

		onToggleInside: function (oEvent) {
			if (oEvent.getSource().getSelected())
				this.chart.series.getIndex(0).show();
			else 
				this.chart.series.getIndex(0).hide();
		},

		onToggleOutside: function (oEvent) {
			if (oEvent.getSource().getSelected())
				this.chart.series.getIndex(1).show();
			else 
				this.chart.series.getIndex(1).hide();
		},

		onAfterRendering: async function () {
				if (!this.chart) {
						var dataset;
						// Create chart instance
						let chart = this.chart = am4core.create("mainView--temperature--chartdiv", am4charts.XYChart);

						// Set input format for dates
						chart.dateFormatter.inputDateFormat = "yyyy-MM-dd-H-m-s";
						
						// Creating axes - types of which are date (x) and temperature (y)
						let dateAxis = new am4charts.DateAxis();
						chart.xAxes.push(dateAxis);
						let valueAxis = new am4charts.ValueAxis();
						chart.yAxes.push(valueAxis);
						
						// Creating inside series
						let seriesTempInside = new am4charts.LineSeries();
						
						// Creating bullets for inside series
						let bulletInside = seriesTempInside.bullets.push(new am4charts.Bullet());
						let squareInside = bulletInside.createChild(am4core.Rectangle);
						squareInside.width = 10;
						squareInside.height = 10;
						squareInside.horizontalCenter = "middle";
						squareInside.verticalCenter = "middle";

						// Adding inside series to the chart
						chart.series.push(seriesTempInside);
						
						// Naming the series
						seriesTempInside.name = "Temperature Inside";

						// Creating outside series
						let seriesTempOutside = new am4charts.LineSeries();
						let bulletOutside = seriesTempOutside.bullets.push(new am4charts.Bullet());
						let squareOutside = bulletOutside.createChild(am4core.Rectangle);
						squareOutside.width = 10;
						squareOutside.height = 10;
						squareOutside.horizontalCenter = "middle";
						squareOutside.verticalCenter = "middle";
						chart.series.push(seriesTempOutside);
						seriesTempOutside.name = "Temperature Outside";

						// Binding series to the data
						seriesTempInside.dataFields.valueY = "inside";
						seriesTempInside.dataFields.dateX = "date";
						seriesTempOutside.dataFields.valueY = "outside";
						seriesTempOutside.dataFields.dateX = "date";
						var response = await fetch("http://localhost:5000/temperature/last10");
						var data = await response.json();
						dataset = chart.data = data;
						var oModel = new sap.ui.model.json.JSONModel({
							inside: dataset[dataset.length - 1].inside,
							outside: dataset[dataset.length - 1].outside
						});
						this.getView().setModel(oModel);
						const fetchCurrentTemp = this.fetchCurrentTemp;

						setInterval(async function () {
							var currentTemp = await fetchCurrentTemp();
							if (currentTemp.date !== dataset[dataset.length-1].date) {
								dataset.shift();
								dataset.push(currentTemp);
								chart.data = dataset;
								oModel.setProperty("/inside", currentTemp.inside);
								oModel.setProperty("/outside", currentTemp.outside);
							}
						}, 5000);
			}
		}
	});

});
