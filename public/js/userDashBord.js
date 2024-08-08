$(document).ready(function() {
    $("#check-result").click(function(event) {
        event.preventDefault();
        $(".box-cont, #complaintSection").css("display","none");
        $(".check-result").css("display","block");
        $(".accordion").css("display","none")
    });

    $("#layComplaintLink").click(function(event) {
        event.preventDefault();
        $(".box-cont, .check-result").css("display","none")
        $("#complaintSection").css("display","block")
        $(".accordion").css("display","none")
    });
});
$(".fa-regular.fa-bell").click(function(event) {
    event.preventDefault();
    $(".box-cont, .check-result").css("display", "none");
    $(".accordion").toggle();
    $(".box-cont").css("display","flex");
    $("#complaintSection").css("display","none");
});



