/**
 * Created by daniel.irwin on 1/28/17.
 */

describe('Test Responses', function(){

    var R = require('../refab').LoadDirModules(__dirname + '/responses');

    it('Test', function(){

        console.log('R', R);

        R.ok();

        R.forbidden();

        R.notfound();
    });

});