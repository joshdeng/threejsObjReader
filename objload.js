
// Global var definition (e.g.:  camera, scene, mesh, etc. )
var camera, scene, renderer,mesh,cText,dropZone,container;

//  initialize dropzone div for obj file drop
//  source: http://blog.teamtreehouse.com/implementing-native-drag-and-drop
function dropZoneInit(){
    dropZone = document.querySelector('#dropZonePane');
    dropZone.addEventListener('dragover', function(e) {
		if (e.preventDefault) e.preventDefault(); 
		if (e.stopPropagation) e.stopPropagation(); 
		e.dataTransfer.dropEffect = 'copy';
	});
    dropZone.addEventListener('dragenter', function(e) {
		this.className = "over";
	});
    
    dropZone.addEventListener('dragleave', function(e) {
		this.className = "";
	});
    
    dropZone.addEventListener('drop', function(e) {
		if (e.preventDefault) e.preventDefault(); 
		if (e.stopPropagation) e.stopPropagation(); 
		this.className = "";
		var fileList = e.dataTransfer.files;
		if (fileList.length > 0) {
			readFile(fileList[0]);
		}
	});
};

// read obj file and parse it to three object then add it in our scene 
function readFile(file) {
    var reader = new FileReader();
    reader.onloadend = function(e) {
	   if (e.target.readyState == FileReader.DONE) {
            container.appendChild(renderer.domElement);
            cText.parentNode.removeChild(cText);     
		    var content = reader.result;
            object = parse(content);
            object.children[0].geometry.computeFaceNormals();
            var  geometry = object.children[0].geometry;
            THREE.GeometryUtils.center(geometry);
            geometry.dynamic = true;
            var material = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
            mesh = new THREE.Mesh(geometry, material);  
            scene.add( mesh );
            render();
	   }
    }
    reader.readAsBinaryString(file);
};

// set camera rotation and zoom
// source: http://threejs.org/examples/#webgl_geometry_teapot
function cameraCtrl(){
    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.target.set( 0, 0, 0 );
	cameraControls.addEventListener( 'change', render );
};

// add more lights
function lightInit(){
    var ambient = new THREE.AmbientLight(  0x333333 );
    scene.add( ambient );
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );
    var pointLight = new THREE.PointLight( 0xffffff, 5, 29 );
    pointLight.position.set( 0, -25, 10 );
    scene.add( pointLight );
    
    var pointLight=new THREE.PointLight(0xFFFFFF);
    // set its position
    pointLight.position.x= 400;
    pointLight.position.y= 0;
    pointLight.position.z= 0;
    // add to the scene
    scene.add(pointLight);
    
};


/** Initialize Three.js objs */
function initialize()
{
	container = document.getElementById("webgl");
    cText = document.getElementById("centered")
    var width = container.clientWidth;
	var height = container.clientHeight;
    
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45,width/height,0.1,10000);
    camera.position.z = 10;
    camera.position.x = 0;
    camera.position.y = 0;
    
    scene.add(camera);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width,height);
    

};

// render all
function render(){
    renderer.render(scene,camera);
};

// switch to wireframe and back
function wireframSwitch(){
    if (mesh.material.wireframe){
        mesh.material.wireframe = false
        mesh.material.color = new THREE.Color(0xffffff);
    }else{
        mesh.material.wireframe = true;
        mesh.material.color = new THREE.Color( 0x6893DE  );
    }
    render();
};




/** Called when page is loaded */

function load()
{
    dropZoneInit();
	initialize();
    lightInit();
	render();
    cameraCtrl();
}


