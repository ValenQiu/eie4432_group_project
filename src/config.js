import dotenv from 'dotenv';
dotenv.config();
// console.log(process.env.CONNECTION_STR);

// if (!process.env.CONNECTION_STR) {
//   console.error('CONNECTION_STR is not defined');
//   process.exit(1);
// }

// const config = {
//   CONNECTION_STR: process.env.CONNECTION_STR,
// };

const config = {
    CONNECTION_STR: "mongodb+srv://valenqiu:20083971@cluster0.qranqjv.mongodb.net/?retryWrites=true&w=majority"
}


export default config;