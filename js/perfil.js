var urlposts=ipServer+"/getposts";
var urlPostFoto=ipServer+"/nuevopostconfoto";
var urlNewPost=ipServer+"/nuevopost";
var urlPostComentario=ipServer+"/agregarcomentario";
var urlProfile=ipServer+"/getprofile";
var urlProfileV=ipServer+"/getprofilevisited";
var urlFotoPerfil=ipServer+"/addfotoperfil"
const formData = new FormData();
new Vue({
  el:"#somosguachesperfil",
  created:function(){
    this.getposts();
    this.token=localStorage.token;
    this.getprofile();
    this.funcionEditable();
    console.log("Perfil Visitado:"+this.getprofilevisited);
  },
  data:{
    titulo:"",
    posts:[],
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
    logout: function (){

    },
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
        console.log(img);
        console.log("Resolucion:"+width+"x"+height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 800;
        var MAX_HEIGHT = 600;
        console.log("Resolucion Original: "+width+"x"+height);
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
        console.log("Resolucion Final: "+width+"x"+height);
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var link = window.document.createElement( 'a' ),
            url = canvas.toDataURL("image/png",0.2),
            file=url;
            console.log("File Final: "+file);
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
        console.log(img);
        console.log("Resolucion:"+width+"x"+height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 800;
        var MAX_HEIGHT = 600;
        console.log("Resolucion Original: "+width+"x"+height);
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
        console.log("Resolucion Final: "+width+"x"+height);
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var link = window.document.createElement( 'a' ),
            url = canvas.toDataURL("image/png",0.2),
            file=url;
            console.log("File Final: "+file);
            formData.append("foto-perfil", file);
            console.log(formData);
      };
      // Comprimir Imagen
    },
    onTextChange(event){
      console.log(event);
      const texto=event.target.value;
      formData.append("txtPublicacion",texto);
    },
    getposts: async function (){
      await  axios.get(urlposts).then((respuestas)=>{
        this.posts=respuestas.data.publicaciones;
      });
      for (var i = 0; i < this.posts.length; i++) {
        this.posts[i].foto=this.imagen + this.posts[i].foto;
      }
    },
    getprofile:async function(){
      var urlActual=window.location.href;
      var dividirCadena= urlActual.split("=");
      var idPerfilVisitado=dividirCadena[1];
      await  axios.get(urlProfile,{headers: {'x-access-token': this.token}}).then((respuesta)=>{
        console.log(respuesta.data.perfil.foto);
        this.profile=respuesta.data.perfil;
        this.profile.foto=this.imagenPerfil+respuesta.data.perfil.foto;
        if (idPerfilVisitado==this.profile._id) {
          this.editable=true;
        }else{
          this.editable=false;
        }
      });
      await  axios.get(urlProfileV+"/"+idPerfilVisitado,{headers: {'x-access-token': this.token}}).then((respuesta)=>{
        console.log(respuesta.data.perfil);
        this.profileVisited=respuesta.data.perfil;
        this.profileVisited.foto=this.imagenPerfil+respuesta.data.perfil.foto;
        if (idPerfilVisitado==this.profile._id) {
          this.editable=true;
        }else{
          this.editable=false;
        }
      });
    },
    newpostconfoto:async function(){
      this.loadingFotoPublicacion=true;
      formData.append("idUsuario",this.profile._id)
      await axios.post(urlPostFoto,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((respuesta)=>{
        formData.delete("idUsuario");
        formData.delete("foto-perfil");
        this.loadingFotoPublicacion=false;
        this.getposts();
      });
    },
    newpost:async function(){
      var data={
        idUsuario:this.profile._id,
        txtContenido:this.txtContenido
      };
      console.log(data);
      await axios.post(urlNewPost,data).then((respuesta)=>{
        this.getposts();
      });
      this.txtContenido="";
    },
    cambiarfoto: async function(){
      this.loadingFotoPerfil=true;
      console.log("idUsuario"+this.profile._id);
      formData.append("idUsuario",this.profile._id)
      axios.interceptors.response.use((response) => {
        // do something with the response data
        console.log('Response was received');
        return response;
      }, error => {
        // handle the response error
        return Promise.reject(error);
      });
      await axios.post(urlFotoPerfil,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((respuesta)=>{
        console.log(respuesta);
        if (!respuesta.data.ocurrioerror) {
          this.$refs.btnEnviar.classList.add("d-none");
          this.$refs.btnEnviar.classList.remove("d-inline");
          console.log("OK");
          this.loadingFotoPerfil=false;
        }
        this.getposts();
      });
    },
    like: function(){
      localStorage.clear();
      window.location.href="../index.html";
    },
    dislike:async function(){

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
      console.log($('#foto-perfil').val());
      $('#btn-enviar').addClass("d-inline").removeClass("d-none");
    }else{
      console.log($('#foto-perfil').val());
      $('#btn-enviar').addClass("d-none").removeClass("d-inline");

    }
  });
  $('#btn-foto-perfil').click(function(){
    console.log("clic");
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
