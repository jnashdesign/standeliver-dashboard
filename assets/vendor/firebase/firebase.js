if (localStorage.getItem('loggedIn') == 'true'){
    console.log('User is logged in.');
}else{
    window.location.replace("/index.html");
}

$('.nav-user-name').html(sessionStorage.getItem('email'));

$('#logoutBtn').click(function(event){
    event.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/index.html");
})

var storeID = sessionStorage.getItem('storeID');
var ref = firebase.database().ref('/restaurants/'+storeID+'/orders');
ref.on("value", function(snapshot){

    $('#recentOrders.table tbody').empty();
    let i = 1;
    let obj = snapshot.val();
    
    let orders = [];
    let orderTotals = [];
    let ordersDelivered = [];
    
    $.each( obj, function( key, value ) {
        var orderNum = value.orderID;
        var total = value.total.toFixed(2);
        var items = value.items;
        var status = value.status;
        var seatNum = value.seatNum;
        var orderTime = value.orderTime;

        orders.push(status);
        orderTotals.push(total);

        if (status == 'Delivered'){
            ordersDelivered.push(orderNum);
        }
        
        $('#recentOrders.table tbody').append('<tr id="'+orderNum+'-row"><td>'+i+'<td>'+orderNum+'</td><td>'+orderTime+'</td><td id="'+orderNum+'-food"></td><td>$'+total+'</td><td>'+seatNum+'</td><td class="statusSelect"><select class="custom-select d-block w-100" id="orderStatus" required=""><option value="Ordered">Ordered</option><option value="In Process">In Process</option><option value="In Transit">In Transit</option><option value="Delivered">Delivered</option></select></td></tr>');

        $('#'+orderNum+'-row select option[value="'+status+'"]').attr("selected","selected");
        i++;

        $('#'+orderNum+'-row #orderStatus').change(function() {
           var value = this.value;
           updateStatus(orderNum, value);
        });

        $.each(items, function(key, value){
            $('#'+orderNum+'-food').append(value.qtd+' '+value.order.name+'<br>')
        })
    });

    if (toString.call(orderTotals) !== "[object Array]")
    return false;
    var total =  0;
    for(var n=0;n<orderTotals.length;n++)
        {                  
        if(isNaN(orderTotals[n])){
        continue;
            }
            total += Number(orderTotals[n]);
        }

        console.log(ordersDelivered);

        $('#totalRev').html('$'+total.toFixed(2));
        $('#totalOrders').html(orders.length);
        $('#ordersDelivered').html(ordersDelivered.length);
});

function updateStatus(orderNum, value) {
    firebase.database().ref('/restaurants/'+storeID+'/orders/'+orderNum+'/').update({
        status: value
    });
}
