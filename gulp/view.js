'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();

/**
 * GULP - Create View Module
 *
 *  Ex.:
 *
 *  gulp view
 *
 */


gulp.task('view', function () {

    var fs = require('fs');
    var folderStructure = fs.readFileSync('structure.project.json');
    var jsonContent = JSON.parse(folderStructure);

    return gulp.src('').pipe(
        plugins.prompt.prompt([{
                type: 'input',
                name: 'main',
                message: 'Choose main module name:'
            },{
                type: 'input',
                name: 'module',
                message: 'Choose module name:'
            },{
                type: 'input',
                name: 'view',
                message: 'Choose view name:'
        }], function(res){

            var moduleName = res.module.toLocaleLowerCase();
            var viewName = res.view.toLocaleLowerCase();
            var mainModuleName = res.main.toLocaleLowerCase();

            var createController = function(p, m, v){
                var controllerName = (v[0].toUpperCase() + v.slice(1))+'Controller';
                var content = "(function() {\n" +
                "\n" +
                "\t'use strict';\n" +
                "\n" +
                "\tangular.module('"+(mainModuleName ? mainModuleName+'.' : '') + m +"').controller('"+controllerName+"', "+controllerName+");\n" +
                "\n" +
                "\t/** @ngInject */\n" +
                "\tfunction "+controllerName+"() {\n" +
                "\n" +
                "\t\tvar vm = this;\n" +
                "\n" +
                "\t\t// Data\n" +
                "\n" +
                "\t\t// Actions\n" +
                "\n" +
                "\t}\n" +
                "\n" +
                "})();";
                fs.writeFile(p+'/'+v+'.controller.js', content, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            };

            var createViewer = function(p, v){
                var content = "VIEW "+v;
                fs.writeFile(p+'/'+v+'.html', content, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            };

            var checkModule = function(p){
                fs.readFile('structure.project.json', function(err, data) {
                    if (err) throw err;
                    var structure = JSON.parse(data);
                    for(var i = 0; i < structure.modules.length; i++){
                        var folderController = p+'/controllers';
                        var folderView = p+'/views';
                        if(moduleName === structure.modules[i].name && structure.modules[i].views === undefined){
                            structure.modules[i].views = [];
                            structure.modules[i].views.push({name: viewName});
                        }
                    }

                    var file = JSON.stringify(structure, null, 2);
                    fs.writeFileSync('structure.project.json', file);

                    createViewer(folderView, viewName);
                    createController(folderController, moduleName, viewName);
                });
            };

            var createStructure = function(p, m){
                var dir = path.join(conf.paths.src, p);
                if(m.modules !== undefined && m.modules.length !== 0){
                    if(moduleName === m.name){
                        checkModule(dir);
                        return true;
                    }
                    for (var i = 0; i < m.modules.length; i++) {
                        createStructure(dir.split("\\").slice(1).join('\\')+'/'+m.modules[i].name, m.modules[i]);
                    }

                } else {
                    if(moduleName === m.name){
                        checkModule(dir);
                        return true;
                    }
                }

            };

            for(var i = 0; i < jsonContent.modules.length; i++){
                var moduleActual = jsonContent.modules[i];
                createStructure(moduleActual.name, moduleActual);
            }

        })
    );

});