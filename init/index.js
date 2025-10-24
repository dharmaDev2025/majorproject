const mongoose=require("mongoose");
const initData=require("./list.js");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/majorproject";

main()
.then(()=>{
    console.log("connected to db");

})
.catch((err)=>{
    console.log(err)
});
async function main(){
    await mongoose.connect(MONGO_URL);

}
const initDB=async()=>{
    await Listing.deleteMany({});
    const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "68eddfde0a73b061a3cbfb54",
  }));

  await Listing.insertMany(dataWithOwner);
  console.log("reinitialized");


}
initDB();