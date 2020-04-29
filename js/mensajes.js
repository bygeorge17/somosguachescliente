var urlProfile=ipServer+"/getprofile";
var urlMensajes=ipServer+"/getmensajes";
var urlEnviarMensaje=ipServer+"/sendmensaje";
var urlConversacion=ipServer+"/getConversacion";

new Vue({
  el:"#somosguachesmensajes",

  created(){
    this.socket=io("http://localhost:3001");
    this.token=localStorage.token;
    var urlActual=window.location.href;
    var dividirCadena= urlActual.split("=");
    var destinatario=dividirCadena[1];
    this.destinatario=destinatario;
    this.getprofile();
    this.getMensajes();
    if (this.destinatario) {
      this.getConversacion(this.destinatario);
    }
  },
   mounted(){

   },
  data:{
    socket:{},
    misDestinatarios:[],
    destinatarios:[],
    mensajes:[],
    conversacion:{},
    profile:{},
    titulo:"Mensajes",
    usuario:"",
    contrasena:"",
    token:"",
    txtMensaje:"",
    imagenPerfil:ipServer+"/images/usuarios/",
    destinatario:""

  },
  methods:{
    getprofile:  function(){
      axios.get(urlProfile,{headers: {'x-access-token': this.token}}).then(respuesta=>{
        this.profile=respuesta.data.perfil;
        this.profile.foto=this.imagenPerfil+respuesta.data.perfil.foto;
      }
    );
  },
  getMensajes:async function(){
     await axios.get(urlMensajes,{headers: {'x-access-token': this.token}}).then(respuesta=>{
      this.mensajes=respuesta.data.mensajes;
      var destinatariosTemp=[];
      for (var i = 0; i < this.mensajes.length; i++) {
        this.mensajes[i].para.foto=this.imagenPerfil+this.mensajes[i].para.foto;
        this.mensajes[i].de.foto=this.imagenPerfil+this.mensajes[i].de.foto;
        if (this.mensajes[i].para._id != this.profile._id && this.mensajes[i].de._id == this.profile._id ) {
          destinatariosTemp.push(this.mensajes[i].para)
        }
        if (this.mensajes[i].de._id != this.profile._id && this.mensajes[i].para._id != this.profile._id) {
          destinatariosTemp.push(this.mensajes[i].de)
        }
      }
      function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 }

 this.destinatarios = removeDuplicates(destinatariosTemp, "_id");
    }
  );
  },
  getConversacion:async function(idDestinatario){
    this.destinatario=idDestinatario;
    var data={
      destinatario:this.destinatario,
      remitente:this.profile._id
    };
    await axios.post(urlConversacion,data).then(respuesta=>{
      this.conversacion=respuesta.data.conversacion
      for (var i = 0; i < this.conversacion.length; i++) {
        this.conversacion[i].de.foto=this.imagenPerfil+this.conversacion[i].de.foto;
        this.conversacion[i].para.foto=this.imagenPerfil+this.conversacion[i].para.foto;
        if (this.conversacion[i].de._id==this.profile._id) {
          this.conversacion[i].enviado=true;
        }
        if (this.conversacion[i].para._id==this.profile._id) {
          this.conversacion[i].recibido=true;
        }
      }
    });
  },
  enviarMensaje:async function (){
    if (this.txtMensaje!="") {
      data={
        destinatario:this.destinatario,
        remitente:this.profile._id,
        msg:this.txtMensaje
      }
      await axios.post(urlEnviarMensaje,data,{headers:{'x-acces-token':this.token}}).then(respuesta=>{
      });
      this.getMensajes();
      this.txtMensaje="";
    }

  },

  }
});
$(function(){
  somosguachesmensajes.__vue__.socket.on("nuevoMensaje",function(data){

    if (data.de==somosguachesmensajes.__vue__.profile._id || data.para==somosguachesmensajes.__vue__.profile._id) {
      somosguachesmensajes.__vue__.getMensajes();
      if (somosguachesmensajes.__vue__.destinatario) {
        somosguachesmensajes.__vue__.getConversacion(somosguachesmensajes.__vue__.destinatario);
      }
    }
    $('#conversacion').scrollTop( $('#conversacion').prop('scrollHeight') );
  });
  $('#conversacion').scrollTop( $('#conversacion').prop('scrollHeight') );
});
