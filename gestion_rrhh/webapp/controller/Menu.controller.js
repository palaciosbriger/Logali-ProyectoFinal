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
        function onAfterRendering(){
            // Error en el framework: Al agregar la dirección URL de "Firmar pedidos", el componente GenericTile debería navegar directamente a dicha URL,
            // pero no funciona en la versión 1.78. Por tanto, una solución encontrada es eliminando la propiedad id del componente por jquery
            var genericTileFirmarPedido = this.byId("linkFirmarPedido");
            //Id del dom
            var idGenericTileFirmarPedido = genericTileFirmarPedido.getId();
            //Se vacía el id
            jQuery("#"+idGenericTileFirmarPedido)[0].id = ""; 
        }
        function navToCreateEmployee(){
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);			
			oRouter.navTo("RouteCreateEmployee",{},false);

	    }
        	
	    function navToShowEmployee(){
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);            
            oRouter.navTo("RouteShowEmployee",{},false);

        }
        function irFirmaPedidos (){
            window.open("https://be70909dtrial-dev-logali-approuter.cfapps.us10.hana.ondemand.com/logaligroupemployees/index.html","_blank")

        }
        return Controller.extend("logaligroup.gestionrrhh.controller.Menu", {
            onInit: onInit,
            //onAfterRendering : onAfterRendering,
            navToCreateEmployee : navToCreateEmployee,
            navToShowEmployee : navToShowEmployee,
            irFirmaPedidos : irFirmaPedidos
        });
    });
