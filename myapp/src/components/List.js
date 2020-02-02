import React, {useState} from 'react'

export function List(){
    const token = sessionStorage.getItem("auth_token")
    const [list, setList] = useState([])

    async function getList(){
        fetch('https://localhost:44374/api/login/Users', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        // Data Retrieved.
        .then((data) => {
          setList(data)
        })
    }

    return <><button onClick={getList}>Get List</button>{list.map((item) => {return <p key={item.email}>{item.email}</p>})}</>
}