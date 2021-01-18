var util = require('util')
var exec = require('child_process').exec;
var path = require('path');
var fs	 = require('fs');

function fromDir(startPath,filter){

    console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filter.indexOf(filename)>=0) {
            console.log('-- found: ',filename);
			
			exec("snyk monitor --file=" + filename + " --project-name=" + process.argv[3] + "/" + filename + " --remote-repo-url=" + process.argv[2], function(error, stdout, stderr) {

			});

        };
    };
};

fs.renameSync(".git", "temp.git");
fromDir('.',['pom.xml', 'package.json']);
fs.renameSync("temp.git", ".git");