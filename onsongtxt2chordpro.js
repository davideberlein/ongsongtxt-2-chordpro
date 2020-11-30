'use strict';
const glob = require('glob');
const fs = require('fs');
const path = require('path');


const CHORD_REGEX = /(^| )([A-H](##?|bb?)?m?(add|sus|maj|min|aug|dim)?\d?(\/[A-H](##?|bb?)?m?)?)( (?!\w)|$)/;
const META_TAG_REGEX = /^\s*(Key|Tempo|Time):\s*(\S)+\s*$/;
const SECTION_TITLE_REGEX = /^\s*(.+):\s*$/;

function onsongTxt2Chordpro(fileName, fileContent) {
    const lines = String(fileContent).replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n/);
    console.error("converting: " + fileName + " with ", lines.length, "lines");
    const result = [];

    let foundMeta = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(META_TAG_REGEX)) {
            result.push(line);
            foundMeta = true;
            continue;
        } else if (!foundMeta) {
            //Don't search for chords in title etc.
            result.push(line);
            continue;
        }

        if (line.match(CHORD_REGEX)) {
            const chords = line.split(" ");
            let offset = 0;
            let nextLine = lines[++i];

            if (!nextLine || nextLine.match(SECTION_TITLE_REGEX)) {
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
}

function replaceFileContent(file, searchValue, replacment) {
    file.contents = String(file.contents).replace(searchValue, replacment);
    return file;
}

function readFile(absoluteFilePath) {
    return ({ name: path.basename(absoluteFilePath), contents: fs.readFileSync(absoluteFilePath, { encoding: "utf8" }) });
}

function writeFile(outputDir, file) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(`${outputDir}/${file.name}`, file.contents, { encoding: "utf8" });
}

module.exports = function (inputDir, outputDir) {
    console.log(`Converting all *.txt files in ${inputDir} to *.chordpro and saving them in ${outputDir}`);

    const files = glob.sync(`${inputDir}/**/*.txt`);
    if(!files.length){
        console.warn("No files found, nothing to do!");
        return;
    }

    console.log(`Found ${files.length} files, starting conversion...\n`);

    files
        .map(absoluteFilePath => readFile(absoluteFilePath))
        .map(file => ({ name: file.name, contents: onsongTxt2Chordpro(file.name, file.contents) }))
        .map(file => replaceFileContent(file, /^(.*)\n/g, '{title:$1}\n'))
        .map(file => replaceFileContent(file, /}\n(.*)\n/g, '}\n{copyright:$1}\n'))
        .map(file => replaceFileContent(file, /^Key:(.*?)$/mg, '{key:$1}'))
        .map(file => replaceFileContent(file, /^Tempo:(.*)$/mg, '{tempo:$1}'))
        .map(file => replaceFileContent(file, /^Time:(.*)$/mg, '{time:$1}'))
        .map(file => replaceFileContent(file, /(\{key:(.*?)}\n\{tempo:(.*?)}\n\{time:(.*?)})/g, '{subtitle:key: $2 | tempo: $3 | time: $4}\n$1'))
        .map(file => replaceFileContent(file, /(.+:)\n/g, '{comment_italic:$1}\n'))
        .map(file => ({ name: file.name.replace('\.txt', '.chordpro'), contents: file.contents }))
        .forEach(file => writeFile(outputDir, file));
}

