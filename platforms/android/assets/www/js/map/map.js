
import style from './map.scss';
import $ from 'jquery';

import Event from '../event';



class Map extends Event  {
    constructor () {
        super();
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }

    onDeviceReady() {
        this.SDK = plugin.google.maps.Map.getMap(document.getElementById('map'), {
            controls: {
                myLocationButton: true,
                myLocation: true
            }
        });

        this.SDK.on(plugin.google.maps.event.CAMERA_MOVE_END, function (latLng) {
           // alert()
            //alert(JSON.stringify(latLng));
            plugin.google.maps.Geocoder.geocode({
                "position": latLng.target
            }, function (results) {
                //alert(JSON.stringify(results));
                if (results.length === 0) {
                     return;
                }

                var address = [
                    results[0].subThoroughfare || "",
                    results[0].thoroughfare || "",
                    results[0].locality || "",
                    results[0].adminArea || "",
                    results[0].postalCode || "",
                    results[0].country || ""].join(", ");
               
                $("#confirm-address-location").html(address);
                
            });
        });

        $("#add-parking").on("click", () => {
            this.showMyPosition();
            this.swithMode("CONFIRM");
        });

        $("#confirm-address").on("click", () => {
            //this.showMyPosition();
            this.swithMode("MAIN");

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

    swithMode(mode) {
        if (mode == "CONFIRM") {
            $("#map-wrapper").addClass("_confirmMode");
        } else {
            $("#map-wrapper").removeClass("_confirmMode");
        }
    }

    getCenter() {

    } 
}



export default Map;

