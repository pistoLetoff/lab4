$(function() {
    // Header navigation
    $(".left-btn, .right-btn").click(function(){  // Click header buttons
        if(!$(this).hasClass("active")){  // If it's not active button
            $(".left-btn, .right-btn").toggleClass("active");  // Make it active
            changeContent($(this).attr("class").split(' ')[0]);  // Chane content in container
        }
    });
    // Goods-table
    goodsTable = new TableController("#goods-table", {width: 2, height: 0});
    goodsTable.editScheme = [stringInput, stringInput];
    var goodsTableModel = goodsTable.model;
    goodsTableModel.setValidator(goodsValidator);
    goodsTableModel.addRow(["orange", 23]);
    goodsTableModel.addRow(["banana", 18]);
    goodsTableModel.addRow(["apple", 14]);
    goodsTableModel.addRow(["peach", 10]);
    goodsTableModel.addRow(["cherry", 11]);
    goodsTableModel.addRow(["blueberry", 4]);
    goodsTableModel.addRow(["strawberry", 3]);
    goodsTableModel.addRow(["watermelon", 35]);
    // Order table
    orderTable = new TableController("#order-table", {width: 3, height: 0});
    orderTable.editScheme = [false, false, stringInput];
    orderTable.model.setValidator(orderValidator);
    orderTable.clickBehavior = "edit";
    goodsTable.sendFunc = function (x, y, table) {
        if (((row = orderTable.model.findValue(0, table.getCell(0, y))) >= 0)) {
            num = orderTable.model.getCell(2, row).data;
            orderTable.model.setCellValue(2, row, num + 1);
        } else {
            var data = [table.getCell(0, y), table.getCell(1, y), new cellItem(0)];
            orderTable.model.rows.push(data);
            orderTable.model.setCellValue(2, orderTable.model.size.height, 1);
            orderTable.model.size.height += 1;
        }
    }
    orderTable.model.subscribeOnUpdates(deleteZeroCountItems);
    orderTable.model.subscribeOnUpdates(calculateTotalCost);
    // Click behavior when change list
    $(".left-btn").click(function(){
        goodsTable.clickBehavior = "send";
        orderTable.model.notifySubsribers();  // Redraw order table
    });
    $(".right-btn").click(function(){
        goodsTable.clickBehavior = "none";
        $('.btn-group > div').removeClass('btn-selected');
        $('form > p').addClass('display-none');
    });
    // Add button
    $("#goods-table-btn-add").click(function(){
        var product = $("#goods-table-input-product")[0].value;
        var price = $("#goods-table-input-price")[0].value;
        goodsTable.model.addRow([product, price]);
    });
    // Edit button
    $("#goods-table-btn-edit").click(function() {
        tableEditDeleteButtonClick(this, "edit");
        $("#hint-edit").toggleClass('display-none');
    });
    // Delete button
    $("#goods-table-btn-delete").click(function() {
        tableEditDeleteButtonClick(this, "delete");
        $("#hint-delete").toggleClass('display-none');
    });
});

var chanheingOrder = {"left-btn":["#table-editor", "#order"], 
                      "right-btn":["#order", "#table-editor"]};
var slideDirection = {"#table-editor":"right",
                  "#order":"left"};

function changeContent(btn) {
    $( chanheingOrder[btn][0] ).toggle( "slide", { direction: slideDirection[chanheingOrder[btn][0]] }, function() {
    $( chanheingOrder[btn][1] ).toggle( "slide", { direction: slideDirection[chanheingOrder[btn][1]] } );
    });
}

function tableEditDeleteButtonClick(btn, action) {
    if(!$(btn).hasClass('btn-selected')) {
        goodsTable.clickBehavior = action;
        switch(btn.id) {
            case "goods-table-btn-edit":
                $("#goods-table-btn-delete").removeClass('btn-selected');
                $("#hint-delete").addClass('display-none');
                break;
            case "goods-table-btn-delete":
                $("#goods-table-btn-edit").removeClass('btn-selected');
                $("#hint-edit").addClass('display-none');
                break;
        }
    } else {
        goodsTable.clickBehavior = "none";
    }
    $(btn).toggleClass('btn-selected');  
}

calculateTotalCost = {
    update: function(table) {
        cost = 0;
        for(var i = 0; i < table.rows.length; i++) {
            cost += table.rows[i][1].data * table.rows[i][2].data;
        }
        document.getElementById("total-cost").innerHTML = cost;
    }
}
deleteZeroCountItems = {
    update: function(table) {
        for(var i = 0; i < table.rows.length; i++) {
            if(table.rows[i][2].data == 0) {
                table.deleteRow(i--);
            }
        }
    }
}

orderTableValidator = {

};

function stringInput() {
    return $("<input>", {type: "text"});
}

function goodsValidator(x, y, value) {
    if(x == 0 || value >= 0) {
        this.getCell(x, y).data = value;
    }
    this.notifySubsribers();
}

function orderValidator(x, y, value) {
    if(x < 2 || value >= 0) {
        this.getCell(x, y).data = value;
    }
    this.notifySubsribers();
}
