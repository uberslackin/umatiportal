extends ../layout
block content
  .pb-2.mt-2.mb-4.border-bottom
    h3 forWard Sign up
  form(id='ward-signup-form', method='POST')
    input(type='hidden', name='_csrf', value=_csrf)
    input(type='hidden', name='group', value='Ward Food Logistics')

    .form-group.row
      .col-md-12
        form#gui
        | Scale
        input#scale(type="range", name="Scale", min="50", max="400", value="60")
        | Lat
        input#long(type="range", name="long", min="-90", max="90", value="0")
        | Long
        input#lat(type="range", name="lat", min="-180", max="180", value="0")
        | Color
        input#color(type="range", name="color", min="380", max="740", value="0")
        | Depth
        input#depth(type="range", name="depth", min="-1", max="99", value="0")
        br
        #WebGL-output(style="height:100px;")
        script(src='/js/three.js')
        script(type="text/javascript").
	
          var renderer, scene, camera;
          function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(22.15, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(new THREE.Color(0xEEEEEE));
            renderer.setSize(window.innerWidth/2, window.innerHeight/2);
            var sphereGeometry = new THREE.SphereGeometry(10, 10, 10);
            var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x3222ff, wireframe: true});
            var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            scene.add(sphere);
            camera.position.x = -30;
            camera.position.y = 40;
            camera.position.z = 30;
            camera.lookAt(scene.position);
            resize();
            window.onresize = resize;
            document.getElementById("WebGL-output").appendChild(renderer.domElement);
          }

          function animate() {
            var scale = document.getElementById( "scale" ).value / 100;
            scene.scale.x = scene.scale.y = scene.scale.z = scale;
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          }

          function resize() {
          var aspect = window.innerWidth / window.innerHeight;
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
          }

          init();
          animate();

    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='name') Name (or nic-name)
      .col-md-7
        input.form-control(type='text', name='name', id='name', placeholder='Name', autofocus, autocomplete='name', required)
    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='contactmethod') Preferred contact method:
      .col-md-7
        .btn-group(data-toggle="buttons")
          label.btn.btn-outline-info
            input(type="radio", name="pickupboulder", id="pickupboulder", value="smstext", autocomplete="off")
            | SMS Text Message
          label.btn.btn-outline-info
            input(type="radio", name="delivery", id="delvery", value="phonecall", autocomplete="off")
            | Phone Call
          label.btn.btn-outline-info
            input(type="radio", name="delivery", id="delvery", value="snailmail", autocomplete="off")
            | Snail Mail
          label.btn.btn-outline-info
            input(type="radio", name="delivery", id="delvery", value="town", autocomplete="off")
            | Town Bulletin Board
          label.btn.btn-outline-info
            input(type="radio", name="delivery", id="delvery", value="yodeling", autocomplete="off")
            | Yodeling
    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='phone') Cell #
      .col-md-7
        input.form-control(type='number', name='phone', id='phone', placeholder='Phone', autofocus, autocomplete='phone', required)
    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='email') Email
      .col-md-7
        input.form-control(type='email', name='email', id='email', placeholder='Email', autofocus, autocomplete='email', required)
    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='password') Password
      .col-md-7
        input.form-control(type='password', name='password', id='password', placeholder='Password', autocomplete='new-password', minlength='8', required)
    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='confirmPassword') Confirm Password
      .col-md-7
        input.form-control(type='password', name='confirmPassword', id='confirmPassword', placeholder='Confirm Password', autocomplete='new-password', minlength='8', required)
    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='pickupneed') 1. Do you have surplus/donations that need to be picked up?
      .col-md-7
        .btn-group(data-toggle="buttons")
          label.btn.btn-outline-success
            input(type="radio", value="no", autocomplete="off")
            | yes
          label.btn.btn-outline-success
            input(type="radio", value="regular_pickups", autocomplete="off")
            | schedule regular pickups
          label.btn.btn-outline-success
            input(type="radio", value="no", autocomplete="off")
            | not at this time
    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='specificitem') Specific item request
      .col-md-7
        input.form-control(type='text', name='specificitem', id='specificitem', placeholder='Whatever you may need', autofocus, autocomplete='specificitem', required)

    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='specificitem') Desired role(s):
      .col-md-7
        .btn-group(data-toggle="buttons")
          label.btn.btn-outline-info
            input(type="checkbox", name="pickupboulder", id="pickupboulder", autocomplete="off")
            | Pickups in Boulder

          label.btn.btn-outline-info
            input(type="checkbox", name="delivery", id="delvery", autocomplete="off")
            | Delivery

          label.btn.btn-outline-info
            input(type="checkbox", name="materials_swap", id="materials_swap", autocomplete="off")
            | Materials swap

          label.btn.btn-outline-info
            input(type="checkbox", name="research", id="research", autocomplete="off")
            | Opportunity Researcher

    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='specificitem') Have system notify you when avaiable:
      .col-md-7
        .btn-group(data-toggle="buttons")
          label.btn.btn-outline-warning
            input(type="checkbox", autocomplete="off")
            | Building supplies

          label.btn.btn-outline-warning
            input(type="checkbox", autocomplete="off")
            | Compost

          label.btn.btn-outline-warning
            input(type="checkbox", autocomplete="off")
            | Compost pickup

          label.btn.btn-outline-warning
            input(type="checkbox", selected, autocomplete="off")
            | Household Items

    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='specificitem') 
      .col-md-7
        .btn-group(data-toggle="buttons")
          label.btn.btn-outline-danger
            input(type="checkbox", autocomplete="off")
            | Tools

          label.btn.btn-outline-danger
            input(type="checkbox", autocomplete="off")
            | Clothing

          label.btn.btn-outline-danger
            input(type="checkbox", autocomplete="off")
            | Plants

          label.btn.btn-outline-danger
            input(type="checkbox", selected, autocomplete="off")
            | Books

    .form-group.row
      label.col-md-3.col-form-label.font-weight-bold.text-right(for='specificitem') 
      .col-md-7
        .btn-group(data-toggle="buttons")
          label.btn.btn-outline-success
            input(type="checkbox", autocomplete="off")
            | Cat Food

          label.btn.btn-outline-success
            input(type="checkbox", autocomplete="off")
            | Dog Food


    .form-group.offset-sm-3.col-md-7.pl-2
      button.btn.btn-primary(type='submit')
        i.fas.fa-user-plus.fa-sm
        | Got it!


    style.

       input[type=radio], input[type=checkbox] {
         margin: 4px 0 0;
         margin-top: 1px \9;
         line-height: normal;
       }
