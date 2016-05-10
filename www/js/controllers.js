angular.module('starter.controllers', ['firebase'])
.controller('MainCtrl', function($scope,$firebaseArray,$ionicLoading,$state,Utility,$ionicHistory,ImageService,$ionicPopup,$timeout)
{

    $scope.login=true;
    $scope.signUp=false;
    $scope.option=1;
    $scope.loginData={};
    var refurl ="https://diagnosediabetes.firebaseio.com/";
    var ref = new Firebase(refurl);
    $scope.loginOption=function(value)
    {
      if (value==1)
      {
        $scope.option=1;
        $scope.login=true;
        $scope.signUp=false;
      }
      else if (value==2)
      {
        $scope.option=2;
        $scope.login=false;
        $scope.signUp=true;
      }
    }


    $scope.signIn=function()
    {
      if($scope.loginData.email==null && $scope.loginData.password==null)
      {
        Utility.showToastMessage('Enter login details');
        return;
      }
      ref.authWithPassword({
        email    : $scope.loginData.email,
        password : $scope.loginData.password+""
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          Utility.showToastMessage('Invalid Credentials');
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $state.go("menu");
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
        }
      });

    }
    $scope.changePassword=function()
    {

      debugger;
      var authData = ref.getAuth();
      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      }
      else{
        $state.go("app");
      }
      if($scope.user.password==null && $scope.user.password_confirmation==null)
      {
        Utility.showToastMessage('Enter login details');
        return;
      }
      ref.changePassword({
        email       : authData.password.email,
        oldPassword : $scope.user.password_confirmation+"",
        newPassword : $scope.user.password+"",
      }, function(error) {
        if (error === null) {
          console.log("Password changed successfully");
          $ionicPopup.alert({
              title: "successfully",
              template: "Password changed successfully",
          });
          $state.go("app");
        } else {
          console.log("Error changing password:", error);
          switch (error.code) {
            case "INVALID_PASSWORD":
              console.log("The specified user account password is incorrect.");
              $ionicPopup.alert({
                  title: "Error",
                  template: "The specified user account password is incorrect.",
              });
              break;
            default:
              console.log("Error removing user:", error);
            }
        }
      });

    }
    $scope.openCamera=function(){
      //imageNo=choice;
      ImageService.camera(false);
    }
    $scope.user={};
    $scope.user.UserImage="img/UserImage.png";

    $scope.$on('image:captured', function(e, imageData){
      $timeout(function(){
         $scope.user.UserImage = imageData;
       },10);
    });

          var validateuser = function() {

              if (!$scope.user.name) {
                  $ionicPopup.alert({
                      title: "Warning",
                      template: "Please enter User Name",

                  });
                  return false;
              }
              if (!$scope.user.password) {
                  $ionicPopup.alert({
                      title: "Warning",
                      template: "Please enter password",
                  });
                  return false;
              }
              if (!$scope.user.icard) {
                  $ionicPopup.alert({
                      title: "Warning",
                      template: "Please enter Card Number",

                  });
                  return false;
              }
              if (!$scope.user.dob) {
                  $ionicPopup.alert({
                      title: "Warning",
                      template: "Please enter Date of Birth",

                  });
                  return false;
              }
              if (!$scope.user.phone) {
                  $ionicPopup.alert({
                      title: "Warning",
                      template: "Please enter Phone Number",

                  });
                  return false;
              }
              if (!$scope.user.mobile) {
                  $ionicPopup.alert({
                      title: "Warning",
                      template: "Please enter Mobile Number",

                  });
                  return false;
              }
              if (!$scope.user.email) {
                  $ionicPopup.alert({
                      title: "Warning",
                      template: "Please enter email",

                  });
                  return false;
              }

              return true;
          }
          $scope.user.fax = "";
    $scope.register = function(){
      debugger;
      var isvalid = validateuser();
      if (isvalid == false)
          return;
      ref.createUser({
        email    : $scope.user.email,
        password : $scope.user.password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
          $ionicPopup.alert({
              title: "Error",
              template: error
          });
        } else {
          console.log("Successfully created user account with uid:", userData.uid);

          var usersRef = new Firebase(refurl+"users/");
          var uidRef = new Firebase(refurl+"users/"+userData.uid+"/");

          uidRef.set({
              userid:userData.uid,
              username: $scope.user.name,
              email: $scope.user.email,
              card:$scope.user.icard,
              birthday: $scope.user.dob,
              gender: $scope.user.gender,
              phone:$scope.user.phone,
              mobile:$scope.user.mobile,
              fax:$scope.user.fax,
              image: $scope.user.UserImage,
              appartment:"",
              street:"",
              city:"",
              country:"",
              type:1,
          });
          $ionicPopup.alert({
              title: "Successfully",
              template: "Register user success"
          });
        }
      });
    }
})
.controller('menuCtrl', function($scope,$state,$ionicHistory)
{
  var refRoot = new Firebase("https://diagnosediabetes.firebaseio.com/");
  var authData = refRoot.getAuth();
  if (authData) {
    console.log("Authenticated user with uid:", authData.uid);
  }
  else{
    $state.go("app");
  }
  $scope.diagnose=function()
  {
    $state.go('diagnoseme');
  }
  $scope.myProfile=function()
  {
    $state.go('profile');
  }
  $scope.doctoReply=function()
  {
    $state.go('doctoReply');
  }
  $scope.myRecord=function()
  {
    $state.go('myRecord');
  }
  $scope.logout=function()
  {
    var ref = new Firebase("https://diagnosediabetes.firebaseio.com/patientresult");
    ref.unauth();
    $state.go('app');
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
  }
})

