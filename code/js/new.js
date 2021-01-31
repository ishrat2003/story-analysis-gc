var dateFormat = 'yyyy-mm-dd';
var baseUrl = "http://127.0.0.1:3500";

function updateRcDataTexts(data){
    var text = data['grand_total'] + " news available for the topic \""  + data['main_topic'] + "\" are ";
    if (data['dates'] && data['dates']['min']){
        text += "from " + data['dates']['min'];
    }
    if (data['dates'] && data['dates']['max']){
        text += " to " + data['dates']['max'];
    }
    text += '.';
    $("#dataAvailable").text(text);

    var currentText = "Currently displaying analysis considering " + data['total_in_range'] +" news ";
    if (data['dates'] && data['dates']['start']){
        currentText += "from " + data['dates']['start'];
    }
    if (data['dates'] && data['dates']['end']){
        currentText += " to " + data['dates']['end'];
    }
    currentText += '.';
    $("#currentRange").text(currentText);

}

function setDate(dateString, divId){
    var dateParts = dateString.split("-")
    $(divId).datepicker('setDate', new Date(dateParts[0], dateParts[1], dateParts[2]));
}

function getPostData(){
    const key = getMainTopic();
    if (!key) return null;
    return {
        "start": $('#from_datepicker').datepicker({ dateFormat: dateFormat }).val(),
        "end": $('#to_datepicker').datepicker({ dateFormat: dateFormat }).val(),
        "main_topic": key
    };
}

function getMainTopic(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('key');
}

function loadTags(subtopics, total, mainTopic){
    var topicsHtml = '';
    var maxSize = subtopics[0]['size'];
    var gap = maxSize / 6;
    var selectedTopicHtml = getTopicLinkHtml(getMainTopic(), mainTopic, total, 0, false, 'selected');
    var topicsHtml = getTopicLinkHtml(getMainTopic(), mainTopic, total, 0, true, '');

    subtopics.forEach(item => {
        var sizeIndex = Math.ceil(item['size'] / gap);
        topicsHtml += getTopicLinkHtml(item['key'], item['display'] , item['size'], sizeIndex, false, '');
    });

    $('#subTopics').append('<ul>' + topicsHtml + '</ul>')
    $('#termBoardTopics').append('<ul>' + selectedTopicHtml + '</ul>')

    $('.tagLink').on('click', function(){
        var wordKey = $(this).data('key');
        var spanId = '#span' + wordKey;
        var linkId = '#link' + wordKey;
        
        if($(spanId).length > 0){
            $(spanId).remove();
        }else{
            $(linkId).append('<span class="spanTick" id="span' + wordKey + '">&#10003;</span>');
        }

        updateTermBoard();
    });
}

function updateTermBoard(){
    $('#termBoardTopics').html('');
    var selectedKeys = [];
    var termboardHtml = '';
    $('.spanTick').each((index) => {
        var link = $('.spanTick').eq(index).parent();
        var wordKey = link.data('key');
        var sizeIndex = link.data('size_index');
        var display = link.data('display');
        var total = link.data('total');
        termboardHtml += getTopicLinkHtml(wordKey, display, total, sizeIndex, false, 'selected');
        selectedKeys.push(wordKey);
    });
    
    $('#termBoardTopics').append('<ul>' + termboardHtml + '</ul>')
    return selectedKeys;
}

function getTopicLinkHtml(key, display, total, sizeIndex, addSpan, prefix){
    var topicsHtml = '<li><a id="link' + prefix + key + '" data-key="' + key 
        + '" data-display="' + display + '" '
        + '" data-size_index="' + sizeIndex + '" '
        + '" data-total="' + total + '" '
        + 'class="tagLink size' + sizeIndex + '">' + display  
        + ' (' + total + ')';
    if (addSpan) {
        topicsHtml += '<span class="spanTick" id="span' + prefix + key  + '">&#10003;</span>';
    }
    topicsHtml += '</a></li>';
    return topicsHtml
}

function drawSingleTopicBarChart(linegraph){
    var data = linegraph.map(function(d) { 
        return {
            date : d3.timeParse("%Y-%m-%d")(d.date), 
            value : d.value
        }
    });

    drawMapBlocksPerDateGraph('linegraph', data, "rcBarChart", 600, 400);
}

function loadRc(){
    var data = getPostData();
    if(!data){
        return;
    }
    $("#linegraph, #subTopics, #termBoardTopics").html("");
    $.ajax({
        type: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        url: baseUrl + "/topic",
        data: JSON.stringify(data),
        success: function(result){
            if(result && result['data'] && result['data']['dates']){
                updateRcDataTexts(result['data']);
            }
            if(result && result['data'] && result['data']['linegraph']){
                drawSingleTopicBarChart(result['data']['linegraph']);
            }
            if(result && result['data'] && result['data']['sub_topics']){
                loadTags(result['data']['sub_topics'], result['data']['total_in_range'], result['data']['main_topic']);
            }     
        },
        dataType: 'json',
        error: function () {
            console.log("error");
        }
    });
}

$( function() {
    $( ".datepicker" ).datepicker({ dateFormat: dateFormat });
    loadRc();

    $('#rcAnalysis').on('click', function(){
        loadRc();
    });

    $('#termboardAnalysis').on('click', function(){
        var selectedKeys = updateTermBoard();
        var url = '/termboard.html?' + $.param({
            'topic_keys': selectedKeys
        });
        window.location.href = url;
    });
});
