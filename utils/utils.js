// // utils/utils.js
// export function getUserIdFromSession(session) {
//   // Kontrollera om session och nödvändiga objekt finns
//   console.log('SessionId:', session);
//   if (session && session.token && session.token.token && session.token.token.sub) {
//     return session.token.token.sub;
//   }

//   // Returnera null om id inte hittades
//   return null;
//   }


// utils/utils.js
export function getUserIdFromSession(session, status) {

    if (status === 'unauthenticated') {
      return null;
    }
    else if (status === 'authenticated') {
    // Funktion för att söka igenom ett objekt och dess underobjekt för att hitta en egenskap med ett visst namn
    function findPropertyInObject(object, propertyName) {
      if (!object || typeof object !== 'object') {
        return null;
      }
  
      if (object.hasOwnProperty(propertyName)) {
        return object[propertyName];
      }
  
      for (let key in object) {
        let result = findPropertyInObject(object[key], propertyName);
        if (result) {
          return result;
        }
      }
  
      return null;
    }
  
    // Använd findPropertyInObject för att hitta 'sub' i session-objektet
    const userId = findPropertyInObject(session, 'sub');
  
    // Returnera userId, eller null om det inte hittades
    return userId || null;
}
  }