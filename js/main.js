var urlposts=ipServer+"/getposts";
var urlLogin=ipServer+"/login";
new Vue({
  el:"#somosguaches",
  created:function(){
    this.token=localStorage.token;
    // axios.headers.common['x-access-token']="this.token";
    this.redireccionar();
  },
  data:{
    titulo:"Hola Mundo VUEjs",
    posts:[],
    usuario:"",
    contrasena:"",
    token:"",
  },
  methods:{
    getposts: async function (){
    await  axios.get(urlposts).then((respuestas)=>{
        this.posts=respuestas.data.publicaciones;
      })
    },
    login: async function(e){
      e.preventDefault();
      await axios.post(urlLogin,{usuario:this.usuario,contrasena:this.contrasena}).then((respuesta)=>{
        console.log(respuesta);
        if (respuesta.data.auth) {
          localStorage.token=respuesta.data.token;
          window.location.href = "html/publicaciones.html";
          console.log("Todo Salio bien");
        }else{
          alert("El usuario o la contraseña no coinciden");
          this.usuario="";
          this.contrasena="";
        }
      });
    },
    redireccionar:function(){
      if (this.token) {
        window.location.href="html/publicaciones.html";
      }
    }
  }
});
$(function(){
  $("#btnRegistrarse").click(function(){
    window.location.href="html/registro.html"
  });
});
