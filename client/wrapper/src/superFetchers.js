import baseUrl from "./base_url";

const getDefaultPagenation = () => {
  return {
    query: "",
    search_by: "username",
    page: 0,
    page_size: 10,
    sort_by: "id",
    asc_order: true,
    ignore_pagination: false,
  };
};

export async function cheatToken(){
    let data = await fetch(`${baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa('username:password'),
            'Content-Type': 'application/x-www-form-urlencoded'
            // 'Content-Type': 'application/json',
        },
        body:
            `username=root&password=root`
    })
        .then(response => response.json())
        .then((data) => {return data})
        .catch((error) => {
            console.error('Error:', error);
        });

    return data;
}

export async function handleDelete() {
    const result = [];
  const token = await cheatToken().access_token
  console.log(token);
  await fetch(`${baseUrl}/user/user`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      result.push(data)
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return result[0];
}

export function createUser(email, password, name, surname, description) {
  fetch(`${baseUrl}/user/create`, {
    method: "POST",
    headers: {
        
      "Content-Type": "application/json",
      // 'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: `${email}`,
      hashed_password: `${password}`,
      name: `${name}`,
      surname: `${surname}`,
      description: `${description}`,
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function createTree(lat, lng, treename, age, crownRadius, fn_to_apply) {
    console.log('getting cheats')
    const cheats = await cheatToken()
    console.log('cheats')
    console.log(cheats)
    console.log(`${baseUrl}/tree/create`)
    const my_token = cheats.access_token
    console.log(my_token)
    console.log(crownRadius)
    console.log(parseInt(cheats.user.id))
    await fetch(`${baseUrl}/tree/create`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + my_token,
        "Content-Type": "application/json",
        // 'Content-Type': 'application/json',
      },
    
      body: JSON.stringify({
        location_lat: lat,
        location_lon: lng,
        core_radius: crownRadius,
        creation_year: age,
        plant_type: `${treename}`,
        creator_id: parseInt(cheats.user.id)
      }),
    })
      .then((response) => response.json())
      .then((data) => {fn_to_apply(data)})
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  export async function deleteTree(id) {
      const cheats = await cheatToken()
      fetch(`${baseUrl}/tree/delete`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + cheats.access_token,
          "Content-Type": "application/json",
          // 'Content-Type': 'application/json',
        },
      
        body: JSON.stringify({
          tree_id: id
        }),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error:", error);
        });
    }

export async function handleMe() {
  const token = (await cheatToken()).access_token
  console.log(token);
  fetch(`${baseUrl}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function getMarkers(lat, lng, radius, fn_to_apply) {
  const pagenation = getDefaultPagenation();
  pagenation["ignore_pagination"] = true;
  const geo = {
    location_lat: lat,
    location_lon: lng,
    search_radius: radius,
  };
  const my_url = `${baseUrl}/tree/search`
    console.log('wtf')
    console.log(my_url)
  fetch(my_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        "paginated_search": pagenation,
        "tree_search": geo,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      fn_to_apply(data)
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
