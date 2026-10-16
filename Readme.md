## Unzip
A small script that watches your Downloads folder and automatically extracts only newly downloaded .zip files.

It will ignore any .zip files that are already present when you run it. So if you have 4 old zips sitting there, it won't touch them at all.

## How to Run
- Make sure you have Node.js installed
- Open a terminal and navigate to the folder where you cloned this repo
- Run `npm install` to install the dependencies
- Run `node index.js` to start the script

## How to Use
- Start the script using node index.js
- Go to your browser and download any new .zip file
- As soon as the download finishes, it'll automatically extract it to a new folder with the exact same name as the zip file
- No need to do anything manually

##  Run in Background

### Windows (Command Prompt / PowerShell)

```bash
start /b node auto-extract.js
```

### Linux / macOS
```bash
nohup node auto-extract.js > extractor.log 2>&1 &
```

This will keep it running in the background. A small extractor.log file will be created if anything goes wrong.

