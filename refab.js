/**
 * Created by daniel.irwin on 1/28/17.
 */
module.exports = (function LoaderSelf(){

    function LoadMiddleware(opts){

        var cycle;

        if(opts && typeof opts === 'object') {
            if (typeof opts.require === 'string') {
                cycle = require(opts.require);
            }
            else if (typeof opts.path === 'string') {
                cycle = require(process.cwd() + '/' + opts.path);
            }
            else if (typeof opts.func === 'function') {
                cycle = opts.func;
            }
            else {
                console.warn('Ignoring', opts, 'plugin not found');
            }
        }
        return cycle;
    }

    function Loader(opts, cycles){
        //looks like opts wasnt actually included and first param was cycle
        if(opts && typeof opts === 'object' && Array.isArray(opts)){
            cycles = opts;
            opts = {};
        }

        var outCycles = [];

        if(cycles && Array.isArray(cycles)){
            outCycles = cycles.map(LoadMiddleware);
        }
        return new Runner(opts, outCycles);
    }

    function Runner(opts, tasks){

        return function go(context, responses, final) {
            var timeout = null;

            var clearResponses = {};
            Object.keys(responses).forEach(function fE(key){
                clearResponses[key] =  function cR(){
                    if(timeout){
                        clearTimeout(timeout);
                    }
                    responses[key].apply(this, arguments);
                };
            });

            function nextPlugin() {

                if(timeout){
                    clearTimeout(timeout);
                }

                var task = tasks.shift();
                if (!task) {
                    final(context);
                }
                else if (task && typeof task === 'function') {
                    if(opts.timeout){
                        timeout = setTimeout(function timedOut(){
                            if(opts.continueOnTimeout) {
                                nextPlugin();
                            }
                            else {
                                final(context);
                            }
                        }, opts.timeout);
                    }
                    task(context, clearResponses, nextPlugin);
                }
            }

            nextPlugin();
        };

    }
    
    function LoadDirModules(dir, watch) {
        var fs = require('fs');

        var modules = {};

        if(watch){
            fs.watch(dir, function(event, filename){
                var file = filename.split('.')[0];
                if(modules[file]){
                    require.cache = {};//just nuke it all!
                    modules[file] = require(dir + '/' + file);
                }

            });
        }

        fs.readdirSync(dir).forEach(function(name){
            modules[name.split('.')[0]] = require(dir + '/' + name);
        });

        return modules;
    }

    return {
        Loader : Loader,
        LoadMiddleware : LoadMiddleware,
        Runner : Runner,
        LoadDirModules : LoadDirModules
    };

})();
