
import style from './page.scss';
//import Photo from "./photo.js";
import $ from 'jquery';

class Page {
    constructor () {
        console.log("pageInited");
        this.wrapper = $("#page");
        this.data = {
            photous: {}
        };

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }
    onDeviceReady() {
        const CAMERA_OPTION = {
            destinationType: navigator.camera.DestinationType.FILE_URI,  //DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: false,
            mediaType: Camera.MediaType.PICTURE
        }

        $("#fasad-photo-btn").on("click", () => {
            navigator.camera.getPicture((imageData) => {
                this.onPhotoDataSuccess(imageData, "FASAD");
            }, function (message){
                alert('because: ' + message);
            }, CAMERA_OPTION);
        });

        $("#price-photo-btn").on("click", () => {
            navigator.camera.getPicture((imageData) => {
                this.onPhotoDataSuccess(imageData, "PRCIE");
            }, function (message) {
                alert('because: ' + message);
            }, CAMERA_OPTION);
        });

        $("#go-back").on("click", () => {
            this.hide();
        })

        $("#send-data").on("click", () => {
            alert(JSON.stringify(this.data));
        })
    }

    onPhotoDataSuccess(imageData, namePhoto) {
        this.data.photous[namePhoto] = imageData;
    }

    onPhotoFail(message) {
        alert('Failed because: ' + message);
    }

    show() {
        this.wrapper.show();
    } 

    hide() {
        this.wrapper.hide();
    }
}

export default Page;