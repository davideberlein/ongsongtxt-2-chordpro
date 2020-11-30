# OnSong text 2 chord pro converter
Simple node cli tool that allows to to convert song sheets in [OnSong](https://onsongapp.com/) chord over lyrics text format to ChordPro so they can be used by apps like [MobileSheets](https://www.zubersoft.com/mobilesheets/).
This allows sharing one set of sheets between iOS (OnSong) and Android/Windows (MobileSheets) devices.

This tool assumes the OnSong chords are expressed in the _chords over lyrics_ notation see https://onsongapp.com/docs/features/formats/onsong/chords/

The standard OnSong tags that can be found in their official example are supported: http://onsongapp.s3.amazonaws.com/manual/example.txt _Note that the example uses 'brackeded chords' notation which isn't supported by this tool_

The converted format complies to the ChordPro standard: https://www.chordpro.org/chordpro/chordpro-file-format-specification/

# Installation & Running

## Installation
Onsongtxt 2 chordpro can be installed as a global npm module so it can be used from every folder.
```
npm install ongsongtxt-2-chordpro -g
```

## Usage
Calling the command:
```
onsongtxt2chordpro -i <input folder> -o <output folder>
```
will convert every `*.txt` file found in the _input folder_ from its OnSong text format to the chordpro format and will save the converted file to the _output folder_.
The file names will be kept but the extention will be changed to `*.chordpro` so you can use the same folder as source and destination.
## Options
```
  -i, --input    Input directory to look for *.txt files [default: "./src"]
  -o, --output   Output directory to to save the *.chordpro files to [default: "./build"]
```
 