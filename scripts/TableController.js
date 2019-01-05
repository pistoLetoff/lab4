class TableController {
    constructor(tableID, size) {
        this.model = new TableModel(size);
        this.view = new TableView(tableID);
        this.editScheme = [];
        this.clickBehavior = "send";
        this.sendFunc = function(x, y, table) {};

        this.model.subscribeOnUpdates(this.view);
        this.model.subscribeOnUpdates(this);
    }

    
    update(table) {
        let parentThis = this;
        this.view.$body.find("td").off("click").on("click", function() {
            var x = (parentThis.view.$body.find('td').index(this) % (parentThis.model.size.width));
            var y = (parentThis.view.$body.find('tr').index($(this).parent()));

            switch(parentThis.clickBehavior){
                case "edit":
                    parentThis.edit(x, y);
                    break;
                case "delete":
                    parentThis.model.deleteRow(y);
                    break;
                case "send":
                    parentThis.sendFunc(x, y, table);
                    break;
            }
        });
    };

    edit(x, y) {
        if(!this.editScheme[x]) return;
        var input = this.editScheme[x]();
        this.view.setInput(x, y, input);
        let parentThis = this;
        input
            .blur(function(){
                parentThis.model.setCellValue(x, y, this.value);
                parentThis.view.removeSelection();
            })
            .keypress(function(event) {
                //console.log(event.key);
                if(event.key == "Enter") {
                    parentThis.model.setCellValue(x, y, this.value);
                    parentThis.view.removeSelection();
                }
            });

    };
}
