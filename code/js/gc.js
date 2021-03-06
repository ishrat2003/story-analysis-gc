const analysisUrl = "http://127.0.0.1:3500";

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
        drawMapBlocksPerDateGraph(divId, countPerDay, className + 'Graph', 300, 300);
        index++;
    });

}

function loadGc(){
    $("#worldMap, #dailyTopic, #organizationsBlock, #personBlock, #summaryContent").html("");
    $.ajax({
    type: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    url: analysisUrl + "/topic",
    data: JSON.stringify(getGcDateData()),
    success: function(result){
        if(result && result['data'] && result['data']['dates']){
            updateDataTexts(result['data']['dates']);
        }
        if(result && result['data'] && result['data']['countries']){
            $("#whereExplanationBlock").show();
            loadMap(result['data']['countries']);
        }
        if(result && result['data'] && result['data']['topics']){
            $("#whatExplanationBlock").show();
            displayGcTopics(result['data']['topics']);
            $("#dailyTopic").show();
        }
        if(result && result['data'] && result['data']['organizations']){
            $("#whoExplanationBlock").show();
            drawDonut('organizationsBlock', result['data']['organizations']);
        }
        if(result && result['data'] && result['data']['people']){
            $("#whoExplanationBlock").show();
            drawDonut('personBlock', result['data']['people']);
        }
        if(result && result['data'] && result['data']['summary']){
            $("#summaryHeading").show();
            $("#summaryContent").html(result['data']['summary']);
        }
        $("#summaryHeading").show()
    },
    dataType: 'json',
    error: function () {
        console.log("error");
    }
    });
}
$( function() {
    $( ".datepicker" ).datepicker({
        dateFormat: dateFormat 
    });
    $("#dailyTopic").hide();
    $(".explanationBlock").hide();
    $("#whyExplanationBlock").show();
    $("#summaryHeading").hide();
    $('#gcAnalysis').on('click', function(){
        loadGc();
    });
    fillToday();
    loadGc();
});
