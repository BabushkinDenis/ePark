
import style from './page.scss';
//import Photo from "./photo.js";
import $ from 'jquery';
import _ from 'underscore'

import React from "react";
import ReactDOM from "react-dom";
import ReactTimeWork from './timework.jsx';
import ReactPrice from './price.jsx';
import Event from '../event';
import busEvent from '../busEvent';
class Page extends Event {
    constructor () {
        super();
        console.log("pageInited");
        this.wrapper = $("#page");
        this.data = {
            photos: {}
   
        };
        //this.serverUrl = "http://10.0.2.2"; 
        this.serverUrl = "https://egrn-reestr.ru"; 

        busEvent.on("changedSchedule", (data) => {
            this.data.schedule = data;
            //console.log(data);
        })
        busEvent.on("changedPrice", (data) => {
            this.data.price = data;
            //console.log(data);
        })

        busEvent.on("changedLocation", (data) => {
            console.log(data);
            this.data.location = data;
            this.wrapper.find("#address-input").val(data.address.string);
        })


        ReactDOM.render(<ReactTimeWork mode={"24/7"} />, document.getElementById('time-work'));
        ReactDOM.render(<ReactPrice />, document.getElementById('price-table'));

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

    }
    onDeviceReady() {
        const CAMERA_OPTION = {
            quality: 70,
            correctOrientation: true,
            destinationType: navigator.camera.DestinationType.FILE_URI,  //DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: false,
            mediaType: Camera.MediaType.PICTURE
        }


        this.wrapper.find("#fasad-photo-btn").on("click", () => {
            navigator.camera.getPicture((imageData) => {
                this.wrapper.find("#fasad-photo-btn").addClass("_complet");
                this.onPhotoDataSuccess(imageData, "fasad");
            }, (message) => {
                this.onPhotoFail(message);
            }, CAMERA_OPTION);
        });

        this.wrapper.find("#price-photo-btn").on("click", () => {
            navigator.camera.getPicture((imageData) => {
                this.wrapper.find("#price-photo-btn").addClass("_complet");
                this.onPhotoDataSuccess(imageData, "price");
            }, (message) => {
                this.onPhotoFail(message);
            }, CAMERA_OPTION);
        });

        this.wrapper.find("#go-back").on("click", () => {
            this.trigger("closed");
            this.hide();
        })


        this.wrapper.find("#phone-input").on("change", (e) => {
            this.data.phone = e.target.value;
        })

        this.wrapper.find("#comment-textarea").on("change", (e) => {
            this.data.comment = e.target.value;
        })

        this.wrapper.find("#address-input").on("change", (e) => {
            this.data.suggested_address = e.target.value;
        })

        this.wrapper.find("#send-data").on("click", (e) => {
            if ($(e.target).hasClass('_sending_fasad') || $(e.target).hasClass('_sending_price')) {
                return;
            }
            this.sendData();
        })


    }

    onPhotoDataSuccess(imageData, namePhoto) {
        var ft = new FileTransfer();
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = "myphoto.jpg";
        options.mimeType = "image/jpeg";

        this.wrapper.find("#send-data").addClass("_sending_" + namePhoto);
        ft.upload(imageData, encodeURI(this.serverUrl + "/change/photo"), (res) => {
            
            if(res.responseCode == 200) {
                this.data.photos[namePhoto] = JSON.parse(res.response).id;
            } else {
                alert(JSON.stringify(res))
            }
            this.wrapper.find("#send-data").removeClass("_sending_" + namePhoto);
        }, (err) => {
            alert(JSON.stringify(err))
            this.wrapper.find("#send-data").removeClass("_sending_" + namePhoto);
        }, options);
    }

    onPhotoFail(message) {
        alert('Failed because: ' + message);
    }


    sendData() {
        var data={
            timetable: {},
            prices:{}
        };
        
        console.log(this.data)
        console.log(this.data.price.rows)

        if(this.data.location){
            data.address = this.data.location.address.string;
            data.lat = this.data.location.latLng.lat;
            data.lng = this.data.location.latLng.lng;
            data.latAddress = this.data.location.address.latLng.lat;
            data.lngAddress = this.data.location.address.latLng.lng;
            data.comment = this.data.comment;
            data.suggested_address = this.data.suggested_address;
            data.ctime = this.data.location.time;
        }
        data.etime = Math.round((new Date()).getTime() / 1000);
        data.contact = [{phone: this.data.phone}];
        data.photos = this.data.photos;
        
        _.each(_.filter(this.data.price.rows, function(el){return el.enable;}), function(item){
            data.prices[item.name] = _.pick(item, "price_1", "price_2","price_3");
        })

        if (this.data.schedule.typeSchedule == "24/7") {
            _.each("mon,tue,wd,th,ft,sn,st".split(","), function (name) {
                data.timetable[name + "_from"] = "00:00";
                data.timetable[name + "_to"] = "24:00";
            });
        } else if(this.data.schedule.typeSchedule == "DEFAULT") {
            _.map(this.data.schedule.default, function (item) {
                if (item.enable) {
                    _.each(item.name.split(","), function(name) {
                        data.timetable[name + "_from"] = item.from;
                        data.timetable[name + "_to"] = item.to;
                    });
                }
            });
        } else if (this.data.schedule.typeSchedule == "PERSONAL") {
            _.map(this.data.schedule.personal, function(item){
                if(item.enable) {
                    data.timetable[item.name + "_from"] = item.from;
                    data.timetable[item.name + "_to"] = item.to;
                }
            })
        } 

        console.log(data);

        $.ajax({
            url: this.serverUrl + "/change?user_id=60495d9",
            type: 'POST',
            data: data,
            crossDomain: true,
            success: (res) => {
                this.onSuccessAdd();
            },
            error: function (err) {
                alert(JSON.stringify(err));
            }
        })
    }
    onSuccessAdd() {
        busEvent.trigger("timework:reset");
        busEvent.trigger("price:reset");
        this.wrapper.find("#phone-input").val("");
        this.wrapper.find("#comment-textarea").val("");
        this.wrapper.find("#address-input").val("");
        this.wrapper.find("#price-photo-btn").removeClass("_complet");
        this.wrapper.find("#fasad-photo-btn").removeClass("_complet");
        
        this.hide();


        navigator.camera.cleanup();
        alert("parking success add");
    }

    show() {
        this.wrapper.animate({ top: 0 });
        this.wrapper.find(".form").scrollTop(0);
    }

    hide() {
        this.wrapper.animate({ top: 1000 });
    }
    
}

export default Page;