'use strict';

var Place = React.createClass({

    getInitialState: function() {
        return{
            success:false,
            name:null,
            temperaturInCelcius : null,
            currentTime : null,
            imageIcon : null,
            message : null
        }
    },
    googlePlaceAutoCompleteInitialize: function() {

        var options = {
            types: ['(cities)']
        };
        for(var i=0;i<5;i++){
            var input = document.getElementById('input'.concat(this.props.locationId));
            var autocomplete = new google.maps.places.Autocomplete(input, options);
        }

    },

    checkLocalStorage : function(){
        var savedLocation = localStorage.getItem(this.props.locationId);
        if(savedLocation != null){
            $("#input"+this.props.locationId).val(savedLocation);
            this.showValue();
        }
    },

    componentDidMount: function(){
        this.checkLocalStorage();
        this.googlePlaceAutoCompleteInitialize();
    },

    getAjaxConfig : function(location){
        var Uri = 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&appid=4095781a1e0464e938b262455a1405de&units=metric';
        var ajaxConfig = {
            url: Uri,
            type: 'GET',
            success : this.updateState

        };
        return ajaxConfig;
    },

    saveToLocalStorage : function(){
        if(typeof(Storage) !== "undefined") {
            localStorage.setItem(this.props.locationId,this.state.name);

        } else {
            console.log('Sorry! No Web Storage support..');
        }
    },

    showAlert : function(){
        alert(this.state.message);
    },

    updateState : function(output){
        var responseCode = output.cod;
        var successResult = responseCode ===200;
        if(successResult){
            console.log(output);
            var temperatureInCelcius = output.main.temp;
            var icon = output.weather[0].icon;
            this.saveToLocalStorage();
            this.setState({
                success:true,
                temperaturInCelcius : temperatureInCelcius,
                currentTime : moment().format('h:mm A ddd, MMMM Do YYYY '),
                imageIcon : icon,
                message : null
            });
            $("#input"+this.props.locationId).prop('disabled', true);

        }else {
            this.setState({
                message : this.state.name + ' is invalid city'
            });
            this.showAlert();
        }
    },
    showValue : function(){
        var location = $("#input"+this.props.locationId).val();
        this.setState({
            name : location
        })
        $.ajax(this.getAjaxConfig(location));

    },
    reset: function(){
        this.setState({
            success:false,
            name : null,
            temperaturInCelcius : null,
            currentTime : null,
            imageIcon:null,
            message: null
        });
        $("#input"+this.props.locationId).val('');
        $("#input"+this.props.locationId).prop('disabled', false);
        localStorage.removeItem(this.props.locationId);
    },
    render: function() {

        var inputFormId = 'input'.concat(this.props.locationId);
        var imageSource = 'http://openweathermap.org/img/w/'.concat(this.state.imageIcon).concat('.png');
        return (

            <div  className="generalDiv">
                <div>
                <input id={inputFormId} type="text" />
                </div>
                <button type="button" onClick={this.showValue}>Add!</button>
                <button type="button" onClick={this.reset}>Reset!</button>
                {this.state.success == false ?
                    null :
                    <div id="box">

                        {this.state.success == false
                            ?
                            null
                            :
                            <p>{this.state.name}</p>
                        }
                        <div>
                            {this.state.temperaturInCelcius == null
                                ?
                                null
                                :
                                <p className="generaltemp temp">{this.state.temperaturInCelcius} <b>C</b></p>
                            }
                            {this.state.imageIcon == null
                                ?
                                null
                                :
                                <img className="generaltemp" src={imageSource}></img>
                            }
                        </div>
                        <p>{this.state.currentTime}</p>

                    </div>
                }

            </div>

        );
    },
});

var VerticalLine = React.createClass({
    render : function(){
        return(
            <div className="vertical-line">
            </div>
        );
    }
});

var AllPlaces = React.createClass({

    render: function() {
        var places = [];
        var j =100;
        for(var i =0;i<5;i++){
            places.push(<Place locationId={i} key={i}/>);
            if(i!=4){
                places.push(<VerticalLine key={j}/>);
            }
            j++;

        }
        setInterval(this.render, 3000);
        return(
            <div className="secondDiv">
                {places}
            </div>
        );
    },

});

ReactDOM.render(<AllPlaces />, document.getElementById('centralDiv'));
