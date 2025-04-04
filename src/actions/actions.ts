// "use server";

// import { prisma } from "../lib/db"

// export async function createUser(formData: FormData) {
//     try {
//         const user = await prisma.profile.findUnique({
//             where: {
//                 email: formData.get("email") as string,
//             },
//         });

//         if (user == null) {
//             await prisma.profile.create({
//                 data: {
//                     email: formData.get("email") as string,
//                     password: formData.get("password") as string,
//                 },
//             });
//             return { success: true, message: "User created successfully" };
//         }
//         else {
//             console.log("email already taken");
//         }

//     } catch (error) {
//         console.log(error)
//         return { success: false, message: "An error occurred during user creation" };
//     }
// }