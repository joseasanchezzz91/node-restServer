//=========================
//Port
//=========================
process.env.PORT = process.env.PORT || 9090;

//=========================
//Entorno
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

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
