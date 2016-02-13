simpleOBJLoader = function(){}

parse = function(data){
    function vector( x, y, z ) {
		return new THREE.Vector3( x, y, z );
	}
    
	function face3( a, b, c, normals ) {
		return new THREE.Face3( a, b, c, normals );
	}
    
	var group = new THREE.Object3D();
	var vertices = [];
	var normals = [];
	var pattern, result;

	// v float float float

	pattern = /v( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;

	while ( ( result = pattern.exec( data ) ) != null ) {
        
		vertices.push( vector(
			parseFloat( result[ 1 ] ),
			parseFloat( result[ 2 ] ),
			parseFloat( result[ 3 ] )
		) );

	}




	var data = data.split( '\no ');

	for ( var i = 0, l = data.length; i < l; i ++ ) {

		var object = data[ i ];

		var geometry = new THREE.Geometry();

		geometry.vertices = vertices;

		// f vertex vertex vertex ...

		pattern = /f( [\d]+)( [\d]+)( [\d]+)( [\d]+)?/g;

		while ( ( result = pattern.exec( object ) ) != null ) {
				geometry.faces.push( face3(
					parseInt( result[ 1 ] ) - 1,
					parseInt( result[ 2 ] ) - 1,
					parseInt( result[ 3 ] ) - 1
				) );


		}

		group.add( new THREE.Mesh( geometry, new THREE.MeshLambertMaterial() ) );

	}

	return group;

};

simpleOBJLoader = function(url, callbackFunction){
    request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		if ( request.readyState == 4 ) {
			if ( request.status == 200 || request.status == 0 ) {
				callbackFunction( parse( request.responseText ) );
			} else {
				alert("Load Error");
			}
		}
	};
    request.open( "GET", url, true );
	request.send( null );
    
}