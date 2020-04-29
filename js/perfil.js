var urlposts=ipServer+"/getposts";
var urlNotificaciones=ipServer+"/getnotificaciones";
var urlpostsperfil=ipServer+"/getpostsperfil";
var urlPostFoto=ipServer+"/nuevopostconfoto";
var urlNewPost=ipServer+"/nuevopost";
var urlPostComentario=ipServer+"/agregarcomentario";
var urlProfile=ipServer+"/getprofile";
var urlProfileV=ipServer+"/getprofilevisited";
var urlFotoPerfil=ipServer+"/addfotoperfil"
var urlLike=ipServer+"/like";
var urlDislike=ipServer+"/dislike";
const formData = new FormData();
new Vue({
  el:"#somosguachesperfil",
  created:function(){
    this.getposts();
    this.token=localStorage.token;
    this.getprofile();
    this.funcionEditable();
    this.getnotificaciones();
  },
  data:{
    titulo:"",
    posts:[],
    notificaciones:[],
    profile:{},
    profileVisited:{},
    imagen:ipServer+"/images/pubs/",
    imagenPerfil:ipServer+"/images/usuarios/",
    txtContenido:"",
    txtComentario:"",
    token:"",
    editable:Boolean,
    loadingFotoPerfil:false,
    loadingFotoPublicacion:false
  },
  methods:{
    funcionEditable:function(){

    },
    post(id){
      window.location = "../html/post.html?id="+id;
    },
    onFileSelected (event) {
      const file = event.target.files[0];

      // Comprimir Imagen
      var canvas = document.createElement( 'canvas' );
      var width;
      var height;
      var img = document.createElement("img");
      var reader = new FileReader();
      reader.onload = function(e) {
        img.src = e.target.result


      }
      reader.readAsDataURL(file);
      reader.onloadend=function(){
        width = img.width;
        height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 800;
        var MAX_HEIGHT = 600;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var link = window.document.createElement( 'a' ),
        url = canvas.toDataURL("image/jpeg",0.3),
        file=url;
        formData.append("imgPublicacion", file);
      };
      // Comprimir Imagen
    },
    onFilePerfilSelected (event) {
      const file = event.target.files[0];
      // Comprimir Imagen
      var canvas = document.createElement( 'canvas' );
      var width;
      var height;
      var img = document.createElement("img");
      var reader = new FileReader();
      reader.onload = function(e) {
        img.src = e.target.result


      }
      reader.readAsDataURL(file);
      reader.onloadend=function(){
        width = img.width;
        height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 800;
        var MAX_HEIGHT = 600;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var link = window.document.createElement( 'a' ),
        url = canvas.toDataURL("image/jpeg",0.3),
        file=url;
        formData.append("foto-perfil", file);
      };
      // Comprimir Imagen
    },
    onTextChange(event){
      const texto=event.target.value;
      formData.append("txtPublicacion",texto);
    },
    irMensajes:function(id){
      window.location.href="mensajes.html?id="+id;
    },
    getposts: async function (){
      var urlActual=window.location.href;
      var dividirCadena= urlActual.split("=");
      var idPerfilVisitado=dividirCadena[1];
      var data={
        idPerfilVisitado:idPerfilVisitado
      }
      await  axios.post(urlpostsperfil,data).then((respuestas)=>{
        this.posts=respuestas.data.publicaciones;
      });
      for (var i = 0; i < this.posts.length; i++) {
        this.posts[i].foto=this.imagen + this.posts[i].foto;
      }
    },
    getnotificaciones:async function(){
      await  axios.get(urlNotificaciones,{headers: {'x-access-token': this.token}}).then((respuesta)=>{
        this.notificaciones=respuesta.data.notificaciones;
        for (var i = 0; i < this.notificaciones.length; i++) {
          this.notificaciones[i].autor[0].foto=this.imagenPerfil+this.notificaciones[i].autor[0].foto
          this.notificaciones[i].publicacion[0].foto=this.imagenPerfil+this.notificaciones[i].publicacion[0].foto

        }
      });
    },
    getprofile:async function(){
      var urlActual=window.location.href;
      var dividirCadena= urlActual.split("=");
      var idPerfilVisitado=dividirCadena[1];
      await  axios.get(urlProfile,{headers: {'x-access-token': this.token}}).then((respuesta)=>{
        this.profile=respuesta.data.perfil;
        this.profile.foto=this.imagenPerfil+respuesta.data.perfil.foto;
        if (idPerfilVisitado==this.profile._id) {
          this.editable=true;
        }else{
          this.editable=false;
        }
      });
      await  axios.get(urlProfileV+"/"+idPerfilVisitado,{headers: {'x-access-token': this.token}}).then((respuesta)=>{
        this.profileVisited=respuesta.data.perfil;
        this.profileVisited.foto=this.imagenPerfil+respuesta.data.perfil.foto;
        if (idPerfilVisitado==this.profile._id) {
          this.editable=true;
        }else{
          this.editable=false;
        }
      });
    },
    clearData:function(){
      formData.forEach(function(val, key, fD){
        // here you can add filtering conditions
        formData.delete(key);
      });
      this.$refs.img_Publicacion.value="";
      this.$refs.foto_perfil.value="";
    },
    newpostconfoto:async function(){
      this.loadingFotoPublicacion=true;
      formData.append("idUsuario",this.profile._id)
      await axios.post(urlPostFoto,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((respuesta)=>{
        this.$refs.imgPublicacionPrev.src="";
        this.$refs.img_Publicacion.value="";
        this.loadingFotoPublicacion=false;
        this.clearData();
        this.getposts();
      });
    },
    newpost:async function(){
      var data={
        idUsuario:this.profile._id,
        txtContenido:this.txtContenido
      };
      await axios.post(urlNewPost,data).then((respuesta)=>{
        this.getposts();
      });
      this.txtContenido="";
    },
    cambiarfoto: async function(){
      this.loadingFotoPerfil=true;
      formData.append("idUsuario",this.profile._id)
      axios.interceptors.response.use((response) => {
        // do something with the response data
        return response;
      }, error => {
        // handle the response error
        return Promise.reject(error);
      });
      await axios.post(urlFotoPerfil,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((respuesta)=>{
        if (!respuesta.data.ocurrioerror) {
          this.$refs.btnEnviar.classList.add("d-none");
          this.$refs.btnEnviar.classList.remove("d-inline");
          this.loadingFotoPerfil=false;
        }
        this.getposts();
      });
    },
    logout: function(){
      localStorage.clear();
      window.location.href="../index.html";
    },
    like:async  function(id_publicacion){
      var data={
        idUsuario:this.profile._id,
        id_publicacion:id_publicacion
      };
      await axios.post(urlLike,data).then((respuesta)=>{
        if (respuesta.data.error) {
          alert("Algo salio mal intenta de nuevo");

        }
        this.getposts()
      }
    );
  },
  dislike:async function(id_publicacion){
    var data={
      idUsuario:this.profile._id,
      id_publicacion:id_publicacion
    };
    await axios.post(urlDislike,data).then((respuesta)=>{
      this.getposts();
    }
  );
},
estrella:async function(){

},
molesto:async function(){

},
corazon:async function(){

}
}
});
$(function(){

  "use_strict";
  function filePreview(input) {
    if (input.files && input.files[0]) {
      $("#btnPublicar").removeClass('d-none');
      $("#btnPublicarSinFoto").addClass('d-none');
      var reader = new FileReader();
      reader.onload = function (e) {
        // $('#frm-foto + img').remove();
        $('#imgPublicacionPrev').attr('src',e.target.result)
      }
      reader.readAsDataURL(input.files[0]);
    }else{
      $("#btnPublicar").addClass('d-none');
      $("#btnPublicarSinFoto").removeClass('d-none');
    }
  }
  $("#imgPublicacion").change(function () {
    filePreview(this);

  });
  $('#contenido').change(function(){
    $('#formContenido').val()=$('#contenido').val();
  });
  $('#btnFotoPublicacion').click(function(){
    $('#imgPublicacion').click();
  });


  //   funciones foto perfil
  $('#foto-perfil').change(function(){
    fotoPerfilPreview(this);
    if ($('#foto-perfil').val()!="") {
      $('#btn-enviar').addClass("d-inline").removeClass("d-none");
    }else{
      $('#btn-enviar').addClass("d-none").removeClass("d-inline");

    }
  });

  $('#foto-perfil').click(function(){
    $('#foto-perfil').value="";
  });
  $('#btn-foto-perfil').click(function(){
    $('#foto-perfil').click();
  });
  function fotoPerfilPreview(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#frm-foto + img').remove();
        $('#img-foto-perfil').attr('src',e.target.result)
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
});
