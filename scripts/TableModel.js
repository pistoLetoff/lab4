class TableModel{
    constructor(size){
        this.size = size;
        this.rows = [];
        this.updateSubscribers = [];
    }

    subscribeOnUpdates(listener) {
        this.updateSubscribers.push(listener);
    };

    notifySubsribers() {
        for(var i = 0; i < this.updateSubscribers.length; i++) {
            this.updateSubscribers[i].update(this);
        }
    };

    setValidator(validator) {
        this.setCellValue = validator;
    };

    addRow(data) {
        this.size.height += 1;
        this.rows.push([]);
        for(var i = 0; i < data.length; i++) {
            this.rows[this.size.height-1][i] = new cellItem(0);
            this.setCellValue(i, this.size.height-1, data[i]);
        }
        this.notifySubsribers();
    };

    deleteRow(rowN) {
        if(!this.rows[rowN]) {
            throw new RangeError({message:"invalid index of row"});
        }
        this.rows.splice(rowN, 1);
        this.size.height -= 1;
        this.notifySubsribers();
    };

    setCellValue(x, y, value) {
        this.notifySubsribers();
    };

    getCell(x, y) {
        return this.rows[y][x];
    };

    findValue(column, value) {
        for(var i = 0; i < this.rows.length; i++) {
            if(this.rows[i][column] == value)
                return i;
        }
        return -1;
    }
}
//======================================================================================
function cellItem(value) {
    this.data = value;
}
