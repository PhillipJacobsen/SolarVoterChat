

        var signedMessage = Math.round((new Date()).getTime() / 1000000); //1000=1 second
        document.getElementById("msg").innerHTML = signedMessage;    

        var has_had_focus = false;
        connected_flag=0;	

        var pipe = function(el_name, send) {
            var div  = $(el_name + ' div');
            var inp  = $(el_name + ' input');
            var form = $(el_name + ' form');

            var print = function(m, p) {
                p = (p === undefined) ? '' : JSON.stringify(p);
                div.append($("<code>").text(m + ' ' + p));
                div.scrollTop(div.scrollTop() + 10000);
            };

            if (send) {
                form.submit(function() {
                    send(inp.val());
                    inp.val('');
                    return false;
                });
            }
            return print;
        };

        var print_first = pipe('#first', function(data) {
            if (connected_flag==1) {
            message = new Paho.MQTT.Message(data);
            message.destinationName = "chat/" + mqttUsername + "/" + chatName;
            
            debug("SEND ON " + message.destinationName + " PAYLOAD " + data);
            client.send(message);
            }
        });

        var debug = pipe('#second');
        
        var displayReceivedData = pipe('#first');


        $('#first input').focus(function() {
            if (!has_had_focus) {
                has_had_focus = true;
                $(this).val("");
            }
        });