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
      this.TEXT = "ELEMOG";   
      this.size = 1.5;
      this.posX = -82;
      this.color = "#ff0033";
      this.color2 = "#ffffff";
      this.duration = 180;

      this.export = function() { exportFlg = true};
    };

    var gui = new dat.GUI();

    var controllerTEXT = gui.add(ctrl, 'TEXT');
    gui.add(ctrl, 'posX', -100, 0);

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
	


//  CUBE==========================================
    // 立方体
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    var boxMaterial = new THREE.MeshStandardMaterial( {color: 0xffaa00} );
    var boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
    boxMesh.position.x = 10;
    scene.add( boxMesh );



    var NUM = 189;　// 生成するcubeの数
    var cube = [];

    for(var i = 0; i < NUM; i++) {
      cube[i] = new THREE.Mesh( boxGeometry, boxMaterial);
      cube[i].castShadow = true;
      // cube[i].rotation.x = i / 10*Math.PI;
      // cube[i].rotation.y = i / 10*Math.PI;
      cube[i].position.x = i - NUM/2 ;
      cube[i].position.x = Math.cos(i / 10) * 10 ;
      cube[i].position.y = Math.sin(i / 10) * 10 ;
      scene.add(cube[i]);
    }


    
  

  // Object ____________________________________________________

  function anim(){
    duration = ctrl.duration-1;  
    
    boxMesh.position.z = time * 200;
    // boxMesh2.position.z = ((time + 0.5)%1) * 200;
    
    // textMesh.position.x = ctrl.posX;
    // textMesh.scale.set(ctrl.size,ctrl.size,ctrl.size);
    // textMesh.position.y = (ctrl.size * -10) +3;

    // scene.rotation.y = Math.tween.Cubic.easeInOut(time,0,1,1) * ( Math.PI / 180 ) *360 ;    




    for(var i = 0; i < NUM; i++) {
      // cube[i].rotation.y += i / 25000 * Math.PI;
      // cube[i].rotation.x += i / 25000 * Math.PI;

      cube[i].position.z = ((time + i/NUM)%1) * 100;
      
    }




    // camera shake ========
    // camera.position.x = Math.sin(time * 6.25)* 4;
    // camera.position.y = Math.sin(time * 6.25)* 5;
  }


  var exportStart = false;

  // Run ________________________________________________________
  function render(){
    
    if(exportFlg == true){
      if(exportStart == false){
        frame = 0;
        exportStart = true;
      }
    }

    if(time >= 1){
      frame = 0;
      exportFlg = false;
      exportStart = false;
    }

    time = (frame / duration);  
    
    anim();    
    renderer.render(scene, camera);
    saveFrame();

    frame++;

    requestAnimationFrame(render);     
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
      var canvas  = document.getElementById('three');
      renderA.href = canvas.toDataURL();
      renderA.download = r + '_' + ( '000' + frame ).slice( -4 ) + '.png';
      renderA.click();
    }
  }


  


}
window.onload = init();