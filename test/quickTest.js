/**
 * Created by daniel.irwin on 1/28/17.
 */


describe('Tests', function(){

    var Refab = require('../refab').Loader;


    it('test1', function(done){


        Refab({
            timeout : 1000
        }, [
            {
                func : function cycle(context, response) {
                    console.log('func');
                    context.func = 'happened';
                    response.ok('finished');
                }
            },
            {
                path : 'thing1'
            },
            {
                require : './test/thing2'
            }
        ])({
            initData : 'started'
        }, {
            ok : function ok(data){
                console.log('ok', data);
                done()
            }
        }, function final(context){
            console.log('context', context);
        });
    });

    it('test2', function(done){

        Refab({
            timeout : 1000
        }, [
            {
                func : function cycle(context) {
                    console.log('func');
                    context.func = 'happened';
                }
            },
            {
                path : 'thing1'
            },
            {
                require : './test/thing2'
            }
        ])({
            initData : 'started'
        }, {
            ok : function ok(data){
                console.log('ok', data);
            }
        }, function final(context){
            console.log('context', context);
            done()
        });


    });

});
