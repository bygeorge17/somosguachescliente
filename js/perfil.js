var urlposts=ipServer+"/getposts";
var urlPostFoto=ipServer+"/nuevopostconfoto";
var urlNewPost=ipServer+"/nuevopost";
var urlPostComentario=ipServer+"/agregarcomentario";
var urlProfile=ipServer+"/getprofile";
var urlFotoPerfil=ipServer+"/addfotoperfil"
const formData = new FormData();
new Vue({
  el:"#somosguachesperfil",
  created:function(){
    this.getposts();
    this.token=localStorage.token;
    this.getprofile();
    this.funcionEditable();
  },
  data:{
    titulo:"",
    posts:[],
    profile:{},
    imagen:ipServer+"/images/pubs/",
    imagenPerfil:ipServer+"/images/usuarios/",
    txtContenido:"",
    txtComentario:"",
    token:"",
    editable:Boolean
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
      formData.append("imgPublicacion", file);
    },
    onFilePerfilSelected (event) {
      const file = event.target.files[0];
      formData.append("foto-perfil", file);
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
      await  axios.get(urlProfile,{headers: {'x-access-token': this.token}}).then((respuesta)=>{
            console.log(respuesta.data.perfil.foto);
        this.profile=respuesta.data.perfil;
        this.profile.foto=this.imagenPerfil+respuesta.data.perfil.foto;
        var urlActual=window.location.href;
        var dividirCadena= urlActual.split("=");
        var idPerfilVisitado=dividirCadena[1];
        if (idPerfilVisitado==this.profile._id) {
          this.editable=true;
        }else{
          this.editable=false;
        }

        console.log("Este perfil es editable"+this.editable);
      });
    },
    newpostconfoto:async function(){
      formData.append("idUsuario",this.profile._id)
      await axios.post(urlPostFoto,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((respuesta)=>{
        formData.delete("idUsuario");
        formData.delete("foto-perfil");
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
      console.log("Empieza el axios");
        formData.append("idUsuario",this.profile._id)
        await axios.post(urlFotoPerfil,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((respuesta)=>{
          console.log(respuesta);
          if (!respuesta.data.ocurrioerror) {
            this.$refs.btnEnviar.classList.add("d-none");
            this.$refs.btnEnviar.classList.remove("d-inline");
            console.log("OK");
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
