angular.module('starter.controllers', ['firebase'])
.controller('MainCtrl', function($scope,$firebaseArray,$ionicLoading,$state,Utility,$ionicHistory,ImageService,$timeout)
{
   
    $scope.login=true;
    $scope.signUp=false;
    $scope.option=1;
    $scope.loginData={};
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
    $scope.loginData.email='doctor@gmail.com';
    $scope.loginData.password=123;
    $scope.signIn=function()
    {

      if($scope.loginData.email==null && $scope.loginData.password==null)
      {

        Utility.showToastMessage('Enter login details');
        return;
      }
      else if ($scope.loginData.email == "doctor@gmail.com" && $scope.loginData.password==123)
      {

        $state.go("hospital");
        $ionicHistory.nextViewOptions({
          disableBack: true
        });

      }
      else if ($scope.loginData.email == "patient@gmail.com" && $scope.loginData.password==123)
      {

        $state.go("menu");
        $ionicHistory.nextViewOptions({

          disableBack: true

        }); 
      }
      else
      {
        Utility.showToastMessage('Invalid Credentials');
        return;
      }
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

})
.controller('menuCtrl', function($scope,$state,$ionicHistory) 
{
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
    $state.go('app');
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
  }
})

.controller('diagnosemeCtrl', function($scope,$state,$firebaseArray,Utility) {
        var database = new Firebase("https://diagnosediabetes.firebaseio.com/patientresult");
        $scope.patientparameter = $firebaseArray(database);


        $scope.submit = function (parameter1,parameter2,parameter3,parameter4,parameter5) {
            var res = {
                parameter1: parameter1,
                parameter2: parameter2,
                parameter3: parameter3,
                parameter4: parameter4,
                parameter5: parameter5

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
            parameter1: parameter1,
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

.controller('ContactCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService) 
{
  
})

.controller('LocationCtrl', function($scope,$timeout,$ionicLoading,$ionicHistory,$rootScope,$state,Utility,MainService,SessionService) 
{

})

.controller('myRecordCtrl', function($scope,$state) 
  {

 })
.controller('doctoReportCtrl', function($scope,$state) 
  {

 })
.controller('changeCtrl', function($scope,$state) 
  {

 });




