const formData = new FormData();
var urlPost=ipServer+"/getpost?id=";
var urlProfile=ipServer+"/getprofile";
var urlNewComment=ipServer+"/agregarcomentario";
var imagen=ipServer+"/images/pubs/";
var imagenPerfil=ipServer+"/images/usuarios/";
var urlLike=ipServer+"/like";
var urlDislike=ipServer+"/dislike";
var urlEstrella=ipServer+"/estrella";
var urlCorazon=ipServer+"/corazon";
var urlMolesto=ipServer+"/molesto";

new Vue({
  el:"#somosguachespost",
  created:function(){
    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);
    this.idPub=params.get("id");
    urlPost+=this.idPub;
    this.token=localStorage.token;
    if (!localStorage.token) {
      window.location.href="../index.html";
    }
    this.getprofile();
    this.getpost();
  },
  data:{
    token:"",
    profile:{},
    titulo:"",
    posts:[],
    textPublicacion:"",
    txtComentario:"",
    idPub:""
  },

  methods:{
    onTextChange(){

    },
    getprofile:async function(){
      await  axios.get(urlProfile,{headers: {'x-access-token': this.token}}).then(respuesta=>(
        this.profile=respuesta.data.perfil,
        this.profile.foto=this.imagenPerfil+respuesta.data.perfil.foto
      )
    );
  },
    getpost: async function (){
      await  axios.get(urlPost).then((respuestas)=>{
        this.posts=respuestas.data.publicacion;
        this.posts[0].autor[0].foto=imagenPerfil+ respuestas.data.publicacion[0].autor[0].foto;
        for (var j = 0; j < this.posts[0].likes.length; j++) {
          if (this.posts[0].likes[j].likes==this.profile._id) {
            this.posts[0].liked=true;
          }
        }
        for (var k = 0; k < this.posts[0].dislikes.length; k++) {
          if (this.posts[0].dislikes[k].dislikes==this.profile._id) {
            this.posts[0].disliked=true;
          }
        }
        for (var l = 0; l < this.posts[0].estrella.length; l++) {
          if (this.posts[0].estrella[l].estrella==this.profile._id) {
            this.posts[0].stared=true;
          }
        }
        for (var m= 0; m < this.posts[0].molesto.length; m++) {
          if (this.posts[0].molesto[m].molesto==this.profile._id) {
            this.posts[0].molestado=true;
          }
        }
        for (var n= 0; n < this.posts[0].corazon.length; n++) {
          if (this.posts[0].corazon[n].corazon==this.profile._id) {
            this.posts[0].hearted=true;
          }
        }
        if (respuestas.data.publicacion[0].foto) {
          this.posts[0].foto=imagen+this.posts[0].foto;
        }
        for (var i = 0; i < respuestas.data.publicacion[0].comentarios.length; i++) {
          this.posts[0].comentarios[i].autor.foto=imagenPerfil+respuestas.data.publicacion[0].comentarios[i].autor.foto;
        }
      });
    },
    newcomentario:async function(){

      await axios.post(urlNewComment,{id_publicacion:this.idPub,txtComentario:this.txtComentario,id_publicacion:this.idPub,idUser:'5d87ddff4f499c0cd8cc3eb0'}).then((respuesta)=>{
        this.getpost();
        this.txtComentario="";
      });
    },
    like:async  function(id_publicacion){
      var data={
        idUsuario:this.profile._id,
        id_publicacion:id_publicacion
      };
      await axios.post(urlLike,data).then(respuesta=>(
        this.getpost()
      )
    );
  },
  dislike:async function(id_publicacion){
    var data={
      idUsuario:this.profile._id,
      id_publicacion:id_publicacion
    };
    await axios.post(urlDislike,data).then((respuesta)=>{
      this.getpost();
    }
  );
  },
  estrella:async function(id_publicacion){
    var data={
      idUsuario:this.profile._id,
      id_publicacion:id_publicacion
    };
    await axios.post(urlEstrella,data).then(respuesta=>(
      this.getpost()
    )
  );
  },
  molesto:async function(id_publicacion){
    var data={
      idUsuario:this.profile._id,
      id_publicacion:id_publicacion
    };
    await axios.post(urlMolesto,data).then(respuesta=>(
      this.getpost()
    )
  );
  },
  corazon:async function(id_publicacion){
    var data={
      idUsuario:this.profile._id,
      id_publicacion:id_publicacion
    };
    await axios.post(urlCorazon,data).then(respuesta=>(
      this.getpost()
    )
  );
  }
  }
});
$(function(){
  "use_strict";
  function filePreview(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        // $('#frm-foto + img').remove();
        $('#imgPublicacionPrev').attr('src',e.target.result)
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#imgPublicacion").change(function () {
    filePreview(this);
  });
  $('#contenido').change(function(){
    $('#formContenido').val()=$('#contenido').val();
  });
  // $('#btnPublicar').click(function(){
  //   if ($('#imgPublicacion').val()) {
  //     $('#formPublicacion').submit();
  //   }
  // });
  $('#btnFotoPublicacion').click(function(){
    $('#imgPublicacion').click();
  });
});
