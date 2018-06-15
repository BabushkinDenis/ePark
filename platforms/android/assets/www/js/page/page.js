
import style from './page.scss';
//import Photo from "./photo.js";
import $ from 'jquery';

import React from "react";
import ReactDOM from "react-dom";
import ReactTimeWork from './timework.jsx';
import Event from '../event';
class Page extends Event {
    constructor () {
        super();
        console.log("pageInited");
        this.wrapper = $("#page");
        this.setData();
        ReactDOM.render(<ReactTimeWork mode={"24/7"} />, document.getElementById('time-work'));
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
            }, function (message){
                alert('because: ' + message);
            }, CAMERA_OPTION);
        });

        this.wrapper.find("#price-photo-btn").on("click", () => {
            navigator.camera.getPicture((imageData) => {
                this.onPhotoDataSuccess(imageData, "PRCIE");
            }, function (message) {
                alert('because: ' + message);
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

    setData(data) {
        this.data = {
            photous: {}
        };
        if(data) {
            this.data.latLng = data.latLng;
            this.wrapper.find("#addres-input").val(data.address);
        }
        return this;
    }

    sendData() {
        var imageURI = this.data.photous.FASAD;
        var formData = new FormData();
           
        if (!imageURI) {
            alert('Please select an image first.');
            return;
        }
        
       

        formData.append("username", "Groucho");
        formData.append("accountnum", 123456); 

        // Файл, выбранный пользователем
        formData.append("userfile", imageURI);

        // JavaScript Blob объект
        var content = '<a id="a"><b id="b">hey!</b></a>'; // содержимое нового файла...
        var blob = new Blob([content], { type: "text/xml" });

        formData.append("webmasterfile", blob);

        var request = new XMLHttpRequest();
        request.open("POST", "http://api.epark.local/change");
        request.send(formData);
        alert("send");

    }

    readForm () {
        this.sendData();
        //alert(JSON.stringify(this.data));
    }
    
}

export default Page;