.controller('diagnosemeCtrl', function($scope,$state,$firebaseArray,Utility) {
        var refurl ="https://diagnosediabetes.firebaseio.com/";
        var ref = new Firebase(refurl);
        var authData = ref.getAuth();
        if (authData) {
          console.log("Authenticated user with uid:", authData.uid);
        }
        else{
          $state.go("app");
        }

        var database = new Firebase(refurl + "patientresult");
        $scope.patientparameter = $firebaseArray(database);

        $scope.submit = function (parameter1) {

            var res = {
                userid: authData.uid,
                parameter1: parameter1,
                createdate:  Firebase.ServerValue.TIMESTAMP,
                approved: false
            };
            $scope.patientparameter.$add(res);
            $scope.report = true;

        };
    })

    .controller('presultCtrl', function($scope,$state,$firebaseArray,Utility)
{
    var database=new Firebase("https://diagnosediabetes.firebaseio.com/presult");
    $scope.patientparameter=$firebaseArray(database);


    $scope.submit = function (parameter1,parameter2,parameter3,parameter4,parameter5) {
        var res = {
            parameter1: ContactCtrl,
            parameter2: parameter2,
            parameter3: parameter3,
            parameter4: parameter4,
            parameter5: parameter5


    };
        $scope.patientparameter.$add(res);
        $scope.report=true;

    };
     $scope.send=function(){
      Utility.showToastMessage('SUCCESSFULL....');
      $state.go('menu');
     };
})

.controller('myProfileCtrl', function($scope,$state)
  {
    $scope.changePassword=function(){
      $state.go('change');
    }
 })
.controller('doctoReplyCtrl', function($scope,$state)
  {
    var refurl ="https://diagnosediabetes.firebaseio.com/";
    var ref = new Firebase(refurl);
    var authData = ref.getAuth();
    if (authData) {
      console.log("Authenticated user with uid:", authData.uid);
    }
    else{
      $state.go("app");
    }

    ref.child('patientresult')
    .orderByChild('userid')
    .equalTo(authData.uid)
    .once('value', function(patientSnap) {
       $scope.patients = patientSnap.val();
       console.log($scope.patients);
    });
    $scope.submiting=function(){
      $state.go('doctoReport');
    }
  })

.controller('HospitalCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{
  $scope.logout=function()
  {
    $state.go("app");
    $ionicHistory.nextViewOptions({
        disableBack: true
      });
  };
  $scope.approval=function()
  {
    $state.go("approval");
  };
  $scope.patients=function()
  {
    $state.go("patients");
  };
  $scope.profile=function()
  {
    $state.go("profile");
  };
    $scope.presult=function()
    {
        $state.go("presult");
    };
})

.controller('ProfileCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{

  $scope.changePassword=function()
  {
    $state.go("changePassword");

  };
  $scope.cancelAccount=function()
  {
    $state.go("cancelAccount");

  };
  $scope.contactInfo=function()
  {
    $state.go("contactInfo");

  };
  $scope.location=function()
  {
    $state.go("location");

  };
})

.controller('ApprovalCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{
  $scope.filter = {};
  $scope.filter.patientName = "";

  $scope.$on('$ionicView.beforeEnter', function()
  {
    $scope.patients = MainService.getPatients();
  });
  $scope.details=function(name)
  {
    $state.go('details',{'name':name});

  };

})

