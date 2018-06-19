
import style from './page.scss';
//import Photo from "./photo.js";
import $ from 'jquery';

import React from "react";
import ReactDOM from "react-dom";
import ReactTimeWork from './timework.jsx';
import ReactPrice from './price.jsx';
import Event from '../event';
class Page extends Event {
    constructor () {
        super();
        console.log("pageInited");
        this.wrapper = $("#page");
        this.setData();
        ReactDOM.render(<ReactTimeWork mode={"24/7"} />, document.getElementById('time-work'));
        ReactDOM.render(<ReactPrice />, document.getElementById('price-table'));
        
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }
    onDeviceReady() {
        const CAMERA_OPTION = {
            destinationType: navigator.camera.DestinationType.FILE_URI,  //DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: false,
            mediaType: Camera.MediaType.PICTURE
        }

        this.wrapper.find("#fasad-photo-btn").on("click", () => {
            navigator.camera.getPicture((imageData) => {
                this.onPhotoDataSuccess(imageData, "FASAD");
            }, (message) => {
                this.onPhotoFail(message);
            }, CAMERA_OPTION);
        });

        this.wrapper.find("#price-photo-btn").on("click", () => {
            navigator.camera.getPicture((imageData) => {
                this.onPhotoDataSuccess(imageData, "PRCIE");
            }, (message) => {
                this.onPhotoFail(message);
            }, CAMERA_OPTION);
        });



        this.wrapper.find("#go-back").on("click", () => {
            this.trigger("closed");
            this.hide();
        })

        this.wrapper.find("#send-data").on("click", () => {
            this.readForm();
        })
    }

    onPhotoDataSuccess(imageData, namePhoto) {
        var ft = new FileTransfer();
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = "myphoto.jpg";
        options.mimeType = "image/jpeg";

        ft.upload(imageData, encodeURI("http://10.0.2.2/change/photo"), function(res){
            alert(JSON.stringify(res))
        }, function (err) {
            alert(JSON.stringify(err))
        }, options);

        this.data.photous[namePhoto] = imageData;
    }

    onPhotoFail(message) {
        alert('Failed because: ' + message);
    }



    setData(data) {
        this.data = {
            photous: {}
        };
        console.log(data);

        if(data) {
            this.data.latLng = data.latLng;
            this.data.address = data.address;
            this.wrapper.find("#address-input").val(data.address);
        }
        return this;
    }



    sendData() {
        alert("send");
    }

    readForm () {
        
        this.sendData();
    }






    show() {
        this.wrapper.animate({ top: 0 });
    }

    hide() {
        this.wrapper.animate({ top: 1000 });
    }
    
}

export default Page;