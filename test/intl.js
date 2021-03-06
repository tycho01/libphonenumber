/* Mocha test
   to use:
     npm install mocha
     mocha <filename>
   or
     npm test
*/

var assert = require('assert');
var libphonenumber = require('../lib/index');

describe('Readme example', function () {
  it('should properly standardize a US number in various formats', function (done) {
    var formats = [
      '202-456-1414',
      '(202) 456-1414',
      '+1 (202) 456-1414',
      '202.456.1414',
      '202/4561414',
      '1 202 456 1414',
      '+12024561414',
    ];
    var count = 0;
    var results = {};
    for (var index in formats) {
      libphonenumber.intl(formats[index], 'US', function (error, result) {
        if (error) {
          return done(error);
        }
        count += 1;
        if (results[result] === undefined) {
          results[result] = 0;
        }
        results[result] += 1;
        if (count === formats.length) {
          if (results[result] === count) {
            return done();
          } else {
            var counts = [];
            for (var key in results) {
              counts.push(key + ': ' + results[key]);
            }
            return done(new Error(counts.join(', ')));
          }
        }
      });
    }
  });

  it('should standardize to readable international format', function (done) {
    libphonenumber.intl('202.456.1414', 'US', function (error, result) {
      var expected = '+1 202-456-1414';
      if (error) {
        return done(error);
      } else if(result != expected) {
        return done(new Error('Expected: ' + expected + ' Actual: ' + result));
      } else {
        return done();
      }
    });
  });

  it('should get the right region codes for 2 phone numbers', function () {
    assert(libphonenumber.phoneUtil.getRegionCodeForNumber(libphonenumber.phoneUtil.parse('+1 408 996-1010')) === 'US', 'Apple\'s phone number should be located in the US');
    assert(libphonenumber.phoneUtil.getRegionCodeForNumber(libphonenumber.phoneUtil.parse('+32 23635545')) === 'BE', 'Colruyt\'s phone number should be located in Belgium');
  });

  it('brazil', function (done) {
    var result = libphonenumber.e164('+55 11970221242');
    var expected = '+5511970221242';
    if (result != expected) {
      return done(new Error('Expected: ' + expected + ' Actual: ' + result));
    } else {
      return done();
    }
  });
});
