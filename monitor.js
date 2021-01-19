const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
var exec = require('child_process').exec;

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}


console.log('process agr', process.argv[3]);

fs.renameSync(".git", "temp.git");

getFiles(__dirname)
  .then(function(files){

	files.forEach(function (file) {

		if (file.includes('pom.xml')) {
			var fileArray = file.split('\\');
			var fileName = fileArray.slice(-1);
			var relativeFilePath = file.replace(__dirname, '');
			console.log(__dirname, fileName, file, relativeFilePath);

			exec("snyk monitor --file=" + file + " --project-name=" + process.argv[3] + "-" + relativeFilePath + " --remote-repo-url=" + process.argv[2], function(error, stdout, stderr) {

			});

        };

	});
	
	fs.renameSync("temp.git", ".git");
  })
  .catch(e => console.error(e));
  
