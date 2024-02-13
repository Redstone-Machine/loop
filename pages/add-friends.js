import React from 'react';
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import useSWR from 'swr'
import Link from 'next/link'

async function fetcher(url) {
    const res = await fetch(url)
    return res.json()
  }


const AddFriends = () => {
    const { data: session, status } = useSession() 
    const { data: users, error } = useSWR('/api/getUsers', fetcher)



    return (
        <>
  
              <h1>Welcome to Loop</h1>

              
  
              {users && session?.token.sub
              ? users
                .filter(user => user.id !== session.token.sub)
                .map(user => (
                  <div key={user.id}>
                    <Link href={`/chat/${user.id}`}>
                      {user.name}
                    </Link>
                  </div>
              ))
              : <div>Loading... users</div>
              }
  
      </>
      );
};

export default AddFriends;