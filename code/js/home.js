var dateFormat = 'yy-mm-dd';

function updateDataTexts(dates){
    var text = "Data available ";
    if (dates && dates['min']){
        text += "from " + dates['min'];
    }
    if (dates && dates['max']){
        text += " to " + dates['max'];
    }
    text += '.';
    $("#dataAvailable").text(text);

    var currentText = "Currently displaying data ";
    if (dates && dates['start']){
        setDate(dates['start'], '#from_datepicker')
        currentText += "from " + dates['start'];
    }
    if (dates && dates['end']){
        setDate(dates['end'], '#to_datepicker')
        currentText += " to " + dates['end'];
    }
    currentText += '.';
    $("#currentRange").text(currentText);

}

function setDate(dateString, divId){
    var dateParts = dateString.split("-")
    $(divId).datepicker('setDate', new Date(dateParts[0], dateParts[1], dateParts[2]));
}

function getGcDateDate(){
    return {
        "start": $('#from_datepicker').datepicker({ dateFormat: dateFormat }).val(),
        "end": $('#from_datepicker').datepicker({ dateFormat: dateFormat }).val()
    };
}

function loadMap(countries){
    queue()
      .defer(d3.json, "/data/world_countries.json")
      .await(function(error, data){
          return mapReady(error, data, countries)
      });
}

$( function() {
    $( ".datepicker" ).datepicker({ dateFormat: dateFormat });
    setDate("2021-01-01", '#from_datepicker');
    setDate("2021-01-30", '#to_datepicker');
    $.ajax({
      type: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      url: "http://127.0.0.1:3500/topic",
      data: JSON.stringify({
          "start": "2020-10-21",
          "end": "2021-01-30"
      }),
      success: function(result){
        console.log(result['data']);
        if(result && result['data'] && result['data']['dates']){
            updateDataTexts(result['data']['dates']);
        }
        if(result && result['data'] && result['data']['countries']){
            loadMap(result['data']['countries']);
        }
      },
      dataType: 'json',
      error: function () {
        console.log("error");
      }
    });
  } );
