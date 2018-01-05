Math.degrees = function(radian){
  if(isNaN(radian)){
     return NaN;
  }
  return radian * 360/(2*Math.PI);
}

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

function init() {
  var scene = new THREE.Scene();
  var frame = 0;
  var canvasWidth = 1280;
  var canvasHeight = 720;
  var width  = canvasWidth;
  var height = canvasHeight;

  var time = 0;
  var duration;

  var exportFlg = false;

  // GUI ===============================================================
    var ctrl = new function() {
      this.f1_count = 0;  /////////////
      this.f1_sizeX = 1.0;
      this.f1_sizeY = 1.0;
      this.f1_sizeZ = 10.0;
      this.f1_color1 = "#ffffff";
      this.f1_color2 = "#ff0000";

      this.f2_count = 0; /////////////
      this.f2_size = 5;
      this.f2_width = 0.5;
      this.f2_color = "#ffffff";
      this.f2_Segments = 8;
      
      this.f3_count = 200;
      this.f3_size = 1;
      

      
      this.TEXT = "ELEMOG";   
      this.size = 1.5;
      this.color = "#ff0033";
      this.color2 = "#ffffff";
      this.duration = 600;

      this.export = function() { exportFlg = true};
    };

    var gui = new dat.GUI();

    var f1 = gui.addFolder('Particle');
    f1.open();
    var f1_count = f1.add(ctrl, 'f1_count', 0, 5000);
    var f1_sizeX = f1.add(ctrl, 'f1_sizeX', 0.1, 50);
    var f1_sizeY = f1.add(ctrl, 'f1_sizeY', 0.1, 50);
    var f1_sizeZ = f1.add(ctrl, 'f1_sizeZ', 0.1, 50);
    var f1_color1 = f1.addColor(ctrl, 'f1_color1');
    var f1_color2 = f1.addColor(ctrl, 'f1_color2');
    
    var f2 = gui.addFolder('Ring');
    f2.open();
    var f2_count = f2.add(ctrl, 'f2_count', 0, 10);
    var f2_size = f2.add(ctrl, 'f2_size', 0, 15);
    var f2_width = f2.add(ctrl, 'f2_width', 0.1, 4);
    var f2_Segments = f2.add(ctrl, 'f2_Segments', 3, 64);
    var f2_color = f2.addColor(ctrl, 'f2_color');
    
    var f3 = gui.addFolder('Spiral');
    f3.open();
    var f3_count = f3.add(ctrl, 'f3_count', 0, 400);
    var f3_size = f3.add(ctrl, 'f3_size', 0.8, 3);
    


    // var controllerTEXT = gui.add(ctrl, 'TEXT');
    // gui.add(ctrl, 'size', 0.5, 2);
    // var controllerCOLOR1 = gui.addColor(ctrl, 'color');
    // var controllerCOLOR2 = gui.addColor(ctrl, 'color2');
    // gui.add(ctrl, 'speed', 0, 2);

    var f0 = gui.addFolder('Export');
    f0.open();
    f0.add(ctrl, 'duration', 10, 600);
    f0.add(ctrl, 'export');

    textMaterial1 = new THREE.MeshStandardMaterial( { color: ctrl.color } );
    textMaterial2 = new THREE.MeshStandardMaterial( { color: ctrl.color2 } );
    textMaterials = [textMaterial1,textMaterial2];

  // Renderer =========================================================



    var myCanvas = document.getElementById('myCanvas');
  
  
  
    var renderer = new THREE.WebGLRenderer({
      canvas: myCanvas,
      antialias: true
    });



    myCanvas.style.width = "#BBCCDD";
    



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
    
    scene.fog = new THREE.Fog(0x000000, 0.01, 100);

  // Light =============================================================
    var topLight = new THREE.DirectionalLight(0xffffff);
    topLight.position.set(30, 30, 100);
    scene.add( topLight ); 
    
    // 部屋全体を照らすライト
    var ambient = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambient);
	
  // Particle==========================================

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
  // Spiral==========================================
    var spiralCount = ctrl.f3_count;　// 生成するcubeの数
    var spiral = [];
    var spiralGeometry = new THREE.BoxGeometry( 1, 10, 1 );    
    spiralGeometry.verticesNeedUpdate = true;
    spiralGeometry.elementsNeedUpdate = true;
    spiralGeometry.morphTargetsNeedUpdate = true;
    spiralGeometry.uvsNeedUpdate = true;
    spiralGeometry.normalsNeedUpdate = true;
    spiralGeometry.colorsNeedUpdate = true;
    spiralGeometry.tangentsNeedUpdate = true;
    var spiralMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff} );    
    for(var i = 0; i < spiralCount; i++) {
      
      spiral[i] = new THREE.Mesh( spiralGeometry, spiralMaterial);
      spiral[i].geometry.translate(0.5,0,0);
      spiral[i].rotation.z = Math.degrees((i / spiralCount)* 360);

      
      // spiral[i].rotation.x = Math.cos(i * 2 * Math.PI /spiralCount);
      // spiral[i].rotation.y = Math.cos(i * 2 * Math.PI /spiralCount);

      // spiral[i].position.x = Math.cos(i * 2 * Math.PI /spiralCount) * 20 * ctrl.f3_size ;
      // spiral[i].position.y = Math.sin(i * 2 * Math.PI /spiralCount) * 20 * ctrl.f3_size ;
      
      // spiral[i].position.x = 10 ;
      
      scene.add(spiral[i]);


    }

  // Ring==========================================
    var ringGeometry = new THREE.TorusBufferGeometry( ctrl.f2_size, ctrl.f2_width, 8, ctrl.f2_Segments );
    var ringMaterial = new THREE.MeshPhongMaterial( { 
      color: ctrl.f2_color,
      flatShading:true
    } );
    var ring = new THREE.Mesh( ringGeometry, ringMaterial );

    var ringCount = ctrl.f2_count;　// 生成するcubeの数
    var ring = [];
    for(var i = 0; i < ringCount; i++) {
      ring[i] = new THREE.Mesh( ringGeometry, ringMaterial );
      scene.add(ring[i]);
    }

  //====================================================================================
  // Anim ==============================================================================
  //====================================================================================
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
      }

      for(var i = 0; i < spiralCount; i++) {
        // spiral[i].rotation.y += i / 25000 * Math.PI;
        // spiral[i].rotation.x += i / 25000 * Math.PI;
        spiral[i].position.z = ((time + i/spiralCount)%1) * 100;
      }

      for(var i = 0; i < particleCubeCount; i++) {
        // spiralCube[i].rotation.y += i / 25000 * Math.PI;
        // spiralCube[i].rotation.x += i / 25000 * Math.PI;
        particleCube[i].position.z = ((time + i/particleCubeCount)%1) * 100;
      }

      for(var i = 0; i < ringCount; i++) {
        ring[i].position.z = ((time + i/Math.floor(ringCount))%1) * 100;
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

    function updateRing(){
      ringGeometry = new THREE.TorusBufferGeometry( ctrl.f2_size, ctrl.f2_width, 8, ctrl.f2_Segments );
      ringGeometry.verticesNeedUpdate = true;
      ringGeometry.elementsNeedUpdate = true;
      ringGeometry.morphTargetsNeedUpdate = true;
      ringGeometry.uvsNeedUpdate = true;
      ringGeometry.normalsNeedUpdate = true;
      ringGeometry.colorsNeedUpdate = true;
      ringGeometry.tangentsNeedUpdate = true;
      
      ringMaterial = new THREE.MeshStandardMaterial( {color: ctrl.f2_color, flatShading:true});
      ringMaterial.needsUpdate = true;
      for(var i = 0; i < ringCount; i++) {
        scene.remove(ring[i]);
      }
      ringCount = ctrl.f2_count;　// particleの数を更新
      for(var i = 0; i < ringCount; i++) {
        ring[i] = new THREE.Mesh( ringGeometry, ringMaterial );
        ring[i].rotation.z = Math.radians(90);
        scene.add(ring[i]);
      }
    }
    f2_count.onChange (function(value){ updateRing(); });
    f2_size.onChange (function(value){ updateRing(); });
    f2_width.onChange (function(value){ updateRing(); });
    f2_Segments.onChange (function(value){ updateRing(); });
    f2_color.onChange (function(value){ updateRing(); });
    

    function updateSpiral(){
      spiralMaterial = new THREE.MeshStandardMaterial( {color: ctrl.f1_color1});
      spiralMaterial.needsUpdate = true;
      for(var i = 0; i < spiralCount; i++) {
        scene.remove(spiral[i]);
      }
      spiralCount = ctrl.f3_count;　// spiralの数を更新
      spiralGeometry = new THREE.BoxGeometry( 10,0.5, 0.5 );
      for(var i = 0; i < spiralCount; i++) {
        spiral[i] = new THREE.Mesh( spiralGeometry, spiralMaterial );
        spiral[i].geometry.translate(0.05,0,0);
        spiral[i].rotation.z = Math.degrees((i / spiralCount)* 360);
      
        
        // spiral[i].position.x = Math.cos(i * 2 * Math.PI /spiralCount) * 20 * ctrl.f3_size ;
        // spiral[i].position.y = Math.sin(i * 2 * Math.PI /spiralCount) * 20 * ctrl.f3_size ;

        // spiral[i].rotation.x = Math.cos(i * 2 * Math.PI /spiralCount);
        // spiral[i].rotation.x = 2;
        // spiral[i].scale.y = Math.radians(40)*11;

        // spiral[i].geometry.translate(0.05,0,0);
        // spiral[i].position.x = 10 ;
        spiral[i].rotation.z = Math.degrees((i / spiralCount)* 360);
        // spiral[i].scale.x = ctrl.f3_size ;
        // spiral[i].scale.y = ctrl.f3_size ;
        // spiral[i].scale.z = ctrl.f3_size ;
        
        scene.add(spiral[i]);
      }
    }
    f3_count.onChange (function(value){ updateSpiral(); });
    f3_size.onChange (function(value){ updateSpiral(); });
    // f1_color1.onChange(function(value){ updateSpiral(); });
    // f1_color2.onChange(function(value){ updateSpiral(); });






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
  myCanvas.style.width = "100%";
  myCanvas.style.height = "initial";
}
window.onload = init();