
import style from './map.scss';
import $ from 'jquery';
import _ from 'underscore'
import Event from '../event';
import busEvent from '../busEvent';
//const CONFIRM = "CONFIRM";


class Map extends Event  {
    constructor () {
        super();
        this.data = {};
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        
    }

    onDeviceReady() {
        this.SDK = plugin.google.maps.Map.getMap(document.getElementById('map'), {
            controls: {
                myLocationButton: true,
                myLocation: true
            }
        });

        this.SDK.on(plugin.google.maps.event.CAMERA_MOVE_END, (latLng) => {
            if(this.mode == "CONFIRM") {
              
                plugin.google.maps.Geocoder.geocode({
                    "position": latLng.target
                }, (results) => {
                    console.log(results);
                    if (results.length === 0) {
                        return;
                    }

                    let address = [
                        results[0].subThoroughfare || "",
                        results[0].thoroughfare || "",
                        results[0].locality || ""
                        // results[0].adminArea || "",
                        // results[0].postalCode || "",
                        //results[0].country || ""
                    ].join(", ");


                    busEvent.trigger("changedLocation", {
                        latLng: latLng.target,
                        //latLngPedro: _latLngPedro;
                        address: {
                            latLng: results[0].position,
                            string: address
                        },
                        time: Math.round((new Date()).getTime() / 1000)
                    });

                    $("#confirm-address-location").html(address);
                });
            }
        });

        $("#add-parking").on("click", () => {
            this.showMyPosition();
            this.switchMode("CONFIRM");
        });

        $("#confirm-address").on("click", () => {
            this.switchMode("MAIN");
            this.trigger("geoLocationConfirned");
        });

        this.initState();
    }


    initState() {
        $.ajax({
            url: "https://egrn-reestr.ru/parking",
            type: 'GET',
            crossDomain: true,
            success: (res) => {
                _.each(res, (item) => {
                    if (item.lat == "-" || item.lng == "-") {
                        return false
                    }
                    var canvas = document.createElement('canvas');
                        canvas.width = 100;
                        canvas.height = 70;
                    var context = canvas.getContext('2d');
                    var map = this.SDK;

                    var img = new Image();
                        img.src = item.photo;
                        img.onload = function () {
                            context.drawImage(img, 0, 0);
                            // context.font = '9pt Calibri';
                            // context.fillStyle = 'black';
                            // context.fillText(item.address,0, 80);
         
                            var marker = map.addMarker({
                                'position': { lat: item.lat, lng: item.lng },
                                'title': canvas.toDataURL(),
                                'snippet': item.address
                            });
                        };

                    // var marker = this.SDK.addMarker({
                    //     position: { lat: item.lat, lng: item.lng},
                    //     title: item.address,
                    //     snippet: item.comment
                    // })

                    // marker.on(plugin.google.maps.event.MARKER_CLICK, function () {
                    //      var htmlInfoWindow = new plugin.google.maps.HtmlInfoWindow();
                    //      htmlInfoWindow.setContent("<div>TEST</div>");
                    //      htmlInfoWindow.open(marker);
                    // });

                    });

            },
            error: function (err) {
                alert(JSON.stringify(err));
            }
        })
       

    }


    showMyPosition() {
        let option = {
            enableHighAccuracy: true 
        };

        plugin.google.maps.LocationService.getMyLocation(option, location => {
            this.SDK.animateCamera({
                target: location.latLng,
                zoom: 18,
                duration: 500
            });
        });
    
    }

    switchMode(mode) {
        this.mode = mode;
        if (mode == "CONFIRM") {
            $("#map-wrapper").addClass("_confirmMode");
        } else {
            $("#map-wrapper").removeClass("_confirmMode");
        }
    }
    hide() {
        $("#map-wrapper").hide();
    }

    show() {
        $("#map-wrapper").show();
    }

    getCenter() {

    } 
}



export default Map;

