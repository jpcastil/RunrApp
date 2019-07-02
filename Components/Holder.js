updatePace(newTime, position){
    let d = distance(position.coords.latitude, position.coords.longitude, latitudes[latitudes.length - 1], longitudes[ longitudes.length - 1])
    let millis = times[ times.length - 1] /  d
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    this.setState({
        pace: minutes + ":" + (seconds < 10 ? '0' : '') + seconds
    });

}
