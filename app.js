console.log('SUCKAFREE> INIT DRAGONS.!');

var express = require('express'),
    pivotal = require('pivotal'),
    app = express(),
    Hypher = require('hypher'),
    english = require('hyphenation.en-us'),
    h = new Hypher(english);

pivotal.useToken("2f475d5c3d22ac1f23cd425915912c70");
app.use(express.bodyParser());

app.get('/h/:text', function(req, res){
  res.send( h.hyphenateText(req.params.text) );
});

app.post('/bump', function(req, res) {
  pivotal.addStory('755635', {
      name: req.body.name,
      story_type: 'feature'
    }, function (err, ret) {
      if (err) {
        console.log(err);
        res.send(500);
      } else {
        res.send(200);
      }
    });
});

  app.use(express.static(__dirname + '/public'));

  app.listen(5000);
  console.log("SUCKAFREE listening..");
