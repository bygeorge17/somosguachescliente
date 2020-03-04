
var urlSignUp=ipServer+"/registrarusuario";
new Vue({
  el:"#registrosomosguaches",
  created:function(){
    // this.getposts();
  },
  data:{
    titulo:"Hola Mundo VUEjs",
    posts:[],
    regName:"",
    regLast:"",
    regDia:"",
    regMes:"",
    regYear:"",
    regSexo:"",
    regEstado:"",
    regMpio:"",
    regRadica:"",
    regUsuario:"",
    regPassword:""
  },
  methods:{
    signUp: async function(e){
      await axios.post(urlSignUp,{
        nombre : this.regName,
        apellidos : this.regLast,
        sexo : this.regSexo,
        dia:this.regDia,
        mes:this.regMes,
        year:this.regYear,
        municipio:this.regMpio,
        estado:this.regEstado,
        radica:this.regRadica,
        usuario:this.regUsuario,
        contrasena:this.regPassword}).then((respuesta)=>{
          console.log(respuesta);
          if (respuesta.data.auth) {
            localStorage.token=respuesta.data.token;
            window.location.href = "./publicaciones.html";
          }
        }
      );
    }
  }
});
$(function(){
  var date=new Date();
  var year=date.getFullYear();
  for (var i = year-15; i > 1940; i--) {
    $("#regYear").append('<option value='+i+'>'+i+'</option>');
  }
  $("#regEstado").change(function(){
    if ($("#regEstado").val()=="Guerrero") {
      $('#regMpio')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Municipio</option>')
      .val('');
      $("#regMpio").append('<option value=Ajuchitlan del Progreso>Ajuchitlan del Progreso</option>');
      $("#regMpio").append('<option value=Arcelia>Arcelia</option>');
      $("#regMpio").append('<option value="Coyuca de Catalan">Coyuca de Catalan</option>');
      $("#regMpio").append('<option value="Cutzamala de Pinzon">Cutzamala de Pinzon</option>');
      $("#regMpio").append('<option value=Pungarabato>Pungarabato</option>');
      $("#regMpio").append('<option value="San Miguel Totolapan">San Miguel Totolapan</option>');
      $("#regMpio").append('<option value=Tlalchapa>Tlalchapa</option>');
      $("#regMpio").append('<option value=Zirandaro>Zirandaro</option>');
    }
    if ($("#regEstado").val()=="EstadodeMexico") {
      $('#regMpio')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Municipio</option>')
      .val('');
      $("#regMpio").append('<option value=Amatepec>Amatepec</option>');
      $("#regMpio").append('<option value=Tlatlaya>Tlatlaya</option>');
      $("#regMpio").append('<option value=Sultepec>Sultepec</option>');
      $("#regMpio").append('<option value=Tejupilco>Tejupilco</option>');
      $("#regMpio").append('<option value=Luvianos>Luvianos</option>');
      $("#regMpio").append('<option value="San Simon de Guerrero">San Simon de Guerrero</option>');
      $("#regMpio").append('<option value="Almoloya de Alquisiras">Almoloya de Alquisiras</option>');
      $("#regMpio").append('<option value=Zacualpan>Zacualpan</option>');
    }
    if ($("#regEstado").val()=="Michoacan") {
      $('#regMpio')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Municipio</option>')
      .val('');
      $("#regMpio").append('<option value=Huetamo>Huetamo</option>');
      $("#regMpio").append('<option value=Nocupetaro>Nocupetaro</option>');
      $("#regMpio").append('<option value="San Lucas">San Lucas</option>');
      $("#regMpio").append('<option value=Tiquicheo>Tiquicheo</option>');
      $("#regMpio").append('<option value=Paracuaro>Paracuaro</option>');
      $("#regMpio").append('<option value=Tuzantla>Tuzantla</option>');
      $("#regMpio").append('<option value="La Huacana">La Huacana</option>');
      $("#regMpio").append('<option value=Tepalcatepec>Tepalcatepec</option>');
      $("#regMpio").append('<option value=Apatzingan>Apatzingan</option>');
      $("#regMpio").append('<option value=Lombardia>Lombardia</option>');
      $("#regMpio").append('<option value=Churumuco>Churumuco</option>');
      $("#regMpio").append('<option value=Turicato>Turicato</option>');
      $("#regMpio").append('<option value="Nuevo Urecho">Nuevo Urecho</option>');
      $("#regMpio").append('<option value=Aguililla>Aguililla</option>');
      $("#regMpio").append('<option value="Caracuaro de Morelos">Caracuaro de Morelos</option>');
      $("#regMpio").append('<option value="Nueva Italia">Nueva Italia</option>');
      $("#regMpio").append('<option value=Buenavista>Buenavista</option>');
    }
  });
  var valRegName,valRegLast,valRegSexo,valRegFecha,valRegMpio,valRegEdo,valRegRadica,valRegUsuario,valRegPassword,valConfirmarContrasena;
  $("#goHome").click(function(){
    window.location.href="../index.html";
  });
  $("#btn-registrar").mouseenter(function(){
    validarVariables();
    validar();
  });
  $("#regName").keyup(function(){
    console.log("Escribiendo nombre");
    validarNombre();
    validar();
  });
  $("#regLast").keyup(function(){
    validarApellidos();
    validar();
  });
  $("#regDia").change(function(){
    validarFechaNacimiento();
    validar();
  });
  $("#regMes").change(function(){
    validarFechaNacimiento();
    validar();
  });
  $("#regYear").change(function(){
    validarFechaNacimiento();
    validar();
  });
  $("input[type='radio']").click(function(){
    validarSexo();
    validar();
  });
  $("#regEdo").change(function(){
    validarEdoMpio();
    validar();
  });
  $("#regMpio").change(function(){
    validarEdoMpio();
    validar();
  });
  $("#regRadica").keyup(function(){
    validarRadica();
    validar();
  });
  $("#regUsuario").keyup(function(){
    validarUsuario();
    validar();
  });
  $("#regPassword").keyup(function(){
    validarContrasena();
    validar();
  })
  $("#regRepPassword").keyup(function(){
    confirmarContrasena();
    validar();
  })
  function validarNombre(){
    // Validamos el campo nombre
    if ($("#regName").val()!="") {
      valRegName=true;
      $("#alertName").addClass('d-none');
      $("#alertName").removeClass('d-inline-block');
    }else{
      valRegName=false;
      $("#alertName").addClass('d-inline-block');
      $("#alertName").removeClass('d-none');
    }
  }
  function validarApellidos(){
    // Validamos el campo apellidos
    if ($("#regLast").val()!="") {
      valRegLast=true;
      $("#alertLast").addClass('d-none');
      $("#alertLast").removeClass('d-inline-block');
    }else{
      valRegLast=false;
      $("#alertLast").addClass('d-inline-block');
      $("#alertLast").removeClass('d-none');
    }
  }
  function validarFechaNacimiento(){
    // Validamos la fecha de nacimiento
    if ($("#regDia").val()!=""||$("#regMes").val()!=""||$("#regYear").val()!="") {
      valRegFecha =true;
      $("#alertFecha").addClass('d-none');
      $("#alertFecha").removeClass('d-inline-block');
    }else{
      valRegFecha=false;
      $("#alertFecha").addClass('d-inline-block');
      $("#alertFecha").removeClass('d-none');
    }
  }
  function validarSexo(){
    // Validamos el campo sexo
    if ($("input:radio[name='regSexo']").is(":checked")) {
      console.log("Se ha elegido un sexo");
      valRegSexo=true;
      $("#alertSexo").addClass('d-none');
      $("#alertSexo").removeClass('d-inline-block');
    }else{
      valRegSexo=false;
      $("#alertSexo").addClass('d-inline-block');
      $("#alertSexo").removeClass('d-none');
    }
  }
  function validarEdoMpio(){
    // Validamos los campos estado y municipio
    if ($("#regEdo").val()!="") {
      valRegEdo=true;
      $("#alertEdoMpio").addClass('d-none');
      $("#alertEdoMpio").removeClass('d-inline-block');
    }else{
      valRegEdo=false;
      $("#alertEdoMpio").addClass('d-inline-block');
      $("#alertEdoMpio").removeClass('d-none');
    }

    if ($("#regMpio").val()!="") {
      valRegMpio=true;
      $("#alertEdoMpio").addClass('d-none');
      $("#alertEdoMpio").removeClass('d-inline-block');
    }else{
      valRegMpio=false;
      $("#alertEdoMpio").addClass('d-inline-block');
      $("#alertEdoMpio").removeClass('d-none');
    }
  }
  function  validarRadica(){
    // Validamos el campo radica
    if ($("#regRadica").val()!="") {
      valRegRadica=true;
      $("#alertRadica").addClass('d-none');
      $("#alertRadica").removeClass('d-inline-block');
    }else{
      valRegRadica=false;
      $("#alertRadica").addClass('d-inline-block');
      $("#alertRadica").removeClass('d-none');
    }
  }
  function  validarUsuario(){
    // Validamos el campo usuario
    if ($("#regUsuario").val()!="") {
      valRegUsuario=true;
      $("#alertUsuario").addClass('d-none');
      $("#alertUsuario").removeClass('d-inline-block');
    }else{
      valRegUsuario=false;
      $("#alertUsuario").addClass('d-inline-block');
      $("#alertUsuario").removeClass('d-none');
    }
  }
  function confirmarContrasena(){
    if ($("#regRepPassword").val()==$("#regPassword").val()) {
      valConfirmarContrasena=true;
      $("#alertRepContrasena").addClass('d-none');
      $("#alertRepContrasena").removeClass('d-inline-block');
    }else{
      valConfirmarContrasena=false;
      $("#alertRepContrasena").addClass('d-inline-block');
      $("#alertRepContrasena").removeClass('d-none');
    }

  }
  function validarContrasena(){
    var ochoDigitos,tieneNumeros,tieneMinusculas,tieneMayusculas,tieneCaracteres;
    // Validamos el campo contraseña

    var contrasenaIntroducida;
    contrasenaIntroducida=$("#regPassword").val();
    console.log(contrasenaIntroducida);
    // Validamos que tenga 8 caracteres
    if (contrasenaIntroducida!="") {
      if (contrasenaIntroducida.length>=8) {
        console.log("ochoDigitos");
        ochoDigitos=true;
      }else{
        ochoDigitos=false;
      }
      // Validamos que tenga numeros
      var numeros="0123456789";

      for(i=0; i<numeros.length; i++){
        if (contrasenaIntroducida.includes(numeros.charAt(i))&& !tieneNumeros) {
          tieneNumeros=true;
          console.log("tieneNumeros");
          i=numeros.length+1;
        }else{
          tieneNumeros=false;
        }
      }
      // Validamos que tenga minusculas
      var minusculas="abcdefghijklmnñopqrstuvwxyz";
      for(j=0; j<minusculas.length; j++){
        if (contrasenaIntroducida.includes(minusculas.charAt(j))&& !tieneMinusculas){
          console.log("tieneMinusculas");
          tieneMinusculas=true;
          j=minusculas.length+1;
        }
        else{
          tieneMinusculas=false;
        }
      }
      // Validamos que tenga Mayusculas
      var mayusculas="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
      for(k=0; k<mayusculas.length; k++){
        if (contrasenaIntroducida.includes(mayusculas.charAt(k))){
          console.log("tieneMayusculas");
          tieneMayusculas=true;
          k=mayusculas-length+1;
        }
        else{
          tieneMayusculas=false;
        }
      }
      // Validamos que tenga Caracteres especiales
      var caracteres="!#$%&'()*+,-./:;={[]}¿?";
      for(l=0; l<caracteres.length;l++){
        if (contrasenaIntroducida.includes(caracteres.charAt(l))){
          console.log("tieneCaracteres");
          tieneCaracteres=true;
          l=caracteres.length+1
        }
        else{
          tieneCaracteres=false;
        }
      }
      if (ochoDigitos&&tieneNumeros&&tieneMinusculas&&tieneMayusculas&&tieneCaracteres) {

        valRegPassword=true;
        $("#alertPassword").addClass('d-none');
        $("#alertPassword").removeClass('d-inline-block');
        console.log("condiciones cumplidas");
      }else{
        console.log("Contraseña no segura");
        valRegPassword=false;
        $("#alertPassword").addClass('d-inline-block');
        $("#alertPassword").removeClass('d-none');
      }
    }else{
      tieneNumeros=false;
      tieneNumeros=false;
      tieneMinusculas=false;
      tieneMayusculas=false;
      tieneCaracteres=false;
    }

  }
  function validarVariables(){
    validarNombre();
    validarApellidos();
    validarFechaNacimiento();
    validarSexo();
    validarEdoMpio();
    validarRadica();
    validarUsuario();
    validarContrasena();
    validar();
  }
  function validar(){
    if (valRegName&&valRegLast&&valRegSexo&&valRegFecha&&valRegMpio&&valRegEdo&&valRegRadica&&valRegUsuario&&valRegPassword&&valConfirmarContrasena) {
      console.log("If True");
      $("#btn-registrar").attr('disabled',false);
    }else{
      console.log("valRegName"+valRegName);
      console.log("valRegLast"+valRegLast);
      console.log("valregsexo"+valRegSexo);
      console.log("valRegFecha"+valRegFecha);
      console.log("valRegMpio"+valRegMpio);
      console.log("valRegEdo"+valRegEdo);
      console.log("valRegRadica"+valRegRadica);
      console.log("valRegUsuario"+valRegUsuario);
      console.log("valRegPassword"+valRegPassword);
      console.log("valConfirmarContrasena"+valConfirmarContrasena);
      console.log("If False");
      $("#btn-registrar").attr('disabled',true);
    }
  }
});
