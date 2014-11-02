function RhymeBrainSubmit()
{
    var input = document.getElementById("rhyme");
    var word = input.value;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://rhymebrain.com/talk?function=getRhymes" +
        "&word=" + encodeURIComponent(word) +
        "&maxResults=5&jsonp=RhymeBrainResponse";
    document.body.appendChild(script);
}


function RhymeBrainResponse(data)
{
	var words = "";
	$.each(data, function(index, value) {
		words += (value.word  + " ")
	});
	$("#rhyme").val(words);
}