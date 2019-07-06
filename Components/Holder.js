setCoordinatesObject = () => {
    var i = 0
    let coordinates = []
    let obj
    while (i < latitudes.length){
        obj = {latitude: latitudes.pop(),longitude: longitudes.pop()}
        coordinates.push(obj)
        i = i + 1
    }
    this.setState({
        coordinates: coordinates
    });
