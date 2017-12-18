'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

/**
 * GULP - Create Structure Module
 *
 *  Ex.:
 *
 *  gulp structure
 *
 */

// TODO: implement handler errors
function handleError(level, error) {
    gutil.log(error.message);
    if (isFatal(level)) {
        process.exit(1);
    }
}
function onError(error) { handleError.call(this, 'error', error);}
function onWarning(error) { handleError.call(this, 'warning', error);}


gulp.task('structure', function () {

    var fs = require('fs');
    var folderStructure = fs.readFileSync('structure.project.json');
    var jsonContent = JSON.parse(folderStructure);

    return gulp.src('').pipe(
        plugins.prompt.prompt({
            type: 'input',
            name: 'module',
            message: 'Choose module name:'
        }, function(res){

            var mainModuleName = res.module.toLocaleLowerCase();

            var createMainModule = function(p, m){
                var listOfDependencies = ['ngAnimate', 'mm.acl', 'ui.router', 'pascalprecht.translate', 'LocalStorageModule', 'ui.bootstrap', 'angular-jwt'];
                var content = "(function(){\n" +
                "\n" +
                "\t'use strict';\n" +
                "\n" +
                "\tangular.module('"+mainModuleName+"', ['"+listOfDependencies.join('\',\'')+"','"+(mainModuleName ? mainModuleName+'.' : '') + m.name+"']);\n" +
                "\n" +
                "})();";
                fs.writeFile(p+'/index.module.js', content, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            };

            var createIndex = function(p, m){
                var content = "<!doctype html>\n" +
                "<html ng-app=\""+m.toLocaleLowerCase()+"\">\n" +
                "<head>\n" +
                "    <base href=\"/\">\n" +
                "    <meta charset=\"utf-8\">\n" +
                "    <meta name=\"description\" content=\"\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\n" +
                "    <title>Structure v1.0</title>\n" +
                "\n" +
                "    <!-- build:css({.tmp/serve,src}) styles/vendor.css -->\n" +
                "    <!-- bower:css -->\n" +
                "    <!-- endbower -->\n" +
                "    <!-- endbuild -->\n" +
                "\n" +
                "    <!-- build:css({.tmp/serve,src}) styles/app.css -->\n" +
                "    <!-- inject:css -->\n" +
                "    <!-- endinject -->\n" +
                "    <!-- endbuild -->\n" +
                "\n" +
                "</head>\n" +
                "\n" +
                "<!--[if lt IE 10]>\n" +
                "<p class=\"browsehappy\">You are using an <strong>outdated</strong> browser. Please <a href=\"http://browsehappy.com/\">upgrade your browser</a> to improve your experience.</p>\n" +
                "<![endif]-->\n" +
                "\n" +
                "<body>\n" +
                "\n" +
                "    <div ui-view=\"main\"></div>\n" +
                "\n" +
                "    <!-- build:js(src) scripts/vendor.js -->\n" +
                "    <!-- bower:js -->\n" +
                "    <!-- endbower -->\n" +
                "    <!-- endbuild -->\n" +
                "\n" +
                "    <!-- build:js({.tmp/serve,.tmp/partials,src}) scripts/app.js -->\n" +
                "    <!-- inject:js -->\n" +
                "    <!-- endinject -->\n" +
                "\n" +
                "    <!-- inject:partials -->\n" +
                "    <!-- endinject -->\n" +
                "    <!-- endbuild -->\n" +
                "\n" +
                "</body>\n" +
                "</html>";
                fs.writeFile(p+'/index.html', content, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            };

            var createRouter = function(p, m){
                // TODO: implemnets
            };

            var createModule = function(p, m){
                var moduleTmp = [];
                if(m.modules !== undefined && m.modules.length !== 0){
                    for(var i = 0; i < m.modules.length; i++){
                        moduleTmp.push((mainModuleName ? mainModuleName+'.' : '') + m.modules[i].name);
                    }
                }
                var checkModules = moduleTmp.length ? "['"+moduleTmp.join('\',\'')+"']" : "[]";
                var content = "(function(){\n" +
                "\n" +
                "\t'use strict';\n" +
                "\n" +
                "\tangular.module('"+(mainModuleName ? mainModuleName+'.' : '') + m.name+"', "+checkModules+");\n" +
                "\n" +
                "})();";
                fs.writeFile(p+'/'+m.name+'.module.js', content, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            };

            var createViewer = function(p, m){
                var content = "VIEW "+m.name;
                fs.writeFile(p+'/'+m.name+'.html', content, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            };

            var createController = function(p, m){
                var controllerName = (m.name[0].toUpperCase() + m.name.slice(1))+'Controller';
                var content = "(function() {\n" +
                "\n" +
                "\t'use strict';\n" +
                "\n" +
                "\tangular.module('"+(mainModuleName ? mainModuleName+'.' : '') + m.name+"').controller('"+controllerName+"', "+controllerName+");\n" +
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
                fs.writeFile(p+'/'+m.name+'.controller.js', content, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            };

            var createStructure = function(p, m){

                var dir = path.join(conf.paths.src, p);
                if(m.modules !== undefined && m.modules.length !== 0){
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                        createModule(dir, m);
                    }
                    for (var i = 0; i < m.modules.length; i++) {
                        var dirModule = dir+'/'+m.modules[i].name;
                        var folderController = dirModule + '/controllers';
                        if (!fs.existsSync(dirModule)) {
                            fs.mkdirSync(dirModule);
                            if(m.modules[i].modules === undefined) {
                                var folderView = dirModule + '/views';
                                fs.mkdirSync(folderController);
                                fs.mkdirSync(folderView);
                                createController(folderController, m.modules[i]);
                                createViewer(folderView, m.modules[i]);
                            }
                            createModule(dirModule, m.modules[i]);
                            createRouter(dirModule, m.modules[i]);
                        }
                        createStructure(dir.split("\\").slice(1).join('\\')+'/'+m.modules[i].name, m.modules[i]);
                    }
                } else {

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                        fs.mkdirSync(dir+'/controllers');
                        fs.mkdirSync(dir+'/views');
                        createController(dir+'/controllers', m);
                        createViewer(dir+'/views', m);
                        createModule(dir, m);
                    }
                }
            };

            for(var i = 0; i < jsonContent.modules.length; i++){
                var moduleActual = jsonContent.modules[i];
                createStructure(moduleActual.name, moduleActual);

                if(i === 0){
                    createIndex(conf.paths.src, res.module);
                    createMainModule(conf.paths.src, moduleActual);
                }
            }

        })
    );

});