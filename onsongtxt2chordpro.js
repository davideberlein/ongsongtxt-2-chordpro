'use strict';

const chordRegex = /(^| )([A-H](##?|bb?)?m?(add|sus|maj|min|aug|dim)?\d?(\/[A-H](##?|bb?)?m?)?)( (?!\w)|$)/;
const metaTagRegex = /^\s*(Key|Tempo|Time):\s*(\S)+\s*$/;
const sectionTitleRegex = /^\s*(.+):\s*$/;

module.exports = function (fileName, fileContent) {
    const lines = String(fileContent).replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n/);
    console.error("converting: " + fileName + " with ", lines.length, "lines");
    const result = [];

    let foundMeta = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(metaTagRegex)) {
            result.push(line);
            foundMeta = true;
            continue;
        } else if (!foundMeta) {
            //Don't search for chords in title etc.
            result.push(line);
            continue;
        }

        if (line.match(chordRegex)) {
            const chords = line.split(" ");
            let offset = 0;
            let nextLine = lines[++i];

            if (!nextLine || nextLine.match(sectionTitleRegex)) {
                i--;
                nextLine = "";
            }
            const nextEmpty = !nextLine;


            for (let j = 0; j < chords.length; j++) {
                const chord = chords[j];
                if (chord) {
                    const insertedChord = '[' + chord + ']';
                    nextLine = nextLine.slice(0, offset) + insertedChord + nextLine.slice(offset);
                    // add offset from original line
                    offset += chord.length;
                    // add offset from insertion of next line
                    offset += insertedChord.length;
                }
                // plus one for the split space.
                offset++;
            }
            if (nextEmpty) nextLine += '\n';
            result.push(nextLine);
        } else {
            result.push(line);
        }
    }

    return result.join('\n');
};
