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
          var refuser = new Firebase(refurl+"/users/"+authData.uid)
          .once('value', function(snap) {
             if(snap.val().type==1)
             {
                $state.go("menu");
             }
             else{
               $state.go("hospital");
             }
          });

          $ionicHistory.nextViewOptions({
            disableBack: true
          });
        }
      });

    }
    $scope.changePassword=function()
    {

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
              title: "Alert",
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
          /*$ionicPopup.alert({
              title: "Successfully",
              template: "Register user success"
          });*/
          ref.authWithPassword({
            email    : $scope.user.email,
            password : $scope.user.password
          }, function(error, authData) {
              $state.go("menu");
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
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

.controller('diagnosemeCtrl', function($scope,$state,$firebaseArray,Utility,$ionicPopup) {
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
                approved: 0,
                message:'',
                result:''
            };
            $scope.patientparameter.$add(res);
            $scope.report = true;
            $ionicPopup.alert({
              title:'Alert',
              template:'Your question sent success'
            });
            $state.go('myRecord');

        };
    })

    .controller('presultCtrl', function($scope,$state,$firebaseArray,Utility,$stateParams)
{
  $scope.parameter = {};
  $scope.parameter.parameter1="";
  $scope.parameter.parameter2="";
  $scope.parameter.parameter3="";
  $scope.parameter.parameter4="";   
  $scope.parameter.parameter5="";
  var refurl ="https://diagnosediabetes.firebaseio.com/";
  var ref = new Firebase(refurl);
  var authData = ref.getAuth();
  if (authData) {
    console.log("Authenticated user with uid:", authData.uid);
  }
  else{
    $state.go("app");
  }


      $scope.userid = $stateParams.id;
    var database=new Firebase("https://diagnosediabetes.firebaseio.com/patientrecord");
    $scope.patientparameter=$firebaseArray(database);


    $scope.submit = function () {

        var res = {
            parameter1: $scope.parameter.parameter1,
            parameter2: $scope.parameter.parameter2,
            parameter3: $scope.parameter.parameter3,
            parameter4: $scope.parameter.parameter4,
            parameter5: $scope.parameter.parameter5,
            patientid: $scope.userid,
            doctorid: authData.uid



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
    //$scope.submiting=function(){
      //$state.go('doctoReport');
    //}
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
  $scope.patients =[];
  /*$scope.$on('$ionicView.beforeEnter', function()
  {
    $scope.patients = MainService.getPatients();
  });*/
  var refurl ="https://diagnosediabetes.firebaseio.com/";
  var ref = new Firebase(refurl);

  ref.child('patientresult')
  .orderByChild('approved')
  .equalTo(0)
  .once('value', function(patientSnap) {
     //$scope.patients = patientSnap.val();
     patientSnap.forEach(function(childSnapshot) {
       var key = childSnapshot.key();
       var childData = childSnapshot.val();
       var refuser = new Firebase(refurl+"/users/"+childData.userid);
       refuser.once('value',function(userSnap)
       {
          var userData = userSnap.val();
          var obj = {image: userData.image,name: userData.username,userid:userData.userid};
          var addToArray=true;
          for(var i=0;i<$scope.patients.length;i++){
              if($scope.patients[i].name===obj.name){
                  addToArray=false;
              }
          }
          if(addToArray){
              $scope.patients.push(obj);
          }
       });
     });
  });
  $scope.details=function(uid)
  {
    $state.go('details',{'id':uid});
  };

})

.controller('DetailsCtrl', function($scope,$firebaseObject,$stateParams,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{


    $scope.userid = $stateParams.id;
    $scope.$on('$ionicView.beforeEnter', function()
    {
        var refurl ="https://diagnosediabetes.firebaseio.com/";
        var ref = new Firebase(refurl);
        ref.child('patientresult')
        .orderByChild('userid')
        .equalTo($scope.userid)
        .once('value', function(patientSnap) {
           $scope.patients = patientSnap.val();
           console.log($scope.patients);
        });
        var refuid = new Firebase(refurl+"/users/"+$scope.userid);
        $scope.user = $firebaseObject(refuid);
    });
    $scope.record=function()
        {
           $state.go('presult',{'id':$scope.userid});
          };

})

.controller('RecordCtrl', function($scope,$firebaseObject,$stateParams,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{
  //$scope.patientName;
  $scope.id = $stateParams.id;
  $scope.$on('$ionicView.beforeEnter', function()
  {
    var refurl ="https://diagnosediabetes.firebaseio.com/";
    var refpatient = new Firebase(refurl+"/patientresult/"+$scope.id);
    var obj = $firebaseObject(refpatient);
    $scope.patient = obj;
    refpatient.once("value", function(snapshot) {
    $scope.patientid = snapshot.name();
    $scope.uid=snapshot.val().userid;
    //console.log($scope.patient)
    var refuser = new Firebase(refurl+"/users/"+$scope.uid)
    $scope.user = $firebaseObject(refuser);
  });
    $scope.approved=function()
    {
        obj.approved = 1;
        obj.$save().then(function(refpatient) {
          refpatient.key() === obj.$id; // true
          $ionicPopup.alert({
              title: "Alert",
              template: "Approved successfully",
          });
          $state.go('details',{'id':$scope.uid});
        }, function(error) {
          console.log("Error:", error);
        });
    }
  });

})

.controller('EditCtrl', function($scope,$stateParams,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService,$firebaseObject,$ionicPopup)
{
  //$scope.values=[{text:'Excelent',value:'Excelent'},{text:'Good',value:'Good'},{text:'Fair',value:'Fair'},{text:'Bad',value:'Bad'},{text:'Critical',value:'Critical'}];
  $scope.id = $stateParams.id;
  $scope.user = {};
  var refurl ="https://diagnosediabetes.firebaseio.com/";
  var refpatient = new Firebase(refurl+"/patientresult/"+$scope.id);
  var obj = $firebaseObject(refpatient);
  refpatient.once("value", function(snapshot) {
  $scope.patientid = snapshot.name();
  $scope.uid=snapshot.val().userid;
});
  $scope.send=function()
  {
      obj.approved = 2;
      obj.message = $scope.user.message;
      if($scope.user.choice=="1")
      {
        obj.result = "Excelent";
      }
      else if($scope.user.choice=="2")
      {
        obj.result = "Good";
      }
      else if($scope.user.choice=="3")
      {
        obj.result = "Fair";
      }
      else if($scope.user.choice=="4")
      {
        obj.result = "Bad";
      }
      else
      {
        obj.result = "Critical";
      }

      obj.$save().then(function(refpatient) {
        refpatient.key() === obj.$id; // true
        $ionicPopup.alert({
            title: "Alert",
            template: "Send message successfully",
        });
        $state.go('details',{'id':$scope.uid});
      }, function(error) {
        console.log("Error:", error);
      });
  }
})

.controller('PatientsCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService)
{
  debugger;
  $scope.filter = {};
  $scope.filter.patientName = "";
  $scope.patients = [];

  /*$scope.$on('$ionicView.beforeEnter', function()
  {
    $scope.patients = MainService.getPatients();
  });*/
  var refurl ="https://diagnosediabetes.firebaseio.com/";
  var ref = new Firebase(refurl);

  ref.child('users')
  .orderByChild('type')
  .equalTo(1)
  .once('value', function(patientSnap) {
     //$scope.patients = patientSnap.val();
     patientSnap.forEach(function(childSnapshot) {
       var key = childSnapshot.key();
       var childData = childSnapshot.val();

          var obj = {image: childData.image,username: childData.username,userid:childData.userid};
          $scope.patients.push(obj);

     });
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
.controller('doctoReportCtrl', function($scope,$state,$stateParams, $firebaseObject)
  {
    $scope.id = $stateParams.id;
    var refurl ="https://diagnosediabetes.firebaseio.com/";

    var refpatient = new Firebase(refurl+"/patientresult/"+$scope.id);
refpatient.once("value", function(snapshot) {
  $scope.patient = snapshot.val();
  console.log($scope.patient)
  var refuser = new Firebase(refurl+"/users/"+snapshot.val().userid)
  $scope.user = $firebaseObject(refuser);
});

 })
.controller('changeCtrl', function($scope,$state)
  {

 });
