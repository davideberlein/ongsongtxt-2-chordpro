'use strict';

var Transform = require('readable-stream/transform');

var chordRegex = /(^| )([A-H](##?|bb?)?m?((sus|maj|min|aug|dim)\d?)?(\/[A-H](##?|bb?)?m?)?)( (?!\w)|$)/;
var metaTagRegex = /^\s*(Key|Tempo|Time):\s*(\S)+\s*$/;
var sectionTitleRegex = /^\s*(.+):\s*$/;

module.exports = function() {
    return new Transform({
        objectMode: true,
        transform: function(file, enc, callback) {
            if (file.isNull()) {
                return callback(null, file);
            }

            function doConvert() {
                if (file.isStream()) {
                    console.error("Oh no a stream dude");
                    return callback(null, file);
                }

                if (file.isBuffer()) {
                    var lines = String(file.contents).replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n/);
                    console.error("converting: "+file.relative+" with ",lines.length,"lines");
                    var result = [];

                    var foundMeta = false;
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i];
                        if (line.match(metaTagRegex)) {
                            result.push(line);
                            foundMeta = true;
                            continue;
                        } else if (!foundMeta){
                            //Don't search for chords in title etc.
                            result.push(line);
                            continue;
                        }

                        if (line.match(chordRegex)) {
                            var chords = line.split(" ");
                            var offset = 0;
                            var nextLine = lines[++i];

                            if(!nextLine || nextLine.match(sectionTitleRegex)){
                                i--;
                                nextLine = "";
                            }
                            var nextEmpty = !nextLine;


                            for (var j = 0; j < chords.length; j++) {
                                var chord = chords[j];
                                if(chord){
                                    var insertedChord = '[' + chord + ']';
                                    nextLine = nextLine.slice(0, offset) + insertedChord + nextLine.slice(offset);
                                    // add offset from original line
                                    offset += chord.length;
                                    // add offset from insertion of next line
                                    offset += insertedChord.length;
                                }
                                // plus one for the split space.
                                offset++;
                            }
                            if (nextEmpty) nextLine+='\n';
                            result.push(nextLine);
                        } else {
                            result.push(line);
                        }
                    }

                    result = result.join('\n');

                    file.contents = new Buffer(result);
                    return callback(null, file);
                }

                callback(null, file);
            }

            doConvert();
        }
    });
};
