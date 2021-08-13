sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/m/MessageToast', 'sap/ui/core/format/DateFormat', 'sap/ui/core/library'],
	function(Controller, DateRange, MessageToast, DateFormat, coreLibrary) {
	"use strict";

	var CalendarType = coreLibrary.CalendarType;

	return Controller.extend("sap.ui.unified.sample.CalendarSingleIntervalSelection.CalendarSingleIntervalSelection", {

		chart: null,

		currentTempData: {
			inside: 0.0,
			outside: 0.0	
		},

		onInit: function () {
			var oModel = new sap.ui.model.json.JSONModel(this.currentTempData);
			this.getView().setModel(oModel);
		},

		onAfterRendering: function () {
				if (!this.chart) {
					let chart = this.chart = am4core.create("mainView--chartdiv", am4charts.XYChart);
					var dataset;
					async function fetchCurrentTemp () {
						let response = await fetch("http://localhost:5000/temperature/current");
						let currentTemp = await response.json();
						if (currentTemp.date !== dataset[dataset.length-1].date) {
							dataset.shift();
							dataset.push(currentTemp);
							chart.data = dataset;
						}
					}
					// Load external data
					//chart.dataSource.url = "http://localhost:5000/temperature/last10";
					// Set input format for dates
					chart.dateFormatter.inputDateFormat = "yyyy-MM-dd-H-m-s";
					// Creating axes - types of which are date (x) and temperature (y)
					let dateAxis = new am4charts.DateAxis();
					chart.xAxes.push(dateAxis);
					let valueAxis = new am4charts.ValueAxis();
					chart.yAxes.push(valueAxis);
					// Creating inside series
					let seriesTempInside = new am4charts.LineSeries();
					chart.series.push(seriesTempInside);
					seriesTempInside.name = "Temperature Inside";
					// Creating outside series
					let seriesTempOutside = new am4charts.LineSeries();
					chart.series.push(seriesTempOutside);
					seriesTempOutside.name = "Temperature Outside";
					// Binding series to the data
					seriesTempInside.dataFields.valueY = "inside";
					seriesTempInside.dataFields.dateX = "date";
					seriesTempOutside.dataFields.valueY = "outside";
					seriesTempOutside.dataFields.dateX = "date";
					fetch("http://localhost:5000/temperature/last10")
					.then(response => response.json())
					.then(data => dataset = chart.data = data)
					.then(() => setInterval(fetchCurrentTemp, 5000));
			}
		}
	});

});
