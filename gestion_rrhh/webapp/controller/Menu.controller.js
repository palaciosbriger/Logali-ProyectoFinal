sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */ 
    
    function (Controller) {
        "use strict";
        function onInit(){
		
        }
        function navToCreateEmployee(){
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);			
			oRouter.navTo("RouteCreateEmployee",{},false);

	    }
        	
	    function navToShowEmployee(){
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);            
            oRouter.navTo("RouteShowEmployee",{},false);

        }
        return Controller.extend("logaligroup.gestionrrhh.controller.Menu", {
            onInit: onInit,
            navToCreateEmployee : navToCreateEmployee,
            navToShowEmployee : navToShowEmployee
        });
    });
