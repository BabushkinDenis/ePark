
class Photo {
    constructor() {
        this.pictureSource = navigator.camera.PictureSourceType;   // picture source
        this.destinationType = navigator.camera.DestinationType; // sets the format of returned value 

        //alert(this.pictureSource);
    }

    onPhotoDataSuccess(imageData) {
        // Get image handle
        //
        var smallImage = document.getElementById('smallImage');
        // Unhide image elements
        //
        smallImage.style.display = 'block';
        // Show the captured photo
        // The inline CSS rules are used to resize the image
        //
        smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    onPhotoFileSuccess(imageData) {
        // Get image handle
        console.log(JSON.stringify(imageData));

        // Get image handle
        //
        var smallImage = document.getElementById('smallImage'); 
        // Unhide image elements
        //
        smallImage.style.display = 'block';
        // Show the captured photo
        // The inline CSS rules are used to resize the image
        //
        smallImage.src = imageData;
    }

    onPhotoURISuccess(imageURI) {
        // Uncomment to view the image file URI 
        // console.log(imageURI);
        // Get image handle
        //
        var largeImage = document.getElementById('largeImage');
        // Unhide image elements
        //
        largeImage.style.display = 'block';
        // Show the captured photo
        // The inline CSS rules are used to resize the image
        //
        largeImage.src = imageURI;
    }

    capturePhotoWithData() {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(this.onPhotoDataSuccess, this.onFail, { quality: 50 });
    }

    capturePhotoWithFile() {
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: this.DestinationType.FILE_URI });
    }

    getPhoto() {
        var source = this.pictureSource.PHOTOLIBRARY;
        //pictureSource.SAVEDPHOTOALBUM
        // Retrieve image file location from specified source
        navigator.camera.getPicture(onPhotoURISuccess, onFail, {
            quality: 50,
            destinationType: this.destinationType.FILE_URI,
            sourceType: source
        });
    }

    onFail(message) {
        alert('Failed because: ' + message);
    }
}

export default Photo;