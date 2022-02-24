/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"logaligroup/gestion_rrhh/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
