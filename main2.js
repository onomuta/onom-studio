Math.degrees = function(radian){
  if(isNaN(radian)){
     return NaN;
  }
  return radian * 360/(2*Math.PI);
}

function init() {
  var scene = new THREE.Scene();
  var frame = 0;
  var canvasWidth = 1280;
  var canvasHeight = 720;
  var width  = canvasWidth;
  var height = canvasHeight;

  var time = 0;
  var duration = 100;

  var exportFlg = false;

  // GUI ===============================================================
    var ctrl = new function() {
      this.f1_count = 300;
      this.f1_sizeX = 1.0;
      this.f1_sizeY = 1.0;
      this.f1_sizeZ = 10.0;
      this.f1_color1 = "#ffffff";
      this.f1_color2 = "#ff0000";
      
      


      this.TEXT = "ELEMOG";   
      this.size = 1.5;
      this.color = "#ff0033";
      this.color2 = "#ffffff";
      this.duration = 180;

      this.export = function() { exportFlg = true};
    };

    var gui = new dat.GUI();

    var f1 = gui.addFolder('Particle');
    var f1_count = f1.add(ctrl, 'f1_count', 0, 5000);
    var f1_sizeX = f1.add(ctrl, 'f1_sizeX', 0.1, 50);
    var f1_sizeY = f1.add(ctrl, 'f1_sizeY', 0.1, 50);
    var f1_sizeZ = f1.add(ctrl, 'f1_sizeZ', 0.1, 50);
    var f1_color1 = f1.addColor(ctrl, 'f1_color1');
    var f1_color2 = f1.addColor(ctrl, 'f1_color2');
    



    var controllerTEXT = gui.add(ctrl, 'TEXT');
    gui.add(ctrl, 'size', 0.5, 2);
    var controllerCOLOR1 = gui.addColor(ctrl, 'color');
    var controllerCOLOR2 = gui.addColor(ctrl, 'color2');
    // gui.add(ctrl, 'speed', 0, 2);
    gui.add(ctrl, 'duration', 10, 600);
    gui.add(ctrl, 'export');

    textMaterial1 = new THREE.MeshStandardMaterial( { color: ctrl.color } );
    textMaterial2 = new THREE.MeshStandardMaterial( { color: ctrl.color2 } );
    textMaterials = [textMaterial1,textMaterial2];

  // Renderer =========================================================
    var renderer = new THREE.WebGLRenderer({
      canvas:document.getElementById('myCanvas'),
      antialias: true
    });

    var ctx = document.getElementById('myCanvas2').getContext('2d');
    ctx.font = "48px serif";
  
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.shadowMap.enabled = true;
		renderer.domElement.id = 'three';
    // document.body.appendChild( renderer.domElement );
    
    var textMaterial1 = new THREE.MeshStandardMaterial( { color: ctrl.color } );
    var textMaterial2 = new THREE.MeshStandardMaterial( { color: ctrl.color2 } );
    textMaterial1.needsUpdate = true;
    textMaterial2.needsUpdate = true;
    var textMaterials = [textMaterial1,textMaterial2];
    textMaterials.needsUpdate = true;
  
  // Camera ===========================================================
    var fov    = 90;
    var aspect = width / height;
    var near   = 1;
    var far    = 4000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 100 );
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    scene.fog = new THREE.Fog(0x000000, 0.25, 100);

  // Light =============================================================
    var topLight = new THREE.DirectionalLight(0xffffff);
    topLight.position.set(30, 30, 100);
    scene.add( topLight ); 
    
    // 部屋全体を照らすライト
    var ambient = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambient);
	


  // CUBE==========================================
    // 立方体
    var boxGeometry = new THREE.BoxGeometry( 0.4, 0.4, 15 );
    var boxMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff} );


    var particleMaterial1 = new THREE.MeshStandardMaterial( {color: ctrl.f1_color1});
    var particleMaterial2 = new THREE.MeshStandardMaterial( {color: ctrl.f1_color2});
    var particleBoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    
    var particleCubeCount = ctrl.f1_count;　// 生成するcubeの数
    var particleCube = [];
    for(var i = 0; i < particleCubeCount; i++) {
      if(i % 2 == 0 ){
        particleCube[i] = new THREE.Mesh( particleBoxGeometry, particleMaterial1 );
      }else{
        particleCube[i] = new THREE.Mesh( particleBoxGeometry, particleMaterial2 );
      }
      particleCube[i].position.x = ( Math.random() - 0.5 ) * 130;
      particleCube[i].position.y = ( Math.random() - 0.5 ) * 130;
      scene.add(particleCube[i]);
    }

    var spiralCubeCount = 50;　// 生成するcubeの数
    var spiralCube = [];
    for(var i = 0; i < spiralCubeCount; i++) {
      spiralCube[i] = new THREE.Mesh( boxGeometry, boxMaterial);
      // spiralCube[i].castShadow = true;
      // spiralCube[i].rotation.x = Math.cos(i * 2 * Math.PI /spiralCubeCount);
      // spiralCube[i].rotation.y = Math.cos(i * 2 * Math.PI /spiralCubeCount);
      spiralCube[i].position.x = Math.cos(i * 2 * Math.PI /spiralCubeCount) * 20 ;
      spiralCube[i].position.y = Math.sin(i * 2 * Math.PI /spiralCubeCount) * 20 ;
      scene.add(spiralCube[i]);
    }


    var ringGeometry = new THREE.TorusBufferGeometry( 5, 0.4, 8, 32 );
    var material = new THREE.MeshPhongMaterial( { 
      color: 0xffff00,
      flatShading:true
    } );
    var ring = new THREE.Mesh( ringGeometry, material );


    var ringCount = 5;　// 生成するcubeの数
    var ring = [];
    for(var i = 0; i < spiralCubeCount; i++) {
      ring[i] = new THREE.Mesh( ringGeometry, material );
      scene.add(ring[i]);
    }

  // Object ____________________________________________________

  function anim(){

    // boxMesh2.position.z = ((time + 0.5)%1) * 200;
    // textMesh.position.x = ctrl.posX;
    // textMesh.scale.set(ctrl.size,ctrl.size,ctrl.size);
    // textMesh.position.y = (ctrl.size * -10) +3;
    // scene.rotation.y = Math.tween.Cubic.easeInOut(time,0,1,1) * ( Math.PI / 180 ) *360 ;    


    for(var i = 0; i < particleCubeCount; i++) {
      particleCube[i].scale.x = ctrl.f1_sizeX;
      particleCube[i].scale.y = ctrl.f1_sizeY;
      particleCube[i].scale.z = ctrl.f1_sizeZ;
      // scene.add(particleCube[i]);
    }

    for(var i = 0; i < spiralCubeCount; i++) {
      // spiralCube[i].rotation.y += i / 25000 * Math.PI;
      // spiralCube[i].rotation.x += i / 25000 * Math.PI;
      spiralCube[i].position.z = ((time + i/spiralCubeCount)%1) * 100;
    }


    for(var i = 0; i < particleCubeCount; i++) {
      // spiralCube[i].rotation.y += i / 25000 * Math.PI;
      // spiralCube[i].rotation.x += i / 25000 * Math.PI;
      particleCube[i].position.z = ((time + i/particleCubeCount)%1) * 100;
    }

    for(var i = 0; i < ringCount; i++) {
      ring[i].position.z = ((time + i/ringCount)%1) * 100;
    }

    // camera shake ========
    // camera.position.x = Math.sin(time * 6.25)* 4;
    // camera.position.y = Math.sin(time * 6.25)* 5;
  }





  function updatePar(){
    particleMaterial1 = new THREE.MeshStandardMaterial( {color: ctrl.f1_color1});
    particleMaterial2 = new THREE.MeshStandardMaterial( {color: ctrl.f1_color2});



    particleMaterial1.needsUpdate = true;
    particleMaterial2.needsUpdate = true;
    for(var i = 0; i < particleCubeCount; i++) {
      scene.remove(particleCube[i]);
    }
    particleCubeCount = ctrl.f1_count;　// particleの数を更新
    for(var i = 0; i < particleCubeCount; i++) {
      if(i % 2 == 0){
        particleCube[i] = new THREE.Mesh( particleBoxGeometry, particleMaterial1 );
      }else{
        particleCube[i] = new THREE.Mesh( particleBoxGeometry, particleMaterial2 );
      }
      particleCube[i].position.x = ( Math.random() - 0.5 ) * 130;
      particleCube[i].position.y = ( Math.random() - 0.5 ) * 130;
      scene.add(particleCube[i]);
    }
  }
  f1_count.onChange (function(value){ updatePar(); });
  f1_color1.onChange(function(value){ updatePar(); });
  f1_color2.onChange(function(value){ updatePar(); });





  var exportStart = false;

  // Run ________________________________________________________
  function render(){
    requestAnimationFrame(render);     
    duration = Math.round(ctrl.duration);
    
    if(exportFlg == true){
      if(exportStart == false){
        frame = 0;
        exportStart = true;
      }
    }

    time = (frame / duration);  

    if(time >= 1){
      frame = 0;
      exportFlg = false;
      exportStart = false;
    }

    anim();    
    renderer.render(scene, camera);
    saveFrame();
    
    frame++;
  };
  render();

  //保存処理 ______________________________________________________
  var renderA = document.createElement('a');
  // 生成する文字列に含める文字セット
  var c = "abcdefghijklmnopqrstuvwxyz";
  var cl = c.length;
  var r = "";
  for(var i=0; i<4; i++){
    r += c[Math.floor(Math.random()*cl)];
  }
  function saveFrame(){
    if(exportFlg == true){
      
      progress();
      var canvas  = document.getElementById('three');
      renderA.href = canvas.toDataURL();
      renderA.download = r + '_' + ( '000' + frame ).slice( -4 ) + '.png';
      renderA.click();
    }
  }


  function progress(){
    ctx.fillStyle = ("#ffffff");
    ctx.fillRect(0,0,1000,100);
    ctx.fillStyle = ("#000000");      
    ctx.fillText(frame + 1 + "/" + duration, 10, 40 );
  }

}
window.onload = init();