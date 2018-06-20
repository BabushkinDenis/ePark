
import style from './map.scss';
import $ from 'jquery';

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

