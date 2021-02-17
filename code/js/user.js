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
        console.log('date:', value);
        return this.optional(element) || /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/.test(value);
    }, "Please specify correct date. Ex: 2021-11-11");

    $( ".datepicker" ).datepicker({ dateFormat: dateFormat });

    $("form[id='storyUserForm']").validate({
        // Specify validation rules
        rules: {
          // The key name on the left side is the name attribute
          // of an input field. Validation rules are defined
          // on the right side
          user_code: {
              required: true,
              minlength: 12
          },
          dob_datepicker: {
              required: true,
              story_date: true
          },
          experiment_date_datepicker: {
            required: true,
            story_date: true
          },
          department: {
            required: true,
            minlength: 8
          },
          level: "required",
          agreed: "required",
          gender: "required"
        },
        // Specify validation error messages
        messages: {
          user_code: {
              required: "Please enter your user code",
              minlength: jQuery.validator.format("At least {0} characters required!")
          },
          dob_datepicker: {
              required: "Please enter your date of birth"
          },
          experiment_date_datepicker: {
              required: "Please enter your date of experiment"
          },
          department: {
            required: "Please enter your department"
          },
          level: {
            required: "Please select your academic level"
          },
          agreed: {
            required: "Please agree the data usage term"
          },
          gender: {
            required: "Please select gender"
          }
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function(form) {
            localStorage.setItem('user_code', $('#user_code').val());
            localStorage.setItem('dob_datepicker', $('#dob_datepicker').val());
            localStorage.setItem('experiment_date_datepicker', $('#experiment_date_datepicker').val());
            localStorage.setItem('department', $('#department').val());
            localStorage.setItem('level', $('#level').val());
            localStorage.setItem('agreed', $('#agreed').val());
            localStorage.setItem('disability', $('#disability').checked());
            localStorage.setItem('gender', $('#gender').checked());
            window.location.href = "/tasks.html";
        }
      });
    $('#userFormSubmit').on('click', function(){
        $('#storyUserForm').submit();
    });
});
