// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

    .state('app', {
    url: '/app',
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  })

  .state('hospital', {
      url: '/hospital',
          templateUrl: 'templates/hospital.html',
          controller: 'HospitalCtrl'
    })

  .state('approval', {
      url: '/hospital',
          templateUrl: 'templates/approval.html',
          controller: 'ApprovalCtrl'
    })

  .state('patients', {
      url: '/hospital',
          templateUrl: 'templates/patients.html',
          controller: 'PatientsCtrl'
    })

  .state('profile', {
      url: '/hospital',
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
    })

  .state('details', {
      url: '/details/:name',
          templateUrl: 'templates/details.html',
          controller: 'DetailsCtrl'
    })

  .state('record', {
      url: '/Record/:name',
          templateUrl: 'templates/record.html',
          controller: 'RecordCtrl'
    })

  .state('edit', {
      url: '/Edit',
          templateUrl: 'templates/edit.html',
          controller: 'EditCtrl'
    })

  .state('changePassword', {
      url: '/changepassword',
          templateUrl: 'templates/changePassword.html',
          controller: 'MainCtrl'
    })
  .state('cancelAccount', {
      url: '/hospital',
          templateUrl: 'templates/cancelAccount.html',
          controller: 'CancelAccountCtrl'
    })
  .state('contactInfo', {
      url: '/hospital',
          templateUrl: 'templates/contactInfo.html',
          controller: 'ContactCtrl'
    })
  .state('location', {
      url: '/hospital',
          templateUrl: 'templates/location.html',
          controller: 'LocationCtrl'
    })

  .state('menu', {
      url: '/menu',
      templateUrl: 'templates/browse.html',
      controller: 'menuCtrl'
    })
    .state('diagnoseme', {
      url: '/diagnoseme',
      templateUrl: 'templates/diagnose.html',
      controller: 'diagnosemeCtrl'
    })
  .state('presult', {
      url: '/presult',
      templateUrl: 'templates/presult.html',
      controller: 'presultCtrl'
  })
  .state('myRecord', {
      url: '/myRecord',
      templateUrl: 'templates/myRecord.html',
      controller: 'myRecordCtrl'
    })
  .state('myProfile', {
      url: '/myProfile',
      templateUrl: 'templates/myProfile.html',
      controller: 'myProfileCtrl'
    })
  .state('doctoReply', {
      url: '/doctoReply',
      templateUrl: 'templates/doctoReply.html',
      controller: 'doctoReplyCtrl'
    })
  .state('doctoReport', {
      url: '/doctoReport',
      templateUrl: 'templates/doctoReport.html',
      controller: 'doctoReportCtrl'
    });
  // .state('diagnose', {
  //     url: '/diagnose',
  //     templateUrl: 'templates/diagnoseme.html',
  //     controller: 'diagnoseCtrl'
  //   });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');

});
