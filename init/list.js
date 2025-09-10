const mongoose = require("mongoose");
const Listing=require("../models/listing.js");
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/majorproject');
}

main()
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Database connection error:", err));
const product=[
     {
      title: "Cozy Apartment in Delhi",
      description: "A comfortable apartment in the heart of Delhi.",
      price: 1500,
      location: "Connaught Place, Delhi",
      country: "India",
      image: "https://media.designcafe.com/wp-content/uploads/2021/11/08175133/cozy-small-apartment-ideas-for-your-home.jpg"
    },
    {
      title: "Beach House in Goa",
      description: "Enjoy the sea breeze in this beachside house.",
      price: 2500,
      location: "Calangute, Goa",
      country: "India",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiWk7vlgz9Gl6Kh6C_Hl-EeH42dtaYQ8mgUZ7f2ccOr0AB-SYfiUlXVqdgQi8jmadAF6E&usqp=CAU"
    },
    {
      title: "Mountain View Cottage",
      description: "Relax with stunning mountain views.",
      price: 1800,
      location: "Manali, Himachal Pradesh",
      country: "India",
      image: "https://q-xx.bstatic.com/xdata/images/hotel/608x352/378097493.webp?k=bd35eebb83e54d275ae6731676b35fc75d1662e089023c68adacf689a51c3775&o="
    },
    {
      title: "Luxury Villa in Mumbai",
      description: "Spacious villa with a private pool.",
      price: 5000,
      location: "Bandra, Mumbai",
      country: "India",
      image: "https://media.istockphoto.com/id/511061090/photo/business-office-building-in-london-england.jpg?s=612x612&w=0&k=20&c=nYAn4JKoCqO1hMTjZiND1PAIWoABuy1BwH1MhaEoG6w="
    },
    {
      title: "Lakefront Cabin",
      description: "Perfect getaway by the lake.",
      price: 2200,
      location: "Nainital, Uttarakhand",
      country: "India",
      image: "https://cdn.homedsgn.com/wp-content/uploads/2019/08/Lakefront-Mountain-Cabin-outdoor-patio-and-fireplace.jpg"
    },
    {
      title: "Houseboat Stay in Kerala",
      description: "Experience backwaters in a houseboat.",
      price: 3000,
      location: "Alleppey, Kerala",
      country: "India",
      image: "https://www.raptorholidays.com/cdn/shop/products/housbt_07829fc6-a39a-45a7-acdb-fc37ac37c8de_large.jpg?v=1485948409"
    },
    {
      title: "Desert Camp in Jaisalmer",
      description: "Stay under the stars in the desert.",
      price: 1200,
      location: "Jaisalmer, Rajasthan",
      country: "India",
      image: "https://turkeldesign.com/wp-content/uploads/2022/09/01-turkel_design_modern_prefab_axiom_desert_house_chase_daniel_morning_exterior_header-scaled.jpg"
    },
    {
      title: "Hilltop Homestay",
      description: "Charming homestay with valley view.",
      price: 1600,
      location: "Ooty, Tamil Nadu",
      country: "India",
      image: "https://media.istockphoto.com/id/511061090/photo/business-office-building-in-london-england.jpg?s=612x612&w=0&k=20&c=nYAn4JKoCqO1hMTjZiND1PAIWoABuy1BwH1MhaEoG6w="
    },
    {
      title: "City Loft in Bangalore",
      description: "Modern loft near IT hub.",
      price: 2000,
      location: "Whitefield, Bangalore",
      country: "India",
      image: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVpbGRpbmd8ZW58MHx8MHx8fDA%3D"
    },
    {
      title: "Rustic Farmhouse",
      description: "Quiet farmhouse surrounded by greenery.",
      price: 1700,
      location: "Pune, Maharashtra",
      country: "India",
      image: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVpbGRpbmd8ZW58MHx8MHx8fDA%3D"
    },
];
async function insert() {
  await Listing.deleteMany({});
  await Listing.insertMany(product).then((res)=>{
        console.log(res);
    })
  
}
insert();
    
