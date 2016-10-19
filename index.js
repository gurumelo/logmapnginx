var Tail 	= require('tail').Tail;
var log 	= '/var/log/nginx/access.log';
var separador	= ' - - ';
var app		= require('http').createServer(manejador);
var io		= require('socket.io')(app);
var fs		= require('fs');
var geoip2 	= require('geoip2');
geoip2.init();

app.listen(1984);

function manejador(req, res) {
	fs.readFile(__dirname + '/index.html',
	function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error cargando index.html');
		}
		res.writeHead(200);
		res.end(data);
	});
}

function devuelve(laip, lapeticion) {
	geoip2.lookupSimple(laip, function(error, result) {
		if (error) {
			console.log("Error: %s", error);
		}
		else if (result) {
			//console.log(result.location);
			io.emit('oo', {ip: laip, peticion: lapeticion, latitud: result.location.latitude, longitud: result.location.longitude});
		}
	});
}


tail = new Tail(log);

tail.on('line', function(data) {
	var linea = data.split(separador);
	devuelve(linea[0], linea[1]);
});

