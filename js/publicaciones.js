var urlposts=ipServer+"/getposts";
var urlPostFoto=ipServer+"/nuevopostconfoto";
var urlNewPost=ipServer+"/nuevopost";
var urlPostComentario=ipServer+"/agregarcomentario";
var urlProfile=ipServer+"/getprofile";
var urlLike=ipServer+"/like";
var urlDislike=ipServer+"/dislike";
var urlEstrella=ipServer+"/estrella";
var urlCorazon=ipServer+"/corazon";
var urlMolesto=ipServer+"/molesto";
var formData = new FormData();
new Vue({
  el:"#somosguachespublicaciones",
  created:function(){
    this.token=localStorage.token;
    if (!localStorage.token) {
      window.location.href="../index.html";
    }
    this.getprofile();
    this.getposts();
  },
  data:{
    titulo:"",
    posts:[],
    profile:{},
    imagen:ipServer+"/images/pubs/",
    imagenPerfil:ipServer+"/images/usuarios/",
    txtContenido:'',
    txtComentario:"",
    token:"",
    pubConContenido:false,
    loadingFotoPublicacion:false
  },
  methods:{
    visitarPerfil: function (id){
      window.location.href="perfil.html?id="+id;
    },
    post(id){
      window.location = "../html/post.html?id="+id;
    },
    onFileSelected (event) {
      var file = event.target.files[0];
      // formData.append("imgPublicacion",file);
      console.log(formData);
      console.log("file Original"+ file);
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
            formData.append("imgPublicacion",file);
            console.log(formData);
      };
      // Comprimir Imagen
    },
    onTextChange(event){
      if (this.txtContenido!="" || file) {
        this.pubConContenido=true;
      }else{
        pubConContenido=false;
      }
      const texto=event.target.value;
      formData.append("txtPublicacion",texto);
    },
    getposts: async  function (){

      await  axios.get(urlposts,{headers: {'x-access-token': this.token}}).then((respuestas)=>{
        this.posts=respuestas.data.publicaciones;
      });
      for (var i = 0; i < this.posts.length; i++) {
        if (this.posts[i].foto) {
          this.posts[i].foto=this.imagen + this.posts[i].foto;
        }
        this.posts[i].autor[0].foto=this.imagenPerfil + this.posts[i].autor[0].foto;
        for (var j = 0; j < this.posts[i].likes.length; j++) {
          if (this.posts[i].likes[j].likes==this.profile._id) {
            this.posts[i].liked=true;
          }
        }
        for (var k = 0; k < this.posts[i].dislikes.length; k++) {
          if (this.posts[i].dislikes[k].dislikes==this.profile._id) {
            this.posts[i].disliked=true;
          }
        }
        for (var l = 0; l < this.posts[i].estrella.length; l++) {
          if (this.posts[i].estrella[l].estrella==this.profile._id) {
            this.posts[i].stared=true;
          }
        }
        for (var m= 0; m < this.posts[i].molesto.length; m++) {
          if (this.posts[i].molesto[m].molesto==this.profile._id) {
            this.posts[i].molestado=true;
          }
        }
        for (var n= 0; n < this.posts[i].corazon.length; n++) {
          if (this.posts[i].corazon[n].corazon==this.profile._id) {
            this.posts[i].hearted=true;
          }
        }
      }
    },
    getprofile: function(){
      axios.get(urlProfile,{headers: {'x-access-token': this.token}}).then(respuesta=>(
        this.profile=respuesta.data.perfil,
        this.profile.foto=this.imagenPerfil+respuesta.data.perfil.foto
      )
    );
  },
  newpostconfoto:async function(){
    this.loadingFotoPublicacion=true;
    formData.append("idUsuario",this.profile._id)
    console.log(formData);
    await axios.post(urlPostFoto,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((respuesta)=>{
      this.loadingFotoPublicacion=false;
      this.$refs.imgPublicacionPrev.src="";
      this.txtContenido="";
      formData.delete("imgPublicacion");
      formData.delete("txtPublicacion");
      console.log(respuesta);
    }
  )
  this.getposts();
},
newpost:async function(){
  var data={
    idUsuario:this.profile._id,
    txtContenido:this.txtContenido
  };
  console.log(data);
  await axios.post(urlNewPost,data).then(respuesta=>(
    this.getposts()
  ));
  this.txtContenido="";
},
salir:async  function(){
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
estrella:async function(id_publicacion){
  var data={
    idUsuario:this.profile._id,
    id_publicacion:id_publicacion
  };
  await axios.post(urlEstrella,data).then(respuesta=>(
    this.getposts()
  )
);
},
molesto:async function(id_publicacion){
  var data={
    idUsuario:this.profile._id,
    id_publicacion:id_publicacion
  };
  await axios.post(urlMolesto,data).then(respuesta=>(
    this.getposts()
  )
);
},
corazon:async function(id_publicacion){
  var data={
    idUsuario:this.profile._id,
    id_publicacion:id_publicacion
  };
  await axios.post(urlCorazon,data).then(respuesta=>(
    this.getposts()
  )
);
}
}
});
$(function(){
  "use_strict";
  var socket = io("http://localhost:3001");
  socket.on("reaccion", function(data) {
    console.log("Reaccion");
    if (data.publicador==somosguachespublicaciones.__vue__.profile._id && somosguachespublicaciones.__vue__.profile._id != data.idAutor) {

      Push.create("Somos Guaches", {
        body: data.autor+" "+data.msg, //this should print "hello"
        icon: '../favicon.png',
        onClick: function () {
          window.focus();
          this.close();
        }
      });
    }
  });


  function filePreview(input) {
    if (input.files && input.files[0]) {
      console.log("Hay imagen");
      $("#btnPublicar").removeClass('d-none');
      $("#btnPublicarSinFoto").addClass('d-none');
      var reader = new FileReader();
      reader.onload = function (e) {
        // $('#frm-foto + img').remove();
        $('#imgPublicacionPrev').addClass('orientation');
        $('#imgPublicacionPrev').attr('src',e.target.result);
        console.log(e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }else{
      console.log("No hay imagen");
      $("#btnPublicar").addClass('d-none');
      $("#btnPublicarSinFoto").removeClass('d-none');
    }
  }
  $("#linkPerfil").click(function(){
    window.location.href="perfil.html?id="+somosguachespublicaciones.__vue__.profile._id;
  })
  $("#irperfil").click(function(){
    window.location.href="perfil.html?id="+somosguachespublicaciones.__vue__.profile._id;
  })
  $("#imgPublicacion").change(function () {
    filePreview(this);
  });

  $('#btnFotoPublicacion').click(function(){
    $('#imgPublicacion').click();
  });
});
