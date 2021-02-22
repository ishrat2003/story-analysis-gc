var dateFormat = 'yy-mm-dd';

function setDate(dateString, divId){
    var dateParts = dateString.split("-")
    $(divId).datepicker('setDate', new Date(dateParts[0], dateParts[1], dateParts[2]));
}

function getGcDateData(){
    return {
        "start": $('#from_datepicker').datepicker({ dateFormat: dateFormat }).val(),
        "end": $('#to_datepicker').datepicker({ dateFormat: dateFormat }).val()
    };
}

$( function() {
    $.validator.addMethod("story_date", function(value, element) {
        return this.optional(element) || /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/.test(value);
    }, "Please specify correct date. Ex: 2021-11-11");

    $( ".datepicker" ).datepicker({ dateFormat: dateFormat });
});
