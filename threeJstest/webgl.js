// revolutions per second
var angularSpeed = 0.2;
var lastTime = 0;

var group = new THREE.Object3D();
var group1 = new THREE.Object3D();
var group2 = new THREE.Object3D();
// this function is executed on each animation frame
function animate() {
	camera.position.y = 40;
	camera.rotation.x = -Math.PI / 15;
	camera.position.z = 1200;

	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;
	var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
	group.rotation.y += .03;
	//scene.rotation.y = Math.PI/2;
	lastTime = time;

	mCube.visible = false;
	mCubeCamera.rotation = mCube.rotation;
	mCubeCamera.updateCubeMap(renderer, scene);
	mCube.visible = true;

	// render
	renderer.render(scene, camera);

	// request new frame
	requestAnimationFrame(function() {
		animate();
	});
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
//var camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 100000 );

var scene = new THREE.Scene();
group1.add(createCube(70, 250, 230 - 10, 0xff00ff, +35 + 50, 0, 0));
group1.add(createCube(70, 250, 230 - 10, 0xff00ff, -35 - 50, 0, 0));
group1.add(createCube(100 + 70 + 70 - 10, 250, 70, 0xff00ff, 0, 0, -115 + 35, 0, 0, 0, 1))

group1.position.set(-100, 0, +100);


group2.add(createCube(70, 250, 230 - 10, 0xff00ff, 85, 0, 0));
group2.add(createCube(70, 250, 230 - 10, 0xff00ff, -85, 0, 0));
group2.add(createCube(240 - 10, 250, 70, 0xff00ff, 0, 0, -80, 0, 0, 0, 1))
group2.position.set(100, 0, -100);
group2.rotation.set(0, Math.PI / 2, 0);

group.add(createCube(200, 250, 120, 0xff00ff, 0, 0, 0, 0, 45 * Math.PI / 180, 0, 1));
group.add(group1);
group.add(group2);
scene.add(group);
drawSimpleSkybox();
drawSimpleMirror();
renderer.render(scene, camera);
console.log(camera.position)
console.log(camera.rotation)
console.log(group.position)
animate();

function createCube(width, height, depth, Color, x, y, z, rx, ry, rz, type) {
	var tempGroup = new THREE.Object3D();
	var floorTexture = new THREE.ImageUtils.loadTexture('texture.jpg');
	//floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set(10, 10);
	var wallMaterial = new THREE.MeshBasicMaterial({
		map: floorTexture,
		side: THREE.DoubleSide
	});
	var temp = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMaterial);
	var offset = 2;
	tempGroup.add(createSquares(-width / 2, -height / 2, width / 2, height / 2, depth / 2 + offset, depth / 2 + offset, 0x000000, 1 + Math.floor(width / 15), Math.floor(height / 22), type))
	tempGroup.add(createSquares(-width / 2, -height / 2, width / 2, height / 2, -depth / 2 - offset, -depth / 2 - offset, 0x000000, 1 + Math.floor(width / 15), Math.floor(height / 22), type));
	tempGroup.add(createSquares(width / 2 + offset, -height / 2, width / 2 + offset, height / 2, -depth / 2, depth / 2, 0x000000, Math.floor(height / 22), Math.floor(height / 22), type));
	tempGroup.add(createSquares(-width / 2 - offset, -height / 2, -width / 2 - offset, height / 2, -depth / 2, depth / 2, 0x000000, Math.floor(height / 22), Math.floor(height / 22), type));

	tempGroup.rotation.set(rx || 0, ry || 0, rz || 0);
	tempGroup.position.set(x, y, z);
	tempGroup.add(temp);
	return tempGroup;
}

function createSquares(x1, y1, x2, y2, z1, z2, Color, CountX, CountY, type) {
	var tempGroup = new THREE.Object3D();
	if (z1 == z2) {
		var lastx = x1
		var lasty = y1
		var xdiff = Math.min((x2 - x1) / CountX);
		var ydiff = Math.min((y2 - y1) / CountY);
		var offset = 2;
		for (var i = 1; i < CountX - 1; i++) {
			for (var j = 2; j < CountY - 1; j++) {
				if (type != 1 && (i < CountY / 3 || i > 2 / 3 * CountY)) {
					var shift = -0;
					if (i > 2 / 3 * CountY) shift = 0;
					if (j % (type || 2) != 0)
						tempGroup.add(createSquare(lastx + xdiff * i + shift, lasty + ydiff * j, lastx + xdiff * (i + 1) - offset + shift, lasty + ydiff * (j + 1) - offset, z1, z2, Color));
				} else
					tempGroup.add(createSquare(lastx + xdiff * i, lasty + ydiff * j, lastx + xdiff * (i + 1) - offset, lasty + ydiff * (j + 1) - offset, z1, z2, Color));
			};
		};
		tempGroup.add(createSquare(x1 + (x2 - x1) * 2 / 5, y1, x1 + (x2 - x1) * 3 / 5, y1 + ydiff, z1, z2, Color));
	} else if (x1 == x2) {

		var lastz = z1
		var lasty = y1
		var zdiff = Math.min((z2 - z1) / CountX);
		var ydiff = Math.min((y2 - y1) / CountY);
		var offset = 2;

		for (var i = 1; i < CountX - 1; i++) {
			for (var j = 2; j < CountY - 1; j++) {
				if (type != 1 && (i < (CountY / 3 - 1) || i > 2 / 3 * CountY)) {
					var shift = -10;
					if (i > 2 / 3 * CountY) shift = 10;
					if (j % (type || 2) != 0)
						tempGroup.add(createSquare(x1, lasty + ydiff * j, x2, lasty + ydiff * (j + 1) - offset, lastz + zdiff * i + +shift, lastz + zdiff * (i + 1) - offset + shift, Color));
				} else
					tempGroup.add(createSquare(x1, lasty + ydiff * j, x2, lasty + ydiff * (j + 1) - offset, lastz + zdiff * i, lastz + zdiff * (i + 1) - offset, Color));
			};
		};
		tempGroup.add(createSquare(x1, y1, x2, y1 + ydiff, z1 + (z2 - z1) * 2 / 5, z1 + (z2 - z1) * 3 / 5, Color));
	}
	return tempGroup;
}

