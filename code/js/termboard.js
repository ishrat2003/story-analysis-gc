var dateFormat = 'yyyy-mm-dd';
var baseUrl = "http://127.0.0.1:3500";

function getTopics(){
    var queryString = window.location.search;
    queryString = decodeURIComponent(queryString.substring(1, queryString.length));
    var params = queryString.split("&");
    var topicKeys = [];
    if(params.length){
        params.forEach(item => {
            topicKeys.push(item.replace(/topic_keys\[\]=/, ''));
        });
    }
    return topicKeys;
}

function loadTermBoard(){
    $(".termboardCard").html("");
    var data = {
        'topic_keys': getTopics()
    };
    $.ajax({
        type: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        url: baseUrl + "/storyboard",
        data: JSON.stringify(data),
        success: function(result){
            console.log(result);
            // if(result && result['data'] && result['data']['dates']){
            //     updateRcDataTexts(result['data']);
            // }
            // if(result && result['data'] && result['data']['linegraph']){
            //     drawSingleTopicBarChart(result['data']['linegraph']);
            // }
            // if(result && result['data'] && result['data']['sub_topics']){
            //     loadTags(result['data']['sub_topics'], result['data']['total_in_range'], result['data']['main_topic']);
            // }     
        },
        dataType: 'json',
        error: function () {
            console.log("error");
        }
    });
}

$( function() {
    loadTermBoard();
});