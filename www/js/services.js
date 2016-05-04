angular.module('starter.services', [])

.factory('MainService', function() 
{
  var patients = [{
    id: 0,
    name: 'Ahmed',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Khalid',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Ali',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Hamdan',
    face: 'img/perry.png'
  }];



  return {
    getPatients: function()
    {
      return patients;
    },
    getResults: function()
    {
      return results;
    }

  };
})

.factory('Utility', function($ionicLoading) {
  return{
    showToastMessage: function(message){
      $ionicLoading.show({template: message, noBackdrop: true, duration: 1500 });
    }
  }
})

.factory('SessionService',function($rootScope)
  {
    var dspready;
    return{
      setDspReady:function(dsp){
        dspready=dsp;
      },
      isDspReady:function(){
        return dspready;
      }
    }
})

.factory('ImageService', function($http,SessionService, $rootScope, $ionicActionSheet)
{
 var imageUrl;

 // function getUrlPath(){
 //   var urlPath = DSP_URL + "/rest/" + FILE_SERVICE.name + "/" + FILE_SERVICE.container;
 //   return urlPath;
 // }

 function uploadFileToUrl (file, fileName, uploadUrl, entity){
     var fd = new FormData();
     fd.append('files', file);
     $http.post(uploadUrl + "/"+ fileName + ".jpeg" + "?app_name="+ DSP_API_KEY, fd, {
         transformRequest: angular.identity,
         headers: {'Content-Type': undefined}
     })
     .success(function(success){
       $rootScope.$broadcast('image:uploaded:successfully', entity);
     })
     .error(function(){
       alert("Upload Failed");
     });
 }

 function openCamera(pictureSourceType){
   navigator.camera.getPicture(onSuccess, onFail,
     {quality: 100,
      sourceType: pictureSourceType,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 814,
      targetHeight: 814,
      saveToPhotoAlbum:true,
      correctOrientation: true
     });
 }

 function onSuccess(imageData){
   imageUrl = "data:image/jpeg;base64,"+imageData;
   $rootScope.$broadcast('image:captured', imageUrl);
 }

 function onFail(message) {

 } 

 function dataURItoBlob(dataURI) {
   // convert base64/URLEncoded data component to raw binary data held in a string
   var byteString;
   if (dataURI.split(',')[0].indexOf('base64') >= 0)
       byteString = atob(dataURI.split(',')[1]);
   else
       byteString = unescape(dataURI.split(',')[1]);

   // separate out the mime component
   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

   // write the bytes of the string to a typed array
   var ia = new Uint8Array(byteString.length);
   for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
   }

   return new Blob([ia], {type:mimeString});
 }

  return {

   uploadImage : function(entity,entityId,dataURL){
     //image name format:- doctor_3.jpeg
     //folder name format:- Clinic_45
     var imageName = entity+"_"+entityId;
     var file = dataURItoBlob(dataURL);
     //console.log('file is ' + JSON.stringify(file));
     var uploadUrl = getUrlPath() +"/";
    // console.log(uploadUrl);
     uploadFileToUrl(file, imageName, uploadUrl, entity);
   },
   getImagePath : function(entity,entityId){
     //image name format:- doctor_3.jpeg
     //folder name format:- Clinic_45
     var imageName = entity+"_"+entityId + ".jpeg";
     //Sample Image Path :- http://dsp.proapptive.in/rest/file/hospitouch/Clinic_2/doctor_109.jpeg?app_name=hospitouch
     var imagePath = getUrlPath() + "/" + imageName + "?app_name="+DSP_API_KEY;
     return imagePath;
   },
   camera : function(showDelete){
     var buttonsToShow = [
     {text: 'Take Photo'},
     {text: 'Choose Existing Photo'}
     ];
   if(showDelete){
     buttonsToShow.push({text: 'Delete Photo'})
   } 
     var hideSheet = $ionicActionSheet.show({
     buttons: buttonsToShow ,
     cancelText: 'Cancel',
     cancel: function(){

     },
     buttonClicked: function(index, buttons){
       if(index == 0)
       {
         openCamera(Camera.PictureSourceType.CAMERA);
       }
       else if(index == 1)
       {
         openCamera(Camera.PictureSourceType.SAVEDPHOTOALBUM);
       }
       else if(index == 2)
       {
          $rootScope.$broadcast('delete:image:requested');
       }

       return true;
     }
   });
   }
 };
});