function createSquare(x1, y1, x2, y2, z1, z2, Color) {
	var square = new THREE.Geometry();
	if (z1 == z2) {
		square.vertices.push(new THREE.Vector3(x1, y2, z1));
		square.vertices.push(new THREE.Vector3(x1, y1, z1));
		square.vertices.push(new THREE.Vector3(x2, y1, z1));
		square.vertices.push(new THREE.Vector3(x2, y2, z1));
	} else if (x1 == x2) {
		square.vertices.push(new THREE.Vector3(x1, y2, z1));
		square.vertices.push(new THREE.Vector3(x1, y1, z1));
		square.vertices.push(new THREE.Vector3(x1, y1, z2));
		square.vertices.push(new THREE.Vector3(x1, y2, z2));
	}

	square.faces.push(new THREE.Face3(0, 1, 2));
	square.faces.push(new THREE.Face3(0, 3, 2));
	return new THREE.Mesh(square, new THREE.MeshBasicMaterial({
		color: Color,
		side: THREE.DoubleSide
	}));
}

function drawSimpleSkybox() {
	// define path and box sides images
	var path = '1/';
	var sides = [path + 'sbox_px.jpg', path + 'sbox_nx.jpg', path + 'sbox_py.jpg', path + 'sbox_ny.jpg', path + 'sbox_pz.jpg', path + 'sbox_nz.jpg'];

	// load images
	var scCube = THREE.ImageUtils.loadTextureCube(sides);
	scCube.format = THREE.RGBFormat;

	// prepare skybox material (shader)
	var skyShader = THREE.ShaderLib["cube"];
	skyShader.uniforms["tCube"].value = scCube;
	var skyMaterial = new THREE.ShaderMaterial({
		fragmentShader: skyShader.fragmentShader,
		vertexShader: skyShader.vertexShader,
		uniforms: skyShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
			//opacity: 0.10,
			//transparent: true
	});

	// create Mesh with cube geometry and add to the scene
	var skyBox = new THREE.Mesh(new THREE.BoxGeometry(1200, 1200, 1200), skyMaterial);
	skyBox.scale.set(2, 2, 2);

	skyMaterial.needsUpdate = true;
	scene.add(skyBox);
}

function drawSimpleMirror2() {
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;

	// camera
	var VIEW_ANGLE = 45;
	var ASPECT = WIDTH / HEIGHT;
	var NEAR = 1;
	var FAR = 50000;
	var planeGeo = new THREE.PlaneGeometry(100.1, 100.1);
	camera2 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera2.position.set(0, 75, 160);
	verticalMirror = new THREE.Mirror(renderer, camera2, {
		clipBias: 0.003,
		textureWidth: WIDTH,
		textureHeight: HEIGHT,
		color: 0x889999
	});

	var verticalMirrorMesh = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), verticalMirror.material);
	verticalMirrorMesh.add(verticalMirror);
	verticalMirrorMesh.position.y = 75;
	verticalMirrorMesh.position.z = -45;
	verticalMirrorMesh.scale.set(5, 5, 5);
	group.add(verticalMirrorMesh);
}

function drawSimpleMirror() {
	mCubeCamera = new THREE.CubeCamera(0.1, 10000, 1000); // near, far, cubeResolution
	scene.add(mCubeCamera);

	// create mirror material and mesh
	var mirrorCubeMaterial = new THREE.MeshBasicMaterial({
		envMap: this.mCubeCamera.renderTarget,
		side: THREE.DoubleSide
	});
	mCube = new THREE.Mesh(new THREE.BoxGeometry(500, 500, 5, 1, 1, 1), mirrorCubeMaterial);
	mCube.position.set(-500, 0, -500);
	mCube.rotation.set(0, 25 * Math.PI / 180, 0);
	mCubeCamera.position.set(-500, 0, -500);
	mCubeCamera.rotation.set(0, 25 * Math.PI / 180, 0);
	//mCubeCamera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(this.mCube);
	scene.add(mCube);
}