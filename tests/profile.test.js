var should = require('should');
var moment = require('moment-timezone');

describe('Profile', function ( ) {

  var profile_empty = require('../lib/profilefunctions')();

  it('should say it does not have data before it has data', function() {
    var hasData = profile_empty.hasData();
    hasData.should.equal(false);
  });
  
 it('should return undefined if asking for keys before init', function() {
    var dia = profile_empty.getDIA(now);
    should.not.exist(dia);
  });

  it('should return undefined if asking for missing keys', function() {
    var sens = profile_empty.getSensitivity(now);
    should.not.exist(sens);
  });

  var profileData = {
    'dia': 3
    , 'carbs_hr': 30
    , 'carbratio': 7
    , 'sens': 35
    , 'target_low': 95
    , 'target_high': 120
  };

  var profile = require('../lib/profilefunctions')([profileData]);
//  console.log(profile);

  var now = Date.now();

  it('should know what the DIA is with old style profiles', function() {
    var dia = profile.getDIA(now);
    dia.should.equal(3);
  });

  it('should know what the DIA is with old style profiles, with missing date argument', function() {
    var dia = profile.getDIA();
    dia.should.equal(3);
  });

  it('should know what the carbs_hr is with old style profiles', function() {
    var carbs_hr = profile.getCarbAbsorptionRate(now);
    carbs_hr.should.equal(30);
  });

  it('should know what the carbratio is with old style profiles', function() {
    var carbRatio = profile.getCarbRatio(now);
    carbRatio.should.equal(7);
  });

  it('should know what the sensitivity is with old style profiles', function() {
    var dia = profile.getSensitivity(now);
    dia.should.equal(35);
  });

  it('should know what the low target is with old style profiles', function() {
    var dia = profile.getLowBGTarget(now);
    dia.should.equal(95);
  });

  it('should know what the high target is with old style profiles', function() {
    var dia = profile.getHighBGTarget(now);
    dia.should.equal(120);
  });

  it('should know how to reload data and still know what the low target is with old style profiles', function() {

    var profile2 = require('../lib/profilefunctions')([profileData]);
    var profileData2 = {
      'dia': 3,
      'carbs_hr': 30,
      'carbratio': 7,
      'sens': 35,
      'target_low': 50,
      'target_high': 120
    };

    profile2.loadData([profileData2]);
    var dia = profile2.getLowBGTarget(now);
    dia.should.equal(50);
  });

  var complexProfileData = 
  {
    'timezone': moment.tz().zoneName(),  //Assume these are in the localtime zone so tests pass when not on UTC time
    'sens': [
        {
            'time': '00:00',
            'value': 10
        },
        {
            'time': '02:00',
            'value': 10
        },
        {
            'time': '07:00',
            'value': 9
        }
    ],
    'dia': 3,
    'carbratio': [
        {
            'time': '00:00',
            'value': 16
        },
        {
            'time': '06:00',
            'value': 15
        },
        {
            'time': '14:00',
            'value': 16
        }
    ],
    'carbs_hr': 30,
    'startDate': '2015-06-21',
    'basal': [
        {
            'time': '00:00',
            'value': 0.175
        },
        {
            'time': '02:30',
            'value': 0.125
        },
        {
            'time': '05:00',
            'value': 0.075
        },
        {
            'time': '08:00',
            'value': 0.1
        },
        {
            'time': '14:00',
            'value': 0.125
        },
        {
            'time': '20:00',
            'value': 0.3
        },
        {
            'time': '22:00',
            'value': 0.225
        }
    ],
    'target_low': 4.5,
    'target_high': 8,
    'units': 'mmol'
};

  var complexProfile = require('../lib/profilefunctions')([complexProfileData]);

  var noon = new Date('2015-06-22 12:00:00').getTime();
  var threepm = new Date('2015-06-22 15:00:00').getTime();

  it('should return profile units when configured', function() {
    var value = complexProfile.getUnits();
    value.should.equal('mmol');
  });


  it('should know what the basal rate is at 12:00 with complex style profiles', function() {
    var value = complexProfile.getBasal(noon);
    value.should.equal(0.1);
  });

  it('should know what the basal rate is at 15:00 with complex style profiles', function() {
    var value = complexProfile.getBasal(threepm);
    value.should.equal(0.125);
  });

  it('should know what the carbratio is at 12:00 with complex style profiles', function() {
    var carbRatio = complexProfile.getCarbRatio(noon);
    carbRatio.should.equal(15);
  });

  it('should know what the sensitivity is at 12:00 with complex style profiles', function() {
    var dia = complexProfile.getSensitivity(noon);
    dia.should.equal(9);
  });


});