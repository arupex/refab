# refab
A Middleware pipeline framework
Allows you to load an array of middleware and then run as a pipeline

#Install
 
    npm install refab --save
    
#Usage with Loader

    var Loader = require('refab').Loader;

    var funcMiddleware = {
        func : function cycle(context, response, next) {
            console.log('func');
            context.func = 'happened';
            response.ok('finished');
        }
    }
                                 
    var middlewareByPath = {
       path : 'thing1'
    }

    var middlewareByRequire = {
       require : './test/thing2'
    }
    
    var sharedContext = {
        initData : 'started'
    }
    
    var responseObjects = {
         ok : function ok(data){
            console.log('ok', data);
            done()
        }
    }
    
    // timeout only happens if next or response is not called within time
    // final only gets called if
    //      a. Timeout
    //      b. next is called till no more middleware
    // continueOnTimeout (default false) if true calls next on timeout
    //
    var pipeline = Loader({
        timeout : 1000,
        continueOnTimeout : false
    }, [
            funcMiddleware,
            middlewareByPath,
            middlewareByRequire
    ]);
    
    pipeline(sharedContext,
     responseObjects,
      function final(context){
        console.log('context', context);
    });
   
#Usage w/o Loader

    var Runner = require('refab').Runner;

    var allMiddleware = [
        function cycle1(context, response, next) {
            
        },
        function cycle2(context, response, next) {
            
        },
        function cycle3(context, response, next) {
            
        }
    ]
                                 
    var sharedContext = {
        initData : 'started'
    }
    
    var responseObjects = {
         ok : function ok(data){
            console.log('ok', data);
            done()
        }
    }
    
    // timeout only happens if next or response is not called within time
    // final only gets called if
    //      a. Timeout
    //      b. next is called till no more middleware
    // continueOnTimeout (default false) if true calls next on timeout
    //
    var pipeline = Runner({
        timeout : 1000,
        continueOnTimeout : false
    }, allMiddleware)
    
    pipeline(sharedContext,
     responseObjects,
      function final(context){
        console.log('context', context);
    });
    
    
#Directory Loader

    var load = require('refab').LoadDirModules;
    // Assuming a Directory Structure like
    //
    // folder
    //     |___ module1
    //     |___ module2
    //     |___ module3
    //
    var myModules = load('folder', true)// second parameter is whether to reload on watch event
    
    console.log('', myModules);
    
    //Will output
    {
        module1 : [Function],
        module2 : [Function],
        module3 : [Function]
    }