.controller('DetailsCtrl', function($scope,$firebaseArray,$stateParams,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{


    $scope.patientName = $stateParams.name;
    $scope.$on('$ionicView.beforeEnter', function()
    {

          //$scope.results = MainService.getResults();
        var database=new Firebase("https://diagnosediabetes.firebaseio.com/patientresult");
        $scope.patientparameter=$firebaseArray(database);

    });
    $scope.record=function()
      {
         $state.go('record',{'name':$scope.patientName});
        };


})

.controller('RecordCtrl', function($scope,$firebaseArray,$stateParams,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{
  //$scope.patientName;
  $scope.patientName = $stateParams.name;
  $scope.$on('$ionicView.beforeEnter', function()
  {

   // $scope.results = MainService.getResults();
      var database=new Firebase("https://diagnosediabetes.firebaseio.com/presult");
      $scope.pparameter=$firebaseArray(database);
  });
})

.controller('EditCtrl', function($scope,$stateParams,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{
  $scope.values=[{text:'Excelent',value:1},{text:'Good',value:1},{text:'Fair',value:1},{text:'Bad',value:1},{text:'Critical',value:1}];

})

.controller('PatientsCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{
  $scope.filter = {};
  $scope.filter.patientName = "";

  $scope.$on('$ionicView.beforeEnter', function()
  {
    $scope.patients = MainService.getPatients();
  });
})

.controller('PasswordCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{

})

.controller('CancelAccountCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{

})

.controller('ContactCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService,$firebaseObject)
{
  debugger;
  var refurl ="https://diagnosediabetes.firebaseio.com/";
  var ref = new Firebase(refurl);
  var authData = ref.getAuth();
  if (authData) {
    console.log("Authenticated user with uid:", authData.uid);
  }
  else{
    $state.go("app");
  }

  var refuid = new Firebase(refurl+"/users/"+authData.uid);
  var obj = $firebaseObject(refuid);
  $scope.user = obj;
  $scope.change=function(){
    debugger;
    obj.phone = $scope.user.phone;
    obj.mobile = $scope.user.mobile;
    obj.fax =  $scope.user.fax;
    obj.$save().then(function(refuid) {
      refuid.key() === obj.$id; // true
    }, function(error) {
      console.log("Error:", error);
    });
  };

})

.controller('LocationCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService,$firebaseObject)
{
  var refurl ="https://diagnosediabetes.firebaseio.com/";
  var ref = new Firebase(refurl);
  var authData = ref.getAuth();
  if (authData) {
    console.log("Authenticated user with uid:", authData.uid);
  }
  else{
    $state.go("app");
  }

  var refuid = new Firebase(refurl+"/users/"+authData.uid);
  var obj = $firebaseObject(refuid);
  $scope.user = obj;
  $scope.change=function(){
    debugger;
    obj.appartment = $scope.user.appartment;
    obj.street = $scope.user.street;
    obj.city =  $scope.user.city;
    obj.country =  $scope.user.country;
    obj.$save().then(function(refuid) {
      refuid.key() === obj.$id; // true
    }, function(error) {
      console.log("Error:", error);
    });
  };
})

.controller('myRecordCtrl', function($scope,$state,$firebaseObject)
  {
    var refurl ="https://diagnosediabetes.firebaseio.com/";
    var ref = new Firebase(refurl);
    var authData = ref.getAuth();
    if (authData) {
      console.log("Authenticated user with uid:", authData.uid);
    }
    else{
      $state.go("app");
    }

    ref.child('patientresult')
    .orderByChild('userid')
    .equalTo(authData.uid)
    .once('value', function(patientSnap) {
       /*ref.child('users/'+authData.uid).once('value', function(userSnap) {
           // extend function: https://gist.github.com/katowulf/6598238
           $scope.data = extend({}, patientSnap.val(), userSnap.val());
           console.log($scope.data);
       });*/
       $scope.patients = patientSnap.val();
       console.log($scope.patients);
       /*patientSnap.forEach(function(childSnapshot) {
   // key will be "fred" the first time and "barney" the second time
   var key = childSnapshot.key();
   console.log(key);
   // childData will be the actual contents of the child
   var childData = childSnapshot.val();
   console.log(childData);
 });*/
    });
    var refuid = new Firebase(refurl+"/users/"+authData.uid);
    var obj = $firebaseObject(refuid);
    $scope.user = obj;
    /*new Firebase(refurl+"users")
    .orderByChild('username')
    .equalTo('ngoctruy87')
    .once('value', show);*/

function show(snap) {
   console.log(JSON.stringify(snap.val(), null, 2));
}

    function extend(base) {
        var parts = Array.prototype.slice.call(arguments, 1);
        parts.forEach(function (p) {
            if (p && typeof (p) === 'object') {
                for (var k in p) {
                    if (p.hasOwnProperty(k)) {
                        base[k] = p[k];
                    }
                }
            }
        });
        return base;
    }
 })
.controller('doctoReportCtrl', function($scope,$state)
  {

 })
.controller('changeCtrl', function($scope,$state)
  {

 });
