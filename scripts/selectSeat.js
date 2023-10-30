function selectClass(seatClass){
    if (seatClass == 'bussiness'){
        $("#bussinessButton").removeClass("btn-secondayr").addClass("btn-primary");
        $("#bussiness").addClass("available").removeClass("occupied reserved selected");
        $("#economy").addClass("reserved").removeClass("available occupied selected");
    }
}