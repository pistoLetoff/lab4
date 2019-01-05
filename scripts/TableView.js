class TableView {
    constructor(id){
        this.id = id;
        this.$head = $(id).find("thead");
        this.$body = $(id).find("tbody");
    }

    addRow(data) {
        var row = document.createElement("tr")
        for(var i = 0; i < data.length; i++) {
            var td = document.createElement("td")
            td.appendChild(document.createTextNode(data[i].data));
            row.appendChild(td);
        }
        this.$body.append(row);
    };

    clearBody() {
        this.$body.html("");
    };
    
    update(table) {
        this.clearBody();
        for(var i = 0; i < table.rows.length; i++) {
            this.addRow(table.rows[i]);
        }
    };

    removeSelection() {
        this.$body.find('.selected')
                  .html('').removeClass('selected');
    };

    addSelection(x, y) {
        this.removeSelection();

        this.$body
                .find('tr:nth-child('+(y+1)+')')
                .find('td:nth-child('+(x+1)+')')
                .addClass('selected');
    };

    setInput(x, y, input) {
        this.addSelection(x, y);
        var selectedCell = this.$body.find('td.selected');
        input.val(selectedCell.html())
        selectedCell.html(input)
        input.focus(); 
        //return input;
    }
}
