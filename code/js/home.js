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
        currentText += "from " + dates['start'];
    }
    if (dates && dates['end']){
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
        "end": $('#to_datepicker').datepicker({ dateFormat: dateFormat }).val()
    };
}

function loadMap(countries){
    queue()
      .defer(d3.json, "/data/world_countries.json")
      .await(function(error, data){
          return mapReady(error, data, countries)
      });
}

function displayCard(data, className, blockName){
    var index = 0;
    var rowDiv = blockName + "Row" + index;
    data.forEach(function(item){
        if (index % 3 == 0){
            rowDiv = blockName + "Row" + index;
            $('#' + blockName).append('<div id="' + rowDiv + '" class="row"></div>');
        }
        var countPerDay = [];
        if (item && item["count_per_day"]) {
            for (var key in item["count_per_day"]) {
                countPerDay.push({
                    date : d3.timeParse("%Y-%m-%d")(key), 
                    value : item["count_per_day"][key]
                });
            }
            countPerDay = countPerDay.sort(function(a,b) {
                return a.date - b.date;
            });
        }
        var divId = 'map' + item['key']; 
        var html = '<div class="column">';
        html += '<div class="card   ' + className + '">';
        if(className == 'people'){
            html += '<img src="/images/shadow.png" alt="Avatar" class="personShadow"></img>';
        }
        html += '<h3>' + item['display'] + '</h3>';
        html += '<p><strong>Blocks count: </strong>' + item['total_block_count'] + '</p>';
        html += '<p><strong>Blocks count in range: </strong>' + item['total_block_count_in_range'] + '</p>';
        html += '<div id="' + divId + '"></div>';
        html += '</div>';
        html += '</div>';
        $('#' + rowDiv).append(html);
        drawMapBlocksPerDateGraph(divId, countPerDay, className + 'Graph');
        index++;
    });

}

$( function() {
    $( ".datepicker" ).datepicker({ dateFormat: dateFormat });
    $("#dailyTopic").hide();

    $('#gcAnalysis').on('click', function(){
        $("#worldMap, #dailyTopic, #organizationsBlock, #personBlock",).html("");
        $.ajax({
        type: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        url: "http://127.0.0.1:3500/topic",
        data: JSON.stringify(getGcDateDate()),
        success: function(result){
            if(result && result['data'] && result['data']['dates']){
                updateDataTexts(result['data']['dates']);
            }
            if(result && result['data'] && result['data']['countries']){
                loadMap(result['data']['countries']);
            }
            if(result && result['data'] && result['data']['topics']){
                displayGcTopics(result['data']['topics']);
                $("#dailyTopic").show();
            }
            if(result && result['data'] && result['data']['organizations']){
                displayCard(result['data']['organizations'], 'organizations', 'organizationsBlock');
            }
            if(result && result['data'] && result['data']['people']){
                displayCard(result['data']['people'], 'people', 'personBlock');
            }
        },
        dataType: 'json',
        error: function () {
            console.log("error");
        }
        });
    });
});
