var dateFormat = 'yyyy-mm-dd';
var baseUrl = "http://127.0.0.1:3500";

function getParams(){
    var queryString = window.location.search;
    queryString = decodeURIComponent(queryString.substring(1, queryString.length));
    var params = queryString.split("&");
    
    var topicKeys = [];
    var from, to;
    if(params.length){
        params.forEach(item => {
            if(item.includes("topic_keys")){
                topicKeys.push(item.replace(/topic_keys\[\]=/, ''));
            }else if(item.includes("from")){
                from = item.replace(/from\[\]=/, '');
            }else if(item.includes("to")){
                to = item.replace(/to\[\]=/, '');
            }
        });
    }
    return [topicKeys, from, to];
}

function displayDocuments(documents){
    if(documents.length){
        documents.forEach(item => {
            var key = item.url.replace('https://www.bbc.co.uk/news/', '');
            var liHtml = '<li>'
                + '<h3><a target="_blank" href="/lc_load.html?condition=all&key=' + key + '">' + item.title + '</a></h3>'
                + '<span>' + item.date + '</span>'
                + '<p>' + item.description + '</p>'
                + '</li>';
            $("#documentsItems").append(liHtml);
        });
    }
    
}
function drawWhenBarChart(rows){
    var data = rows.map(function(d) { 
        return {
            date : d3.timeParse("%Y-%m-%d")(d.date), 
            value : d.value
        }
    });

    drawMapBlocksPerDateGraph('whenBox', data, "whenBarChart", 365, 300);
    
}

function drawBubbleCard(data, cardColor, divId){
    var children = [];
    ['consistent', 'old_to_new', 'new_to_old'].forEach(node => {
        if(data[node].length){
            children.push({
                "name": node,
                "children": data[node]
            });
        }
    });

    if(!children.length) return;
    var processedData = {
        "name": "terms",
        "children": children
    }
    displayPackedBubbles("#" + divId, 330, 330, cardColor, processedData, true);   
}

function loadTermBoard(order, direction){
    var params = getParams()
    var data = {
        'topic_keys': params[0],
        'order': order,
        'direction': direction,
        'from': params[1],
        'to': params[2]
    };
    $.ajax({
        type: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        url: baseUrl + "/termboard",
        data: JSON.stringify(data),
        success: function(result){
            $(".termboardBox, #documentsItems").html("");
            if(result && result['data'] && result['data']['description']){
                $('#termBoardDescription').text(result['data']['description']);
            }
            if(result && result['data'] && result['data']['documents']){
                displayDocuments(result['data']['documents']);
            }
            if(result && result['data'] && result['data']['when']){
                drawWhenBarChart(result['data']['when']);
            }
            if(result && result['data'] && result['data']['board'] && result['data']['board']['who']){
                drawBubbleCard(result['data']['board']['who'], '#e6ffb3', 'whoBox');
            }
            if(result && result['data'] && result['data']['board'] && result['data']['board']['where']){
                drawBubbleCard(result['data']['board']['where'], '#88cc00', 'whereBox');
            }
            if(result && result['data'] && result['data']['board'] && result['data']['board']['what_topic']){
                drawBubbleCard(result['data']['board']['what_topic'], '#e6ffb3', 'whatTopicBox');
            }
            if(result && result['data'] && result['data']['board'] && result['data']['board']['what_action']){
                drawBubbleCard(result['data']['board']['what_action'], '#88cc00', 'whatActionBox');
            }
            if(result && result['data'] && result['data']['board'] && result['data']['board']['why_positive']){
                drawBubbleCard(result['data']['board']['why_positive'], '#e6ffb3', 'whyPositiveBox');
            }
            if(result && result['data'] && result['data']['board'] && result['data']['board']['why_negative']){
                drawBubbleCard(result['data']['board']['why_negative'], '#88cc00', 'whyNegativeBox');
            }
        },
        dataType: 'json',
        error: function () {
            console.log("error");
        }
    });
}

$( function() {
    loadTermBoard('score', 'desc');

    $('#orderDocument').on('change', function(){
        var selectedValue = $(this).val();
        if(selectedValue == 'date_asc'){
            loadTermBoard('date', 'asc');
        }else if(selectedValue == 'date_desc'){
            loadTermBoard('date', 'desc');
        }else{
            loadTermBoard('score', 'desc');
        }
    });
});