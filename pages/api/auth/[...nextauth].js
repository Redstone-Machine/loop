
import GithubProvider from "next-auth/providers/github";

import NextAuth from "next-auth";
// import Providers from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();



export const authOptions = {
  // Use the Prisma adapter
  adapter: PrismaAdapter(prisma),

    // Enable debug mode
    // debug: true,


  // pages: {
  //   signIn: '/login',
  // },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },


  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" }
        },

        async authorize(credentials) {
          // Add logic here to look up the user from the credentials supplied
        //   const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
          const user = await prisma.user.findUnique({
            // where: { name: credentials.username },
            where: { userName: credentials.username },
          })


          
          // console.log('This is the user:')
          // console.log(user) // Log the user

          if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password)
            
            console.log('Checking password...')

            if (isValid) {
              // Lösenordet är korrekt, returnera användaren
              // console.log('Right password...')
              return Promise.resolve(user)
              //return { id: user.id, name: user.username }
            } else {
              // Lösenordet är felaktigt, returnera null
              console.log('Wrong password...')
              return Promise.resolve(null)
            }
          } else {
            // Användaren hittades inte, returnera null
            return Promise.resolve(null)
          }
        }





          // if (user && user.password === credentials.password) {
          //   return Promise.resolve(user)
          // } else {
          //   return Promise.resolve(null)
          // }
        // }





        //   if (user) {
        //     // Any object returned will be saved in `user` property of the JWT
        //     return user
        //   } else {
        //     // If you return null then an error will be displayed advising the user to check their details.
        //     return null
    
        //     // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        //   }

      }),



    // Providers.Credentials({
    //     credentials: {
    //       username: { label: 'Username', type: 'text' },
    //       password: { label: 'Password', type: 'password' },
    //     },
    //     authorize: async (credentials) => {
    //       // Implementera din logik för att verifiera användarnamn och lösenord här
    //       const user = await prisma.user.findFirst({
    //         where: {
    //           username: credentials.username,
    //           password: credentials.password, // I en produktionsmiljö bör du hasha lösenordet
    //         },
    //       });
  
    //       if (user) {
    //         return Promise.resolve(user);
    //       } else {
    //         return Promise.resolve(null);
    //       }
    //     },
    //   }),
  

    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // ...add more providers here
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },




      // async authorize(credentials, req) {
      //   console.log('Checking accounts...')
      //   const email = credentials.email;
      //   const dbUser = await prisma.user.findUnique({
      //     where: {
      //       email: email,
      //     },
      //   });
    
      //   if (dbUser) {
      //     console.log('User exists:', dbUser);
      //     // Om användaren finns, logga in dem
      //     return Promise.resolve(dbUser);
      //   } else {
      //     console.log('User does not exist:', dbUser);
      //     // Om användaren inte finns, returnera null
      //     return Promise.resolve(null);
      //   }
      // }
    })
  ],

  

  callbacks: {
    session: async (session, user) => {
      // session.user.id = user.id; // Lägg till id till session.user
      // console.log('Session:', session);
      // console.log('User:', user);
      
      return Promise.resolve(session);
    },

    jwt: async (token, user, account, profile, dbUser) => {
      if (user) {
        token.id = user.id;
      } else if (dbUser) {
        // const dbUser = await prisma.user.findUnique({
        //   where: { email: profile.email },
        // });
        // if (dbUser) {
          token.id = dbUser.id;
        // }
      }
      return Promise.resolve(token);
    },

    async signIn({ user, account, profile }) {
      if (account.provider === 'credentials') {
        // Om provider är 'credentials', så har vi redan verifierat användaren i 'authorize'-callbacken
        // Så vi kan bara returnera true för att logga in användaren
        return Promise.resolve(true);
      }
      else if (account.provider === 'google') {
        return Promise.resolve(true);
      }

       else if (account.provider === 'google') {
      if (profile) {
      // console.log('Profile:', profile);
      const email = profile.email;
      const dbUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (dbUser) {
        // Om användaren finns, logga in dem
        // console.log('User exists:', dbUser);
        // user = dbUser;
        // console.log('user:', user);
        return Promise.resolve(dbUser);
        // return Promise.resolve({ id: dbUser.id, email: dbUser.email });
//        return true;
      } else {
        console.log('User does not exist:', dbUser);
        // Om användaren inte finns, stoppa inloggningen
//        return false;
          return Promise.resolve(false);
      }
   }
    }

    }












    // signIn: async (user, account, profile) => {
    //   console.log('The callback signIn is running...');
    //   console.log('Provider:', account.provider);
    //   if (account.provider === 'google') {
    //     console.log('Inside google provider block');
    //     try {
    //       console.log('User:', user);
    //       console.log('Account:', account);
    //       console.log('Profile:'Ja, profile);
    
    //       const email = user.email;
    //       const dbUser = await prisma.user.findUnique({
    //         where: {
    //           email: email,
    //         },
    //       });
    
    //       if (dbUser) {
    //         // Om användaren finns, logga in dem
    //         return true;
    //       } else {
    //         // Om användaren inte finns, returnera false för att stoppa inloggningen
    //         return false;
    //       }
    //     } catch (error) {
    //       console.log('Error in google provider block:', error);
    //     }
    //   } else if (account.provider === 'credentials') {
    //     // Om provider är 'credentials', så har vi redan verifierat användaren i 'authorize'-callbacken
    //     // Så vi kan bara returnera true för att logga in användaren
    //     return true;
    //   }
    // },



    //     async signIn(user, account, profile) {
    //   if (account.provider === 'google') {
    //     const email = user.email;
    //     const dbUser = await prisma.user.findUnique({
    //       where: {
    //         email: email,
    //       },
    //     });

    //     if (dbUser) {
    //       // Om användaren finns, logga in dem
    //       return true;
    //     } else {
    //       // Om användaren inte finns, skicka tillbaka ett felmeddelande
    //       return false;
    //     }
    //   }
    // },



    // secret: process.env.SECRET,
 

}
}
export default NextAuth(authOptions)