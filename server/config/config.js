//=========================
//Port
//=========================
process.env.PORT = process.env.PORT || 9090;

//=========================
//Entorno
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//=========================
//expire
//=========================
//60 segundos
//60 minutis
//24 horas
//30 días
process.env.EXPIRED_TOKEN = 60 * 60 * 24 * 30;

//=========================
//SEED TOKEN
//=========================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || "secret-seed-token";


//=========================
//BD
//=========================
let url;
if (process.env.NODE_ENV === "dev") {
  url = "mongodb://localhost:27017/cafe";
} else {
  url = process.env.MONGO_URI;
}

process.env.URLBD = url;
