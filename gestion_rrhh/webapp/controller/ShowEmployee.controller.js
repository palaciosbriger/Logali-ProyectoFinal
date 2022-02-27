sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Filter, FilterOperator) {
        "use strict";
        function onInit(){
            this._splitAppEmployee = this.byId("splitAppRrhh");
        }
        function onBack(){
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMenu",{},true);
        }
        function onSearchEmployee(oEvent){
            
            
            var sQuery = oEvent.getSource().getValue();    
            var afilters = [];    
        
            var filter = new Filter({
                filters: [
                    new Filter({
                        path:'SapId',
                        operator:'EQ',
                        value1:this.getOwnerComponent().SapId
                    }),
                    new Filter({
                        path: 'FirstName',
                        operator: FilterOperator.Contains,
                        value1: sQuery
                    })
                ],
                and: true
            })
            afilters.push(filter);
        
            var oList = this.byId("listEmployees");
            var oBinding = oList.getBinding("items");
            oBinding.filter(afilters, "Application");  
        }
        function onSelectEmployee(oEvent){
            //Se navega al detalle del empleado
            this._splitAppEmployee.to(this.createId("detailEmployee"));
            var context = oEvent.getParameter("listItem").getBindingContext("employeeModel");
            //Se almacena el usuario seleccionado
            this.employeeId = context.getProperty("EmployeeId");
            var detailEmployee = this.byId("detailEmployee");
            //Se bindea a la vista con la entidad Users y las claves del id del empleado y el id del alumno
            detailEmployee.bindElement("employeeModel>/Users(EmployeeId='"+ this.employeeId +"',SapId='"+this.getOwnerComponent().SapId+"')");
            
        }
        //Función para eliminar el empleado seleccionado
        function onDeleteEmployee(oEvent){
            //Se muestra un mensaje de confirmación
            sap.m.MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("estaSeguroEliminar"),{
                title : this.getView().getModel("i18n").getResourceBundle().getText("confirm"),
                onClose : function(oAction){
                        if(oAction === "OK"){
                            //Se llama a la función remove
                            this.getView().getModel("employeeModel").remove("/Users(EmployeeId='" + this.employeeId + "',SapId='"+this.getOwnerComponent().SapId+"')",{
                                success : function(data){
                                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("seHaEliminadoUsuario"));
                                   var oList = this.getView().byId("listEmployees");
                                   var oBinding = oList.getBinding("items");
                                   oBinding.refresh();
                                    //En el detalle se muestra el mensaje "Seleccione empleado"
                                    this._splitAppEmployee.to(this.createId("detailSelectEmployee"));

                                }.bind(this),
                                error : function(e){
                                    sap.base.Log.info(e);
                                }.bind(this)
                            });
                        }
                }.bind(this)
            });
        }
        //Función para ascender a un empleado
	    function onRiseEmployee(oEvent){
		if(!this.riseDialog){
            //this.riseDialog = sap.ui.xmlfragment("logaligroup/rrhh/fragment/RiseEmployee", this);
			this.riseDialog = sap.ui.xmlfragment("logaligroup/gestionrrhh/fragment/RiseEmployee", this);
			this.getView().addDependent(this.riseDialog);
		}
		this.riseDialog.setModel(new sap.ui.model.json.JSONModel({}),"newRise");
		this.riseDialog.open();
	    }
        //Función para cerrar el dialogo
        function onCloseRiseDialog(){
            this.riseDialog.close();
        }
	    //Función para crear un nuevo ascenso
        function addRise(oEvent){
            //Se obtiene el modelo newRise
            var newRise = this.riseDialog.getModel("newRise");
            //Se obtiene los datos
            var odata = newRise.getData();
            //Se prepara la informacion para enviar a sap y se agrega el campo sapId con el id del alumno y el id del empleado
            var body = {
                Amount : odata.Amount,
                CreationDate : odata.CreationDate,
                Comments : odata.Comments,
                SapId : this.getOwnerComponent().SapId,
                EmployeeId : this.employeeId
            };
            this.getView().setBusy(true);
            this.getView().getModel("employeeModel").create("/Salaries",body,{
                success : function(){
                    this.getView().setBusy(false);
                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ascensoCorrectamente"));
                    this.onCloseRiseDialog();
                }.bind(this),
                error : function(){
                    this.getView().setBusy(false);
                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ascensoErroneo"));
                }.bind(this)
            });
            
        }
        function onFileChange (oEvent) {
            var oUploadCollection = oEvent.getSource();
            // Header Token
            var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
             name: "x-csrf-token",
             value: this.getView().getModel("employeeModel").getSecurityToken()
            });
            oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        }
        function onFileBeforeUploadStart (oEvent) {
            var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                     name: "slug",
                     value: this.getOwnerComponent().SapId+";"+this.employeeId+";"+oEvent.getParameter("fileName")
                 });
                 oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        }
        function onFileUploadComplete (oEvent) {
            var oUploadCollection = oEvent.getSource();
            oUploadCollection.getBinding("items").refresh();
        }
        function onFileDeleted(oEvent){
            var oUploadCollection = oEvent.getSource();
            var sPath = oEvent.getParameter("item").getBindingContext("employeeModel").getPath();
            this.getView().getModel("employeeModel").remove(sPath, {
                success: function(){
                    oUploadCollection.getBinding("items").refresh();
                },
                error: function(){
    
                }
            });
        }
        function downloadFile(oEvent){
            var sPath = oEvent.getSource().getBindingContext("employeeModel").getPath();
            window.open("sap/opu/odata/sap/ZEMPLOYEES_SRV"+sPath+"/$value");
        }
        return Controller.extend("logaligroup.gestionrrhh.controller.ShowEmployee", {
            onInit: onInit,
            onBack : onBack,
            onSearchEmployee : onSearchEmployee,
            onSelectEmployee : onSelectEmployee,
            onDeleteEmployee : onDeleteEmployee,
            onRiseEmployee : onRiseEmployee,
            onCloseRiseDialog : onCloseRiseDialog,
            addRise : addRise,
            onFileChange : onFileChange,
            onFileBeforeUploadStart : onFileBeforeUploadStart,
            onFileUploadComplete : onFileUploadComplete,
            onFileDeleted : onFileDeleted,
            downloadFile : downloadFile
            
        });
    });
