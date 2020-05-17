import React from 'react';

class Weather extends React.Component {

  constructor(props) {
    super(props);
    this.field_update = this.field_update.bind(this);
    this.check_weather = this.check_weather.bind(this);
    this.state = {
      city_name: '',
      city_weather: [],
      city_temperature: {},
      city_wind: {}
    }
  }

  field_update(event) {
    this.setState({ city_name: event.target.value })
    localStorage.setItem('cityName',JSON.stringify(event.target.value))
  }

  componentDidMount(){
    if(localStorage.getItem('apiWeather')){
      this.setState({city_weather : JSON.parse(localStorage.getItem('apiWeather'))})
      this.setState({city_temperature : JSON.parse(localStorage.getItem('apiMain'))})
      this.setState({city_wind : JSON.parse(localStorage.getItem('apiWind'))})
      this.setState({city_name : JSON.parse(localStorage.getItem('cityName'))})
      document.querySelector('#update').textContent = "به روز رسانی";
    }else{
      document.querySelector('#update').textContent = "بررسی";
    }
  }

  check_weather(event) {
    if(this.state.city_name){ //prevent empty input
    event.preventDefault();
    const units = 'metric';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city_name}&appid=cd8d1f30feddefbda7be4d6e41d66b7d&units=${units}`)
      .then(res => res.json())
      .then(
        json => {
          if(json.message){ //city not found
            this.setState({city_name : json.message})
          }else{
            this.setState({
              city_weather: json.weather,
              city_temperature: json.main,
              city_wind: json.wind
            })
            localStorage.setItem('apiWeather',JSON.stringify(json.weather));
            localStorage.setItem('apiMain',JSON.stringify(json.main));
            localStorage.setItem('apiWind',JSON.stringify(json.wind));
          }
        }
      )
    }
  }

  render() {
    let main, icon='50d';
    this.state.city_weather.map(item => {
      main = item.main
      icon = item.icon
    });
    let city_temperature=Object.values(this.state.city_temperature);
    let city_wind=Object.values(this.state.city_wind);
    return (
        <div className="container">
          <div className="row justify-content-center align-content-center vh-100">
            <div className="card bg-dark col-md-8 h-50 border">
              <div className="row h-100 align-items-end">
                <div className="col-md-6 p-0" id="side01">
                  <div id="gradient">
                  </div>
                  <div className="card-img-overlay text-light d-flex align-items-center justify-content-between">
                    <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
                    <div className="d-flex flex-column align-items-end">
                      <h2 className="card-title font-weight-bold bg-dark rounded p-2">{this.state.city_name}</h2>
                      <p className="card-text bg-dark rounded p-2">{city_temperature[0]} °C</p>
                      <p className="card-text bg-dark rounded p-2">{main}</p>
                    </div>
                  </div>
                </div>
                <div className="card-body bg-dark col-md-6">
                  <table className="table table-borderless text-light">
                    <tbody>
                      <tr className="d-flex justify-content-between">
                        <td>{city_temperature[1]}</td>
                        <td>دمای احساسی</td>
                      </tr>
                      <tr className="d-flex justify-content-between">
                        <td>{city_temperature[2]}</td>
                        <td>کمینه دما</td>
                      </tr>
                      <tr className="d-flex justify-content-between">
                        <td>{city_temperature[3]}</td>
                        <td>بیشینه دما</td>
                      </tr>
                      <tr className="d-flex justify-content-between">
                        <td>{city_temperature[5]} %</td>
                        <td>رطوبت</td>
                      </tr>
                      <tr className="d-flex justify-content-between">
                        <td>{city_wind[0]} m/s</td>
                        <td>سرعت باد</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="input-group mt-4">
                    <input value={this.state.city_name} type="text" className="form-control bg-transparent text-center text-light" placeholder="نام شهر" autoFocus onChange={this.field_update} />
                    <div className="input-group-append">
                    <button id="update" className="btn border-light text-light mb-3" onClick={this.check_weather}>
                    {/* textContent */}
                </button>
                    </div>
                  </div>
                </div>
                <a className="badge-light badge mt-2" href="https://openweathermap.org">
                  <small>
                    OpenWeather API
            </small>
                </a>
              </div>
            </div>
          </div>
        </div>
    )
  }
}
export default Weather;